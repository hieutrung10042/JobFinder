import React, { useState, useEffect, useRef } from 'react';
import {
  User, Briefcase, Bookmark, Bell, Settings, LogOut,
  Edit2, MapPin, Mail, UploadCloud, FileText, Plus,
  Trash2, Sparkles, PenTool, Save, X, Phone, Calendar,
  ChevronDown, Loader2, CheckCircle, AlertCircle, Link
} from 'lucide-react';

import { RecommendedJobs } from '../../components/candidate/RecommendedJobs';
import { CVBuilder } from '../../components/candidate/CVBuilder';
import {
  getProfile, saveProfile, uploadCV, deleteCV,
  PersonalInfo, WorkExperience, Education
} from '../../../services/profileService';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ToastState {
  type: 'success' | 'error';
  message: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SIDEBAR_NAV = [
  { id: 'profile',      label: 'Hồ sơ',           icon: User },
  { id: 'cv-builder',   label: 'Tạo CV',           icon: PenTool },
  { id: 'recommended',  label: 'Việc làm phù hợp', icon: Sparkles },
  { id: 'applications', label: 'Đã ứng tuyển',     icon: Briefcase },
  { id: 'saved',        label: 'Việc đã lưu',      icon: Bookmark },
  { id: 'notifications',label: 'Thông báo',        icon: Bell },
];

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1762522926157-bcc04bf0b10a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400';
const DEFAULT_COVER  = 'https://images.unsplash.com/photo-1646038572822-432f8ccf2522?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080';

// ─── Toast component ──────────────────────────────────────────────────────────
function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-medium transition-all
      ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
      {toast.type === 'success'
        ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
        : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      {toast.message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
interface EditModalProps {
  title: string;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
}
function EditModal({ title, onClose, onSave, saving, children }: EditModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">{children}</div>
        <div className="flex gap-3 p-6 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-2xl">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Hủy
          </button>
          <button onClick={onSave} disabled={saving}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Đang lưu...' : 'Lưu lại'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Input helper ─────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors';

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    full_name: '', title: '', bio: '', location: '',
    phone: '', gender: '', dob: '', avatar_url: null, cover_url: null, cv_url: null,
    social_links: {}
  });
  const [experiences, setExperiences]   = useState<WorkExperience[]>([]);
  const [education, setEducation]       = useState<Education[]>([]);
  const [skills, setSkills]             = useState<string[]>([]);

  // UI state
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState<ToastState | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const cvInputRef                  = useRef<HTMLInputElement>(null);

  // Modal state
  const [modal, setModal] = useState<
    'personalInfo' | 'experience' | 'education' | 'skills' | null
  >(null);

  // Temp edit state (used inside modals)
  const [editPI, setEditPI]     = useState<PersonalInfo>(personalInfo);
  const [editExp, setEditExp]   = useState<WorkExperience[]>([]);
  const [editEdu, setEditEdu]   = useState<Education[]>([]);
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Get userId từ localStorage/JWT (adjust theo auth system của bạn)
  const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

  // ── Load profile ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    getProfile(userId)
      .then(data => {
        setPersonalInfo(data.personalInfo);
        setExperiences(data.experiences);
        setEducation(data.education);
        setSkills(data.skills);

        setAvatarSrc(data.personalInfo.avatar_url || DEFAULT_AVATAR);
      setCoverSrc(data.personalInfo.cover_url || DEFAULT_COVER);
      })
      .catch(() => showToast('error', 'Không thể tải hồ sơ'))
      .finally(() => setLoading(false));
  }, [userId]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showToast = (type: 'success' | 'error', message: string) => setToast({ type, message });

  const openModal = (type: typeof modal) => {
    if (type === 'personalInfo') setEditPI({ ...personalInfo });
    if (type === 'experience')   setEditExp(experiences.map(e => ({ ...e })));
    if (type === 'education')    setEditEdu(education.map(e => ({ ...e })));
    if (type === 'skills')       setEditSkills([...skills]);
    setModal(type);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let newPI = personalInfo, newExp = experiences, newEdu = education, newSkills = skills;
      if (modal === 'personalInfo') newPI = editPI;
      if (modal === 'experience')   newExp = editExp;
      if (modal === 'education')    newEdu = editEdu;
      if (modal === 'skills')       newSkills = editSkills;

      await saveProfile(userId, {
        personalInfo: newPI,
        experiences: newExp,
        education: newEdu,
        skills: newSkills,
      });

      setPersonalInfo(newPI);
      setExperiences(newExp);
      setEducation(newEdu);
      setSkills(newSkills);
      setModal(null);
      showToast('success', 'Hồ sơ đã được cập nhật!');
    } catch (err: any) {
      showToast('error', err.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };
  
  // ── CV Upload ─────────────────────────────────────────────────────────────
  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvUploading(true);
    try {
      const result = await uploadCV(file);
      setPersonalInfo(prev => ({ ...prev, cv_url: result.cv_url }));
      showToast('success', 'Upload CV thành công!');
    } catch (err: any) {
      showToast('error', err.message || 'Upload thất bại');
    } finally {
      setCvUploading(false);
      if (cvInputRef.current) cvInputRef.current.value = '';
    }
  };

  const handleCVDelete = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa CV này?')) return;
    try {
      await deleteCV();
      setPersonalInfo(prev => ({ ...prev, cv_url: null }));
      showToast('success', 'CV đã được xóa');
    } catch (err: any) {
      showToast('error', err.message || 'Xóa thất bại');
    }
  };



  const avatarInputRef = useRef<HTMLInputElement>(null);
