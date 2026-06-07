'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiX, FiPhone, FiMail, FiMapPin, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const emptyForm = {
  name: '', age: '', gender: 'Male', phone: '',
  email: '', address: '', bloodGroup: 'O+', medicalHistory: '',
};

const bloodGroupColors: any = {
  'A+': '#EF4444', 'A-': '#F97316', 'B+': '#8B5CF6',
  'B-': '#EC4899', 'O+': '#10B981', 'O-': '#0EA5E9',
  'AB+': '#F59E0B', 'AB-': '#6366F1',
};

export default function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editPatient, setEditPatient] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPatients(); }, []);
  useEffect(() => {
    setFiltered(patients.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, patients]);

  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/patients');
      setPatients(data.patients); setFiltered(data.patients);
    } catch { toast.error('Failed to fetch patients'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.phone || !form.email || !form.address) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        medicalHistory: form.medicalHistory ? form.medicalHistory.split(',').map((s) => s.trim()) : [],
      };
      if (editPatient) {
        await api.put(`/patients/${editPatient._id}`, payload);
        toast.success('Patient updated!');
      } else {
        await api.post('/patients', payload);
        toast.success('Patient added!');
      }
      setShowModal(false); setForm(emptyForm); setEditPatient(null);
      fetchPatients();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving patient');
    } finally { setSaving(false); }
  };

  const handleEdit = (p: any) => {
    setEditPatient(p);
    setForm({
      name: p.name, age: p.age, gender: p.gender,
      phone: p.phone, email: p.email, address: p.address,
      bloodGroup: p.bloodGroup, medicalHistory: p.medicalHistory?.join(', ') || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this patient?')) return;
    try {
      await api.delete(`/patients/${id}`);
      toast.success('Patient deleted!'); fetchPatients();
    } catch { toast.error('Failed to delete'); }
  };

  const inputStyle = {
    width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '10px',
    padding: '10px 14px', fontSize: '14px', color: '#1E293B',
    outline: 'none', boxSizing: 'border-box' as const, backgroundColor: '#FAFAFA',
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'doctor']}>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: '256px', minWidth: 0 }}>
          <Navbar title="Patients" />
          <div style={{ padding: '28px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>Patients</h1>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>{filtered.length} patients registered</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input type="text" placeholder="Search patients..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '10px 16px 10px 38px', fontSize: '14px', outline: 'none', width: '240px', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} />
                </div>
                {user?.role === 'admin' && (
                  <button onClick={() => { setShowModal(true); setEditPatient(null); setForm(emptyForm); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #065F46, #059669)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 20px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(5,150,105,0.3)', whiteSpace: 'nowrap' }}>
                    <FiPlus /> Add Patient
                  </button>
                )}
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #E2E8F0', borderTopColor: '#059669', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '20px' }}>
                <FiUser style={{ fontSize: '48px', color: '#CBD5E1', marginBottom: '12px' }} />
                <p style={{ fontSize: '16px', color: '#94A3B8', fontWeight: '600' }}>No patients found</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {filtered.map((patient) => {
                  const bgColor = bloodGroupColors[patient.bloodGroup] || '#64748B';
                  return (
                    <div key={patient._id} style={{
                      background: 'white', borderRadius: '20px',
                      border: '1px solid #F1F5F9', overflow: 'hidden',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
                    >
                      {/* Card Top */}
                      <div style={{ background: `linear-gradient(135deg, ${bgColor}dd, ${bgColor})`, padding: '24px 20px 40px', position: 'relative' }}>
                        <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.25)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.4)' }}>
                          <span style={{ color: 'white', fontWeight: '800', fontSize: '22px' }}>{patient.name.charAt(0)}</span>
                        </div>
                        <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.25)', borderRadius: '20px', padding: '4px 12px', fontSize: '13px', color: 'white', fontWeight: '800' }}>
                          {patient.bloodGroup}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div style={{ padding: '0 20px 20px', marginTop: '-20px' }}>
                        <div style={{ background: 'white', borderRadius: '14px', padding: '14px', marginBottom: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
                          <h3 style={{ fontWeight: '800', color: '#0F172A', fontSize: '16px', marginBottom: '4px' }}>{patient.name}</h3>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ fontSize: '12px', background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>
                              {patient.age} yrs
                            </span>
                            <span style={{ fontSize: '12px', background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>
                              {patient.gender}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                          {[
                            { icon: FiPhone, text: patient.phone, color: '#10B981' },
                            { icon: FiMail, text: patient.email, color: '#8B5CF6' },
                            { icon: FiMapPin, text: patient.address, color: '#F59E0B' },
                          ].map(({ icon: Icon, text, color }) => (
                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon style={{ fontSize: '13px', color }} />
                              </div>
                              <span style={{ fontSize: '13px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
                            </div>
                          ))}
                        </div>

                        {patient.assignedDoctor && (
                          <div style={{ background: '#EFF6FF', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px', border: '1px solid #DBEAFE' }}>
                            <p style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>Assigned Doctor</p>
                            <p style={{ fontSize: '13px', fontWeight: '700', color: '#2563EB' }}>{patient.assignedDoctor.name}</p>
                          </div>
                        )}

                        {patient.medicalHistory?.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                            {patient.medicalHistory.map((h: string) => (
                              <span key={h} style={{ background: '#FEF9C3', color: '#854D0E', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>{h}</span>
                            ))}
                          </div>
                        )}

                        {user?.role === 'admin' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleEdit(patient)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#059669'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#ECFDF5'; (e.currentTarget as HTMLButtonElement).style.color = '#059669'; }}>
                              <FiEdit2 style={{ fontSize: '13px' }} /> Edit
                            </button>
                            <button onClick={() => handleDelete(patient._id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '10px', background: '#FEF2F2', color: '#EF4444', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EF4444'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}>
                              <FiTrash2 style={{ fontSize: '13px' }} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: '1px solid #F1F5F9' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>{editPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>Fill in the patient details</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #F1F5F9', background: '#F8FAFC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiX style={{ color: '#64748B' }} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Full Name *', key: 'name', placeholder: 'John Doe', type: 'text' },
                  { label: 'Age *', key: 'age', placeholder: '25', type: 'number' },
                  { label: 'Phone *', key: 'phone', placeholder: '0300-0000000', type: 'text' },
                  { label: 'Email *', key: 'email', placeholder: 'patient@email.com', type: 'email' },
                ].map((field) => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{field.label}</label>
                    <input type={field.type} placeholder={field.placeholder}
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      style={inputStyle}
                      onFocus={(e) => e.target.style.borderColor = '#059669'}
                      onBlur={(e) => e.target.style.borderColor = '#E2E8F0'} />
                  </div>
                ))}

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Gender *</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} style={inputStyle}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Blood Group *</label>
                  <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} style={inputStyle}>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Address *</label>
                  <input placeholder="City, Country" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#059669'} onBlur={(e) => e.target.style.borderColor = '#E2E8F0'} />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Medical History (comma separated)</label>
                  <input placeholder="Diabetes, Hypertension" value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#059669'} onBlur={(e) => e.target.style.borderColor = '#E2E8F0'} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: '13px', borderRadius: '12px', background: saving ? '#6EE7B7' : 'linear-gradient(135deg, #065F46, #059669)', color: 'white', border: 'none', fontWeight: '700', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>
                  {saving ? (<><div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Saving...</>) : editPatient ? '✓ Update Patient' : '+ Add Patient'}
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