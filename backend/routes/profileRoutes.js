const express = require('express');
const router = express.Router();
const profileController = require('../controllers/ProfileController');
const { protect } = require('../middlewares/authMiddleware'); // Nếu bạn muốn bảo mật

// Định nghĩa route cập nhật
router.post('/update', profileController.updateProfile);

module.exports = router;