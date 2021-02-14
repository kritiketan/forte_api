const express = require('express');
const router = express.Router();
const Joi = require('joi');
const User = require('../models/user');
const portfolioController = require('../controllers/portfolio');

router.get('/:slashUrl',portfolioController.getUserProfile);



module.exports = router;