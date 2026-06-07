const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments for logged in patient
// @route   GET /api/appointments/myappointments
// @access  Private/Patient
const getMyAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const appointments = await Appointment.find({ patient: patient._id })
      .populate('doctor', 'name specialization phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments for logged in doctor
// @route   GET /api/appointments/doctorappointments
// @access  Private/Doctor
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('patient', 'name email phone age gender bloodGroup')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone age gender bloodGroup address')
      .populate('doctor', 'name specialization qualification phone email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Book new appointment
// @route   POST /api/appointments
// @access  Private/Patient
const bookAppointment = async (req, res) => {
  try {
    const { appointmentDate, timeSlot, reason, doctorId } = req.body;

    if (!appointmentDate || !timeSlot || !reason) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Get patient profile
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctorId || null,
      appointmentDate,
      timeSlot,
      reason,
      status: 'pending',
    });

    // Create notification for admin
    await Notification.create({
      recipient: req.user._id,
      title: 'Appointment Booked',
      message: `Your appointment has been booked for ${appointmentDate}. Waiting for confirmation.`,
      type: 'general',
      relatedAppointment: appointment._id,
    });

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status (confirm/reject)
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin/Doctor
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, rejectionReason, notes } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status,
        rejectionReason: rejectionReason || '',
        notes: notes || '',
      },
      { new: true }
    )
      .populate('patient', 'name email user')
      .populate('doctor', 'name specialization');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Send notification to patient
    await Notification.create({
      recipient: appointment.patient.user,
      title: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message:
        status === 'confirmed'
          ? `Your appointment has been confirmed for ${appointment.appointmentDate}.`
          : `Your appointment has been rejected. Reason: ${rejectionReason || 'Not specified'}`,
      type:
        status === 'confirmed'
          ? 'appointment_confirmed'
          : 'appointment_rejected',
      relatedAppointment: appointment._id,
    });

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign doctor to appointment
// @route   PUT /api/appointments/:id/assign-doctor
// @access  Private/Admin
const assignDoctorToAppointment = async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { doctor: doctorId },
      { new: true }
    )
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update treatment status
// @route   PUT /api/appointments/:id/treatment
// @access  Private/Doctor
const updateTreatmentStatus = async (req, res) => {
  try {
    const { treatmentStatus, checkupRecord, notes, followUpDate } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        treatmentStatus,
        checkupRecord,
        notes,
        followUpDate: followUpDate || null,
        status: followUpDate ? 'follow-up' : 'completed',
      },
      { new: true }
    )
      .populate('patient', 'name email user')
      .populate('doctor', 'name specialization');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Send follow up notification if needed
    if (followUpDate) {
      await Notification.create({
        recipient: appointment.patient.user,
        title: 'Follow-up Visit Scheduled',
        message: `Your follow-up visit has been scheduled for ${followUpDate}.`,
        type: 'followup_reminder',
        relatedAppointment: appointment._id,
      });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAppointments,
  getMyAppointments,
  getDoctorAppointments,
  getAppointmentById,
  bookAppointment,
  updateAppointmentStatus,
  assignDoctorToAppointment,
  updateTreatmentStatus,
  deleteAppointment,
};