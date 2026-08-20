import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Building2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { fetchBranches } from "./api/branchService";
import { fetchAdminRoles } from "./api/adminRoleService";
import { fetchBranchRoles } from "./api/branchRoleService";
import { storePermissions } from "./api/permissions";

const API_BASE = import.meta.env.VITE_API_URL;

// Set VITE_BRANCH_ID in a branch-specific frontend build's .env so only that
// branch's own staff can log in from it. Leave it unset/empty on the
// main (HQ) frontend build — that one is for Owner, Admin, and Main branch staff.
const FRONTEND_BRANCH_ID = import.meta.env.VITE_BRANCH_ID || null;

const USER_TYPES = [
  { value: "owner", label: "Owner", hint: "Full access" },
  { value: "admin", label: "Admin", hint: "Helper role" },
  { value: "branch", label: "Branch", hint: "Shop / godown staff" },
];

function Field({ icon: Icon, children }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
      {children}
    </div>
  );
}

function TextInput({ icon, type = "text", ...props }) {
  return (
    <Field icon={icon}>
      <input
        type={type}
        className="w-full rounded-md border border-stone-700 bg-stone-900/60 py-2.5 pl-10 pr-3 text-sm text-stone-100 placeholder-stone-500 outline-none transition focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/40"
        {...props}
      />
    </Field>
  );
}

function PasswordInput({ value, onChange, placeholder, name }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-md border border-stone-700 bg-stone-900/60 py-2.5 pl-10 pr-10 text-sm text-stone-100 placeholder-stone-500 outline-none transition focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/40"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
        tabIndex={-1}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function Ticket({ children }) {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 rounded-sm bg-amber-500/90" />
      <div className="rounded-lg border border-stone-800 bg-stone-900 shadow-2xl shadow-black/40">
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="mx-6 border-t border-dashed border-stone-700" />;
}

function StatusBanner({ status }) {
  if (!status) return null;
  const isError = status.type === "error";
  return (
    <div
      className={`mb-4 rounded-md border px-3 py-2 text-xs ${
        isError
          ? "border-red-900/60 bg-red-950/40 text-red-300"
          : "border-emerald-900/60 bg-emerald-950/40 text-emerald-300"
      }`}
    >
      {status.message}
    </div>
  );
}

function LoginForm({ onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrors({});

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(
          FRONTEND_BRANCH_ID ? { ...form, branch_id: FRONTEND_BRANCH_ID } : form
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || {});
        setStatus({
          type: "error",
          message: data.message || "Invalid credentials.",
        });
        return;
      }

      localStorage.setItem("token", data.token);

      const meRes = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
          Accept: "application/json",
        },
      });

      const me = await meRes.json();
      localStorage.setItem("user", JSON.stringify(me.user));
      storePermissions(me.permissions); // <-- আগে এটা discard হয়ে যেত

      setStatus({ type: "success", message: `Welcome ${me.user.name}` });
      onLoginSuccess && onLoginSuccess(me.user);
    } catch (err) {
      setStatus({
        type: "error",
        message: "Could not reach the server. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="p-6">
      <StatusBanner status={status} />

      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500">
        Email
      </label>
      <TextInput
        icon={Mail}
        name="email"
        type="email"
        placeholder="you@company.com"
        value={form.email}
        onChange={update}
        required
      />
      {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email[0]}</p>}

      <label className="mb-1 mt-4 block text-xs font-medium uppercase tracking-wide text-stone-500">
        Password
      </label>
      <PasswordInput
        name="password"
        placeholder="••••••••"
        value={form.password}
        onChange={update}
      />
      {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password[0]}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-amber-500 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-400 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>Sign in <ArrowRight className="h-4 w-4" /></>)}
      </button>

      {/* self-registration link সরিয়ে দেওয়া হলো — শুধু admin/owner Topbar থেকে account বানাতে পারবে */}
    </form>
  );
}

