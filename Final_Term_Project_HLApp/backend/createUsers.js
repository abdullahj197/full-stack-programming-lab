const dotenv = require('dotenv');
const User = require('./models/User');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

dotenv.config();

const createUsers = async () => {
  try {
    await connectDB();

    const demoEmails = [
      'admin@healthcare.com',
      'doctor@healthcare.com',
      'patient@healthcare.com',
    ];

    // Delete existing demo records
    await Promise.all([
      User.deleteMany({ email: { $in: demoEmails } }),
      Doctor.deleteMany({ email: { $in: demoEmails } }),
      Patient.deleteMany({ email: { $in: demoEmails } }),
    ]);

    // Create Admin
    await User.create({
      name: 'Admin User',
      email: 'admin@healthcare.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Admin created');

    // Create Doctor User
    const doctorUser = await User.create({
      name: 'Dr. John Smith',
      email: 'doctor@healthcare.com',
      password: 'doctor123',
      role: 'doctor',
    });

    // Create Doctor Profile
    await Doctor.create({
      user: doctorUser._id,
      name: 'Dr. John Smith',
      email: 'doctor@healthcare.com',
      specialization: 'Cardiology',
      qualification: 'MBBS, FCPS',
      experience: 10,
      phone: '0300-1234567',
      fee: 2000,
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      availableTime: '9:00 AM - 5:00 PM',
    });
    console.log('✅ Doctor created');

    // Create Patient User
    const patientUser = await User.create({
      name: 'John Patient',
      email: 'patient@healthcare.com',
      password: 'patient123',
      role: 'patient',
    });

    // Create Patient Profile
    await Patient.create({
      user: patientUser._id,
      name: 'John Patient',
      email: 'patient@healthcare.com',
      age: 30,
      gender: 'Male',
      phone: '0301-1234567',
      address: 'Islamabad, Pakistan',
      bloodGroup: 'O+',
    });
    console.log('✅ Patient created');

    console.log('');
    console.log('🎉 All demo users created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('Admin:   admin@healthcare.com / admin123');
    console.log('Doctor:  doctor@healthcare.com / doctor123');
    console.log('Patient: patient@healthcare.com / patient123');

    await mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

createUsers();