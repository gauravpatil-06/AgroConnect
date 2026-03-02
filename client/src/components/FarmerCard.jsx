import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaLeaf } from "react-icons/fa";

const FarmerCard = ({ farmer }) => {
  return (
    <div className="card transition-transform duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-emerald-100 dark:border-slate-700 shadow-sm shrink-0">
            {farmer.profileImage ? (
              <img
                src={farmer.profileImage.startsWith('data:image') || farmer.profileImage.startsWith('http') 
                  ? farmer.profileImage 
                  : `${import.meta.env.VITE_BACKEND_URL}${farmer.profileImage}`} 
                alt={farmer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaLeaf className="text-emerald-500 dark:text-emerald-400 text-2xl" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors">{farmer.name}</h3>
            {farmer.address && (
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
                <FaMapMarkerAlt className="mr-1" />
                <span>
                  {farmer.address.city}, {farmer.address.state}
                </span>
              </div>
            )}
          </div>
        </div>

        <Link
          to={`/farmers/${farmer._id}`}
          className="block w-full bg-emerald-500 text-white text-center py-2 rounded-lg hover:bg-emerald-600 transition-colors font-bold"
        >
          View Farm
        </Link>
      </div>
    </div>
  );
};

export default FarmerCard;
