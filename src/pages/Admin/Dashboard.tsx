import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userAPI, tutorAPI, requestAPI, adminAPI } from "@/api";
import {
  Loader2,
  Users,
  GraduationCap,
  CalendarRange,
  IndianRupee,
} from "lucide-react";
import { toast } from "sonner";

interface DashboardData {
  totalUsers: number;
  totalTutors: number;
  totalStudents: number;
  totalRequests: number;
  activeBookings: number;
  totalRevenue: number;
  recentUsers: any[];
  recentRequests: any[];
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalUsers: 0,
    totalTutors: 0,
    totalStudents: 0,
    totalRequests: 0,
    activeBookings: 0,
    totalRevenue: 0,
    recentUsers: [],
    recentRequests: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Make parallel API calls for better performance
        const [usersResponse, requestsResponse] = await Promise.all([
          adminAPI.getAllUsers(),
          adminAPI.getAllRequests(),
        ]);

        const users = usersResponse.data.data.users;
        const requests = requestsResponse.data.data.requests;

        // Calculate dashboard metrics
        const tutors = users.filter((user) => user.role === "tutor");
        const students = users.filter((user) => user.role === "student");
        const activeBookings = requests.filter(
          (req) => req.status === "accepted"
        ).length;

        // Calculate estimated revenue (sum of monthly fees from active bookings)
        const totalRevenue = requests
          .filter((req) => req.status === "accepted")
          .reduce((sum, req) => sum + (req.monthlyFee || 0), 0);

        setDashboardData({
          totalUsers: users.length,
          totalTutors: tutors.length,
          totalStudents: students.length,
          totalRequests: requests.length,
          activeBookings,
          totalRevenue,
          recentUsers: users.slice(0, 5), // Get 5 most recent users
          recentRequests: requests.slice(0, 5), // Get 5 most recent requests
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardData.totalTutors} tutors, {dashboardData.totalStudents}{" "}
              students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Tutoring
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.activeBookings}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Out of {dashboardData.totalRequests} total requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Estimated Revenue
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{dashboardData.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {dashboardData.activeBookings} active bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
          <TabsTrigger value="requests">Recent Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Joined Users</CardTitle>
              <CardDescription>
                The newest members of TutorConnectPro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentUsers.length > 0 ? (
                  dashboardData.recentUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            user.role === "tutor"
                              ? "bg-blue-100 text-blue-800"
                              : user.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No users found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tuition Requests</CardTitle>
              <CardDescription>
                Latest tuition requests in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentRequests.length > 0 ? (
                  dashboardData.recentRequests.map((request) => (
                    <div
                      key={request._id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <CalendarRange className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{request.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.student?.name || "Unknown Student"} →{" "}
                            {request.tutor?.name || "Unknown Tutor"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            request.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : request.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {request.status}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          ₹{request.monthlyFee} •{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No requests found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
