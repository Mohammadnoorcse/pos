import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { AddUnitTypeModal } from "../../shared/Modal";
import { COLORS, PETALS, FONTS } from "../../../constants";
import {
  fetchUnitTypes,
  createUnitType,
  updateUnitType,
  deleteUnitType,
} from "../../../api/unitTypeService";

export function UnitTypesPage() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  // ১. ব্যাকএন্ড থেকে ইউনিট টাইপ লোড করার ফাংশন
  const loadUnitTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchUnitTypes();
      // Laravel Paginate response থেকে array নিয়ে সেট করা
      setUnits(response.data || []);
    } catch (err) {
      console.error("Error loading unit types:", err);
      setError("ইউনিট টাইপ লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnitTypes();
  }, []);

  // ২. নতুন ইউনিট টাইপ তৈরি
  const handleCreate = async (name, short) => {
    try {
      const payload = {
        name,
        short: short || name.slice(0, 3).toLowerCase(),
      };
      await createUnitType(payload);
      setShowAddModal(false);
      loadUnitTypes();
    } catch (err) {
      console.error("Error creating unit type:", err);
      alert(err.message || "ইউনিট টাইপ তৈরি করতে সমস্যা হয়েছে। ইউনিক নাম ব্যবহার করুন।");
    }
  };

  // ৩. ইউনিট টাইপ আপডেট
  const handleUpdate = async (name, short) => {
    if (!editingUnit) return;
    try {
      const payload = {
        name,
        short: short || name.slice(0, 3).toLowerCase(),
      };
      await updateUnitType(editingUnit.id, payload);
      setEditingUnit(null);
      loadUnitTypes();
    } catch (err) {
      console.error("Error updating unit type:", err);
      alert(err.message || "ইউনিট টাইপ আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  // ৪. ইউনিট টাইপ ডিলিট
  const handleDelete = async (id) => {
    if (!window.confirm("আপনি কি নিশ্চিত যে এই ইউনিট টাইপটি ডিলিট করতে চান?")) return;

    try {
      await deleteUnitType(id);
      loadUnitTypes();
    } catch (err) {
      console.error("Error deleting unit type:", err);
      alert("ইউনিট টাইপ ডিলিট করা সম্ভব হয়নি।");
    }
  };

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-units" colors={PETALS} />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Unit Types
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity cursor-pointer"
          style={{
            backgroundColor: COLORS.peacock,
            boxShadow: `0 4px 10px ${COLORS.peacock}40`,
          }}
        >
          <Plus size={14} /> Add New Unit Type
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={20} />
            <span>ইউনিট টাইপ লোড হচ্ছে...</span>
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
                  Unit Name
                </th>
                <th
                  className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                  style={{ borderColor: COLORS.line }}
                >
                  Short Code
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
              {units.map((u, i) => (
                <tr
                  key={u.id}
                  style={
                    i !== units.length - 1
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
                    {u.name}
                  </td>
                  <td className="py-3 px-2.5">
                    <span
                      className="text-[11.5px] font-bold px-2.5 py-1 rounded-lg inline-block"
                      style={{
                        backgroundColor: COLORS.peacockTint,
                        color: COLORS.peacock,
                        fontFamily: FONTS.MONO,
                      }}
                    >
                      {u.short || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingUnit(u)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity cursor-pointer"
                        style={{ backgroundColor: COLORS.peacock }}
                        title="Edit Unit Type"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity cursor-pointer"
                        style={{ backgroundColor: COLORS.vermillion }}
                        title="Delete Unit Type"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {units.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-[13px]"
                    style={{ color: COLORS.muted }}
                  >
                    No unit types added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddUnitTypeModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreate}
        />
      )}

      {editingUnit && (
        <AddUnitTypeModal
          onClose={() => setEditingUnit(null)}
          onCreate={handleUpdate}
          title="Edit Unit Type"
          buttonLabel="Save Changes"
          initialName={editingUnit.name}
          initialShort={editingUnit.short}
        />
      )}
    </div>
  );
}