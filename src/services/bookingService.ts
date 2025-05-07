import { api } from '@/lib/axios';
import { Booking } from '@/types/booking';

export class BookingService {
  static async fetchBookings(type: 'upcoming' | 'past'): Promise<Booking[]> {
    const { data } = await api.get(`/bookings/${type}`);
    return data;
  }

  static async createBooking(bookingData: {
    tuitionRequestId: string;
    date: string;
    timeSlot: string;
    notes?: string;
  }): Promise<Booking> {
    const { data } = await api.post('/bookings', bookingData);
    return data;
  }

  static async updateBookingStatus(
    bookingId: string,
    status: 'completed' | 'cancelled'
  ): Promise<Booking> {
    const { data } = await api.patch(`/bookings/${bookingId}/status`, { status });
    return data;
  }

  static async rescheduleBooking(
    bookingId: string,
    newDate: string,
    newTimeSlot: string
  ): Promise<Booking> {
    const { data } = await api.patch(`/bookings/${bookingId}/reschedule`, {
      date: newDate,
      timeSlot: newTimeSlot,
    });
    return data;
  }

  static getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  static getStatusText(status: string): string {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }
}