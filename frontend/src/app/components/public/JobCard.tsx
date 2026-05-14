import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock } from 'lucide-react';

interface JobCardProps {
  job: {
    id: number;
    title: string;
    company_name: string;
    location_name: string;
    salary: string;
    job_type: string;
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
      <p className="text-blue-600 font-medium mb-4">{job.company_name}</p>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-2" /> {job.location_name}
        </div>
        <div className="flex items-center text-green-600 text-sm font-semibold">
          <DollarSign className="w-4 h-4 mr-2" /> {job.salary}
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 mr-2" /> {job.job_type}
        </div>
      </div>

      <Link 
        to={`/job/${job.id}`} 
        className="block w-full text-center py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
      >
        Apply Now
      </Link>
    </div>
  );
};

export default JobCard;