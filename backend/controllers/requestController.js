const TuitionRequest = require("../models/TuitionRequest");
const Booking = require("../models/Booking");
const User = require("../models/User");
const TutorProfile = require("../models/TutorProfile");

// Create a new tuition request
exports.createRequest = async (req, res) => {
  try {
    const {
      tutorId,
      subject,
      gradeLevel,
      preferredDays,
      preferredTime,
      duration,
      startDate,
      monthlyFee,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !tutorId ||
      !subject ||
      !gradeLevel ||
      !preferredDays ||
      !preferredTime ||
      !duration ||
      !startDate ||
      !monthlyFee
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Missing required fields",
      });
    }

    // Check if tutor exists
    const tutor = await User.findById(tutorId).populate("tutorProfile");
    if (!tutor || tutor.role !== "tutor") {
      return res.status(404).json({
        status: "fail",
        message: "Tutor not found",
      });
    }

    // Create the tuition request
    const newRequest = await TuitionRequest.create({
      student: req.user._id,
      tutor: tutorId,
      subject,
      gradeLevel,
      preferredDays,
      preferredTime,
      duration,
      startDate,
      monthlyFee,
      notes,
      status: "pending",
    });

    res.status(201).json({
      status: "success",
      data: {
        request: newRequest,
      },
    });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get all requests (filtered by role)
