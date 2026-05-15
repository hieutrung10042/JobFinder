import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export default function ErrorPage() {
  const error = useRouteError();

  // Xử lý riêng cho trường hợp lỗi 404 Not Found
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-900 md:text-3xl">Không tìm thấy trang</h2>
        <p className="mt-2 text-gray-500 max-w-md">
          Đường dẫn bạn đang cố truy cập không tồn tại hoặc đã bị di dời.
        </p>
        <Link 
          to="/" 
          className="mt-8 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Về trang chủ
        </Link>
      </div>
    );
  }

  // Xử lý cho các lỗi hệ thống (Crash component, gọi API lỗi chặn render...)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Đã xảy ra lỗi không mong muốn!</h2>
      <p className="mt-2 text-gray-500 max-w-md">
        Xin lỗi vì sự bất tiện này. Vui lòng tải lại trang hoặc quay lại trang chủ.
      </p>
      <div className="mt-8 flex gap-4">
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Tải lại trang
        </button>
        <Link 
          to="/" 
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}