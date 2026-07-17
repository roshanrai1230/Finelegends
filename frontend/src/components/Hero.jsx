import React from 'react';

const Hero = () => {
  return (
    <div className="bg-[#f5f5f0] w-full pt-10 pb-16">
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Image Side */}
          <div className="w-full md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="FineLegends Collection" 
              className="w-full h-[60vh] object-cover"
            />
          </div>

          {/* Text Side */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-start text-left">
            <h2 className="text-4xl md:text-5xl lg:text-[4rem] leading-tight font-heading text-[#1a1a1a] mb-6">
              Elevate your everyday style
            </h2>
            <div className="text-lg md:text-xl text-[#1a1a1a] mb-10 font-body max-w-lg">
              <p>Discover apparel crafted for the modern legend. Quality meets timeless design.</p>
            </div>
            <a href="#products" className="btn-primary">
              Shop all
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
