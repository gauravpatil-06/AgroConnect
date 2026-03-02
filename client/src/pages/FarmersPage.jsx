"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";
import { FaSearch, FaLeaf } from "react-icons/fa";
import PageContainer from "../components/PageContainer";

const FarmersPage = () => {
  const dispatch = useDispatch();
  const { farmers, loading } = useSelector((state) => state.farmers);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    dispatch(getAllFarmers());

    // Force hide loader after 0.4s for extra fast feel
    const timer = setTimeout(() => setDelayedLoading(false), 400);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (farmers) {
      setFilteredFarmers(
        farmers.filter((farmer) =>
          farmer.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [farmers, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (delayedLoading && loading) {
    return <Loader />;
  }

  return (
    <PageContainer className="py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Our Farmers</h1>

      <div className="mb-8">
        <div className="relative w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search farmers..."
            className="form-input pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
        </div>
      </div>

      {filteredFarmers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarmers.map((farmer) => (
            <motion.div 
              key={farmer._id} 
            >
              <FarmerCard farmer={farmer} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaLeaf className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Farmers Found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria.</p>
        </div>
      )}
    </PageContainer>
  );
};

export default FarmersPage;
