import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!form.email) {
      setError('Email is required');
      return;
    }

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email,
        password: form.password
      });
      setMessage('Account created successfully! Redirecting to home...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card card'>
        <h2>Create Account</h2>
        <p className='auth-subtitle'>Sign up to browse and purchase premium paint products.</p>
        {message && <div className='success'>{message}</div>}
        {error && <div className='error'>{error}</div>}
        <form onSubmit={onSubmit}>
          <Input
            label='Full Name'
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder='Enter your full name'
            required
          />
          <Input
            label='Email'
            type='email'
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder='Enter your email'
            required
          />
          <Input
            label='Password'
            type='password'
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder='Min 8 chars, 1 uppercase, 1 lowercase, 1 number'
            required
          />
          <Input
            label='Confirm Password'
            type='password'
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder='Re-enter your password'
            required
          />
          <button className='btn' type='submit' disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className='auth-footer-text'>
          Already have an account? <Link to='/login'>Login here</Link>
        </p>
      </div>
    </div>
  );
}
