import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, Users, UserPlus, UserMinus, Server, BarChart3,
  FileText, Settings, HelpCircle, Bell, Search, Moon, Sun,
  ChevronLeft, ChevronRight, LogOut, ChevronDown, Upload,
  ClipboardList, Shield, Menu, X
} from "lucide-react";

export type Page =
  | "dashboard" | "clients" | "onboarding" | "offboarding"
  | "services" | "analytics" | "reports" | "excel" | "audit" | "admin" | "help" | "project";

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clients", label: "Clients", icon: Users },
  { id: "onboarding", label: "Onboarding", icon: UserPlus },
  { id: "offboarding", label: "Offboarding", icon: UserMinus },
  { id: "services", label: "Services", icon: Server },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "excel", label: "Excel Import", icon: Upload },
  { id: "audit", label: "Audit Logs", icon: ClipboardList },
  { id: "admin", label: "Admin", icon: Shield },
  { id: "help", label: "Help", icon: HelpCircle },
];

interface ShellProps {
  page: Page;
  onPageChange: (p: Page) => void;
  onLogout: () => void;
  dark: boolean;
  user?: { firstName: string; lastName: string; email: string; roles: string[] };
  onToggleDark: () => void;
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

export default function Shell({ page, onPageChange, onLogout, dark, user, onToggleDark, children, onSearch }: ShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const bg = dark ? "#0F172A" : "#FFFFFF";
  const sidebarBg = dark ? "#1E293B" : "#FFFFFF";
  const borderColor = dark ? "#334155" : "#E2E8F0";
  const textMuted = dark ? "#94A3B8" : "#64748B";
  const textBody = dark ? "#E2E8F0" : "#0F172A";
  const pageBg = dark ? "#0F172A" : "#F1F5F9";

  const notifications = [
    { id: 1, text: "Stratos Logistics onboarding due in 3 days", type: "warning", time: "2h ago" },
    { id: 2, text: "Excel import #112 completed — 14 records", type: "success", time: "4h ago" },
    { id: 3, text: "Vortex Capital offboarding scheduled for Sep 30", type: "info", time: "1d ago" },
    { id: 4, text: "Monthly KPI report is ready for download", type: "info", time: "2d ago" },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: pageBg, color: textBody, fontFamily: "var(--font-sans)" }}>
      {/* Top Nav */}
      <header className="flex items-center h-14 px-4 gap-4 flex-shrink-0 border-b z-30" style={{ background: bg, borderColor }}>
        <button className="lg:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          <img src="/CloudOrbix.png" alt="CloudOrbix" className="h-7 w-7 object-contain" />
          {!collapsed && <span className="font-bold text-sm hidden lg:block" style={{ color: "#1E40AF" }}>CloudOrbix</span>}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: textMuted }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); onSearch?.(e.target.value); }}
            placeholder="Search clients, reports, actions…"
            className="w-full pl-9 pr-4 py-1.5 rounded-lg text-xs border outline-none"
            style={{ background: dark ? "#1E293B" : "#F8FAFC", borderColor, color: textBody }}
          />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          {/* Dark mode */}
          <button onClick={onToggleDark} className="p-2 rounded-lg hover:bg-slate-100 transition-colors" style={{ color: textMuted }}>
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors" style={{ color: textMuted }}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-10 w-80 rounded-xl shadow-xl border z-50 overflow-hidden" style={{ background: bg, borderColor }}>
                <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor }}>
                  <span className="font-semibold text-sm">Notifications</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">4 new</span>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className="px-4 py-3 border-b hover:bg-slate-50 cursor-pointer" style={{ borderColor }}>
                    <div className="text-xs font-medium mb-0.5" style={{ color: textBody }}>{n.text}</div>
                    <div className="text-xs" style={{ color: textMuted }}>{n.time}</div>
                  </div>
                ))}
                <div className="px-4 py-2 text-center">
                  <button className="text-xs font-medium" style={{ color: "#1E40AF" }}>View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#1E40AF" }}>SC</div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold" style={{ color: textBody }}>{user ? `${user.firstName} ${user.lastName}` : "Sarah Chen"}</div>
                <div className="text-[10px]" style={{ color: textMuted }}>{user ? user.roles[0] : "Account Manager"}</div>
              </div>
              <ChevronDown className="w-3 h-3" style={{ color: textMuted }} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-11 w-48 rounded-xl shadow-xl border z-50 overflow-hidden" style={{ background: bg, borderColor }}>
                <div className="p-3 border-b" style={{ borderColor }}>
                  <div className="text-xs font-semibold" style={{ color: textBody }}>{user ? `${user.firstName} ${user.lastName}` : "Sarah Chen"}</div>
                  <div className="text-[10px]" style={{ color: textMuted }}>{user ? user.email : "s.chen@enterprise.com"}</div>
                </div>
                <button onClick={() => { onPageChange("admin"); setProfileOpen(false); }} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center gap-2" style={{ color: textBody }}>
                  <Settings className="w-3.5 h-3.5" /> Settings
                </button>
                <button onClick={onLogout} className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 flex items-center gap-2 text-red-600">
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`flex-shrink-0 flex flex-col border-r transition-all duration-200 z-20 ${mobileOpen ? "fixed inset-y-0 left-0 top-14 w-56" : "hidden lg:flex"} ${collapsed ? "lg:w-14" : "lg:w-52"}`}
          style={{ background: sidebarBg, borderColor }}
        >
          <div className="flex-1 py-3 overflow-y-auto">
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = page === id;
              return (
                <button
                  key={id}
                  onClick={() => { onPageChange(id); setMobileOpen(false); }}
                  title={collapsed ? label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 mx-1.5 rounded-lg text-xs font-medium transition-all mb-0.5 ${collapsed ? "justify-center" : ""}`}
                  style={{
                    width: "calc(100% - 12px)",
                    background: active ? "#EFF6FF" : "transparent",
                    color: active ? "#1E40AF" : textMuted,
                  }}
                  onMouseOver={e => { if (!active) (e.currentTarget as HTMLElement).style.background = dark ? "#1E293B" : "#F8FAFC"; }}
                  onMouseOut={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span>{label}</span>}
                  {!collapsed && active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#1E40AF" }} />}
                </button>
              );
            })}
          </div>

          {/* Collapse toggle */}
          <div className="p-2 border-t" style={{ borderColor }}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 transition-colors"
              style={{ color: textMuted }}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto" style={{ background: pageBg }}>
          {children}
         
        </main>
      </div>
    </div>
  );
}
