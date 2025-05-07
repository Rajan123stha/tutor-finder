const User = require("../models/User");
const TutorProfile = require("../models/TutorProfile");
const TuitionRequest = require("../models/TuitionRequest");
const Booking = require("../models/Booking");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("tutorProfile")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await TuitionRequest.find()
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

// Toggle user block status
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Toggle block status
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get dashboard statistics
exports.getStatistics = async (req, res) => {
  try {
    // Count users by role
    const totalUsers = await User.countDocuments();
    const totalTutors = await User.countDocuments({ role: "tutor" });
    const totalStudents = await User.countDocuments({ role: "student" });

    // Count requests by status
    const totalRequests = await TuitionRequest.countDocuments();
    const pendingRequests = await TuitionRequest.countDocuments({
      status: "pending",
    });
    const acceptedRequests = await TuitionRequest.countDocuments({
      status: "accepted",
    });
    const rejectedRequests = await TuitionRequest.countDocuments({
      status: "rejected",
    });

    // Count active bookings
    const activeBookings = await Booking.countDocuments({ status: "active" });

    // Calculate total revenue from bookings
    const bookings = await Booking.find({ status: "active" });
    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.monthlyFee,
      0
    );

    // Get recent users and requests
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    const recentRequests = await TuitionRequest.find()
      .populate("student", "name")
      .populate("tutor", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      status: "success",
      data: {
        users: {
          total: totalUsers,
          tutors: totalTutors,
          students: totalStudents,
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          accepted: acceptedRequests,
          rejected: rejectedRequests,
        },
        bookings: {
          active: activeBookings,
        },
        finance: {
          totalRevenue,
        },
        recent: {
          users: recentUsers,
          requests: recentRequests,
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
