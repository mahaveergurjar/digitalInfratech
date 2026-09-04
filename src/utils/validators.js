export const required = (value) => (value ? null : 'Required');
export const minLength = (len) => (value) => (value && value.length >= len ? null : `Minimum ${len} characters`);
