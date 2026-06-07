'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { FiCalendar, FiUsers, FiFileText, FiClock, FiActivity } from 'react-icons/fi';

const badgeStyle: any = {
  pending: { background: '#FEF9C3', color: '#854D0E' },
  confirmed: { background: '#DCFCE7', color: '#166534' },
  rejected: { background: '#FEE2E2', color: '#991B1B' },
  completed: { background: '#DBEAFE', color: '#1E40AF' },
  'follow-up': { background: '#F3E8FF', color: '#6B21A8' },
};

export default function DoctorDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/appointments/doctorappointments');
      const apts = data.appointments;
      setStats({
        total: apts.length,
        pending: apts.filter((a: any) => a.status === 'pending').length,
        confirmed: apts.filter((a: any) => a.status === 'confirmed').length,
        completed: apts.filter((a: any) => a.status === 'completed').length,
      });
      setAppointments(apts.slice(0, 5));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const cards = [
    { label: 'Total', value: stats.total, icon: FiCalendar, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Pending', value: stats.pending, icon: FiClock, color: '#D97706', bg: '#FFFBEB' },
    { label: 'Confirmed', value: stats.confirmed, icon: FiUsers, color: '#059669', bg: '#ECFDF5' },
    { label: 'Completed', value: stats.completed, icon: FiFileText, color: '#7C3AED', bg: '#F5F3FF' },
  ];

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: '256px', minWidth: 0 }}>
          <Navbar title="Doctor Dashboard" />
          <div style={{ padding: '28px' }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #E2E8F0', borderTopColor: '#0369A1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : (
              <>
                {/* Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #0369A1, #0EA5E9)',
                  borderRadius: '20px', padding: '28px 32px',
                  marginBottom: '28px', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  boxShadow: '0 8px 32px rgba(3,105,161,0.3)',
                }}>
                  <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>
                      Doctor Dashboard 👨‍⚕️
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                      Manage your appointments and patients efficiently
                    </p>
                  </div>
                  <div style={{
                    width: '60px', height: '60px',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FiActivity style={{ fontSize: '28px' }} />
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
                  {cards.map((c) => {
                    const Icon = c.icon;
                    return (
                      <div key={c.label} style={{
                        background: 'white', borderRadius: '18px',
                        padding: '22px', border: '1px solid #F1F5F9',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                      }}>
                        <div style={{ width: '44px', height: '44px', background: c.bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                          <Icon style={{ fontSize: '22px', color: c.color }} />
                        </div>
                        <p style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', lineHeight: 1 }}>{c.value}</p>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginTop: '6px' }}>{c.label} Appointments</p>
                      </div>
                    );
                  })}
                </div>

                {/* Recent */}
                <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>Recent Appointments</h2>
                  </div>
                  {appointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#94A3B8' }}>No appointments yet</div>
                  ) : (
                    <div style={{ padding: '16px' }}>
                      {appointments.map((apt) => {
                        const bs = badgeStyle[apt.status] || badgeStyle.pending;
                        return (
                          <div key={apt._id} style={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 16px', borderRadius: '14px',
                            marginBottom: '8px', background: '#F8FAFC',
                            border: '1px solid #F1F5F9',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '40px', height: '40px', background: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: '#2563EB', fontWeight: '700' }}>{apt.patient?.name?.charAt(0)}</span>
                              </div>
                              <div>
                                <p style={{ fontWeight: '700', color: '#0F172A', fontSize: '14px' }}>{apt.patient?.name}</p>
                                <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                                  {new Date(apt.appointmentDate).toLocaleDateString()} • {apt.timeSlot}
                                </p>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ ...bs, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                                {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                              </span>
                              <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>{apt.reason}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </ProtectedRoute>
  );
}