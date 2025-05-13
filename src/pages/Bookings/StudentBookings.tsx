import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requestAPI } from "@/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingData, BookingsState } from "@/types/booking";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

const StudentBookings = () => {
  const [bookings, setBookings] = useState<BookingsState>({
    active: [],
    completed: [],
    cancelled: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getStudentBookings();
      if (response?.data?.data) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const renderBookingCard = (booking: BookingData) => (
    <Card key={booking._id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{booking.subject}</CardTitle>
            <CardDescription>With {booking.tutor.name}</CardDescription>
          </div>
          <Badge
            variant={booking.status === "active" ? "default" : "secondary"}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(booking.startDate).toLocaleDateString()} -{" "}
              {new Date(booking.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{booking.timeSlot}</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Schedule:</p>
          <div className="flex flex-wrap gap-1">
            {booking.daysOfWeek.map((day) => (
              <span
                key={day}
                className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        <div className="text-sm font-medium">
          Fee: ₹{booking.monthlyFee}/month
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Bookings</h1>
        <p className="text-muted-foreground">Track your tuition bookings</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active ({bookings.active.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({bookings.completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({bookings.cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {bookings.active.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No active bookings</p>
                <Button className="mt-4" asChild>
                  <a href="/tutors">Find Tutors</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {bookings.active.map(renderBookingCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {bookings.completed.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No completed bookings</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {bookings.completed.map(renderBookingCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {bookings.cancelled.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No cancelled bookings</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {bookings.cancelled.map(renderBookingCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentBookings;
