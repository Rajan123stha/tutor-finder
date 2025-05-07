import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Calendar,
  Clock,
  GraduationCap,
  IndianRupee,
  Check,
  X,
} from "lucide-react";
import { requestAPI } from "@/api";
import { toast } from "sonner";
import { format } from "date-fns";

const TutorRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState({
    pending: [],
    accepted: [],
    rejected: [],
  });
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getTutorRequests();
      console.log("Tutor requests response:", response);

      const allRequests = response?.data?.data?.requests || [];

      // Sort requests by status
      const categorizedRequests = {
        pending: allRequests.filter((req) => req.status === "pending"),
        accepted: allRequests.filter((req) => req.status === "accepted"),
        rejected: allRequests.filter((req) => req.status === "rejected"),
      };

      setRequests(categorizedRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      setProcessingId(requestId);
      await requestAPI.updateRequestStatus(requestId, action);

      toast.success(
        `Request ${
          action === "accepted" ? "accepted" : "rejected"
        } successfully`
      );

      // Refresh the data
      fetchRequests();
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
      toast.error(`Failed to ${action} request`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const RequestCard = ({ request, showActions = false }) => (
    <Card key={request._id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={request.student?.profilePic} />
            <AvatarFallback>
              {request.student?.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{request.student?.name}</h4>
              <div className="flex items-center space-x-2">
                {showActions && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() =>
                        handleRequestAction(request._id, "accepted")
                      }
                      disabled={!!processingId}
                    >
                      {processingId === request._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() =>
                        handleRequestAction(request._id, "rejected")
                      }
                      disabled={!!processingId}
                    >
                      {processingId === request._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-1">
                <GraduationCap className="h-4 w-4" />
                <span>
                  {request.subject} - {request.gradeLevel}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {request.startDate
                    ? format(new Date(request.startDate), "PP")
                    : "Not specified"}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{request.preferredTime || "Not specified"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <IndianRupee className="h-4 w-4" />
                <span>{request.monthlyFee}/month</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Preferred Days:</p>
              <div className="flex flex-wrap gap-1">
                {request.preferredDays &&
                  request.preferredDays.map((day) => (
                    <span
                      key={day}
                      className="text-xs bg-muted px-2 py-0.5 rounded"
                    >
                      {day}
                    </span>
                  ))}
              </div>
            </div>

            {request.notes && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Additional Notes:</p>
                <p className="text-sm text-muted-foreground">{request.notes}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Tuition Requests</h1>
      <p className="text-muted-foreground">
        Manage your tuition requests and bookings
      </p>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">
            Pending ({requests.pending.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted Bookings ({requests.accepted.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({requests.rejected.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {requests.pending.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No pending requests</p>
              </CardContent>
            </Card>
          ) : (
            requests.pending.map((request) => (
              <RequestCard
                key={request._id}
                request={request}
                showActions={true}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="accepted">
          {requests.accepted.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No accepted bookings</p>
              </CardContent>
            </Card>
          ) : (
            requests.accepted.map((request) => (
              <RequestCard key={request._id} request={request} />
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {requests.rejected.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No rejected requests</p>
              </CardContent>
            </Card>
          ) : (
            requests.rejected.map((request) => (
              <RequestCard key={request._id} request={request} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TutorRequests;
