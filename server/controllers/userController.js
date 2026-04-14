const SavedJob = require("../models/SavedJob");
const User = require("../models/User");

// @GET /api/users/saved-jobs
const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch saved jobs" });
  }
};

// @POST /api/users/saved-jobs
const saveJob = async (req, res) => {
  try {
    const { jobId, title, company, location, salary_min, salary_max, description, redirectUrl, category, contractType } = req.body;

    if (!jobId) return res.status(400).json({ message: "jobId is required" });

    const saved = await SavedJob.create({
      user: req.user._id,
      jobId, title, company, location,
      salary_min, salary_max,
      description, redirectUrl, category, contractType,
    });

    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Job already saved" });
    }
    res.status(500).json({ message: "Failed to save job" });
  }
};

// @DELETE /api/users/saved-jobs/:jobId
const unsaveJob = async (req, res) => {
  try {
    const deleted = await SavedJob.findOneAndDelete({
      user: req.user._id,
      jobId: req.params.jobId,
    });

    if (!deleted) return res.status(404).json({ message: "Saved job not found" });

    res.json({ message: "Job removed from saved list" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove job" });
  }
};

// @GET /api/users/all  [ADMIN only]
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// @DELETE /api/users/:id  [ADMIN only]
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ message: "Cannot delete admin" });

    await SavedJob.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// @PATCH /api/users/:id/role  [ADMIN only]
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update role" });
  }
};

module.exports = { getSavedJobs, saveJob, unsaveJob, getAllUsers, deleteUser, updateUserRole };