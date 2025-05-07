const mongoose = require("mongoose");

const tuitionRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    gradeLevel: {
      type: String,
      required: [true, "Grade level is required"],
    },
    preferredDays: {
      type: [String],
      required: [true, "Preferred days are required"],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one preferred day is required",
      },
    },
    preferredTime: {
      type: String,
      required: [true, "Preferred time is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 month"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    monthlyFee: {
      type: Number,
      required: [true, "Monthly fee is required"],
      min: [0, "Monthly fee cannot be negative"],
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const TuitionRequest = mongoose.model("TuitionRequest", tuitionRequestSchema);
module.exports = TuitionRequest;
