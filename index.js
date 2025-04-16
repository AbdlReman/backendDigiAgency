const express = require("express");
const connectDB = require("./config/connect");
const errorHandler = require("./middleware/errorMiddleware");

require("dotenv").config();
require("colors");
const app = express();
const cors = require("cors");

app.use(cors());
//connect your database

connectDB();

// Convert data into JSON
app.use(express.json());

// Middleware for encoding
app.use(express.urlencoded({ extended: false }));

app.use("/api/users/", require("./routes/userRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));

// Example GET and POST routes
app.get("/api/hello", (req, res) => {
  res.status(200).json({ message: "Hello, world!" });
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`server started on PORT:  ${process.env.PORT.yellow}`);
});
