import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { brand } from '../data/siteContent';
import { buildWhatsAppOrderMessage, getWhatsAppUrl } from '../utils/whatsapp';
import { API_URL } from '../config/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: 'Lucknow', note: '' });

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );
  const discount = subtotal > 0 ? Math.round(subtotal * 0.15) : 0;
  const total = subtotal - discount;

  const addToCart = (item) => {
    const entry = {
      id: item.id,
      type: item.type || 'product',
      name: item.name,
      pack: item.pack || item.summary || 'Painting service',
      price: item.price,
      image: item.image,
      qty: 1,
    };

    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id && cartItem.type === entry.type);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id && cartItem.type === entry.type
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }
      return [...current, entry];
    });

    setCartOpen(true);
    setToast(`${item.name} added to cart`);
  };

  const updateQty = (id, type, change) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id && item.type === type ? { ...item, qty: Math.max(0, item.qty + change) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id, type) => {
    setCart((current) => current.filter((item) => !(item.id === id && item.type === type)));
  };

  const openCheckout = () => {
    if (cart.length === 0) {
      setToast('Add a product or service to your cart first');
      return;
    }
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const closeOrderSuccess = () => {
    setOrderSuccess(null);
  };

  const handleSubmitOrder = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.address) {
      setToast('Please enter your name, email, phone, and address');
      return;
    }

    if (cart.length === 0) {
      setToast('Cart is empty');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
          address: form.address,
          city: form.city,
          note: form.note,
          items: cart.map((item) => ({
            itemId: item.id,
            type: item.type,
            name: item.name,
            pack: item.pack,
            price: item.price,
            qty: item.qty,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Order could not be placed');
      }

      const cartSnapshot = [...cart];

      const orderPayload = {
        orderNumber: data.order.orderNumber,
        total: data.order.total,
        customerName: form.name,
        customerPhone: form.phone,
        customerAddress: `${form.address}, ${form.city}`,
        items: cartSnapshot,
      };

      setOrderSuccess(orderPayload);

      const whatsappMessage = buildWhatsAppOrderMessage(orderPayload, cartSnapshot);
      window.open(getWhatsAppUrl(whatsappMessage, brand.whatsapp), '_blank', 'noopener,noreferrer');

      setCheckoutOpen(false);
      setCart([]);
      setForm({ name: '', email: '', phone: '', address: '', city: 'Lucknow', note: '' });
    } catch (error) {
      setToast(error.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const value = {
    cart,
    setCart,
    cartOpen,
    setCartOpen,
    checkoutOpen,
    setCheckoutOpen,
    orderSuccess,
    submitting,
    toast,
    setToast,
    form,
    setForm,
    subtotal,
    discount,
    total,
    addToCart,
    updateQty,
    removeItem,
    openCheckout,
    closeOrderSuccess,
    handleSubmitOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
