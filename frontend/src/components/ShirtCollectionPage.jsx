import React, { useState, useEffect } from 'react';

const SHIRTS_FALLBACK = [
  {
    _id: 's1',
    name: 'FineLegends™ Cuban Classic Shirt',
    price: 1699,
    compareAtPrice: 2499,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500'
    ],
    description: 'A breathable summer classic designed for hot climates, featuring our signature Cuban collar and premium lightweight cotton blend.',
    sizes: ['S', 'M', 'L', 'XL'],
    onSale: true,
    availability: true,
    category: 'shirt'
  },
  {
    _id: 's2',
    name: 'FineLegends™ Linen Signature Shirt',
    price: 1999,
    compareAtPrice: 2999,
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500'
    ],
    description: 'Crafted from premium flax linen, this shirt features a relaxed silhouette and offers unparalleled breathability and clean, structured drape.',
    sizes: ['S', 'M', 'L', 'XL'],
    onSale: true,
    availability: true,
    category: 'shirt'
  },
  {
    _id: 's3',
    name: 'FineLegends™ Retro Resort Shirt',
    price: 1299,
    compareAtPrice: 1999,
    images: [
      'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=500',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'
    ],
    description: 'Evoke Mediterranean elegance with our retro-inspired resort shirt. The perfect layering piece for coastal getaways.',
    sizes: ['S', 'M', 'L', 'XL'],
    onSale: true,
    availability: true,
    category: 'shirt'
  }
];

const ShirtCollectionPage = ({ onProductSelect }) => {
  const [products, setProducts] = useState(SHIRTS_FALLBACK);
  const [loading, setLoading] = useState(true);

  // Fetch shirts dynamically from DB
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const shirts = data.filter(p => p.category === 'shirt');
          if (shirts.length > 0) {
            setProducts(shirts);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Backend API connection failed, using offline shirt data:', err.message);
        setLoading(false);
      });
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
    <div className="bg-[#f5f5f0] min-h-screen text-[#1a1a1a] font-body pb-20 text-left">
      
      {/* Title */}
      <div className="py-8 bg-[#f5f5f0] text-center border-b border-[#e5e5e0]">
        <h1 className="text-[32px] sm:text-[40px] font-heading font-medium tracking-wide">
          The Shirt
        </h1>
      </div>

      {/* Hero Banner Section */}
      <div className="w-full overflow-hidden relative min-h-[50vh] flex items-center justify-center bg-gray-900 mb-8">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&q=80" 
          alt="The Shirt Collection Banner" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="relative z-10 text-center text-white px-4 max-w-2xl">
          <h2 className="text-3xl sm:text-5xl font-heading mb-4 font-semibold">Elevate Your Upper Layer</h2>
          <p className="text-lg font-light text-gray-200">Timeless shirts hand-tailored from premium materials. Built for the modern legend.</p>
        </div>
      </div>

      {/* Filters and count bar */}
      <div className="max-w-[1100px] mx-auto px-4 py-8 border-b border-[#e5e5e0] mb-8 flex justify-between items-center text-[14px]">
        <div className="flex items-center space-x-6">
          <span className="text-[#6b6b66] font-medium font-sans">Filter:</span>
          <span>Availability (All)</span>
          <span>Price (All)</span>
        </div>
        <div className="text-[#6b6b66] font-sans">
          {products.length} {products.length === 1 ? 'product' : 'products'}
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="max-w-[1100px] mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002349]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-10 sm:gap-y-16">
            {products.map((product) => (
              <div key={product._id} className="group flex flex-col text-left">
                
                {/* Image Container with Hover Swap */}
                <div 
                  onClick={() => onProductSelect && onProductSelect(product)}
                  className="relative w-full aspect-[3/4] overflow-hidden mb-5 bg-[#ebd9aa]/10 border border-[#e5e5e0] cursor-pointer"
                >
                  {/* Secondary Image (Visible on Hover) */}
                  <img
                    src={product.images[1] || product.images[0]}
                    alt={`${product.name} alternate view`}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                  {/* Primary Image (Fades out on Hover) */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-105"
                  />
                  
                  {/* Sale Tag or Out of Stock Tag */}
                  {product.availability === false ? (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-sans font-medium px-3.5 py-1 tracking-wider uppercase z-10">
                      Sold Out
                    </div>
                  ) : product.onSale && (
                    <div className="absolute top-3 left-3 bg-[#002349] text-white text-[11px] font-sans font-medium px-3.5 py-1 tracking-wider uppercase z-10">
                      Sale
                    </div>
                  )}

                  {/* Choose options Overlay */}
                  {product.availability === false ? (
                    <div className="absolute inset-x-0 bottom-0 bg-red-600/90 py-3 text-center text-white text-[13px] uppercase tracking-widest font-sans font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      Out of Stock
                    </div>
                  ) : (
                    <div className="absolute inset-x-0 bottom-0 bg-[#002349]/90 py-3 text-center text-white text-[13px] uppercase tracking-widest font-sans font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      Choose options
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 
                  onClick={() => onProductSelect && onProductSelect(product)}
                  className="text-[17px] sm:text-[19px] text-[#1a1a1a] font-heading font-medium mb-1.5 hover:underline decoration-1 underline-offset-4 cursor-pointer"
                >
                  {product.name}
                </h3>

                {/* Prices */}
                <div className="flex items-center text-[15px] sm:text-[16px] text-[#1a1a1a] font-sans">
                  {product.compareAtPrice && (
                    <span className="line-through text-[#8c8c82] mr-3 font-light">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                  <span className="font-semibold text-[#1a1a1a]">
                    {formatPrice(product.price)}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ShirtCollectionPage;
