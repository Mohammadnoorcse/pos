import React, { useState, useEffect } from "react";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { AddBranchModal } from "../../shared/Modal";
import { COLORS, PETALS, FONTS } from "../../../constants";
import { fetchBranches, createBranch, updateBranch } from "../../../api/branchService";

export function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  // API থেকে ডাটা ফেচ করা
  const loadBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBranches({ type: "shop" });
      setBranches(data.data || []); // Laravel Pagination Structure
    } catch (err) {
      console.error("Error loading branches:", err);
      setError("ব্রাঞ্চ লিস্ট লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  // নতুন ব্রাঞ্চ তৈরি
  const handleCreateBranch = async (name, address, phone = "") => {
    try {
      await createBranch({
        name,
        address,
        phone,
        type: "shop",
      });
      setShowAddModal(false);
      loadBranches();
    } catch (err) {
      console.error("Error creating branch:", err);
      alert("ব্রাঞ্চ তৈরি করা সম্ভব হয়নি। ইনপুট চেক করুন।");
    }
  };

  // ব্রাঞ্চ আপডেট
  const handleUpdateBranch = async (name, address, phone = "") => {
    if (!editingBranch) return;

    try {
      await updateBranch(editingBranch.id, {
        name,
        address,
        phone,
        type: editingBranch.type || "shop",
      });
      setEditingBranch(null);
      loadBranches();
    } catch (err) {
      console.error("Error updating branch:", err);
      alert("ব্রাঞ্চ আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-branches" colors={PETALS} />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Shop branches
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: COLORS.vermillion,
            boxShadow: `0 4px 10px ${COLORS.vermillion}40`,
          }}
        >
          <Plus size={14} /> Add New Branch
        </button>
      </div>

      {/* Data Table */}
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
                <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: COLORS.line }}>
                  SI
                </th>
                <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: COLORS.line }}>
                  Branch Name
                </th>
                <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: COLORS.line }}>
                  Address
                </th>
                <th className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b" style={{ borderColor: COLORS.line }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {branches.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    কোন ব্রাঞ্চ পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                branches.map((branch, i) => (
                  <tr
                    key={branch.id}
                    style={i !== branches.length - 1 ? { borderBottom: `1px solid ${COLORS.line}` } : undefined}
                  >
                    <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                      {i + 1}
                    </td>
                    <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink }}>
                      {branch.name}
                    </td>
                    <td className="py-3 px-2.5" style={{ color: COLORS.muted }}>
                      {branch.address || "—"}
                    </td>
                    <td className="py-3 px-2.5">
                      <button
                        onClick={() => setEditingBranch(branch)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: COLORS.peacock }}
                        title="Edit branch"
                      >
                        <Pencil size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddBranchModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreateBranch}
        />
      )}

      {/* Edit Modal */}
      {editingBranch && (
        <AddBranchModal
          onClose={() => setEditingBranch(null)}
          onCreate={handleUpdateBranch}
          title="Edit Branch"
          buttonLabel="Save Changes"
          initialName={editingBranch.name}
          initialAddress={editingBranch.address}
        />
      )}
    </div>
  );
}