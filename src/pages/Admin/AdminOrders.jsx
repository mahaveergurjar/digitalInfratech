import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { adminFetch, useAdminAuth } from '../../context/AdminAuthContext';
import { money } from '../../data/mockData';

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-amber-100 text-amber-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

function statusClass(status) {
  return statusOptions.find((s) => s.value === status)?.color || 'bg-stone-100 text-stone-700';
}

export default function AdminOrders() {
  const { token, admin, logout, isAdmin } = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');

    try {
      const response = await adminFetch('/admin/orders', token);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to load orders');
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || 'Could not load orders');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateStatus = async (orderId, status) => {
    try {
      const response = await adminFetch(`/admin/orders/${orderId}/status`, token, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Update failed');

      setOrders((current) =>
        current.map((order) => (order._id === orderId ? { ...order, status } : order))
      );
    } catch (err) {
      setError(err.message || 'Could not update status');
    }
  };

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="surface-dark border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-white">Orders Dashboard</h1>
            <p className="text-stone-400 text-sm">{admin?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadOrders}
              className="text-sm font-semibold text-stone-200 border border-stone-600 px-4 py-2 rounded-xl hover:bg-stone-800 transition-colors"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={logout}
              className="text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-xl transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Total orders</p>
            <p className="text-3xl font-black text-stone-900 mt-1">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Pending</p>
            <p className="text-3xl font-black text-amber-600 mt-1">
              {orders.filter((o) => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Confirmed</p>
            <p className="text-3xl font-black text-blue-600 mt-1">
              {orders.filter((o) => o.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-stone-500">Completed</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">
              {orders.filter((o) => o.status === 'completed').length}
            </p>
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
        )}

        {loading ? (
          <p className="text-stone-500 text-center py-16">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <p className="text-stone-500">No orders yet.</p>
            <Link to="/" className="text-orange-600 font-semibold text-sm mt-2 inline-block no-underline">
              Back to store
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order._id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h2 className="text-lg font-black text-stone-900">{order.orderNumber}</h2>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500">
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-orange-600">{money.format(order.total)}</p>
                    <p className="text-xs text-stone-500 mt-1">Pay on delivery</p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">Customer</p>
                    <p className="font-semibold text-stone-900">{order.customer?.name}</p>
                    <p className="text-sm text-stone-600 mt-1">
                      <a href={`tel:${order.customer?.phone}`} className="text-orange-600 no-underline">
                        {order.customer?.phone}
                      </a>
                    </p>
                    <p className="text-sm text-stone-500">{order.customer?.email}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">Delivery</p>
                    <p className="text-sm text-stone-700 leading-relaxed">
                      {order.address}, {order.city}
                    </p>
                    {order.note && (
                      <p className="text-sm text-stone-500 mt-2 italic">Note: {order.note}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-stone-500 mb-2">Items</p>
                    <ul className="space-y-1.5">
                      {order.items?.map((item) => (
                        <li key={`${item.itemId}-${item.name}`} className="text-sm text-stone-700 flex justify-between gap-3">
                          <span>{item.name} × {item.qty}</span>
                          <span className="font-semibold">{money.format(item.price * item.qty)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-5 sm:px-6 py-4 bg-stone-50 border-t border-stone-100 flex flex-wrap items-center gap-3">
                  <label className="text-sm font-semibold text-stone-600">Update status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="text-sm border border-stone-200 rounded-xl px-3 py-2 bg-white outline-none focus:border-orange-400"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
