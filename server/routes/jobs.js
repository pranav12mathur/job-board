const express = require("express");
const router = express.Router();
const { searchJobs, getCategories } = require("../controllers/jobController");

// Public routes — no auth needed
router.get("/search", searchJobs);
router.get("/categories", getCategories);

module.exports = router;