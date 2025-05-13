
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StudentProfile from './StudentProfile';
import TutorProfile from './TutorProfile';
import BookingHistory from '@/components/profile/BookingHistory';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and view your bookings
        </p>
      </div>

      {user.role === 'student' ? <StudentProfile /> : <TutorProfile />}
      
      {/* {user.role === 'student' && (
        <div className="mt-6">
          <BookingHistory />
        </div>
      )} */}
    </div>
  );
};

export default Profile;
