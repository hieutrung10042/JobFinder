import React from 'react';
import { MapPin, DollarSign, Clock, Building, Twitter, Linkedin, Link as LinkIcon, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router';

export default function JobDetail() {
  const { id } = useParams();

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
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Senior Frontend Engineer</h1>
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
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg whitespace-nowrap">
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
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] sm:hidden z-50">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 font-bold shadow-md transition-all">
          Apply Now
        </button>
      </div>
    </div>
  );
}
