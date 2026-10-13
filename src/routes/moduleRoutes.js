import express from "express";
import getModuleResources from "../controllers/resourceController.js";
import { updateModule } from "../controllers/moduleController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

router.get("/:moduleId/resources", getModuleResources);

router.patch(
  "/:moduleId",
  authMiddleware,
  authorize("trainer", "admin"),
  updateModule
);

export default router;