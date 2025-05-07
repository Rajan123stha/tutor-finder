import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem("token");

    // If token exists, add to headers
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Error handling helper function
const handleApiError = (error) => {
  if (error.response) {
    console.error("API Error:", error.response.data);
    throw error.response.data;
  }
  throw error;
};

// Auth API functions
export const authAPI = {
  register: async (data) => {
    try {
      const response = await api.post("/auth/register", data);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  login: async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

// User API functions
export const userAPI = {
  getMe: async () => {
    try {
      const response = await api.get("/users/me");
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  updateProfile: async (data) => {
    try {
      const response = await api.put("/users/update", data);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

// Tutor API functions
export const tutorAPI = {
  getAllTutors: async (params) => {
    try {
      const response = await api.get("/tutors", { params });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  getTutor: async (id) => {
    try {
      const response = await api.get(`/tutors/${id}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  updateTutorProfile: async (profileData) => {
    try {
      const response = await api.put("/tutors/profile", profileData);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  getActiveStudents: async () => {
    try {
      const response = await api.get("/tutors/students/active");
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  getTutorRequests: async () => {
    try {
      const response = await api.get("/tutors/requests/incoming");
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  updateRequestStatus: async (requestId, status) => {
    try {
      const response = await api.put(`/requests/${requestId}/status`, {
        status,
      });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

// Request API functions
export const requestAPI = {
  createRequest: async (data) => {
    try {
      console.log("Sending request data:", data);
      const response = await api.post("/requests", data);
      return response;
    } catch (error) {
      console.error("Request creation error:", error);
      handleApiError(error);
      throw error;
    }
  },

  getStudentHistory: async () => {
    try {
      const response = await api.get("/requests/history");
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  getTutorRequests: async () => {
    try {
      const response = await api.get("/requests/tutor");
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  updateRequestStatus: async (requestId, status) => {
    try {
      const response = await api.put(`/requests/${requestId}/status`, {
        status,
      });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

// Admin API functions
export const adminAPI = {
  getAllUsers: async () => {
    try {
      const response = await api.get("/admin/users");
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  getAllRequests: async () => {
    try {
      const response = await api.get("/admin/requests");
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  toggleBlockUser: async (userId) => {
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
      const response = await api.get("/admin/statistics");
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

// Export the api instance for direct use if needed
export { api };
