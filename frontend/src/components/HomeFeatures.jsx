import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock, CreditCard, Award } from 'lucide-react';

const FEATURES_DATA = [
  { icon: <Award size={20} strokeWidth={1.5} />, title: 'PREMIUM QUALITY', desc: 'Finest Fabrics' },
  { icon: <Truck size={20} strokeWidth={1.5} />, title: 'FAST DELIVERY', desc: 'Pan India Shipping' },
  { icon: <RotateCcw size={20} strokeWidth={1.5} />, title: '7 DAY RETURNS', desc: 'Easy Returns' },
  { icon: <Lock size={20} strokeWidth={1.5} />, title: 'SECURE PAYMENT', desc: '100% Protected' },
  { icon: <CreditCard size={20} strokeWidth={1.5} />, title: 'COD AVAILABLE', desc: 'Pay on Delivery' },
  { icon: <ShieldCheck size={20} strokeWidth={1.5} />, title: 'EXCLUSIVE DESIGNS', desc: 'Limited Drops' }
];

const HomeFeatures = () => {
  return (
    <div className="w-full bg-[#f4f3ed] border-t border-b border-[#e2dfd5] py-8 px-6 font-sans">
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8 gap-x-4">
        {FEATURES_DATA.map((feat, idx) => (
          <div 
            key={idx} 
            className={`flex items-start space-x-3.5 px-2 ${
              idx > 0 ? 'lg:border-l lg:border-[#e2dfd5]/60 lg:pl-6' : ''
            }`}
          >
            <div className="text-[#c5a880] shrink-0 pt-0.5">{feat.icon}</div>
            <div className="text-left space-y-0.5">
              <h4 className="text-[11px] font-bold tracking-wider uppercase text-gray-900 leading-snug">{feat.title}</h4>
              <p className="text-[10.5px] text-gray-500 leading-tight font-medium">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeFeatures;
