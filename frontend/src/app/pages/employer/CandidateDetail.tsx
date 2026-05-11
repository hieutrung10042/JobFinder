import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Mail, Phone, Calendar, XCircle, ChevronDown,
  MessageSquare, Briefcase, GraduationCap, Loader2, FileText, Download
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import { applicationService } from '../../../services/applicationService';
import { ApplicationDetail, Note } from '../../../types/application';
import { STATUS_BADGE_COLORS, STATUS_OPTIONS } from '../../../constants/status';
import { getInitials, formatDate, formatDateVN } from '../../../utils/format';

export default function CandidateDetail() {
  const { id } = useParams();
  const [data, setData] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    applicationService.getApplicationById(id!)
      .then(res => {
        setData(res.data.data);
        setStatus(res.data.data.status);
      })
      .catch(err => setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await applicationService.updateStatus(Number(id), newStatus);
      setStatus(newStatus);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi cập nhật trạng thái');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    setNotes(prev => [...prev, { id: Date.now(), author: 'Bạn', date: 'Vừa xong', text: noteInput }]);
    setNoteInput('');
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center gap-2 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" /><span>Đang tải...</span>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500 text-sm">{error || 'Không tìm thấy dữ liệu'}</p>
    </div>
  );

  const displayName = data.full_name || data.candidate_name;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200 pb-24 lg:pb-12">

      {/* Top Nav */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/employer/candidates" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">

        {/* Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-sm mb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
              {getInitials(displayName)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{displayName}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_BADGE_COLORS[status]}`}>
                  {STATUS_OPTIONS.find(s => s.value === status)?.label || status}
                </span>
              </div>
              <p className="text-lg font-medium text-gray-600 dark:text-slate-300 mb-4">
                Ứng tuyển vào <span className="font-bold text-gray-900 dark:text-white">{data.job_title}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{data.candidate_email}</div>
                {data.phone && <div className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{data.phone}</div>}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Nộp {formatDateVN(data.applied_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleStatusChange('rejected')}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                <XCircle className="w-4 h-4 text-red-500" /> Từ chối
              </button>
              <button
                onClick={() => handleStatusChange('accepted')}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Calendar className="w-4 h-4" /> Chấp nhận
              </button>
            </div>
            <div className="relative w-full">
              <select
                value={status}
                onChange={e => handleStatusChange(e.target.value)}
                disabled={updating}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50"
              >
                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Cover Letter */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <FileText className="w-4 h-4 text-blue-600" /> Thư ứng tuyển
                </div>
                {data.cv_url && (
                  <a href={data.cv_url} target="_blank" rel="noreferrer" className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
              <div className="p-6 sm:p-8">
                {data.cover_letter
                  ? <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{data.cover_letter}</p>
                  : <p className="text-gray-400 italic">Ứng viên không gửi kèm thư ứng tuyển.</p>
                }
                {data.bio && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-500 mb-2">Giới thiệu bản thân</p>
                    <p className="text-gray-700 leading-relaxed">{data.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Hồ sơ ứng viên</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Kinh nghiệm */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                    <Briefcase className="w-4 h-4 text-blue-600" /> Kinh nghiệm
                  </h4>
                  {data.work_experience.length > 0 ? (
                    <div className="space-y-4">
                      {data.work_experience.map((exp, i) => (
                        <div key={i} className="pl-4 border-l-2 border-gray-200">
                          <p className="font-bold text-gray-900 dark:text-white">{exp.position}</p>
                          <p className="text-sm text-gray-500">
                            {exp.company_name} • {formatDate(exp.start_date)} – {exp.end_date ? formatDate(exp.end_date) : 'Hiện tại'}
                          </p>
                          {exp.description && <p className="text-xs text-gray-500 mt-1">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Chưa có thông tin</p>
                  )}
                </div>

                {/* Kỹ năng + Học vấn */}
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                      <GraduationCap className="w-4 h-4 text-blue-600" /> Kỹ năng
                    </h4>
                    {data.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {data.skills.map(skill => (
                          <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium border border-gray-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Chưa có thông tin</p>
                    )}
                  </div>

                  {data.education.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">Học vấn</h4>
                      {data.education.map((edu, i) => (
                        <div key={i} className="pl-4 border-l-2 border-gray-200 mb-3">
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{edu.school_name}</p>
                          <p className="text-xs text-gray-500">{edu.major}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">

            {/* Mobile Actions */}
            <div className="lg:hidden bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Hành động</h3>
              <div className="relative w-full">
                <select
                  value={status}
                  onChange={e => handleStatusChange(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 pl-4 pr-10 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <button onClick={() => handleStatusChange('accepted')} className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                <Calendar className="w-5 h-5" /> Chấp nhận
              </button>
              <button onClick={() => handleStatusChange('rejected')} className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                <XCircle className="w-5 h-5 text-red-500" /> Từ chối
              </button>
            </div>

            {/* Notes */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col h-[500px]">
              <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50 rounded-t-2xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ghi chú nội bộ</h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gray-50/50">
                {notes.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-8">Chưa có ghi chú nào</p>
                ) : notes.map(note => (
                  <div key={note.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-gray-900">{note.author}</span>
                      <span className="text-xs text-gray-500">{note.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 sm:p-5 border-t border-gray-100 bg-white rounded-b-2xl">
                <div className="relative">
                  <textarea
                    value={noteInput}
                    onChange={e => setNoteInput(e.target.value)}
                    placeholder="Thêm ghi chú cho nhóm..."
                    rows={3}
                    className="w-full p-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-900 placeholder-gray-400"
                  />
                  <button
                    onClick={handleAddNote}
                    className="absolute bottom-3 right-3 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}