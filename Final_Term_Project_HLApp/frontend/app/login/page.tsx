'use client';
import { useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FiMail, FiLock, FiActivity, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    border: '1.5px solid #E2E8F0',
    borderRadius: '10px',
    padding: '12px 16px 12px 42px',
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    boxSizing: 'border-box' as const,
    backgroundColor: '#FAFAFA',
    transition: 'all 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: '7px',
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#EEF2F7',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>

      {/* ── Left Blue Panel ── */}
      <div style={{
        width: '48%',
        background: 'linear-gradient(150deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Decorative circles */}
        <div style={{
          position: 'absolute', width: '350px', height: '350px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
          top: '-100px', right: '-100px',
        }} />
        <div style={{
          position: 'absolute', width: '250px', height: '250px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
          bottom: '-60px', left: '-60px',
        }} />
        <div style={{
          position: 'absolute', width: '150px', height: '150px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
          top: '40%', left: '10%',
        }} />

        <div style={{
          color: 'white',
          textAlign: 'center',
          maxWidth: '380px',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Logo box */}
          <div style={{
            width: '76px', height: '76px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '22px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <FiActivity style={{ fontSize: '38px', color: 'white' }} />
          </div>

          <h1 style={{
            fontSize: '38px', fontWeight: '800',
            marginBottom: '12px', letterSpacing: '-0.5px',
            lineHeight: '1.1',
          }}>
            HealthCare+
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '16px', marginBottom: '40px',
            lineHeight: '1.6',
          }}>
            Your complete hospital management solution
          </p>

          {/* Feature list */}
          {[
            { icon: '🏥', text: 'Book appointments with top doctors' },
            { icon: '📋', text: 'Track your treatment progress' },
            { icon: '💊', text: 'Get prescriptions digitally' },
            { icon: '🔔', text: 'Receive timely reminders' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center',
              gap: '14px', marginBottom: '16px', textAlign: 'left',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '12px', padding: '12px 16px',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '14px', fontWeight: '500',
              }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        backgroundColor: '#EEF2F7',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Main Card */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            padding: '42px 40px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
            marginBottom: '16px',
          }}>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                gap: '6px', background: '#EFF6FF',
                borderRadius: '20px', padding: '4px 12px',
                marginBottom: '14px',
              }}>
                <div style={{
                  width: '6px', height: '6px',
                  borderRadius: '50%', background: '#2563EB',
                }} />
                <span style={{ fontSize: '12px', color: '#2563EB', fontWeight: '600' }}>
                  Secure Login
                </span>
              </div>
              <h2 style={{
                fontSize: '26px', fontWeight: '800',
                color: '#0F172A', marginBottom: '6px',
                letterSpacing: '-0.3px',
              }}>
                Welcome back 👋
              </h2>
              <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.5' }}>
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{
                    position: 'absolute', left: '14px',
                    top: '50%', transform: 'translateY(-50%)',
                    color: '#94A3B8', fontSize: '16px',
                    pointerEvents: 'none',
                  }} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2563EB';
                      e.target.style.backgroundColor = '#fff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.backgroundColor = '#FAFAFA';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '26px' }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{
                    position: 'absolute', left: '14px',
                    top: '50%', transform: 'translateY(-50%)',
                    color: '#94A3B8', fontSize: '16px',
                    pointerEvents: 'none',
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{ ...inputStyle, paddingRight: '44px' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2563EB';
                      e.target.style.backgroundColor = '#fff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.backgroundColor = '#FAFAFA';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '14px',
                      top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      cursor: 'pointer', color: '#94A3B8',
                      display: 'flex', alignItems: 'center',
                      fontSize: '17px', padding: '2px',
                    }}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading
                    ? '#93C5FD'
                    : 'linear-gradient(135deg, #1D4ED8, #2563EB)',
                  color: 'white',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(37,99,235,0.4)',
                  transition: 'all 0.2s',
                  letterSpacing: '0.2px',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(37,99,235,0.45)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.target as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(37,99,235,0.4)';
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '16px', height: '16px',
                      border: '2px solid rgba(255,255,255,0.5)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                    Signing in...
                  </>
                ) : '🔐 Sign In'}
              </button>
            </form>

            <p style={{
              textAlign: 'center', marginTop: '22px',
              color: '#64748B', fontSize: '14px',
            }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" style={{
                color: '#2563EB', fontWeight: '700',
                textDecoration: 'none',
              }}>
                Create account →
              </Link>
            </p>
          </div>

          {/* Demo Credentials Card */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '16px 20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <p style={{
              fontSize: '12px', fontWeight: '700',
              color: '#475569', marginBottom: '10px',
              textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              🔑 Demo Credentials
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { role: 'Admin', email: 'admin@healthcare.com', pass: 'admin123', color: '#7C3AED', bg: '#F5F3FF' },
                { role: 'Doctor', email: 'doctor@healthcare.com', pass: 'doctor123', color: '#0369A1', bg: '#F0F9FF' },
                { role: 'Patient', email: 'patient@healthcare.com', pass: 'patient123', color: '#065F46', bg: '#ECFDF5' },
              ].map((cred) => (
                <div key={cred.role} style={{
                  display: 'flex', alignItems: 'center',
                  gap: '10px', padding: '8px 12px',
                  borderRadius: '8px', background: cred.bg,
                }}>
                  <span style={{
                    fontSize: '11px', fontWeight: '700',
                    color: cred.color, minWidth: '48px',
                  }}>
                    {cred.role}
                  </span>
                  <span style={{ fontSize: '12px', color: '#475569', flex: 1 }}>
                    {cred.email}
                  </span>
                  <span style={{
                    fontSize: '11px', fontWeight: '600',
                    color: cred.color, background: 'white',
                    padding: '2px 8px', borderRadius: '6px',
                    border: `1px solid ${cred.bg}`,
                  }}>
                    {cred.pass}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .left-panel { display: none !important; }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}