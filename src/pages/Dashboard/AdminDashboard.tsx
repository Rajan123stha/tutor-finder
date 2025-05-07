import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminAPI } from "@/api";
import {
  Loader2,
  Users,
  GraduationCap,
  CalendarRange,
  IndianRupee,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: { total: 0, tutors: 0, students: 0 },
    requests: { total: 0, pending: 0, accepted: 0, rejected: 0 },
    finance: { totalRevenue: 0 },
    recent: { users: [], requests: [] },
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      console.log("Fetching admin statistics...");
      const response = await adminAPI.getStatistics();
      console.log("Statistics response:", response.data);
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.users.tutors} tutors, {stats.users.students} students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tutoring Requests
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.requests.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.requests.accepted} accepted, {stats.requests.pending}{" "}
              pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.finance.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {stats.requests.accepted} accepted requests
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
                {stats.recent.users.length > 0 ? (
                  stats.recent.users.map((user) => (
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
                          {user.createdAt
                            ? format(new Date(user.createdAt), "MMM dd, yyyy")
                            : "Unknown date"}
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
                {stats.recent.requests.length > 0 ? (
                  stats.recent.requests.map((request) => (
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
                          {request.createdAt
                            ? format(
                                new Date(request.createdAt),
                                "MMM dd, yyyy"
                              )
                            : "Unknown date"}
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
