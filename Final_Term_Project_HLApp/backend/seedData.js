const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
require('dotenv').config();

const configureMongoDns = () => {
  const servers = process.env.DNS_SERVERS
    ? process.env.DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean)
    : ['8.8.8.8', '1.1.1.1'];

  if (servers.length > 0) {
    dns.setServers(servers);
  }
};

const demoAccounts = {
  admin: { name: 'Admin User', email: 'admin@healthcare.com', password: 'admin123' },
  doctor: {
    name: 'Dr. John Smith',
    email: 'doctor@healthcare.com',
    password: 'doctor123',
    specialization: 'Cardiology',
    qualification: 'MBBS, FCPS',
    experience: 10,
    phone: '0300-1234567',
    fee: 2000,
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableTime: '9:00 AM - 5:00 PM',
  },
  patient: {
    name: 'John Patient',
    email: 'patient@healthcare.com',
    password: 'patient123',
    age: 30,
    gender: 'Male',
    phone: '0301-1234567',
    address: 'Islamabad, Pakistan',
    bloodGroup: 'O+',
  },
};

// ── Inline schemas (avoids import path issues) ──────────────────────────────

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'doctor', 'patient'], default: 'patient' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true },
    qualification: { type: String, required: true },
    experience: { type: Number, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    fee: { type: Number, required: true },
    availableDays: { type: [String], default: ['Monday', 'Wednesday', 'Friday'] },
    availableTime: { type: String, default: '9:00 AM - 5:00 PM' },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], required: true },
    medicalHistory: { type: [String], default: [] },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Patient = mongoose.model('Patient', patientSchema);

// ── Seed Data ────────────────────────────────────────────────────────────────

