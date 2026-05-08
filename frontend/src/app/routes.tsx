import { createBrowserRouter } from "react-router";
import { Layout } from "./components/shared/Layout";
import Home from "./pages/public/Home";
import JobDetail from "./pages/public/JobDetail";
import ProfileDashboard from "./pages/candidate/ProfileDashboard";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import CandidateManagement from "./pages/employer/CandidateManagement";
import AdminPanel from "./pages/admin/AdminPanel";
import Settings from "./pages/shared/Settings";
import Auth from "./pages/auth/Auth";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "job/:id", Component: JobDetail },
      { path: "profile", Component: ProfileDashboard },
      { path: "employer/dashboard", Component: EmployerDashboard },
      { path: "employer/candidates", Component: CandidateManagement },
      { path: "settings", Component: Settings },
      { path: "auth", Component: Auth }
    ],
  },
  {
    path: "/admin",
    Component: AdminPanel
  }
]);



