'use client';
import { useAuth } from '@/context/AuthContext';
import { FiBell } from 'react-icons/fi';
import Link from 'next/link';

interface NavbarProps { title: string; }

export default function Navbar({ title }: NavbarProps) {
  const { user } = useAuth();
  const roleColors: any = {
    admin: '#7C3AED', doctor: '#0369A1', patient: '#059669',
  };
  const color = roleColors[user?.role || 'patient'];

  return (
    <div style={{
      height: '64px',
      backgroundColor: 'white',
      borderBottom: '1px solid #F1F5F9',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky', top: 0, zIndex: 40,
      boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
    }}>
      <h2 style={{
        fontSize: '18px', fontWeight: '700',
        color: '#0F172A', letterSpacing: '-0.3px',
      }}>
        {title}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/notifications" style={{
          width: '38px', height: '38px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '10px', background: '#F8FAFC',
          border: '1px solid #F1F5F9', textDecoration: 'none',
          color: '#64748B', transition: 'all 0.15s',
        }}>
          <FiBell style={{ fontSize: '17px' }} />
        </Link>
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '10px', padding: '6px 12px 6px 6px',
          background: '#F8FAFC', borderRadius: '12px',
          border: '1px solid #F1F5F9',
        }}>
          <div style={{
            width: '32px', height: '32px',
            background: color,
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A', lineHeight: 1.2 }}>
              {user?.name}
            </p>
            <p style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'capitalize' }}>
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}