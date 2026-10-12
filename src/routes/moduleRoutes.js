// const express = require('express');
import express from 'express';
import { getModeleResources, updateCourse } from '../controllers/resourceController.js';
import { authMiddlware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:moduleId/resources', getModeleResources);
router.patch("/:moduleId", authMiddlware, updateCourse);// module.exports = router;
export default router;
