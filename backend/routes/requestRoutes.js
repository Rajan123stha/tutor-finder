const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createRequest,
  getStudentRequests,
  getTutorRequests,
  updateRequestStatus,
  getRequests,
  getStudentHistory,
  acceptRequest,
  rejectRequest,
  cancelBooking,
  extendBooking,
} = require("../controllers/requestController");

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes for creating and getting requests
router.route("/").post(createRequest).get(getRequests);

// Routes for student history
router.get("/history", getStudentHistory);

// Routes for student-specific requests
router.get("/student", getStudentRequests);

// Routes for tutor-specific requests
router.get("/tutor", getTutorRequests);

// Routes for updating request status
router.put("/:id/status", updateRequestStatus);
router.put("/:id/accept", acceptRequest);
router.put("/:id/reject", rejectRequest);

// Routes for managing bookings
router.route("/bookings/:id/cancel").put(cancelBooking);
router.route("/bookings/extend").post(extendBooking);

module.exports = router;
