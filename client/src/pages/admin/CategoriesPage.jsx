"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../redux/slices/categorySlice";
import Loader from "../../components/Loader";
import { FaPlus, FaTrash, FaEdit, FaLayerGroup } from "react-icons/fa";
import PageContainer from "../../components/PageContainer";
import { motion } from "framer-motion";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, success } = useSelector((state) => state.categories);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", icon: "" });
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    dispatch(getCategories());
    const timer = setTimeout(() => setDelayedLoading(false), 400);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (success && showModal) {
      setShowModal(false);
      setFormData({ name: "", description: "", icon: "" });
    }
  }, [success]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      dispatch(createCategory(formData));
    } else {
      dispatch(updateCategory({ id: currentCategory._id, categoryData: formData }));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(id));
    }
  };

  const handleEdit = (cat) => {
    setModalMode("edit");
    setCurrentCategory(cat);
    setFormData({ name: cat.name, description: cat.description || "", icon: cat.icon || "" });
    setShowModal(true);
  };

  if ((loading && categories.length === 0) || delayedLoading) {
    return <Loader />;
  }

  return (
    <PageContainer>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1600px] mx-auto pb-12"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manage Categories</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Organize and group agricultural products</p>
          </div>
          <button
            onClick={() => { setModalMode("add"); setFormData({ name: "", description: "", icon: "" }); setShowModal(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30"
          >
            <FaPlus />
            <span>Add Category</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-[1.2rem] shadow-xl overflow-hidden overflow-x-auto custom-scrollbar transition-colors">
          {categories.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-emerald-500/10 dark:bg-emerald-500/5 border-b-2 border-gray-800/20 dark:border-white/30 text-[11px]">
                  <th className="px-5 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-20">SR NO</th>
                  <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20 w-64">Category Name</th>
                  <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center border-r border-gray-800/10 dark:border-white/20">Description</th>
                  <th className="px-6 py-4 font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest text-center w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/10 dark:divide-white/20">
                {categories.map((cat, index) => (
                  <tr key={cat._id} className="hover:bg-emerald-500/5 transition-colors group">
                    <td className="px-5 py-4 text-center border-r border-gray-800/10 dark:border-white/20 font-mono font-bold text-gray-900 dark:text-white">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 text-center border-r border-gray-800/10 dark:border-white/20">
                      <div className="flex items-center gap-3 justify-center">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xl">
                          {cat.icon || "🌱"}
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white capitalize">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left border-r border-gray-800/10 dark:border-white/20 font-medium text-gray-600 dark:text-gray-400">
                      {cat.description || "No description provided"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(cat)}
                          className="p-2 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat._id)}
                          className="p-2 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-lg hover:shadow-rose-500/20"
                        >
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
              <FaLayerGroup className="text-4xl mx-auto mb-4 opacity-20" />
              <p className="font-bold">No categories found.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal Integration */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 max-w-lg w-full border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
              {modalMode === "add" ? "Create New Category" : "Edit Category"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-800/50 border-2 border-gray-100 dark:border-slate-700 rounded-2xl focus:border-emerald-500 outline-none transition-all font-bold"
                  placeholder="e.g. Vegetables"
                />
              </div>
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Icon / Emoji</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-800/50 border-2 border-gray-100 dark:border-slate-700 rounded-2xl focus:border-emerald-500 outline-none transition-all font-bold"
                    placeholder="🌱"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-5 py-3.5 bg-gray-50 dark:bg-slate-800/50 border-2 border-gray-100 dark:border-slate-700 rounded-2xl focus:border-emerald-500 outline-none transition-all font-bold resize-none"
                  placeholder="Describe this category..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-2xl font-black hover:bg-gray-200 transition-all font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 shadow-xl shadow-emerald-500/30 transition-all disabled:opacity-50"
                >
                  {loading ? "SAVING..." : (modalMode === "add" ? "CREATE" : "UPDATE")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </PageContainer>
  );
};

export default CategoriesPage;
