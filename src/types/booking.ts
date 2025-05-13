export interface BookingData {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    profilePic?: string;
  };
  tutor: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    profilePic?: string;
  };
  subject: string;
  startDate: string;
  endDate: string;
  daysOfWeek: string[];
  timeSlot: string;
  monthlyFee: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BookingsState {
  active: BookingData[];
  completed: BookingData[];
  cancelled: BookingData[];
  total: number;
}

export interface BookingsResponse {
  success: boolean;
  data: BookingsState;
  message?: string;
}

export interface ExtendBookingRequest {
  months: number;
}