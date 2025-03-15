import React, { useContext, useEffect } from 'react'
import { useForm } from '../hooks/useForm'
import { useApiRequest } from '../hooks/useApiRequest'
import ENVIROMENT from '../config/enviroment'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import './css/LoginScreen.css'  // Importa el archivo CSS

const LoginScreen = () => {
	const { login } = useContext(AuthContext)
	const initialFormState = {
		email: '',
		password: ''
	}

	const { formState, handleChangeInput } = useForm(initialFormState)
	const { responseApiState, postRequest } = useApiRequest(ENVIROMENT.URL_API + '/api/auth/login')
	const navigate = useNavigate() // Hook para redirección

    useEffect(() => {
        // Verificar si la respuesta de la API contiene el token
        if (responseApiState.data && responseApiState.data.data.authorization_token) {
            login(responseApiState.data.data.authorization_token)  // Realizamos el login
            navigate('/home')  // Redirigimos a la página principal
        }
    }, [responseApiState, login, navigate]) // Se ejecuta cada vez que cambia responseApiState

    const handleSubmitForm = async (e) => {
        e.preventDefault()
        await postRequest(formState)  // Esperamos que la solicitud se complete
    }

	return (
		<div className="login-container">
			<h1 className="login-title">Inicia sesión en nuestra página</h1>
			<form className="login-form" onSubmit={handleSubmitForm}>
				<div className="input-container">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						placeholder="joedoe@mail.com"
						value={formState.email}
						onChange={handleChangeInput}
					/>
				</div>
				<div className="input-container">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="********"
						value={formState.password}
						onChange={handleChangeInput}
					/>
				</div>
				{responseApiState.error && <span className="error-message">{responseApiState.error}</span>}
				{
					responseApiState.loading
						? <span className="loading-message">Cargando</span>
						: <button className="submit-button">Iniciar sesión</button>
				}
				<div className="links">
					<Link to="/reset-password" className="reset-password-link">Olvidé mi contraseña</Link>
				</div>
			</form>
		</div>
	)
}

export default LoginScreen
