const db = require('../../config/db');

// =========================================================================
// ADMIN MODERATION
// =========================================================================

// 3. Lấy danh sách jobs chờ duyệt (pending queue)
exports.getPendingJobs = async (req, res) => {
    try {
        const [jobs] = await db.execute(`
            SELECT 
                j.id, j.title, j.description, j.requirements,
                j.job_type, j.experience_level,
                j.salary_min, j.salary_max,
                j.status, j.created_at,
                c.id   AS company_id,
                c.name AS company_name,
                c.logo_url, c.address, c.is_verified AS company_verified,
                l.name AS location_name,
                cat.name AS category_name,
                u.username AS posted_by_username,
                u.email    AS posted_by_email
            FROM Jobs j
            JOIN Companies  c   ON j.company_id   = c.id
            JOIN Locations  l   ON j.location_id  = l.id
            JOIN Categories cat ON j.category_id  = cat.id
            JOIN Users      u   ON j.posted_by    = u.id
            WHERE j.status = 'pending' AND j.deleted_at IS NULL
            ORDER BY j.created_at ASC
        `);

        res.status(200).json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Approve job
exports.approveJob = async (req, res) => {
    const { job_id } = req.params;

    try {
        const [jobs] = await db.execute(
            "SELECT id, title, status FROM Jobs WHERE id = ? AND deleted_at IS NULL",
            [job_id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy tin tuyển dụng!" });
        }

        if (jobs[0].status !== 'pending') {
            return res.status(400).json({ success: false, message: `Tin này đang ở trạng thái "${jobs[0].status}", không thể duyệt!` });
        }

        await db.execute("UPDATE Jobs SET status = 'approved' WHERE id = ?", [job_id]);

        console.log(`[ADMIN] Job #${job_id} "${jobs[0].title}" approved`);

        res.status(200).json({ success: true, message: "Đã duyệt tin tuyển dụng thành công!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Reject job
exports.rejectJob = async (req, res) => {
    const { job_id } = req.params;
    const { reason } = req.body;

    try {
        const [jobs] = await db.execute(
            "SELECT id, title, status FROM Jobs WHERE id = ? AND deleted_at IS NULL",
            [job_id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy tin tuyển dụng!" });
        }

        if (jobs[0].status !== 'pending') {
            return res.status(400).json({ success: false, message: `Tin này đang ở trạng thái "${jobs[0].status}", không thể từ chối!` });
        }

        await db.execute("UPDATE Jobs SET status = 'rejected' WHERE id = ?", [job_id]);

        console.log(`[ADMIN] Job #${job_id} "${jobs[0].title}" rejected. Reason: ${reason || 'N/A'}`);

        res.status(200).json({ success: true, message: "Đã từ chối tin tuyển dụng!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Lấy stats tổng quan cho admin dashboard
exports.getJobStats = async (req, res) => {
    try {
        const [stats] = await db.execute(`
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN status = 'pending'  THEN 1 ELSE 0 END) AS total_pending,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS total_approved,
                SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS total_rejected,
                SUM(CASE WHEN status = 'closed'   THEN 1 ELSE 0 END) AS total_closed
            FROM Jobs
            WHERE deleted_at IS NULL
        `);

        res.status(200).json({ success: true, data: stats[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};