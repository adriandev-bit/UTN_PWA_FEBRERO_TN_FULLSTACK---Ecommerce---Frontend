import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/CheckoutScreen.css";

const CheckoutScreen = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null); 
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

      const response = await fetch("http://localhost:3000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al obtener el carrito");

      const data = await response.json();
      setCart(data.data.products || []);
      calculateTotal(data.data.products || []);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    }
  };

  const calculateTotal = (products) => {
    const totalAmount = products.reduce(
      (acc, { price, quantity }) => acc + price * quantity,
      0
    );
    setTotal(totalAmount.toFixed(2));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Por favor, selecciona un método de pago.");
      return;
    }
    
    setPaymentStatus({
      success: true,
      message: `Pago realizado con éxito usando ${paymentMethod}. ¡Gracias por tu compra!`,
    });
    
  };

  return (
    <div className="checkout-screen">
      <h2>🛒 Detalles de tu compra</h2>

     
      {cart.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div className="cart-details">
          <ul>
            {cart.map(({ product, quantity, price }) => (
              <li key={product._id} className="cart-item">
                <img src={product.image} alt={product.name} className="cart-img" />
                <div>
                  <h3>{product.name}</h3>
                  <p>${price} x {quantity}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="total">
            <p>Total: ${total}</p>
          </div>
        </div>
      )}

      
      <form onSubmit={handleSubmit} className="payment-form">
        <h3>Selecciona un método de pago</h3>
        <div className="payment-methods">
          <label>
            <input
              type="radio"
              value="Tarjeta de Crédito"
              checked={paymentMethod === "Tarjeta de Crédito"}
              onChange={handlePaymentMethodChange}
            />
            Tarjeta de Crédito
          </label>
          <label>
            <input
              type="radio"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={handlePaymentMethodChange}
            />
            PayPal
          </label>
          <label>
            <input
              type="radio"
              value="Efectivo a la entrega"
              checked={paymentMethod === "Efectivo a la entrega"}
              onChange={handlePaymentMethodChange}
            />
            Efectivo a la entrega
          </label>
        </div>

        <button type="submit" className="pay-btn">
          Realizar Pago
        </button>
      </form>

      
      {paymentStatus && paymentStatus.success && (
        <div className="payment-status">
          <p>{paymentStatus.message}</p>
        </div>
      )}

     
      <button onClick={() => navigate("/cart")} className="back-btn">
        ⬅ Volver al carrito
      </button>
    </div>
  );
};

export default CheckoutScreen;
