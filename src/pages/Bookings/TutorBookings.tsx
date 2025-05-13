import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { requestAPI, tutorAPI } from "@/api";
import { toast } from "sonner";
import { Loader2, Calendar, Clock, MapPin, Phone, Mail } from "lucide-react";

const TutorBookings = () => {
  const [bookings, setBookings] = useState({
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
      console.log("Fetching tutor bookings...");

      // Try the tutorAPI endpoint first
      try {
        const response = await tutorAPI.getTutorBookings();
        console.log("Tutor bookings from tutorAPI:", response?.data);

        if (response?.data?.data) {
          setBookings(response.data.data);
          return;
        }
      } catch (error) {
        console.log("Failed to fetch from tutorAPI, trying requestAPI...");
      }

      // Fallback to requestAPI
      const bookingsResponse = await requestAPI.getTutorBookings();
      console.log("Tutor bookings from requestAPI:", bookingsResponse?.data);

      if (bookingsResponse?.data?.data) {
        setBookings(bookingsResponse.data.data);
      } else {
        console.log("No bookings found in response");
        setBookings({
          active: [],
          completed: [],
          cancelled: [],
          total: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const renderBooking = (booking) => {
    return (
      <Card key={booking._id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{booking.subject}</CardTitle>
              <CardDescription>
                {booking.studentName ||
                  (booking.student && booking.student.name) ||
                  "Unknown Student"}
              </CardDescription>
            </div>
            <Badge
              variant={booking.status === "active" ? "default" : "outline"}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  booking.studentProfilePic ||
                  (booking.student && booking.student.profilePic)
                }
              />
              <AvatarFallback>
                {(
                  booking.studentName ||
                  (booking.student && booking.student.name) ||
                  "ST"
                )
                  .substring(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {booking.studentEmail ||
                  (booking.student && booking.student.email) ||
                  "No email provided"}
              </p>
              <p className="text-xs text-muted-foreground">
                {booking.studentPhone ||
                  (booking.student && booking.student.phoneNumber) ||
                  "No phone number"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {new Date(booking.startDate).toLocaleDateString()} -{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{booking.timeSlot || "Not specified"}</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Schedule:</p>
            <div className="flex flex-wrap gap-1">
              {booking.daysOfWeek ? (
                booking.daysOfWeek.map((day) => (
                  <span
                    key={day}
                    className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                  >
                    {day}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">
                  No schedule specified
                </span>
              )}
            </div>
          </div>

          <div className="text-sm">
            <strong>Fee:</strong> ₹{booking.monthlyFee || 0}/month
          </div>
        </CardContent>

        <CardFooter>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </CardFooter>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Bookings</h1>
        <p className="text-muted-foreground">Manage your student bookings</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active ({bookings.active ? bookings.active.length : 0})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({bookings.completed ? bookings.completed.length : 0})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({bookings.cancelled ? bookings.cancelled.length : 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {!bookings.active || bookings.active.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  You don't have any active bookings
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {bookings.active.map(renderBooking)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {!bookings.completed || bookings.completed.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  You don't have any completed bookings
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {bookings.completed.map(renderBooking)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {!bookings.cancelled || bookings.cancelled.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  You don't have any cancelled bookings
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {bookings.cancelled.map(renderBooking)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TutorBookings;
