import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Users, MessageSquare, Eye, Plus, MoreVertical, MapPin, Clock, Loader2, Pencil, Trash2, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; 
import { applicationService } from '../../../services/applicationService';
import { Job, Stats } from '../../../types/application';
import { timeAgo } from '../../../utils/format';

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats>({ total_jobs: 0, total_applications: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applicationService.getEmployerJobs()
      .then(res => {
        setJobs(res.data.data || []);
        setStats(res.data.stats || { total_jobs: 0, total_applications: 0 });
      })
      .catch(err => setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu'))
      .finally(() => setLoading(false));
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggleJobStatus = async (job_id: number) => {
    setTogglingId(job_id);
    setOpenMenuId(null);
    try {
      const res = await applicationService.toggleJobStatus(job_id);
      setJobs(prev => prev.map(j =>
        j.id === job_id ? { ...j, status: res.data.new_status } : j
      ));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi cập nhật trạng thái');
    } finally {
      setTogglingId(null);
    }
  };

  // Trả về các action phù hợp với từng trạng thái
  const getActions = (job: Job) => {
    switch (job.status) {
      case 'pending':
        return [
          {
            label: 'Chỉnh sửa tin',
            icon: <Pencil className="w-4 h-4 text-blue-500" />,
            onClick: () => {
              setOpenMenuId(null);
              // TODO: navigate to edit page
              alert(`Chỉnh sửa job #${job.id}`);
            },
          },
          {
            label: 'Xóa tin',
            icon: <Trash2 className="w-4 h-4 text-red-500" />,
            danger: true,
            onClick: () => {
              setOpenMenuId(null);
              // TODO: confirm & delete
              alert(`Xóa job #${job.id}`);
            },
          },
        ];

      case 'approved':
        return [
          {
            label: 'Đóng tin',
            icon: <XCircle className="w-4 h-4 text-red-500" />,
            danger: true,
            onClick: () => handleToggleJobStatus(job.id),
          },
        ];

      case 'closed':
        return [
          {
            label: 'Mở lại tin',
            icon: <RefreshCw className="w-4 h-4 text-green-500" />,
            onClick: () => handleToggleJobStatus(job.id),
          },
        ];

      case 'rejected':
        return [
          {
            label: 'Xem lý do từ chối',
            icon: <AlertCircle className="w-4 h-4 text-orange-500" />,
            onClick: () => {
              setOpenMenuId(null);
              // TODO: show rejection reason modal
              alert(`Xem lý do từ chối job #${job.id}`);
            },
          },
          {
            label: 'Chỉnh sửa & gửi lại',
            icon: <Pencil className="w-4 h-4 text-blue-500" />,
            onClick: () => {
              setOpenMenuId(null);
              // TODO: navigate to edit page
              alert(`Chỉnh sửa job #${job.id}`);
            },
          },
        ];

      default:
        return [];
    }
  };

  const STATUS_CONFIG: Record<string, { label: string; dotColor: string; badgeClass: string }> = {
    approved: {
      label: 'Open',
      dotColor: 'bg-green-500',
      badgeClass: 'bg-green-50 text-green-700 border-green-200',
    },
    pending: {
      label: 'Pending',
      dotColor: 'bg-yellow-400',
      badgeClass: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    },
    closed: {
      label: 'Closed',
      dotColor: 'bg-gray-400',
      badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
    },
    rejected: {
      label: 'Rejected',
      dotColor: 'bg-red-400',
      badgeClass: 'bg-red-50 text-red-600 border-red-200',
    },
  };

  const STATS_DISPLAY = [
    { id: 1, label: 'Total Jobs', value: String(stats.total_jobs), icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, label: 'Active Applications', value: String(stats.total_applications), icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 3, label: 'New Messages', value: '0', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 4, label: 'Total Views', value: '—', icon: Eye, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Employer Dashboard</h1>
            <div className="flex space-x-8 border-b border-gray-200 mt-6">
              <Link to="/employer/dashboard" className="border-b-2 border-blue-600 pb-4 text-blue-600 font-medium text-sm transition-colors">
                Overview & Jobs
              </Link>
              <Link to="/employer/candidates" className="border-b-2 border-transparent pb-4 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors">
                Candidates
              </Link>
            </div>
          </div>
          <button 
            onClick={() => navigate('/employer/jobs/new')} 
            className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm self-start mt-2"
          >
            <Plus className="w-5 h-5" />
            Post a New Job
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {STATS_DISPLAY.map(stat => (
            <div key={stat.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Job Postings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-24 sm:mb-8">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Active Job Postings</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Đang tải dữ liệu...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 text-sm">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Job Title</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Applications</th>
                    <th className="px-6 py-4 font-semibold">Posted</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                        Chưa có tin tuyển dụng nào.
                      </td>
                    </tr>
                  ) : jobs.map(job => {
                    const cfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG['pending'];
                    const actions = getActions(job);

                    return (
                      <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 mb-1">{job.title}</div>
                          <div className="flex items-center gap-3 text-gray-500 text-xs">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5" /> {job.job_type}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {job.location_name || 'N/A'}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.badgeClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${cfg.dotColor}`} />
                            {cfg.label}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{job.application_count}</span>
                            {job.application_count > 0 && job.status === 'approved' && (
                              <span className="text-xs text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">New</span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {timeAgo(job.created_at)}
                          </div>
                        </td>

                        {/* Actions cell */}
                        <td className="px-6 py-4 text-right">
                          <div className="relative inline-block" ref={openMenuId === job.id ? menuRef : null}>
                            <button
                              onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              disabled={togglingId === job.id}
                            >
                              {togglingId === job.id
                                ? <Loader2 className="w-5 h-5 animate-spin" />
                                : <MoreVertical className="w-5 h-5" />
                              }
                            </button>

                            {openMenuId === job.id && actions.length > 0 && (
                              <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">

                                {/* Header nhỏ cho biết trạng thái hiện tại */}
                                <div className="px-4 py-2 border-b border-gray-100">
                                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                    Trạng thái: {cfg.label}
                                  </span>
                                </div>

                                {actions.map((action, idx) => (
                                  <button
                                    key={idx}
                                    onClick={action.onClick}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition-colors
                                      ${action.danger
                                        ? 'text-red-600 hover:bg-red-50'
                                        : 'text-gray-700 hover:bg-gray-50'
                                      }`}
                                  >
                                    {action.icon}
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* FAB Mobile */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => navigate('/employer/jobs/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}