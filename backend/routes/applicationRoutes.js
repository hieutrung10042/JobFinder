const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

// --- ROUTES CHO CANDIDATE ---

// Candidate nộp đơn
router.post('/apply', verifyToken, authorizeRole(['candidate']), applicationController.applyJob);

// Candidate xem danh sách đã ứng tuyển (Trang My Applications)
router.get('/my-applications', verifyToken, authorizeRole(['candidate']), applicationController.getMyApplications);


// --- ROUTES CHO EMPLOYER ---

// Employer xem danh sách ứng viên (CandidateManagement)
router.get('/employer/list', verifyToken, authorizeRole(['employer']), applicationController.getEmployerApplications);

// Employer xem chi tiết 1 ứng viên (CandidateDetail)
router.get('/employer/detail/:id', verifyToken, authorizeRole(['employer']), applicationController.getApplicationById);

// Employer cập nhật trạng thái
router.put('/update-status', verifyToken, authorizeRole(['employer']), applicationController.updateApplicationStatus);

// Employer xem danh sách jobs + stats (EmployerDashboard)
router.get('/employer/jobs', verifyToken, authorizeRole(['employer']), applicationController.getEmployerJobs);

// Notes
router.get('/notes/:application_id', verifyToken, authorizeRole(['employer']), applicationController.getNotes);
router.post('/notes', verifyToken, authorizeRole(['employer']), applicationController.addNote);
router.delete('/notes/:note_id', verifyToken, authorizeRole(['employer']), applicationController.deleteNote);

// Toggle job status (đóng/mở)
router.put('/jobs/toggle-status', verifyToken, authorizeRole(['employer']), applicationController.toggleJobStatus);

module.exports = router;
