const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: String,
      required: true,
    },
    title: String,
    company: String,
    location: String,
    salary_min: Number,
    salary_max: Number,
    description: String,
    redirectUrl: String,
    category: String,
    contractType: String,
  },
  { timestamps: true }
);

// Prevent duplicate saves
savedJobSchema.index({ user: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("SavedJob", savedJobSchema);