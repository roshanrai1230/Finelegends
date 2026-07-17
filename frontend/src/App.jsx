<<<<<<< Updated upstream
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Elegance from './components/Elegance'
import ProductGrid from './components/ProductGrid'
import Collections from './components/Collections'
import CubanClassic from './components/CubanClassic'
import Heritage from './components/Heritage'
import Footer from './components/Footer'
import ContactPage from './ContactPage'

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f5f5f0]">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Elegance />
        <ProductGrid />
        <Collections />
        <CubanClassic />
        <Heritage />
=======
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import PantCollectionPage from './components/PantCollectionPage';
import ShirtCollectionPage from './components/ShirtCollectionPage';
import AllCollectionsPage from './components/AllCollectionsPage';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('pant');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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
    } else if (path === '/') {
      setCurrentPage('pant'); // Default to pant to show collection first-hand
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
    } else {
      // Default fallback for other mock collections to featured home page
      setCurrentPage('home');
      window.history.pushState({}, '', `/collections/${path}`);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f5f5f0]">
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
      />
      
      <main className="flex-grow">
        {currentPage === 'pant' && (
          <PantCollectionPage onAddToCart={handleAddToCart} />
        )}
        {currentPage === 'shirt' && (
          <ShirtCollectionPage />
        )}
        {currentPage === 'collections' && (
          <AllCollectionsPage onNavigate={handleCollectionsNavigation} />
        )}
        {currentPage === 'contact' && (
          <ContactPage />
        )}
        {currentPage === 'home' && (
          <>
            <Hero />
            <ProductGrid />
          </>
        )}
>>>>>>> Stashed changes
      </main>
      
      <Footer />
    </div>
  );
}

<<<<<<< Updated upstream
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
=======
export default App;
>>>>>>> Stashed changes
