import React from "react";
import { Search, Barcode, Plus, X } from "lucide-react";
import { COLORS, PETALS, FONTS} from "../../constants";

const SUPPLIERS = [
  { id: 1, label: "Sahid Khan(HP Vendor)" },
  { id: 2, label: "Suguna Food BD PVT. LTD(Suguna Food BD PVT. LTD)" },
  { id: 3, label: "Microlab(Rahmat Ali)" },
  { id: 4, label: "Matador(Matador BD)" },
  { id: 5, label: "mamun(nipro jmi)" },
  { id: 6, label: "Cock(Sohag Ahmed)" },
  { id: 7, label: "Rayhan vai(Tahmid enterprise)" },
  { id: 8, label: "Customer OLD Battery(Yasmin Motors)" },
  { id: 9, label: "nazrul(Allahr Dan 4)" },
  { id: 10, label: "Super Board(Super Board)" },
];

const PRODUCTS = [
  { id: 1, name: "Expiry date test", brand: "FARA IT", salesPrice: 115, discount: 0, vat: 0, type: "simple" },
  { id: 2, name: "ABC Test Barcode", brand: "Microlab", salesPrice: 1500, discount: 0, vat: 0, type: "simple" },
  { id: 3, name: "Teer 1 Ltr", brand: "FARA IT", salesPrice: 120, discount: 0, vat: 0, type: "simple" },
  { id: 4, name: "Basundhara facial tissue 240pc", brand: "FARA IT", salesPrice: 90, discount: 0, vat: 0, type: "simple" },
  { id: 5, name: "Olympia fruit bun", brand: "Samsung", salesPrice: 20, discount: 0, vat: 0, type: "simple" },
];

