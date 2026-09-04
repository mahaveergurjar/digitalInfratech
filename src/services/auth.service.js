import api from './api';
export const register = (payload) => api.post('/auth/register', payload);
export const login = (payload) => api.post('/auth/login', payload);
export const requestLoginOtp = (payload) => api.post('/auth/login/request-otp', payload);
export const verifyLoginOtp = (payload) => api.post('/auth/login/verify-otp', payload);
