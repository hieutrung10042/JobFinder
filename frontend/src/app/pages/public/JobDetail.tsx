import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  MapPin, DollarSign, Clock, Building,
  Link as LinkIcon, ArrowLeft, CheckCircle2 
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ApplyModal from '../../components/candidate/ApplyModal'; // ✅ import

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // ✅ thêm

  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://127.0.0.1:5000/api/jobs/${id}`);
        if (res.data?.success) {
          setJob(res.data.data);
        } else {
          toast.error("Job not found");
        }
      } catch (err: any) {
        console.error("Fetch job error:", err.response?.data || err.message);
        toast.error("Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // ✅ Kiểm tra login trước khi mở modal
  const handleApply = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You need to login first!");
      navigate("/auth");
      return;
    }
    setShowModal(true);
  };

  if (loading) return <div className="p-10 text-left font-bold text-gray-500">Loading...</div>;
  if (!job) return <div className="p-10 text-left text-red-500 font-bold">Job not found!</div>;

  const getLogoUrl = (url: string) => {
    if (!url) return "https://ui-avatars.com/api/?name=Company&background=random";
    if (url.startsWith('http')) return url;
    return `http://127.0.0.1:5000${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 text-left font-sans">

      {/* ✅ ApplyModal */}
      <ApplyModal
        job={{
          id: job.id,
          title: job.title,
          company_name: job.company_name || 'Company'
        }}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          toast.success("Application submitted! 🎉");
          setShowModal(false);
        }}
      />

      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to all jobs
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                      <Building className="w-4 h-4" /> {job.company_name || 'Verified Company'}
                    </div>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location_name || 'Remote'}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.job_type}</span>
                    <span className="flex items-center gap-1 text-gray-900 font-bold">
                      <DollarSign className="w-4 h-4" />
                      {job.salary_min ? `$${job.salary_min/1000}k - $${job.salary_max/1000}k` : 'Negotiable'}
                    </span>
                  </div>
                </div>
                {/* ✅ Nút mở modal */}
                <button
                  onClick={handleApply}
                  className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg 
                             hover:bg-blue-700 transition-all h-fit active:scale-95"
                >
                  Apply Now
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About the Role</h2>
              <p className="text-gray-600 leading-relaxed mb-10 whitespace-pre-line">{job.description}</p>
              {['Requirements', 'Benefits'].map((section) => (
                <div key={section} className="mb-10 last:mb-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-5">{section}</h3>
                  <div className="space-y-4">
                    {job[section.toLowerCase()]?.split('\n').map((line: string, i: number) => line.trim() && (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${section === 'Benefits' ? 'text-green-500' : 'text-blue-600'}`} />
                        <span className="text-gray-600 leading-relaxed font-medium">{line.replace(/^[•-]\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-5">About the Company</h3>
              <div className="flex items-center gap-4 mb-6 group">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm flex-shrink-0">
                  <img src={getLogoUrl(job.logo_url)} alt="Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight">{job.company_name || 'Verified Company'}</h4>
                  <button className="text-blue-600 text-sm font-medium hover:underline">View company profile</button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-3">{job.company_desc}</p>
              <a href={job.website} target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                <LinkIcon className="w-4 h-4" /> {job.website?.replace(/^https?:\/\//, '') || 'website.io'}
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}