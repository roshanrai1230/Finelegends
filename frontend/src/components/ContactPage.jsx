import React, { useState } from 'react';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <div className="bg-[#f5f5f0] min-h-screen text-[#1a1a1a] font-body py-16 px-4">
      <div className="max-w-[700px] mx-auto bg-transparent">
        <h1 className="text-[36px] sm:text-[44px] font-heading font-medium text-center mb-8">
          Contact Us
        </h1>
        
        {submitted ? (
          <div className="border border-[#002349] p-8 text-center bg-[#002349]/5">
            <h2 className="text-[20px] font-heading font-semibold mb-2 text-[#002349]">
              Thank you for contacting us!
            </h2>
            <p className="text-[15px] font-sans text-[#6b6b66]">
              Your message has been sent successfully. We will get back to you within 24-48 hours.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-6 btn-primary"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-[13px] font-sans font-medium uppercase mb-2 tracking-wider">
                  Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your Name"
                  className="border border-[#1a1a1a] px-4 py-3 bg-transparent text-[15px] focus:outline-none focus:border-[2px] w-full"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[13px] font-sans font-medium uppercase mb-2 tracking-wider">
                  Email
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your Email"
                  className="border border-[#1a1a1a] px-4 py-3 bg-transparent text-[15px] focus:outline-none focus:border-[2px] w-full"
                />
              </div>
            </div>
            
            <div className="flex flex-col">
              <label className="text-[13px] font-sans font-medium uppercase mb-2 tracking-wider">
                Message
              </label>
              <textarea 
                rows="6"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="How can we help you?"
                className="border border-[#1a1a1a] px-4 py-3 bg-transparent text-[15px] focus:outline-none focus:border-[2px] w-full resize-none"
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="w-full sm:w-auto px-10 py-4 bg-[#002349] text-white hover:opacity-85 transition-opacity text-[15px] font-sans tracking-widest uppercase font-medium"
            >
              Submit Form
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