const doctorsData = [
  { name: 'Dr. Ahmed Khan',      specialization: 'Cardiologist',       qualification: 'MBBS, MD (Cardiology)',        experience: 12, phone: '0301-1234567', email: 'ahmed.khan@hospital.com',      fee: 2000, availableDays: ['Monday', 'Wednesday', 'Friday'],    availableTime: '9:00 AM - 2:00 PM' },
  { name: 'Dr. Sara Malik',      specialization: 'Neurologist',        qualification: 'MBBS, FCPS (Neurology)',       experience: 9,  phone: '0302-2345678', email: 'sara.malik@hospital.com',      fee: 2500, availableDays: ['Tuesday', 'Thursday', 'Saturday'],  availableTime: '10:00 AM - 4:00 PM' },
  { name: 'Dr. Usman Ali',       specialization: 'Orthopedic Surgeon', qualification: 'MBBS, MS (Orthopedics)',       experience: 15, phone: '0303-3456789', email: 'usman.ali@hospital.com',       fee: 3000, availableDays: ['Monday', 'Tuesday', 'Wednesday'],   availableTime: '8:00 AM - 1:00 PM' },
  { name: 'Dr. Fatima Zahra',    specialization: 'Pediatrician',       qualification: 'MBBS, DCH',                   experience: 7,  phone: '0304-4567890', email: 'fatima.zahra@hospital.com',    fee: 1500, availableDays: ['Monday', 'Wednesday', 'Friday'],    availableTime: '11:00 AM - 5:00 PM' },
  { name: 'Dr. Bilal Hussain',   specialization: 'Dermatologist',      qualification: 'MBBS, DDVL',                  experience: 6,  phone: '0305-5678901', email: 'bilal.hussain@hospital.com',   fee: 1800, availableDays: ['Tuesday', 'Thursday'],              availableTime: '9:00 AM - 3:00 PM' },
  { name: 'Dr. Ayesha Siddiqui', specialization: 'Gynecologist',       qualification: 'MBBS, FCPS (Gynecology)',     experience: 11, phone: '0306-6789012', email: 'ayesha.siddiqui@hospital.com', fee: 2200, availableDays: ['Monday', 'Wednesday', 'Saturday'],  availableTime: '10:00 AM - 2:00 PM' },
  { name: 'Dr. Kamran Iqbal',    specialization: 'ENT Specialist',     qualification: 'MBBS, DLO',                   experience: 8,  phone: '0307-7890123', email: 'kamran.iqbal@hospital.com',    fee: 1700, availableDays: ['Tuesday', 'Friday', 'Saturday'],    availableTime: '9:00 AM - 4:00 PM' },
  { name: 'Dr. Zainab Noor',     specialization: 'Psychiatrist',       qualification: 'MBBS, FCPS (Psychiatry)',     experience: 10, phone: '0308-8901234', email: 'zainab.noor@hospital.com',     fee: 2800, availableDays: ['Monday', 'Thursday', 'Friday'],     availableTime: '2:00 PM - 7:00 PM' },
  { name: 'Dr. Hassan Raza',     specialization: 'Urologist',          qualification: 'MBBS, FCPS (Urology)',        experience: 13, phone: '0309-9012345', email: 'hassan.raza@hospital.com',     fee: 3200, availableDays: ['Wednesday', 'Thursday', 'Saturday'], availableTime: '8:00 AM - 12:00 PM' },
  { name: 'Dr. Nadia Tariq',     specialization: 'Ophthalmologist',    qualification: 'MBBS, DOMS',                  experience: 5,  phone: '0310-0123456', email: 'nadia.tariq@hospital.com',     fee: 1600, availableDays: ['Monday', 'Tuesday', 'Friday'],      availableTime: '10:00 AM - 3:00 PM' },
  { name: 'Dr. Imran Sheikh',    specialization: 'Gastroenterologist', qualification: 'MBBS, MRCP (Gastro)',         experience: 14, phone: '0311-1234560', email: 'imran.sheikh@hospital.com',    fee: 2700, availableDays: ['Tuesday', 'Wednesday', 'Friday'],   availableTime: '9:00 AM - 2:00 PM' },
  { name: 'Dr. Hira Baig',       specialization: 'Endocrinologist',    qualification: 'MBBS, MD (Endocrinology)',    experience: 9,  phone: '0312-2345601', email: 'hira.baig@hospital.com',       fee: 2400, availableDays: ['Monday', 'Thursday', 'Saturday'],   availableTime: '11:00 AM - 5:00 PM' },
  { name: 'Dr. Tariq Mehmood',   specialization: 'Pulmonologist',      qualification: 'MBBS, FCPS (Pulmonology)',    experience: 16, phone: '0313-3456012', email: 'tariq.mehmood@hospital.com',   fee: 2900, availableDays: ['Monday', 'Wednesday', 'Thursday'],  availableTime: '8:00 AM - 1:00 PM' },
  { name: 'Dr. Sana Qureshi',    specialization: 'Rheumatologist',     qualification: 'MBBS, MRCP (Rheumatology)',  experience: 7,  phone: '0314-4560123', email: 'sana.qureshi@hospital.com',    fee: 2100, availableDays: ['Tuesday', 'Friday', 'Saturday'],    availableTime: '10:00 AM - 4:00 PM' },
  { name: 'Dr. Faisal Nawaz',    specialization: 'General Surgeon',    qualification: 'MBBS, FCPS (Surgery)',        experience: 18, phone: '0315-5601234', email: 'faisal.nawaz@hospital.com',    fee: 3500, availableDays: ['Monday', 'Tuesday', 'Thursday'],    availableTime: '7:00 AM - 12:00 PM' },
];

