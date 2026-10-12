import express from "express";
import { enroll, cancelEnroll } from "../controllers/enrollmentController.js";
import { authMiddlware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";
const router = express.Router();

router.post("/:courseId/enroll", authMiddlware, authorize("learner"), enroll);
router.delete(
  "/:courseId/enroll",
  authMiddlware,
  authorize("learner"),
  cancelEnroll,
);
export default router;
