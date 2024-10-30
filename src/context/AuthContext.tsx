import React, { createContext, useContext, useState } from 'react';
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
  credencial: Credencial | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credencial, setCredencial] = useState<Credencial | null>(null);
  const navigate = useNavigate(); // Usa useNavigate en lugar de redirect

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
      setCredencial(data);
      navigate('/dashboard'); // Navega a la página de dashboard después de iniciar sesión
      console.log('Login exitoso:', data);
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
    }
  };

  const logout = () => {
    setCredencial(null);
    navigate('/login'); // Navega a la página de inicio de sesión al cerrar sesión
  };

  return (
    <AuthContext.Provider
      value={{
        credencial,
        isAuthenticated: !!credencial,
        login,
        logout,
      }}
    >
      {children}
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
