import React from 'react';
import { Outlet } from 'react-router-dom'; // QUAN TRỌNG: Dùng react-router-dom
import { ThemeProvider } from 'next-themes';
import Navbar from './components/shared/Navbar'; // Đảm bảo đúng đường dẫn file Navbar của bạn

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Navbar sẽ luôn hiện ở mọi trang */}
        <Navbar /> 

        {/* Outlet là nơi nội dung các trang con (Home, Dashboard, JobDetail...) sẽ hiển thị */}
        <main>
          <Outlet /> 
        </main>
      </div>
    </ThemeProvider>
  );
}