export function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    user_type: "branch",
    branch_id: "",
    admin_role_id: "",
    branch_role_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Dropdown data
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);

  const [adminRoles, setAdminRoles] = useState([]);
  const [adminRolesLoading, setAdminRolesLoading] = useState(false);

  const [branchRoles, setBranchRoles] = useState([]);
  const [branchRolesLoading, setBranchRolesLoading] = useState(false);

  // Load branches — jokhon "branch" OR "admin" type select kora hoy
  useEffect(() => {
    if (form.user_type !== "branch" && form.user_type !== "admin") return;
    let active = true;
    setBranchesLoading(true);
    fetchBranches()
      .then((data) => {
        if (!active) return;
        setBranches(data?.data || data || []);
      })
      .catch((err) => console.error("Failed to load branches:", err))
      .finally(() => active && setBranchesLoading(false));
    return () => {
      active = false;
    };
  }, [form.user_type]);

  // Load admin roles — jokhon "admin" type select kora hoy
  useEffect(() => {
    if (form.user_type !== "admin") return;
    let active = true;
    setAdminRolesLoading(true);
    fetchAdminRoles()
      .then((data) => {
        if (!active) return;
        setAdminRoles(data?.data || data || []);
      })
      .catch((err) => console.error("Failed to load admin roles:", err))
      .finally(() => active && setAdminRolesLoading(false));
    return () => {
      active = false;
    };
  }, [form.user_type]);

  // Load branch roles — jokhon "branch" type select kora hoy
  useEffect(() => {
    if (form.user_type !== "branch") return;
    let active = true;
    setBranchRolesLoading(true);
    fetchBranchRoles()
      .then((data) => {
        if (!active) return;
        setBranchRoles(data?.data || data || []);
      })
      .catch((err) => console.error("Failed to load branch roles:", err))
      .finally(() => active && setBranchRolesLoading(false));
    return () => {
      active = false;
    };
  }, [form.user_type]);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const pickType = (value) => setForm({ ...form, user_type: value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrors({});
    try {
      const payload = {
        ...form,
        branch_id: form.branch_id || null,
        admin_role_id: form.admin_role_id || null,
        branch_role_id: form.branch_role_id || null,
      };
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || {});
        setStatus({ type: "error", message: data.message || "Registration failed." });
        return;
      }
      setStatus({ type: "success", message: `Account created for ${form.name}.` });
      setForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        user_type: "branch",
        branch_id: "",
        admin_role_id: "",
        branch_role_id: "",
      });
      onSuccess && onSuccess(data);
    } catch {
      setStatus({ type: "error", message: "Could not reach the server. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="p-6">
      <StatusBanner status={status} />

      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500">Full name</label>
      <TextInput icon={User} name="name" placeholder="Rahim Uddin" value={form.name} onChange={update} required />
      {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name[0]}</p>}

      <label className="mb-1 mt-4 block text-xs font-medium uppercase tracking-wide text-stone-500">Email</label>
      <TextInput icon={Mail} name="email" type="email" placeholder="you@company.com" value={form.email} onChange={update} required />
      {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email[0]}</p>}

      <label className="mb-1 mt-4 block text-xs font-medium uppercase tracking-wide text-stone-500">Password</label>
      <PasswordInput name="password" placeholder="Min. 6 characters" value={form.password} onChange={update} />
      {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password[0]}</p>}

      <label className="mb-1 mt-4 block text-xs font-medium uppercase tracking-wide text-stone-500">Confirm password</label>
      <PasswordInput name="password_confirmation" placeholder="Repeat password" value={form.password_confirmation} onChange={update} />

      <label className="mb-2 mt-5 block text-xs font-medium uppercase tracking-wide text-stone-500">Account type</label>
      <div className="grid grid-cols-3 gap-2">
        {USER_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => pickType(t.value)}
            className={`rounded-md border px-2 py-2 text-left transition ${
              form.user_type === t.value ? "border-amber-500 bg-amber-500/10" : "border-stone-700 bg-stone-900/60 hover:border-stone-600"
            }`}
          >
            <div className={`text-xs font-semibold ${form.user_type === t.value ? "text-amber-400" : "text-stone-200"}`}>{t.label}</div>
            <div className="text-[10px] text-stone-500">{t.hint}</div>
          </button>
        ))}
      </div>
      {errors.user_type && <p className="mt-1 text-xs text-red-400">{errors.user_type[0]}</p>}

      {form.user_type === "branch" && (
        <>
          <label className="mb-1 mt-4 block text-xs font-medium uppercase tracking-wide text-stone-500">
            Branch
          </label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
            <select
              name="branch_id"
              value={form.branch_id}
              onChange={update}
              className="w-full appearance-none rounded-md border border-stone-700 bg-stone-900/60 py-2.5 pl-10 pr-3 text-sm text-stone-100 outline-none transition focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/40"
            >
              <option value="" disabled>
                {branchesLoading ? "Loading branches…" : "Select a branch"}
              </option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          {errors.branch_id && <p className="mt-1 text-xs text-red-400">{errors.branch_id[0]}</p>}

          <label className="mb-1 mt-4 block text-xs font-medium uppercase tracking-wide text-stone-500">
            Branch role
          </label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
            <select
              name="branch_role_id"
              value={form.branch_role_id}
              onChange={update}
              className="w-full appearance-none rounded-md border border-stone-700 bg-stone-900/60 py-2.5 pl-10 pr-3 text-sm text-stone-100 outline-none transition focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/40"
            >
              <option value="" disabled>
                {branchRolesLoading ? "Loading roles…" : "Select a branch role"}
              </option>
              {branchRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          {errors.branch_role_id && <p className="mt-1 text-xs text-red-400">{errors.branch_role_id[0]}</p>}
        </>
      )}

      {form.user_type === "admin" && (
        <>
          <label className="mb-1 mt-4 block text-xs font-medium uppercase tracking-wide text-stone-500">
            Admin role
          </label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
            <select
              name="admin_role_id"
              value={form.admin_role_id}
              onChange={update}
              className="w-full appearance-none rounded-md border border-stone-700 bg-stone-900/60 py-2.5 pl-10 pr-3 text-sm text-stone-100 outline-none transition focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/40"
            >
              <option value="" disabled>
                {adminRolesLoading ? "Loading roles…" : "Select an admin role"}
              </option>
              {adminRoles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          {errors.admin_role_id && <p className="mt-1 text-xs text-red-400">{errors.admin_role_id[0]}</p>}

          <label className="mb-1 mt-4 block text-xs font-medium uppercase tracking-wide text-stone-500">
            Branch
          </label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
            <select
              name="branch_id"
              value={form.branch_id}
              onChange={update}
              className="w-full appearance-none rounded-md border border-stone-700 bg-stone-900/60 py-2.5 pl-10 pr-3 text-sm text-stone-100 outline-none transition focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/40"
            >
              <option value="" disabled>
                {branchesLoading ? "Loading branches…" : "Select a branch"}
              </option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          {errors.branch_id && <p className="mt-1 text-xs text-red-400">{errors.branch_id[0]}</p>}
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-amber-500 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-amber-400 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<>Create account <ArrowRight className="h-4 w-4" /></>)}
      </button>
    </form>
  );
}

export default function AuthPages({ onLoginSuccess }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950 px-4 py-10 font-sans">
      <div className="flex w-full max-w-md flex-col items-center">
        <div className="mb-6 flex items-center gap-2 text-stone-400">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-amber-500 font-mono text-sm font-bold text-stone-950">ST</div>
          <span className="font-mono text-xs uppercase tracking-[0.2em]">Stock Terminal</span>
        </div>

        <Ticket>
          <div className="px-6 pt-6">
            <h1 className="font-mono text-lg font-semibold text-stone-100">Sign in to your ledger</h1>
            <p className="mt-1 text-xs text-stone-500">
              Owner, admin, and branch accounts all use this door. New accounts are created by an admin from inside the dashboard.
            </p>
          </div>
          <div className="mt-4"><Divider /></div>
          <LoginForm onLoginSuccess={onLoginSuccess} />
        </Ticket>
      </div>
    </div>
  );
}