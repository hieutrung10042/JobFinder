import React, { useState } from "react"
import { 
  CheckCircle, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  GraduationCap,
  Building2, 
  ShieldCheck, 
  Sparkles,
  AlertTriangle,
  Check
} from "lucide-react"
import { toast } from "sonner"

// Mock Data giữ nguyên
const pendingJobsData = [
  {
    id: "JOB-4829",
    title: "Senior React Developer",
    company: "TechNova Inc.",
    logo: "TN",
    logoBg: "bg-indigo-50 text-indigo-600",
    location: "Remote (US)",
    salaryMin: 120000,
    salaryMax: 160000,
    jobType: "Full-time",
    experience: "Senior (5+ yrs)",
    description: "We are looking for an experienced Senior React Developer to join our core product team. You will be responsible for architecting front-end solutions, mentoring junior developers, and collaborating directly with product and design to create seamless user experiences.\n\nOur stack is primarily React, TypeScript, Next.js, and Tailwind CSS. If you love building performant, accessible, and beautiful interfaces, we want to talk to you.",
    requirements: [
      "5+ years of production experience with React",
      "Deep understanding of TypeScript and modern JavaScript",
      "Experience with state management (Zustand, Redux, or similar)",
      "Strong background in responsive design and accessibility (WCAG)",
      "Ability to work independently in a remote environment"
    ]
  },
  {
    id: "JOB-4830",
    title: "Marketing Director",
    company: "BlueSky Corp",
    logo: "BS",
    logoBg: "bg-sky-50 text-sky-600",
    location: "New York, NY",
    salaryMin: 90000,
    salaryMax: 130000,
    jobType: "Hybrid",
    experience: "Director",
    description: "BlueSky Corp is seeking a dynamic Marketing Director to lead our go-to-market strategies. The ideal candidate will have a proven track record of driving growth through innovative B2B marketing campaigns.",
    requirements: [
      "7+ years in B2B marketing",
      "Experience managing a team of 5+ marketers",
      "Proficiency in Hubspot and Salesforce",
      "Budget management experience"
    ]
  },
  {
    id: "JOB-4831",
    title: "Crypto Trader Remote",
    company: "Unknown LLC",
    logo: "UN",
    logoBg: "bg-slate-100 text-slate-600",
    location: "Global Remote",
    salaryMin: 500000,
    salaryMax: 1000000,
    jobType: "Contract",
    experience: "Entry Level",
    description: "Earn massive returns working from home! We are a proprietary crypto trading firm. No experience required. We will train you to make thousands of dollars per day. \n\nNote: To get started and receive your trading workstation, a fully refundable $500 equipment deposit is required via CashApp or Bitcoin.",
    requirements: [
      "Willingness to learn",
      "Personal bank account for deposits",
      "Must be able to pay the $500 equipment fee"
    ]
  }
]

const QUICK_REASONS = ["Missing salary info", "Spam / Duplicate", "Inappropriate content", "Invalid application link", "Unverified"]

