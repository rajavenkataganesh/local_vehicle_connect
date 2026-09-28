import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lvc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  registerCustomer: async (data) => {
    const response = await api.post('/auth/register', { ...data, role: 'CUSTOMER' });
    return response.data;
  },
  registerDriver: async (data) => {
    const response = await api.post('/auth/register-driver', data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/auth/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // { url: '...' }
  },
};

// Vehicles endpoints
export const vehiclesApi = {
  search: async ({ type, lat, lng, available_only = true }) => {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.append('type', type);
    if (lat !== undefined && lat !== null) params.append('lat', lat);
    if (lng !== undefined && lng !== null) params.append('lng', lng);
    params.append('available_only', available_only);

    const response = await api.get(`/vehicles/search?${params.toString()}`);
    return response.data;
  },
  getMyVehicles: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/vehicles', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  },
  updateAvailability: async (id, availability_status) => {
    const response = await api.patch(`/vehicles/${id}/availability`, { availability_status });
    return response.data;
  },
  updateLocation: async (id, { current_latitude, current_longitude, location_sharing_enabled }) => {
    const response = await api.patch(`/vehicles/${id}/location`, {
      current_latitude,
      current_longitude,
      location_sharing_enabled,
    });
    return response.data;
  },
};

// Bookings endpoints
export const bookingsApi = {
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
  getCustomerBookings: async (status_filter = 'ALL') => {
    const response = await api.get(`/bookings/customer?status_filter=${status_filter}`);
    return response.data;
  },
  getDriverBookings: async (status_filter = 'ALL') => {
    const response = await api.get(`/bookings/driver?status_filter=${status_filter}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
  accept: async (id) => {
    const response = await api.patch(`/bookings/${id}/accept`);
    return response.data;
  },
  reject: async (id) => {
    const response = await api.patch(`/bookings/${id}/reject`);
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  },
  complete: async (id) => {
    const response = await api.patch(`/bookings/${id}/complete`);
    return response.data;
  },
};

// Reviews endpoints
export const reviewsApi = {
  create: async (data) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },
  getByVehicle: async (vehicleId) => {
    const response = await api.get(`/reviews/vehicle/${vehicleId}`);
    return response.data;
  },
};

export default api;
