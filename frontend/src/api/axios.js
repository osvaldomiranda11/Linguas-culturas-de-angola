// #ByFAV - Configuração Axios para produção e ambiente local
import axios from 'axios';

// Detecta automaticamente o ambiente
const isLocal = window.location.hostname === 'localhost';

// 🔗 Define a base URL conforme o ambiente
const instance = axios.create({
  baseURL: isLocal
    ? 'http://localhost:4000/api' // ambiente local
    : 'https://linguas-culturas-de-angola.onrender.com/api', // produção (Render)
  headers: {
    'Content-Type': 'application/json'
  }
});

// 🔐 Interceptor de requisição (adiciona o token JWT)
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚫 Interceptor de resposta (tratamento de sessão expirada)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
