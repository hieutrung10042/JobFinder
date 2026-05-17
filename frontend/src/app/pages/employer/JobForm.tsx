import React from 'react';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Helper component for Rich Text Editor mock
function RichTextEditor({ label, placeholder }: { label: string, placeholder?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-colors bg-white">
        <div className="bg-slate-50 border-b border-slate-300 px-3 py-2 flex items-center gap-2 text-slate-600">
          <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-sm font-bold w-7 h-7 flex items-center justify-center">B</button>
          <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-sm italic w-7 h-7 flex items-center justify-center">I</button>
          <button type="button" className="p-1.5 hover:bg-slate-200 rounded text-sm underline w-7 h-7 flex items-center justify-center">U</button>
          <div className="w-px h-4 bg-slate-300 mx-1"></div>
          <button type="button" className="p-1.5 hover:bg-slate-200 rounded flex flex-col items-center justify-center gap-[2px] w-7 h-7">
            <div className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-current"></span><span className="w-3 h-[2px] bg-current"></span></div>
            <div className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-current"></span><span className="w-3 h-[2px] bg-current"></span></div>
            <div className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-current"></span><span className="w-3 h-[2px] bg-current"></span></div>
          </button>
        </div>
        <textarea 
          rows={4}
          className="w-full px-4 py-3 focus:outline-none resize-y min-h-[100px]"
          placeholder={placeholder}
        ></textarea>
      </div>
    </div>
  );
}

export function JobForm() {
  const navigate = useNavigate();

  return (
    // SỬA: Đổi pb-24 thành pb-12 vì không còn footer cố định chiếm không gian bên dưới nữa
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Header Form - Đã chuyển 3 nút lên đây */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          
          {/* Thông tin tiêu đề bên trái */}
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Create New Job</h1>
              <p className="text-slate-500 mt-1">Fill in the details below to post a new position.</p>
            </div>
          </div>

          {/* Cụm 3 nút thao tác bên phải theo đúng thiết kế mới */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            
            <button 
              type="button"
              className="px-5 py-2.5 text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>
            
            <button 
              type="button"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Publish Job</span>
            </button>
          </div>
          
        </div>

        {/* Thân Form nhập liệu giữ nguyên cấu trúc chuẩn */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <form className="p-6 md:p-8 flex flex-col gap-8">
            
            {/* Top Section - Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Job Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Category / Industry <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white text-slate-700 appearance-none">
                  <option value="">Select Category</option>
                  <option value="1">Công nghệ thông tin</option>
                  <option value="2">Marketing</option>
                  <option value="3">Kế toán</option>
                  <option value="4">Thiết kế</option>
                  <option value="5">Nhân sự</option>
                  <option value="6">Kinh doanh</option>
                </select>
              </div>

              {/* Địa điểm (location_id) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Location <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white text-slate-700 appearance-none">
                  <option value="">Select Location</option>
                  <option value="1">Hà Nội</option>
                  <option value="2">Hồ Chí Minh</option>
                  <option value="3">Đà Nẵng</option>
                  <option value="4">Hải Phòng</option>
                  <option value="5">Cần Thơ</option>
                </select>
              </div>

              {/* Job Type */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Job Type <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white text-slate-700 appearance-none">
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              {/* Experience Level */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Experience Level <span className="text-red-500">*</span></label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white text-slate-700 appearance-none">
                  <option value="">Select Level</option>
                  <option value="intern">Intern</option>
                  <option value="fresher">Fresher</option>
                  <option value="junior">Junior</option>
                  <option value="middle">Middle</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Salary Range</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white"
                    placeholder="Min"
                  />
                  <span className="text-slate-500">-</span>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white"
                    placeholder="Max"
                  />
                  <select className="w-24 px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white text-slate-700 appearance-none">
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-slate-200"></div>

            {/* Bottom Section - Rich Text */}
            <div className="flex flex-col gap-6">
              <RichTextEditor 
                label="Job Description (Mô tả công việc)" 
                placeholder="What will this person do on a daily basis?" 
              />
              <RichTextEditor 
                label="Job Requirements (Yêu cầu ứng viên)" 
                placeholder="What skills and experiences are necessary?" 
              />
              <RichTextEditor 
                label="Benefits (Quyền lợi)" 
                placeholder="What are the perks of working here?" 
              />
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}