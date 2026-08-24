import { useEffect, useState } from "react";
import { ArrowLeft, Check, FileText, Pencil, Plus, Upload, X } from "lucide-react";

type ProjectPageProps = { dark: boolean; clientId: string; onBack: () => void };
type Task = { id: number; task_title: string; assigned_to: string; expected_start_date: string; expected_end_date: string; actual_start_date: string; actual_end_date: string; progress: number; status: string; remark: string };
type Project = { client_id: string; client_name: string; account_manager: string; project_manager: string; project_progress: number; project_brief: string; current_status: string; completion: number; hyperscaler: string; project_type: string };
type TaskDraft = { taskTitle: string; assignedTo: string; expectedStartDate: string; expectedEndDate: string; actualStartDate: string; actualEndDate: string; progress: string; status: string; remark: string };

const emptyTask: TaskDraft = { taskTitle: "", assignedTo: "", expectedStartDate: "", expectedEndDate: "", actualStartDate: "", actualEndDate: "", progress: "0", status: "Not Started", remark: "" };
const statuses = ["Not Started", "In Progress", "Blocked", "Completed", "delayed", "On Hold", "Cancelled", "Closed"];

const toDraft = (task: Task): TaskDraft => ({ taskTitle: task.task_title || "", assignedTo: task.assigned_to || "", expectedStartDate: task.expected_start_date || "", expectedEndDate: task.expected_end_date || "", actualStartDate: task.actual_start_date || "", actualEndDate: task.actual_end_date || "", progress: String(task.progress || 0), status: task.status || "Not Started", remark: task.remark || "" });

