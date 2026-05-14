import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "./App"; 
import Home from "./pages/public/Home";
import JobDetail from "./pages/public/JobDetail";
import Auth from "./pages/auth/Auth";
import ProfileDashboard from "./pages/candidate/ProfileDashboard";
import MyApplications from "./pages/candidate/MyApplications";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import CandidateManagement from "./pages/employer/CandidateManagement";
import CandidateDetail from "./pages/employer/CandidateDetail";
import Settings from "./pages/shared/Settings";


// --- PROTECTED ROUTE ---
const ProtectedRoute = ({ allowedRole }: { allowedRole: string }) => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    // Nếu chưa đăng nhập, đá về trang auth
    return <Navigate to="/auth" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Kiểm tra kỹ giá trị role. Lưu ý: 'candidate' !== 'Candidate'
    // Ép kiểu về lowercase để so sánh cho chắc chắn
    if (user.role?.toLowerCase() !== allowedRole.toLowerCase()) {
      console.warn("Sai role! User role:", user.role, "Yêu cầu:", allowedRole);
      return <Navigate to="/" replace />; // Đây chính là dòng khiến bạn bị văng về trang chủ
    }

    return <Outlet />;
  } catch (error) {
    console.error("Lỗi parse user:", error);
    return <Navigate to="/auth" replace />;
  }
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      { index: true, element: <Home /> },
      { path: "auth", element: <Auth /> },
      { 
        // Đảm bảo route chi tiết công việc nằm ở đây
        path: "job/:id", 
        element: <JobDetail /> 
      },
      {
        element: <ProtectedRoute allowedRole="candidate" />,
        children: [
          { path: "applications", element: <MyApplications /> },
        ],
      },
    ],
  },
]);