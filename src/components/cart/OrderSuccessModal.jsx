import { buildWhatsAppOrderMessage, getWhatsAppUrl } from '../../utils/whatsapp';
import { money } from '../../data/mockData';
import { useCart } from '../../context/CartContext';

export default function OrderSuccessModal() {
  const { orderSuccess, closeOrderSuccess } = useCart();

  if (!orderSuccess) return null;

  const whatsappUrl = getWhatsAppUrl(
    buildWhatsAppOrderMessage(orderSuccess, orderSuccess.items)
  );

  return (
    <div
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
      onClick={closeOrderSuccess}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="surface-dark border-b border-stone-800 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-3xl mx-auto mb-4">
            ✓
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Order placed!</h3>
          <p className="text-stone-300 text-sm leading-relaxed">
            Hum 40 min mein call karenge.
          </p>
          {orderSuccess.customerPhone && (
            <p className="text-orange-200 text-sm mt-2 font-medium">
              Registered mobile: {orderSuccess.customerPhone}
            </p>
          )}
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm space-y-2">
            <div className="flex justify-between gap-3">
              <span className="text-stone-500">Order ID</span>
              <strong className="text-stone-900">{orderSuccess.orderNumber}</strong>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-stone-500">Total</span>
              <strong className="text-orange-600">{money.format(orderSuccess.total)}</strong>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-stone-500">Payment</span>
              <strong className="text-stone-900">Pay on delivery</strong>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-6 rounded-xl no-underline transition-colors"
            >
              Send order on WhatsApp
            </a>
            <button
              type="button"
              className="w-full py-3.5 px-6 rounded-xl border border-stone-200 text-stone-700 font-semibold hover:bg-stone-50 transition-colors"
              onClick={closeOrderSuccess}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
