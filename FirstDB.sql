-- 1. CHỌN/TẠO DATABASE
CREATE DATABASE IF NOT EXISTS job_finder_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE job_finder_db;

-- 2. TẠO BẢNG USERS
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employer', 'candidate') DEFAULT 'candidate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TẠO BẢNG CATEGORIES (Ngành nghề)
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 4. TẠO BẢNG LOCATIONS (Địa điểm)
CREATE TABLE Locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 5. TẠO BẢNG COMPANIES (Công ty)
CREATE TABLE Companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    logo_url VARCHAR(255),
    banner_url VARCHAR(255),
    website VARCHAR(255),
    address VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TẠO BẢNG JOBS (Tin tuyển dụng)
CREATE TABLE Jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category_id INT,
    location_id INT,
    company_id INT,
    posted_by INT,
    job_type VARCHAR(50),
    salary_range VARCHAR(100),
    salary_min INT,
    salary_max INT,
    experience_level VARCHAR(100),
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    status VARCHAR(50) DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES Locations(id) ON DELETE SET NULL,
    FOREIGN KEY (company_id) REFERENCES Companies(id) ON DELETE CASCADE,
    FOREIGN KEY (posted_by) REFERENCES Users(id) ON DELETE CASCADE
);

-- ==========================================
-- 7. INSERT THÔNG TIN ĐÚNG CHUẨN GIAO DIỆN CỦA BẠN
-- ==========================================

-- Thêm User đăng bài (Tránh lỗi khóa ngoại posted_by)
INSERT INTO Users (id, name, email, password, role) VALUES 
(200, 'TechFlow HR', 'hr@techflow.io', 'hashed_password_123', 'employer');

-- Thêm Locations (Đúng như ảnh là New York và Remote)
INSERT INTO Locations (id, name) VALUES 
(1, 'New York, NY'), 
(2, 'Remote');

-- Thêm Categories
INSERT INTO Categories (id, name) VALUES 
(1, 'IT - Software');

-- Thêm 3 Công ty khớp với giao diện (TechFlow, InnovateSpace, CreativePulse)
INSERT INTO Companies (id, name, logo_url, website, address, description) VALUES 
(1, 'TechFlow', 'https://ui-avatars.com/api/?name=TechFlow&background=0D8ABC&color=fff&size=100', 'https://techflow.io', 'New York, NY', 'TechFlow is a fast-growing startup building the next generation of workflow automation tools for modern enterprises.'),
(2, 'InnovateSpace', 'https://ui-avatars.com/api/?name=IS&background=2563EB&color=fff&size=100', 'https://innovatespace.io', 'New York, NY', 'InnovateSpace pioneers cutting-edge web applications.'),
(3, 'CreativePulse', 'https://ui-avatars.com/api/?name=CP&background=10B981&color=fff&size=100', 'https://creativepulse.com', 'Remote', 'A creative agency focused on modern digital experiences.');

-- Thêm Các công việc (Job số 1 là việc chính, Job 2 & 3 là Related Jobs)
INSERT INTO Jobs (id, title, category_id, location_id, company_id, posted_by, job_type, salary_range, salary_min, salary_max, experience_level, description, requirements, benefits, status) VALUES 
(1, 'Frontend Developer', 1, 1, 1, 200, 'Full-time', '120k-150k', 120000, 150000, 'Mid-Level', 'We are looking for an experienced Frontend Developer to join our core product team. You will be responsible for building intuitive user interfaces using React and modern web technologies.', 'At least 3 years of experience with React.js and TypeScript\nStrong proficiency in modern CSS (Tailwind, CSS Modules)\nExperience with RESTful APIs and state management\nGood problem-solving skills and team collaboration', 'Competitive salary and equity package\nFlexible working hours and remote options\nComprehensive health insurance\nAnnual learning & development budget', 'approved'),

(2, 'Frontend Developer', 1, 1, 2, 200, 'Full-time', '110k-140k', 110000, 140000, 'Mid-Level', 'InnovateSpace is looking for a UI specialist.', 'React.js\nTailwind CSS', 'Remote work options\nGreat team culture', 'approved'),

(3, 'React Engineer', 1, 2, 3, 200, 'Contract', '90k-120k', 90000, 120000, 'Senior', 'Build next-gen React applications remotely with CreativePulse.', '5+ years React experience\nNext.js expertise', '100% Remote\nFlexible Hours', 'approved');