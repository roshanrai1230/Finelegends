import React from 'react';

const HomePageInfo = ({ onNavigate }) => {
  const features = [
    { title: 'Premium Quality', subtitle: 'Finest Fabrics', badge: 'Best in class' },
    { title: 'Fast Delivery', subtitle: 'Pan India Shipping', badge: 'Across the country' },
    { title: '7 Day Returns', subtitle: 'Easy Returns', badge: 'Hassle-free' },
    { title: 'Secure Payment', subtitle: '100% Protected', badge: 'Trusted checkout' },
    { title: 'COD Available', subtitle: 'Pay on Delivery', badge: 'Convenient' },
    { title: 'Exclusive Designs', subtitle: 'Limited Drops', badge: 'Signature styles' }
  ];

  const arrivals = [
    { title: 'Textured Knit Polo', price: '₹2,199', image: '/image/collection-combo.png', label: 'Sand Beige' },
    { title: 'Relaxed Fit Trousers', price: '₹2,499', image: '/image/collection-gurkha.jpg', label: 'Stone Grey' },
    { title: 'Linen Blend Shirt', price: '₹2,299', image: '/image/collection-winterwear.jpg', label: 'Olive Green' }
  ];

  const articles = [
    { title: 'How to Style Linen Shirts', detail: 'Read Article', image: '/image/homepage-1.webp' },
    { title: 'Summer Wardrobe Essentials', detail: 'Read Article', image: '/image/Collections-2.webp' },
    { title: 'Watch Guide for Men', detail: 'Read Article', image: '/image/Collections-1.webp' }
  ];

  const reviews = [
    { name: 'Rahul Sharma', quote: 'The quality is unbelievable! Perfect fit and looks premium.', role: 'Verified Buyer' },
    { name: 'Arjun Mehta', quote: 'Fast delivery and the packaging was top-notch. Loved it!', role: 'Verified Buyer' },
    { name: 'Vivaan Kapoor', quote: 'BlackDistrict is my go-to brand now. Totally worth it.', role: 'Verified Buyer' }
  ];

  return (
    <section className="bg-[#f7f2eb] text-[#1b1b1b] font-sans px-4 sm:px-6 lg:px-10 py-16">
      <div className="max-w-[1400px] mx-auto space-y-20">

        {/* Feature row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ title, subtitle, badge }) => (
            <div key={title} className="rounded-[24px] border border-[#ddd7ce] bg-white/95 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center rounded-full bg-[#f3e9d8] px-4 py-2 text-[11px] uppercase tracking-[0.24em] font-semibold text-[#6c5841] mb-4">
                {badge}
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm text-[#5b5b56] leading-relaxed">{subtitle}</p>
            </div>
          ))}
        </div>

        {/* New arrivals */}
        <div id="new-arrivals" className="space-y-8">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
            <div>
              <p className="uppercase text-sm tracking-[0.35em] text-[#8b7f6f] mb-3">New Arrivals</p>
              <h2 className="text-[32px] md:text-[42px] font-heading font-semibold max-w-2xl">Linen Premium Shirt<br />Dark Coffee</h2>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('collections')}
              className="rounded-sm border border-black bg-black px-8 py-3 text-[13px] uppercase tracking-[0.18em] text-white hover:bg-gray-900 transition"
            >
              View All
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] items-start">
            <div className="group overflow-hidden rounded-[32px] bg-[#141313] text-white shadow-[0_30px_90px_rgba(0,0,0,0.25)] relative">
              <img src="/image/collection-homepage.png" alt="Linen Premium Shirt" className="w-full h-[560px] object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-8">
                <span className="text-sm uppercase tracking-[0.35em] text-[#d0b56d]">New</span>
                <h3 className="mt-4 text-[28px] md:text-[32px] font-semibold">Linen Premium Shirt</h3>
                <p className="mt-2 text-sm text-[#dcd8d2]">Dark Coffee</p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <span className="text-[24px] font-semibold">₹2,999</span>
                  <button
                    onClick={() => onNavigate && onNavigate('pant')}
                    className="rounded-sm border border-white/20 bg-white/10 px-6 py-2 text-sm uppercase tracking-[0.18em] hover:bg-white/15 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {arrivals.map((item) => (
                <div key={item.title} className="overflow-hidden rounded-[28px] bg-white shadow-sm border border-[#e6ded2]">
                  <img src={item.image} alt={item.title} className="w-full h-56 object-cover object-center" />
                  <div className="p-5">
                    <span className="text-sm uppercase tracking-[0.25em] text-[#8b7f6f]">New</span>
                    <h3 className="mt-4 text-xl font-semibold leading-snug">{item.title}</h3>
                    <p className="mt-2 text-sm text-[#5a534b]">{item.label}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-[15px] font-semibold">{item.price}</span>
                      <button
                        onClick={() => onNavigate && onNavigate('collections')}
                        className="text-sm uppercase tracking-[0.18em] text-[#1a1a1a] hover:underline"
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Promo banners */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[32px] bg-[#191814] text-white">
            <img src="/image/Elegance.webp" alt="Old Money Collection" className="w-full h-80 object-cover object-center opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/85 via-[#121212]/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="uppercase text-[12px] tracking-[0.35em] text-[#d4b86a] mb-3">Old Money Collection</p>
              <h3 className="text-3xl font-semibold mb-4">Timeless tailoring inspired by elegance that never fades.</h3>
              <button
                onClick={() => onNavigate && onNavigate('collections')}
                className="rounded-sm bg-[#d0b56d] px-8 py-3 text-[13px] uppercase tracking-[0.18em] text-[#111111] hover:bg-[#b69847] transition"
              >
                Explore Collection
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] bg-[#111111] text-white">
            <img src="/image/Heritage.webp" alt="Summer Edit" className="w-full h-80 object-cover object-center opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="uppercase text-[12px] tracking-[0.35em] text-[#d0b56d] mb-3">The Summer Edit ’24</p>
              <h3 className="text-3xl font-semibold mb-4">Light. Breezy. Effortless. Styles for the new season.</h3>
              <button
                onClick={() => onNavigate && onNavigate('collections')}
                className="rounded-sm border border-white/20 bg-white/10 px-8 py-3 text-[13px] uppercase tracking-[0.18em] text-white hover:bg-white/15 transition"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Style journal */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="uppercase text-sm tracking-[0.35em] text-[#8b7f6f] mb-2">Style Journal</p>
              <h2 className="text-[32px] md:text-[40px] font-heading font-semibold">Inspiration for every wardrobe.</h2>
            </div>
            <a
              href="#"
              className="text-sm uppercase tracking-[0.18em] text-[#1a1a1a] hover:underline"
            >
              View All Articles
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <a key={article.title} href="#" className="group overflow-hidden rounded-[28px] border border-[#ddd3c8] bg-white shadow-sm transition hover:-translate-y-1">
                <img src={article.image} alt={article.title} className="w-full h-56 object-cover object-center transition duration-700 group-hover:scale-[1.02]" />
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#8b7f6f]">{article.detail}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="uppercase text-sm tracking-[0.35em] text-[#8b7f6f] mb-2">Loved by thousands</p>
              <h2 className="text-[32px] md:text-[40px] font-heading font-semibold">What our customers are saying.</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.name} className="rounded-[28px] border border-[#e4dbce] bg-white p-8 shadow-sm">
                <div className="mb-6 text-[14px] leading-relaxed text-[#4f4a43]">“{review.quote}”</div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0e7db] text-[#3e352a] font-semibold">{review.name.split(' ').map((w) => w[0]).join('')}</div>
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-[#7a7268]">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown + Newsletter */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] bg-[#111111] text-white p-10 shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
            <p className="uppercase text-sm tracking-[0.35em] text-[#d3b56d] mb-4">Limited Drop</p>
            <h3 className="text-[34px] md:text-[40px] font-semibold leading-tight mb-6">Only 200 pieces</h3>
            <div className="grid grid-cols-4 gap-4 text-center text-[14px] uppercase tracking-[0.18em] text-[#d5c695]">
              {['02 days', '14 hrs', '45 mins', '30 secs'].map((item) => (
                <div key={item} className="rounded-2xl bg-white/5 p-4">
                  <span className="block text-[28px] font-semibold text-white leading-none">{item.split(' ')[0]}</span>
                  <span className="block text-xs text-[#d5c695]/90">{item.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate && onNavigate('collections')}
              className="mt-8 rounded-sm bg-[#d0b56d] px-8 py-3 text-[13px] uppercase tracking-[0.18em] font-semibold text-[#111111] hover:bg-[#b59847] transition"
            >
              Shop The Drop
            </button>
          </div>
          <div className="rounded-[32px] bg-white border border-[#ddd4c8] p-10 shadow-sm">
            <p className="uppercase text-sm tracking-[0.35em] text-[#8b7f6f] mb-4">Become part of the district</p>
            <h3 className="text-[28px] md:text-[32px] font-semibold leading-tight mb-6">Sign up and get 10% off on your first order.</h3>
            <form className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-sm border border-[#cbc1b2] bg-[#faf6f0] px-5 py-4 text-sm text-[#1a1a1a] focus:border-[#b89f46] focus:outline-none"
              />
              <button
                type="button"
                className="rounded-sm bg-[#111111] px-8 py-4 text-sm uppercase tracking-[0.18em] font-semibold text-white hover:bg-[#333333] transition"
              >
                Join Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageInfo;
