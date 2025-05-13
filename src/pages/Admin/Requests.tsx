import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { adminAPI } from "@/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface TuitionRequest {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
  };
  tutor: {
    _id: string;
    name: string;
    email: string;
  };
  subject: string;
  gradeLevel: string;
  preferredDays: string[];
  preferredTime: string;
  duration: number;
  startDate: string;
  endDate: string;
  status: "pending" | "accepted" | "rejected";
  monthlyFee: number;
  notes?: string;
  createdAt: string;
}

const Requests: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState<TuitionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<TuitionRequest | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchRequests();
    }
  }, [isAuthenticated, user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllRequests();
      setRequests(response.data.data.requests);
    } catch (error) {
      toast.error("Failed to fetch tuition requests");
    } finally {
      setLoading(false);
    }
  };

  // Open request details dialog
  const viewRequestDetails = (request: TuitionRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  // Filter requests based on status and search query
  const filteredRequests = requests.filter((request) => {
    const matchesFilter = filter === "all" || request.status === filter;
    const matchesSearch =
      request.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.tutor.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Count requests by status
  const pendingCount = requests.filter(
    (req) => req.status === "pending"
  ).length;
  const acceptedCount = requests.filter(
    (req) => req.status === "accepted"
  ).length;
  const rejectedCount = requests.filter(
    (req) => req.status === "rejected"
  ).length;

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const isValidDate = (value: any) => {
    const date = new Date(value);
    return value && !isNaN(date.getTime());
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Tuition Requests</h1>
        <p className="text-muted-foreground">
          Monitor and manage all tuition requests on the platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="w-full md:w-[300px] pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs
          value={filter}
          onValueChange={setFilter}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-12">
              <p>Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center p-12">
              <p>No requests found matching your criteria.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Date Requested</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell className="font-medium">
                      {request.subject}
                    </TableCell>
                    <TableCell>{request.student.name}</TableCell>
                    <TableCell>{request.tutor.name}</TableCell>
                    <TableCell>
                      {format(new Date(request.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{request.duration} months</TableCell>
                    <TableCell>${request.monthlyFee}/mo</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "pending"
                            ? "outline"
                            : request.status === "accepted"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewRequestDetails(request)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>
                Complete information about this tuition request
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Request Information
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Subject:</span>
                      <span className="font-medium">
                        {selectedRequest.subject}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Grade Level:</span>
                      <span className="font-medium">
                        {selectedRequest.gradeLevel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Fee:</span>
                      <span className="font-medium">
                        ${selectedRequest.monthlyFee}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Duration:</span>
                      <span className="font-medium">
                        {selectedRequest.duration} months
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge
                        variant={
                          selectedRequest.status === "pending"
                            ? "outline"
                            : selectedRequest.status === "accepted"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {selectedRequest.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Created:</span>
                      <span className="font-medium">
                        {format(
                          new Date(selectedRequest.createdAt),
                          "MMM d, yyyy"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Schedule
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Start Date:</span>
                      <span className="font-medium">
                        {isValidDate(selectedRequest.startDate)
                          ? format(
                              new Date(selectedRequest.startDate),
                              "MMM d, yyyy"
                            )
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">End Date:</span>
                      <span className="font-medium">
                        {isValidDate(selectedRequest.endDate)
                          ? format(
                              new Date(selectedRequest.endDate),
                              "MMM d, yyyy"
                            )
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Preferred Days:</span>
                      <span className="font-medium">
                        {selectedRequest.preferredDays.join(", ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Preferred Time:</span>
                      <span className="font-medium">
                        {selectedRequest.preferredTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Student Information
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Name:</span>
                      <span className="font-medium">
                        {selectedRequest.student.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Email:</span>
                      <span className="font-medium">
                        {selectedRequest.student.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Tutor Information
                  </h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Name:</span>
                      <span className="font-medium">
                        {selectedRequest.tutor.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Email:</span>
                      <span className="font-medium">
                        {selectedRequest.tutor.email}
                      </span>
                    </div>
                  </div>
                </div>
                {selectedRequest.notes && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Notes
                    </h3>
                    <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                      {selectedRequest.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Requests;
