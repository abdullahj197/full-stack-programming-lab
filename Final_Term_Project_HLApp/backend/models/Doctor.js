const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    fee: {
      type: Number,
      required: [true, 'Fee is required'],
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Wednesday', 'Friday'],
    },
    availableTime: {
      type: String,
      default: '9:00 AM - 5:00 PM',
    },
    image: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);