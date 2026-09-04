import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from '../components/layout/SiteLayout';
import { useAdminAuth } from '../context/AdminAuthContext';

import HomePage from '../pages/Home/HomePage';
import Products from '../pages/Products/Products';
import ProductDetail from '../pages/Products/ProductDetail';
import Services from '../pages/Services/Services';
import ServiceDetail from '../pages/Services/ServiceDetail';
import ServiceCategory from '../pages/Services/ServiceCategory';
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminOrders from '../pages/Admin/AdminOrders';

const AdminProtected = ({ children }) => {
  const { isAdmin } = useAdminAuth();
  return isAdmin ? children : <Navigate to='/admin/login' replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/admin/login' element={<AdminLogin />} />
      <Route path='/admin' element={<AdminProtected><AdminOrders /></AdminProtected>} />

      <Route
        path='/*'
        element={
          <SiteLayout>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/products' element={<Products />} />
              <Route path='/product/:id' element={<ProductDetail />} />
              <Route path='/services' element={<Services />} />
              <Route path='/services/:slug' element={<ServiceCategory />} />
              <Route path='/service/:slug' element={<ServiceDetail />} />
              <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
          </SiteLayout>
        }
      />
    </Routes>
  );
}
