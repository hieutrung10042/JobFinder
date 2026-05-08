import React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, CheckCircle2, Briefcase } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Appearance</h2>
            
            <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-slate-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  Adjust the appearance to reduce glare and relax your eyes.
                </p>
              </div>
              
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                  theme === 'dark' ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span className="sr-only">Toggle dark mode</span>
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* UI Preview Section */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-4 uppercase tracking-wider">UI Preview</h3>
              
              <div className="p-6 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Senior Frontend Engineer</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400">TechCorp Inc.</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 text-xs px-2 py-1 rounded-full font-bold">
                      95% Match
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-slate-300 mb-4">
                    We're looking for an experienced developer to join our core team and build the future of our product.
                  </p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}