const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  getMyProfile,
  createPatient,
  updatePatient,
  updateMyProfile,
  deletePatient,
  assignDoctor,
} = require('../controllers/patientController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Patient own profile routes
router.get(
  '/myprofile',
  protect,
  authorizeRoles('patient'),
  getMyProfile
);

router.put(
  '/myprofile',
  protect,
  authorizeRoles('patient'),
  updateMyProfile
);

// Get all patients - admin and doctor only
router.get(
  '/',
  protect,
  authorizeRoles('admin', 'doctor'),
  getAllPatients
);

// Get single patient
router.get(
  '/:id',
  protect,
  authorizeRoles('admin', 'doctor'),
  getPatientById
);

// Create patient - admin only
router.post(
  '/',
  protect,
  authorizeRoles('admin'),
  createPatient
);

// Update patient - admin only
router.put(
  '/:id',
  protect,
  authorizeRoles('admin'),
  updatePatient
);

// Delete patient - admin only
router.delete(
  '/:id',
  protect,
  authorizeRoles('admin'),
  deletePatient
);

// Assign doctor to patient - admin only
router.put(
  '/:id/assign-doctor',
  protect,
  authorizeRoles('admin'),
  assignDoctor
);

module.exports = router;