const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');

// --- 1. CẤU HÌNH KHIÊN ---

// Giới hạn login
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 5, 
    // THÊM DÒNG NÀY ĐỂ HẾT LỖI ĐỎ TERMINAL
    validate: { xForwardedForHeader: false, default: false }, 
    keyGenerator: (req) => {
        return req.body.email || req.ip; 
    },
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: `Tài khoản ${req.body.email} đã bị tạm khóa 1 phút do nhập sai nhiều lần.`
        });
    }
});

// Kiểm tra dữ liệu đăng ký
const registerValidation = [
    body('email').isEmail().withMessage('Định dạng email không hợp lệ!'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự!'),
    body('username').notEmpty().withMessage('Tên không được để trống!')
];

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    // Dòng này là bắt buộc để fix lỗi ERR_ERL_KEY_GEN_IPV6 trên localhost
    validate: { xForwardedForHeader: false, default: false }, 
});

// router.use(apiLimiter);
// Đăng ký (Có validation)
router.post('/register', registerValidation, authController.register);

// Đăng nhập (Có giới hạn lần thử)
router.post('/login', loginLimiter, authController.login);

// Lấy profile
router.get('/profile', verifyToken, authController.getProfile);

// Route gửi mã OTP quên mật khẩu
router.post('/forgot-password', authController.forgotPassword);

// Route thực hiện đặt lại mật khẩu mới
router.post('/reset-password', authController.resetPassword);
// Thêm route xác thực email
router.post('/verify-email', authController.verifyEmail);
//Rout đăng nhập bằng Google
router.post('/google', authController.googleLogin);
module.exports = router;