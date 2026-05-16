import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, FileText, Upload, CheckCircle, Loader2 } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  company_name: string;
}

interface ApplyModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = 1 | 2 | 3 | 4;

interface FormState {
  cv_snapshot_url: string;
  cvFileName: string;
  cover_letter: string;
}

const INITIAL_FORM: FormState = {
  cv_snapshot_url: '',
  cvFileName: '',
  cover_letter: '',
};

export default function ApplyModal({ job, isOpen, onClose, onSuccess }: ApplyModalProps) {
  const [step, setStep]               = useState<Step>(1);
  const [form, setForm]               = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading]         = useState(false);
  const [useProfileCV, setUseProfileCV] = useState(true);
  const [profileCV, setProfileCV]     = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ useEffect đặt TRONG component
  useEffect(() => {
    if (!isOpen) return;
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get('http://127.0.0.1:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success && data.data?.cv_url) {
          setProfileCV({
            url: data.data.cv_url,
            name: data.data.cv_url.split('/').pop() || 'My Resume'
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile CV');
      }
    };
    fetchProfile();
  }, [isOpen]);

  if (!isOpen) return null;

  const reset = () => {
    setStep(1);
    setForm(INITIAL_FORM);
    setUseProfileCV(true);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { toast.error('Only PDF or DOCX allowed'); return; }
    if (file.size > 5 * 1024 * 1024)  { toast.error('File must be under 5MB');   return; }
    const url = `https://storage.example.com/resumes/${Date.now()}_${file.name}`;
    setUseProfileCV(false);
    setForm(prev => ({ ...prev, cv_snapshot_url: url, cvFileName: file.name }));
    toast.success('CV uploaded!');
  };

  const selectProfileCV = () => {
    setUseProfileCV(true);
    setForm(prev => ({
      ...prev,
      cv_snapshot_url: profileCV?.url || '',  // ✅ dùng profileCV
      cvFileName: profileCV?.name || ''
    }));
  };

  const handleSubmit = async () => {
    const cvUrl = useProfileCV ? profileCV?.url : form.cv_snapshot_url; // ✅
    if (!cvUrl) { toast.error('Please select or upload a CV'); return; }
    const token = localStorage.getItem('token');
    if (!token) { toast.error('Please login first'); return; }

    setLoading(true);
    try {
      const { data } = await axios.post(
        'http://127.0.0.1:5000/api/applications/apply',
        { job_id: job.id, cover_letter: form.cover_letter || '', cv_snapshot_url: cvUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message || 'Application submitted! 🎉');
        onSuccess?.();
        reset();
        onClose();
      } else {
        toast.error(data.message || 'Submission failed');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      if (err?.response?.status === 400) {
        toast.error(msg || 'You already applied for this job');
      } else {
        toast.error(msg || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const stepLabels: Record<Step, string> = {
    1: 'RESUME / CV',
    2: 'COVER LETTER (OPTIONAL)',
    3: 'REVIEW',
    4: 'CONFIRM',
  };

  const canProceed = () => {
    if (step === 1) return useProfileCV ? !!profileCV : !!form.cv_snapshot_url;
    return true;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Apply for {job.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{job.company_name}</p>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center px-6 py-3 gap-1.5">
          {([1, 2, 3, 4] as Step[]).map(n => (
            <React.Fragment key={n}>
              <div className={`flex-none w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                ${step > n ? 'bg-blue-500 text-white' : step === n ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'}`}>
                {step > n ? <CheckCircle className="w-4 h-4" /> : n}
              </div>
              {n < 4 && <div className={`flex-1 h-0.5 rounded ${step > n ? 'bg-blue-500' : 'bg-gray-200 dark:bg-slate-700'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step label */}
        <div className="px-6 pb-2">
          <p className="text-xs font-bold text-gray-500 dark:text-slate-400 tracking-widest uppercase">
            Step {step}: {stepLabels[step]}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 min-h-[220px]">

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-3 mt-2">
              {/* Profile CV */}
              {profileCV ? (
                <button onClick={selectProfileCV}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all
                    ${useProfileCV ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'}`}>
                  <FileText className={`w-8 h-8 flex-shrink-0 ${useProfileCV ? 'text-blue-500' : 'text-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{profileCV.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">From Profile</p>
                  </div>
                  {useProfileCV && <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                </button>
              ) : (
                <div className="w-full p-4 rounded-xl border-2 border-gray-100 dark:border-slate-700 text-sm text-gray-400 text-center">
                  No CV found in profile
                </div>
              )}

              {/* Upload new */}
              <button onClick={() => fileInputRef.current?.click()}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 border-dashed text-left transition-all
                  ${!useProfileCV && form.cv_snapshot_url ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-slate-600 hover:border-blue-400'}`}>
                <Upload className="w-8 h-8 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-700 dark:text-slate-200">
                    {!useProfileCV && form.cvFileName ? form.cvFileName : 'Upload New Resume'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">PDF, DOCX up to 5MB</p>
                </div>
                {!useProfileCV && form.cv_snapshot_url && <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 ml-auto" />}
              </button>
              <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileChange} />
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">
                Introduce yourself and explain why you're a strong candidate for this role.
              </p>
              <textarea rows={7} placeholder="Write your cover letter here..."
                value={form.cover_letter}
                onChange={e => setForm(prev => ({ ...prev, cover_letter: e.target.value }))}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="mt-2 space-y-3">
              <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Job</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{job.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Company</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{job.company_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">CV</span>
                  <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px]">
                    {useProfileCV ? profileCV?.name : form.cvFileName}  {/* ✅ */}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cover Letter</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {form.cover_letter ? `${form.cover_letter.slice(0, 30)}…` : 'Not provided'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center">Please review before submitting your application.</p>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="mt-4 flex flex-col items-center justify-center text-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-blue-500" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-lg">Ready to Submit?</p>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  Your application will be sent to <strong>{job.company_name}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700">
          <button
            onClick={step === 1 ? handleClose : () => setStep(s => (s - 1) as Step)}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 disabled:opacity-40 transition-colors"
          >
            {step === 1 ? 'Cancel' : '← Back'}
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep(s => (s + 1) as Step)}
              disabled={!canProceed()}
              className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-bold transition-colors"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</> : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}