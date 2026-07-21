import React from 'react';

const HomeSplitBanner = ({ onNavigate }) => {
  const banners = [
    {
      title: "THE SUMMER EDIT '24",
      desc: "Light, Breezy, Effortless. Styles for the new season.",
      btnText: "EXPLORE NOW",
      image: "/image/collection-summer-edit.jpg",
      page: "shirt"
    },
    {
      title: "LINEN COLLECTION",
      desc: "Naturally breathable. Unmatched comfort.",
      btnText: "SHOP LINEN",
      image: "/image/collection-shirt.png",
      page: "shirt"
    }
  ];

  return (
    <div className="w-full bg-[#f8f6f0] py-16 px-6 md:px-12 lg:px-20 border-t border-neutral-100">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {banners.map((b, idx) => (
          <div 
            key={idx}
            className="relative overflow-hidden bg-white border border-neutral-200/50 flex flex-col h-[500px] group cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-500 rounded-xl"
            onClick={() => onNavigate && onNavigate(b.page)}
          >
            {/* Image Box */}
            <div className="w-full h-1/2 overflow-hidden bg-neutral-100">
              <img 
                src={b.image} 
                alt={b.title} 
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </div>
            
            {/* Text details box */}
            <div className="w-full h-1/2 p-8 flex flex-col justify-between text-left bg-neutral-50/50">
              <div className="space-y-3">
                <h3 className="text-[20px] sm:text-[24px] leading-tight text-gray-900 font-heading font-medium tracking-wide">
                  {b.title}
                </h3>
                <p className="text-[12px] text-gray-500 font-sans leading-relaxed">
                  {b.desc}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate && onNavigate(b.page);
                }}
                className="w-full py-3.5 bg-black hover:opacity-90 text-white font-sans text-[11px] font-bold uppercase tracking-widest transition-opacity"
              >
                {b.btnText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeSplitBanner;
