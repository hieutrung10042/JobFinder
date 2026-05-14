import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from './JobCard';
import { useLocation } from 'react-router-dom'; // 1. Import useLocation

const JobGrid: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 2. Lấy đoạn "?keyword=...&location=..." từ thanh địa chỉ
  const { search } = useLocation(); 

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true); // Bật loading mỗi khi tìm kiếm mới
      try {
        // 3. Gửi kèm query string (search) lên API backend
        // Ví dụ: http://localhost:5000/api/jobs?keyword=React
        const response = await axios.get(`http://localhost:5000/api/jobs${search}`);
        
        const result = response.data;

        if (Array.isArray(result)) {
          setJobs(result);
        } else if (result && Array.isArray(result.data)) {
          setJobs(result.data);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Lỗi fetch:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [search]); // 4. QUAN TRỌNG: useEffect sẽ chạy lại mỗi khi biến search thay đổi

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
       {/* Hiển thị thông báo nếu đang có kết quả lọc */}
      {search && jobs.length > 0 && (
        <p className="mb-6 text-gray-600">
          Tìm thấy <strong>{jobs.length}</strong> công việc phù hợp.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(jobs) && jobs.length > 0 ? (
          jobs.map((job: any) => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
            <p className="text-gray-500 text-lg">Không tìm thấy công việc nào phù hợp với yêu cầu của bạn.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-4 text-blue-600 font-semibold hover:underline"
            >
              Xem tất cả công việc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobGrid;