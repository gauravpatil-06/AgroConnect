"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUser } from "../../redux/slices/userSlice";
import Loader from "../../components/Loader";
import { FaSearch, FaTrash, FaUserFriends } from "react-icons/fa";
import PageContainer from "../../components/PageContainer";
import { motion, AnimatePresence } from "framer-motion";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [delayedLoading, setDelayedLoading] = useState(true);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const adminModule = sessionStorage.getItem('adminModule') || 'farmer';

  useEffect(() => {
    dispatch(getAllUsers());
    const timer = setTimeout(() => setDelayedLoading(false), 400);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (users) {
      let filtered = users.filter((user) => user.role === adminModule);
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.name.toLowerCase().includes(lowerSearch) ||
            user.email.toLowerCase().includes(lowerSearch)
        );
      }
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm, adminModule]);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete._id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

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

  if (delayedLoading) {
    return <Loader />;
  }

  return (
    <PageContainer className="pt-8 pb-12">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-row justify-between items-center mb-6">
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {adminModule === 'farmer' ? 'Manage Farmers' : 'Manage Consumers'}
            </h1>
          </motion.div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="form-input pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-[1.2rem] shadow-xl overflow-hidden overflow-x-auto custom-scrollbar transition-colors">
            {filteredUsers.length > 0 ? (
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-emerald-500/10 dark:bg-emerald-500/5 border-b-2 border-gray-800/20 dark:border-white/30 text-[11px]">
                    <th className="px-5 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-20">SR NO</th>
                    <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-52">
                      {adminModule === 'farmer' ? 'Farmer Name' : 'Consumer Name'}
                    </th>
                    <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-60">{adminModule === 'farmer' ? 'Farmer Email' : 'Consumer Email'}</th>
                    <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-40">{adminModule === 'farmer' ? 'Farmer Phone' : 'Consumer Phone'}</th>
                    <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-72">{adminModule === 'farmer' ? 'Farmer Address' : 'Consumer Address'}</th>
                    <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-32">Joined Date</th>
                    <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/10 dark:divide-white/20">
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id} className="hover:bg-emerald-500/5 transition-colors group">
                      <td className="px-5 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                        <span className="text-sm font-bold text-gray-900 dark:text-white font-mono">{String(index + 1).padStart(2, '0')}</span>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                        <div className="flex items-center gap-3 justify-center">
                          <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold uppercase overflow-hidden shrink-0">
                            {user.profileImage ? (
                              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user.name?.charAt(0) || 'U'
                            )}
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white capitalize whitespace-nowrap">{user.name?.toLowerCase() || 'unnamed'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                        <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tighter block truncate mx-auto text-center w-48">
                          {user.email || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                        <span className="text-sm font-bold text-gray-900 dark:text-white tracking-tighter mx-auto block text-center font-mono">
                          {user.phone || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-300 block text-center mx-auto truncate max-w-[250px]" title={user.address ? `${user.address.street || ''}, ${user.address.city || ''}` : '-'}>
                          {user.address?.city || user.address?.street ? `${user.address.street || ''} ${user.address.city || ''}`.trim() : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                        <span className="font-mono text-sm text-gray-900 dark:text-white font-bold leading-tight">
                          {new Date(user.createdAt).toLocaleDateString()}<br />
                          {new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleDeleteClick(user)}
                          disabled={user.role === 'admin'}
                          className={`p-2 rounded-xl transition-all ${
                            user.role === 'admin' 
                            ? "opacity-20 cursor-not-allowed" 
                            : "text-rose-500 hover:bg-rose-500 hover:text-white shadow-lg hover:shadow-rose-500/20"
                          }`}
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center flex flex-col items-center">
                <FaUserFriends className="text-emerald-500/20 text-6xl mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-bold text-lg mb-2">No {adminModule === 'farmer' ? 'farmers' : 'consumers'} found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-6 max-w-xs mx-auto">There are no {adminModule === 'farmer' ? 'farmers' : 'consumers'} matching your current filters.</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

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
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete {adminModule === 'farmer' ? 'Farmer' : 'Consumer'}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this {adminModule === 'farmer' ? 'farmer' : 'consumer'} <span className="font-bold text-gray-700 dark:text-gray-200">"{userToDelete?.name}"</span>? This action cannot be undone.
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

export default UsersPage;
