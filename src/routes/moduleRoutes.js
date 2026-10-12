// const express = require('express');
import express from 'express';
import getModuleResources  from '../controllers/resourceController.js';
import {updateModule} from '../controllers/moduleController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:moduleId/resources', getModuleResources);
router.patch("/:moduleId", authMiddleware, updateModule);// module.exports = router;
export default router;
