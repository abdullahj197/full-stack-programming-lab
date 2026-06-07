const express = require('express');
const router = express.Router();
const {
  getAllPrescriptions,
  getMyPrescriptions,
  getDoctorPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
} = require('../controllers/prescriptionController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Patient - get own prescriptions and medical history
router.get(
  '/myhistory',
  protect,
  authorizeRoles('patient'),
  getMyPrescriptions
);

// Doctor - get own prescriptions
router.get(
  '/doctorprescriptions',
  protect,
  authorizeRoles('doctor'),
  getDoctorPrescriptions
);

// Admin - get all prescriptions
router.get(
  '/',
  protect,
  authorizeRoles('admin'),
  getAllPrescriptions
);

// Get single prescription
router.get(
  '/:id',
  protect,
  getPrescriptionById
);

// Doctor - create prescription
router.post(
  '/',
  protect,
  authorizeRoles('doctor'),
  createPrescription
);

// Doctor - update prescription
router.put(
  '/:id',
  protect,
  authorizeRoles('doctor'),
  updatePrescription
);

// Admin/Doctor - delete prescription
router.delete(
  '/:id',
  protect,
  authorizeRoles('admin', 'doctor'),
  deletePrescription
);

module.exports = router;