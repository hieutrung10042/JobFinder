const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/UserController');
const { verifyToken, authorizeRole } = require('../../middlewares/authMiddleware');

// Tất cả routes đều yêu cầu Admin
router.get('/', verifyToken, authorizeRole(['admin']), userController.getUsers);
router.get('/:user_id', verifyToken, authorizeRole(['admin']), userController.getUserDetail);
router.put('/:user_id/toggle-ban', verifyToken, authorizeRole(['admin']), userController.toggleBanUser);
router.put('/:user_id/verify-company', verifyToken, authorizeRole(['admin']), userController.verifyCompany);

module.exports = router;