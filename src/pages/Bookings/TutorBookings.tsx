import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Calendar,
  Clock,
  GraduationCap,
  IndianRupee,
  User,
  MapPin,
  Phone,
} from "lucide-react";
import { tutorAPI } from "@/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const TutorBookings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeBookings, setActiveBookings] = useState([]);

  useEffect(() => {
    fetchActiveBookings();
  }, []);

  const fetchActiveBookings = async () => {
    try {
      setLoading(true);
      console.log("Fetching active bookings...");

      const response = await tutorAPI.getActiveStudents();
      console.log("Active bookings response:", response?.data);

      if (response?.data?.data?.activeStudents) {
        setActiveBookings(response.data.data.activeStudents);
      } else {
        console.log("No active bookings found in response");
        setActiveBookings([]);
      }
    } catch (error) {
      console.error("Error fetching active bookings:", error);
      toast.error("Failed to load active bookings");
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold">Your Active Bookings</h1>
        <p className="text-muted-foreground">
          Students you are currently tutoring
        </p>
      </div>

      {activeBookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              You don't have any active bookings yet
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {activeBookings.map((booking, index) => (
            <Card
              key={booking.bookingDetails?.id || index}
              className="overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/3 bg-muted p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      {booking.bookingDetails?.subject || "Unknown Subject"}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Start Date:{" "}
                          {booking.bookingDetails?.startDate
                            ? new Date(
                                booking.bookingDetails.startDate
                              ).toLocaleDateString()
                            : "Not specified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Time:{" "}
                          {booking.bookingDetails?.timeSlot || "Not specified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Fee: ₹{booking.bookingDetails?.monthlyFee || 0}/month
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="text-xs uppercase text-muted-foreground font-medium">
                      Schedule
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {booking.bookingDetails?.daysOfWeek ? (
                        booking.bookingDetails.daysOfWeek.map((day) => (
                          <span
                            key={day}
                            className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                          >
                            {day}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No schedule specified
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={booking.studentInfo?.profilePic} />
                      <AvatarFallback>
                        {booking.studentInfo?.name
                          ? booking.studentInfo.name
                              .substring(0, 2)
                              .toUpperCase()
                          : "ST"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-lg font-semibold">
                        {booking.studentInfo?.name || "Unknown Student"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {booking.studentInfo?.email || "No email provided"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-1">
                        Contact Information
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {booking.studentInfo?.phoneNumber ||
                              "No phone number"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {booking.studentInfo?.address
                              ? `${booking.studentInfo.address.area}, ${booking.studentInfo.address.city}`
                              : "No address provided"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-2">
                    <Button variant="outline">Contact Student</Button>
                    <Button>View Details</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TutorBookings;
