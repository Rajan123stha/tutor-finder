export interface TuitionRequest {
  _id: string;
  student: string;
  tutor: string;
  tutorName: string;
  subject: string;
  gradeLevel: string;
  budget: number;
  preferredTime: string;
  preferredDays: string[];
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  request: string;
  student: string;
  tutor: string;
  tutorName: string;
  subject: string;
  startDate: string;
  endDate: string;
  daysOfWeek: string[];
  timeSlot: string;
  mode: 'online' | 'in-person';
  monthlyFee: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ExtendBookingRequest {
  months: number;
}