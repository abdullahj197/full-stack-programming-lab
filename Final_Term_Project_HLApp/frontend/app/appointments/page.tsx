'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { FiPlus, FiX, FiCalendar, FiClock, FiUser, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
const emptyForm = { appointmentDate: '', timeSlot: '', reason: '', doctorId: '' };

const badgeStyle: any = {
  pending: { background: '#FEF9C3', color: '#854D0E' },
  confirmed: { background: '#DCFCE7', color: '#166534' },
  rejected: { background: '#FEE2E2', color: '#991B1B' },
  completed: { background: '#DBEAFE', color: '#1E40AF' },
  'follow-up': { background: '#F3E8FF', color: '#6B21A8' },
};

const filters = ['all', 'pending', 'confirmed', 'completed', 'rejected', 'follow-up'];

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchData(); }, [user]);

  const fetchData = async () => {
    try {
      const endpoint = user?.role === 'admin' ? '/appointments' : user?.role === 'doctor' ? '/appointments/doctorappointments' : '/appointments/myappointments';
      const [aptsRes, docRes] = await Promise.all([api.get(endpoint), api.get('/doctors')]);
      setAppointments(aptsRes.data.appointments);
      setDoctors(docRes.data.doctors);
    } catch { toast.error('Failed to fetch appointments'); }
    finally { setLoading(false); }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.appointmentDate || !form.timeSlot || !form.reason) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      await api.post('/appointments', form);
      toast.success('Appointment booked!');
      setShowModal(false); setForm(emptyForm); fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to book');
    } finally { setSaving(false); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}!`); fetchData();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Deleted!'); fetchData();
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: '256px', minWidth: 0 }}>
          <Navbar title="Appointments" />
          <div style={{ padding: '28px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>Appointments</h1>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>{filtered.length} appointments found</p>
              </div>
              {user?.role === 'patient' && (
                <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #1D4ED8, #2563EB)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 20px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                  <FiPlus /> Book Appointment
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {filters.map((tab) => (
                <button key={tab} onClick={() => setFilter(tab)} style={{
                  padding: '8px 18px', borderRadius: '20px', fontSize: '13px',
                  fontWeight: '700', cursor: 'pointer', transition: 'all 0.15s',
                  textTransform: 'capitalize',
                  background: filter === tab ? '#2563EB' : 'white',
                  color: filter === tab ? 'white' : '#64748B',
                  border: filter === tab ? '2px solid #2563EB' : '1.5px solid #E2E8F0',
                  boxShadow: filter === tab ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
                }}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #E2E8F0', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
                <FiCalendar style={{ fontSize: '48px', color: '#CBD5E1', marginBottom: '12px' }} />
                <p style={{ fontSize: '16px', color: '#94A3B8', fontWeight: '600' }}>No appointments found</p>
                {user?.role === 'patient' && (
                  <button onClick={() => setShowModal(true)} style={{ marginTop: '16px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: '700', cursor: 'pointer' }}>
                    Book your first appointment
                  </button>
                )}
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC' }}>
                        {['Patient', 'Doctor', 'Date', 'Time', 'Reason', 'Status', 'Actions'].map((h) => (
                          <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.7px', borderBottom: '1px solid #F1F5F9' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((apt, idx) => {
                        const bs = badgeStyle[apt.status] || badgeStyle.pending;
                        return (
                          <tr key={apt._id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #F8FAFC' : 'none' }}
                            onMouseEnter={(e) => (e.currentTarget as HTMLTableRowElement).style.background = '#FAFAFA'}
                            onMouseLeave={(e) => (e.currentTarget as HTMLTableRowElement).style.background = 'white'}>
                            <td style={{ padding: '14px 20px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '34px', height: '34px', background: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#2563EB' }}>{apt.patient?.name?.charAt(0) || 'P'}</span>
                                </div>
                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>{apt.patient?.name || 'N/A'}</span>
                              </div>
                            </td>
                            <td style={{ padding: '14px 20px', fontSize: '13px', color: '#475569' }}>{apt.doctor?.name || 'Not Assigned'}</td>
                            <td style={{ padding: '14px 20px', fontSize: '13px', color: '#475569' }}>{new Date(apt.appointmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{ background: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>{apt.timeSlot}</span>
                            </td>
                            <td style={{ padding: '14px 20px', fontSize: '13px', color: '#475569', maxWidth: '140px' }}>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{apt.reason}</span>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{ ...bs, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block' }}>
                                {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                              </span>
                            </td>
                            <td style={{ padding: '14px 20px' }}>
                              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                {(user?.role === 'admin' || user?.role === 'doctor') && apt.status === 'pending' && (
                                  <>
                                    <button onClick={() => handleStatusChange(apt._id, 'confirmed')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: '#DCFCE7', color: '#166534', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s' }}
                                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#16A34A'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#DCFCE7'; (e.currentTarget as HTMLButtonElement).style.color = '#166534'; }}>
                                      <FiCheck style={{ fontSize: '12px' }} /> Confirm
                                    </button>
                                    <button onClick={() => handleStatusChange(apt._id, 'rejected')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s' }}
                                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EF4444'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FEE2E2'; (e.currentTarget as HTMLButtonElement).style.color = '#991B1B'; }}>
                                      <FiX style={{ fontSize: '12px' }} /> Reject
                                    </button>
                                  </>
                                )}
                                {user?.role === 'admin' && (
                                  <button onClick={() => handleDelete(apt._id)} style={{ display: 'flex', alignItems: 'center', padding: '6px 10px', background: '#F8FAFC', color: '#94A3B8', border: '1px solid #F1F5F9', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s' }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F8FAFC'; (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8'; }}>
                                    <FiTrash2 style={{ fontSize: '13px' }} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px', borderBottom: '1px solid #F1F5F9' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>Book Appointment</h2>
                <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '2px' }}>Fill in the details to schedule</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #F1F5F9', background: '#F8FAFC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiX style={{ color: '#64748B' }} />
              </button>
            </div>
            <form onSubmit={handleBook} style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Doctor Select */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Select Doctor</label>
                <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                  style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', backgroundColor: '#FAFAFA' }}>
                  <option value="">Choose a doctor (optional)</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>{d.name} — {d.specialization}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Appointment Date *</label>
                <input type="date" min={new Date().toISOString().split('T')[0]} value={form.appointmentDate}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                  style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', backgroundColor: '#FAFAFA', boxSizing: 'border-box' }} />
              </div>

              {/* Time Slots */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Select Time Slot *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {timeSlots.map((slot) => (
                    <button key={slot} type="button" onClick={() => setForm({ ...form, timeSlot: slot })}
                      style={{
                        padding: '10px 8px', borderRadius: '10px', fontSize: '13px', fontWeight: '600',
                        cursor: 'pointer', transition: 'all 0.15s',
                        background: form.timeSlot === slot ? '#EFF6FF' : 'white',
                        color: form.timeSlot === slot ? '#2563EB' : '#64748B',
                        border: form.timeSlot === slot ? '2px solid #2563EB' : '1.5px solid #E2E8F0',
                      }}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reason for Visit *</label>
                <textarea rows={3} placeholder="Describe your symptoms..." value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', backgroundColor: '#FAFAFA', resize: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '13px', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: 'white', color: '#64748B', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: '13px', borderRadius: '12px', background: saving ? '#93C5FD' : 'linear-gradient(135deg, #1D4ED8, #2563EB)', color: 'white', border: 'none', fontWeight: '700', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                  {saving ? (<><div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Booking...</>) : '📅 Book Appointment'}
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