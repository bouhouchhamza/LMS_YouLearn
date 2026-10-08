// const express = require('express');
import express from 'express';
import getModeleResources from '../controllers/resourceController.js';

const router = express.Router();

router.get('/:moduleId/resources', getModeleResources);
// module.exports = router;
export default router;
