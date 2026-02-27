"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/slices/userSlice";
import { getAllOrders } from "../../redux/slices/orderSlice";
import { getCategories } from "../../redux/slices/categorySlice";
import { getProducts } from "../../redux/slices/productSlice";
import Loader from "../../components/Loader";
import { 
  FaUsers, 
  FaBox, 
  FaShoppingCart, 
  FaChartLine, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaBan,
  FaArrowRight,
  FaUserFriends,
  FaLayerGroup,
  FaTags
} from "react-icons/fa";
import PageContainer from "../../components/PageContainer";
import { motion } from "framer-motion";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [delayedLoading, setDelayedLoading] = useState(true);
  
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);
  const { adminOrders, loading: ordersLoading } = useSelector((state) => state.orders);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);
  const { products, loading: productsLoading } = useSelector((state) => state.products);

  const adminModule = sessionStorage.getItem('adminModule') || 'farmer';

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllOrders());
    dispatch(getCategories());
    dispatch(getProducts());

    const timer = setTimeout(() => setDelayedLoading(false), 400);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Statistics calculations
  const farmers = users.filter(u => u.role === "farmer");
  const consumers = users.filter(u => u.role === "consumer");
  
  const totalRevenue = adminOrders
    .filter((order) => order.status === "completed")
    .reduce((total, order) => total + order.totalAmount, 0);

  const recentOrders = [...adminOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const orderCounts = {
    pending: adminOrders.filter((o) => o.status === "pending").length,
    completed: adminOrders.filter((o) => o.status === "completed").length,
    rejected: adminOrders.filter((o) => o.status === "rejected").length,
    cancelled: adminOrders.filter((o) => o.status === "cancelled").length,
  };

  const isLoading = usersLoading || ordersLoading || categoriesLoading || productsLoading;

  // Force loader to hide exactly after the delay, regardless of API status
  if (delayedLoading) {
    return <Loader />;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <PageContainer className="pt-8 pb-12">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              Admin {adminModule === 'farmer' ? 'Farmer' : 'Consumer'} Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 font-bold text-lg mt-0">
              Hello, {user?.name}
            </p>
          </div>

        </div>

        {/* Stats Grid - 8 Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: adminModule === 'farmer' ? "Total Farmers" : "Total Consumers", value: adminModule === 'farmer' ? farmers.length : consumers.length, icon: adminModule === 'farmer' ? FaUserFriends : FaUsers, bgClass: "bg-blue-500/10", textClass: "text-blue-500", path: "/admin/users" },
            { label: "Total Categories", value: categories.length, icon: FaLayerGroup, bgClass: "bg-purple-500/10", textClass: "text-purple-500", path: "/admin/categories" },
            { label: adminModule === 'farmer' ? "Total Products" : "Total Orders", value: adminModule === 'farmer' ? products.length : adminOrders.length, icon: adminModule === 'farmer' ? FaBox : FaShoppingCart, bgClass: "bg-orange-500/10", textClass: "text-orange-500", path: adminModule === 'farmer' ? "/admin/products" : "/admin/orders" },
            { label: "Total Revenue", value: `Rs. ${totalRevenue.toFixed(0)}`, icon: FaChartLine, bgClass: "bg-emerald-500/10", textClass: "text-emerald-500", path: "/admin/orders" },
            { label: "Completed Orders", value: orderCounts.completed, icon: FaCheckCircle, bgClass: "bg-emerald-500/10", textClass: "text-emerald-500", path: "/admin/orders" },
            { label: "Pending Orders", value: orderCounts.pending, icon: FaClock, bgClass: "bg-orange-500/10", textClass: "text-orange-500", path: "/admin/orders" },
            { label: "Rejected Orders", value: orderCounts.rejected, icon: FaTimesCircle, bgClass: "bg-rose-500/10", textClass: "text-rose-500", path: "/admin/orders" },
            { label: "Cancelled Orders", value: orderCounts.cancelled, icon: FaBan, bgClass: "bg-rose-500/10", textClass: "text-rose-500", path: "/admin/orders" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.04, translateY: -4 }}
              onClick={() => navigate(stat.path)}
              className="bg-white dark:bg-[#0B1121] border-2 border-slate-100 dark:border-white/5 rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-md transition-all duration-300 h-full hover:border-emerald-500/40 cursor-pointer group"
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${stat.bgClass} flex items-center justify-center ${stat.textClass} shrink-0`}>
                <stat.icon size={18} />
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <p className="text-[12px] sm:text-lg font-bold text-gray-600 dark:text-gray-300 leading-tight whitespace-normal mb-1">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                    {stat.value}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {adminModule === 'consumer' ? (
          /* Recent Orders Section */
          <motion.div variants={itemVariants} className="mt-12 mb-12">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
              <Link to="/admin/orders" className="text-emerald-500 font-bold text-sm hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                View All Orders <FaArrowRight size={12} />
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-[1.2rem] shadow-xl overflow-hidden overflow-x-auto custom-scrollbar transition-colors">
              {recentOrders.length > 0 ? (
                <table className="w-full text-left border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="bg-emerald-500/10 dark:bg-emerald-500/5 border-b-2 border-gray-800/20 dark:border-white/30 text-[11px]">
                      <th className="px-5 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-20">SR NO</th>
                      <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-36">Order ID</th>
                      <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-60">Customer Name</th>
                      <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-60">Product Name</th>
                      <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-32">Quantity</th>
                      <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-44">Date & Time</th>
                      <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-32">Status</th>
                      <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center whitespace-nowrap w-32">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/10 dark:divide-white/20">
                    {recentOrders.map((order, index) => (
                      <tr key={order._id} className="hover:bg-emerald-500/5 transition-colors group">
                        <td className="px-5 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                          <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{String(index + 1).padStart(2, '0')}</span>
                        </td>
                        <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                          <span className="text-sm font-bold text-emerald-500 font-mono uppercase tracking-tighter">
                            #{order._id.substring(0, 8)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                          <span className="text-sm font-bold text-gray-900 dark:text-white capitalize truncate block w-52 mx-auto text-center">{order.consumer?.name?.toLowerCase() || 'Deleted Consumer'}</span>
                        </td>
                        <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                          <span className="text-sm font-bold text-gray-900 dark:text-white capitalize block w-52 mx-auto break-words text-center">
                            {order.items[0]?.product?.name?.toLowerCase() || 'Deleted Product'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                          <span className="text-sm font-bold text-gray-900 dark:text-white capitalize block mx-auto text-center">
                            {order.items.reduce((acc, item) => acc + item.quantity, 0)} {order.items[0]?.product?.unit || 'Kg'}
                            {order.items.length > 1 && ` (+${order.items.length - 1})`}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20 font-mono text-sm text-gray-900 dark:text-white font-bold leading-tight">
                          {new Date(order.createdAt).toLocaleDateString()}<br />
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </td>
                        <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                          <span className={`text-sm font-bold capitalize ${order.status === "pending" ? "text-blue-500" :
                            order.status === "accepted" || order.status === "completed" ? "text-emerald-500" :
                              "text-rose-500"
                            }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-sm font-bold text-emerald-500">
                          Rs.{order.totalAmount.toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center flex flex-col items-center">
                  <FaShoppingCart className="text-emerald-500/20 text-6xl mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-bold text-lg mb-2">No recent orders yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mb-6 max-w-xs mx-auto">Looks like there are no orders in the system.</p>
                  <Link 
                    to="/admin/orders" 
                    className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-500/20 group transform hover:-translate-y-1"
                  >
                    View All Orders <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Recent Products Section */
          <motion.div variants={itemVariants} className="mt-12 mb-12">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Products</h2>
              <Link to="/admin/products" className="text-emerald-500 font-bold text-sm hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                View All Products <FaArrowRight size={12} />
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-[1.2rem] shadow-xl overflow-hidden overflow-x-auto custom-scrollbar transition-colors">
              {recentProducts.length > 0 ? (
                <table className="w-full text-left border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="bg-emerald-500/10 dark:bg-emerald-500/5 border-b-2 border-gray-800/20 dark:border-white/30 text-[11px]">
                      <th className="px-5 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-20">SR NO</th>
                      <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-36">Product ID</th>
                      <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-52">Product Name</th>
                      <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-44">Category</th>
                      <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-32">Price</th>
                      <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-32">Quantity</th>
                      <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-40">Harvest Date</th>
                      <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center w-40">Available Until</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/10 dark:divide-white/20">
                    {recentProducts.map((product, index) => (
                      <tr key={product._id} className="hover:bg-emerald-500/5 transition-colors group">
                        <td className="px-5 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-200 font-mono">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                          <span className="text-sm font-bold text-emerald-500 font-mono uppercase tracking-tighter">
                            #{product._id.substring(0, 8)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                          <span className="text-sm font-bold text-gray-900 dark:text-white capitalize block w-48 mx-auto break-words text-center">
                            {product.name.toLowerCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                          <span className="text-sm font-bold text-gray-900 dark:text-white capitalize block mx-auto underline decoration-emerald-500/30 text-center">
                            {product.category?.name?.toLowerCase() || 'general'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20 font-mono text-sm font-bold text-emerald-500">
                          Rs.{product.price}
                        </td>
                        <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {product.quantityAvailable} {product.unit || 'Kg'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20 font-mono text-sm text-gray-900 dark:text-white font-bold whitespace-nowrap">
                          {product.harvestDate ? new Date(product.harvestDate).toLocaleDateString() : new Date(product.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-sm text-gray-900 dark:text-white font-bold whitespace-nowrap">
                          {product.availableUntil ? new Date(product.availableUntil).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center flex flex-col items-center">
                  <FaBox className="text-emerald-500/20 text-6xl mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-bold text-lg mb-2">No products yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mb-6 max-w-xs mx-auto">Looks like there are no products in the system.</p>
                  <Link 
                    to="/admin/products" 
                    className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-500/20 group transform hover:-translate-y-1"
                  >
                    View All Products <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}


      </motion.div>
    </PageContainer>
  );
};

export default DashboardPage;
