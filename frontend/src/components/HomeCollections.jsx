import React from 'react';

const HomeCollections = ({ onNavigate }) => {
  const collections = [
    {
      title: 'SHIRTS',
      subtitle: 'Elevated Tops',
      image: '/image/collection-shirt.png',
      page: 'shirt'
    },
    {
      title: 'PANTS',
      subtitle: 'Premium Bottoms',
      image: '/image/collection-gurkha.jpg',
      page: 'pant'
    }
  ];

  return (
    <section id="collections" className="w-full bg-[#f8f6f0] text-black py-20 px-6 sm:px-10 lg:px-20 border-t border-neutral-100">
      <div className="max-w-[1400px] mx-auto space-y-12">
        <div className="text-left space-y-1">
          <h2 className="text-[32px] md:text-[40px] font-heading font-normal text-gray-900 tracking-wide">
            EXPLORE COLLECTIONS
          </h2>
          <p className="text-gray-400 font-sans text-[11px] font-bold uppercase tracking-widest">
            Curated pieces for a timeless wardrobe
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          {collections.map((item) => (
            <div
              key={item.title}
              onClick={() => onNavigate && onNavigate(item.page)}
              className="group relative overflow-hidden aspect-[4/5] bg-neutral-100 cursor-pointer shadow-sm border border-neutral-200/50 hover:shadow-md transition-all duration-500"
            >
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
              
              {/* Card content aligned at the bottom left like mockup */}
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end text-left space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-sans font-bold tracking-widest text-[#c5a880] uppercase">
                    {item.subtitle}
                  </span>
                  <h3 className="text-[20px] sm:text-[24px] font-heading font-medium text-white tracking-wide">
                    {item.title}
                  </h3>
                </div>
                <div className="inline-flex items-center text-[10px] font-sans font-bold uppercase tracking-wider text-white border-b border-white/20 pb-0.5 w-fit group-hover:border-white transition-colors">
                  SHOP NOW
                  <span className="ml-2.5 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCollections;
