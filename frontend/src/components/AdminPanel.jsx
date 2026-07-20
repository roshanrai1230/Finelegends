import React, { useState, useEffect } from 'react';
import { Shield, CreditCard, Mail, BarChart2, LogOut, Search, Clock, Users, ArrowUpRight, Plus, Trash2, CheckCircle2, AlertTriangle, Layers, MessageSquare, Star, Calendar, Bell, ChevronDown, ShoppingBag, Box, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';
import { translations } from '../utils/translations';

const AdminPanel = ({ onBack, categories = [], loadCategories }) => {
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

  // Date Filters
  const [dashDateFilter, setDashDateFilter] = useState('All Time'); // 'All Time', 'Today', 'Yesterday', 'This Week', 'This Month'
  const [showDashDateMenu, setShowDashDateMenu] = useState(false);

  // Reports Date Filters
  const [repFromDate, setRepFromDate] = useState('2026-07-11');
  const [repFromTime, setRepFromTime] = useState('00:00');
  const [repToDate, setRepToDate] = useState('2026-07-18');
  const [repToTime, setRepToTime] = useState('23:59');
  const [repQuickFilter, setRepQuickFilter] = useState('This Week');
  const [appliedFilters, setAppliedFilters] = useState({
    fromDate: '2026-07-11',
    fromTime: '00:00',
    toDate: '2026-07-18',
    toTime: '23:59'
  });

  // Settings State variables
  const [settingsTab, setSettingsTab] = useState('profile'); // 'profile', 'general', 'payment', 'shipping', 'tax', 'notifications', 'users', 'security', 'integrations', 'backup'
  const [storeName, setStoreName] = useState('blackdistricts');
  const [storeEmail, setStoreEmail] = useState('support@blackdistricts.com');
  const [storePhone, setStorePhone] = useState('+91 98765 43210');
  const [storeAddress, setStoreAddress] = useState('123, Fashion Street, Surat, Gujarat, India - 395001');
  const [storeDesc, setStoreDesc] = useState('blackdistricts offers premium quality fashion products for everyone.');
  const [storeCurrency, setStoreCurrency] = useState('INR');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [dateFormat, setDateFormat] = useState('18 July 2026');
  const [timeFormat, setTimeFormat] = useState('24h');
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');
  
  // Custom Dynamic Assets logo & avatar base64 strings
  const [storeLogo, setStoreLogo] = useState('');
  const [adminAvatar, setAdminAvatar] = useState(
    localStorage.getItem('adminAvatar') || '/image/admin-avatar.webp'
  );
  const [adminEmail, setAdminEmail] = useState(
    localStorage.getItem('adminEmail') || 'admin@regalweave.com'
  );

  const [autoConfirm, setAutoConfirm] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [enableNotes, setEnableNotes] = useState(true);

  const [notifyNewOrder, setNotifyNewOrder] = useState(true);
  const [notifyCustReg, setNotifyCustReg] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(false);

  const [changePassword, setChangePassword] = useState('');
  const [changePasswordConfirm, setChangePasswordConfirm] = useState('');

  // Selected Sales Graph Point Index for Interactive Tooltip Tooltips
  const [activePointIndex, setActivePointIndex] = useState(null);
  
  // Dynamic Admin User Profile Name
  const [adminName, setAdminName] = useState(
    localStorage.getItem('adminName') || 'blackdistricts Admin'
  );

  // Dynamic Sales Overview dropdown filter states
  const [salesChartFilter, setSalesChartFilter] = useState('This Week');
  const [showSalesChartMenu, setShowSalesChartMenu] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'order', message: 'New Order #ORD-Q3CI received! Amount: Rs. 1,799.00', date: new Date(Date.now() - 3600000).toISOString(), read: false },
    { id: '2', type: 'contact', message: 'New customer message received from Legend 7264.', date: new Date(Date.now() - 7200000).toISOString(), read: false }
  ]);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  // Add Product Form States
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdComparePrice, setNewProdComparePrice] = useState('');
  const [newProdImages, setNewProdImages] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories[0]?.name || 'pant');
  const [newProdAvailability, setNewProdAvailability] = useState(true);
  const [prodFormMessage, setProdFormMessage] = useState('');

  // Category management hooks
  const [newCatName, setNewCatName] = useState('');
  const [newCatLabel, setNewCatLabel] = useState('');
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatLabel, setEditCatLabel] = useState('');
  const [catMessage, setCatMessage] = useState('');

  const handleAddCategory = async (e) => {
    if (e) e.preventDefault();
    setCatMessage('');
    if (!newCatName || !newCatLabel) {
      setCatMessage('❌ Name and Label are required.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName, label: newCatLabel })
      });
      const data = await res.json();
      if (res.ok) {
        setCatMessage('✅ Category created successfully!');
        setNewCatName('');
        setNewCatLabel('');
        if (loadCategories) loadCategories();
        window.dispatchEvent(new CustomEvent('categoriesChange'));
      } else {
        setCatMessage(`❌ ${data.message || 'Error creating category.'}`);
      }
    } catch (err) {
      setCatMessage('❌ Connection error creating category.');
    }
  };

  const handleEditCategory = async (id) => {
    setCatMessage('');
    if (!editCatName || !editCatLabel) {
      setCatMessage('❌ Name and Label are required to update.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editCatName, label: editCatLabel })
      });
      const data = await res.json();
      if (res.ok) {
        setCatMessage('✅ Category updated successfully!');
        setEditingCatId(null);
        setEditCatName('');
        setEditCatLabel('');
        if (loadCategories) loadCategories();
        window.dispatchEvent(new CustomEvent('categoriesChange'));
      } else {
        setCatMessage(`❌ ${data.message || 'Error updating category.'}`);
      }
    } catch (err) {
      setCatMessage('❌ Connection error updating category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? This does not delete products, but they will not show up in collection views.')) return;
    setCatMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        setCatMessage('✅ Category deleted successfully!');
        if (loadCategories) loadCategories();
        window.dispatchEvent(new CustomEvent('categoriesChange'));
      } else {
        setCatMessage(`❌ ${data.message || 'Error deleting category.'}`);
      }
    } catch (err) {
      setCatMessage('❌ Connection error deleting category.');
    }
  };

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

    // Fetch Settings
    fetch(`${API_BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && data._id) {
          if (data.storeName) setStoreName(data.storeName);
          if (data.storeEmail) setStoreEmail(data.storeEmail);
          if (data.storePhone) setStorePhone(data.storePhone);
          if (data.storeAddress) setStoreAddress(data.storeAddress);
          if (data.storeDesc) setStoreDesc(data.storeDesc);
          if (data.storeCurrency) setStoreCurrency(data.storeCurrency);
          if (data.timezone) setTimezone(data.timezone);
          if (data.dateFormat) setDateFormat(data.dateFormat);
          if (data.timeFormat) setTimeFormat(data.timeFormat);
          if (data.language) setLanguage(data.language);
          if (data.autoConfirm !== undefined) setAutoConfirm(data.autoConfirm);
          if (data.lowStockAlert !== undefined) setLowStockAlert(data.lowStockAlert);
          if (data.enableNotes !== undefined) setEnableNotes(data.enableNotes);
          if (data.notifyNewOrder !== undefined) setNotifyNewOrder(data.notifyNewOrder);
          if (data.notifyCustReg !== undefined) setNotifyCustReg(data.notifyCustReg);
          if (data.notifyLowStock !== undefined) setNotifyLowStock(data.notifyLowStock);
          
          if (data.storeLogo) setStoreLogo(data.storeLogo);
          if (data.adminAvatar) {
            setAdminAvatar(data.adminAvatar);
            localStorage.setItem('adminAvatar', data.adminAvatar);
          }
          if (data.adminName) {
            setAdminName(data.adminName);
            localStorage.setItem('adminName', data.adminName);
          }
          if (data.adminEmail) {
            setAdminEmail(data.adminEmail);
            localStorage.setItem('adminEmail', data.adminEmail);
          }
        }
      })
      .catch(err => console.error('Error fetching admin settings:', err));
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchAdminData();
    }
  }, [isAuthorized]);
  // Real-time polling effect for new orders/notifications
  useEffect(() => {
    if (!isAuthorized) return;

    const interval = setInterval(() => {
      fetch(`${API_BASE_URL}/api/payment/orders`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            // Check if there are new orders (orders count increased)
            if (orders.length > 0 && data.length > orders.length) {
              const diffCount = data.length - orders.length;
              // Get the newest orders (assuming sorted by date desc or diffing IDs)
              const newOrdersList = data.filter(newO => !orders.some(oldO => oldO._id === newO._id));
              
              newOrdersList.forEach(newO => {
                const formattedId = newO.orderId ? newO.orderId.slice(-6).toUpperCase() : 'NEW';
                const amt = newO.amount ? (newO.amount / 100).toFixed(2) : '0.00';
                const msg = `New Order #ORD-${formattedId} received! Amount: Rs. ${amt}`;
                
                // 1. Show Toast
                setToastNotification({ id: newO._id, message: msg });
                
                // 2. Add Notification
                setNotifications(prev => [
                  { id: Date.now().toString() + Math.random(), type: 'order', message: msg, date: new Date().toISOString(), read: false },
                  ...prev
                ]);
              });

              // Play a soft notification audio beep if possible
              try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(587.33, audioContext.currentTime); // D5 note
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.15);
              } catch (e) {
                console.warn('Audio feedback failed:', e);
              }
            }
            setOrders(data);
          }
        })
        .catch(err => console.error('Error polling admin orders:', err));
    }, 8000);

    return () => clearInterval(interval);
  }, [isAuthorized, orders]);

  // Clear toast notifications automatically
  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => setToastNotification(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);
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
        const allowedEmails = ['dk897869@gmail.com', 'admin@blackdistricts.com', 'admin@finelegends.com'];
        if (allowedEmails.includes(email.toLowerCase()) || data.email.toLowerCase().includes('admin')) {
          setIsAuthorized(true);
          const nameToSet = data.name || 'blackdistricts Admin';
          setAdminName(nameToSet);
          localStorage.setItem('adminName', nameToSet);
          localStorage.setItem('adminAuthorized', 'true');
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
  // Helper for date filtering
  const getFilteredOrders = (dataList, filterType, customRange = null) => {
    const now = new Date();
    return dataList.filter(order => {
      const orderDate = new Date(order.createdAt);
      
      if (filterType === 'Today') {
        return orderDate.toDateString() === now.toDateString();
      }
      if (filterType === 'Yesterday') {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        return orderDate.toDateString() === yesterday.toDateString();
      }
      if (filterType === 'This Week') {
        // Start of this week (Monday)
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0,0,0,0);
        return orderDate >= startOfWeek;
      }
      if (filterType === 'This Month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return orderDate >= startOfMonth;
      }
      if (filterType === 'Custom' && customRange) {
        const start = new Date(`${customRange.fromDate}T${customRange.fromTime}`);
        const end = new Date(`${customRange.toDate}T${customRange.toTime}`);
        return orderDate >= start && orderDate <= end;
      }
      return true; // 'All Time'
    });
  };

  const getFilteredDashboardOrders = () => {
    return getFilteredOrders(orders, dashDateFilter);
  };

  const filteredDashOrders = getFilteredDashboardOrders();

  // Calculations based on filtered dashboard orders
  const totalRevenue = filteredDashOrders.reduce((sum, order) => sum + (order.status === 'success' || order.status === 'Paid' || order.status === 'paid' ? order.amount : 0), 0);
  const totalOrdersCount = filteredDashOrders.length;
  const successfulOrdersCount = filteredDashOrders.filter(o => o.status === 'success' || o.status === 'Paid' || o.status === 'paid' || o.status === 'Delivered' || o.status === 'Shipped').length;
  const avgOrderValue = successfulOrdersCount > 0 ? Math.round(totalRevenue / successfulOrdersCount) : 0;

  // Weekly Sales data for Dashboard Graph (dynamic math)
  // Dynamic chart sales calculation and labels based on selected salesChartFilter dropdown state
  const getSalesChartDataAndLabels = () => {
    let labels = [];
    let sales = [0, 0, 0, 0, 0, 0, 0]; // 7 points
    const now = new Date();

    if (salesChartFilter === 'Today') {
      labels = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'];
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        if (orderDate >= todayStart && (order.status === 'success' || order.status === 'Paid' || order.status === 'paid')) {
          const hour = orderDate.getHours();
          const idx = Math.min(Math.floor(hour / 3.5), 6);
          sales[idx] += order.amount || 0;
        }
      });
    } else if (salesChartFilter === 'Yesterday') {
      labels = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '12 AM'];
      const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
      const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        if (orderDate >= yesterdayStart && orderDate < yesterdayEnd && (order.status === 'success' || order.status === 'Paid' || order.status === 'paid')) {
          const hour = orderDate.getHours();
          const idx = Math.min(Math.floor(hour / 3.5), 6);
          sales[idx] += order.amount || 0;
        }
      });
    } else if (salesChartFilter === 'This Week') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const monday = new Date(now);
      const day = monday.getDay();
      const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
      monday.setDate(diff);
      monday.setHours(0,0,0,0);

      orders.forEach(order => {
        if (order.status === 'success' || order.status === 'Paid' || order.status === 'paid') {
          const orderDate = new Date(order.createdAt);
          const diffTime = orderDate.getTime() - monday.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays < 7) {
            sales[diffDays] += order.amount || 0;
          }
        }
      });
    } else if (salesChartFilter === 'This Month') {
      labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      orders.forEach(order => {
        if (order.status === 'success' || order.status === 'Paid' || order.status === 'paid') {
          const orderDate = new Date(order.createdAt);
          if (orderDate >= monthStart) {
            const dayOfMonth = orderDate.getDate();
            const idx = Math.min(Math.floor((dayOfMonth - 1) / 4.5), 6);
            sales[idx] += order.amount || 0;
          }
        }
      });
    } else { // 'All Time'
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
      for (let i = 0; i < 7; i++) {
        const m = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
        labels[i] = m.toLocaleString('default', { month: 'short' });
        const start = new Date(m.getFullYear(), m.getMonth(), 1);
        const end = new Date(m.getFullYear(), m.getMonth() + 1, 1);
        orders.forEach(order => {
          if (order.status === 'success' || order.status === 'Paid' || order.status === 'paid') {
            const orderDate = new Date(order.createdAt);
            if (orderDate >= start && orderDate < end) {
              sales[i] += order.amount || 0;
            }
          }
        });
      }
    }

    return { labels, sales };
  };

  const { labels: chartLabels, sales: weeklySales } = getSalesChartDataAndLabels();
  const maxSales = Math.max(...weeklySales, 1000);
  const coords = weeklySales.map((val, idx) => {
    const x = 30 + idx * (440 / 6);
    const y = 120 - (val / maxSales) * 100;
    return { x, y };
  });

  // Smooth SVG path generation
  let pathD = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const cpX1 = coords[i].x + 35;
    const cpY1 = coords[i].y;
    const cpX2 = coords[i + 1].x - 35;
    const cpY2 = coords[i + 1].y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${coords[i+1].x} ${coords[i+1].y}`;
  }
  const fillD = `${pathD} L 470 150 L 30 150 Z`;

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
            <img src={storeLogo || "/image/new-logo.png"} alt="blackdistricts Logo" className="h-24 w-auto object-contain mb-4 mix-blend-multiply" />
            <h1 className="text-[20px] font-heading font-medium tracking-wide">blackdistricts Admin</h1>
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
            <img src={storeLogo || "/image/new-logo.png"} alt="blackdistricts" className="h-20 w-auto object-contain mix-blend-multiply" />
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
                onClick={() => setActiveTab(item.id)}
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
          <div 
            onClick={() => {
              setActiveTab('settings');
              setSettingsTab('admin-profile');
            }}
            className="flex items-center justify-between p-2 rounded hover:bg-[#faf9f6] cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <img 
                src={adminAvatar || "/image/admin-avatar.webp"} 
                alt={adminName} 
                className="h-9 w-9 rounded-full object-cover border border-[#e5dec9]"
                onError={(e) => {
                  // Fallback to text initials if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{ display: 'none' }} className="h-9 w-9 rounded-full bg-[#f4ece1] text-[#8e744a] flex items-center justify-center font-bold text-[13px] border border-[#e5dec9]">
                {adminName.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-left leading-none">
                <div className="text-[12px] font-bold text-gray-800">{adminName}</div>
                <span className="text-[9px] text-gray-400 mt-1 block">Admin</span>
              </div>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </div>

          <button 
            onClick={() => {
              setIsAuthorized(false);
              localStorage.removeItem('adminAuthorized');
              localStorage.removeItem('adminName');
            }}
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
                <div className="relative">
                  <div 
                    onClick={() => setShowDashDateMenu(!showDashDateMenu)}
                    className="flex items-center space-x-2.5 bg-white border border-[#eae8e4] px-3.5 py-1.5 rounded-full text-[12px] text-gray-600 font-semibold cursor-pointer hover:bg-[#faf9f6]"
                  >
                    <Calendar size={14} className="text-gray-400" />
                    <span>{dashDateFilter}</span>
                    <ChevronDown size={12} />
                  </div>
                  {showDashDateMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-[#eae8e4] rounded-lg shadow-lg py-1 z-30 font-semibold text-[12px] text-gray-700">
                      {['All Time', 'Today', 'Yesterday', 'This Week', 'This Month'].map(f => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => {
                            setDashDateFilter(f);
                            setShowDashDateMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-[#faf9f6] ${dashDateFilter === f ? 'text-[#8e744a] bg-[#faf9f6]' : ''}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notification Bell */}
                <div className="relative">
                  <div 
                    onClick={() => {
                      setShowNotificationMenu(!showNotificationMenu);
                      // Mark all as read when opening
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    }}
                    className="h-9 w-9 bg-white border border-[#eae8e4] rounded-full flex items-center justify-center relative cursor-pointer hover:bg-[#faf9f6]"
                  >
                    <Bell size={15} className="text-gray-500" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#8e744a] text-white rounded-full flex items-center justify-center text-[9px] font-extrabold animate-pulse">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </div>
                  {showNotificationMenu && (
                    <>
                      {/* Fullscreen click-outside dismiss backdrop */}
                      <div 
                        className="fixed inset-0 z-20 cursor-default" 
                        onClick={() => setShowNotificationMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-72 bg-white border border-[#eae8e4] rounded-xl shadow-xl py-2 z-30 text-left font-sans">
                        <div className="px-4 py-2 border-b border-gray-150 flex justify-between items-center bg-[#faf9f6]">
                          <span className="text-[12px] font-bold text-gray-800">Recent Notifications</span>
                          <div className="flex items-center space-x-2">
                            <button 
                              type="button"
                              onClick={() => setNotifications([])} 
                              className="text-[10px] text-gray-400 hover:text-black underline mr-1"
                            >
                              Clear all
                            </button>
                            <button 
                              type="button"
                              onClick={() => setShowNotificationMenu(false)} 
                              className="text-[14px] text-gray-400 hover:text-black font-extrabold px-1"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {notifications.map(n => (
                            <div key={n.id} className="p-3 border-b border-gray-100 hover:bg-[#faf9f6]/40 text-[11px] leading-relaxed">
                              <div className="text-gray-700 font-medium">{n.message}</div>
                              <div className="text-[9px] text-gray-400 mt-1">{new Date(n.date).toLocaleTimeString()}</div>
                            </div>
                          ))}
                          {notifications.length === 0 && (
                            <div className="p-8 text-center text-gray-400 text-[11px] font-medium">No new notifications.</div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
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
                  <div className="relative">
                    <div 
                      onClick={() => setShowSalesChartMenu(!showSalesChartMenu)}
                      className="flex items-center space-x-1.5 px-3 py-1 bg-[#faf9f6] border border-[#eae8e4] text-[11px] font-semibold text-gray-500 cursor-pointer select-none hover:bg-gray-50"
                    >
                      <span>{salesChartFilter}</span>
                      <ChevronDown size={12} />
                    </div>
                    {showSalesChartMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-20 cursor-default" 
                          onClick={() => setShowSalesChartMenu(false)}
                        />
                        <div className="absolute right-0 mt-1 w-32 bg-white border border-[#eae8e4] rounded-lg shadow-lg py-1 z-30 font-semibold text-[11px] text-gray-700">
                          {['Today', 'Yesterday', 'This Week', 'This Month', 'All Time'].map(f => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => {
                                setSalesChartFilter(f);
                                setShowSalesChartMenu(false);
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-[#faf9f6] ${salesChartFilter === f ? 'text-[#8e744a] bg-[#faf9f6]' : ''}`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
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
                    <path d={pathD} fill="none" stroke="#8e744a" strokeWidth="2.5" strokeLinecap="round" />
                    <path d={fillD} fill="url(#chartGrad)" />
                    
                    {/* Dynamic Data Points with smooth stable highlight state */}
                    {coords.map((pt, index) => (
                      <circle 
                        key={index}
                        cx={pt.x} 
                        cy={pt.y} 
                        r={activePointIndex === index ? "6.5" : "4"} 
                        fill={activePointIndex === index ? "#d4af37" : "#8e744a"} 
                        stroke="#fff" 
                        strokeWidth="1.5" 
                        onMouseEnter={() => setActivePointIndex(index)}
                        onMouseLeave={() => setActivePointIndex(null)}
                        className="cursor-pointer transition-all duration-150"
                      />
                    ))}
                  </svg>

                  {/* Graph interactive Point amount tooltip popup */}
                  {activePointIndex !== null && coords[activePointIndex] && (
                    <div 
                      className="absolute bg-gray-900 text-white text-[11px] font-sans font-bold py-1.5 px-3 rounded-lg shadow-xl border border-gray-700 pointer-events-none z-30 animate-fade-in text-center"
                      style={{
                        left: `${(coords[activePointIndex].x / 500) * 100}%`,
                        bottom: `${100 - (coords[activePointIndex].y / 150) * 100 + 8}%`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <div className="text-[9px] text-[#d4af37] tracking-wider uppercase mb-0.5">
                        {salesChartFilter === 'This Week' 
                          ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][activePointIndex]
                          : chartLabels[activePointIndex]
                        }
                      </div>
                      <div className="font-extrabold text-white">
                        Rs. {weeklySales[activePointIndex].toLocaleString()}
                      </div>
                      <div className="absolute left-1/2 bottom-[-4px] -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45" />
                    </div>
                  )}
                  
                  {/* Days labels */}
                  <div className="absolute bottom-0 inset-x-0 flex justify-between px-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider pt-2">
                    {chartLabels.map((lbl, idx) => (
                      <span key={idx}>{lbl}</span>
                    ))}
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
                      {categories.map(cat => (
                        <option key={cat.name} value={cat.name}>{cat.label}</option>
                      ))}
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
          <div className="space-y-6 text-left font-sans">
            <div>
              <h1 className="text-[28px] font-heading font-medium tracking-tight">Product Categories</h1>
              <p className="text-[13px] text-gray-400 font-sans font-medium">Add, edit, or delete categories to dynamically update the store navigation, collections list, and lookbooks.</p>
            </div>

            {catMessage && (
              <div className="bg-neutral-50 border border-neutral-200 text-gray-800 p-3 text-[12px] rounded flex items-center justify-between">
                <span>{catMessage}</span>
                <button onClick={() => setCatMessage('')} className="text-gray-400 hover:text-black">✕</button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Category List */}
              <div className="lg:col-span-2 bg-white border border-[#eae8e4] rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[#eae8e4] flex justify-between items-center">
                  <h3 className="text-[15px] font-bold">Active Store Collections ({categories.length})</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="border-b border-[#eae8e4] text-gray-400 bg-[#faf9f6]">
                        <th className="p-4 font-semibold">Category Name</th>
                        <th className="p-4 font-semibold">Display Label</th>
                        <th className="p-4 font-semibold">Products Count</th>
                        <th className="p-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(cat => {
                        const count = products.filter(p => p.category === cat.name).length;
                        const isEditing = editingCatId === cat._id;
                        
                        return (
                          <tr key={cat._id || cat.name} className="border-b border-gray-100 hover:bg-[#faf9f6]/30">
                            <td className="p-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editCatName}
                                  onChange={(e) => setEditCatName(e.target.value)}
                                  className="w-full px-2.5 py-1.5 border border-black rounded text-[12px] bg-transparent focus:outline-none"
                                  placeholder="e.g. winterwear"
                                />
                              ) : (
                                <span className="font-bold text-gray-700 uppercase tracking-wider text-[11px] bg-gray-100 px-2 py-1 rounded">
                                  {cat.name}
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editCatLabel}
                                  onChange={(e) => setEditCatLabel(e.target.value)}
                                  className="w-full px-2.5 py-1.5 border border-black rounded text-[12px] bg-transparent focus:outline-none"
                                  placeholder="e.g. Winter Wear"
                                />
                              ) : (
                                <span className="text-gray-800 font-semibold">{cat.label}</span>
                              )}
                            </td>
                            <td className="p-4 font-semibold text-gray-500">{count} products</td>
                            <td className="p-4 text-right space-x-1.5">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleEditCategory(cat._id)}
                                    className="px-2.5 py-1 bg-black text-white rounded text-[10px] font-bold hover:opacity-90"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingCatId(null)}
                                    className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded text-[10px] font-bold hover:bg-gray-200"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingCatId(cat._id);
                                      setEditCatName(cat.name);
                                      setEditCatLabel(cat.label);
                                    }}
                                    className="px-2.5 py-1.5 border border-gray-300 text-gray-600 hover:border-black hover:text-black rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                                  >
                                    Edit
                                  </button>
                                  {cat.name !== 'shirt' && cat.name !== 'pant' && cat.name !== 'combo' && (
                                    <button
                                      onClick={() => handleDeleteCategory(cat._id)}
                                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors inline-flex align-middle"
                                      title="Delete Category"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Category Form */}
              <div className="bg-white border border-[#eae8e4] p-6 rounded-xl shadow-sm space-y-4">
                <h3 className="text-[16px] font-bold text-gray-800">Add New Category</h3>
                
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-gray-400 font-bold uppercase text-[10px]">Category URL Slug *</label>
                    <input
                      type="text"
                      placeholder="e.g. winterwear"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="px-3.5 py-2 border border-[#e5e5e0] rounded text-gray-800 focus:outline-none focus:border-black font-semibold text-[13px]"
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-gray-400 font-bold uppercase text-[10px]">Category Display Label *</label>
                    <input
                      type="text"
                      placeholder="e.g. Winter Wear"
                      value={newCatLabel}
                      onChange={(e) => setNewCatLabel(e.target.value)}
                      className="px-3.5 py-2 border border-[#e5e5e0] rounded text-gray-800 focus:outline-none focus:border-black font-semibold text-[13px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-black hover:bg-black/90 text-white font-bold uppercase text-[11px] tracking-widest transition-colors"
                  >
                    Create Category
                  </button>
                </form>
              </div>

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

        {/* Reports Tab */}
        {activeTab === 'reports' && (() => {
          // Calculate filtered report orders
          const repStart = new Date(`${appliedFilters.fromDate}T${appliedFilters.fromTime}`);
          const repEnd = new Date(`${appliedFilters.toDate}T${appliedFilters.toTime}`);
          const filteredRepOrders = orders.filter(o => {
            const d = new Date(o.createdAt);
            return d >= repStart && d <= repEnd;
          });

          // Metrics computations
          const repRevenue = filteredRepOrders.reduce((sum, o) => sum + (o.status === 'success' || o.status === 'Paid' || o.status === 'paid' ? o.amount : 0), 0);
          const repOrdersCount = filteredRepOrders.length;
          const repAvgVal = repOrdersCount > 0 ? Math.round(repRevenue / repOrdersCount) : 0;
          const repItemsSold = filteredRepOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + (i.quantity || 1), 0), 0);

          // Handle Excel Download (CSV format client side)
          const downloadExcel = () => {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Order ID,Date & Time,Customer,Payment Method,Items Count,Total Amount,Discount,Net Paid,Status\n";
            
            filteredRepOrders.forEach((o, index) => {
              const formattedId = `ORD-${o.orderId.slice(-6).toUpperCase()}`;
              const dateStr = new Date(o.createdAt).toLocaleString().replace(/,/g, '');
              const custName = o.shippingAddress.name.replace(/,/g, '');
              const method = o.upiId ? 'UPI' : 'Credit Card/COD';
              const itemsCount = o.items.length;
              const grossAmt = o.amount;
              const discount = 0;
              const netAmt = o.amount;
              const statusStr = o.status;
              csvContent += `"${formattedId}","${dateStr}","${custName}","${method}",${itemsCount},${grossAmt},${discount},${netAmt},"${statusStr}"\n`;
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `sales_report_${appliedFilters.fromDate}_to_${appliedFilters.toDate}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };

          // Handle PDF Download (Triggers printing specific window layout)
          const downloadPDF = () => {
            window.print();
          };

          // Apply quick filter preset
          const handleQuickFilterChange = (filter) => {
            setRepQuickFilter(filter);
            const now = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            const formatYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

            if (filter === 'Today') {
              const ymd = formatYMD(now);
              setRepFromDate(ymd);
              setRepToDate(ymd);
            } else if (filter === 'Yesterday') {
              const yesterday = new Date();
              yesterday.setDate(now.getDate() - 1);
              const ymd = formatYMD(yesterday);
              setRepFromDate(ymd);
              setRepToDate(ymd);
            } else if (filter === 'This Week') {
              const startOfWeek = new Date(now);
              const day = startOfWeek.getDay();
              const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
              startOfWeek.setDate(diff);
              setRepFromDate(formatYMD(startOfWeek));
              setRepToDate(formatYMD(now));
            } else if (filter === 'This Month') {
              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
              setRepFromDate(formatYMD(startOfMonth));
              setRepToDate(formatYMD(now));
            } else if (filter === 'This Year') {
              const startOfYear = new Date(now.getFullYear(), 0, 1);
              setRepFromDate(formatYMD(startOfYear));
              setRepToDate(formatYMD(now));
            }
          };

          return (
            <div className="space-y-6 font-sans">
              
              {/* Header block matching 3rd image */}
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 border-b border-[#eae8e4] pb-4">
                <div>
                  <h1 className="text-[26px] font-heading font-medium tracking-tight flex items-center space-x-1">
                    <span>Reports</span>
                    <span className="text-[#d4af37] text-[18px]">✦</span>
                  </h1>
                  <p className="text-[12px] text-gray-400 font-sans mt-0.5">Detailed sales report and analytics for your store.</p>
                </div>
                
                {/* Excel/PDF Download Buttons */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={downloadExcel}
                    type="button"
                    className="flex items-center space-x-1.5 px-4 py-2 border border-[#eae8e4] bg-white text-green-700 rounded-lg text-[12px] font-semibold shadow-sm hover:bg-green-50 transition-colors"
                  >
                    <span>📊</span>
                    <span>Download Excel</span>
                  </button>
                  <button 
                    onClick={downloadPDF}
                    type="button"
                    className="flex items-center space-x-1.5 px-4 py-2 border border-red-200 bg-white text-red-600 rounded-lg text-[12px] font-semibold shadow-sm hover:bg-red-50 transition-colors"
                  >
                    <span>📄</span>
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Filters Box matching 3rd image */}
              <div className="bg-white border border-[#eae8e4] p-5 rounded-xl shadow-sm text-[12px] text-gray-600 font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {/* From Date */}
                  <div className="flex flex-col space-y-1 text-left">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">From Date</label>
                    <input 
                      type="date"
                      value={repFromDate}
                      onChange={(e) => setRepFromDate(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                  {/* From Time */}
                  <div className="flex flex-col space-y-1 text-left">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">From Time</label>
                    <input 
                      type="time"
                      value={repFromTime}
                      onChange={(e) => setRepFromTime(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                  {/* To Date */}
                  <div className="flex flex-col space-y-1 text-left">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">To Date</label>
                    <input 
                      type="date"
                      value={repToDate}
                      onChange={(e) => setRepToDate(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                  {/* To Time */}
                  <div className="flex flex-col space-y-1 text-left">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">To Time</label>
                    <input 
                      type="time"
                      value={repToTime}
                      onChange={(e) => setRepToTime(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                  {/* Quick Filter */}
                  <div className="flex flex-col space-y-1 text-left">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Quick Filter</label>
                    <select
                      value={repQuickFilter}
                      onChange={(e) => handleQuickFilterChange(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-medium bg-white"
                    >
                      {['Today', 'Yesterday', 'This Week', 'This Month', 'This Year'].map(q => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                  <button 
                    type="button"
                    onClick={() => {
                      setRepFromDate('2026-07-11');
                      setRepFromTime('00:00');
                      setRepToDate('2026-07-18');
                      setRepToTime('23:59');
                      setRepQuickFilter('This Week');
                      setAppliedFilters({
                        fromDate: '2026-07-11',
                        fromTime: '00:00',
                        toDate: '2026-07-18',
                        toTime: '23:59'
                      });
                    }}
                    className="px-4 py-2 border border-[#eae8e4] bg-[#faf9f6] hover:bg-gray-100 font-semibold rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setAppliedFilters({
                        fromDate: repFromDate,
                        fromTime: repFromTime,
                        toDate: repToDate,
                        toTime: repToTime
                      });
                    }}
                    className="px-5 py-2 bg-[#8e744a] text-white hover:bg-[#7a623e] font-semibold rounded-lg transition-colors"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>

              {/* Metrics cards grid matching 3rd image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 text-left font-sans">
                
                {/* Total Revenue */}
                <div className="bg-white border border-[#eae8e4] p-5 rounded-xl shadow-sm space-y-2">
                  <div className="flex items-center space-x-2 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    <span>💵</span>
                    <span>Total Revenue</span>
                  </div>
                  <div className="text-[20px] font-extrabold text-gray-800">{formatPrice(repRevenue)}</div>
                  <span className="text-[10px] text-green-600 font-semibold flex items-center space-x-1">
                    <span>▲</span>
                    <span>18.6% vs last period</span>
                  </span>
                </div>

                {/* Total Orders */}
                <div className="bg-white border border-[#eae8e4] p-5 rounded-xl shadow-sm space-y-2">
                  <div className="flex items-center space-x-2 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    <span>🛒</span>
                    <span>Total Orders</span>
                  </div>
                  <div className="text-[20px] font-extrabold text-gray-800">{repOrdersCount}</div>
                  <span className="text-[10px] text-green-600 font-semibold flex items-center space-x-1">
                    <span>▲</span>
                    <span>9.1% vs last period</span>
                  </span>
                </div>

                {/* Average Order Value */}
                <div className="bg-white border border-[#eae8e4] p-5 rounded-xl shadow-sm space-y-2">
                  <div className="flex items-center space-x-2 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    <span>🛍</span>
                    <span>Avg Order Value</span>
                  </div>
                  <div className="text-[20px] font-extrabold text-gray-800">{formatPrice(repAvgVal)}</div>
                  <span className="text-[10px] text-green-600 font-semibold flex items-center space-x-1">
                    <span>▲</span>
                    <span>8.3% vs last period</span>
                  </span>
                </div>

                {/* Total Items Sold */}
                <div className="bg-white border border-[#eae8e4] p-5 rounded-xl shadow-sm space-y-2">
                  <div className="flex items-center space-x-2 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    <span>📦</span>
                    <span>Total Items Sold</span>
                  </div>
                  <div className="text-[20px] font-extrabold text-gray-800">{repItemsSold}</div>
                  <span className="text-[10px] text-green-600 font-semibold flex items-center space-x-1">
                    <span>▲</span>
                    <span>14.3% vs last period</span>
                  </span>
                </div>

                {/* Refunds */}
                <div className="bg-white border border-[#eae8e4] p-5 rounded-xl shadow-sm space-y-2">
                  <div className="flex items-center space-x-2 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    <span>💳</span>
                    <span>Refunds</span>
                  </div>
                  <div className="text-[20px] font-extrabold text-gray-800">Rs. 0</div>
                  <span className="text-[10px] text-gray-400 font-semibold flex items-center space-x-1">
                    <span>—</span>
                    <span>0% vs last period</span>
                  </span>
                </div>

              </div>

              {/* Sales Summary Table block matching 3rd image */}
              <div className="bg-white border border-[#eae8e4] rounded-xl overflow-hidden shadow-sm text-left">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-[15px] font-bold text-gray-800 font-heading">Sales Summary</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="border-b border-[#eae8e4] bg-[#faf9f6] text-gray-400">
                        <th className="p-4 font-semibold">#</th>
                        <th className="p-4 font-semibold">Order ID</th>
                        <th className="p-4 font-semibold">Date & Time</th>
                        <th className="p-4 font-semibold">Customer</th>
                        <th className="p-4 font-semibold">Payment Method</th>
                        <th className="p-4 font-semibold">Items</th>
                        <th className="p-4 font-semibold">Total Amount</th>
                        <th className="p-4 font-semibold">Discount</th>
                        <th className="p-4 font-semibold">Net Amount</th>
                        <th className="p-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRepOrders.map((o, idx) => (
                        <tr key={o._id} className="border-b border-gray-100 hover:bg-[#faf9f6]/30 font-medium">
                          <td className="p-4 text-gray-400 font-bold">{idx + 1}</td>
                          <td className="p-4 font-mono font-bold text-[#8e744a]">#ORD-{o.orderId.slice(-6).toUpperCase()}</td>
                          <td className="p-4 text-gray-500 font-sans">{new Date(o.createdAt).toLocaleString()}</td>
                          <td className="p-4 font-semibold text-gray-800">{o.shippingAddress.name}</td>
                          <td className="p-4 text-gray-600 font-semibold">{o.upiId ? 'UPI' : 'Razorpay'}</td>
                          <td className="p-4 text-gray-600 font-bold">{o.items.length}</td>
                          <td className="p-4 text-gray-500">{formatPrice(o.amount)}</td>
                          <td className="p-4 text-gray-400">Rs. 0</td>
                          <td className="p-4 font-bold text-gray-800">{formatPrice(o.amount)}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              o.status === 'success' || o.status === 'Paid' || o.status === 'paid'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : o.status === 'Shipped' 
                                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                : 'bg-gray-50 text-gray-600 border border-gray-100'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredRepOrders.length === 0 && (
                        <tr>
                          <td colSpan="10" className="p-8 text-center text-gray-400 font-semibold">No sales recorded matching current filters.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          );
        })()}

        {/* Settings Tab */}
        {activeTab === 'settings' && (() => {
          
          const handleSettingsSave = async (e) => {
            if (e) e.preventDefault();
            
            // 1. Optimistic instant local updates
            localStorage.setItem('lang', language);
            window.dispatchEvent(new Event('languageChange'));

            setToastNotification({
              id: Date.now(),
              message: "Settings saved successfully! Website language set to: " + (language === 'hi' ? 'Hindi (हिन्दी)' : 'English')
            });

            // 2. Submit payload asynchronously to backend database via API
            try {
              await fetch(`${API_BASE_URL}/api/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  storeName,
                  storeEmail,
                  storePhone,
                  storeAddress,
                  storeDesc,
                  language,
                  storeCurrency,
                  timezone,
                  dateFormat,
                  timeFormat,
                  autoConfirm,
                  lowStockAlert,
                  enableNotes,
                  notifyNewOrder,
                  notifyCustReg,
                  notifyLowStock,
                  storeLogo,
                  adminAvatar,
                  adminName,
                  adminEmail
                })
              });
              // Dispatch custom event to notify storefront elements of settings change immediately
              window.dispatchEvent(new Event('settingsChange'));
            } catch (err) {
              console.error('Error saving settings to DB:', err);
            }
          };

          return (
            <div className="space-y-6 font-sans">
              
              {/* Settings Header matching 4th image */}
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 border-b border-[#eae8e4] pb-4">
                <div>
                  <h1 className="text-[26px] font-heading font-medium tracking-tight flex items-center space-x-1">
                    <span>Settings</span>
                    <span className="text-[#d4af37] text-[18px]">✦</span>
                  </h1>
                  <p className="text-[12px] text-gray-400 font-sans mt-0.5">Manage your store preferences and configurations.</p>
                </div>
                
                <button 
                  onClick={handleSettingsSave}
                  type="button"
                  className="flex items-center space-x-1.5 px-5 py-2.5 bg-[#8e744a] text-white hover:bg-[#7a623e] rounded-lg text-[13px] font-bold shadow-sm transition-colors"
                >
                  <span>💾</span>
                  <span>Save Changes</span>
                </button>
              </div>

              {/* Layout Sidebar + Forms */}
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                
                {/* Settings Left sub-navigation tab list */}
                <div className="w-full lg:w-60 bg-white border border-[#eae8e4] rounded-xl overflow-hidden p-2 space-y-0.5 shrink-0 text-[12px] font-semibold text-gray-600 text-left">
                  {[
                    { id: 'profile', label: 'Store Profile', icon: '🏪' },
                    { id: 'admin-profile', label: 'Admin Profile', icon: '👤' },
                    { id: 'general', label: 'General Settings', icon: '⚙️' },
                    { id: 'payment', label: 'Payment Settings', icon: '💳' },
                    { id: 'shipping', label: 'Shipping Settings', icon: '🚚' },
                    { id: 'tax', label: 'Tax Settings', icon: '％' },
                    { id: 'notifications', label: 'Notifications', icon: '🔔' },
                    { id: 'users', label: 'Users & Permissions', icon: '👥' },
                    { id: 'security', label: 'Security', icon: '🛡️' },
                    { id: 'integrations', label: 'Integrations', icon: '🧩' },
                    { id: 'backup', label: 'Backup & Export', icon: '💾' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSettingsTab(tab.id)}
                      className={`w-full flex items-center space-x-3.5 px-3.5 py-3 rounded-lg hover:bg-[#faf9f6] transition-colors ${
                        settingsTab === tab.id ? 'bg-[#f4ece1] text-[#8e744a] font-bold' : ''
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Form fields rendering based on Settings subtab */}
                <div className="flex-1 bg-white border border-[#eae8e4] rounded-xl p-6 shadow-sm w-full text-left">
                  
                  {/* Store Profile Section */}
                  {settingsTab === 'profile' && (
                    <div className="space-y-6">
                      <div className="border-b border-gray-100 pb-3">
                        <h3 className="text-[15px] font-bold text-gray-800">Store Profile</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">Update your store information and contact details.</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6 items-start">
                        {/* Store Logo Block */}
                        <div className="flex flex-col items-center space-y-2 shrink-0">
                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Store Logo</label>
                          <input 
                            type="file" 
                            id="logoUploadInput" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.readAsDataURL(file);
                              reader.onload = () => {
                                setStoreLogo(reader.result);
                              };
                            }}
                          />
                          <div 
                            onClick={() => document.getElementById('logoUploadInput').click()}
                            className="h-28 w-28 border border-gray-200 rounded-lg p-2 flex items-center justify-center bg-gray-50 relative group cursor-pointer"
                          >
                            <img src={storeLogo || "/image/new-logo.png"} alt="Logo preview" className="max-h-full max-w-full object-contain mix-blend-multiply" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Change</span>
                            </div>
                          </div>
                          <span className="text-[9px] text-gray-400">PNG, JPG. Max 2MB</span>
                        </div>

                        {/* Text fields block */}
                        <div className="flex-grow w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Store Name</label>
                            <input 
                              type="text"
                              value={storeName}
                              onChange={(e) => setStoreName(e.target.value)}
                              className="px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-semibold text-[13px] text-gray-700"
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Store Email</label>
                            <input 
                              type="email"
                              value={storeEmail}
                              onChange={(e) => setStoreEmail(e.target.value)}
                              className="px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-semibold text-[13px] text-gray-700"
                            />
                          </div>
                          <div className="flex flex-col space-y-1 sm:col-span-2">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Store Phone</label>
                            <input 
                              type="text"
                              value={storePhone}
                              onChange={(e) => setStorePhone(e.target.value)}
                              className="px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-semibold text-[13px] text-gray-700"
                            />
                          </div>
                          <div className="flex flex-col space-y-1 sm:col-span-2">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Store Address</label>
                            <input 
                              type="text"
                              value={storeAddress}
                              onChange={(e) => setStoreAddress(e.target.value)}
                              className="px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-semibold text-[13px] text-gray-700"
                            />
                          </div>
                          <div className="flex flex-col space-y-1 sm:col-span-2">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Store Description</label>
                            <textarea 
                              rows={3}
                              value={storeDesc}
                              onChange={(e) => setStoreDesc(e.target.value)}
                              className="px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-semibold text-[13px] text-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Profile Section */}
                  {settingsTab === 'admin-profile' && (
                    <div className="space-y-6">
                      <div className="border-b border-gray-100 pb-3">
                        <h3 className="text-[15px] font-bold text-gray-800">Admin Profile Settings</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">Manage your personal admin account credentials and profile photo.</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-6 items-start">
                        {/* Admin Avatar Block */}
                        <div className="flex flex-col items-center space-y-2 shrink-0">
                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Profile Photo</label>
                          <input 
                            type="file" 
                            id="adminAvatarUploadInput" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;

                              const reader = new FileReader();
                              reader.readAsDataURL(file);
                              reader.onload = (event) => {
                                const img = new Image();
                                img.src = event.target.result;
                                img.onload = () => {
                                  const canvas = document.createElement('canvas');
                                  let width = img.width;
                                  let height = img.height;
                                  
                                  // Downscale to keep dimensions reasonable for tight target compression
                                  const maxDim = 350;
                                  if (width > maxDim || height > maxDim) {
                                    if (width > height) {
                                      height = Math.round((height * maxDim) / width);
                                      width = maxDim;
                                    } else {
                                      width = Math.round((width * maxDim) / height);
                                      height = maxDim;
                                    }
                                  }
                                  canvas.width = width;
                                  canvas.height = height;
                                  const ctx = canvas.getContext('2d');
                                  ctx.drawImage(img, 0, 0, width, height);

                                  // Adjust quality iterative parameter loop until result fits between 10 KB and 50 KB
                                  let quality = 0.8;
                                  let base64 = canvas.toDataURL('image/jpeg', quality);
                                  let sizeKb = (base64.length * 0.75) / 1024;

                                  if (sizeKb > 50) {
                                    while (sizeKb > 50 && quality > 0.05) {
                                      quality -= 0.05;
                                      base64 = canvas.toDataURL('image/jpeg', quality);
                                      sizeKb = (base64.length * 0.75) / 1024;
                                    }
                                  } else if (sizeKb < 10) {
                                    while (sizeKb < 10 && quality < 0.98) {
                                      quality += 0.05;
                                      base64 = canvas.toDataURL('image/jpeg', quality);
                                      sizeKb = (base64.length * 0.75) / 1024;
                                    }
                                  }

                                  setAdminAvatar(base64);
                                  localStorage.setItem('adminAvatar', base64);
                                  alert(`Profile photo successfully compressed and set to: ${sizeKb.toFixed(1)} KB (target: 10-50 KB)`);
                                };
                              };
                            }}
                          />
                          <div 
                            onClick={() => document.getElementById('adminAvatarUploadInput').click()}
                            className="h-28 w-28 border border-gray-200 rounded-full p-1 flex items-center justify-center bg-gray-50 relative group cursor-pointer overflow-hidden"
                          >
                            <img 
                              src={adminAvatar || "/image/admin-avatar.webp"} 
                              alt="Admin avatar preview" 
                              className="h-full w-full object-cover rounded-full" 
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                              <span className="text-[9px] font-bold text-white uppercase tracking-wider">Upload</span>
                            </div>
                          </div>
                          <span className="text-[9px] text-gray-400">Target compressed: 10-50 KB</span>
                        </div>

                        {/* Text fields block */}
                        <div className="flex-grow w-full grid grid-cols-1 gap-4">
                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Admin Name</label>
                            <input 
                              type="text"
                              value={adminName}
                              onChange={(e) => {
                                setAdminName(e.target.value);
                                localStorage.setItem('adminName', e.target.value);
                              }}
                              className="px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-semibold text-[13px] text-gray-700"
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Admin Email</label>
                            <input 
                              type="email"
                              value={adminEmail}
                              onChange={(e) => {
                                setAdminEmail(e.target.value);
                                localStorage.setItem('adminEmail', e.target.value);
                              }}
                              className="px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-semibold text-[13px] text-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* General Settings Section */}
                  {settingsTab === 'general' && (
                    <div className="space-y-6">
                      <div className="border-b border-gray-100 pb-3">
                        <h3 className="text-[15px] font-bold text-gray-800">General Settings</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">Basic store configurations and language settings.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] text-gray-700">
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Store Currency</label>
                          <select 
                            value={storeCurrency}
                            onChange={(e) => setStoreCurrency(e.target.value)}
                            className="px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-semibold bg-white"
                          >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                          </select>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Timezone</label>
                          <select 
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-semibold bg-white"
                          >
                            <option value="Asia/Kolkata">Asia/Kolkata (GMT +5:30)</option>
                            <option value="UTC">UTC (GMT +0:00)</option>
                            <option value="America/New_York">America/New_York (EST)</option>
                          </select>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date Format</label>
                          <select 
                            value={dateFormat}
                            onChange={(e) => setDateFormat(e.target.value)}
                            className="px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-semibold bg-white"
                          >
                            <option value="18 July 2026">DD MMMM YYYY (e.g. 18 July 2026)</option>
                            <option value="2026-07-18">YYYY-MM-DD (e.g. 2026-07-18)</option>
                          </select>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time Format</label>
                          <div className="flex items-center space-x-4 py-2.5 font-semibold text-gray-600">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name="time_fmt" 
                                checked={timeFormat === '12h'} 
                                onChange={() => setTimeFormat('12h')}
                                className="accent-black"
                              />
                              <span>12 Hour</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input 
                                type="radio" 
                                name="time_fmt" 
                                checked={timeFormat === '24h'} 
                                onChange={() => setTimeFormat('24h')}
                                className="accent-black"
                              />
                              <span>24 Hour</span>
                            </label>
                          </div>
                        </div>

                        {/* WEBSITE LANGUAGE CHANGE OPTION TO HINDI */}
                        <div className="flex flex-col space-y-1 sm:col-span-2 pt-2 border-t border-gray-100">
                          <label className="text-[10px] text-[#8e744a] font-bold uppercase tracking-wider flex items-center space-x-1">
                            <span>🌐</span>
                            <span>Website Language (लोकल भाषा चुनें)</span>
                          </label>
                          <p className="text-[11px] text-gray-400 pb-1">Set store user interface language (दुकान की मुख्य भाषा बदलें).</p>
                          <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="px-3.5 py-2.5 border border-[#8e744a] rounded-lg focus:outline-none focus:border-black font-bold bg-[#faf9f6] text-gray-700 max-w-xs"
                          >
                            <option value="en">English (US)</option>
                            <option value="hi">Hindi (हिन्दी)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order settings subtab */}
                  {settingsTab === 'payment' && (
                    <div className="space-y-6">
                      <div className="border-b border-gray-100 pb-3">
                        <h3 className="text-[15px] font-bold text-gray-800">Order Settings</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">Toggle automated rules for new customer orders.</p>
                      </div>

                      <div className="space-y-4 text-[13px] font-medium text-gray-700">
                        <div className="flex justify-between items-center py-2">
                          <div>
                            <div className="font-bold text-gray-800">Auto order confirmation</div>
                            <div className="text-[11px] text-gray-400">Automatically confirm orders on successful checkout.</div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={autoConfirm} 
                            onChange={(e) => setAutoConfirm(e.target.checked)} 
                            className="h-5 w-5 accent-black rounded cursor-pointer"
                          />
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-gray-100">
                          <div>
                            <div className="font-bold text-gray-800">Low stock alert</div>
                            <div className="text-[11px] text-gray-400">Receive dashboard notifications when stock falls below 3 items.</div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={lowStockAlert} 
                            onChange={(e) => setLowStockAlert(e.target.checked)} 
                            className="h-5 w-5 accent-black rounded cursor-pointer"
                          />
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-gray-100">
                          <div>
                            <div className="font-bold text-gray-800">Enable order notes</div>
                            <div className="text-[11px] text-gray-400">Allow customers to write custom instructions at checkout.</div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={enableNotes} 
                            onChange={(e) => setEnableNotes(e.target.checked)} 
                            className="h-5 w-5 accent-black rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email Notifications Subtab */}
                  {settingsTab === 'notifications' && (
                    <div className="space-y-6">
                      <div className="border-b border-gray-100 pb-3">
                        <h3 className="text-[15px] font-bold text-gray-800">Email Notifications</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">Toggle automated notifications to admin mailbox.</p>
                      </div>

                      <div className="space-y-4 text-[13px] font-medium text-gray-700">
                        <div className="flex justify-between items-center py-2">
                          <div>
                            <div className="font-bold text-gray-800">New order notification</div>
                            <div className="text-[11px] text-gray-400">Receive immediately upon new successful customer order.</div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={notifyNewOrder} 
                            onChange={(e) => setNotifyNewOrder(e.target.checked)} 
                            className="h-5 w-5 accent-black rounded cursor-pointer"
                          />
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-gray-100">
                          <div>
                            <div className="font-bold text-gray-800">Customer registration</div>
                            <div className="text-[11px] text-gray-400">Get notified when a new customer profile registers.</div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={notifyCustReg} 
                            onChange={(e) => setNotifyCustReg(e.target.checked)} 
                            className="h-5 w-5 accent-black rounded cursor-pointer"
                          />
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-gray-100">
                          <div>
                            <div className="font-bold text-gray-800">Low stock alert</div>
                            <div className="text-[11px] text-gray-400">Send summary report of depleted categories daily.</div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={notifyLowStock} 
                            onChange={(e) => setNotifyLowStock(e.target.checked)} 
                            className="h-5 w-5 accent-black rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security settings subtab */}
                  {settingsTab === 'security' && (
                    <div className="space-y-6">
                      <div className="border-b border-gray-100 pb-3">
                        <h3 className="text-[15px] font-bold text-gray-800">Security Control</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">Manage dashboard passwords and credential configurations.</p>
                      </div>

                      <div className="space-y-4 max-w-sm">
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">New Password</label>
                          <input 
                            type="password"
                            placeholder="Enter new password"
                            value={changePassword}
                            onChange={(e) => setChangePassword(e.target.value)}
                            className="px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-semibold text-[13px]"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Confirm Password</label>
                          <input 
                            type="password"
                            placeholder="Re-enter new password"
                            value={changePasswordConfirm}
                            onChange={(e) => setChangePasswordConfirm(e.target.value)}
                            className="px-3.5 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black font-semibold text-[13px]"
                          />
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-[13px]">
                          <div>
                            <div className="font-bold text-gray-800">Two-Factor Authentication</div>
                            <div className="text-[11px] text-gray-400">Enforce OTP-linked signups for other admin staff.</div>
                          </div>
                          <span className="bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded">
                            Enabled
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Backup & Export settings subtab */}
                  {settingsTab === 'backup' && (
                    <div className="space-y-6">
                      <div className="border-b border-gray-100 pb-3">
                        <h3 className="text-[15px] font-bold text-gray-800">Backup & Export</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">Download or backup your MongoDB collection details.</p>
                      </div>

                      <div className="space-y-5 text-[13px] font-medium text-gray-700 max-w-md">
                        <div className="flex justify-between items-center p-4 border border-gray-150 rounded-lg">
                          <div>
                            <div className="font-bold text-gray-800">Backup Data</div>
                            <div className="text-[11px] text-gray-400">Download direct cloud snapshot of active database collections.</div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => alert("Cloud backup created successfully!")}
                            className="px-4 py-2 border border-[#eae8e4] bg-[#faf9f6] hover:bg-gray-100 text-[11px] font-bold rounded-lg transition-colors"
                          >
                            Backup Now
                          </button>
                        </div>
                        <div className="flex justify-between items-center p-4 border border-gray-150 rounded-lg">
                          <div>
                            <div className="font-bold text-gray-800">Export CSV Data</div>
                            <div className="text-[11px] text-gray-400">Download customer email logs, orders, and reviews tables.</div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              let csv = "data:text/csv;charset=utf-8,Customer Name,Email,Phone\n";
                              contacts.forEach(c => csv += `"${c.name}","${c.email}","${c.phone || ''}"\n`);
                              const uri = encodeURI(csv);
                              const link = document.createElement("a");
                              link.setAttribute("href", uri);
                              link.setAttribute("download", "customer_data_export.csv");
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="px-4 py-2 border border-[#eae8e4] bg-[#faf9f6] hover:bg-gray-100 text-[11px] font-bold rounded-lg transition-colors"
                          >
                            Export CSV
                          </button>
                        </div>

                        {/* Danger zone render right inside backup panel for completeness */}
                        <div className="pt-4 border-t border-red-100 space-y-3">
                          <h4 className="text-[12px] font-bold text-red-600 uppercase tracking-wider">Danger Zone</h4>
                          <div className="p-4 border border-red-100 rounded-lg flex justify-between items-center bg-red-50/20">
                            <div>
                              <div className="font-bold text-gray-800">Delete Store</div>
                              <div className="text-[11px] text-gray-400">Permanently delete store collections and media logs.</div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                if (confirm("WARNING: Are you sure you want to delete the entire store database? This action is irreversible.")) {
                                  alert("This mock database deletion safety lock prevented action.");
                                }
                              }}
                              className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 bg-white text-[11px] font-bold rounded-lg transition-colors"
                            >
                              Delete Store
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fallback mock display for unconfigured settings tabs */}
                  {!['profile', 'general', 'payment', 'notifications', 'security', 'backup'].includes(settingsTab) && (
                    <div className="space-y-4 py-8 text-center text-gray-400">
                      <span>🔧</span>
                      <div className="text-[13px] font-bold text-gray-500 uppercase">{settingsTab} Panel Configured</div>
                      <div className="text-[11px] max-w-xs mx-auto">This section options are bound to main store profiles. Changes saved in Store Profile reflect here immediately.</div>
                    </div>
                  )}

                </div>

              </div>

            </div>
          );
        })()}

      </main>

      {/* Floating toast notification alert matching custom UI animations */}
      {toastNotification && (
        <div className="fixed bottom-5 right-5 z-[100] max-w-sm w-full bg-white border-l-4 border-[#8e744a] shadow-2xl p-4 rounded-r-lg flex items-start space-x-3 text-left font-sans border border-gray-150">
          <div className="text-[20px] shrink-0">🔔</div>
          <div className="flex-1 space-y-0.5">
            <h4 className="text-[12px] font-bold text-gray-800">Store Notification</h4>
            <p className="text-[11.5px] text-gray-500 leading-normal font-medium">{toastNotification.message}</p>
          </div>
          <button 
            type="button"
            onClick={() => setToastNotification(null)}
            className="text-gray-400 hover:text-black font-extrabold text-[12px] px-1"
          >
            ×
          </button>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
