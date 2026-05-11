-- ==========================================================
-- DATABASE: job_finder_db (Version 2.0 - Optimized)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS job_finder_db;
USE job_finder_db;

-- 1. DANH MỤC HỆ THỐNG
CREATE TABLE Categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE,
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE, -- Tối ưu SEO cho URL tìm kiếm theo khu vực
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. THỰC THỂ CHÍNH (Companies & Users)
CREATE TABLE Companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    address VARCHAR(255),
    slug VARCHAR(100) UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL -- Soft delete
);

CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('candidate', 'employer', 'admin') NOT NULL,
    company_id INT NULL, -- Chỉ dành cho Employer
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (company_id) REFERENCES Companies(id) ON DELETE SET NULL
);

-- 3. HỒ SƠ CHI TIẾT (Phục vụ tính năng tạo CV PDF tự động)
CREATE TABLE Profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    gender ENUM('male', 'female', 'other'),
    dob DATE,
    cv_url VARCHAR(255), 
    bio TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Education (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    major VARCHAR(255),
    start_date DATE,
    end_date DATE,
    description TEXT,
    FOREIGN KEY (profile_id) REFERENCES Profiles(id) ON DELETE CASCADE
);

CREATE TABLE Work_Experience (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(100),
    start_date DATE,
    end_date DATE,
    description TEXT,
    FOREIGN KEY (profile_id) REFERENCES Profiles(id) ON DELETE CASCADE
);

-- 4. QUẢN LÝ VIỆC LÀM
CREATE TABLE Jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL, -- Tin tuyển dụng thuộc về công ty
    posted_by INT NOT NULL,  -- Người trực tiếp đăng tin
    category_id INT NOT NULL,
    location_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    salary_min BIGINT DEFAULT 0,
    salary_max BIGINT DEFAULT 0,
    job_type ENUM('full-time', 'part-time', 'contract', 'freelance') DEFAULT 'full-time',
    experience_level ENUM('intern', 'fresher', 'junior', 'middle', 'senior'),
    description TEXT NOT NULL,
    requirements TEXT,
    status ENUM('pending', 'approved', 'rejected', 'closed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (company_id) REFERENCES Companies(id) ON DELETE CASCADE,
    FOREIGN KEY (posted_by) REFERENCES Users(id),
    FOREIGN KEY (category_id) REFERENCES Categories(id),
    FOREIGN KEY (location_id) REFERENCES Locations(id)
);

-- Bảng trung gian Kỹ năng
CREATE TABLE User_Skills (
    profile_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (profile_id, skill_id),
    FOREIGN KEY (profile_id) REFERENCES Profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skills(id) ON DELETE CASCADE
);

CREATE TABLE Job_Skills (
    job_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (job_id, skill_id),
    FOREIGN KEY (job_id) REFERENCES Jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skills(id) ON DELETE CASCADE
);

-- 5. NGHIỆP VỤ KẾT NỐI & TƯƠNG TÁC
CREATE TABLE Applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    candidate_id INT NOT NULL,
    job_id INT NOT NULL,
    cover_letter TEXT,
    cv_snapshot_url VARCHAR(255), -- Lưu bản copy CV tại thời điểm nộp
    status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES Jobs(id) ON DELETE CASCADE
);

CREATE TABLE Notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    type ENUM('application_status', 'new_job', 'system') DEFAULT 'system',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    reporter_id INT NOT NULL,
    job_id INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'resolved', 'ignored') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES Users(id),
    FOREIGN KEY (job_id) REFERENCES Jobs(id) ON DELETE CASCADE
);

-- INDEXES ĐỂ TỐI ƯU TRUY VẤN
CREATE INDEX idx_job_status ON Jobs(status);
CREATE INDEX idx_job_type ON Jobs(job_type);
CREATE INDEX idx_application_status ON Applications(status);

-- ==========================================
-- 1. CÔNG TY (Companies) - Bắt đầu từ ID 101
-- ==========================================
INSERT INTO Companies (id, name, slug, description, address, is_verified) VALUES 
(101, 'TechCorp VN', 'techcorp-vn-101', 'Công ty công nghệ hàng đầu', '123 Cầu Giấy, Hà Nội', 1),
(102, 'Vina Marketing', 'vina-marketing-102', 'Agency quảng cáo sáng tạo', '45 Q1, Hồ Chí Minh', 1),
(103, 'Build & Grow', 'build-grow-103', 'Tập đoàn xây dựng', '78 Hải Châu, Đà Nẵng', 1),
(104, 'EduFuture', 'edufuture-104', 'Nền tảng giáo dục trực tuyến', '90 Ninh Kiều, Cần Thơ', 0),
(105, 'HealthPlus', 'healthplus-105', 'Hệ thống phòng khám đa khoa', '112 Lê Chân, Hải Phòng', 1);

