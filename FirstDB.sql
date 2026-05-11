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

USE job_finder_db;

-- ==========================================
-- 1. THÊM 10 CÔNG TY MỚI (ID: 200 -> 209)
-- ==========================================
INSERT INTO Companies (id, name, slug, description, address, is_verified) VALUES 
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

-- ==========================================
-- 2. THÊM 10 NHÀ TUYỂN DỤNG (ID: 200 -> 209, gắn với Công ty ở trên)
-- ==========================================
INSERT INTO Users (id, username, email, password, role, company_id, is_active) VALUES 
(200, 'hr_nextgen', 'hr@nextgen.vn', '$2a$10$X...dummyHash123456...', 'employer', 200, 1),
(201, 'hr_alpha', 'tuyendung@alpha.com', '$2a$10$X...dummyHash123456...', 'employer', 201, 1),
(202, 'hr_global', 'contact@globallogistics.vn', '$2a$10$X...dummyHash123456...', 'employer', 202, 1),
(203, 'hr_creative', 'hello@creativeminds.vn', '$2a$10$X...dummyHash123456...', 'employer', 203, 1),
(204, 'hr_fintech', 'jobs@vietfintech.vn', '$2a$10$X...dummyHash123456...', 'employer', 204, 1),
(205, 'hr_green', 'hr@greenenergy.vn', '$2a$10$X...dummyHash123456...', 'employer', 205, 1),
(206, 'hr_modern', 'admin@modern.edu.vn', '$2a$10$X...dummyHash123456...', 'employer', 206, 1),
(207, 'hr_care', 'hr@carecure.vn', '$2a$10$X...dummyHash123456...', 'employer', 207, 1),
(208, 'hr_prime', 'tuyendung@prime.vn', '$2a$10$X...dummyHash123456...', 'employer', 208, 1),
(209, 'hr_cloud', 'jobs@cloudsolutions.vn', '$2a$10$X...dummyHash123456...', 'employer', 209, 1);

