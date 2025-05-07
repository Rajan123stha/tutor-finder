import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { requestAPI } from "@/api";

interface TuitionRequest {
  _id: string;
  subject: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
  startDate: string;
  tutor: {
    name: string;
    email: string;
    profilePic?: string;
  };
}

interface Booking {
  _id: string;
  subject: string;
  status: "active" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  daysOfWeek: string[];
  monthlyFee: number;
  timeSlot: string;
  tutor: {
    name: string;
    email: string;
    profilePic?: string;
  };
}

interface BookingHistoryData {
  requests: {
    pending: TuitionRequest[];
    accepted: TuitionRequest[];
    rejected: TuitionRequest[];
    total: number;
  };
  bookings: {
    active: Booking[];
    completed: Booking[];
    cancelled: Booking[];
    total: number;
  };
}

const BookingHistory = () => {
  const [history, setHistory] = useState<BookingHistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await requestAPI.getStudentHistory();
        setHistory(response.data.data);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load your history. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchHistory();
  }, [toast]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await requestAPI.cancelBooking(bookingId);

      // Refresh history after cancellation
      const response = await requestAPI.getStudentHistory();
      setHistory(response.data.data);

      toast({
        title: "Success",
        description: "Booking cancelled successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExtendBooking = async (
    bookingId: string,
    additionalMonths: number
  ) => {
    try {
      await requestAPI.extendBooking({
        bookingId,
        additionalMonths,
      });

      // Refresh history after extension
      const response = await requestAPI.getStudentHistory();
      setHistory(response.data.data);

      toast({
        title: "Success",
        description: `Booking extended by ${additionalMonths} month(s).`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to extend booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: {
        variant: "outline" as const,
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      },
      accepted: {
        variant: "outline" as const,
        className: "bg-green-100 text-green-800 hover:bg-green-100",
      },
      rejected: {
        variant: "outline" as const,
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      },
      active: {
        variant: "outline" as const,
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      },
      completed: {
        variant: "outline" as const,
        className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      },
      cancelled: {
        variant: "outline" as const,
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      },
    };

    return (
      <Badge
        variant={
          variants[status as keyof typeof variants]?.variant || "outline"
        }
        className={variants[status as keyof typeof variants]?.className}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Booking & Request History</CardTitle>
          <CardDescription>Loading your history...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Booking & Request History</CardTitle>
        <CardDescription>
          Track all your tuition requests and bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="requests">
          <TabsList className="mb-4">
            <TabsTrigger value="requests">Tuition Requests</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Pending</CardTitle>
                  <CardDescription>Awaiting tutor response</CardDescription>
                </CardHeader>
                <CardContent>
                  {history?.requests?.pending?.length === 0 ? (
                    <p className="text-sm text-gray-500">No pending requests</p>
                  ) : (
                    <div className="space-y-3">
                      {history?.requests?.pending?.map((request) => (
                        <div
                          key={request._id}
                          className="border p-3 rounded-md"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{request.subject}</p>
                              <p className="text-sm text-gray-500">
                                Tutor: {request.tutor.name}
                              </p>
                            </div>
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <p>
                              Requested on:{" "}
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                            <p>
                              Start date:{" "}
                              {new Date(request.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Accepted</CardTitle>
                  <CardDescription>Approved by tutors</CardDescription>
                </CardHeader>
                <CardContent>
                  {history?.requests?.accepted?.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No accepted requests
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {history?.requests?.accepted?.map((request) => (
                        <div
                          key={request._id}
                          className="border p-3 rounded-md"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{request.subject}</p>
                              <p className="text-sm text-gray-500">
                                Tutor: {request.tutor.name}
                              </p>
                            </div>
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <p>
                              Accepted on:{" "}
                              {new Date(request.updatedAt).toLocaleDateString()}
                            </p>
                            <p>
                              Start date:{" "}
                              {new Date(request.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Rejected</CardTitle>
                  <CardDescription>Declined by tutors</CardDescription>
                </CardHeader>
                <CardContent>
                  {history?.requests?.rejected?.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No rejected requests
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {history?.requests?.rejected?.map((request) => (
                        <div
                          key={request._id}
                          className="border p-3 rounded-md"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{request.subject}</p>
                              <p className="text-sm text-gray-500">
                                Tutor: {request.tutor.name}
                              </p>
                            </div>
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <p>
                              Rejected on:{" "}
                              {new Date(request.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Active</CardTitle>
                  <CardDescription>Ongoing tuitions</CardDescription>
                </CardHeader>
                <CardContent>
                  {history?.bookings?.active?.length === 0 ? (
                    <p className="text-sm text-gray-500">No active bookings</p>
                  ) : (
                    <div className="space-y-3">
                      {history?.bookings?.active?.map((booking) => (
                        <div
                          key={booking._id}
                          className="border p-3 rounded-md"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{booking.subject}</p>
                              <p className="text-sm text-gray-500">
                                Tutor: {booking.tutor.name}
                              </p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <p>
                              Started:{" "}
                              {new Date(booking.startDate).toLocaleDateString()}
                            </p>
                            <p>
                              Ends:{" "}
                              {new Date(booking.endDate).toLocaleDateString()}
                            </p>
                            <p>Fee: ₹{booking.monthlyFee}/month</p>
                            <p>Days: {booking.daysOfWeek.join(", ")}</p>
                          </div>
                          <div className="flex space-x-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleExtendBooking(booking._id, 1)
                              }
                            >
                              Extend 1 Month
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelBooking(booking._id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Completed</CardTitle>
                  <CardDescription>Finished tuitions</CardDescription>
                </CardHeader>
                <CardContent>
                  {history?.bookings?.completed?.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No completed bookings
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {history?.bookings?.completed?.map((booking) => (
                        <div
                          key={booking._id}
                          className="border p-3 rounded-md"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{booking.subject}</p>
                              <p className="text-sm text-gray-500">
                                Tutor: {booking.tutor.name}
                              </p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <p>
                              Period:{" "}
                              {new Date(booking.startDate).toLocaleDateString()}{" "}
                              - {new Date(booking.endDate).toLocaleDateString()}
                            </p>
                            <p>Fee: ₹{booking.monthlyFee}/month</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Cancelled</CardTitle>
                  <CardDescription>Terminated tuitions</CardDescription>
                </CardHeader>
                <CardContent>
                  {history?.bookings?.cancelled?.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No cancelled bookings
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {history?.bookings?.cancelled?.map((booking) => (
                        <div
                          key={booking._id}
                          className="border p-3 rounded-md"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{booking.subject}</p>
                              <p className="text-sm text-gray-500">
                                Tutor: {booking.tutor.name}
                              </p>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <p>
                              Cancelled on:{" "}
                              {new Date(booking.updatedAt).toLocaleDateString()}
                            </p>
                            <p>
                              Period:{" "}
                              {new Date(booking.startDate).toLocaleDateString()}{" "}
                              - {new Date(booking.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookingHistory;
