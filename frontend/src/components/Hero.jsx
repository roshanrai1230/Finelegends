import React from 'react';

const Hero = () => {
  return (
    <section className="relative w-full h-[80vh] min-h-[600px] lg:h-[90vh] bg-black overflow-hidden flex items-center select-none font-serif">
      
      {/* Background Image */}
      <img
        src="/image/hero-banner.png"
        alt="BlackDistrict hero collection"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

      {/* Slide Indicators on Left */}
      <div className="absolute left-10 lg:left-20 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center space-y-6 z-10 text-white font-sans text-[12px] font-bold">
        <div className="w-[1px] h-20 bg-white/20 relative">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-[#c5a880]" />
        </div>
        <span className="text-[#c5a880]">01</span>
        <span className="text-white/40">02</span>
        <span className="text-white/40">03</span>
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
