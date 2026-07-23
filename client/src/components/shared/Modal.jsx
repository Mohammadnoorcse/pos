import React from "react";
import { X } from "lucide-react";
import { ScallopBorder } from "./ScallopBorder";
import { FieldLabel } from "./FormElements";
import { COLORS, PETALS, FONTS } from "../../constants";

export function AddRoleModal({
  onClose,
  onCreate,
  accentColor = COLORS.peacock,
  title = "Add New Role",
  fieldLabel = "Role Name",
  placeholder = "e.g. Inventory Manager",
  buttonLabel = "Create Role",
  initialValue = "",
}) {
  const [name, setName] = React.useState(initialValue);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(43,35,32,0.45)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border overflow-hidden"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        onClick={(e) => e.stopPropagation()}
      >
        <ScallopBorder id="scallop-add-role" colors={PETALS} />
        <div className="p-6 pt-7">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-bold text-[15.5px]"
              style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.paper, color: COLORS.muted }}
            >
              <X size={14} />
            </button>
          </div>

          <FieldLabel required>{fieldLabel}</FieldLabel>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder={placeholder}
            className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none mb-5"
            style={{
              backgroundColor: COLORS.paper,
              borderColor: COLORS.line,
              color: COLORS.ink,
              fontFamily: FONTS.BODY,
            }}
          />

          <div className="flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="font-semibold text-[12.5px] px-4 py-2.5 rounded-lg border"
              style={{
                borderColor: COLORS.line,
                color: COLORS.muted,
                backgroundColor: COLORS.panel,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg shadow-md disabled:opacity-40"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 4px 10px ${accentColor}40`,
              }}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AddBranchModal({
  onClose,
  onCreate,
  title = "Add New Branch",
  buttonLabel = "Create Branch",
  initialName = "",
  initialAddress = "",
}) {
  const [name, setName] = React.useState(initialName);
  const [address, setAddress] = React.useState(initialAddress);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCreate = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onCreate(trimmedName, address.trim());
    setName("");
    setAddress("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(43,35,32,0.45)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border overflow-hidden"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        onClick={(e) => e.stopPropagation()}
      >
        <ScallopBorder id="scallop-add-branch" colors={PETALS} />
        <div className="p-6 pt-7">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-bold text-[15.5px]"
              style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.paper, color: COLORS.muted }}
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-4 mb-5">
            <div>
              <FieldLabel required>Branch Name</FieldLabel>
              <input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Godown Uttara"
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                style={{
                  backgroundColor: COLORS.paper,
                  borderColor: COLORS.line,
                  color: COLORS.ink,
                  fontFamily: FONTS.BODY,
                }}
              />
            </div>
            <div>
              <FieldLabel>Address</FieldLabel>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Shop / Godown address"
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                style={{
                  backgroundColor: COLORS.paper,
                  borderColor: COLORS.line,
                  color: COLORS.ink,
                  fontFamily: FONTS.BODY,
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="font-semibold text-[12.5px] px-4 py-2.5 rounded-lg border"
              style={{
                borderColor: COLORS.line,
                color: COLORS.muted,
                backgroundColor: COLORS.panel,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg shadow-md disabled:opacity-40"
              style={{
                backgroundColor: COLORS.vermillion,
                boxShadow: `0 4px 10px ${COLORS.vermillion}40`,
              }}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AddUnitTypeModal({
  onClose,
  onCreate,
  title = "Add New Unit Type",
  buttonLabel = "Add Unit Type",
  initialName = "",
  initialShort = "",
}) {
  const [name, setName] = React.useState(initialName);
  const [short, setShort] = React.useState(initialShort);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCreate = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onCreate(trimmedName, short.trim());
    setName("");
    setShort("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(43,35,32,0.45)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border overflow-hidden"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        onClick={(e) => e.stopPropagation()}
      >
        <ScallopBorder id="scallop-add-unit" colors={PETALS} />
        <div className="p-6 pt-7">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-bold text-[15.5px]"
              style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.paper, color: COLORS.muted }}
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-4 mb-5">
            <div>
              <FieldLabel required>Unit Name</FieldLabel>
              <input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kilogram"
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                style={{
                  backgroundColor: COLORS.paper,
                  borderColor: COLORS.line,
                  color: COLORS.ink,
                  fontFamily: FONTS.BODY,
                }}
              />
            </div>
            <div>
              <FieldLabel>Short Code</FieldLabel>
              <input
                value={short}
                onChange={(e) => setShort(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. Kg"
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                style={{
                  backgroundColor: COLORS.paper,
                  borderColor: COLORS.line,
                  color: COLORS.ink,
                  fontFamily: FONTS.MONO,
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="font-semibold text-[12.5px] px-4 py-2.5 rounded-lg border"
              style={{
                borderColor: COLORS.line,
                color: COLORS.muted,
                backgroundColor: COLORS.panel,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg shadow-md disabled:opacity-40"
              style={{
                backgroundColor: COLORS.peacock,
                boxShadow: `0 4px 10px ${COLORS.peacock}40`,
              }}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AddVariationModal({
  onClose,
  onCreate,
  title = "Add New Variation",
  buttonLabel = "Add Variation",
  initialName = "",
  initialValues = "",
}) {
  const [name, setName] = React.useState(initialName);
  const [values, setValues] = React.useState(initialValues);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCreate = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const valueList = values
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    onCreate(trimmedName, valueList);
    setName("");
    setValues("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(43,35,32,0.45)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border overflow-hidden"
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
        onClick={(e) => e.stopPropagation()}
      >
        <ScallopBorder id="scallop-add-variation" colors={PETALS} />
        <div className="p-6 pt-7">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="font-bold text-[15.5px]"
              style={{ fontFamily: FONTS.HEAD, color: COLORS.ink }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.paper, color: COLORS.muted }}
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-4 mb-5">
            <div>
              <FieldLabel required>Variation Name</FieldLabel>
              <input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Size"
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                style={{
                  backgroundColor: COLORS.paper,
                  borderColor: COLORS.line,
                  color: COLORS.ink,
                  fontFamily: FONTS.BODY,
                }}
              />
            </div>
            <div>
              <FieldLabel>Values (comma separated)</FieldLabel>
              <input
                value={values}
                onChange={(e) => setValues(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. S, M, L, XL"
                className="w-full rounded-lg px-3.5 py-2.5 text-[13px] border outline-none"
                style={{
                  backgroundColor: COLORS.paper,
                  borderColor: COLORS.line,
                  color: COLORS.ink,
                  fontFamily: FONTS.BODY,
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="font-semibold text-[12.5px] px-4 py-2.5 rounded-lg border"
              style={{
                borderColor: COLORS.line,
                color: COLORS.muted,
                backgroundColor: COLORS.panel,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="text-white font-semibold text-[12.5px] px-4 py-2.5 rounded-lg shadow-md disabled:opacity-40"
              style={{
                backgroundColor: COLORS.purple,
                boxShadow: `0 4px 10px ${COLORS.purple}40`,
              }}
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}