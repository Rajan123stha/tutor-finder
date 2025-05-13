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
import { Calendar, Users, Wallet, Clock, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { tutorAPI } from "@/api";
import { toast } from "sonner";

const TutorDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeStudents, setActiveStudents] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Fetching tutor dashboard data...");

      // Fetch tutor requests and active students in parallel
      const [requestsResponse, studentsResponse] = await Promise.all([
        tutorAPI.getTutorRequests(),
        tutorAPI.getActiveStudents(),
      ]);

      console.log("Requests response:", requestsResponse?.data);
      console.log("Students response:", studentsResponse?.data);

      // Filter and set pending requests
      if (requestsResponse?.data?.data?.pendingRequests) {
        console.log(
          "Setting pending requests:",
          requestsResponse.data.data.pendingRequests
        );
        setPendingRequests(requestsResponse.data.data.pendingRequests);
      } else {
        console.log("No pending requests found in response");
        setPendingRequests([]);
      }

      // Set active students
      if (studentsResponse?.data?.data?.activeStudents) {
        console.log(
          "Setting active students:",
          studentsResponse.data.data.activeStudents
        );
        setActiveStudents(studentsResponse.data.data.activeStudents);
      } else {
        console.log("No active students found in response");
        setActiveStudents([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await tutorAPI.updateRequestStatus(requestId, "accepted");
      toast.success("Request accepted!");
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await tutorAPI.updateRequestStatus(requestId, "rejected");
      toast.success("Request rejected");
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your tutoring activities
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Pending Requests
            </CardTitle>
            <CardDescription>
              Tuition requests awaiting your response
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pb-2">
            <div className="text-3xl font-bold text-primary">
              {loading ? "..." : pendingRequests.length}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/requests/tutor">
              <Button className="w-full">View Requests</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Active Students
            </CardTitle>
            <CardDescription>
              Students you are currently tutoring
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pb-2">
            <div className="text-3xl font-bold text-primary">
              {loading ? "..." : activeStudents.length}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/bookings/tutor">
              <Button className="w-full">View Students</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Earnings</CardTitle>
            <CardDescription>Your total earnings from tutoring</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pb-2">
            <div className="text-3xl font-bold text-primary">
              {loading
                ? "..."
                : `₹${activeStudents.reduce(
                    (acc, student) => acc + student.bookingDetails.monthlyFee,
                    0
                  )}`}
            </div>
          </CardContent>
          {/* <CardFooter>
            <Link to="/earnings/tutor">
              <Button className="w-full">View Earnings</Button>
            </Link>
          </CardFooter> */}
        </Card>
      </div>

      {/* Detailed Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Tuition Requests
            </CardTitle>
            <CardDescription>
              Recent tuition requests from students
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.slice(0, 3).map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {request.subject} - {request.gradeLevel}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.student?.name || "Unknown Student"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No pending requests
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/requests/tutor">
              <Button variant="outline" className="w-full">
                View All Requests
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Active Students
            </CardTitle>
            <CardDescription>
              Students you are currently tutoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : activeStudents.length > 0 ? (
              <div className="space-y-4">
                {activeStudents.slice(0, 3).map((student, index) => (
                  <div
                    key={student.bookingDetails?.id || index}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {student.bookingDetails?.subject || "Unknown Subject"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.studentInfo?.name || "Unknown Student"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {student.bookingDetails?.startDate
                          ? new Date(
                              student.bookingDetails.startDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground text-right">
                        ₹{student.bookingDetails?.monthlyFee || 0}/month
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No active students
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/bookings/tutor">
              <Button variant="outline" className="w-full">
                View All Students
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TutorDashboard;
