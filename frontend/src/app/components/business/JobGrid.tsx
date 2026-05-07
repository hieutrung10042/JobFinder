import React, { useState } from 'react';
import { Bookmark, MapPin, DollarSign, Building } from 'lucide-react';
import { Link } from 'react-router';

const FEATURED_JOBS = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    company: 'TechFlow',
    salary: '$120k - $150k',
    location: 'Remote, US',
    logo: 'https://images.unsplash.com/photo-1760037028517-e5cc6e3ebd3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG1pbmltYWxpc3QlMjB0ZWNoJTIwbG9nb3xlbnwxfHx8fDE3NzgxNzI2MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'Full-time'
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'InnovateSpace',
    salary: '$110k - $140k',
    location: 'New York, NY',
    logo: 'https://images.unsplash.com/photo-1633796212691-0cfba2ab1dab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhYnN0cmFjdCUyMGNvbXBhbnklMjBsb2dvfGVufDF8fHx8MTc3ODE3MjYwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'Full-time'
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    company: 'CreativePulse',
    salary: '$90k - $120k',
    location: 'San Francisco, CA',
    logo: 'https://images.unsplash.com/photo-1773844914284-498c0e049b36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBicmFuZCUyMGxvZ298ZW58MXx8fHwxNzc4MTcyNjA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'Contract'
  },
  {
    id: 4,
    title: 'Data Scientist',
    company: 'MetricsCorp',
    salary: '$130k - $160k',
    location: 'London, UK',
    logo: 'https://images.unsplash.com/photo-1759588071796-7648b7569d59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwY2lyY2xlJTIwbG9nb3xlbnwxfHx8fDE3NzgxNzI2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'Full-time'
  },
  {
    id: 5,
    title: 'Backend Developer',
    company: 'CloudSystems',
    salary: '$115k - $145k',
    location: 'Berlin, Germany',
    logo: 'https://images.unsplash.com/photo-1758914224092-2aba0d39c923?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZXR0ZXIlMjBsb2dvJTIwbW9kZXJufGVufDF8fHx8MTc3ODE3MjYwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'Full-time'
  },
  {
    id: 6,
    title: 'Marketing Director',
    company: 'GrowthHackers',
    salary: '$140k - $180k',
    location: 'Remote, Global',
    logo: 'https://images.unsplash.com/photo-1660137340590-d48549625980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGFwcCUyMGljb258ZW58MXx8fHwxNzc4MTcyNjA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    type: 'Full-time'
  }
];

export const JobGrid = () => {
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  const toggleSave = (id: number) => {
    setSavedJobs(prev => 
      prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Jobs</h2>
          <p className="text-gray-600">Discover jobs tailored for you.</p>
        </div>
        <a href="#" className="text-blue-600 font-medium hover:text-blue-700 transition-colors hidden sm:block">
          View all jobs &rarr;
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED_JOBS.map((job) => (
          <div 
            key={job.id} 
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col group relative"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl border border-gray-100 overflow-hidden bg-white p-1 flex items-center justify-center">
                  <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">
                    {job.title}
                  </h3>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Building className="w-3.5 h-3.5 mr-1" />
                    <span>{job.company}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => toggleSave(job.id)}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                aria-label="Save job"
              >
                <Bookmark className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-blue-600 text-blue-600' : ''}`} />
              </button>
            </div>
            
            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>{job.salary}</span>
                </div>
                <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100">
                  {job.type}
                </span>
              </div>
            </div>
            
            <Link to={`/job/${job.id}`} className="w-full mt-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-center inline-block">
              Apply Now
            </Link>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center sm:hidden">
        <a href="#" className="text-blue-600 font-medium hover:text-blue-700 transition-colors inline-block py-2">
          View all jobs &rarr;
        </a>
      </div>
    </section>
  );
};
