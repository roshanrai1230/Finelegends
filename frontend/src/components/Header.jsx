import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, ChevronLeft, ChevronRight, X, Trash2, Menu } from 'lucide-react';
import { API_BASE_URL, GOOGLE_CLIENT_ID } from '../apiConfig';
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

  // Decode Google JWT Token helper
  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Failed to decode JWT:', err);
      return null;
    }
  };

  // Google Login Response Callback Handler
  const handleGoogleLoginResponse = (response) => {
    const payload = decodeJwt(response.credential);
    if (!payload) {
      setAuthError('Failed to parse Google login token.');
      return;
    }

    setOtpLoading(true);
    fetch(`${API_BASE_URL}/api/users/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email,
        name: payload.name,
        sub: payload.sub
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          setIsLoggedIn(true);
          setLoggedInUser(data);
          localStorage.setItem('user', JSON.stringify(data));
          setIsAuthOpen(false);
          setAuthError('');
        } else {
          setAuthError(data.message || 'Google Login failed.');
        }
      })
      .catch(err => {
        console.error('Google login API error:', err);
        setAuthError('Connection error logging in with Google.');
      })
      .finally(() => setOtpLoading(false));
  };

  // Dynamic Google script tag loader and client initialization
  useEffect(() => {
    if (!isAuthOpen || isLoggedIn) return;

    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleLoginResponse
        });

        const btnContainer = document.getElementById("google-button-container");
        if (btnContainer) {
          window.google.accounts.id.renderButton(btnContainer, {
            theme: "outline",
            size: "large",
            width: btnContainer.clientWidth || 320
          });
        }
      }
    };

    if (!document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    } else {
      setTimeout(initializeGoogleSignIn, 150); // slight delay to ensure container is mounted
    }
  }, [isAuthOpen, isLoggedIn, activeAuthTab]);

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
    <>      <div className="sticky top-0 z-40 w-full shadow-sm bg-black border-b border-neutral-800">
        {/* Announcement Bar */}
        <div className="bg-[#121212] text-white flex flex-wrap justify-between items-center gap-3 px-4 sm:px-6 lg:px-8 py-3 text-[11px] font-sans uppercase tracking-[0.25em] border-b border-neutral-900">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-gray-400">Free Shipping</span>
            <span className="text-[#c5a880] font-bold">on prepaid orders above ₹11999</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-xs font-semibold">
            <a href="#track" className="hover:text-white transition">Track Order</a>
            <span className="text-neutral-800">|</span>
            <a href="/pages/contact" className="hover:text-white transition">Help & Support</a>
          </div>
        </div>

        {/* Main Header */}
        <header className="w-full bg-black z-30 relative md:h-[156.5px] flex flex-col justify-between py-4">
          <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 w-full flex flex-col justify-between h-full">
            
            {/* Mobile Header Row */}
            <div className="flex md:hidden justify-between items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:opacity-70 transition-opacity p-1"
              >
                {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
              <a href="/" onClick={(e) => handleNavClick('home', e)} className="flex items-center">
                <span className="text-[20px] font-heading font-black tracking-widest text-white uppercase">
                  BLACKDISTRICT<span className="text-[#c5a880]">.</span>
                </span>
              </a>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="text-white hover:opacity-70 transition-opacity"
                >
                  <Search size={18} strokeWidth={1} />
                </button>
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="text-white hover:opacity-70 transition-opacity relative"
                >
                  <User size={18} strokeWidth={1} />
                </button>
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="text-white hover:opacity-70 transition-opacity relative"
                >
                  <ShoppingBag size={18} strokeWidth={1} />
                  {cartCount > 0 && (
                    <span className="absolute -bottom-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c5a880] text-[10px] text-black font-extrabold">
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
                    className="text-white hover:opacity-70 transition-opacity"
                  >
                    <Search size={20} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Logo */}
                <div className="flex-1 flex justify-center">
                  <a href="/" onClick={(e) => handleNavClick('home', e)} className="flex items-center">
                    <span className="text-[26px] font-heading font-black tracking-widest text-white uppercase select-none">
                      BLACKDISTRICT<span className="text-[#c5a880]">.</span>
                    </span>
                  </a>
                </div>

                {/* Icons */}
                <div className="flex-1 flex justify-end items-center space-x-6">
                  <button 
                    onClick={() => setIsAuthOpen(true)}
                    className="text-white hover:opacity-70 transition-opacity relative"
                  >
                    <User size={20} strokeWidth={1.5} />
                    {isLoggedIn && (
                      <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white p-1">
                        ✓
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="text-white hover:opacity-70 transition-opacity relative"
                  >
                    <ShoppingBag size={20} strokeWidth={1.5} />
                    {cartCount > 0 && (
                      <span className="absolute -bottom-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#c5a880] text-[10px] text-black font-extrabold">
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
                  <div className="flex-1 flex items-center justify-between border border-white/20 px-4 py-2.5 bg-neutral-900">
                    <input 
                      type="text" 
                      placeholder="Search for articles, products..." 
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
                      className="flex-1 bg-transparent border-none text-[14px] text-white font-sans focus:ring-0 focus:outline-none placeholder-gray-500"
                    />
                    <Search size={16} className="text-gray-400" strokeWidth={1.5} />
                  </div>
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      setCurrentPage('pant');
                    }}
                    className="text-white hover:opacity-75 transition-opacity"
                  >
                    <X size={24} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Row: Navigation (hidden on mobile, hidden when search is open) */}
            {!isSearchOpen && (
              <nav className="hidden md:flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[12.5px] font-sans font-bold uppercase tracking-widest">
                <a 
                  href="/" 
                  onClick={(e) => handleNavClick('home', e)} 
                  className={currentPage === 'home' ? 'text-[#c5a880] border-b border-[#c5a880] pb-1' : 'text-gray-400 hover:text-white pb-1 transition-all'}
                >
                  Home
                </a>

                {/* Dynamic Category Navigation Links */}
                {(categories || []).map(cat => (
                  <a 
                    key={cat.name}
                    href={`/collections/${cat.name}`} 
                    onClick={(e) => handleNavClick(cat.name, e)}
                    className={currentPage === cat.name ? 'text-[#c5a880] border-b border-[#c5a880] pb-1' : 'text-gray-400 hover:text-white pb-1 transition-all'}
                  >
                    {cat.label}
                  </a>
                ))}

                <a 
                  href="/collections/all" 
                  onClick={(e) => handleNavClick('all', e)}
                  className={currentPage === 'all' ? 'text-[#c5a880] border-b border-[#c5a880] pb-1' : 'text-gray-400 hover:text-white pb-1 transition-all'}
                >
                  Collections
                </a>
                <a 
                  href="/catalogue" 
                  onClick={(e) => handleNavClick('catalogue', e)}
                  className={currentPage === 'catalogue' ? 'text-[#c5a880] border-b border-[#c5a880] pb-1' : 'text-gray-400 hover:text-white pb-1 transition-all'}
                >
                  Catalogue
                </a>
                <a 
                  href="/collections/all" 
                  onClick={(e) => handleNavClick('all', e)}
                  className="text-[#c5a880] hover:opacity-85 transition-opacity pb-1"
                >
                  Sale
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
          <div className="absolute left-0 top-0 bottom-0 w-[200px] bg-[#121212] border-r border-neutral-800 shadow-2xl z-10 flex flex-col pt-14 px-5">
            <div className="space-y-1">
              {[
                { label: 'Home', page: 'home' },
                ...(categories || []).map(cat => ({ label: cat.label, page: cat.name })),
                { label: 'Collections', page: 'all' },
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
                      ? 'text-[#c5a880] font-semibold border-b border-[#c5a880]'
                      : 'text-gray-400 hover:text-white'
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
        <div className="fixed inset-0 bg-black/75 flex justify-center items-center p-4 z-50 animate-fade-in font-sans">
          
          {/* Modal Container */}
          <div className="bg-white max-w-4xl w-full relative flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden min-h-[500px] text-left border border-neutral-100">
            
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
              className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors z-20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {isLoggedIn ? (
              <div className="w-full text-center py-20 px-10 flex flex-col justify-center items-center space-y-6">
                <h2 className="text-[26px] font-heading font-normal text-[#1a1a1a]">Welcome back, {loggedInUser?.name || 'Legend'}!</h2>
                <p className="text-[14px] text-gray-500 max-w-md">You are logged into your account ({loggedInUser?.email || loggedInUser?.phone || 'BlackDistrict Member'}).</p>
                <button 
                  onClick={() => {
                    setIsLoggedIn(false);
                    setLoggedInUser(null);
                    localStorage.removeItem('user');
                    setEmail('');
                    setPassword('');
                    setName('');
                    setPhone('');
                    setOtp('');
                    setMockOtpReceived('');
                    setAuthError('');
                  }}
                  className="px-10 py-3.5 bg-black text-white uppercase text-[11px] tracking-widest font-bold hover:opacity-90 transition-opacity"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                {/* Left Section: Brand Panel */}
                <div className="w-full md:w-[45%] bg-[#121212] p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden min-h-[350px] md:min-h-auto">
                  
                  {/* Subtle Giftbox background cover */}
                  <div className="absolute inset-0 bg-cover bg-center opacity-[0.25] pointer-events-none mix-blend-luminosity" style={{ backgroundImage: "url('/image/newsletter-box.jpg')" }} />
                  
                  {/* Brand Header */}
                  <div className="text-center space-y-2 z-10">
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto text-[#c5a880] stroke-current stroke-[1.5]">
                      <path d="M22 28C18 20 12 18 8 20M14 23C11 18 13 14 16 12M42 28C46 20 52 18 56 20M50 23C53 18 51 14 48 12" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M26 30C26 30 18 34 16 38C14 42 18 44 22 40C24 38 27 34 27 34L32 44L37 34C37 34 40 38 42 40C46 44 50 42 48 38C46 34 38 30 38 30" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M27 34L32 50L37 34L32 30L27 34Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                    <div className="font-heading tracking-widest text-center">
                      <span className="block text-[14px] font-black tracking-[0.25em] text-white">BLACK</span>
                      <span className="block text-[9px] font-bold tracking-[0.4em] text-[#c5a880] uppercase">DISTRICT</span>
                    </div>
                  </div>

                  {/* Brand Tagline */}
                  <div className="space-y-2 text-center md:text-left z-10 py-6">
                    <span className="block text-[10px] font-bold tracking-[0.2em] text-[#c5a880] uppercase">EXCLUSIVE FOR YOU</span>
                    <h3 className="text-[20px] font-heading font-medium leading-snug">
                      Unlock Special Offers & Rewards
                    </h3>
                  </div>

                  {/* Features list */}
                  <div className="grid grid-cols-3 gap-2 text-center z-10 border-t border-white/10 pt-6">
                    <div className="flex flex-col items-center space-y-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c5a880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider leading-tight">Exclusive Deals</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c5a880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider leading-tight">Member Rewards</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c5a880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider leading-tight">Early Access Sales</span>
                    </div>
                  </div>

                  {/* KwikPass footer branding */}
                  <div className="flex items-center justify-center space-x-1.5 text-gray-500 text-[10px] font-medium tracking-wide z-10 pt-4 mt-4 border-t border-white/5">
                    <span>Powered by</span>
                    <span className="font-bold text-white tracking-tight">Kwik</span>
                    <svg className="w-2.5 h-2.5 text-yellow-500 fill-current" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    <span className="font-bold text-white tracking-tight">Pass</span>
                  </div>

                </div>

                {/* Right Section: Form content */}
                <div className="w-full md:w-[55%] p-8 md:p-10 flex flex-col justify-between bg-white text-gray-900">
                  
                  <div>
                    {/* Selector Tabs */}
                    <div className="flex border-b border-neutral-100 mb-6 text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400">
                      <button 
                        type="button"
                        onClick={() => { setActiveAuthTab('otp'); setAuthError(''); }}
                        className={`flex-1 pb-3 text-center border-b-2 flex items-center justify-center transition-colors ${activeAuthTab === 'otp' ? 'border-[#c5a880] text-black font-extrabold' : 'border-transparent hover:text-black'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                        MOBILE OTP
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setActiveAuthTab('login'); setAuthError(''); }}
                        className={`flex-1 pb-3 text-center border-b-2 flex items-center justify-center transition-colors ${activeAuthTab === 'login' ? 'border-[#c5a880] text-black font-extrabold' : 'border-transparent hover:text-black'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        LOGIN
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setActiveAuthTab('signup'); setAuthError(''); }}
                        className={`flex-1 pb-3 text-center border-b-2 flex items-center justify-center transition-colors ${activeAuthTab === 'signup' ? 'border-[#c5a880] text-black font-extrabold' : 'border-transparent hover:text-black'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        SIGN UP
                      </button>
                    </div>

                    {authError && (
                      <div className="bg-red-50 text-red-600 border border-red-200 p-3 text-[12px] rounded mb-4 font-medium">
                        {authError}
                      </div>
                    )}

                    {/* Display simulated helper OTP code */}
                    {activeAuthTab === 'otp' && mockOtpReceived && (
                      <div className="bg-blue-50 text-neutral-900 border border-blue-200 p-3 text-[12px] font-bold rounded mb-4">
                        [TEST VERIFICATION CODE] OTP: {mockOtpReceived}
                      </div>
                    )}

                    {/* Render conditional forms */}
                    {activeAuthTab === 'otp' && (
                      <div className="space-y-5">
                        {!isOtpSent ? (
                          /* Step 1: Input Mobile */
                          <form onSubmit={handleSendOtp} className="space-y-4">
                            
                            <div className="space-y-2">
                              <label className="text-[12px] font-semibold text-gray-500 font-sans">
                                Enter your mobile number
                              </label>
                              <div className="flex items-center border border-neutral-200 rounded bg-neutral-50 focus-within:border-black transition-colors">
                                {/* India country prefix dropdown */}
                                <div className="flex items-center space-x-1.5 px-3 py-3 border-r border-neutral-200 text-[13px] text-gray-600 font-bold select-none">
                                  <span>+91</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                                <input 
                                  type="tel" 
                                  required
                                  maxLength={10}
                                  placeholder="Enter Mobile Number"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                  className="w-full px-3 py-3 bg-transparent text-[13.5px] focus:outline-none placeholder-gray-400 font-medium"
                                />
                              </div>
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
                              className="w-full py-3.5 bg-black hover:opacity-90 text-white text-[11px] font-sans font-bold uppercase tracking-widest transition-opacity"
                            >
                              {otpLoading ? 'Sending...' : 'SEND OTP'}
                            </button>

                          </form>
                        ) : (
                          /* Step 2: Enter OTP Code received */
                          <form onSubmit={handleVerifyOtp} className="space-y-4">
                            
                            <div className="flex flex-col space-y-2">
                              <label className="text-[12px] font-semibold text-gray-500 font-sans">
                                Enter Verification Code
                              </label>
                              <input 
                                type="text" 
                                required
                                maxLength={6}
                                placeholder="Enter 6-Digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full px-4 py-3 border border-neutral-200 rounded text-[15px] focus:outline-none focus:border-black tracking-[0.2em] text-center font-bold placeholder-gray-300 bg-neutral-50"
                              />
                            </div>

                            <button 
                              type="submit"
                              disabled={otpLoading}
                              className="w-full py-3.5 bg-[#c5a880] text-black text-[11px] font-sans font-bold uppercase tracking-widest"
                            >
                              {otpLoading ? 'Verifying...' : 'VERIFY OTP'}
                            </button>

                            {/* Go back / Resend OTP */}
                            <div className="flex justify-between items-center text-[12px] pt-1 font-semibold">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsOtpSent(false);
                                  setOtp('');
                                  setMockOtpReceived('');
                                  setAuthError('');
                                }}
                                className="text-gray-400 hover:text-black underline"
                              >
                                Change Number
                              </button>
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                className="text-black hover:underline"
                              >
                                Resend OTP
                              </button>
                            </div>

                          </form>
                        )}
                      </div>
                    )}

                    {activeAuthTab === 'login' && (
                      <form onSubmit={handleAuthSubmit} className="space-y-4 text-left font-sans">
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="your@email.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3.5 py-3 border border-neutral-200 rounded text-[13.5px] focus:outline-none focus:border-black font-semibold bg-neutral-50"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                            <button 
                              type="button" 
                              onClick={() => alert("Simulated password reset instructions sent!")}
                              className="text-[10px] text-gray-400 hover:text-black font-bold underline uppercase tracking-wider"
                            >
                              Forgot?
                            </button>
                          </div>
                          <input 
                            type="password" 
                            required 
                            placeholder="••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3.5 py-3 border border-neutral-200 rounded text-[13.5px] focus:outline-none focus:border-black font-semibold bg-neutral-50"
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={otpLoading}
                          className="w-full py-3.5 bg-black hover:opacity-90 text-white text-[11px] font-sans font-bold uppercase tracking-widest transition-opacity"
                        >
                          {otpLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                      </form>
                    )}

                    {activeAuthTab === 'signup' && (
                      <form onSubmit={handleAuthSubmit} className="space-y-4 text-left font-sans">
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                          <input 
                            type="text" 
                            required 
                            placeholder="Your Name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3.5 py-3 border border-neutral-200 rounded text-[13.5px] focus:outline-none focus:border-black font-semibold bg-neutral-50"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                          <input 
                            type="email" 
                            required 
                            placeholder="your@email.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3.5 py-3 border border-neutral-200 rounded text-[13.5px] focus:outline-none focus:border-black font-semibold bg-neutral-50"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                          <input 
                            type="password" 
                            required 
                            placeholder="Create Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3.5 py-3 border border-neutral-200 rounded text-[13.5px] focus:outline-none focus:border-black font-semibold bg-neutral-50"
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={otpLoading}
                          className="w-full py-3.5 bg-black hover:opacity-90 text-white text-[11px] font-sans font-bold uppercase tracking-widest transition-opacity"
                        >
                          {otpLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                      </form>
                    )}

                    {/* Global Google Authentication Alternative (for OTP, Login, and Sign Up) */}
                    <div className="space-y-4">
                      {/* Divider Line */}
                      <div className="relative flex items-center justify-center my-4 font-sans">
                        <div className="w-full border-t border-neutral-100"></div>
                        <span className="absolute bg-white px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">OR</span>
                      </div>

                      {/* Google Auth Button Container */}
                      <div id="google-button-container" className="w-full flex justify-center mt-2 min-h-[44px]"></div>
                    </div>
                  </div>

                  {/* Accept terms T&C */}
                  <p className="text-[10.5px] text-gray-400 leading-normal pt-4 border-t border-neutral-100 text-center font-medium mt-6">
                    By continuing, you agree to our <a href="#" className="underline text-gray-500">Privacy Policy</a> and <a href="#" className="underline text-gray-500 font-bold">Terms & Conditions</a>.
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
