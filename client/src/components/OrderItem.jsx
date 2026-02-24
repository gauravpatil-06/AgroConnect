import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const OrderItem = ({ order, isManageMode, onUpdateStatus }) => {
  // Function to get status color
  const getStatusColorClass = (status) => {
    switch (status) {
      case "pending":
        return "text-blue-500";
      case "accepted":
        return "text-emerald-500";
      case "rejected":
        return "text-rose-500";
      case "completed":
        return "text-emerald-500";
      case "cancelled":
        return "text-rose-500";
      default:
        return "text-blue-500";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="group bg-white dark:bg-slate-800 border-2 border-transparent shadow-md dark:shadow-none rounded-xl p-5 mb-5 transition-all duration-300 hover:shadow-xl hover:border-green-500 dark:hover:border-green-500 hover:-translate-y-1">
      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-x-20 gap-y-1.5 lg:gap-y-0">

        {/* Section 1: Identification */}
        <div className="flex-none lg:w-56 w-full text-left">
          <div className="flex flex-row items-center gap-2 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-bold min-w-[75px] text-left">Order ID:</span>
            <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">#{order._id.substring(0, 8)}</span>
          </div>
          <div className="flex flex-row items-center gap-2 mt-1 lg:mt-2 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-bold min-w-[75px] text-left">Date:</span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-300">{formatDate(order.createdAt)}</span>
          </div>
        </div>

        {/* Section 2: Summary Data */}
        <div className="flex-none lg:w-44 w-full text-left mt-1 lg:mt-0">
          <div className="flex flex-row items-center gap-2 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-bold min-w-[75px] text-left">Items:</span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{order.items.length}</span>
          </div>
          <div className="flex flex-row items-center gap-2 mt-1 lg:mt-2 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-bold min-w-[75px] text-left">Total:</span>
            <span className="text-xl font-bold text-emerald-600">
              Rs. {order.totalAmount.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Section 3: Status & Entity */}
        <div className="flex-none lg:w-72 w-full text-left mt-1 lg:mt-0">
          <div className="flex flex-row items-center gap-2 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-bold min-w-[75px] text-left">Status:</span>
            <span className={`text-[13px] font-bold ${getStatusColorClass(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div className="flex flex-row items-center gap-2 mt-1 lg:mt-2 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-bold min-w-[75px] text-left">
              {isManageMode ? "Customer:" : "Farmer:"}
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">
              {isManageMode ? order.consumer.name?.toLowerCase() : (order.farmer?.name?.toLowerCase() || "Deleted Farmer")}
            </span>
          </div>
        </div>

        {/* Section 4: Actions */}
        <div className="flex-1 flex flex-row items-center gap-2 mt-5 lg:mt-0 lg:justify-end w-full lg:w-auto">
          {isManageMode && order.status === "pending" && (
            <div className="flex flex-row gap-2 flex-grow lg:flex-grow-0">
              <button
                onClick={() => onUpdateStatus(order, "accepted")}
                className="flex-1 lg:flex-none bg-emerald-500 hover:bg-emerald-600 text-white px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 whitespace-nowrap"
              >
                Accept
              </button>
              <button
                onClick={() => onUpdateStatus(order, "rejected")}
                className="flex-1 lg:flex-none bg-rose-500 hover:bg-rose-600 text-white px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 whitespace-nowrap shadow-sm"
              >
                Reject
              </button>
            </div>
          )}

          {isManageMode && order.status === "accepted" && (
            <button
              onClick={() => onUpdateStatus(order, "completed")}
              className="flex-grow lg:flex-grow-0 bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 whitespace-nowrap"
            >
              Mark as Complete
            </button>
          )}

          {!isManageMode && order.status === "pending" && onUpdateStatus && (
            <button
              onClick={() => onUpdateStatus(order, "cancelled")}
              className="flex-grow lg:flex-grow-0 bg-rose-500 hover:bg-rose-600 text-white px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 whitespace-nowrap"
            >
              Cancel Order
            </button>
          )}

          <Link
            to={`/orders/${order._id}`}
            className="flex-grow lg:flex-grow-0 flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 whitespace-nowrap shadow-sm"
          >
            <FaEye size={14} className="hidden sm:inline" />
            <span>View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;