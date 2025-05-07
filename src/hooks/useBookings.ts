import { useState } from 'react';
import { BookingService } from '@/services/bookingService';
import { Booking } from '@/types/booking';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Booking {
  id: string;
  tutorId: string;
  studentId: string;
  subject: string;
  monthlyFee: number;
  daysOfWeek: string[];
  timeSlot: string; // Added timeSlot property
  startDate: string;
  endDate: string;
  status: string;
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBookings = async (type: 'upcoming' | 'past') => {
    if (!user) {
      toast.error('You must be logged in to view bookings');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await BookingService.fetchBookings(type);
      setBookings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: {
    tuitionRequestId: string;
    date: string;
    timeSlot: string;
    notes?: string;
  }) => {
    if (!user) {
      toast.error('You must be logged in to create a booking');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const booking = await BookingService.createBooking(bookingData);
      setBookings(prev => [...prev, booking]);
      toast.success('Booking created successfully');
      return booking;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create booking';
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: 'completed' | 'cancelled'
  ) => {
    if (!user) {
      toast.error('You must be logged in to update booking status');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedBooking = await BookingService.updateBookingStatus(bookingId, status);
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId ? updatedBooking : booking
        )
      );
      toast.success(`Booking marked as ${status}`);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to update booking status`;
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const rescheduleBooking = async (
    bookingId: string,
    newDate: string,
    newTimeSlot: string
  ) => {
    if (!user) {
      toast.error('You must be logged in to reschedule a booking');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedBooking = await BookingService.rescheduleBooking(
        bookingId,
        newDate,
        newTimeSlot
      );
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId ? updatedBooking : booking
        )
      );
      toast.success('Booking rescheduled successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reschedule booking';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBookingStatus,
    rescheduleBooking,
  };
};