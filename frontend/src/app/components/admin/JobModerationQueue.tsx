import React, { useState } from 'react';
import { 
  Check, 
  X, 
  MapPin, 
  Building2, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  AlertTriangle,
  Briefcase
} from 'lucide-react';

export const JobModerationQueue = () => {
  const [reason, setReason] = useState('');

  const QUICK_REASONS = [
    "Missing salary info",
    "Spam / Duplicate",
    "Inappropriate content",
    "Invalid application link"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      
      <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-gray-100 p-10 flex flex-col">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 border-b border-gray-50 pb-8 mb-8">
          <div className="flex gap-6 items-start">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                  New Submission
                </span>
                <span className="bg-green-50 text-green-600 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Company
                </span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Senior React Developer</h2>
              <p className="text-lg font-bold text-gray-500">TechCorp Inc.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <MapPin className="w-5 h-5 text-gray-400 mb-2" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</p>
            <p className="text-sm font-bold text-gray-900">Ho Chi Minh City</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <DollarSign className="w-5 h-5 text-gray-400 mb-2" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Salary Range</p>
            <p className="text-sm font-bold text-gray-900">$2,000 - $3,500</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <Briefcase className="w-5 h-5 text-gray-400 mb-2" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Job Type</p>
            <p className="text-sm font-bold text-gray-900">Full-time</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <Clock className="w-5 h-5 text-gray-400 mb-2" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Experience</p>
            <p className="text-sm font-bold text-gray-900">5+ Years</p>
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-10 flex gap-4 items-start">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 text-sm mb-1">AI Content Analysis</h4>
            <p className="text-sm text-blue-700/80 font-medium">
              This job posting appears safe. No discriminatory language detected. Formatting is standard. Salary range aligns with market average for this role.
            </p>
          </div>
        </div>

        <div className="space-y-10 flex-1">
          <div>
            <h4 className="text-[13px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              Job Description
            </h4>
            <div className="prose prose-sm text-gray-600 font-medium leading-relaxed max-w-none">
              <p>
                We are looking for a highly skilled Senior React Developer to lead our dynamic Frontend team. 
                You will be responsible for architecting, building, and maintaining scalable web applications using React 18 and Next.js.
              </p>
              <p className="mt-4">
                You will work directly with the CTO and cross-functional teams to shape the system architecture, 
                optimize core web vitals, and establish frontend best practices across the organization.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              Key Requirements
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "5+ years of professional React development",
                "Deep understanding of Next.js & SSR",
                "Strong TypeScript proficiency",
                "Experience with Tailwind CSS & UI Libraries",
                "Familiarity with CI/CD pipelines",
                "Excellent communication skills"
              ].map((req, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm font-bold text-gray-700">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0B] rounded-[32px] shadow-2xl p-8 lg:p-10 text-white flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full opacity-20 blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600 rounded-full opacity-10 blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="mb-8">
            <h3 className="text-2xl font-black mb-2">Moderation Action</h3>
            <p className="text-gray-400 text-sm font-medium">Review carefully before publishing to the live platform.</p>
          </div>
          
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Quick Rejection Notes</label>
              <div className="flex flex-wrap gap-2">
                {QUICK_REASONS.map((chip, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setReason(chip)}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs font-bold text-gray-300 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

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
            
            <div className="flex flex-col gap-4 pt-4 border-t border-gray-800">
               <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-2xl transition-all shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Approve & Publish
              </button>
              
              <button className="w-full py-4 bg-transparent hover:bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-black rounded-2xl transition-all flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Reject Posting
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};