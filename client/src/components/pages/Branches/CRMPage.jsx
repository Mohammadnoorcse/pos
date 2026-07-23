import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { AddRoleModal } from "../../shared/Modal";
import { COLORS, PETALS, FONTS, DEFAULT_CRM_PERMISSIONS } from "../../../constants";

export function CRMPage() {
  const [permissions, setPermissions] = React.useState(DEFAULT_CRM_PERMISSIONS);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingPermission, setEditingPermission] = React.useState(null);

  const handleCreate = (name) => {
    const nextId = permissions.length ? Math.max(...permissions.map((p) => p.id)) + 1 : 1;
    setPermissions((prev) => [...prev, { id: nextId, name }]);
    setShowAddModal(false);
  };

  const handleUpdate = (name) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === editingPermission.id ? { ...p, name } : p
      )
    );
    setEditingPermission(null);
  };

  const handleDelete = (id) => {
    setPermissions((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-crm" colors={PETALS} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          CRM List
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{
            backgroundColor: COLORS.magenta,
            boxShadow: `0 4px 10px ${COLORS.magenta}40`,
          }}
        >
          <Plus size={14} /> Add CRM Permission
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
                Permission Name
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
            {permissions.map((perm, i) => (
              <tr
                key={perm.id}
                style={
                  i !== permissions.length - 1
                    ? { borderBottom: `1px solid ${COLORS.line}` }
                    : undefined
                }
              >
                <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                  {perm.id}
                </td>
                <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink, fontFamily: FONTS.MONO }}>
                  {perm.name}
                </td>
                <td className="py-3 px-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingPermission(perm)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: COLORS.peacock }}
                      title="Edit permission"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(perm.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: COLORS.vermillion }}
                      title="Remove permission"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {permissions.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="py-8 text-center text-[13px]"
                  style={{ color: COLORS.muted }}
                >
                  No CRM permissions added yet.
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
          accentColor={COLORS.magenta}
          title="Add CRM Permission"
          fieldLabel="Permission Name"
          placeholder="e.g. crm.lead.assign"
          buttonLabel="Add Permission"
        />
      )}

      {editingPermission && (
        <AddRoleModal
          onClose={() => setEditingPermission(null)}
          onCreate={handleUpdate}
          accentColor={COLORS.magenta}
          title="Edit CRM Permission"
          fieldLabel="Permission Name"
          placeholder="e.g. crm.lead.assign"
          buttonLabel="Save Changes"
          initialValue={editingPermission.name}
        />
      )}
    </div>
  );
}