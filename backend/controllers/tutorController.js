const User = require("../models/User");
const TutorProfile = require("../models/TutorProfile");
const Booking = require("../models/Booking");
const TuitionRequest = require("../models/TuitionRequest");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/profile-pictures";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("profilePic");

// Get all tutors with filtering options
exports.getAllTutors = async (req, res) => {
  try {
    const { subject, location, experience, minRate, maxRate } = req.query;

    // Find all active users with role 'tutor' and not blocked
    const query = {
      role: "tutor",
      isActive: true,
      isBlocked: false,
    };

    // Find tutors with matching criteria and only complete profiles
    const tutors = await User.find(query)
      .populate({
        path: "tutorProfile",
        match: { profileComplete: true },
      })
      .select("-__v");

    // Filter out tutors with incomplete profiles
    let filteredTutors = tutors.filter((tutor) => tutor.tutorProfile);

    // Filter by subject
    if (subject) {
      filteredTutors = filteredTutors.filter((tutor) =>
        tutor.tutorProfile?.subjects.some((s) =>
          s.toLowerCase().includes(subject.toLowerCase())
        )
      );
    }

    // Filter by location (city or area)
    if (location) {
      filteredTutors = filteredTutors.filter(
        (tutor) =>
          tutor.address?.city
            ?.toLowerCase()
            ?.includes(location.toLowerCase()) ||
          tutor.address?.area?.toLowerCase()?.includes(location.toLowerCase())
      );
    }

    // Filter by minimum years of experience
    if (experience) {
      filteredTutors = filteredTutors.filter(
        (tutor) => tutor.tutorProfile?.experience >= parseInt(experience)
      );
    }

    // Filter by price range
    if (minRate) {
      filteredTutors = filteredTutors.filter(
        (tutor) => tutor.tutorProfile?.monthlyRate >= parseInt(minRate)
      );
    }

    if (maxRate) {
      filteredTutors = filteredTutors.filter(
        (tutor) => tutor.tutorProfile?.monthlyRate <= parseInt(maxRate)
      );
    }

    res.status(200).json({
      status: "success",
      results: filteredTutors.length,
      data: {
        tutors: filteredTutors,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get single tutor
exports.getTutor = async (req, res) => {
  try {
    const tutor = await User.findById(req.params.id).populate("tutorProfile");

    if (!tutor || tutor.role !== "tutor") {
      return res.status(404).json({
        status: "fail",
        message: "No tutor found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        tutor,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Update tutor profile
exports.updateTutorProfile = async (req, res) => {
  try {
    // Check if user is a tutor
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        status: "fail",
        message: "Only tutors can update tutor profiles",
      });
    }

    const {
      subjects,
      experience,
      availability,
      monthlyRate,
      education,
      about,
    } = req.body;

    // Find or create tutor profile
    let tutorProfile = await TutorProfile.findOne({ user: req.user.id });

    if (!tutorProfile) {
      // Create new profile if it doesn't exist
      tutorProfile = new TutorProfile({
        user: req.user.id,
        subjects: subjects || [],
        experience: experience || 0,
        availability: availability || "",
        monthlyRate: monthlyRate || 0,
        education: education || [],
        about: about || "",
      });
    } else {
      // Update existing profile
      if (subjects) tutorProfile.subjects = subjects;
      if (experience) tutorProfile.experience = experience;
      if (availability) tutorProfile.availability = availability;
      if (monthlyRate) tutorProfile.monthlyRate = monthlyRate;
      if (education) tutorProfile.education = education;
      if (about) tutorProfile.about = about;
    }

    // Save the profile (will automatically check completeness via pre-save hook)
    await tutorProfile.save();

    res.status(200).json({
      status: "success",
      data: {
        tutorProfile,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get active students for a tutor
exports.getActiveStudents = async (req, res) => {
  try {
    // Ensure the user is a tutor
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        status: "fail",
        message: "Only tutors can access this information",
      });
    }

    // Find all active bookings for this tutor
    const bookings = await Booking.find({
      tutor: req.user.id,
      status: "active",
    }).populate({
      path: "student",
      select: "name email profilePic phoneNumber address",
    });

    // Format the response
    const activeStudents = await Promise.all(
      bookings.map(async (booking) => {
        return {
          bookingDetails: {
            id: booking._id,
            subject: booking.subject,
            startDate: booking.startDate,
            endDate: booking.endDate,
            daysOfWeek: booking.daysOfWeek,
            timeSlot: booking.timeSlot,
            monthlyFee: booking.monthlyFee,
          },
          studentInfo: booking.student,
        };
      })
    );

    res.status(200).json({
      status: "success",
      results: activeStudents.length,
      data: {
        activeStudents,
      },
    });
  } catch (error) {
    console.error("Error fetching active students:", error);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get incoming tuition requests for a tutor
exports.getIncomingRequests = async (req, res) => {
  try {
    // Check if user is a tutor
    if (req.user.role !== "tutor") {
      return res.status(403).json({
        status: "fail",
        message: "Only tutors can view their incoming requests",
      });
    }

    // Find pending requests for the tutor
    const pendingRequests = await TuitionRequest.find({
      tutor: req.user.id,
      status: "pending",
    }).populate({
      path: "student",
      select: "name email phoneNumber address profilePic",
    });

    res.status(200).json({
      status: "success",
      results: pendingRequests.length,
      data: {
        pendingRequests,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Update profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "No file uploaded",
      });
    }

    // Find the tutor profile
    const tutorProfile = await TutorProfile.findOne({ user: req.user.id });

    if (!tutorProfile) {
      return res.status(404).json({
        status: "fail",
        message: "Tutor profile not found",
      });
    }

    // Clean up old profile picture if it exists
    if (tutorProfile.profilePic) {
      try {
        const oldPicPath = path.join(__dirname, "..", tutorProfile.profilePic);
        if (fs.existsSync(oldPicPath)) {
          fs.unlinkSync(oldPicPath);
        }
      } catch (err) {
        console.error("Error deleting old profile picture:", err);
        // Continue execution even if deletion fails
      }
    }

    // Set the new profile picture path - add full URL
    const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const profilePicPath = `${baseUrl}/uploads/profile-pictures/${req.file.filename}`;

    // Update both the user model and tutor profile
    await User.findByIdAndUpdate(req.user.id, { profilePic: profilePicPath });
    tutorProfile.profilePic = profilePicPath;
    await tutorProfile.save();

    console.log("Updated profile picture:", {
      user: req.user.id,
      profilePicPath: profilePicPath,
      filename: req.file.filename,
    });

    // Return the updated profile pic path
    res.status(200).json({
      status: "success",
      data: {
        profilePic: profilePicPath,
      },
    });
  } catch (error) {
    console.error("Profile picture update error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
