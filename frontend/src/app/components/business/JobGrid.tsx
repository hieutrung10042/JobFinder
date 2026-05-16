import React, { useState, useEffect } from "react";
import { Bookmark, MapPin, DollarSign, Building } from "lucide-react";
import { Link } from "react-router-dom";

// Định nghĩa kiểu dữ liệu trả về từ DB
interface Job {
  id: number;
  title: string;
  company_name: string; // Tên từ bảng Companies
  logo_url: string; // URL từ bảng Companies
  salary_min: number;
  salary_max: number;
  location_name: string; // Tên từ bảng Locations
  job_type: string;
}

export const JobGrid = ({
  titleQuery = "",
  locationQuery = "",
}: {
  titleQuery?: string;
  locationQuery?: string;
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  // 1. Gọi API lấy dữ liệu từ DB khi component mount hoặc khi search thay đổi
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/jobs?title=${titleQuery}&location=${locationQuery}`,
        );
        const result = await response.json(); // Đổi tên từ data thành result cho đỡ nhầm

        if (result.success && result.data) {
          setJobs(result.data); // Lấy mảng nằm trong result.data
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [titleQuery, locationQuery]);

  const toggleSave = (id: number) => {
    setSavedJobs((prev) =>
      prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id],
    );
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading jobs from database...
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {titleQuery || locationQuery
              ? `Search Results (${jobs.length})`
              : "Featured Jobs"}
          </h2>
          <p className="text-gray-600">Discover jobs tailored for you.</p>
        </div>
        <a
          href="#"
          className="text-blue-600 font-medium hover:text-blue-700 transition-colors hidden sm:block"
        >
          View all jobs &rarr;
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col group relative"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl border border-gray-100 overflow-hidden bg-white p-1 flex items-center justify-center">
                    {/* Render logo từ logo_url trong DB */}
                    <img
                      src={job.logo_url}
                      alt={`${job.company_name} logo`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Building className="w-3.5 h-3.5 mr-1" />
                      <span>{job.company_name}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleSave(job.id)}
                  className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                >
                  <Bookmark
                    className={`w-5 h-5 ${savedJobs.includes(job.id) ? "fill-blue-600 text-blue-600" : ""}`}
                  />
                </button>
              </div>

              <div className="mt-auto space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{job.location_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span>{`$${job.salary_min / 1000}k - $${job.salary_max / 1000}k`}</span>
                  </div>
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">
                    {job.job_type}
                  </span>
                </div>
              </div>

              <Link
                to={`/job/${job.id}`}
                className="w-full mt-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-center inline-block"
              >
                Apply Now
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            No jobs found in database.
          </div>
        )}
      </div>
    </section>
  );
};
