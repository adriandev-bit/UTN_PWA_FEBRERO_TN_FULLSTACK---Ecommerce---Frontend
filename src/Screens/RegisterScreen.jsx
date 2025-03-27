import React, { useState } from 'react';
import ENVIROMENT from '../config/enviroment';
import './css/RegisterScreen.css';

export const RegisterScreen = () => {
  const formInitialState = {
    username: '',
    email: '',
    password: ''
  };

  const [formState, setFormState] = useState(formInitialState);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setFormState(prevFormState => ({ ...prevFormState, [name]: value }));
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    setSuccessMessage('');

    const response = await fetch(ENVIROMENT.URL_API + '/api/auth/register', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(formState)
    });

    const data = await response.json();

    if (data.ok) {
      setSuccessMessage('Registro exitoso. Hemos enviado un correo de verificación. Por favor, revisa tu bandeja de entrada.');
      setFormState(formInitialState);
    } else {
      setSuccessMessage(data.status === 400 ? data.message : 'Error, inténtalo más tarde!');
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Regístrate en nuestra app</h1>
      <form className="register-form" onSubmit={handleSubmitForm}>
        <div className="input-container">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Joe Doe"
            id="username"
            name="username"
            value={formState.username}
            onChange={handleChangeInput}
          />
        </div>
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="joedoe@gmail.com"
            id="email"
            name="email"
            value={formState.email}
            onChange={handleChangeInput}
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Example_password123"
            id="password"
            name="password"
            value={formState.password}
            onChange={handleChangeInput}
          />
        </div>
        <button className="submit-button" type="submit">Registrar</button>

       
        {successMessage && <p className="success-message">{successMessage}</p>}

        
        <div className="links">
          <p>¿Ya tienes cuenta? <a href="/login" className="login-link">Inicia sesión</a></p>
        </div>
      </form>
    </div>
  );
};

export default RegisterScreen;