const patientsData = [
  { name: 'Ali Raza',        age: 35, gender: 'Male',   phone: '0321-1111111', email: 'ali.raza@gmail.com',        address: 'House 12, Street 4, F-7, Islamabad',       bloodGroup: 'A+',  medicalHistory: ['Hypertension', 'Diabetes'] },
  { name: 'Mariam Asif',     age: 28, gender: 'Female', phone: '0322-2222222', email: 'mariam.asif@gmail.com',     address: 'Flat 3B, Blue Area, Islamabad',             bloodGroup: 'B+',  medicalHistory: ['Asthma'] },
  { name: 'Zubair Ahmed',    age: 45, gender: 'Male',   phone: '0323-3333333', email: 'zubair.ahmed@gmail.com',    address: 'House 56, G-9/1, Islamabad',               bloodGroup: 'O+',  medicalHistory: ['Arthritis', 'High Cholesterol'] },
  { name: 'Sobia Khalid',    age: 32, gender: 'Female', phone: '0324-4444444', email: 'sobia.khalid@gmail.com',    address: 'House 7, E-11, Islamabad',                 bloodGroup: 'AB+', medicalHistory: [] },
  { name: 'Hamza Usman',     age: 22, gender: 'Male',   phone: '0325-5555555', email: 'hamza.usman@gmail.com',     address: 'Hostel 4, NUST Campus, Islamabad',         bloodGroup: 'A-',  medicalHistory: ['Migraine'] },
  { name: 'Rabia Farooq',    age: 50, gender: 'Female', phone: '0326-6666666', email: 'rabia.farooq@gmail.com',    address: 'House 23, I-8/2, Islamabad',               bloodGroup: 'B-',  medicalHistory: ['Diabetes', 'Thyroid'] },
  { name: 'Adeel Mirza',     age: 38, gender: 'Male',   phone: '0327-7777777', email: 'adeel.mirza@gmail.com',     address: 'House 9, G-13, Islamabad',                 bloodGroup: 'O-',  medicalHistory: ['Back Pain'] },
  { name: 'Noor Fatima',     age: 26, gender: 'Female', phone: '0328-8888888', email: 'noor.fatima@gmail.com',     address: 'Apartment 5, DHA Phase 2, Islamabad',      bloodGroup: 'A+',  medicalHistory: ['Anemia'] },
  { name: 'Shahzad Butt',    age: 55, gender: 'Male',   phone: '0329-9999999', email: 'shahzad.butt@gmail.com',    address: 'House 88, F-10/3, Islamabad',              bloodGroup: 'AB-', medicalHistory: ['Heart Disease', 'Hypertension'] },
  { name: 'Amna Javed',      age: 41, gender: 'Female', phone: '0330-1010101', email: 'amna.javed@gmail.com',      address: 'House 14, H-13, Islamabad',                bloodGroup: 'B+',  medicalHistory: ['PCOS', 'Vitamin D Deficiency'] },
  { name: 'Kashif Pervaiz',  age: 29, gender: 'Male',   phone: '0331-1111222', email: 'kashif.pervaiz@gmail.com',  address: 'House 31, I-10/4, Islamabad',              bloodGroup: 'O+',  medicalHistory: [] },
  { name: 'Hina Shahid',     age: 36, gender: 'Female', phone: '0332-2222333', email: 'hina.shahid@gmail.com',     address: 'Flat 7, PWD Housing Society, Islamabad',   bloodGroup: 'A+',  medicalHistory: ['Gastritis'] },
  { name: 'Omer Farhan',     age: 48, gender: 'Male',   phone: '0333-3333444', email: 'omer.farhan@gmail.com',     address: 'House 2, Bahria Town Phase 4, Rawalpindi', bloodGroup: 'B-',  medicalHistory: ['Kidney Stones', 'Diabetes'] },
  { name: 'Saima Nawaz',     age: 33, gender: 'Female', phone: '0334-4444555', email: 'saima.nawaz@gmail.com',     address: 'House 19, G-15, Islamabad',                bloodGroup: 'AB+', medicalHistory: ['Anxiety', 'Insomnia'] },
  { name: 'Waqar Hassan',    age: 60, gender: 'Male',   phone: '0335-5555666', email: 'waqar.hassan@gmail.com',    address: 'House 77, F-8/4, Islamabad',               bloodGroup: 'O+',  medicalHistory: ['COPD', 'Hypertension', 'Diabetes'] },
];

