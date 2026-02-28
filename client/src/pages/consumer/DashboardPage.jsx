"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getConsumerDashboardStats } from "../../redux/slices/dashboardSlice";
import Loader from "../../components/Loader";
import PageContainer from "../../components/PageContainer";
import { motion } from "framer-motion";
import {
  FaBox,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaComment,
  FaArrowRight,
  FaShoppingBag,
  FaUserFriends,
  FaChartLine,
  FaBan,
  FaShoppingCart,
} from "react-icons/fa";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { stats, loading } = useSelector((state) => state.dashboard);

  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    dispatch(getConsumerDashboardStats());

    // Force hide loader after 0.4s for extra fast feel
    const timer = setTimeout(() => setDelayedLoading(false), 400);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Map data from unified stats object
  const consumerOrders = stats?.orders || [];
  const unreadMessages = stats?.unreadMessagesCount || 0;

  const orderCounts = {
    pending: consumerOrders.filter((order) => order.status === "pending").length,
    completed: consumerOrders.filter((order) => order.status === "completed").length,
    rejected: consumerOrders.filter((order) => order.status === "rejected").length,
    cancelled: consumerOrders.filter((order) => order.status === "cancelled").length,
  };

  const farmerCount = new Set(consumerOrders.map((order) => order.farmer?._id)).size;

  const totalSpent = consumerOrders
    .filter((order) => order.status === "completed")
    .reduce((total, order) => total + order.totalAmount, 0);

  const recentOrders = consumerOrders.slice(0, 5);

  console.log("Consumer Stats received:", stats);
  console.log("Orders found:", consumerOrders.length);

  // Force loader to hide exactly after the delay, regardless of API status
  if (delayedLoading) {
    return <Loader />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <PageContainer className="pt-8 pb-2">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-row justify-between items-center mb-6">
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Consumer Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 font-bold text-lg mt-0">
              Hello, {user?.name}
            </p>
          </motion.div>
        </div>

        {/* Stats Grid - 8 Boxes Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {[
            { label: "Total Orders", value: consumerOrders.length, icon: FaShoppingBag, bgClass: "bg-emerald-500/10", textClass: "text-emerald-500", path: "/orders" },
            { label: "Farmer Count", value: farmerCount, icon: FaUserFriends, bgClass: "bg-blue-500/10", textClass: "text-blue-500", path: "/farmers" },
            { label: "Unread Messages", value: unreadMessages, icon: FaComment, bgClass: "bg-blue-500/10", textClass: "text-blue-500", path: "/messages" },
            { label: "Total Spent", value: `Rs. ${totalSpent.toFixed(0)}`, icon: FaChartLine, bgClass: "bg-emerald-500/10", textClass: "text-emerald-500", path: "/orders" },
            { label: "Completed Orders", value: orderCounts.completed, icon: FaCheckCircle, bgClass: "bg-emerald-500/10", textClass: "text-emerald-500", path: "/orders" },
            { label: "Pending Orders", value: orderCounts.pending, icon: FaClock, bgClass: "bg-orange-500/10", textClass: "text-orange-500", path: "/orders" },
            { label: "Rejected Orders", value: orderCounts.rejected, icon: FaTimesCircle, bgClass: "bg-rose-500/10", textClass: "text-rose-500", path: "/orders" },
            { label: "Cancelled Orders", value: orderCounts.cancelled, icon: FaBan, bgClass: "bg-rose-500/10", textClass: "text-rose-500", path: "/orders" },
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

        {/* Recent Orders Section */}
        <motion.div variants={itemVariants} className="mt-12 mb-12">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
            <Link to="/orders" className="text-emerald-500 font-bold text-sm hover:translate-x-1 transition-transform inline-flex items-center gap-2">
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
                    <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-60">Farmer Name</th>
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
                        <span className="text-sm font-bold text-emerald-500 font-mono uppercase tracking-tighter cursor-pointer" onClick={() => navigate(`/orders/${order._id}`)}>
                          #{order._id.substring(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                        <span className="text-sm font-bold text-gray-900 dark:text-white capitalize truncate block w-52 mx-auto text-center">{order.farmer?.name?.toLowerCase() || 'Deleted Farmer'}</span>
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
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-6 max-w-xs mx-auto">Looks like you haven't placed any orders. Check out our fresh products from local farmers!</p>
                <Link 
                  to="/products" 
                  className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-xl shadow-emerald-500/20 group transform hover:-translate-y-1"
                >
                  Place New Order <FaArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};

export default DashboardPage;
