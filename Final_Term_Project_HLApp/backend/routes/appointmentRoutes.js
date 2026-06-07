const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getMyAppointments,
  getDoctorAppointments,
  getAppointmentById,
  bookAppointment,
  updateAppointmentStatus,
  assignDoctorToAppointment,
  updateTreatmentStatus,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Patient - get own appointments
router.get(
  '/myappointments',
  protect,
  authorizeRoles('patient'),
  getMyAppointments
);

// Doctor - get own appointments
router.get(
  '/doctorappointments',
  protect,
  authorizeRoles('doctor'),
  getDoctorAppointments
);

// Admin - get all appointments
router.get(
  '/',
  protect,
  authorizeRoles('admin'),
  getAllAppointments
);

// Get single appointment
router.get(
  '/:id',
  protect,
  getAppointmentById
);

// Patient - book new appointment
router.post(
  '/',
  protect,
  authorizeRoles('patient'),
  bookAppointment
);

// Admin/Doctor - update appointment status
router.put(
  '/:id/status',
  protect,
  authorizeRoles('admin', 'doctor'),
  updateAppointmentStatus
);

// Admin - assign doctor to appointment
router.put(
  '/:id/assign-doctor',
  protect,
  authorizeRoles('admin'),
  assignDoctorToAppointment
);

// Doctor - update treatment status
router.put(
  '/:id/treatment',
  protect,
  authorizeRoles('doctor'),
  updateTreatmentStatus
);

// Admin - delete appointment
router.delete(
  '/:id',
  protect,
  authorizeRoles('admin'),
  deleteAppointment
);

module.exports = router;