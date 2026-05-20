import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  DollarSign,
  Clock,
  Building,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  ArrowLeft,
  CheckCircle2,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- Logic State và Hàm điều khiển Modal ---
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyStep, setApplyStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // States cho Form Data
  const [formData, setFormData] = useState({
    resume: null as File | null,
    coverLetter: "",
    yearsExperience: "",
    remoteComfort: "",
  });

  const handleApply = () => {
    setShowApplyModal(true);
    setApplyStep(1);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowApplyModal(false);
    document.body.style.overflow = "unset";
  };

  const nextStep = () => {
    if (applyStep === 3) {
      handleSubmitApplication();
    } else {
      setApplyStep((prev) => prev + 1);
    }
  };
  const prevStep = () => setApplyStep((prev) => prev - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, resume: e.target.files[0] });
    }
  };

  // Logic gửi API - Giữ nguyên giao diện, thêm logic xử lý
  const handleSubmitApplication = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        job_id: id,
        cover_letter: formData.coverLetter,
        experience: formData.yearsExperience,
        remote_comfort: formData.remoteComfort,
      };

      await axios.post("http://127.0.0.1:5000/api/applications/apply", payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      setApplyStep(4);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error submitting application.";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`https://web-development-course-43yy.onrender.com/api/jobs/${id}`);
        setJob(res.data.data);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <div className="p-10 text-left font-bold text-gray-500">Loading...</div>;
  if (!job) return <div className="p-10 text-left text-red-500 font-bold">Job not found!</div>;

  const getLogoUrl = (url: string) => {
    if (!url) return "https://ui-avatars.com/api/?name=Company&background=random";
    if (url.startsWith("http")) return url;
    return `http://127.0.0.1:5000${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 text-left font-sans">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to all jobs
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Job Main Info */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                      <Building className="w-4 h-4" /> {job.company_name || "Verified Company"}
                    </div>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location_name || "Remote"}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.job_type}</span>
                    <span className="flex items-center gap-1 text-gray-900 font-bold">
                      <DollarSign className="w-4 h-4" /> {job.salary_min ? `$${job.salary_min / 1000}k - $${job.salary_max / 1000}k` : "Negotiable"}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>

            {/* Description Sections */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About the Role</h2>
              <p className="text-gray-600 leading-relaxed mb-10 whitespace-pre-line">{job.description}</p>
              
              {[{ label: "Requirements", data: job.requirements }, { label: "Benefits", data: job.benefit }].map((section, index) => {
                if (!section.data) return null;
                return (
                  <div key={index} className="mb-10 last:mb-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-5">{section.label}</h3>
                    <div className="space-y-4">
                      {section.data.split("\n").map((line: string, i: number) => line.trim() && (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${section.label === "Benefits" ? "text-green-500" : "text-blue-600"}`} />
                          <span className="text-gray-600 leading-relaxed font-medium">{line.replace(/^[•-]\s*/, "")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-5">About the Company</h3>
              <div className="flex items-center gap-4 mb-6 group">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm flex-shrink-0">
                  <img src={getLogoUrl(job.logo_url)} alt="Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight">{job.company_name || "Verified Company"}</h4>
                  <button className="text-blue-600 text-sm font-medium hover:underline">View company profile</button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-3">{job.company_desc}</p>
              <a href={job.website} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                <LinkIcon className="w-4 h-4" /> {job.website?.replace(/^https?:\/\//, "") || "website.io"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] sm:hidden z-40">
        <button onClick={handleApply} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 font-bold shadow-md">Apply Now</button>
      </div>

      {/* --- APPLICATION MODAL --- */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm text-left">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {applyStep === 4 ? 'Application Sent' : `Apply for ${job.title}`}
              </h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {applyStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Step 1: Resume / CV</h3>
                    <label className="block relative cursor-pointer group mb-4">
                      <input type="radio" name="resume_choice" className="peer sr-only" defaultChecked onChange={() => {}}/>
                      <div className="p-4 border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 rounded-xl flex items-start gap-4">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Profile Resume</p>
                          <p className="text-sm text-gray-500 dark:text-slate-400">Sử dụng CV mặc định trong hồ sơ cá nhân</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 ml-auto" />
                      </div>
                    </label>
                    <label className="block relative cursor-pointer group">
                      <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileChange} />
                      <div className={`p-4 border-2 border-dashed rounded-xl flex items-start gap-4 transition-colors ${formData.resume ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 hover:border-gray-300 dark:border-slate-700'}`}>
                        <div className="w-6 h-6 rounded bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <Upload className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{formData.resume ? formData.resume.name : "Cập nhật CV mới"}</p>
                          <p className="text-sm text-gray-500 dark:text-slate-400">PDF, DOCX up to 5MB (Optional)</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {applyStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Step 2: Cover Letter (Optional)</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Introduce yourself and explain why you're a strong candidate.</p>
                    <textarea 
                      rows={6}
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                      placeholder="Write your cover letter here..."
                      className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-white placeholder-gray-400"
                    ></textarea>
                  </div>
                </div>
              )}

              {applyStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Step 3: Employer Questions</h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">How many years of experience? <span className="text-red-500">*</span></label>
                        <select 
                          value={formData.yearsExperience}
                          onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
                          className="w-full p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        >
                          <option value="">Select an option</option>
                          <option value="1-2">1-2 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="5+">5+ years</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">Remote comfortable? <span className="text-red-500">*</span></label>
                        <div className="flex gap-4">
                          {['Yes', 'No'].map((val) => (
                            <label key={val} className="flex items-center gap-2">
                              <input 
                                type="radio" 
                                name="remote" 
                                checked={formData.remoteComfort === val}
                                onChange={() => setFormData({...formData, remoteComfort: val})}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" 
                              />
                              <span className="text-gray-700 dark:text-slate-300">{val}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {applyStep === 4 && (
                <div className="py-8 text-center animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h3>
                  <p className="text-gray-600 dark:text-slate-300 mb-8 max-w-sm mx-auto">
                    Your application for {job.title} has been sent to {job.company_name || 'Employer'}. Good luck!
                  </p>
                  <Link to="/applications" onClick={closeModal} className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                    View My Applications
                  </Link>
                </div>
              )}
            </div>

            {/* Modal Footer (Đúng giao diện gốc bạn gửi) */}
            {applyStep < 4 && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 flex items-center justify-between sticky bottom-0">
                {applyStep > 1 ? (
                  <button onClick={prevStep} className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Back
                  </button>
                ) : (
                  <div></div>
                )}
                
                {applyStep < 3 ? (
                  <button onClick={nextStep} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                    Continue
                  </button>
                ) : (
                  <button 
                    onClick={nextStep} 
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Processing..." : "Submit Application"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}