import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';


const { Pool } = pg;

export const appState = {
  roles: [
    { id: 1, name: 'Admin', description: 'Full access to all modules and user management' },
    { id: 2, name: 'Operations Team', description: 'Manage clients and lifecycle updates' },
    { id: 3, name: 'Manager', description: 'Dashboard and reporting access' },
    { id: 4, name: 'Viewer', description: 'Read-only access' },
  ],
  users: [
    { id: 1, email: 'admin@enterprise.com', password: 'Password123!', firstName: 'System', lastName: 'Admin', isActive: true, roles: ['Admin'] },
    { id: 2, email: 's.chen@enterprise.com', password: 'Password123!', firstName: 'Sarah', lastName: 'Chen', isActive: true, roles: ['Manager'] },
    { id: 3, email: 'j.rodriguez@enterprise.com', password: 'Password123!', firstName: 'James', lastName: 'Rodriguez', isActive: true, roles: ['Operations Team'] },
    { id: 4, email: 'p.sharma@enterprise.com', password: 'Password123!', firstName: 'Priya', lastName: 'Sharma', isActive: true, roles: ['Operations Team'] },
    { id: 5, email: 'm.park@enterprise.com', password: 'Password123!', firstName: 'Michael', lastName: 'Park', isActive: true, roles: ['Manager'] },
    { id: 6, email: 'l.wang@enterprise.com', password: 'Password123!', firstName: 'Lisa', lastName: 'Wang', isActive: true, roles: ['Operations Team'] },
    { id: 7, email: 'viewer@enterprise.com', password: 'Password123!', firstName: 'David', lastName: 'Kumar', isActive: true, roles: ['Viewer'] },
  ],
  services: [
    { id: 1, name: 'Azure' },
    { id: 2, name: 'AWS' },
    { id: 3, name: 'GCP' },
    { id: 4, name: 'IaaS' },
    { id: 5, name: 'PaaS' },
    { id: 6, name: 'SaaS' },
    { id: 7, name: 'Security' },
    { id: 8, name: 'DevOps' },
    { id: 9, name: 'Migration' },
    { id: 10, name: 'Managed Services' },
    { id: 11, name: 'FinOps' },
    { id: 12, name: 'Backup and Disaster Recovery' },
  ],
  clients: [
    { id: 1, clientId: 'CLT-001', clientName: 'Northgate Technologies', accountManager: 'Sarah Chen', region: 'North America', industry: 'Financial Services', revenue: 2400000, currentStatus: 'Onboarded', services: ['Azure', 'DevOps', 'Security'], createdAt: '2024-01-15', updatedAt: '2025-08-10', plannedOnboardDate: '2024-01-15', actualOnboardDate: '2024-01-18', plannedOffboardDate: '2026-01-15', actualOffboardDate: null, contractStartDate: '2024-01-18', contractEndDate: '2026-01-17', remarks: 'Strategic cloud modernization' },
    { id: 2, clientId: 'CLT-002', clientName: 'Meridian Healthcare', accountManager: 'James Rodriguez', region: 'Europe', industry: 'Healthcare', revenue: 1800000, currentStatus: 'Onboarded', services: ['AWS', 'Managed Services', 'Backup and Disaster Recovery'], createdAt: '2024-02-01', updatedAt: '2025-08-09', plannedOnboardDate: '2024-02-01', actualOnboardDate: '2024-02-03', plannedOffboardDate: '2026-02-01', actualOffboardDate: null, contractStartDate: '2024-02-03', contractEndDate: '2026-02-02', remarks: 'HIPAA-aligned environment' },
    { id: 3, clientId: 'CLT-003', clientName: 'Stratos Logistics', accountManager: 'Priya Sharma', region: 'APAC', industry: 'Logistics', revenue: 950000, currentStatus: 'Pending Onboarding', services: ['GCP', 'PaaS', 'FinOps'], createdAt: '2025-08-12', updatedAt: '2025-08-12', plannedOnboardDate: '2025-09-01', actualOnboardDate: null, plannedOffboardDate: '2027-09-01', actualOffboardDate: null, contractStartDate: '2025-09-01', contractEndDate: '2027-09-01', remarks: 'New regional expansion' },
    { id: 4, clientId: 'CLT-004', clientName: 'Vortex Capital', accountManager: 'Michael Park', region: 'North America', industry: 'Financial Services', revenue: 3100000, currentStatus: 'Offboarding Scheduled', services: ['Azure', 'FinOps', 'Security'], createdAt: '2023-03-10', updatedAt: '2025-08-11', plannedOnboardDate: '2023-03-10', actualOnboardDate: '2023-03-12', plannedOffboardDate: '2025-09-30', actualOffboardDate: null, contractStartDate: '2023-03-12', contractEndDate: '2025-09-30', remarks: 'Contract renewal review in progress' },
    { id: 5, clientId: 'CLT-005', clientName: 'PineLock Insurance', accountManager: 'Sarah Chen', region: 'Europe', industry: 'Insurance', revenue: 0, currentStatus: 'Offboarded', services: ['AWS', 'IaaS'], createdAt: '2022-06-01', updatedAt: '2025-01-02', plannedOnboardDate: '2022-06-01', actualOnboardDate: '2022-06-05', plannedOffboardDate: '2024-12-31', actualOffboardDate: '2024-12-31', contractStartDate: '2022-06-05', contractEndDate: '2024-12-31', remarks: 'Closed after contract expiry' },
    { id: 6, clientId: 'CLT-006', clientName: 'Axon Retail Group', accountManager: 'Lisa Wang', region: 'APAC', industry: 'Retail', revenue: 720000, currentStatus: 'Onboarded', services: ['GCP', 'SaaS', 'Migration'], createdAt: '2024-05-10', updatedAt: '2025-08-08', plannedOnboardDate: '2024-05-10', actualOnboardDate: '2024-05-14', plannedOffboardDate: '2026-05-10', actualOffboardDate: null, contractStartDate: '2024-05-14', contractEndDate: '2026-05-10', remarks: 'Digital storefront migration' },
    { id: 7, clientId: 'CLT-007', clientName: 'Cascade Energy', accountManager: 'James Rodriguez', region: 'Middle East', industry: 'Energy', revenue: 4200000, currentStatus: 'Onboarded', services: ['Azure', 'IaaS', 'Managed Services', 'Security'], createdAt: '2024-04-01', updatedAt: '2025-08-07', plannedOnboardDate: '2024-04-01', actualOnboardDate: '2024-04-03', plannedOffboardDate: '2026-04-01', actualOffboardDate: null, contractStartDate: '2024-04-03', contractEndDate: '2026-04-01', remarks: 'Infrastructure optimization remains active' },
    { id: 8, clientId: 'CLT-008', clientName: 'BrightPath Education', accountManager: 'Priya Sharma', region: 'North America', industry: 'Education', revenue: 480000, currentStatus: 'Pending Onboarding', services: ['AWS', 'SaaS'], createdAt: '2025-08-13', updatedAt: '2025-08-13', plannedOnboardDate: '2025-09-15', actualOnboardDate: null, plannedOffboardDate: '2027-09-15', actualOffboardDate: null, contractStartDate: '2025-09-15', contractEndDate: '2027-09-15', remarks: 'New SaaS rollout' },
    { id: 9, clientId: 'CLT-009', clientName: 'Summit Manufacturing', accountManager: 'Michael Park', region: 'Europe', industry: 'Manufacturing', revenue: 1650000, currentStatus: 'Onboarded', services: ['Azure', 'DevOps', 'PaaS'], createdAt: '2023-11-01', updatedAt: '2025-08-06', plannedOnboardDate: '2023-11-01', actualOnboardDate: '2023-11-05', plannedOffboardDate: '2025-11-01', actualOffboardDate: null, contractStartDate: '2023-11-05', contractEndDate: '2025-11-01', remarks: 'High throughput environment' },
    { id: 10, clientId: 'CLT-010', clientName: 'Orion Telecom', accountManager: 'Lisa Wang', region: 'APAC', industry: 'Telecommunications', revenue: 5800000, currentStatus: 'Onboarded', services: ['GCP', 'Azure', 'FinOps', 'Security', 'Migration'], createdAt: '2024-07-01', updatedAt: '2025-08-05', plannedOnboardDate: '2024-07-01', actualOnboardDate: '2024-07-02', plannedOffboardDate: '2026-07-01', actualOffboardDate: null, contractStartDate: '2024-07-02', contractEndDate: '2026-07-01', remarks: 'Multi-cloud mobile platform' },
  ],
  statusHistory: [
    { id: 1, clientId: 'CLT-004', previousStatus: 'Onboarded', newStatus: 'Offboarding Scheduled', changedBy: 's.chen@enterprise.com', changedAt: '2025-08-13T14:32:11.000Z' },
    { id: 2, clientId: 'CLT-003', previousStatus: '—', newStatus: 'Pending Onboarding', changedBy: 'p.sharma@enterprise.com', changedAt: '2025-08-12T09:44:22.000Z' },
  ],
  
  auditLogs: [
    { id: 1, userEmail: 's.chen@enterprise.com', action: 'Client Updated', oldValue: 'Onboarded', newValue: 'Offboarding Scheduled', createdAt: '2025-08-13T14:32:11.000Z' },
    { id: 2, userEmail: 'system', action: 'Excel Imported', oldValue: '—', newValue: '14 records imported', createdAt: '2025-08-13T12:15:00.000Z' },
  ],
  excelImportLogs: [
    { id: 1, fileName: 'bulk_clients_aug.xlsx', totalProcessed: 14, imported: 12, updated: 2, duplicates: 1, failed: 1, createdAt: '2025-08-13T12:15:00.000Z' },
  ],
};

