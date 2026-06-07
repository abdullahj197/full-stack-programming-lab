'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { FiUsers, FiActivity, FiCalendar, FiFileText, FiBell, FiUserCheck, FiTrendingUp } from 'react-icons/fi';

const statCards = [
  { key: 'doctors', label: 'Total Doctors', icon: FiActivity, color: '#2563EB', bg: '#EFF6FF', desc: 'Active doctors' },
  { key: 'patients', label: 'Total Patients', icon: FiUsers, color: '#059669', bg: '#ECFDF5', desc: 'Registered patients' },
  { key: 'appointments', label: 'Appointments', icon: FiCalendar, color: '#D97706', bg: '#FFFBEB', desc: 'All time' },
  { key: 'prescriptions', label: 'Prescriptions', icon: FiFileText, color: '#7C3AED', bg: '#F5F3FF', desc: 'Total issued' },
  { key: 'pending', label: 'Pending', icon: FiBell, color: '#EA580C', bg: '#FFF7ED', desc: 'Awaiting approval' },
  { key: 'confirmed', label: 'Confirmed', icon: FiUserCheck, color: '#0369A1', bg: '#F0F9FF', desc: 'Confirmed today' },
];

const badgeStyle: any = {
  pending: { background: '#FEF9C3', color: '#854D0E' },
  confirmed: { background: '#DCFCE7', color: '#166534' },
  rejected: { background: '#FEE2E2', color: '#991B1B' },
  completed: { background: '#DBEAFE', color: '#1E40AF' },
  'follow-up': { background: '#F3E8FF', color: '#6B21A8' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, prescriptions: 0, pending: 0, confirmed: 0 });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [d, p, a, pr] = await Promise.all([
        api.get('/doctors'), api.get('/patients'),
        api.get('/appointments'), api.get('/prescriptions'),
      ]);
      const apts = a.data.appointments;
      setStats({
        doctors: d.data.count, patients: p.data.count,
        appointments: a.data.count, prescriptions: pr.data.count,
        pending: apts.filter((x: any) => x.status === 'pending').length,
        confirmed: apts.filter((x: any) => x.status === 'confirmed').length,
      });
      setRecentAppointments(apts.slice(0, 6));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: '256px', minWidth: 0 }}>
          <Navbar title="Dashboard" />
          <div style={{ padding: '28px' }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #E2E8F0', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : (
              <>
                {/* Welcome Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #1E40AF, #2563EB, #3B82F6)',
                  borderRadius: '20px', padding: '28px 32px',
                  marginBottom: '28px', color: 'white',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 32px rgba(37,99,235,0.3)',
                }}>
                  <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>
                      Welcome back, Admin! 👋
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                      Here&apos;s what&apos;s happening in your hospital today
                    </p>
                  </div>
                  <div style={{
                    width: '60px', height: '60px',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FiTrendingUp style={{ fontSize: '28px', color: 'white' }} />
                  </div>
                </div>

                {/* Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '16px', marginBottom: '28px',
                }}>
                  {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <div key={card.key} style={{
                        background: 'white', borderRadius: '18px',
                        padding: '22px 20px',
                        border: '1px solid #F1F5F9',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                      }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                        }}
                      >
                        <div style={{
                          width: '44px', height: '44px',
                          background: card.bg, borderRadius: '14px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginBottom: '14px',
                        }}>
                          <Icon style={{ fontSize: '22px', color: card.color }} />
                        </div>
                        <p style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', lineHeight: 1 }}>
                          {(stats as any)[card.key]}
                        </p>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginTop: '6px' }}>
                          {card.label}
                        </p>
                        <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                          {card.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Appointments Table */}
                <div style={{
                  background: 'white', borderRadius: '20px',
                  border: '1px solid #F1F5F9',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    padding: '20px 24px', borderBottom: '1px solid #F1F5F9',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div>
                      <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
                        Recent Appointments
                      </h2>
                      <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                        Latest appointment requests
                      </p>
                    </div>
                    <div style={{
                      background: '#EFF6FF', color: '#2563EB',
                      padding: '6px 14px', borderRadius: '20px',
                      fontSize: '12px', fontWeight: '700',
                    }}>
                      {recentAppointments.length} records
                    </div>
                  </div>

                  {recentAppointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#94A3B8' }}>
                      <FiCalendar style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }} />
                      <p style={{ fontSize: '15px', fontWeight: '600' }}>No appointments yet</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#F8FAFC' }}>
                            {['Patient', 'Doctor', 'Date', 'Time Slot', 'Reason', 'Status'].map((h) => (
                              <th key={h} style={{
                                textAlign: 'left', padding: '12px 20px',
                                fontSize: '11px', fontWeight: '700',
                                color: '#94A3B8', textTransform: 'uppercase',
                                letterSpacing: '0.7px',
                                borderBottom: '1px solid #F1F5F9',
                              }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {recentAppointments.map((apt, idx) => {
                            const bs = badgeStyle[apt.status] || badgeStyle.pending;
                            return (
                              <tr key={apt._id} style={{
                                borderBottom: idx < recentAppointments.length - 1 ? '1px solid #F8FAFC' : 'none',
                                transition: 'background 0.15s',
                              }}
                                onMouseEnter={(e) => (e.currentTarget as HTMLTableRowElement).style.background = '#FAFAFA'}
                                onMouseLeave={(e) => (e.currentTarget as HTMLTableRowElement).style.background = 'white'}
                              >
                                <td style={{ padding: '14px 20px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                      width: '32px', height: '32px',
                                      background: '#EFF6FF', borderRadius: '10px',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      flexShrink: 0,
                                    }}>
                                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#2563EB' }}>
                                        {apt.patient?.name?.charAt(0) || 'P'}
                                      </span>
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0F172A' }}>
                                      {apt.patient?.name || 'N/A'}
                                    </span>
                                  </div>
                                </td>
                                <td style={{ padding: '14px 20px', fontSize: '13px', color: '#475569' }}>
                                  {apt.doctor?.name || 'Not Assigned'}
                                </td>
                                <td style={{ padding: '14px 20px', fontSize: '13px', color: '#475569' }}>
                                  {new Date(apt.appointmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                                <td style={{ padding: '14px 20px', fontSize: '13px', color: '#475569' }}>
                                  {apt.timeSlot}
                                </td>
                                <td style={{ padding: '14px 20px', fontSize: '13px', color: '#475569', maxWidth: '140px' }}>
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                                    {apt.reason}
                                  </span>
                                </td>
                                <td style={{ padding: '14px 20px' }}>
                                  <span style={{
                                    ...bs, padding: '4px 12px',
                                    borderRadius: '20px', fontSize: '12px',
                                    fontWeight: '700', display: 'inline-block',
                                  }}>
                                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
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