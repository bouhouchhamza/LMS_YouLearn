import express from "express";
import {getModuleResources, createResource, uploadResource} from "../controllers/resourceController.js";
import { updateModule } from "../controllers/moduleController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorize.js";
import checkCourseOwnership from "../middlewares/checkCourseOwnership.js";
import uploadMiddleware from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/:moduleId/resources", getModuleResources);

router.patch("/:moduleId", authMiddleware, authorize("trainer", "admin"), updateModule);

router.post("/:moduleId/resources", authMiddleware, authorize("trainer", "admin"), createResource);
router.post("/:moduleId/resources/upload", authMiddleware, authorize("trainer", "admin"), checkCourseOwnership("module"),uploadMiddleware(), uploadResource);

export default router;