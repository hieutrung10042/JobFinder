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
  Wand2
} from 'lucide-react';

export const CVBuilder = () => {
  const [cvData, setCvData] = useState({
    fullName: 'Alex Carter',
    title: 'Senior Frontend Developer',
    email: 'alex.carter@example.com',
    phone: '+84 123 456 789',
    summary: 'Passionate frontend developer with 5+ years of experience building scalable web applications. Proven ability to lead migrations and optimize core web vitals.',
    experience: 'TechCorp Inc. (2020 - Present)\n- Led the migration from Vue to React, improving performance by 40%.\n- Mentored junior developers.\n\nCreative LLC (2018 - 2020)\n- Developed responsive landing pages.\n- Increased user engagement by 25%.',
    template: 'modern',
    color: 'blue'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCvData(prev => ({ ...prev, [name]: value }));
  };

  const THEMES: Record<string, string> = {
    blue: 'text-blue-600 border-blue-600 bg-blue-600',
    emerald: 'text-emerald-600 border-emerald-600 bg-emerald-600',
    rose: 'text-rose-600 border-rose-600 bg-rose-600',
    violet: 'text-violet-600 border-violet-600 bg-violet-600'
  };

  const getThemeText = () => THEMES[cvData.color].split(' ')[0];
  const getThemeBorder = () => THEMES[cvData.color].split(' ')[1];
  const getThemeBg = () => THEMES[cvData.color].split(' ')[2];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 min-h-[850px]">
      
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 lg:p-10 flex flex-col h-full overflow-y-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Craft Your Identity</h2>
          <p className="text-gray-500 font-medium mt-2">Design a professional resume in minutes.</p>
        </div>

        <div className="space-y-10 flex-1">
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

          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <input 
                  type="text" 
                  name="fullName" 
                  placeholder="Full Name"
                  value={cvData.fullName} 
                  onChange={handleInputChange} 
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all" 
                />
              </div>
              <div className="col-span-2">
                <input 
                  type="text" 
                  name="title" 
                  placeholder="Professional Title"
                  value={cvData.title} 
                  onChange={handleInputChange} 
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all" 
                />
              </div>
              <div>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email Address"
                  value={cvData.email} 
                  onChange={handleInputChange} 
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all" 
                />
              </div>
              <div>
                <input 
                  type="text" 
                  name="phone" 
                  placeholder="Phone Number"
                  value={cvData.phone} 
                  onChange={handleInputChange} 
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-900 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none transition-all" 
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Professional Summary</h3>
              <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                <Sparkles className="w-3.5 h-3.5" /> AI Enhance
              </button>
            </div>
            <textarea 
              name="summary" 
              value={cvData.summary} 
              onChange={handleInputChange} 
              className="w-full h-28 p-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium text-gray-900 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none resize-none transition-all"
            ></textarea>
          </div>

          <div>
             <div className="flex justify-between items-end mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Work Experience</h3>
              <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                <Wand2 className="w-3.5 h-3.5" /> Format
              </button>
            </div>
             <textarea 
              name="experience" 
              value={cvData.experience} 
              onChange={handleInputChange} 
              className="w-full h-40 p-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium text-gray-900 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none resize-none transition-all"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0A0B] rounded-[32px] shadow-2xl p-8 lg:p-10 flex flex-col relative overflow-hidden h-full">
        <div className={`absolute top-0 right-0 w-80 h-80 ${getThemeBg()} rounded-full opacity-20 blur-[100px] pointer-events-none transition-colors duration-500`}></div>
        
        <div className="flex justify-between items-center mb-10 z-10 relative">
          <div>
            <h3 className="text-xl font-bold text-white">Live Preview</h3>
            <p className="text-sm text-gray-400 font-medium">A4 Document Format</p>
          </div>
          <button className={`py-3 px-6 ${getThemeBg()} hover:opacity-90 text-white text-sm font-black rounded-2xl transition-all shadow-lg flex items-center gap-2`}>
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden z-10 relative perspective-1000">
          <div className={`w-full max-w-[420px] aspect-[1/1.414] bg-white rounded-sm shadow-2xl transition-all duration-500 overflow-hidden ${cvData.template === 'classic' ? 'font-serif p-10 text-center' : 'font-sans'}`}>
            
            {cvData.template === 'modern' && (
              <div className="h-full flex flex-col">
                <div className={`p-8 pb-6 border-b-4 ${getThemeBorder()} bg-gray-50/50`}>
                  <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{cvData.fullName || 'Your Name'}</h1>
                  <p className={`${getThemeText()} font-bold text-sm mt-1.5`}>{cvData.title || 'Your Title'}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-5 text-[10px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><Mail className="w-3 h-3"/> {cvData.email || 'email@example.com'}</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3"/> {cvData.phone || 'Phone Number'}</span>
                  </div>
                </div>

                <div className="p-8 space-y-8 flex-1">
                  <div>
                    <h2 className="text-xs font-black uppercase text-gray-900 mb-3 flex items-center gap-2">
                      <User className={`w-4 h-4 ${getThemeText()}`} /> Profile Summary
                    </h2>
                    <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap">{cvData.summary}</p>
                  </div>

                  <div>
                    <h2 className="text-xs font-black uppercase text-gray-900 mb-3 flex items-center gap-2">
                      <Briefcase className={`w-4 h-4 ${getThemeText()}`} /> Experience
                    </h2>
                    <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap">{cvData.experience}</p>
                  </div>
                </div>
              </div>
            )}

            {cvData.template === 'classic' && (
              <div className="h-full flex flex-col items-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{cvData.fullName || 'Your Name'}</h1>
                <p className="text-xs text-gray-600 italic mb-3">{cvData.title || 'Your Title'}</p>
                <div className="text-[10px] text-gray-500 mb-8 border-b border-gray-200 pb-6 w-full flex justify-center gap-3">
                  <span>{cvData.email}</span>
                  <span>•</span>
                  <span>{cvData.phone}</span>
                </div>
                
                <div className="w-full text-left space-y-8 px-2">
                  <div>
                    <h2 className="text-[12px] font-bold uppercase tracking-widest text-gray-900 mb-3 text-center">Professional Profile</h2>
                    <p className="text-[11px] text-gray-700 leading-relaxed text-justify">{cvData.summary}</p>
                  </div>
                  <div>
                    <h2 className="text-[12px] font-bold uppercase tracking-widest text-gray-900 mb-3 text-center">Work Experience</h2>
                    <p className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-wrap">{cvData.experience}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};