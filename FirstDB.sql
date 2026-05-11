-- ==========================================================
-- DATABASE: job_finder_db (Full Script - 1 Click)
-- ==========================================================

-- 1. KHỞI TẠO DATABASE
CREATE DATABASE IF NOT EXISTS job_finder_db;
USE job_finder_db;

-- 2. TẠO CÁC BẢNG DANH MỤC
CREATE TABLE IF NOT EXISTS Categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE,
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) UNIQUE,
    image_url VARCHAR(255) NULL, -- Đã gộp cột image_url vào đây
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 3. TẠO BẢNG CÔNG TY & NGƯỜI DÙNG
CREATE TABLE IF NOT EXISTS Companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    banner_url VARCHAR(255) NULL, -- Đã gộp banner_url vào đây
    website VARCHAR(255),
    description TEXT,
    address VARCHAR(255),
    slug VARCHAR(100) UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('candidate', 'employer', 'admin') NOT NULL,
    company_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE, -- Các cột phục vụ Auth/OTP
    otp_code VARCHAR(6) NULL,
    otp_expires DATETIME NULL,
    display_name VARCHAR(100) NULL,
    avatar_url VARCHAR(255) NULL,
    reset_password_token VARCHAR(255) NULL,
    reset_password_expires DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (company_id) REFERENCES Companies(id) ON DELETE SET NULL
);

