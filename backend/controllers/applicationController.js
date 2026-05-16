const db = require('../config/db');

exports.applyJob = async (req, res) => {
    const { job_id, cover_letter } = req.body;
    const candidate_id = req.user.id;

    try {
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

// Lấy danh sách ứng viên của Employer (cho CandidateManagement)
exports.getEmployerApplications = async (req, res) => {
    const employer_id = req.user.id;

    try {
        const [rows] = await db.execute(`
            SELECT 
                a.id AS application_id,
                u.id AS candidate_id,
                u.username AS candidate_name,
                u.email AS candidate_email,
                p.full_name,
                p.phone,
                j.title AS job_title,
                j.id AS job_id,
                j.experience_level,
                a.cover_letter,
                a.status,
                a.applied_at
            FROM Applications a
            JOIN Users u ON a.candidate_id = u.id
            LEFT JOIN Profiles p ON u.id = p.user_id
            JOIN Jobs j ON a.job_id = j.id
            WHERE j.posted_by = ?
            ORDER BY a.applied_at DESC
        `, [employer_id]);

        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy chi tiết 1 ứng viên (cho CandidateDetail)
exports.getApplicationById = async (req, res) => {
    const { id } = req.params;
    const employer_id = req.user.id;

    try {
        const [rows] = await db.execute(`
            SELECT 
                a.id AS application_id,
                u.id AS candidate_id,
                u.username AS candidate_name,
                u.email AS candidate_email,
                p.full_name,
                p.phone,
                p.bio,
                p.cv_url,
                j.title AS job_title,
                j.id AS job_id,
                a.cover_letter,
                a.status,
                a.applied_at
            FROM Applications a
            JOIN Users u ON a.candidate_id = u.id
            LEFT JOIN Profiles p ON u.id = p.user_id
            JOIN Jobs j ON a.job_id = j.id
            WHERE a.id = ? AND j.posted_by = ?
        `, [id, employer_id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn ứng tuyển" });
        }

        // Lấy thêm kinh nghiệm làm việc
        const [workExp] = await db.execute(`
            SELECT company_name, position, start_date, end_date, description
            FROM Work_Experience
            WHERE profile_id = (SELECT id FROM Profiles WHERE user_id = ?)
            ORDER BY start_date DESC
        `, [rows[0].candidate_id]);

        // Lấy thêm học vấn
        const [education] = await db.execute(`
            SELECT school_name, major, start_date, end_date
            FROM Education
            WHERE profile_id = (SELECT id FROM Profiles WHERE user_id = ?)
            ORDER BY start_date DESC
        `, [rows[0].candidate_id]);

        // Lấy kỹ năng
        const [skills] = await db.execute(`
            SELECT s.name
            FROM User_Skills us
            JOIN Skills s ON us.skill_id = s.id
            WHERE us.profile_id = (SELECT id FROM Profiles WHERE user_id = ?)
        `, [rows[0].candidate_id]);

        res.status(200).json({
            success: true,
            data: {
                ...rows[0],
                work_experience: workExp,
                education: education,
                skills: skills.map(s => s.name)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật trạng thái ứng tuyển
exports.updateApplicationStatus = async (req, res) => {
    const { application_id, status } = req.body;

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

// Lấy danh sách job postings của Employer (cho EmployerDashboard)
exports.getEmployerJobs = async (req, res) => {
    const employer_id = req.user.id;

    try {
        const [jobs] = await db.execute(`
            SELECT 
                j.id,
                j.title,
                j.job_type,
                j.status,
                j.created_at,
                l.name AS location_name,
                COUNT(a.id) AS application_count
            FROM Jobs j
            LEFT JOIN Locations l ON j.location_id = l.id
            LEFT JOIN Applications a ON j.id = a.job_id
            WHERE j.posted_by = ? AND j.deleted_at IS NULL
            GROUP BY j.id
            ORDER BY j.created_at DESC
        `, [employer_id]);

        // Thống kê tổng quan
        const [stats] = await db.execute(`
            SELECT
                COUNT(DISTINCT j.id) AS total_jobs,
                COUNT(a.id) AS total_applications
            FROM Jobs j
            LEFT JOIN Applications a ON j.id = a.job_id
            WHERE j.posted_by = ?
        `, [employer_id]);

        res.status(200).json({
            success: true,
            data: jobs,
            stats: stats[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyApplications = async (req, res) => {
    const candidate_id = req.user.id;

    try {
        const [rows] = await db.execute(`
            SELECT
                a.id            AS application_id,
                a.status,
                a.cover_letter,
                a.cv_snapshot_url,
                a.applied_at,
                j.id            AS job_id,
                j.title         AS job_title,
                j.job_type,
                c.name          AS company_name,
                c.logo_url,
                l.name          AS location
            FROM Applications a
            JOIN Jobs          j ON a.job_id       = j.id
            LEFT JOIN Companies c ON j.company_id  = c.id
            LEFT JOIN Locations l ON j.location_id = l.id
            WHERE a.candidate_id = ?
            ORDER BY a.applied_at DESC
        `, [candidate_id]);

        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};