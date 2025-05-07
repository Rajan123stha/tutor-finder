import axios from 'axios';

// Type Definitions
export interface TutorProfileData {
  subjects: string[];
  experience: number;
  availability: string;
  monthlyRate: number;
  education: string[];
  about: string;
  rating?: number;
  numReviews?: number;
}

export interface TuitionRequestData {
  subject: string;
  gradeLevel: string;
  preferredDays: string[];
  preferredTime: string;
  duration: number;
  startDate: Date;
  notes?: string;
}

// Error handling helper function
const handleApiError = (error: any) => {
  if (error.response) {
    console.error('API Error:', error.response.data);
    throw error.response.data;
  }
  throw error;
};

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: async (data: any) => {
    return await api.post('/auth/register', data);
  },
  login: async (data: any) => {
    return await api.post('/auth/login', data);
  },
};

// User API functions
export const userAPI = {
  getMe: async () => {
    return await api.get('/users/me');
  },
  updateProfile: async (data: any) => {
    return await api.put('/users/update', data);
  },
};

// Tutor API functions
export const tutorAPI = {
  getAllTutors: async (params?: any) => {
    return await api.get('/tutors', { params });
  },
  getTutor: async (id: string) => {
    return await api.get(`/tutors/${id}`);
  },
  updateTutorProfile: async (profileData: Partial<TutorProfileData>) => {
    try {
      const response = await api.put('/tutors/profile', profileData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  getTutorProfile: async () => {
    try {
      const response = await api.get('/tutors/profile');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  updateProfilePicture: async (formData: FormData) => {
    try {
      const response = await api.put('/tutors/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  getActiveStudents: async () => {
    return await api.get('/tutors/students/active');
  },
  getIncomingRequests: async () => {
    return await api.get('/tutors/requests/incoming');
  },
};

// Request API functions
export const requestAPI = {
  createRequest: async (data: any) => {
    return await api.post('/requests', data);
  },
  getRequests: async (params?: any) => {
    return await api.get('/requests', { params });
  },
  getStudentHistory: async () => {
    return await api.get('/requests/history');
  },
  acceptRequest: async (id: string) => {
    return await api.put(`/requests/${id}/accept`);
  },
  rejectRequest: async (id: string) => {
    return await api.put(`/requests/${id}/reject`);
  },
  cancelBooking: async (id: string) => {
    return await api.put(`/requests/bookings/${id}/cancel`);
  },
  extendBooking: async (data: any) => {
    return await api.post('/requests/bookings/extend', data);
  },
  createTuitionRequest: async (tutorId: string, requestData: TuitionRequestData) => {
    try {
      const response = await api.post(`/requests/${tutorId}`, requestData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  getStudentRequests: async () => {
    try {
      const response = await api.get('/requests/student');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  getTutorRequests: async () => {
    try {
      const response = await api.get('/requests/tutor');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  updateRequestStatus: async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const response = await api.put(`/requests/${requestId}/status`, { status });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};

// Admin API functions
export const adminAPI = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  getAllRequests: async () => {
    try {
      const response = await api.get('/admin/requests');
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  toggleBlockUser: async (userId: string) => {
    try {
      const response = await api.put(`/admin/users/${userId}/block`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  getStatistics: async () => {
    try {
      const response = await api.get('/admin/statistics');
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};
