'use client';
import { useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FiMail, FiLock, FiActivity, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';

export default function RegisterPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    confirmPassword: '', role: 'patient',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error('Please fill all fields'); return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match'); return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters'); return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name, email: form.email,
        password: form.password, role: form.role,
      });
      login(data.user, data.token);
      toast.success('Account created successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%',
    border: '1.5px solid #E2E8F0',
    borderRadius: '10px',
    padding: '11px 16px 11px 40px',
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    boxSizing: 'border-box' as const,
    backgroundColor: '#FAFAFA',
    transition: 'border 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: '6px',
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#F1F5F9',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>

      {/* ── Left green panel ── */}
      <div style={{
        width: '45%',
        background: 'linear-gradient(160deg, #059669 0%, #10B981 50%, #34D399 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{
          position: 'absolute', width: '300px', height: '300px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
          top: '-80px', right: '-80px',
        }} />
        <div style={{
          position: 'absolute', width: '200px', height: '200px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
          bottom: '-40px', left: '-40px',
        }} />

        <div style={{ color: 'white', textAlign: 'center', maxWidth: '360px', position: 'relative' }}>
          {/* Logo */}
          <div style={{
            width: '72px', height: '72px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            backdropFilter: 'blur(10px)',
          }}>
            <FiActivity style={{ fontSize: '36px', color: 'white' }} />
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px', letterSpacing: '-0.5px' }}>
            Join HealthCare+
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', marginBottom: '36px', lineHeight: '1.6' }}>
            Create your account and get started today
          </p>

          {/* Features */}
          {[
            'Free account registration',
            'Secure & private health records',
            'Connect with specialist doctors',
            'Get reminders for medications',
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center',
              gap: '12px', marginBottom: '14px', textAlign: 'left',
            }}>
              <div style={{
                width: '26px', height: '26px', minWidth: '26px',
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px',
              }}>✓</div>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

          {/* Card */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            border: '1px solid #E8EEF4',
            padding: '40px 36px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }}>
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{
                fontSize: '24px', fontWeight: '700',
                color: '#0F172A', marginBottom: '6px',
              }}>
                Create account
              </h2>
              <p style={{ color: '#64748B', fontSize: '14px' }}>
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Full Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <FiUser style={{
                    position: 'absolute', left: '13px',
                    top: '50%', transform: 'translateY(-50%)',
                    color: '#94A3B8', fontSize: '15px',
                  }} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#10B981'; e.target.style.backgroundColor = '#fff'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; e.target.style.backgroundColor = '#FAFAFA'; }}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{
                    position: 'absolute', left: '13px',
                    top: '50%', transform: 'translateY(-50%)',
                    color: '#94A3B8', fontSize: '15px',
                  }} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#10B981'; e.target.style.backgroundColor = '#fff'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; e.target.style.backgroundColor = '#FAFAFA'; }}
                  />
                </div>
              </div>

              {/* Role Selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Register As</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {[
                    { value: 'patient', label: '🤒 Patient' },
                    { value: 'doctor', label: '👨‍⚕️ Doctor' },
                    { value: 'admin', label: '👨‍💼 Admin' },
                  ].map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: role.value })}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '600',
                        border: form.role === role.value ? '2px solid #10B981' : '1.5px solid #E2E8F0',
                        background: form.role === role.value ? '#ECFDF5' : 'white',
                        color: form.role === role.value ? '#059669' : '#64748B',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{
                    position: 'absolute', left: '13px',
                    top: '50%', transform: 'translateY(-50%)',
                    color: '#94A3B8', fontSize: '15px',
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{ ...inputStyle, paddingRight: '40px' }}
                    onFocus={(e) => { e.target.style.borderColor = '#10B981'; e.target.style.backgroundColor = '#fff'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; e.target.style.backgroundColor = '#FAFAFA'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '13px',
                      top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      cursor: 'pointer', color: '#94A3B8', fontSize: '16px',
                    }}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{
                    position: 'absolute', left: '13px',
                    top: '50%', transform: 'translateY(-50%)',
                    color: '#94A3B8', fontSize: '15px',
                  }} />
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = '#10B981'; e.target.style.backgroundColor = '#fff'; }}
                    onBlur={(e) => { e.target.style.borderColor = '#E2E8F0'; e.target.style.backgroundColor = '#FAFAFA'; }}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading
                    ? '#6EE7B7'
                    : 'linear-gradient(135deg, #059669, #10B981)',
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
                  boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
                  transition: 'opacity 0.2s',
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '16px', height: '16px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Creating account...
                  </>
                ) : 'Create Account'}
              </button>
            </form>

            <p style={{
              textAlign: 'center', marginTop: '20px',
              color: '#64748B', fontSize: '14px',
            }}>
              Already have an account?{' '}
              <Link href="/login" style={{
                color: '#059669', fontWeight: '700', textDecoration: 'none',
              }}>
                Sign in
              </Link>
            </p>
          </div>

          {/* Bottom note */}
          <p style={{
            textAlign: 'center', marginTop: '16px',
            fontSize: '12px', color: '#94A3B8',
          }}>
            By creating an account you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}