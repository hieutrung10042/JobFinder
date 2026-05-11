import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Linkedin, 
  MapPin, 
  Download, 
  FileText, 
  Calendar, 
  XCircle, 
  ChevronDown, 
  CheckCircle2, 
  MessageSquare,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { Link, useParams } from 'react-router';

export default function CandidateDetail() {
  const { id } = useParams();
  const [status, setStatus] = useState('Under Review');
  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState([
    { id: 1, author: 'Alex Manager', date: 'Oct 24, 2023', text: 'Strong portfolio. Really liked the e-commerce project they built.' }
  ]);

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    setNotes([...notes, { id: Date.now(), author: 'You', date: 'Just now', text: noteInput }]);
    setNoteInput('');
  };

  const statusColors: Record<string, string> = {
    'New': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    'Under Review': 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
    'Interviewing': 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
    'Hired': 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
    'Rejected': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200 pb-24 lg:pb-12">
      {/* Top Navigation */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 py-4 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/employer/candidates" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        
        {/* Candidate Header */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-sm mb-6 flex flex-col md:flex-row md:items-start justify-between gap-6 transition-colors">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
              SJ
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Sarah Jenkins</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusColors[status]}`}>
                  {status}
                </span>
              </div>
              <p className="text-lg font-medium text-gray-600 dark:text-slate-300 mb-4">Applied for <span className="font-bold text-gray-900 dark:text-white">Senior Frontend Engineer</span></p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> sarah.jenkins@example.com</div>
                <div className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> +1 (555) 123-4567</div>
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> San Francisco, CA</div>
                <div className="flex items-center gap-1.5"><Linkedin className="w-4 h-4" /> /in/sarahjenkins</div>
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                <XCircle className="w-4 h-4 text-red-500" />
                Reject
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm">
                <Calendar className="w-4 h-4" />
                Schedule Interview
              </button>
            </div>
            <div className="relative w-full">
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 py-2.5 pl-4 pr-10 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors"
              >
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Left Column (2/3) - CV Viewer & Skills */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Built-in PDF Viewer (Mock) */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col transition-colors h-[600px]">
              {/* PDF Header */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-300">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Sarah_Jenkins_CV.pdf
                </div>
                <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              
              {/* PDF Content Area */}
              <div className="flex-1 bg-gray-200 dark:bg-slate-950 p-4 sm:p-8 overflow-y-auto">
                {/* Simulated PDF Page */}
                <div className="bg-white mx-auto shadow-sm max-w-2xl min-h-full p-8 sm:p-12 text-sm text-gray-800 font-serif">
                  <h2 className="text-2xl font-bold mb-1 uppercase tracking-wider text-black">Sarah Jenkins</h2>
                  <p className="text-gray-500 mb-6">Senior Frontend Engineer</p>
                  
                  <div className="mb-6">
                    <h3 className="font-bold border-b border-gray-300 pb-1 mb-2 uppercase text-xs tracking-wider text-black">Summary</h3>
                    <p className="leading-relaxed text-gray-700">Detail-oriented Senior Frontend Engineer with 5+ years of experience building scalable web applications. Proficient in React, TypeScript, and modern CSS frameworks.</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold border-b border-gray-300 pb-1 mb-2 uppercase text-xs tracking-wider text-black">Experience</h3>
                    <div className="mb-4">
                      <div className="flex justify-between font-bold text-black">
                        <span>Frontend Lead @ TechCorp</span>
                        <span>2020 - Present</span>
                      </div>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                        <li>Led a team of 4 engineers to rebuild the core dashboard in React.</li>
                        <li>Improved application load time by 40% using code splitting and lazy loading.</li>
                        <li>Implemented comprehensive unit and E2E testing strategies.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary of Skills and Experience */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-sm transition-colors">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Candidate Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                    <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Professional Experience
                  </h4>
                  <div className="space-y-4">
                    <div className="pl-4 border-l-2 border-gray-200 dark:border-slate-700">
                      <p className="font-bold text-gray-900 dark:text-white">Frontend Lead</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">TechCorp • 2020 - Present</p>
                    </div>
                    <div className="pl-4 border-l-2 border-gray-200 dark:border-slate-700">
                      <p className="font-bold text-gray-900 dark:text-white">Web Developer</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">StartupInc • 2018 - 2020</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'GraphQL', 'Jest', 'Figma'].map(skill => (
                      <span key={skill} className="bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-slate-300 px-3 py-1 rounded-lg text-sm font-medium border border-gray-200 dark:border-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (1/3) - Actions & Notes */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Mobile Actions block (Visible only on mobile/tablet) */}
            <div className="lg:hidden bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Actions</h3>
              <div className="relative w-full">
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 py-3 pl-4 pr-10 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm">
                <Calendar className="w-5 h-5" />
                Schedule Interview
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                <XCircle className="w-5 h-5 text-red-500" />
                Reject Candidate
              </button>
            </div>

            {/* Notes Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col h-[500px] transition-colors">
              <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-t-2xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Internal Notes</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gray-50/50 dark:bg-slate-900/30">
                {notes.map(note => (
                  <div key={note.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{note.author}</span>
                      <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{note.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="p-4 sm:p-5 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-2xl">
                <div className="relative">
                  <textarea 
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Add a note for your team..."
                    rows={3}
                    className="w-full p-3 pr-12 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
                  ></textarea>
                  <button 
                    onClick={handleAddNote}
                    className="absolute bottom-3 right-3 p-1.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}