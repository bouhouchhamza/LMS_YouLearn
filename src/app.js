import express from "express";
import courseRoutes from "./routes/courseRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import authRoutes from './routes/authRoutes.js'
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS API is running",
  });
});
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use('/api/auth',authRoutes);

// app.use('/api/courses', courseRoutes);
// app.use('/api/modules', moduleRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
