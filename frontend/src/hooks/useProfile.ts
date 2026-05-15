import { useState, useEffect } from 'react';
import { getProfile, saveProfile, uploadCV, deleteCV, PersonalInfo, WorkExperience, Education } from '../services/profileService';

export function useProfile(userId: string) {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    full_name: '', title: '', bio: '', location: '', phone: '', gender: '', dob: '', avatar_url: null, cover_url: null, cv_url: null, social_links: {}
  });
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getProfile(userId)
      .then(data => {
        setPersonalInfo(data.personalInfo);
        setExperiences(data.experiences);
        setEducation(data.education);
        setSkills(data.skills);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  const updateProfileData = async (type: 'personalInfo' | 'experiences' | 'education' | 'skills', newData: any) => {
    setSaving(true);
    try {
      const payload = { personalInfo, experiences, education, skills, [type]: newData };
      await saveProfile(userId, payload);
      
      // Cập nhật local state
      if (type === 'personalInfo') setPersonalInfo(newData);
      if (type === 'experiences') setExperiences(newData);
      if (type === 'education') setEducation(newData);
      if (type === 'skills') setSkills(newData);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    } finally {
      setSaving(false);
    }
  };

  const handleUploadCV = async (file: File) => {
    try {
      const result = await uploadCV(file);
      setPersonalInfo(prev => ({ ...prev, cv_url: result.cv_url }));
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const handleDeleteCV = async () => {
    try {
      await deleteCV();
      setPersonalInfo(prev => ({ ...prev, cv_url: null }));
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  return {
    personalInfo, setPersonalInfo,
    experiences, education, skills,
    loading, saving, updateProfileData, handleUploadCV, handleDeleteCV
  };
}