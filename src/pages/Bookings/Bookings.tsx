import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requestAPI } from "@/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Calendar as CalendarIcon,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Booking } from "@/types";
import { Navigate, Link } from "react-router-dom";
import TutorBookings from "./TutorBookings";

const BookingCard: React.FC<{
  booking: any;
  onExtend: (bookingId: string, months: number) => void;
}> = ({ booking, onExtend }) => {
  const [extensionMonths, setExtensionMonths] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExtend = () => {
    onExtend(booking.id, extensionMonths);
    setIsDialogOpen(false);
  };

  // Format days array to readable string
  const formattedDays = booking.daysOfWeek.join(", ");

  // Calculate end date
  const endDate = new Date(booking.endDate);
  const startDate = new Date(booking.startDate);

  // Calculate if booking is active based on current date and end date
  const isActive = new Date() <= endDate && booking.status === "active";

  return (
    <Card className={`${isActive ? "border-green-200" : "border-gray-200"}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{booking.subject}</CardTitle>
            <CardDescription>{booking.tutorName}</CardDescription>
          </div>
          <Badge variant={isActive ? "default" : "outline"}>
            {isActive
              ? "Active"
              : booking.status.charAt(0).toUpperCase() +
                booking.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        <div className="flex items-center text-sm">
          <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
          <span>
            {format(startDate, "MMM d, yyyy")} -{" "}
            {format(endDate, "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-primary" />
          <span>{formattedDays}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-primary" />
          <span>{booking.timeSlot}</span>
        </div>
        <div className="font-medium mt-2">${booking.monthlyFee}/month</div>
      </CardContent>
      <CardFooter>
        {isActive && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
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
                    Total additional cost: $
                    {booking.monthlyFee * extensionMonths}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleExtend} disabled={extensionMonths < 1}>
                  Request Extension
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
};

const Bookings = () => {
  const { user } = useAuth();

  // Render appropriate booking component based on user role
  if (user?.role === "tutor") {
    return <TutorBookings />;
  } else if (user?.role === "student") {
    // Use existing component for students
    return (
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold">Your Bookings</h1>
        <p className="text-muted-foreground">
          Currently we're working on student bookings view
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Bookings</h1>
      <p className="text-muted-foreground">
        You need to be a tutor or student to view bookings.
      </p>
    </div>
  );
};

export default Bookings;
