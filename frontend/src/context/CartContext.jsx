import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { money } from '../data/mockData';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
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
      type: item.type,
      name: item.name,
      pack: item.pack || item.summary || 'Painting service',
      price: item.price,
      image: item.image,
      qty: 1,
    };

    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id && cartItem.type === item.type);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id && cartItem.type === item.type
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
    setCheckoutOpen(true);
  };

  const handleSubmitOrder = (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.address) {
      setToast('Please enter your name, email, phone, and address');
      return;
    }

    if (cart.length === 0) {
      setToast('Cart is empty');
      return;
    }

    const GOOGLE_FORM_ID = '1FAIpQLSfDs-mBFJhVVIQq7sDkv3UeCVRre-P5gTIKncZoCdh7_oA0dA';
    const cartItems = cart.map((item) => `${item.name} (x${item.qty})`).join(', ');

    const baseUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform`;
    const params = [
      `entry.1012119275=${encodeURIComponent(cartItems)}`,
      `entry.1779012947=${encodeURIComponent(form.name)}`,
      `entry.1501106635=${encodeURIComponent(form.email)}`,
      `entry.8936408891=${encodeURIComponent(form.phone)}`,
      `entry.2195818000=${encodeURIComponent(form.address)}`,
    ].join('&');

    window.open(`${baseUrl}?${params}`, '_blank');

    setCheckoutOpen(false);
    setCart([]);
    setToast('Opening order form in new tab...');
  };

  const value = {
    cart,
    setCart,
    cartOpen,
    setCartOpen,
    checkoutOpen,
    setCheckoutOpen,
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
    handleSubmitOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
