import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
  {
    stars: 5,
    text: "The quality is unbelievable! Perfect fit and looks premium.",
    name: "Rahul Sharma",
    role: "Verified Buyer",
    initials: "RS"
  },
  {
    stars: 5,
    text: "Fast delivery and the packaging was top-notch. Loved it!",
    name: "Arjun Mehta",
    role: "Verified Buyer",
    initials: "AM"
  },
  {
    stars: 5,
    text: "BlackDistrict is my go-to brand now. Totally worth it.",
    name: "Vivaan Kapoor",
    role: "Verified Buyer",
    initials: "VK"
  }
];

const Testimonials = () => {
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
            <button className="p-2 border border-gray-300 text-gray-500 hover:text-black hover:border-black transition-colors rounded-full">
              <ChevronLeft size={16} />
            </button>
            <button className="p-2 border border-gray-300 text-gray-500 hover:text-black hover:border-black transition-colors rounded-full">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {REVIEWS.map((rev, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#eae8e4] p-8 rounded-xl text-left flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex items-center space-x-0.5 text-[#c5a880]">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" stroke="none" />
                  ))}
                </div>
                {/* Comment text */}
                <p className="text-[13.5px] sm:text-[14px] text-gray-700 leading-relaxed font-medium">
                  "{rev.text}"
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
