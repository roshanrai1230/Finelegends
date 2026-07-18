const Contact = require('../models/Contact');

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  const { name, email, phone, comment } = req.body;

  if (!name || !email || !comment) {
    return res.status(400).json({ message: 'Name, email, and comment are required' });
  }

  try {
    const newContact = await Contact.create({
      name,
      email,
      phone,
      comment
    });
    res.status(201).json({ success: true, contact: newContact });
  } catch (err) {
    console.error('Contact Submit Error:', err.message);
    res.status(500).json({ message: 'Server error saving contact submission' });
  }
};

// @desc    Get all contact submissions for Admin
// @route   GET /api/contact
// @access  Public (Will be authenticated on UI side)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    console.error('Fetch Contacts Error:', err.message);
    res.status(500).json({ message: 'Server error fetching contact submissions' });
  }
};

module.exports = {
  submitContact,
  getContacts
};
