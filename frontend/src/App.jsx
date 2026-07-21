import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HomePageInfo from './components/HomePageInfo';
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
import HomeFeatures from './components/HomeFeatures';
import HomeCategories from './components/HomeCategories';
import HomeSplitBanner from './components/HomeSplitBanner';
import StyleJournal from './components/StyleJournal';
import Testimonials from './components/Testimonials';
import LimitedDropBar from './components/LimitedDropBar';
import Newsletter from './components/Newsletter';
import ProductGrid from './components/ProductGrid';
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
  const [categories, setCategories] = useState([
    { name: 'pant', label: 'Pants' },
    { name: 'shirt', label: 'Shirts' },
    { name: 'combo', label: 'Combos' },
    { name: 'footwear', label: 'Footwear' }
  ]);

  const loadCategories = () => {
    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(err => console.error("Error loading categories:", err));
  };

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
    loadCategories();
    window.addEventListener('settingsChange', loadSettings);
    window.addEventListener('categoriesChange', loadCategories);
    return () => {
      window.removeEventListener('settingsChange', loadSettings);
      window.removeEventListener('categoriesChange', loadCategories);
    };
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
    
    if (path.startsWith('/collections/')) {
      const catName = path.replace('/collections/', '');
      const validCategories = ['pant', 'pantts', 'pants', 'shirt', 'shirts', 'combo', 'combos', 'footwear', 'watches'];
      if (validCategories.includes(catName)) {
        if (catName === 'pantts' || catName === 'pants') {
          setCurrentPage('pant');
        } else if (catName === 'shirts') {
          setCurrentPage('shirt');
        } else {
          setCurrentPage(catName);
        }
      } else {
        setCurrentPage('404');
      }
    } else if (path === '/collections') {
      setCurrentPage('collections');
    } else if (path === '/pages/contact') {
      setCurrentPage('contact');
    } else if (path === '/admin') {
      setCurrentPage('admin');
    } else if (path === '/catalogue') {
      setCurrentPage('catalogue');
    } else if (path.startsWith('/products/')) {
      // Allow detail pages
      setCurrentPage('home');
    } else if (path === '/') {
      setCurrentPage('home');
    } else {
      setCurrentPage('404');
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
          categories={categories}
        />
      )}
      
      <main className="flex-grow">
        {categories.map(cat => (
          currentPage === cat.name && (
            <PantCollectionPage 
              key={cat.name}
              category={cat.name}
              categoryLabel={cat.label}
              categoryDesc={cat.name === 'shirt' 
                ? 'Timeless shirts hand-tailored from premium materials. Experience the perfect drape, breathable linen weave, and artisanal craftsmanship built for the modern legend.'
                : cat.name === 'combo' 
                ? 'Pre-curated combination sets matching our premium linens together. Perfectly paired and ready to make a statement.'
                : undefined
              }
              onAddToCart={handleAddToCart} 
              onProductSelect={(prod) => {
                setSelectedProduct(prod);
                setCurrentPage('description');
                window.history.pushState({}, '', `/products/${prod._id}`);
              }}
            />
          )
        ))}
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
            categories={categories}
            loadCategories={loadCategories}
          />
        )}
        {currentPage === '404' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-6 text-center space-y-6 font-sans">
            <h1 className="text-[72px] font-heading font-black text-gray-900 leading-none">404</h1>
            <h2 className="text-[20px] font-bold tracking-widest text-[#c5a880] uppercase">Page Not Found</h2>
            <p className="text-[14px] text-gray-500 max-w-sm leading-relaxed">
              The page you are looking for does not exist, has been removed, or has been relocated.
            </p>
            <button 
              onClick={() => {
                setCurrentPage('home');
                window.history.pushState({}, '', '/');
              }}
              className="px-9 py-3.5 bg-black hover:opacity-90 text-white font-sans text-[11px] font-bold uppercase tracking-widest transition-opacity"
            >
              Back To Home
            </button>
          </div>
        )}
        {currentPage === 'home' && (
          <>
            <Hero />
            <HomeFeatures />
            <HomeCategories onNavigate={handleCollectionsNavigation} />
            <ProductGrid 
              onNavigate={handleCollectionsNavigation}
              onProductSelect={(prod) => {
                setSelectedProduct(prod);
                setCurrentPage('description');
                window.history.pushState({}, '', `/products/${prod._id}`);
              }}
            />
            <HomeSplitBanner onNavigate={handleCollectionsNavigation} />
            <StyleJournal />
            <Testimonials />
            <LimitedDropBar onNavigate={handleCollectionsNavigation} />
            <Newsletter />
          </>
        )}
      </main>
      
      {currentPage !== 'admin' && <Footer />}
    </div>
  );
}

export default App;