export default function ProjectPage({ dark, clientId, onBack }: ProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<{ id: number; file_name: string; blob_url: string }[]>([]);
  const [task, setTask] = useState<TaskDraft>(emptyTask);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  

  

  const alerts: string[] = [];

  tasks.forEach((task) => {
    const today = new Date();

    const startDate = task.expected_start_date
      ? new Date(task.expected_start_date)
      : null;

    const endDate = task.expected_end_date
      ? new Date(task.expected_end_date)
      : null;

    const status = task.status?.toLowerCase();

    if (
      startDate &&
      today > startDate &&
      status === "not started"
    ) {
      const daysLate = Math.floor(
        (today.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      alerts.push(
        `⚠️ ${task.task_title}: Start delayed by ${daysLate} days`
      );
    }
     if (status === "blocked") {
    alerts.push(
      `⛔ ${task.task_title}: is currently blocked`
    );
  }

    if (
      endDate &&
      today > endDate &&
      status !== "completed" &&
      status !== "closed"
    ) {
      const daysLate = Math.floor(
        (today.getTime() - endDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      alerts.push(
        `🔴 ${task.task_title}: End delayed by ${daysLate} days`
      );
    }
  });


  const bg = dark ? "#1E293B" : "#FFFFFF";
  const border = dark ? "#334155" : "#E2E8F0";
  const text = dark ? "#E2E8F0" : "#0F172A";
  const muted = dark ? "#94A3B8" : "#64748B";
  const inputBg = dark ? "#0F172A" : "#F8FAFC";
  const token = localStorage.getItem("clmp-token");
  const headers = { Authorization: `Bearer ${token}` };
  // Dashboard Statistics
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (t) => t.status?.toLowerCase() === "completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (t) => t.status?.toLowerCase() === "in progress"
  ).length;

  const notStartedTasks = tasks.filter(
    (t) => t.status?.toLowerCase() === "not started"
  ).length;

  const blockedTasks = tasks.filter(
    (t) => t.status?.toLowerCase() === "blocked"
  ).length;

  const delayedTasks = tasks.filter(
    (t) => t.status?.toLowerCase() === "delayed"
  ).length;

  const overallProgress =
    totalTasks > 0
      ? Math.round(
          tasks.reduce(
            (sum, task) => sum + Number(task.progress || 0),
            0
          ) / totalTasks
        )
      : 0;

  const completedPercent =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const inProgressPercent =
    totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0;

  const notStartedPercent =
    totalTasks > 0 ? (notStartedTasks / totalTasks) * 100 : 0;

  const blockedPercent =
    totalTasks > 0 ? (blockedTasks / totalTasks) * 100 : 0;

  const delayedPercent =
    totalTasks > 0 ? (delayedTasks / totalTasks) * 100 : 0;
  const load = async () => {
    const response = await fetch(`/api/projects/${clientId}`, { headers });
    const body = await response.json();
    if (!response.ok) throw new Error(body.message || "Unable to load project.");
    setProject(body.project);
    setTasks(body.tasks || []);
    setDocuments(body.documents || []);
    setTask((current) => current.assignedTo ? current : { ...current, assignedTo: body.project.project_manager || body.project.account_manager || "" });
  };

  useEffect(() => { void load().catch((error) => setMessage(error.message)); }, [clientId]);

  const saveTask = async () => {
    setMessage("");
    const path = editingTaskId ? `/api/projects/${clientId}/tasks/${editingTaskId}` : `/api/projects/${clientId}/tasks`;
    const response = await fetch(path, { method: editingTaskId ? "PUT" : "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(task) });
    const body = await response.json();
    if (!response.ok) return setMessage(body.message || "Unable to save task.");
    setEditingTaskId(null);
    setTask({ ...emptyTask, assignedTo: project?.project_manager || project?.account_manager || "" });
    await load();
  };

  const editTask = (item: Task) => { setEditingTaskId(item.id); setTask(toDraft(item)); window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); };
  const cancelEdit = () => { setEditingTaskId(null); setTask({ ...emptyTask, assignedTo: project?.project_manager || project?.account_manager || "" }); };
  const deleteTask = async (taskId: number) => {
    const response = await fetch(`/api/projects/${clientId}/tasks/${taskId}`, { method: "DELETE", headers });
    const body = await response.json();
    if (!response.ok) return setMessage(body.message || "Unable to delete task.");
    await load();
  };

  const uploadDocument = async () => {
    if (!file) return;
    const form = new FormData(); form.append("file", file);
    const response = await fetch(`/api/projects/${clientId}/documents`, { method: "POST", headers, body: form });
    const body = await response.json();
    if (!response.ok) return setMessage(body.message || "Unable to upload document.");
    setDocuments((current) => [body.document, ...current]); setFile(null); setMessage("Document uploaded to Azure.");
  };
 
  const field = (label: string, key: keyof TaskDraft, type = "text") => <label className="space-y-1"><span className="block text-[10px] font-semibold" style={{ color: muted }}>{label}</span><input type={type} value={task[key]} onChange={(event) => setTask((current) => ({ ...current, [key]: event.target.value }))} className="w-full rounded-lg border px-3 py-2 text-xs" style={{ background: inputBg, borderColor: border, color: text }} /></label>;

  if (!project) return <div className="p-6 text-sm" style={{ color: muted }}>{message || "Loading project..."}</div>;
  return <div className="p-6 space-y-5" style={{ color: text }}>
    <button onClick={onBack} className="flex items-center gap-2 text-xs font-semibold" style={{ color: "#1E40AF" }}><ArrowLeft className="w-4 h-4" /> Back to Clients</button>
    <div className="flex items-start justify-between gap-4 flex-wrap"><div><h1 className="text-xl font-bold">{project.client_name}</h1><p className="text-xs mt-1" style={{ color: muted }}>{project.client_id} · PM: {project.project_manager || project.account_manager || "Unassigned"} · {project.hyperscaler || "No hyperscaler"}</p></div>
    <div className="flex justify-end items-center w-[180px]">
  {(() => {
   const progress = overallProgress;

    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - progress / 100);
    const alerts: string[] = [];

tasks.forEach((task) => {
  const today = new Date();

  const startDate = task.expected_start_date
    ? new Date(task.expected_start_date)
    : null;

  const endDate = task.expected_end_date
    ? new Date(task.expected_end_date)
    : null;

  const status = task.status?.toLowerCase();

  // Start delayed
  if (
    startDate &&
    today > startDate &&
    status === "not started"
  ) {
    const daysLate = Math.floor(
      (today.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    alerts.push(
      `⚠️ ${task.task_title}: Start delayed by ${daysLate} day${
        daysLate > 1 ? "s" : ""
      }`
    );
  }

  // End delayed
  if (
    endDate &&
    today > endDate &&
    status !== "completed" &&
    status !== "closed"
  ) {
    const daysLate = Math.floor(
      (today.getTime() - endDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    alerts.push(
      `🔴 ${task.task_title}: End delayed by ${daysLate} day${
        daysLate > 1 ? "s" : ""
      }`
    );
  }

  // Blocked task
  if (status === "blocked") {
    alerts.push(
      `⛔ ${task.task_title}: is currently blocked`
    );
  }
});

    return (
      <div className="relative w-32 h-32">
        <svg
          className="w-32 h-32 -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="10"
          />

          {/* Progress */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#1E40AF"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="text-3xl font-bold"
            style={{ color: "#1E40AF" }}
          >
            {progress}%
          </div>

          <div
            className="text-[11px]"
            style={{ color: muted }}
          >
            Progress
          </div>
        </div>
      </div>
    );
  })()}
</div></div>
    {message && <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{message}</div>}
    <div
  className="rounded-xl border p-5"
  style={{ background: bg, borderColor: border }}
>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    <div>
      <div
        className="text-xs uppercase font-semibold mb-3"
        style={{ color: muted }}
      >
        Project Summary
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <span style={{ color: muted }}>Project Manager:</span>{" "}
          <strong>
            {project.project_manager ||
              project.account_manager ||
              "-"}
          </strong>
        </div>

        <div>
          <span style={{ color: muted }}>Current Status:</span>{" "}
          <span
            className="px-2 py-1 rounded-full text-white text-xs font-semibold"
            style={{ background: "#1E40AF" }}
          >
            {project.current_status}
          </span>
        </div>

        <div>
          <span style={{ color: muted }}>Hyperscaler:</span>{" "}
          {project.hyperscaler || "-"}
        </div>
      </div>
    </div>

    <div className="space-y-4">

      <div className="flex justify-between">
        <span>Total Tasks</span>
        <strong>{totalTasks}</strong>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1">
          <span>Completed</span>
          <span>{completedTasks}</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full">
          <div
            className="h-2 rounded-full bg-green-500"
            style={{ width: `${completedPercent}%` }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1">
          <span>In Progress</span>
          <span>{inProgressTasks}</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full">
          <div
            className="h-2 rounded-full bg-blue-600"
            style={{ width: `${inProgressPercent}%` }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1">
          <span>Not Started</span>
          <span>{notStartedTasks}</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full">
          <div
            className="h-2 rounded-full bg-slate-500"
            style={{ width: `${notStartedPercent}%` }}
          />
        </div>
      </div>
    </div>
    


    {/* <div className="flex flex-col items-center justify-center">
      <div
        className="text-5xl font-bold"
        style={{ color: "#1E40AF" }}
      >
        {overallProgress}%
      </div>

      <div
        className="text-xs mt-2"
        style={{ color: muted }}
      >
        Overall Progress
      </div>
    </div> */}
    <div
  className="rounded-xl border overflow-hidden"
  style={{
    background: "#FEF2F2",
    borderColor: "#FECACA",
  }}
>
  <div
    className="px-4 py-2 text-xs font-semibold"
    style={{
      background: "#DC2626",
      color: "white",
    }}
  >
    Project Alerts
  </div>

  <div className="alert-container">
    <div className="alert-list">
      {alerts.length ? (
        alerts.map((alert, index) => (
          <div key={index} className="alert-item">
            {alert}
          </div>
        ))
      ) : (
        <div className="alert-item">
          ✅ No project risks detected
        </div>
      )}
    </div>
  </div>
</div>

  </div>
</div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"><div className="lg:col-span-2 rounded-xl border p-5" style={{ background: bg, borderColor: border }}><h2 className="font-semibold text-sm mb-3">Project lifecycle</h2><div className="grid grid-cols-2 gap-4 text-xs"><div><span style={{ color: muted }}>Status</span><div className="font-semibold mt-1">{project.current_status}</div></div><div><span style={{ color: muted }}>Project type</span><div className="font-semibold mt-1">{project.project_type || "-"}</div></div><div className="col-span-2"><span style={{ color: muted }}>Brief</span><div className="mt-1">{project.project_brief || "-"}</div></div></div></div><div className="rounded-xl border p-5" style={{ background: bg, borderColor: border }}><h2 className="font-semibold text-sm mb-3">Documents</h2><input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} className="w-full text-xs" /><button onClick={() => void uploadDocument()} className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "#1E40AF" }}><Upload className="w-3.5 h-3.5" /> Upload to Azure</button><div className="mt-4 space-y-2">{documents.map((document) => <a key={document.id} href={document.blob_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs" style={{ color: "#1E40AF" }}><FileText className="w-3.5 h-3.5" />{document.file_name}</a>)}</div></div></div>
    <div className="rounded-xl border overflow-hidden" style={{ background: bg, borderColor: border }}><div className="px-5 py-4 border-b flex justify-between" style={{ borderColor: border }}><h2 className="font-semibold text-sm">Task manager</h2><span className="text-xs" style={{ color: muted }}>{tasks.length} tasks</span></div><div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-xs"><thead><tr className="border-b" style={{ borderColor: border }}><th className="p-3 text-left">Task</th><th className="p-3 text-left">Assigned to</th><th className="p-3 text-left">Expected dates</th><th className="p-3 text-left">Actual dates</th><th className="p-3 text-left">Progress</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Remark</th><th className="p-3 text-left">Actions</th></tr></thead><tbody>{tasks.map((item) => <tr key={item.id} className="border-b" style={{ borderColor: border }}><td className="p-3 font-semibold">{item.task_title}</td><td className="p-3">{item.assigned_to || project.project_manager || project.account_manager || "-"}</td><td className="p-3">{item.expected_start_date || "-"} to {item.expected_end_date || "-"}</td><td className="p-3">{item.actual_start_date || "-"} to {item.actual_end_date || "-"}</td><td className="p-3">{item.progress}%</td><td className="p-3">{item.status}</td><td className="p-3">{item.remark || "-"}</td><td className="p-3 flex gap-1"><button onClick={() => editTask(item)} className="p-1.5 rounded-md hover:bg-blue-50" style={{ color: "#1E40AF" }} title="Edit task"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => void deleteTask(item.id)} className="p-1.5 rounded-md hover:bg-red-50 text-red-600" title="Delete task">X</button></td></tr>)}</tbody></table></div><div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-5 border-t" style={{ borderColor: border }}>{field("Task title", "taskTitle")}{field("Assigned to", "assignedTo")}{field("Expected start", "expectedStartDate", "date")}{field("Expected end", "expectedEndDate", "date")}{field("Actual start", "actualStartDate", "date")}{field("Actual end", "actualEndDate", "date")}{field("Progress %", "progress", "number")}<label className="space-y-1"><span className="block text-[10px] font-semibold" style={{ color: muted }}>Status</span><select value={task.status} onChange={(event) => setTask((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-lg border px-3 py-2 text-xs" style={{ background: inputBg, borderColor: border, color: text }}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>{field("Remark", "remark")}<div className="flex items-end gap-2"><button onClick={() => void saveTask()} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "#1E40AF" }}>{editingTaskId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}{editingTaskId ? "Update task" : "Add task"}</button>{editingTaskId && <button onClick={cancelEdit} className="p-2 rounded-lg border" style={{ borderColor: border, color: muted }} title="Cancel edit"><X className="w-3.5 h-3.5" /></button>}</div></div></div>
  </div>;
} 
