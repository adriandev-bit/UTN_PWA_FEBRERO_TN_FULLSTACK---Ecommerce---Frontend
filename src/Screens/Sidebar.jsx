import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/Sidebar.css";
import ENVIROMENT from '../config/enviroment';

const Sidebar = ({ setCategoryId }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = sessionStorage.getItem("authorization_token");
        if (!token) {
          setError("No hay un token de autenticación");
          return;
        }

        const response = await fetch(`${ENVIROMENT.URL_API}/api/categories`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener las categorías");
        }

        const data = await response.json();
        setCategories(data.data.categories || []);

        
        if (!location.pathname.includes("/categoria/")) {
          setSelectedCategoryId(null);
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setError(error.message);
      }
    };

    fetchCategories();
  }, [location.pathname]);

  const handleCategorySelect = (categoryId) => {
    setCategoryId(categoryId);
    setSelectedCategoryId(categoryId);
    navigate(`/categoria/${categoryId}`);
  };

  return (
    <aside className="sidebar">
      <h2>Categorías</h2>
      {error && <p className="error-message">{error}</p>}

      <ul className="category-list">
        {categories.length > 0 ? (
          categories.map((category) => (
            <li key={category._id}>
              <button
                className={`category-button ${selectedCategoryId === category._id ? "active" : ""}`}
                onClick={() => handleCategorySelect(category._id)}
                aria-label={`Seleccionar categoría ${category.name}`}
              >
                {category.name}
              </button>
            </li>
          ))
        ) : (
          <p className="no-categories">No hay categorías disponibles</p>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
