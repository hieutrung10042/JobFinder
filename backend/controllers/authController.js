const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// --- ĐĂNG KÝ (REGISTER) ---

exports.register = async (req, res) => {
    const { username, email, password, role, full_name } = req.body;

    try {
        // 1. Kiểm tra User tồn tại
        const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (rows.length > 0) return res.status(400).json({ message: "Email đã tồn tại" });

        // 2. Hash mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Chèn vào bảng Users
        const [userResult] = await db.execute(
            'INSERT INTO Users (username, email, password, role, is_active) VALUES (?, ?, ?, ?, 1)',
            [username, email, hashedPassword, role || 'candidate']
        );
        
        const userId = userResult.insertId;

        // 4. Xử lý logic theo Role dựa trên DB mới
        if (role === 'employer') {
            // Tạo một công ty mặc định cho Employer
            await db.execute('INSERT INTO Companies (name) VALUES (?)', [`Công ty của ${username}`]);
        } else {
            // Tạo Profile cho Candidate
            await db.execute('INSERT INTO Profiles (user_id, full_name) VALUES (?, ?)', [userId, full_name]);
        }

       res.status(201).json({ 
            success: true, 
            message: "Đăng ký tài khoản thành công!" 
        });
    } catch (error) {
        // Nếu vẫn lỗi, nó sẽ hiển thị chi tiết tại đây
        res.status(500).json({ error: error.message });
    }
};

// --- ĐĂNG NHẬP (LOGIN) ---
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Tìm user theo email
        const [users] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại!' });
        }

        const user = users[0];

        // 2. So sánh mật khẩu đã mã hóa
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác!' });
        }

        // 3. Tạo JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token hết hạn sau 1 ngày
        );

        // 4. Trả về thông tin (không trả password) và token
        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Lấy thông tin cá nhân của người dùng hiện tại
exports.getProfile = async (req, res) => {
    try {
        // req.user.id lấy từ Middleware verifyToken
        const [rows] = await db.execute(
            'SELECT id, username, email, role, created_at FROM Users WHERE id = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};