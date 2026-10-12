// const express = require('express');
import express from 'express';
import getModeleResources from '../controllers/resourceController.js';
import { updateModule } from '../controllers/moduleController.js';
import { authMiddlware } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorize.js';
const router = express.Router();

router.get('/:moduleId/resources', getModeleResources);
router.patch("/:moduleId", authMiddlware,authorize("trainer", "admin"), updateModule);// module.exports = router;
export default router;
