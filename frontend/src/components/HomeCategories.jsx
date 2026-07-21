import React, { useState, useEffect } from 'react';

const SLIDES = [
  '/image/collection_slide_1_1784624075794.jpg',
  '/image/hero_slide_2_1784623650681.jpg',
  '/image/hero_slide_3_1784623662696.jpg',
  '/image/hero_slide_4_1784623675835.jpg',
  '/image/hero_slide_5_1784623687758.jpg',
  '/image/hero_slide_1_1784623631603.jpg'
];

const HomeCategories = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 3500); // cycle every 3.5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#f5f5f0] py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto font-sans">
        <div 
          onClick={() => onNavigate && onNavigate('all')}
          className="group relative cursor-pointer overflow-hidden border border-[#e2dfd5] aspect-[16/9] md:aspect-[21/9] rounded-xl shadow-sm"
        >
          {/* Background Images with fade transition */}
          {SLIDES.map((slide, index) => (
            <img 
              key={index}
              src={slide} 
              alt={`Collection showcase ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-[center_30%] transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-0 group-hover:scale-[1.02] group-hover:duration-[2000ms]' : 'opacity-0 -z-10'
              }`}
            />
          ))}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500 z-10" />
          
          {/* Title & Call to action */}
          <div className="absolute bottom-8 left-8 text-left space-y-1 z-20">
            <h3 className="text-white text-[24px] sm:text-[32px] font-bold tracking-wider uppercase font-heading">COLLECTIONS</h3>
            <span className="text-[12px] text-white/90 font-semibold uppercase tracking-widest inline-flex items-center group-hover:underline">
              Explore Now <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCategories;
