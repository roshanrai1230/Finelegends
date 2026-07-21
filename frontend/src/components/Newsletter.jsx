import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setStatus('Please enter a valid email address.');
      return;
    }
    setStatus('Thank you for joining our district!');
    setEmail('');
  };

  return (
    <div className="w-full bg-[#f4f3ed] py-8 px-6 md:px-12 lg:px-20 border-t border-b border-[#e2dfd5]/60">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left text */}
        <div className="text-left space-y-2 lg:max-w-md">
          <h3 className="text-gray-900 font-heading font-semibold text-[20px] sm:text-[24px] uppercase tracking-wider leading-tight">
            BECOME PART OF THE DISTRICT
          </h3>
          <p className="text-[12.5px] text-gray-500 font-sans font-medium">
            Sign up and get 10% off on your first order.
          </p>
        </div>

        {/* Center Input Form */}
        <div className="w-full lg:w-auto flex-grow max-w-lg">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <input 
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-5 py-3 border border-[#e5e5e0] focus:outline-none focus:border-black text-[13px] font-semibold bg-white text-gray-800"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-black hover:bg-neutral-800 text-white font-sans text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 shrink-0"
            >
              JOIN NOW
            </button>
          </form>
          {status && (
            <p className="text-left text-[11.5px] font-semibold text-gray-700 mt-2.5">{status}</p>
          )}
        </div>

        {/* Right side box image */}
        <div className="hidden lg:block w-36 h-36 overflow-hidden select-none pointer-events-none">
          <img 
            src="/image/newsletter-box.jpg" 
            alt="Gift Box" 
            className="w-full h-full object-contain"
          />
        </div>

      </div>
    </div>
  );
};

export default Newsletter;
