import React from 'react';
import heritageImg from '../assets/Heritage.webp';

const Heritage = () => {
  return (
    <div className="w-full bg-[#f5f5f0] py-16 md:py-24 px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <img 
            src={heritageImg} 
            alt="BlackdistrictsCraftsmanship" 
            className="w-full max-w-[480px] aspect-square object-cover shadow-sm"
          />
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 flex justify-start">
          <div className="flex flex-col items-start text-left max-w-[460px] w-full">
            <h2 className="text-[28px] md:text-[38px] font-heading font-medium text-[#1a1a1a] mb-5 leading-tight">
              Born of Heritage. Tailored for you.
            </h2>
            <p className="text-[#555555] font-body text-[15px] md:text-[16px] leading-[1.7] mb-8 w-full">
              Blackdistrictsbegan with a singular obsession: to bring the effortless sophistication of Mediterranean linen to the modern Indian silhouette. We don't believe in fleeting trends. We believe in the weight of quality, the precision of a hand-finished stitch, and the quiet confidence of a man who knows his worth. From our studio to your doorstep, every piece is a promise of timeless elegance
            </p>
            <div className="w-full flex justify-start">
              <a 
                href="#our-philosophy" 
                className="bg-black text-white font-body text-[13px] md:text-[14px] px-8 py-3.5 hover:opacity-90 transition-opacity"
              >
                Our Philosophy
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Heritage;
