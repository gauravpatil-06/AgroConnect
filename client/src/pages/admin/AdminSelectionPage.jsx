import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Sprout, Leaf, ArrowRight, ShieldCheck } from 'lucide-react';

const AdminSelectionPage = () => {
    const navigate = useNavigate();
    const [selectedModule, setSelectedModule] = useState(null);

    const handleModuleClick = (module, path) => {
        setSelectedModule(module);
        sessionStorage.setItem('adminModule', module);
        
        setTimeout(() => {
            navigate(path);
        }, 300);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] dark:bg-[#020617] py-12 px-4 relative overflow-hidden transition-colors duration-500 font-inter">
            
            {/* Background Decorations */}
            <div className="absolute w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] -top-20 -left-20 animate-pulse pointer-events-none" />
            <div className="absolute w-[500px] h-[500px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[100px] -bottom-20 -right-20 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

            <div className="max-w-2xl w-full animate-fade-in relative z-10">
                {/* Glassmorphism Design Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white dark:border-white/10 transition-all duration-500">

                    {/* Header Section */}
                    <div className="mb-8 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#12a347] rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-green-500/30">
                            <Leaf size={32} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 leading-tight">AgroConnect Admin</h2>
                        <p className="text-slate-500 dark:text-gray-400 font-medium text-sm">Select a management module to begin operations.</p>
                    </div>

                    {/* Module Selection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                        {/* Module 1: Consumer */}
                        <div
                            onClick={() => handleModuleClick('consumer', '/admin/dashboard')}
                            className={`group relative p-8 rounded-[2.5rem] cursor-pointer transition-all duration-500 border-2 
                                ${selectedModule === 'consumer'
                                    ? 'border-[#12a347] bg-white dark:bg-slate-800 shadow-xl scale-[1.02]'
                                    : 'border-transparent bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:shadow-2xl hover:-translate-y-1'
                                }`}
                        >
                            <div className="flex flex-col h-full items-center sm:items-start text-center sm:text-left">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 mb-4 
                                    ${selectedModule === 'consumer' ? 'bg-[#12a347] text-white shadow-lg shadow-green-500/20' : 'bg-emerald-50 dark:bg-emerald-900/20 text-[#12a347] group-hover:bg-[#12a347] group-hover:text-white'}`}>
                                    <Users size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Consumer</h3>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-medium">
                                    Manage all consumer accounts, monitor their activities, and oversee their orders and marketplace interactions.
                                </p>
                                <div className={`mt-auto flex items-center gap-2 text-sm font-bold transition-all ${selectedModule === 'consumer' ? 'text-[#12a347]' : 'text-emerald-600 dark:text-emerald-500 group-hover:gap-4'}`}>
                                    <span>Enter Module</span>
                                    <ArrowRight size={18} strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>

                        {/* Module 2: Farmer */}
                        <div
                            onClick={() => handleModuleClick('farmer', '/admin/dashboard')}
                            className={`group relative p-8 rounded-[2.5rem] cursor-pointer transition-all duration-500 border-2 
                                ${selectedModule === 'farmer'
                                    ? 'border-[#12a347] bg-white dark:bg-slate-800 shadow-xl scale-[1.02]'
                                    : 'border-transparent bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:shadow-2xl hover:-translate-y-1'
                                }`}
                        >
                            <div className="flex flex-col h-full items-center sm:items-start text-center sm:text-left">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 mb-4 
                                    ${selectedModule === 'farmer' ? 'bg-[#12a347] text-white shadow-lg shadow-green-500/20' : 'bg-emerald-50 dark:bg-emerald-900/20 text-[#12a347] group-hover:bg-[#12a347] group-hover:text-white'}`}>
                                    <Sprout size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Farmer</h3>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-medium">
                                    Monitor farmer performance, verify product listings, and oversee their agricultural sales and regional metrics.
                                </p>
                                <div className={`mt-auto flex items-center gap-2 text-sm font-bold transition-all ${selectedModule === 'farmer' ? 'text-[#12a347]' : 'text-emerald-600 dark:text-emerald-500 group-hover:gap-4'}`}>
                                    <span>Enter Module</span>
                                    <ArrowRight size={18} strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSelectionPage;
