import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  // CHỈ SỬA LOGIC Ở ĐÂY: Điều hướng về '/' thay vì '/jobs'
  const handleSearch = () => {
    // Chuyển hướng về trang chủ để Home.tsx nhận được SearchParams
    const searchPath = `/?title=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;
    navigate(searchPath);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="w-full bg-blue-50 py-20 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Giữ nguyên toàn bộ phần JSX và CSS bên dưới */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
          Find your next <span className="text-blue-600">dream job</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Discover thousands of job opportunities with all the information you need. Its your future. Come find it.
        </p>

        <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100 flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto">
          <div className="flex-1 flex items-center px-4 py-3 md:py-0 w-full border-b md:border-b-0 md:border-r border-gray-100">
            <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Job Title, Keywords, or Company" 
              className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 text-base"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          <div className="flex-1 flex items-center px-4 py-3 md:py-0 w-full">
            <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="City, state, or remote" 
              className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 text-base"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>
          <button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 md:py-4 rounded-full font-bold text-base transition-colors flex items-center justify-center m-1 shadow-md"
          >
            Search
          </button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-500">
          <span className="font-medium text-gray-700">Popular:</span>
          <div className="flex gap-2 flex-wrap justify-center">
            {/* Cập nhật logic điều hướng cho các tag phổ biến */}
            <span 
              onClick={() => { setKeyword('Frontend'); navigate('/?title=Frontend'); }}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              Frontend
            </span>
            <span 
              onClick={() => { setKeyword('Product Manager'); navigate('/?title=Product%20Manager'); }}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              Product Manager
            </span>
            <span 
              onClick={() => { setLocation('Remote'); navigate('/?location=Remote'); }}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              Remote
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};