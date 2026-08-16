import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

export default function Login() {
  const [step, setStep] = useState('password'); // 'password' or 'otp'
  const [form, setForm] = useState({ email: '', password: '', otp: '' });
  const [challengeId, setChallengeId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setChallengeId(data.challengeId);
      setStep('otp');
      setForm({ ...form, otp: '' });
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.otp || form.otp.length !== 6) {
      setError('Enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId, code: form.otp })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }

      const data = await response.json();
      
      // Store token and user in localStorage
      if (data.token || data.accessToken) {
        localStorage.setItem('digitalinfratech-token', data.token || data.accessToken);
        localStorage.setItem('digitalinfratech-user', JSON.stringify(data.user));
        navigate('/');
      }
    } catch (err) {
      setError(err?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId })
      });

      if (!response.ok) {
        throw new Error('Failed to resend OTP');
      }

      setError('');
      alert('New OTP sent to your email');
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-shell'>
      <div className='auth-card card'>
        <span className='eyebrow'>Paint Store</span>
        <h1>{step === 'password' ? 'Login to Your Account' : 'Enter Verification Code'}</h1>
        <p>
          {step === 'password'
            ? 'Sign in with your email and password to browse and buy premium paints.'
            : 'A 6-digit code has been sent to your email. Enter it below to complete login.'}
        </p>

        {step === 'password' ? (
          <form onSubmit={handlePasswordSubmit} className='auth-form'>
            <label>
              Email
              <input
                type='email'
                placeholder='Enter your email'
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                disabled={loading}
              />
            </label>
            <label>
              Password
              <input
                type='password'
                placeholder='Enter your password'
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                disabled={loading}
              />
            </label>
            {error && <div className='notice notice--error'>{error}</div>}
            <button className='btn-primary' type='submit' disabled={loading}>
              {loading ? 'Verifying...' : 'Next'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className='auth-form'>
            <label>
              Verification Code
              <input
                type='text'
                placeholder='000000'
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                maxLength='6'
                required
                disabled={loading}
              />
            </label>
            {error && <div className='notice notice--error'>{error}</div>}
            <button className='btn-primary' type='submit' disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button 
              type='button' 
              onClick={handleResendOtp} 
              disabled={loading}
              style={{ marginTop: '8px', background: '#f0f0f0', color: '#333' }}
            >
              Resend Code
            </button>
            <button 
              type='button' 
              onClick={() => setStep('password')} 
              disabled={loading}
              style={{ marginTop: '8px', background: '#e0e0e0', color: '#333' }}
            >
              Back
            </button>
          </form>
        )}

        <p className='auth-footer-text'>
          Don't have an account? <Link to='/signup'>Sign up here</Link>
        </p>
      </div>
    </div>
  );
}
