const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleCheck");
const {
  getSavedJobs,
  saveJob,
  unsaveJob,
  getAllUsers,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");

// User routes (protected)
router.get("/saved-jobs", protect, getSavedJobs);
router.post("/saved-jobs", protect, saveJob);
router.delete("/saved-jobs/:jobId", protect, unsaveJob);

// Admin routes
router.get("/all", protect, isAdmin, getAllUsers);
router.delete("/:id", protect, isAdmin, deleteUser);
router.patch("/:id/role", protect, isAdmin, updateUserRole);

module.exports = router;