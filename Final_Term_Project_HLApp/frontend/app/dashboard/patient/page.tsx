'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { FiCalendar, FiFileText, FiBell, FiClock, FiPlus, FiHeart } from 'react-icons/fi';

const badgeStyle: any = {
  pending: { background: '#FEF9C3', color: '#854D0E' },
  confirmed: { background: '#DCFCE7', color: '#166534' },
  rejected: { background: '#FEE2E2', color: '#991B1B' },
  completed: { background: '#DBEAFE', color: '#1E40AF' },
};

export default function PatientDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, prescriptions: 0 });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [a, p, n] = await Promise.all([
        api.get('/appointments/myappointments'),
        api.get('/prescriptions/myhistory'),
        api.get('/notifications'),
      ]);
      const apts = a.data.appointments;
      setStats({
        total: apts.length,
        pending: apts.filter((x: any) => x.status === 'pending').length,
        confirmed: apts.filter((x: any) => x.status === 'confirmed').length,
        prescriptions: p.data.count,
      });
      setAppointments(apts.slice(0, 3));
      setNotifications(n.data.notifications.slice(0, 3));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const cards = [
    { label: 'Total Appointments', value: stats.total, icon: FiCalendar, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Pending', value: stats.pending, icon: FiClock, color: '#D97706', bg: '#FFFBEB' },
    { label: 'Confirmed', value: stats.confirmed, icon: FiCalendar, color: '#059669', bg: '#ECFDF5' },
    { label: 'Prescriptions', value: stats.prescriptions, icon: FiFileText, color: '#7C3AED', bg: '#F5F3FF' },
  ];

  return (
    <ProtectedRoute allowedRoles={['patient']}>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: '256px', minWidth: 0 }}>
          <Navbar title="My Dashboard" />
          <div style={{ padding: '28px' }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #E2E8F0', borderTopColor: '#059669', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : (
              <>
                {/* Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #065F46, #059669, #34D399)',
                  borderRadius: '20px', padding: '28px 32px',
                  marginBottom: '28px', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  boxShadow: '0 8px 32px rgba(5,150,105,0.3)',
                }}>
                  <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>
                      My Health Dashboard 🏥
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '16px' }}>
                      Track your appointments and health records
                    </p>
                    <Link href="/appointments" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: 'white', color: '#059669',
                      padding: '8px 18px', borderRadius: '10px',
                      fontWeight: '700', fontSize: '13px', textDecoration: 'none',
                    }}>
                      <FiPlus /> Book Appointment
                    </Link>
                  </div>
                  <div style={{
                    width: '60px', height: '60px',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FiHeart style={{ fontSize: '28px' }} />
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
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginTop: '6px' }}>{c.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* Appointments */}
                  <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <div style={{ padding: '18px 22px', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>My Appointments</h2>
                      <Link href="/appointments" style={{ fontSize: '12px', color: '#2563EB', fontWeight: '600', textDecoration: 'none' }}>View all →</Link>
                    </div>
                    <div style={{ padding: '12px' }}>
                      {appointments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                          <FiCalendar style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.4 }} />
                          <p>No appointments yet</p>
                        </div>
                      ) : appointments.map((apt) => {
                        const bs = badgeStyle[apt.status] || badgeStyle.pending;
                        return (
                          <div key={apt._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '12px', marginBottom: '6px', background: '#F8FAFC' }}>
                            <div>
                              <p style={{ fontWeight: '700', color: '#0F172A', fontSize: '13px' }}>{apt.doctor?.name || 'Not Assigned'}</p>
                              <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{new Date(apt.appointmentDate).toLocaleDateString()} • {apt.timeSlot}</p>
                            </div>
                            <span style={{ ...bs, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
                              {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notifications */}
                  <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <div style={{ padding: '18px 22px', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>Notifications</h2>
                      <Link href="/notifications" style={{ fontSize: '12px', color: '#2563EB', fontWeight: '600', textDecoration: 'none' }}>View all →</Link>
                    </div>
                    <div style={{ padding: '12px' }}>
                      {notifications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                          <FiBell style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.4 }} />
                          <p>No notifications</p>
                        </div>
                      ) : notifications.map((n) => (
                        <div key={n._id} style={{ padding: '12px', borderRadius: '12px', marginBottom: '6px', background: n.isRead ? '#F8FAFC' : '#EFF6FF', border: n.isRead ? '1px solid #F1F5F9' : '1px solid #BFDBFE' }}>
                          <p style={{ fontWeight: '700', color: '#0F172A', fontSize: '13px' }}>{n.title}</p>
                          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '3px' }}>{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
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