const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getAllRequests,
  toggleBlockUser,
  getStatistics,
} = require("../controllers/adminController");

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(restrictTo("admin"));

// User management routes
router.get("/users", getAllUsers);
router.put("/users/:id/block", toggleBlockUser);

// Request management routes
router.get("/requests", getAllRequests);

// Dashboard statistics
router.get("/statistics", getStatistics);

module.exports = router;
