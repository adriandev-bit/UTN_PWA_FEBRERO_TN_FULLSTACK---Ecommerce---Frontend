import React from 'react'
import { useForm } from '../hooks/useForm'
import { useApiRequest } from '../hooks/useApiRequest'
import ENVIROMENT from '../config/enviroment'
import { Link } from 'react-router-dom'
import './css/ResetPasswordScreen.css' // Asegúrate de importar el archivo CSS

const ResetPasswordScreen = () => {
	const initialFormState = {
		email: ''
	}

	const { formState, handleChangeInput } = useForm(initialFormState)
	const { responseApiState, postRequest } = useApiRequest(ENVIROMENT.URL_API + '/api/auth/reset-password')

	const handleSubmitForm = async (e) => {
		e.preventDefault()
		await postRequest(formState)
	}

	return (
		<div className="reset-password-container">
			<h1 className="title">Recupera tu contraseña</h1>
			<form className="reset-form" onSubmit={handleSubmitForm}>
				<div className="input-container">
					<label htmlFor="email">Email con el que te registraste</label>
					<input
						type="email"
						id="email"
						name="email"
						placeholder="email"
						value={formState.email}
						onChange={handleChangeInput}
					/>
				</div>

				{responseApiState.error && <span className="error">{responseApiState.error}</span>}
				{
					responseApiState.loading
						? <span className="loading">Cargando</span>
						: (
							responseApiState.data
								? <span className="success">Se te envió un mail con los pasos a seguir</span>
								: <button className="submit-button">Restablecer contraseña</button>
						)
				}

				<div className="links">
					<Link to={'/login'} className="link">Ya tengo cuenta</Link>
					<Link to={'/register'} className="link">Aún no tengo cuenta</Link>
				</div>
			</form>
		</div>
	)
}

export default ResetPasswordScreen
