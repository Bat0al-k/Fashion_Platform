//error
// const User = require('../models/user.model');
const express = require('express');
const router = express.Router();

const auth = require("../middlewares/auth.middleware"); 
const authController = require('../controllers/auth.controller');

router.post('/signup',authController.signUp);
router.post('/login', authController.logIn);
router.post('/logout', authController.logOut);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);
router.post('/google-login', authController.loginWithGoogle);

// GET /api/user/profile

console.log('getProfile:', authController.getProfile);
router.get('/profile', auth, authController.getProfile)

// PUT /api/user/profile
router.put('/profile', auth, authController.updateProfile)

module.exports = router;
