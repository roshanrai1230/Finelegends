import React, { useState, useEffect } from 'react';
import homepageImg from '../assets/homepage-1.webp';

const Hero = () => {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  useEffect(() => {
    const handleLangChange = () => {
      setLang(localStorage.getItem('lang') || 'en');
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  const headlineLine1 = lang === 'hi' ? 'नेतृत्व करने वाले' : 'Built For Men';
  const headlineLine2 = lang === 'hi' ? 'पुरुषों के लिए तैयार।' : 'Who Lead.';
  const subtitleLine1 = lang === 'hi' ? 'टाइमलेस डिज़ाइन। प्रीमियम फ़ैब्रिक्स।' : 'Timeless designs. Premium fabrics.';
  const subtitleLine2 = lang === 'hi' ? 'हर संस्करण के लिए तैयार।' : 'Made for every version of you.';
  const ctaText = lang === 'hi' ? 'कलेक्शन देखें' : 'EXPLORE COLLECTION';

  return (
    <section className="relative overflow-hidden bg-[#181816] text-white font-serif">
      
      {/* Scroll indicator on left */}
      <div className="absolute left-6 bottom-16 hidden lg:flex flex-col items-center space-y-4 select-none pointer-events-none z-10">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-gray-500 origin-left -rotate-90 translate-y-[-10px] whitespace-nowrap">
          SCROLL TO DISCOVER
        </span>
        <div className="w-[1.5px] h-14 bg-gray-600 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#c5a880] animate-bounce" />
        </div>
      </div>

      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-stretch min-h-[620px] lg:min-h-[720px]">
          
          {/* Left Text Block */}
          <div className="p-8 sm:p-16 lg:p-24 flex flex-col justify-center text-left space-y-8 bg-[#181816]">
            
            <div className="space-y-4">
              <span className="block uppercase tracking-[0.25em] text-[#c5a880] text-[11px] font-sans font-extrabold">
                {lang === 'hi' ? 'स्टाइल का जिला' : 'THE DISTRICT OF STYLE'}
              </span>
              <h1 className="text-[44px] sm:text-[56px] lg:text-[68px] leading-[1.08] font-normal tracking-wide font-heading">
                {headlineLine1}<br />{headlineLine2}
              </h1>
              <div className="w-20 h-[1px] bg-gray-600 mt-2"></div>
            </div>

            <p className="text-[14px] sm:text-[15px] text-gray-400 font-sans leading-relaxed max-w-md">
              {subtitleLine1}<br />{subtitleLine2}
            </p>

            <button
              onClick={() => {
                const target = document.getElementById('new-arrivals');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }}
              className="self-start px-8 py-3.5 bg-[#c5a880] hover:bg-[#b0936c] text-black font-sans text-[11px] font-extrabold uppercase tracking-widest transition-colors duration-300 shadow-lg"
            >
              {ctaText}
            </button>

          </div>

          {/* Right Image Block */}
          <div className="relative min-h-[400px] lg:min-h-full">
            <img
              src="/image/hero-banner.png"
              alt="BlackDistrict hero collection"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
export default Hero;
