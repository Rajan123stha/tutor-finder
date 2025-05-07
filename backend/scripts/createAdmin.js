const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@tutorconnect.com",
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const adminUser = new User({
      name: "Admin User",
      email: "admin@tutorconnect.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    await adminUser.save();
    console.log("Admin user created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();
