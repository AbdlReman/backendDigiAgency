const Blog = require("../models/blogModel");
const AsyncHandler = require("express-async-handler");
const slugify = require("slugify");

// @desc Create a new blog
// @route POST /api/blogs
// @access Private (Admin)
const createBlog = AsyncHandler(async (req, res) => {
  const { title, image, content } = req.body;

  if (!title || !image || !content) {
    res.status(400);
    throw new Error("Title, image, and content are required.");
  }

  const slug = slugify(title, { lower: true, strict: true });

  // Check if a blog with the same slug exists
  const existingBlog = await Blog.findOne({ slug });
  if (existingBlog) {
    res.status(400);
    throw new Error("A blog with this title already exists.");
  }

  const blog = await Blog.create({
    title,
    image,
    slug,
    content,
    author: req.user?.fullName || "Admin", // fallback if no user object
  });

  res.status(201).json({ message: "Blog created successfully", blog });
});

// @desc Update an existing blog
// @route PUT /api/blogs/:slug
// @access Private (Admin)
const updateBlog = AsyncHandler(async (req, res) => {
  const { title, image, content } = req.body;

  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  // If title is changed, update slug
  const newSlug = title
    ? slugify(title, { lower: true, strict: true })
    : blog.slug;

  blog.title = title || blog.title;
  blog.image = image || blog.image;
  blog.content = content || blog.content;
  blog.slug = newSlug;

  const updatedBlog = await blog.save();
  res.json({ message: "Blog updated successfully", blog: updatedBlog });
});

// @desc Delete a blog
// @route DELETE /api/blogs/:slug
// @access Private (Admin)
const deleteBlog = AsyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  await blog.deleteOne();
  res.json({ message: "Blog deleted successfully" });
});

// @desc Get all blogs
// @route GET /api/blogs
// @access Public
const getBlogs = AsyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ date: -1 });
  res.json(blogs);
});

// @desc Get a single blog by slug
// @route GET /api/blogs/:slug
// @access Public
const getBlogBySlug = AsyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  res.json(blog);
});

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogs,
  getBlogBySlug,
};
