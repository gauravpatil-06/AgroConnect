import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Leaf, Recycle, Globe, Zap, ChevronRight,
  ShoppingBasket, Users, ShieldCheck, Mail, Phone, MapPin
} from 'lucide-react';
import PageContainer from './PageContainer';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-16 pb-8 border-t border-slate-200 dark:border-white/5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-all duration-700 relative z-10 overflow-hidden font-sans">
      <PageContainer>
        {/* Centered Brand Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="flex items-center gap-3 mb-6 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:rotate-12 transition-transform duration-500">
              <Leaf className="text-white w-6 h-6" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black tracking-tighter transition-colors">AgroConnect</h2>
          </div>
          <p className="max-w-xl text-[10px] sm:text-base text-slate-400 dark:text-slate-500 font-bold leading-relaxed">
            Connecting local farmers with consumers for fresh, sustainable, and 100% traceable produce. Building a transparent bridge from our soil to your dining table.
          </p>
        </motion.div>

        <div className="h-[1px] w-full bg-slate-100/10 dark:bg-slate-900/10 mb-12"></div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-12 text-left">
          {/* Farmer Module */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-[10px] md:text-sm lg:text-base font-black mb-6 uppercase tracking-widest text-emerald-500">Farmer Module</h4>
            <ul className="space-y-3">
              {[
                { name: 'Farmer Login', path: '/login' },
                { name: 'List Products', path: '/farmer/dashboard' },
                { name: 'Order History', path: '/farmer/dashboard' },
                { name: 'Earnings Report', path: '/farmer/dashboard' },
                { name: 'Help Center', path: '/about' }
              ].map((item) => (
                <li key={item.name}>
                  <button
                    className="text-[8px] sm:text-base text-slate-400 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-600 font-bold transition-all flex items-center gap-2 group hover:translate-x-1"
                    onClick={() => navigate(item.path)}
                  >
                    <ChevronRight size={10} className="text-emerald-500 opacity-50 group-hover:opacity-100 transition-all" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Consumer Portal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-[10px] md:text-sm lg:text-base font-black mb-6 uppercase tracking-widest text-emerald-500">Consumer Hub</h4>
            <ul className="space-y-3">
              {[
                { name: 'Browse Harvest', path: '/products' },
                { name: 'My Cart', path: '/cart' },
                { name: 'Order Tracking', path: '/citizen/dashboard' },
                { name: 'Farmer Network', path: '/farmers' },
                { name: 'Eco Score', path: '/profile' }
              ].map((item) => (
                <li key={item.name}>
                  <button
                    className="text-[8px] sm:text-base text-slate-400 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-600 font-bold transition-all flex items-center gap-2 group hover:translate-x-1"
                    onClick={() => navigate(item.path)}
                  >
                    <ChevronRight size={10} className="text-emerald-500 opacity-50 group-hover:opacity-100 transition-all" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-[10px] md:text-sm lg:text-base font-black mb-6 uppercase tracking-widest text-emerald-500">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Products', path: '/products' },
                { name: 'Farmers', path: '/farmers' },
                { name: 'About Mission', path: '/about' },
                { name: 'Contact Us', path: '/about' }
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[8px] sm:text-base text-slate-400 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-600 font-bold transition-all flex items-center gap-2 group hover:translate-x-1"
                  >
                    <ChevronRight size={10} className="text-emerald-500 opacity-50 group-hover:opacity-100 transition-all" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <h4 className="text-[10px] md:text-sm lg:text-base font-black mb-6 uppercase tracking-widest text-emerald-500">Reach Us</h4>
            <ul className="space-y-5">
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <MapPin size={16} />
                </div>
                <span className="text-[8px] sm:text-base text-slate-400 dark:text-slate-600 font-bold leading-tight">Muktainagar, Jalgaon, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <Phone size={16} />
                </div>
                <span className="text-[8px] sm:text-base text-slate-400 dark:text-slate-600 font-bold tracking-wider">7875335539</span>
              </li>
              <li className="flex items-center gap-4 group cursor-pointer">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-emerald-500/10">
                  <Mail size={16} />
                </div>
                <span className="text-[8px] sm:text-base text-slate-400 dark:text-slate-600 font-bold truncate">gauravpatil@gmail.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="h-[1px] w-full bg-slate-100/10 dark:bg-slate-900/10 mb-8"></div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-slate-500 dark:text-slate-400 font-bold text-[9px] sm:text-sm tracking-wide">
            © {currentYear} AgroConnect Platform. All rights reserved.
          </p>
        </motion.div>
      </PageContainer>
    </footer>
  );
};

export default Footer;
