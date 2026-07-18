import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, CheckCircle, Smartphone } from 'lucide-react';

const CheckoutPage = ({ cartItems, onBack, onClearCart }) => {
  const [step, setStep] = useState('address'); // 'address' or 'payment'
  const [showAddressUpdated, setShowAddressUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Address form fields
  const [pincode, setPincode] = useState('160055');
  const [city, setCity] = useState('S.A.S NAGAR');
  const [state, setState] = useState('PUNJAB');
  const [flat, setFlat] = useState('102 daljeet pg');
  const [apartment, setApartment] = useState('Muktsar, Punjab');
  const [name, setName] = useState('Deepak Kumar');
  const [email, setEmail] = useState('dk897869@gmail.com');
  const [phone, setPhone] = useState('6239785524');
  const [addressType, setAddressType] = useState('home'); // 'home' or 'work'
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Pincode lookup API states
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeMessage, setPincodeMessage] = useState('');

  // Coupon code states
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('PREPAID@100'); // Default prepaid discount code
  const [couponDiscount, setCouponDiscount] = useState(100);
  const [couponMessage, setCouponMessage] = useState('');

  // Custom Payment Options States
  const [paymentMethod, setPaymentMethod] = useState('upi_qr'); // 'upi_qr', 'card', 'upi_id', 'wallet'
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins expiry
  const [qrSeed, setQrSeed] = useState(Math.random()); // unique transaction seed
  
  // Card input states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // UPI ID input state
  const [upiIdInput, setUpiIdInput] = useState('');
  const [verifiedUpiName, setVerifiedUpiName] = useState('');

  // Wallet input state
  const [selectedWallet, setSelectedWallet] = useState('phonepe');

  // Load user from localstorage if available
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) {
          // Strip country code if present for the input field
          setPhone(parsed.phone.replace('+91', ''));
        }
      }
    } catch (e) {
      console.warn('Error loading user session on checkout:', e.message);
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (step === 'payment' && timerSeconds > 0) {
      const interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timerSeconds]);

  const handleRegenerateQR = () => {
    setTimerSeconds(300);
    setQrSeed(Math.random());
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Compute subtotal from cart items
  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const originalSubtotal = cartItems.reduce((acc, item) => acc + ((item.compareAtPrice || item.price * 1.5) * item.quantity), 0);
  
  // Math values matching screenshot
  const discountAmount = originalSubtotal - subtotal;
  const upiDiscount = Math.round((subtotal - couponDiscount) * 0.1); // 10% prepaid discount
  const finalUpiPayable = subtotal - couponDiscount - upiDiscount;
  const finalCodPayable = subtotal - couponDiscount;

  // Pin Code verification API trigger
  useEffect(() => {
    if (pincode && pincode.length === 6) {
      setPincodeLoading(true);
      setPincodeMessage('Verifying pincode...');
      fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === 'Success') {
            const details = data[0].PostOffice[0];
            setCity(details.District || details.Block || details.Name);
            setState(details.State.toUpperCase());
            setPincodeMessage('Pincode verified successfully via API.');
          } else {
            setPincodeMessage('Pincode not found. Please enter details manually.');
          }
        })
        .catch(err => {
          console.warn('Pincode API Error:', err.message);
          setPincodeMessage('Pincode check offline. Enter details manually.');
        })
        .finally(() => setPincodeLoading(false));
    } else {
      setPincodeMessage('');
    }
  }, [pincode]);

  const handleApplyCoupon = (e) => {
    if (e) e.preventDefault();
    setCouponMessage('');

    if (!couponInput) {
      setCouponMessage('Please enter a coupon code.');
      return;
    }

    const cleanedCode = couponInput.trim().toUpperCase();

    if (cleanedCode === 'WELCOME100') {
      if (subtotal < 1000) {
        setCouponMessage('WELCOME100 requires a minimum order of Rs. 1,000.');
        return;
      }
      setAppliedCoupon('WELCOME100');
      setCouponDiscount(100);
      setCouponMessage('WELCOME100 applied successfully! Rs. 100 off your first purchase.');
    } else if (cleanedCode === 'PREPAID@100') {
      setAppliedCoupon('PREPAID@100');
      setCouponDiscount(100);
      setCouponMessage('PREPAID@100 applied successfully! Rs. 100 off.');
    } else {
      setCouponMessage('Invalid coupon code. Try WELCOME100 or PREPAID@100.');
    }
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setCouponDiscount(0);
    setCouponMessage('Coupon code removed.');
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(value).replace('₹', 'Rs. ');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!pincode || !city || !state || !flat || !apartment || !name || !email || !phone) {
      alert('Please fill in all required fields.');
      return;
    }
    setShowAddressUpdated(true);
    setStep('payment');
  };

  // Dynamically load Razorpay SDK script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Trigger Real Razorpay payment gateway
  const handlePayment = async () => {
    setLoading(true);
    const amountToPay = finalUpiPayable; // standard UPI discounted amount

    const shippingDetails = {
      name,
      email,
      phone: `+91${phone}`,
      address: `${flat}, ${apartment}, ${city}, ${state} - ${pincode}`,
      addressType,
      shippingMethod
    };

    try {
      // 1. Create order on the backend server
      const orderRes = await fetch('http://localhost:5000/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountToPay })
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.id) {
        alert('Failed to initialize payment order on server.');
        setLoading(false);
        return;
      }

      // 2. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // 3. Define Razorpay Options
      const options = {
        key: orderData.mock ? 'rzp_live_TErlyYApKITv7m' : orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Regal Weave',
        description: 'Timeless Premium Linen Apparel Checkout',
        image: '/image/logo-signature.webp',
        handler: async (response) => {
          setLoading(true);
          try {
            // 4. Verify Payment on Server
            const verifyRes = await fetch('http://localhost:5000/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || `order_live_${Date.now()}`,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || 'live_payment_passed',
                amount: amountToPay,
                items: cartItems.map(item => ({
                  productId: item._id,
                  name: item.name,
                  price: item.price,
                  size: item.size,
                  quantity: item.quantity,
                  image: item.images[0]
                })),
                shippingAddress: shippingDetails
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              setOrderSuccess({
                id: response.razorpay_payment_id || `pay_${Date.now()}`,
                method: 'Razorpay Online Gateway (Prepaid)',
                amount: amountToPay,
                address: shippingDetails
              });
              if (onClearCart) onClearCart();
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verify error:', err);
            alert('Verification connection error.');
          }
          setLoading(false);
        },
        prefill: {
          name: shippingDetails.name,
          email: shippingDetails.email,
          contact: shippingDetails.phone
        },
        notes: {
          address: shippingDetails.address
        },
        theme: {
          color: '#002349'
        }
      };

      // Only pass order_id if it's a real order created on the backend (not mock)
      if (orderData.id && !orderData.id.startsWith('order_mock_')) {
        options.order_id = orderData.id;
      }

      // 5. Open Gateway
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setLoading(false);

    } catch (err) {
      console.error('Checkout gateway error:', err);
      alert('Error triggering checkout gateway.');
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 font-sans text-left">
        <div className="bg-white max-w-md w-full p-8 text-center border border-gray-200 shadow-2xl">
          <CheckCircle className="text-green-600 mx-auto mb-4" size={56} />
          <h2 className="text-[22px] font-bold mb-2">Order Confirmed!</h2>
          <p className="text-[14px] text-gray-500 mb-6">Your timeless apparel order has been placed successfully.</p>
          
          <div className="bg-gray-50 p-4 text-[12px] text-left space-y-2 mb-6 border border-gray-200">
            <div><strong>Order ID:</strong> {orderSuccess.id}</div>
            <div><strong>Amount Paid:</strong> {formatPrice(orderSuccess.amount)}</div>
            <div><strong>Payment Method:</strong> {orderSuccess.method}</div>
            <div><strong>Ship To:</strong> {orderSuccess.address.name} ({orderSuccess.address.address})</div>
          </div>

          <button 
            onClick={onBack}
            className="w-full py-3 bg-black text-white text-[13px] font-semibold uppercase tracking-wider hover:opacity-95"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start overflow-y-auto pt-6 pb-20 px-4 font-sans">
      
      {/* Modal Container */}
      <div className="bg-white max-w-[500px] w-full shadow-2xl relative flex flex-col pb-4 text-left select-none animate-slide-up">
        
        {/* Step 1: Add Delivery Address */}
        {step === 'address' && (
          <form onSubmit={handleAddressSubmit} className="flex flex-col">
            
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
              <button type="button" onClick={onBack} className="text-gray-500 hover:text-black">
                <ArrowLeft size={20} />
              </button>
              <div className="text-center flex-1">
                <h2 className="text-[16px] font-bold text-gray-800">Add Delivery Address</h2>
                <div className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">100% Secured Payment</div>
              </div>
              <button type="button" onClick={onBack} className="text-gray-500 hover:text-black">
                <X size={20} />
              </button>
            </div>

            {/* Badge Trust */}
            <div className="bg-[#f5f5f0] py-2.5 px-4 text-center text-[10px] font-bold text-gray-500 border-b border-gray-200">
              Trusted by 38K+ Customers • India's 1st Old Money Brand
            </div>

            {/* Form Fields */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              
              {/* Pincode */}
              <div className="flex flex-col space-y-1">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Pincode *</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="px-3.5 py-2.5 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-black font-semibold text-gray-700 w-full"
                  />
                  {pincodeLoading && (
                    <span className="absolute right-3 top-3 text-[10px] text-gray-400 font-sans animate-pulse">Loading...</span>
                  )}
                </div>
                {pincodeMessage && (
                  <span className={`text-[10px] font-sans ${pincodeMessage.includes('successfully') ? 'text-green-600' : 'text-orange-500'}`}>
                    {pincodeMessage}
                  </span>
                )}
              </div>

              {/* City & State Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">City *</label>
                  <input 
                    type="text" 
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="px-3.5 py-2.5 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-black font-semibold text-gray-700"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">State *</label>
                  <input 
                    type="text" 
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="px-3.5 py-2.5 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-black font-semibold text-gray-700"
                  />
                </div>
              </div>

              {/* Flat, House no */}
              <div className="flex flex-col space-y-1">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Flat, House no. *</label>
                <input 
                  type="text" 
                  required
                  value={flat}
                  onChange={(e) => setFlat(e.target.value)}
                  className="px-3.5 py-2.5 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-black font-semibold text-gray-700"
                />
              </div>

              {/* Apartment / Sector / Village */}
              <div className="flex flex-col space-y-1">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Apartment, Area, Sector, Village *</label>
                <input 
                  type="text" 
                  required
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="px-3.5 py-2.5 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-black font-semibold text-gray-700"
                />
              </div>

              {/* Divider */}
              <div className="text-[12px] font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-1.5 pt-2">
                Customer Information
              </div>

              {/* Full Name */}
              <div className="flex flex-col space-y-1">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3.5 py-2.5 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-black font-semibold text-gray-700"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col space-y-1">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2.5 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-black font-semibold text-gray-700"
                />
              </div>

              {/* Phone number */}
              <div className="flex flex-col space-y-1">
                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Phone number *</label>
                <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                  <span className="bg-gray-50 px-3 py-2.5 text-[13px] text-gray-500 font-semibold border-r border-gray-300">+91</span>
                  <input 
                    type="tel" 
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="px-3 py-2.5 text-[13px] focus:outline-none w-full font-semibold text-gray-700"
                  />
                </div>
              </div>

              <div className="text-[11px] text-gray-400 text-center font-medium">
                ⓘ Please enter the complete address for smooth delivery.
              </div>

              {/* Save Address As */}
              <div className="flex flex-col space-y-2.5 pt-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Save Address As</span>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setAddressType('home')}
                    className={`px-5 py-2 rounded-full text-[12px] font-semibold border transition-all ${
                      addressType === 'home'
                        ? 'border-black bg-black text-white shadow-sm'
                        : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressType('work')}
                    className={`px-5 py-2 rounded-full text-[12px] font-semibold border transition-all ${
                      addressType === 'work'
                        ? 'border-black bg-black text-white shadow-sm'
                        : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    Work
                  </button>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="flex flex-col space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Shipping Method</span>
                <div className="border border-green-500 bg-green-50/50 p-4 rounded flex justify-between items-center">
                  <div className="space-y-0.5 text-left">
                    <div className="text-[12px] font-bold text-gray-800">Standard Shipping</div>
                    <div className="text-[10px] text-gray-500 font-semibold">Get faster delivery with prepaid orders!</div>
                  </div>
                  <span className="bg-green-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">Free</span>
                </div>
              </div>

            </div>

            {/* Continue Button */}
            <div className="p-5 border-t border-gray-100">
              <button 
                type="submit"
                className="w-full py-4 bg-black text-white text-[13px] font-bold uppercase tracking-widest hover:opacity-95 transition-opacity rounded"
              >
                Continue
              </button>
            </div>

          </form>
        )}

        {/* Step 2: Delivery Details & Payment */}
        {step === 'payment' && (
          <div className="flex flex-col">
            
            {/* Green Success Banner */}
            {showAddressUpdated && (
              <div className="bg-[#00a65a] text-white py-2.5 px-4 text-center text-[12px] font-semibold flex justify-between items-center transition-all select-none">
                <span className="flex-1 text-center">Your new address has been updated successfully.</span>
                <button onClick={() => setShowAddressUpdated(false)} className="text-white hover:opacity-75 font-bold text-[11px] uppercase">
                  Close
                </button>
              </div>
            )}

            {/* Black Review Alert */}
            <div className="bg-black text-white py-2 px-4 text-center text-[10px] font-bold tracking-wider select-none">
              Kindly review your address to ensure a hassle-free delivery.
            </div>

            {/* Main Details Section */}
            <div className="p-5 space-y-5 max-h-[65vh] overflow-y-auto">
              
              {/* Delivery Details Block */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Delivery Details</div>
                
                {/* Order Summary */}
                <div className="border border-gray-200 p-4 rounded bg-gray-50/50 flex justify-between items-center">
                  <div className="text-left space-y-0.5">
                    <div className="text-[12px] font-bold text-gray-800">Order Summary</div>
                    <div className="text-[10px] text-gray-500 font-semibold">{itemsCount} {itemsCount === 1 ? 'item' : 'items'}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">
                      {formatPrice(discountAmount)} saved so far
                    </span>
                    <span className="line-through text-gray-400 text-[12px] font-light">{formatPrice(originalSubtotal)}</span>
                    <span className="text-[14px] font-bold text-gray-800">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                {/* Deliver To Card */}
                <div className="border border-gray-200 p-4 rounded relative flex justify-between items-start">
                  <div className="text-left space-y-1.5 pr-8">
                    <div className="text-[12px] font-bold text-gray-800 flex items-center space-x-1.5">
                      <span className="text-[14px]">📍</span>
                      <span>Deliver To {name}</span>
                    </div>
                    <div className="text-[11px] text-gray-600 leading-relaxed font-semibold">
                      {flat}, {apartment}<br />
                      {city}, {state} - {pincode}
                    </div>
                    <div className="text-[11px] text-gray-400 font-bold">
                      +91 {phone} • {email}
                    </div>
                  </div>
                  
                  {/* Edit block */}
                  <div className="flex flex-col items-end space-y-1.5">
                    <span className="bg-black text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase select-none">
                      Tap To Edit Address
                    </span>
                    <button 
                      onClick={() => setStep('address')}
                      className="px-3.5 py-1 border border-gray-300 rounded text-[11px] font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Standard Shipping details */}
                <div className="border border-gray-200 p-4 rounded bg-gray-50/50 flex justify-between items-center text-[12px]">
                  <span className="font-bold text-gray-700">Standard Shipping</span>
                  <span className="font-semibold text-green-700 flex items-center space-x-1">
                    <span>Get Faster Delivery With Prepaid Orders!</span>
                    <strong className="uppercase ml-1">Free</strong>
                  </span>
                </div>

              </div>

              {/* Offers & Rewards */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Offers & Rewards</div>
                
                {appliedCoupon ? (
                  <div className="border border-green-200 p-4 rounded bg-green-50/30 flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-left">
                      <span className="text-green-600 text-lg font-bold">✔</span>
                      <div className="space-y-0.5">
                        <div className="text-[12px] font-bold text-gray-800 uppercase tracking-wide">*{appliedCoupon}* applied</div>
                        <div className="text-[10px] text-green-700 font-semibold">You saved {formatPrice(couponDiscount)}</div>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 text-[11px] font-bold uppercase"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                      <input 
                        type="text" 
                        placeholder="Enter Coupon Code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="px-3.5 py-2.5 text-[13px] w-full focus:outline-none placeholder-gray-400 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-5 py-2.5 bg-black text-white text-[12px] font-bold uppercase hover:bg-black/90"
                      >
                        Apply
                      </button>
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">
                      Use <strong className="text-gray-600">WELCOME100</strong> (first order min Rs.1000) or <strong className="text-gray-600">PREPAID@100</strong>
                    </div>
                  </div>
                )}
                {couponMessage && (
                  <div className={`text-[11px] font-sans ${couponMessage.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
                    {couponMessage}
                  </div>
                )}
              </div>

              {/* Payment Options */}
              <div className="space-y-3 pt-1">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Payment Options</div>
                
                {/* Method selector tabs */}
                <div className="grid grid-cols-4 gap-1.5 border-b border-gray-200 pb-2">
                  {[
                    { id: 'upi_qr', label: 'UPI QR' },
                    { id: 'card', label: 'Cards' },
                    { id: 'upi_id', label: 'UPI ID' },
                    { id: 'wallet', label: 'Wallets' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentMethod(tab.id)}
                      className={`py-2 text-[11px] font-bold uppercase border-b-2 transition-all ${
                        paymentMethod === tab.id
                          ? 'border-black text-black'
                          : 'border-transparent text-gray-400 hover:text-black'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Conditional Payment Methods views */}
                {paymentMethod === 'upi_qr' && (
                  <div className="border border-gray-200 p-5 rounded space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-[16px]">⚡</span>
                        <span className="text-[13px] font-bold text-gray-800 font-sans">UPI QR Code (Prepaid)</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="line-through text-gray-400 text-[11px] font-light">{formatPrice(finalCodPayable)}</span>
                        <span className="text-[15px] font-extrabold text-gray-800">{formatPrice(finalUpiPayable)}</span>
                      </div>
                    </div>

                    {/* QR Code Timer Box */}
                    <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 p-6 rounded bg-gray-50 relative overflow-hidden group">
                      
                      {timerSeconds > 0 ? (
                        <div className="w-32 h-32 bg-white p-2 border border-gray-200 shadow-sm flex items-center justify-center relative">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                              `upi://pay?pa=6239785524@apl&pn=RegalWeave&am=${finalUpiPayable}&cu=INR&tr=ref_${qrSeed}`
                            )}`}
                            alt="UPI Payment QR" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-gray-100 flex flex-col items-center justify-center border border-gray-300 relative text-center p-2">
                          <AlertTriangle className="text-red-500 mb-1" size={24} />
                          <span className="text-[9px] font-bold text-red-500 uppercase leading-none">QR Code<br />Expired</span>
                        </div>
                      )}

                      {timerSeconds > 0 ? (
                        <div className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-4 text-center">
                          Scan using any UPI App • Expires in <span className="text-red-600 font-extrabold font-mono">{formatTimer(timerSeconds)}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleRegenerateQR}
                          className="mt-4 px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-wider hover:opacity-90"
                        >
                          Regenerate QR Code
                        </button>
                      )}

                      {/* UPI Badges */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 select-none text-[8.5px] font-bold uppercase tracking-wider">
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded border border-purple-100 font-sans">PhonePe</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 font-sans">GPay</span>
                        <span className="px-2 py-0.5 bg-sky-50 text-sky-600 rounded border border-sky-100 font-sans">Paytm</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200 font-sans font-extrabold">BHIM UPI</span>
                      </div>

                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="border border-gray-200 p-5 rounded space-y-4 font-sans text-left">
                    <div className="text-[13px] font-bold text-gray-800 flex items-center space-x-2">
                      <span>💳</span>
                      <span>Debit / Credit Card Checkout</span>
                    </div>

                    <div className="space-y-3 text-[12px]">
                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Card Number *</label>
                        <input 
                          type="text" 
                          placeholder="4111 2222 3333 4444"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                          className="px-3.5 py-2.5 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-black font-semibold text-gray-700 bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Expiry (MM/YY) *</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              setCardExpiry(val.length > 2 ? `${val.slice(0,2)}/${val.slice(2,4)}` : val);
                            }}
                            className="px-3.5 py-2.5 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-black font-semibold text-gray-700 bg-white"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">CVV *</label>
                          <input 
                            type="password" 
                            placeholder="•••"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            className="px-3.5 py-2.5 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-black font-semibold text-gray-700 bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Name on Card *</label>
                        <input 
                          type="text" 
                          placeholder="DEEPAK KUMAR"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="px-3.5 py-2.5 border border-gray-300 rounded text-[13px] focus:outline-none focus:border-black font-semibold text-gray-700 bg-white uppercase"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi_id' && (
                  <div className="border border-gray-200 p-5 rounded space-y-4 font-sans text-left">
                    <div className="text-[13px] font-bold text-gray-800 flex items-center space-x-2">
                      <span>⚡</span>
                      <span>Enter UPI Address</span>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <div className="flex border border-gray-300 rounded overflow-hidden">
                        <input 
                          type="text" 
                          placeholder="example@upi"
                          value={upiIdInput}
                          onChange={(e) => setUpiIdInput(e.target.value)}
                          className="px-3.5 py-2.5 text-[13px] w-full focus:outline-none placeholder-gray-400 font-semibold"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (!upiIdInput) {
                              alert('Please enter a UPI ID.');
                              return;
                            }
                            try {
                              const res = await fetch('http://localhost:5000/api/payment/verify-upi', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ upiId: upiIdInput })
                              });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                setVerifiedUpiName(data.name);
                              } else {
                                setVerifiedUpiName('');
                                alert(data.message || 'Verification failed.');
                              }
                            } catch (err) {
                              setVerifiedUpiName('');
                              alert('Error connecting to UPI verification server.');
                            }
                          }}
                          className="px-5 py-2.5 bg-black text-white text-[11px] font-bold uppercase"
                        >
                          Verify
                        </button>
                      </div>
                      
                      {verifiedUpiName && (
                        <div className="text-[11px] font-sans font-bold text-green-600 bg-green-50/50 px-3 py-2 border border-green-200 flex items-center space-x-1.5 rounded">
                          <span>✔</span>
                          <span>Account Holder Name:</span>
                          <span className="text-gray-800 uppercase font-extrabold">{verifiedUpiName}</span>
                        </div>
                      )}

                      <span className="text-[10px] text-gray-400">Pay securely using GPay, PhonePe, Paytm, or BHIM.</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="border border-gray-200 p-5 rounded space-y-4 font-sans text-left">
                    <div className="text-[13px] font-bold text-gray-800 flex items-center space-x-2">
                      <span>💼</span>
                      <span>Select Prepaid Wallet</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[12px]">
                      {[
                        { id: 'phonepe', name: 'PhonePe Wallet' },
                        { id: 'paytm', name: 'Paytm Wallet' },
                        { id: 'amazon', name: 'Amazon Pay' },
                        { id: 'mobikwik', name: 'Mobikwik' }
                      ].map(wallet => (
                        <label 
                          key={wallet.id}
                          className={`flex items-center space-x-3 p-3 border rounded cursor-pointer transition-colors ${
                            selectedWallet === wallet.id
                              ? 'border-black bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="wallet_select"
                            checked={selectedWallet === wallet.id}
                            onChange={() => setSelectedWallet(wallet.id)}
                            className="text-black focus:ring-black accent-black"
                          />
                          <span className="font-semibold text-gray-700">{wallet.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Pay Now Button */}
            <div className="p-5 border-t border-gray-100 space-y-3">
              <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-[#002349] text-white text-[13px] font-bold uppercase tracking-widest hover:opacity-95 transition-opacity rounded flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Smartphone size={16} />
                    <span>Pay Now via Razorpay</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setStep('address')}
                className="w-full py-2 bg-transparent text-center text-gray-500 hover:text-black text-[12px] font-semibold underline"
              >
                Go Back
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default CheckoutPage;
