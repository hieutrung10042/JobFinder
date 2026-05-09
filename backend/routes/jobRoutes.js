const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');
const jobController = require('../controllers/jobController');

// Route này ai cũng xem được (Công khai)
router.get('/', jobController.getAllJobs);
// API Đăng tin: Chỉ những người đã đăng nhập VÀ có quyền 'employer' mới được vào
router.post('/create', verifyToken, authorizeRole(['employer']), jobController.createJob);

// API Quản lý Admin: Chỉ Admin mới được vào
router.delete('/delete-user/:id', verifyToken, authorizeRole(['admin']), (req, res) => {
    res.send('Admin đã xóa người dùng');
});

module.exports = router;