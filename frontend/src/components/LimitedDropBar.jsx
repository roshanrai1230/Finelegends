import React, { useState, useEffect } from 'react';
import { Box } from 'lucide-react';

const LimitedDropBar = ({ onNavigate }) => {
  // Set target date (e.g. 2 days, 14 hours from now)
  const [timeLeft, setTimeLeft] = useState({
    days: '02',
    hours: '14',
    minutes: '45',
    seconds: '30'
  });

  useEffect(() => {
    // Set a countdown target to 3 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(targetDate.getHours() + 14);

    const timer = setInterval(() => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference <= 0) {
        clearInterval(timer);
        return;
      }
      
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-black text-white py-4 px-6 md:px-12 lg:px-20 font-sans border-b border-neutral-800">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Side */}
        <div className="flex items-center space-x-3 text-left">
          <Box className="text-[#c5a880] shrink-0" size={18} />
          <div>
            <h4 className="text-[12px] font-extrabold uppercase tracking-widest leading-snug">LIMITED DROP</h4>
            <p className="text-[9.5px] text-[#c5a880] font-bold uppercase tracking-wider leading-none">ONLY 200 PIECES</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center space-x-3.5 sm:space-x-5 text-center">
          <div className="flex flex-col">
            <span className="text-[16px] sm:text-[18px] font-extrabold tracking-tight text-white">{timeLeft.days}</span>
            <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">DAYS</span>
          </div>
          <span className="text-gray-600 text-[14px] font-bold pb-2">:</span>
          <div className="flex flex-col">
            <span className="text-[16px] sm:text-[18px] font-extrabold tracking-tight text-white">{timeLeft.hours}</span>
            <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">HRS</span>
          </div>
          <span className="text-gray-600 text-[14px] font-bold pb-2">:</span>
          <div className="flex flex-col">
            <span className="text-[16px] sm:text-[18px] font-extrabold tracking-tight text-white">{timeLeft.minutes}</span>
            <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">MINS</span>
          </div>
          <span className="text-gray-600 text-[14px] font-bold pb-2">:</span>
          <div className="flex flex-col">
            <span className="text-[16px] sm:text-[18px] font-extrabold tracking-tight text-white">{timeLeft.seconds}</span>
            <span className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">SECS</span>
          </div>
        </div>

        {/* Right Button */}
        <button
          onClick={() => onNavigate && onNavigate('all')}
          className="px-6 py-2.5 bg-[#c5a880] hover:bg-[#b0936c] text-black font-extrabold uppercase text-[10.5px] tracking-widest transition-colors duration-300 inline-flex items-center"
        >
          SHOP THE DROP <span className="ml-2 font-sans font-bold">&rarr;</span>
        </button>

      </div>
    </div>
  );
};

export default LimitedDropBar;
