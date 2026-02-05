"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../redux/slices/authSlice";
import { FaEnvelope, FaLock, FaLeaf, FaSignInAlt } from "react-icons/fa";
import Loader from "../components/Loader";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());

    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/selection");
      } else if (user?.role === "farmer") {
        navigate("/farmer/dashboard");
      } else if (user?.role === "consumer") {
        navigate("/consumer/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [dispatch, isAuthenticated, navigate, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ecfdf5] dark:bg-slate-950 p-4 sm:p-6 transition-colors duration-300">
      <div className="w-full max-w-[1000px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-white dark:border-slate-800">
        
        {/* Left Side - Green Sidebar */}
        <div className="w-full md:w-[45%] bg-[#12a347] p-8 md:p-12 text-white flex flex-col relative overflow-hidden">
          <Link to="/" className="flex items-center space-x-2 mb-12 relative z-10 hover:opacity-80 transition-opacity">
            <FaLeaf className="text-3xl" />
            <span className="text-2xl font-bold tracking-tight">AgroConnect</span>
          </Link>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Welcome Back!</h1>
            <p className="text-green-50/90 text-lg leading-relaxed mb-12">
              Login to access your dashboard and manage your agricultural business
            </p>
          </div>

          <div className="mt-auto relative z-10 w-full rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="/farmer_login_sidebar.png" 
              alt="Farming life" 
              className="w-full h-48 md:h-64 object-cover"
            />
          </div>

          {/* Abstract circles for decoration */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl invisible md:visible"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-[55%] p-8 md:p-14 flex flex-col justify-center relative">
          
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              Sign In
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Enter your credentials to continue
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 group-focus-within:text-[#12a347] transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-11 py-3.5 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:bg-white dark:focus:bg-slate-800"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                Password
              </label>
              <div className="relative group mb-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 group-focus-within:text-[#12a347] transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pl-11 py-3.5 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:bg-white dark:focus:bg-slate-800"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex justify-end pr-1">
                <Link to="/forgot-password" class="text-xs font-bold text-[#12a347] hover:underline transition-colors tracking-wide">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#12a347] hover:bg-[#0e8a3c] text-white py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2 shadow-lg shadow-green-500/20"
            >
              <FaSignInAlt className="text-xl" />
              <span>{loading ? "Signing in..." : "Sign In"}</span>
            </button>

            <div className="text-center mt-12">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#12a347] dark:text-green-400 font-bold hover:underline">
                  Register
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
              <Link to="/" className="text-[#12a347] text-sm font-bold hover:underline transition-colors tracking-wide">
                ← Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
