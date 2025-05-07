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
import {
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  User,
  CalendarIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, addMonths } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const StudentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extensionMonths, setExtensionMonths] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getStudentBookings();
      console.log("Student bookings:", response?.data);

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

  const handleExtendBooking = async (bookingId, months) => {
    try {
      await requestAPI.extendBooking(bookingId, months);
      toast.success("Booking extension requested");
      fetchBookings();
    } catch (error) {
      console.error("Error extending booking:", error);
      toast.error("Failed to extend booking");
    }
  };

  const getStatusBadge = (booking) => {
    const endDate = new Date(booking.endDate);
    const isActive = new Date() <= endDate && booking.status === "active";

    return (
      <Badge variant={isActive ? "default" : "outline"}>
        {isActive
          ? "Active"
          : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
      </Badge>
    );
  };

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
        <p className="text-muted-foreground">Manage your tuition bookings</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              You don't have any active bookings
            </p>
            <Button className="mt-4" asChild>
              <a href="/tutors">Find Tutors</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {bookings.map((booking) => {
            const startDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);
            const isActive =
              new Date() <= endDate && booking.status === "active";

            return (
              <Card
                key={booking._id}
                className={`${
                  isActive ? "border-green-200" : "border-gray-200"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {booking.subject}
                      </CardTitle>
                      <CardDescription>{booking.tutorName}</CardDescription>
                    </div>
                    {getStatusBadge(booking)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                    <span>
                      {format(startDate, "MMM d, yyyy")} -{" "}
                      {format(endDate, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>{booking.daysOfWeek.join(", ")}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span>{booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span>{booking.mode}</span>
                  </div>
                  <div className="font-medium mt-2">
                    ₹{booking.monthlyFee}/month
                  </div>

                  {isActive && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full mt-4"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          Extend Booking
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Extend Booking</DialogTitle>
                          <DialogDescription>
                            Current end date: {format(endDate, "MMMM d, yyyy")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="months" className="text-right">
                              Additional months
                            </Label>
                            <Input
                              id="months"
                              type="number"
                              min={1}
                              max={12}
                              className="col-span-3"
                              value={extensionMonths}
                              onChange={(e) =>
                                setExtensionMonths(parseInt(e.target.value))
                              }
                            />
                          </div>
                          <div className="col-span-4 text-sm">
                            <p className="font-medium">New end date will be:</p>
                            <p>
                              {format(
                                addMonths(endDate, extensionMonths),
                                "MMMM d, yyyy"
                              )}
                            </p>
                            <p className="mt-2">
                              Total additional cost: ₹
                              {booking.monthlyFee * extensionMonths}
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={() =>
                              handleExtendBooking(booking._id, extensionMonths)
                            }
                            disabled={extensionMonths < 1}
                          >
                            Request Extension
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentBookings;
