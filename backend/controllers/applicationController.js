const db = require('../config/db');

exports.applyJob = async (req, res) => {
    console.log("Body nhận được:", req.body);
    // 1. Lấy thông tin từ Body và Token
    const { job_id, cover_letter } = req.body;
    const candidate_id = req.user.id; // Lấy từ verifyToken middleware

    try {
        // 2. Kiểm tra xem đã ứng tuyển công việc này chưa (tránh nộp trùng)
        const [existing] = await db.execute(
            'SELECT * FROM Applications WHERE job_id = ? AND candidate_id = ?',
            [job_id, candidate_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Bạn đã ứng tuyển công việc này rồi!" 
            });
        }

        // 3. Lưu vào bảng Applications
        // Lưu ý: Tên cột phải khớp chính xác với ảnh image_539e95.png của bạn
        await db.execute(
            'INSERT INTO Applications (candidate_id, job_id, cover_letter, status) VALUES (?, ?, ?, ?)',
            [candidate_id, job_id, cover_letter, 'pending']
        );

        res.status(201).json({ 
            success: true, 
            message: "Ứng tuyển thành công! Vui lòng chờ phản hồi từ nhà tuyển dụng." 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// 1. Lấy danh sách ứng viên nộp vào các bài đăng của Employer này
exports.getEmployerApplications = async (req, res) => {
    const employer_id = req.user.id;

    try {
        const [rows] = await db.execute(`
            SELECT 
                a.id AS application_id, 
                u.username AS candidate_name, 
                u.email AS candidate_email, 
                j.title AS job_title, 
                a.cover_letter, 
                a.status, 
                a.applied_at
            FROM Applications a
            JOIN Users u ON a.candidate_id = u.id
            JOIN Jobs j ON a.job_id = j.id
            WHERE j.posted_by = ?
            ORDER BY a.applied_at DESC
        `, [employer_id]);

        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Cập nhật trạng thái ứng tuyển (Duyệt/Từ chối)
exports.updateApplicationStatus = async (req, res) => {
    const { application_id, status } = req.body; // status nên là 'accepted' hoặc 'rejected'

    try {
        const [result] = await db.execute(
            'UPDATE Applications SET status = ? WHERE id = ?',
            [status, application_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn ứng tuyển" });
        }

        res.status(200).json({ success: true, message: `Đã chuyển trạng thái sang: ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};