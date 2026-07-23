import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { AddRoleModal } from "../../shared/Modal";
import { COLORS, PETALS, FONTS, DEFAULT_CATEGORIES } from "../../../constants";

export function CategoriesPage() {
  const [categories, setCategories] = React.useState(DEFAULT_CATEGORIES);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState(null);

  const handleCreate = (name) => {
    const nextId = categories.length ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
    setCategories((prev) => [...prev, { id: nextId, name }]);
    setShowAddModal(false);
  };

  const handleUpdate = (name) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === editingCategory.id ? { ...c, name } : c))
    );
    setEditingCategory(null);
  };

  const handleDelete = (id) => setCategories((prev) => prev.filter((c) => c.id !== id));

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-categories" colors={PETALS} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Categories
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{
            backgroundColor: COLORS.forest,
            boxShadow: `0 4px 10px ${COLORS.forest}40`,
          }}
        >
          <Plus size={14} /> Add New Category
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
                <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                  {cat.id}
                </td>
                <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink }}>
                  {cat.name}
                </td>
                <td className="py-3 px-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCategory(cat)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: COLORS.peacock }}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: COLORS.vermillion }}
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
      </div>

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