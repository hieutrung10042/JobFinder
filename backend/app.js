const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const jobController = require('./controllers/jobController');
const categoryRoutes = require('./routes/categoryRoutes');
const locationRoutes = require('./routes/locationRoutes');
const { verifyToken, authorizeRole } = require('./middlewares/authMiddleware');
const applicationRoutes = require('./routes/applicationRoutes');
require('dotenv').config();
// 1. Cấu hình Middlewares cơ bản
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json()); // Đọc dữ liệu JSON từ req.body
app.use(express.urlencoded({ extended: true }));
app.use('/api/applications', applicationRoutes);
// Sử dụng routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Lỗi server nội bộ!'
    });
});

// THÊM DÒNG NÀY CHO ADMIN:
app.use('/api/admin', require('./routes/admin/adminRoutes'));
// 2. Import Routes (Sau này bạn sẽ import authRoutes, jobRoutes vào đây)
// const authRoutes = require('./routes/authRoutes');
// app.use('/api/auth', authRoutes);


app.post('/api/jobs/create', verifyToken, authorizeRole(['employer']), (req, res) => {
    res.json({ 
        message: 'Đăng tin thành công!', 
        user: req.user 
    });
});
app.get('/', (req, res) => {
    res.send('Backend JobFinder đang hoạt động!');
});

// 3. Error Handler Middleware (Hứng lỗi tập trung) 

// 4. Khởi động Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});