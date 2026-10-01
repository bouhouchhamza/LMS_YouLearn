const express = require("express");
const courseRoutes = require('./routes/courseRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
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

app.use('/api/courses', courseRoutes);
app.use('/api/modules', moduleRoutes);
app.use(notFound);
app.use(errorHandler);
module.exports = app;