const express = require('express');
const router = express.Router();
const Joi = require('joi');
const User = require('../models/user');
const userController = require('../controllers/user');

router.post('/update',userController.update)
router.post('/changePassword',userController.changeAuthenticatedPassword)
router.post('/checkDomainAvailable',userController.checkDomainAvailable)


module.exports = router;