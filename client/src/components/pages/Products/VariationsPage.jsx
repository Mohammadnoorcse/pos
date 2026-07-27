import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { COLORS, PETALS, FONTS } from "../../../constants";
import {
  fetchVariations,
  createVariation,
  updateVariation,
  deleteVariation,
} from "../../../api/variationService";

export function VariationsPage() {
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingVariation, setEditingVariation] = useState(null);

  // ১. ব্যাকএন্ড থেকে ভ্যারিয়েশন লোড করার ফাংশন
  const loadVariations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchVariations();
      // Laravel Paginate response থেকে array নিয়ে সেট করা
      setVariations(response.data || []);
    } catch (err) {
      console.error("Error loading variations:", err);
      setError("ভ্যারিয়েশন ডাটা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVariations();
  }, []);

  // ২. ভ্যারিয়েশন ক্রিয়েট/আপডেট হ্যান্ডলার
  const handleSave = async (formData) => {
    try {
      if (editingVariation) {
        await updateVariation(editingVariation.id, formData);
      } else {
        await createVariation(formData);
      }
      setShowModal(false);
      setEditingVariation(null);
      loadVariations();
    } catch (err) {
      console.error("Error saving variation:", err);
      alert(err.message || "ভ্যারিয়েশন সেভ করতে সমস্যা হয়েছে।");
    }
  };

  // ৩. ভ্যারিয়েশন ডিলিট
  const handleDelete = async (id) => {
    if (!window.confirm("আপনি কি নিশ্চিত যে এই ভ্যারিয়েশনটি ডিলিট করতে চান?")) return;

    try {
      await deleteVariation(id);
      loadVariations();
    } catch (err) {
      console.error("Error deleting variation:", err);
      alert("ভ্যারিয়েশন ডিলিট করা সম্ভব হয়নি।");
    }
  };

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-variations" colors={PETALS} />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Variations
        </h2>
        <button
          onClick={() => {
            setEditingVariation(null);
            setShowModal(true);
          }}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md hover:opacity-90 transition-opacity cursor-pointer"
          style={{
            backgroundColor: COLORS.magenta,
            boxShadow: `0 4px 10px ${COLORS.magenta}40`,
          }}
        >
          <Plus size={14} /> Add New Variation
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
            <Loader2 className="animate-spin" size={20} />
            <span>ভ্যারিয়েশন লোড হচ্ছে...</span>
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
                  Variation Name
                </th>
                <th
                  className="font-semibold text-[11px] uppercase tracking-wide pb-2.5 px-2.5 border-b"
                  style={{ borderColor: COLORS.line }}
                >
                  Values
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
              {variations.map((v, i) => (
                <tr
                  key={v.id}
                  style={
                    i !== variations.length - 1
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
                    {v.name}
                  </td>
                  <td className="py-3 px-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {v.values && v.values.length > 0 ? (
                        v.values.map((valObj) => (
                          <span
                            key={valObj.id || valObj.value}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                            style={{
                              backgroundColor: COLORS.peacockTint,
                              color: COLORS.peacock,
                              fontFamily: FONTS.MONO,
                            }}
                          >
                            {valObj.value}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11.5px] italic text-slate-400">
                          No values
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingVariation(v);
                          setShowModal(true);
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity cursor-pointer"
                        style={{ backgroundColor: COLORS.peacock }}
                        title="Edit Variation"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity cursor-pointer"
                        style={{ backgroundColor: COLORS.vermillion }}
                        title="Delete Variation"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {variations.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-8 text-center text-[13px]"
                    style={{ color: COLORS.muted }}
                  >
                    No variations added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Variation Create / Edit Modal */}
      {showModal && (
        <VariationModal
          onClose={() => {
            setShowModal(false);
            setEditingVariation(null);
          }}
          onSave={handleSave}
          initialData={editingVariation}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Modal Component for Adding/Editing Variation & Values
// ----------------------------------------------------------------------
function VariationModal({ onClose, onSave, initialData }) {
  const [name, setName] = useState(initialData?.name || "");
  const [values, setValues] = useState(
    initialData?.values ? initialData.values.map((v) => v.value) : []
  );
  const [inputValue, setInputValue] = useState("");

  const handleAddValue = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      setValues([...values, trimmed]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddValue();
    }
  };

  const handleRemoveValue = (indexToRemove) => {
    setValues(values.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Variation name is required");
      return;
    }
    // ইনপুট বক্সে না-এড হওয়া কোনো লেখা থাকলে তা-ও যুক্ত করে নেওয়া
    let finalValues = [...values];
    if (inputValue.trim() && !finalValues.includes(inputValue.trim())) {
      finalValues.push(inputValue.trim());
    }

    onSave({
      name: name.trim(),
      values: finalValues,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-xl border relative animate-in fade-in zoom-in-95 duration-150"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
      >
        <div className="flex items-center justify-between mb-4 border-b pb-3" style={{ borderColor: COLORS.line }}>
          <h3 className="font-bold text-[15px]" style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}>
            {initialData ? "Edit Variation" : "Add New Variation"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: COLORS.ink }}>
              Variation Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Size, Color"
              className="w-full text-[13px] px-3.5 py-2 rounded-xl border outline-none focus:ring-2"
              style={{ borderColor: COLORS.line, fontFamily: FONTS.BODY }}
              required
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold mb-1.5" style={{ color: COLORS.ink }}>
              Variation Values (Press Enter or Comma to add)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. S, M, L or Red, Blue"
                className="w-full text-[13px] px-3.5 py-2 rounded-xl border outline-none focus:ring-2"
                style={{ borderColor: COLORS.line, fontFamily: FONTS.BODY }}
              />
              <button
                type="button"
                onClick={handleAddValue}
                className="px-3.5 py-2 text-white rounded-xl text-[12.5px] font-semibold shrink-0 cursor-pointer"
                style={{ backgroundColor: COLORS.peacock }}
              >
                Add
              </button>
            </div>

            {/* Tags preview */}
            <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl border border-dashed" style={{ borderColor: COLORS.line }}>
              {values.map((val, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11.5px] px-2.5 py-1 rounded-lg font-medium"
                  style={{
                    backgroundColor: COLORS.peacockTint,
                    color: COLORS.peacock,
                    fontFamily: FONTS.MONO,
                  }}
                >
                  {val}
                  <button
                    type="button"
                    onClick={() => handleRemoveValue(idx)}
                    className="hover:text-red-600 cursor-pointer ml-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {values.length === 0 && (
                <span className="text-[12px] text-slate-400 self-center">No values added yet</span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[12.5px] font-semibold border cursor-pointer"
              style={{ borderColor: COLORS.line, color: COLORS.muted }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-[12.5px] font-semibold text-white shadow-md cursor-pointer"
              style={{ backgroundColor: COLORS.magenta }}
            >
              {initialData ? "Save Changes" : "Create Variation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}