import { useEffect, useMemo, useState } from "react";
import { Shield, Users, Settings, Plus, Edit2, Trash2, Check, X, Eye, EyeOff, ToggleLeft, ToggleRight } from "lucide-react";

type UserStatus = "active" | "inactive";
type TabKey = "users" | "roles" | "permissions";

type UserRecord = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  lastLogin: string;
};

type ApiUser = {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  roles?: string[];
  isActive?: boolean;
};

type AdminProps = {
  dark: boolean;
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    isActive: boolean;
  };
};

const INITIAL_USERS: UserRecord[] = [
  { id: 1, name: "Sarah Chen", email: "s.chen@enterprise.com", role: "Account Manager", status: "active", lastLogin: "2025-08-13 14:32" },
  { id: 2, name: "James Rodriguez", email: "j.rodriguez@enterprise.com", role: "Account Manager", status: "active", lastLogin: "2025-08-13 11:05" },
  { id: 3, name: "Priya Sharma", email: "p.sharma@enterprise.com", role: "Account Manager", status: "active", lastLogin: "2025-08-12 09:44" },
  { id: 4, name: "Michael Park", email: "m.park@enterprise.com", role: "Manager", status: "active", lastLogin: "2025-08-11 16:55" },
  { id: 5, name: "Lisa Wang", email: "l.wang@enterprise.com", role: "Account Manager", status: "active", lastLogin: "2025-08-11 11:20" },
  { id: 6, name: "David Kumar", email: "d.kumar@enterprise.com", role: "Viewer", status: "inactive", lastLogin: "2025-07-30 08:00" },
  { id: 7, name: "System Admin", email: "admin@enterprise.com", role: "Admin", status: "active", lastLogin: "2025-08-13 06:00" },
];

const ROLES = [
  { name: "Admin", color: "#DC2626", bg: "#FEE2E2", users: 1, permissions: ["All access", "User management", "System config", "Audit access", "Export all data"] },
  { name: "Manager", color: "#7C3AED", bg: "#EDE9FE", users: 1, permissions: ["View all clients", "Approve onboarding", "Generate reports", "View analytics", "Export data"] },
  { name: "Operations Team", color: "#1E40AF", bg: "#DBEAFE", users: 3, permissions: ["Manage clients", "Update lifecycle", "Import/export", "View analytics", "Create reports"] },
  { name: "Viewer", color: "#64748B", bg: "#F1F5F9", users: 2, permissions: ["View clients", "View reports", "View analytics", "No edit access", "No export"] },
];

const PERMISSIONS = [
  { module: "Dashboard", admin: true, manager: true, ops: true, viewer: true },
  { module: "Client Management (Read)", admin: true, manager: true, ops: true, viewer: true },
  { module: "Client Management (Write)", admin: true, manager: true, ops: true, viewer: false },
  { module: "Client Management (Delete)", admin: true, manager: false, ops: false, viewer: false },
  { module: "Onboarding / Offboarding", admin: true, manager: true, ops: true, viewer: false },
  { module: "Analytics", admin: true, manager: true, ops: true, viewer: true },
  { module: "Reports (View)", admin: true, manager: true, ops: true, viewer: true },
  { module: "Reports (Generate)", admin: true, manager: true, ops: true, viewer: false },
  { module: "Excel Import/Export", admin: true, manager: true, ops: true, viewer: false },
  { module: "Audit Logs", admin: true, manager: true, ops: false, viewer: false },
  { module: "Admin Panel", admin: true, manager: false, ops: false, viewer: false },
];

