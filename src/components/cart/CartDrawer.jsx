import { Link } from 'react-router-dom';
import { money } from '../../data/mockData';
import { useCart } from '../../context/CartContext';
import { resolveServiceImage } from '../../utils/serviceImage';
import { getDiscountPercent } from '../../utils/catalogHelpers';

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    subtotal,
    discount,
    total,
    updateQty,
    removeItem,
    openCheckout,
  } = useCart();

  return (
    <div
      className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={() => setCartOpen(false)}
    >
      <aside
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 transform ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
          <h3 className="text-2xl font-black text-gray-900">Your Cart</h3>
          <button type="button" className="text-gray-400 hover:text-gray-900 text-xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="text-6xl mb-4 opacity-50">🛒</div>
            <h4 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h4>
            <p className="text-gray-500 mb-8 text-sm">Looks like you haven&apos;t added anything yet.</p>
            <Link
              to="/products"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-colors no-underline"
              onClick={() => setCartOpen(false)}
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {cart.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-2 flex-shrink-0 border border-gray-100">
                    <img
                      src={item.type === 'service' ? resolveServiceImage(item) : item.image}
                      alt={item.name}
                      className={`max-w-full max-h-full ${
                        item.type === 'service' ? 'object-cover rounded-lg' : 'object-contain mix-blend-multiply'
                      }`}
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 leading-tight text-sm sm:text-base">{item.name}</h4>
                      <div className="text-right">
                        <strong className="text-gray-900 whitespace-nowrap block">
                          {money.format(item.price * item.qty)}
                        </strong>
                        {item.originalPrice > item.price && (
                          <span className="text-[10px] text-gray-400 line-through block">
                            {money.format(item.originalPrice * item.qty)}
                          </span>
                        )}
                      </div>
                    </div>
                    {getDiscountPercent(item.price, item.originalPrice) > 0 && (
                      <span className="inline-block text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md mb-1">
                        {getDiscountPercent(item.price, item.originalPrice)}% off
                      </span>
                    )}
                    <p className="text-xs text-gray-500 mb-3">{item.pack}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button type="button" className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors font-medium" onClick={() => updateQty(item.id, item.type, -1)}>-</button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm font-bold bg-white border-x border-gray-200">{item.qty}</span>
                        <button type="button" className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors font-medium" onClick={() => updateQty(item.id, item.type, 1)}>+</button>
                      </div>
                      <button type="button" className="text-xs font-semibold text-red-500 hover:text-red-700 underline" onClick={() => removeItem(item.id, item.type)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 sm:p-6 bg-gray-50 border-t border-gray-200">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <strong className="text-gray-900">{money.format(subtotal)}</strong>
                </div>
                <div className="flex justify-between text-green-600 text-sm font-medium">
                  <span>Diwali offer (15%)</span>
                  <strong>- {money.format(discount)}</strong>
                </div>
                <div className="flex justify-between text-gray-900 text-lg sm:text-xl font-black pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <strong className="text-orange-600">{money.format(total)}</strong>
                </div>
              </div>
              <button
                type="button"
                className="w-full bg-gray-900 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
                onClick={openCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
