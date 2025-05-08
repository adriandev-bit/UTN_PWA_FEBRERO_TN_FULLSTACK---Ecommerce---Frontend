import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/CartScreen.css";
import ENVIROMENT from '../config/enviroment';
import { FiShoppingBag, FiMinus, FiPlus, FiArrowLeft, FiTrash2, FiShoppingCart } from 'react-icons/fi';

const CartScreen = () => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCart = async (productId, action, price) => {
    try {
      const token = sessionStorage.getItem("authorization_token");
      if (!token) return;

      const method = action === "add" ? "POST" : "DELETE";
      const body = action === "add" ? JSON.stringify({ quantity: 1, price }) : null;

      const response = await fetch(`${ENVIROMENT.URL_API}/api/cart/${productId}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      if (!response.ok) throw new Error("Error al actualizar el carrito");

      setCart((prevCart) => {
        return prevCart
          .map((item) => {
            if (item.product._id === productId) {
              const newQuantity = action === "add" ? item.quantity + 1 : item.quantity - 1;
              return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
            }
            return item;
          })
          .filter(Boolean);
      });
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleBuy = () => {
    navigate("/checkout");
    window.scrollTo(0, 0);
  };

  const handleContinueShopping = () => {
    navigate("/home");
  };

  if (isLoading) {
    return (
      <div className="cart-container">
        <div className="cart-screen loading">
          <div className="loading-spinner">Cargando carrito...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-screen">
        <div className="cart-header">
          <button className="back-button" onClick={handleContinueShopping}>
            <FiArrowLeft /> Seguir comprando
          </button>
          <h2><FiShoppingCart /> Carrito de Compras</h2>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <FiShoppingBag className="empty-cart-icon" />
            <p>Tu carrito está vacío</p>
            <button className="continue-shopping-btn" onClick={handleContinueShopping}>
              Explorar productos
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map(({ product, quantity, price }) => (
                product && product.image ? (
                  <div key={product._id} className="cart-item">
                    <div className="item-image" onClick={() => navigate(`/producto/${product._id}`)}>
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="item-details">
                      <h3>{product.name}</h3>
                      <div className="item-price">
                        <span className="price">${price}</span>
                        {product.onSale && (
                          <span className="original-price">${product.price}</span>
                        )}
                      </div>
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn"
                          onClick={() => updateCart(product._id, "remove", price)}
                        >
                          {quantity === 1 ? <FiTrash2 /> : <FiMinus />}
                        </button>
                        <span className="quantity">{quantity}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => updateCart(product._id, "add", price)}
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                    <div className="item-total">
                      <span className="total-label">Subtotal</span>
                      <span className="total-amount">${(price * quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ) : null
              ))}
            </div>

            <div className="cart-summary">
              <h3>Resumen de compra</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} productos)</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <button className="checkout-btn" onClick={handleBuy}>
                Finalizar compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;
