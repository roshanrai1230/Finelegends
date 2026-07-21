const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const footwearCount = await Product.countDocuments({ category: 'footwear' });
    if (footwearCount === 0) {
      const defaultShoes = [
        {
          name: 'Minimalist White Leather Sneakers',
          price: 3499,
          compareAtPrice: 4999,
          images: ['/image/collection-footwear.jpg'],
          description: 'Clean silhouette in premium full-grain Italian leather, with reinforced vulcanized soles.',
          sizes: ['7', '8', '9', '10', '11'],
          onSale: true,
          availability: true,
          category: 'footwear'
        },
        {
          name: 'Heritage Tan Suede Loafers',
          price: 3999,
          compareAtPrice: 5499,
          images: ['/image/collection-old-money.jpg'],
          description: 'Soft calfskin suede upper with hand-stitched detailing and flexible rubber pebble soles.',
          sizes: ['8', '9', '10', '11'],
          onSale: true,
          availability: true,
          category: 'footwear'
        },
        {
          name: 'Classic Pebble Leather Loafers',
          price: 4299,
          compareAtPrice: 5999,
          images: ['/image/collection-watches.jpg'],
          description: 'Handcrafted old money style slip-ons in textured pebble leather with double-stitched welts.',
          sizes: ['8', '9', '10', '11'],
          onSale: true,
          availability: true,
          category: 'footwear'
        },
        {
          name: 'Artisanal Gurkha Leather Sandals',
          price: 2999,
          compareAtPrice: 3999,
          images: ['/image/collection-gurkha.jpg'],
          description: 'Strappy woven leather cage sandals featuring brass buckles, built for hot summer days.',
          sizes: ['7', '8', '9', '10', '11'],
          onSale: true,
          availability: true,
          category: 'footwear'
        },
        {
          name: 'Urban Knitted Slip-On Shoes',
          price: 2799,
          compareAtPrice: 3799,
          images: ['/image/collection-combo.png'],
          description: 'Breathable elastic weave slip-ons, with cushion-packed active outsoles.',
          sizes: ['7', '8', '9', '10'],
          onSale: true,
          availability: true,
          category: 'footwear'
        },
        {
          name: 'Premium Leather Chelsea Boots',
          price: 4999,
          compareAtPrice: 6999,
          images: ['/image/collection-summer-edit.jpg'],
          description: 'Elegant tapered boots with elastic panels and pull-tabs, crafted from vegetable-tanned leather.',
          sizes: ['8', '9', '10', '11'],
          onSale: true,
          availability: true,
          category: 'footwear'
        },
        {
          name: 'Luxury Double-Monk Dress Shoes',
          price: 5499,
          compareAtPrice: 7999,
          images: ['/image/collection-watches.jpg'],
          description: 'Double strap dress shoes in polished cognac leather, featuring elegant silver buckles.',
          sizes: ['8', '9', '10', '11'],
          onSale: true,
          availability: true,
          category: 'footwear'
        },
        {
          name: 'Woven Leather Driving Moccasins',
          price: 3699,
          compareAtPrice: 4999,
          images: ['/image/collection-footwear.jpg'],
          description: 'Ultra-flexible driving shoes in hand-woven nappa leather, with classic pebble tread.',
          sizes: ['8', '9', '10', '11'],
          onSale: true,
          availability: true,
          category: 'footwear'
        },
        {
          name: 'Classic Suede Chelsea Boots',
          price: 4499,
          compareAtPrice: 6499,
          images: ['/image/collection-old-money.jpg'],
          description: 'Crafted from premium water-repellent suede leather with elastic gussets and heavy-duty pulls.',
          sizes: ['8', '9', '10', '11'],
          onSale: true,
          availability: true,
          category: 'footwear'
        },
        {
          name: 'Artisanal Leather Espadrilles',
          price: 2499,
          compareAtPrice: 3499,
          images: ['/image/collection-summer-edit.jpg'],
          description: 'Casual slip-ons in organic cotton canvas and jute braided midsoles, handmade in Spain.',
          sizes: ['7', '8', '9', '10'],
          onSale: true,
          availability: true,
          category: 'footwear'
        },
        {
          name: 'Tassel Leather Loafers',
          price: 4599,
          compareAtPrice: 6499,
          images: ['/image/collection-watches.jpg'],
          description: 'Polished oxblood calfskin leather slip-ons with hand-finished tassels and stacked leather heels.',
          sizes: ['8', '9', '10', '11'],
          onSale: true,
          availability: true,
          category: 'footwear'
        },
        {
          name: 'Monochrome Technical Runners',
          price: 3899,
          compareAtPrice: 5499,
          images: ['/image/collection-combo.png'],
          description: 'Modern running silhouette combining technical mesh inserts and premium suede overlays.',
          sizes: ['7', '8', '9', '10', '11'],
          onSale: true,
          availability: true,
          category: 'footwear'
        }
      ];
      await Product.insertMany(defaultShoes);
      console.log('Successfully seeded 12 premium footwear items.');
    }
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
