import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './css/ProductArea.css';

const ProductArea = () => {
  const { categoryId } = useParams(); 
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${ENVIROMENT.URL_API}/api/products`;

        if (categoryId) {
          url = `${ENVIROMENT.URL_API}/api/products/${categoryId}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener productos');
        const data = await response.json();
        setProducts(data.data.products || []);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`); 
  };

  const handleViewAll = () => {
    navigate('/home'); 
  };

  return (
    <div className="product-area">
      

      <div className="product-list">
        {products.map((product) => (
          <div
            key={product._id}
            className={`product-card ${product.onSale ? 'on-sale' : ''}`} 
            onClick={() => handleProductClick(product._id)}
            style={{ cursor: 'pointer' }}
          >
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            {product.onSale ? (
              <div className="price-details">
                <span className="original-price">${product.price}</span>
                <span className="discount-price">${product.discountPrice}</span>
              </div>
            ) : (
              <span>${product.price}</span>
            )}
          </div>
        ))}
      </div>

      
      {location.pathname !== '/home' && (
        <div className="view-all-container">
          <button className="view-all-button" onClick={handleViewAll}>
            Ver todos los productos
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductArea;
