import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const FALLBACK_REVIEWS = [
  {
    rating: 5,
    comment: "The quality is unbelievable! Perfect fit and looks premium.",
    name: "Rahul Sharma",
    role: "Verified Buyer",
    initials: "RS"
  },
  {
    rating: 5,
    comment: "Fast delivery and the packaging was top-notch. Loved it!",
    name: "Arjun Mehta",
    role: "Verified Buyer",
    initials: "AM"
  },
  {
    rating: 5,
    comment: "BlackDistrict is my go-to brand now. Totally worth it.",
    name: "Vivaan Kapoor",
    role: "Verified Buyer",
    initials: "VK"
  }
];

const Testimonials = () => {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/reviews`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Normalize the dynamic review format to match UI expected fields
          const formattedReviews = data.map(rev => {
            const nameParts = (rev.name || 'Anonymous').split(' ');
            let init = nameParts[0][0];
            if (nameParts.length > 1) init += nameParts[1][0];
            return {
              ...rev,
              role: "Verified Buyer",
              initials: init.toUpperCase(),
              rating: rev.rating || 5,
              comment: rev.comment || ''
            };
          });
          setReviews(formattedReviews);
        }
      })
      .catch(err => console.warn('Failed to fetch dynamic reviews, using fallback:', err));
  }, []);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(reviews.length - 3, prev + 1));
  };

  const displayedReviews = reviews.slice(currentIndex, currentIndex + 3);

  return (
    <div className="w-full bg-[#f5f5f0] py-16 px-6 md:px-12 lg:px-20 border-t border-gray-200/50">
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        {/* Header with Navigation arrows */}
        <div className="flex items-center justify-between font-sans">
          <div className="flex items-center space-x-6">
            <h2 className="text-[20px] sm:text-[24px] font-heading font-medium text-gray-900 tracking-wider uppercase">LOVED BY THOUSANDS</h2>
            <div className="hidden sm:block w-32 h-[1px] bg-gray-300"></div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`p-2 border rounded-full transition-colors ${currentIndex === 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-500 hover:text-black hover:border-black'}`}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={handleNext}
              disabled={currentIndex >= reviews.length - 3}
              className={`p-2 border rounded-full transition-colors ${currentIndex >= reviews.length - 3 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-500 hover:text-black hover:border-black'}`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {displayedReviews.map((rev, idx) => (
            <div 
              key={rev._id || idx}
              className="bg-white border border-[#eae8e4] p-8 rounded-xl text-left flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow min-h-[220px]"
            >
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex items-center space-x-0.5 text-[#c5a880]">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" stroke="none" />
                  ))}
                </div>
                {/* Comment text */}
                <p className="text-[13.5px] sm:text-[14px] text-gray-700 leading-relaxed font-medium">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Profile */}
              <div className="flex items-center space-x-3.5 pt-2 border-t border-gray-100">
                {/* Initials Avatar */}
                <div className="w-9 h-9 rounded-full bg-[#ebd9aa]/20 border border-[#ebd9aa]/45 flex items-center justify-center text-[#8e744a] text-[12px] font-bold">
                  {rev.initials}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[12.5px] font-bold text-gray-900 leading-snug">{rev.name}</h4>
                  <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase leading-none">{rev.role}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Testimonials;
