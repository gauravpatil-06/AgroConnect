"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { logout } from "../redux/slices/authSlice";
import {
  FaLeaf,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaEnvelope,
  FaBox,
  FaUsers,
  FaLayerGroup,
} from "react-icons/fa";
import { AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  // Persist theme to localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminSelection = location.pathname === "/admin/selection";
  const adminModule = sessionStorage.getItem('adminModule') || 'farmer';

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  // Synchronize theme with HTML class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    dispatch(logout());
    setIsLogoutModalOpen(false);
    navigate("/home");
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-[12px] md:px-[20px] py-3">
        <div className="flex justify-between items-center">
          <Link to="/home" className="flex items-center space-x-2">
            <FaLeaf className="text-emerald-500 text-2xl" />
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">AgroConnect</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {!isAdminSelection && [
              { name: "Home", path: "/home" },
              { name: "Products", path: "/products" },
              { name: "Farmers", path: "/farmers" },
              { name: "About", path: "/about" },
            ].map((nav) => (
              <motion.div 
                key={nav.path}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Link
                  to={nav.path}
                  className={`text-[13px] font-bold transition-colors duration-300 pb-1 ${
                    location.pathname === nav.path
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-emerald-500"
                  }`}
                >
                  {nav.name}
                  {location.pathname === nav.path && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute left-0 right-0 bottom-[-4px] h-[3px] bg-emerald-500 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
            {isAuthenticated && user?.role === "consumer" && !isAdminSelection && (
              <Link to="/checkout" className="relative">
                <FaShoppingCart className="text-gray-700 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 text-xl transition-colors" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            {/* Theme Toggle - Transparent Icon Style */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors cursor-pointer"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "light" ? (
                  <motion.div
                    key="sun"
                    initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.5, rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaMoon size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.5, rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaSun size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors focus:outline-none"
                >
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage.startsWith('data:image') || user.profileImage.startsWith('http') ? user.profileImage : `${import.meta.env.VITE_BACKEND_URL}${user.profileImage}`} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                    />
                  ) : (
                    <FaUser className="text-xl" />
                  )}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {user?.name?.split(" ")[0]}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-2xl py-2 z-[100] animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-3 border-b dark:border-slate-700 mb-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account</p>
                      <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user?.name}</p>
                    </div>

                    {[
                      { 
                        name: user?.role === "admin" ? `Admin ${adminModule === 'farmer' ? 'Farmer' : 'Consumer'} Dashboard` : user?.role === "farmer" ? "Farmer Dashboard" : "Consumer Dashboard", 
                        path: user?.role === "admin" ? "/admin/dashboard" : user?.role === "farmer" ? "/farmer/dashboard" : "/consumer/dashboard", 
                        icon: user?.role === "consumer" ? <FaUser className="text-emerald-500" /> : <FaLeaf className="text-emerald-500" />,
                        show: !isAdminSelection
                      },
                      { 
                        name: "Manage Consumers", 
                        path: "/admin/users", 
                        icon: <FaUsers className="text-emerald-500" />,
                        show: user?.role === "admin" && adminModule === 'consumer' && !isAdminSelection
                      },
                      { 
                        name: "Manage Farmers", 
                        path: "/admin/users", 
                        icon: <FaUsers className="text-emerald-500" />,
                        show: user?.role === "admin" && adminModule === 'farmer' && !isAdminSelection
                      },
                      { 
                        name: "Manage Products", 
                        path: "/admin/products", 
                        icon: <FaBox className="text-emerald-500" />,
                        show: user?.role === "admin" && adminModule === 'farmer' && !isAdminSelection
                      },
                      { 
                        name: "Manage Categories", 
                        path: "/admin/categories", 
                        icon: <FaLayerGroup className="text-emerald-500" />,
                        show: user?.role === "admin" && adminModule === 'farmer' && !isAdminSelection && false // HIDDEN: User requested removal
                      },
                      { 
                        name: "Manage Orders", 
                        path: user?.role === "admin" ? "/admin/orders" : (user?.role === "farmer" ? "/farmer/orders" : "/orders"), 
                        icon: <FaShoppingCart className="text-emerald-500" />,
                        show: !isAdminSelection && !(user?.role === "admin" && adminModule === 'farmer')
                      },
                      { 
                        name: "Manage Products", 
                        path: "/farmer/products", 
                        icon: <FaBox className="text-emerald-500" />,
                        show: user?.role === "farmer" && !isAdminSelection
                      },
                      { 
                        name: "Messages", 
                        path: "/messages", 
                        icon: <FaEnvelope className="text-emerald-500" />,
                        show: user?.role !== "admin" && !isAdminSelection
                      },
                      { 
                        name: "Profile", 
                        path: "/profile", 
                        icon: <FaUser className="text-emerald-500" />,
                        show: user?.role !== "admin" && !isAdminSelection
                      },
                    ].filter(item => item.show).map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 transition-all font-bold"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="font-semibold">{item.name}</span>
                      </Link>
                    ))}

                    <div className="border-t dark:border-slate-700 mt-1 pt-1">
                      <button
                        onClick={() => {
                          handleLogoutClick();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center space-x-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-all font-semibold"
                      >
                        <FaSignOutAlt className="text-rose-500 text-base" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-all shadow-md font-medium"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-3">
            {/* Theme Toggle - Mobile Transparent Icon Style */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-emerald-400 cursor-pointer"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "light" ? (
                  <motion.div
                    key="moon-mob"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                  >
                    <FaMoon size={16} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun-mob"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                  >
                    <FaSun size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-emerald-500 focus:outline-none p-2"
            >
              {isMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Side Drawer */}
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden"
              onClick={toggleMenu}
            />
            
            <div 
              className="fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden translate-x-0"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold text-emerald-600">Menu</span>
                  <button 
                    onClick={toggleMenu}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                
                <div className="flex flex-col space-y-5">
                  <Link
                    to="/home"
                    className="text-gray-700 hover:text-emerald-500 font-medium text-sm transition-colors"
                    onClick={toggleMenu}
                  >
                    Home
                  </Link>
                  <Link
                    to="/products"
                    className="text-gray-700 hover:text-emerald-500 font-medium text-sm transition-colors"
                    onClick={toggleMenu}
                  >
                    Products
                  </Link>
                  <Link
                    to="/farmers"
                    className="text-gray-700 hover:text-emerald-500 font-medium text-sm transition-colors"
                    onClick={toggleMenu}
                  >
                    Farmers
                  </Link>
                  <Link
                    to="/about"
                    className="text-gray-700 hover:text-emerald-500 font-medium text-sm transition-colors"
                    onClick={toggleMenu}
                  >
                    About
                  </Link>

                  {isAuthenticated && user?.role === "consumer" && (
                    <Link
                      to="/checkout"
                      className="flex items-center space-x-2 text-gray-700 hover:text-emerald-500 font-medium transition-colors"
                      onClick={toggleMenu}
                    >
                      <FaShoppingCart />
                      <span>Cart ({cartItems.length})</span>
                    </Link>
                  )}
                  
                  <div className="mt-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {isAuthenticated ? (
                      <>
                        {user?.role === "admin" && (
                          <Link
                            to="/admin/dashboard"
                            className="block py-2 text-gray-700 hover:bg-emerald-50 text-emerald-600 font-medium"
                            onClick={toggleMenu}
                          >
                            Admin Dashboard
                          </Link>
                        )}

                        {user?.role === "farmer" && (
                          <Link
                            to="/farmer/dashboard"
                            className="block py-2 text-gray-700 hover:bg-emerald-50 text-emerald-600 font-medium"
                            onClick={toggleMenu}
                          >
                            Farmer Dashboard
                          </Link>
                        )}

                        {user?.role !== "admin" && (
                          <Link
                            to="/profile"
                            className="block py-2 text-gray-700 hover:bg-emerald-50 text-emerald-600 font-medium"
                            onClick={toggleMenu}
                          >
                            Profile
                          </Link>
                        )}

                        {user?.role === "admin" && (
                          <Link
                            to="/admin/orders"
                            className="block py-2 text-gray-700 hover:bg-emerald-50 text-emerald-600 font-medium"
                            onClick={toggleMenu}
                          >
                            Manage Orders
                          </Link>
                        )}

                        {user?.role === "farmer" && (
                          <Link
                            to="/farmer/orders"
                            className="block py-2 text-gray-700 hover:bg-emerald-50 text-emerald-600 font-medium"
                            onClick={toggleMenu}
                          >
                            Manage Orders
                          </Link>
                        )}

                        {user?.role === "consumer" && (
                          <>
                            <Link
                              to="/consumer/dashboard"
                              className="block py-2 text-gray-700 hover:bg-emerald-50 text-emerald-600 font-medium"
                              onClick={toggleMenu}
                            >
                              Consumer Dashboard
                            </Link>
                            <Link
                              to="/orders"
                              className="block py-2 text-gray-700 hover:bg-emerald-50 text-emerald-600 font-medium"
                              onClick={toggleMenu}
                            >
                              My Orders
                            </Link>
                          </>
                        )}

                        {user?.role !== "admin" && (
                          <Link
                            to="/messages"
                            className="block py-2 text-gray-700 hover:bg-emerald-50 text-emerald-600 font-medium"
                            onClick={toggleMenu}
                          >
                            Messages
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            handleLogoutClick();
                            toggleMenu();
                          }}
                          className="flex items-center space-x-2 text-red-500 hover:text-red-600 font-medium pt-4 mt-2"
                        >
                          <FaSignOutAlt />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors text-center block font-bold"
                        onClick={toggleMenu}
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-[320px] w-full overflow-hidden"
            >
              <div className="p-6 text-center border-b border-gray-100 dark:border-slate-700">
                <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSignOutAlt className="text-rose-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Logout</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to log out of your account?</p>
              </div>
              <div className="flex p-3 gap-2 bg-gray-50 dark:bg-slate-900/50">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-xs bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all border border-gray-200 dark:border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2.5 text-xs bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all shadow-md shadow-rose-200 dark:shadow-none cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
