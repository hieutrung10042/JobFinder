import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Bookmark, 
  Bell, 
  Settings, 
  LogOut,
  Edit2,
  MapPin,
  Mail,
  UploadCloud,
  FileText,
  Plus,
  Trash2
} from 'lucide-react';

const SIDEBAR_NAV = [
  { id: 'profile', label: 'Profile', icon: User, active: true },
  { id: 'applications', label: 'My Applications', icon: Briefcase, active: false },
  { id: 'saved', label: 'Saved Jobs', icon: Bookmark, active: false },
  { id: 'notifications', label: 'Notifications', icon: Bell, active: false },
];

export default function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  const AVATAR_URL = "https://images.unsplash.com/photo-1762522926157-bcc04bf0b10a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3ODE0MzI0OHww&ixlib=rb-4.1.0&q=80&w=1080";
  const COVER_URL = "https://images.unsplash.com/photo-1646038572822-432f8ccf2522?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwYmFja2dyb3VuZCUyMGJsdWV8ZW58MXx8fHwxNzc3OTg4MTkyfDA&ixlib=rb-4.1.0&q=80&w=1080";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex-shrink-0 md:min-h-screen">
        <div className="p-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Dashboard</h2>
          <nav className="space-y-1">
            {SIDEBAR_NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 mt-8">Account</h2>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <Settings className="w-5 h-5 text-gray-400" />
              Settings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5 text-red-500" />
              Sign Out
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-5xl">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            
            {/* Header Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Cover Image */}
              <div className="h-32 md:h-48 w-full relative">
                <img src={COVER_URL} alt="Cover" className="w-full h-full object-cover" />
                <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg text-gray-700 hover:bg-white transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Profile Info */}
              <div className="px-6 md:px-8 pb-8 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 md:-mt-16 mb-4">
                  <div className="flex items-end gap-4">
                    <div className="relative">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-md">
                        <img src={AVATAR_URL} alt="User Avatar" className="w-full h-full object-cover" />
                      </div>
                      <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow border border-gray-100 text-gray-600 hover:text-blue-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <button className="self-start md:self-auto px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
                
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Alex Carter</h1>
                  <p className="text-lg text-gray-600 mt-1 font-medium">Senior Frontend Engineer & UI/UX Enthusiast</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      San Francisco, CA
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      alex.carter@example.com
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Experience</h2>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-gray-100 pb-6">
                  <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                  <h3 className="font-bold text-gray-900">Senior Frontend Engineer</h3>
                  <p className="text-blue-600 text-sm font-medium mb-1">TechCorp Inc.</p>
                  <p className="text-xs text-gray-500 mb-3">Jan 2021 - Present • 3 yrs 5 mos</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Led the migration of legacy monolithic architecture to a modern React/Next.js stack. Improved core web vitals by 40% and mentored a team of 4 junior developers.
                  </p>
                </div>
                <div className="relative pl-6 border-l-2 border-gray-100">
                  <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                  <h3 className="font-bold text-gray-900">Web Developer</h3>
                  <p className="text-blue-600 text-sm font-medium mb-1">Creative Solutions LLC</p>
                  <p className="text-xs text-gray-500 mb-3">Jun 2018 - Dec 2020 • 2 yrs 7 mos</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Developed responsive landing pages and web applications for various high-profile clients using React, Redux, and Tailwind CSS.
                  </p>
                </div>
              </div>
            </div>

            {/* Grid for Education & Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Education Section */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Education</h2>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                      <span className="font-bold text-gray-400 text-lg">U</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">University of Technology</h3>
                      <p className="text-sm text-gray-600">B.S. in Computer Science</p>
                      <p className="text-xs text-gray-500 mt-1">2014 - 2018</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Skills</h2>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'GraphQL', 'Figma', 'Git'].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg font-medium">
                      {skill}
                    </span>
                  ))}
                  <button className="px-3 py-1.5 border border-dashed border-gray-300 text-gray-500 text-sm rounded-lg font-medium hover:bg-gray-50 hover:text-gray-700 transition-colors flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* CV / Resume Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Resume / CV</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer group">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Upload Resume</h3>
                  <p className="text-sm text-gray-500 mb-4">PDF, DOCX up to 5MB</p>
                  <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 group-hover:border-blue-300">
                    Select File
                  </span>
                </div>

                {/* Current Resume */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col relative">
                  <div className="flex items-start gap-4 mb-auto">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">Alex_Carter_Resume_2024.pdf</h3>
                      <p className="text-sm text-gray-500">Uploaded on May 2, 2024 • 2.4 MB</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button className="flex-1 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      View
                    </button>
                    <button className="flex-1 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
        
        {/* Placeholder for other tabs */}
        {activeTab !== 'profile' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              {activeTab === 'applications' && <Briefcase className="w-8 h-8 text-gray-400" />}
              {activeTab === 'saved' && <Bookmark className="w-8 h-8 text-gray-400" />}
              {activeTab === 'notifications' && <Bell className="w-8 h-8 text-gray-400" />}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 capitalize">{activeTab.replace('-', ' ')}</h2>
            <p className="text-gray-500 max-w-md mx-auto">This section is currently empty or under construction. Check back later for updates.</p>
          </div>
        )}
      </main>
    </div>
  );
}
