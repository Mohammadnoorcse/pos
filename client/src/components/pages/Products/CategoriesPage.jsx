import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { AddRoleModal } from "../../shared/Modal";
import { COLORS, PETALS, FONTS } from "../../../constants";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../api/categoryService";

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // ১. ব্যাকএন্ড থেকে ক্যাটাগরি লোড করার ফাংশন
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchCategories();
      // Laravel Paginate response থেকে array নিয়ে সেট করা
      setCategories(response.data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("ক্যাটাগরি ডাটা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ২. নতুন ক্যাটাগরি সেভ করা
  const handleCreate = async (name) => {
    try {
      await createCategory({ name });
      setShowAddModal(false);
      loadCategories();
    } catch (err) {
      console.error("Error creating category:", err);
      alert(err.message || "ক্যাটাগরি তৈরি করতে সমস্যা হয়েছে। ইউনিক নাম ব্যবহার করুন।");
    }
  };

  // ৩. ক্যাটাগরি আপডেট করা
  const handleUpdate = async (name) => {
    if (!editingCategory) return;
    try {
      await updateCategory(editingCategory.id, { name });
      setEditingCategory(null);
      loadCategories();
    } catch (err) {
      console.error("Error updating category:", err);
      alert(err.message || "ক্যাটাগরি আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  // ৪. ক্যাটাগরি ডিলিট করা
  const handleDelete = async (id) => {
    if (!window.confirm("আপনি কি নিশ্চিত যে এই ক্যাটাগরিটি ডিলিট করতে চান?")) return;

    try {
      await deleteCategory(id);
      loadCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("ক্যাটাগরি ডিলিট করা সম্ভব হয়নি।");
    }
  };

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-categories" colors={PETALS} />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Categories
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity cursor-pointer"
          style={{
            backgroundColor: COLORS.forest,
            boxShadow: `0 4px 10px ${COLORS.forest}40`,
          }}
        >
          <Plus size={14} /> Add New Category
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={20} />
            <span>ক্যাটাগরি লোড হচ্ছে...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left" style={{ color: COLORS.muted }}>
                <th
                  className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                  style={{ borderColor: COLORS.line }}
                >
                  SI
                </th>
                <th
                  className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                  style={{ borderColor: COLORS.line }}
                >
                  Category Name
                </th>
                <th
                  className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                  style={{ borderColor: COLORS.line }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr
                  key={cat.id}
                  style={
                    i !== categories.length - 1
                      ? { borderBottom: `1px solid ${COLORS.line}` }
                      : undefined
                  }
                >
                  <td
                    className="py-3 px-2.5"
                    style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}
                  >
                    {i + 1}
                  </td>
                  <td
                    className="py-3 px-2.5 font-semibold"
                    style={{ color: COLORS.ink }}
                  >
                    {cat.name}
                  </td>
                  <td className="py-3 px-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity cursor-pointer"
                        style={{ backgroundColor: COLORS.peacock }}
                        title="Edit category"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity cursor-pointer"
                        style={{ backgroundColor: COLORS.vermillion }}
                        title="Delete category"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-[13px]"
                    style={{ color: COLORS.muted }}
                  >
                    No categories added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddRoleModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreate}
          accentColor={COLORS.forest}
          title="Add New Category"
          fieldLabel="Category Name"
          placeholder="e.g. Panjabi"
          buttonLabel="Add Category"
        />
      )}

      {editingCategory && (
        <AddRoleModal
          onClose={() => setEditingCategory(null)}
          onCreate={handleUpdate}
          accentColor={COLORS.peacock}
          title="Edit Category"
          fieldLabel="Category Name"
          placeholder="e.g. Panjabi"
          buttonLabel="Save Changes"
          initialValue={editingCategory.name}
        />
      )}
    </div>
  );
}