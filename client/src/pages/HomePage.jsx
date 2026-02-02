"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/slices/productSlice";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";

import {
  Sparkles, LogIn, ArrowRight, BookOpen,
  CheckCircle2, Star, Target, Zap, Clock,
  BarChart3, FolderOpen, Flame, Rocket,
  Layers, Layout, LayoutDashboard, Calendar,
  FileText, TrendingUp, ShieldCheck, ZapOff,
  Check, User, Moon, Sun, ChevronRight, Menu, X, Recycle, MapPin, Truck, Leaf, Mail, Globe,
  ShoppingBasket,
  Users
} from 'lucide-react';

import { AboutContent } from './AboutPage';
import PageContainer from '../components/PageContainer';

// Simple Wrapper for Check icon to avoid name collision
const CheckLucide = ({ size, strokeWidth }) => <Check size={size} strokeWidth={strokeWidth} />;

// Fast Animated Counter Component
const AnimatedCounter = ({ target, duration = 1 }) => {
  const [count, setCount] = useState(0);
  const targetStr = String(target);
  const numericValue = parseInt(targetStr.replace(/[^0-9]/g, ''), 10);
  const suffix = targetStr.replace(/[0-9,]/g, '');
  const hasComma = targetStr.includes(',');

  useEffect(() => {
    let startTime;
    let animationFrame;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Use easeOutExo for a "fast then pop" feel
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const currentCount = Math.floor(easeOutQuad * numericValue);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [numericValue, duration]);

  const formatNumber = (num) => {
    if (hasComma) return num.toLocaleString('en-IN') + suffix;
    return num + suffix;
  };

  return <>{formatNumber(count)}</>;
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { products, loading: productLoading } = useSelector((state) => state.products);
  const { farmers, loading: farmerLoading } = useSelector((state) => state.farmers);

  // Local Theme logic
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const isDark = theme === "dark";

  useEffect(() => {
    dispatch(getProducts({ limit: 4 }));
    dispatch(getAllFarmers({ limit: 3 }));
    dispatch(getCategories());
  }, [dispatch]);

  // Sync theme
  useEffect(() => {
    const isDarkGlobal = document.documentElement.classList.contains("dark");
    if (isDarkGlobal) setTheme("dark");
    else setTheme("light");
  }, []);

  // Determine active tab from current route
  const isAbout = location.pathname === '/about';
  const activeTab = isAbout ? 'About' : 'Home';

  // Stats Data for AgroConnect
  const stats = [
    { label: 'Total Farmers', value: '1,200+', icon: <Users /> },
    { label: 'Active Customers', value: '8,450+', icon: <User /> },
    { label: 'Orders Delivered', value: '98%', icon: <CheckCircle2 /> },
    { label: 'Products Listed', value: '5,000+', icon: <ShoppingBasket /> }
  ];

  // Feature Cards for AgroConnect
  const features = [
    {
      icon: <Leaf className="text-emerald-500" />,
      title: "Fresh Inventory",
      desc: "Order farm-fresh produce directly from the source with real-time stock updates."
    },
    {
      icon: <Truck className="text-emerald-500" />,
      title: "Farm Logistics",
      desc: "Direct farm-to-table delivery with optimized routes for minimum carbon footprint."
    },
    {
      icon: <BarChart3 className="text-emerald-500" />,
      title: "Farmer Insights",
      desc: "Farmers get advanced analytics on crop demand and market trends to grow better."
    },
    {
      icon: <Star className="text-emerald-500" />,
      title: "Quality Badges",
      desc: "Earn trust badges for consistent high-quality produce and sustainable farming practices."
    },
    {
      icon: <Target className="text-emerald-500" />,
      title: "Support Locals",
      desc: "Dedicated programs to empower small-scale local farmers with digital tools."
    },
    {
      icon: <Flame className="text-emerald-500" />,
      title: "Eco Awards",
      desc: "Members earn points and exclusive badges for supporting sustainable agricultural practices."
    },
    {
      icon: <Calendar className="text-emerald-500" />,
      title: "Seasonal Guides",
      desc: "Personalized calendars suggesting the best local produce to buy based on the season."
    },
    {
      icon: <ShieldCheck className="text-emerald-500" />,
      title: "Traceable Roots",
      desc: "Scan QR codes to see the exact plot and farmer who grew your food for total transparency."
    }
  ];

  // How It Works Steps for AgroConnect
  const steps = [
    { title: 'Meet Your Farmer', desc: 'Browse verified farmer profiles in your region and discover their unique growing practices.' },
    { title: 'Order Fresh', desc: 'Select from seasonal harvest and place your order safely through our secure digital marketplace.' },
    { title: 'Fresh Delivery', desc: 'Enjoy farm-to-table delivery within 24 hours of harvest, supporting local agriculture directly.' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1121] text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-emerald-500/30 relative font-sans transition-colors duration-500">
      {/* Background Animations */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(#10b981 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="relative z-10">
        {activeTab === 'Home' ? (
          <>
            {/* HERO SECTION */}
            <section className="pt-8 sm:pt-12 pb-4 sm:pb-8">
              <PageContainer className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] sm:text-xs font-bold mb-8 shadow-sm">
                  <Sparkles size={14} />
                  Connecting local farmers and consumers since 2026
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-4 max-w-4xl">
                  Connect Directly with <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 text-[0.85em]">Local Farmers</span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-slate-500 dark:text-slate-400 font-medium mb-6 max-w-2xl leading-relaxed">
                  Get fresh, locally grown produce delivered straight from the farm to your table. Support local agriculture and enjoy seasonal variety harvested just for you.
                </p>

                <div className="space-y-4 mb-10">
                  {[
                    '100% Traceable farm-to-table products',
                    'Empowering local small-scale farmers',
                    'Zero middlemen, maximum fair trade',
                    'Built-in loyalty system for eco-consumers'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 p-0.5 flex items-center justify-center text-white scale-110">
                        <Check size={10} strokeWidth={4} />
                      </div>
                      <span className="text-[11px] sm:text-sm lg:text-base font-semibold">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-row items-center gap-3 sm:gap-6">
                  <button
                    onClick={() => navigate('/products')}
                    className="flex-1 sm:flex-none px-6 sm:px-10 py-3 sm:py-3.5 bg-emerald-600 text-white rounded-xl font-black text-xs sm:text-base shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/20 hover:bg-emerald-700 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    Shop Now
                    <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={() => {
                      navigate('/farmers');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 sm:flex-none px-6 sm:px-10 py-3 sm:py-3.5 bg-transparent border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-xl font-black text-xs sm:text-base hover:bg-emerald-500/5 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    Meet Our Farmers
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="relative hidden md:block"
              >
                <div className="max-w-xl ml-auto relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-3xl overflow-hidden p-6 cursor-default transition-all duration-500"
                  >
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="absolute top-6 right-6 bg-white dark:bg-slate-800 rounded-2xl px-4 py-2 shadow-xl border border-slate-100 dark:border-white/5 flex items-center gap-3 z-20"
                    >
                      <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Leaf size={12} className="text-white fill-white" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-black text-emerald-600">Eco Sustainer 🌿</span>
                    </motion.div>

                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Agro Index (Local)</p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1">
                          <AnimatedCounter target={92} duration={2.5} />
                          <span className="text-[0.6em] font-black text-emerald-500">%</span>
                        </h2>
                        <p className="text-xs font-bold text-slate-500 mt-2">Regional fresh supply increased by 8% this month</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1.5">Efficiency</p>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-[11px] text-white font-black">94</div>
                            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Logistics Optimized</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                          <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1.5">New Harvests</p>
                          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">24 Fresh Listings</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recent Farm Activity</p>
                        {[
                          { name: 'Organic Tomato Harvest', time: '12m ago', role: 'Shipped', color: '#10b981' },
                          { name: 'Hill Farm Berries', time: 'Ongoing', role: 'Processing', color: '#3b82f6' }
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                                <ShoppingBasket size={14} />
                              </div>
                              <div>
                                <p className="text-[11px] font-black text-slate-800 dark:text-slate-100">{item.name}</p>
                                <p className="text-[9px] text-slate-400 font-bold mt-0.5">{item.time}</p>
                              </div>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: item.color }}>{item.role}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Growth in Farming</p>
                          <div className="text-[11px] font-black text-emerald-600 flex items-center gap-1">
                            +12% <TrendingUp size={12} />
                          </div>
                        </div>
                        <div className="flex items-end justify-between gap-2 h-20 px-1">
                          {[40, 55, 38, 70, 85, 95, 100].map((h, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ duration: 1.5, delay: 1 + (i * 0.1), ease: "circOut" }}
                              className="flex-1 rounded-t-lg bg-emerald-500 shadow-lg shadow-emerald-500/20"
                              style={{ opacity: 0.3 + (i * 0.1) }}
                            ></motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="absolute -z-10 -top-16 -right-16 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse"></div>
                  <div className="absolute -z-10 -bottom-16 -left-16 w-72 h-72 bg-teal-500/10 blur-[80px] rounded-full"></div>
                </div>
              </motion.div>
              </PageContainer>
            </section>

            {/* STATS SECTION */}
            <section className="py-8 sm:py-12">
              <PageContainer>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.97 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="p-5 sm:p-6 bg-white dark:bg-[#060B18] rounded-2xl border-2 border-slate-100 dark:border-white/[0.05] shadow-xl dark:shadow-none hover:border-emerald-500/30 hover:scale-105 transition-all duration-500 cursor-default text-left relative overflow-hidden flex flex-col justify-center"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform duration-500`}>
                        {React.cloneElement(stat.icon, { size: 16 })}
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        <AnimatedCounter target={stat.value} duration={2} />
                      </h4>
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 pl-14">
                      {stat.label}
                    </p>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 dark:bg-white/[0.02] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/5 transition-colors duration-700"></div>
                  </motion.div>
                ))}
                </div>
              </PageContainer>
            </section>

            {/* WHY CHOOSE AGROCONNECT */}
            <section className="py-6 sm:py-8 text-center">
              <PageContainer>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10 sm:mb-12"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Why Choose AgroConnect?</h2>
                <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                  A centralized marketplace bridging the gap between those who grow and those who consume through sustainable tech.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.97, borderColor: "#10b981" }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.8 }}
                    className="p-3.5 sm:p-6 bg-white dark:bg-[#060B18] rounded-2xl border-2 border-slate-100 dark:border-white/[0.05] shadow-sm dark:shadow-none text-left hover:border-emerald-500/50 hover:scale-105 transition-all duration-500 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-4 mb-2 sm:mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/10 rounded-lg sm:rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shrink-0">
                        {React.cloneElement(feature.icon, { className: "w-4 h-4 sm:w-5 sm:h-5", strokeWidth: 2.5 })}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">{feature.title}</h3>
                    </div>
                    <p className="text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
              </PageContainer>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-10 sm:py-12 border-t border-slate-100 dark:border-white/5">
              <PageContainer className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-10 sm:mb-12"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Simple 3-Step Freshness</h2>
                  <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                    How we streamline the journey from the soil to your dining table.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative mt-10 sm:mt-12">
                  {steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileTap={{ scale: 0.97, borderColor: "#10b981" }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15, duration: 0.8 }}
                      className="p-6 bg-white dark:bg-[#060B18] rounded-2xl border-2 border-slate-100 dark:border-white/[0.05] shadow-sm dark:shadow-none hover:border-emerald-500/50 hover:scale-105 transition-all duration-500 cursor-pointer group relative overflow-hidden text-left"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-4 mb-3 sm:mb-5">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600 text-sm sm:text-lg font-bold relative z-10 shadow-sm transition-all duration-700 border border-emerald-500/20 overflow-hidden shrink-0">
                          {i + 1}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white relative z-10 tracking-tight transition-colors group-hover:text-emerald-600">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed relative z-10">
                        {step.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </PageContainer>
            </section>

            {/* FEATURED PRODUCTS SECTION */}
            <section className="py-12 bg-white dark:bg-[#0B1121]">
              <PageContainer>
                <div className="flex flex-wrap justify-between items-end gap-3 mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight cursor-default">
                    Featured <span className="text-emerald-600">Harvests</span>
                  </h2>
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Link
                      to="/products"
                      className="text-emerald-600 hover:text-emerald-800 font-bold text-sm md:text-base border-b-2 border-transparent hover:border-emerald-600 transition-all duration-300"
                    >
                      View All Product →
                    </Link>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {productLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                      <Loader />
                    </div>
                  ) : products.length > 0 ? (
                    products
                      .slice(0, 4)
                      .map((product) => (
                        <motion.div 
                          key={product._id} 
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))
                  ) : (
                    <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-white/10">
                      <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Products Available</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">We are preparing fresh harvest for you.</p>
                      <Link to="/products" className="text-emerald-600 font-black hover:underline underline-offset-4">Browse Collection →</Link>
                    </div>
                  )}
                </div>
              </PageContainer>
            </section>

            {/* FARMERS SECTION */}
            <section className="py-12 bg-white dark:bg-[#0B1121]">
              <PageContainer>
                <div className="flex flex-wrap justify-between items-end gap-3 mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight cursor-default">Meet Our <span className="text-emerald-600">Farming Families</span></h2>
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Link
                      to="/farmers"
                      className="text-emerald-600 hover:text-emerald-800 font-bold text-sm md:text-base border-b-2 border-transparent hover:border-emerald-600 transition-all duration-300"
                    >
                      View All Farmers →
                    </Link>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {farmerLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                      <Loader />
                    </div>
                  ) : farmers.length > 0 ? (
                    farmers
                      .slice(0, 3)
                      .map((farmer) => (
                        <motion.div 
                          key={farmer._id} 
                        >
                          <FarmerCard farmer={farmer} />
                        </motion.div>
                      ))
                  ) : (
                    <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-white/10">
                      <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Farmers Yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">Connecting with more local families soon.</p>
                    </div>
                  )}
                </div>
              </PageContainer>
            </section>

            {/* CTA SECTION */}
            <section className="py-6 sm:py-8">
              <PageContainer>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-emerald-600 rounded-3xl p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-600/30 group"
                >
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-[70px] translate-y-1/2 -translate-x-1/2"></div>
                  <div className="relative z-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">Ready to taste the <br />farm-fresh difference?</h2>
                    <p className="text-xs md:text-base text-emerald-50 mb-6 max-w-2xl mx-auto font-medium opacity-90 leading-relaxed">
                      Join AgroConnect today. Support your local farmers while enjoying the healthiest, seasonal produce delivered to your doorstep.
                    </p>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-8 py-3.5 bg-white text-emerald-700 font-bold rounded-xl text-base shadow-xl hover:bg-emerald-50 transition-all hover:scale-105 active:scale-95 shadow-white/10"
                    >
                      Join AgroConnect Now
                    </button>
                  </div>
                </motion.div>
              </PageContainer>
            </section>
          </>
        ) : (
          <AboutContent onBackToHome={() => navigate('/')} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
