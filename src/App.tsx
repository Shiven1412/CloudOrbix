import { useEffect, useState } from "react";
import Login from "./components/Login";
import Shell, { type Page } from "./components/Shell";
import Dashboard from "./components/Dashboard";
import Clients from "./components/Clients";
import Analytics from "./components/Analytics";
import ExcelImport from "./components/ExcelImport";
import Reports from "./components/Reports";
import AuditLogs from "./components/AuditLogs";
import Admin from "./components/Admin";
import SimplePage from "./components/SimplePage";
import LoadingScreen from "./components/LoadingScreen";
import ProjectPage from "./components/ProjectPage";

type AuthUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isActive: boolean;
};

const getStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem("clmp-user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function App() {
  const [booting, setBooting] = useState(true);
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("clmp-token")));
  const [page, setPage] = useState<Page>("dashboard");
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());
  const [projectId, setProjectId] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const nextPage = event.state?.page as Page | undefined;
      if (nextPage) setPage(nextPage);
      else setPage("dashboard");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigateTo = (nextPage: Page) => {
    setPage(nextPage);
    window.history.pushState({ page: nextPage }, "", nextPage === "dashboard" ? "/" : `#${nextPage}`);
  };

  const handleGlobalSearch = (query: string) => {
    setGlobalSearch(query);
    if (query && page !== "clients") {
      setPage("clients");
      window.history.replaceState({ page: "clients" }, "", "#clients");
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      localStorage.removeItem("clmp-token");
      localStorage.removeItem("clmp-user");
      setUser(null);
    }
  }, [loggedIn]);

  const handleLogin = (authUser: AuthUser, token: string) => {
    localStorage.setItem("clmp-token", token);
    localStorage.setItem("clmp-user", JSON.stringify(authUser));
    setUser(authUser);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("clmp-token");
    localStorage.removeItem("clmp-user");
    setLoggedIn(false);
    setUser(null);
  };

  if (booting) {
    return <LoadingScreen />;
  }

  if (!loggedIn || !user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":   return <Dashboard dark={dark} onNavigate={p => navigateTo(p as Page)} user={user} />;
      case "clients":     return <Clients dark={dark} user={user} initialSearch={globalSearch} onOpenProject={(id) => { setProjectId(id); navigateTo("project"); }} />;
      case "project":     return projectId ? <ProjectPage dark={dark} clientId={projectId} onBack={() => navigateTo("clients")} /> : <Clients dark={dark} user={user} initialSearch={globalSearch} onOpenProject={(id) => { setProjectId(id); navigateTo("project"); }} />;
      case "analytics":   return <Analytics dark={dark} />;
      case "excel":       return <ExcelImport dark={dark} />;
      case "reports":     return <Reports dark={dark} />;
      case "audit":       return <AuditLogs dark={dark} />;
      case "admin":       return <Admin dark={dark} user={user} />;
      case "onboarding":
      case "offboarding":
      case "services":
      case "help":        return <SimplePage page={page} dark={dark} />;
      default:            return <Dashboard dark={dark} onNavigate={p => setPage(p as Page)} user={user} />;
    }
  };

  return (
    <Shell
      page={page}
      onPageChange={setPage}
      onLogout={handleLogout}
      dark={dark}
      user={user}
      onToggleDark={() => setDark(d => !d)}
      onSearch={handleGlobalSearch}
    >
      {renderPage()}
    </Shell>
  );
}
