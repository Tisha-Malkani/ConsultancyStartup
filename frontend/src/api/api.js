import axios from 'axios';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api' 
});

// Interceptor to attach token
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// General endpoints
export const createBooking = (bookingData) => API.post('/book', bookingData);
export const fetchCaseStudies = () => API.get('/case-studies');
export const fetchCaseStudyById = (id) => API.get(`/case-studies/${id}`);
export const calculateESG = (esgData) => API.post('/esg', esgData);
export const fetchBlogs = () => API.get('/blogs');
export const fetchBlogById = (id) => API.get(`/blogs/${id}`);
export const fetchAnalytics = () => API.get('/analytics');
export const fetchMyEngagement = () => API.get('/engagements/my');
export const fetchAdminOverview = () => API.get('/admin/overview');
export const createEngagement = (engagementData) => API.post('/admin/engagements', engagementData);
export const updateEngagement = (id, engagementData) => API.put(`/admin/engagements/${id}`, engagementData);

// Auth endpoints
export const loginUser = (authData) => API.post('/auth/login', authData);
export const registerUser = (authData) => API.post('/auth/register', authData);
export const getMe = () => API.get('/auth/me');
