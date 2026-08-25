import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    // Signup
    signup: (data) => api.post('/auth/signup', data),
    
    // Customer Login
    customerLogin: (data) => api.post('/auth/customer', data),
    
    // Admin Login
    adminLogin: (data) => api.post('/auth/admin', data),
    
    // Demo Login (for testing)
    demoLogin: () => api.post('/auth/demo')
};

export const verificationAPI = {
    generateAadhaarOTP: (aadhaarNumber, phoneNumber) => 
        api.post('/verification/aadhaar/generate-otp', { aadhaarNumber, phoneNumber }),
    verifyAadhaarOTP: (referenceId, otp) => 
        api.post('/verification/aadhaar/verify-otp', { referenceId, otp }),
    verifyPAN: (panNumber, name, dob) => 
        api.post('/verification/pan/verify', { panNumber, name, dob })
};

export const profileAPI = {
    getProfile: () => api.get('/profile/profile'),
    updateProfile: (data) => api.put('/profile/profile', data),
    updateName: (name) => api.put('/profile/name', { name }),
    updatePhone: (phone) => api.put('/profile/phone', { phone }),
    updateAddress: (address) => api.put('/profile/address', { address }),
    updateEmployment: (data) => api.put('/profile/employment', data)
};

export const applicationAPI = {
    submit: (data) => api.post('/application/submit', data),
    getHistory: () => api.get('/application/history')
};

export const adminAPI = {
    getApplications: () => api.get('/admin/applications'),
    getUsers: () => api.get('/admin/users'),
    reviewApplication: (id, data) => api.put('/admin/applications/' + id + '/review', data),
    getPendingCount: () => api.get('/admin/pending-count')
};

export default api;
