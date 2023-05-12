import { useEffect, useState } from "react";
import { BrowserRouter,Route, Routes } from "react-router-dom";

import './App.css';

import Home from './components/Home';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import "./components/layout/Header";

//product imports
import ProductDetails from "./components/product/ProductDetails";
import AdminPrivate from "./components/router/AdminPrivate";

import store from "./store";
import PrivateRoute from "./components/router/PrivateRoute";

//user imports
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import { loadUserProfile } from "./actions/userActions";
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import ResetPassword from "./components/user/ResetPassword";

//cart imports
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";

//PAYEMENT
import Payment from "./components/cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./components/cart/OrderSuccess";
import ListOfOrders from "./components/orders/ListOfOrders";
import OrderDetails from "./components/orders/OrderDetails";

//admin imports
import Dashboard from "./components/admin/Dashboard";
import UsersList from "./components/admin/UsersList";

import axios from "./api/axios";
import AdminProducts from "./components/admin/AdminProducts";
import { useSelector } from "react-redux";
import NewProduct from "./components/admin/NewProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import OrdersList from "./components/admin/OrdersList";
import ProcessOrders from "./components/admin/ProcessOrders";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReviews from "./components/admin/ProductReviews";
axios.defaults.withCredentials = true;

function App() {

  const [stripeApi,setStripeApi ] = useState();

  useEffect(()=>{
    store.dispatch(loadUserProfile());

    async function getStripeApiKey(){
      const { data } = await axios.get("/stripeapi");
      
      setStripeApi(data.stripeApiKey);
    }

    getStripeApiKey();
  },[]);

  const { loading,user } = useSelector(state => state.auth);

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search/:keyword" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />
            <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/update" element={<UpdateProfile />} />
                <Route path="/password/update" element={<UpdatePassword />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/order/confirm" element={<ConfirmOrder />} />
                <Route path="/success" element={<OrderSuccess />} />
                <Route path="/orders/me" element={<ListOfOrders />} />
                <Route path="/order/:id" element={<OrderDetails />} />                
            </Route>
          </Routes>

          {/* PAYMENTS */}
          {stripeApi && (
            <Elements stripe={loadStripe(stripeApi)}>
              <Routes>
                <Route element={<PrivateRoute />}>
                  <Route path="/payment" element={<Payment />} />
                </Route>
              </Routes>
            </Elements>
          )}
        </div>

         {/* ADMIN ROUTES */}
         <Routes>
            <Route element={<AdminPrivate />}>
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/admin/products" element={<AdminProducts />}/>
                <Route path="/admin/product" element={<NewProduct />}/>
                <Route path="/admin/product/:id" element={<UpdateProduct />}/>
                <Route path="/admin/orders" element={<OrdersList />}/>
                <Route path="/admin/order/:id" element={<ProcessOrders />}/>
                <Route path="/admin/users" element={<UsersList />}/>
                <Route path="/admin/user/:id" element={<UpdateUser />}/>
                <Route path="/admin/reviews" element={<ProductReviews />}/>
            </Route>
          </Routes>

          
        {!loading && user && user.role !=="admin" && <Footer />}
      </div>
    </BrowserRouter>
  );
}

export default App;
