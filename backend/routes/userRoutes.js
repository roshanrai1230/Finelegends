const express = require('express');
const router = express.Router();
const { registerUser, loginUser, sendOtp, verifyOtp, googleLogin } = require('../controllers/userController');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/google-login', googleLogin);

module.exports = router;
