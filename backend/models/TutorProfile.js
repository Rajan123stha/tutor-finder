const mongoose = require("mongoose");

const tutorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    subjects: {
      type: [String],
      required: [true, "Please specify the subjects you teach"],
    },
    experience: {
      type: Number, // in years
      required: [true, "Please specify your years of experience"],
    },
    availability: {
      type: String,
      required: [true, "Please specify your availability"],
    },
    monthlyRate: {
      type: Number,
      required: [true, "Please specify your expected monthly fee"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    education: {
      type: [String],
    },
    about: {
      type: String,
      trim: true,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for active students (students with active bookings)
tutorProfileSchema.virtual("activeStudents", {
  ref: "Booking",
  localField: "user",
  foreignField: "tutor",
  match: { status: "active" },
});

// Method to check if profile is complete
tutorProfileSchema.methods.checkProfileCompleteness = function () {
  return Boolean(
    this.subjects?.length > 0 &&
      this.experience &&
      this.availability &&
      this.monthlyRate &&
      this.about?.length > 10
  );
};

// Pre-save middleware to update profileComplete flag
tutorProfileSchema.pre("save", function (next) {
  this.profileComplete = this.checkProfileCompleteness();
  next();
});

const TutorProfile = mongoose.model("TutorProfile", tutorProfileSchema);
module.exports = TutorProfile;
