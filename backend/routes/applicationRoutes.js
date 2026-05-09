const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

router.post('/apply', verifyToken, authorizeRole(['candidate']), applicationController.applyJob);

router.get('/employer/list', verifyToken, authorizeRole(['employer']), applicationController.getEmployerApplications);

router.put('/update-status', verifyToken, authorizeRole(['employer']), applicationController.updateApplicationStatus);

module.exports = router;