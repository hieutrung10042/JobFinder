const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
// Đường dẫn: /api/auth/register
router.post('/register', authController.register);

// Đường dẫn: /api/auth/login
router.post('/login', authController.login);

// Route lấy profile (Cần đăng nhập mới xem được của chính mình)
router.get('/profile', verifyToken, authController.getProfile);
module.exports = router;