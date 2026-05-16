import React, { useEffect, useState } from 'react';
import { Building, MapPin, Clock, Search, Filter, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';


interface Application {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  appliedDate: string;
  status: string;
  logoUrl: string;
}

export default function MyApplications() {
  
  const [applications, setApplications] = useState<Application[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    console.log("=== MyApplications MOUNTED ===");
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    console.log("Token:", token ? "YES" : "NO"); // thêm
    const response = await fetch('http://127.0.0.1:5000/api/applications/my', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log("Response status:", response.status); // thêm
    // ✅ Thêm kiểm tra này
    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      setApplications([]); // set rỗng để thoát loading
      return;
    }

    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      const formattedData = result.data.map((item: any) => ({
        id: item.application_id,
        title: item.job_title || 'No Title',
        company: item.company_name || 'Unknown',
        location: item.location || 'N/A',
        type: item.job_type || 'Full-time',
        appliedDate: item.applied_at
          ? new Date(item.applied_at).toLocaleDateString('vi-VN')
          : 'N/A',
        status: item.status || 'pending',
        logoUrl: item.logo_url
          ? `http://127.0.0.1:5000${item.logo_url.startsWith('/') ? '' : '/'}${item.logo_url}`
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(item.company_name || 'Co')}&background=random`
      }));
      setApplications(formattedData);
    } else {
      setApplications([]);
    }
  } catch (error) {
    console.error("Lỗi fetch dữ liệu:", error);
    setApplications([]); // ✅ thoát loading khi lỗi
  } finally {
    setLoading(false); // ✅ luôn tắt loading
  }
};

  // Chỉnh lại Badge để hiển thị ĐÚNG và ĐỦ mọi trạng thái từ Database
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase(); 
    switch (s) {
      case 'pending': // Trạng thái mặc định của công việc mới apply
        return <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wide">Pending</span>;
      case 'reviewed':
        return <span className="px-3 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 rounded-full text-xs font-bold uppercase tracking-wide">Under Review</span>;
      case 'interviewing':
        return <span className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wide">Interviewing</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wide">Rejected</span>;
      case 'accepted':
        return <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wide">Accepted</span>;
      default:
        // Nếu là trạng thái lạ, vẫn hiển thị chữ để không bị trống giao diện
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wide">{status}</span>;
    }
  };

  if (loading) return <div className="text-center py-20 dark:text-white font-medium">Loading applications...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">My Applications</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Track and manage the jobs you've applied to.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by job title or company..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="space-y-4">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  
                  <div className="flex items-start justify-between sm:hidden w-full">
                    <img 
                      src={app.logoUrl} 
                      alt={`${app.company} logo`} 
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Job'; }}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-slate-700" 
                    />
                    {getStatusBadge(app.status)}
                  </div>

                  <img 
                    src={app.logoUrl} 
                    alt={`${app.company} logo`} 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Job'; }}
                    className="hidden sm:block w-16 h-16 rounded-xl object-cover border border-gray-100 dark:border-slate-700 flex-shrink-0" 
                  />
                  
                  <div className="flex-1">
                    <Link to={`/job/${app.id}`} className="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {app.title}
                    </Link>
                    
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-sm text-gray-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-slate-300">
                        <Building className="w-4 h-4 text-gray-400" />
                        {app.company}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {app.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {app.type}
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500 dark:text-slate-500 font-medium">
                      Applied {app.appliedDate}
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-end justify-between self-stretch">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <div className="mt-auto">
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
               <p className="text-gray-500 dark:text-slate-400 font-medium">No applications found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}