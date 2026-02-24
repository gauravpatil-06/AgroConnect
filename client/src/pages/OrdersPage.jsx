"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConsumerOrders, updateOrderStatus } from "../redux/slices/orderSlice";
import OrderItem from "../components/OrderItem";
import Loader from "../components/Loader";
import { FaShoppingBasket, FaSearch } from "react-icons/fa";
import PageContainer from "../components/PageContainer";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    dispatch(getConsumerOrders());

    // Force hide loader after 0.4s for extra fast feel
    const timer = setTimeout(() => setDelayedLoading(false), 400);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleUpdateStatus = (order, newStatus) => {
    dispatch(updateOrderStatus({ id: order._id, status: newStatus }));
  };

  const filteredOrders = (orders || []).filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch = 
      !searchTerm || 
      order.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (delayedLoading && loading) {
    return <Loader />;
  }

  return (
    <PageContainer className="pt-8 pb-12">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
      </div>

      <div className="mb-8 flex flex-col gap-6">
        <div className="relative w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Farmer, or Product..."
            className="form-input pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
        </div>
        
        <div className="flex gap-2 w-full overflow-x-auto pb-4 custom-scrollbar">
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
                    ? `${getActiveColor()} text-white shadow-lg shadow-${getActiveColor().split('-')[1]}-500/20` 
                    : "bg-[#EBEDF0] dark:bg-slate-800 text-[#1D3557] dark:text-gray-300 hover:bg-[#E2E4E7] dark:hover:bg-slate-700"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <OrderItem 
              key={order._id}
              order={order} 
              isManageMode={false} 
              onUpdateStatus={handleUpdateStatus} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass rounded-xl">
          <FaShoppingBasket className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Orders Found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filter === "all"
              ? "You haven't placed any orders yet."
              : `You don't have any ${filter} orders.`}
          </p>
        </div>
      )}
    </PageContainer>
  );
};

export default OrdersPage;
