import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const SearchResultsPage = ({ searchQuery, onProductSelect, onBack }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchQuery) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const lowerQuery = searchQuery.toLowerCase();
          const filtered = data.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) || 
            (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
            (p.category && p.category.toLowerCase().includes(lowerQuery))
          );
          setResults(filtered);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Search query failed:', err.message);
        setLoading(false);
      });
  }, [searchQuery]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(value).replace('₹', 'Rs. ');
  };

  return (
    <div className="bg-[#f5f5f0] min-h-screen text-[#1a1a1a] font-body pb-20 pt-6 text-left">
      
      {/* Back button */}
      <div className="max-w-[1100px] mx-auto px-4 mb-4">
        <button 
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-[14px] text-[#6b6b66] hover:text-[#1a1a1a] font-sans font-medium"
        >
          <ArrowLeft size={16} />
          <span>Back to Store</span>
        </button>
      </div>

      <div className="max-w-[1100px] mx-auto px-4">
        <h1 className="text-[26px] sm:text-[32px] font-heading font-medium mb-2 uppercase tracking-wider border-b border-[#e5e5e0] pb-3">
          Search Results
        </h1>
        <p className="text-[14px] font-sans text-[#6b6b66] mb-8">
          Showing results for "{searchQuery}" &bull; {results.length} {results.length === 1 ? 'item' : 'items'} found
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#002349]"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 font-sans text-gray-500">
            No products found matching "{searchQuery}". Try searching for "pant", "shirt", "combo", or "beige".
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {results.map((product) => (
              <div 
                key={product._id} 
                onClick={() => onProductSelect && onProductSelect(product)}
                className="group flex flex-col text-left cursor-pointer"
              >
                
                {/* Image Container with Hover Swap */}
                <div className="relative w-full aspect-[3/4] overflow-hidden mb-4 bg-[#ebd9aa]/10 border border-[#e5e5e0]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                  {product.onSale && (
                    <div className="absolute top-3 left-3 bg-[#002349] text-white text-[11px] font-sans font-medium px-3.5 py-1 tracking-wider uppercase">
                      Sale
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-[14px] md:text-[15px] text-[#1a1a1a] font-body font-medium mb-1 group-hover:underline decoration-[1px] underline-offset-4 leading-snug">
                  {product.name}
                </h3>

                {/* Prices */}
                <div className="flex items-center text-[13px] md:text-[14px] text-[#1a1a1a] font-sans mt-1">
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

export default SearchResultsPage;