-- 4. TẠO BẢNG HỒ SƠ CHI TIẾT
CREATE TABLE IF NOT EXISTS Profiles (
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

CREATE TABLE IF NOT EXISTS Education (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    major VARCHAR(255),
    start_date DATE,
    end_date DATE,
    description TEXT,
    FOREIGN KEY (profile_id) REFERENCES Profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Work_Experience (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profile_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    position VARCHAR(100),
    start_date DATE,
    end_date DATE,
    description TEXT,
    FOREIGN KEY (profile_id) REFERENCES Profiles(id) ON DELETE CASCADE
);

-- 5. QUẢN LÝ VIỆC LÀM & KỸ NĂNG
CREATE TABLE IF NOT EXISTS Jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    posted_by INT NOT NULL,
    category_id INT NOT NULL,
    location_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    salary_min BIGINT DEFAULT 0,
    salary_max BIGINT DEFAULT 0,
    thumbnail_url VARCHAR(255) NULL, -- Đã gộp thumbnail_url vào đây
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

CREATE TABLE IF NOT EXISTS User_Skills (
    profile_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (profile_id, skill_id),
    FOREIGN KEY (profile_id) REFERENCES Profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skills(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Job_Skills (
    job_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (job_id, skill_id),
    FOREIGN KEY (job_id) REFERENCES Jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skills(id) ON DELETE CASCADE
);

-- 6. TƯƠNG TÁC & THÔNG BÁO
CREATE TABLE IF NOT EXISTS Applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    candidate_id INT NOT NULL,
    job_id INT NOT NULL,
    cover_letter TEXT,
    cv_snapshot_url VARCHAR(255),
    status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES Jobs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    type ENUM('application_status', 'new_job', 'system') DEFAULT 'system',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- ==========================================
-- 7. CHÈN DỮ LIỆU MẪU (SEED DATA)
-- ==========================================

-- Công ty (ID 200-209)
INSERT IGNORE INTO Companies (id, name, slug, description, address, is_verified) VALUES 
(200, 'NextGen Tech', 'nextgen-tech-200', 'Phát triển phần mềm AI và Blockchain', 'Tòa nhà Bitexco, Q1, HCM', 1),
(201, 'Alpha Commerce', 'alpha-commerce-201', 'Sàn thương mại điện tử xuyên biên giới', 'Cầu Giấy, Hà Nội', 1),
(202, 'Global Logistics VN', 'global-logistics-202', 'Vận tải và chuỗi cung ứng quốc tế', 'Hải An, Hải Phòng', 1),
(203, 'Creative Minds Agency', 'creative-minds-203', 'Truyền thông và tổ chức sự kiện', 'Thanh Khê, Đà Nẵng', 1),
(204, 'Viet Fintech', 'viet-fintech-204', 'Giải pháp thanh toán trực tuyến', 'Đống Đa, Hà Nội', 1),
(205, 'Green Energy Corp', 'green-energy-205', 'Năng lượng sạch và điện mặt trời', 'Ninh Kiều, Cần Thơ', 1),
(206, 'Modern Education', 'modern-education-206', 'Hệ thống trường song ngữ', 'Tân Bình, HCM', 1),
(207, 'Care & Cure Hospital', 'care-cure-207', 'Bệnh viện đa khoa quốc tế', 'Bình Thạnh, HCM', 1),
(208, 'Prime Real Estate', 'prime-real-estate-208', 'Tập đoàn bất động sản', 'Sơn Trà, Đà Nẵng', 0),
(209, 'Cloud Solutions', 'cloud-solutions-209', 'Cung cấp dịch vụ hạ tầng Cloud', 'Nam Từ Liêm, Hà Nội', 1);

-- Danh mục & Địa điểm cơ bản (Để Jobs không bị lỗi FK)
INSERT IGNORE INTO Categories (id, name) VALUES (1, 'Công nghệ thông tin'), (2, 'Marketing'), (3, 'Kế toán'), (4, 'Thiết kế'), (5, 'Nhân sự'), (6, 'Kinh doanh'), (7, 'Kỹ thuật'), (8, 'Y tế'), (9, 'Giáo dục'), (10, 'Logistics');
INSERT IGNORE INTO Locations (id, name) VALUES (1, 'Hà Nội'), (2, 'Hồ Chí Minh'), (3, 'Đà Nẵng'), (4, 'Hải Phòng'), (5, 'Cần Thơ');
INSERT IGNORE INTO Skills (id, name) VALUES (1, 'Java'), (2, 'React'), (3, 'Python'), (10, 'Excel'), (11, 'English'), (12, 'Communication'), (13, 'Agile'), (14, 'Teamwork'), (15, 'Leadership');

-- Người dùng (Employer & Candidate)
INSERT IGNORE INTO Users (id, username, email, password, role, company_id, is_active, is_verified) VALUES 
(200, 'hr_nextgen', 'hr@nextgen.vn', '$2a$10$dummy', 'employer', 200, 1, 1),
(201, 'hr_alpha', 'tuyendung@alpha.com', '$2a$10$dummy', 'employer', 201, 1, 1),
(210, 'cand_1', 'cand1@gmail.com', '$2a$10$dummy', 'candidate', NULL, 1, 1),
(211, 'cand_2', 'cand2@gmail.com', '$2a$10$dummy', 'candidate', NULL, 1, 1),
(212, 'cand_3', 'cand3@gmail.com', '$2a$10$dummy', 'candidate', NULL, 1, 1);

-- Hồ sơ ứng viên
INSERT IGNORE INTO Profiles (user_id, full_name, phone, gender, bio) VALUES 
(210, 'Bùi Trọng Tài', '0911111111', 'male', 'Chuyên viên quản lý dự án Agile.'),
(211, 'Đinh Tố Như', '0922222222', 'female', 'Sinh viên IT năm cuối tìm chỗ thực tập.'),
(212, 'Vũ Hải Đăng', '0933333333', 'male', 'Data Analyst với 5 năm kinh nghiệm.');

-- Việc làm (ID 200-205)
INSERT IGNORE INTO Jobs (id, company_id, posted_by, category_id, location_id, title, slug, salary_min, salary_max, job_type, experience_level, description, status) VALUES 
(200, 200, 200, 1, 2, 'AI Engineer (Python, TensorFlow)', 'ai-engineer-200', 30000000, 50000000, 'full-time', 'senior', 'Nghiên cứu AI.', 'approved'),
(201, 200, 200, 1, 2, 'Blockchain Developer', 'blockchain-dev-201', 40000000, 80000000, 'full-time', 'senior', 'Phát triển Smart Contract.', 'approved'),
(202, 201, 201, 6, 1, 'B2B Sales Executive', 'b2b-sales-202', 15000000, 30000000, 'full-time', 'middle', 'Tìm đối tác doanh nghiệp.', 'approved');

-- Kỹ năng việc làm & Ứng tuyển
INSERT IGNORE INTO Job_Skills (job_id, skill_id) VALUES (200, 3), (200, 11);
INSERT IGNORE INTO Applications (candidate_id, job_id, cover_letter, status) VALUES (210, 200, 'Tôi rất quan tâm đến vị trí AI.', 'pending');

-- 8. TỐI ƯU TRUY VẤN
CREATE INDEX idx_job_status ON Jobs(status);
CREATE INDEX idx_application_status ON Applications(status);