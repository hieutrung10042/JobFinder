const express = require('express');
const router = express.Router();
const jobController = require('../../controllers/admin/adminJobController');
const { verifyToken, authorizeRole } = require('../../middlewares/authMiddleware');

// ── Admin ───────────────────────────────────────────────
router.get('/admin/pending', verifyToken, authorizeRole(['admin']), jobController.getPendingJobs);
router.get('/admin/stats', verifyToken, authorizeRole(['admin']), jobController.getJobStats);
router.put('/admin/:job_id/approve', verifyToken, authorizeRole(['admin']), jobController.approveJob);
router.put('/admin/:job_id/reject', verifyToken, authorizeRole(['admin']), jobController.rejectJob);


module.exports = router;