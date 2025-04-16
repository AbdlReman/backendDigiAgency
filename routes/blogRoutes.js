const express = require("express");
const {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogs,
  getBlogBySlug,
} = require("../controllers/blogController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);

// Admin-protected routes
router.post("/", protect, admin, createBlog);
router.put("/:slug", protect, admin, updateBlog);
router.delete("/:slug", protect, admin, deleteBlog);

module.exports = router;
