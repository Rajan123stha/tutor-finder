import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requestAPI } from "@/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface RequestHistory {
  _id: string;
  tutor: {
    name: string;
    email: string;
  };
  subject: string;
  gradeLevel: string;
  preferredDays: string[];
  preferredTime: string;
  duration: number;
  startDate: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

const StudentBookingHistory = () => {
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      console.log("Fetching booking history...");
      const response = await requestAPI.getStudentRequests();
      console.log(response);
      setHistory(response.data.data.requests);
    } catch (error) {
      toast.error("Failed to fetch booking history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const pendingRequests = history.filter((req) => req.status === "pending");
  const acceptedRequests = history.filter((req) => req.status === "accepted");
  const rejectedRequests = history.filter((req) => req.status === "rejected");

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tuition Requests</CardTitle>
        <CardDescription>
          Track the status of your tuition requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({acceptedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No pending requests
              </p>
            ) : (
              pendingRequests.map((request) => (
                <RequestCard key={request._id} request={request} />
              ))
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4">
            {acceptedRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No accepted requests
              </p>
            ) : (
              acceptedRequests.map((request) => (
                <RequestCard key={request._id} request={request} />
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No rejected requests
              </p>
            ) : (
              rejectedRequests.map((request) => (
                <RequestCard key={request._id} request={request} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const RequestCard = ({ request }: { request: RequestHistory }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold">{request.tutor.name}</h3>
            <p className="text-sm text-muted-foreground">
              {request.subject} • {request.gradeLevel}
            </p>
          </div>
          <Badge
            variant={
              request.status === "pending"
                ? "outline"
                : request.status === "accepted"
                ? "success"
                : "destructive"
            }
          >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div>
            <p className="font-medium">Schedule</p>
            <p>
              {request.preferredDays.join(", ")} at {request.preferredTime}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Duration</p>
              <p>{request.duration} months</p>
            </div>
            <div>
              <p className="font-medium">Start Date</p>
              <p>{new Date(request.startDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <p className="font-medium">Request Date</p>
            <p>{new Date(request.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentBookingHistory;
