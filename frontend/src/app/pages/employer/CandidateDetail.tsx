import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Phone, Linkedin, Github, Globe, Download, Printer, ChevronRight, Briefcase, FileText, Send, Loader2 } from 'lucide-react';
import { applicationService } from '../../../services/applicationService';
import { ApplicationDetail, ApplicationNote } from '../../../types/application';

export default function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  
  const [candidate, setCandidate] = useState<ApplicationDetail | null>(null);
  const [notes, setNotes] = useState<ApplicationNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Đây là chữ hiển thị trên UI
  const steps = ['Pending', 'Reviewed', 'Interview', 'Hired'];

  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        const [detailRes, notesRes] = await Promise.all([
          applicationService.getApplicationById(id),
          applicationService.getNotes(Number(id))
        ]);
        setCandidate(detailRes.data.data);
        setNotes(notesRes.data.data || []);
      } catch (error) {
        console.error("Lỗi fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !id) return;
    try {
      const res = await applicationService.addNote(Number(id), newNote);
      setNotes([...notes, res.data.data]);
      setNewNote('');
    } catch (error) {
      console.error("Lỗi thêm note:", error);
      alert("Không thể thêm ghi chú lúc này.");
    }
  };

  const handleUpdateStatus = async (stepLabel: string) => {
    if (!candidate || !id) return;
    
    // Chuyển đổi tên step UI sang giá trị ENUM của MySQL
    let backendStatus = stepLabel.toLowerCase(); 
    if (backendStatus === 'interview') backendStatus = 'interviewing';
    // Đã sửa 'hired' thành 'accepted' cho khớp CSDL
    if (backendStatus === 'hired') backendStatus = 'accepted'; 

    if (candidate.status?.toLowerCase() === backendStatus) return;

    const oldStatus = candidate.status;
    
    // 1. Cập nhật UI ngay lập tức
    setCandidate({ ...candidate, status: backendStatus });

    try {
      // 2. Gửi giá trị backendStatus lên API
      if (applicationService.updateStatus) {
        await applicationService.updateStatus(Number(id), backendStatus);
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      setCandidate({ ...candidate, status: oldStatus });
      alert("Lỗi 400: Không thể cập nhật trạng thái do sai định dạng Backend.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-blue-600">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!candidate) {
    return <div className="text-center py-12 text-gray-500">Không tìm thấy ứng viên.</div>;
  }

  // Xác định step hiện tại để tô màu active
  let activeStep = 0;
  switch (candidate.status?.toLowerCase()) {
    case 'pending': activeStep = 0; break;
    case 'reviewed': activeStep = 1; break;
    case 'interviewing': 
    case 'interview': activeStep = 2; break;
    case 'accepted': 
    case 'hired': activeStep = 3; break;
    default: activeStep = 0;
  }

  // ĐÃ THÊM: Hàm xác định màu sắc dựa trên trạng thái
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      case 'interviewing': 
      case 'interview': return 'bg-purple-100 text-purple-700';
      case 'accepted': 
      case 'hired': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const displayName = candidate.full_name || candidate.candidate_name || 'Ứng viên';
  
  const cvFile = candidate.cv_url || ''; 
  const cleanCvFile = cvFile.replace(/^(?:\/?uploads\/)+/, ''); 
  const cvLink = `http://localhost:5000/uploads/${cleanCvFile}`;

  return (
    <div className="flex flex-col gap-6 font-sans pb-12 h-full max-w-7xl mx-auto">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-2 mt-4">
        <Link to="/employer/candidates" className="hover:text-blue-600 transition-colors">Candidates</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-gray-900 font-medium">{displayName}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                {candidate.experience_level && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full border-2 border-white whitespace-nowrap">
                    {candidate.experience_level}
                  </div>
                )}
              </div>
              
              <h1 className="text-xl font-bold text-gray-900 mt-2">{displayName}</h1>
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5 mt-1">
                <Briefcase className="w-4 h-4" />
                {candidate.job_title || 'Ứng viên'}
              </p>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 text-sm">
                <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                <span className="font-medium text-gray-700 truncate">{candidate.candidate_email}</span>
              </div>
              
              {candidate.phone && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 text-sm">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="font-medium text-gray-700">{candidate.phone}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              <button className="flex flex-col items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-400 hover:text-blue-600">
                <Linkedin className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">LinkedIn</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-400 hover:text-blue-600">
                <Github className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">GitHub</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-400 hover:text-blue-600">
                <Globe className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Portfolio</span>
              </button>
            </div>

            {candidate.skills && candidate.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bio</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {candidate.bio || 'Chưa có thông tin giới thiệu.'}
              </p>
            </div>

          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="w-full flex-1 flex flex-col gap-6">
          
          {/* 1. Application Status */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Application Status</h3>
                <p className="text-sm text-gray-500 mt-1">Applied on {new Date(candidate.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              
              {/* Badge đổi màu theo trạng thái */}
              <div className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${getStatusColor(candidate.status)}`}>
                {candidate.status || 'Action Required'}
              </div>
            </div>
            
            {/* Timeline */}
            <div className="relative flex items-center justify-between w-full mt-6 px-2 pb-8">
              
              {/* Đường kẻ ngang đã được fix để không lố */}
              <div className="absolute left-6 right-6 top-3 h-1 bg-gray-200 z-0 rounded-full">
                <div 
                  className="absolute left-0 top-0 h-full bg-blue-600 z-0 rounded-full transition-all duration-500"
                  style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>
              
              {steps.map((step, index) => {
                const isCompleted = index <= activeStep;
                return (
                  <div 
                    key={step} 
                    className="relative z-10 flex flex-col items-center cursor-pointer group"
                    onClick={() => handleUpdateStatus(step)}
                  >
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${
                        isCompleted 
                          ? 'bg-blue-600 text-white ring-4 ring-white' 
                          : 'bg-gray-200 text-gray-500 ring-4 ring-white group-hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className={`text-xs font-medium absolute top-9 whitespace-nowrap transition-colors ${
                      isCompleted ? 'text-gray-900 font-bold' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Cover Letter */}
          {candidate.cover_letter && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> Cover Letter
              </h3>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed pl-4 border-l-2 border-blue-600 whitespace-pre-wrap">
                  {candidate.cover_letter}
                </p>
              </div>
            </div>
          )}

          {/* 3. Resume Document */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Resume Document</h3>
              <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-gray-700 transition-colors">
                  <Printer className="w-5 h-5" />
                </button>
                <a 
                  href={cvLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              </div>
            </div>
            
            <div className="w-full h-[600px] bg-slate-50 rounded-xl border border-gray-200 relative overflow-hidden">
               {cleanCvFile ? (
                 <iframe 
                    src={cvLink} 
                    className="w-full h-full border-0 absolute inset-0 z-10" 
                    title="CV Viewer" 
                 />
               ) : (
                 <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                   Chưa có file đính kèm
                 </div>
               )}
            </div>
          </div>

          {/* 4. HR Notes */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1.5 h-full bg-blue-600"></div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-1 ml-2">HR Notes</h3>
            <p className="text-xs text-gray-400 mb-4 ml-2">Internal workspace. Candidate cannot see these notes.</p>
            
            {notes.length > 0 && (
              <div className="mb-4 space-y-3 ml-2">
                {notes.map(note => (
                  <div key={note.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900">{note.username || note.display_name || 'HR Team'}</span>
                      <span className="text-xs text-gray-400">{new Date(note.created_at).toLocaleString('vi-VN')}</span>
                    </div>
                    <p className="text-gray-700">{note.content}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="relative ml-2">
              <textarea 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors resize-none placeholder:text-gray-400 text-gray-900 min-h-[100px]"
                placeholder="Add your interview feedback or internal notes here..."
              ></textarea>
              <button 
                onClick={handleAddNote}
                className="absolute bottom-3 right-3 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}