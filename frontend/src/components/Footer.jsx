import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#f5f5f0] border-t border-[#e5e5e0] pt-16 pb-12 text-[#1a1a1a]">
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          
          {/* Brand Philosophy (Left Column) */}
          <div className="flex flex-col justify-start">
            <h2 className="text-[26px] sm:text-[32px] font-heading font-medium leading-tight max-w-md">
              Handcrafted in India. Inspired by Heritage.
            </h2>
          </div>

          {/* Quick Links (Right Column) */}
          <div className="flex flex-col md:items-end">
            <div className="w-full md:max-w-xs text-left">
              <h3 className="text-[17px] font-sans font-semibold mb-6 tracking-wider uppercase">
                Quick links
              </h3>
              <ul className="space-y-4 font-body text-[15px]">
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4 block">
                    Search
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4 block">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4 block">
                    Return / Exchange Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4 block">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4 block">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4 block">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline decoration-1 underline-offset-4 block">
                    Return/Exchange
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Copyright and Footer Bottom Links */}
        <div className="pt-8 border-t border-[#e5e5e0] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[12px] text-[#6b6b66] font-sans">
          <div>
            &copy; 2026, <a href="#" className="hover:underline text-[#1a1a1a]">BlackDistrict</a>. All Rights Reserved.
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a href="/admin" className="hover:underline text-gray-500 font-semibold">Admin Panel</a>
            <span>&bull;</span>
            <a href="#" className="hover:underline">Privacy policy</a>
            <span>&bull;</span>
            <a href="#" className="hover:underline">Refund policy</a>
            <span>&bull;</span>
            <a href="#" className="hover:underline">Terms of service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
