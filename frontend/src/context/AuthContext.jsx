/**
 * Context de Autenticação
 * 
 * Gerencia o estado de autenticação do usuário em toda a aplicação
 * Fornece funções de login, logout e registro
 */

import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

// Cria o contexto
const AuthContext = createContext({});

/**
 * Provider de Autenticação
 * 
 * Envolve a aplicação e fornece acesso ao estado de autenticação
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Ao carregar a aplicação, verifica se existe usuário no localStorage
   */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  /**
   * Função de Login
   * 
   * @param {string} email - Email do usuário
   * @param {string} senha - Senha do usuário
   * @returns {Promise} Retorna os dados do usuário ou erro
   */
  const login = async (email, senha) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, user } = response.data;

      // Salva o token e usuário no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Atualiza o estado
      setUser(user);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao fazer login';
      return { success: false, error: message };
    }
  };

  /**
   * Função de Registro
   * 
   * @param {Object} userData - Dados do usuário (nome, email, cpf, senha, tipo, telefone)
   * @returns {Promise} Retorna sucesso ou erro
   */
  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao registrar usuário';
      return { success: false, error: message };
    }
  };

  /**
   * Função de Logout
   * 
   * Remove o token e dados do usuário
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        register,
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personalizado para usar o contexto de autenticação
 * 
 * @returns {Object} Retorna o contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}

export default AuthContext;
