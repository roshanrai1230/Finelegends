import React from 'react';

const products = [
  {
    id: 1,
    name: 'The Essential Tee',
    price: 'Rs. 1,299.00',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Classic Denim Jacket',
    price: 'Rs. 3,499.00',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Everyday Chinos',
    price: 'Rs. 2,199.00',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Signature Blouse',
    price: 'Rs. 2,899.00',
    image: 'https://images.unsplash.com/photo-150cc36125345-0d057a62b8c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  }
];

const ProductGrid = () => {
  return (
    <div id="products" className="bg-[#f5f5f0] py-16">
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold text-[#1a1a1a]">Featured collection</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col text-left">
              <div className="w-full bg-gray-200 aspect-[3/4] overflow-hidden mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
              </div>
              <h3 className="text-lg text-[#1a1a1a] font-body mb-1 hover:underline decoration-1 underline-offset-4 cursor-pointer">
                {product.name}
              </h3>
              <p className="text-lg text-[#1a1a1a] font-body mb-4">{product.price}</p>
              <button className="w-full py-3 border border-[#1a1a1a] text-[#1a1a1a] font-body text-base hover:border-[2px] transition-all bg-transparent">
                Choose options
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a href="#" className="btn-primary">
            View all
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
