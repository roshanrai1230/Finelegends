import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig';
import { translations } from '../utils/translations';
import { Heart } from 'lucide-react';

const FALLBACK_ARRIVALS = [
  {
    _id: 'arr1',
    name: 'Linen Premium Shirt',
    color: 'Olive Green',
    price: 2299,
    compareAtPrice: 3299,
    images: ['/image/collection-shirt.png'],
    category: 'shirt',
    swatches: [
      { color: '#8F9779', name: 'Olive Green' },
      { color: '#5C4033', name: 'Dark Coffee' },
      { color: '#E5D3B3', name: 'Sand Beige' },
      { color: '#DCDCDC', name: 'Stone Grey' }
    ]
  },
  {
    _id: 'arr2',
    name: 'Classic Linen Shirt',
    color: 'Sky Blue',
    price: 2199,
    compareAtPrice: 2999,
    images: ['/image/collection-summer-edit.jpg'],
    category: 'shirt'
  },
  {
    _id: 'arr3',
    name: 'Linen Blend Shirt',
    color: 'Burgundy',
    price: 2399,
    compareAtPrice: 3499,
    images: ['/image/collection-signature.webp'],
    category: 'shirt'
  },
  {
    _id: 'arr4',
    name: 'Textured Shirt',
    color: 'Navy',
    price: 2199,
    compareAtPrice: 3199,
    images: ['/image/collection-signature.webp'],
    category: 'shirt'
  },
  {
    _id: 'arr5',
    name: 'Casual Shirt',
    color: 'Dark Brown',
    price: 1999,
    compareAtPrice: 2799,
    images: ['/image/collection-shirt.png'],
    category: 'shirt'
  },
  {
    _id: 'arr6',
    name: 'Polo Shirt',
    color: 'Cream',
    price: 1499,
    compareAtPrice: 2199,
    images: ['/image/collection-summer-edit.jpg'],
    category: 'shirt'
  }
];

const ProductGrid = ({ onProductSelect, onNavigate, wishlist = [], onToggleWishlist }) => {
  const [arrivals, setArrivals] = useState(FALLBACK_ARRIVALS);
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

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
          const arrivalsItems = data.filter(p => p.category !== 'combo').slice(0, 6);
          if (arrivalsItems.length > 0) {
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

  const toggleWishlist = (product, e) => {
    if (e) e.stopPropagation();
    onToggleWishlist && onToggleWishlist(product);
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
        </div>

        {/* arrivals layout: 6 columns grid matching the mockup exactly */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {(arrivals.length > 0 ? arrivals : FALLBACK_ARRIVALS).map((prod) => (
            <div 
              key={prod._id}
              onClick={() => onProductSelect && onProductSelect(prod)}
              className="group bg-white border border-neutral-200/40 p-4 flex flex-col justify-between text-left cursor-pointer transition-shadow hover:shadow-md rounded-xl"
            >
              <div className="space-y-4">
                {/* Image container */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-200 rounded-lg">
                  <img 
                    src={prod.images[0]} 
                    alt={prod.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <span className="absolute top-2 left-2 bg-[#c5a880] text-black text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 font-sans rounded-sm">NEW</span>
                  <button 
                    onClick={(e) => toggleWishlist(prod, e)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/85 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm transition-colors"
                  >
                    <Heart size={12} fill={wishlist.some(item => item._id === prod._id) ? "#ef4444" : "none"} className={wishlist.some(item => item._id === prod._id) ? "text-red-500" : ""} />
                  </button>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <h3 className="text-gray-900 font-heading text-[13px] font-medium leading-snug truncate group-hover:underline decoration-1 underline-offset-2 select-none">
                    {prod.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans font-bold uppercase tracking-widest">{prod.color || 'Signature Style'}</p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100/60 mt-4">
                <span className="text-[13px] font-bold text-gray-900 font-sans">
                  {formatPrice(prod.price)}
                </span>
                <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-[#c5a880] group-hover:underline">
                  + Add
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default ProductGrid;
