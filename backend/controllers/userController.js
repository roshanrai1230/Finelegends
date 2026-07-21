const User = require('../models/User');
const Otp = require('../models/Otp');
const twilio = require('twilio');

// Helper to format phone to E.164 (India default +91)
const formatPhoneNumber = (phone) => {
  let cleaned = phone.replace(/\D/g, ''); // strip non-digits
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  if (cleaned.length > 10 && !phone.startsWith('+')) {
    return `+${cleaned}`;
  }
  return phone;
};

// @desc    Send mobile verification OTP
// @route   POST /api/users/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }

  const formattedPhone = formatPhoneNumber(phone);
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6 digit code

  try {
    // Upsert OTP in DB (expires in 5 minutes)
    await Otp.findOneAndUpdate(
      { phone: formattedPhone },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    console.log(`[SMS OTP] Mobile: ${formattedPhone} Code: ${otpCode}`);

    // Resolve Twilio settings at call-time
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (twilioSid && twilioAuthToken && twilioPhone) {
      console.log('Connecting to Twilio and dispatching SMS...');
      const client = twilio(twilioSid, twilioAuthToken);
      
      await client.messages.create({
        body: `Your Blackdistrictslogin verification OTP is: ${otpCode}. Valid for 5 minutes.`,
        from: twilioPhone,
        to: formattedPhone
      });

      return res.status(200).json({ 
        success: true, 
        message: 'OTP sent successfully via Twilio SMS!' 
      });
    } else {
      console.warn('Twilio credentials missing in environment.');
      return res.status(400).json({ 
        success: false, 
        message: 'Twilio SMS configuration is missing on the server.' 
      });
    }

  } catch (err) {
    console.error('Twilio SMS Send Error:', err.message);
    return res.status(400).json({ 
      success: false, 
      message: `Failed to send SMS OTP via Twilio: ${err.message}` 
    });
  }
};

// @desc    Verify OTP and Log User in
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Mobile number and OTP are required' });
  }

  const formattedPhone = formatPhoneNumber(phone);

  try {
    // Find matching OTP record
    const otpRecord = await Otp.findOne({ phone: formattedPhone, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
    }

    // Success: delete the OTP record
    await Otp.deleteOne({ _id: otpRecord._id });

    // Check if user already exists
    let user = await User.findOne({ phone: formattedPhone });
    let created = false;

    if (!user) {
      user = await User.create({
        phone: formattedPhone,
        name: `Legend ${formattedPhone.slice(-4)}`
      });
      created = true;
    }

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email || ''
      },
      created
    });

  } catch (err) {
    console.error('OTP Verification Error:', err.message);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
};

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && user.password === password) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || ''
      });
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Google login / registration helper
// @route   POST /api/users/google-login
// @access  Public
const googleLogin = async (req, res) => {
  const { email, name, sub } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required from Google Auth' });
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name: name || 'Google User',
        email: email.toLowerCase(),
        password: sub || Math.random().toString(36).slice(-8)
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || ''
    });
  } catch (err) {
    console.error('Google auth processing error:', err.message);
    res.status(500).json({ message: 'Server error processing Google auth' });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
  googleLogin
};
