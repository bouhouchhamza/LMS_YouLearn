import express from "express";
import courseRoutes from "./routes/courseRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import authRoutes from './routes/authRoutes.js'
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import enrollment  from "./routes/enrollmentRoutes.js";
import {resourceProgressRouter,courseProgressRouter} from './routes/progressRoutes.js';
import trainerRoutes from "./routes/trainerRoutes.js";
import quizzesRoutes from "./routes/quizzesRoutes.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS API is running",
  });
});
app.use('/api/trainer', trainerRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/courses/',enrollment);
app.use('/api/resources/',resourceProgressRouter);
app.use('/api/courses/', courseProgressRouter);
app.use('/api/quizzes/', quizzesRoutes);

// app.use('/api/courses', courseRoutes);
// app.use('/api/modules', moduleRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
