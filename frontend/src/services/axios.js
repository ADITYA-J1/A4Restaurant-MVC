import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
instance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error);
        
        if (error.response) {
            const message = error.response.data?.message || error.message;
            switch (error.response.status) {
                case 401:
                    enqueueSnackbar('Please login to continue: ' + message, { variant: 'error' });
                    break;
                case 403:
                    enqueueSnackbar('Access denied: ' + message, { variant: 'error' });
                    break;
                case 404:
                    enqueueSnackbar('Resource not found: ' + message, { variant: 'error' });
                    break;
                case 500:
                    enqueueSnackbar('Server error: ' + message, { variant: 'error' });
                    break;
                default:
                    enqueueSnackbar(message || 'An error occurred', { variant: 'error' });
            }
        } else if (error.request) {
            enqueueSnackbar('No response from server. Please check your connection.', { variant: 'error' });
        } else {
            enqueueSnackbar('Error setting up request: ' + error.message, { variant: 'error' });
        }
        return Promise.reject(error);
    }
);

// API endpoints
export const endpoints = {
    auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        logout: '/api/auth/logout'
    },
    menu: {
        items: '/api/menu-items',
        categories: '/api/menu-items/categories'
    },
    orders: {
        list: '/api/orders',
        create: '/api/orders',
        details: (id) => `/api/orders/${id}`,
        status: (id) => `/api/orders/${id}/status`
    },
    tables: {
        list: '/api/tables',
        available: '/api/tables/available',
        status: (id) => `/api/tables/${id}/status`
    },
    // Menu
    menuItems: '/menu-items',
    
    // Orders
    activeOrders: '/orders/active',
    orderStatus: (id) => `/orders/${id}/status`,
    
    // Tables
    tableReservations: '/tables/reservations',
    
    // Queue
    queue: '/queue',
    queuePosition: (id) => `/queue/${id}/position`,
    
    // Feedback
    feedback: '/feedbacks',
    
    // Bills
    bills: '/bills',
    pendingPayments: '/orders/pending-payment',
    processPayment: (id) => `/bills/${id}/process`
};

export default instance; 