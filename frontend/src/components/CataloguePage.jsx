import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const LOOKBOOK_PRODUCTS = [
  // Shirts
  {
    id: 'lk1',
    name: 'Relaxed Linen Shirt',
    code: 'BD-SH-101',
    price: 2499,
    image: '/image/collection-signature.webp',
    specs: '100% Premium Linen | Relaxed Fit | 4 Colors',
    colors: ['#4A3728', '#2C2C2C', '#A8A8A8', '#FFFFFF'],
    category: 'shirt'
  },
  {
    id: 'lk2',
    name: 'Linen Resort Shirt',
    code: 'BD-SH-102',
    price: 2299,
    image: '/image/collection-shirt.png',
    specs: '100% Premium Linen | Regular Fit | 5 Colors',
    colors: ['#A5B4FC', '#1F2937', '#FFFFFF', '#1E3A8A'],
    category: 'shirt'
  },
  // Pants
  {
    id: 'lk3',
    name: 'Tailored Linen Pant',
    code: 'BD-PT-101',
    price: 2799,
    image: '/image/white-pants-1.png',
    specs: 'Linen Blend | Tailored Fit | 3 Colors',
    colors: ['#F3F4F6', '#111827', '#6B7280'],
    category: 'pant'
  },
  // Combos
  {
    id: 'lk4',
    name: 'Old Money Classic Combo (Brown & Beige)',
    code: 'BD-CB-101',
    price: 2099,
    image: '/image/collection-signature.webp',
    specs: 'Linen Shirt & Tailored Pant | 4 Colors',
    colors: ['#4A3728', '#F3F4F6'],
    category: 'combo',
    onSale: true
  },
  {
    id: 'lk5',
    name: 'Old Money Classic Combo (Blue & Beige)',
    code: 'BD-CB-102',
    price: 2099,
    image: '/image/collection-shirt.png',
    specs: 'Resort Shirt & Tailored Pant | 5 Colors',
    colors: ['#A5B4FC', '#F3F4F6'],
    category: 'combo',
    onSale: true
  },
  {
    id: 'lk6',
    name: 'Old Money Classic Combo (Olive & Beige)',
    code: 'BD-CB-103',
    price: 2099,
    image: '/image/collection-gurkha.jpg',
    specs: 'Linen Shirt & Gurkha Pant | Out of Stock',
    colors: ['#1E3A8A', '#F3F4F6'],
    category: 'combo',
    outOfStock: true
  },
  {
    id: 'lk7',
    name: 'Old Money Classic Combo (Maroon & Beige)',
    code: 'BD-CB-104',
    price: 2099,
    image: '/image/collection-winterwear.jpg',
    specs: 'Heavy Jacket & Structured Pant | 2 Colors',
    colors: ['#5C2C22', '#F3F4F6'],
    category: 'combo',
    onSale: true
  }
];

const CataloguePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wishlisted, setWishlisted] = useState({});
  const [categories, setCategories] = useState([
    { name: 'pant', label: 'PANTS' },
    { name: 'shirt', label: 'SHIRTS' },
    { name: 'combo', label: 'COMBOS' }
  ]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Format label to uppercase for the filters
          const formatted = data.map(cat => ({
            name: cat.name,
            label: cat.label.toUpperCase().replace('THE ', '').replace(' DUOS', 'S')
          }));
          setCategories(formatted);
        }
      })
      .catch(err => console.error("Error loading catalogue categories:", err));
  }, []);

  const toggleWishlist = (id) => {
    setWishlisted(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredProducts = LOOKBOOK_PRODUCTS.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const getHeroImage = () => {
    if (selectedCategory === 'pant') return '/image/collection-pant.png';
    if (selectedCategory === 'combo') return '/image/collection-combo.png';
    return '/image/hero-banner.png';
  };

  return (
    <div className="bg-[#f5f5f0] min-h-screen text-[#1a1a1a] pb-20 font-serif">
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-16 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Side Content */}
        <div className="w-full lg:w-1/2 text-left space-y-6">
          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#a3907c] block">
            BLACK DISTRICT / COLLECTION LOOKBOOK
          </span>
          
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl md:text-[54px] font-serif leading-[1.1] text-[#1a1a1a] tracking-wide font-normal">
              The Digital<br />Catalogue
            </h1>
            <div className="w-20 h-[1.5px] bg-[#c5a880] mt-6"></div>
          </div>

          <p className="text-[14px] sm:text-[15px] font-sans text-gray-600 leading-relaxed max-w-md">
            Browse our core signature linen styles, handcrafted shirts, tailored drawstring pants, and pre-curated combinations built for timeless elegance.
          </p>

          {/* Tab Filters */}
          <div className="flex flex-wrap gap-3 pt-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 text-[11px] font-sans font-semibold tracking-widest transition-all duration-300 border ${
                selectedCategory === 'all'
                  ? 'bg-black text-white border-black shadow-md'
                  : 'bg-white text-gray-500 border-gray-200 hover:text-black hover:border-black'
              }`}
            >
              ALL ITEMS
            </button>
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-6 py-3 text-[11px] font-sans font-semibold tracking-widest transition-all duration-300 border ${
                  selectedCategory === cat.name
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-white text-gray-500 border-gray-200 hover:text-black hover:border-black'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side Image (Changes dynamically based on active filter option) */}
        <div className="w-full lg:w-1/2 max-w-[530px] aspect-[4/3] sm:aspect-square overflow-hidden bg-white shadow-sm shrink-0">
          <img
            src={getHeroImage()}
            alt="Catalogue Lookbook"
            className="w-full h-full object-cover object-top transition-all duration-500"
          />
        </div>

      </div>

      {/* Explore Collections Title Header */}
      <div className="text-center py-8">
        <h2 className="text-[15px] font-sans font-bold uppercase tracking-[0.25em] text-[#1a1a1a]">
          EXPLORE COLLECTIONS
        </h2>
        <div className="w-12 h-[1.5px] bg-[#c5a880] mx-auto mt-3"></div>
      </div>

      {/* Product Cards Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id} 
              className="bg-transparent group flex flex-col text-left"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-[3/4] overflow-hidden bg-white border border-[#eae8e4] shadow-sm mb-5">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                
                {/* Out of Stock Overlay */}
                {prod.outOfStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                    <span className="text-white text-[13px] font-sans font-bold uppercase tracking-widest">OUT OF STOCK</span>
                  </div>
                )}

                {/* Sale Tag */}
                {prod.onSale && (
                  <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 z-10">
                    Sale
                  </div>
                )}

                {/* Heart / Wishlist icon top-right */}
                <button
                  onClick={() => toggleWishlist(prod.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors z-10"
                >
                  <Heart 
                    size={16} 
                    fill={wishlisted[prod.id] ? '#ef4444' : 'none'} 
                    className={wishlisted[prod.id] ? 'text-red-500' : ''} 
                  />
                </button>
              </div>

              {/* Color dots */}
              <div className="flex items-center space-x-2 mb-3">
                {prod.colors.map((color, idx) => (
                  <span
                    key={idx}
                    className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Title */}
              <h3 className="text-xl font-serif text-[#1a1a1a] mb-1 font-medium leading-tight">
                {prod.name}
              </h3>

              {/* Code */}
              <span className="text-[11px] font-sans font-bold text-gray-400 uppercase tracking-wider block mb-2">
                {prod.code}
              </span>

              {/* Specs */}
              <p className="text-[12px] font-sans text-gray-500 mb-3 tracking-wide">
                {prod.specs}
              </p>

              {/* Price */}
              <div className="text-[17px] font-sans font-bold text-[#1a1a1a] mb-4">
                ₹{prod.price.toLocaleString('en-IN')}
              </div>

              {/* View Details Link */}
              <div className="border-t border-gray-200 pt-3">
                <a 
                  href="/collections" 
                  className="inline-flex items-center text-[12px] font-sans font-bold tracking-widest text-[#1a1a1a] uppercase hover:underline decoration-1 underline-offset-4"
                >
                  <span>VIEW DETAILS</span>
                  <span className="ml-1.5 transition-transform group-hover:translate-x-1 duration-300">&rarr;</span>
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Premium Features Banner */}
      <div className="max-w-6xl mx-auto px-4 mt-16">
        <div className="bg-[#eae7df]/40 border border-[#e2dfd5] py-8 px-6 grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4">
          
          {/* Item 1 */}
          <div className="flex items-start space-x-4 px-2">
            <div className="text-[#1a1a1a] pt-1">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </div>
            <div className="text-left space-y-0.5">
              <h4 className="text-[11px] font-sans font-bold tracking-wider uppercase text-gray-900">PREMIUM FABRICS</h4>
              <p className="text-[10.5px] font-sans text-gray-500 leading-tight">Finest linen & blends for all-day comfort</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start space-x-4 px-2 border-l border-[#e2dfd5]/60 lg:border-l pl-4">
            <div className="text-[#1a1a1a] pt-1">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7a5 5 0 11-10 0 5 5 0 0110 0z" />
              </svg>
            </div>
            <div className="text-left space-y-0.5">
              <h4 className="text-[11px] font-sans font-bold tracking-wider uppercase text-gray-900">TAILORED FIT</h4>
              <p className="text-[10.5px] font-sans text-gray-500 leading-tight">Thoughtfully designed for a perfect fit</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start space-x-4 px-2 border-l border-[#e2dfd5]/60 lg:border-l pl-4">
            <div className="text-[#1a1a1a] pt-1">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="text-left space-y-0.5">
              <h4 className="text-[11px] font-sans font-bold tracking-wider uppercase text-gray-900">TIMELESS STYLES</h4>
              <p className="text-[10.5px] font-sans text-gray-500 leading-tight">Minimal, refined & always in style</p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-start space-x-4 px-2 border-l border-[#e2dfd5]/60 lg:border-l pl-4">
            <div className="text-[#1a1a1a] pt-1">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
              </svg>
            </div>
            <div className="text-left space-y-0.5">
              <h4 className="text-[11px] font-sans font-bold tracking-wider uppercase text-gray-900">CRAFTED TO LAST</h4>
              <p className="text-[10.5px] font-sans text-gray-500 leading-tight">Quality craftsmanship you can trust</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default CataloguePage;
