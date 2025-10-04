import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.setupAxiosInterceptors();
  }

  setupAxiosInterceptors() {
    // Request interceptor to add auth token
    axios.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.removeToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async register(userData) {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data.data;
  }

  async login(credentials) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data.data;
  }

  async logout() {
    await axios.post(`${API_BASE_URL}/auth/logout`);
  }

  async getCurrentUser() {
    const response = await axios.get(`${API_BASE_URL}/auth/me`);
    return response.data.data;
  }

  async updateProfile(profileData) {
    const response = await axios.put(`${API_BASE_URL}/auth/profile`, profileData);
    return response.data.data;
  }

  async changePassword(passwordData) {
    const response = await axios.put(`${API_BASE_URL}/auth/change-password`, passwordData);
    return response.data;
  }
}

export const authService = new AuthService();