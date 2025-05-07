import axios from './axios';

export const requestAPI = {
  // Student request methods
  createRequest: (data) => axios.post('/requests', data),
  getStudentHistory: () => axios.get('/requests/student'),
  getRequestDetails: (id) => axios.get(`/requests/${id}`),
  
  // Booking methods
  getStudentBookings: () => axios.get('/bookings/student'),
  getTutorBookings: () => axios.get('/bookings/tutor'),
  getBookingDetails: (id) => axios.get(`/bookings/${id}`),
  extendBooking: (bookingId, months) => axios.post(`/bookings/${bookingId}/extend`, { months }),
  updateBookingStatus: (bookingId, status) => axios.patch(`/bookings/${bookingId}/status`, { status }),
};