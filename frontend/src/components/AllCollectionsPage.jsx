import React from 'react';

const COLLECTIONS_DATA = [
  {
    id: 'col1',
    name: 'Shirts',
    image: '/image/collection-shirt.png',
    path: 'shirt'
  },
  {
    id: 'col2',
    name: 'Pants',
    image: '/image/collection-pant.jpg',
    path: 'pant'
  }
];

const AllCollectionsPage = ({ onNavigate }) => {
  const handleCollectionClick = (path, e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className="bg-[#f5f5f0] min-h-screen text-[#1a1a1a] font-body pb-20">
      
      {/* Centered Collections Header */}
      <div className="py-8 bg-[#f5f5f0] text-center border-b border-[#e5e5e0]">
        <h1 className="text-[32px] sm:text-[40px] font-heading font-medium tracking-wide">
          Collections
        </h1>
      </div>

      {/* Collections Grid (Constrained max-width to match layout exactly) */}
      <div className="max-w-[1100px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
          {COLLECTIONS_DATA.map((col) => (
            <div key={col.id} className="group flex flex-col text-left">
              
              {/* Collection Image */}
              <a 
                href={`/collections/${col.path}`}
                onClick={(e) => handleCollectionClick(col.path, e)}
                className="relative w-full aspect-[3/4] overflow-hidden mb-4 bg-[#ebd9aa]/10 border border-[#e5e5e0] block"
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
              </a>

              {/* Title & Arrow */}
              <h3 className="text-[16px] text-[#1a1a1a] font-body mb-1">
                <a
                  href={`/collections/${col.path}`}
                  onClick={(e) => handleCollectionClick(col.path, e)}
                  className="inline-flex items-center hover:underline decoration-1 underline-offset-4"
                >
                  <span className="font-medium mr-1.5">{col.name}</span>
                  <span className="text-[16px] font-sans font-normal">&rarr;</span>
                </a>
              </h3>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AllCollectionsPage;
