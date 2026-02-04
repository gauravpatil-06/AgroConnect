import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Leaf, Zap, Target, BarChart3, Flame,
    MapPin, Truck, History, ListTodo,
    CheckCircle2, ChevronDown, ChevronRight,
    Globe, Sparkles, Rocket, ShieldCheck,
    Clock, Star, Heart, 
    ArrowLeft, Mail, Shield, ShoppingBasket, Users,
    Recycle, UserCheck, ShieldAlert, Cpu, Award, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';

const cardBaseStyle = {
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, border-color 0.4s ease',
};

const HoverCard = ({ children, className, style, delay, rKey }) => {
    return (
        <motion.div
            key={rKey}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ 
                scale: 1.05, 
                y: -10,
                borderColor: 'rgba(16, 185, 129, 0.5)',
                boxShadow: '0 20px 40px -8px rgba(16, 185, 129, 0.18), 0 8px 16px -4px rgba(16, 185, 129, 0.1)',
                transition: { type: "spring", stiffness: 300, damping: 15 }
            }}
            whileTap={{ scale: 1.08 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
            className={className}
            style={{
                ...cardBaseStyle,
                ...style,
            }}
        >
            {children}
        </motion.div>
    );
};

const FAQItem = ({ question, answer, isOpen, onClick, i }) => (
    <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.05 }}
        className="border-2 border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden mb-3 bg-white dark:bg-slate-900 transition-all duration-300 hover:border-emerald-500/40"
    >
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between px-5 py-[10px] text-left focus:outline-none"
        >
            <span className={`text-[11px] sm:text-[1.2rem] font-bold transition-colors tracking-tight ${isOpen ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                {question}
            </span>
            <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`${isOpen ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}
            >
                <ChevronDown size={14} />
            </motion.div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="px-5 pb-4 text-[9px] sm:text-[1rem] text-slate-600 dark:text-slate-400 font-medium leading-relaxed border-t border-slate-50 dark:border-slate-800/50 pt-3">
                        {answer}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

export const AboutContent = ({ onBackToHome }) => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const howItWorks = [
        { title: "Farmer Hub Registration", icon: UserCheck, points: ["Professional verification workflow where farmers can securely register their identity and agricultural background.", "Ability for farmers to set up their individual farm profile, showcasing their cultivation techniques and location details."] },
        { title: "Smart Inventory Listing", icon: ListTodo, points: ["Dynamic product management system allowing farmers to add items with custom descriptions, multi-unit pricing, and category tagging.", "Real-time sync between listed stocks and availability to avoid any order discrepancy for the consumer."] },
        { title: "Direct Choice & Order", icon: ShoppingBasket, points: ["Consumer-centric marketplace experience with advanced search filters for various agricultural produce categories.", "Seamless checkout flow where buyers can place multiple item orders directly from their favorite verified farmers."] },
        { title: "Transparent Order Life", icon: History, points: ["End-to-end order status tracking system (Pending, Shipped, Delivered) reflecting for both the farmer and the consumer in real-time.", "Digitally maintained transaction history for absolute accountability and direct communication during the delivery cycle."] }
    ];

    const modules = [
        { title: "Farmer Ecosystem", icon: Users, points: ["Integrated dashboard for farmers to track sales, manage inventory, and monitor specific buyer feedback for every successful crop batch.", "Tools to update daily pricing based on market trends and manage incoming regional orders with high efficiency."] },
        { title: "Consumer Marketplace", icon: ShoppingBasket, points: ["A dedicated 'Consumer Portal' for discovering nearby harvests, managing a secure profile, and tracking delivery history through a single unified dashboard.", "Interactive farmer profiles allowing users to learn about the origin and the growing practices behind their food."] },
        { title: "Admin Management", icon: ShieldCheck, points: ["Centralized administration portal for verifying new farmers, monitoring overall system security, and managing agricultural categories.", "High-level overview of platform statistics including total users, regional sales volume, and system-wide inventory health."] }
    ];

    const systemWorking = [
        { title: "MERN Stack Backbone", icon: Clock, points: ["Built on a high-performance MERN architecture (MongoDB, Express, React, Node) ensuring rapid data processing and low-latency user interactions across all modules.", "Utilizing persistent state management to keep user sessions and carts synchronized throughout the platform experience."] },
        { title: "Encryption & Security", icon: Shield, points: ["Enterprise-grade JWT (JSON Web Token) authentication for secure logins and encrypted password hashing to protect sensitive user information at all times.", "Multi-layer security protocols verifying user roles to ensure farmers, consumers, and admins only access their authorized workspaces."] },
        { title: "Traceable Supply Chain", icon: MapPin, points: ["Location-based mapping that bridges the gap between urban kitchens and rural farmsteads, providing 100% transparency on where every harvest originates.", "A systematic bridge that reduces the traditional middleman layers, returning fair profits to the farmers and fresher food to consumers."] },
        { title: "Real-time Analytics", icon: BarChart3, points: ["Sophisticated data tracking for farmers to understand crop demand and for admins to monitor the overall pulse of regional agricultural trade.", "Automated earnings generation and reporting for farmers to manage their agricultural business with data-driven insights."] }
    ];

    const faqs = [
        { q: "What is the core mission of AgroConnect?", a: "Our mission is to create a transparent, direct bridge between hard-working farmers and conscious consumers using modern technology. We aim to eliminate traditional middleman barriers and ensure every family has access to the most fresh, natural nutrition directly from the source." },
        { q: "How does the project ensure secure transactions?", a: "AgroConnect implements modern MERN-based security standards including JWT authentication and encrypted data paths. Every order is documented in our secure database, ensuring both farmers and consumers have a verifiable record of their farm-to-table trade." },
        { q: "Can farmers manage their own prices on the platform?", a: "Yes. Our 'Farmer Module' empowers farmers to set their own fair market prices per unit. This ensures they receive the profit they truly deserve for their hard work, with zero middleman markups affecting their core earnings." },
        { q: "Is there a way for consumers to verify the source?", a: "Absolutely. Every product listing is linked to a verified farmer profile. Consumers can view the farmer's background, location, and specific harvest details to ensure they are supporting legitimate local farming families." }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0B1121] text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-emerald-500/30 relative font-sans transition-colors duration-500">
            {/* Background Animations - SYNCED WITH HOME */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.01]" style={{ backgroundImage: 'radial-gradient(#10b981 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="relative z-10 pt-4 sm:pt-6 pb-8 sm:pb-12 max-w-[1440px] mx-auto font-sans">
                <PageContainer>
                    {/* Back Button */}
                    <motion.button
                        onClick={onBackToHome}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-lg hover:gap-4 transition-all group mb-6"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </motion.button>

                    {/* HERO SECTION */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-100 dark:border-white/5 hover:border-emerald-500/50 transition-all duration-500 group"
                    >
                        <div className="px-8 py-10 md:py-16 relative flex flex-col md:flex-row md:items-center gap-10 md:gap-20">
                            <div className="shrink-0 relative z-10 flex justify-center items-center md:ml-10">
                                <div className="w-16 h-16 sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] rounded-full flex items-center justify-center overflow-hidden bg-emerald-500/10 border-4 border-emerald-500/20 group-hover:scale-105 transition-transform duration-500">
                                    <Leaf className="w-8 h-8 sm:w-2/3 sm:h-2/3 text-emerald-600" strokeWidth={2.5} />
                                </div>
                            </div>

                            <div className="space-y-5 flex-1 text-center md:text-left">
                                <h1 className="text-xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-4">
                                    <span className="text-emerald-600">AgroConnect </span>
                                    <span className="text-slate-800 dark:text-slate-200">is the digital bridge between our soil and your dining table.</span>
                                </h1>
                                <p className="text-sm sm:text-base lg:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">A specialized agricultural workspace built using the MERN stack to empower local farming communities directly.</p>

                                <div className="space-y-2 max-w-3xl mt-4 mx-auto md:mx-0">
                                    {[
                                        "Professional MERN-based workspace for farmers and conscious consumers.",
                                        "Verified farmer profiles ensured by centralized administration oversight.",
                                        "Traceable order lifecycle from initial listing to final doorstep delivery.",
                                        "Secure digital platform protecting the interests of every participant."
                                    ].map((text, idx) => (
                                        <div key={idx} className="relative pl-7 flex items-start">
                                            <div className="absolute left-0 top-[4px] flex items-center justify-center">
                                                <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                    <ChevronRight size={10} className="text-emerald-600" strokeWidth={5} />
                                                </div>
                                            </div>
                                            <p className="text-[9px] sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-bold leading-snug text-left">
                                                {text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* HOW IT WORKS */}
                    <div className="space-y-4 pt-12 sm:pt-20">
                        <div className="flex items-center gap-4 border-b-2 border-slate-100 dark:border-white/5 pb-4">
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                                <Rocket size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">How It Works</h2>
                                <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400 font-medium">Step-by-step agricultural trade workflow of our platform.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                            {howItWorks.map((section, i) => (
                                <HoverCard key={section.title} rKey={`how-${section.title}`} delay={0.1 + (i % 4) * 0.05} className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-6 shadow-xl border-2 border-slate-100 dark:border-white/5 flex flex-col items-start gap-2 sm:gap-3">
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-500/10">
                                            <section.icon size={16} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">{section.title}</h3>
                                    </div>
                                    <div className="space-y-1.5 sm:space-y-3 w-full text-left">
                                        {section.points.map((point, pIdx) => (
                                            <div key={pIdx} className="flex items-start gap-2">
                                                <div className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 shrink-0"></div>
                                                <p className="text-[8px] sm:text-xs md:text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{point}</p>
                                            </div>
                                        ))}
                                    </div>
                                </HoverCard>
                            ))}
                        </div>
                    </div>

                    {/* PROJECT MODULES */}
                    <div className="space-y-4 pt-12 sm:pt-20">
                        <div className="flex items-center gap-4 border-b-2 border-slate-100 dark:border-white/5 pb-4">
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                                <Layers size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Project Modules</h2>
                                <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400 font-medium">Core functional units built with specialized React components.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                            {modules.map((section, i) => (
                                <HoverCard key={section.title} rKey={`mod-${section.title}`} delay={0.1 + (i % 3) * 0.05} className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-6 shadow-xl border-2 border-slate-100 dark:border-white/5 flex flex-col items-start gap-2 sm:gap-3">
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-500/10">
                                            <section.icon size={16} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">{section.title}</h3>
                                    </div>
                                    <div className="space-y-1.5 sm:space-y-3 w-full text-left">
                                        {section.points.map((point, pIdx) => (
                                            <div key={pIdx} className="flex items-start gap-2">
                                                <div className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 shrink-0"></div>
                                                <p className="text-[8px] sm:text-xs md:text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{point}</p>
                                            </div>
                                        ))}
                                    </div>
                                </HoverCard>
                            ))}
                        </div>
                    </div>

                    {/* SYSTEM CORE */}
                    <div className="space-y-4 pt-12 sm:pt-20">
                        <div className="flex items-center gap-4 border-b-2 border-slate-100 dark:border-white/5 pb-4">
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                                <Cpu size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">System Core & Technology</h2>
                                <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400 font-medium">The architectural logic powering the AgroConnect project.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                            {systemWorking.map((feature, i) => (
                                <HoverCard key={feature.title} rKey={`sys-${feature.title}`} delay={0.2 + (i % 4) * 0.05} className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-6 shadow-xl border-2 border-slate-100 dark:border-white/5 flex flex-col items-start gap-2 sm:gap-3">
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                            <feature.icon size={16} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">{feature.title}</h3>
                                    </div>
                                    <div className="space-y-1.5 w-full text-left">
                                        {feature.points.map((point, pIdx) => (
                                            <div key={pIdx} className="flex items-start gap-2">
                                                <div className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 shrink-0"></div>
                                                <p className="text-[8px] sm:text-xs md:text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{point}</p>
                                            </div>
                                        ))}
                                    </div>
                                </HoverCard>
                            ))}
                        </div>
                    </div>

                    {/* FAQ SECTION */}
                    <div className="space-y-4 pt-12 sm:pt-20 mx-auto">
                        <div className="flex items-center gap-4 border-b-2 border-slate-100 dark:border-white/5 pb-6">
                            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                                <ListTodo size={20} strokeWidth={2.5} />
                            </div>
                            <div className="text-left">
                                <h2 className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Project FAQ</h2>
                                <p className="text-xs sm:text-base text-slate-500 dark:text-slate-400 font-medium">Common technical and operational queries about the ecosystem.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 pt-6">
                            {faqs.map((faq, i) => (
                                <FAQItem key={i} i={i} question={faq.q} answer={faq.a} isOpen={openFAQ === i} onClick={() => setOpenFAQ(openFAQ === i ? null : i)} />
                            ))}
                        </div>
                    </div>
                </PageContainer>
            </div>
        </div>
    );
};

const AboutPage = () => {
    const navigate = useNavigate();
    return <AboutContent onBackToHome={() => navigate('/')} />;
};

export default AboutPage;
