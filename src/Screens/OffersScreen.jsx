import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShoppingBag, FaPercent } from "react-icons/fa";
import "./css/OffersScreen.css";
import ENVIROMENT from '../config/enviroment';

const OffersScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ENVIROMENT.URL_API}/api/products`);
      if (!response.ok) throw new Error("Error al obtener productos");

      const data = await response.json();
      if (data.success && Array.isArray(data.data.products)) {
        const productsOnSale = data.data.products.filter((product) => product.onSale);
        setProducts(productsOnSale);
      } else {
        throw new Error("Los datos de productos no están en el formato esperado");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error al obtener los productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = (originalPrice, discountPrice) => {
    const discount = ((originalPrice - discountPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`);
  };

  if (loading) {
    return (
      <div className="offers-screen">
        <div className="loading">
          <div className="loading-spinner">
            <FaShoppingBag className="loading-icon" />
            <p>Cargando ofertas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="offers-screen">
        <div className="empty-offers">
          <FaShoppingBag />
          <h3>¡Ups! Algo salió mal</h3>
          <p>{error}</p>
          <button onClick={() => navigate("/home")} className="continue-shopping-btn">
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="offers-screen">
      <h2>Ofertas Especiales</h2>
      {products.length === 0 ? (
        <div className="empty-offers">
          <FaPercent />
          <h3>No hay ofertas disponibles</h3>
          <p>En este momento no hay productos en oferta. ¡Vuelve pronto!</p>
          <button onClick={() => navigate("/home")} className="continue-shopping-btn">
            Seguir comprando
          </button>
        </div>
      ) : (
        <div className="offers-list">
          <ul>
            {products.map((product) => {
              const discountPercentage = calculateDiscount(product.price, product.discountPrice);
              return (
                <li key={product._id} className="offer-item" onClick={() => handleProductClick(product._id)}>
                  <span className="discount-badge">-{discountPercentage}%</span>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="offer-img"
                  />
                  <div className="offer-details">
                    <h3>{product.name}</h3>
                    <div className="price-details">
                      <p className="original-price">${product.price}</p>
                      <p className="discount-price">${product.discountPrice}</p>
                    </div>
                    <p className="savings">¡Ahorras ${(product.price - product.discountPrice).toFixed(2)}!</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <button onClick={() => navigate("/home")} className="back-btn">
        <FaArrowLeft /> Volver a la tienda
      </button>
    </div>
  );
};

export default OffersScreen;
