import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  BarChart3, 
  CheckCircle2, 
  Lock,
  Zap,
  PlusCircle,
  MousePointer
} from 'lucide-react';
import AuthPanel from './auth/AuthPanel';

// Framer Motion Stagger Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  },
};

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  
  // Interactive Demo State - Sticky Scroll Driven
  const [activeTab, setActiveTab] = useState('transactions');
  const [scrollProgress, setScrollProgress] = useState(0);
  const previewRef = useRef(null);

  const tabs = [
    { id: 'transactions', label: '1. Transactions' },
    { id: 'add', label: '2. Add Entry' },
    { id: 'categories', label: '3. Categories' },
    { id: 'charts', label: '4. Visual Charts' },
  ];

  // Sticky Scroll-Locking Tab Switching Effect
  useEffect(() => {
    const handleScroll = () => {
      if (!previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const trackHeight = rect.height - windowHeight;
      if (trackHeight <= 0) return;

      const scrolledY = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolledY / trackHeight));
      
      setScrollProgress(progress);

      // Map progress to the 4 demo tabs while card is locked in view
      if (progress < 0.25) {
        setActiveTab('transactions');
      } else if (progress < 0.50) {
        setActiveTab('add');
      } else if (progress < 0.75) {
        setActiveTab('categories');
      } else {
        setActiveTab('charts');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const closeAuth = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50 text-gray-800 font-sans">
      
      {/* Background Orbs with Framer Motion Floating Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          className="absolute -top-36 -left-36 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-400/30 to-rose-400/20 blur-[90px]"
          animate={{ 
            scale: [1, 1.18, 1], 
            x: [0, 20, 0],
            opacity: [0.35, 0.55, 0.35] 
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-400/20 blur-[90px]"
          animate={{ 
            scale: [1, 1.25, 1], 
            y: [0, -25, 0],
            opacity: [0.35, 0.5, 0.35] 
          }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px]"
          animate={{ 
            scale: [0.9, 1.1, 0.9],
            opacity: [0.1, 0.25, 0.1]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Tailwind Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-orange-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          
          {/* Brand Logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Wallet size={24} />
            </motion.div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">FinTraQ</span>
          </motion.div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#preview" className="hover:text-orange-600 transition-colors">Interactive Demo</a>
            <a href="#features" className="hover:text-orange-600 transition-colors">Features</a>
            <a href="#security" className="hover:text-orange-600 transition-colors">Security</a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button 
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-transparent border border-gray-300 rounded-xl hover:bg-gray-100 transition-all"
              onClick={() => openAuth('login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
            <motion.button 
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all"
              onClick={() => openAuth('register')}
              whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(249, 115, 22, 0.45)' }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center">
        
        {/* Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/70 border border-orange-400/30 text-orange-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.04 }}
        >
          <Sparkles size={16} />
          <span>Smart Personal Finance Tracker</span>
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15] mb-6"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Master Your Money with <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-indigo-600 bg-clip-text text-transparent">Effortless Precision</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-9"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Track income, manage custom expense categories, and gain deep visual insights 
          into your financial health with FinTraQ.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button 
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-xl shadow-orange-500/35 hover:shadow-orange-500/45 transition-all"
            onClick={() => openAuth('register')}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
          >
            Get Started Free <ArrowRight size={18} />
          </motion.button>
          <motion.button 
            className="px-8 py-3.5 text-base font-semibold text-gray-700 bg-white/80 border border-gray-300 rounded-xl hover:bg-white transition-all shadow-sm"
            onClick={() => openAuth('login')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Sign In to Dashboard
          </motion.button>
        </motion.div>

        {/* Stats Highlights */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 font-medium"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            <CheckCircle2 size={18} className="text-green-500" />
            <span>100% Free & Open Source</span>
          </motion.div>
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            <CheckCircle2 size={18} className="text-orange-500" />
            <span>Real-time Category Analytics</span>
          </motion.div>
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            <CheckCircle2 size={18} className="text-indigo-500" />
            <span>Secure JWT Authentication</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Sticky Scroll-Locked App Demo Showcase Track */}
      <section id="preview" className="relative z-10 h-[280vh] mb-8" ref={previewRef}>
        <div className="sticky top-[85px] max-w-5xl mx-auto px-3 sm:px-6">
          <motion.div 
            className="bg-white rounded-2xl border border-orange-500/25 shadow-2xl shadow-orange-500/15 overflow-hidden"
            style={{
              transform: `perspective(1000px) rotateX(${Math.max(0, (0.15 - scrollProgress) * 35)}deg)`
            }}
          >
            
            {/* Mac Browser Bar */}
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              </div>
              <div className="text-xs text-gray-600 bg-white px-3 py-1 rounded-md border border-gray-200 flex items-center font-mono">
                <Lock size={12} className="mr-1 text-green-600" />
                fintraq.onrender.com/dashboard
              </div>

              <div className="hidden sm:flex items-center text-xs font-semibold text-orange-600 bg-orange-100/60 border border-orange-300/40 px-2.5 py-1 rounded-md">
                <MousePointer size={13} className="animate-bounce mr-1" />
                <span>Scroll down to see demo changes ({Math.round(scrollProgress * 100)}%)</span>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              
              {/* Stats Mockup */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200" variants={itemVariants} whileHover={{ y: -3 }}>
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Total Income</span>
                    <TrendingUp size={18} className="text-green-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-green-700 mb-1">₹52,400.00</div>
                  <div className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-green-200/60 text-green-800">+12% this month</div>
                </motion.div>

                <motion.div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-100 border border-red-200" variants={itemVariants} whileHover={{ y: -3 }}>
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Total Expenses</span>
                    <TrendingDown size={18} className="text-red-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-red-700 mb-1">₹18,200.00</div>
                  <div className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-red-200/60 text-red-800">-5% spending</div>
                </motion.div>

                <motion.div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200" variants={itemVariants} whileHover={{ y: -3 }}>
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Net Balance</span>
                    <PieChart size={18} className="text-blue-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-blue-700 mb-1">₹34,200.00</div>
                  <div className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-blue-200/60 text-blue-800">Surplus</div>
                </motion.div>
              </motion.div>

              {/* Scroll Progress Tabs Bar */}
              <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl mb-5">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex-1 relative py-2 px-1 text-center text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                      activeTab === t.id ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {t.label}
                    {activeTab === t.id && (
                      <motion.div 
                        className="absolute bottom-0 left-0 h-0.5 bg-orange-600 w-full rounded-full" 
                        layoutId="activeGlow"
                        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Dynamic Animated Content Panel */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 min-h-[220px]">
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: TRANSACTIONS LIST */}
                  {activeTab === 'transactions' && (
                    <motion.div 
                      key="transactions"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      <motion.div 
                        className="flex flex-col gap-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <div className="grid grid-cols-4 px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          <span>Description</span>
                          <span>Category</span>
                          <span className="hidden sm:inline">Date</span>
                          <span className="text-right">Amount</span>
                        </div>

                        <motion.div className="grid grid-cols-4 items-center p-3 bg-white border border-gray-200 rounded-lg text-sm" variants={itemVariants} whileHover={{ scale: 1.01 }}>
                          <div className="flex items-center gap-2 font-semibold text-gray-800">
                            <span className="w-6 h-6 rounded bg-green-100 text-green-700 flex items-center justify-center text-xs">💼</span>
                            <span>Monthly Salary</span>
                          </div>
                          <span><span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">Salary</span></span>
                          <span className="hidden sm:inline text-xs text-gray-400">2026-08-01</span>
                          <span className="text-right font-bold text-green-600">+₹45,000.00</span>
                        </motion.div>

                        <motion.div className="grid grid-cols-4 items-center p-3 bg-white border border-gray-200 rounded-lg text-sm" variants={itemVariants} whileHover={{ scale: 1.01 }}>
                          <div className="flex items-center gap-2 font-semibold text-gray-800">
                            <span className="w-6 h-6 rounded bg-red-100 text-red-700 flex items-center justify-center text-xs">🛒</span>
                            <span>Organic Groceries</span>
                          </div>
                          <span><span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">Food</span></span>
                          <span className="hidden sm:inline text-xs text-gray-400">2026-08-05</span>
                          <span className="text-right font-bold text-red-600">-₹3,200.00</span>
                        </motion.div>

                        <motion.div className="grid grid-cols-4 items-center p-3 bg-white border border-gray-200 rounded-lg text-sm" variants={itemVariants} whileHover={{ scale: 1.01 }}>
                          <div className="flex items-center gap-2 font-semibold text-gray-800">
                            <span className="w-6 h-6 rounded bg-red-100 text-red-700 flex items-center justify-center text-xs">⚡</span>
                            <span>Electricity Utilities</span>
                          </div>
                          <span><span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">Bills</span></span>
                          <span className="hidden sm:inline text-xs text-gray-400">2026-08-12</span>
                          <span className="text-right font-bold text-red-600">-₹1,450.00</span>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* TAB 2: ADD ENTRY FORM */}
                  {activeTab === 'add' && (
                    <motion.div 
                      key="add"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div className="bg-white p-4 rounded-xl border border-gray-200" whileHover={{ y: -2 }}>
                          <h4 className="flex items-center gap-1.5 text-sm font-bold text-green-700 mb-3">
                            <PlusCircle size={16} /> Add Income
                          </h4>
                          <div className="mb-2">
                            <label className="block text-xs text-gray-500 mb-1">Category</label>
                            <select className="w-full text-xs p-2 border border-gray-300 rounded-md"><option>Salary</option><option>Freelance</option></select>
                          </div>
                          <div className="mb-3">
                            <label className="block text-xs text-gray-500 mb-1">Amount (₹)</label>
                            <input type="text" value="7,500.00" readOnly className="w-full text-xs p-2 border border-gray-300 rounded-md bg-gray-50" />
                          </div>
                          <motion.button className="w-full py-1.5 text-xs font-semibold text-white bg-green-600 rounded-md" whileTap={{ scale: 0.97 }}>Save Income</motion.button>
                        </motion.div>

                        <motion.div className="bg-white p-4 rounded-xl border border-gray-200" whileHover={{ y: -2 }}>
                          <h4 className="flex items-center gap-1.5 text-sm font-bold text-red-700 mb-3">
                            <PlusCircle size={16} /> Add Expense
                          </h4>
                          <div className="mb-2">
                            <label className="block text-xs text-gray-500 mb-1">Category</label>
                            <select className="w-full text-xs p-2 border border-gray-300 rounded-md"><option>Food & Dining</option><option>Utilities</option></select>
                          </div>
                          <div className="mb-3">
                            <label className="block text-xs text-gray-500 mb-1">Amount (₹)</label>
                            <input type="text" value="1,250.00" readOnly className="w-full text-xs p-2 border border-gray-300 rounded-md bg-gray-50" />
                          </div>
                          <motion.button className="w-full py-1.5 text-xs font-semibold text-white bg-red-600 rounded-md" whileTap={{ scale: 0.97 }}>Save Expense</motion.button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 3: CATEGORIES */}
                  {activeTab === 'categories' && (
                    <motion.div 
                      key="categories"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
                        <div>
                          <h4 className="text-xs font-bold text-green-700 mb-2">Income Categories</h4>
                          <div className="flex flex-wrap gap-2">
                            <motion.span className="px-3 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-800 border border-green-200" whileHover={{ scale: 1.08 }}>💼 Salary</motion.span>
                            <motion.span className="px-3 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-800 border border-green-200" whileHover={{ scale: 1.08 }}>💻 Freelance</motion.span>
                            <motion.span className="px-3 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-800 border border-green-200" whileHover={{ scale: 1.08 }}>📈 Investments</motion.span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-red-700 mb-2">Expense Categories</h4>
                          <div className="flex flex-wrap gap-2">
                            <motion.span className="px-3 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-800 border border-red-200" whileHover={{ scale: 1.08 }}>🛒 Groceries</motion.span>
                            <motion.span className="px-3 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-800 border border-red-200" whileHover={{ scale: 1.08 }}>⚡ Utilities</motion.span>
                            <motion.span className="px-3 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-800 border border-red-200" whileHover={{ scale: 1.08 }}>🍽️ Dining</motion.span>
                            <motion.span className="px-3 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-800 border border-red-200" whileHover={{ scale: 1.08 }}>🛍️ Shopping</motion.span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 4: VISUAL CHARTS */}
                  {activeTab === 'charts' && (
                    <motion.div 
                      key="charts"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 bg-white p-4 rounded-xl border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-700 mb-3">Expense Distribution</h4>
                          <div className="space-y-2.5">
                            <div>
                              <span className="text-xs text-gray-600">Groceries (40%)</span>
                              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                                <motion.div className="h-full bg-orange-500 rounded-full" initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ duration: 0.7 }} />
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-600">Housing (35%)</span>
                              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                                <motion.div className="h-full bg-indigo-500 rounded-full" initial={{ width: 0 }} animate={{ width: '35%' }} transition={{ duration: 0.7, delay: 0.1 }} />
                              </div>
                            </div>
                            <div>
                              <span className="text-xs text-gray-600">Utilities (15%)</span>
                              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                                <motion.div className="h-full bg-rose-500 rounded-full" initial={{ width: 0 }} animate={{ width: '15%' }} transition={{ duration: 0.7, delay: 0.2 }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                          <h4 className="text-xs font-semibold text-gray-700 mb-3">Savings Rate</h4>
                          <motion.div 
                            className="w-24 h-24 mx-auto rounded-full bg-[conic-gradient(#10b981_0%_65%,#f3f4f6_65%_100%)] flex items-center justify-center"
                            initial={{ scale: 0.7, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                          >
                            <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center">
                              <span className="text-base font-bold text-gray-800">65%</span>
                              <span className="text-[10px] text-gray-500">Savings</span>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tailwind Grid Features Section */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Everything You Need to Manage Your Wealth</h2>
          <p className="text-base text-gray-600">Designed for simplicity, speed, and complete visual control.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <motion.div className="bg-white/80 backdrop-blur-md p-7 rounded-2xl border border-gray-200/80 shadow-sm" variants={itemVariants} whileHover={{ y: -8, boxShadow: '0 16px 32px -10px rgba(0,0,0,0.1)' }}>
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5">
              <Wallet size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Financial Management</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Effortlessly log income and expense entries with custom dates, notes, and payment tags.</p>
          </motion.div>

          <motion.div className="bg-white/80 backdrop-blur-md p-7 rounded-2xl border border-gray-200/80 shadow-sm" variants={itemVariants} whileHover={{ y: -8, boxShadow: '0 16px 32px -10px rgba(0,0,0,0.1)' }}>
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Visual Charts & Reports</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Interactive pie charts and category breakdowns give you an immediate overview of your spending habits.</p>
          </motion.div>

          <motion.div className="bg-white/80 backdrop-blur-md p-7 rounded-2xl border border-gray-200/80 shadow-sm" variants={itemVariants} whileHover={{ y: -8, boxShadow: '0 16px 32px -10px rgba(0,0,0,0.1)' }}>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
              <Layers size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Category Manager</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Create custom categories suited to your personal lifestyle and budget categories.</p>
          </motion.div>

          <motion.div className="bg-white/80 backdrop-blur-md p-7 rounded-2xl border border-gray-200/80 shadow-sm" id="security" variants={itemVariants} whileHover={{ y: -8, boxShadow: '0 16px 32px -10px rgba(0,0,0,0.1)' }}>
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5">
              <Lock size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure JWT Auth</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Protected user accounts powered by FastAPI backend with auto-token rotation and HttpOnly cookies.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Tailwind CTA Banner */}
      <motion.section 
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-3xl p-10 sm:p-14 text-center text-white shadow-xl shadow-orange-600/30">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">Ready to Take Control of Your Financial Future?</h2>
          <p className="text-base sm:text-lg opacity-90 mb-8">Create your free FinTraQ account in less than 30 seconds.</p>
          <motion.button 
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-orange-600 bg-white rounded-xl shadow-lg hover:bg-orange-50 transition-all"
            onClick={() => openAuth('register')}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Free <Zap size={18} />
          </motion.button>
        </div>
      </motion.section>

      {/* Tailwind Footer */}
      <footer className="relative z-10 bg-white border-t border-gray-200 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <Wallet size={20} className="text-orange-500" />
            <span>FinTraQ</span>
          </div>
          <p>© 2026 FinTraQ. Personal Finance Tracker built with React & FastAPI.</p>
        </div>
      </footer>

      {/* Auth Modal Overlay with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div 
            className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-4" 
            onClick={closeAuth}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="relative w-full max-w-md" 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            >
              <AuthPanel initialMode={authMode} onClose={closeAuth} isModal={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
