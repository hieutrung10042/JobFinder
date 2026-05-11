const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
// --- ĐĂNG KÝ (REGISTER) ---
// --- ĐĂNG KÝ (REGISTER) ---
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false, 
            message: errors.array()[0].msg 
        });
    }

    // ĐÃ FIX LỖI Ở ĐÂY: Phải lấy cả 'name' ra từ req.body
    const { name, username, email, password, role } = req.body;
    
    // Bây giờ máy tính đã biết 'name' là gì rồi, nó sẽ không báo lỗi nữa
    const finalName = name || username; 

    if (!finalName) {
        return res.status(400).json({ 
            success: false, 
            message: "Tên không được để trống!" 
        });
    }
    
    try {
        // 1. Kiểm tra Email tồn tại
        const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (rows.length > 0) return res.status(400).json({ success: false, message: "Email đã tồn tại" });

        // 2. Hash mật khẩu và tạo OTP
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        // 3. CHỈ DÙNG 1 LỆNH INSERT DUY NHẤT VÀO BẢNG USERS
        const [userResult] = await db.execute(
            'INSERT INTO Users (username, email, password, role, otp_code, otp_expires, is_verified) VALUES (?, ?, ?, ?, ?, ?, 0)',
            [finalName, email, hashedPassword, role || 'candidate', otp, otpExpires]
        );

        const userId = userResult.insertId;

        // 4. Xử lý Profile theo Role (Dùng finalName)
        if (role === 'employer') {
            await db.execute('INSERT INTO Companies (name) VALUES (?)', [`Công ty của ${finalName}`]);
        } else {
            await db.execute('INSERT INTO Profiles (user_id, full_name) VALUES (?, ?)', [userId, finalName]);
        }

        // 5. Gửi mail xác thực
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

        // 6. Phản hồi duy nhất
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
    // 1. Nhận dữ liệu từ React gửi lên
    const { email, password, role } = req.body;

    // Kiểm tra xem frontend có gửi đủ email và password không
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Vui lòng nhập đầy đủ email và mật khẩu!' 
        });
    }

    try {
        // 2. Tìm user theo email trong Database
        const [users] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại!' });
        }

        const user = users[0];

        // 3. CHẶN ĐĂNG NHẬP SAI CỔNG (Kiểm tra Role)
        if (role && user.role !== role) {
            const roleName = user.role === 'employer' ? 'Nhà tuyển dụng (Employer)' : 'Ứng viên (Candidate)';
            return res.status(403).json({ 
                success: false, 
                message: `Sai cổng đăng nhập! Tài khoản này là của ${roleName}. Vui lòng chuyển tab.` 
            });
        }

        // 4. So sánh mật khẩu đã mã hóa
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác!' });
        }

        // 5. Kiểm tra tài khoản đã xác thực email chưa
        // MySQL lưu kiểu BOOLEAN dưới dạng TINYINT (0 là false, 1 là true)
        if (user.is_verified === 0 || user.is_verified === false) {
            return res.status(401).json({ 
                success: false, 
                message: "Tài khoản của bạn chưa được xác thực email! Vui lòng kiểm tra email để xác thực." 
            });
        }

        // 6. Kiểm tra cấu hình JWT (Nguyên nhân chính gây lỗi 500)
        if (!process.env.JWT_SECRET) {
            throw new Error("LỖI HỆ THỐNG: Thiếu biến JWT_SECRET trong file .env");
        }

        // 7. Tạo JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 8. Trả về thông tin thành công cho React
        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            token,
            user: { 
                id: user.id, 
                username: user.username, 
                role: user.role 
            }
        });

    } catch (error) {
        // Log lỗi ra Terminal để bạn biết chính xác dòng nào gây lỗi
        console.error("=== LỖI TẠI HÀM LOGIN ===", error);
        
        res.status(500).json({ 
            success: false, 
            message: "Lỗi máy chủ: " + error.message 
        });
    }
};
// --- Lấy thông tin cá nhân ---
exports.getProfile = async (req, res) => {
    try {
        // req.user.id lấy từ Middleware verifyToken
        const [rows] = await db.execute(
            // ĐÃ BỔ SUNG THÊM avatar_url VÀO CÂU TRUY VẤN
            'SELECT id, username, email, role, avatar_url, created_at FROM Users WHERE id = ?',
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
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log("Đang yêu cầu OTP cho email:", email);

    try {
        // 1. Kiểm tra xem User có tồn tại không
        const [users] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "Email không tồn tại trong hệ thống!" });
        }

        // 2. Tạo mã OTP và thời gian hết hạn (10 phút)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); 

        // 3. LƯU VÀO DATABASE (Đây là bước bạn đang thiếu)
        const [updateResult] = await db.execute(
            'UPDATE Users SET otp_code = ?, otp_expires = ? WHERE email = ?',
            [otp, expires, email]
        );

        console.log("Kết quả cập nhật DB:", updateResult);

        // 4. Cấu hình gửi mail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 5. Gửi mail
        await transporter.sendMail({
            from: `"JobFinder" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Mã xác thực khôi phục mật khẩu',
            text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 10 phút.`
        });

        // 6. Phản hồi cho Client
        res.status(200).json({ 
            success: true, 
            message: "Mã OTP đã được gửi về email của bạn!" 
        });

    } catch (error) {
        console.error("Lỗi tại forgotPassword:", error);
        res.status(500).json({ success: false, message: "Có lỗi xảy ra, vui lòng thử lại sau!" });
    }
};
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // 1. Tìm user theo email và mã OTP
        const [users] = await db.execute(
            'SELECT * FROM Users WHERE email = ? AND otp_code = ?', 
            [email, otp]
        );

        if (users.length === 0) {
            return res.status(400).json({ success: false, message: "Mã OTP không chính xác!" });
        }

        const user = users[0];

        // 2. Kiểm tra mã OTP có hết hạn chưa
        const now = new Date();
        if (now > new Date(user.otp_expires)) {
            return res.status(400).json({ success: false, message: "Mã OTP đã hết hạn!" });
        }

        // ---------------------------------------------------------
        // BƯỚC 2.5 THÊM MỚI: Kiểm tra trùng mật khẩu
        // ---------------------------------------------------------
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ 
                success: false, 
                message: "Mật khẩu mới không được trùng với mật khẩu hiện tại!" 
            });
        }

        // 3. Mã OTP đúng và Mật khẩu không trùng -> Băm mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 4. Cập nhật mật khẩu mới và xóa mã OTP cũ trong DB (để không dùng lại được nữa)
        await db.execute(
            'UPDATE Users SET password = ?, otp_code = NULL, otp_expires = NULL WHERE email = ?',
            [hashedPassword, email]
        );

        res.status(200).json({ success: true, message: "Đặt lại mật khẩu thành công! Hãy đăng nhập bằng mật khẩu mới." });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
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

        // Kích hoạt tài khoản và xóa mã OTP
        await db.execute(
            'UPDATE Users SET is_verified = 1, otp_code = NULL, otp_expires = NULL WHERE email = ?',
            [email]
        );

        res.status(200).json({ success: true, message: "Xác thực tài khoản thành công! Giờ bạn có thể đăng nhập." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 phút
    max: 100, // Giới hạn 100 request mỗi IP
    standardHeaders: true,
    legacyHeaders: false,
    // THÊM DÒNG NÀY ĐỂ FIX LỖI:
    validate: { xForwardedForHeader: false }, 
});
// =========================================================================
// CÁC CHỨC NĂNG MỚI THÊM: ĐĂNG NHẬP 2 LỚP (2FA) DÀNH RIÊNG CHO ADMIN
// =========================================================================

