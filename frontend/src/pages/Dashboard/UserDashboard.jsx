import { useAuth } from '../../hooks/useAuth';

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className='page-stack'>
      <section className='card dashboard-card'>
        <span className='eyebrow'>Account</span>
        <h1>Welcome{user?.phone ? `, ${user.phone}` : ''}</h1>
        <p>Your simple phone verified account is ready for orders, service bookings and quick checkouts.</p>

        <div className='dashboard-grid'>
          <div>
            <strong>Orders</strong>
            <span>Ready to show from backend</span>
          </div>
          <div>
            <strong>Delivery</strong>
            <span>40 min local support</span>
          </div>
          <div>
            <strong>Login</strong>
            <span>Phone verification only</span>
          </div>
        </div>
      </section>
    </div>
  );
}
