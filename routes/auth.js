const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { NgExtension } = require('@angular/compiler-cli/src/ngtsc/shims/src/expando');
const passport = require('passport');

/*Logins*/
router.post('/login',authController.login)
router.post('/forgot',authController.forgotPassword)
router.post('/changePassword',authController.changePassword)
router.post('/signup',authController.signup)
router.get('/logout',authController.logout)
router.get('/waitlist',authController.waitlist)


router.get('/linkedin',authController.linkedinLogin)
router.post('/linkedin/callback', authController.linkedinLoginCallback)

router.post('/social',authController.socialLogin);


module.exports = router;







