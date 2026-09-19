import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CartProvider } from './context/CartContext';
import { CatalogProvider } from './context/CatalogContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <CatalogProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </CatalogProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
