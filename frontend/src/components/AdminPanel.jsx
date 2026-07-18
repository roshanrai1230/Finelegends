import React, { useState, useEffect } from 'react';
import { Shield, CreditCard, Mail, BarChart2, LogOut, Search, Clock, Users, ArrowUpRight, Plus, Trash2, CheckCircle2, AlertTriangle, Layers, MessageSquare, Star, Calendar, Bell, ChevronDown, ShoppingBag, Box, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const AdminPanel = ({ onBack }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // Admin login states (backed by user DB)
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dynamic Data Lists
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Product Form States
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdComparePrice, setNewProdComparePrice] = useState('');
  const [newProdImages, setNewProdImages] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('pant');
  const [newProdAvailability, setNewProdAvailability] = useState(true);
  const [prodFormMessage, setProdFormMessage] = useState('');

  const fetchAdminData = () => {
    // Fetch Orders
    fetch(`${API_BASE_URL}/api/payment/orders`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setOrders(data); })
      .catch(err => console.error('Error fetching admin orders:', err));

    // Fetch Contacts
    fetch(`${API_BASE_URL}/api/contact`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setContacts(data); })
      .catch(err => console.error('Error fetching admin contacts:', err));

    // Fetch Products
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setProducts(data); })
      .catch(err => console.error('Error fetching admin products:', err));

    // Fetch Reviews
    fetch(`${API_BASE_URL}/api/reviews`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setReviews(data); })
      .catch(err => console.error('Error fetching admin reviews:', err));
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchAdminData();
    }
  }, [isAuthorized]);

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    if (!name || !email || !password) {
      setLoginError('All fields are required.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setLoginSuccess('Admin account created successfully! Please log in.');
        setAuthMode('login');
        setPassword('');
      } else {
        setLoginError(data.message || 'Signup failed.');
      }
    } catch (err) {
      setLoginError('Error connecting to authentication server.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Log In
  const handleLogIn = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    if (!email || !password) {
      setLoginError('Email and password are required.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        const allowedEmails = ['dk897869@gmail.com', 'admin@regalweave.com', 'admin@finelegends.com'];
        if (allowedEmails.includes(email.toLowerCase()) || data.email.toLowerCase().includes('admin')) {
          setIsAuthorized(true);
        } else {
          setLoginError('Unauthorized: Access restricted to Admin accounts only.');
        }
      } else {
        setLoginError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setLoginError('Connection error verifying admin credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Toggle Stock Availability
  const handleToggleStock = async (productId, currentStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: !currentStatus })
      });
      if (res.ok) {
        setProducts(products.map(p => p._id === productId ? { ...p, availability: !currentStatus } : p));
      } else {
        alert('Failed to update product stock status.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating stock status.');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== productId));
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting product.');
    }
  };

  // Add Product Submit
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    setProdFormMessage('');
    if (!newProdName || !newProdPrice || !newProdImages) {
      setProdFormMessage('Product name, price, and images are required.');
      return;
    }

    const imageArray = newProdImages.split(',').map(url => url.trim()).filter(Boolean);

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          price: Number(newProdPrice),
          compareAtPrice: newProdComparePrice ? Number(newProdComparePrice) : undefined,
          images: imageArray,
          description: newProdDesc,
          category: newProdCategory,
          availability: newProdAvailability
        })
      });
      const data = await res.json();
      if (res.ok) {
        setProducts([...products, data]);
        setNewProdName('');
        setNewProdPrice('');
        setNewProdComparePrice('');
        setNewProdImages('');
        setNewProdDesc('');
        setNewProdCategory('pant');
        setNewProdAvailability(true);
        setProdFormMessage('Product added successfully!');
      } else {
        setProdFormMessage(data.message || 'Failed to add product.');
      }
    } catch (err) {
      setProdFormMessage('Error adding product.');
    }
  };

  // Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setReviews(reviews.filter(r => r._id !== reviewId));
      } else {
        alert('Failed to delete review.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting review.');
    }
  };

  // Calculations
  const totalRevenue = orders.reduce((sum, order) => sum + (order.status === 'success' ? order.amount : 0), 0);
  const totalOrdersCount = orders.length;
  const successfulOrdersCount = orders.filter(o => o.status === 'success').length;
  const avgOrderValue = successfulOrdersCount > 0 ? Math.round(totalRevenue / successfulOrdersCount) : 0;

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value).replace('₹', 'Rs. ');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] font-sans flex items-center justify-center p-4">
        <div className="bg-white border border-[#eae8e4] p-8 max-w-md w-full shadow-lg rounded-xl text-left font-sans">
          
          <div className="flex flex-col items-center text-center mb-8">
            <img src="/image/logo-signature.webp" alt="Regal Weave Logo" className="h-24 w-auto object-contain mb-4 mix-blend-multiply" />
            <h1 className="text-[20px] font-heading font-medium tracking-wide">Regal Weave Admin</h1>
            <p className="text-[12px] text-gray-400 font-sans mt-1">Authorized Access Control Portal</p>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 text-[12px] rounded mb-5">
              ⚠️ {loginError}
            </div>
          )}

          {loginSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-600 p-3 text-[12px] rounded mb-5">
              ✓ {loginSuccess}
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLogIn} className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="Enter admin email id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#fbfbfa] border border-[#e5e5e0] rounded text-[13px] text-gray-800 focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#fbfbfa] border border-[#e5e5e0] rounded text-[13px] text-gray-800 focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <button 
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 bg-black hover:bg-black/90 text-white text-[12px] font-bold uppercase tracking-wider transition-colors rounded"
              >
                {loginLoading ? 'Verifying...' : 'Log In As Admin'}
              </button>

              <div className="text-center pt-2">
                <span className="text-[12px] text-gray-400">Need account? </span>
                <button 
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setLoginError('');
                    setLoginSuccess('');
                  }}
                  className="text-black hover:underline text-[12px] font-bold"
                >
                  Create Admin
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#fbfbfa] border border-[#e5e5e0] rounded text-[13px] text-gray-800 focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="admin@regalweave.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#fbfbfa] border border-[#e5e5e0] rounded text-[13px] text-gray-800 focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#fbfbfa] border border-[#e5e5e0] rounded text-[13px] text-gray-800 focus:outline-none focus:border-black font-semibold"
                />
              </div>

              <button 
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 bg-black hover:bg-black/90 text-white text-[12px] font-bold uppercase tracking-wider transition-colors rounded"
              >
                {loginLoading ? 'Registering...' : 'Register Admin Account'}
              </button>

              <div className="text-center pt-2">
                <span className="text-[12px] text-gray-400">Already registered? </span>
                <button 
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setLoginError('');
                    setLoginSuccess('');
                  }}
                  className="text-black hover:underline text-[12px] font-bold"
                >
                  Log In
                </button>
              </div>
            </form>
          )}

          <button 
            onClick={onBack}
            className="w-full text-center text-[12px] text-gray-400 hover:text-black underline mt-6 block"
          >
            ← Exit Admin Portal
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#1a1a1a] font-sans flex flex-col md:flex-row text-left select-none">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#eae8e4] flex flex-col justify-between py-6 px-4 shrink-0">
        <div className="space-y-8">
          
          {/* Logo Header */}
          <div className="px-2">
            <img src="/image/logo-signature.webp" alt="Regal Weave" className="h-20 w-auto object-contain mix-blend-multiply" />
          </div>

          {/* Menu items list matching 2nd image */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={17} /> },
              { id: 'products', label: 'Products', icon: <Box size={17} />, count: products.length },
              { id: 'categories', label: 'Categories', icon: <Layers size={17} />, count: 3 },
              { id: 'orders', label: 'Orders', icon: <CreditCard size={17} />, count: orders.length },
              { id: 'reviews', label: 'Reviews', icon: <MessageSquare size={17} />, count: reviews.length },
              { id: 'contacts', label: 'Customers', icon: <Users size={17} /> },
              { id: 'reports', label: 'Reports', icon: <BarChart2 size={17} /> },
              { id: 'settings', label: 'Settings', icon: <Shield size={17} /> }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => {
                  if (item.id === 'settings') {
                    alert('Settings feature configured successfully!');
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded text-[13px] font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-[#f4ece1] text-[#8e744a]' 
                    : 'text-gray-500 hover:bg-[#faf9f6] hover:text-black'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className="font-sans font-semibold">{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="text-[10px] font-bold bg-[#faf9f6] text-gray-500 px-2 py-0.5 rounded border border-gray-100">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

        </div>

        {/* Sidebar Bottom widgets */}
        <div className="space-y-4 pt-6 border-t border-[#eae8e4] mt-6 md:mt-0 font-sans">
          
          {/* Go to store button widget */}
          <button 
            onClick={onBack}
            className="w-full border border-[#eae8e4] bg-[#faf9f6] hover:bg-[#f4ece1]/20 p-3 flex justify-between items-center rounded-lg transition-colors text-left"
          >
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-gray-800 flex items-center space-x-1">
                <span>🛒</span>
                <span>Go to Store</span>
              </span>
              <span className="text-[9px] text-gray-400 block font-medium">View your live store</span>
            </div>
            <ArrowRight size={14} className="text-gray-400" />
          </button>

          {/* Profile Card */}
          <div className="flex items-center justify-between p-2 rounded hover:bg-[#faf9f6] cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-full bg-[#f4ece1] text-[#8e744a] flex items-center justify-center font-bold text-[13px] border border-[#e5dec9]">
                RW
              </div>
              <div className="text-left leading-none">
                <div className="text-[12px] font-bold text-gray-800">Regal Weave</div>
                <span className="text-[9px] text-gray-400 mt-1 block">Admin</span>
              </div>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </div>

          <button 
            onClick={() => setIsAuthorized(false)}
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-red-600 transition-colors text-[12px]"
          >
            <LogOut size={16} />
            <span>Log Out Account</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Top Bar Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 border-b border-[#eae8e4] pb-4">
              <div>
                <h1 className="text-[26px] font-heading font-medium tracking-tight flex items-center space-x-1">
                  <span>Dashboard</span>
                  <span className="text-[#d4af37] text-[18px]">✦</span>
                </h1>
                <p className="text-[12px] text-gray-400 font-sans mt-0.5">Welcome back! Here's what's happening with your store today.</p>
              </div>

              {/* Right side items */}
              <div className="flex items-center flex-wrap gap-3 font-sans">
                {/* Search */}
                <div className="flex items-center space-x-2 bg-white border border-[#eae8e4] px-3.5 py-1.5 rounded-full text-[12px] max-w-xs">
                  <Search size={14} className="text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search anything..." 
                    className="border-none bg-transparent w-36 focus:outline-none focus:ring-0 text-[12px] placeholder-gray-400 text-gray-800 font-medium"
                  />
                </div>
                
                {/* Calendar box */}
                <div className="flex items-center space-x-2.5 bg-white border border-[#eae8e4] px-3.5 py-1.5 rounded-full text-[12px] text-gray-600 font-semibold cursor-pointer hover:bg-[#faf9f6]">
                  <Calendar size={14} className="text-gray-400" />
                  <span>18 July 2026</span>
                  <ChevronDown size={12} />
                </div>

                {/* Notification Bell */}
                <div className="h-9 w-9 bg-white border border-[#eae8e4] rounded-full flex items-center justify-center relative cursor-pointer hover:bg-[#faf9f6]">
                  <Bell size={15} className="text-gray-500" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#8e744a] text-white rounded-full flex items-center justify-center text-[9px] font-extrabold">
                    2
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics cards grid matching 2nd image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
              
              {/* Total Revenue */}
              <div className="bg-white border border-[#eae8e4] p-5 rounded-xl flex justify-between items-center shadow-sm">
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Revenue</span>
                  <div className="text-[20px] font-extrabold text-gray-800">{formatPrice(totalRevenue)}</div>
                  <span className="text-[9px] text-gray-500 font-semibold block">From {successfulOrdersCount} completed sales</span>
                </div>
                <div className="h-10 w-32 filter opacity-80 flex items-center">
                  <svg className="w-full h-8" viewBox="0 0 100 30">
                    <path d="M0 25 Q25 20, 50 15 T100 5" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="100" cy="5" r="2" fill="#d4af37" />
                  </svg>
                </div>
              </div>

              {/* Total Orders */}
              <div className="bg-white border border-[#eae8e4] p-5 rounded-xl flex justify-between items-center shadow-sm">
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Orders</span>
                  <div className="text-[20px] font-extrabold text-gray-800">{totalOrdersCount}</div>
                  <span className="text-[9px] text-gray-500 font-semibold block">{successfulOrdersCount} paid checkouts</span>
                </div>
                <div className="h-10 w-32 filter opacity-80 flex items-center">
                  <svg className="w-full h-8" viewBox="0 0 100 30">
                    <path d="M0 25 Q30 15, 60 22 T100 8" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="100" cy="8" r="2" fill="#8b5cf6" />
                  </svg>
                </div>
              </div>

              {/* Active Products */}
              <div className="bg-white border border-[#eae8e4] p-5 rounded-xl flex justify-between items-center shadow-sm">
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Active Products</span>
                  <div className="text-[20px] font-extrabold text-gray-800">{products.length}</div>
                  <span className="text-[9px] text-gray-500 font-semibold block">{products.filter(p => p.availability !== false).length} In Stock</span>
                </div>
                <div className="h-10 w-32 filter opacity-80 flex items-center">
                  <svg className="w-full h-8" viewBox="0 0 100 30">
                    <path d="M0 28 Q40 28, 70 12 T100 18" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="100" cy="18" r="2" fill="#3b82f6" />
                  </svg>
                </div>
              </div>

              {/* Total Reviews */}
              <div className="bg-white border border-[#eae8e4] p-5 rounded-xl flex justify-between items-center shadow-sm">
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Reviews</span>
                  <div className="text-[20px] font-extrabold text-gray-800">{reviews.length}</div>
                  <span className="text-[9px] text-gray-500 font-semibold block">Customer reviews submitted</span>
                </div>
                <div className="h-10 w-32 filter opacity-80 flex items-center">
                  <svg className="w-full h-8" viewBox="0 0 100 30">
                    <path d="M0 25 Q20 20, 50 28 T100 10" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="100" cy="10" r="2" fill="#f59e0b" />
                  </svg>
                </div>
              </div>

            </div>

            {/* Middle row: Sales overview & Recent orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
              
              {/* Sales Overview chart box */}
              <div className="bg-white border border-[#eae8e4] p-6 rounded-xl lg:col-span-2 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[15px] font-bold text-gray-800">Sales Overview</h3>
                  <div className="flex items-center space-x-1.5 px-3 py-1 bg-[#faf9f6] border border-[#eae8e4] text-[11px] font-semibold text-gray-500 cursor-pointer">
                    <span>This Week</span>
                    <ChevronDown size={12} />
                  </div>
                </div>

                {/* Curved Line chart graphic */}
                <div className="relative w-full h-48 border-b border-gray-100 flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 500 150">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f4ece1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f4ece1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M 30 120 C 100 100, 180 110, 250 40 S 380 130, 470 90" fill="none" stroke="#8e744a" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 30 120 C 100 100, 180 110, 250 40 S 380 130, 470 90 L 470 150 L 30 150 Z" fill="url(#chartGrad)" />
                    
                    {/* Data Points */}
                    <circle cx="30" cy="120" r="4.5" fill="#8e744a" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="250" cy="40" r="4.5" fill="#8e744a" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="470" cy="90" r="4.5" fill="#8e744a" stroke="#fff" strokeWidth="1.5" />
                  </svg>
                  
                  {/* Days labels */}
                  <div className="absolute bottom-0 inset-x-0 flex justify-between px-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider pt-2">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders Box */}
              <div className="bg-white border border-[#eae8e4] p-6 rounded-xl shadow-sm flex flex-col justify-between text-left">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[15px] font-bold text-gray-800">Recent Orders</h3>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-[#8e744a] hover:underline text-[12px] font-bold"
                  >
                    View All
                  </button>
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-4">
                  {orders.length > 0 ? (
                    <div className="space-y-3">
                      {orders.slice(0, 2).map((o, idx) => (
                        <div key={idx} className="border border-gray-100 p-4 rounded-lg bg-[#faf9f6]/40 flex justify-between items-center text-[12px]">
                          <div className="space-y-1">
                            <div className="font-mono font-bold text-gray-800">#ORD-{o.orderId.slice(-4).toUpperCase()}</div>
                            <div className="text-[10px] text-gray-400">{new Date(o.createdAt).toLocaleString()}</div>
                          </div>
                          <div className="flex items-center space-x-3.5">
                            <span className="bg-green-100 text-green-700 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">
                              Paid
                            </span>
                            <span className="font-bold text-gray-800">{formatPrice(o.amount)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#faf9f6] flex items-center justify-center text-gray-400 mb-2 border border-gray-100">
                        📦
                      </div>
                      <span className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                        More orders will appear here<br />as they come in.
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Bottom Row: Stock Inventory & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
              
              {/* Stock Inventory Section */}
              <div className="bg-white border border-[#eae8e4] p-6 rounded-xl lg:col-span-2 shadow-sm text-left">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[15px] font-bold text-gray-800">Stock Inventory</h3>
                  <button 
                    onClick={() => setActiveTab('products')}
                    className="text-[#8e744a] hover:underline text-[12px] font-bold"
                  >
                    View All Products
                  </button>
                </div>

                <div className="space-y-3.5">
                  {products.slice(0, 3).map(p => (
                    <div key={p._id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <img src={p.images[0]} alt="" className="h-11 w-8 object-cover border border-gray-100 rounded" />
                        <div className="space-y-0.5 text-left max-w-sm truncate">
                          <div className="text-[12px] font-bold text-gray-800 truncate">{p.name}</div>
                          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{p.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          p.availability !== false
                            ? 'bg-green-50 text-green-600 border border-green-100'
                            : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          {p.availability !== false ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <span className="text-[12px] font-bold text-gray-500">4 Items</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions & Weekly performance */}
              <div className="space-y-6">
                
                {/* Quick Actions box */}
                <div className="bg-white border border-[#eae8e4] p-5 rounded-xl shadow-sm text-left">
                  <h3 className="text-[14px] font-bold text-gray-800 mb-4">Quick Actions</h3>
                  
                  <div className="grid grid-cols-2 gap-3.5">
                    {[
                      { icon: <Plus className="text-blue-500" size={18} />, label: 'Add Product', tab: 'products' },
                      { icon: <CreditCard className="text-green-500" size={18} />, label: 'Manage Orders', tab: 'orders' },
                      { icon: <Star className="text-yellow-500" size={18} />, label: 'View Reviews', tab: 'reviews' },
                      { icon: <Mail className="text-purple-500" size={18} />, label: 'Contacts', tab: 'contacts' }
                    ].map((act, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveTab(act.tab)}
                        className="p-4 border border-[#eae8e4] hover:bg-[#faf9f6] bg-white rounded-xl flex flex-col items-center justify-center text-center space-y-1.5 transition-colors"
                      >
                        {act.icon}
                        <span className="text-[11px] font-bold text-gray-600">{act.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Performance this week */}
                <div className="bg-white border border-[#eae8e4] p-5 rounded-xl shadow-sm text-left font-sans">
                  <h3 className="text-[14px] font-bold text-gray-800 mb-4">Performance This Week</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-[#faf9f6]/80 border border-gray-100 flex items-center space-x-3">
                      <span className="text-green-500 text-lg">💰</span>
                      <div>
                        <div className="text-[12px] font-extrabold text-gray-800">{formatPrice(totalRevenue)}</div>
                        <span className="text-[9px] text-gray-400 font-semibold uppercase block mt-0.5">Revenue</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#faf9f6]/80 border border-gray-100 flex items-center space-x-3">
                      <span className="text-purple-500 text-lg">📦</span>
                      <div>
                        <div className="text-[12px] font-extrabold text-gray-800">{totalOrdersCount}</div>
                        <span className="text-[9px] text-gray-400 font-semibold uppercase block mt-0.5">Orders</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#faf9f6]/80 border border-gray-100 flex items-center space-x-3">
                      <span className="text-blue-500 text-lg">👕</span>
                      <div>
                        <div className="text-[12px] font-extrabold text-gray-800">{products.length}</div>
                        <span className="text-[9px] text-gray-400 font-semibold uppercase block mt-0.5">Products</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#faf9f6]/80 border border-gray-100 flex items-center space-x-3">
                      <span className="text-yellow-500 text-lg">⭐</span>
                      <div>
                        <div className="text-[12px] font-extrabold text-gray-800">{reviews.length}</div>
                        <span className="text-[9px] text-gray-400 font-semibold uppercase block mt-0.5">Reviews</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Manage Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-[28px] font-heading font-medium tracking-tight">Manage Products</h1>
              <p className="text-[13px] text-gray-400 font-sans">Create products, toggle stock availability (In Stock / Out of Stock), and manage details.</p>
            </div>

            {/* Add Product Modal Form */}
            <div className="bg-white border border-[#eae8e4] p-6 rounded-xl font-sans text-left">
              <h3 className="text-[16px] font-bold mb-4 flex items-center space-x-2 text-[#8e744a]">
                <Plus size={18} />
                <span>Add New Premium Product</span>
              </h3>

              {prodFormMessage && (
                <div className={`p-3 text-[12px] rounded mb-4 ${
                  prodFormMessage.includes('successfully') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {prodFormMessage}
                </div>
              )}

              <form onSubmit={handleAddProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                <div className="flex flex-col space-y-1">
                  <label className="text-gray-400 font-bold uppercase text-[10px]">Product Title / Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Classic Old Money Linen Shirt"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="px-3.5 py-2.5 bg-[#fbfbfa] border border-[#e5e5e0] rounded text-gray-800 focus:outline-none focus:border-black font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col space-y-1">
                    <label className="text-gray-400 font-bold uppercase text-[10px]">Price (INR) *</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 1199"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="px-3.5 py-2.5 bg-[#fbfbfa] border border-[#e5e5e0] rounded text-gray-800 focus:outline-none focus:border-black font-semibold"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-gray-400 font-bold uppercase text-[10px]">Compare Price (INR)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 1999"
                      value={newProdComparePrice}
                      onChange={(e) => setNewProdComparePrice(e.target.value)}
                      className="px-3.5 py-2.5 bg-[#fbfbfa] border border-[#e5e5e0] rounded text-gray-800 focus:outline-none focus:border-black font-semibold"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-gray-400 font-bold uppercase text-[10px]">Images URLs * (Comma separated)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="https://images.unsplash.com/..., https://..."
                    value={newProdImages}
                    onChange={(e) => setNewProdImages(e.target.value)}
                    className="px-3.5 py-2.5 bg-[#fbfbfa] border border-[#e5e5e0] rounded text-gray-800 focus:outline-none focus:border-black font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col space-y-1">
                    <label className="text-gray-400 font-bold uppercase text-[10px]">Category *</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="px-3.5 py-2.5 bg-[#fbfbfa] border border-[#e5e5e0] rounded text-gray-800 focus:outline-none focus:border-black font-semibold"
                    >
                      <option value="pant">The Pant</option>
                      <option value="shirt">The Shirt</option>
                      <option value="combo">Combo Duos</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-gray-400 font-bold uppercase text-[10px]">Default Availability Status</label>
                    <select
                      value={newProdAvailability ? 'in-stock' : 'out-of-stock'}
                      onChange={(e) => setNewProdAvailability(e.target.value === 'in-stock')}
                      className="px-3.5 py-2.5 bg-[#fbfbfa] border border-[#e5e5e0] rounded text-gray-800 focus:outline-none focus:border-black font-semibold"
                    >
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col space-y-1 md:col-span-2">
                  <label className="text-gray-400 font-bold uppercase text-[10px]">Product Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Enter fabric specifications, weave types..."
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="px-3.5 py-2.5 bg-[#fbfbfa] border border-[#e5e5e0] rounded text-gray-800 focus:outline-none focus:border-black font-semibold"
                  />
                </div>

                <button 
                  type="submit"
                  className="md:col-span-2 py-3 bg-black hover:bg-black/90 text-white font-bold uppercase tracking-wider rounded transition-colors"
                >
                  Create Product
                </button>
              </form>
            </div>

            {/* List and Update products availability */}
            <div className="bg-white border border-[#eae8e4] rounded-xl overflow-hidden font-sans shadow-sm text-left">
              <div className="p-4 border-b border-[#eae8e4] flex justify-between items-center">
                <h3 className="text-[15px] font-bold">Active Store Products list</h3>
                <span className="text-[12px] text-gray-400">{products.length} products total</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-[#eae8e4] text-gray-400 bg-[#faf9f6]">
                      <th className="p-4 font-semibold">Product info</th>
                      <th className="p-4 font-semibold">Category</th>
                      <th className="p-4 font-semibold">Price</th>
                      <th className="p-4 font-semibold">Inventory Status</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id} className="border-b border-gray-100 hover:bg-[#faf9f6]/30">
                        <td className="p-4 flex items-center space-x-3.5">
                          <img src={p.images[0]} alt="" className="h-12 w-9 object-cover border border-gray-100 rounded" />
                          <div className="text-left max-w-sm">
                            <div className="font-bold text-gray-800 truncate">{p.name}</div>
                            <div className="text-[11px] text-gray-400 truncate leading-relaxed">{p.description}</div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600 font-semibold uppercase">{p.category}</td>
                        <td className="p-4 font-bold text-gray-800">{formatPrice(p.price)}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStock(p._id, p.availability)}
                            className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all border ${
                              p.availability !== false
                                ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                                : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                            }`}
                          >
                            {p.availability !== false ? 'In Stock (Active)' : 'Out of Stock (Disabled)'}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-[28px] font-heading font-medium tracking-tight">Product Categories</h1>
              <p className="text-[13px] text-gray-400 font-sans font-medium">Record of currently supported collection categories.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
              {['pant', 'shirt', 'combo'].map(cat => {
                const count = products.filter(p => p.category === cat).length;
                return (
                  <div key={cat} className="bg-white border border-[#eae8e4] p-6 rounded-xl text-left space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-[12px] text-gray-400 uppercase font-bold tracking-wider">{cat} Collection</span>
                      <span className="bg-[#8e744a]/10 text-[#8e744a] text-[10px] font-bold px-2 py-0.5 rounded">Active</span>
                    </div>
                    <div>
                      <h3 className="text-[22px] font-bold text-gray-800 uppercase">{cat}s</h3>
                      <p className="text-[12px] text-gray-500 mt-1">{count} premium items in database</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Manage Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 font-sans">
            <div>
              <h1 className="text-[28px] font-heading font-medium tracking-tight">Customer Reviews</h1>
              <p className="text-[13px] text-gray-400">Moderate and approve customer feedback comments.</p>
            </div>

            <div className="bg-white border border-[#eae8e4] rounded-xl overflow-hidden shadow-sm text-left">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-[#eae8e4] bg-[#faf9f6] text-gray-400">
                      <th className="p-4 font-semibold">Author</th>
                      <th className="p-4 font-semibold">Product</th>
                      <th className="p-4 font-semibold">Rating</th>
                      <th className="p-4 font-semibold">Comment</th>
                      <th className="p-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(r => (
                      <tr key={r._id} className="border-b border-gray-100 hover:bg-[#faf9f6]/30">
                        <td className="p-4 font-semibold text-gray-800">{r.name}</td>
                        <td className="p-4 text-[#8e744a] truncate max-w-xs">{r.productId ? r.productId.name : 'Unknown Product'}</td>
                        <td className="p-4 text-yellow-500">
                          {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                        </td>
                        <td className="p-4 text-gray-500 leading-normal max-w-sm">{r.comment}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteReview(r._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                            title="Delete Review"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {reviews.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-400 font-medium">No reviews submitted yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-[28px] font-heading font-medium tracking-tight">Recent Orders Report</h1>
              <p className="text-[13px] text-gray-400 font-sans">Total record of all payments created, verified, and saved to MongoDB.</p>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-3 bg-white border border-[#eae8e4] px-4 py-2.5 rounded-full max-w-md font-sans">
              <Search size={16} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search Customer or Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none w-full text-[13px] focus:ring-0 focus:outline-none text-gray-800 placeholder-gray-400 font-semibold"
              />
            </div>

            {/* Orders list block */}
            <div className="space-y-4 font-sans text-left">
              {orders
                .filter(o => 
                  o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  o.shippingAddress.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(o => (
                  <div key={o._id} className="bg-white border border-[#eae8e4] p-5 rounded-xl space-y-4 hover:border-gray-300 transition-all shadow-sm">
                    
                    {/* Order summary header */}
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <div className="space-y-0.5">
                        <div className="text-[13px] font-mono text-[#8e744a] font-bold">#ORD-{o.orderId.slice(-4).toUpperCase()}</div>
                        <div className="text-[11px] text-gray-400 font-sans flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{new Date(o.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-[14px] font-bold text-gray-800">{formatPrice(o.amount)}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          o.status === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                        }`}>
                          {o.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px]">
                      
                      {/* Products Summary list */}
                      <div className="space-y-3">
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Items Purchased</div>
                        <div className="space-y-2">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-3 bg-[#faf9f6]/60 p-2 border border-gray-100 rounded">
                              <img src={item.image} alt={item.name} className="h-12 w-9 object-cover border border-gray-200 rounded" />
                              <div className="text-left flex-1">
                                <div className="font-semibold text-gray-800 leading-tight">{item.name}</div>
                                <div className="text-[11px] text-gray-400 mt-0.5">Size: {item.size} • Qty: {item.quantity}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer & Address Details */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Delivery Details</div>
                        <div className="bg-[#faf9f6]/60 p-3 border border-gray-100 rounded space-y-1">
                          <div className="font-semibold text-gray-800 flex items-center space-x-1.5">
                            <Users size={14} className="text-gray-400" />
                            <span>{o.shippingAddress.name}</span>
                          </div>
                          <div className="text-[12px] text-gray-500 leading-relaxed font-sans">{o.shippingAddress.address}</div>
                          <div className="text-[11px] text-[#8e744a] pt-1">
                            {o.shippingAddress.phone} | {o.shippingAddress.email}
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
              {orders.length === 0 && (
                <div className="bg-white border border-[#eae8e4] p-8 text-center text-gray-400 font-medium rounded-xl shadow-sm">No orders recorded yet.</div>
              )}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-[28px] font-heading font-medium tracking-tight">Contact Submissions</h1>
              <p className="text-[13px] text-gray-400 font-sans">Total record of feedback messages, comments, and customer support queries.</p>
            </div>

            {/* Contacts Table list */}
            <div className="bg-white border border-[#eae8e4] rounded-xl overflow-hidden shadow-sm text-left">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-[#eae8e4] bg-[#faf9f6] text-gray-400">
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Phone</th>
                      <th className="p-4 font-semibold">Comment / Query</th>
                      <th className="p-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map(c => (
                      <tr key={c._id} className="border-b border-gray-100 hover:bg-[#faf9f6]/30">
                        <td className="p-4 font-semibold text-gray-800">{c.name}</td>
                        <td className="p-4 text-[#8e744a] font-sans">{c.email}</td>
                        <td className="p-4 text-gray-500 font-sans">{c.phone || '-'}</td>
                        <td className="p-4 text-gray-400 leading-normal max-w-md">{c.comment}</td>
                        <td className="p-4 text-gray-500 font-sans">{new Date(c.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {contacts.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-400 font-medium">No feedback submissions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
};

export default AdminPanel;
