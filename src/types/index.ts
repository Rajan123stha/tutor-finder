// User role types
export type UserRole = 'tutor' | 'student' | 'admin';

// Base User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePic?: string;
  createdAt: string;
  phoneNumber?: string;
  address?: {
    city: string;
    area: string;
  };
  tutorProfile?: TutorProfileData;
}

// Enhanced TutorProfile Interface
export interface TutorProfileData {
  _id?: string;
  subjects: string[];
  experience: number;
  availability: string;
  monthlyRate: number;
  education: string[];
  about: string;
  rating?: number;
  numReviews?: number;
  profileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Registration Data Interface
export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phoneNumber?: string;
  address?: {
    city?: string;
    area?: string;
  };
  tutorProfile?: {
    subjects: string[];
    experience: number;
    availability: string;
    monthlyRate: number;
    education: string[];
    about: string;
  };
}

// Tuition Request Interface
export interface TuitionRequest {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  gradeLevel: string;
  preferredDays: string[];
  preferredTimes: string[];
  duration: number; // in months
  startDate: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Booking Interface
export interface Booking {
  id: string;
  requestId: string;
  studentId: string;
  tutorId: string;
  subject: string;
  startDate: string;
  endDate: string;
  daysOfWeek: string[];
  timeSlot: string;
  monthlyFee: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
