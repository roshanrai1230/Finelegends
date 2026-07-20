import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, ChevronLeft, ChevronRight, X, Trash2, Menu } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';
import { translations } from '../utils/translations';

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
  onCheckout,
  isLoggedIn,
  setIsLoggedIn,
  loggedInUser,
  setLoggedInUser,
  storeLogo,
  categories
}) => {
  // Auth state inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeAuthTab, setActiveAuthTab] = useState('otp'); // 'otp', 'login', 'signup'

  // Mobile OTP state hooks
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [mockOtpReceived, setMockOtpReceived] = useState('');
  const [notifyOffers, setNotifyOffers] = useState(true);

  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  useEffect(() => {
    const handleLangChange = () => {
      setLang(localStorage.getItem('lang') || 'en');
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);
  const t = translations[lang] || translations.en;

  const handleNavClick = (page, e) => {
    if (e) e.preventDefault();
    setCurrentPage(page);
    if (page === 'pant') {
      window.history.pushState({}, '', '/collections/pantts');
    } else if (page === 'shirt') {
      window.history.pushState({}, '', '/collections/shirts');
    } else if (page === 'contact') {
      window.history.pushState({}, '', '/pages/contact');
    } else if (page === 'collections' || page === 'all') {
      window.history.pushState({}, '', '/collections');
    } else if (page === 'catalogue') {
      window.history.pushState({}, '', '/catalogue');
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
        setLoggedInUser(data.user);
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
    if (e) e.preventDefault();
    setAuthError('');
    setOtpLoading(true);

    const isSignUpAction = activeAuthTab === 'signup';

    // Input Validation
    if (!email || !password) {
      setAuthError('Please fill in all fields.');
      setOtpLoading(false);
      return;
    }
    if (isSignUpAction && !name) {
      setAuthError('Please enter your name.');
      setOtpLoading(false);
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      setOtpLoading(false);
      return;
    }

    const endpoint = isSignUpAction 
      ? `${API_BASE_URL}/api/users/signup` 
      : `${API_BASE_URL}/api/users/login`;

    const payload = isSignUpAction ? { name, email, password } : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        setLoggedInUser(data);
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
    setOtpLoading(false);
  };

  return (
    <>      <div className="sticky top-0 z-40 w-full shadow-sm bg-[#f5f5f0]">
        {/* Announcement Bar */}
        <div className="bg-black flex justify-between items-center py-2 px-4 sm:px-6 lg:px-8 z-30 relative">
          <button className="text-gray-300 hover:text-white">
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
          <div className="text-white text-[10px] md:text-[11px] font-sans font-bold uppercase tracking-widest text-center">
            Prepaid Orders Dispatched via Express Courier
          </div>
          <button className="text-gray-300 hover:text-white">
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Main Header */}
        <header className="w-full bg-[#f5f5f0] z-30 relative md:h-[156.5px] flex flex-col justify-between py-4">
          <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 w-full flex flex-col justify-between h-full">
            
            {/* Mobile Header Row */}
            <div className="flex md:hidden justify-between items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#1a1a1a] hover:opacity-70 transition-opacity p-1"
              >
                {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
              <a href="/" onClick={(e) => handleNavClick('home', e)}>
                <img src={storeLogo || "/image/new-logo.png"} alt="Black District" className="h-10 w-auto object-contain mix-blend-multiply" />
              </a>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="text-[#1a1a1a] hover:opacity-70 transition-opacity"
                >
                  <Search size={18} strokeWidth={1} />
                </button>
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="text-[#1a1a1a] hover:opacity-70 transition-opacity relative"
                >
                  <User size={18} strokeWidth={1} />
                </button>
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="text-[#1a1a1a] hover:opacity-70 transition-opacity relative"
                >
                  <ShoppingBag size={18} strokeWidth={1} />
                  {cartCount > 0 && (
                    <span className="absolute -bottom-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Desktop Top Row: Search, Logo, Icons (hidden when search is open) */}
            {!isSearchOpen && (
              <div className="hidden md:flex justify-between items-center mb-6 max-w-5xl mx-auto w-full px-4 sm:px-10 lg:px-20">
                
                {/* Search Toggle */}
                <div className="flex-1 flex justify-start">
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="text-[#1a1a1a] hover:opacity-70 transition-opacity"
                  >
                    <Search size={20} strokeWidth={1} />
                  </button>
                </div>

                {/* Logo */}
                <div className="flex-1 flex justify-center">
                  <a href="/" onClick={(e) => handleNavClick('home', e)}>
                    <img src={storeLogo || "/image/new-logo.png"} alt="Black District" className="h-14 md:h-16 w-auto object-contain mix-blend-multiply scale-110" />
                  </a>
                </div>

                {/* Icons */}
                <div className="flex-1 flex justify-end items-center space-x-5">
                  <button 
                    onClick={() => setIsAuthOpen(true)}
                    className="text-[#1a1a1a] hover:opacity-70 transition-opacity relative"
                  >
                    <User size={20} strokeWidth={1} />
                    {isLoggedIn && (
                      <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white p-1">
                        ✓
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="text-[#1a1a1a] hover:opacity-70 transition-opacity relative"
                  >
                    <ShoppingBag size={20} strokeWidth={1} />
                    {cartCount > 0 && (
                      <span className="absolute -bottom-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* Desktop Search Inline (replaces logo + icons when open) */}
            {isSearchOpen && (
              <div className="hidden md:flex justify-center items-center py-4 h-full flex-grow">
                <div className="w-full max-w-2xl flex items-center space-x-6">
                  <div className="flex-1 flex items-center justify-between border border-black px-4 py-2.5 bg-transparent">
                    <input 
                      type="text" 
                      placeholder="Search" 
                      value={searchQuery}
                      autoFocus
                      onChange={(e) => {
                        const val = e.target.value;
                        setSearchQuery(val);
                        if (val.trim() !== '') {
                          setCurrentPage('search');
                        } else {
                          setCurrentPage('pant');
                        }
                      }}
                      className="flex-1 bg-transparent border-none text-[14px] font-sans focus:ring-0 focus:outline-none placeholder-gray-500"
                    />
                    <Search size={16} className="text-gray-500" strokeWidth={1} />
                  </div>
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      setCurrentPage('pant');
                    }}
                    className="text-[#1a1a1a] hover:opacity-75 transition-opacity"
                  >
                    <X size={24} strokeWidth={1} />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Row: Navigation (hidden on mobile, hidden when search is open) */}
            {!isSearchOpen && (
              <nav className="hidden md:flex flex-wrap justify-center gap-x-8 gap-y-2 text-[14px] font-serif">
                <a 
                  href="/" 
                  onClick={(e) => handleNavClick('home', e)} 
                  className={currentPage === 'home' ? 'text-[#1a1a1a] border-b border-black pb-0.5' : 'text-gray-600 hover:text-[#1a1a1a] hover:border-b hover:border-black pb-0.5 transition-all'}
                >
                  {t.home}
                </a>
                <a 
                  href="/pages/contact" 
                  onClick={(e) => handleNavClick('contact', e)}
                  className={currentPage === 'contact' ? 'text-[#1a1a1a] border-b border-black pb-0.5' : 'text-gray-600 hover:text-[#1a1a1a] hover:border-b hover:border-black pb-0.5 transition-all'}
                >
                  {t.contact}
                </a>
                {/* Dynamic Category Navigation Links */}
                {(categories || []).map(cat => (
                  <a 
                    key={cat.name}
                    href={`/collections/${cat.name}`} 
                    onClick={(e) => handleNavClick(cat.name, e)}
                    className={currentPage === cat.name ? 'text-[#1a1a1a] border-b border-black pb-0.5' : 'text-gray-600 hover:text-[#1a1a1a] hover:border-b hover:border-black pb-0.5 transition-all'}
                  >
                    {cat.label}
                  </a>
                ))}

                <a 
                  href="/collections/all" 
                  onClick={(e) => handleNavClick('all', e)}
                  className={currentPage === 'all' ? 'text-[#1a1a1a] border-b border-black pb-0.5' : 'text-gray-600 hover:text-[#1a1a1a] hover:border-b hover:border-black pb-0.5 transition-all'}
                >
                  All collections
                </a>
                <a 
                  href="/catalogue" 
                  onClick={(e) => handleNavClick('catalogue', e)}
                  className={currentPage === 'catalogue' ? 'text-[#1a1a1a] border-b border-black pb-0.5' : 'text-gray-600 hover:text-[#1a1a1a] hover:border-b hover:border-black pb-0.5 transition-all'}
                >
                  Catalogue
                </a>
              </nav>
            )}
          </div>
        </header>
      </div>

      {/* Mobile Hamburger Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsMobileMenuOpen(false)} />
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-[200px] bg-white shadow-xl z-10 flex flex-col pt-14 px-5">
            <div className="space-y-1">
              {[
                { label: 'Home', page: 'home' },
                { label: 'Contact', page: 'contact' },
                ...(categories || []).map(cat => ({ label: cat.label, page: cat.name })),
                { label: 'All collections', page: 'all' },
                { label: 'Catalogue', page: 'catalogue' }
              ].map(item => (
                <button
                  key={item.page}
                  onClick={() => {
                    handleNavClick(item.page, { preventDefault: () => {} });
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left py-2.5 text-[14px] font-sans ${
                    currentPage === item.page
                      ? 'text-black font-semibold border-b border-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-x-0 top-0 bg-[#f5f5f0] py-6 px-4 z-50 flex justify-center items-center md:hidden">
          <div className="w-full flex items-center space-x-4">
            <div className="flex-1 flex items-center justify-between border border-black px-4 py-2.5 bg-transparent">
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                autoFocus
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val.trim() !== '') {
                    setCurrentPage('search');
                  } else {
                    setCurrentPage('pant');
                  }
                }}
                className="flex-1 bg-transparent border-none text-[12px] font-sans focus:ring-0 focus:outline-none placeholder-gray-500"
              />
              <Search size={16} className="text-gray-500" strokeWidth={1} />
            </div>
            <button 
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
                setCurrentPage('pant');
              }}
              className="text-[#1a1a1a] hover:opacity-75 transition-opacity"
            >
              <X size={22} strokeWidth={1} />
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
                <h2 className="text-[24px] font-heading font-medium mb-3 text-[#1a1a1a]">Welcome back, {loggedInUser?.name || 'Legend'}!</h2>
                <p className="text-[14px] text-gray-500 mb-8">You are logged into your Blackdistricts account ({loggedInUser?.email || loggedInUser?.phone || 'Blackdistrictsmember'}).</p>
                <button 
                  onClick={() => {
                    setIsLoggedIn(false);
                    setLoggedInUser(null);
                    localStorage.removeItem('user');
                    // Reset all login/signup form fields completely to prevent prefilling on logout
                    setEmail('');
                    setPassword('');
                    setName('');
                    setPhone('');
                    setOtp('');
                    setMockOtpReceived('');
                    setAuthError('');
                  }}
                  className="px-8 py-3 bg-black text-white uppercase text-[12px] tracking-widest font-semibold hover:opacity-90 transition-opacity"
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
                    src={storeLogo || "/image/new-logo.png"} 
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
                  
                  {/* Auth mode selector tabs */}
                  <div className="flex border-b border-gray-200 mb-2 text-[11px] font-bold uppercase tracking-wider">
                    <button 
                      type="button"
                      onClick={() => { setActiveAuthTab('otp'); setAuthError(''); }}
                      className={`flex-1 pb-2.5 text-center border-b-2 transition-colors ${activeAuthTab === 'otp' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                    >
                      📱 Mobile OTP
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setActiveAuthTab('login'); setAuthError(''); }}
                      className={`flex-1 pb-2.5 text-center border-b-2 transition-colors ${activeAuthTab === 'login' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                    >
                      ✉️ Login
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setActiveAuthTab('signup'); setAuthError(''); }}
                      className={`flex-1 pb-2.5 text-center border-b-2 transition-colors ${activeAuthTab === 'signup' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                    >
                      👤 Sign Up
                    </button>
                  </div>

                  {authError && (
                    <div className="bg-red-50 text-red-600 border border-red-200 p-3 text-[12px] rounded">
                      {authError}
                    </div>
                  )}

                  {/* Display simulated helper OTP code in dev mode */}
                  {activeAuthTab === 'otp' && mockOtpReceived && (
                    <div className="bg-blue-50 text-black border border-blue-200 p-3 text-[12px] font-semibold">
                      [SIMULATED OTP] Verification Code is: {mockOtpReceived}
                    </div>
                  )}

                  {/* Render conditional forms */}
                  {activeAuthTab === 'otp' && (
                    <>
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
                              className="mt-0.5 text-black focus:ring-0 focus:ring-offset-0 rounded border-gray-300"
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
                              className="text-black hover:underline font-semibold"
                            >
                              Resend OTP
                            </button>
                          </div>

                        </form>
                      )}
                    </>
                  )}

                  {activeAuthTab === 'login' && (
                    <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="your@email.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-3 border border-gray-300 rounded text-[14px] focus:outline-none focus:border-black font-medium"
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                          <button 
                            type="button" 
                            onClick={() => {
                              alert("Forgot password reset instructions have been simulated and sent to your email!");
                            }}
                            className="text-[10px] text-gray-400 hover:text-black font-semibold underline uppercase tracking-wider"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <input 
                          type="password" 
                          required 
                          placeholder="••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3.5 py-3 border border-gray-300 rounded text-[14px] focus:outline-none focus:border-black font-medium"
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={otpLoading}
                        className="w-full py-3.5 bg-black text-white text-[14px] font-bold hover:bg-black/90 transition-colors uppercase tracking-wider"
                      >
                        {otpLoading ? 'Signing In...' : 'Sign In'}
                      </button>
                    </form>
                  )}

                  {activeAuthTab === 'signup' && (
                    <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Your Name" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3.5 py-3 border border-gray-300 rounded text-[14px] focus:outline-none focus:border-black font-medium"
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="your@email.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-3 border border-gray-300 rounded text-[14px] focus:outline-none focus:border-black font-medium"
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                        <input 
                          type="password" 
                          required 
                          placeholder="Create Password (min 6 characters)" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3.5 py-3 border border-gray-300 rounded text-[14px] focus:outline-none focus:border-black font-medium"
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={otpLoading}
                        className="w-full py-3.5 bg-black text-white text-[14px] font-bold hover:bg-black/90 transition-colors uppercase tracking-wider"
                      >
                        {otpLoading ? 'Creating Account...' : 'Sign Up'}
                      </button>
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
                        className="px-8 py-3.5 bg-black text-white text-[13px] font-sans font-semibold uppercase tracking-widest hover:opacity-95 transition-opacity mb-10 w-full max-w-[280px]"
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
                        className="flex w-full items-center justify-center bg-black px-6 py-4 text-[13px] font-semibold text-white uppercase tracking-widest hover:opacity-90 transition-opacity"
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
