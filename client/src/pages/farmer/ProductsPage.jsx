"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerProducts,
  deleteProduct,
} from "../../redux/slices/productSlice";
import Loader from "../../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaBox,
  FaEye,
} from "react-icons/fa";
import PageContainer from "../../components/PageContainer";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { farmerProducts, loading } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    dispatch(getFarmerProducts());

    // Force hide loader after 0.4s for extra fast feel
    const timer = setTimeout(() => setDelayedLoading(false), 400);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (farmerProducts) {
      setFilteredProducts(
        farmerProducts.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [farmerProducts, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete._id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  if (delayedLoading && loading && farmerProducts.length === 0) {
    return <Loader />;
  }

  return (
    <PageContainer className="py-8">
      <div className="flex flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Products</h1>
        </div>
        <Link
          to="/farmer/products/add"
          className="bg-emerald-500 text-white w-10 h-10 md:w-auto md:h-auto rounded-full md:rounded-lg shadow-md flex items-center justify-center md:px-5 md:py-2.5 md:space-x-2 transition-all active:scale-95 group"
          title="Add New Product"
        >
          <FaPlus className="text-lg md:text-sm" />
          <span className="hidden md:inline font-bold">Add New Product</span>
        </Link>
      </div>

      <div className="mb-8">
        <div className="relative w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search products or category."
            className="form-input pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden overflow-x-auto custom-scrollbar transition-colors">
          <table className="w-full text-left border-collapse min-w-[1350px]">
            <thead>
              <tr className="bg-emerald-500/10 dark:bg-emerald-500/5 border-b-2 border-gray-800/20 dark:border-white/30 text-[11px]">
                <th className="px-5 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-20">SR NO</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-36">Product ID</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-44">Product Name</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-44">Category</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-32">Price</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-32">Quantity</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-40">Harvest Date</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-40">Available Until</th>
                <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/10 dark:divide-white/20">
              {filteredProducts.map((product, index) => (
                <tr key={product._id} className="hover:bg-emerald-500/5 transition-colors group">
                  <td className="px-5 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                    <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                    <span className="text-sm font-bold text-emerald-500 font-mono uppercase tracking-tighter">
                      #{product._id.substring(0, 8)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                    <span className="text-sm font-bold text-gray-900 dark:text-white capitalize block w-40 mx-auto break-words text-center">
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
                  <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20 font-mono text-sm text-gray-900 dark:text-white font-bold whitespace-nowrap">
                    {product.availableUntil ? new Date(product.availableUntil).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                       <Link to={`/products/${product._id}`} className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-emerald-500 transition-all shadow-sm">
                         <FaEye size={14} />
                       </Link>
                       <Link to={`/farmer/products/edit/${product._id}`} className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                         <FaEdit size={14} />
                       </Link>
                       <button onClick={() => handleDeleteClick(product)} className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                         <FaTrash size={14} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-3xl shadow-xl">
          <FaBox className="text-emerald-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No Products Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 font-bold">
            {searchTerm
              ? "No products match your search criteria."
              : "You haven't added any products yet."}
          </p>
          <Link to="/farmer/products/add" className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-emerald-600 transition-all inline-block">
            Add Your First Product
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-[320px] w-full overflow-hidden"
            >
              <div className="p-6 text-center border-b border-gray-100 dark:border-slate-700">
                <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrash className="text-rose-500 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete Product</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete <span className="font-bold text-gray-700 dark:text-gray-200">"{productToDelete?.name}"</span>? This action cannot be undone.
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
    </PageContainer>
  );
};

export default ProductsPage;
