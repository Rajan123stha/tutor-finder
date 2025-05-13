const Booking = require("../models/Booking");
const Request = require("../models/TuitionRequest");

exports.getTutorBookings = async (req, res, next) => {
  const bookings = await Request.find({
    tutor: req.user._id,
    status: { $in: ["accepted", "completed", "cancelled"] },
  }).populate("student", "name email phoneNumber profilePic");

  // Organize bookings by status
  const response = {
    active: bookings.filter((b) => b.status === "accepted"),
    completed: bookings.filter((b) => b.status === "completed"),
    cancelled: bookings.filter((b) => b.status === "cancelled"),
    total: bookings.length,
  };

  res.status(200).json({
    status: "success",
    data: response,
  });
};

exports.getStudentBookings = async (req, res, next) => {
  const bookings = await Request.find({
    student: req.user._id,
    status: { $in: ["accepted", "completed", "cancelled"] },
  }).populate("tutor", "name email phoneNumber profilePic");

  // Organize bookings by status
  const response = {
    active: bookings.filter((b) => b.status === "accepted"),
    completed: bookings.filter((b) => b.status === "completed"),
    cancelled: bookings.filter((b) => b.status === "cancelled"),
    total: bookings.length,
  };

  res.status(200).json({
    status: "success",
    data: response,
  });
};

exports.extendBooking = async (req, res, next) => {
  const booking = await Request.findById(req.params.id);

  if (!booking) {
    return null;
  }

  // Check if user is authorized
  if (
    booking.student.toString() !== req.user._id.toString() &&
    booking.tutor.toString() !== req.user._id.toString()
  ) {
    return next();
  }

  // Add extension logic here
  booking.endDate = new Date(
    booking.endDate.getTime() + req.body.months * 30 * 24 * 60 * 60 * 1000
  );
  await booking.save();

  res.status(200).json({
    status: "success",
    data: booking,
  });
};

exports.cancelBooking = async (req, res, next) => {
  const booking = await Request.findById(req.params.id);

  if (!booking) {
    return null;
  }

  // Check if user is authorized
  if (
    booking.student.toString() !== req.user._id.toString() &&
    booking.tutor.toString() !== req.user._id.toString()
  ) {
    return next();
  }

  booking.status = "cancelled";
  await booking.save();

  res.status(200).json({
    status: "success",
    data: booking,
  });
};
