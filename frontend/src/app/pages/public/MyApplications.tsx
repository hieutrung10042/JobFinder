import React from 'react';
import { Building, MapPin, Clock, Search, Filter, MoreVertical } from 'lucide-react';
import { Link } from 'react-router';

// Mock data
const applications = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    company: 'TechFlow',
    location: 'Remote, US',
    type: 'Full-time',
    appliedDate: 'Oct 24, 2023',
    status: 'Under Review',
    logoUrl: 'https://images.unsplash.com/photo-1760037028517-e5cc6e3ebd3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG1pbmltYWxpc3QlMjB0ZWNoJTIwbG9nb3xlbnwxfHx8fDE3NzgxNzI2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 2,
    title: 'React Developer',
    company: 'CreativePulse',
    location: 'New York, NY',
    type: 'Contract',
    appliedDate: 'Oct 20, 2023',
    status: 'Interviewing',
    logoUrl: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?auto=format&fit=crop&q=80&w=100&h=100',
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'DesignSpace',
    location: 'London, UK',
    type: 'Full-time',
    appliedDate: 'Oct 15, 2023',
    status: 'Applied',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100&h=100',
  },
  {
    id: 4,
    title: 'Frontend Developer',
    company: 'InnovateCorp',
    location: 'Austin, TX',
    type: 'Full-time',
    appliedDate: 'Oct 02, 2023',
    status: 'Rejected',
    logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=100&h=100',
  }
];

export default function MyApplications() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Applied':
        return <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wide">Applied</span>;
      case 'Under Review':
        return <span className="px-3 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 rounded-full text-xs font-bold uppercase tracking-wide">Under Review</span>;
      case 'Interviewing':
        return <span className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wide">Interviewing</span>;
      case 'Rejected':
        return <span className="px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wide">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">My Applications</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Track and manage the jobs you've applied to.</p>
          </div>
        </div>

        {/* Filters bar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by job title or company..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:text-white"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                
                {/* Logo & Status (Mobile) */}
                <div className="flex items-start justify-between sm:hidden w-full">
                  <img src={app.logoUrl} alt={`${app.company} logo`} className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-slate-700" />
                  {getStatusBadge(app.status)}
                </div>

                {/* Logo (Desktop) */}
                <img src={app.logoUrl} alt={`${app.company} logo`} className="hidden sm:block w-16 h-16 rounded-xl object-cover border border-gray-100 dark:border-slate-700 flex-shrink-0" />
                
                {/* Info Content */}
                <div className="flex-1">
                  <Link to="/job/1" className="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {app.title}
                  </Link>
                  
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-sm text-gray-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-slate-300">
                      <Building className="w-4 h-4 text-gray-400" />
                      {app.company}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {app.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {app.type}
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500 dark:text-slate-500 font-medium">
                    Applied {app.appliedDate}
                  </div>
                </div>

                {/* Status & Actions (Desktop) */}
                <div className="hidden sm:flex flex-col items-end justify-between self-stretch">
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  <div className="mt-auto">
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                {/* Actions (Mobile) */}
                <div className="sm:hidden border-t border-gray-100 dark:border-slate-700 pt-3 mt-1 flex justify-end">
                  <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}