let pool = null;

const databaseUrl = process.env.DATABASE_URL?.trim();

// function describeDatabaseUrl(value) {
//   if (!value) return 'DATABASE_URL is not set';

//   try {
//     const parsedUrl = new URL(value);
//     return `DATABASE_URL read: yes (protocol=${parsedUrl.protocol}, host=${parsedUrl.hostname}, port=${parsedUrl.port || 'default'}, database=${parsedUrl.pathname.slice(1) || 'default'}, user=${decodeURIComponent(parsedUrl.username) || 'default'}, password=${parsedUrl.password ? 'set' : 'not set'})`;
//   } catch {
//     return 'DATABASE_URL read: yes, but it is not a valid database URL';
//   }
// }


console.log(JSON.stringify(process.env.DATABASE_URL));
// console.log(describeDatabaseUrl(databaseUrl));
console.log('DATABASE_URL =>', process.env.DATABASE_URL);

if (databaseUrl) {
  pool = new Pool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
}

const importSchemaSql = fs.readFileSync(path.join(process.cwd(), 'server', 'schema.sql'), 'utf8');

export async function initializeDatabase() {
  if (!pool) {
    console.warn('Database connection skipped; using in-memory data because DATABASE_URL is unavailable.');
    return { source: 'memory', initialized: true };
  }

  try {
    await pool.query(importSchemaSql);
    const passwordHash = await hashPassword('Password123!');

    for (const user of appState.users) {
      const userResult = await pool.query(`
        INSERT INTO users (email, password_hash, first_name, last_name, is_active)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `, [user.email, passwordHash, user.firstName, user.lastName, user.isActive]);

      const userId = userResult.rows[0]?.id ?? (await pool.query(
        'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
        [user.email],
      )).rows[0]?.id;

      for (const roleName of user.roles) {
        const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [roleName]);
        if (userId && roleResult.rows[0]?.id) {
          await pool.query(`
            INSERT INTO user_roles (user_id, role_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, role_id) DO NOTHING
          `, [userId, roleResult.rows[0].id]);
        }
      }
    }

    for (const client of appState.clients) {
      const clientResult = await pool.query(`
        INSERT INTO clients (client_id, client_name, account_manager, region, industry, revenue, current_status, remarks, created_at, updated_at, planned_onboard_date, actual_onboard_date, planned_offboard_date, actual_offboard_date, contract_start_date, contract_end_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (client_id) DO NOTHING
        RETURNING id
      `, [client.clientId, client.clientName, client.accountManager, client.region, client.industry, client.revenue, client.currentStatus, client.remarks || '', client.createdAt, client.updatedAt, client.plannedOnboardDate, client.actualOnboardDate, client.plannedOffboardDate, client.actualOffboardDate, client.contractStartDate, client.contractEndDate]);
      const clientId = clientResult.rows[0]?.id ?? (await pool.query('SELECT id FROM clients WHERE client_id = $1', [client.clientId])).rows[0]?.id;
      if (!clientId) continue;
      for (const serviceName of client.services || []) {
        const serviceResult = await pool.query('INSERT INTO services (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id', [serviceName]);
        await pool.query('INSERT INTO client_services (client_id, service_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [clientId, serviceResult.rows[0].id]);
      }
    }

    console.log('Database connection successful; PostgreSQL schema is ready.');
    return { source: 'postgres', initialized: true };
  } catch (error) {
    await pool.end().catch(() => {});
    pool = null;
    console.warn(
      `Database connection failed (${error.code || 'unknown'}): ${error.message || 'Unable to connect to PostgreSQL.'}`,
    );
    return { source: 'memory', initialized: true, fallback: true };
  }
}

