import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingService } from "@/services/bookingService";
import { Booking } from "@/hooks/useBookings";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DURATION_OPTIONS } from "@/constants";

interface BookingsViewProps {
  bookings: Booking[];
  loading: boolean;
  userRole: "student" | "tutor";
  onCancelBooking: (bookingId: string) => Promise<void>;
  onExtendBooking: (bookingId: string, months: number) => Promise<void>;
}

const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  loading,
  userRole,
  onCancelBooking,
  onExtendBooking,
}) => {
  const activeBookings = bookings.filter((b) => b.status === "active");
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Bookings</CardTitle>
        <CardDescription>Manage your tuition bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">
              Active ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No active bookings
              </p>
            ) : (
              activeBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole={userRole}
                  onCancel={onCancelBooking}
                  onExtend={onExtendBooking}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No completed bookings
              </p>
            ) : (
              completedBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole={userRole}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledBookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No cancelled bookings
              </p>
            ) : (
              cancelledBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole={userRole}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const BookingCard = ({
  booking,
  userRole,
  onCancel,
  onExtend,
}: {
  booking: Booking;
  userRole: "student" | "tutor";
  onCancel?: (bookingId: string) => Promise<void>;
  onExtend?: (bookingId: string, months: number) => Promise<void>;
}) => {
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [extendDuration, setExtendDuration] = useState<number>(1);
  const [processing, setProcessing] = useState(false);

  const handleCancel = async () => {
    if (!onCancel) return;
    setProcessing(true);
    await onCancel(booking.id);
    setProcessing(false);
  };

  const handleExtend = async () => {
    if (!onExtend) return;
    setProcessing(true);
    await onExtend(booking.id, extendDuration);
    setShowExtendDialog(false);
    setProcessing(false);
  };

  const person = userRole === "student" ? booking.tutor : booking.student;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold">{person.name}</h3>
            <p className="text-sm text-muted-foreground">{person.email}</p>
          </div>
          <Badge variant={BookingService.getStatusColor(booking.status)}>
            {BookingService.getStatusText(booking.status)}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Subject</p>
              <p>{booking.subject}</p>
            </div>
            <div>
              <p className="font-medium">Monthly Fee</p>
              <p>{formatCurrency(booking.monthlyFee)}</p>
            </div>
          </div>

          <div>
            <p className="font-medium">Schedule</p>
            <p>
              {booking.daysOfWeek.join(", ")} at {booking.timeSlot}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Start Date</p>
              <p>{formatDate(booking.startDate)}</p>
            </div>
            <div>
              <p className="font-medium">End Date</p>
              <p>{formatDate(booking.endDate)}</p>
            </div>
          </div>
        </div>

        {booking.status === "active" && userRole === "student" && (
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowExtendDialog(true)}
              disabled={processing}
            >
              Extend
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleCancel}
              disabled={processing}
            >
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Cancel"
              )}
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Booking</DialogTitle>
            <DialogDescription>
              Choose how long you want to extend this booking
            </DialogDescription>
          </DialogHeader>

          <Select
            value={extendDuration.toString()}
            onValueChange={(value) => setExtendDuration(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowExtendDialog(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button onClick={handleExtend} disabled={processing}>
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Extend"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BookingsView;