-- ==========================================
-- 3. THÊM 20 ỨNG VIÊN (ID: 210 -> 229)
-- ==========================================
INSERT INTO Users (id, username, email, password, role, company_id, is_active) VALUES 
(210, 'cand_1', 'cand1@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(211, 'cand_2', 'cand2@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(212, 'cand_3', 'cand3@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(213, 'cand_4', 'cand4@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(214, 'cand_5', 'cand5@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(215, 'cand_6', 'cand6@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(216, 'cand_7', 'cand7@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(217, 'cand_8', 'cand8@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(218, 'cand_9', 'cand9@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(219, 'cand_10', 'cand10@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(220, 'cand_11', 'cand11@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(221, 'cand_12', 'cand12@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(222, 'cand_13', 'cand13@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(223, 'cand_14', 'cand14@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(224, 'cand_15', 'cand15@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(225, 'cand_16', 'cand16@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(226, 'cand_17', 'cand17@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(227, 'cand_18', 'cand18@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(228, 'cand_19', 'cand19@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1),
(229, 'cand_20', 'cand20@gmail.com', '$2a$10$X...dummyHash123456...', 'candidate', NULL, 1);

-- ==========================================
-- 4. TẠO HỒ SƠ CHO 20 ỨNG VIÊN (Profiles)
-- ==========================================
INSERT INTO Profiles (user_id, full_name, phone, gender, dob, bio) VALUES 
(210, 'Bùi Trọng Tài', '0911111111', 'male', '1996-03-12', 'Chuyên viên quản lý dự án Agile.'),
(211, 'Đinh Tố Như', '0922222222', 'female', '1999-08-25', 'Sinh viên IT năm cuối tìm chỗ thực tập.'),
(212, 'Vũ Hải Đăng', '0933333333', 'male', '1994-11-02', 'Data Analyst với 5 năm kinh nghiệm.'),
(213, 'Lý Tiểu Long', '0944444444', 'male', '1998-05-19', 'Chuyên gia chạy Ads Facebook & Tiktok.'),
(214, 'Trịnh Hà My', '0955555555', 'female', '1997-12-10', 'Nhân viên kế toán thuế.'),
(215, 'Ngô Đức Anh', '0966666666', 'male', '1995-04-14', 'Kỹ sư cầu nối (BrSE) tiếng Nhật N2.'),
(216, 'Hồ Ngọc Hà', '0977777777', 'female', '1996-09-30', 'Chuyên viên tuyển dụng (Headhunter).'),
(217, 'Đào Trọng Tín', '0988888888', 'male', '2001-01-22', 'Fresher Backend Developer (Java/Spring Boot).'),
(218, 'Phan Bích Thủy', '0999999999', 'female', '1993-06-17', 'Trưởng phòng Sales B2B.'),
(219, 'Lâm Gia Khang', '0900000000', 'male', '1992-10-05', 'Giám đốc chuỗi cung ứng.'),
(220, 'Đoàn Hữu Trí', '0811111111', 'male', '1998-02-28', 'Kiến trúc sư công trình.'),
(221, 'Mai Phương Thúy', '0822222222', 'female', '1999-07-15', 'Giáo viên Tiếng Anh IELTS 8.0.'),
(222, 'Châu Tinh Trì', '0833333333', 'male', '1994-12-25', 'Video Editor / Motion Graphic.'),
(223, 'Tôn Nữ Diệp', '0844444444', 'female', '1997-04-04', 'Dược sĩ đại học.'),
(224, 'Thái Công', '0855555555', 'male', '1990-11-11', 'Thiết kế nội thất cao cấp.'),
(225, 'Kiều Diễm', '0866666666', 'female', '2000-08-08', 'Content Creator Tiktok.'),
(226, 'Lương Sơn Bá', '0877777777', 'male', '1996-03-03', 'Kỹ sư nông nghiệp công nghệ cao.'),
(227, 'Chúc Anh Đài', '0888888888', 'female', '1997-05-05', 'Phiên dịch viên tiếng Trung.'),
(228, 'Dương Quá', '0899999999', 'male', '1995-09-09', 'Lập trình viên Python / AI.'),
(229, 'Tiểu Long Nữ', '0800000000', 'female', '1998-10-10', 'Bác sĩ thú y.');

-- ==========================================
-- 5. THÊM 20 CÔNG VIỆC ĐA DẠNG (ID: 200 -> 219)
-- (Sử dụng category_id từ 1->10 và location_id từ 1->8 đã tạo trước đó)
-- ==========================================
INSERT INTO Jobs (id, company_id, posted_by, category_id, location_id, title, slug, salary_min, salary_max, job_type, experience_level, description, requirements, status) VALUES 
(200, 200, 200, 1, 2, 'AI Engineer (Python, TensorFlow)', 'ai-engineer-200', 30000000, 50000000, 'full-time', 'senior', 'Nghiên cứu và phát triển mô hình AI.', 'Ít nhất 3 năm kinh nghiệm Python.', 'approved'),
(201, 200, 200, 1, 2, 'Blockchain Developer', 'blockchain-dev-201', 40000000, 80000000, 'full-time', 'senior', 'Phát triển Smart Contract.', 'Kinh nghiệm Solidity.', 'approved'),
(202, 201, 201, 6, 1, 'Chuyên viên Phát triển thị trường B2B', 'b2b-sales-202', 15000000, 30000000, 'full-time', 'middle', 'Tìm kiếm đối tác doanh nghiệp.', 'Giao tiếp tốt, chịu áp lực cao.', 'approved'),
(203, 201, 201, 2, 1, 'Performance Marketing Manager', 'perf-mkt-manager-203', 25000000, 40000000, 'full-time', 'senior', 'Quản lý ngân sách Ads lớn.', 'Thành thạo công cụ tracking.', 'approved'),
(204, 202, 202, 10, 4, 'Nhân viên Chứng từ Xuất Nhập Khẩu', 'chung-tu-xnk-204', 10000000, 15000000, 'full-time', 'junior', 'Khai báo hải quan, làm bill.', 'Tiếng Anh đọc hiểu tốt.', 'approved'),
(205, 202, 202, 10, 4, 'Trưởng trạm Vận hành Kho', 'truong-tram-kho-205', 18000000, 25000000, 'full-time', 'middle', 'Quản lý đội ngũ giao hàng.', 'Có kinh nghiệm kho bãi.', 'approved'),
(206, 203, 203, 4, 3, 'Video Editor / Quay Dựng', 'video-editor-206', 12000000, 20000000, 'full-time', 'middle', 'Quay và dựng video viral TikTok.', 'Sử dụng Premiere, After Effect.', 'approved'),
(207, 203, 203, 2, 3, 'Chuyên viên Tổ chức Sự kiện', 'event-executive-207', 10000000, 18000000, 'full-time', 'junior', 'Lên kế hoạch và chạy event.', 'Sẵn sàng OT khi có sự kiện.', 'approved'),
(208, 204, 204, 1, 1, 'System Administrator (Linux, AWS)', 'sysadmin-aws-208', 20000000, 35000000, 'full-time', 'middle', 'Vận hành hệ thống server.', 'Có chứng chỉ AWS là lợi thế.', 'approved'),
(209, 205, 205, 7, 5, 'Kỹ sư Điện Năng Lượng Mặt Trời', 'ky-su-dien-mt-209', 15000000, 25000000, 'full-time', 'middle', 'Giám sát thi công áp mái.', 'Chịu được nắng gió.', 'approved'),
(210, 206, 206, 9, 2, 'Giáo viên Mầm non Song ngữ', 'gv-mam-non-210', 9000000, 15000000, 'full-time', 'junior', 'Chăm sóc và dạy trẻ.', 'Yêu trẻ, kiên nhẫn.', 'approved'),
(211, 206, 206, 5, 2, 'Tuyển dụng nội bộ (Internal TA)', 'tuyen-dung-noi-bo-211', 12000000, 18000000, 'full-time', 'middle', 'Đăng tin, lọc CV.', 'Kỹ năng đánh giá con người.', 'approved'),
(212, 207, 207, 8, 2, 'Bác sĩ Đa khoa', 'bac-si-da-khoa-212', 30000000, 60000000, 'full-time', 'senior', 'Khám chữa bệnh tổng quát.', 'Có chứng chỉ hành nghề.', 'approved'),
(213, 207, 207, 8, 2, 'Dược sĩ Bán thuốc', 'duoc-si-213', 8000000, 12000000, 'shift', 'fresher', 'Tư vấn và bán thuốc.', 'Tốt nghiệp cao đẳng Dược.', 'approved'),
(214, 208, 208, 6, 3, 'Chuyên viên Tư vấn Bất động sản', 'sale-bds-214', 5000000, 50000000, 'full-time', 'fresher', 'Bán căn hộ dự án cao cấp.', 'Đam mê kiếm tiền.', 'approved'),
(215, 209, 209, 1, 1, 'DevOps Engineer', 'devops-engineer-215', 30000000, 55000000, 'full-time', 'senior', 'Thiết lập CI/CD.', 'Kinh nghiệm Docker, Kubernetes.', 'approved'),
(216, 200, 200, 1, 2, 'Thực tập sinh Python (Intern)', 'python-intern-216', 3000000, 5000000, 'part-time', 'intern', 'Hỗ trợ team cào dữ liệu.', 'Sinh viên năm 3, 4 IT.', 'approved'),
(217, 201, 201, 3, 1, 'Kế toán trưởng', 'ke-toan-truong-217', 25000000, 40000000, 'full-time', 'senior', 'Lên báo cáo tài chính, quản lý team.', 'Chứng chỉ CPA.', 'approved'),
(218, 204, 204, 1, 1, 'Golang Developer', 'golang-dev-218', 25000000, 45000000, 'full-time', 'middle', 'Xây dựng Microservices.', '1 năm kinh nghiệm Go.', 'approved'),
(219, 209, 209, 6, 1, 'Telesales IT Cloud', 'telesale-it-219', 8000000, 20000000, 'full-time', 'junior', 'Gọi điện tư vấn dịch vụ Cloud.', 'Giọng nói dễ nghe.', 'approved');

-- ==========================================
-- 6. GẮN KỸ NĂNG CHO CÔNG VIỆC (Job_Skills)
-- ==========================================
INSERT IGNORE INTO Job_Skills (job_id, skill_id) VALUES 
(200, 3), (200, 11), -- AI Engineer cần Python, Tiếng Anh
(203, 6), (203, 13), -- Perf Mkt cần SEO, Quản lý dự án
(206, 8), (206, 14), -- Video Editor cần Photoshop, Teamwork
(208, 11), (208, 12), -- Sysadmin cần Tiếng anh, Giao tiếp
(211, 12), (211, 14), -- TA cần Giao tiếp, Teamwork
(215, 11), (215, 13), -- DevOps cần Tiếng anh, Quản lý DA
(216, 3), (216, 14),  -- Intern cần Python, Teamwork
(217, 10), (217, 15); -- Kế toán trưởng cần Excel, Thuyết trình

-- ==========================================
-- 7. THÊM 30+ LƯỢT ỨNG TUYỂN (Applications)
-- ==========================================
INSERT IGNORE INTO Applications (candidate_id, job_id, cover_letter, status) VALUES 
(210, 203, 'Tôi có kinh nghiệm quản lý ngân sách lớn.', 'pending'),
(210, 207, 'Tôi từng tổ chức sự kiện âm nhạc.', 'reviewed'),
(211, 216, 'Em đang là sinh viên năm 4 rất mong muốn học hỏi.', 'pending'),
(212, 200, 'Tôi chuyên làm data pipeline bằng Python.', 'accepted'),
(213, 203, 'Tôi chuyên vít Ads Tiktok.', 'reviewed'),
(214, 217, 'Em mới làm kế toán viên, muốn thử sức.', 'rejected'),
(215, 208, 'Tiếng Nhật N2, AWS Cert.', 'pending'),
(216, 211, 'Tôi làm headhunt 3 năm.', 'accepted'),
(217, 218, 'Em đang học thêm Golang.', 'pending'),
(218, 202, 'Từng mang về doanh thu chục tỷ.', 'reviewed'),
(219, 205, 'Am hiểu logistics nội địa.', 'pending'),
(220, 209, 'Tôi học bách khoa chuyên ngành điện.', 'accepted'),
(221, 210, 'IELTS 8.0, thích làm việc với trẻ con.', 'reviewed'),
(222, 206, 'Dựng Capcut, Premiere siêu nhanh.', 'pending'),
(223, 213, 'Bằng giỏi dược.', 'accepted'),
(225, 206, 'Kênh tiktok cá nhân 100k follow.', 'pending'),
(227, 204, 'Biết tiếng Trung là lợi thế làm XNK.', 'reviewed'),
(228, 200, 'Đã từng training mô hình nhận diện giọng nói.', 'pending'),
(228, 216, 'Sẵn sàng làm part-time.', 'rejected'),
(229, 212, 'Hồ sơ xin việc vị trí bác sĩ.', 'pending');

ALTER TABLE Users
    -- 1. Phục vụ tính năng Xác thực Email & Quên mật khẩu
    ADD COLUMN is_verified BOOLEAN DEFAULT FALSE COMMENT 'Trạng thái xác thực email',
    ADD COLUMN otp_code VARCHAR(6) NULL COMMENT 'Mã OTP 6 số (Xác thực/Quên MK)',
    ADD COLUMN otp_expires DATETIME NULL COMMENT 'Thời gian hết hạn của mã OTP',
    
    -- 2. Thông tin hiển thị nhanh (Tránh phải JOIN với bảng Profiles khi không cần thiết)
    ADD COLUMN display_name VARCHAR(100) NULL COMMENT 'Tên hiển thị thực tế của người dùng',
    
    -- 3. Bảo mật bổ sung (Tùy chọn: dùng cho Reset Password qua Link nếu không dùng OTP)
    ADD COLUMN reset_password_token VARCHAR(255) NULL,
    ADD COLUMN reset_password_expires DATETIME NULL;