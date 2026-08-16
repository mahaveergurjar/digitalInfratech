import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function OTPVerify() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtpLogin } = useAuth();

  const phone = location.state?.phone || sessionStorage.getItem('digitalinfratech-phone') || '';
  const demoOtp = location.state?.demoOtp || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState(demoOtp ? `Demo OTP: ${demoOtp}` : '');
  const [loading, setLoading] = useState(false);

  if (!phone) {
    return <Navigate to='/login' replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtpLogin({ phone, otp });
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'OTP not correct.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-shell'>
      <div className='auth-card card'>
        <span className='eyebrow'>Verify OTP</span>
        <h1>Enter code for {phone}</h1>
        <p>Use the demo OTP now. Later you can connect WhatsApp API in the backend.</p>

        {error && <div className='notice notice--error'>{error}</div>}
        {info && <div className='notice notice--info'>{info}</div>}

        <form onSubmit={submit} className='auth-form'>
          <label>
            OTP
            <input
              type='text'
              inputMode='numeric'
              maxLength='6'
              placeholder='Enter OTP'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </label>
          <button className='btn-primary' type='submit' disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
        </form>
        <Link className='text-link' to='/login'>Change phone</Link>
      </div>
    </div>
  );
}
