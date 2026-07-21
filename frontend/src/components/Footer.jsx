import React from 'react';

const Footer = () => {
  const sections = [
    {
      title: 'SHOP',
      links: ['New In', 'Clothing', 'Footwear', 'Watches', 'Collections', 'Sale']
    },
    {
      title: 'CUSTOMER SERVICE',
      links: ['Help & Support', 'Track Order', 'Returns & Exchanges', 'Shipping Policy', 'Size Guide', 'FAQs']
    },
    {
      title: 'COMPANY',
      links: ['About Us', 'Our Stores', 'Careers', 'Press', 'Sustainability', 'Contact Us']
    }
  ];

  return (
    <footer className="bg-black text-[#8c8574] pt-16 pb-10 border-t border-neutral-900 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">

        <div className="grid gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-start border-b border-neutral-900 pb-14 text-left">
          
          {/* Logo & Tagline */}
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <h2 className="text-[22px] font-heading font-black tracking-widest text-white uppercase">
              BLACKDISTRICT<span className="text-[#c5a880]">.</span>
            </h2>
            <p className="text-[12.5px] leading-relaxed text-gray-500 font-medium max-w-xs">
              Premium Menswear for the modern gentleman.
            </p>
            {/* Social Icons */}
            <div className="flex items-center space-x-4 text-gray-400">
              <a href="#" className="hover:text-white transition-colors" title="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4.5 4.5 0 1 1 12.63 8 4.5 4.5 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" title="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" title="Youtube">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" title="Help">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
              </a>
            </div>
          </div>

          {/* Links sections */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-5">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{section.title}</h3>
              <ul className="space-y-2.5 text-[12.5px] text-gray-500 font-medium">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* We Accept */}
          <div className="col-span-2 md:col-span-1 space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">WE ACCEPT</h3>
            <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              <div className="border border-neutral-800 bg-neutral-950 px-2 py-2.5 rounded">VISA</div>
              <div className="border border-neutral-800 bg-neutral-950 px-2 py-2.5 rounded font-serif italic text-blue-400">Pay</div>
              <div className="border border-neutral-800 bg-neutral-950 px-2 py-2.5 rounded text-green-400">UPI</div>
              <div className="border border-neutral-800 bg-neutral-950 px-2 py-2.5 rounded text-blue-500">Paytm</div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-[11px] font-medium text-gray-600">
          <div>© 2026 BlackDistrict.store | All Rights Reserved.</div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
