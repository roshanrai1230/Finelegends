import React, { useState, useEffect } from 'react';

const SLIDES = [
  { id: 1, image: '/image/hero_slide_1_1784623631603.jpg' },
  { id: 2, image: '/image/hero_slide_2_1784623650681.jpg' },
  { id: 3, image: '/image/hero_slide_3_1784623662696.jpg' },
  { id: 4, image: '/image/hero_slide_4_1784623675835.jpg' },
  { id: 5, image: '/image/hero_slide_5_1784623687758.jpg' },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500); // Change slide every 4.5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] lg:h-[90vh] bg-black overflow-hidden flex items-center select-none font-serif">
      
      {/* Background Images with Fade Transition */}
      {SLIDES.map((slide, index) => (
        <img
          key={slide.id}
          src={slide.image}
          alt={`BlackDistrict hero collection ${slide.id}`}
          className={`absolute inset-0 w-full h-full object-cover object-[center_20%] transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        />
      ))}
      
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-0" />

      {/* Slide Indicators on Left */}
      <div className="absolute left-10 lg:left-20 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center space-y-6 z-10 text-white font-sans text-[12px] font-bold">
        <div className="w-[1px] h-20 bg-white/20 relative">
          <div 
            className="absolute top-0 left-0 w-full bg-[#c5a880] transition-all duration-500 ease-in-out" 
            style={{ 
              height: `${100 / SLIDES.length}%`,
              top: `${(100 / SLIDES.length) * currentSlide}%` 
            }}
          />
        </div>
        {SLIDES.map((slide, index) => (
          <span 
            key={slide.id} 
            className={`transition-colors duration-500 ${index === currentSlide ? 'text-[#c5a880]' : 'text-white/40'} cursor-pointer`}
            onClick={() => setCurrentSlide(index)}
          >
            {slide.id < 10 ? `0${slide.id}` : slide.id}
          </span>
        ))}
        <span className="text-white/50 text-[15px] pt-4 animate-bounce">↓</span>
      </div>

      {/* Core Hero Content Container */}
      <div className="max-w-[1400px] w-full mx-auto px-10 md:px-24 lg:px-40 relative z-10 text-left text-white space-y-8">
        <div className="space-y-4 max-w-xl">
          <span className="block uppercase tracking-[0.25em] text-[#c5a880] text-[11px] font-sans font-extrabold">
            THE DISTRICT OF STYLE
          </span>
          <h1 className="text-[44px] sm:text-[56px] lg:text-[72px] leading-[1.08] font-normal tracking-wide font-heading">
            Built For Men<br />Who Lead.
          </h1>
          <div className="w-24 h-[1px] bg-white/20 mt-4"></div>
        </div>

        <p className="text-[14px] sm:text-[16px] text-white/70 font-sans leading-relaxed max-w-md">
          Timeless designs. Premium fabrics. Made for every version of you.
        </p>

        {/* Buttons matching mockup */}
        <div className="flex items-center space-x-4 pt-4">
          <button
            onClick={() => {
              const target = document.getElementById('new-arrivals');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3.5 bg-[#c5a880] hover:bg-[#b0936c] text-black font-sans text-[11px] font-extrabold uppercase tracking-widest transition-colors duration-300 shadow-lg"
          >
            EXPLORE COLLECTION
          </button>
        </div>
      </div>

    </section>
  );
};

export default Hero;
