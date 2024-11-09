import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate en lugar de redirect

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
export interface Credencial {
  access: string;
  refresh: string;
}

interface AuthContextType {
  credencial?: Credencial;
  user?: User;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credencial, setCredencial] = useState<Credencial>();
  const [user, setUser] = useState<User>();
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const navigate = useNavigate(); // Usa useNavigate en lugar de redirect


  useEffect(() => {
    const token = localStorage.getItem("token")
    const refresh = localStorage.getItem("refresh")
    if (token && refresh) {
      const cred: Credencial = {access: token, refresh: refresh};
      setCredencial(cred);
      const tokenDecoded = JSON.parse(atob(token.split('.')[1])); 
      setUser({
        id: tokenDecoded.user_id,
        name: tokenDecoded.username,
        email: tokenDecoded.email,
        role: tokenDecoded.role,
      });
      setLoadingInitial(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud de inicio de sesión');
      }

      const data = await response.json();
      localStorage.setItem("token", data.access)
      localStorage.setItem("refresh", data.refresh)
      setCredencial(data);
      navigate('/dashboard/'); // Navega a la página de dashboard después de iniciar sesión
      const token_split = data.access.split('.')[1]; // Extraigo el nombre del jwt
      const tokenDecoded = JSON.parse(atob(token_split)); // Decodifico el token
      setUser({
        id: tokenDecoded.user_id,
        name: tokenDecoded.username,
        email: tokenDecoded.email,
        role: tokenDecoded.role,
      });
      
      console.log('Login exitoso:', data);
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
    }
    setLoadingInitial(false);
  };

  const logout = () => {
    setCredencial(undefined);
    navigate('/login'); // Navega a la página de inicio de sesión al cerrar sesión
  };

  const memoedValue = useMemo(
    () => ({
      credencial,
      user,
      isAuthenticated: !!credencial,
      login,
      logout,
    }),
    [credencial, user]
  );


  return (
    <AuthContext.Provider
      value={memoedValue}
    >
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