const coverInputRef = useRef<HTMLInputElement>(null);


const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setAvatarSrc(reader.result as string);
  };
  reader.readAsDataURL(file);
};

const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setCoverSrc(reader.result as string);
  };
  reader.readAsDataURL(file);
};
  // ── Experience helpers ────────────────────────────────────────────────────
  const addExp = () => setEditExp(prev => [...prev, {
    company_name: '', position: '', description: '', start_date: '', end_date: ''
  }]);
  const removeExp = (i: number) => setEditExp(prev => prev.filter((_, idx) => idx !== i));
  const updateExp = (i: number, field: keyof WorkExperience, value: string) =>
    setEditExp(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));

  // ── Education helpers ─────────────────────────────────────────────────────
  const addEdu = () => setEditEdu(prev => [...prev, {
    school_name: '', major: '', description: '', start_date: '', end_date: ''
  }]);
  const removeEdu = (i: number) => setEditEdu(prev => prev.filter((_, idx) => idx !== i));
  const updateEdu = (i: number, field: keyof Education, value: string) =>
    setEditEdu(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e));

  // ── Skill helpers ─────────────────────────────────────────────────────────
  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !editSkills.includes(s)) { setEditSkills(prev => [...prev, s]); setNewSkill(''); }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  const [avatarSrc, setAvatarSrc] = useState<string>(DEFAULT_AVATAR);
