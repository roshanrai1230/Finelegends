import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comment: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent!');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f5f5f0]">
      <Header />
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="w-full max-w-[620px] px-6">
          
          {/* Page Title */}
          <h1 className="text-[40px] md:text-[52px] font-heading font-medium text-[#1a1a1a] mb-16">
            Contact
          </h1>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="max-w-[620px]">
            
            {/* Row 1: Name + Email */}
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-1/2 border border-[#aaaaaa] bg-transparent px-4 py-3 font-body text-[14px] text-[#1a1a1a] placeholder-[#888888] focus:outline-none focus:border-black"
              />
              <input
                type="email"
                name="email"
                placeholder="Email *"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-1/2 border border-[#aaaaaa] bg-transparent px-4 py-3 font-body text-[14px] text-[#1a1a1a] placeholder-[#888888] focus:outline-none focus:border-black"
              />
            </div>

            {/* Row 2: Phone */}
            <div className="mb-4">
              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-[#aaaaaa] bg-transparent px-4 py-3 font-body text-[14px] text-[#1a1a1a] placeholder-[#888888] focus:outline-none focus:border-black"
              />
            </div>

            {/* Row 3: Comment */}
            <div className="mb-8">
              <textarea
                name="comment"
                placeholder="Comment"
                rows={5}
                value={formData.comment}
                onChange={handleChange}
                className="w-full border border-[#aaaaaa] bg-transparent px-4 py-3 font-body text-[14px] text-[#1a1a1a] placeholder-[#888888] focus:outline-none focus:border-black resize-none"
              />
            </div>

            {/* Send Button */}
            <button
              type="submit"
              className="bg-black text-white font-body text-[13px] px-8 py-3 hover:opacity-90 transition-opacity"
            >
              Send
            </button>

          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
