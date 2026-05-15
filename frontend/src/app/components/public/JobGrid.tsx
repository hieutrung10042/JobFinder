import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, DollarSign, Clock, Building, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JobGrid() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Gọi API lấy danh sách công việc từ backend
        const response = await axios.get('http://localhost:5000/api/jobs');
        const data = response.data.data || response.data;
        setJobs(data);
      } catch (error) {
        console.error("Lỗi kết nối Server:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div className="text-center py-10 font-medium">Đang tải danh sách công việc...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <Link 
          key={job.id} 
          to={`/job/${job.id}`}
          className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
        >
          {/* CỘT 1: LOGO & JOB TYPE */}
          <div className="mb-6 flex justify-between items-start">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm">
              <img 
                src={job.Company?.logo_url || "https://via.placeholder.com/100"} 
                alt={job.Company?.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                {job.job_type}
              </span>
            </div>
          </div>

          {/* CỘT 2: TITLE & COMPANY */}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <Building className="w-4 h-4 mr-1.5 text-gray-400" />
                <span className="font-medium">{job.Company?.name}</span>
              </div>
            </div>

            {/* CỘT 3: LOCATION & SALARY */}
            <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <span className="text-xs truncate">{job.Location?.name || 'Remote'}</span>
              </div>
              <div className="flex items-center text-gray-900 font-bold">
                <DollarSign className="w-4 h-4 mr-1 text-green-600 flex-shrink-0" />
                <span className="text-xs">
                  {job.salary_min ? `${(job.salary_min/1000000).toFixed(0)}tr - ${(job.salary_max/1000000).toFixed(0)}tr` : 'Thỏa thuận'}
                </span>
              </div>
            </div>
          </div>

          {/* CỘT 4: NÚT CHI TIẾT (Trải nghiệm người dùng) */}
          <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-blue-600 font-bold text-sm">
             <span>Chi tiết</span>
             <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      ))}
    </div>
  );
}