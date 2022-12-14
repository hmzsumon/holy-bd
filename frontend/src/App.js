import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';
import WebFont from 'webfontloader';
import { loadUser } from './actions/userAction';
import Dashboard from './components/Admin/Dashboard';
import EditOrderItem from './components/Admin/EditOrderItem';
import MainData from './components/Admin/MainData';
import NewProduct from './components/Admin/NewProduct';
import NewService from './components/Admin/NewService';
import OrderTable from './components/Admin/OrderTable';
import ProductTable from './components/Admin/ProductTable';
import ReviewsTable from './components/Admin/ReviewsTable';
import ServiceTable from './components/Admin/ServiceTable';
import UpdateOrder from './components/Admin/UpdateOrder';
import UpdateProduct from './components/Admin/UpdateProduct';
import UpdateService from './components/Admin/UpdateService';
import UpdateUser from './components/Admin/UpdateUser';
import UserTable from './components/Admin/UserTable';
import Cart from './components/Cart/Cart';
import OrderConfirm from './components/Cart/OrderConfirm';
import OrderStatus from './components/Cart/OrderStatus';
import OrderSuccess from './components/Cart/OrderSuccess';
import Payment from './components/Cart/Payment';
import Shipping from './components/Cart/Shipping';
import Home from './components/Home/Home';
import Footer from './components/Layouts/Footer/Footer';
import Header from './components/Layouts/Header/Header';
import NotFound from './components/NotFound';
import MyOrders from './components/Order/MyOrders';
import OrderDetails from './components/Order/OrderDetails';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Products from './components/Products/Products';
import ServiceCart from './components/ServiceCart/ServiceCart';
import Account from './components/User/Account';
import ForgotPassword from './components/User/ForgotPassword';
import Login from './components/User/Login';
import Register from './components/User/Register';
import ResetPassword from './components/User/ResetPassword';
import UpdatePassword from './components/User/UpdatePassword';
import UpdateProfile from './components/User/UpdateProfile';
import Wishlist from './components/Wishlist/Wishlist';
import ProtectedRoute from './Routes/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [stripeApiKey, setStripeApiKey] = useState('');

  async function getStripeApiKey() {
    const { data } = await axios.get('/api/v1/stripeapikey');
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto:300,400,500,600,700'],
      },
    });
  });

  useEffect(() => {
    dispatch(loadUser());
    getStripeApiKey();
  }, [dispatch]);

  // always scroll to top on route/path change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  // disable right click
  // window.addEventListener("contextmenu", (e) => e.preventDefault());
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 123) e.preventDefault();
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) e.preventDefault();
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) e.preventDefault();
  });

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:keyword' element={<Products />} />

        <Route path='/cart' element={<Cart />} />
        <Route path='/service/cart' element={<ServiceCart />} />

        {/* order process */}
        <Route
          path='/shipping'
          element={
            <ProtectedRoute>
              <Shipping />
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/order/confirm'
          element={
            <ProtectedRoute>
              <OrderConfirm />
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/process/payment'
          element={
            <ProtectedRoute>
              {stripeApiKey && (
                <Elements stripe={loadStripe(stripeApiKey)}>
                  <Payment />
                </Elements>
              )}
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/orders/success'
          element={<OrderSuccess success={true} />}
        />
        <Route
          path='/orders/failed'
          element={<OrderSuccess success={false} />}
        />
        {/* order process */}

        <Route
          path='/order/:id'
          element={
            <ProtectedRoute>
              <OrderStatus />
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/orders'
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/order_details/:id'
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/account'
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/account/update'
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/password/update'
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        ></Route>

        <Route path='/password/forgot' element={<ForgotPassword />} />

        <Route path='/password/reset/:token' element={<ResetPassword />} />

        <Route
          path='/wishlist'
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/admin/dashboard'
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard activeTab={0}>
                <MainData />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/admin/services'
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard activeTab={1}>
                <ServiceTable />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/admin/new_service'
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard activeTab={1}>
                <NewService />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/admin/service/:id'
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard activeTab={4}>
                <UpdateService />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/admin/orders'
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard activeTab={2}>
                <OrderTable />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/admin/order/:id'
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard activeTab={2}>
                <UpdateOrder />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/admin/order/item/:id'
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard activeTab={2}>
                <EditOrderItem />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/admin/products'
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard activeTab={2}>
                <ProductTable />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/admin/new_product'
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard activeTab={3}>
                <NewProduct />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/admin/product/:id'
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard activeTab={2}>
                <UpdateProduct />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/admin/users'
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard activeTab={4}>
                <UserTable />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/admin/user/:id'
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard activeTab={4}>
                <UpdateUser />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path='/admin/reviews'
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard activeTab={5}>
                <ReviewsTable />
              </Dashboard>
            </ProtectedRoute>
          }
        ></Route>

        <Route path='*' element={<NotFound />}></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
