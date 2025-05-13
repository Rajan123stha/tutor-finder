
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Search, Clock, Check, X, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for the student dashboard

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">Here's an overview of your tutoring activities</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Find a Tutor</CardTitle>
            <CardDescription>
              Search for qualified tutors in your area
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <Search className="h-12 w-12 text-primary opacity-80" />
          </CardContent>
          <CardFooter>
            <Link to="/tutors">
              <Button className="w-full">Browse Tutors</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Request Tuition</CardTitle>
            <CardDescription>
              Create a new tuition request
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <UserPlus className="h-12 w-12 text-primary opacity-80" />
          </CardContent>
          <CardFooter>
            <Link to="/request-tuition">
              <Button className="w-full">Create Request</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">My Bookings</CardTitle>
            <CardDescription>
              View your current and upcoming sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <Calendar className="h-12 w-12 text-primary opacity-80" />
          </CardContent>
          <CardFooter>
            <Link to="/bookings">
              <Button className="w-full">View Bookings</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Recent Tuition Requests</CardTitle>
            <CardDescription>
              Your most recent tuition requests and their statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{request.subject}</p>
                    <p className="text-sm text-muted-foreground">{request.tutorName}</p>
                  </div>
                  <div className="flex items-center">
                    {request.status === 'pending' && (
                      <span className="flex items-center text-amber-600">
                        <Clock className="mr-1 h-4 w-4" />
                        <span className="text-xs">Pending</span>
                      </span>
                    )}
                    {request.status === 'accepted' && (
                      <span className="flex items-center text-green-600">
                        <Check className="mr-1 h-4 w-4" />
                        <span className="text-xs">Accepted</span>
                      </span>
                    )}
                    {request.status === 'rejected' && (
                      <span className="flex items-center text-red-600">
                        <X className="mr-1 h-4 w-4" />
                        <span className="text-xs">Rejected</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Requests</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Upcoming Sessions</CardTitle>
            <CardDescription>
              Your scheduled tutoring sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBookings.length > 0 ? (
                mockBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{booking.subject}</p>
                      <p className="text-sm text-muted-foreground">{booking.tutorName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{booking.nextSession}</p>
                      <p className="text-xs text-muted-foreground text-right">
                        {booking.remainingSessions} sessions remaining
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No upcoming sessions</p>
                  <Link to="/tutors">
                    <Button variant="link">Find a tutor</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/bookings">
              <Button variant="outline" className="w-full">Manage Bookings</Button>
            </Link>
          </CardFooter>
        </Card>
      </div> */}
    </div>
  );
};

export default StudentDashboard;
