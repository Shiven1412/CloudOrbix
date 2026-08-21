import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import roleRoutes from './routes/roles.js';
import clientRoutes from './routes/clients.js';
import dashboardRoutes from './routes/dashboard.js';
import excelRoutes from './routes/excel.js';
import auditRoutes from './routes/audit.js';
import reportRoutes from './routes/reports.js';
import projectRoutes from './routes/projects.js';
import serviceRoutes from './routes/services.js';
import { initializeDatabase } from './db.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'CloudOrbix API',
    message: 'CloudOrbix API is running. Use /api/* routes for the application data.',
    timestamp: new Date().toISOString(),
  });
});

app.get('/login', (req, res) => {
  res.json({
    ok: true,
    message: 'Use the CloudOrbix frontend login page or POST to /api/auth/login.',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'CloudOrbix API', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/excel', excelRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);

app.use((error, req, res, next) => {
  console.error('Unhandled API error:', error);
  res.status(500).json({ message: 'Internal server error.' });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`CloudOrbix API listening at http://localhost:${PORT}`);
      console.log(process.env.NODE_ENV === 'production' ? 'Running in production mode.' : 'Running in development mode.');
    });
  })
  .catch((error) => {
    console.error('API startup failed:', error);
    process.exit(1);
  });
