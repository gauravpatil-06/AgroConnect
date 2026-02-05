"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../redux/slices/authSlice";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaLeaf,
  FaSignInAlt,
} from "react-icons/fa";
import Loader from "../components/Loader";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "consumer",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());

    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user?.role === "farmer") {
        navigate("/farmer/dashboard");
      } else if (user?.role === "consumer") {
        navigate("/consumer/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [dispatch, isAuthenticated, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError("");
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
      address: formData.address,
    };

    dispatch(register(userData));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ecfdf5] dark:bg-slate-950 p-4 sm:p-6 transition-colors duration-300">
      <div className="w-full max-w-[1000px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px] border border-white dark:border-slate-800">
        
        {/* Left Side - Green Sidebar */}
        <div className="w-full md:w-[40%] bg-[#12a347] p-8 md:p-12 text-white flex flex-col relative overflow-hidden">
          <Link to="/" className="flex items-center space-x-2 mb-12 relative z-10 hover:opacity-80 transition-opacity">
            <FaLeaf className="text-3xl" />
            <span className="text-2xl font-bold tracking-tight">AgroConnect</span>
          </Link>

          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-6 leading-tight">Join Our Community!</h1>
            <p className="text-green-50/90 text-base leading-relaxed mb-12">
              Start your journey today and connect directly with the agricultural market.
            </p>
          </div>

          <div className="mt-auto relative z-10 w-full rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="/farmer_login_sidebar.png" 
              alt="Farming life" 
              className="w-full h-40 md:h-56 object-cover"
            />
          </div>

          {/* Abstract circles for decoration */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl invisible md:visible"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full md:w-[60%] p-8 md:p-12 overflow-y-auto max-h-[90vh] md:max-h-full scrollbar-thin scrollbar-thumb-gray-200">
          
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Register to get started</p>
          </div>

          {(error || passwordError) && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-fade-in">
              {error || passwordError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#12a347] transition-colors">
                  <FaUser />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input pl-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl cursor-pointer"
                required
              >
                <option value="consumer">Consumer</option>
                <option value="farmer">Farmer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Phone</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#12a347] transition-colors">
                  <FaPhone />
                </div>
                <input
                  name="phone"
                  type="tel"
                  required={formData.role === "farmer"}
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input pl-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Location</label>
              <div className="space-y-3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#12a347] transition-colors">
                    <FaMapMarkerAlt />
                  </div>
                  <input
                    name="address.street"
                    type="text"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="form-input pl-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                    placeholder="Street Address"
                  />
                </div>
                <div className="flex space-x-3">
                  <input
                    name="address.city"
                    type="text"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="form-input bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                    placeholder="City"
                  />
                  <input
                    name="address.state"
                    type="text"
                    value={formData.address.state}
                    onChange={handleChange}
                    className="form-input bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                    placeholder="State"
                  />
                  <input
                    name="address.zipCode"
                    type="text"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    className="form-input bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl w-24 md:w-32"
                    placeholder="ZIP"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#12a347] transition-colors">
                  <FaEnvelope />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input pl-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#12a347] transition-colors">
                    <FaLock />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength="6"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input pl-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#12a347] transition-colors">
                    <FaLock />
                  </div>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    minLength="6"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input pl-11 bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 rounded-xl"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#12a347] hover:bg-[#0e8a3c] text-white py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2 shadow-lg shadow-green-500/20"
              >
                <FaSignInAlt className="text-xl rotate-0" />
                <span>{loading ? "Registering..." : "Register"}</span>
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                Already have an account?{" "}
                <Link to="/login" className="text-[#12a347] dark:text-green-400 font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-slate-800 text-center">
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

export default RegisterPage;
