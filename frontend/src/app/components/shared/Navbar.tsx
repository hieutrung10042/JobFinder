import React from 'react';
import { Briefcase, User } from 'lucide-react';
import { Link } from 'react-router';

export const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900 tracking-tight">JobSpot</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Find Jobs</Link>
            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Companies</a>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-6">
            <Link to="/employer/dashboard" className="hidden md:inline-flex text-blue-600 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-full font-semibold transition-colors">
              Post a Job
            </Link>
            <Link to="/profile" className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
              <User className="h-5 w-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
