import React from 'react';

const HomeCollections = ({ onNavigate }) => {
  const collections = [
    {
      title: 'Clothing',
      subtitle: 'Explore Now',
      image: '/image/collection-shirt.png',
      page: 'shirt'
    },
    {
      title: 'Footwear',
      subtitle: 'Explore Now',
      image: '/image/black-pant-4.jpg',
      page: 'pant'
    },
    {
      title: 'Watches',
      subtitle: 'Explore Now',
      image: '/image/homepage-1.webp',
      page: 'catalogue'
    }
  ];

  return (
    <section id="collections" className="w-full bg-[#f5f5f0] text-black py-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-[34px] md:text-[42px] font-heading font-semibold mb-10">Browse Collections</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {collections.map((item) => (
            <button
              key={item.title}
              onClick={() => onNavigate && onNavigate(item.page)}
              className="group relative overflow-hidden rounded-[28px] border border-[#e7e0d7] bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              </div>
              <div className="p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-[#8f7f62] mb-3">{item.subtitle}</p>
                <h3 className="text-[24px] font-semibold text-[#111111] mb-2">{item.title}</h3>
                <span className="inline-flex items-center text-sm uppercase tracking-[0.35em] text-[#111111] font-semibold">
                  View Collection
                  <span className="ml-2">→</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCollections;
