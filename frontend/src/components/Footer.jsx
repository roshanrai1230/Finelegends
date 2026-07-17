import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#f5f5f0] border-t border-gray-300 pt-16 pb-12">
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-center md:text-left">
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-heading font-semibold text-[#1a1a1a] mb-6">Quick links</h3>
            <ul className="space-y-4 font-body">
              <li><a href="#" className="text-[#1a1a1a] text-lg hover:underline decoration-1 underline-offset-4">Search</a></li>
              <li><a href="#" className="text-[#1a1a1a] text-lg hover:underline decoration-1 underline-offset-4">Contact us</a></li>
              <li><a href="#" className="text-[#1a1a1a] text-lg hover:underline decoration-1 underline-offset-4">Terms of Service</a></li>
              <li><a href="#" className="text-[#1a1a1a] text-lg hover:underline decoration-1 underline-offset-4">Refund policy</a></li>
            </ul>
          </div>

          {/* Mission */}
          <div>
            <h3 className="text-xl font-heading font-semibold text-[#1a1a1a] mb-6">Our mission</h3>
            <p className="text-[#1a1a1a] text-lg font-body max-w-sm mx-auto md:mx-0">
              FineLegends provides premium apparel designed with elegance and built to last.
            </p>
          </div>

          {/* Newsletter / Social */}
          <div className="flex flex-col md:items-start items-center">
            <h3 className="text-xl font-heading font-semibold text-[#1a1a1a] mb-6">Subscribe to our emails</h3>
            <div className="flex w-full max-w-md border border-[#1a1a1a] mb-6">
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-transparent px-4 py-3 text-lg font-body focus:outline-none placeholder-gray-500" 
              />
              <button className="px-6 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="flex space-x-6 mt-4">
              <a href="#" className="text-[#1a1a1a] hover:opacity-70 transition-opacity">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-[#1a1a1a] hover:opacity-70 transition-opacity">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-[#1a1a1a] hover:opacity-70 transition-opacity">
                <FaYoutube size={24} />
              </a>
              <a href="#" className="text-[#1a1a1a] hover:opacity-70 transition-opacity">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 flex flex-col md:flex-row justify-center items-center text-center">
          <p className="text-sm font-body text-[#1a1a1a]">
            &copy; {new Date().getFullYear()}, <a href="#" className="hover:underline">FineLegends</a>. Powered by Shopify
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
