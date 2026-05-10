import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BarChart3, 
  Settings, 
  Check, 
  X, 
  Search,
  MoreHorizontal
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Import 2 component mới tạo
import { AccountManagementTable } from '../../components/admin/AccountManagementTable';
import { JobModerationQueue } from '../../components/admin/JobModerationQueue';

const CHART_DATA = Array.from({ length: 30 }, (_, i) => ({
  name: `Day ${i + 1}`,
  users: Math.floor(1000 + Math.random() * 500 + i * 50)
}));

const INITIAL_JOBS = [
  { id: 'JOB-001', company: 'TechCorp Inc.', role: 'Senior React Developer', date: 'Oct 12, 2024', status: 'Under Review' },
  { id: 'JOB-002', company: 'Global Solutions', role: 'Product Manager', date: 'Oct 11, 2024', status: 'Under Review' },
  { id: 'JOB-003', company: 'StartupX', role: 'UX Designer', date: 'Oct 10, 2024', status: 'Active' },
  { id: 'JOB-004', company: 'CryptoNet', role: 'Blockchain Eng', date: 'Oct 09, 2024', status: 'Banned' },
  { id: 'JOB-005', company: 'HealthPlus', role: 'Data Scientist', date: 'Oct 09, 2024', status: 'Under Review' },
];

export default function AdminPanel() {
  // Mặc định mở tab dashboard
  const [activeTab, setActiveTab] = useState('dashboard');
  const [jobs, setJobs] = useState(INITIAL_JOBS);

  const handleApprove = (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'Active' } : j));
  };

  const handleReject = (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'Banned' } : j));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">Active</span>;
      case 'Under Review':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Under Review</span>;
      case 'Banned':
      case 'Rejected':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">Banned</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">{status}</span>;
    }
  };

  // Hàm tạo tiêu đề Header linh hoạt theo tab
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return { title: 'Dashboard', desc: 'Overview of platform activity.' };
      case 'users': return { title: 'User Management', desc: 'Manage candidates and companies.' };
      case 'job-moderation': return { title: 'Job Moderation', desc: 'Review and approve new job postings.' };
      default: return { title: 'Admin Panel', desc: 'Manage your platform.' };
    }
  };

  const pageHeader = getPageTitle();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            Admin Portal
          </h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'users', icon: Users, label: 'User Management' },
            { id: 'job-moderation', icon: Briefcase, label: 'Job Moderation' },
            { id: 'reports', icon: BarChart3, label: 'Reports' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-200' : ''}`} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-sm">
              AD
            </div>
            <div>
              <p className="text-sm font-bold">Admin User</p>
              <p className="text-xs text-gray-400">Superadmin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          
          {/* Header thay đổi linh hoạt theo Tab */}
          <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{pageHeader.title}</h1>
              <p className="text-gray-500 mt-1 font-medium">{pageHeader.desc}</p>
            </div>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm w-full sm:w-64"
              />
            </div>
          </header>

          {/* RENDERING THEO TAB */}

          {/* TAB 1: DASHBOARD (Giữ lại giao diện cũ bạn làm) */}
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">User Growth</h3>
                      <p className="text-sm text-gray-500 font-medium">Last 30 days active users</p>
                    </div>
                    <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
                      +12.5% vs last month
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={CHART_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                          dy={10}
                          minTickGap={20}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                          dx={-10}
                          tickCount={5}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#2563EB" 
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 6, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Stats Summary */}
                <div className="bg-gray-900 text-white rounded-2xl shadow-sm p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
                  <div>
                    <h3 className="text-lg font-bold mb-6 text-gray-100">Action Center</h3>
                    <div className="space-y-6">
                      <div>
                        <p className="text-4xl font-black tracking-tight text-white">24</p>
                        <p className="text-sm font-medium text-gray-400 mt-1">Pending job approvals</p>
                      </div>
                      <div>
                        <p className="text-4xl font-black tracking-tight text-white">5</p>
                        <p className="text-sm font-medium text-gray-400 mt-1">Reported users</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('job-moderation')}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-blue-900/20 z-10 relative"
                  >
                    Go to Review Queue
                  </button>
                </div>
              </div>

              {/* Pending Job Approvals Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Recent Job Approvals</h3>
                  <button onClick={() => setActiveTab('job-moderation')} className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-bold">Job ID</th>
                        <th className="px-6 py-4 font-bold">Company & Role</th>
                        <th className="px-6 py-4 font-bold">Submitted Date</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4 font-mono text-xs text-gray-500 font-medium">
                            {job.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{job.role}</div>
                            <div className="text-xs font-medium text-gray-500 mt-0.5">{job.company}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-medium">
                            {job.date}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(job.status)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {job.status === 'Under Review' ? (
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleReject(job.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => handleApprove(job.id)}
                                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                              </div>
                            ) : (
                              <button className="p-2 text-gray-300 hover:text-gray-500 transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && <AccountManagementTable />}

          {/* TAB 3: JOB MODERATION */}
          {activeTab === 'job-moderation' && <JobModerationQueue />}

        </div>
      </main>
    </div>
  );
}