function SupplierStep({ onSelectSupplier }) {
  const [supplierSearch, setSupplierSearch] = React.useState("");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dropdownQuery, setDropdownQuery] = React.useState("");

  const filtered = SUPPLIERS.filter((s) =>
    s.label.toLowerCase().includes(dropdownQuery.toLowerCase())
  );

  return (
    <div
      className="rounded-2xl p-6 border"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div
          className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 border flex-1 w-full"
          style={{ borderColor: COLORS.line, backgroundColor: COLORS.paper }}
        >
          <Search size={15} style={{ color: COLORS.muted }} />
          <input
            value={supplierSearch}
            onChange={(e) => setSupplierSearch(e.target.value)}
            placeholder="Search by supplier info"
            className="bg-transparent outline-none text-[13px] w-full"
            style={{ color: COLORS.ink }}
          />
        </div>

        <div className="relative w-full sm:w-80 shrink-0">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="w-full flex items-center justify-between rounded-lg px-3.5 py-2.5 border text-[13px]"
            style={{
              backgroundColor: COLORS.paper,
              borderColor: COLORS.line,
              color: COLORS.ink,
            }}
          >
            <span>--Or Select Here--</span>
            <span style={{ color: COLORS.muted }}>▾</span>
          </button>

          {dropdownOpen && (
            <div
              className="absolute z-20 mt-1 w-full rounded-lg border overflow-hidden shadow-lg"
              style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
            >
              <div className="p-2 border-b" style={{ borderColor: COLORS.line }}>
                <input
                  autoFocus
                  value={dropdownQuery}
                  onChange={(e) => setDropdownQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-md px-2.5 py-1.5 text-[13px] border outline-none"
                  style={{ borderColor: COLORS.magenta, color: COLORS.ink }}
                />
              </div>
              <div
                className="px-3.5 py-2.5 text-[13px] font-medium text-white cursor-default"
                style={{ backgroundColor: COLORS.magenta }}
              >
                --Or Select Here--
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filtered.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setDropdownOpen(false);
                      setDropdownQuery("");
                      onSelectSupplier(s);
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-[13px] border-b hover:bg-black/5"
                    style={{ borderColor: COLORS.line, color: COLORS.ink }}
                  >
                    {s.label}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="px-3.5 py-3 text-[13px]" style={{ color: COLORS.muted }}>
                    No suppliers found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="mt-4 rounded-xl p-10 text-center text-[13px]"
        style={{ backgroundColor: COLORS.paper, color: COLORS.muted }}
      >
        Select a supplier to continue to products.
      </div>
    </div>
  );
}

function ProductsStep({ supplier, onBack }) {
  const [productQuery, setProductQuery] = React.useState("");
  const [barcodeQuery, setBarcodeQuery] = React.useState("");
  const [cart, setCart] = React.useState([]);

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(productQuery.toLowerCase())
  );

  const addToCart = (product) => {
    setCart((prev) =>
      prev.some((c) => c.id === product.id) ? prev : [...prev, { ...product, qty: 0, price: product.salesPrice, barcode: "" }]
    );
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const updateCartField = (id, field, value) =>
    setCart((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));

  const cellStyle = {
    borderColor: COLORS.line,
    color: COLORS.ink,
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: COLORS.panel, borderColor: COLORS.line }}
    >
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: COLORS.line }}
      >
        <div className="flex items-center gap-2 text-[13px]" style={{ color: COLORS.muted }}>
          <button onClick={onBack} className="font-semibold" style={{ color: COLORS.magenta }}>
            ← Change supplier
          </button>
          <span>•</span>
          <span style={{ color: COLORS.ink }} className="font-semibold">
            {supplier.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr]">
        <div className="border-r p-3 space-y-2" style={{ borderColor: COLORS.line }}>
          <div className="flex bg-white rounded-md border overflow-hidden" style={{ borderColor: COLORS.line }}>
            <button
              className="flex-1 text-[12px] font-semibold py-2"
              style={{ color: COLORS.muted, backgroundColor: COLORS.paper }}
            >
              Supplier Info
            </button>
            <button
              className="flex-1 text-[12px] font-semibold py-2 text-white"
              style={{ backgroundColor: COLORS.magenta }}
            >
              Products
            </button>
          </div>

          <input
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
            placeholder="Search product"
            className="w-full rounded-md px-3 py-2 text-[13px] border outline-none"
            style={{ borderColor: COLORS.line, color: COLORS.ink }}
          />

          <div
            className="flex items-center gap-2 rounded-md px-3 py-2 border"
            style={{ borderColor: COLORS.line }}
          >
            <Barcode size={15} style={{ color: COLORS.muted }} />
            <input
              value={barcodeQuery}
              onChange={(e) => setBarcodeQuery(e.target.value)}
              placeholder="Barcode"
              className="bg-transparent outline-none text-[13px] w-full"
              style={{ color: COLORS.ink }}
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pt-1">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="w-full text-left rounded-md border px-3 py-2"
                style={{ borderColor: COLORS.line }}
              >
                <div className="text-[13px] font-semibold" style={{ color: COLORS.ink }}>
                  {p.name}
                </div>
                <div className="flex items-center justify-between text-[11px] mt-0.5" style={{ color: COLORS.magenta }}>
                  <span>Br. {p.brand}</span>
                  <span style={{ color: COLORS.muted }}>{p.type}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="text-white">
                {["Product info", "Quantity", "P price", "Total price", "Barcode", "Action"].map((h) => (
                  <th
                    key={h}
                    className="text-left font-semibold text-[11px] uppercase tracking-wide px-3 py-2.5"
                    style={{ backgroundColor: COLORS.magenta }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cart.map((c) => (
                <tr key={c.id} className="border-b" style={{ borderColor: COLORS.line }}>
                  <td className="px-3 py-3 align-top" style={cellStyle}>
                    <div className="flex items-center gap-1.5 font-semibold">
                      {c.name}
                      <Plus size={13} style={{ color: COLORS.magenta }} />
                    </div>
                    <div className="text-[11px] mt-1" style={{ color: COLORS.muted }}>
                      Sales price: {c.salesPrice} || Discount: no({c.discount}) || Vat: {c.vat}%
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <input
                      type="number"
                      value={c.qty}
                      onChange={(e) => updateCartField(c.id, "qty", Number(e.target.value) || 0)}
                      className="w-20 rounded-md px-2 py-1.5 border text-[13px] outline-none"
                      style={{ borderColor: COLORS.line, color: COLORS.ink, fontFamily: FONTS.MONO }}
                    />
                  </td>
                  <td className="px-3 py-3 align-top">
                    <input
                      type="number"
                      value={c.price}
                      onChange={(e) => updateCartField(c.id, "price", Number(e.target.value) || 0)}
                      className="w-24 rounded-md px-2 py-1.5 border text-[13px] outline-none"
                      style={{ borderColor: COLORS.line, color: COLORS.ink, fontFamily: FONTS.MONO }}
                    />
                  </td>
                  <td className="px-3 py-3 align-top">
                    <div
                      className="w-24 rounded-md px-2 py-1.5 text-[13px]"
                      style={{ backgroundColor: COLORS.paper, color: COLORS.ink, fontFamily: FONTS.MONO }}
                    >
                      {(c.qty * c.price).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <input
                      value={c.barcode}
                      onChange={(e) => updateCartField(c.id, "barcode", e.target.value)}
                      className="w-28 rounded-md px-2 py-1.5 border text-[13px] outline-none"
                      style={{ borderColor: COLORS.line, color: COLORS.ink }}
                    />
                  </td>
                  <td className="px-3 py-3 align-top">
                    <button
                      onClick={() => removeFromCart(c.id)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-white"
                      style={{ backgroundColor: COLORS.vermillion }}
                    >
                      <X size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {cart.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-[13px]" style={{ color: COLORS.muted }}>
                    Click a product on the left to add it here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function PurchasePage() {
  const [supplier, setSupplier] = React.useState(null);

  return (
    <div className="p-6" style={{ backgroundColor: COLORS.paper, fontFamily: FONTS.BODY }}>
      {!supplier ? (
        <SupplierStep onSelectSupplier={setSupplier} />
      ) : (
        <ProductsStep supplier={supplier} onBack={() => setSupplier(null)} />
      )}
    </div>
  );
}

export default PurchasePage;