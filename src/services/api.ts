import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3333',
  // baseURL: 'http://192.168.0.20:3333',
  // baseURL: 'http://10.0.2.2:3333',
  baseURL: 'https://barbers-api.popolin.com.br',
});

export default api;
