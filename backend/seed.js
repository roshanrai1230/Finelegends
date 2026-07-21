const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  // PANTS
  {
    name: 'BlackDistrict™ Classic Beige Pant',
    price: 1299,
    compareAtPrice: 1999,
    images: [
      '/image/beige-pant-1.jpg',
      '/image/beige-pant-2.jpg',
      '/image/beige-pant-3.jpg'
    ],
    description: 'Designed with a casual yet tailored fit, these pants feature a drawstring waist, side seam pockets, and a faux fly, crafted from a breathable blend of viscose and cotton.',
    sizes: ['28', '30', '32', '34', '36', '38'],
    onSale: true,
    availability: true,
    category: 'pant'
  },
  {
    name: 'BlackDistrict™ Classic White Pants',
    price: 1299,
    compareAtPrice: 1999,
    images: [
      '/image/white-pants-1.png',
      '/image/white-pants-2.png',
      '/image/white-pants-3.png'
    ],
    description: 'These are regular straight cotton pants featuring a concealed elastic band, drawstring, zip fly, and button closure, with a composition of 98% cotton and 2% elastane.',
    sizes: ['28', '30', '32', '34', '36', '38'],
    onSale: true,
    availability: true,
    category: 'pant'
  },
  {
    name: 'BlackDistrict™ Classic Black Pant',
    price: 1299,
    compareAtPrice: 1999,
    images: [
      '/image/black-pant-1.webp',
      '/image/black-pant-2.png',
      '/image/black-pant-3.jpg',
      '/image/black-pant-4.jpg'
    ],
    description: 'Similar to the beige version, these are breathable solid drawstring pants with a casual, tailored fit.',
    sizes: ['28', '30', '32', '34', '36', '38'],
    onSale: true,
    availability: true,
    category: 'pant'
  },
  {
    name: 'Classic Gurkha Pants',
    price: 1299,
    compareAtPrice: 1999,
    images: [
      '/image/collection-gurkha.jpg',
      '/image/white-pants-2.png'
    ],
    description: 'Inspired by traditional military design, our Gurkha pants feature double buckle waist adjusters and single front pleats for a refined silhouette.',
    sizes: ['28', '30', '32', '34', '36', '38'],
    onSale: true,
    availability: true,
    category: 'pant'
  },

  // SHIRTS
  {
    name: 'BlackDistrict™ Cuban Classic Shirt',
    price: 1699,
    compareAtPrice: 2499,
    images: [
      '/image/collection-shirt.png'
    ],
    description: 'A breathable summer classic designed for hot climates, featuring our signature Cuban collar and premium lightweight cotton blend.',
    sizes: ['S', 'M', 'L', 'XL'],
    onSale: true,
    availability: true,
    category: 'shirt'
  },
  {
    name: 'BlackDistrict™ Linen Signature Shirt',
    price: 1999,
    compareAtPrice: 2999,
    images: [
      '/image/collection-signature.webp'
    ],
    description: 'Crafted from premium flax linen, this shirt features a relaxed silhouette and offers unparalleled breathability and clean, structured drape.',
    sizes: ['S', 'M', 'L', 'XL'],
    onSale: true,
    availability: true,
    category: 'shirt'
  },
  {
    name: 'BlackDistrict™ Retro Resort Shirt',
    price: 1299,
    compareAtPrice: 1999,
    images: [
      '/image/collection-summer-edit.jpg'
    ],
    description: 'Evoke Mediterranean elegance with our retro-inspired resort shirt. The perfect layering piece for coastal getaways.',
    sizes: ['S', 'M', 'L', 'XL'],
    onSale: true,
    availability: true,
    category: 'shirt'
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finelegends';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // Insert new products
    await Product.insertMany(products);
    console.log('Successfully seeded database with all category products!');

    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
};

seedDatabase();
