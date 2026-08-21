export const clients = [
  { id: "CLT-001", name: "Northgate Technologies", accountManager: "Sarah Chen", region: "North America", industry: "Financial Services", status: "Onboarded", plannedOnboard: "2024-01-15", actualOnboard: "2024-01-18", plannedOffboard: "2026-01-15", actualOffboard: null, revenue: 2400000, services: ["Azure", "DevOps", "Security"], lastUpdated: "2025-08-10" },
  { id: "CLT-002", name: "Meridian Healthcare", accountManager: "James Rodriguez", region: "Europe", industry: "Healthcare", status: "Onboarded", plannedOnboard: "2024-02-01", actualOnboard: "2024-02-03", plannedOffboard: "2026-02-01", actualOffboard: null, revenue: 1800000, services: ["AWS", "Managed Services", "Backup & DR"], lastUpdated: "2025-08-09" },
  { id: "CLT-003", name: "Stratos Logistics", accountManager: "Priya Sharma", region: "APAC", industry: "Logistics", status: "Pending Onboarding", plannedOnboard: "2025-09-01", actualOnboard: null, plannedOffboard: "2027-09-01", actualOffboard: null, revenue: 950000, services: ["GCP", "PaaS", "FinOps"], lastUpdated: "2025-08-12" },
  { id: "CLT-004", name: "Vortex Capital", accountManager: "Michael Park", region: "North America", industry: "Financial Services", status: "Offboarding Scheduled", plannedOnboard: "2023-03-10", actualOnboard: "2023-03-12", plannedOffboard: "2025-09-30", actualOffboard: null, revenue: 3100000, services: ["Azure", "FinOps", "Security"], lastUpdated: "2025-08-11" },
  { id: "CLT-005", name: "PineLock Insurance", accountManager: "Sarah Chen", region: "Europe", industry: "Insurance", status: "Offboarded", plannedOnboard: "2022-06-01", actualOnboard: "2022-06-05", plannedOffboard: "2024-12-31", actualOffboard: "2024-12-31", revenue: 0, services: ["AWS", "IaaS"], lastUpdated: "2025-01-02" },
  { id: "CLT-006", name: "Axon Retail Group", accountManager: "Lisa Wang", region: "APAC", industry: "Retail", status: "Onboarded", plannedOnboard: "2024-05-10", actualOnboard: "2024-05-14", plannedOffboard: "2026-05-10", actualOffboard: null, revenue: 720000, services: ["GCP", "SaaS", "Migration"], lastUpdated: "2025-08-08" },
  { id: "CLT-007", name: "Cascade Energy", accountManager: "James Rodriguez", region: "Middle East", industry: "Energy", status: "Onboarded", plannedOnboard: "2024-04-01", actualOnboard: "2024-04-03", plannedOffboard: "2026-04-01", actualOffboard: null, revenue: 4200000, services: ["Azure", "IaaS", "Managed Services", "Security"], lastUpdated: "2025-08-07" },
  { id: "CLT-008", name: "BrightPath Education", accountManager: "Priya Sharma", region: "North America", industry: "Education", status: "Pending Onboarding", plannedOnboard: "2025-09-15", actualOnboard: null, plannedOffboard: "2027-09-15", actualOffboard: null, revenue: 480000, services: ["AWS", "SaaS"], lastUpdated: "2025-08-13" },
  { id: "CLT-009", name: "Summit Manufacturing", accountManager: "Michael Park", region: "Europe", industry: "Manufacturing", status: "Onboarded", plannedOnboard: "2023-11-01", actualOnboard: "2023-11-05", plannedOffboard: "2025-11-01", actualOffboard: null, revenue: 1650000, services: ["Azure", "DevOps", "PaaS"], lastUpdated: "2025-08-06" },
  { id: "CLT-010", name: "Orion Telecom", accountManager: "Lisa Wang", region: "APAC", industry: "Telecommunications", status: "Onboarded", plannedOnboard: "2024-07-01", actualOnboard: "2024-07-02", plannedOffboard: "2026-07-01", actualOffboard: null, revenue: 5800000, services: ["GCP", "Azure", "FinOps", "Security", "Migration"], lastUpdated: "2025-08-05" },
];

export const onboardingTrend = [
  { month: "Jan", onboarded: 4, offboarded: 1 },
  { month: "Feb", onboarded: 6, offboarded: 2 },
  { month: "Mar", onboarded: 3, offboarded: 1 },
  { month: "Apr", onboarded: 8, offboarded: 3 },
  { month: "May", onboarded: 5, offboarded: 2 },
  { month: "Jun", onboarded: 7, offboarded: 1 },
  { month: "Jul", onboarded: 9, offboarded: 4 },
  { month: "Aug", onboarded: 6, offboarded: 2 },
  { month: "Sep", onboarded: 11, offboarded: 3 },
  { month: "Oct", onboarded: 8, offboarded: 2 },
  { month: "Nov", onboarded: 12, offboarded: 5 },
  { month: "Dec", onboarded: 10, offboarded: 3 },
];

