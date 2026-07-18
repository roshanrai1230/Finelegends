const express = require('express');
const router = express.Router();
const { getReviewsForProduct, createReview, getAllReviews, deleteReview } = require('../controllers/reviewController');

router.get('/product/:productId', getReviewsForProduct);
router.post('/', createReview);
router.get('/', getAllReviews);
router.delete('/:id', deleteReview);

module.exports = router;
