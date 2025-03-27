import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/ProductDetail.css';

const ProductDetail = () => {
  const { productId } = useParams(); 
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1); 
  const navigate = useNavigate();

  useEffect(() => {
    
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

  if (!product) return <p>Cargando detalles del producto...</p>;

  return (
    <div className="product-detail">
      
      <button className="back-btn" onClick={() => navigate(`/home`)}>⬅ Volver</button>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} className="product-image" />
      <p>{product.description}</p>

     
      {product.onSale ? (
        <div className="product-price">
          <span className="original-price">${product.price}</span> 
          <span className="discount-price">${product.discountPrice}</span> 
        </div>
      ) : (
        <span className="product-price">${product.price}</span>  
      )}

      <div className="add-to-cart-container">
        <div className="quantity-selector">
          <button 
            className="quantity-btn" 
            onClick={() => setQuantity(prev => prev > 1 ? prev - 1 : prev)}
          >
            -
          </button>
          <span>{quantity}</span>
          <button 
            className="quantity-btn" 
            onClick={() => setQuantity(prev => prev + 1)}
          >
            +
          </button>
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>Agregar al carrito</button>
      </div>

      <h3>Reseñas</h3>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} className="review-card">
            <p><strong>{review.reviewer.username}</strong>: {review.content}</p>
            <span>⭐ {review.rating}/5</span>
          </div>
        ))
      ) : (
        <p>No hay reseñas para este producto.</p>
      )}
    </div>
  );
};

export default ProductDetail;
