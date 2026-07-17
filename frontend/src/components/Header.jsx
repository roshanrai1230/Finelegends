import React, { useState } from 'react';
import { ShoppingBag, Search, User, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';

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
  setIsAuthOpen
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth state inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
      setIsAuthOpen(false);
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#002349] flex justify-between items-center py-2 px-4 sm:px-6 lg:px-8 z-30 relative">
        <button className="text-gray-300 hover:text-white">
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
        <div className="text-[#ebd9aa] text-xs sm:text-sm font-heading tracking-wide text-center">
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
                <img src="/image/logo-signature.webp" alt="FineLegends" className="h-12 w-auto object-contain" />
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-[16px] font-sans p-2 focus:ring-0 focus:outline-none placeholder-gray-400"
              />
            </div>
            <button 
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="text-[#1a1a1a] hover:opacity-75"
            >
              <X size={22} />
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Profile Modal */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-[#f5f5f0] border border-[#e5e5e0] max-w-md w-full p-8 relative text-left">
            <button 
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            {isLoggedIn ? (
              <div className="text-center">
                <h2 className="text-[22px] font-heading mb-4">Welcome back, Legend!</h2>
                <p className="text-[14px] font-sans text-[#6b6b66] mb-6">You are logged into your FineLegends account.</p>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full py-3 bg-[#002349] text-white uppercase text-[12px] font-sans tracking-widest font-medium"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <h2 className="text-[22px] font-heading mb-4">{isSignUp ? 'Create Account' : 'Login'}</h2>
                <div className="flex flex-col">
                  <label className="text-[12px] font-sans font-semibold uppercase tracking-wider mb-2">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border border-[#1a1a1a] px-3 py-2 bg-transparent text-[14px] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[12px] font-sans font-semibold uppercase tracking-wider mb-2">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border border-[#1a1a1a] px-3 py-2 bg-transparent text-[14px] focus:outline-none"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-3 bg-[#002349] text-white uppercase text-[12px] font-sans tracking-widest font-medium"
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="w-full text-center text-[12px] underline hover:text-[#002349]"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </form>
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
                    <div className="h-full flex flex-col justify-center items-center text-center">
                      <ShoppingBag size={40} className="text-[#8c8c82] mb-4" />
                      <p className="text-[15px] text-[#6b6b66]">Your bag is currently empty.</p>
                      <button 
                        onClick={() => {
                          setIsCartOpen(false);
                          handleNavClick('pant');
                        }}
                        className="mt-6 px-6 py-2.5 bg-[#002349] text-white text-[12px] uppercase tracking-wider font-medium"
                      >
                        Shop the collections
                      </button>
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
                        onClick={() => alert('Proceeding to checkout with Gokwik...')}
                        className="flex w-full items-center justify-center bg-[#002349] px-6 py-4 text-[13px] font-semibold text-white uppercase tracking-widest hover:opacity-90 transition-opacity"
                      >
                        Checkout (Gokwik)
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
