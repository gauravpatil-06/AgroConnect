"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../../redux/slices/orderSlice";
import Loader from "../../components/Loader";
import { FaSearch, FaFilter, FaShoppingCart, FaArrowRight, FaCalendarAlt, FaTrash } from "react-icons/fa";
import PageContainer from "../../components/PageContainer";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminOrders, loading } = useSelector((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [delayedLoading, setDelayedLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    dispatch(getAllOrders());
    const timer = setTimeout(() => setDelayedLoading(false), 400);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (adminOrders) {
      let filtered = [...adminOrders];
      if (filter !== "all") {
        filtered = filtered.filter((order) => order.status === filter);
      }
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (order) =>
            order._id.toLowerCase().includes(lowerSearch) ||
            order.consumer?.name?.toLowerCase().includes(lowerSearch) ||
            order.farmer?.name?.toLowerCase().includes(lowerSearch)
        );
      }
      setFilteredOrders(filtered);
    }
  }, [adminOrders, filter, searchTerm]);

  const handleDelete = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      dispatch(deleteOrder(orderToDelete._id));
      setShowDeleteModal(false);
      setOrderToDelete(null);
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  const adminModule = sessionStorage.getItem('adminModule') || 'farmer';

  if ((loading && adminOrders.length === 0) || delayedLoading) {
    return <Loader />;
  }

  return (
    <PageContainer className="pt-8 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className=""
      >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {adminModule === 'farmer' ? 'Manage Farmer Orders' : 'Manage Consumer Orders'}
          </h1>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-6">
        <div className="relative w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Customer, or Product..."
            className="form-input pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
        </div>
        
        <div className="flex gap-2 w-full overflow-x-auto pb-2 custom-scrollbar">
          {['all', 'pending', 'accepted', 'completed', 'rejected', 'cancelled'].map((f) => {
            const isActive = filter === f;
            
            const getActiveColor = () => {
              switch(f) {
                case 'pending': return 'bg-blue-500';
                case 'rejected':
                case 'cancelled': return 'bg-red-500';
                default: return 'bg-green-500';
              }
            };
            
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm capitalize transition-all whitespace-nowrap ${
                  isActive 
                    ? `${getActiveColor()} text-white shadow-lg` 
                    : "bg-[#EBEDF0] dark:bg-slate-800 text-[#1D3557] dark:text-gray-300 hover:bg-[#E2E4E7] dark:hover:bg-slate-700"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden overflow-x-auto custom-scrollbar transition-colors">
        {filteredOrders.length > 0 ? (
          <table className="w-full text-left border-collapse min-w-[1350px]">
            <thead>
              <tr className="bg-emerald-500/10 dark:bg-emerald-500/5 border-b-2 border-gray-800/20 dark:border-white/30 text-[11px] whitespace-nowrap">
                <th className="px-5 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-20 whitespace-nowrap">SR NO</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-36 whitespace-nowrap">Order ID</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-60 whitespace-nowrap">Customer Name</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-60 whitespace-nowrap">Product Name</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-32 whitespace-nowrap">Quantity</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-44 whitespace-nowrap">Date & Time</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-32 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-32 whitespace-nowrap">Total Price</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center w-40 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/10 dark:divide-white/20">
              {filteredOrders.map((order, index) => (
                <tr key={order._id} className="hover:bg-emerald-500/5 transition-colors group">
                  <td className="px-5 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                    <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                    <span className="text-sm font-bold text-emerald-500 font-mono uppercase tracking-tighter">
                      #{order._id.substring(0, 8)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                    <span className="text-sm font-bold text-gray-900 dark:text-white capitalize truncate block w-52 mx-auto text-center whitespace-nowrap">
                      {order.consumer?.name?.toLowerCase() || 'Deleted Consumer'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                    <span className="text-sm font-bold text-gray-900 dark:text-white capitalize block w-52 mx-auto break-words text-center whitespace-nowrap">
                      {order.items?.length > 1 ? 'Various Items' : (order.items?.[0]?.product?.name?.toLowerCase() || 'Deleted Product')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    {order.items?.reduce((acc, item) => acc + item.quantity, 0)} {order.items?.[0]?.product?.unit || (order.items?.[0]?.product ? '' : 'Kg')}
                    {order.items?.length > 1 && ` (+${order.items.length - 1})`}
                  </td>
                  <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20 font-mono text-sm text-gray-900 dark:text-white font-bold leading-tight whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}<br />
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </td>
                  <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20 whitespace-nowrap">
                    <span className={`text-sm font-bold capitalize ${order.status === "pending" ? "text-blue-500" :
                        order.status === "accepted" || order.status === "completed" ? "text-emerald-500" :
                        "text-rose-500"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20 font-mono text-sm font-bold text-emerald-500 whitespace-nowrap">
                    Rs.{order.totalAmount.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="flex justify-center">
                       <button onClick={() => handleDelete(order)} className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                         <FaTrash size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <FaShoppingCart className="text-4xl mx-auto mb-4 opacity-20" />
            <p className="font-bold">No orders found matching your criteria.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-[320px] w-full overflow-hidden border border-white/10"
            >
              <div className="p-6 text-center border-b border-gray-100 dark:border-slate-700">
                <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrash className="text-rose-500 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete Order</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Confirm deletion of <span className="font-bold text-emerald-500">
                    {orderToDelete?.items?.length > 1 ? 'Various Items' : (orderToDelete?.items?.[0]?.product?.name?.toLowerCase() || 'N/A')}
                  </span>? This will permanently remove it from history.
                </p>
              </div>
              <div className="flex p-3 gap-2 bg-gray-50 dark:bg-slate-900/50">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 text-xs bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all border border-gray-200 dark:border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 text-xs bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all shadow-md shadow-rose-200 dark:shadow-none cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </motion.div>
    </PageContainer>
  );
};

export default OrdersPage;
