const express = require('express');

const {
    getModeleResources,
} = require('../controllers/resourceController');

const router = express.Router();

router.get('/:moduleId/resources', getModeleResources);
module.exports = router;