import { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from './JobCard';

export default function JobGrid() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Hàm gọi dữ liệu thật từ Backend
    const fetchRealJobs = async () => {
      try {
        // Thay đường dẫn này bằng API thật của bạn
        const response = await axios.get('https://web-development-course-43yy.onrender.com/api/jobs'); 
        setJobs(response.data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu từ Database:", error);
      }
    };

    fetchRealJobs();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Vòng lặp in ra dữ liệu thật */}
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}