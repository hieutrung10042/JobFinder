const db = require('../config/db');

// Lấy danh sách danh mục
exports.getAllCategories = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Categories');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};