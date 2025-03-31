import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/OffersScreen.css";
import ENVIROMENT from '../config/enviroment'

const OffersScreen = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); 
    fetchProducts();
  }, []);

  
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${ENVIROMENT.URL_API}/api/products`);
      if (!response.ok) throw new Error("Error al obtener productos");

      const data = await response.json();
      console.log("Datos recibidos del backend:", data);

      if (data.success && Array.isArray(data.data.products)) {
        const productsOnSale = data.data.products.filter((product) => product.onSale);
        setProducts(productsOnSale);
      } else {
        console.error("Los datos de productos no están en el formato esperado:", data);
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  
  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`); 
  };

  return (
    <div className="offers-screen">
      <h2>🎉 Ofertas Especiales</h2>
      {products.length === 0 ? (
        <p>No hay productos en oferta en este momento.</p>
      ) : (
        <div className="offers-list">
          <ul>
            {products.map((product) => (
              <li key={product._id} className="offer-item" onClick={() => handleProductClick(product._id)}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="offer-img"
                  style={{ cursor: "pointer" }}
                />
                <div className="offer-details">
                  <h3>{product.name}</h3>
                  <div className="price-details">
                    <p className="original-price">${product.price}</p>
                    <p className="discount-price">${product.discountPrice}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => navigate("/home")} className="back-btn">
        ⬅ Volver a la tienda
      </button>
    </div>
  );
};

export default OffersScreen;
