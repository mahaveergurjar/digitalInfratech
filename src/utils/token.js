export const getToken = () => window.localStorage.getItem('harghar-token');
export const setToken = (token) => window.localStorage.setItem('harghar-token', token);
export const clearToken = () => window.localStorage.removeItem('harghar-token');
