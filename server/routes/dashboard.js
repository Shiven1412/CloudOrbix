import express from 'express';
import { appState, getPool } from '../db.js';
import { protectRoute } from '../middleware/auth.js';

const router = express.Router();
const colors = ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];

router.get('/', protectRoute, async (req, res, next) => {
  try {
    const pool = getPool();
    if (!pool) return res.json({ summary: { totalClients: appState.clients.length, activeClients: appState.clients.filter((item) => item.currentStatus === 'Onboarded').length, pendingOnboarding: appState.clients.filter((item) => item.currentStatus === 'Pending Onboarding').length, offboardingScheduled: appState.clients.filter((item) => item.currentStatus === 'Offboarding Scheduled').length, offboardedClients: appState.clients.filter((item) => item.currentStatus === 'Offboarded').length, azureClients: 0, awsClients: 0, monthlyRevenue: 0, annualRevenue: 0, netClientGrowth: 0 }, onboardingTrend: [], revenueTrend: [], serviceAdoption: [], regionData: [], upcomingActivities: [] });
    const [summaryResult, onboardingResult, revenueResult, servicesResult, regionsResult, upcomingResult] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int total_clients, COUNT(*) FILTER (WHERE current_status='Onboarded')::int active_clients, COUNT(*) FILTER (WHERE current_status='Pending Onboarding')::int pending_onboarding, COUNT(*) FILTER (WHERE current_status='Offboarding Scheduled')::int offboarding_scheduled, COUNT(*) FILTER (WHERE current_status='Offboarded')::int offboarded_clients, COALESCE(SUM(revenue),0)::numeric total_revenue FROM clients`),
      pool.query(`SELECT TO_CHAR(COALESCE(actual_onboard_date, planned_onboard_date), 'Mon') AS "month", COUNT(*) FILTER (WHERE current_status IN ('Onboarded','Pending Onboarding'))::int AS onboarded, COUNT(*) FILTER (WHERE current_status IN ('Offboarding Scheduled','Offboarded'))::int AS offboarded FROM clients WHERE COALESCE(actual_onboard_date, planned_onboard_date) IS NOT NULL GROUP BY TO_CHAR(COALESCE(actual_onboard_date, planned_onboard_date), 'Mon'), EXTRACT(MONTH FROM COALESCE(actual_onboard_date, planned_onboard_date)) ORDER BY EXTRACT(MONTH FROM COALESCE(actual_onboard_date, planned_onboard_date))`),
      pool.query(`SELECT TO_CHAR(COALESCE(actual_start_date, estimated_start_date, created_at::date), 'Mon') AS "month", ROUND(SUM(revenue)::numeric / 1000000, 2) AS revenue FROM clients GROUP BY TO_CHAR(COALESCE(actual_start_date, estimated_start_date, created_at::date), 'Mon'), EXTRACT(MONTH FROM COALESCE(actual_start_date, estimated_start_date, created_at::date)) ORDER BY EXTRACT(MONTH FROM COALESCE(actual_start_date, estimated_start_date, created_at::date))`),
      pool.query(`SELECT s.name, COUNT(DISTINCT cs.client_id)::int clients, ROUND(COALESCE(SUM(c.revenue),0)::numeric / 1000000, 2) revenue FROM services s LEFT JOIN client_services cs ON cs.service_id=s.id LEFT JOIN clients c ON c.id=cs.client_id GROUP BY s.id,s.name ORDER BY clients DESC`),
      pool.query(`SELECT COALESCE(region,'Unassigned') region, COUNT(*)::int clients, ROUND(SUM(revenue)::numeric / 1000000, 2) revenue FROM clients GROUP BY region ORDER BY clients DESC`),
      pool.query(`SELECT client_id client, client_name, COALESCE(estimated_start_date, planned_onboard_date) date, project_manager manager, 'onboarding' type FROM clients WHERE COALESCE(estimated_start_date, planned_onboard_date) >= CURRENT_DATE UNION ALL SELECT client_id, client_name, COALESCE(estimated_end_date, planned_offboard_date), project_manager, 'offboarding' FROM clients WHERE COALESCE(estimated_end_date, planned_offboard_date) >= CURRENT_DATE ORDER BY date LIMIT 8`),
    ]);
    const summary = summaryResult.rows[0];
    return res.json({ summary: { totalClients: summary.total_clients, activeClients: summary.active_clients, pendingOnboarding: summary.pending_onboarding, offboardingScheduled: summary.offboarding_scheduled, offboardedClients: summary.offboarded_clients, azureClients: servicesResult.rows.find((item) => item.name === 'Azure')?.clients || 0, awsClients: servicesResult.rows.find((item) => item.name === 'AWS')?.clients || 0, monthlyRevenue: Number((Number(summary.total_revenue) / 1000000).toFixed(1)), annualRevenue: Number((Number(summary.total_revenue) / 1000000 * 12).toFixed(1)), netClientGrowth: summary.active_clients - summary.offboarded_clients }, onboardingTrend: onboardingResult.rows, revenueTrend: revenueResult.rows, serviceAdoption: servicesResult.rows, regionData: regionsResult.rows.map((item, index) => ({ ...item, color: colors[index % colors.length] })), upcomingActivities: upcomingResult.rows });
  } catch (error) { return next(error); }
});

export default router;