export function Jobs() {
  const [jobs, setJobs] = useState(pendingJobsData)
  const [reason, setReason] = useState('')

  const handleAction = (action: "approve" | "reject") => {
    const currentJob = jobs[0]
    
    if (action === "approve") {
      toast.success(`Job ${currentJob.id} approved successfully.`)
    } else {
      toast.error(`Job ${currentJob.id} rejected. ${reason ? `Reason: ${reason}` : 'Standard Rejection'}`)
    }

    // Xóa bài hiện tại khỏi hàng đợi và reset ô lý do
    setJobs(jobs.slice(1))
    setReason('')
  }

  // Giao diện khi hết bài để duyệt
  if (jobs.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-[#F8FAFC] animate-in fade-in duration-500 p-8 min-h-[600px]">
        <div className="w-24 h-24 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Review Queue Empty</h2>
        <p className="text-slate-500 text-center font-medium max-w-sm">
          You've successfully processed all pending job applications. Great work!
        </p>
      </div>
    )
  }

  const job = jobs[0] // Lấy bài đầu tiên trong hàng đợi

  return (
    <div className="p-6 md:p-8 bg-[#F8FAFC] min-h-screen">
      {/* Header trạng thái Queue */}
      <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Moderation Queue</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Reviewing job ID: {job.id}</p>
        </div>
        <span className="bg-blue-100 text-blue-700 text-sm font-bold px-4 py-2 rounded-xl">
          {jobs.length} Pending
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Cột Trái: Chi tiết công việc */}
        <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 md:p-10 flex flex-col animate-in slide-in-from-right-8 duration-500 fade-in">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 border-b border-gray-50 pb-8 mb-8">
            <div className="flex gap-6 items-start">
              <div className={`w-20 h-20 rounded-2xl border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm text-2xl font-black ${job.logoBg}`}>
                {job.logo}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                    New Submission
                  </span>
                  <span className="bg-green-50 text-green-600 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Pending Review
                  </span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{job.title}</h2>
                <p className="text-lg font-bold text-gray-500">{job.company}</p>
              </div>
            </div>
          </div>

          {/* Dải thông tin Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <MapPin className="w-5 h-5 text-gray-400 mb-2" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</p>
              <p className="text-sm font-bold text-gray-900">{job.location}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <DollarSign className="w-5 h-5 text-gray-400 mb-2" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Salary Range</p>
              <p className="text-sm font-bold text-gray-900">
                ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <Briefcase className="w-5 h-5 text-gray-400 mb-2" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Job Type</p>
              <p className="text-sm font-bold text-gray-900">{job.jobType}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <GraduationCap className="w-5 h-5 text-gray-400 mb-2" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Experience</p>
              <p className="text-sm font-bold text-gray-900">{job.experience}</p>
            </div>
          </div>

          <div className="space-y-10 flex-1">
            {/* Mô tả công việc */}
            <div>
              <h4 className="text-[13px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                Job Description
              </h4>
              <div className="prose prose-sm text-gray-600 font-medium leading-relaxed max-w-none whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Yêu cầu */}
            <div>
              <h4 className="text-[13px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                Key Requirements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {job.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm font-bold text-gray-700">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cột Phải: Bảng điều khiển (Dark Mode) */}
        <div className="bg-[#0A0A0B] rounded-[32px] shadow-2xl p-8 lg:p-10 text-white flex flex-col relative overflow-hidden h-fit sticky top-8 animate-in slide-in-from-bottom-8 duration-500 fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full opacity-20 blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-600 rounded-full opacity-10 blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 flex-1 flex flex-col">
            <div className="mb-8">
              <h3 className="text-2xl font-black mb-2">Moderation Action</h3>
              <p className="text-gray-400 text-sm font-medium">Review carefully before publishing to the live platform.</p>
            </div>
            
            <div className="flex-1 flex flex-col gap-6">
              {/* Nút từ chối nhanh */}
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Quick Rejection Notes</label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REASONS.map((chip, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setReason(chip)}
                      className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-colors ${
                        reason === chip 
                          ? 'bg-blue-600 border-blue-500 text-white' 
                          : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ô nhập lý do chi tiết */}
              <div className="flex-1 min-h-[150px] flex flex-col">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">
                  Reason Details
                </label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full flex-1 p-5 bg-gray-800/50 border border-gray-700 rounded-2xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Add specific notes or context here..."
                ></textarea>
              </div>
              
              {/* Nút hành động chính */}
              <div className="flex flex-col gap-4 pt-4 border-t border-gray-800">
                <button 
                  onClick={() => handleAction("approve")}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-2xl transition-all shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" /> Approve & Publish
                </button>
                
                <button 
                  onClick={() => handleAction("reject")}
                  className="w-full py-4 bg-transparent hover:bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5" /> Reject Posting
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}