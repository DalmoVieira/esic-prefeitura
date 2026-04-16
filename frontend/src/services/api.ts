export const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001/api'
  : '/api';

export const UPLOADS_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001/uploads'
  : '/uploads';

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`Erro do servidor (${response.status}). O serviço pode estar indisponível.`);
      }
      throw new Error('A resposta do servidor não é um JSON válido. Verifique a configuração da API.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }

    return data;
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  },

  get(endpoint: string) {
    return this.request(endpoint, {
      method: 'GET',
    });
  },

  async upload(endpoint: string, formData: FormData) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.status === 204) return null;

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erro no upload');
    return data;
  },
};
