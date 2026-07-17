const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Public (Testing/Seeding)
const createProduct = async (req, res) => {
  const { name, price, compareAtPrice, images, description, sizes, onSale, availability } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      compareAtPrice,
      images,
      description,
      sizes,
      onSale,
      availability
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getProducts,
  createProduct
};
