'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { FiPlus, FiX, FiFileText, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const emptyMed = { name: '', dosage: '', frequency: '', duration: '', instructions: '' };

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    appointmentId: '', patientId: '', diagnosis: '',
    generalInstructions: '', followUpRequired: false, followUpDate: '',
    medications: [{ ...emptyMed }],
  });

  useEffect(() => { fetchData(); }, [user]);

  const fetchData = async () => {
    try {
      const endpoint = user?.role === 'admin' ? '/prescriptions' : user?.role === 'doctor' ? '/prescriptions/doctorprescriptions' : '/prescriptions/myhistory';
      const { data } = await api.get(endpoint);
      setPrescriptions(data.prescriptions);
      if (user?.role === 'doctor') {
        const [a, p] = await Promise.all([api.get('/appointments/doctorappointments'), api.get('/patients')]);
        setAppointments(a.data.appointments.filter((x: any) => x.status === 'confirmed'));
        setPatients(p.data.patients);
      }
    } catch { toast.error('Failed to fetch prescriptions'); }
    finally { setLoading(false); }
  };

  const addMed = () => setForm({ ...form, medications: [...form.medications, { ...emptyMed }] });
  const removeMed = (i: number) => setForm({ ...form, medications: form.medications.filter((_, idx) => idx !== i) });
  const updateMed = (i: number, field: string, value: string) => {
    const meds = [...form.medications];
    meds[i] = { ...meds[i], [field]: value };
    setForm({ ...form, medications: meds });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.appointmentId || !form.patientId || !form.diagnosis) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      await api.post('/prescriptions', form);
      toast.success('Prescription added!');
      setShowModal(false); fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this prescription?')) return;
    try {
      await api.delete(`/prescriptions/${id}`);
      toast.success('Deleted!'); fetchData();
    } catch { toast.error('Failed'); }
  };

  const inputStyle = { width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1E293B', outline: 'none', boxSizing: 'border-box' as const, backgroundColor: '#FAFAFA' };

  return (
    <ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: '256px', minWidth: 0 }}>
          <Navbar title="Prescriptions" />
          <div style={{ padding: '28px' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>Prescriptions</h1>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>{prescriptions.length} prescriptions total</p>
              </div>
              {user?.role === 'doctor' && (
                <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 20px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
                  <FiPlus /> Add Prescription
                </button>
              )}
            </div>

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #E2E8F0', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : prescriptions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
                <FiFileText style={{ fontSize: '48px', color: '#CBD5E1', marginBottom: '12px' }} />
                <p style={{ fontSize: '16px', color: '#94A3B8', fontWeight: '600' }}>No prescriptions found</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
                {prescriptions.map((pres) => (
                  <div key={pres._id} style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}>

                    {/* Header */}
                    <div style={{ background: 'linear-gradient(135deg, #6D28D9, #7C3AED)', padding: '20px 22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '4px' }}>Patient</p>
                          <h3 style={{ color: 'white', fontWeight: '800', fontSize: '16px' }}>{pres.patient?.name}</h3>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '4px' }}>Doctor</p>
                          <p style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>Dr. {pres.doctor?.name}</p>
                        </div>
                      </div>
                      <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '6px 12px', display: 'inline-block' }}>
                        <p style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>
                          {new Date(pres.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '20px 22px' }}>
                      {/* Diagnosis */}
                      <div style={{ background: '#F5F3FF', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px', border: '1px solid #EDE9FE' }}>
                        <p style={{ fontSize: '11px', fontWeight: '700', color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Diagnosis</p>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>{pres.diagnosis}</p>
                      </div>

                      {/* Medications */}
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '10px' }}>Medications</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                        {pres.medications?.map((med: any, i: number) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#F0FDF4', borderRadius: '10px', padding: '10px 12px', border: '1px solid #BBF7D0' }}>
                            <div style={{ width: '24px', height: '24px', background: '#10B981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ color: 'white', fontSize: '11px', fontWeight: '800' }}>{i + 1}</span>
                            </div>
                            <div>
                              <p style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{med.name}</p>
                              <p style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                                {med.dosage} • {med.frequency} • {med.duration}
                              </p>
                              {med.instructions && <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', fontStyle: 'italic' }}>{med.instructions}</p>}
                            </div>
                          </div>
                        ))}
                      </div>

                      {pres.generalInstructions && (
                        <div style={{ background: '#FFFBEB', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px', border: '1px solid #FDE68A' }}>
                          <p style={{ fontSize: '11px', fontWeight: '700', color: '#92400E', marginBottom: '4px' }}>⚠️ Instructions</p>
                          <p style={{ fontSize: '13px', color: '#78350F' }}>{pres.generalInstructions}</p>
                        </div>
                      )}

                      {pres.followUpRequired && pres.followUpDate && (
                        <div style={{ background: '#F5F3FF', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px', border: '1px solid #DDD6FE' }}>
                          <p style={{ fontSize: '11px', fontWeight: '700', color: '#6B21A8', marginBottom: '4px' }}>📅 Follow-up Date</p>
                          <p style={{ fontSize: '13px', color: '#7C3AED', fontWeight: '600' }}>{new Date(pres.followUpDate).toLocaleDateString()}</p>
                        </div>
                      )}

                      {(user?.role === 'admin' || user?.role === 'doctor') && (
                        <button onClick={() => handleDelete(pres._id)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '10px', background: '#FEF2F2', color: '#EF4444', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EF4444'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}>
                          <FiTrash2 style={{ fontSize: '14px' }} /> Delete Prescription
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: '1px solid #F1F5F9' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>Add Prescription</h2>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>Fill in the prescription details</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #F1F5F9', background: '#F8FAFC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiX style={{ color: '#64748B' }} />
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Appointment *</label>
                  <select value={form.appointmentId} onChange={(e) => setForm({ ...form, appointmentId: e.target.value })} style={inputStyle}>
                    <option value="">Select appointment</option>
                    {appointments.map((a) => (<option key={a._id} value={a._id}>{a.patient?.name} — {new Date(a.appointmentDate).toLocaleDateString()}</option>))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Patient *</label>
                  <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} style={inputStyle}>
                    <option value="">Select patient</option>
                    {patients.map((p) => (<option key={p._id} value={p._id}>{p.name}</option>))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Diagnosis *</label>
                <input placeholder="Enter diagnosis" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} style={inputStyle} />
              </div>

              {/* Medications */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#374151', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Medications</label>
                  <button type="button" onClick={addMed} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F5F3FF', color: '#7C3AED', border: 'none', borderRadius: '8px', padding: '6px 12px', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}>
                    <FiPlus style={{ fontSize: '13px' }} /> Add Medicine
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {form.medications.map((med, i) => (
                    <div key={i} style={{ background: '#F8FAFC', borderRadius: '14px', padding: '16px', border: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#7C3AED' }}>Medicine {i + 1}</span>
                        {form.medications.length > 1 && (
                          <button type="button" onClick={() => removeMed(i)} style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '8px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <FiX style={{ fontSize: '13px' }} />
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {[
                          { key: 'name', placeholder: 'Medicine name *' },
                          { key: 'dosage', placeholder: 'Dosage (e.g. 500mg)' },
                          { key: 'frequency', placeholder: 'Frequency (e.g. 2x daily)' },
                          { key: 'duration', placeholder: 'Duration (e.g. 7 days)' },
                        ].map((f) => (
                          <input key={f.key} placeholder={f.placeholder}
                            value={(med as any)[f.key]}
                            onChange={(e) => updateMed(i, f.key, e.target.value)}
                            style={{ ...inputStyle, fontSize: '13px' }} />
                        ))}
                        <input placeholder="Special instructions" value={med.instructions}
                          onChange={(e) => updateMed(i, 'instructions', e.target.value)}
                          style={{ ...inputStyle, fontSize: '13px', gridColumn: 'span 2' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>General Instructions</label>
                <textarea rows={2} placeholder="General instructions for the patient..." value={form.generalInstructions}
                  onChange={(e) => setForm({ ...form, generalInstructions: e.target.value })}
                  style={{ ...inputStyle, resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="followup" checked={form.followUpRequired}
                  onChange={(e) => setForm({ ...form, followUpRequired: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#7C3AED' }} />
                <label htmlFor="followup" style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', cursor: 'pointer' }}>Follow-up required</label>
              </div>

              {form.followUpRequired && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Follow-up Date</label>
                  <input type="date" value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} style={inputStyle} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: '13px', borderRadius: '12px', background: saving ? '#C4B5FD' : 'linear-gradient(135deg, #6D28D9, #7C3AED)', color: 'white', border: 'none', fontWeight: '700', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
                  {saving ? (<><div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Saving...</>) : '💊 Add Prescription'}
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