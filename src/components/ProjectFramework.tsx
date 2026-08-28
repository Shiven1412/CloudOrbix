import { BookOpen } from "lucide-react";

interface ProjectFrameworkProps {
  dark: boolean;
}

export default function ProjectFramework({ dark }: ProjectFrameworkProps) {
  const background = dark ? "#1E293B" : "#FFFFFF";
  const border = dark ? "#334155" : "#E2E8F0";
  const text = dark ? "#E2E8F0" : "#0F172A";
  const muted = dark ? "#94A3B8" : "#64748B";

  return (
    <div className="p-6" style={{ color: text }}>
      <div className="max-w-3xl rounded-xl border p-8" style={{ background: background, borderColor: border }}>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
          <BookOpen className="h-5 w-5" />
        </div>
        <h1 className="mt-5 text-xl font-bold">Project Framework</h1>
        <p className="mt-2 text-sm leading-6" style={{ color: muted }}>
          The project framework content will be added here. This page is read-only.
        </p>
      </div>
    </div>
  );
}