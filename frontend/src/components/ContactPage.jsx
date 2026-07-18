import React, { useState } from 'react';
import { API_BASE_URL } from '../apiConfig';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !comment) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, comment })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setPhone('');
        setComment('');
      } else {
        alert(data.message || 'Failed to submit contact request.');
      }
    } catch (err) {
      console.error('Contact Submit Error:', err);
      alert('Error connecting to feedback server.');
    }
  };

  return (
    <div className="bg-[#f5f5f0] min-h-screen text-[#1a1a1a] font-body py-16 px-4 text-left">
      <div className="max-w-[720px] mx-auto bg-transparent">
        
        {/* Page Title (Aligned to match form structure exactly) */}
        <h1 className="text-[40px] sm:text-[50px] font-heading font-medium tracking-wide mb-12">
          Contact
        </h1>
        
        {submitted ? (
          <div className="border border-[#002349] p-8 text-center bg-[#002349]/5 font-sans">
            <h2 className="text-[20px] font-heading font-semibold mb-2 text-[#002349]">
              Thank you for contacting us!
            </h2>
            <p className="text-[14px] text-[#6b6b66]">
              Your message has been sent successfully. We will get back to you within 24-48 hours.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-6 px-6 py-2.5 bg-[#002349] text-white text-[12px] uppercase font-sans font-semibold tracking-widest hover:opacity-90"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Name"
                className="border border-[#1a1a1a] px-4 py-3 bg-[#f5f5f0] text-[14px] font-sans focus:outline-none focus:ring-0 w-full placeholder-gray-500 rounded-none"
              />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email *"
                className="border border-[#1a1a1a] px-4 py-3 bg-[#f5f5f0] text-[14px] font-sans focus:outline-none focus:ring-0 w-full placeholder-gray-500 rounded-none"
              />
            </div>
            
            {/* Row 2: Phone number */}
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="border border-[#1a1a1a] px-4 py-3 bg-[#f5f5f0] text-[14px] font-sans focus:outline-none focus:ring-0 w-full placeholder-gray-500 rounded-none"
            />
            
            {/* Row 3: Comment Textarea */}
            <textarea 
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              placeholder="Comment"
              className="border border-[#1a1a1a] px-4 py-3 bg-[#f5f5f0] text-[14px] font-sans focus:outline-none focus:ring-0 w-full placeholder-gray-500 resize-none rounded-none"
            ></textarea>
            
            {/* Row 4: Submit Button */}
            <div className="pt-2">
              <button 
                type="submit"
                className="px-8 py-3 bg-[#002349] text-white hover:opacity-90 transition-opacity text-[13px] font-sans tracking-widest uppercase font-semibold rounded-none"
              >
                Send
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
