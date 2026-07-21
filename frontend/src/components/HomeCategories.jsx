import React from 'react';

const HomeCategories = ({ onNavigate }) => {
  const categories = [
    {
      title: 'COLLECTIONS',
      image: '/image/collection-shirt.png',
      path: 'all'
    }
  ];

  return (
    <div className="w-full bg-[#f5f5f0] py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto font-sans">
        {categories.map((cat, idx) => (
          <div 
            key={idx}
            onClick={() => onNavigate && onNavigate(cat.path)}
            className="group relative cursor-pointer overflow-hidden border border-[#e2dfd5] aspect-[16/9] md:aspect-[21/9] rounded-xl shadow-sm"
          >
            {/* Background Image with hover zoom */}
            <img 
              src={cat.image} 
              alt={cat.title} 
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500" />
            
            {/* Title & Call to action */}
            <div className="absolute bottom-8 left-8 text-left space-y-1">
              <h3 className="text-white text-[24px] sm:text-[32px] font-bold tracking-wider uppercase font-heading">{cat.title}</h3>
              <span className="text-[12px] text-white/90 font-semibold uppercase tracking-widest inline-flex items-center group-hover:underline">
                Explore Now <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
