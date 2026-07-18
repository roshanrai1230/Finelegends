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
// @access  Public
const createProduct = async (req, res) => {
  const { name, price, compareAtPrice, images, description, sizes, onSale, availability, category } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      compareAtPrice,
      images,
      description,
      sizes,
      onSale,
      availability,
      category
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
  const { name, price, compareAtPrice, images, description, sizes, onSale, availability, category } = req.body;

  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name !== undefined ? name : product.name;
    product.price = price !== undefined ? price : product.price;
    product.compareAtPrice = compareAtPrice !== undefined ? compareAtPrice : product.compareAtPrice;
    product.images = images !== undefined ? images : product.images;
    product.description = description !== undefined ? description : product.description;
    product.sizes = sizes !== undefined ? sizes : product.sizes;
    product.onSale = onSale !== undefined ? onSale : product.onSale;
    product.availability = availability !== undefined ? availability : product.availability;
    product.category = category !== undefined ? category : product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
