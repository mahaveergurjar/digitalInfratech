import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from '../components/layout/SiteLayout';
import { useAuth } from '../hooks/useAuth';

import HomePage from '../pages/Home/HomePage';
import Products from '../pages/Products/Products';
import ProductDetail from '../pages/Products/ProductDetail';
import Services from '../pages/Services/Services';
import ServiceDetail from '../pages/Services/ServiceDetail';
import ServiceCategory from '../pages/Services/ServiceCategory';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import UserDashboard from '../pages/Dashboard/UserDashboard';
import PriceLists from '../pages/PriceLists/PriceLists';

const Protected = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to='/login' replace />;
};

export default function AppRoutes() {
  return (
    <SiteLayout>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/products' element={<Products />} />
        <Route path='/product/:id' element={<ProductDetail />} />
        <Route path='/services' element={<Services />} />
        <Route path='/services/:slug' element={<ServiceCategory />} />
        <Route path='/service/:slug' element={<ServiceDetail />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Protected><UserDashboard /></Protected>} />
        <Route path='/price-lists' element={<PriceLists />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </SiteLayout>
  );
}
