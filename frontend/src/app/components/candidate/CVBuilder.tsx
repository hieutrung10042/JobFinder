import React, { useState } from 'react';
import { 
  Download, 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  Sparkles, 
  Palette, 
  LayoutTemplate,
  Plus, 
  Trash2, 
  MapPin, 
  Globe,
  GraduationCap,
  Wand2,
  Code2
} from 'lucide-react';

export const CVBuilder = () => {
  // UI State
  const [cvData, setCvData] = useState({
    template: 'modern',
    color: 'blue'
  });

  // Data States
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Alex Walker",
    title: "Senior Frontend Developer",
    email: "alex.walker@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "alexwalker.dev",
    summary: "Passionate Frontend Developer with 5+ years of experience building scalable web applications using React, TypeScript, and modern CSS frameworks. Strong focus on user experience and web accessibility."
  });

  const [experience, setExperience] = useState([
    {
      id: "1",
      company: "TechFlow Inc.",
      role: "Frontend Engineer",
      date: "Jan 2021 - Present",
      description: "Led the migration of legacy monolithic architecture to micro-frontends using React and Webpack. Improved Core Web Vitals score by 40%."
    },
    {
      id: "2",
      company: "Creative Cloud",
      role: "Web Developer",
      date: "Jun 2018 - Dec 2020",
      description: "Developed and maintained responsive e-commerce websites. Implemented complex state management using Redux."
    }
  ]);

  const [education, setEducation] = useState([
    {
      id: "1",
      school: "University of California, Berkeley",
      degree: "B.S. Computer Science",
      date: "2014 - 2018",
    }
  ]);

  const [skills, setSkills] = useState("ReactJS, TypeScript, NodeJS, Tailwind CSS, GraphQL, MySQL, Git");

  // Handlers
  const handleDownload = () => {
    alert("Simulating PDF download... Use html2pdf.js or react-to-print in production.");
  };

  const updatePersonalInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  // Experience Actions
  const updateExperience = (id: string, field: string, value: string) => {
    setExperience(experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const addExperience = () => {
    const newId = crypto.randomUUID?.() || Date.now().toString();
    setExperience([...experience, { id: newId, company: "", role: "", date: "", description: "" }]);
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter(exp => exp.id !== id));
  };

  // Education Actions
  const updateEducation = (id: string, field: string, value: string) => {
    setEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  const addEducation = () => {
    const newId = crypto.randomUUID?.() || Date.now().toString();
    setEducation([...education, { id: newId, school: "", degree: "", date: "" }]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  // Theme Config
  const THEMES: Record<string, string> = {
    blue: 'text-blue-600 border-blue-600 bg-blue-600 ring-blue-200',
    emerald: 'text-emerald-600 border-emerald-600 bg-emerald-600 ring-emerald-200',
    rose: 'text-rose-600 border-rose-600 bg-rose-600 ring-rose-200',
    violet: 'text-violet-600 border-violet-600 bg-violet-600 ring-violet-200'
  };

  const getThemeText = () => THEMES[cvData.color].split(' ')[0];
  const getThemeBorder = () => THEMES[cvData.color].split(' ')[1];
  const getThemeBg = () => THEMES[cvData.color].split(' ')[2];
  const getThemeRing = () => THEMES[cvData.color].split(' ')[3];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 h-[90vh] min-h-[850px]">
      
      {/* LEFT PANEL: Form Builder */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 lg:p-10 flex flex-col h-full overflow-hidden">
        <div className="mb-8 shrink-0">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Craft Your Identity</h2>
          <p className="text-gray-500 font-medium mt-2">Design a professional resume in minutes.</p>
        </div>

        <div className="space-y-10 flex-1 overflow-y-auto custom-scrollbar pr-4">
          
          {/* Style Controls */}
          <div className="flex flex-col xl:flex-row gap-6">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                <LayoutTemplate className="w-4 h-4" /> Layout Style
              </label>
              <div className="flex gap-3">
                <button 
                  onClick={() => setCvData(prev => ({ ...prev, template: 'modern' }))}
                  className={`flex-1 py-3 px-4 rounded-2xl text-sm font-bold transition-all border-2 ${cvData.template === 'modern' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                >
                  Modern
                </button>
                <button 
                  onClick={() => setCvData(prev => ({ ...prev, template: 'classic' }))}
                  className={`flex-1 py-3 px-4 rounded-2xl text-sm font-bold transition-all border-2 ${cvData.template === 'classic' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                >
                  Classic
                </button>
              </div>
            </div>

            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
                <Palette className="w-4 h-4" /> Accent Color
              </label>
              <div className="flex gap-3 h-[52px] items-center">
                {Object.keys(THEMES).map(color => (
                  <button
                    key={color}
                    onClick={() => setCvData(prev => ({ ...prev, color }))}
                    className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${cvData.color === color ? 'ring-4 ring-offset-2 ring-gray-200 scale-110' : 'hover:scale-110'}`}
                  >
                    <div className={`w-8 h-8 rounded-full ${THEMES[color].split(' ')[2]}`}></div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <input type="text" name="fullName" placeholder="Full Name" value={personalInfo.fullName} onChange={updatePersonalInfo} className={`w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 outline-none transition-all focus:${getThemeBorder()} ${getThemeRing()}`} />
              </div>
              <div className="col-span-2">
                <input type="text" name="title" placeholder="Professional Title" value={personalInfo.title} onChange={updatePersonalInfo} className={`w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 outline-none transition-all focus:${getThemeBorder()} ${getThemeRing()}`} />
              </div>
              <div>
                <input type="email" name="email" placeholder="Email Address" value={personalInfo.email} onChange={updatePersonalInfo} className={`w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 outline-none transition-all focus:${getThemeBorder()} ${getThemeRing()}`} />
              </div>
              <div>
                <input type="text" name="phone" placeholder="Phone Number" value={personalInfo.phone} onChange={updatePersonalInfo} className={`w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 outline-none transition-all focus:${getThemeBorder()} ${getThemeRing()}`} />
              </div>
              <div>
                <input type="text" name="location" placeholder="Location" value={personalInfo.location} onChange={updatePersonalInfo} className={`w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 outline-none transition-all focus:${getThemeBorder()} ${getThemeRing()}`} />
              </div>
              <div>
                <input type="text" name="website" placeholder="Website / Portfolio" value={personalInfo.website} onChange={updatePersonalInfo} className={`w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 outline-none transition-all focus:${getThemeBorder()} ${getThemeRing()}`} />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Professional Summary</h3>
              <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                <Sparkles className="w-3.5 h-3.5" /> AI Enhance
              </button>
            </div>
            <textarea name="summary" value={personalInfo.summary} onChange={updatePersonalInfo} className={`w-full h-28 p-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-4 outline-none resize-none transition-all focus:${getThemeBorder()} ${getThemeRing()}`}></textarea>
          </div>

          {/* Work Experience */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Work Experience</h3>
              <button onClick={addExperience} className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add New
              </button>
            </div>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="p-4 bg-gray-50 rounded-2xl space-y-4 relative group border border-transparent hover:border-gray-200 transition-colors">
                  <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-2 gap-3 pr-6">
                    <input type="text" placeholder="Job Title" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} className="w-full p-3 bg-white border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-300" />
                    <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="w-full p-3 bg-white border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-300" />
                    <div className="col-span-2">
                      <input type="text" placeholder="Dates (e.g. 2020 - Present)" value={exp.date} onChange={(e) => updateExperience(exp.id, 'date', e.target.value)} className="w-full p-3 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-600 focus:outline-none focus:border-blue-300" />
                    </div>
                    <div className="col-span-2">
                      <textarea placeholder="Description" value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} rows={3} className="w-full p-3 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-600 focus:outline-none focus:border-blue-300 resize-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Education</h3>
              <button onClick={addEducation} className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add New
              </button>
            </div>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="p-4 bg-gray-50 rounded-2xl space-y-4 relative group border border-transparent hover:border-gray-200 transition-colors">
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-2 gap-3 pr-6">
                    <input type="text" placeholder="School / University" value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} className="w-full p-3 bg-white border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-300" />
                    <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="w-full p-3 bg-white border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-300" />
                    <div className="col-span-2">
                      <input type="text" placeholder="Dates" value={edu.date} onChange={(e) => updateEducation(edu.id, 'date', e.target.value)} className="w-full p-3 bg-white border border-gray-100 rounded-xl text-sm font-medium text-gray-600 focus:outline-none focus:border-blue-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Skills</h3>
              <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                <Wand2 className="w-3.5 h-3.5" /> Format
              </button>
            </div>
            <textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="ReactJS, Node.js, Typescript..." className={`w-full h-24 p-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-4 outline-none resize-none transition-all focus:${getThemeBorder()} ${getThemeRing()}`}></textarea>
          </div>

        </div>
      </div>

      {/* RIGHT PANEL: Live Preview A4 */}
      <div className="bg-[#0A0A0B] rounded-[32px] shadow-2xl p-6 lg:p-10 flex flex-col relative overflow-hidden h-full">
        {/* Glow Effect */}
        <div className={`absolute top-0 right-0 w-80 h-80 ${getThemeBg()} rounded-full opacity-20 blur-[100px] pointer-events-none transition-colors duration-500`}></div>
        
        <div className="flex justify-between items-center mb-8 z-10 relative shrink-0">
          <div>
            <h3 className="text-xl font-bold text-white">Live Preview</h3>
            <p className="text-sm text-gray-400 font-medium">Auto-scaled Document</p>
          </div>
          <button onClick={handleDownload} className={`py-3 px-6 ${getThemeBg()} hover:opacity-90 text-white text-sm font-black rounded-2xl transition-all shadow-lg flex items-center gap-2`}>
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>

        {/* Paper Container - Tỷ lệ A4 với Aspect-Ratio không lỗi cuộn */}
        <div className="flex-1 flex items-center justify-center overflow-hidden z-10 relative perspective-1000">
          <div className={`w-full max-w-[460px] aspect-[1/1.414] bg-white rounded-sm shadow-2xl transition-all duration-500 overflow-y-auto custom-scrollbar ${cvData.template === 'classic' ? 'font-serif' : 'font-sans'}`}>
            
            {/* --- TEMPLATE 1: MODERN --- */}
            {cvData.template === 'modern' && (
              <div className="h-full flex flex-col">
                <div className={`p-8 pb-6 border-b-4 ${getThemeBorder()} bg-gray-50/50 shrink-0`}>
                  <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{personalInfo.fullName || 'Your Name'}</h1>
                  <p className={`${getThemeText()} font-bold text-sm mt-1.5`}>{personalInfo.title || 'Your Title'}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-5 text-[10px] text-gray-500 font-medium">
                    {personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3"/> {personalInfo.email}</span>}
                    {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3"/> {personalInfo.phone}</span>}
                    {personalInfo.location && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/> {personalInfo.location}</span>}
                    {personalInfo.website && <span className="flex items-center gap-1.5"><Globe className="w-3 h-3"/> {personalInfo.website}</span>}
                  </div>
                </div>

                <div className="p-8 space-y-7 flex-1 text-[11px]">
                  {personalInfo.summary && (
                    <div>
                      <h2 className="text-xs font-black uppercase text-gray-900 mb-3 flex items-center gap-2">
                        <User className={`w-4 h-4 ${getThemeText()}`} /> Profile
                      </h2>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{personalInfo.summary}</p>
                    </div>
                  )}

                  {experience.length > 0 && (
                    <div>
                      <h2 className="text-xs font-black uppercase text-gray-900 mb-3 flex items-center gap-2">
                        <Briefcase className={`w-4 h-4 ${getThemeText()}`} /> Experience
                      </h2>
                      <div className="space-y-4">
                        {experience.map(exp => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-0.5">
                              <h3 className="font-bold text-gray-900 text-[12px]">{exp.role}</h3>
                              <span className="text-[10px] text-gray-500 font-bold">{exp.date}</span>
                            </div>
                            <div className={`font-bold mb-1.5 text-[11px] ${getThemeText()}`}>{exp.company}</div>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {education.length > 0 && (
                    <div>
                      <h2 className="text-xs font-black uppercase text-gray-900 mb-3 flex items-center gap-2">
                        <GraduationCap className={`w-4 h-4 ${getThemeText()}`} /> Education
                      </h2>
                      <div className="space-y-3">
                        {education.map(edu => (
                          <div key={edu.id}>
                            <div className="flex justify-between items-baseline mb-0.5">
                              <h3 className="font-bold text-gray-900 text-[12px]">{edu.school}</h3>
                              <span className="text-[10px] text-gray-500 font-bold">{edu.date}</span>
                            </div>
                            <div className="text-gray-600 font-medium">{edu.degree}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {skills && (
                    <div>
                      <h2 className="text-xs font-black uppercase text-gray-900 mb-3 flex items-center gap-2">
                        <Code2 className={`w-4 h-4 ${getThemeText()}`} /> Skills
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.split(',').map((skill, idx) => {
                          const trimmed = skill.trim();
                          if (!trimmed) return null;
                          return (
                            <span key={idx} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-[10px] font-bold">
                              {trimmed}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- TEMPLATE 2: CLASSIC --- */}
            {cvData.template === 'classic' && (
              <div className="h-full flex flex-col items-center px-8 py-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">{personalInfo.fullName || 'Your Name'}</h1>
                <p className="text-xs text-gray-600 italic mb-3">{personalInfo.title || 'Your Title'}</p>
                <div className="text-[10px] text-gray-500 mb-8 border-b border-gray-200 pb-6 w-full flex flex-wrap justify-center gap-2.5">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  {personalInfo.email && personalInfo.phone && <span>•</span>}
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.phone && personalInfo.location && <span>•</span>}
                  {personalInfo.location && <span>{personalInfo.location}</span>}
                  {personalInfo.location && personalInfo.website && <span>•</span>}
                  {personalInfo.website && <span>{personalInfo.website}</span>}
                </div>
                
                <div className="w-full text-left space-y-7 px-2 text-[11px]">
                  {personalInfo.summary && (
                    <div>
                      <h2 className="text-[12px] font-bold uppercase tracking-widest text-gray-900 mb-3 text-center">Professional Profile</h2>
                      <p className="text-gray-700 leading-relaxed text-justify">{personalInfo.summary}</p>
                    </div>
                  )}
                  
                  {experience.length > 0 && (
                    <div>
                      <h2 className="text-[12px] font-bold uppercase tracking-widest text-gray-900 mb-3 text-center">Work Experience</h2>
                      <div className="space-y-4">
                        {experience.map(exp => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-0.5">
                              <h3 className="font-bold text-gray-900 text-[12px]">{exp.role}</h3>
                              <span className="text-[10px] text-gray-500">{exp.date}</span>
                            </div>
                            <div className="text-gray-800 font-medium italic mb-1.5">{exp.company}</div>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {education.length > 0 && (
                    <div>
                      <h2 className="text-[12px] font-bold uppercase tracking-widest text-gray-900 mb-3 text-center">Education</h2>
                      <div className="space-y-3">
                        {education.map(edu => (
                          <div key={edu.id}>
                            <div className="flex justify-between items-baseline mb-0.5">
                              <h3 className="font-bold text-gray-900 text-[12px]">{edu.school}</h3>
                              <span className="text-[10px] text-gray-500">{edu.date}</span>
                            </div>
                            <div className="text-gray-700">{edu.degree}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {skills && (
                    <div>
                      <h2 className="text-[12px] font-bold uppercase tracking-widest text-gray-900 mb-3 text-center">Core Competencies</h2>
                      <p className="text-gray-700 leading-relaxed text-center">{skills}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};