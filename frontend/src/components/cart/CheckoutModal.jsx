import { money } from '../../data/mockData';
import { useCart } from '../../context/CartContext';

export default function CheckoutModal() {
  const {
    cart,
    checkoutOpen,
    setCheckoutOpen,
    form,
    setForm,
    subtotal,
    discount,
    total,
    handleSubmitOrder,
  } = useCart();

  if (!checkoutOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 sm:p-6 overflow-y-auto" onClick={() => setCheckoutOpen(false)}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gray-900 text-white p-6 sm:p-8 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20" />
          <div className="relative z-10">
            <p className="text-orange-400 font-bold tracking-wider text-xs uppercase mb-1">Final Step</p>
            <h3 className="text-2xl sm:text-3xl font-black">Complete Your Order</h3>
          </div>
          <button type="button" className="relative z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors" onClick={() => setCheckoutOpen(false)}>✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <form id="checkout-form" className="space-y-6" onSubmit={handleSubmitOrder}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</span>
                <input className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</span>
                <input type="email" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number *</span>
                <input className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile number" required />
              </label>
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-1.5">City</span>
                <input className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Your city" />
              </label>
            </div>

            <label className="block">
              <span className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Address *</span>
              <input className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House number, building, street, area" required />
            </label>

            <label className="block">
              <span className="block text-sm font-semibold text-gray-700 mb-1.5">Special Instructions (Optional)</span>
              <textarea className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all resize-none" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows="3" placeholder="Color preferences, delivery instructions, etc." />
            </label>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 sm:p-6 mt-8">
              <h4 className="font-bold text-gray-900 mb-4 border-b border-orange-200 pb-2">Order Summary</h4>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm text-gray-700">
                    <span>{item.name} × {item.qty}</span>
                    <strong>{money.format(item.price * item.qty)}</strong>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-3 border-t border-orange-200 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{money.format(subtotal)}</span></div>
                <div className="flex justify-between text-green-600"><span>Diwali offer (15%)</span><span>- {money.format(discount)}</span></div>
                <div className="flex justify-between items-center text-lg sm:text-xl font-black text-gray-900 pt-2">
                  <span>Total Amount</span>
                  <strong className="text-orange-600">{money.format(total)}</strong>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
          <button type="button" className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors" onClick={() => setCheckoutOpen(false)}>
            Cancel
          </button>
          <button type="submit" form="checkout-form" className="w-full flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg flex justify-center items-center gap-2">
            <span>Place Order</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{money.format(total)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
