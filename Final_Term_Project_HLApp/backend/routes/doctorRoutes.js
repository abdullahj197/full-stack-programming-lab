const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Get all doctors - any logged in user can view
router.get('/', protect, getAllDoctors);

// Get single doctor
router.get('/:id', protect, getDoctorById);

// Create doctor - admin only
router.post('/', protect, authorizeRoles('admin'), createDoctor);

// Update doctor - admin only
router.put('/:id', protect, authorizeRoles('admin'), updateDoctor);

// Delete doctor - admin only
router.delete('/:id', protect, authorizeRoles('admin'), deleteDoctor);

module.exports = router;