const db = require('../config/db');

// 1. API Đăng tin tuyển dụng
exports.createJob = async (req, res) => {
    const { 
        title, category_id, location_id, company_id, 
        job_type, salary_range, experience_level, description 
    } = req.body;

    try {
        // Trong thực tế, bạn nên check xem user này có quyền quản lý company_id này không
        const [result] = await db.execute(
            `INSERT INTO Jobs 
            (title, category_id, location_id, company_id, job_type, salary_range, experience_level, description, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [title, category_id, location_id, company_id, job_type, salary_range, experience_level, description]
        );

        res.status(201).json({ 
            success: true, 
            message: "Tin tuyển dụng đã được gửi và chờ kiểm duyệt!",
            jobId: result.insertId 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. API Lấy tất cả tin (cho Trang chủ) [cite: 16]
exports.getAllJobs = async (req, res) => {
    try {
        // 1. Lấy các tham số lọc từ URL (ví dụ: ?category=1&location=2&search=nodejs)
        const { category, location, search } = req.query;

        // 2. Câu lệnh SQL cơ bản với JOIN để lấy tên Công ty, Địa điểm, Danh mục
        let sql = `
            SELECT j.*, c.name as company_name, l.name as location_name, cat.name as category_name 
            FROM Jobs j
            JOIN Companies c ON j.company_id = c.id
            JOIN Locations l ON j.location_id = l.id
            JOIN Categories cat ON j.category_id = cat.id
            WHERE j.status = 'approved'
        `;
        
        const params = [];

        // 3. Thêm điều kiện lọc động
        if (category) {
            sql += ` AND j.category_id = ?`;
            params.push(category);
        }

        if (location) {
            sql += ` AND j.location_id = ?`;
            params.push(location);
        }

        if (search) {
            sql += ` AND j.title LIKE ?`;
            params.push(`%${search}%`); // Tìm kiếm tương đối
        }

        sql += ` ORDER BY j.created_at DESC`;

        const [jobs] = await db.execute(sql, params);

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
