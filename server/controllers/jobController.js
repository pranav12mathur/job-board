const axios = require("axios");

const REMOTIVE_BASE = "https://remotive.com/api/remote-jobs";

// @GET /api/jobs/search
const searchJobs = async (req, res) => {
  try {
    const {
      query = "developer",
      category = "",
      page = 1,
      results_per_page = 12,
    } = req.query;

    const params = { limit: 100 };
    if (query) params.search = query;
    if (category) params.category = category;

    const response = await axios.get(REMOTIVE_BASE, { params });

    const allJobs = response.data.jobs || [];

    // Manual pagination since Remotive returns all at once
    const pageNum = parseInt(page);
    const limit = parseInt(results_per_page);
    const start = (pageNum - 1) * limit;
    const paginated = allJobs.slice(start, start + limit);

    res.json({
      count: allJobs.length,
      page: pageNum,
      results: paginated.map((job) => ({
        id: String(job.id),
        title: job.title,
        company: job.company_name || "N/A",
        location: job.candidate_required_location || "Remote",
        salary_min: null,
        salary_max: null,
        description: job.description?.replace(/<[^>]*>/g, "").slice(0, 300) || "",
        redirectUrl: job.url,
        category: job.category,
        contractType: job.job_type,
        createdAt: job.publication_date,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

// @GET /api/jobs/categories
const getCategories = async (req, res) => {
  try {
    const response = await axios.get(`${REMOTIVE_BASE}/categories`);
    const categories = response.data.jobs || [];
    res.json(categories.map((c) => ({ tag: c.name, label: c.name })));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

module.exports = { searchJobs, getCategories };