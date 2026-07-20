import React from 'react';

const HomePageInfo = ({ onNavigate }) => {
  return (
    <div className="w-full bg-[#f5f5f0] text-black pt-16 pb-24 font-serif px-4">
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* Top 3 text blocks */}
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-4">The Legend Fit</h2>
            <p className="text-sm md:text-[15px] text-gray-700 leading-relaxed font-sans max-w-2xl mx-auto">
              We understand that true elegance starts with the perfect silhouette. Use our detailed size guides to find your match, or enjoy our 7-day hassle-free exchange policy for a tailored fit every time.
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-4">Artisanal Quality</h2>
            <p className="text-sm md:text-[15px] text-gray-700 leading-relaxed font-sans max-w-2xl mx-auto">
              Every garment undergoes a rigorous 10-point quality inspection before it is placed in our signature Deep Plum luxury box. We ensure that every stitch meets the Blackdistrictsstandard of excellence.
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-4">Priority Shipping</h2>
            <p className="text-sm md:text-[15px] text-gray-700 leading-relaxed font-sans max-w-2xl mx-auto">
              Crafted and dispatched within 24 hours from our Indian studio. With real-time tracking, you can follow your journey toward timeless style from our door to yours.
            </p>
          </div>
        </div>

        {/* Elegance Unboxed Split Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 pt-8 pb-12">
          <div className="w-full max-w-[530px] shrink-0">
            <img 
              src="/image/Elegance.webp" 
              alt="Elegance Unboxed Box" 
              className="w-full h-auto lg:w-[530px] lg:h-[530px] object-cover shadow-sm"
            />
          </div>
          <div className="text-left max-w-[500px]">
            <h2 className="text-4xl md:text-[44px] font-serif text-[#1a1a1a] mb-6 tracking-wide leading-tight">Elegance, Unboxed</h2>
            <p className="text-[16px] md:text-[17px] text-[#333333] leading-[1.8] font-serif mb-10">
              Luxury shouldn't wait until you put the clothes on. It begins the moment you hold our signature Deep Plum box. Hand-inspected and artisanal-wrapped, every order is a curated experience designed for the modern legend. Excellence, delivered to your door.
            </p>
            <div className="flex justify-center md:justify-start md:pl-16">
              <button 
                onClick={() => onNavigate && onNavigate('collections')}
                className="bg-black text-white px-9 py-3.5 text-[14px] font-sans hover:opacity-90 transition-opacity tracking-wide"
              >
                Explore the Collection
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePageInfo;
