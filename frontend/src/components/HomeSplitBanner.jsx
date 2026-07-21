import React from 'react';

const HomeSplitBanner = ({ onNavigate }) => {
  return (
    <div className="w-full bg-[#f5f5f0] py-6 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 font-serif">
        
        {/* Banner 1: Old Money */}
        <div className="relative overflow-hidden bg-white border border-[#e2dfd5] flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center text-left space-y-5 bg-[#eae7de]/20">
            <h3 className="text-[26px] sm:text-[32px] leading-tight text-gray-900 font-heading font-medium tracking-wide">
              OLD MONEY<br />COLLECTION
            </h3>
            <p className="text-[13px] text-gray-500 font-sans leading-relaxed">
              Timeless tailoring inspired by elegance that never fades.
            </p>
            <button
              onClick={() => onNavigate && onNavigate('all')}
              className="self-start px-6 py-3 bg-black hover:bg-neutral-800 text-white font-sans text-[11px] font-bold uppercase tracking-widest transition-colors duration-300"
            >
              EXPLORE COLLECTION
            </button>
          </div>
          <div className="w-full md:w-1/2 min-h-[300px]">
            <img 
              src="/image/collection-old-money.jpg" 
              alt="Old Money Collection" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Banner 2: Summer Edit */}
        <div className="relative overflow-hidden bg-white border border-[#e2dfd5] flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center text-left space-y-5 bg-[#eae7de]/20 md:order-last">
            <h3 className="text-[26px] sm:text-[32px] leading-tight text-gray-900 font-heading font-medium tracking-wide">
              THE SUMMER<br />EDIT '24
            </h3>
            <p className="text-[13px] text-gray-500 font-sans leading-relaxed">
              Light. Breezy. Effortless. Styles for the new season.
            </p>
            <button
              onClick={() => onNavigate && onNavigate('all')}
              className="self-start px-6 py-3 bg-[#c5a880] hover:bg-[#b0936c] text-white font-sans text-[11px] font-bold uppercase tracking-widest transition-colors duration-300"
            >
              SHOP NOW
            </button>
          </div>
          <div className="w-full md:w-1/2 min-h-[300px]">
            <img 
              src="/image/collection-summer-edit.jpg" 
              alt="The Summer Edit '24" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomeSplitBanner;
