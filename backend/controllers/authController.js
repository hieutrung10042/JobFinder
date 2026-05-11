const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 phút
    max: 100, // Giới hạn 100 request mỗi IP
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }, 
});

// --- ĐĂNG KÝ (REGISTER) ---
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            message: errors.array()[0].msg 
        });
    }

    const { name, username, email, password, role } = req.body;
    const finalName = name || username; 

    if (!finalName) {
        return res.status(400).json({ 
            success: false, 
            message: "Tên không được để trống!" 
        });
    }
    
    try {
        const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (rows.length > 0) return res.status(400).json({ success: false, message: "Email đã tồn tại" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        const [userResult] = await db.execute(
            'INSERT INTO Users (username, email, password, role, otp_code, otp_expires, is_verified) VALUES (?, ?, ?, ?, ?, ?, 0)',
            [finalName, email, hashedPassword, role || 'candidate', otp, otpExpires]
        );

        const userId = userResult.insertId;

        if (role === 'employer') {
            await db.execute('INSERT INTO Companies (name) VALUES (?)', [`Công ty của ${finalName}`]);
        } else {
            await db.execute('INSERT INTO Profiles (user_id, full_name) VALUES (?, ?)', [userId, finalName]);
        }

        const transporter = nodemailer.createTransport({ 
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            } 
        });

        await transporter.sendMail({
            from: `"JobSpot" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Xác thực tài khoản mới',
            text: `Chào ${finalName}, mã xác thực của bạn là: ${otp}`
        });

        console.log("=== Đã gửi mail cho: ", email);

        return res.status(201).json({ 
            success: true, 
            message: "Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác thực." 
        });

    } catch (error) {
        console.error("Lỗi Register:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// --- ĐĂNG NHẬP (LOGIN) ---
exports.login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const [users] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại!' });
        }

        const user = users[0];

        if (role && user.role !== role) {
            const roleName = user.role === 'employer' ? 'Nhà tuyển dụng (Employer)' : 'Ứng viên (Candidate)';
            return res.status(403).json({ 
                success: false, 
                message: `Sai cổng đăng nhập! Tài khoản này là của ${roleName}. Vui lòng chuyển tab.` 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác!' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        if (user.is_verified === 0) {
            return res.status(401).json({ message: "Tài khoản của bạn chưa được xác thực email!" });
        }

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

// --- Lấy thông tin cá nhân ---
exports.getProfile = async (req, res) => {
    try {
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

// --- Quên mật khẩu ---
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "Email không tồn tại trong hệ thống!" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); 

        await db.execute(
            'UPDATE Users SET otp_code = ?, otp_expires = ? WHERE email = ?',
            [otp, expires, email]
        );

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"JobFinder" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Mã xác thực khôi phục mật khẩu',
            text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 10 phút.`
        });

        res.status(200).json({ success: true, message: "Mã OTP đã được gửi về email của bạn!" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Có lỗi xảy ra, vui lòng thử lại sau!" });
    }
};

// --- Đặt lại mật khẩu ---
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const [users] = await db.execute(
            'SELECT * FROM Users WHERE email = ? AND otp_code = ?', 
            [email, otp]
        );

        if (users.length === 0) {
            return res.status(400).json({ success: false, message: "Mã OTP không chính xác!" });
        }

        const user = users[0];
        const now = new Date();
        if (now > new Date(user.otp_expires)) {
            return res.status(400).json({ success: false, message: "Mã OTP đã hết hạn!" });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Mật khẩu mới không được trùng với mật khẩu hiện tại!" 
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.execute(
            'UPDATE Users SET password = ?, otp_code = NULL, otp_expires = NULL WHERE email = ?',
            [hashedPassword, email]
        );

        res.status(200).json({ success: true, message: "Đặt lại mật khẩu thành công! Hãy đăng nhập bằng mật khẩu mới." });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Xác thực Email ---
exports.verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const [users] = await db.execute(
            'SELECT * FROM Users WHERE email = ? AND otp_code = ?', 
            [email, otp]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: "Mã xác thực không đúng!" });
        }

        await db.execute(
            'UPDATE Users SET is_verified = 1, otp_code = NULL, otp_expires = NULL WHERE email = ?',
            [email]
        );

        res.status(200).json({ success: true, message: "Xác thực tài khoản thành công! Giờ bạn có thể đăng nhập." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- ĐĂNG NHẬP BẰNG GOOGLE ---
exports.googleLogin = async (req, res) => {
    const { accessToken, role } = req.body;

    try {
        const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        const { email, name } = googleResponse.data;
        const autoUsername = email.split('@')[0]; 

        const [users] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        let user = users[0];

        if (!user) {
            // FIX: Đổi 'users' thành 'Users' và bỏ qua trường name nếu bảng Users không có
            const [result] = await db.execute(
                'INSERT INTO Users (username, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
                [autoUsername, email, 'LOGIN_BY_GOOGLE_NO_PASSWORD', role || 'candidate', 1] 
            );
            
            user = { id: result.insertId, email: email, role: role || 'candidate', username: autoUsername };

            // Nếu muốn chèn vào Profiles/Companies, bạn có thể thêm logic tương tự phần Register
            if (role === 'employer') {
                await db.execute('INSERT INTO Companies (name) VALUES (?)', [`Công ty của ${name}`]);
            } else {
                await db.execute('INSERT INTO Profiles (user_id, full_name) VALUES (?, ?)', [result.insertId, name]);
            }
        }

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(200).json({ success: true, token: token, user: { username: user.username, email: user.email } });

    } catch (error) {
        console.error("Lỗi Google Login:", error);
        res.status(500).json({ success: false, message: "Lỗi kết nối Google: " + error.message });
    }
};