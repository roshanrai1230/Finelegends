import React from 'react';
import eleganceImg from '../assets/Elegance.webp';

const Elegance = () => {
  return (
    <div className="w-full bg-[#f5f5f0] py-16 md:py-24 px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24">
        
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2">
          <img 
            src={eleganceImg} 
            alt="FineLegends Deep Plum Box" 
            className="w-full h-auto object-cover shadow-sm"
          />
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 flex justify-start">
          <div className="flex flex-col items-start text-left max-w-[500px] w-full">
            <h2 className="text-[32px] md:text-[42px] font-heading font-medium text-[#1a1a1a] mb-6 tracking-wide">
              Elegance, Unboxed
            </h2>
            <p className="text-[#333333] font-body text-[16px] md:text-[17px] leading-[1.8] mb-10 w-full">
              Luxury shouldn't wait until you put the clothes on. It begins the moment you hold our signature Deep Plum box. Hand-inspected and artisanal-wrapped, every order is a curated experience designed for the modern legend. Excellence, delivered to your door.
            </p>
            <div className="w-full flex justify-center">
              <a 
                href="#products" 
                className="bg-black text-white font-body text-[12px] md:text-[13px] px-6 py-2.5 hover:opacity-90 transition-opacity"
              >
                Explore the Collection
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Elegance;
