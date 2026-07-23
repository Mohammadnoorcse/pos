import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { AddRoleModal } from "../../shared/Modal";
import { COLORS, PETALS, FONTS, DEFAULT_BRANDS } from "../../../constants";

export function BrandsPage() {
  const [brands, setBrands] = React.useState(DEFAULT_BRANDS);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingBrand, setEditingBrand] = React.useState(null);

  const handleCreate = (name) => {
    const nextId = brands.length ? Math.max(...brands.map((b) => b.id)) + 1 : 1;
    setBrands((prev) => [...prev, { id: nextId, name }]);
    setShowAddModal(false);
  };

  const handleUpdate = (name) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === editingBrand.id ? { ...b, name } : b))
    );
    setEditingBrand(null);
  };

  const handleDelete = (id) => setBrands((prev) => prev.filter((b) => b.id !== id));

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-brands" colors={PETALS} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Brands
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{
            backgroundColor: COLORS.marigold,
            boxShadow: `0 4px 10px ${COLORS.marigold}40`,
          }}
        >
          <Plus size={14} /> Add New Brand
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
                <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                  {b.id}
                </td>
                <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink }}>
                  {b.name}
                </td>
                <td className="py-3 px-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingBrand(b)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: COLORS.peacock }}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: COLORS.vermillion }}
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
      </div>

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