import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig';
import { translations } from '../utils/translations';
import { Heart } from 'lucide-react';

const FALLBACK_ARRIVALS = [
  {
    _id: 'arr1',
    name: 'Linen Premium Shirt',
    color: 'Dark Coffee',
    price: 2999,
    compareAtPrice: 3999,
    images: ['/image/collection-signature.webp'],
    category: 'shirt',
    swatches: [
      { color: '#5C4033', name: 'Dark Coffee' },
      { color: '#E5D3B3', name: 'Sand Beige' },
      { color: '#8F9779', name: 'Olive Green' },
      { color: '#DCDCDC', name: 'Stone Grey' }
    ]
  },
  {
    _id: 'arr2',
    name: 'Textured Knit Polo',
    color: 'Sand Beige',
    price: 2199,
    compareAtPrice: 2999,
    images: ['/image/collection-shirt.png'],
    category: 'shirt'
  },
  {
    _id: 'arr3',
    name: 'Relaxed Fit Trousers',
    color: 'Stone Grey',
    price: 2499,
    compareAtPrice: 3499,
    images: ['/image/collection-pant.png'],
    category: 'pant'
  },
  {
    _id: 'arr4',
    name: 'Linen Blend Shirt',
    color: 'Olive Green',
    price: 2299,
    compareAtPrice: 3199,
    images: ['/image/collection-footwear.jpg'],
    category: 'shirt'
  }
];

const FALLBACK_COMBOS = [
  {
    _id: 'c1',
    name: 'Old Money Classic Combo (Brown & Beige)',
    price: 2099,
    compareAtPrice: 2999,
    images: ['/image/collection-signature.webp', '/image/beige-pant-2.jpg'],
    category: 'combo'
  },
  {
    _id: 'c2',
    name: 'Old Money Classic Combo (Blue & Beige)',
    price: 2099,
    compareAtPrice: 2999,
    images: ['/image/collection-combo.png', '/image/beige-pant-2.jpg'],
    category: 'combo'
  },
  {
    _id: 'c3',
    name: 'Old Money Classic Combo (Olive & Beige)',
    price: 2099,
    compareAtPrice: 2999,
    images: ['/image/collection-gurkha.jpg', '/image/beige-pant-2.jpg'],
    category: 'combo'
  },
  {
    _id: 'c4',
    name: 'Old Money Classic Combo (Maroon & Beige)',
    price: 2099,
    compareAtPrice: 2999,
    images: ['/image/collection-winterwear.jpg', '/image/beige-pant-2.jpg'],
    category: 'combo'
  }
];

