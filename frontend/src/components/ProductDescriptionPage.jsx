import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowLeft, Ruler } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const ProductDescriptionPage = ({ product, onBack, onAddToCart, onBuyNow }) => {
  // If no product is passed, we default to the Brown & Beige Combo
  const defaultProduct = {
    _id: 'c1',
    name: 'Old Money Classic Combo (Brown & Beige)',
    price: 2099,
    compareAtPrice: 2999,
    images: [
      '/image/collection-signature.webp',
      '/image/beige-pant-2.jpg',
      '/image/beige-pant-3.jpg'
    ],
    description: 'Effortless sophistication in a single set, curated for the man who values heritage over trends. Experience the weight of premium fabric and our artisanal craftsmanship, delivered to your door in our signature Deep Plum box.',
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'combo'
  };

  const currentProduct = product || defaultProduct;

  const [selectedImage, setSelectedImage] = useState(currentProduct.images[0]);
  const [shirtSize, setShirtSize] = useState('S');
  const [pantSize, setPantSize] = useState('28');
  const [quantity, setQuantity] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');

  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');

  // Fetch reviews
  useEffect(() => {
    if (currentProduct && currentProduct._id) {
      fetch(`${API_BASE_URL}/api/reviews/product/${currentProduct._id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setReviews(data);
          }
        })
        .catch(err => console.warn('Could not fetch product reviews:', err.message));
    }
  }, [currentProduct]);

  // Fetch related products
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Filter related products by category or just show others
          const filtered = data.filter(p => p._id !== currentProduct._id).slice(0, 4);
          setRelatedProducts(filtered);
        }
      })
      .catch(err => console.warn('Could not fetch related products:', err.message));
  }, [currentProduct]);

  useEffect(() => {
    setSelectedImage(currentProduct.images[0]);
    // Reset sizes based on category
    if (currentProduct.category === 'combo') {
      setShirtSize('S');
      setPantSize('28');
    } else if (currentProduct.category === 'shirt') {
      setShirtSize('S');
    } else {
      setPantSize('30');
    }
  }, [currentProduct]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(value).replace('₹', 'Rs. ');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      setReviewMessage('Please enter your name and comment.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: currentProduct._id,
          name: reviewName,
          rating: Number(reviewRating),
          comment: reviewComment
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setReviews([data.review, ...reviews]);
        setReviewName('');
        setReviewComment('');
        setReviewRating(5);
        setReviewMessage('Review submitted successfully! Thank you.');
      } else {
        setReviewMessage(data.message || 'Failed to submit review.');
      }
    } catch (err) {
      console.error('Submit review error:', err);
      setReviewMessage('Error connecting to review server.');
    }
  };

  const getCombinedSizeString = () => {
    if (currentProduct.category === 'combo') {
      return `${shirtSize} / ${pantSize}`;
    } else if (currentProduct.category === 'shirt') {
      return shirtSize;
    } else {
      return pantSize;
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      const sizeStr = getCombinedSizeString();
      onAddToCart(currentProduct, sizeStr, quantity);
    }
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      const sizeStr = getCombinedSizeString();
      onBuyNow(currentProduct, sizeStr, quantity);
    }
  };

  return (
    <div className="bg-[#f5f5f0] min-h-screen text-[#1a1a1a] font-body pb-32 pt-6 relative text-left">
      
      {/* Back Button */}
      <div className="max-w-[1100px] mx-auto px-4 mb-4">
        <button 
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-[12px] uppercase tracking-wider text-gray-500 hover:text-black font-sans font-semibold transition-colors"
        >
          <span>← Back to Collection</span>
        </button>
      </div>

      <div className="max-w-[1100px] mx-auto px-4">
        
        {/* Main Product Panel (Two Columns) */}
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16 mb-16">
          
          {/* Left Column: Vertically stacked image gallery */}
          <div className="w-full md:w-3/5 space-y-4">
            <div className="w-full aspect-[3/4] overflow-hidden bg-white border border-[#e5e5e0]">
              <img 
                src={selectedImage} 
                alt={currentProduct.name} 
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {currentProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-[3/4] overflow-hidden bg-white border ${
                    selectedImage === img ? 'border-[#1a1a1a] border-[2px]' : 'border-[#e5e5e0]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-center" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Sticky Product details panel */}
          <div className="w-full md:w-2/5 flex flex-col justify-start">
            <span className="text-[10px] font-sans font-bold tracking-widest text-gray-400 uppercase mb-1.5 block">
              FINELEGENDS
            </span>
            <h1 className="text-[28px] sm:text-[34px] font-heading font-medium leading-tight mb-4 text-[#1a1a1a]">
              {currentProduct.name}
            </h1>

            {/* Prices & Sale Tag */}
            <div className="flex items-center text-[16px] sm:text-[18px] font-sans mb-6">
              {currentProduct.compareAtPrice && (
                <span className="line-through text-gray-400 mr-3.5 font-light">
                  {formatPrice(currentProduct.compareAtPrice)}
                </span>
              )}
              <span className="font-extrabold text-black mr-4">{formatPrice(currentProduct.price)}</span>
              {currentProduct.compareAtPrice && (
                <span className="bg-[#002349] text-white text-[10px] font-sans font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm">
                  SALE
                </span>
              )}
            </div>

            {/* Sizes Selection */}
            <div className="space-y-6 mb-8">
              
              {/* Shirt Size (If Combo or Shirt) */}
              {(currentProduct.category === 'combo' || currentProduct.category === 'shirt') && (
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider block mb-2 text-gray-400">
                    SIZE OF SHIRT
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setShirtSize(size)}
                        className={`w-11 h-11 text-[12px] border font-sans font-semibold transition-all ${
                          shirtSize === size
                            ? 'border-[#002349] bg-[#002349] text-white'
                            : 'border-gray-200 hover:border-gray-400 bg-white text-gray-800'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pant Size (If Combo or Pant) */}
              {(currentProduct.category === 'combo' || currentProduct.category === 'pant') && (
                <div>
                  <label className="text-[10px] font-sans font-bold uppercase tracking-wider block mb-2 text-gray-400">
                    SIZE OF PANT
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['28', '30', '32', '34', '36', '38'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setPantSize(size)}
                        className={`w-11 h-11 text-[12px] border font-sans font-semibold transition-all ${
                          pantSize === size
                            ? 'border-[#002349] bg-[#002349] text-white'
                            : 'border-gray-200 hover:border-gray-400 bg-white text-gray-800'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Chart Link */}
              <div>
                <button 
                  onClick={() => setShowSizeChart(true)}
                  className="inline-flex items-center space-x-1 text-[11px] text-gray-500 hover:text-black font-sans font-semibold underline underline-offset-2 uppercase tracking-wide"
                >
                  <Ruler size={13} className="mr-0.5" />
                  <span>Size Chart</span>
                </button>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-[10px] font-sans font-bold uppercase tracking-wider block mb-2 text-gray-400">
                  QUANTITY
                </label>
                <div className="flex items-center border border-gray-200 font-sans w-24 justify-between bg-white text-[12px]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1.5 text-gray-400 hover:text-black font-semibold text-[14px]"
                  >
                    -
                  </button>
                  <span className="px-2 py-1.5 font-bold text-gray-800">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1.5 text-gray-400 hover:text-black font-semibold text-[14px]"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Gift Packing Note */}
            <div className="border-y border-[#ebd9aa]/20 py-4 mb-8 text-[13px] font-sans text-[#6b6b66] leading-relaxed">
              Delivered in our Signature Deep Plum Box — The Perfect Gift for a Legend.
            </div>

            {/* Checkout Actions */}
            <div className="space-y-4">
              {currentProduct.availability === false ? (
                <button 
                  disabled
                  className="w-full py-4 bg-gray-200 border border-gray-300 text-gray-400 cursor-not-allowed uppercase text-[13px] font-sans tracking-widest font-semibold"
                >
                  Out of Stock
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-[#002349] text-white hover:bg-[#002349]/90 transition-colors uppercase text-[13px] font-sans tracking-widest font-bold"
                  >
                    Add to cart
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="w-full py-4 bg-black text-white hover:bg-black/90 transition-opacity uppercase text-[13px] font-sans tracking-widest font-bold"
                  >
                    Buy now
                  </button>
                </>
              )}
            </div>

          </div>

        </div>

        {/* Brand Copy & Story Section (Dress with Class) */}
        <div className="border-t border-[#e5e5e0] pt-16 mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-[26px] sm:text-[32px] font-heading font-medium tracking-wide uppercase mb-6">
            Dress With Class
          </h2>
          <p className="text-[14px] sm:text-[15px] leading-relaxed font-sans text-[#6b6b66] tracking-wide max-w-2xl mx-auto mb-10">
            We started this brand because we felt something was missing in today's fashion — the quiet confidence, timeless style, and effortless charm of the old money vibe. We grew up admiring people who didn't have to show off — their simple, elegant clothes spoke for them. That feeling inspired us to bring back that understated elegance, but in a way that's easy for you. That's why we create thoughtfully matched combos — duos that make dressing well simple yet stylish. Each combo is designed to help you feel confident, classy, and part of something bigger — a world where your presence speaks louder than words.
          </p>

          {/* Secondary Vertically stacked gallery */}
          <div className="space-y-8 mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <img src={currentProduct.images[0]} alt="" className="w-full aspect-[3/4] object-cover object-center border border-[#e5e5e0]" />
              <img src={currentProduct.images[1] || currentProduct.images[0]} alt="" className="w-full aspect-[3/4] object-cover object-center border border-[#e5e5e0]" />
            </div>
            <div className="bg-[#ebd9aa]/10 p-8 sm:p-12 text-center border border-[#ebd9aa]/20">
              <p className="text-[15px] sm:text-[16px] leading-relaxed font-sans text-[#1a1a1a] mb-4">
                stitching and classic button-down design elevate the look.<br />
                Whether you're strolling through the Hamptons or attending an exclusive garden party, the Classic Duo by FineLegends is your go-to outfit for a polished, timeless appearance.
              </p>
              <div className="text-[13px] font-sans font-semibold uppercase tracking-wider text-[#8c8c82]">
                Material: Lotus Linen
              </div>
            </div>
          </div>
        </div>

        {/* Join the Circle of Legends (Social Proof Banner) */}
        <div className="bg-[#002349] text-white p-8 sm:p-12 text-center mb-16 border-y border-[#ebd9aa]/20">
          <h2 className="text-[22px] sm:text-[28px] font-heading font-medium tracking-wide uppercase mb-3 text-[#ebd9aa]">
            Join the Circle of Legends
          </h2>
          <p className="text-[13px] sm:text-[14px] leading-relaxed font-sans max-w-2xl mx-auto mb-6 text-gray-300">
            Trusted by over 55,000+ modern legends across India an exclusive community bound by timeless style, refined living, and understated luxury.
          </p>
          <div className="flex flex-col items-center justify-center space-y-1">
            <span className="text-yellow-400 text-lg">★★★★★</span>
            <span className="text-[13px] font-sans font-semibold tracking-wider text-[#ebd9aa]">
              4.6 / 5 — Rated by the Circle of Legends
            </span>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-2xl mx-auto mb-16 text-left px-4">
          <h3 className="text-[20px] font-heading font-medium mb-8 uppercase tracking-wider border-b border-[#e5e5e0] pb-3">
            Customer Reviews ({reviews.length})
          </h3>
          
          {/* List of Reviews */}
          <div className="space-y-6 mb-12">
            {reviews.map((r, idx) => (
              <div key={r._id || idx} className="border-b border-[#e5e5e0] pb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-sans font-semibold text-[14px] text-gray-800">{r.name}</span>
                  <span className="text-yellow-500 text-[12px]">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </span>
                </div>
                <p className="text-[13px] text-[#6b6b66] leading-relaxed">
                  {r.comment}
                </p>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-[13px] text-gray-400 text-center py-6">
                No reviews yet. Be the first to share your thoughts!
              </div>
            )}
          </div>

          {/* Write a Review Form */}
          <div className="bg-[#f5f5f0] border border-[#e5e5e0] p-6 rounded-none">
            <h4 className="text-[15px] font-heading font-semibold uppercase tracking-wider mb-4 text-[#1a1a1a]">
              Write a review
            </h4>
            
            {reviewMessage && (
              <div className={`p-3 text-[12px] mb-4 border ${
                reviewMessage.includes('successfully') 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {reviewMessage}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4 text-[13px]">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="font-medium text-gray-500 uppercase tracking-wide text-[10px]">Your Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your name"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-black font-semibold text-gray-700 bg-white"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-medium text-gray-500 uppercase tracking-wide text-[10px]">Rating</label>
                  <select 
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}
                    className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-black font-semibold text-gray-700 bg-white"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                    <option value={2}>2 Stars (Poor)</option>
                    <option value={1}>1 Star (Very Poor)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-medium text-gray-500 uppercase tracking-wide text-[10px]">Comment</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Share your thoughts about this apparel..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 focus:outline-none focus:border-black font-semibold text-gray-700 bg-white"
                />
              </div>

              <button 
                type="submit"
                className="px-6 py-2.5 bg-black text-white text-[11px] font-bold uppercase tracking-wider hover:opacity-90"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Sticky Bottom buying bar */}
      <div className="fixed bottom-0 inset-x-0 bg-[#f5f5f0]/95 border-t border-[#e5e5e0] py-4 px-4 sm:px-8 z-30 shadow-lg backdrop-blur-md">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-4">
          
          {/* Left Column: Product Info */}
          <div className="flex items-center space-x-3">
            <img 
              src={currentProduct.images[0]} 
              alt="" 
              className="h-12 w-9 object-cover border border-[#e5e5e0]" 
            />
            <div className="hidden sm:block">
              <h4 className="text-[13px] font-heading font-semibold leading-none">{currentProduct.name}</h4>
              <span className="text-[12px] font-sans font-medium mt-1 block">{formatPrice(currentProduct.price)}</span>
            </div>
          </div>

          {/* Right Column: Size Select and Action */}
          <div className="flex items-center space-x-3 flex-1 sm:flex-initial justify-end">
            
            {/* Size dropdown */}
            <div className="relative">
              <select 
                value={getCombinedSizeString()}
                onChange={(e) => {
                  const val = e.target.value;
                  if (currentProduct.category === 'combo') {
                    const [s, p] = val.split(' / ');
                    setShirtSize(s);
                    setPantSize(p);
                  } else if (currentProduct.category === 'shirt') {
                    setShirtSize(val);
                  } else {
                    setPantSize(val);
                  }
                }}
                className="bg-transparent border border-[#1a1a1a] px-3 py-2 text-[13px] font-sans font-medium focus:ring-0 focus:outline-none pr-8 cursor-pointer rounded-none"
              >
                {currentProduct.category === 'combo' ? (
                  ['S', 'M', 'L', 'XL'].flatMap(s => 
                    ['28', '30', '32', '34', '36', '38'].map(p => (
                      <option key={`${s}-${p}`} value={`${s} / ${p}`}>{`${s} / ${p}`}</option>
                    ))
                  )
                ) : currentProduct.category === 'shirt' ? (
                  ['S', 'M', 'L', 'XL'].map(s => <option key={s} value={s}>{s}</option>)
                ) : (
                  ['28', '30', '32', '34', '36', '38'].map(p => <option key={p} value={p}>{p}</option>)
                )}
              </select>
            </div>

            {/* Add to cart */}
            {currentProduct.availability === false ? (
              <button 
                disabled
                className="px-6 py-2.5 bg-gray-200 border border-gray-300 text-gray-400 cursor-not-allowed uppercase text-[12px] font-sans tracking-wider font-semibold"
              >
                Out of Stock
              </button>
            ) : (
              <button 
                onClick={handleAddToCart}
                className="px-6 py-2.5 bg-[#002349] text-white hover:bg-[#002349]/90 transition-colors uppercase text-[12px] font-sans tracking-wider font-bold"
              >
                ADD TO CART
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-[#f5f5f0] border border-[#e5e5e0] max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-heading font-semibold uppercase tracking-wider mb-4 text-left">
              Size Chart
            </h3>
            
            {/* Table */}
            <table className="w-full text-left border-collapse border border-gray-300 text-[12px]">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2 font-semibold">Waist (Pants)</th>
                  <th className="border border-gray-300 p-2 font-semibold">Chest (Shirt)</th>
                  <th className="border border-gray-300 p-2 font-semibold">Length (Inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">28 / S</td>
                  <td className="border border-gray-300 p-2">36 - 38"</td>
                  <td className="border border-gray-300 p-2">38.5"</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">30 / M</td>
                  <td className="border border-gray-300 p-2">38 - 40"</td>
                  <td className="border border-gray-300 p-2">39.0"</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">32 / L</td>
                  <td className="border border-gray-300 p-2">40 - 42"</td>
                  <td className="border border-gray-300 p-2">39.5"</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">34 / XL</td>
                  <td className="border border-gray-300 p-2">42 - 44"</td>
                  <td className="border border-gray-300 p-2">40.0"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

// Simple Close Icon mapping since Lucide doesn't have it named inside standard imports
const X = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default ProductDescriptionPage;
