const express = require("express");
const courseRoutes = require('./routes/courseRoutes');
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS API is running",
  });
});
app.use('/api/courses', courseRoutes);

module.exports = app;