import React, { useState } from 'react';
import { 
  MapPin, DollarSign, Clock, Building, Twitter, Linkedin, 
  Link as LinkIcon, ArrowLeft, CheckCircle2, Upload, FileText, X 
} from 'lucide-react';
// Sửa thành react-router-dom cho chuẩn web
import { Link, useParams } from 'react-router-dom';

export default function JobDetail() {
  const { id } = useParams();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyStep, setApplyStep] = useState(1); // 1: CV, 2: Cover Letter, 3: Questionnaire, 4: Success

  const handleApply = () => {
    setShowApplyModal(true);
    setApplyStep(1);
    // Khóa cuộn trang nền khi mở Modal
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowApplyModal(false);
    // Mở lại cuộn trang
    document.body.style.overflow = 'unset';
  };

  const nextStep = () => setApplyStep(prev => prev + 1);
  const prevStep = () => setApplyStep(prev => prev - 1);

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 sm:pb-12">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all jobs
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (70%) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Senior Frontend Engineer {id ? `#${id}` : ''}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600 mb-6">
                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      <Building className="w-4 h-4" />
                      <span>TechFlow</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>Remote, US</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Full-time</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>$120k - $150k</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm prose prose-blue max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600">
              <h2 className="text-xl font-bold text-gray-900 mb-4 mt-0">About the Role</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                We are looking for a Senior Frontend Engineer to join our core product team. You will be responsible for building out new features, improving performance, and ensuring a seamless user experience across our platform. You'll work closely with design and product teams to translate complex requirements into elegant, intuitive interfaces.
              </p>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-3 mb-8">
                {[
                  '5+ years of experience with React and modern frontend frameworks.',
                  'Deep understanding of web performance, accessibility, and security.',
                  'Experience with TypeScript, Tailwind CSS, and state management.',
                  'Strong communication skills and ability to mentor junior engineers.',
                  'A portfolio or GitHub profile showcasing relevant projects.'
                ].map((req, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{req}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Benefits</h3>
              <ul className="space-y-3">
                {[
                  'Competitive salary and equity package.',
                  '100% remote work with flexible hours.',
                  'Unlimited PTO and paid family leave.',
                  'Comprehensive health, dental, and vision insurance.',
                  '$2,000 annual learning and development stipend.'
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column (30%) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About the Company</h3>
              <div className="flex items-center gap-4 mb-4">
                <img src="https://images.unsplash.com/photo-1760037028517-e5cc6e3ebd3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG1pbmltYWxpc3QlMjB0ZWNoJTIwbG9nb3xlbnwxfHx8fDE3NzgxNzI2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="TechFlow Logo" className="w-16 h-16 rounded-xl border border-gray-100 object-cover" />
                <div>
                  <h4 className="font-bold text-gray-900">TechFlow</h4>
                  <a href="#" className="text-blue-600 text-sm hover:underline">View company profile</a>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-5">
                TechFlow is a fast-growing startup building the next generation of workflow automation tools for modern enterprises.
              </p>
              <a href="#" className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <LinkIcon className="w-4 h-4" />
                techflow.io
              </a>
            </div>

            {/* Share */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Share this job</h3>
              <div className="flex items-center gap-2">
                <button className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-xl hover:bg-[#1DA1F2]/20 transition-colors">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-[#0A66C2]/10 text-[#0A66C2] rounded-xl hover:bg-[#0A66C2]/20 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </button>
                <button className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Related Jobs */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Related Jobs</h3>
              <div className="space-y-4">
                {[
                  { title: 'Frontend Developer', comp: 'InnovateSpace', loc: 'New York, NY' },
                  { title: 'React Engineer', comp: 'CreativePulse', loc: 'Remote' }
                ].map((job, idx) => (
                  <Link to={`/job/${idx + 2}`} key={idx} className="block group">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span>{job.comp}</span>
                      <span>•</span>
                      <span>{job.loc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Apply Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] sm:hidden z-40 transition-colors">
        <button onClick={handleApply} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 font-bold shadow-md transition-all">
          Apply Now
        </button>
      </div>

      {/* Apply Overlay Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {applyStep === 4 ? 'Application Sent' : 'Apply for Senior Frontend Engineer'}
              </h2>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Step 1: CV Selection */}
              {applyStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Step 1: Resume / CV</h3>
                    
                    <label className="block relative cursor-pointer group mb-4">
                      <input type="radio" name="resume_choice" className="peer sr-only" defaultChecked />
                      <div className="p-4 border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 rounded-xl flex items-start gap-4">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">john_doe_resume_2024.pdf</p>
                          <p className="text-sm text-gray-500 dark:text-slate-400">Last updated: 2 days ago (From Profile)</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 ml-auto opacity-100" />
                      </div>
                    </label>

                    <label className="block relative cursor-pointer group">
                      <input type="radio" name="resume_choice" className="peer sr-only" />
                      <div className="p-4 border-2 border-gray-200 dark:border-slate-700 peer-checked:border-blue-500 rounded-xl flex items-start gap-4 hover:border-gray-300 dark:hover:border-slate-600 transition-colors">
                        <div className="w-6 h-6 rounded bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                          <Upload className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Upload New Resume</p>
                          <p className="text-sm text-gray-500 dark:text-slate-400">PDF, DOCX up to 5MB</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 ml-auto opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Cover Letter */}
              {applyStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Step 2: Cover Letter (Optional)</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Introduce yourself and explain why you're a strong candidate for this role.</p>
                    
                    <textarea 
                      rows={6}
                      placeholder="Write your cover letter here..."
                      className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-white placeholder-gray-400"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step 3: Questionnaire */}
              {applyStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Step 3: Employer Questions</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">TechFlow has requested brief answers to the following questions.</p>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                          How many years of experience do you have with React? <span className="text-red-500">*</span>
                        </label>
                        <select className="w-full p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
                          <option value="">Select an option</option>
                          <option value="1-2">1-2 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="5+">5+ years</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                          Are you comfortable working in a fully remote environment? <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input type="radio" name="remote" className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                            <span className="text-gray-700 dark:text-slate-300">Yes</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="radio" name="remote" className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                            <span className="text-gray-700 dark:text-slate-300">No</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {applyStep === 4 && (
                <div className="py-8 text-center animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted!</h3>
                  <p className="text-gray-600 dark:text-slate-300 mb-8 max-w-sm mx-auto">
                    Your application for Senior Frontend Engineer has been sent to TechFlow. Good luck!
                  </p>
                  <Link to="/applications" onClick={closeModal} className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                    View My Applications
                  </Link>
                </div>
              )}
            </div>

            {/* Modal Footer (Hidden on Success) */}
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
                  <button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
                    Submit Application
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