export function getPool() {
  return pool;
}

export function getState() {
  return appState;
}

export async function getUserByEmail(email) {
  const value = email?.trim().toLowerCase();
  if (!value) return null;

  if (pool) {
    const result = await pool.query(`
      SELECT
        u.id,
        u.email,
        u.password_hash,
        u.first_name,
        u.last_name,
        u.is_active,
        COALESCE(array_agg(r.name) FILTER (WHERE r.name IS NOT NULL), '{}') AS roles
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE LOWER(u.email) = $1
      GROUP BY u.id
    `, [value]);

    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      password: row.password_hash,
      firstName: row.first_name,
      lastName: row.last_name,
      isActive: row.is_active,
      roles: row.roles,
    };
  }

  return appState.users.find((user) => user.email.toLowerCase() === value) ?? null;
}

export function getUserProfile(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles,
    isActive: user.isActive,
  };
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function createAuditEntry(userEmail, action, oldValue, newValue) {
  const entry = {
    id: Date.now(),
    userEmail,
    action,
    oldValue: oldValue ?? '—',
    newValue: newValue ?? '—',
    createdAt: new Date().toISOString(),
  };
  appState.auditLogs.unshift(entry);
  if (pool) {
    pool.query('INSERT INTO audit_logs (user_email, action, old_value, new_value) VALUES ($1, $2, $3, $4)', [userEmail, action, oldValue ?? '—', newValue ?? '—']).catch(() => undefined);
  }
}

export function createStatusHistory(clientId, previousStatus, newStatus, changedBy) {
  appState.statusHistory.unshift({
    id: Date.now(),
    clientId,
    previousStatus,
    newStatus,
    changedBy,
    changedAt: new Date().toISOString(),
  });
}

export function createImportLog(payload) {
  appState.excelImportLogs.unshift({
    id: Date.now(),
    fileName: payload.fileName,
    totalProcessed: payload.totalProcessed,
    imported: payload.imported,
    updated: payload.updated,
    duplicates: payload.duplicates,
    failed: payload.failed,
    createdAt: new Date().toISOString(),
  });
}
