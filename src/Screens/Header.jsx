import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Header.css";

const Header = () => {
  const navigate = useNavigate();

 
  const token = sessionStorage.getItem("authorization_token");
  const username = sessionStorage.getItem("username"); 

  const handleLogout = () => {
    sessionStorage.removeItem("authorization_token");
    sessionStorage.removeItem("username");
    navigate("/login");  
    navigate("/login");  
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="header">
      
      <div className="logo">
        <Link to="/home">
          <img src="/logo2.png" alt="Click&Buy Logo" />
        </Link>
      </div>

     
      <nav className="nav-menu">
        <ul>
          <li><Link to="/home">Inicio</Link></li>
          <li><Link to="/cart">Carrito</Link></li>
          <li><Link to="/ofertas">Ofertas</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>
      </nav>

      
      <div className="auth">
        {token ? (
          <div className="user-info">
            <span className="username">Hola, {username}</span> 
            <button onClick={handleLogout} className="login-button">Cerrar sesión</button>
          </div>
        ) : (
          <button onClick={handleLogin} className="login-button">Iniciar sesión</button>
        )}
      </div>
    </header>
  );
};

export default Header;
