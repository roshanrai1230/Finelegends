const Review = require('../models/Review');

// @desc    Get all reviews for a specific product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getReviewsForProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    console.error('Fetch Product Reviews Error:', err.message);
    res.status(500).json({ message: 'Server error fetching product reviews' });
  }
};

// @desc    Submit a customer review
// @route   POST /api/reviews
// @access  Public
const createReview = async (req, res) => {
  const { productId, name, rating, comment } = req.body;

  if (!productId || !name || !rating || !comment) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  try {
    const newReview = await Review.create({
      productId,
      name,
      rating,
      comment
    });
    res.status(201).json({ success: true, review: newReview });
  } catch (err) {
    console.error('Create Review Error:', err.message);
    res.status(500).json({ message: 'Server error saving customer review' });
  }
};

// @desc    Get all reviews for Admin
// @route   GET /api/reviews
// @access  Public
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('productId', 'name').sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    console.error('Fetch All Reviews Error:', err.message);
    res.status(500).json({ message: 'Server error fetching admin reviews report' });
  }
};

// @desc    Delete a customer review (Admin)
// @route   DELETE /api/reviews/:id
// @access  Public
const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Review.deleteOne({ _id: id });
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Delete Review Error:', err.message);
    res.status(500).json({ message: 'Server error deleting review' });
  }
};

module.exports = {
  getReviewsForProduct,
  createReview,
  getAllReviews,
  deleteReview
};
