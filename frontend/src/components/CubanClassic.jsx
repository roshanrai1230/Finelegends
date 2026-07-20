import React from 'react';

const products = [
  {
    id: 1,
    name: 'Old Money Cuban Collar Combo (Grey & Black)',
    originalPrice: 'Rs. 2,999.00',
    price: 'Rs. 1,899.00',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Old Money Cuban Combo (Maroon & Beige)',
    originalPrice: 'Rs. 2,999.00',
    price: 'Rs. 1,899.00',
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  }
];

const CubanClassic = () => {
  return (
    <div className="bg-[#f5f5f0] pt-16 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Section Header */}
        <div className="mb-12 text-left">
          <h2 className="text-[32px] md:text-[44px] font-heading font-medium text-[#1a1a1a] mb-3">
            The Cuban Classic
          </h2>
          <p className="text-[#555555] font-body text-[15px] md:text-[17px]">
            Effortless Summer Sophistication. The relaxed silhouette for the modern legend.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 lg:gap-x-8">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col text-left cursor-pointer">
              
              {/* Image Container */}
              <div className="relative w-full bg-gray-200 aspect-[3/4] overflow-hidden mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-center object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-in-out"
                />
                {/* Sale Badge */}
                <div className="absolute top-3 left-3 bg-black text-white text-[12px] font-body px-3 py-1">
                  Sale
                </div>
              </div>

              {/* Product Info */}
              <h3 className="text-[14px] md:text-[15px] text-[#1a1a1a] font-body font-medium mb-1 group-hover:underline decoration-[1px] underline-offset-4 leading-snug">
                {product.name}
              </h3>
              
              {/* Pricing */}
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-[13px] md:text-[14px] text-gray-500 font-body line-through">
                  {product.originalPrice}
                </span>
                <span className="text-[13px] md:text-[14px] text-[#1a1a1a] font-body font-medium">
                  {product.price}
                </span>
              </div>

            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="mt-16 flex justify-center">
          <a 
            href="#" 
            className="bg-black text-white font-body text-[14px] px-10 py-3 hover:opacity-90 transition-opacity"
          >
            View all
          </a>
        </div>
        
      </div>
    </div>
  );
};

export default CubanClassic;
