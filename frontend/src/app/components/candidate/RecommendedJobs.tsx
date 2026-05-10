import React from 'react';
import { MapPin, DollarSign, Clock, Bookmark, Building2, Flame, ArrowRight } from 'lucide-react';

const RECOMMENDED_JOBS = [
  { id: 'JOB-101', title: 'Senior Frontend Engineer', company: 'TechCorp Inc.', location: 'Ho Chi Minh City', salary: '$2000 - $3500', type: 'Full-time', match: 95 },
  { id: 'JOB-102', title: 'React Developer', company: 'Global Solutions', location: 'Remote', salary: '$1500 - $2500', type: 'Contract', match: 88 },
  { id: 'JOB-103', title: 'UI/UX Engineer', company: 'StartupX', location: 'Da Nang', salary: 'Negotiable', type: 'Full-time', match: 76 },
];

export const RecommendedJobs = () => {
  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Recommended Matches</h2>
          <p className="text-gray-500 font-medium mt-2">Curated opportunities based on your skills and experience.</p>
        </div>
        <button className="text-sm font-bold text-blue-600 hover:text-white hover:bg-blue-600 transition-all bg-blue-50 px-5 py-2.5 rounded-xl">
          View All Matches
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {RECOMMENDED_JOBS.map((job) => (
          <div 
            key={job.id} 
            className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 group flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-gray-50 rounded-[16px] border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-7 h-7 text-blue-600" />
              </div>
              
              {job.match >= 90 ? (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md">
                  <Flame className="w-3.5 h-3.5" />
                  {job.match}% Match
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black bg-green-50 text-green-700 border border-green-200">
                  {job.match}% Match
                </span>
              )}
            </div>
            
            <h3 className="text-xl font-black text-gray-900 leading-tight mb-1.5 group-hover:text-blue-600 transition-colors cursor-pointer line-clamp-1">
              {job.title}
            </h3>
            <p className="text-sm font-bold text-gray-500 mb-6">{job.company}</p>

            <div className="flex flex-wrap gap-2 mt-auto mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-gray-400" /> {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-600">
                <DollarSign className="w-3.5 h-3.5 text-gray-400" /> {job.salary}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-600">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> {job.type}
              </span>
            </div>

            <div className="flex items-center gap-3 pt-5 border-t border-gray-50">
              <button className="flex-1 py-3 bg-gray-900 hover:bg-blue-600 text-white text-sm font-black rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-600/20">
                Apply Now <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </button>
              <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-gray-100 hover:border-blue-100 bg-gray-50">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};