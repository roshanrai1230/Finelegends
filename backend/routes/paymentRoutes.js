const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getOrders, verifyUpi } = require('../controllers/paymentController');

router.post('/order', createOrder);
router.post('/verify', verifyPayment);
router.get('/orders', getOrders);
router.post('/verify-upi', verifyUpi);

module.exports = router;
