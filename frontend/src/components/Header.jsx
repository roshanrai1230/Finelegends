import React, { useState } from 'react';
import { ShoppingBag, Search, User, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const Header = ({ 
  currentPage, 
  setCurrentPage, 
  cartItems, 
  onRemoveFromCart, 
  onUpdateQuantity,
  cartCount,
  isCartOpen,
  setIsCartOpen,
  isSearchOpen,
  setIsSearchOpen,
  isAuthOpen,
  setIsAuthOpen,
  searchQuery,
  setSearchQuery,
  onCheckout
}) => {
  // Auth state inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState('');

  // Mobile OTP state hooks
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [mockOtpReceived, setMockOtpReceived] = useState('');
  const [notifyOffers, setNotifyOffers] = useState(true);

  const handleNavClick = (page, e) => {
    if (e) e.preventDefault();
    setCurrentPage(page);
    if (page === 'pant') {
      window.history.pushState({}, '', '/collections/pantts');
    } else if (page === 'shirt') {
      window.history.pushState({}, '', '/collections/shirts');
    } else if (page === 'contact') {
      window.history.pushState({}, '', '/pages/contact');
    } else if (page === 'collections') {
      window.history.pushState({}, '', '/collections');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(value).replace('₹', 'Rs. ');
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    setOtpLoading(true);

    if (!phone || phone.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      setOtpLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setIsOtpSent(true);
        if (data.mockOtp) {
          setMockOtpReceived(data.mockOtp);
        }
      } else {
        setAuthError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error('Send OTP Error:', err);
      setAuthError('Network error connecting to OTP server.');
    }
    setOtpLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    setOtpLoading(true);

    if (!otp || otp.length < 6) {
      setAuthError('Please enter a valid 6-digit OTP code.');
      setOtpLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setIsLoggedIn(true);
        setIsAuthOpen(false);
        setAuthError('');
        // Reset states
        setIsOtpSent(false);
        setPhone('');
        setOtp('');
        setMockOtpReceived('');
        // Save user session
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setAuthError(data.message || 'OTP verification failed.');
      }
    } catch (err) {
      console.error('Verify OTP Error:', err);
      setAuthError('Network error verifying OTP.');
    }
    setOtpLoading(false);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    // Input Validation
    if (!email || !password) {
      setAuthError('Please fill in all fields.');
      return;
    }
    if (isSignUp && !name) {
      setAuthError('Please enter your name.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    const endpoint = isSignUp 
      ? `${API_BASE_URL}/api/users/signup` 
      : `${API_BASE_URL}/api/users/login`;

    const payload = isSignUp ? { name, email, password } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        setIsAuthOpen(false);
        setAuthError('');
        // Save logged-in user in localStorage
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        setAuthError(data.message || 'Authentication failed.');
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setAuthError('Network error connecting to auth server.');
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#002349] flex justify-between items-center py-2 px-4 sm:px-6 lg:px-8 z-30 relative">
        <button className="text-gray-300 hover:text-white">
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
        <div className="text-white text-[11px] font-sans font-bold uppercase tracking-wider text-center">
          Prepaid Orders Dispatched via Express Courier
        </div>
        <button className="text-gray-300 hover:text-white">
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* Main Header */}
      <header className="w-full bg-[#f5f5f0] pt-8 pb-5 border-b border-gray-200 z-30 relative">
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10">
          
          {/* Top Row: Search, Logo, Icons */}
          <div className="flex justify-between items-center mb-8 max-w-5xl mx-auto w-full px-4 sm:px-10 lg:px-20">
            
            {/* Search Toggle */}
            <div className="flex-1 flex justify-start">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-[#1a1a1a] hover:opacity-70 transition-opacity"
              >
                <Search size={22} strokeWidth={1} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 flex justify-center">
              <a href="/" onClick={(e) => handleNavClick('home', e)}>
                <img src="/image/logo-signature.webp" alt="FineLegends" className="h-20 w-auto object-contain mix-blend-multiply" />
              </a>
            </div>

            {/* Icons */}
            <div className="flex-1 flex justify-end items-center space-x-5">
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="text-[#1a1a1a] hover:opacity-70 transition-opacity relative"
              >
                <User size={22} strokeWidth={1} />
                {isLoggedIn && (
                  <span className="absolute -bottom-1 -right-1 flex h-2w w-2 items-center justify-center rounded-full bg-green-500 text-[10px] text-white p-1">
                    ✓
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-[#1a1a1a] hover:opacity-70 transition-opacity relative"
              >
                <ShoppingBag size={22} strokeWidth={1} />
                {cartCount > 0 && (
                  <span className="absolute -bottom-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#002349] text-[10px] text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>

          {/* Bottom Row: Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[15px] font-body">
            <a 
              href="/" 
              onClick={(e) => handleNavClick('home', e)} 
              className={currentPage === 'home' ? 'text-[#1a1a1a] underline decoration-[1px] underline-offset-[6px]' : 'text-gray-600 hover:text-[#1a1a1a] hover:underline decoration-[1px] underline-offset-[6px]'}
            >
              Home
            </a>
            <a 
              href="/pages/contact" 
              onClick={(e) => handleNavClick('contact', e)}
              className={currentPage === 'contact' ? 'text-[#1a1a1a] underline decoration-[1px] underline-offset-[6px]' : 'text-gray-600 hover:text-[#1a1a1a] hover:underline decoration-[1px] underline-offset-[6px]'}
            >
              Contact
            </a>
            <a 
              href="/collections/shirts" 
              onClick={(e) => handleNavClick('shirt', e)}
              className={currentPage === 'shirt' ? 'text-[#1a1a1a] underline decoration-[1px] underline-offset-[6px]' : 'text-gray-600 hover:text-[#1a1a1a] hover:underline decoration-[1px] underline-offset-[6px]'}
            >
              The Shirt
            </a>
            <a 
              href="/collections/pantts" 
              onClick={(e) => handleNavClick('pant', e)} 
              className={currentPage === 'pant' ? 'text-[#1a1a1a] underline decoration-[1px] underline-offset-[6px]' : 'text-gray-600 hover:text-[#1a1a1a] hover:underline decoration-[1px] underline-offset-[6px]'}
            >
              The Pant
            </a>
            <a 
              href="/collections" 
              onClick={(e) => handleNavClick('collections', e)}
              className={currentPage === 'collections' ? 'text-[#1a1a1a] underline decoration-[1px] underline-offset-[6px]' : 'text-gray-600 hover:text-[#1a1a1a] hover:underline decoration-[1px] underline-offset-[6px]'}
            >
              All collections
            </a>
          </nav>

        </div>
      </header>

      {/* Dynamic Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-x-0 top-0 bg-[#f5f5f0] border-b border-[#e5e5e0] py-6 px-4 z-40 shadow-md animate-slide-down">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3 w-full mr-4">
              <Search size={20} className="text-[#6b6b66]" />
              <input 
                type="text" 
                placeholder="Search our store..." 
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val.trim() !== '') {
                    setCurrentPage('search');
                  } else {
                    setCurrentPage('pant');
                  }
                }}
                className="w-full bg-transparent border-none text-[16px] font-sans p-2 focus:ring-0 focus:outline-none placeholder-gray-400"
              />
            </div>
            <button 
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
                setCurrentPage('pant');
              }}
              className="text-[#1a1a1a] hover:opacity-75"
            >
              <X size={22} />
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Profile Modal (KwikPass UI Match) */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50 animate-fade-in font-sans">
          
          {/* Modal Container */}
          <div className="bg-white border border-gray-200 max-w-3xl w-full p-8 md:p-10 relative flex flex-col md:flex-row items-center gap-8 md:gap-12 shadow-2xl rounded-none text-left">
            
            {/* Close Icon */}
            <button 
              onClick={() => {
                setIsAuthOpen(false);
                setIsOtpSent(false);
                setPhone('');
                setOtp('');
                setMockOtpReceived('');
                setAuthError('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X size={22} />
            </button>

            {isLoggedIn ? (
              <div className="w-full text-center py-6">
                <h2 className="text-[24px] font-heading font-medium mb-3 text-[#1a1a1a]">Welcome back, Legend!</h2>
                <p className="text-[14px] text-gray-500 mb-8">You are logged into your FineLegends account using mobile verification.</p>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="px-8 py-3 bg-[#002349] text-white uppercase text-[12px] tracking-widest font-semibold hover:opacity-90 transition-opacity"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                {/* Left Section: Logos & Callout */}
                <div className="w-full md:w-1/2 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-8">
                  
                  {/* Brand signature logo */}
                  <img 
                    src="/image/logo-signature.webp" 
                    alt="FineLegends" 
                    className="h-24 w-auto object-contain mb-4 mix-blend-multiply" 
                  />

                  {/* Powered by KwikPass */}
                  <div className="flex items-center space-x-1.5 mb-6 text-gray-600 text-[13px]">
                    <span className="font-light text-gray-400">Powered by</span>
                    <span className="font-bold text-[#1a1a1a] tracking-tight">Kwik</span>
                    <span className="text-yellow-500 font-bold">&#9889;</span>
                    <span className="font-bold text-[#1a1a1a] tracking-tight">Pass</span>
                  </div>

                  <h3 className="text-[20px] font-bold leading-snug text-[#1a1a1a] max-w-xs font-heading">
                    Login now to avail best offers!
                  </h3>

                </div>

                {/* Right Section: Interactive Forms */}
                <div className="w-full md:w-1/2 space-y-4">
                  
                  {authError && (
                    <div className="bg-red-50 text-red-600 border border-red-200 p-3 text-[12px] rounded">
                      {authError}
                    </div>
                  )}

                  {/* Display simulated helper OTP code in dev mode */}
                  {mockOtpReceived && (
                    <div className="bg-blue-50 text-[#002349] border border-blue-200 p-3 text-[12px] font-semibold">
                      [SIMULATED OTP] Verification Code is: {mockOtpReceived}
                    </div>
                  )}

                  {!isOtpSent ? (
                    /* Step 1: Input Mobile */
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                        
                        {/* India country prefix */}
                        <div className="flex items-center space-x-2 px-3 py-3 border-r border-gray-300 bg-gray-50 text-[14px] text-gray-600 font-medium select-none">
                          <span className="text-[16px]">🇮🇳</span>
                          <span>+91</span>
                        </div>

                        <input 
                          type="tel" 
                          required
                          maxLength={10}
                          placeholder="Enter Mobile Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-3 bg-transparent text-[14px] focus:outline-none placeholder-gray-400"
                        />

                      </div>

                      {/* Updates preference checkbox */}
                      <label className="flex items-start space-x-2.5 cursor-pointer text-left py-1 select-none">
                        <input 
                          type="checkbox" 
                          checked={notifyOffers}
                          onChange={(e) => setNotifyOffers(e.target.checked)}
                          className="mt-0.5 text-[#002349] focus:ring-0 focus:ring-offset-0 rounded border-gray-300"
                        />
                        <span className="text-[12px] text-gray-500 font-medium">
                          Notify me with offers & updates
                        </span>
                      </label>

                      <button 
                        type="submit"
                        disabled={otpLoading}
                        className="w-full py-3.5 bg-black text-white text-[14px] font-bold hover:bg-black/90 transition-colors uppercase tracking-wider"
                      >
                        {otpLoading ? 'Sending...' : 'Submit'}
                      </button>

                    </form>
                  ) : (
                    /* Step 2: Enter OTP Code received */
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      
                      <div className="flex flex-col space-y-1">
                        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Enter Verification Code
                        </label>
                        <input 
                          type="text" 
                          required
                          maxLength={6}
                          placeholder="Enter 6-Digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-3 border border-gray-300 rounded text-[15px] focus:outline-none focus:border-black tracking-[0.25em] text-center font-bold placeholder-gray-300"
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={otpLoading}
                        className="w-full py-3.5 bg-black text-white text-[14px] font-bold hover:bg-black/90 transition-colors uppercase tracking-wider"
                      >
                        {otpLoading ? 'Verifying...' : 'Verify OTP'}
                      </button>

                      {/* Go back / Resend OTP */}
                      <div className="flex justify-between items-center text-[12px] pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsOtpSent(false);
                            setOtp('');
                            setMockOtpReceived('');
                            setAuthError('');
                          }}
                          className="text-gray-500 hover:text-black underline"
                        >
                          Change Number
                        </button>
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-[#002349] hover:underline font-semibold"
                        >
                          Resend OTP
                        </button>
                      </div>

                    </form>
                  )}

                  {/* Accept terms T&C */}
                  <p className="text-[11px] text-gray-400 leading-normal pt-4 border-t border-gray-100 text-center">
                    I accept that I have read & understood your <a href="#" className="underline text-gray-500">Privacy Policy</a> and <a href="#" className="underline text-gray-500">T&Cs</a>.
                  </p>

                </div>
              </>
            )}

          </div>

        </div>
      )}

      {/* Dynamic Slide-Over Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/40 transition-opacity" 
          />
          
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md bg-[#f5f5f0] border-l border-[#e5e5e0]">
              <div className="flex h-full flex-col overflow-y-scroll py-6 shadow-xl">
                
                {/* Header */}
                <div className="px-4 sm:px-6 flex items-center justify-between pb-4 border-b border-[#e5e5e0]">
                  <h2 className="text-lg font-medium text-[#1a1a1a] uppercase tracking-wider">Your Bag</h2>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-gray-500 hover:text-black"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Items list */}
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-center px-4">
                      
                      <h3 className="text-[26px] font-heading font-medium text-[#1a1a1a] mb-6">
                        Your cart is empty
                      </h3>
                      
                      <button 
                        onClick={() => {
                          setIsCartOpen(false);
                          handleNavClick('home');
                        }}
                        className="px-8 py-3.5 bg-[#002349] text-white text-[13px] font-sans font-semibold uppercase tracking-widest hover:opacity-95 transition-opacity mb-10 w-full max-w-[280px]"
                      >
                        Continue shopping
                      </button>

                      <div className="border-t border-[#ebd9aa]/20 pt-8 w-full">
                        <p className="text-[20px] font-heading text-[#1a1a1a] mb-1">
                          Have an account?
                        </p>
                        <button
                          onClick={() => {
                            setIsCartOpen(false);
                            setIsAuthOpen(true);
                          }}
                          className="text-[14px] font-sans text-gray-600 hover:text-black underline underline-offset-4 decoration-1 font-medium"
                        >
                          Log in to check out faster.
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cartItems.map((item, idx) => (
                        <div key={`${item._id}-${item.size}-${idx}`} className="flex items-center gap-4 py-4 border-b border-[#ebd9aa]/20">
                          <img 
                            src={item.images[0]} 
                            alt={item.name} 
                            className="h-20 w-16 object-cover object-center bg-white border border-[#e5e5e0]"
                          />
                          <div className="flex-1 text-left">
                            <h3 className="text-[14px] font-medium text-[#1a1a1a] leading-snug">{item.name}</h3>
                            <p className="text-[12px] text-[#6b6b66] mt-0.5">Size: {item.size}</p>
                            
                            <div className="flex items-center justify-between mt-3">
                              {/* Quantity control */}
                              <div className="flex items-center border border-gray-300 bg-transparent text-[12px]">
                                <button 
                                  onClick={() => onUpdateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))}
                                  className="px-2.5 py-0.5"
                                >
                                  -
                                </button>
                                <span className="px-2.5 py-0.5 font-medium">{item.quantity}</span>
                                <button 
                                  onClick={() => onUpdateQuantity(item._id, item.size, item.quantity + 1)}
                                  className="px-2.5 py-0.5"
                                >
                                  +
                                </button>
                              </div>

                              <span className="text-[14px] font-semibold">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          </div>
                          
                          {/* Trash button */}
                          <button 
                            onClick={() => onRemoveFromCart(item._id, item.size)}
                            className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtotal & Checkout */}
                {cartItems.length > 0 && (
                  <div className="border-t border-[#e5e5e0] px-4 py-6 sm:px-6 bg-[#e5e5e0]/20 text-left">
                    <div className="flex justify-between text-base font-medium text-[#1a1a1a] mb-4">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatPrice(getSubtotal())}</span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-[#6b6b66]">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                      <button 
                        onClick={() => onCheckout && onCheckout()}
                        className="flex w-full items-center justify-center bg-[#002349] px-6 py-4 text-[13px] font-semibold text-white uppercase tracking-widest hover:opacity-90 transition-opacity"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
