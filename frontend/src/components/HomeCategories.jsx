import React from 'react';

const HomeCategories = ({ onNavigate }) => {
  const categories = [
    {
      title: 'CLOTHING',
      image: '/image/collection-shirt.png',
      path: 'clothing'
    },
    {
      title: 'FOOTWEAR',
      image: '/image/collection-footwear.jpg',
      path: 'footwear'
    },
    {
      title: 'WATCHES',
      image: '/image/collection-watches.jpg',
      path: 'watches'
    }
  ];

  return (
    <div className="w-full bg-[#f5f5f0] py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        {categories.map((cat, idx) => (
          <div 
            key={idx}
            onClick={() => onNavigate && onNavigate(cat.path)}
            className="group relative cursor-pointer overflow-hidden border border-[#e2dfd5] aspect-[4/3] sm:aspect-[16/10] md:aspect-[3/4]"
          >
            {/* Background Image with hover zoom */}
            <img 
              src={cat.image} 
              alt={cat.title} 
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-500" />
            
            {/* Title & Call to action */}
            <div className="absolute bottom-6 left-6 text-left space-y-1">
              <h3 className="text-white text-[20px] font-bold tracking-wider uppercase font-heading">{cat.title}</h3>
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
