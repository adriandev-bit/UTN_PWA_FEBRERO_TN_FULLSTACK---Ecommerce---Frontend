import React, { useState } from 'react';
import ENVIROMENT from '../config/enviroment';

export const RegisterScreen = () => {
  const formInitialState = {
    username: '',
    email: '',
    password: ''
  }
  const [formState, setFormState] = useState(formInitialState)
  const handleChangeInput = (event) => {
    const { name, value } = event.target
    setFormState(
      (prevFormState) => {
        return { ...prevFormState, [name]: value }
      }
    )
  }

  const handleSubmitForm = async (event) => {
    event.preventDefault()

    const response = await fetch(ENVIROMENT.URL_API + '/api/auth/register', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(formState)
    })
    const data = await response.json();

    if (data.ok) {
      alert("Usuario registrado")
    } else {
      if (data.status == 400) {
        alert(data.message);
      } else {
        alert('Error, inténtalo más tarde!')
      }
    }

  }

  return (
    <div>

      <h1>Registrate en nuestra app</h1>
      <form onSubmit={handleSubmitForm}>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text"
            placeholder="Joe Doe"
            id="username"
            name="username"
            value={formState.username}
            onChange={handleChangeInput} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email"
            placeholder="joedoe@gmail.com"
            id="email"
            name="email"
            value={formState.email}
            onChange={handleChangeInput} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password"
            placeholder="Example_password123"
            id="password"
            name="password"
            value={formState.password}
            onChange={handleChangeInput} />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterScreen;



// rafce