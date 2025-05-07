const jwt = require("jsonwebtoken");
const User = require("../models/User");
const TutorProfile = require("../models/TutorProfile");

// Helper function to generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phoneNumber, address, tutorProfile } =
      req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email already in use",
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      phoneNumber,
      address,
    });

    // If role is tutor, create tutor profile with provided data
    if (role === "tutor") {
      const profileData = {
        user: newUser._id,
        subjects: tutorProfile?.subjects || [],
        experience: tutorProfile?.experience || 0,
        availability: tutorProfile?.availability || "",
        monthlyRate: tutorProfile?.monthlyRate || 0,
        education: tutorProfile?.education || [],
        about: tutorProfile?.about || "",
        profileComplete: tutorProfile ? true : false,
      };

      const tutorProfileDoc = await TutorProfile.create(profileData);

      // Update user with reference to tutor profile
      newUser.tutorProfile = tutorProfileDoc._id;
      await newUser.save({ validateBeforeSave: false });
    }

    // Populate the tutor profile for the response
    const populatedUser = await User.findById(newUser._id).populate(
      "tutorProfile"
    );

    // Generate JWT token
    const token = signToken(populatedUser._id);

    // Remove password from output
    populatedUser.password = undefined;

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: populatedUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    // Find user by email and explicitly select the password
    const user = await User.findOne({ email })
      .select("+password")
      .populate("tutorProfile");

    // Check if user exists and password is correct
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    // Check if the role matches (if provided)
    if (role && user.role !== role) {
      return res.status(401).json({
        status: "fail",
        message: `Invalid credentials for ${role} role`,
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        status: "fail",
        message: "Your account has been blocked. Please contact admin.",
      });
    }

    // Generate token
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
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
