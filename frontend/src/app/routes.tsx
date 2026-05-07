import { createBrowserRouter } from "react-router";
import { Layout } from "./components/shared/Layout";
import Home from "./pages/Home";
import JobDetail from "./pages/JobDetail";
import ProfileDashboard from "./pages/ProfileDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "job/:id", Component: JobDetail },
      { path: "profile", Component: ProfileDashboard },
      { path: "employer/dashboard", Component: EmployerDashboard }
    ],
  },
]);


