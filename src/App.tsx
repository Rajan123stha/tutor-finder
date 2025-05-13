import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Tutors from "./pages/Tutors/Tutors";
import TutorProfile from "./pages/Tutors/TutorProfile";
import RequestTuition from "./pages/Tutors/RequestTuition";
import Requests from "./pages/Requests/Requests";
import Bookings from "./pages/Bookings/Bookings";
import Profile from "./pages/Profile/Profile";
import Users from "./pages/Admin/Users";
import AdminRequests from "./pages/Admin/Requests";
import NotFound from "./pages/NotFound";
import TutorRequests from "@/pages/Requests/TutorRequests";
import TutionRequest from "@/pages/Requests/StudentRequests";
import BookingHistory from "./components/profile/BookingHistory";
import ActiveStudents from "./components/profile/ActiveStudents";
import StudentBookingHistory from "./components/profile/StudentBookingHistory";
import StudentBookings from "./pages/Bookings/StudentBookings";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes for all authenticated users */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Tutor routes */}
              <Route path="/tutors" element={<Tutors />} />
              <Route path="/tutors/:id" element={<TutorProfile />} />
              <Route
                path="/request-tuition"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <RequestTuition />
                  </ProtectedRoute>
                }
              />

              {/* Requests and bookings routes */}
              <Route
                path="/requests"
                element={
                  <ProtectedRoute>
                    <BookingHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings/tutor"
                element={
                  <ProtectedRoute>
                    <ActiveStudents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <StudentBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests/tutor"
                element={
                  <ProtectedRoute allowedRoles={["tutor"]}>
                    <TutorRequests />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/requests"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminRequests />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
