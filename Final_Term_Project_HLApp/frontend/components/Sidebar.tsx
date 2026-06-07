'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  FiHome, FiUsers, FiCalendar, FiFileText,
  FiBell, FiLogOut, FiUser, FiActivity,
} from 'react-icons/fi';

const adminNav = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: FiHome },
  { label: 'Doctors', href: '/doctors', icon: FiActivity },
  { label: 'Patients', href: '/patients', icon: FiUsers },
  { label: 'Appointments', href: '/appointments', icon: FiCalendar },
  { label: 'Prescriptions', href: '/prescriptions', icon: FiFileText },
  { label: 'Notifications', href: '/notifications', icon: FiBell },
];
const doctorNav = [
  { label: 'Dashboard', href: '/dashboard/doctor', icon: FiHome },
  { label: 'My Appointments', href: '/appointments', icon: FiCalendar },
  { label: 'Prescriptions', href: '/prescriptions', icon: FiFileText },
  { label: 'Patients', href: '/patients', icon: FiUsers },
  { label: 'Notifications', href: '/notifications', icon: FiBell },
];
const patientNav = [
  { label: 'Dashboard', href: '/dashboard/patient', icon: FiHome },
  { label: 'Book Appointment', href: '/appointments', icon: FiCalendar },
  { label: 'My Prescriptions', href: '/prescriptions', icon: FiFileText },
  { label: 'Notifications', href: '/notifications', icon: FiBell },
  { label: 'My Profile', href: '/profile', icon: FiUser },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const navItems =
    user?.role === 'admin' ? adminNav :
    user?.role === 'doctor' ? doctorNav : patientNav;

  const roleColors: any = {
    admin: { bg: '#7C3AED', light: '#F5F3FF', text: '#7C3AED' },
    doctor: { bg: '#0369A1', light: '#F0F9FF', text: '#0369A1' },
    patient: { bg: '#059669', light: '#ECFDF5', text: '#059669' },
  };
  const rc = roleColors[user?.role || 'patient'];

  return (
    <div style={{
      position: 'fixed', left: 0, top: 0,
      height: '100%', width: '256px',
      backgroundColor: 'white',
      borderRight: '1px solid #F1F5F9',
      display: 'flex', flexDirection: 'column',
      zIndex: 50,
      boxShadow: '4px 0 24px rgba(0,0,0,0.06)',
    }}>

      {/* Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid #F1F5F9',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px', height: '42px',
            background: 'linear-gradient(135deg, #1D4ED8, #2563EB)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
          }}>
            <FiActivity style={{ color: 'white', fontSize: '20px' }} />
          </div>
          <div>
            <h1 style={{
              fontWeight: '800', color: '#0F172A',
              fontSize: '17px', letterSpacing: '-0.3px',
            }}>
              HealthCare+
            </h1>
            <p style={{
              fontSize: '11px', color: '#94A3B8',
              textTransform: 'capitalize', fontWeight: '500',
            }}>
              {user?.role} Portal
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div style={{ padding: '16px 16px 12px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: rc.light,
          borderRadius: '14px', padding: '12px 14px',
          border: `1px solid ${rc.light}`,
        }}>
          <div style={{
            width: '36px', height: '36px',
            background: rc.bg,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{
              fontSize: '13px', fontWeight: '700',
              color: '#0F172A',
              whiteSpace: 'nowrap', overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {user?.name}
            </p>
            <p style={{
              fontSize: '11px', color: rc.text,
              fontWeight: '600', textTransform: 'capitalize',
            }}>
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <div style={{ padding: '4px 20px 8px' }}>
        <p style={{
          fontSize: '10px', fontWeight: '700',
          color: '#CBD5E1', textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          Navigation
        </p>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center',
                gap: '10px', padding: '10px 14px',
                borderRadius: '12px', marginBottom: '4px',
                background: isActive
                  ? 'linear-gradient(135deg, #1D4ED8, #2563EB)'
                  : 'transparent',
                color: isActive ? 'white' : '#64748B',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: isActive ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
              }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLDivElement).style.background = '#F8FAFC';
                    (e.currentTarget as HTMLDivElement).style.color = '#1E293B';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                    (e.currentTarget as HTMLDivElement).style.color = '#64748B';
                  }
                }}
              >
                <Icon style={{ fontSize: '17px', flexShrink: 0 }} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid #F1F5F9' }}>
        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center',
            gap: '10px', padding: '10px 14px',
            borderRadius: '12px', width: '100%',
            background: 'transparent',
            border: 'none', cursor: 'pointer',
            color: '#EF4444', fontWeight: '600',
            fontSize: '14px', transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          <FiLogOut style={{ fontSize: '17px' }} />
          Sign Out
        </button>
      </div>
    </div>
  );
}