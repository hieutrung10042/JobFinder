import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  Calendar, 
  Briefcase,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router';

// Mock Data
const INITIAL_CANDIDATES = [
  { id: 1, name: 'Sarah Jenkins', job: 'Senior Frontend Engineer', exp: 'Senior', score: 95, date: '2024-05-01', status: 'Pending' },
  { id: 2, name: 'Michael Chen', job: 'Product Designer', exp: 'Mid-Level', score: 88, date: '2024-05-02', status: 'Interviewing' },
  { id: 3, name: 'Amanda Smith', job: 'Senior Frontend Engineer', exp: 'Mid-Level', score: 72, date: '2024-05-03', status: 'Rejected' },
  { id: 4, name: 'David Rodriguez', job: 'Marketing Manager', exp: 'Senior', score: 91, date: '2024-05-04', status: 'Hired' },
  { id: 5, name: 'Emma Wilson', job: 'Product Designer', exp: 'Entry', score: 65, date: '2024-05-05', status: 'Pending' },
  { id: 6, name: 'James Taylor', job: 'DevOps Engineer', exp: 'Senior', score: 82, date: '2024-05-06', status: 'Interviewing' },
  { id: 7, name: 'Olivia Brown', job: 'Senior Frontend Engineer', exp: 'Senior', score: 98, date: '2024-05-07', status: 'Pending' },
];

const JOB_POSTINGS = ['All Jobs', 'Senior Frontend Engineer', 'Product Designer', 'Marketing Manager', 'DevOps Engineer'];
const EXP_LEVELS = ['All Levels', 'Entry', 'Mid-Level', 'Senior', 'Director'];
const STATUSES = ['Pending', 'Interviewing', 'Hired', 'Rejected'];

export default function CandidateManagement() {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [filterJob, setFilterJob] = useState('All Jobs');
  const [filterExp, setFilterExp] = useState('All Levels');

  // Derived filtered data
  const filteredCandidates = candidates.filter(c => {
    const matchJob = filterJob === 'All Jobs' || c.job === filterJob;
    const matchExp = filterExp === 'All Levels' || c.exp === filterExp;
    return matchJob && matchExp;
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 75) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-full">
        
        {/* Header & Sub-nav */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Employer Dashboard</h1>
          <div className="flex space-x-8 border-b border-gray-200 mt-6">
            <Link to="/employer/dashboard" className="border-b-2 border-transparent pb-4 text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors">
              Overview & Jobs
            </Link>
            <Link to="/employer/candidates" className="border-b-2 border-blue-600 pb-4 text-blue-600 font-medium text-sm transition-colors">
              Candidates
            </Link>
          </div>
        </div>

        {/* Toolbar: Filters & View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Job Filter */}
            <div className="relative">
              <select 
                value={filterJob}
                onChange={(e) => setFilterJob(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm w-full sm:w-auto"
              >
                {JOB_POSTINGS.map(job => <option key={job} value={job}>{job}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Experience Filter */}
            <div className="relative">
              <select 
                value={filterExp}
                onChange={(e) => setFilterExp(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm w-full sm:w-auto"
              >
                {EXP_LEVELS.map(exp => <option key={exp} value={exp}>{exp}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg self-start sm:self-auto shrink-0">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutGrid className="w-4 h-4" /> Board
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="w-4 h-4" /> Table
            </button>
          </div>
        </div>

        {/* Content Area */}
        {viewMode === 'kanban' ? (
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory flex-1">
            {STATUSES.map(status => (
              <div key={status} className="w-80 min-w-[320px] flex-shrink-0 snap-start flex flex-col">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-bold text-gray-900">{status}</h3>
                  <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                    {filteredCandidates.filter(c => c.status === status).length}
                  </span>
                </div>
                
                <div className="flex flex-col gap-4 flex-1 rounded-2xl bg-gray-100/50 p-3 min-h-[500px]">
                  {filteredCandidates.filter(c => c.status === status).map(candidate => (
                    <div key={candidate.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm leading-tight">{candidate.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{candidate.exp}</p>
                          </div>
                        </div>
                        
                        <div className="relative group">
                          <select 
                            value={candidate.status}
                            onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                            className="text-xs bg-gray-50 border border-gray-200 text-gray-600 rounded-md py-1 pl-2 pr-6 appearance-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate">{candidate.job}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>Applied {candidate.date}</span>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getScoreColor(candidate.score)}`}>
                          {candidate.score}% Match
                        </span>
                        <button className="text-gray-400 hover:text-blue-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredCandidates.filter(c => c.status === status).length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8 border-2 border-dashed border-gray-200 rounded-xl">
                      No candidates
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Candidate</th>
                    <th className="px-6 py-4 font-semibold">Job Posting</th>
                    <th className="px-6 py-4 font-semibold">Match Score</th>
                    <th className="px-6 py-4 font-semibold">Applied Date</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{candidate.name}</div>
                            <div className="text-xs text-gray-500">{candidate.exp}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {candidate.job}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getScoreColor(candidate.score)}`}>
                          {candidate.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {candidate.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block w-36">
                          <select 
                            value={candidate.status}
                            onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                            className="w-full bg-white border border-gray-200 text-gray-700 rounded-lg py-2 pl-3 pr-8 appearance-none text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer shadow-sm"
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No candidates match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
