const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');

// @desc    Get store settings
// @route   GET /api/settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json(settings);
  } catch (err) {
    console.error('Get Settings Error:', err.message);
    res.status(500).json({ message: 'Server Error fetching settings' });
  }
});

// @desc    Update store settings
// @route   POST /api/settings
// @access  Public
router.post('/', async (req, res) => {
  try {
    // Single global settings document updated via query optimized findOneAndUpdate
    const settings = await Setting.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
      runValidators: true
    });
    res.json(settings);
  } catch (err) {
    console.error('Update Settings Error:', err.message);
    res.status(500).json({ message: 'Server Error updating settings' });
  }
});

module.exports = router;
