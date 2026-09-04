import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import CartDrawer from '../cart/CartDrawer';
import CheckoutModal from '../cart/CheckoutModal';
import OrderSuccessModal from '../cart/OrderSuccessModal';
import { useCart } from '../../context/CartContext';

export default function SiteLayout({ children }) {
  const { toast } = useCart();

  return (
    <div className="mesh-bg min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
      <SiteHeader />
      <main className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl">
        {children}
      </main>
      <SiteFooter />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />

      {/* Toast notification */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 transition-all duration-400 transform border border-white/10 ${
          toast ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
      >
        <span className="bg-gradient-to-br from-emerald-400 to-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-sm">
          ✓
        </span>
        {toast}
      </div>
    </div>
  );
}
