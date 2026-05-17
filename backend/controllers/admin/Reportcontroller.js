const db = require('../../config/db');

// Lấy danh sách reports + filter
exports.getReports = async (req, res) => {
    const { status, search } = req.query;

    try {
        let where = ['r.status IS NOT NULL'];
        let params = [];

        if (status && status !== 'all') {
            where.push('r.status = ?');
            params.push(status);
        }

        if (search) {
            where.push('(j.title LIKE ? OR u.username LIKE ? OR u.email LIKE ?)');
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        const whereClause = 'WHERE ' + where.join(' AND ');

        const [rows] = await db.execute(`
            SELECT
                r.id,
                r.reason,
                r.status,
                r.created_at,
                j.id AS job_id,
                j.title AS job_title,
                j.status AS job_status,
                c.name AS company_name,
                u.id AS reporter_id,
                u.username AS reporter_username,
                u.email AS reporter_email
            FROM Reports r
            JOIN Jobs j ON r.job_id = j.id
            JOIN Companies c ON j.company_id = c.id
            JOIN Users u ON r.reporter_id = u.id
            ${whereClause}
            ORDER BY r.created_at DESC
        `, params);

        // Stats
        const [stats] = await db.execute(`
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS total_pending,
                SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS total_resolved,
                SUM(CASE WHEN status = 'ignored' THEN 1 ELSE 0 END) AS total_ignored
            FROM Reports
        `);

        res.status(200).json({ success: true, data: rows, stats: stats[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật trạng thái report: resolved / ignored
exports.updateReportStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'resolved' | 'ignored'

    if (!['resolved', 'ignored', 'pending'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }

    try {
        const [result] = await db.execute(
            'UPDATE Reports SET status = ? WHERE id = ?',
            [status, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy report' });
        }
        res.status(200).json({ success: true, message: `Đã cập nhật trạng thái: ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa job bị report (xử lý nghiêm)
exports.deleteReportedJob = async (req, res) => {
    const { id } = req.params; // report id

    try {
        // Lấy job_id từ report
        const [reports] = await db.execute(
            'SELECT job_id FROM Reports WHERE id = ?',
            [id]
        );
        if (reports.length === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy report' });
        }

        const job_id = reports[0].job_id;

        // Soft delete job
        await db.execute(
            'UPDATE Jobs SET deleted_at = NOW(), status = ? WHERE id = ?',
            ['closed', job_id]
        );

        // Đánh dấu report là resolved
        await db.execute(
            'UPDATE Reports SET status = ? WHERE job_id = ?',
            ['resolved', job_id]
        );

        res.status(200).json({ success: true, message: 'Đã xóa tin tuyển dụng và đánh dấu report là resolved' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};