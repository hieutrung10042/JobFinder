import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, User, Bell, Settings as SettingsIcon, CheckCircle2, Eye, Calendar } from 'lucide-react';
import { Link } from 'react-router';

export const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-900 dark:text-white tracking-tight">JobSpot</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Find Jobs</Link>
            <a href="#" className="text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Companies</a>
            <Link to="/admin" className="text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Admin Panel</Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/auth" className="hidden sm:block text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors">
              Sign In
            </Link>
            <Link to="/employer/dashboard" className="hidden md:inline-flex text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-5 py-2.5 rounded-full font-semibold transition-colors">
              Post a Job
            </Link>
            
            {/* Notification Bell */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-slate-300" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
              </button>

              {/* Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 origin-top-right">
                  <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                    <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">Mark all read</button>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-slate-700/50 max-h-96 overflow-y-auto">
                    
                    {/* Item 1 */}
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">New job match found</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">A Senior Frontend Engineer role matches your profile.</p>
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1.5">2 hours ago</p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                          <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Employer viewed your application</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">TechCorp Inc. just looked at your resume.</p>
                        <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mt-1.5">5 hours ago</p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Interview invitation</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">StartupX wants to schedule a 30 min chat.</p>
                        <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-1.5">1 day ago</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            <Link to="/settings" className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              <SettingsIcon className="h-5 w-5 text-gray-600 dark:text-slate-300" />
            </Link>

            <Link to="/profile" className="h-10 w-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
              <User className="h-5 w-5 text-gray-600 dark:text-slate-300" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
