import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';

import App from '../App';
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
    <>
      <Navbar />
      <main className='main-content'>
        <Routes>
          <Route path='/' element={<App />} />
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
      </main>
      <Footer />
    </>
  );
}