// ── Main Seed Function ───────────────────────────────────────────────────────

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/hlapp';

    if (MONGO_URI.startsWith('mongodb+srv://')) {
      configureMongoDns();
    }

    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing doctors and patients (keeps admin user safe)
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await User.deleteMany({ role: { $in: ['doctor', 'patient'] } });
    console.log('🗑️  Cleared existing doctor/patient records');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // ── Seed Doctors ──────────────────────────────────────────────────────
    console.log('\n👨‍⚕️  Seeding doctors...');
    for (const doc of doctorsData) {
      // Create User account for doctor
      const userDoc = await User.create({
        name: doc.name,
        email: doc.email,
        password: hashedPassword,
        role: 'doctor',
        isActive: true,
      });

      // Create Doctor record linked to User
      await Doctor.create({
        user: userDoc._id,
        name: doc.name,
        specialization: doc.specialization,
        qualification: doc.qualification,
        experience: doc.experience,
        phone: doc.phone,
        email: doc.email,
        fee: doc.fee,
        availableDays: doc.availableDays,
        availableTime: doc.availableTime,
        isActive: true,
      });

      console.log(`  ✔ ${doc.name} (${doc.specialization})`);
    }

    // ── Seed Patients ─────────────────────────────────────────────────────
    console.log('\n🧑‍🤝‍🧑  Seeding patients...');
    const allDoctors = await Doctor.find({});

    for (let i = 0; i < patientsData.length; i++) {
      const pat = patientsData[i];

      // Create User account for patient
      const userPat = await User.create({
        name: pat.name,
        email: pat.email,
        password: hashedPassword,
        role: 'patient',
        isActive: true,
      });

      // Assign a doctor in round-robin fashion
      const assignedDoctor = allDoctors[i % allDoctors.length]._id;

      // Create Patient record linked to User
      await Patient.create({
        user: userPat._id,
        name: pat.name,
        age: pat.age,
        gender: pat.gender,
        phone: pat.phone,
        email: pat.email,
        address: pat.address,
        bloodGroup: pat.bloodGroup,
        medicalHistory: pat.medicalHistory,
        assignedDoctor: assignedDoctor,
        isActive: true,
      });

      console.log(`  ✔ ${pat.name} (${pat.bloodGroup}) → assigned to ${allDoctors[i % allDoctors.length].name}`);
    }

      // ── Seed Demo Login Accounts ───────────────────────────────────────
      console.log('\n🔐  Seeding demo login accounts...');
      await Promise.all([
        User.deleteMany({ email: { $in: [demoAccounts.admin.email, demoAccounts.doctor.email, demoAccounts.patient.email] } }),
        Doctor.deleteMany({ email: { $in: [demoAccounts.doctor.email] } }),
        Patient.deleteMany({ email: { $in: [demoAccounts.patient.email] } }),
      ]);

      const demoAdminPassword = await bcrypt.hash(demoAccounts.admin.password, 10);
      const demoDoctorPassword = await bcrypt.hash(demoAccounts.doctor.password, 10);
      const demoPatientPassword = await bcrypt.hash(demoAccounts.patient.password, 10);

      await User.create({
        name: demoAccounts.admin.name,
        email: demoAccounts.admin.email,
        password: demoAdminPassword,
        role: 'admin',
        isActive: true,
      });

      const demoDoctorUser = await User.create({
        name: demoAccounts.doctor.name,
        email: demoAccounts.doctor.email,
        password: demoDoctorPassword,
        role: 'doctor',
        isActive: true,
      });

      await Doctor.create({
        user: demoDoctorUser._id,
        name: demoAccounts.doctor.name,
        specialization: demoAccounts.doctor.specialization,
        qualification: demoAccounts.doctor.qualification,
        experience: demoAccounts.doctor.experience,
        phone: demoAccounts.doctor.phone,
        email: demoAccounts.doctor.email,
        fee: demoAccounts.doctor.fee,
        availableDays: demoAccounts.doctor.availableDays,
        availableTime: demoAccounts.doctor.availableTime,
        isActive: true,
      });

      const demoPatientUser = await User.create({
        name: demoAccounts.patient.name,
        email: demoAccounts.patient.email,
        password: demoPatientPassword,
        role: 'patient',
        isActive: true,
      });

      await Patient.create({
        user: demoPatientUser._id,
        name: demoAccounts.patient.name,
        age: demoAccounts.patient.age,
        gender: demoAccounts.patient.gender,
        phone: demoAccounts.patient.phone,
        email: demoAccounts.patient.email,
        address: demoAccounts.patient.address,
        bloodGroup: demoAccounts.patient.bloodGroup,
        medicalHistory: [],
        assignedDoctor: allDoctors[0]?._id || null,
        isActive: true,
      });

      console.log('  ✔ Admin:   admin@healthcare.com / admin123');
      console.log('  ✔ Doctor:  doctor@healthcare.com / doctor123');
      console.log('  ✔ Patient: patient@healthcare.com / patient123');

    console.log('\n🎉 Seeding complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Doctors inserted  : ${doctorsData.length}`);
    console.log(`   Patients inserted : ${patientsData.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Default password for all accounts: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();