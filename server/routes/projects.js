import express from 'express';
import multer from 'multer';
import { BlobServiceClient } from '@azure/storage-blob';
import { getPool } from '../db.js';
import { protectRoute } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });
const canManage = (project, user) => {
  const projectManager = project.project_manager || project.account_manager;
  return user.roles.includes('Admin') || projectManager === `${user.firstName} ${user.lastName}` || projectManager === user.email;
};

async function projectFor(clientId) {
  const pool = getPool();
  const result = await pool.query(`SELECT c.*, COALESCE(AVG(t.progress), c.completion, 0) project_progress FROM clients c LEFT JOIN project_tasks t ON t.client_id = c.id WHERE c.client_id = $1 GROUP BY c.id`, [clientId]);
  return result.rows[0] || null;
}

async function syncCompletion(clientDbId) {
  const pool = getPool();
  const result = await pool.query('SELECT COALESCE(AVG(progress), 0) completion FROM project_tasks WHERE client_id = $1', [clientDbId]);
  const completion = Number(result.rows[0]?.completion || 0);
  await pool.query('UPDATE clients SET completion = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [completion, clientDbId]);
  return completion;
}

router.get('/:clientId', protectRoute, async (req, res, next) => {
  try {
    const project = await projectFor(req.params.clientId);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!canManage(project, req.user)) return res.status(403).json({ message: 'Only the project manager or an administrator can access this project.' });
    const pool = getPool();
    const [tasks, documents] = await Promise.all([
      pool.query('SELECT * FROM project_tasks WHERE client_id = $1 ORDER BY expected_start_date NULLS LAST, id', [project.id]),
      pool.query('SELECT id,file_name,blob_name,blob_url,content_type,uploaded_by,created_at FROM project_documents WHERE client_id = $1 ORDER BY created_at DESC', [project.id]),
    ]);
    return res.json({ project, tasks: tasks.rows, documents: documents.rows });
  } catch (error) { return next(error); }
});

router.post('/:clientId/tasks', protectRoute, async (req, res, next) => {
  try {
    const project = await projectFor(req.params.clientId);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!canManage(project, req.user)) return res.status(403).json({ message: 'Project access denied.' });
    const body = req.body || {};
    if (!body.taskTitle) return res.status(400).json({ message: 'Task title is required.' });
    const result = await getPool().query(`INSERT INTO project_tasks(client_id,task_title,assigned_to,expected_start_date,expected_end_date,actual_start_date,actual_end_date,progress,status,remark) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`, [project.id, body.taskTitle, body.assignedTo || project.project_manager || project.account_manager || null, body.expectedStartDate || null, body.expectedEndDate || null, body.actualStartDate || null, body.actualEndDate || null, Number(body.progress || 0), body.status || 'Not Started', body.remark || null]);
    const completion = await syncCompletion(project.id);
    return res.status(201).json({ task: result.rows[0], completion });
  } catch (error) { return next(error); }
});

router.put('/:clientId/tasks/:taskId', protectRoute, async (req, res, next) => {
  try {
    const project = await projectFor(req.params.clientId);
    if (!project || !canManage(project, req.user)) return res.status(403).json({ message: 'Project access denied.' });
    const body = req.body || {};
    const result = await getPool().query(`UPDATE project_tasks SET task_title=COALESCE($1,task_title),assigned_to=COALESCE($2,assigned_to),expected_start_date=$3,expected_end_date=$4,actual_start_date=$5,actual_end_date=$6,progress=COALESCE($7,progress),status=COALESCE($8,status),remark=$9,updated_at=CURRENT_TIMESTAMP WHERE id=$10 AND client_id=$11 RETURNING *`, [body.taskTitle, body.assignedTo || project.project_manager || project.account_manager, body.expectedStartDate || null, body.expectedEndDate || null, body.actualStartDate || null, body.actualEndDate || null, body.progress === undefined ? null : Number(body.progress), body.status, body.remark || null, req.params.taskId, project.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Task not found.' });
    const completion = await syncCompletion(project.id);
    return res.json({ task: result.rows[0], completion });
  } catch (error) { return next(error); }
});

router.delete('/:clientId/tasks/:taskId', protectRoute, async (req, res, next) => {
  try {
    const project = await projectFor(req.params.clientId);
    if (!project || !canManage(project, req.user)) return res.status(403).json({ message: 'Project access denied.' });
    const result = await getPool().query('DELETE FROM project_tasks WHERE id = $1 AND client_id = $2 RETURNING id', [req.params.taskId, project.id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Task not found.' });
    const completion = await syncCompletion(project.id);
    return res.json({ deleted: true, completion });
  } catch (error) { return next(error); }
});

router.post('/:clientId/documents', protectRoute, upload.single('file'), async (req, res, next) => {
  try {
    const project = await projectFor(req.params.clientId);
    if (!project || !canManage(project, req.user)) return res.status(403).json({ message: 'Project access denied.' });
    if (!req.file) return res.status(400).json({ message: 'No document uploaded.' });
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connectionString) return res.status(503).json({ message: 'Azure document storage is not configured. Set AZURE_STORAGE_CONNECTION_STRING on the API server.' });
    const service = BlobServiceClient.fromConnectionString(connectionString);
    const container = service.getContainerClient(process.env.AZURE_STORAGE_CONTAINER || 'cloudorbix-project-documents');
    await container.createIfNotExists();
    const blobName = `${project.client_id}/${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const blob = container.getBlockBlobClient(blobName);
    await blob.uploadData(req.file.buffer, { blobHTTPHeaders: { blobContentType: req.file.mimetype } });
    const result = await getPool().query('INSERT INTO project_documents(client_id,file_name,blob_name,blob_url,content_type,uploaded_by) VALUES($1,$2,$3,$4,$5,$6) RETURNING *', [project.id, req.file.originalname, blobName, blob.url, req.file.mimetype, req.user.email]);
    return res.status(201).json({ document: result.rows[0] });
  } catch (error) { return next(error); }
});

export default router;
