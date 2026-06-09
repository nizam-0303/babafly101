import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrdersPage from './pages/orders/OrdersPage';
import FlightSearchResultsPage from './pages/flights/FlightSearchResultsPage';
import FlightDetailPage from './pages/flights/FlightDetailPage';
import FlightBookingPage from './pages/flights/FlightBookingPage';
import FlightBookingsPage from './pages/flights/FlightBookingsPage';
import ProtectedRoute from './components/ui/ProtectedRoute';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/flights/search" element={<ProtectedRoute><FlightSearchResultsPage /></ProtectedRoute>} />
          <Route path="/flights/:flightId" element={<ProtectedRoute><FlightDetailPage /></ProtectedRoute>} />
          <Route path="/flights/book/:flightId" element={<ProtectedRoute><FlightBookingPage /></ProtectedRoute>} />
          <Route path="/flights/bookings" element={<ProtectedRoute><FlightBookingsPage /></ProtectedRoute>} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </Provider>
  );
}
