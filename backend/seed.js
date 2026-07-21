const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  // COMBOS
  {
    name: 'Old Money Classic Combo (Brown & Beige)',
    price: 2099,
    compareAtPrice: 2999,
    images: [
      '/image/collection-signature.webp',
      '/image/beige-pant-2.jpg',
      '/image/beige-pant-3.jpg'
    ],
    description: 'Effortless sophistication in a single set, curated for the man who values heritage over trends. Experience the weight of premium fabric and our artisanal craftsmanship, delivered to your door in our signature Deep Plum box.',
    sizes: ['S', 'M', 'L', 'XL'], // For shirts/combos we can have shirt size
    onSale: true,
    availability: true,
    category: 'combo'
  },
  {
    name: 'Old Money Classic Combo (Blue & Beige)',
    price: 2099,
    compareAtPrice: 2999,
    images: [
      '/image/collection-combo.png',
      '/image/beige-pant-2.jpg'
    ],
    description: 'Effortless sophistication in a single set, curated for the man who values heritage over trends. Crafted from premium lotus linen and textured linen canvas.',
    sizes: ['S', 'M', 'L', 'XL'],
    onSale: true,
    availability: true,
    category: 'combo'
  },
  {
    name: 'Old Money Classic Combo (Olive & Beige)',
    price: 2099,
    compareAtPrice: 2999,
    images: [
      '/image/collection-gurkha.jpg',
      '/image/beige-pant-2.jpg'
    ],
    description: 'A striking duo matching our signature olive popover linen shirt and tailored beige linen trousers. Timeless summer luxury.',
    sizes: ['S', 'M', 'L', 'XL'],
    onSale: true,
    availability: true,
    category: 'combo'
  },
  {
    name: 'Old Money Classic Combo (Maroon & Beige)',
    price: 2099,
    compareAtPrice: 2999,
    images: [
      '/image/collection-winterwear.jpg',
      '/image/beige-pant-2.jpg'
    ],
    description: 'Artisanal styling matching maroon linen shirts and light-sand linen drawstring pants.',
    sizes: ['S', 'M', 'L', 'XL'],
    onSale: true,
    availability: true,
    category: 'combo'
  },

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
  },

  // FOOTWEAR
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
