import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HomePageInfo from './components/HomePageInfo';
import ProductGrid from './components/ProductGrid';
import PantCollectionPage from './components/PantCollectionPage';
import ShirtCollectionPage from './components/ShirtCollectionPage';
import AllCollectionsPage from './components/AllCollectionsPage';
import ProductDescriptionPage from './components/ProductDescriptionPage';
import CheckoutPage from './components/CheckoutPage';
import SearchResultsPage from './components/SearchResultsPage';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import CataloguePage from './components/CataloguePage';
import { API_BASE_URL } from './apiConfig';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Hoisted Customer Login / Registration state variables
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('user') ? true : false
  );
  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );

  // Dynamic store logo settings
  const [storeLogo, setStoreLogo] = useState('');
  const loadSettings = () => {
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && data.storeLogo) {
          setStoreLogo(data.storeLogo);
        }
      })
      .catch(err => console.error("Error loading store logo:", err));
  };

  useEffect(() => {
    loadSettings();
    window.addEventListener('settingsChange', loadSettings);
    return () => window.removeEventListener('settingsChange', loadSettings);
  }, []);

  // Open KwikPass auth modal trigger from window event listeners
  useEffect(() => {
    const handleOpenAuth = () => setIsAuthOpen(true);
    window.addEventListener('openAuthModal', handleOpenAuth);
    return () => window.removeEventListener('openAuthModal', handleOpenAuth);
  }, []);
  
  // Dynamic product detail & search states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state with path on load
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/collections/pantts') {
      setCurrentPage('pant');
    } else if (path === '/collections/shirts') {
      setCurrentPage('shirt');
    } else if (path === '/collections') {
      setCurrentPage('collections');
    } else if (path === '/pages/contact') {
      setCurrentPage('contact');
    } else if (path === '/admin') {
      setCurrentPage('admin');
    } else if (path === '/catalogue') {
      setCurrentPage('catalogue');
    } else if (path === '/') {
      setCurrentPage('home'); // Default to home
    }
  }, []);

  // Cart operations
  const handleAddToCart = (product, size, quantity) => {
    setCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex(
        (item) => item._id === product._id && item.size === size
      );
      if (existingIdx > -1) {
        const updated = [...prevItems];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, { ...product, size, quantity }];
      }
    });
    setIsCartOpen(true); // Auto-open cart drawer on item addition for premium feel
  };

  const handleRemoveFromCart = (productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item._id === productId && item.size === size))
    );
  };

  const handleUpdateQuantity = (productId, size, newQty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId && item.size === size
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleBuyNow = (product, size, quantity) => {
    // Add to cart first so they checkout with this item
    setCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex(
        (item) => item._id === product._id && item.size === size
      );
      if (existingIdx > -1) {
        const updated = [...prevItems];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, { ...product, size, quantity }];
      }
    });
    // Redirect straight to checkout page
    setCurrentPage('checkout');
  };

  const handleCollectionsNavigation = (path) => {
    if (path === 'pant') {
      setCurrentPage('pant');
      window.history.pushState({}, '', '/collections/pantts');
    } else if (path === 'shirt') {
      setCurrentPage('shirt');
      window.history.pushState({}, '', '/collections/shirts');
    } else if (path === 'home') {
      setCurrentPage('home');
      window.history.pushState({}, '', '/');
    } else if (path === 'collections') {
      setCurrentPage('collections');
      window.history.pushState({}, '', '/collections');
    } else {
      // Default fallback for other mock collections to featured home page
      setCurrentPage('home');
      window.history.pushState({}, '', `/collections/${path}`);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f5f5f0]">
      {currentPage !== 'admin' && (
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          cartItems={cartItems}
          onRemoveFromCart={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          cartCount={cartCount}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          isSearchOpen={isSearchOpen}
          setIsSearchOpen={setIsSearchOpen}
          isAuthOpen={isAuthOpen}
          setIsAuthOpen={setIsAuthOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCheckout={() => {
            setIsCartOpen(false);
            setCurrentPage('checkout');
          }}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          loggedInUser={loggedInUser}
          setLoggedInUser={setLoggedInUser}
          storeLogo={storeLogo}
        />
      )}
      
      <main className="flex-grow">
        {currentPage === 'pant' && (
          <PantCollectionPage 
            onAddToCart={handleAddToCart} 
            onProductSelect={(prod) => {
              setSelectedProduct(prod);
              setCurrentPage('description');
              window.history.pushState({}, '', `/products/${prod._id}`);
            }}
          />
        )}
        {currentPage === 'shirt' && (
          <ShirtCollectionPage 
            onProductSelect={(prod) => {
              setSelectedProduct(prod);
              setCurrentPage('description');
              window.history.pushState({}, '', `/products/${prod._id}`);
            }}
          />
        )}
        {(currentPage === 'collections' || currentPage === 'all') && (
          <AllCollectionsPage onNavigate={handleCollectionsNavigation} />
        )}
        {currentPage === 'description' && (
          <ProductDescriptionPage 
            product={selectedProduct}
            onBack={() => {
              // Return to previous view category
              if (selectedProduct && selectedProduct.category === 'shirt') {
                setCurrentPage('shirt');
              } else {
                setCurrentPage('pant');
              }
              window.history.pushState({}, '', '/');
            }}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}
        {currentPage === 'checkout' && (
          <div className="relative">
            {/* Background page details */}
            <ProductDescriptionPage 
              product={selectedProduct}
              onBack={() => {}}
              onAddToCart={() => {}}
              onBuyNow={() => {}}
            />
            {/* Centered overlay checkout drawer */}
            <CheckoutPage 
              cartItems={cartItems}
              onBack={() => {
                if (selectedProduct) {
                  setCurrentPage('description');
                } else {
                  setCurrentPage('pant');
                }
              }}
              onClearCart={() => setCartItems([])}
              isLoggedIn={isLoggedIn}
              storeLogo={storeLogo}
            />
          </div>
        )}
        {currentPage === 'search' && (
          <SearchResultsPage 
            searchQuery={searchQuery}
            onBack={() => {
              setCurrentPage('pant');
              setSearchQuery('');
            }}
            onProductSelect={(prod) => {
              setSelectedProduct(prod);
              setCurrentPage('description');
              window.history.pushState({}, '', `/products/${prod._id}`);
            }}
          />
        )}
        {currentPage === 'contact' && (
          <ContactPage />
        )}
        {currentPage === 'catalogue' && (
          <CataloguePage />
        )}
        {currentPage === 'admin' && (
          <AdminPanel 
            onBack={() => {
              setCurrentPage('home');
              window.history.pushState({}, '', '/');
            }} 
          />
        )}
        {currentPage === 'home' && (
          <>
            <Hero />
            <HomePageInfo onNavigate={handleCollectionsNavigation} />
            <ProductGrid 
              onProductSelect={(prod) => {
                setSelectedProduct(prod);
                setCurrentPage('description');
                window.history.pushState({}, '', `/products/${prod._id}`);
              }}
            />
          </>
        )}
      </main>
      
      {currentPage !== 'admin' && <Footer />}
    </div>
  );
}

export default App;
