import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/ProductDetail.css';
import ENVIROMENT from '../config/enviroment';
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft, FiStar } from 'react-icons/fi';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (productId) {
      fetchProductDetails();
      fetchReviews();
    } else {
      console.error('No se encontró el ID del producto');
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`${ENVIROMENT.URL_API}/api/products/product/${productId}`);
      if (!response.ok) throw new Error('Error al obtener detalles del producto');
      const data = await response.json();
      setProduct(data.data.product || null);
    } catch (error) {
      console.error('Error al obtener detalles del producto:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${ENVIROMENT.URL_API}/api/reviews/${productId}`);
      if (!response.ok) throw new Error('Error al obtener reseñas');
      const data = await response.json();
      setReviews(data.data || []);
    } catch (error) {
      console.error('Error al obtener reseñas:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      const token = sessionStorage.getItem("authorization_token");

      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch(`${ENVIROMENT.URL_API}/api/cart/${productId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: productId,
          quantity: quantity,
          price: product.onSale ? product.discountPrice : product.price,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar producto al carrito");
      }

      navigate("/cart");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="product-detail">
          <p>Cargando detalles del producto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-info-section">
          <button className="back-button" onClick={() => navigate('/home')}>
            <FiArrowLeft /> Volver
          </button>
          
          <h3>{product.name}</h3>
          <p className="description">{product.description}</p>

          <div className="price-section">
            {product.onSale ? (
              <>
                <div className="price">
                  ${product.discountPrice}
                  <span className="original-price">${product.price}</span>
                  <span className="discount-label">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </span>
                </div>
              </>
            ) : (
              <div className="price">${product.price}</div>
            )}
          </div>

          <div className="cart-actions">
            <div className="quantity-controls">
              <button className="quantity-btn" onClick={() => handleQuantityChange(-1)}>
                <FiMinus />
              </button>
              <span className="cart-count">{quantity}</span>
              <button className="quantity-btn" onClick={() => handleQuantityChange(1)}>
                <FiPlus />
              </button>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <FiShoppingCart /> Agregar al carrito
            </button>
          </div>

          {reviews.length > 0 && (
            <div className="reviews-section">
              <h3>Opiniones del producto</h3>
              {reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-avatar">
                      {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="review-info">
                      <div className="reviewer-name">{review.userName || 'Usuario'}</div>
                      <div className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        fill={i < review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <p className="review-content">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
