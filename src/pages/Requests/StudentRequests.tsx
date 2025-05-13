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
import { TuitionRequest } from "@/types/request";
import { Badge } from "@/components/ui/badge";

interface RequestsData {
  accepted: TuitionRequest[];
  pending: TuitionRequest[];
  rejected: TuitionRequest[];
  total: number;
}

const StudentRequests = () => {
  const [requests, setRequests] = useState<RequestsData>({
    accepted: [],
    pending: [],
    rejected: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getStudentHistory();
      if (response?.data?.data) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      pending: "warning",
      accepted: "success",
      rejected: "destructive",
      completed: "default",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const renderRequests = (requestList: TuitionRequest[], status: string) => {
    return requestList.map((request) => (
      <Card key={request._id}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{request.subject}</CardTitle>
              <CardDescription>{request.tutorName}</CardDescription>
            </div>
            {getStatusBadge(status)}
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <div className="text-sm">
            <div>
              <strong>Grade Level:</strong> {request.gradeLevel}
            </div>
            <div>
              <strong>Budget:</strong> ₹{request.budget}/month
            </div>
            <div>
              <strong>Preferred Days:</strong>{" "}
              {request.preferredDays.join(", ")}
            </div>
            <div>
              <strong>Preferred Time:</strong> {request.preferredTime}
            </div>
            {request.message && (
              <div className="mt-2">
                <strong>Message:</strong>
                <p className="text-muted-foreground">{request.message}</p>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground mt-4">
            Requested on {new Date(request.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasRequests = requests.total > 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Requests</h1>
        <p className="text-muted-foreground">Track your tuition requests</p>
      </div>

      {!hasRequests ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              You haven't made any requests yet
            </p>
            <Button className="mt-4" asChild>
              <a href="/tutors">Find Tutors</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {renderRequests(requests.pending, "pending")}
          {renderRequests(requests.accepted, "accepted")}
          {renderRequests(requests.rejected, "rejected")}
        </div>
      )}
    </div>
  );
};

export default StudentRequests;
