const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model("Blog", blogSchema);