export const revenueTrend = [
  { month: "Jan", revenue: 18.2 }, { month: "Feb", revenue: 19.5 },
  { month: "Mar", revenue: 18.8 }, { month: "Apr", revenue: 21.4 },
  { month: "May", revenue: 22.1 }, { month: "Jun", revenue: 24.6 },
  { month: "Jul", revenue: 23.8 }, { month: "Aug", revenue: 25.9 },
  { month: "Sep", revenue: 27.3 }, { month: "Oct", revenue: 26.5 },
  { month: "Nov", revenue: 29.1 }, { month: "Dec", revenue: 31.4 },
];

export const serviceAdoption = [
  { name: "Azure", clients: 42, revenue: 12.4 },
  { name: "AWS", clients: 31, revenue: 8.7 },
  { name: "GCP", clients: 24, revenue: 6.2 },
  { name: "Security", clients: 38, revenue: 9.1 },
  { name: "DevOps", clients: 29, revenue: 5.8 },
  { name: "Managed", clients: 19, revenue: 7.3 },
  { name: "FinOps", clients: 22, revenue: 4.1 },
  { name: "Migration", clients: 15, revenue: 3.6 },
];

export const regionData = [
  { region: "North America", clients: 34, revenue: 42.1, color: "#1E40AF" },
  { region: "Europe", clients: 28, revenue: 31.5, color: "#3B82F6" },
  { region: "APAC", clients: 22, revenue: 18.7, color: "#60A5FA" },
  { region: "Middle East", clients: 12, revenue: 15.3, color: "#93C5FD" },
  { region: "LATAM", clients: 8, revenue: 6.4, color: "#BFDBFE" },
];

export const industryData = [
  { industry: "Financial Services", value: 22 },
  { industry: "Healthcare", value: 18 },
  { industry: "Manufacturing", value: 15 },
  { industry: "Retail", value: 12 },
  { industry: "Telecommunications", value: 10 },
  { industry: "Energy", value: 9 },
  { industry: "Education", value: 8 },
  { industry: "Logistics", value: 6 },
];

export const auditLogs = [
  { id: 1, user: "Sarah Chen", action: "Updated client status", entity: "Vortex Capital", timestamp: "2025-08-13 14:32:11", prev: "Onboarded", next: "Offboarding Scheduled", ip: "192.168.1.45", type: "Update" },
  { id: 2, user: "Admin System", action: "Excel import completed", entity: "Bulk Import #112", timestamp: "2025-08-13 12:15:00", prev: "—", next: "14 records imported", ip: "10.0.0.5", type: "Import" },
  { id: 3, user: "James Rodriguez", action: "Created new client", entity: "Cascade Energy", timestamp: "2025-08-12 09:44:22", prev: "—", next: "Pending Onboarding", ip: "192.168.1.72", type: "Create" },
  { id: 4, user: "Priya Sharma", action: "Downloaded report", entity: "Q2 Revenue Report", timestamp: "2025-08-12 08:30:05", prev: "—", next: "PDF Export", ip: "192.168.1.33", type: "Export" },
  { id: 5, user: "Michael Park", action: "Modified contract dates", entity: "Summit Manufacturing", timestamp: "2025-08-11 16:55:19", prev: "2025-10-31", next: "2025-11-01", ip: "192.168.1.91", type: "Update" },
  { id: 6, user: "Lisa Wang", action: "Added service mapping", entity: "Orion Telecom", timestamp: "2025-08-11 11:20:47", prev: "Azure, GCP", next: "Azure, GCP, FinOps", ip: "192.168.1.58", type: "Update" },
  { id: 7, user: "Sarah Chen", action: "Deleted draft record", entity: "Draft-CLT-044", timestamp: "2025-08-10 15:08:33", prev: "Draft", next: "Deleted", ip: "192.168.1.45", type: "Delete" },
  { id: 8, user: "Admin System", action: "Scheduled report sent", entity: "Monthly KPI Report", timestamp: "2025-08-01 06:00:01", prev: "—", next: "Email Dispatched", ip: "10.0.0.5", type: "Report" },
];

export const upcomingActivities = [
  { type: "onboarding", client: "Stratos Logistics", date: "2025-09-01", manager: "Priya Sharma", priority: "high" },
  { type: "onboarding", client: "BrightPath Education", date: "2025-09-15", manager: "Priya Sharma", priority: "medium" },
  { type: "offboarding", client: "Vortex Capital", date: "2025-09-30", manager: "Michael Park", priority: "high" },
  { type: "renewal", client: "Summit Manufacturing", date: "2025-11-01", manager: "Michael Park", priority: "medium" },
  { type: "renewal", client: "Meridian Healthcare", date: "2026-02-01", manager: "James Rodriguez", priority: "low" },
  { type: "expiry", client: "Axon Retail Group", date: "2026-05-10", manager: "Lisa Wang", priority: "low" },
];
