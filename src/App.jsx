import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginScreen from './Screens/LoginScreen'
import RegisterScreen from './Screens/RegisterScreen'
import ResetPasswordScreen from './Screens/ResetPasswordScreen'
import RewritePasswordScreen from './Screens/RewritePasswordScreen'
import ProtectedRoute from './Components/ProtectedRoute'
import HomeScreen from './Screens/HomeScreen'
import CartScreen from './Screens/CartScreen'
import ProductDetail from './Screens/ProductDetail'
import Header from './Screens/Header'
import Footer from './Screens/Footer'
import ContactScreen from './Screens/ContactScreen'
import './Screens/css/App.css' 
import CheckoutScreen from './Screens/CheckoutScreen'
import OffersScreen from './Screens/OffersScreen'
import { Navigate } from "react-router-dom";

function App() {
  return (
    <div className="app-container">
      
      <Header />

      
      <main className="app-content">
        <Routes>
          <Route path='/login' element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />          
          <Route path='/reset-password' element={<ResetPasswordScreen />} />         
          <Route path='/rewrite-password' element={<RewritePasswordScreen />} />
          <Route path="/contacto" element={<ContactScreen />} />


          <Route element={<ProtectedRoute />}>
             <Route path='/' element={<LoginScreen />} />
            <Route path='/home' element={<HomeScreen />} />
            <Route path="/categoria/:categoryId" element={<HomeScreen />} />
            <Route path="/producto/:productId" element={<ProductDetail />} />
            <Route path='/cart' element={<CartScreen />} />
            <Route path="/checkout" element={<CheckoutScreen />} />
            <Route path="/ofertas" element={<OffersScreen />} />
          </Route>
        </Routes>
      </main>

      
      <Footer />
    </div>
  )
}

export default App
