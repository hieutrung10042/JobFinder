import React, { useState } from 'react'; // 1. Thêm useState
import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 2. Thêm useNavigate

export const Hero = () => {
  // 3. Khai báo state để giữ giá trị input
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  // 4. Hàm xử lý khi nhấn nút Search
  const handleSearch = () => {
    // Nó sẽ tạo ra link dạng: /?keyword=React&location=Hà Nội
    const searchParams = new URLSearchParams();
    if (keyword) searchParams.append('keyword', keyword);
    if (location) searchParams.append('location', location);
    
    navigate(`/?${searchParams.toString()}`);
  };

  return (
    <section className="w-full bg-blue-50 py-20 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background circles */}
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

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100 flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto">
          <div className="flex-1 flex items-center px-4 py-3 md:py-0 w-full border-b md:border-b-0 md:border-r border-gray-100">
            <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Job Title, Keywords, or Company" 
              className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 text-base"
              // 5. Liên kết giá trị với state
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Nhấn Enter cũng tìm được
            />
          </div>
          <div className="flex-1 flex items-center px-4 py-3 md:py-0 w-full">
            <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="City, state, or remote" 
              className="w-full bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 text-base"
              // 6. Liên kết giá trị với state
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            onClick={handleSearch} // 7. Gọi hàm khi click
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 md:py-4 rounded-full font-bold text-base transition-colors flex items-center justify-center m-1 shadow-md"
          >
            Search
          </button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gray-500">
          <span className="font-medium text-gray-700">Popular:</span>
          <div className="flex gap-2 flex-wrap justify-center">
            {/* 8. Các gợi ý nhanh cũng có thể bấm được */}
            {['Frontend', 'Product Manager', 'Remote'].map((item) => (
              <span 
                key={item}
                onClick={() => { setKeyword(item); navigate(`/?keyword=${item}`); }}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};