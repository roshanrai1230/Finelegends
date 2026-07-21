import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, ChevronLeft, ChevronRight, X, Trash2, Menu, Mail, Lock, Shield, Truck, RefreshCw, Eye, EyeOff } from 'lucide-react';
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
  categories,
  wishlist = [],
  onRemoveFromWishlist,
  onAddToCart
}) => {
  // Auth state inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeAuthTab, setActiveAuthTab] = useState('login'); // 'otp', 'login', 'signup'
  const [showPassword, setShowPassword] = useState(false);

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
    <>      <div className="sticky top-0 z-40 w-full shadow-sm bg-white border-b border-neutral-200">
        {/* Main Header (White Navbar Layout) */}
        <header className="w-full bg-white z-30 relative py-3 border-b border-neutral-100">
          <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-10 w-full flex flex-col justify-between h-full">
            
            {/* Mobile Header Row */}
            <div className="flex md:hidden justify-between items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-neutral-900 hover:opacity-70 transition-opacity p-1"
              >
                {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
              <a href="/" onClick={(e) => handleNavClick('home', e)} className="flex items-center">
                <img src="/image/new-logo.png" alt="Black District" className="h-10 w-auto object-contain" />
              </a>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="text-neutral-900 hover:opacity-70 transition-opacity"
                >
                  <Search size={18} strokeWidth={1} />
                </button>
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="text-neutral-900 hover:opacity-70 transition-opacity relative"
                >
                  <User size={18} strokeWidth={1} />
                </button>
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="text-neutral-900 hover:opacity-70 transition-opacity relative"
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

            {/* Desktop Single-Row Premium Header matching the Mockup exactly */}
            {!isSearchOpen && (
              <div className="hidden md:flex justify-between items-center max-w-[120rem] mx-auto w-full px-6 lg:px-10 py-1">
                
                {/* Brand Logo (Using user's provided logo image) */}
                <div className="flex items-center">
                  <a href="/" onClick={(e) => handleNavClick('home', e)} className="flex items-center space-x-3">
                    <img src="/image/new-logo.png" alt="Black District" className="h-14 w-auto object-contain" />
                  </a>
                </div>

                {/* Center Navigation Menu Links */}
                <nav className="flex items-center gap-x-6 lg:gap-x-8 text-[11px] font-sans font-bold uppercase tracking-[0.2em] py-2">
                  <a 
                    href="/" 
                    onClick={(e) => handleNavClick('home', e)} 
                    className={currentPage === 'home' ? 'text-[#c5a880] border-b border-[#c5a880] pb-1' : 'text-neutral-600 hover:text-black pb-1 transition-all'}
                  >
                    HOME
                  </a>

                  <a 
                    href="/collections/shirt" 
                    onClick={(e) => handleNavClick('shirt', e)} 
                    className={currentPage === 'shirt' ? 'text-[#c5a880] border-b border-[#c5a880] pb-1' : 'text-neutral-600 hover:text-black pb-1 transition-all'}
                  >
                    SHIRTS
                  </a>

                  <a 
                    href="/collections/pant" 
                    onClick={(e) => handleNavClick('pant', e)} 
                    className={currentPage === 'pant' ? 'text-[#c5a880] border-b border-[#c5a880] pb-1' : 'text-neutral-600 hover:text-black pb-1 transition-all'}
                  >
                    PANTS
                  </a>

                  <a 
                    href="/collections/all" 
                    onClick={(e) => handleNavClick('all', e)} 
                    className={currentPage === 'all' ? 'text-[#c5a880] border-b border-[#c5a880] pb-1' : 'text-neutral-600 hover:text-black pb-1 transition-all'}
                  >
                    ALL COLLECTIONS
                  </a>
                </nav>

                {/* Right Side Search & Account Icons */}
                <div className="flex items-center space-x-5">
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="text-neutral-900 hover:text-neutral-500 transition-colors"
                  >
                    <Search size={18} strokeWidth={1.5} />
                  </button>
                  <button 
                    onClick={() => setIsAuthOpen(true)}
                    className="text-neutral-900 hover:text-neutral-500 transition-colors relative"
                  >
                    <User size={18} strokeWidth={1.5} />
                    {isLoggedIn && (
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2 items-center justify-center rounded-full bg-green-500 text-[10px] text-white p-1">
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => setIsWishlistOpen(true)}
                    className="text-neutral-900 hover:text-neutral-500 transition-colors relative"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={wishlist.length > 0 ? "#ef4444" : "none"} className={wishlist.length > 0 ? "text-red-500" : ""} stroke={wishlist.length > 0 ? "#ef4444" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    {wishlist.length > 0 && (
                      <span className="absolute -bottom-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-extrabold">
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="text-neutral-900 hover:text-neutral-500 transition-colors relative"
                  >
                    <ShoppingBag size={18} strokeWidth={1.5} />
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
                  <div className="flex-1 flex items-center justify-between border border-neutral-200 px-4 py-2.5 bg-neutral-50 rounded-lg">
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
                          setCurrentPage('home');
                          window.history.pushState({}, '', '/');
                        }
                      }}
                      className="flex-1 bg-transparent border-none text-[14px] text-neutral-900 font-sans focus:ring-0 focus:outline-none placeholder-gray-400"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setCurrentPage('home');
                          window.history.pushState({}, '', '/');
                        }}
                        className="text-neutral-400 hover:text-neutral-900 mr-2"
                        title="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <Search size={16} className="text-neutral-500" strokeWidth={1.5} />
                  </div>
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      setCurrentPage('home');
                      window.history.pushState({}, '', '/');
                    }}
                    className="text-neutral-900 hover:text-neutral-500 transition-colors"
                  >
                    <X size={22} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
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
                { label: 'Collections', page: 'all' }
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
                    setCurrentPage('home');
                    window.history.pushState({}, '', '/');
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
                setCurrentPage('home');
                window.history.pushState({}, '', '/');
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
              <>                {/* Left Section: Brand Panel */}
                <div className="w-full md:w-[45%] bg-black p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden min-h-[400px] md:min-h-auto border-r border-neutral-800">
                  
                  {/* Subtle Giftbox background cover */}
                  <div className="absolute inset-0 bg-cover bg-center opacity-[0.15] pointer-events-none mix-blend-luminosity" style={{ backgroundImage: "url('/image/newsletter-box.jpg')" }} />
                  
                  {/* Brand Header */}
                  <div className="text-center space-y-3 z-10 pt-4">
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 mx-auto text-[#c5a880] stroke-current stroke-[1.5]">
                      <path d="M22 28C18 20 12 18 8 20M14 23C11 18 13 14 16 12M42 28C46 20 52 18 56 20M50 23C53 18 51 14 48 12" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M26 30C26 30 18 34 16 38C14 42 18 44 22 40C24 38 27 34 27 34L32 44L37 34C37 34 40 38 42 40C46 44 50 42 48 38C46 34 38 30 38 30" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M27 34L32 50L37 34L32 30L27 34Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                    <div className="font-heading tracking-widest text-center">
                      <span className="block text-[15px] font-black tracking-[0.25em] text-white">BLACK</span>
                      <span className="block text-[9.5px] font-bold tracking-[0.4em] text-[#c5a880] uppercase">DISTRICT</span>
                    </div>
                  </div>

                  {/* Brand Tagline */}
                  <div className="text-center z-10 py-6 space-y-2">
                    <span className="block text-[9px] font-bold tracking-[0.3em] text-[#c5a880] uppercase">WELCOME BACK</span>
                    <h3 className="text-[22px] font-heading font-normal leading-snug text-white">
                      Login to Your Account
                    </h3>
                    <div className="w-16 h-[1.5px] bg-[#c5a880] mx-auto mt-3"></div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-5 z-10 py-4 max-w-xs mx-auto w-full">
                    <div className="flex items-center space-x-3.5">
                      <div className="p-2 bg-[#c5a880]/10 rounded-lg text-[#c5a880]">
                        <Shield size={18} strokeWidth={1.5} />
                      </div>
                      <div className="text-left">
                        <span className="block text-[11px] font-bold text-white uppercase tracking-wider">Premium Quality</span>
                        <span className="block text-[10px] text-gray-400 font-medium">Finest Fabrics</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3.5">
                      <div className="p-2 bg-[#c5a880]/10 rounded-lg text-[#c5a880]">
                        <Truck size={18} strokeWidth={1.5} />
                      </div>
                      <div className="text-left">
                        <span className="block text-[11px] font-bold text-white uppercase tracking-wider">Fast Delivery</span>
                        <span className="block text-[10px] text-gray-400 font-medium">Pan India Shipping</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3.5">
                      <div className="p-2 bg-[#c5a880]/10 rounded-lg text-[#c5a880]">
                        <RefreshCw size={17} strokeWidth={1.5} />
                      </div>
                      <div className="text-left">
                        <span className="block text-[11px] font-bold text-white uppercase tracking-wider">Easy Returns</span>
                        <span className="block text-[10px] text-gray-400 font-medium">7-Day Returns</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Security status */}
                  <div className="flex items-center justify-center space-x-1.5 text-gray-400 text-[10px] font-medium tracking-wide z-10 pt-4 pb-2">
                    <Lock size={10} className="text-[#c5a880]" />
                    <span>Your data is 100% secure with us.</span>
                  </div>

                </div>

                {/* Right Section: Form content */}
                <div className="w-full md:w-[55%] p-8 md:p-10 flex flex-col justify-between bg-white text-gray-900">
                  
                  <div>
                    {/* Selector Tabs */}
                    <div className="flex border-b border-neutral-100 mb-6 text-[10px] font-sans font-bold uppercase tracking-widest text-neutral-400">
                      <button 
                        type="button"
                        onClick={() => { setActiveAuthTab('login'); setAuthError(''); }}
                        className={`flex-1 pb-3 text-center border-b-2 flex items-center justify-center transition-colors ${activeAuthTab === 'login' ? 'border-[#c5a880] text-black font-extrabold' : 'border-transparent hover:text-black'}`}
                      >
                        <User size={13} strokeWidth={2.5} className="mr-1.5 text-[#c5a880]" />
                        LOGIN
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setActiveAuthTab('signup'); setAuthError(''); }}
                        className={`flex-1 pb-3 text-center border-b-2 flex items-center justify-center transition-colors ${activeAuthTab === 'signup' ? 'border-[#c5a880] text-black font-extrabold' : 'border-transparent hover:text-black'}`}
                      >
                        <User size={13} strokeWidth={2.5} className="mr-1.5 text-[#c5a880]" />
                        SIGN UP
                      </button>
                    </div>

                    {authError && (
                      <div className="bg-red-50 text-red-600 border border-red-200 p-3 text-[12px] rounded mb-4 font-medium">
                        {authError}
                      </div>
                    )}

                    {/* Render conditional forms */}
                    {activeAuthTab === 'login' && (
                      <div className="space-y-4">
                        <div className="text-left space-y-1 mb-5">
                          <h2 className="text-xl sm:text-2xl font-bold font-sans text-neutral-900">Welcome back!</h2>
                          <p className="text-[12px] text-gray-500">Please login to continue to BlackDistrict.</p>
                        </div>

                        <form onSubmit={handleAuthSubmit} className="space-y-4 text-left font-sans">
                          <div className="flex flex-col space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3.5 text-gray-400">
                                <Mail size={16} strokeWidth={1.5} />
                              </span>
                              <input 
                                type="email" 
                                required 
                                placeholder="Enter your email address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded text-[13.5px] focus:outline-none focus:border-black font-medium bg-neutral-50"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3.5 text-gray-400">
                                <Lock size={16} strokeWidth={1.5} />
                              </span>
                              <input 
                                type={showPassword ? "text" : "password"}
                                required 
                                placeholder="Enter your password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-neutral-200 rounded text-[13.5px] focus:outline-none focus:border-black font-medium bg-neutral-50"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-gray-400 hover:text-black transition-colors"
                              >
                                {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                              </button>
                            </div>
                          </div>

                          <div className="text-right">
                            <button 
                              type="button" 
                              onClick={() => { setActiveAuthTab('forgot'); setAuthError(''); }}
                              className="text-[11px] text-[#c5a880] hover:underline font-bold"
                            >
                              Forgot Password?
                            </button>
                          </div>

                          <button 
                            type="submit" 
                            disabled={otpLoading}
                            className="w-full py-3.5 bg-black hover:opacity-90 text-white text-[11px] font-sans font-bold uppercase tracking-widest transition-opacity rounded-lg"
                          >
                            {otpLoading ? 'LOGGING IN...' : 'LOGIN'}
                          </button>
                        </form>
                      </div>
                    )}

                    {activeAuthTab === 'signup' && (
                      <div className="space-y-4">
                        <div className="text-left space-y-1 mb-5">
                          <h2 className="text-xl sm:text-2xl font-bold font-sans text-neutral-900">Create an account!</h2>
                          <p className="text-[12px] text-gray-500">Please sign up to continue to BlackDistrict.</p>
                        </div>

                        <form onSubmit={handleAuthSubmit} className="space-y-4 text-left font-sans">
                          <div className="flex flex-col space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3.5 text-gray-400">
                                <User size={16} strokeWidth={1.5} />
                              </span>
                              <input 
                                type="text" 
                                required 
                                placeholder="Enter your full name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded text-[13.5px] focus:outline-none focus:border-black font-medium bg-neutral-50"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3.5 text-gray-400">
                                <Mail size={16} strokeWidth={1.5} />
                              </span>
                              <input 
                                type="email" 
                                required 
                                placeholder="Enter your email address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded text-[13.5px] focus:outline-none focus:border-black font-medium bg-neutral-50"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3.5 text-gray-400">
                                <Lock size={16} strokeWidth={1.5} />
                              </span>
                              <input 
                                type={showPassword ? "text" : "password"}
                                required 
                                placeholder="Create password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-neutral-200 rounded text-[13.5px] focus:outline-none focus:border-black font-medium bg-neutral-50"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-gray-400 hover:text-black transition-colors"
                              >
                                {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                              </button>
                            </div>
                          </div>

                          <button 
                            type="submit" 
                            disabled={otpLoading}
                            className="w-full py-3.5 bg-black hover:opacity-90 text-white text-[11px] font-sans font-bold uppercase tracking-widest transition-opacity rounded-lg"
                          >
                            {otpLoading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                          </button>
                        </form>
                      </div>
                    )}

                    {activeAuthTab === 'forgot' && (
                      <div className="space-y-4">
                        <div className="text-left space-y-1 mb-5">
                          <h2 className="text-xl sm:text-2xl font-bold font-sans text-neutral-900">Reset Password</h2>
                          <p className="text-[12px] text-gray-500">Enter your email and we'll send you a link to reset your password.</p>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); alert("Password reset link sent to your email!"); setActiveAuthTab('login'); }} className="space-y-4 text-left font-sans">
                          <div className="flex flex-col space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3.5 text-gray-400">
                                <Mail size={16} strokeWidth={1.5} />
                              </span>
                              <input 
                                type="email" 
                                required 
                                placeholder="Enter your email address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded text-[13.5px] focus:outline-none focus:border-black font-medium bg-neutral-50"
                              />
                            </div>
                          </div>
                          
                          <button 
                            type="submit" 
                            disabled={otpLoading}
                            className="w-full py-3.5 bg-black hover:opacity-90 text-white text-[11px] font-sans font-bold uppercase tracking-widest transition-opacity rounded-lg"
                          >
                            {otpLoading ? 'SENDING...' : 'SEND RESET LINK'}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Global Google Authentication Alternative */}
                    <div className="space-y-4">
                      {/* Divider Line */}
                      <div className="relative flex items-center justify-center my-6 font-sans">
                        <div className="w-full border-t border-neutral-200"></div>
                        <span className="absolute bg-white px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">OR</span>
                      </div>

                      {/* Google Auth Button styled like mockup */}
                      <div className="relative w-full flex justify-center mt-2 min-h-[44px]">
                        <div id="google-button-container" className="w-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Footnote toggler */}
                  <div className="text-[12px] font-sans text-center text-gray-500 mt-6 pt-4 border-t border-neutral-100">
                    {activeAuthTab === 'login' ? (
                      <span>
                        Don't have an account?{' '}
                        <button 
                          onClick={() => { setActiveAuthTab('signup'); setAuthError(''); }}
                          className="text-[#c5a880] hover:underline font-bold"
                        >
                          Sign up
                        </button>
                      </span>
                    ) : activeAuthTab === 'forgot' ? (
                      <span>
                        Remember your password?{' '}
                        <button 
                          onClick={() => { setActiveAuthTab('login'); setAuthError(''); }}
                          className="text-[#c5a880] hover:underline font-bold"
                        >
                          Login
                        </button>
                      </span>
                    ) : (
                      <span>
                        Already have an account?{' '}
                        <button 
                          onClick={() => { setActiveAuthTab('login'); setAuthError(''); }}
                          className="text-[#c5a880] hover:underline font-bold"
                        >
                          Login
                        </button>
                      </span>
                    )}
                  </div>

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

      {/* Dynamic Slide-Over Wishlist Drawer */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <div 
            onClick={() => setIsWishlistOpen(false)}
            className="absolute inset-0 bg-black/40 transition-opacity" 
          />
          
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md bg-[#f5f5f0] border-l border-[#e5e5e0]">
              <div className="flex h-full flex-col overflow-y-scroll py-6 shadow-xl">
                
                {/* Header */}
                <div className="px-4 sm:px-6 flex items-center justify-between pb-4 border-b border-[#e5e5e0]">
                  <h2 className="text-lg font-medium text-[#1a1a1a] uppercase tracking-wider">Your Wishlist</h2>
                  <button 
                    onClick={() => setIsWishlistOpen(false)}
                    className="text-gray-500 hover:text-black"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Items list */}
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  {wishlist.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-center px-4 space-y-6">
                      <h3 className="text-[24px] font-heading font-medium text-[#1a1a1a]">
                        Your wishlist is empty
                      </h3>
                      <button 
                        onClick={() => {
                          setIsWishlistOpen(false);
                          setCurrentPage('home');
                        }}
                        className="px-8 py-3.5 bg-black text-white text-[13px] font-sans font-semibold uppercase tracking-widest hover:opacity-95 transition-opacity w-full max-w-[280px]"
                      >
                        Explore Products
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {wishlist.map((item) => (
                        <div key={item._id} className="flex items-center gap-4 py-4 border-b border-neutral-200">
                          <img 
                            src={item.images && item.images[0]} 
                            alt={item.name} 
                            className="h-20 w-16 object-cover bg-neutral-100 rounded" 
                          />
                          <div className="flex-1 text-left space-y-1">
                            <h4 className="text-[13.5px] font-semibold text-[#1a1a1a] truncate">{item.name}</h4>
                            <p className="text-[12px] text-gray-500 uppercase tracking-wider">{item.color || 'Signature style'}</p>
                            <p className="text-[13px] font-extrabold text-neutral-800">
                              ₹{item.price ? item.price.toLocaleString('en-IN') : item.price}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <button
                              onClick={() => {
                                onAddToCart(item, '30' || 'S', 1);
                                setIsWishlistOpen(false);
                              }}
                              className="px-3 py-1.5 bg-[#c5a880] text-black text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity rounded"
                            >
                              Add to Bag
                            </button>
                            <button
                              onClick={() => onRemoveFromWishlist(item)}
                              className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
