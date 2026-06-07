const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private/Admin
const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .populate('appointment', 'appointmentDate status')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: prescriptions.length, prescriptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get prescriptions for logged in patient
// @route   GET /api/prescriptions/myhistory
// @access  Private/Patient
const getMyPrescriptions = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const prescriptions = await Prescription.find({ patient: patient._id })
      .populate('doctor', 'name specialization phone')
      .populate('appointment', 'appointmentDate status reason')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: prescriptions.length, prescriptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get prescriptions for logged in doctor
// @route   GET /api/prescriptions/doctorprescriptions
// @access  Private/Doctor
const getDoctorPrescriptions = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const prescriptions = await Prescription.find({ doctor: doctor._id })
      .populate('patient', 'name email phone age gender bloodGroup')
      .populate('appointment', 'appointmentDate status reason')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: prescriptions.length, prescriptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email phone age gender bloodGroup address')
      .populate('doctor', 'name specialization qualification phone email')
      .populate('appointment', 'appointmentDate status reason timeSlot');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ success: true, prescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new prescription
// @route   POST /api/prescriptions
// @access  Private/Doctor
const createPrescription = async (req, res) => {
  try {
    const {
      appointmentId,
      patientId,
      diagnosis,
      medications,
      generalInstructions,
      followUpRequired,
      followUpDate,
    } = req.body;

    // Validation
    if (!appointmentId || !patientId || !diagnosis || !medications) {
      return res
        .status(400)
        .json({ message: 'Please fill all required fields' });
    }

    if (medications.length === 0) {
      return res
        .status(400)
        .json({ message: 'At least one medication is required' });
    }

    // Get doctor profile
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const prescription = await Prescription.create({
      appointment: appointmentId,
      patient: patientId,
      doctor: doctor._id,
      diagnosis,
      medications,
      generalInstructions: generalInstructions || '',
      followUpRequired: followUpRequired || false,
      followUpDate: followUpDate || null,
    });

    // Get patient user ID for notification
    const patient = await Patient.findById(patientId).populate('user');

    if (patient && patient.user) {
      await Notification.create({
        recipient: patient.user._id,
        title: 'New Prescription Added',
        message: `Dr. ${doctor.name} has added a new prescription for you. Diagnosis: ${diagnosis}`,
        type: 'general',
        relatedAppointment: appointmentId,
      });

      // Medication reminder notification
      await Notification.create({
        recipient: patient.user._id,
        title: 'Medication Reminder',
        message: `Please take your medications as prescribed by Dr. ${doctor.name}.`,
        type: 'medication_reminder',
        relatedAppointment: appointmentId,
      });
    }

    const populatedPrescription = await Prescription.findById(
      prescription._id
    )
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .populate('appointment', 'appointmentDate status');

    res.status(201).json({ success: true, prescription: populatedPrescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private/Doctor
const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .populate('appointment', 'appointmentDate status');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ success: true, prescription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private/Admin/Doctor
const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ success: true, message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPrescriptions,
  getMyPrescriptions,
  getDoctorPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
};