import React, { useState } from 'react';
import { Briefcase, User, Mail, Lock, ShieldCheck, Linkedin } from 'lucide-react';

export default function Auth() {
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200 font-sans py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-8 transition-colors duration-200">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 mb-4 border border-blue-100 dark:border-blue-500/20">
            <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 font-medium">Sign in to your account to continue</p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="flex p-1.5 mb-8 bg-gray-100 dark:bg-slate-900/80 rounded-xl border border-gray-200/50 dark:border-slate-700/50">
          <button
            type="button"
            onClick={() => setRole('candidate')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              role === 'candidate' 
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200/50 dark:border-slate-700' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
            }`}
          >
            <User className="w-4 h-4" />
            Candidate
          </button>
          <button
            type="button"
            onClick={() => setRole('employer')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              role === 'employer' 
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200/50 dark:border-slate-700' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Employer
          </button>
        </div>

        {/* Login Form */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-shadow font-medium"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white transition-shadow font-medium"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:checked:bg-blue-500 transition-colors cursor-pointer" 
              />
              <span className="text-sm font-medium text-gray-600 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-slate-200 transition-colors">
                Remember me
              </span>
            </label>
            <a href="#" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              Forgot password?
            </a>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-sm shadow-blue-600/20 mt-2">
            Sign in as {role === 'candidate' ? 'Candidate' : 'Employer'}
          </button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Logins */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-semibold text-gray-700 dark:text-slate-300 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-semibold text-gray-700 dark:text-slate-300 shadow-sm">
            <Linkedin className="w-5 h-5 text-[#0A66C2] dark:text-[#388FEA]" />
            LinkedIn
          </button>
        </div>
        
        <p className="mt-8 text-center text-sm font-medium text-gray-600 dark:text-slate-400">
          Don't have an account?{' '}
          <a href="#" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
