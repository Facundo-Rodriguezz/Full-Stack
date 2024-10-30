import React, { createContext, useContext, useState } from 'react';
import { redirect } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
interface Credencial {
  access: string
  refresh: string
}

interface AuthContextType {
  credencial: Credencial | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credencial, setCredencial] = useState<Credencial | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const login = async (username: string, password: string) => {

    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indica el tipo de contenido
        },
        body: JSON.stringify({ username, password }), // Convierte el objeto a una cadena JSON
      });
      if (!response.ok) {
        throw new Error('Error en la solicitud de inicio de sesión');
      }

      const data = await response.json(); // Procesa la respuesta como JSON
      setCredencial(data);
      const token = data.access.split('.')[1]; // Extraigo el nombre del jwt
      const tokenDecoded = JSON.parse(atob(token)); // Decodifico el token
      setUser({
        id: tokenDecoded.user_id,
        name: tokenDecoded.username,
        email: tokenDecoded.email,
        role: tokenDecoded.role,
      });
      redirect('/dashboard');
      console.log('Login exitoso:', data);
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
    }
  };




  const logout = () => {
    setCredencial(null);
  };

  return (
    <AuthContext.Provider
      value={{
        credencial,
        user,
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
