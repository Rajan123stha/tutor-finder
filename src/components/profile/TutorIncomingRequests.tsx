import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Calendar,
  Clock,
  GraduationCap,
  IndianRupee,
} from "lucide-react";
import { requestAPI } from "@/api";
import { toast } from "sonner";
import { format } from "date-fns";

interface RequestStudent {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profilePic?: string;
}

interface TuitionRequest {
  _id: string;
  student: RequestStudent;
  subject: string;
  gradeLevel: string;
  preferredDays: string[];
  preferredTime: string;
  duration: number;
  startDate: string;
  monthlyFee: number;
  notes?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

const TutorIncomingRequests = () => {
  const [requests, setRequests] = useState<TuitionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getTutorRequests();
      setRequests(response.data.data.requests);
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (
    requestId: string,
    action: "accept" | "reject"
  ) => {
    try {
      setProcessingId(requestId);
      await requestAPI.updateRequestStatus(requestId, action);

      // Update local state
      setRequests((prev) => prev.filter((req) => req._id !== requestId));

      toast.success(`Request ${action}ed successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Incoming Requests</CardTitle>
          <CardDescription>Loading requests...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incoming Requests</CardTitle>
        <CardDescription>
          {requests.length === 0
            ? "No pending tuition requests"
            : `You have ${requests.length} pending request${
                requests.length !== 1 ? "s" : ""
              }`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request._id}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={request.student.profilePic} />
                      <AvatarFallback>
                        {request.student.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">
                          {request.student.name}
                        </h4>
                        <Badge>{request.subject}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-1">
                          <GraduationCap className="h-4 w-4" />
                          <span>{request.gradeLevel}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(request.startDate), "PP")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{request.preferredTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="h-4 w-4" />
                          <span>{request.monthlyFee}/month</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium">Preferred Days:</p>
                        <div className="flex flex-wrap gap-1">
                          {request.preferredDays.map((day) => (
                            <Badge key={day} variant="secondary">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {request.notes && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            Additional Notes:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleRequestAction(request._id, "reject")
                          }
                          disabled={!!processingId}
                        >
                          {processingId === request._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Reject"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleRequestAction(request._id, "accept")
                          }
                          disabled={!!processingId}
                        >
                          {processingId === request._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Accept"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TutorIncomingRequests;
