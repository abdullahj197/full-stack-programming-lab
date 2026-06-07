'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { FiBell, FiCheck, FiTrash2, FiCheckCircle, FiCalendar, FiAlertCircle, FiInfo, FiClock } from 'react-icons/fi';

const typeConfig: any = {
  appointment_confirmed: { bg: '#ECFDF5', border: '#A7F3D0', icon: FiCalendar, iconBg: '#10B981', label: 'Confirmed' },
  appointment_rejected: { bg: '#FEF2F2', border: '#FECACA', icon: FiAlertCircle, iconBg: '#EF4444', label: 'Rejected' },
  medication_reminder: { bg: '#EFF6FF', border: '#BFDBFE', icon: FiBell, iconBg: '#2563EB', label: 'Medication' },
  followup_reminder: { bg: '#F5F3FF', border: '#DDD6FE', icon: FiClock, iconBg: '#7C3AED', label: 'Follow-up' },
  general: { bg: '#F8FAFC', border: '#E2E8F0', icon: FiInfo, iconBg: '#64748B', label: 'General' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications);
    } catch { toast.error('Failed to fetch'); }
    finally { setLoading(false); }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    } catch { toast.error('Failed'); }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/markallread');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All marked as read!');
    } catch { toast.error('Failed'); }
  };

  const deleteOne = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success('Deleted!');
    } catch { toast.error('Failed'); }
  };

  const deleteAll = async () => {
    if (!confirm('Delete all notifications?')) return;
    try {
      await api.delete('/notifications/deleteall');
      setNotifications([]);
      toast.success('All cleared!');
    } catch { toast.error('Failed'); }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filtered = filter === 'unread' ? notifications.filter((n) => !n.isRead) : filter === 'read' ? notifications.filter((n) => n.isRead) : notifications;

  return (
    <ProtectedRoute allowedRoles={['admin', 'doctor', 'patient']}>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <Sidebar />
        <div style={{ flex: 1, marginLeft: '256px', minWidth: 0 }}>
          <Navbar title="Notifications" />
          <div style={{ padding: '28px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A' }}>Notifications</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  {unreadCount > 0 ? (
                    <span style={{ background: '#EFF6FF', color: '#2563EB', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                      {unreadCount} unread
                    </span>
                  ) : (
                    <span style={{ background: '#ECFDF5', color: '#059669', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                      ✓ All caught up
                    </span>
                  )}
                </div>
              </div>
              {notifications.length > 0 && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: '10px', padding: '9px 16px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#2563EB'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EFF6FF'; (e.currentTarget as HTMLButtonElement).style.color = '#2563EB'; }}>
                      <FiCheckCircle style={{ fontSize: '14px' }} /> Mark all read
                    </button>
                  )}
                  <button onClick={deleteAll} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '10px', padding: '9px 16px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EF4444'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}>
                    <FiTrash2 style={{ fontSize: '14px' }} /> Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {(['all', 'unread', 'read'] as const).map((tab) => (
                <button key={tab} onClick={() => setFilter(tab)} style={{
                  padding: '8px 18px', borderRadius: '20px', fontSize: '13px',
                  fontWeight: '700', cursor: 'pointer', textTransform: 'capitalize',
                  background: filter === tab ? '#2563EB' : 'white',
                  color: filter === tab ? 'white' : '#64748B',
                  border: filter === tab ? '2px solid #2563EB' : '1.5px solid #E2E8F0',
                  boxShadow: filter === tab ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
                  transition: 'all 0.15s',
                }}>
                  {tab} {tab === 'unread' && unreadCount > 0 && `(${unreadCount})`}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #E2E8F0', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
                <FiBell style={{ fontSize: '48px', color: '#CBD5E1', marginBottom: '12px' }} />
                <p style={{ fontSize: '16px', color: '#94A3B8', fontWeight: '600' }}>No notifications</p>
                <p style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '4px' }}>You&apos;re all caught up!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filtered.map((notif) => {
                  const config = typeConfig[notif.type] || typeConfig.general;
                  const Icon = config.icon;
                  return (
                    <div key={notif._id} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '14px',
                      padding: '18px 20px', borderRadius: '16px',
                      background: notif.isRead ? 'white' : config.bg,
                      border: `1px solid ${notif.isRead ? '#F1F5F9' : config.border}`,
                      boxShadow: notif.isRead ? '0 1px 4px rgba(0,0,0,0.04)' : '0 4px 12px rgba(0,0,0,0.06)',
                      transition: 'all 0.15s',
                      position: 'relative',
                    }}>
                      {/* Icon */}
                      <div style={{ width: '44px', height: '44px', background: config.iconBg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 12px ${config.iconBg}40` }}>
                        <Icon style={{ fontSize: '20px', color: 'white' }} />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <p style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{notif.title}</p>
                              <span style={{ background: config.bg, color: config.iconBg, padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', border: `1px solid ${config.border}`, flexShrink: 0 }}>
                                {config.label}
                              </span>
                              {!notif.isRead && (
                                <div style={{ width: '8px', height: '8px', background: '#2563EB', borderRadius: '50%', flexShrink: 0 }} />
                              )}
                            </div>
                            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>{notif.message}</p>
                            <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px', fontWeight: '500' }}>
                              🕐 {new Date(notif.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>

                          {/* Actions */}
                          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                            {!notif.isRead && (
                              <button onClick={() => markAsRead(notif._id)} title="Mark as read"
                                style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #BBF7D0', background: '#ECFDF5', color: '#10B981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#10B981'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#ECFDF5'; (e.currentTarget as HTMLButtonElement).style.color = '#10B981'; }}>
                                <FiCheck style={{ fontSize: '15px' }} />
                              </button>
                            )}
                            <button onClick={() => deleteOne(notif._id)} title="Delete"
                              style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#EF4444'; (e.currentTarget as HTMLButtonElement).style.color = 'white'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}>
                              <FiTrash2 style={{ fontSize: '14px' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </ProtectedRoute>
  );
}