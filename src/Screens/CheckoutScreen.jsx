import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/CheckoutScreen.css";
import ENVIROMENT from '../config/enviroment';
import { FiCreditCard, FiDollarSign, FiArrowLeft, FiShoppingBag, FiCheckCircle, FiAlertCircle, FiShoppingCart } from 'react-icons/fi';
import { FaPaypal } from 'react-icons/fa';

const CheckoutScreen = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    window.scrollTo(0, 0);
  }, []);

  const fetchCart = async () => {
    try {
      const token = sessionStorage.getItem("authorization_token");
      if (!token) {
        console.error("Usuario no autenticado.");
        return;
      }

      const response = await fetch(`${ENVIROMENT.URL_API}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al obtener el carrito");

      const data = await response.json();
      setCart(data.data.products || []);
      calculateTotal(data.data.products || []);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (products) => {
    const totalAmount = products.reduce(
      (acc, { price, quantity }) => acc + price * quantity,
      0
    );
    setTotal(totalAmount.toFixed(2));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const validateForm = () => {
    if (paymentMethod === "credit-card") {
      return formData.cardNumber && formData.expiryDate && formData.cvv;
    }
    return formData.name && formData.email && formData.address && formData.city && formData.zipCode;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setPaymentStatus({
        success: false,
        message: "Por favor, complete todos los campos requeridos.",
      });
      return;
    }

    try {
      // Simular procesamiento de pago
      setPaymentStatus({
        success: true,
        message: "¡Pago procesado con éxito! Tu pedido está en camino.",
      });

      // Limpiar carrito después del pago exitoso
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (error) {
      setPaymentStatus({
        success: false,
        message: "Error al procesar el pago. Por favor, intente nuevamente.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="checkout-container">
        <div className="checkout-screen loading">
          <div className="loading-spinner">
            <FiShoppingBag className="loading-icon" />
            <span>Cargando información del pedido...</span>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-screen">
          <div className="empty-checkout">
            <FiShoppingBag className="empty-icon" />
            <h2>Tu carrito está vacío</h2>
            <p>Agrega algunos productos para realizar tu compra</p>
            <button className="continue-shopping-btn" onClick={() => navigate("/home")}>
              Continuar comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-screen">
        <div className="checkout-header">
          <button className="back-button" onClick={() => navigate("/cart")}>
            <FiArrowLeft /> Volver al carrito
          </button>
          <h2><FiShoppingCart /> Finalizar Compra</h2>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            <section className="shipping-info">
              <h3>Información de envío</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Nombre completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="address">Dirección de envío</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">Ciudad</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">Código postal</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="payment-methods">
              <h3>Método de pago</h3>
              <div className="payment-options">
                <button
                  type="button"
                  className={`payment-option ${paymentMethod === 'credit-card' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('credit-card')}
                >
                  <FiCreditCard />
                  <span>Tarjeta de Crédito</span>
                </button>
                <button
                  type="button"
                  className={`payment-option ${paymentMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('paypal')}
                >
                  <FaPaypal />
                  <span>PayPal</span>
                </button>
                <button
                  type="button"
                  className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('cash')}
                >
                  <FiDollarSign />
                  <span>Efectivo</span>
                </button>
              </div>

              {paymentMethod === 'credit-card' && (
                <div className="credit-card-form">
                  <div className="form-group full-width">
                    <label htmlFor="cardNumber">Número de tarjeta</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="expiryDate">Fecha de expiración</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
              )}
            </section>
          </div>

          <div className="order-summary">
            <h3>Resumen del pedido</h3>
            <div className="order-items">
              {cart.map(({ product, quantity, price }) => (
                <div key={product._id} className="order-item">
                  <div className="item-image">
                    <img src={product.image} alt={product.name} />
                    <span className="item-quantity">{quantity}</span>
                  </div>
                  <div className="item-info">
                    <h4>{product.name}</h4>
                    <p className="item-price">${price} x {quantity}</p>
                  </div>
                  <div className="item-total">
                    ${(price * quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="shipping">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="total">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            <button 
              className="checkout-btn" 
              onClick={handleSubmit}
              disabled={!paymentMethod || !validateForm()}
            >
              Confirmar pedido
            </button>
          </div>
        </div>

        {paymentStatus && (
          <div className={`payment-status ${paymentStatus.success ? 'success' : 'error'}`}>
            {paymentStatus.success ? <FiCheckCircle /> : <FiAlertCircle />}
            <p>{paymentStatus.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutScreen;
