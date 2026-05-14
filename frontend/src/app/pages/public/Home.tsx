import React from 'react';
import { Hero } from '../../components/business/Hero'; // Thêm dấu { } bọc quanh Hero // Giữ nguyên Hero của bạn
import JobGrid from '../../components/public/JobGrid';

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <div className="bg-gray-50">
        <JobGrid />
      </div>
    </main>
  );
};

export default Home;