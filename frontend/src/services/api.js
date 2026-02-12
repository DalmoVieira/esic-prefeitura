/**
 * Serviço de API
 * 
 * Centraliza todas as requisições HTTP para o backend
 * Configura o Axios com interceptors para incluir o token
 */

import axios from 'axios';

// Cria uma instância do Axios com a URL base da API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
});

/**
 * Interceptor de Requisição
 * 
 * Adiciona automaticamente o token JWT em todas as requisições
 * se o usuário estiver autenticado
 */
api.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage
    const token = localStorage.getItem('token');
    
    // Se existir token, adiciona no header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Resposta
 * 
 * Trata erros globalmente, especialmente erro 401 (não autorizado)
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se receber erro 401, o token pode estar expirado
    // Remove o token e redireciona para login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
