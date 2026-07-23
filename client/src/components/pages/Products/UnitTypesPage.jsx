import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { AddUnitTypeModal } from "../../shared/Modal";
import { COLORS, PETALS, FONTS, DEFAULT_UNIT_TYPES } from "../../../constants";

export function UnitTypesPage() {
  const [units, setUnits] = React.useState(DEFAULT_UNIT_TYPES);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingUnit, setEditingUnit] = React.useState(null);

  const handleCreate = (name, short) => {
    const nextId = units.length ? Math.max(...units.map((u) => u.id)) + 1 : 1;
    setUnits((prev) => [...prev, { id: nextId, name, short: short || name.slice(0, 3) }]);
    setShowAddModal(false);
  };

  const handleUpdate = (name, short) => {
    setUnits((prev) =>
      prev.map((u) =>
        u.id === editingUnit.id
          ? { ...u, name, short: short || name.slice(0, 3) }
          : u
      )
    );
    setEditingUnit(null);
  };

  const handleDelete = (id) => setUnits((prev) => prev.filter((u) => u.id !== id));

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-units" colors={PETALS} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Unit Types
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{
            backgroundColor: COLORS.peacock,
            boxShadow: `0 4px 10px ${COLORS.peacock}40`,
          }}
        >
          <Plus size={14} /> Add New Unit Type
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
                <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                  {u.id}
                </td>
                <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink }}>
                  {u.name}
                </td>
                <td className="py-3 px-2.5">
                  <span
                    className="text-[11.5px] font-bold px-2.5 py-1 rounded-lg"
                    style={{
                      backgroundColor: COLORS.peacockTint,
                      color: COLORS.peacock,
                      fontFamily: FONTS.MONO,
                    }}
                  >
                    {u.short}
                  </span>
                </td>
                <td className="py-3 px-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingUnit(u)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: COLORS.peacock }}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: COLORS.vermillion }}
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
      </div>

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