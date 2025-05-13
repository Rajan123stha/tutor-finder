const express = require("express");
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.get(
  "/tutor",
  authController.restrictTo("tutor"),
  bookingController.getTutorBookings
);
router.get(
  "/student",
  authController.restrictTo("student"),
  bookingController.getStudentBookings
);

router.post("/:id/extend", bookingController.extendBooking);
router.post("/:id/cancel", bookingController.cancelBooking);

module.exports = router;
