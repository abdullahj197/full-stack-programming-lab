const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Admin/Doctor
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('user', 'name email role')
      .populate('assignedDoctor', 'name specialization');
    res.json({ success: true, count: patients.length, patients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('assignedDoctor', 'name specialization phone');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient by user ID (logged in patient)
// @route   GET /api/patients/myprofile
// @access  Private/Patient
const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id })
      .populate('user', 'name email role')
      .populate('assignedDoctor', 'name specialization phone');

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new patient
// @route   POST /api/patients
// @access  Private/Admin
const createPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      medicalHistory,
    } = req.body;

    // Validation
    if (!name || !age || !gender || !phone || !email || !address || !bloodGroup) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Check duplicate email
    const exists = await Patient.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Patient with this email already exists' });
    }

    const patient = await Patient.create({
      name,
      age,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      medicalHistory: medicalHistory || [],
    });

    res.status(201).json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private/Admin
const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update my own profile (patient)
// @route   PUT /api/patients/myprofile
// @access  Private/Patient
const updateMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign doctor to patient
// @route   PUT /api/patients/:id/assign-doctor
// @access  Private/Admin
const assignDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { assignedDoctor: doctorId },
      { new: true }
    ).populate('assignedDoctor', 'name specialization phone');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  getMyProfile,
  createPatient,
  updatePatient,
  updateMyProfile,
  deletePatient,
  assignDoctor,
};