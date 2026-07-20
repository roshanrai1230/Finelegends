import React from 'react';

const Features = () => {
  return (
    <div className="w-full bg-[#f5f5f0] py-24 px-4">
      <div className="max-w-[1000px] mx-auto flex flex-col items-center space-y-20 text-center">
        
        {/* Feature 1 */}
        <div className="flex flex-col items-center">
          <h2 className="text-[32px] md:text-[40px] font-heading font-medium text-[#1a1a1a] mb-4 tracking-wide">
            The Legend Fit
          </h2>
          <p className="text-[#555555] font-body text-[16px] md:text-[18px] leading-[1.8] max-w-[850px]">
            We understand that true elegance starts with the perfect silhouette. Use our detailed size guides to find your match, or enjoy our 7-day hassle-free exchange policy for a tailored fit every time.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center">
          <h2 className="text-[32px] md:text-[40px] font-heading font-medium text-[#1a1a1a] mb-4 tracking-wide">
            Artisanal Quality
          </h2>
          <p className="text-[#555555] font-body text-[16px] md:text-[18px] leading-[1.8] max-w-[850px]">
            Every garment undergoes a rigorous 10-point quality inspection before it is placed in our signature Deep Plum luxury box. We ensure that every stitch meets the Blackdistrictsstandard of excellence.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center">
          <h2 className="text-[32px] md:text-[40px] font-heading font-medium text-[#1a1a1a] mb-4 tracking-wide">
            Priority Shipping
          </h2>
          <p className="text-[#555555] font-body text-[16px] md:text-[18px] leading-[1.8] max-w-[850px]">
            Crafted and dispatched within 24 hours from our Indian studio. With real-time tracking, you can follow your journey toward timeless style from our door to yours.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Features;
