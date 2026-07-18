import React, { useState, useEffect } from 'react';

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

const ProductGrid = ({ onProductSelect }) => {
  const [combos, setCombos] = useState(FALLBACK_COMBOS);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const comboItems = data.filter(p => p.category === 'combo');
          if (comboItems.length > 0) {
            setCombos(comboItems);
          }
        }
      })
      .catch(err => console.warn('Backend API connection failed, using offline combos:', err.message));
  }, []);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(value).replace('₹', 'Rs. ');
  };

  return (
    <div id="products" className="bg-[#f5f5f0] pt-8 pb-20 text-left">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Section Header */}
        <div className="mb-12 text-left">
          <h2 className="text-[32px] md:text-[44px] font-heading font-medium text-[#1a1a1a] mb-3">
            The Signature Duos
          </h2>
          <p className="text-[#555555] font-body text-[15px] md:text-[17px]">
            Effortless sophistication in a single set. Our curated combos are designed for the modern legend.
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
                    Out of Stock
                  </div>
                )}
                {product.availability !== false && (
                  <div className="absolute top-3 left-3 bg-[#002349] text-white text-[12px] font-body px-3 py-1">
                    Sale
                  </div>
                )}
              </div>

              {/* Product Info */}
              <h3 className="text-[14px] md:text-[15px] text-[#1a1a1a] font-body font-medium mb-1 group-hover:underline decoration-[1px] underline-offset-4 leading-snug">
                {product.name}
              </h3>
              
              {/* Pricing */}
              <div className="flex items-center space-x-2 mt-1 font-sans">
                {product.compareAtPrice && (
                  <span className="text-[13px] md:text-[14px] text-gray-500 line-through font-light">
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
        
      </div>
    </div>
  );
};

export default ProductGrid;
