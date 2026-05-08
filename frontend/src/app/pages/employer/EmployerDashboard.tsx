import React from 'react';
import { 
  Briefcase, 
  Users, 
  MessageSquare, 
  Eye, 
  Plus, 
  MoreVertical, 
  MapPin, 
  Clock 
} from 'lucide-react';

const STATS = [
  { id: 1, label: 'Total Jobs', value: '12', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 2, label: 'Active Applications', value: '148', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 3, label: 'New Messages', value: '24', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 4, label: 'Total Views', value: '12.5k', icon: Eye, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const ACTIVE_JOBS = [
  { 
    id: 1, 
    title: 'Senior Frontend Engineer', 
    type: 'Full-time', 
    location: 'Remote', 
    posted: '2 days ago', 
    applications: 45, 
    status: 'Open' 
  },
  { 
    id: 2, 
    title: 'Product Designer', 
    type: 'Full-time', 
    location: 'New York, NY', 
    posted: '5 days ago', 
    applications: 32, 
    status: 'Open' 
  },
  { 
    id: 3, 
    title: 'Marketing Manager', 
    type: 'Contract', 
    location: 'London, UK', 
    posted: '1 week ago', 
    applications: 71, 
    status: 'Closed' 
  },
  { 
    id: 4, 
    title: 'DevOps Engineer', 
    type: 'Full-time', 
    location: 'Remote', 
    posted: '2 weeks ago', 
    applications: 0, 
    status: 'Open' 
  },
];

import { Link } from 'react-router';

export default function EmployerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Employer Dashboard</h1>
            <div className="flex space-x-8 border-b border-gray-200 mt-6">
              <Link to="/employer/dashboard" className="border-b-2 border-blue-600 pb-4 text-blue-600 font-medium text-sm transition-colors">
                Overview & Jobs
              </Link>
              <Link to="/employer/candidates" className="border-b-2 border-transparent pb-4 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors">
                Candidates
              </Link>
            </div>
          </div>
          <button className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm self-start mt-2">
            <Plus className="w-5 h-5" />
            Post a New Job
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {STATS.map((stat) => (
            <div key={stat.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Job Postings List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-24 sm:mb-8">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Active Job Postings</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Job Title</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Applications</th>
                  <th className="px-6 py-4 font-semibold">Posted</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {ACTIVE_JOBS.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 mb-1">{job.title}</div>
                      <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5" /> {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {job.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        job.status === 'Open' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${job.status === 'Open' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{job.applications}</span>
                        {job.applications > 0 && job.status === 'Open' && (
                          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">New</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 flex items-center gap-1.5 mt-2.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {job.posted}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <button className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-transform hover:scale-105 active:scale-95">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