// --- BƯỚC 1: KIỂM TRA MẬT KHẨU VÀ GỬI OTP (Thay thế API Login cũ ở trang Admin) ---
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ email và mật khẩu!' });
    }

    try {
        const [users] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại!' });
        }

        const user = users[0];

        // Chặn cứng: Chỉ cho phép tài khoản Admin
        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Khu vực này chỉ dành cho Admin!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Mật khẩu không chính xác!' });
        }

        // Tạo mã OTP 6 số và thời gian hết hạn (5 phút)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 5 * 60 * 1000); 

        // Lưu OTP vào Database
        await db.execute(
            'UPDATE Users SET otp_code = ?, otp_expires = ? WHERE email = ?',
            [otp, expires, email]
        );

        // Gửi OTP qua Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({
            from: `"JobFinder Admin" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Mã OTP Đăng nhập Quản trị',
            text: `Mã OTP xác thực đăng nhập Admin của bạn là: ${otp}. Mã này sẽ hết hạn sau 5 phút.`
        });

        // Trả về Frontend để nó chuyển sang màn hình nhập OTP
        res.status(200).json({ 
            success: true, 
            message: "Mật khẩu hợp lệ. Vui lòng kiểm tra email để lấy mã OTP!",
        });

    } catch (error) {
        console.error("Lỗi tại adminLogin:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ: " + error.message });
    }
};

// --- BƯỚC 2: XÁC THỰC OTP VÀ CẤP TOKEN ---
exports.verifyLoginOTP = async (req, res) => {
    const { email, otp } = req.body;
    
    try {
        const [users] = await db.execute(
            'SELECT * FROM Users WHERE email = ? AND otp_code = ?', 
            [email, otp]
        );

        if (users.length === 0) {
            return res.status(400).json({ success: false, message: "Mã OTP không chính xác!" });
        }

        const user = users[0];

        // Kiểm tra xem OTP đã hết hạn chưa
        const now = new Date();
        if (now > new Date(user.otp_expires)) {
            return res.status(400).json({ success: false, message: "Mã OTP đã hết hạn!" });
        }

        // OTP đúng -> Xóa OTP khỏi Database để bảo mật
        await db.execute('UPDATE Users SET otp_code = NULL, otp_expires = NULL WHERE email = ?', [email]);

        // Tạo Token Đăng nhập
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (error) {
        console.error("Lỗi tại verifyLoginOTP:", error);
        res.status(500).json({ success: false, message: 'Lỗi server khi xác thực OTP: ' + error.message });
    }
};