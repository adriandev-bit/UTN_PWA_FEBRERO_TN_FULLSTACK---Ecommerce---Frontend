import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  // Inicializa el estado de autenticación verificando si hay un token
  const isAuthenticatedInitialState = !!sessionStorage.getItem('authorization_token');
  const [isAuthenticatedState, setIsAutheticatedState] = useState(isAuthenticatedInitialState);

  useEffect(() => {
    // Si el token está presente en sessionStorage, se marca al usuario como autenticado
    const token = sessionStorage.getItem('authorization_token');
    if (token) {
      setIsAutheticatedState(true);
    } else {
      setIsAutheticatedState(false);
    }
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // Función de logout
  const logout = () => {
    sessionStorage.removeItem('authorization_token');  // Elimina el token
    setIsAutheticatedState(false);  // Cambia el estado de autenticación
  };

  // Función de login
  const login = (authorization_token) => {
    sessionStorage.setItem('authorization_token', authorization_token);  // Guarda el token
    setIsAutheticatedState(true);  // Cambia el estado de autenticación
  };

  return (
    <AuthContext.Provider value={{ isAuthenticatedState, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
