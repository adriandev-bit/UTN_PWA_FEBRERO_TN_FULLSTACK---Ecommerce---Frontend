import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/CartScreen.css";
import ENVIROMENT from '../config/enviroment'

const CartScreen = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
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

  const handleBuy = () => {
    
    navigate("/checkout"); 
  };

  return (
    <div className="cart-screen">
      <h2>🛒 Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <ul>
          {cart.map(({ product, quantity, price }) => (
            product && product.image ? (
              <li key={product._id} className="cart-item">
                <img src={product.image} alt={product.name} className="cart-img" />
                <div>
                  <h3>{product.name}</h3>
                  <p>${price} x {quantity}</p>
                </div>
                <div className="cart-actions">
                  <button onClick={() => updateCart(product._id, "remove", price)} className="cart-btn">➖</button>
                  <span>{quantity}</span>
                  <button onClick={() => updateCart(product._id, "add", price)} className="cart-btn">➕</button>
                </div>
              </li>
            ) : null
          ))}
        </ul>
      )}
      

      
      {cart.length > 0 && (
        <button onClick={handleBuy} className="buy-btn">
          Comprar
        </button>
        
      )}
      <button onClick={() => navigate("/home")} className="back-btn">⬅ Volver a la tienda</button>
    </div>
  );
};

export default CartScreen;
