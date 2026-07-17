import React from 'react';
import { ShoppingBag, Search, User, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const Header = () => {
  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#002349] flex justify-between items-center py-2 px-4 sm:px-6 lg:px-8">
        <button className="text-gray-300 hover:text-white">
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
        <div className="text-[#ebd9aa] text-xs sm:text-sm font-heading tracking-wide text-center">
          Prepaid Orders Dispatched via Express Courier
        </div>
        <button className="text-gray-300 hover:text-white">
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* Main Header */}
      <header className="w-full bg-[#f5f5f0] pt-8 pb-5 border-b border-gray-200">
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10">
          
          {/* Top Row: Search, Logo, Icons */}
          <div className="flex justify-between items-center mb-8">
            
            {/* Search */}
            <div className="flex-1 flex justify-start">
              <button className="text-[#1a1a1a] hover:opacity-70 transition-opacity">
                <Search size={22} strokeWidth={1} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 flex justify-center">
              <a href="/">
                <img src="/image/logo-signature.webp" alt="FineLegends" className="h-12 w-auto object-contain" />
              </a>
            </div>

            {/* Icons */}
            <div className="flex-1 flex justify-end items-center space-x-5">
              <button className="text-[#1a1a1a] hover:opacity-70 transition-opacity relative">
                <User size={22} strokeWidth={1} />
                <Zap size={10} strokeWidth={2.5} className="text-[#f5a623] absolute -bottom-1 -right-1" fill="#f5a623" />
              </button>
              <button className="text-[#1a1a1a] hover:opacity-70 transition-opacity relative">
                <ShoppingBag size={22} strokeWidth={1} />
                <span className="absolute -bottom-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#002349] text-[10px] text-white">
                  1
                </span>
              </button>
            </div>

          </div>

          {/* Bottom Row: Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[15px] font-body">
            <a href="#" className="text-[#1a1a1a] underline decoration-[1px] underline-offset-[6px]">Home</a>
            <a href="#" className="text-gray-600 hover:text-[#1a1a1a] hover:underline decoration-[1px] underline-offset-[6px]">Contact</a>
            <a href="#" className="text-gray-600 hover:text-[#1a1a1a] hover:underline decoration-[1px] underline-offset-[6px]">The Shirt</a>
            <a href="#" className="text-gray-600 hover:text-[#1a1a1a] hover:underline decoration-[1px] underline-offset-[6px]">The Pant</a>
            <a href="#" className="text-gray-600 hover:text-[#1a1a1a] hover:underline decoration-[1px] underline-offset-[6px]">All collections</a>
          </nav>

        </div>
      </header>
    </>
  );
};

export default Header;
