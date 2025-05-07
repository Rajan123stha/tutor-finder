import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { tutorAPI } from "@/api";

interface BookingDetails {
  id: string;
  subject: string;
  startDate: string;
  endDate: string;
  daysOfWeek: string[];
  timeSlot: string;
  monthlyFee: number;
}

interface StudentInfo {
  name: string;
  email: string;
  phoneNumber?: string;
  address?: {
    city?: string;
    area?: string;
  };
  profilePic?: string;
}

interface ActiveStudent {
  studentInfo: StudentInfo;
  bookingDetails: BookingDetails;
}

const ActiveStudents = () => {
  const [activeStudents, setActiveStudents] = useState<ActiveStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActiveStudents = async () => {
      try {
        setLoading(true);
        const response = await tutorAPI.getActiveStudents();
        setActiveStudents(response.data.data.activeStudents);
        setLoading(false);
      } catch (error) {
        setError("Failed to load active students");
        toast({
          title: "Error",
          description: "Failed to load active students. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchActiveStudents();
  }, [toast]);

  if (loading) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Active Students</CardTitle>
          <CardDescription>Loading your active students...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Active Students</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Active Students</CardTitle>
        <CardDescription>
          {activeStudents.length === 0
            ? "You have no active students at the moment."
            : `You are currently teaching ${activeStudents.length} student${
                activeStudents.length > 1 ? "s" : ""
              }.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activeStudents.map((item) => (
            <div
              key={item.bookingDetails.id}
              className="mb-4 flex items-start space-x-4 rounded-md border p-4"
            >
              <Avatar>
                <AvatarImage
                  src={item.studentInfo.profilePic}
                  alt={item.studentInfo.name}
                />
                <AvatarFallback>
                  {item.studentInfo.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-semibold">
                    {item.studentInfo.name}
                  </h4>
                  <Badge>{item.bookingDetails.subject}</Badge>
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Days:</span>{" "}
                  {item.bookingDetails.daysOfWeek.join(", ")}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Time:</span>{" "}
                  {item.bookingDetails.timeSlot}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Fee:</span> ₹
                  {item.bookingDetails.monthlyFee}/month
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Started:{" "}
                    {new Date(
                      item.bookingDetails.startDate
                    ).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Until:{" "}
                    {new Date(item.bookingDetails.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActiveStudents;
