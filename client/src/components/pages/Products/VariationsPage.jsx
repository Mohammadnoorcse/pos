import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { AddVariationModal } from "../../shared/Modal";
import { COLORS, PETALS, FONTS, DEFAULT_VARIATIONS, VARIATION_CHIP_COLORS } from "../../../constants";

export function VariationsPage() {
  const [variations, setVariations] = React.useState(DEFAULT_VARIATIONS);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingVariation, setEditingVariation] = React.useState(null);

  const handleCreate = (name, values) => {
    const nextId = variations.length ? Math.max(...variations.map((v) => v.id)) + 1 : 1;
    setVariations((prev) => [...prev, { id: nextId, name, values }]);
    setShowAddModal(false);
  };

  const handleUpdate = (name, values) => {
    setVariations((prev) =>
      prev.map((v) =>
        v.id === editingVariation.id ? { ...v, name, values } : v
      )
    );
    setEditingVariation(null);
  };

  const handleDelete = (id) => setVariations((prev) => prev.filter((v) => v.id !== id));

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-variations" colors={PETALS} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px] flex items-center gap-2"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Variations
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: COLORS.mint }}
          >
            New
          </span>
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{
            backgroundColor: COLORS.purple,
            boxShadow: `0 4px 10px ${COLORS.purple}40`,
          }}
        >
          <Plus size={14} /> Add New Variation
        </button>
      </div>

      <div className="overflow-x-auto">
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
                <td className="py-3 px-2.5 align-top" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                  {v.id}
                </td>
                <td className="py-3 px-2.5 align-top font-semibold" style={{ color: COLORS.ink }}>
                  {v.name}
                </td>
                <td className="py-3 px-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {v.values.map((val, k) => {
                      const color = VARIATION_CHIP_COLORS[k % VARIATION_CHIP_COLORS.length];
                      return (
                        <span
                          key={val}
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: `${color}1F`,
                            color,
                          }}
                        >
                          {val}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="py-3 px-2.5 align-top">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingVariation(v)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: COLORS.peacock }}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: COLORS.vermillion }}
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
      </div>

      {showAddModal && (
        <AddVariationModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreate}
        />
      )}

      {editingVariation && (
        <AddVariationModal
          onClose={() => setEditingVariation(null)}
          onCreate={handleUpdate}
          title="Edit Variation"
          buttonLabel="Save Changes"
          initialName={editingVariation.name}
          initialValues={editingVariation.values.join(", ")}
        />
      )}
    </div>
  );
}