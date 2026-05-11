import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Briefcase, Bookmark, Bell, Settings, LogOut, Edit2, MapPin, Mail,
  UploadCloud, FileText, Plus, Trash2, Sparkles, PenTool, X, Save, Loader2,
  Phone, Globe, Github, Linkedin, Facebook, GraduationCap
} from 'lucide-react';

import { RecommendedJobs } from '../../components/candidate/RecommendedJobs';
import { CVBuilder } from '../../components/candidate/CVBuilder';

const API_URL = "http://localhost:5000/api";

const SIDEBAR_NAV = [
  { id: 'profile', label: 'Profile', icon: User, active: true },
  { id: 'cv-builder', label: 'CV Builder', icon: PenTool, active: false },
  { id: 'recommended', label: 'Recommended Jobs', icon: Sparkles, active: false },
  { id: 'applications', label: 'My Applications', icon: Briefcase, active: false },
  { id: 'saved', label: 'Saved Jobs', icon: Bookmark, active: false },
  { id: 'notifications', label: 'Notifications', icon: Bell, active: false },
];

export default function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const userId = 1; 

  // --- 1. STATE ---
  const [avatarUrl, setAvatarUrl] = useState("https://via.placeholder.com/150");
  const [coverUrl, setCoverUrl] = useState("https://via.placeholder.com/1000x300");
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [profileInfo, setProfileInfo] = useState({
    name: "Alex Carter",
    title: "Senior Frontend Engineer",
    location: "San Francisco, CA",
    email: "alex.carter@example.com",
    phone: "",
    gender: "male",
    dob: "",
    bio: "" 
  });

  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    github: '',
    facebook: ''
  });

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...profileInfo, ...socialLinks });

  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]); 
  const [isAddEduOpen, setIsAddEduOpen] = useState(false);
  const [eduForm, setEduForm] = useState({ school: '', degree: '', period: '', description: '' });

  const [isAddExpOpen, setIsAddExpOpen] = useState(false);
  const [expForm, setExpForm] = useState({ role: '', company: '', period: '', description: '' });

  const [skills, setSkills] = useState<string[]>([]);
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const [cvFile, setCvFile] = useState<any>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  // --- 2. FETCH DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/profile/${userId}`);
        const result = await response.json();
        
        if (result.success) {
          const info = result.personalInfo;
          setProfileInfo({
            name: info.full_name || "",
            title: info.title || "",
            location: info.location_display || "N/A",
            email: info.email || "",
            phone: info.phone || "",
            gender: info.gender || "male",
            dob: info.dob ? info.dob.split('T')[0] : "", 
            bio: info.bio || ""
          });

          if (info.social_links) {
            try {
              const parsedLinks = typeof info.social_links === 'string' 
                ? JSON.parse(info.social_links) 
                : info.social_links;
              setSocialLinks({
                linkedin: parsedLinks.linkedin || '',
                github: parsedLinks.github || '',
                facebook: parsedLinks.facebook || ''
              });
            } catch (e) { console.error("Lỗi parse social_links"); }
          }

          setAvatarUrl(info.avatar_url || "https://via.placeholder.com/150");
          setCoverUrl(info.cover_url || "https://via.placeholder.com/1000x300");
          
          const mappedExps = result.experiences.map((exp: any) => ({
            id: exp.id,
            role: exp.position,
            company: exp.company_name,
            period: exp.period_text || `${exp.start_date} - ${exp.end_date}`,
            description: exp.description
          }));
          setExperiences(mappedExps);

          const mappedEdu = (result.education || []).map((edu: any) => ({
            id: edu.id,
            school: edu.school_name,
            degree: edu.degree,
            period: edu.period_text,
            description: edu.description
          }));
          setEducation(mappedEdu);

          setSkills(result.skills || []);
          
          if (info.cv_url) {
            setCvFile({ name: info.cv_url.split('/').pop(), size: "N/A", date: "Đã lưu" });
          }
        }
      } catch (err) {
        console.error("Lỗi đồng bộ dữ liệu:", err);
      }
    };
    fetchProfile();
  }, []);

  // --- 3. SAVE TO DATABASE ---
  const handleSaveToDatabase = async () => {
    setIsLoading(true);
    
    const payload = {
      userId: userId,
      personalInfo: {
        full_name: profileInfo.name,
        title: profileInfo.title,
        bio: profileInfo.bio,
        phone: profileInfo.phone,
        gender: profileInfo.gender,
        dob: profileInfo.dob,
        avatar_url: avatarUrl,
        cover_url: coverUrl,
        cv_url: cvFile?.name || null,
        social_links: JSON.stringify(socialLinks)
      },
      experiences: experiences.map(exp => ({
        company_name: exp.company,
        position: exp.role,
        description: exp.description,
        period_text: exp.period 
      })),
      education: education.map(edu => ({
        school_name: edu.school,
        degree: edu.degree,
        description: edu.description,
        period_text: edu.period, 
        gpa: "N/A"
      })),
      skills: skills
    };

    try {
      const response = await fetch(`${API_URL}/profile/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success) {
        alert("🎉 Toàn bộ thông tin đã được đồng bộ với máy chủ!");
      }
    } catch (error) {
      alert("Lỗi server, vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'avatar') setAvatarUrl(reader.result as string);
        if (type === 'cover') setCoverUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        date: new Date().toLocaleDateString()
      });
    }
  };

  const saveExperience = () => {
    if (expForm.role && expForm.company) {
      setExperiences([{ ...expForm, id: Date.now() }, ...experiences]);
      setExpForm({ role: '', company: '', period: '', description: '' });
      setIsAddExpOpen(false);
    }
  };

  const saveEducation = () => {
    if (eduForm.school && eduForm.degree) {
      setEducation([{ ...eduForm, id: Date.now() }, ...education]);
      setEduForm({ school: '', degree: '', period: '', description: '' });
      setIsAddEduOpen(false);
    }
  };

  const handleApplyEdit = () => {
    setProfileInfo({
      ...profileInfo,
      name: editForm.name,
      title: editForm.title,
      location: editForm.location,
      email: editForm.email,
      phone: editForm.phone,
      gender: editForm.gender,
      dob: editForm.dob,
      bio: editForm.bio // Cập nhật Bio mới
    });
    setSocialLinks({
      linkedin: editForm.linkedin,
      github: editForm.github,
      facebook: editForm.facebook
    });
    setIsEditProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative text-black">
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex-shrink-0 md:min-h-screen">
        <div className="p-6">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Dashboard</h2>
          <nav className="space-y-1">
            {SIDEBAR_NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-black hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 flex justify-center overflow-y-auto">
        <div className="w-full max-w-5xl">
          
          {activeTab === 'profile' && (
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-extrabold text-black">Candidate Profile</h1>
              <button 
                onClick={handleSaveToDatabase}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg disabled:bg-gray-400 transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isLoading ? "Saving..." : "Save All Changes"}
              </button>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-32 md:h-48 w-full relative">
                  <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                  <button onClick={() => coverRef.current?.click()} className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg text-black hover:bg-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <input type="file" ref={coverRef} hidden onChange={(e) => handleImageUpload(e, 'cover')} />
                </div>
                
                <div className="px-6 md:px-8 pb-8 relative">
                  <div className="flex justify-between items-end -mt-12 md:-mt-16 mb-4">
                    <div className="relative">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden">
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <button onClick={() => avatarRef.current?.click()} className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow border text-black hover:bg-gray-50"><Edit2 className="w-4 h-4" /></button>
                      <input type="file" ref={avatarRef} hidden onChange={(e) => handleImageUpload(e, 'avatar')} />
                    </div>
                    <button onClick={() => { setEditForm({...profileInfo, ...socialLinks}); setIsEditProfileOpen(true); }} className="px-6 py-2.5 bg-white border border-black text-black font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2">
                      <Edit2 className="w-4 h-4 text-black" /> Edit Profile
                    </button>
                  </div>
                  
                  <h1 className="text-2xl font-extrabold text-black">{profileInfo.name}</h1>
                  <p className="text-lg font-bold text-black">{profileInfo.title}</p>

                  {/* HIỂN THỊ BIO TẠI ĐÂY */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 className="text-xs uppercase font-black text-gray-400 mb-1">About Me</h3>
                    <p className="text-sm font-medium leading-relaxed">
                      {profileInfo.bio || "No bio available. Tell us something about yourself!"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mt-4 text-sm font-bold text-black border-t pt-4">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{profileInfo.location}</span>
                    <span className="flex items-center gap-2"><Mail className="w-4 h-4" />{profileInfo.email}</span>
                    <span className="flex items-center gap-2"><Phone className="w-4 h-4" />{profileInfo.phone || "No phone"}</span>
                    <span className="flex items-center gap-2"><User className="w-4 h-4" />{profileInfo.gender} • {profileInfo.dob || "N/A"}</span>
                  </div>

                  <div className="flex gap-4 mt-6">
                    {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 rounded-lg hover:text-blue-600"><Linkedin className="w-5 h-5" /></a>}
                    {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 rounded-lg hover:text-gray-600"><Github className="w-5 h-5" /></a>}
                    {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="p-2 bg-gray-100 rounded-lg hover:text-blue-800"><Facebook className="w-5 h-5" /></a>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-black">Experience</h2>
                    <button onClick={() => setIsAddExpOpen(true)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-6 flex-1">
                    {experiences.map((exp) => (
                      <div key={exp.id || Math.random()} className="relative pl-6 border-l-2 border-black pb-6 last:pb-0">
                        <div className="absolute w-3 h-3 bg-black rounded-full -left-[7.5px] top-1.5 ring-4 ring-white"></div>
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-bold text-lg text-black">{exp.role || exp.position}</h3>
                            <p className="text-blue-700 font-bold text-sm">{exp.company || exp.company_name}</p>
                            <p className="text-xs font-bold text-black mb-2">{exp.period || exp.period_text}</p>
                            <p className="text-sm text-black font-medium">{exp.description}</p>
                          </div>
                          <button onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))} className="text-black hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {experiences.length === 0 && <p className="text-gray-400 text-sm italic">No experience added yet.</p>}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-black flex items-center gap-2">
                      <GraduationCap className="w-6 h-6"/> Education
                    </h2>
                    <button onClick={() => setIsAddEduOpen(true)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-6 flex-1">
                    {education.map((edu) => (
                      <div key={edu.id || Math.random()} className="relative pl-6 border-l-2 border-blue-600 pb-6 last:pb-0">
                        <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[7.5px] top-1.5 ring-4 ring-white"></div>
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-bold text-lg text-black">{edu.school}</h3>
                            <p className="text-blue-700 font-bold text-sm">{edu.degree}</p>
                            <p className="text-xs font-bold text-black mb-2">{edu.period}</p>
                            <p className="text-sm text-black font-medium">{edu.description}</p>
                          </div>
                          <button onClick={() => setEducation(education.filter(e => e.id !== edu.id))} className="text-black hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {education.length === 0 && <p className="text-gray-400 text-sm italic">No education added yet.</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-bold text-black mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-gray-100 border border-black rounded-lg text-sm font-bold text-black flex items-center gap-2">
                      {skill}
                      <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setSkills(skills.filter(s => s !== skill))} />
                    </span>
                  ))}
                  {isAddingSkill ? (
                    <input 
                      autoFocus className="px-3 py-1 border-2 border-black rounded-lg text-sm font-bold text-black outline-none w-28"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value;
                          if (val && !skills.includes(val)) setSkills([...skills, val]);
                          setIsAddingSkill(false);
                        }
                      }}
                      onBlur={() => setIsAddingSkill(false)}
                    />
                  ) : (
                    <button onClick={() => setIsAddingSkill(true)} className="px-3 py-1.5 border border-dashed border-black rounded-lg text-sm font-bold text-black flex items-center gap-1 hover:bg-gray-50"><Plus className="w-4 h-4" /> Add</button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-bold text-black mb-4">Upload CV</h2>
                {cvFile ? (
                  <div className="flex items-center justify-between p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-600 rounded-xl text-white"><FileText className="w-6 h-6" /></div>
                      <div>
                        <p className="font-bold text-black">{cvFile.name}</p>
                        <p className="text-xs text-gray-500">{cvFile.size} • {cvFile.date}</p>
                      </div>
                    </div>
                    <button onClick={() => setCvFile(null)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ) : (
                  <div 
                    onClick={() => cvRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                  >
                    <div className="p-4 bg-gray-50 rounded-full text-gray-400 group-hover:text-blue-500 group-hover:bg-white transition-all"><UploadCloud className="w-8 h-8" /></div>
                    <div className="text-center">
                      <p className="font-bold text-black">Click to upload CV</p>
                      <p className="text-sm text-gray-500">PDF, DOCX up to 10MB</p>
                    </div>
                    <input type="file" ref={cvRef} hidden accept=".pdf,.doc,.docx" onChange={handleCvUpload} />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'cv-builder' && <CVBuilder />}
          {activeTab === 'recommended' && <RecommendedJobs />}
        </div>
      </main>

      {/* MODAL EDIT PROFILE & SOCIAL LINKS - ĐÃ THÊM Ô NHẬP BIO */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border-2 border-black text-black font-bold my-8">
            <div className="p-6 border-b border-black flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="font-extrabold text-xl">Edit Profile & Social Links</h3>
              <X className="cursor-pointer" onClick={() => setIsEditProfileOpen(false)} />
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase mb-1 block">Full Name</label>
                    <input placeholder="Name" className="w-full p-3 border-2 border-black rounded-xl outline-none" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs uppercase mb-1 block">Job Title</label>
                    <input placeholder="Job Title" className="w-full p-3 border-2 border-black rounded-xl outline-none" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs uppercase mb-1 block">Email</label>
                    <input placeholder="Email" className="w-full p-3 border-2 border-black rounded-xl outline-none" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs uppercase mb-1 block">Phone Number</label>
                    <input placeholder="Phone" className="w-full p-3 border-2 border-black rounded-xl outline-none" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs uppercase mb-1 block">Gender</label>
                    <select className="w-full p-3 border-2 border-black rounded-xl outline-none bg-white" value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase mb-1 block">Date of Birth</label>
                    <input type="date" className="w-full p-3 border-2 border-black rounded-xl outline-none" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} />
                  </div>
                </div>

                {/* Ô NHẬP BIO MỚI THÊM */}
                <div className="pt-2">
                  <label className="text-xs uppercase mb-1 block">Short Bio (About Me)</label>
                  <textarea 
                    placeholder="Tell something about yourself..." 
                    rows={4} 
                    className="w-full p-3 border-2 border-black rounded-xl outline-none font-medium" 
                    value={editForm.bio} 
                    onChange={e => setEditForm({...editForm, bio: e.target.value})} 
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-extrabold mb-3 flex items-center gap-2"><Globe className="w-4 h-4"/> Social Media Links</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5"/>
                      <input placeholder="LinkedIn URL" className="flex-1 p-3 border-2 border-black rounded-xl outline-none" value={editForm.linkedin} onChange={e => setEditForm({...editForm, linkedin: e.target.value})} />
                    </div>
                    <div className="flex items-center gap-3">
                      <Github className="w-5 h-5"/>
                      <input placeholder="Github URL" className="flex-1 p-3 border-2 border-black rounded-xl outline-none" value={editForm.github} onChange={e => setEditForm({...editForm, github: e.target.value})} />
                    </div>
                    <div className="flex items-center gap-3">
                      <Facebook className="w-5 h-5"/>
                      <input placeholder="Facebook URL" className="flex-1 p-3 border-2 border-black rounded-xl outline-none" value={editForm.facebook} onChange={e => setEditForm({...editForm, facebook: e.target.value})} />
                    </div>
                  </div>
                </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-black flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setIsEditProfileOpen(false)} className="px-4 py-2 hover:underline">Cancel</button>
              <button onClick={handleApplyEdit} className="px-6 py-2 bg-black text-white rounded-xl">Apply Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADD EXPERIENCE */}
      {isAddExpOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border-2 border-black text-black font-bold">
            <div className="p-6 border-b border-black flex justify-between items-center">
              <h3 className="font-extrabold text-xl">Add Experience</h3>
              <X className="cursor-pointer" onClick={() => setIsAddExpOpen(false)} />
            </div>
            <div className="p-6 space-y-4">
              <input placeholder="Role" className="w-full p-3 border-2 border-black rounded-xl outline-none" value={expForm.role} onChange={e => setExpForm({...expForm, role: e.target.value})} />
              <input placeholder="Company" className="w-full p-3 border-2 border-black rounded-xl outline-none" value={expForm.company} onChange={e => setExpForm({...expForm, company: e.target.value})} />
              <input placeholder="Period" className="w-full p-3 border-2 border-black rounded-xl outline-none" value={expForm.period} onChange={e => setExpForm({...expForm, period: e.target.value})} />
              <textarea placeholder="Description" rows={3} className="w-full p-3 border-2 border-black rounded-xl outline-none" value={expForm.description} onChange={e => setExpForm({...expForm, description: e.target.value})} />
            </div>
            <div className="p-6 bg-gray-50 border-t border-black flex justify-end gap-3 rounded-b-2xl">
              <button onClick={saveExperience} className="px-6 py-2 bg-blue-600 text-white rounded-xl">Add to List</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADD EDUCATION */}
      {isAddEduOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border-2 border-black text-black font-bold">
            <div className="p-6 border-b border-black flex justify-between items-center">
              <h3 className="font-extrabold text-xl">Add Education</h3>
              <X className="cursor-pointer" onClick={() => setIsAddEduOpen(false)} />
            </div>
            <div className="p-6 space-y-4">
              <input placeholder="School Name" className="w-full p-3 border-2 border-black rounded-xl outline-none" value={eduForm.school} onChange={e => setEduForm({...eduForm, school: e.target.value})} />
              <input placeholder="Degree / Major" className="w-full p-3 border-2 border-black rounded-xl outline-none" value={eduForm.degree} onChange={e => setEduForm({...eduForm, degree: e.target.value})} />
              <input placeholder="Period (e.g., 2015 - 2019)" className="w-full p-3 border-2 border-black rounded-xl outline-none" value={eduForm.period} onChange={e => setEduForm({...eduForm, period: e.target.value})} />
              <textarea placeholder="Description" rows={3} className="w-full p-3 border-2 border-black rounded-xl outline-none" value={eduForm.description} onChange={e => setEduForm({...eduForm, description: e.target.value})} />
            </div>
            <div className="p-6 bg-gray-50 border-t border-black flex justify-end gap-3 rounded-b-2xl">
              <button onClick={saveEducation} className="px-6 py-2 bg-blue-600 text-white rounded-xl">Add to List</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}