-- ==========================================
-- 2. USERS - Bắt đầu từ ID 101 (Tránh trùng với ID 1, 2, 3... đã có)
-- ==========================================
-- Employer (Gắn với company_id từ 101 -> 105)
INSERT INTO Users (id, username, email, password, role, company_id, is_active) VALUES 
(101, 'emp_techcorp', 'hr@techcorp.vn', '$2a$10$X...dummyHash123456...', 'employer', 101, 1),
(102, 'emp_vina', 'tuyendung@vinamkt.com', '$2a$10$X...dummyHash123456...', 'employer', 102, 1),
(103, 'emp_build', 'contact@buildgrow.vn', '$2a$10$X...dummyHash123456...', 'employer', 103, 1),
(104, 'emp_edufuture', 'hr@edufuture.vn', '$2a$10$X...dummyHash123456...', 'employer', 104, 1),
(105, 'emp_health', 'admin@healthplus.vn', '$2a$10$X...dummyHash123456...', 'employer', 105, 1);

-- Candidate (ID từ 106 -> 110)
INSERT INTO Users (id, username, email, password, role, company_id, is_active) VALUES 
(106, 'nguyenvana', 'vana@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(107, 'tranbath', 'bath@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(108, 'lethic', 'thic@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(109, 'hoangvand', 'vand@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(110, 'phamthie', 'thie@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1);

-- ==========================================
-- 3. PROFILES (Hồ sơ ứng viên, user_id tương ứng 106 -> 110)
-- ==========================================
INSERT INTO Profiles (user_id, full_name, phone, gender, dob, bio) VALUES 
(106, 'Nguyễn Văn A', '0901234567', 'male', '1998-05-15', 'Lập trình viên Frontend 3 năm kinh nghiệm.'),
(107, 'Trần Bá B', '0912345678', 'male', '1995-10-20', 'Chuyên gia Marketing Digital.'),
(108, 'Lê Thị C', '0923456789', 'female', '1999-01-05', 'Kế toán tổng hợp, cẩn thận, tỉ mỉ.'),
(109, 'Hoàng Văn D', '0934567890', 'male', '2000-12-12', 'Sinh viên mới ra trường tìm việc IT.'),
(110, 'Phạm Thị E', '0945678901', 'female', '1997-07-22', 'Chuyên viên Nhân sự, am hiểu luật LĐ.');

-- ==========================================
-- 4. CÔNG VIỆC (Jobs) - ID từ 101
-- ==========================================
-- Giả sử category_id và location_id từ 1->10 (đã insert thành công ở bước trước bằng lệnh IGNORE)
INSERT INTO Jobs (id, company_id, posted_by, category_id, location_id, title, slug, salary_min, salary_max, job_type, experience_level, description, requirements, status) VALUES 
(101, 101, 101, 1, 1, 'Frontend Developer (ReactJS)', 'frontend-reactjs-101', 15000000, 25000000, 'full-time', 'middle', 'Phát triển giao diện web.', '2 năm kinh nghiệm.', 'approved'),
(102, 101, 101, 1, 2, 'Backend Node.js Engineer', 'backend-nodejs-102', 20000000, 35000000, 'full-time', 'senior', 'Xây dựng API với Node.js.', '4 năm kinh nghiệm.', 'approved'),
(103, 102, 102, 2, 2, 'Digital Marketing Specialist', 'digital-mkt-103', 10000000, 18000000, 'full-time', 'junior', 'Chạy ads Facebook.', 'Biết dùng tool phân tích.', 'approved'),
(104, 103, 103, 7, 3, 'Kỹ sư Xây dựng dân dụng', 'ky-su-xay-dung-104', 12000000, 20000000, 'full-time', 'middle', 'Giám sát công trình.', 'Sẵn sàng đi công tác xa.', 'approved'),
(105, 104, 104, 9, 5, 'Giáo viên Tiếng Anh Online', 'giao-vien-tieng-anh-105', 8000000, 15000000, 'part-time', 'fresher', 'Dạy Tiếng Anh giao tiếp.', 'IELTS 7.0 trở lên.', 'approved'),
(106, 105, 105, 8, 4, 'Điều dưỡng viên', 'dieu-duong-vien-106', 9000000, 14000000, 'full-time', 'junior', 'Chăm sóc bệnh nhân.', 'Tốt nghiệp điều dưỡng.', 'approved'),
(107, 101, 101, 4, 1, 'UI/UX Designer', 'ui-ux-designer-107', 15000000, 22000000, 'full-time', 'middle', 'Thiết kế app/web.', 'Có portfolio.', 'approved');

-- ==========================================
-- 5. KỸ NĂNG VÀ ỨNG TUYỂN
-- ==========================================
-- Gắn kỹ năng cho job
INSERT IGNORE INTO Job_Skills (job_id, skill_id) VALUES 
(101, 1), (101, 14), (102, 2), (102, 4), (103, 6), (103, 7), (107, 9);

-- Lịch sử nộp đơn
INSERT IGNORE INTO Applications (candidate_id, job_id, cover_letter, status) VALUES 
(106, 101, 'Tôi rất đam mê ReactJS.', 'reviewed'),
(106, 107, 'Tôi có học thêm chút về Figma.', 'rejected'),
(107, 103, 'Tôi đã có 2 năm chạy Ads.', 'pending'),
(108, 105, 'Tôi muốn làm part-time.', 'pending'),
(109, 102, 'Tôi học việc rất nhanh.', 'rejected'),
(110, 106, 'Tôi đã có bằng cử nhân.', 'accepted');