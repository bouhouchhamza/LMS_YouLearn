const express = require("express");
const courseRoutes = require('./routes/courseRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS API is running",
  });
});
app.use('/api/courses', courseRoutes);
app.use('/api/modules', moduleRoutes);

module.exports = app;