import api from './api';
export const fetchServices = () => api.get('/services');
export const createService = (payload) => api.post('/services', payload);