const ProductGrid = ({ onProductSelect, onNavigate }) => {
  const [combos, setCombos] = useState(FALLBACK_COMBOS);
  const [arrivals, setArrivals] = useState(FALLBACK_ARRIVALS);
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const [wishlisted, setWishlisted] = useState({});

  useEffect(() => {
    const handleLangChange = () => {
      setLang(localStorage.getItem('lang') || 'en');
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const comboItems = data.filter(p => p.category === 'combo');
          if (comboItems.length > 0) {
            setCombos(comboItems);
          }
          const arrivalsItems = data.filter(p => p.category !== 'combo').slice(0, 4);
          if (arrivalsItems.length === 4) {
            setArrivals(arrivalsItems);
          }
        }
      })
      .catch(err => console.warn('Backend API connection failed, using offline mock data:', err.message));
  }, []);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(value).replace('₹', '₹');
  };

  const toggleWishlist = (id, e) => {
    if (e) e.stopPropagation();
    setWishlisted(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const featuredProduct = arrivals[0] || FALLBACK_ARRIVALS[0];
  const regularArrivals = arrivals.slice(1);

  return (
    <div id="products font-serif" className="bg-[#f5f5f0] space-y-16 pb-20 text-left">
      
      {/* ================= SECTION 1: NEW ARRIVALS ================= */}
      <div id="new-arrivals" className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-12 space-y-10">
        
        {/* Header */}
        <div className="flex items-center justify-between font-sans">
          <div className="flex items-center space-x-6">
            <h2 className="text-[20px] sm:text-[24px] font-heading font-medium text-gray-900 tracking-wider uppercase">NEW ARRIVALS</h2>
            <div className="hidden sm:block w-32 h-[1px] bg-gray-300"></div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('all')}
            className="px-5 py-2.5 bg-black hover:opacity-90 text-white font-sans text-[11px] font-bold uppercase tracking-widest transition-opacity"
          >
            VIEW ALL
          </button>
        </div>

        {/* arrivals layout: 1 double-width layout + 3 regular card columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Double Width Card */}
          <div className="lg:col-span-2 bg-[#eae7de]/20 border border-[#e2dfd5] grid grid-cols-1 sm:grid-cols-2 overflow-hidden h-full">
            
            {/* Image side */}
            <div 
              onClick={() => onProductSelect && onProductSelect(featuredProduct)}
              className="relative w-full min-h-[300px] sm:min-h-full overflow-hidden bg-gray-200 cursor-pointer group"
            >
              <img 
                src={featuredProduct.images[0]} 
                alt={featuredProduct.name} 
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <span className="absolute top-3 left-3 bg-[#c5a880] text-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 font-sans">NEW</span>
            </div>

            {/* Info side */}
            <div className="p-8 sm:p-10 flex flex-col justify-center text-left space-y-6">
              <div className="space-y-1">
                <h3 className="text-gray-900 font-heading text-[22px] sm:text-[26px] font-medium leading-tight select-none">
                  {featuredProduct.name}
                </h3>
                <p className="text-[12px] text-gray-400 font-sans font-bold uppercase tracking-wider">{featuredProduct.color || 'Dark Coffee'}</p>
              </div>

              <div className="text-[16px] sm:text-[18px] font-bold text-gray-900 font-sans">
                {formatPrice(featuredProduct.price)}
              </div>

              <button
                onClick={() => onProductSelect && onProductSelect(featuredProduct)}
                className="w-full py-3 bg-black hover:opacity-90 text-white font-sans text-[11px] font-bold uppercase tracking-widest transition-opacity"
              >
                ADD TO CART
              </button>

              {/* Color swatches */}
              <div className="flex items-center space-x-2.5 pt-2">
                {(featuredProduct.swatches || FALLBACK_ARRIVALS[0].swatches).map((sw, idx) => (
                  <div 
                    key={idx} 
                    className="w-6.5 h-6.5 rounded-full border border-gray-300 p-0.5 cursor-pointer hover:border-black transition-colors"
                    title={sw.name}
                  >
                    <div className="w-full h-full rounded-full" style={{ backgroundColor: sw.color }} />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Regular columns (3 cards) */}
          {regularArrivals.map((prod) => (
            <div 
              key={prod._id}
              onClick={() => onProductSelect && onProductSelect(prod)}
              className="group bg-[#eae7de]/20 border border-[#e2dfd5] p-5 flex flex-col justify-between text-left cursor-pointer transition-shadow hover:shadow-sm"
            >
              <div className="space-y-4">
                {/* Image */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-200 border border-[#e2dfd5]/60">
                  <img 
                    src={prod.images[0]} 
                    alt={prod.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-3 left-3 bg-[#c5a880] text-black text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 font-sans">NEW</span>
                  <button 
                    onClick={(e) => toggleWishlist(prod._id, e)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm transition-colors"
                  >
                    <Heart size={14} fill={wishlisted[prod._id] ? "currentColor" : "none"} className={wishlisted[prod._id] ? "text-red-500" : ""} />
                  </button>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <h3 className="text-gray-900 font-heading text-[15px] font-medium leading-snug group-hover:underline decoration-1 underline-offset-4 select-none">
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-sans font-bold uppercase tracking-wider">{prod.color || 'Signature Style'}</p>
                </div>
              </div>

              {/* Price */}
              <div className="text-[14px] font-bold text-gray-900 font-sans pt-3 border-t border-gray-200/40 mt-4">
                {formatPrice(prod.price)}
              </div>

            </div>
          ))}

        </div>

      </div>

      {/* ================= SECTION 2: SIGNATURE DUOS ================= */}
      <div id="combos" className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-16 border-t border-gray-200/50">
        
        {/* Section Header */}
        <div className="mb-12 text-left space-y-1">
          <h2 className="text-[32px] md:text-[40px] font-heading font-normal text-[#1a1a1a] tracking-wide">
            {t.signatureDuos}
          </h2>
          <p className="text-[#666666] font-sans text-[13px] sm:text-[14px] font-medium tracking-wide uppercase">
            {t.combosSubtitle}
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 lg:gap-x-8">
          {combos.map((product) => (
            <div 
              key={product._id} 
              onClick={() => onProductSelect && onProductSelect(product)}
              className="group flex flex-col text-left cursor-pointer"
            >
              
              {/* Image Container */}
              <div className="relative w-full bg-gray-200 aspect-[3/4] overflow-hidden mb-4 border border-[#e5e5e0]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-center object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-in-out"
                />
                {product.availability === false && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[12px] font-bold uppercase tracking-wider">
                    {t.outOfStock}
                  </div>
                )}
                {product.availability !== false && (
                  <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 font-sans">
                    {t.sale}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <h3 className="text-[14px] md:text-[15px] text-[#1a1a1a] font-serif font-medium mb-1 group-hover:underline decoration-[1px] underline-offset-4 leading-snug">
                {product.name}
              </h3>
              
              {/* Pricing */}
              <div className="flex items-center space-x-2 mt-1 font-sans">
                {product.compareAtPrice && (
                  <span className="text-[13px] md:text-[14px] text-gray-400 line-through font-light">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-[13px] md:text-[14px] text-[#1a1a1a] font-semibold">
                  {formatPrice(product.price)}
                </span>
              </div>

            </div>
          ))}
        </div>
        
        {/* Centered View All Button */}
        <div className="flex justify-center mt-12">
          <button 
            onClick={() => onNavigate && onNavigate('all')}
            className="bg-black text-white px-9 py-3.5 text-[11px] font-sans font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            View all
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductGrid;
