import React from "react";
import { Plus, Pencil, KeyRound } from "lucide-react";
import { ScallopBorder } from "../../shared/ScallopBorder";
import { AddRoleModal } from "../../shared/Modal";
import { COLORS, PETALS, FONTS, DEFAULT_ADMIN_ROLES } from "../../../constants";

export function AdminRolesPage({ onOpenPermissions }) {
  const [roles, setRoles] = React.useState(DEFAULT_ADMIN_ROLES);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingRole, setEditingRole] = React.useState(null);

  const handleCreateRole = (name) => {
    const nextId = roles.length ? Math.max(...roles.map((r) => r.id)) + 1 : 1;
    setRoles((prev) => [...prev, { id: nextId, name }]);
    setShowAddModal(false);
  };

  const handleUpdateRole = (name) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === editingRole.id ? { ...r, name } : r))
    );
    setEditingRole(null);
  };

  return (
    <div
      className="relative rounded-2xl p-6 pt-7 border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <ScallopBorder id="scallop-roles" colors={PETALS} />
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2
          className="font-bold text-[16px]"
          style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
        >
          Admin Helper Roles
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md"
          style={{
            backgroundColor: COLORS.peacock,
            boxShadow: `0 4px 10px ${COLORS.peacock}40`,
          }}
        >
          <Plus size={14} /> Add New Role
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
                Role Name
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
            {roles.map((role, i) => (
              <tr
                key={role.id}
                style={
                  i !== roles.length - 1
                    ? { borderBottom: `1px solid ${COLORS.line}` }
                    : undefined
                }
              >
                <td className="py-3 px-2.5" style={{ color: COLORS.muted, fontFamily: FONTS.MONO }}>
                  {role.id}
                </td>
                <td className="py-3 px-2.5 font-semibold" style={{ color: COLORS.ink }}>
                  {role.name}
                </td>
                <td className="py-3 px-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingRole(role)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: COLORS.peacock }}
                      title="Edit role name"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => onOpenPermissions(role)}
                      className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg"
                      style={{
                        backgroundColor: COLORS.purpleTint,
                        color: COLORS.purple,
                      }}
                    >
                      <KeyRound size={13} /> Permissions
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddRoleModal
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreateRole}
        />
      )}

      {editingRole && (
        <AddRoleModal
          onClose={() => setEditingRole(null)}
          onCreate={handleUpdateRole}
          title="Edit Role"
          buttonLabel="Save Changes"
          initialValue={editingRole.name}
        />
      )}
    </div>
  );
}