const jwt = require('jsonwebtoken');

// Hàm kiểm tra xem người dùng đã đăng nhập chưa
exports.verifyToken = (req, res, next) => {
    // Lấy token từ header "Authorization"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Cắt bỏ chữ "Bearer "

    if (!token) {
        return res.status(401).json({ success: false, message: "Bạn cần đăng nhập để thực hiện thao tác này" });
    }

    try {
        // Giải mã token bằng Secret Key trong file .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin user vào request để Controller sử dụng
        next(); // Cho phép đi tiếp vào Controller
    } catch (error) {
        return res.status(403).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

// Hàm kiểm tra quyền (Employer hay Candidate)
exports.authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Bạn không có quyền thực hiện hành động này" });
        }
        next();
    };
};
