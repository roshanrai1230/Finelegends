import React from 'react';

const ARTICLES = [
  {
    image: '/image/journal-1.jpg',
    title: 'HOW TO STYLE LINEN SHIRTS',
    link: '#'
  },
  {
    image: '/image/journal-2.jpg',
    title: 'SUMMER WARDROBE ESSENTIALS',
    link: '#'
  },
  {
    image: '/image/collection-summer-edit.jpg',
    title: 'CITY STROLLS: EFFORTLESS LOOKS',
    link: '#'
  }
];

const StyleJournal = () => {
  return (
    <div id="journal" className="w-full bg-[#f8f6f0] py-16 px-6 md:px-12 lg:px-20 border-t border-gray-200/50">
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex items-center justify-between font-sans">
          <div className="flex items-center space-x-6">
            <h2 className="text-[20px] sm:text-[24px] font-heading font-medium text-gray-900 tracking-wider uppercase">STYLE JOURNAL</h2>
            <div className="hidden sm:block w-32 h-[1px] bg-gray-300"></div>
          </div>
          <a 
            href="#" 
            className="text-[11px] font-bold text-gray-600 hover:text-black uppercase tracking-widest transition-colors inline-flex items-center"
          >
            VIEW ALL ARTICLES <span className="ml-2">&rarr;</span>
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {ARTICLES.map((art, idx) => (
            <div key={idx} className="group cursor-pointer flex flex-col text-left space-y-4 font-sans">
              
              {/* Image box */}
              <div className="relative w-full aspect-[4/3] overflow-hidden border border-[#e2dfd5]">
                <img 
                  src={art.image} 
                  alt={art.title} 
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Title & action */}
              <div className="space-y-1">
                <h3 className="text-gray-900 font-bold text-[13px] tracking-wider uppercase leading-snug">{art.title}</h3>
                <a 
                  href={art.link}
                  className="text-[11px] text-gray-400 hover:text-black font-semibold tracking-wider transition-colors inline-flex items-center pt-1"
                >
                  Read Article <span className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StyleJournal;
