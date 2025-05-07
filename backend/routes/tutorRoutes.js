const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getAllTutors,
  getTutor,
  updateTutorProfile,
  updateProfilePicture,
  getActiveStudents,
  getIncomingRequests,
} = require("../controllers/tutorController");

const router = express.Router();

// Public routes
router.get("/", getAllTutors);
router.get("/:id", getTutor);

// Protected routes
router.use(protect);

// Tutor-only routes
router.route("/profile").put(restrictTo("tutor"), updateTutorProfile);

router
  .route("/profile-picture")
  .put(restrictTo("tutor"), upload.single("profilePic"), updateProfilePicture);

router.route("/students/active").get(restrictTo("tutor"), getActiveStudents);

router
  .route("/requests/incoming")
  .get(restrictTo("tutor"), getIncomingRequests);

module.exports = router;