exports.getRequests = async (req, res) => {
  try {
    let query = {};

    // Filter by student or tutor
    if (req.user.role === "student") {
      query.student = req.user.id;
    } else if (req.user.role === "tutor") {
      query.tutor = req.user.id;
    }

    // Filter by status if provided
    if (
      req.query.status &&
      ["pending", "accepted", "rejected"].includes(req.query.status)
    ) {
      query.status = req.query.status;
    }

    // Get requests with populated data
    const requests = await TuitionRequest.find(query)
      .populate("student", "name email profilePic")
      .populate("tutor", "name email profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: requests.length,
      data: {
        requests,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get student's request and booking history
exports.getStudentHistory = async (req, res) => {
  try {
    // Check if user is a student
    if (req.user.role !== "student") {
      return res.status(403).json({
        status: "fail",
        message: "Only students can access their history",
      });
    }

    // Get all requests for the student
    const requests = await TuitionRequest.find({ student: req.user.id })
      .populate("tutor", "name email profilePic")
      .sort({ createdAt: -1 });

    // Get all bookings for the student
    const bookings = await Booking.find({ student: req.user.id })
      .populate("tutor", "name email profilePic")
      .sort({ createdAt: -1 });

    // Categorize requests by status
    const pendingRequests = requests.filter((req) => req.status === "pending");
    const acceptedRequests = requests.filter(
      (req) => req.status === "accepted"
    );
    const rejectedRequests = requests.filter(
      (req) => req.status === "rejected"
    );

    // Categorize bookings by status
    const activeBookings = bookings.filter((book) => book.status === "active");
    const completedBookings = bookings.filter(
      (book) => book.status === "completed"
    );
    const cancelledBookings = bookings.filter(
      (book) => book.status === "cancelled"
    );

    res.status(200).json({
      status: "success",
      data: {
        requests: {
          pending: pendingRequests,
          accepted: acceptedRequests,
          rejected: rejectedRequests,
          total: requests.length,
        },
        bookings: {
          active: activeBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
          total: bookings.length,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Accept tuition request (for tutors)
exports.acceptRequest = async (req, res) => {
  try {
    // Check if user is a tutor
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        status: "fail",
        message: "Only tutors can accept tuition requests",
      });
    }

    // Find request
    const request = await TuitionRequest.findById(req.params.id);

    // Check if request exists
    if (!request) {
      return res.status(404).json({
        status: "fail",
        message: "No request found with that ID",
      });
    }

    // Check if tutor is the one assigned to the request
    if (request.tutor.toString() !== req.user.id) {
      return res.status(403).json({
        status: "fail",
        message: "You can only accept requests assigned to you",
      });
    }

    // Check if request is already processed
    if (request.status !== "pending") {
      return res.status(400).json({
        status: "fail",
        message: `This request has already been ${request.status}`,
      });
    }

    // Update request status
    request.status = "accepted";
    await request.save();

    // Create booking
    const newBooking = await Booking.create({
      tuitionRequest: request._id,
      student: request.student,
      tutor: request.tutor,
      subject: request.subject,
      startDate: request.startDate,
      endDate: request.endDate,
      daysOfWeek: request.preferredDays,
      timeSlot: request.preferredTime,
      monthlyFee: request.monthlyFee,
    });

    res.status(200).json({
      status: "success",
      data: {
        request,
        booking: newBooking,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Reject tuition request (for tutors)
exports.rejectRequest = async (req, res) => {
  try {
    // Check if user is a tutor
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        status: "fail",
        message: "Only tutors can reject tuition requests",
      });
    }

    // Find request
    const request = await TuitionRequest.findById(req.params.id);

    // Check if request exists
    if (!request) {
      return res.status(404).json({
        status: "fail",
        message: "No request found with that ID",
      });
    }

    // Check if tutor is the one assigned to the request
    if (request.tutor.toString() !== req.user.id) {
      return res.status(403).json({
        status: "fail",
        message: "You can only reject requests assigned to you",
      });
    }

    // Check if request is already processed
    if (request.status !== "pending") {
      return res.status(400).json({
        status: "fail",
        message: `This request has already been ${request.status}`,
      });
    }

    // Update request status
    request.status = "rejected";
    await request.save();

    res.status(200).json({
      status: "success",
      data: {
        request,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Cancel booking (for students)
exports.cancelBooking = async (req, res) => {
  try {
    // Check if user is a student
    if (req.user.role !== "student") {
      return res.status(403).json({
        status: "fail",
        message: "Only students can cancel bookings",
      });
    }

    // Find booking
    const booking = await Booking.findById(req.params.id);

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "No booking found with that ID",
      });
    }

    // Check if student owns the booking
    if (booking.student.toString() !== req.user.id) {
      return res.status(403).json({
        status: "fail",
        message: "You can only cancel your own bookings",
      });
    }

    // Check if booking is active
    if (booking.status !== "active") {
      return res.status(400).json({
        status: "fail",
        message: `Cannot cancel a booking that is already ${booking.status}`,
      });
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      status: "success",
      data: {
        booking,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Extend booking (for students)
exports.extendBooking = async (req, res) => {
  try {
    // Check if user is a student
    if (req.user.role !== "student") {
      return res.status(403).json({
        status: "fail",
        message: "Only students can extend bookings",
      });
    }

    const { bookingId, additionalMonths } = req.body;

    // Find booking
    const booking = await Booking.findById(bookingId);

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "No booking found with that ID",
      });
    }

    // Check if student owns the booking
    if (booking.student.toString() !== req.user.id) {
      return res.status(403).json({
        status: "fail",
        message: "You can only extend your own bookings",
      });
    }

    // Check if booking is active
    if (booking.status !== "active") {
      return res.status(400).json({
        status: "fail",
        message: "Only active bookings can be extended",
      });
    }

    // Store previous end date
    const previousEndDate = new Date(booking.endDate);

    // Calculate new end date
    const newEndDate = new Date(booking.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + additionalMonths);

    // Update booking
    booking.extended = true;
    booking.endDate = newEndDate;
    booking.extensionHistory.push({
      previousEndDate,
      newEndDate,
      extendedOn: new Date(),
    });

    await booking.save();

    res.status(200).json({
      status: "success",
      data: {
        booking,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get all requests for a student
exports.getStudentRequests = async (req, res) => {
  try {
    const requests = await TuitionRequest.find({ student: req.user._id })
      .populate("tutor", "name email profilePic")
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: requests.length,
      data: {
        requests,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get all requests for a tutor
exports.getTutorRequests = async (req, res) => {
  try {
    const requests = await TuitionRequest.find({ tutor: req.user._id })
      .populate("student", "name email profilePic")
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: requests.length,
      data: {
        requests,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Update request status (accept/reject)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid status",
      });
    }

    const request = await TuitionRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: "fail",
        message: "Request not found",
      });
    }

    // Check if the logged-in user is the tutor for this request
    if (request.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "fail",
        message: "Not authorized to update this request",
      });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      status: "success",
      data: {
        request,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