const [coverSrc, setCoverSrc] = useState<string>(DEFAULT_COVER);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

      {/* ── Sidebar ── */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex-shrink-0 md:min-h-screen">
        <div className="p-6">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Dashboard</h2>
          <nav className="space-y-1">
            {SIDEBAR_NAV.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}>
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 mt-8">Tài khoản</h2>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <Settings className="w-5 h-5 text-gray-400" /> Cài đặt
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5 text-red-500" /> Đăng xuất
            </button>
          </nav>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 p-4 md:p-8 flex justify-center overflow-y-auto">
        <div className="w-full max-w-5xl">

          {/* ══ Profile Tab ══ */}
          {activeTab === 'profile' && (
            <div className="space-y-6">

              {/* ── Hero Card ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
  <div className="h-32 md:h-48 w-full relative">
    {loading
      ? <Skeleton className="w-full h-full rounded-none" />
      : <img src={coverSrc} alt="Cover" className="w-full h-full object-cover" />}

    {/* 🎯 Cover button */}
    <button
      onClick={() => coverInputRef.current?.click()}
      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg text-gray-700 hover:bg-white transition-colors shadow">
      <Edit2 className="w-4 h-4" />
    </button>

    {/* input cover ẩn */}
    <input
      type="file"
      ref={coverInputRef}
      accept="image/*"
      className="hidden"
      onChange={handleCoverChange}
    />
  </div>

  <div className="px-6 md:px-8 pb-8 relative">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 md:-mt-16 mb-4">
      <div className="relative w-24 h-24 md:w-32 md:h-32">
        {loading
          ? <Skeleton className="w-full h-full rounded-full" />
          : <img
              src={avatarSrc}
              alt="Avatar"
              className="w-full h-full rounded-full border-4 border-white object-cover shadow-md"
            />}

        {/* 🎯 Avatar button */}
        <button
          onClick={() => avatarInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow border border-gray-100 text-gray-600 hover:text-blue-600 transition-colors">
          <Edit2 className="w-4 h-4" />
        </button>

        {/* input avatar ẩn */}
        <input
          type="file"
          ref={avatarInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      {/* Nút này vẫn mở modal chỉnh thông tin */}
      <button
        onClick={() => openModal('personalInfo')}
        className="self-start md:self-auto px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
        <Edit2 className="w-4 h-4" /> Chỉnh sửa hồ sơ
      </button>
    </div>

    {loading ? (
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-72" />
        <Skeleton className="h-4 w-56" />
      </div>
    ) : (
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          {personalInfo.full_name || 'Chưa có tên'}
        </h1>
        <p className="text-lg text-gray-600 mt-1 font-medium">
          {personalInfo.title || 'Chưa có chức danh'}
        </p>
        {personalInfo.bio && (
          <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            {personalInfo.bio}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
          {personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {personalInfo.location}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.dob && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {personalInfo.dob}
            </span>
          )}
        </div>
      </div>
    )}
  </div>
</div>

              {/* ── Experience ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Kinh nghiệm làm việc</h2>
                  <button onClick={() => openModal('experience')}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>

                {loading ? (
                  <div className="space-y-6">
                    {[1,2].map(i => <Skeleton key={i} className="h-24" />)}
                  </div>
                ) : experiences.length === 0 ? (
                  <button onClick={() => openModal('experience')}
                    className="w-full py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm hover:border-blue-300 hover:text-blue-500 transition-colors flex flex-col items-center gap-2">
                    <Plus className="w-6 h-6" /> Thêm kinh nghiệm
                  </button>
                ) : (
                  <div className="space-y-6">
                    {experiences.map((exp, i) => (
                      <div key={i} className="relative pl-6 border-l-2 border-gray-100 pb-6 last:pb-0">
                        <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 ring-4 ring-white ${i === 0 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-blue-600 text-sm font-medium mb-1">{exp.company_name}</p>
                        <p className="text-xs text-gray-500 mb-2">
                          {exp.start_date} — {exp.end_date || 'Hiện tại'}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Education + Skills grid ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Education */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Học vấn</h2>
                    <button onClick={() => openModal('education')}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>

                  {loading ? <Skeleton className="h-20" /> :
                   education.length === 0 ? (
                    <button onClick={() => openModal('education')}
                      className="w-full py-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm hover:border-blue-300 hover:text-blue-500 transition-colors flex flex-col items-center gap-2">
                      <Plus className="w-5 h-5" /> Thêm học vấn
                    </button>
                  ) : (
                    <div className="space-y-4">
                      {education.map((edu, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                            <span className="font-bold text-blue-500 text-lg">
                              {edu.school_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{edu.school_name}</h3>
                            <p className="text-sm text-gray-600">{edu.major}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {edu.start_date} — {edu.end_date || 'Hiện tại'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Kỹ năng</h2>
                    <button onClick={() => openModal('skills')}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>

                  {loading ? <Skeleton className="h-16" /> : (
                    <div className="flex flex-wrap gap-2">
                      {skills.length === 0 ? (
                        <button onClick={() => openModal('skills')}
                          className="w-full py-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm hover:border-blue-300 hover:text-blue-500 transition-colors flex flex-col items-center gap-2">
                          <Plus className="w-5 h-5" /> Thêm kỹ năng
                        </button>
                      ) : (
                        <>
                          {skills.map(skill => (
                            <span key={skill}
                              className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg font-medium">
                              {skill}
                            </span>
                          ))}
                          <button onClick={() => openModal('skills')}
                            className="px-3 py-1.5 border border-dashed border-gray-300 text-gray-500 text-sm rounded-lg font-medium hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Thêm
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ── CV Upload ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Resume / CV</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload zone */}
                  <label className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group
                    ${cvUploading ? 'opacity-60 pointer-events-none' : 'hover:bg-gray-50 hover:border-blue-300 border-gray-200'}`}>
                    <input ref={cvInputRef} type="file" accept=".pdf,.docx"
                      onChange={handleCVUpload} className="hidden" />
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {cvUploading
                        ? <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                        : <UploadCloud className="w-6 h-6 text-blue-600" />}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {cvUploading ? 'Đang tải lên...' : 'Tải lên CV'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">PDF, DOCX tối đa 5MB</p>
                    <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 group-hover:border-blue-300">
                      Chọn file
                    </span>
                  </label>

                  {/* Current CV */}
                  {loading ? (
                    <Skeleton className="rounded-2xl h-40" />
                  ) : personalInfo.cv_url ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col">
                      <div className="flex items-start gap-4 mb-auto">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">
                            {personalInfo.cv_url.split('/').pop()}
                          </h3>
                          <p className="text-sm text-gray-500">CV đã tải lên</p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${personalInfo.cv_url}`}
                          target="_blank" rel="noreferrer"
                          className="flex-1 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center">
                          Xem
                        </a>
                        <button onClick={handleCVDelete}
                          className="flex-1 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                          <Trash2 className="w-4 h-4" /> Xóa
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-gray-400">
                      <FileText className="w-8 h-8 mb-2 opacity-40" />
                      <p className="text-sm">Chưa có CV nào</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ Other Tabs ══ */}
          {activeTab === 'cv-builder'  && <CVBuilder />}
          {activeTab === 'recommended' && <RecommendedJobs />}
          {!['profile','cv-builder','recommended'].includes(activeTab) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                {activeTab === 'applications'  && <Briefcase className="w-8 h-8 text-gray-400" />}
                {activeTab === 'saved'          && <Bookmark  className="w-8 h-8 text-gray-400" />}
                {activeTab === 'notifications'  && <Bell      className="w-8 h-8 text-gray-400" />}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {SIDEBAR_NAV.find(n => n.id === activeTab)?.label}
              </h2>
              <p className="text-gray-500 max-w-md">Tính năng đang được phát triển. Vui lòng quay lại sau.</p>
            </div>
          )}
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════ */}

      {/* ── Modal: Personal Info ── */}
      {modal === 'personalInfo' && (
        <EditModal title="Chỉnh sửa thông tin cá nhân" onClose={() => setModal(null)} onSave={handleSave} saving={saving}>
          <Field label="Họ và tên *">
            <input className={inputCls} placeholder="Nguyễn Văn A" value={editPI.full_name || ''}
              onChange={e => setEditPI(p => ({ ...p, full_name: e.target.value }))} />
          </Field>
          <Field label="Chức danh">
            <input className={inputCls} placeholder="Senior Frontend Engineer" value={editPI.title || ''}
              onChange={e => setEditPI(p => ({ ...p, title: e.target.value }))} />
          </Field>
          <Field label="Giới thiệu bản thân">
            <textarea className={inputCls + ' h-24 resize-none'} placeholder="Một vài dòng về bạn..."
              value={editPI.bio || ''}
              onChange={e => setEditPI(p => ({ ...p, bio: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Địa điểm">
              <input className={inputCls} placeholder="TP. Hồ Chí Minh" value={editPI.location || ''}
                onChange={e => setEditPI(p => ({ ...p, location: e.target.value }))} />
            </Field>
            <Field label="Số điện thoại">
              <input className={inputCls} placeholder="0901 234 567" value={editPI.phone || ''}
                onChange={e => setEditPI(p => ({ ...p, phone: e.target.value }))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ngày sinh">
              <input type="date" className={inputCls} value={editPI.dob || ''}
                onChange={e => setEditPI(p => ({ ...p, dob: e.target.value }))} />
            </Field>
            <Field label="Giới tính">
              <select className={inputCls} value={editPI.gender || ''}
                onChange={e => setEditPI(p => ({ ...p, gender: e.target.value as any }))}>
                <option value="">-- Chọn --</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </Field>
          </div>
        </EditModal>
      )}

      {/* ── Modal: Experience ── */}
      {modal === 'experience' && (
        <EditModal title="Chỉnh sửa kinh nghiệm" onClose={() => setModal(null)} onSave={handleSave} saving={saving}>
          {editExp.map((exp, i) => (
            <div key={i} className="p-4 border border-gray-100 rounded-xl space-y-3 relative bg-gray-50">
              <button onClick={() => removeExp(i)}
                className="absolute top-3 right-3 p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <Field label="Tên công ty">
                <input className={inputCls} placeholder="TechCorp Inc." value={exp.company_name}
                  onChange={e => updateExp(i, 'company_name', e.target.value)} />
              </Field>
              <Field label="Vị trí">
                <input className={inputCls} placeholder="Senior Frontend Engineer" value={exp.position}
                  onChange={e => updateExp(i, 'position', e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Từ ngày">
                  <input type="date" className={inputCls} value={exp.start_date}
                    onChange={e => updateExp(i, 'start_date', e.target.value)} />
                </Field>
                <Field label="Đến ngày">
                  <input type="date" className={inputCls} value={exp.end_date || ''}
                    onChange={e => updateExp(i, 'end_date', e.target.value)} />
                </Field>
              </div>
              <Field label="Mô tả">
                <textarea className={inputCls + ' h-20 resize-none'} placeholder="Mô tả công việc..."
                  value={exp.description}
                  onChange={e => updateExp(i, 'description', e.target.value)} />
              </Field>
            </div>
          ))}
          <button onClick={addExp}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-blue-300 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Thêm kinh nghiệm
          </button>
        </EditModal>
      )}

      {/* ── Modal: Education ── */}
      {modal === 'education' && (
        <EditModal title="Chỉnh sửa học vấn" onClose={() => setModal(null)} onSave={handleSave} saving={saving}>
          {editEdu.map((edu, i) => (
            <div key={i} className="p-4 border border-gray-100 rounded-xl space-y-3 relative bg-gray-50">
              <button onClick={() => removeEdu(i)}
                className="absolute top-3 right-3 p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <Field label="Trường học">
                <input className={inputCls} placeholder="Đại học Bách Khoa" value={edu.school_name}
                  onChange={e => updateEdu(i, 'school_name', e.target.value)} />
              </Field>
              <Field label="Chuyên ngành">
                <input className={inputCls} placeholder="Công nghệ thông tin" value={edu.major}
                  onChange={e => updateEdu(i, 'major', e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Từ năm">
                  <input type="date" className={inputCls} value={edu.start_date}
                    onChange={e => updateEdu(i, 'start_date', e.target.value)} />
                </Field>
                <Field label="Đến năm">
                  <input type="date" className={inputCls} value={edu.end_date || ''}
                    onChange={e => updateEdu(i, 'end_date', e.target.value)} />
                </Field>
              </div>
              <Field label="Mô tả">
                <textarea className={inputCls + ' h-16 resize-none'} placeholder="Thành tích, hoạt động..."
                  value={edu.description || ''}
                  onChange={e => updateEdu(i, 'description', e.target.value)} />
              </Field>
            </div>
          ))}
          <button onClick={addEdu}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-blue-300 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Thêm học vấn
          </button>
        </EditModal>
      )}

      {/* ── Modal: Skills ── */}
      {modal === 'skills' && (
        <EditModal title="Chỉnh sửa kỹ năng" onClose={() => setModal(null)} onSave={handleSave} saving={saving}>
          <div className="flex gap-2">
            <input className={inputCls} placeholder="VD: React, TypeScript..."
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
            <button onClick={addSkill}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex-shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-gray-50 rounded-xl border border-gray-100">
            {editSkills.length === 0 && (
              <span className="text-sm text-gray-400 m-auto">Nhập kỹ năng và nhấn Enter hoặc nút +</span>
            )}
            {editSkills.map(skill => (
              <span key={skill}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg font-medium">
                {skill}
                <button onClick={() => setEditSkills(prev => prev.filter(s => s !== skill))}
                  className="text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </EditModal>
      )}

      {/* ── Toast ── */}
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}