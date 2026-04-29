import axios from 'axios';

/**
 * Default Axios instance for the project.
 * This can be used to set base URLs relative to the environment,
 * add common headers, and implement interceptors for auth/logging.
 */
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can add interceptors here later if needed:
// api.interceptors.request.use(config => { ... });
// api.interceptors.response.use(response => { ... }, error => { ... });

export const API_HEADERS = {
  'Content-Type': 'application/json',
};

export const API = {
  STATISTICS: '/api/statistics',
  SELLERS: '/api/sellers',
  STORES: '/api/stores',
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
  DELIVERY_PARTNERS: '/api/delivery-partners',
  REVIEWS: '/api/reviews',
};

export default api;
