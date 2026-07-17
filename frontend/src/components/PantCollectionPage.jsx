import React, { useState, useEffect } from 'react';
import { ChevronDown, ShoppingBag, X } from 'lucide-react';

const FALLBACK_PRODUCTS = [
  {
    _id: '1',
    name: 'FineLegends™ Classic Beige Pant',
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
    availability: true
  },
  {
    _id: '2',
    name: 'FineLegends™ Classic White Pants',
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
    availability: true
  },
  {
    _id: '3',
    name: 'FineLegends™ Classic Black Pant',
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
    availability: true
  }
];

const PantCollectionPage = ({ onAddToCart }) => {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  // Filter dropdown states
  const [showAvailability, setShowAvailability] = useState(false);
  const [showPrice, setShowPrice] = useState(false);

  // Filter values
  const [filterInStock, setFilterInStock] = useState(true);
  const [filterOutOfStock, setFilterOutOfStock] = useState(true);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Quick View Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('32');
  const [quantity, setQuantity] = useState(1);

  // Fetch products from Express backend
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Backend API connection failed, using offline fallback data:', err.message);
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filteredProducts = products.filter((product) => {
    // Availability Filter
    if (!filterInStock && product.availability) return false;
    if (!filterOutOfStock && !product.availability) return false;

    // Price Filter
    if (minPrice !== '' && product.price < parseFloat(minPrice)) return false;
    if (maxPrice !== '' && product.price > parseFloat(maxPrice)) return false;

    return true;
  });

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(value).replace('₹', 'Rs. ');
  };

  const handleResetFilters = () => {
    setFilterInStock(true);
    setFilterOutOfStock(true);
    setMinPrice('');
    setMaxPrice('');
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[2] || '32');
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (onAddToCart && selectedProduct) {
      onAddToCart(selectedProduct, selectedSize, quantity);
      setSelectedProduct(null); // Close modal
    }
  };

  return (
    <div className="bg-[#f5f5f0] min-h-screen text-[#1a1a1a] font-body pb-20">
      
      {/* Centered Collection Header */}
      <div className="py-8 bg-[#f5f5f0] text-center border-b border-[#e5e5e0]">
        <h1 className="text-[32px] sm:text-[40px] font-heading font-medium tracking-wide">
          The Pant
        </h1>
      </div>

      {/* Hero Banner Section */}
      <div className="w-full relative min-h-[75vh] md:min-h-[85vh] overflow-hidden flex items-center justify-center bg-[#f5f5f0]">
        <img 
          src="/image/hero-banner.png" 
          alt="The Pant Collection Banner" 
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        {/* Card Overlay (Centered vertically and horizontally) */}
        <div className="relative z-10 bg-[#f5f5f0] border border-[#e5e5e0] px-8 py-8 sm:px-12 sm:py-10 max-w-[650px] w-[90%] text-center shadow-sm mx-auto">
          <p className="text-[13px] sm:text-[14px] leading-relaxed tracking-wide font-sans text-[#1a1a1a]">
            Effortless sophistication in a single set, curated for the man who values heritage over trends. Experience the weight of premium fabric and our artisanal craftsmanship, delivered to your door in our signature Deep Plum box.
          </p>
        </div>
      </div>

      {/* Filter and Count Section (Constrained max-width to match layout) */}
      <div className="max-w-[1100px] mx-auto px-4 py-8 border-b border-[#e5e5e0] mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
          
          {/* Filters (Left Side) */}
          <div className="flex items-center space-x-6 text-[14px]">
            <span className="text-[#6b6b66] font-medium font-sans">Filter:</span>
            
            {/* Availability Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowAvailability(!showAvailability);
                  setShowPrice(false);
                }}
                className="flex items-center space-x-1 py-1 hover:text-[#002349] transition-colors focus:outline-none"
              >
                <span>Availability</span>
                <ChevronDown size={14} className={`transform transition-transform ${showAvailability ? 'rotate-180' : ''}`} />
              </button>

              {showAvailability && (
                <div className="absolute left-0 mt-2 w-56 bg-[#f5f5f0] border border-[#e5e5e0] shadow-lg rounded-none p-4 z-20">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e5e5e0] mb-3">
                    <span className="text-[12px] text-[#6b6b66]">0 selected</span>
                    <button 
                      onClick={() => {
                        setFilterInStock(true);
                        setFilterOutOfStock(true);
                      }}
                      className="text-[12px] underline hover:text-[#002349]"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer text-[14px]">
                      <input 
                        type="checkbox" 
                        checked={filterInStock}
                        onChange={(e) => setFilterInStock(e.target.checked)}
                        className="rounded-none border-[#1a1a1a] text-[#002349] focus:ring-0" 
                      />
                      <span>In stock</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer text-[14px]">
                      <input 
                        type="checkbox" 
                        checked={filterOutOfStock}
                        onChange={(e) => setFilterOutOfStock(e.target.checked)}
                        className="rounded-none border-[#1a1a1a] text-[#002349] focus:ring-0" 
                      />
                      <span>Out of stock</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Price Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowPrice(!showPrice);
                  setShowAvailability(false);
                }}
                className="flex items-center space-x-1 py-1 hover:text-[#002349] transition-colors focus:outline-none"
              >
                <span>Price</span>
                <ChevronDown size={14} className={`transform transition-transform ${showPrice ? 'rotate-180' : ''}`} />
              </button>

              {showPrice && (
                <div className="absolute left-0 mt-2 w-64 bg-[#f5f5f0] border border-[#e5e5e0] shadow-lg rounded-none p-4 z-20">
                  <div className="flex justify-between items-center pb-2 border-b border-[#e5e5e0] mb-3">
                    <span className="text-[12px] text-[#6b6b66]">The highest price is Rs. 1,999.00</span>
                    <button 
                      onClick={() => {
                        setMinPrice('');
                        setMaxPrice('');
                      }}
                      className="text-[12px] underline hover:text-[#002349]"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-[#1a1a1a] px-2 py-1 bg-transparent w-1/2">
                      <span className="text-[12px] text-[#6b6b66] mr-1">Rs.</span>
                      <input 
                        type="number" 
                        placeholder="From"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-[13px]"
                      />
                    </div>
                    <div className="flex items-center border border-[#1a1a1a] px-2 py-1 bg-transparent w-1/2">
                      <span className="text-[12px] text-[#6b6b66] mr-1">Rs.</span>
                      <input 
                        type="number" 
                        placeholder="To"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-[13px]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Count (Right Side) */}
          <div className="text-[14px] text-[#6b6b66] font-sans sm:ml-auto">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </div>

        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showAvailability || showPrice) && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => {
            setShowAvailability(false);
            setShowPrice(false);
          }}
        />
      )}

      {/* Product Grid Section (Constrained max-width to match layout exactly) */}
      <div className="max-w-[1100px] mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002349]"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-[18px]">
            No products found matching the filters.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-10 sm:gap-y-16">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group flex flex-col text-left">
                
                {/* Image Container with Hover Swap */}
                <div 
                  onClick={() => handleQuickView(product)}
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
                  
                  {/* Sale Tag */}
                  {product.onSale && (
                    <div className="absolute top-3 left-3 bg-[#002349] text-white text-[11px] font-sans font-medium px-3.5 py-1 tracking-wider uppercase">
                      Sale
                    </div>
                  )}

                  {/* Quick View Button on Hover */}
                  <div className="absolute inset-x-0 bottom-0 bg-[#002349]/90 py-3 text-center text-white text-[13px] uppercase tracking-widest font-sans font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    Choose options
                  </div>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => handleQuickView(product)}
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

      {/* Quick View / Size Options Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50 animate-fade-in">
          <div className="bg-[#f5f5f0] border border-[#e5e5e0] max-w-2xl w-full p-6 sm:p-8 relative flex flex-col md:flex-row gap-6">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-[#1a1a1a] hover:opacity-70 transition-opacity"
            >
              <X size={20} />
            </button>

            {/* Left Column: Image */}
            <div className="w-full md:w-1/2 aspect-[3/4] overflow-hidden bg-white">
              <img 
                src={selectedProduct.images[0]} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Right Column: Options details */}
            <div className="w-full md:w-1/2 flex flex-col justify-between text-left">
              <div>
                <h2 className="text-[20px] font-heading font-medium mb-2">{selectedProduct.name}</h2>
                <div className="flex items-center text-[16px] mb-4">
                  {selectedProduct.compareAtPrice && (
                    <span className="line-through text-[#8c8c82] mr-3">
                      {formatPrice(selectedProduct.compareAtPrice)}
                    </span>
                  )}
                  <span className="font-semibold">{formatPrice(selectedProduct.price)}</span>
                </div>
                
                <p className="text-[13px] text-[#6b6b66] font-sans mb-6">
                  {selectedProduct.description}
                </p>

                {/* Size options list */}
                <div className="mb-6">
                  <label className="text-[12px] font-sans font-semibold uppercase tracking-wider block mb-2">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-[13px] border font-sans font-medium transition-all ${
                          selectedSize === size
                            ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                            : 'border-gray-300 hover:border-gray-400 bg-transparent'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6 flex items-center gap-4">
                  <label className="text-[12px] font-sans font-semibold uppercase tracking-wider block">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-300 font-sans">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-[15px]"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-[14px] font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-[15px]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to cart */}
              <button 
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#002349] text-white uppercase text-[13px] font-sans tracking-widest font-medium hover:opacity-90 transition-opacity"
              >
                Add to bag
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PantCollectionPage;
