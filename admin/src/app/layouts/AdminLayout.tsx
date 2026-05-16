import { useState, useEffect } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  Users, 
  BriefcaseBusiness, 
  Tags, 
  AlertTriangle, 
  Settings,
  Search,
  Bell,
  LogOut
} from "lucide-react"
import { cn } from "../../lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users & Companies", href: "/users", icon: Users },
  { name: "Jobs", href: "/jobs/management", icon: BriefcaseBusiness }, // Trả lại 1 menu duy nhất cho gọn
  { name: "Metadata", href: "/metadata", icon: Tags },
  { name: "Resolution Center", href: "/reports", icon: AlertTriangle },
]
// Khai báo kiểu dữ liệu cho User - Bổ sung thêm avatar_url
interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar_url?: string | null; // Có thể null nếu user chưa có ảnh
}

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // State lưu thông tin user
  const [user, setUser] = useState<UserProfile | null>(null)

  // Hàm tạo avatar chữ dự phòng
  const getInitials = (name: string) => {
    if (!name) return "AD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  // Hook gọi API lấy thông tin Profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("admin_token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.data);
        } else {
          localStorage.removeItem("admin_token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin admin:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Hàm xử lý Đăng xuất
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault(); 
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 z-10">
        <div className="h-16 flex items-center px-6 bg-slate-950 font-bold text-xl text-white">
          <BriefcaseBusiness className="w-6 h-6 mr-2 text-indigo-500" />
          JobFinder Admin
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-600 text-white" 
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5 mr-3 flex-shrink-0", isActive ? "text-indigo-200" : "text-slate-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 bg-slate-950">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 text-slate-400" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="max-w-md w-full relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users, jobs, reports..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-md text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            
            {/* User Info - Đã tích hợp avatar_url */}
            <div className="flex items-center space-x-3">
              
              {/* Logic render Avatar */}
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.username} 
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  {user ? getInitials(user.username) : "..."}
                </div>
              )}

              <div className="text-sm">
                <p className="font-medium text-slate-900 leading-none">
                  {user ? user.username : "Đang tải..."}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {user ? user.email : "..."}
                </p>
              </div>
            </div>
            
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}