export default function Admin({ dark }: AdminProps) {
  const [tab, setTab] = useState<TabKey>("users");
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<{ name: string; email: string; role: string; status: UserStatus; password: string }>({ name: "", email: "", role: "Account Manager", status: "active", password: "" });
  const [busy, setBusy] = useState(false);

  const bg = dark ? "#1E293B" : "#FFFFFF";
  const border = dark ? "#334155" : "#E2E8F0";
  const text = dark ? "#E2E8F0" : "#0F172A";
  const muted = dark ? "#94A3B8" : "#64748B";
  const subtle = dark ? "#0F172A" : "#F8FAFC";

  const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
    Admin: { bg: "#FEE2E2", text: "#DC2626" },
    Manager: { bg: "#EDE9FE", text: "#7C3AED" },
    "Account Manager": { bg: "#DBEAFE", text: "#1E40AF" },
    "Operations Team": { bg: "#DBEAFE", text: "#1E40AF" },
    Viewer: { bg: "#F1F5F9", text: "#64748B" },
  };

  const roles = useMemo<string[]>(() => ["Admin", "Manager", "Account Manager", "Viewer"], []);
  const tabs: TabKey[] = ["users", "roles", "permissions"];

  useEffect(() => {
    const token = localStorage.getItem("clmp-token");
    if (!token) return;

    fetch("/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Unable to load users"))))
      .then((payload: { users?: ApiUser[] }) => {
        if (Array.isArray(payload.users)) {
          setUsers(
            payload.users.map((user: ApiUser): UserRecord => ({
              id: user.id,
              name: user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
              email: user.email,
              role: Array.isArray(user.roles) ? user.roles[0] : "Viewer",
              status: user.isActive ? "active" : "inactive",
              lastLogin: "Just now",
            })),
          );
        }
      })
      .catch(() => {
        setUsers(INITIAL_USERS);
      });
  }, []);

  const openAddUser = () => {
    setEditingId(null);
    setDraft({ name: "", email: "", role: "Account Manager", status: "active", password: "" });
    setShowAdd(true);
  };

  const openEditUser = (user: UserRecord) => {
    setEditingId(user.id);
    setDraft({ name: user.name, email: user.email, role: user.role, status: user.status, password: "" });
    setShowAdd(true);
  };

  const saveUser = async () => {
    if (!draft.name.trim() || !draft.email.trim()) return;

    const token = localStorage.getItem("clmp-token");
    if (!token) return;

    const firstName = draft.name.trim().split(" ")[0] || draft.name.trim();
    const lastName = draft.name.trim().split(" ").slice(1).join(" ") || "User";
    const body = {
      firstName,
      lastName,
      email: draft.email.trim(),
      role: draft.role,
      isActive: draft.status === "active",
      ...(draft.password.trim() ? { password: draft.password.trim() } : {}),
    };

    setBusy(true);

    try {
      const response = await fetch(editingId !== null ? `/api/users/${editingId}` : "/api/users", {
        method: editingId !== null ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const payload: { message?: string; user?: ApiUser } = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "User save failed.");
      }

      const savedUser = payload.user || (payload as unknown as ApiUser);
      const formattedUser: UserRecord = {
        id: savedUser.id || Date.now(),
        name: savedUser.fullName || `${savedUser.firstName || firstName} ${savedUser.lastName || lastName}`.trim(),
        email: savedUser.email || body.email,
        role: savedUser.roles && savedUser.roles.length ? savedUser.roles[0] : draft.role,
        status: savedUser.isActive === false ? "inactive" : "active",
        lastLogin: "Just now",
      };

      setUsers((current) => {
        if (editingId !== null) {
          return current.map((user) => (user.id === editingId ? formattedUser : user));
        }
        return [formattedUser, ...current];
      });

      setShowAdd(false);
      setEditingId(null);
      setDraft({ name: "", email: "", role: "Account Manager", status: "active", password: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async (user: UserRecord) => {
    const token = localStorage.getItem("clmp-token");
    if (!token) return;
    const password = window.prompt(`Enter a new password for ${user.email}:`);
    if (!password?.trim()) return;
    const response = await fetch(`/api/users/${user.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ password: password.trim() }) });
    if (!response.ok) console.error("Password reset failed.");
  };

  const toggleStatus = async (id: number) => {
    const token = localStorage.getItem("clmp-token");
    if (!token) return;

    const currentUser = users.find((user) => user.id === id);
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: currentUser.name.split(" ")[0],
          lastName: currentUser.name.split(" ").slice(1).join(" ") || "User",
          email: currentUser.email,
          role: currentUser.role,
          isActive: currentUser.status !== "active",
        }),
      });

      if (!response.ok) return;
      const payload: { user?: ApiUser } = await response.json();
      const updatedUser = payload.user || (payload as unknown as ApiUser);
      setUsers((current: UserRecord[]) =>
        current.map((user: UserRecord): UserRecord =>
          user.id === id
            ? {
                ...user,
                status: updatedUser.isActive === false ? "inactive" : "active",
                lastLogin: "Just now",
              }
            : user,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id: number) => {
    const token = localStorage.getItem("clmp-token");
    if (!token) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setUsers((current: UserRecord[]) => current.filter((user: UserRecord) => user.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-5" style={{ color: text }}>
      <div>
        <h1 className="text-xl font-bold">Administration</h1>
        <p className="text-xs mt-0.5" style={{ color: muted }}>Manage users, roles, and system permissions</p>
      </div>

      <div className="flex border-b" style={{ borderColor: border }}>
        {tabs.map((item: TabKey) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className="px-5 py-2.5 text-xs font-semibold capitalize transition-colors border-b-2 -mb-px"
            style={{ borderColor: tab === item ? "#1E40AF" : "transparent", color: tab === item ? "#1E40AF" : muted }}
          >
            {item === "users" ? "Users" : item === "roles" ? "Roles" : "Permissions"}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <div className="rounded-xl border overflow-hidden" style={{ background: bg, borderColor: border }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: border }}>
            <h3 className="font-semibold text-sm" style={{ color: text }}>All Users ({users.length})</h3>
            <button onClick={openAddUser} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "#1E40AF" }}>
              <Plus className="w-3.5 h-3.5" /> Add User
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: border, background: subtle }}>
                {["User", "Email", "Role", "Status", "Last Login", "Actions"].map((header) => (
                  <th key={header} className="px-4 py-2.5 text-left text-xs font-semibold" style={{ color: muted }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const rc = ROLE_COLORS[user.role] || ROLE_COLORS["Viewer"];
                return (
                  <tr key={user.id} className="border-b transition-colors hover:bg-slate-50" style={{ borderColor: border }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "#1E40AF" }}>
                          {user.name.split(" ").map((namePart) => namePart[0]).join("")}
                        </div>
                        <span className="text-xs font-semibold" style={{ color: text }}>{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: muted }}>{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: rc.bg, color: rc.text }}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px]" style={{ color: muted }}>{user.lastLogin}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEditUser(user)} className="p-1.5 rounded-md hover:bg-blue-50 transition-colors" style={{ color: muted }} title="Edit user">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => void resetPassword(user)} className="p-1.5 rounded-md hover:bg-blue-50 transition-colors" style={{ color: muted }} title="Reset password">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteUser(user.id)} className="p-1.5 rounded-md hover:bg-red-50 transition-colors" style={{ color: muted }} title="Delete user">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "roles" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ROLES.map((role) => (
            <div key={role.name} className="rounded-xl border p-5" style={{ background: bg, borderColor: border }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: role.bg, color: role.color }}>{role.name}</span>
                  </div>
                  <div className="text-xs" style={{ color: muted }}>{role.users} user{role.users !== 1 ? "s" : ""}</div>
                </div>
                <button className="p-1.5 rounded-md hover:bg-slate-100 transition-colors" style={{ color: muted }}><Edit2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="space-y-1.5">
                {role.permissions.map((permission) => (
                  <div key={permission} className="flex items-center gap-2 text-xs">
                    <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: role.color }} />
                    <span style={{ color: text }}>{permission}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "permissions" && (
        <div className="rounded-xl border overflow-hidden" style={{ background: bg, borderColor: border }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: border }}>
            <h3 className="font-semibold text-sm" style={{ color: text }}>Permission Matrix</h3>
            <p className="text-xs mt-0.5" style={{ color: muted }}>Module-level access control by role</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b" style={{ borderColor: border, background: subtle }}>
                  <th className="px-5 py-3 text-left text-xs font-semibold" style={{ color: muted }}>Module</th>
                  {["Admin", "Manager", "Ops Team", "Viewer"].map((entry) => (
                    <th key={entry} className="px-4 py-3 text-center text-xs font-semibold" style={{ color: muted }}>{entry}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map((permission) => (
                  <tr key={permission.module} className="border-b" style={{ borderColor: border }}>
                    <td className="px-5 py-3 text-xs font-medium" style={{ color: text }}>{permission.module}</td>
                    {[permission.admin, permission.manager, permission.ops, permission.viewer].map((value, index) => (
                      <td key={`${permission.module}-${index}`} className="px-4 py-3 text-center">
                        {value ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100"><Check className="w-3 h-3 text-green-600" /></span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100"><X className="w-3 h-3 text-slate-400" /></span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl" style={{ background: bg, borderColor: border }}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold" style={{ color: text }}>{editingId !== null ? "Edit User" : "Add User"}</h3>
              <button onClick={() => setShowAdd(false)} className="rounded-md p-1 hover:bg-slate-100" style={{ color: muted }}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-medium" style={{ color: muted }}>Full name</label>
                <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-lg border px-3 py-2 text-xs outline-none" style={{ background: dark ? "#0F172A" : "#F8FAFC", borderColor: border, color: text }} />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium" style={{ color: muted }}>Email</label>
                <input value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-lg border px-3 py-2 text-xs outline-none" style={{ background: dark ? "#0F172A" : "#F8FAFC", borderColor: border, color: text }} />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium" style={{ color: muted }}>{editingId !== null ? "New password (optional)" : "Password"}</label>
                <input type="password" value={draft.password} onChange={(event) => setDraft((current) => ({ ...current, password: event.target.value }))} placeholder={editingId !== null ? "Leave blank to keep current password" : "Enter password"} className="w-full rounded-lg border px-3 py-2 text-xs outline-none" style={{ background: dark ? "#0F172A" : "#F8FAFC", borderColor: border, color: text }} />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium" style={{ color: muted }}>Role</label>
                <select value={draft.role} onChange={(event) => setDraft((current) => ({ ...current, role: event.target.value }))} className="w-full rounded-lg border px-3 py-2 text-xs outline-none" style={{ background: dark ? "#0F172A" : "#F8FAFC", borderColor: border, color: text }}>
                  {roles.map((roleName) => (
                    <option key={roleName} value={roleName}>{roleName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium" style={{ color: muted }}>Status</label>
                <select value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value as UserStatus }))} className="w-full rounded-lg border px-3 py-2 text-xs outline-none" style={{ background: dark ? "#0F172A" : "#F8FAFC", borderColor: border, color: text }}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowAdd(false)} className="rounded-lg border px-3 py-2 text-xs font-medium" style={{ borderColor: border, color: text }}>Cancel</button>
              <button onClick={saveUser} disabled={busy} className="rounded-lg px-3 py-2 text-xs font-semibold text-white disabled:opacity-60" style={{ background: "#1E40AF" }}>{busy ? "Saving..." : editingId !== null ? "Save Changes" : "Add User"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
