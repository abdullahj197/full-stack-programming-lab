'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiX, FiPhone, FiMail, FiStar, FiClock, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const emptyForm = {
  name: '', specialization: '', qualification: '',
  experience: '', phone: '', email: '', fee: '',
  availableDays: [] as string[], availableTime: '',
};

export default function DoctorsPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchDoctors(); }, []);
  useEffect(() => {
    setFiltered(doctors.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, doctors]);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors');
      setDoctors(data.doctors);
      setFiltered(data.doctors);
    } catch { toast.error('Failed to fetch doctors'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.specialization || !form.phone || !form.email) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      if (editDoctor) {
        await api.put(`/doctors/${editDoctor._id}`, form);
        toast.success('Doctor updated!');
      } else {
        await api.post('/doctors', form);
        toast.success('Doctor added!');
      }
      setShowModal(false); setForm(emptyForm); setEditDoctor(null);
      fetchDoctors();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving doctor');
    } finally { setSaving(false); }
  };

  const handleEdit = (doctor: any) => {
    setEditDoctor(doctor);
    setForm({
      name: doctor.name, specialization: doctor.specialization,
      qualification: doctor.qualification, experience: doctor.experience,
      phone: doctor.phone, email: doctor.email, fee: doctor.fee,
      availableDays: doctor.availableDays || [], availableTime: doctor.availableTime || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this doctor?')) return;
    try {
      await api.delete(`/doctors/${id}`);
      toast.success('Doctor deleted!');
      fetchDoctors();
    } catch { toast.error('Failed to delete'); }
  };

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const inputStyle = {
    width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '10px',
    padding: '10px 14px', fontSize: '14px', color: '#1E293B',
    outline: 'none', boxSizing: 'border-box' as const,
    backgroundColor: '#FAFAFA',
  };

  const specializations = [
    'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology',
    'Pediatrics', 'Gynecology', 'ENT', 'Ophthalmology',
    'Psychiatry', 'Oncology', 'Urology', 'General Medicine',
  ];

  return (
    <ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: '256px', minWidth: 0 }}>
          <Navbar title="Doctors" />
          <div style={{ padding: '28px' }}>

            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: '24px',
              flexWrap: 'wrap', gap: '12px',
            }}>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>
                  Our Doctors
                </h1>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
                  {filtered.length} doctors available
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* Search */}
                <div style={{ position: 'relative' }}>
                  <FiSearch style={{
                    position: 'absolute', left: '12px',
                    top: '50%', transform: 'translateY(-50%)',
                    color: '#94A3B8', fontSize: '15px',
                  }} />
                  <input
                    type="text"
                    placeholder="Search by name or specialty..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      border: '1.5px solid #E2E8F0', borderRadius: '12px',
                      padding: '10px 16px 10px 38px', fontSize: '14px',
                      outline: 'none', width: '260px', backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  />
                </div>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => { setShowModal(true); setEditDoctor(null); setForm(emptyForm); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
                      color: 'white', border: 'none', borderRadius: '12px',
                      padding: '10px 20px', fontWeight: '700', fontSize: '14px',
                      cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <FiPlus /> Add Doctor
                  </button>
                )}
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #E2E8F0', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '20px' }}>
                <p style={{ fontSize: '16px', color: '#94A3B8', fontWeight: '600' }}>No doctors found</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
              }}>
                {filtered.map((doctor) => (
                  <div key={doctor._id} style={{
                    background: 'white', borderRadius: '20px',
                    border: '1px solid #F1F5F9',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                    }}
                  >
                    {/* Card Header */}
                    <div style={{
                      background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)',
                      padding: '24px 20px 40px',
                      position: 'relative',
                    }}>
                      <div style={{
                        width: '64px', height: '64px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid rgba(255,255,255,0.3)',
                      }}>
                        <span style={{ color: 'white', fontWeight: '800', fontSize: '24px' }}>
                          {doctor.name.charAt(0)}
                        </span>
                      </div>
                      <div style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '20px', padding: '4px 12px',
                        fontSize: '12px', color: 'white', fontWeight: '600',
                      }}>
                        Rs. {doctor.fee}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '16px 20px 20px', marginTop: '-20px' }}>
                      <div style={{
                        background: 'white', borderRadius: '14px',
                        padding: '14px', marginBottom: '14px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                        border: '1px solid #F1F5F9',
                      }}>
                        <h3 style={{ fontWeight: '800', color: '#0F172A', fontSize: '16px', marginBottom: '4px' }}>
                          {doctor.name}
                        </h3>
                        <p style={{ color: '#2563EB', fontWeight: '600', fontSize: '13px' }}>
                          {doctor.specialization}
                        </p>
                        <p style={{ color: '#94A3B8', fontSize: '12px' }}>
                          {doctor.qualification}
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                        {[
                          { icon: FiStar, text: `${doctor.experience} years experience`, color: '#F59E0B' },
                          { icon: FiPhone, text: doctor.phone, color: '#10B981' },
                          { icon: FiMail, text: doctor.email, color: '#8B5CF6' },
                          { icon: FiClock, text: doctor.availableTime || '9:00 AM - 5:00 PM', color: '#0EA5E9' },
                        ].map(({ icon: Icon, text, color }) => (
                          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '28px', height: '28px', borderRadius: '8px',
                              background: `${color}15`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              <Icon style={{ fontSize: '13px', color }} />
                            </div>
                            <span style={{
                              fontSize: '13px', color: '#475569',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {text}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Available Days */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                        {doctor.availableDays?.map((day: string) => (
                          <span key={day} style={{
                            background: '#EFF6FF', color: '#2563EB',
                            padding: '3px 10px', borderRadius: '20px',
                            fontSize: '11px', fontWeight: '700',
                          }}>
                            {day.slice(0, 3)}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      {user?.role === 'admin' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEdit(doctor)} style={{
                            flex: 1, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '6px',
                            padding: '10px', borderRadius: '10px',
                            background: '#EFF6FF', color: '#2563EB',
                            border: 'none', fontWeight: '700', fontSize: '13px',
                            cursor: 'pointer', transition: 'all 0.15s',
                          }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#2563EB'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EFF6FF'; (e.currentTarget as HTMLButtonElement).style.color = '#2563EB'; }}
                          >
                            <FiEdit2 style={{ fontSize: '13px' }} /> Edit
                          </button>
                          <button onClick={() => handleDelete(doctor._id)} style={{
                            flex: 1, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '6px',
                            padding: '10px', borderRadius: '10px',
                            background: '#FEF2F2', color: '#EF4444',
                            border: 'none', fontWeight: '700', fontSize: '13px',
                            cursor: 'pointer', transition: 'all 0.15s',
                          }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EF4444'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}
                          >
                            <FiTrash2 style={{ fontSize: '13px' }} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 100, padding: '20px',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: 'white', borderRadius: '24px',
            width: '100%', maxWidth: '640px',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px 28px', borderBottom: '1px solid #F1F5F9',
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>
                  {editDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                </h2>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>
                  {editDoctor ? 'Update doctor information' : 'Fill in the doctor details below'}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} style={{
                width: '36px', height: '36px', borderRadius: '10px',
                border: '1px solid #F1F5F9', background: '#F8FAFC',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiX style={{ color: '#64748B' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Full Name *', key: 'name', placeholder: 'Dr. John Doe', type: 'text' },
                  { label: 'Experience (years)', key: 'experience', placeholder: '5', type: 'number' },
                  { label: 'Phone *', key: 'phone', placeholder: '0300-0000000', type: 'text' },
                  { label: 'Email *', key: 'email', placeholder: 'doctor@email.com', type: 'email' },
                  { label: 'Consultation Fee (Rs.)', key: 'fee', placeholder: '1000', type: 'number' },
                  { label: 'Available Time', key: 'availableTime', placeholder: '9:00 AM - 5:00 PM', type: 'text' },
                  { label: 'Qualification *', key: 'qualification', placeholder: 'MBBS, FCPS', type: 'text' },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                      onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
                    />
                  </div>
                ))}

                {/* Specialization Dropdown */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Specialization *
                  </label>
                  <select
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">Select specialization</option>
                    {specializations.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Available Days */}
              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Available Days
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {days.map((day) => (
                    <button key={day} type="button" onClick={() => toggleDay(day)} style={{
                      padding: '8px 16px', borderRadius: '10px', fontSize: '13px',
                      fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s',
                      border: form.availableDays.includes(day) ? '2px solid #2563EB' : '1.5px solid #E2E8F0',
                      background: form.availableDays.includes(day) ? '#EFF6FF' : 'white',
                      color: form.availableDays.includes(day) ? '#2563EB' : '#64748B',
                    }}>
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  flex: 1, padding: '13px', borderRadius: '12px',
                  border: '1.5px solid #E2E8F0', background: 'white',
                  color: '#64748B', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={{
                  flex: 1, padding: '13px', borderRadius: '12px',
                  background: saving ? '#93C5FD' : 'linear-gradient(135deg, #1D4ED8, #2563EB)',
                  color: 'white', border: 'none', fontWeight: '700', fontSize: '14px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                }}>
                  {saving ? (
                    <><div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Saving...</>
                  ) : editDoctor ? '✓ Update Doctor' : '+ Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </ProtectedRoute>
  );
}