import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { AddRoleModal } from "../../shared/Modal";
import { COLORS, PETALS, FONTS } from "../../../constants";
import {
  fetchBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../../../api/brandService";

export function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  // API থেকে ব্র্যান্ডের ডাটা ফেচ করা
  const loadBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchBrands();
      // Laravel Controller paginate response দেয় (data array)
      setBrands(response.data || []);
    } catch (err) {
      console.error("Error loading brands:", err);
      setError("ব্র্যান্ডের ডাটা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  // নতুন ব্র্যান্ড তৈরি
  const handleCreate = async (name) => {
    try {
      await createBrand({ name });
      setShowAddModal(false);
      loadBrands();
    } catch (err) {
      console.error("Error creating brand:", err);
      alert(err.message || "ব্র্যান্ড তৈরি করা সম্ভব হয়নি। ইউনিক নাম ব্যবহার করুন।");
    }
  };

  // ব্র্যান্ড আপডেট
  const handleUpdate = async (name) => {
    if (!editingBrand) return;
    try {
      await updateBrand(editingBrand.id, { name });
      setEditingBrand(null);
      loadBrands();
    } catch (err) {
      console.error("Error updating brand:", err);
      alert(err.message || "ব্র্যান্ড আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  // ব্র্যান্ড ডিলিট
  const handleDelete = async (id) => {
    if (!window.confirm("আপনি কি নিশ্চিত যে এই ব্র্যান্ডটি ডিলিট করতে চান?")) return;

    try {
      await deleteBrand(id);
      loadBrands();
    } catch (err) {
      console.error("Error deleting brand:", err);
      alert("ব্র্যান্ড ডিলিট করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-brands" colors={PETALS} />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Brands
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: COLORS.marigold,
            boxShadow: `0 4px 10px ${COLORS.marigold}40`,
          }}
        >
          <Plus size={14} /> Add New Brand
        </button>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={20} />
            <span>ডাটা লোড হচ্ছে...</span>
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
                  Brand Name
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
              {brands.map((b, i) => (
                <tr
                  key={b.id}
                  style={
                    i !== brands.length - 1
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
                    {b.name}
                  </td>
                  <td className="py-3 px-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingBrand(b)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: COLORS.peacock }}
                        title="Edit brand"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: COLORS.vermillion }}
                        title="Delete brand"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-8 text-center text-[13px]"
                    style={{ color: COLORS.muted }}
                  >
                    No brands added yet.
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
          accentColor={COLORS.marigold}
          title="Add New Brand"
          fieldLabel="Brand Name"
          placeholder="e.g. Aarong"
          buttonLabel="Add Brand"
        />
      )}

      {editingBrand && (
        <AddRoleModal
          onClose={() => setEditingBrand(null)}
          onCreate={handleUpdate}
          accentColor={COLORS.peacock}
          title="Edit Brand"
          fieldLabel="Brand Name"
          placeholder="e.g. Aarong"
          buttonLabel="Save Changes"
          initialValue={editingBrand.name}
        />
      )}
    </div>
  );
}