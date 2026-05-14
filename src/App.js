import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uvhqpglroxbolliumbcf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2aHFwZ2xyb3hib2xsaXVtYmNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMTQxMDYsImV4cCI6MjA5Mzc5MDEwNn0.nSlU5kOQHJYFiPiH7LU6kjcZZa4DWEoEBuxfnI6EVKE"
);

function fmt(n) {
  return new Intl.NumberFormat("es-PA", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n || 0);
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T12:00:00").toLocaleDateString("es-PA", { day: "2-digit", month: "short", year: "numeric" });
}
function daysLeft(endDate) {
  if (!endDate) return null;
  const diff = new Date(endDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function Btn({ children, variant = "primary", ...props }) {
  const variants = {
    primary:   { background: "#2563eb", color: "#fff", boxShadow: "0 2px 8px rgba(37,99,235,0.25)" },
    secondary: { background: "#f1f5f9", color: "#374151", border: "1.5px solid #e2e8f0" },
    danger:    { background: "#fef2f2", color: "#dc2626", border: "1.5px solid #fecaca" },
    success:   { background: "#f0fdf4", color: "#16a34a", border: "1.5px solid #bbf7d0" },
    info:      { background: "#eff6ff", color: "#2563eb", border: "1.5px solid #bfdbfe" },
    purple:    { background: "#f5f3ff", color: "#7c3aed", border: "1.5px solid #ddd6fe" },
    warning:   { background: "#fff7ed", color: "#c2410c", border: "1.5px solid #fed7aa" },
    dark:      { background: "#0f172a", color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" },
  };
  return (
    <button {...props} style={{ border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "opacity 0.15s, transform 0.1s", letterSpacing: "0.01em", ...variants[variant], ...props.style }}>
      {children}
    </button>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>}
      <input {...props} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none", color: "#0f172a", background: "#fff", boxSizing: "border-box", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "border-color 0.15s", ...props.style }} />
    </div>
  );
}

function Sel({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>}
      <select {...props} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none", color: "#0f172a", background: "#fff", boxSizing: "border-box", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        {children}
      </select>
    </div>
  );
}

function Modal({ open, onClose, title, children, maxWidth = 520 }) {
  if (!open) return null;
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 28, width: "100%", maxWidth, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.8)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, paddingBottom: 16, borderBottom: "1.5px solid #f1f5f9" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", letterSpacing: "-0.01em" }}>{title}</span>
          <button onClick={onClose} style={{ border: "none", background: "#f1f5f9", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Badge({ status }) {
  const map = {
    draft:        { bg: "#f1f5f9", color: "#64748b",  label: "Borrador" },
    open:         { bg: "#dbeafe", color: "#1d4ed8",  label: "Abierta" },
    funded:       { bg: "#fef9c3", color: "#854d0e",  label: "Fondeada" },
    active:       { bg: "#dcfce7", color: "#15803d",  label: "Activa" },
    completed:    { bg: "#e2e8f0", color: "#374151",  label: "Completada" },
    closed_early: { bg: "#fee2e2", color: "#991b1b",  label: "Cierre anticipado" },
    cancelled:    { bg: "#fef2f2", color: "#dc2626",  label: "Cancelada" },
    pending:      { bg: "#fef9c3", color: "#854d0e",  label: "Pendiente" },
    reinvested:   { bg: "#f5f3ff", color: "#6d28d9",  label: "Reinvertida" },
    exited_early: { bg: "#fee2e2", color: "#991b1b",  label: "Salida anticipada" },
    paid:         { bg: "#dcfce7", color: "#15803d",  label: "Pagado" },
    projected:    { bg: "#fef9c3", color: "#854d0e",  label: "Proyectado" },
  };
  const s = map[status] || { bg: "#f1f5f9", color: "#64748b", label: status };
  return <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.02em", display: "inline-flex", alignItems: "center", gap: 4 }}>{s.label}</span>;
}

function ProgressBar({ value, max, color = "#2563eb" }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div style={{ height: 7, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius: 999, transition: "width 0.6s ease" }} />
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, fontWeight: 500 }}>{pct.toFixed(0)}% fondeado</div>
    </div>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) setErr("Credenciales incorrectas. Verifica tu email y contraseña.");
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#1e40af 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter','DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(255,255,255,0.1)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid rgba(255,255,255,0.15)" }}>
            <span style={{ fontSize: 36 }}>💼</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: 0 }}>InvestAdmin</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 6 }}>Sistema de gestión de inversiones</p>
        </div>
        <div style={{ background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <Input label="Correo electrónico" type="email" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} placeholder="usuario@empresa.com" />
          <Input label="Contraseña" type="password" value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
          {err && <div style={{ color: "#dc2626", fontSize: 12, marginBottom: 12, padding: "8px 12px", background: "#fef2f2", borderRadius: 8 }}>⚠️ {err}</div>}
          <Btn onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: 13, fontSize: 14, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Verificando..." : "Iniciar sesión"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN: DASHBOARD ────────────────────────────────────────────────────────
function AdminDashboard({ onReload }) {
  const [stats, setStats] = useState({ capital: 0, invertido: 0, ganancias: 0, ordenes: 0 });
  const [vencimientos, setVencimientos] = useState([]);
  const [ordenesAbiertas, setOrdenesAbiertas] = useState([]);
  const [ordenesActivas, setOrdenesActivas] = useState([]);
  const [participacionesPorOrden, setParticipacionesPorOrden] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [onReload]);

  async function loadData() {
    setLoading(true);
    const [{ data: invs }, { data: ords }, { data: parts }, { data: earns }] = await Promise.all([
      supabase.from("investor_summary").select("*"),
      supabase.from("order_summary").select("*"),
      supabase.from("participation_detail").select("*").in("status", ["active", "pending"]),
      supabase.from("earnings").select("*").eq("status", "paid"),
    ]);
    const capital = (invs || []).reduce((a, b) => a + parseFloat(b.available_balance || 0) + parseFloat(b.total_invested || 0), 0);
    const invertido = (invs || []).reduce((a, b) => a + parseFloat(b.total_invested || 0), 0);
    const ganancias = (earns || []).reduce((a, b) => a + parseFloat(b.interest_earned || 0), 0);
    const nOrdenesActivas = (ords || []).filter(o => ["active", "open", "funded"].includes(o.status)).length;
    setStats({ capital, invertido, ganancias, ordenes: nOrdenesActivas });

    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const en30 = new Date(hoy); en30.setDate(en30.getDate() + 30);
    const venc = (parts || []).filter(p => {
      if (!p.end_date || p.status !== "active") return false;
      const d = new Date(p.end_date);
      return d >= hoy && d <= en30;
    }).sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
    setVencimientos(venc);
    setOrdenesAbiertas((ords || []).filter(o => o.status === "open"));

    // Órdenes activas con sus participantes
    const activas = (ords || []).filter(o => o.status === "active");
    setOrdenesActivas(activas);
    const porOrden = {};
    (parts || []).filter(p => p.status === "active").forEach(p => {
      if (!porOrden[p.order_id]) porOrden[p.order_id] = [];
      porOrden[p.order_id].push(p);
    });
    setParticipacionesPorOrden(porOrden);
    setLoading(false);
  }

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Cargando dashboard...</div>;

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 24, letterSpacing: "-0.03em" }}>Dashboard General</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Capital total gestionado", val: fmt(stats.capital), icon: "💰", color: "#2563eb", bg: "#eff6ff" },
          { label: "Capital invertido activo", val: fmt(stats.invertido), icon: "📈", color: "#7c3aed", bg: "#f5f3ff" },
          { label: "Ganancias pagadas", val: fmt(stats.ganancias), icon: "✅", color: "#16a34a", bg: "#f0fdf4" },
          { label: "Órdenes activas", val: stats.ordenes, icon: "📋", color: "#f59e0b", bg: "#fffbeb" },
        ].map(k => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 16, padding: "22px", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: k.color, letterSpacing: "-0.5px", lineHeight: 1 }}>{k.val}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 5, fontWeight: 500 }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {vencimientos.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 14 }}>⏰ Próximos vencimientos (30 días)</div>
          <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  {["Inversionista", "Orden", "Empresa", "Capital", "Ganancia est.", "Vence", "Días rest."].map(h => (
                    <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vencimientos.map((v, i) => {
                  const dias = daysLeft(v.end_date);
                  return (
                    <tr key={v.participation_id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                      <td style={{ padding: "11px 14px", fontWeight: 600 }}>{v.investor_name}</td>
                      <td style={{ padding: "11px 14px", color: "#64748b" }}>{v.order_title}</td>
                      <td style={{ padding: "11px 14px", color: "#64748b" }}>{v.target_company}</td>
                      <td style={{ padding: "11px 14px", fontWeight: 600 }}>{fmt(v.amount)}</td>
                      <td style={{ padding: "11px 14px", color: "#16a34a", fontWeight: 600 }}>{fmt(v.projected_earnings)}</td>
                      <td style={{ padding: "11px 14px" }}>{fmtDate(v.end_date)}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ background: dias <= 7 ? "#fee2e2" : "#fef9c3", color: dias <= 7 ? "#991b1b" : "#854d0e", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                          {dias} días
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {ordenesAbiertas.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 14 }}>📂 Órdenes abiertas</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
            {ordenesAbiertas.map(o => (
              <div key={o.id} style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1.5px solid #e2e8f0" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 4 }}>{o.title}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>{o.target_company} · {o.term_months} meses · {(parseFloat(o.interest_rate) * 100).toFixed(1)}%</div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "#64748b" }}>{fmt(o.funded_amount)} de {fmt(o.required_amount)}</span>
                    <span style={{ fontWeight: 700, color: "#2563eb" }}>{parseFloat(o.funding_percentage || 0).toFixed(0)}%</span>
                  </div>
                  <ProgressBar value={parseFloat(o.funded_amount)} max={parseFloat(o.required_amount)} />
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{o.participant_count || 0} inversionistas · {fmt(o.remaining_amount)} disponibles</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ÓRDENES ACTIVAS CON PARTICIPANTES */}
      {ordenesActivas.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 14 }}>🔒 Órdenes activas</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {ordenesActivas.map(o => {
              const parts = participacionesPorOrden[o.id] || [];
              const totalInvertido = parts.reduce((a, b) => a + parseFloat(b.amount || 0), 0);
              const interesTotal = totalInvertido * parseFloat(o.interest_rate || 0);
              const interesMensual = interesTotal / parseFloat(o.term_months || 1);
              return (
                <div key={o.id} style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #dcfce7", overflow: "hidden" }}>
                  <div style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{o.title}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{o.target_company} · {o.term_months} meses · {(parseFloat(o.interest_rate) * 100).toFixed(1)}% · Vence {fmtDate(o.end_date)}</div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Capital</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{fmt(totalInvertido)}</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Interés/mes</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#16a34a" }}>{fmt(interesMensual)}</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Días rest.</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: daysLeft(o.end_date) <= 30 ? "#dc2626" : "#f59e0b" }}>{daysLeft(o.end_date)}</div>
                      </div>
                    </div>
                  </div>
                  {parts.length > 0 && (
                    <div style={{ padding: "12px 20px" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>{parts.length} inversionista{parts.length > 1 ? "s" : ""}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {parts.map(p => (
                          <div key={p.participation_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#f8fafc", borderRadius: 10 }}>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{p.investor_name}</div>
                            <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                              <span style={{ color: "#64748b" }}>Capital: <strong>{fmt(p.amount)}</strong></span>
                              <span style={{ color: "#16a34a" }}>Int/mes: <strong>{fmt(parseFloat(p.amount) * parseFloat(p.interest_rate) / parseFloat(o.term_months || 1))}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN: ÓRDENES ──────────────────────────────────────────────────────────
function AdminOrdenes({ profileId }) {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("all");
  const [modalNueva, setModalNueva] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [form, setForm] = useState({ title: "", target_company: "", description: "", required_amount: "", interest_rate: "", term_months: "", minimum_amount: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => { loadOrdenes(); }, []);

  async function loadOrdenes() {
    setLoading(true);
    const { data } = await supabase.from("order_summary").select("*").order("created_at", { ascending: false });
    setOrdenes(data || []);
    setLoading(false);
  }

  async function uploadImagen(file) {
    const ext = file.name.split(".").pop();
    const path = `orders/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("order-images").upload(path, file, { contentType: file.type });
    if (error) throw error;
    return `${supabase.storageUrl}/object/public/order-images/${path}`;
  }

  function handleImgFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setImgFile(f);
    setImgPreview(URL.createObjectURL(f));
  }

  function handleImgPaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let item of items) {
      if (item.type.startsWith("image/")) {
        const f = item.getAsFile();
        setImgFile(f);
        setImgPreview(URL.createObjectURL(f));
        break;
      }
    }
  }

  async function crearOrden(publicar = false) {
    setErr("");
    if (!form.title || !form.target_company || !form.required_amount || !form.interest_rate || !form.term_months) {
      setErr("Completa todos los campos obligatorios."); return;
    }
    setSaving(true);
    let imagen_url = null;
    if (imgFile) {
      try { imagen_url = await uploadImagen(imgFile); } catch(e) { console.error(e); }
    }
    const { error } = await supabase.from("investment_orders").insert({
      title: form.title,
      target_company: form.target_company,
      description: form.description,
      required_amount: parseFloat(form.required_amount),
      interest_rate: parseFloat(form.interest_rate) / 100,
      term_months: parseInt(form.term_months),
      minimum_amount: parseFloat(form.minimum_amount || 0),
      status: publicar ? "open" : "draft",
      created_by: profileId,
      code: "",
      imagen_url,
    });
    if (error) { setErr("Error al crear orden."); setSaving(false); return; }
    setModalNueva(false);
    setForm({ title: "", target_company: "", description: "", required_amount: "", interest_rate: "", term_months: "", minimum_amount: "" });
    setImgFile(null); setImgPreview(null);
    loadOrdenes();
    setSaving(false);
  }

  async function cambiarEstado(orden, nuevoEstado, extra = {}) {
    await supabase.from("investment_orders").update({ status: nuevoEstado, ...extra }).eq("id", orden.id);
    loadOrdenes();
    if (modalDetalle?.id === orden.id) setModalDetalle({ ...modalDetalle, status: nuevoEstado, ...extra });
  }

  async function activarOrden(orden) {
    const startDate = prompt("Fecha de inicio (YYYY-MM-DD):", new Date().toISOString().split("T")[0]);
    if (!startDate) return;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(orden.term_months));
    const endStr = endDate.toISOString().split("T")[0];
    await supabase.from("investment_orders").update({ status: "active", start_date: startDate, end_date: endStr }).eq("id", orden.id);
    await supabase.from("participations").update({ status: "active", start_date: startDate, end_date: endStr }).eq("order_id", orden.id).eq("status", "pending");
    loadOrdenes();
  }

  const filtradas = filtro === "all" ? ordenes : ordenes.filter(o => o.status === filtro);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", letterSpacing: "-0.03em" }}>Órdenes de Inversión</div>
        <Btn onClick={() => setModalNueva(true)}>+ Nueva orden</Btn>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[["all","Todas"], ["draft","Borradores"], ["open","Abiertas"], ["funded","Fondeadas"], ["active","Activas"], ["completed","Completadas"]].map(([val, lbl]) => (
          <button key={val} onClick={() => setFiltro(val)}
            style={{ border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: filtro === val ? "#0f172a" : "#f1f5f9", color: filtro === val ? "#fff" : "#64748b" }}>
            {lbl}
          </button>
        ))}
      </div>

      {loading ? <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Cargando...</div> : (
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Código", "Orden", "Empresa", "Monto", "Tasa", "Plazo", "Fondeo", "Estado", ""].map(h => (
                  <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((o, i) => (
                <tr key={o.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                  <td style={{ padding: "11px 14px", fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{o.code}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 600 }}>{o.title}</td>
                  <td style={{ padding: "11px 14px", color: "#64748b" }}>{o.target_company}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 600 }}>{fmt(o.required_amount)}</td>
                  <td style={{ padding: "11px 14px", color: "#16a34a", fontWeight: 600 }}>{(parseFloat(o.interest_rate) * 100).toFixed(1)}%</td>
                  <td style={{ padding: "11px 14px" }}>{o.term_months} meses</td>
                  <td style={{ padding: "11px 14px", minWidth: 120 }}>
                    <ProgressBar value={parseFloat(o.funded_amount || 0)} max={parseFloat(o.required_amount)} />
                  </td>
                  <td style={{ padding: "11px 14px" }}><Badge status={o.status} /></td>
                  <td style={{ padding: "11px 14px" }}>
                    <Btn variant="info" style={{ padding: "5px 12px", fontSize: 11 }} onClick={() => setModalDetalle(o)}>Ver</Btn>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No hay órdenes</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalNueva} onClose={() => { setModalNueva(false); setErr(""); }} title="Nueva orden de inversión">
        <Input label="Nombre de la orden *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Ej: Expansión Tech Retail S.A." />
        <Input label="Empresa / Proyecto destino *" value={form.target_company} onChange={e => setForm(p => ({ ...p, target_company: e.target.value }))} placeholder="Ej: Tech Retail S.A." />
        <Input label="Descripción (opcional)" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Detalles de la inversión..." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Monto requerido ($) *" type="number" value={form.required_amount} onChange={e => setForm(p => ({ ...p, required_amount: e.target.value }))} placeholder="100000" />
          <Input label="Monto mínimo por inversionista ($)" type="number" value={form.minimum_amount} onChange={e => setForm(p => ({ ...p, minimum_amount: e.target.value }))} placeholder="1000" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Tasa de interés (%) *" type="number" value={form.interest_rate} onChange={e => setForm(p => ({ ...p, interest_rate: e.target.value }))} placeholder="12" />
          <Input label="Plazo (meses) *" type="number" value={form.term_months} onChange={e => setForm(p => ({ ...p, term_months: e.target.value }))} placeholder="6" />
        </div>
        {form.required_amount && form.interest_rate && (
          <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#15803d" }}>
            💡 Ganancias máximas a pagar: <strong>{fmt(parseFloat(form.required_amount || 0) * parseFloat(form.interest_rate || 0) / 100)}</strong>
          </div>
        )}
        {/* IMAGEN */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Imagen de la orden (opcional)</div>
          <div
            onClick={() => imgRef.current?.click()}
            onPaste={handleImgPaste}
            tabIndex={0}
            style={{ border: "2px dashed #e2e8f0", borderRadius: 12, padding: imgPreview ? 4 : 20, textAlign: "center", cursor: "pointer", background: "#fafafa", minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center", outline: "none" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#7c3aed"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
          >
            {imgPreview
              ? <img src={imgPreview} alt="preview" style={{ maxHeight: 160, maxWidth: "100%", borderRadius: 8, objectFit: "cover" }} />
              : <div>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Clic para buscar imagen</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>o pega una captura con Ctrl+V</div>
                </div>
            }
          </div>
          <input ref={imgRef} type="file" accept="image/*" onChange={handleImgFile} style={{ display: "none" }} />
          {imgPreview && (
            <button onClick={() => { setImgFile(null); setImgPreview(null); }}
              style={{ marginTop: 6, border: "none", background: "#fef2f2", color: "#dc2626", borderRadius: 8, padding: "4px 12px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
              ✕ Quitar imagen
            </button>
          )}
        </div>
        {err && <div style={{ color: "#dc2626", fontSize: 12, marginBottom: 12, padding: "8px 12px", background: "#fef2f2", borderRadius: 8 }}>⚠️ {err}</div>}
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary" onClick={() => setModalNueva(false)} style={{ flex: 1 }}>Cancelar</Btn>
          <Btn variant="secondary" onClick={() => crearOrden(false)} disabled={saving} style={{ flex: 1 }}>Guardar borrador</Btn>
          <Btn onClick={() => crearOrden(true)} disabled={saving} style={{ flex: 1 }}>Publicar ahora</Btn>
        </div>
      </Modal>

      {modalDetalle && (
        <ModalDetalleOrden orden={modalDetalle} onClose={() => setModalDetalle(null)} onActivar={activarOrden} onCambiarEstado={cambiarEstado} onReload={loadOrdenes} />
      )}
    </div>
  );
}

function ModalDetalleOrden({ orden, onClose, onActivar, onCambiarEstado, onReload }) {
  const [participaciones, setParticipaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordenActual, setOrdenActual] = useState(orden);
  const [modalPago, setModalPago] = useState(null);

  useEffect(() => { loadParticipaciones(); }, []);

  async function loadParticipaciones() {
    setLoading(true);
    const { data } = await supabase.from("participation_detail").select("*").eq("order_id", orden.id);
    setParticipaciones(data || []);
    const { data: ord } = await supabase.from("order_summary").select("*").eq("id", orden.id).single();
    if (ord) setOrdenActual(ord);
    setLoading(false);
  }

  async function procesarPago(part, reinvertir = false) {
    const interest = parseFloat(part.amount) * parseFloat(part.interest_rate);
    const total = parseFloat(part.amount) + interest;
    if (!reinvertir) {
      await supabase.rpc("record_capital_movement", {
        p_investor_id: part.investor_id,
        p_amount: total,
        p_type: "investment_return",
        p_description: `Devolución capital + intereses orden ${ordenActual.code}`,
        p_participation_id: part.participation_id,
      });
      await supabase.from("earnings").insert({
        participation_id: part.participation_id,
        investor_id: part.investor_id,
        principal: parseFloat(part.amount),
        interest_earned: interest,
        type: "maturity",
        payout_date: new Date().toISOString().split("T")[0],
        status: "paid",
      });
      await supabase.from("participations").update({ status: "completed" }).eq("id", part.participation_id);
    }
    setModalPago(null);
    loadParticipaciones();
    onReload();
  }

  async function cerrarOrdenAnticipado() {
    if (!window.confirm(`¿Cerrar anticipadamente la orden ${ordenActual.code}?`)) return;
    const closeDate = new Date().toISOString().split("T")[0];
    await supabase.from("investment_orders").update({ status: "closed_early", closed_at: new Date().toISOString() }).eq("id", ordenActual.id);
    setOrdenActual({ ...ordenActual, status: "closed_early" });
    onReload();
  }

  return (
    <Modal open={true} onClose={onClose} title={`Orden: ${ordenActual.code}`} maxWidth={700}>
      {ordenActual.imagen_url && (
        <img src={ordenActual.imagen_url} alt={ordenActual.title}
          style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12, marginBottom: 16 }} />
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Empresa", val: ordenActual.target_company },
          { label: "Estado", val: <Badge status={ordenActual.status} /> },
          { label: "Monto requerido", val: fmt(ordenActual.required_amount) },
          { label: "Fondeado", val: fmt(ordenActual.funded_amount) },
          { label: "Tasa", val: `${(parseFloat(ordenActual.interest_rate) * 100).toFixed(1)}%` },
          { label: "Plazo", val: `${ordenActual.term_months} meses` },
          { label: "Inicio", val: fmtDate(ordenActual.start_date) },
          { label: "Vencimiento", val: fmtDate(ordenActual.end_date) },
        ].map(r => (
          <div key={r.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{r.label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{r.val}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <ProgressBar value={parseFloat(ordenActual.funded_amount || 0)} max={parseFloat(ordenActual.required_amount)} color="#2563eb" />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {ordenActual.status === "draft" && <Btn onClick={() => onCambiarEstado(ordenActual, "open")} style={{ flex: 1 }}>Publicar orden</Btn>}
        {ordenActual.status === "funded" && <Btn variant="success" onClick={() => onActivar(ordenActual)} style={{ flex: 1 }}>✅ Activar orden</Btn>}
        {ordenActual.status === "active" && <Btn variant="danger" onClick={cerrarOrdenAnticipado} style={{ flex: 1 }}>Cerrar anticipadamente</Btn>}
      </div>

      <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 12 }}>Participaciones ({participaciones.length})</div>
      {loading ? <div style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>Cargando...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {participaciones.map(p => (
            <div key={p.participation_id} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{p.investor_name}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{fmt(p.amount)} · {(parseFloat(p.interest_rate) * 100).toFixed(1)}% · vence {fmtDate(p.end_date)}</div>
                <div style={{ fontSize: 12, color: "#16a34a", marginTop: 2 }}>Ganancia proyectada: {fmt(p.projected_earnings)}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Badge status={p.status} />
                {(ordenActual.status === "active" || ordenActual.status === "closed_early" || ordenActual.status === "completed") && p.status === "active" && (
                  <Btn variant="success" style={{ padding: "5px 12px", fontSize: 11 }} onClick={() => setModalPago(p)}>Procesar pago</Btn>
                )}
              </div>
            </div>
          ))}
          {participaciones.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>Sin participaciones aún</div>}
        </div>
      )}

      {modalPago && (
        <Modal open={true} onClose={() => setModalPago(null)} title="Procesar pago" maxWidth={420}>
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{modalPago.investor_name}</div>
            {[
              ["Capital invertido", fmt(modalPago.amount)],
              ["Tasa pactada", `${(parseFloat(modalPago.interest_rate) * 100).toFixed(1)}%`],
              ["Ganancia a pagar", fmt(parseFloat(modalPago.amount) * parseFloat(modalPago.interest_rate))],
              ["Total a devolver", fmt(parseFloat(modalPago.amount) * (1 + parseFloat(modalPago.interest_rate)))],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "5px 0", borderBottom: "1px solid #e2e8f0" }}>
                <span style={{ color: "#64748b" }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" onClick={() => setModalPago(null)} style={{ flex: 1 }}>Cancelar</Btn>
            <Btn variant="success" onClick={() => procesarPago(modalPago, false)} style={{ flex: 1 }}>💰 Devolver capital</Btn>
          </div>
        </Modal>
      )}
    </Modal>
  );
}

// ─── ADMIN: INVERSIONISTAS ───────────────────────────────────────────────────
function AdminInversionistas() {
  const [inversores, setInversores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalDeposito, setModalDeposito] = useState(null);
  const [deposito, setDeposito] = useState({ monto: "", descripcion: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadInversores(); }, []);

  async function loadInversores() {
    setLoading(true);
    const { data } = await supabase.from("investor_summary").select("*").order("full_name");
    setInversores(data || []);
    setLoading(false);
  }

  async function registrarDeposito(tipo = "deposit") {
    if (!deposito.monto || !deposito.descripcion) return;
    setSaving(true);
    const monto = tipo === "deposit" ? parseFloat(deposito.monto) : -parseFloat(deposito.monto);
    await supabase.rpc("record_capital_movement", {
      p_investor_id: modalDeposito.investor_id,
      p_amount: monto,
      p_type: tipo === "deposit" ? "deposit" : "withdrawal",
      p_description: deposito.descripcion,
    });
    setModalDeposito(null);
    setDeposito({ monto: "", descripcion: "" });
    loadInversores();
    setSaving(false);
  }

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 24, letterSpacing: "-0.03em" }}>Inversionistas</div>
      {loading ? <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Cargando...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
          {inversores.map(inv => (
            <div key={inv.investor_id} style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1.5px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{inv.full_name}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{inv.email}</div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#f5f3ff", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>
                  {inv.full_name?.[0]}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Balance disponible", val: fmt(inv.available_balance), color: "#7c3aed" },
                  { label: "Capital invertido", val: fmt(inv.total_invested), color: "#0ea5e9" },
                  { label: "Ganancias totales", val: fmt(inv.total_earnings), color: "#16a34a" },
                  { label: "Inversiones activas", val: inv.active_investments || 0, color: "#f59e0b" },
                ].map(m => (
                  <div key={m.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3, textTransform: "uppercase" }}>{m.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.val}</div>
                  </div>
                ))}
              </div>
              {inv.banco && (
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: "8px 12px", marginBottom: 10, fontSize: 12 }}>
                  <span style={{ color: "#94a3b8" }}>Banco: </span><strong>{inv.banco}</strong>
                  {inv.cuenta_bancaria && <span style={{ color: "#94a3b8", marginLeft: 8 }}>Cuenta: </span>}
                  {inv.cuenta_bancaria && <strong>****{inv.cuenta_bancaria.slice(-4)}</strong>}
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="info" style={{ flex: 1, fontSize: 12 }} onClick={() => setModalDetalle(inv)}>Ver detalle</Btn>
                <Btn variant="success" style={{ flex: 1, fontSize: 12 }} onClick={() => { setModalDeposito(inv); setDeposito({ monto: "", descripcion: "" }); }}>+ Depósito</Btn>
              </div>
            </div>
          ))}
          {inversores.length === 0 && (
            <div style={{ gridColumn: "1/-1", padding: 60, textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>No hay inversionistas registrados</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Crea usuarios desde Supabase Auth y asígnales rol 'investor'</div>
            </div>
          )}
        </div>
      )}

      {modalDetalle && <ModalDetalleInversor inv={modalDetalle} onClose={() => setModalDetalle(null)} />}

      <Modal open={!!modalDeposito} onClose={() => setModalDeposito(null)} title={`Registrar movimiento — ${modalDeposito?.full_name}`} maxWidth={420}>
        <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#15803d" }}>
          Balance actual: <strong>{fmt(modalDeposito?.available_balance)}</strong>
        </div>
        <Input label="Monto ($)" type="number" value={deposito.monto} onChange={e => setDeposito(p => ({ ...p, monto: e.target.value }))} placeholder="5000" />
        <Input label="Descripción / Referencia" value={deposito.descripcion} onChange={e => setDeposito(p => ({ ...p, descripcion: e.target.value }))} placeholder="Ej: Transferencia #12345" />
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary" onClick={() => setModalDeposito(null)} style={{ flex: 1 }}>Cancelar</Btn>
          <Btn variant="danger" onClick={() => registrarDeposito("withdrawal")} disabled={saving} style={{ flex: 1 }}>↓ Retiro</Btn>
          <Btn variant="success" onClick={() => registrarDeposito("deposit")} disabled={saving} style={{ flex: 1 }}>↑ Depósito</Btn>
        </div>
      </Modal>
    </div>
  );
}

function ModalDetalleInversor({ inv, onClose }) {
  const [participaciones, setParticipaciones] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [tab, setTab] = useState("inversiones");
  const [loading, setLoading] = useState(true);
  const [editBanco, setEditBanco] = useState(false);
  const [banco, setBanco] = useState(inv.banco || "");
  const [cuenta, setCuenta] = useState(inv.cuenta_bancaria || "");
  const [savingBanco, setSavingBanco] = useState(false);
  const [modalComprobante, setModalComprobante] = useState(null);
  const [comprobanteFile, setComprobanteFile] = useState(null);
  const [comprobantePreview, setComprobantePreview] = useState(null);
  const [savingComp, setSavingComp] = useState(false);
  const compRef = useRef(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: parts }, { data: movs }, { data: pags }] = await Promise.all([
      supabase.from("participation_detail").select("*").eq("investor_id", inv.investor_id).order("created_at", { ascending: false }),
      supabase.from("capital_movements").select("*").eq("investor_id", inv.investor_id).order("created_at", { ascending: false }),
      supabase.from("pagos_mensuales").select("*").eq("investor_id", inv.investor_id).order("anio,mes"),
    ]);
    setParticipaciones(parts || []);
    setMovimientos(movs || []);
    setPagos(pags || []);
    setLoading(false);
  }

  async function guardarBanco() {
    setSavingBanco(true);
    await supabase.from("profiles").update({ banco, cuenta_bancaria: cuenta }).eq("id", inv.investor_id);
    setEditBanco(false);
    setSavingBanco(false);
  }

  function handleCompFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setComprobanteFile(f);
    setComprobantePreview(URL.createObjectURL(f));
  }

  async function subirComprobante(pago) {
    if (!comprobanteFile) return;
    setSavingComp(true);
    const ext = comprobanteFile.name.split(".").pop();
    const path = `pagos/${pago.id}_${Date.now()}.${ext}`;
    await supabase.storage.from("comprobantes").upload(path, comprobanteFile, { contentType: comprobanteFile.type });
    const url = `${supabase.storageUrl}/object/public/comprobantes/${path}`;
    await supabase.from("pagos_mensuales").update({
      comprobante_url: url,
      status: "pagado",
      fecha_pago: new Date().toISOString().split("T")[0],
    }).eq("id", pago.id);
    setModalComprobante(null);
    setComprobanteFile(null);
    setComprobantePreview(null);
    loadData();
    setSavingComp(false);
  }

  const mesesNombre = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  return (
    <Modal open={true} onClose={onClose} title={inv.full_name} maxWidth={720}>
      {/* MÉTRICAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Balance disponible", val: fmt(inv.available_balance), color: "#7c3aed" },
          { label: "Capital invertido", val: fmt(inv.total_invested), color: "#0ea5e9" },
          { label: "Ganancias totales", val: fmt(inv.total_earnings), color: "#16a34a" },
        ].map(m => (
          <div key={m.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4, textTransform: "uppercase" }}>{m.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* CUENTA BANCARIA */}
      <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editBanco ? 12 : 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>🏦 Datos bancarios</div>
          <Btn variant="secondary" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => setEditBanco(p => !p)}>
            {editBanco ? "Cancelar" : "Editar"}
          </Btn>
        </div>
        {editBanco ? (
          <div>
            <Input label="Banco" value={banco} onChange={e => setBanco(e.target.value)} placeholder="Ej: Banco General" />
            <Input label="Número de cuenta" value={cuenta} onChange={e => setCuenta(e.target.value)} placeholder="Ej: 04-12-345678-9" />
            <Btn onClick={guardarBanco} disabled={savingBanco} style={{ width: "100%" }}>{savingBanco ? "Guardando..." : "Guardar"}</Btn>
          </div>
        ) : (
          <div style={{ fontSize: 13, marginTop: 4 }}>
            {inv.banco ? (
              <span><strong>{inv.banco}</strong> — Cuenta: <strong>{inv.cuenta_bancaria ? `****${inv.cuenta_bancaria.slice(-4)}` : "—"}</strong></span>
            ) : (
              <span style={{ color: "#94a3b8" }}>Sin datos bancarios registrados</span>
            )}
          </div>
        )}
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1.5px solid #e2e8f0", marginBottom: 16 }}>
        {[["inversiones","Inversiones"], ["pagos","Pagos mensuales"], ["movimientos","Movimientos"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ border: "none", background: "transparent", padding: "8px 14px", cursor: "pointer", fontSize: 12,
              fontWeight: tab === id ? 700 : 400, color: tab === id ? "#0f172a" : "#94a3b8",
              borderBottom: tab === id ? "2.5px solid #0f172a" : "2.5px solid transparent", marginBottom: -1.5 }}>
            {lbl}
            {id === "pagos" && pagos.filter(p => p.status === "pendiente").length > 0 && (
              <span style={{ background: "#ef4444", color: "#fff", borderRadius: 20, padding: "1px 6px", fontSize: 9, fontWeight: 700, marginLeft: 4 }}>
                {pagos.filter(p => p.status === "pendiente").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? <div style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>Cargando...</div> : (
        <>
          {tab === "inversiones" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {participaciones.map(p => (
                <div key={p.participation_id} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{p.order_title}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{p.target_company}</div>
                    </div>
                    <Badge status={p.status} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 10 }}>
                    <div><div style={{ fontSize: 10, color: "#94a3b8" }}>Capital</div><div style={{ fontSize: 13, fontWeight: 700 }}>{fmt(p.amount)}</div></div>
                    <div><div style={{ fontSize: 10, color: "#94a3b8" }}>Tasa</div><div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>{(parseFloat(p.interest_rate) * 100).toFixed(1)}%</div></div>
                    <div><div style={{ fontSize: 10, color: "#94a3b8" }}>Ganancia est.</div><div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>{fmt(p.projected_earnings)}</div></div>
                  </div>
                  {p.end_date && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>Vence: {fmtDate(p.end_date)}</div>}
                </div>
              ))}
              {participaciones.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>Sin inversiones</div>}
            </div>
          )}

          {tab === "pagos" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pagos.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", color: "#94a3b8" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
                  <div>Sin pagos mensuales registrados aún</div>
                </div>
              ) : pagos.map(p => (
                <div key={p.id} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{mesesNombre[p.mes - 1]} {p.anio}</div>
                    <div style={{ fontSize: 12, color: "#16a34a", marginTop: 2 }}>Interés: {fmt(p.monto_interes)}</div>
                    {p.fecha_pago && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Pagado: {fmtDate(p.fecha_pago)}</div>}
                    {p.notas && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{p.notas}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {p.comprobante_url
                      ? <a href={p.comprobante_url} target="_blank" rel="noreferrer">
                          <Btn variant="info" style={{ padding: "5px 10px", fontSize: 11 }}>Ver 🧾</Btn>
                        </a>
                      : <Btn variant="warning" style={{ padding: "5px 10px", fontSize: 11 }} onClick={() => { setModalComprobante(p); setComprobanteFile(null); setComprobantePreview(null); }}>
                          Subir 📎
                        </Btn>
                    }
                    <Badge status={p.status === "pagado" ? "paid" : "pending"} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "movimientos" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {movimientos.map(m => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#f8fafc", borderRadius: 10 }}>
                  <div style={{ fontSize: 20 }}>{parseFloat(m.amount) > 0 ? "⬆️" : "⬇️"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{m.description}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{fmtDate(m.created_at?.split("T")[0])} · Saldo: {fmt(m.balance_after)}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: parseFloat(m.amount) > 0 ? "#16a34a" : "#dc2626" }}>
                    {parseFloat(m.amount) > 0 ? "+" : ""}{fmt(m.amount)}
                  </div>
                </div>
              ))}
              {movimientos.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>Sin movimientos</div>}
            </div>
          )}
        </>
      )}

      {/* MODAL SUBIR COMPROBANTE */}
      {modalComprobante && (
        <Modal open={true} onClose={() => setModalComprobante(null)} title={`Comprobante — ${mesesNombre[modalComprobante.mes - 1]} ${modalComprobante.anio}`} maxWidth={420}>
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13 }}>
            Monto del interés: <strong style={{ color: "#16a34a" }}>{fmt(modalComprobante.monto_interes)}</strong>
          </div>
          <div
            onClick={() => compRef.current?.click()}
            style={{ border: "2px dashed #e2e8f0", borderRadius: 12, padding: comprobantePreview ? 4 : 24, textAlign: "center", cursor: "pointer", background: "#fafafa", minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            {comprobantePreview
              ? <img src={comprobantePreview} alt="comprobante" style={{ maxHeight: 180, maxWidth: "100%", borderRadius: 8 }} />
              : <div>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📎</div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>Clic para seleccionar imagen o PDF</div>
                </div>
            }
          </div>
          <input ref={compRef} type="file" accept="image/*,.pdf" onChange={handleCompFile} style={{ display: "none" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" onClick={() => setModalComprobante(null)} style={{ flex: 1 }}>Cancelar</Btn>
            <Btn onClick={() => subirComprobante(modalComprobante)} disabled={!comprobanteFile || savingComp} style={{ flex: 1 }}>
              {savingComp ? "Subiendo..." : "Guardar comprobante"}
            </Btn>
          </div>
        </Modal>
      )}
    </Modal>
  );
}

// ─── ADMIN: PAGOS MENSUALES ──────────────────────────────────────────────────
function AdminPagosMensuales() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [modalNuevo, setModalNuevo] = useState(false);
  const [participaciones, setParticipaciones] = useState([]);
  const [form, setForm] = useState({ participation_id: "", mes: new Date().getMonth() + 1, anio: new Date().getFullYear(), monto_interes: "", notas: "" });
  const [saving, setSaving] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: pags }, { data: parts }] = await Promise.all([
      supabase.from("pagos_mensuales").select("*, profiles(full_name), investment_orders(title)").order("anio,mes"),
      supabase.from("participation_detail").select("*").eq("status", "active"),
    ]);
    setPagos(pags || []);
    setParticipaciones(parts || []);
    setLoading(false);
  }

  function handleImgFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setImgFile(f);
    setImgPreview(URL.createObjectURL(f));
  }

  function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let item of items) {
      if (item.type.startsWith("image/")) {
        const f = item.getAsFile();
        setImgFile(f);
        setImgPreview(URL.createObjectURL(f));
        break;
      }
    }
  }

  async function crearPago() {
    if (!form.participation_id || !form.monto_interes) return;
    setSaving(true);
    const part = participaciones.find(p => p.participation_id === form.participation_id);
    let comprobante_url = null;
    if (imgFile) {
      const ext = imgFile.name?.split(".").pop() || "jpg";
      const path = `pagos/${Date.now()}.${ext}`;
      await supabase.storage.from("comprobantes").upload(path, imgFile, { contentType: imgFile.type });
      comprobante_url = `${supabase.storageUrl}/object/public/comprobantes/${path}`;
    }
    await supabase.from("pagos_mensuales").insert({
      participation_id: form.participation_id,
      investor_id: part.investor_id,
      order_id: part.order_id,
      mes: parseInt(form.mes),
      anio: parseInt(form.anio),
      monto_interes: parseFloat(form.monto_interes),
      notas: form.notas,
      comprobante_url,
      status: comprobante_url ? "pagado" : "pendiente",
      fecha_pago: comprobante_url ? new Date().toISOString().split("T")[0] : null,
    });
    setModalNuevo(false);
    setForm({ participation_id: "", mes: new Date().getMonth() + 1, anio: new Date().getFullYear(), monto_interes: "", notas: "" });
    setImgFile(null); setImgPreview(null);
    loadData();
    setSaving(false);
  }

  const mesesNombre = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const pagosFiltrados = filtro === "todos" ? pagos : pagos.filter(p => p.status === filtro);
  const totalPendiente = pagos.filter(p => p.status === "pendiente").reduce((a, b) => a + parseFloat(b.monto_interes || 0), 0);
  const totalPagado = pagos.filter(p => p.status === "pagado").reduce((a, b) => a + parseFloat(b.monto_interes || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a" }}>Pagos Mensuales de Intereses</div>
        <Btn onClick={() => setModalNuevo(true)}>+ Registrar pago</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1.5px solid #fde68a" }}>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Por pagar</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#f59e0b" }}>{fmt(totalPendiente)}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1.5px solid #bbf7d0" }}>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>Total pagado</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#16a34a" }}>{fmt(totalPagado)}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["todos","Todos"], ["pendiente","Pendientes"], ["pagado","Pagados"]].map(([val, lbl]) => (
          <button key={val} onClick={() => setFiltro(val)}
            style={{ border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: filtro === val ? "#0f172a" : "#f1f5f9", color: filtro === val ? "#fff" : "#64748b" }}>
            {lbl}
          </button>
        ))}
      </div>

      {loading ? <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Cargando...</div> : (
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Inversionista", "Orden", "Mes/Año", "Interés", "Fecha pago", "Comprobante", "Estado"].map(h => (
                  <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.map((p, i) => (
                <tr key={p.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                  <td style={{ padding: "11px 14px", fontWeight: 600 }}>{p.profiles?.full_name}</td>
                  <td style={{ padding: "11px 14px", color: "#64748b" }}>{p.investment_orders?.title}</td>
                  <td style={{ padding: "11px 14px" }}>{mesesNombre[p.mes - 1]} {p.anio}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: "#16a34a" }}>{fmt(p.monto_interes)}</td>
                  <td style={{ padding: "11px 14px" }}>{p.fecha_pago ? fmtDate(p.fecha_pago) : "—"}</td>
                  <td style={{ padding: "11px 14px" }}>
                    {p.comprobante_url
                      ? <a href={p.comprobante_url} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 600, fontSize: 12 }}>Ver 🧾</a>
                      : <span style={{ color: "#94a3b8", fontSize: 12 }}>Sin comprobante</span>
                    }
                  </td>
                  <td style={{ padding: "11px 14px" }}><Badge status={p.status === "pagado" ? "paid" : "pending"} /></td>
                </tr>
              ))}
              {pagosFiltrados.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Sin pagos registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalNuevo} onClose={() => setModalNuevo(false)} title="Registrar pago mensual" maxWidth={460}>
        <Sel label="Inversionista / Participación *" value={form.participation_id} onChange={e => {
          const part = participaciones.find(p => p.participation_id === e.target.value);
          const interesMensual = part ? parseFloat(part.amount) * parseFloat(part.interest_rate) / (part.term_months || 1) : "";
          setForm(p => ({ ...p, participation_id: e.target.value, monto_interes: interesMensual ? interesMensual.toFixed(2) : "" }));
        }}>
          <option value="">Seleccionar...</option>
          {participaciones.map(p => (
            <option key={p.participation_id} value={p.participation_id}>
              {p.investor_name} — {p.order_title} ({fmt(p.amount)})
            </option>
          ))}
        </Sel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Sel label="Mes *" value={form.mes} onChange={e => setForm(p => ({ ...p, mes: e.target.value }))}>
            {mesesNombre.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </Sel>
          <Input label="Año *" type="number" value={form.anio} onChange={e => setForm(p => ({ ...p, anio: e.target.value }))} />
        </div>
        <Input label="Monto del interés ($) *" type="number" value={form.monto_interes} onChange={e => setForm(p => ({ ...p, monto_interes: e.target.value }))} placeholder="95.00" />
        <Input label="Notas (opcional)" value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} placeholder="Ej: Transferencia #12345" />

        {/* COMPROBANTE */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Comprobante de pago (opcional)</div>
          <div
            onClick={() => imgRef.current?.click()}
            onPaste={handlePaste}
            tabIndex={0}
            style={{ border: "2px dashed #e2e8f0", borderRadius: 12, padding: imgPreview ? 4 : 18, textAlign: "center", cursor: "pointer", background: "#fafafa", minHeight: 70, display: "flex", alignItems: "center", justifyContent: "center", outline: "none" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#7c3aed"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
          >
            {imgPreview
              ? <img src={imgPreview} alt="preview" style={{ maxHeight: 140, maxWidth: "100%", borderRadius: 8, objectFit: "contain" }} />
              : <div>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>📎</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Clic para buscar imagen</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>o pega con Ctrl+V</div>
                </div>
            }
          </div>
          <input ref={imgRef} type="file" accept="image/*,.pdf" onChange={handleImgFile} style={{ display: "none" }} />
          {imgPreview && (
            <button onClick={() => { setImgFile(null); setImgPreview(null); }}
              style={{ marginTop: 5, border: "none", background: "#fef2f2", color: "#dc2626", borderRadius: 8, padding: "3px 10px", fontSize: 11, cursor: "pointer" }}>
              ✕ Quitar
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary" onClick={() => setModalNuevo(false)} style={{ flex: 1 }}>Cancelar</Btn>
          <Btn onClick={crearPago} disabled={saving} style={{ flex: 1 }}>{saving ? "Guardando..." : "Registrar pago"}</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── ADMIN: VENCIMIENTOS ─────────────────────────────────────────────────────
function AdminVencimientos() {
  const [participaciones, setParticipaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const { data } = await supabase.from("participation_detail").select("*").eq("status", "active").order("end_date");
    const vencidas = (data || []).filter(p => p.end_date && new Date(p.end_date) <= new Date(Date.now() + 60 * 24 * 60 * 60 * 1000));
    setParticipaciones(vencidas);
    setLoading(false);
  }

  async function devolver(p) {
    if (!window.confirm(`¿Procesar devolución para ${p.investor_name}?`)) return;
    setProcesando(p.participation_id);
    const interest = parseFloat(p.amount) * parseFloat(p.interest_rate);
    const total = parseFloat(p.amount) + interest;
    await supabase.rpc("record_capital_movement", {
      p_investor_id: p.investor_id,
      p_amount: total,
      p_type: "investment_return",
      p_description: `Devolución capital + intereses — ${p.order_title}`,
      p_participation_id: p.participation_id,
    });
    await supabase.from("earnings").insert({
      participation_id: p.participation_id,
      investor_id: p.investor_id,
      principal: parseFloat(p.amount),
      interest_earned: interest,
      type: "maturity",
      payout_date: new Date().toISOString().split("T")[0],
      status: "paid",
    });
    await supabase.from("participations").update({ status: "completed" }).eq("id", p.participation_id);
    setProcesando(null);
    loadData();
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Cargando...</div>;

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 8 }}>Vencimientos</div>
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>Participaciones que vencen en los próximos 60 días</div>
      {participaciones.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: 60, textAlign: "center", border: "1.5px solid #e2e8f0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>Sin vencimientos próximos</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>No hay inversiones que venzan en los próximos 60 días</div>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Inversionista", "Orden", "Capital", "Ganancia", "Total a pagar", "Vence", "Días", "Acción"].map(h => (
                  <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {participaciones.map((p, i) => {
                const dias = daysLeft(p.end_date);
                const ganancia = parseFloat(p.amount) * parseFloat(p.interest_rate);
                const total = parseFloat(p.amount) + ganancia;
                return (
                  <tr key={p.participation_id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                    <td style={{ padding: "11px 14px", fontWeight: 600 }}>{p.investor_name}</td>
                    <td style={{ padding: "11px 14px", color: "#64748b" }}>{p.order_title}</td>
                    <td style={{ padding: "11px 14px", fontWeight: 600 }}>{fmt(p.amount)}</td>
                    <td style={{ padding: "11px 14px", color: "#16a34a", fontWeight: 600 }}>{fmt(ganancia)}</td>
                    <td style={{ padding: "11px 14px", fontWeight: 700, color: "#0f172a" }}>{fmt(total)}</td>
                    <td style={{ padding: "11px 14px" }}>{fmtDate(p.end_date)}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{ background: dias <= 0 ? "#fee2e2" : dias <= 7 ? "#fef9c3" : "#f1f5f9", color: dias <= 0 ? "#991b1b" : dias <= 7 ? "#854d0e" : "#64748b", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                        {dias <= 0 ? "Vencida" : `${dias} días`}
                      </span>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <Btn variant="success" style={{ padding: "5px 12px", fontSize: 11 }} disabled={procesando === p.participation_id} onClick={() => devolver(p)}>
                        {procesando === p.participation_id ? "..." : "Devolver"}
                      </Btn>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── PORTAL INVERSIONISTA ────────────────────────────────────────────────────
function PortalDashboard({ profileId, reloadKey }) {
  const [resumen, setResumen] = useState(null);
  const [inversiones, setInversiones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, [reloadKey]);

  async function loadData() {
    setLoading(true);
    const [{ data: res }, { data: parts }] = await Promise.all([
      supabase.from("investor_summary").select("*").eq("investor_id", profileId).single(),
      supabase.from("participation_detail").select("*").eq("investor_id", profileId).in("status", ["active", "pending"]).order("end_date"),
    ]);
    setResumen(res);
    setInversiones(parts || []);
    setLoading(false);
  }

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Cargando...</div>;

  const proximoVencimiento = inversiones.find(p => p.end_date && p.status === "active");

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 8 }}>Mi Dashboard</div>
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>Bienvenido, {resumen?.full_name}</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Balance disponible", val: fmt(resumen?.available_balance), icon: "💵", color: "#7c3aed" },
          { label: "Capital invertido", val: fmt(resumen?.total_invested), icon: "📈", color: "#0ea5e9" },
          { label: "Ganancias totales", val: fmt(resumen?.total_earnings), icon: "✅", color: "#16a34a" },
          { label: "Inversiones activas", val: resumen?.active_investments || 0, icon: "🔒", color: "#f59e0b" },
        ].map(k => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 16, padding: 22, border: "1.5px solid #e2e8f0" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: k.color }}>{k.val}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {proximoVencimiento && (
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, border: "1.5px solid #fde68a", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 32 }}>⏰</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>Próximo vencimiento</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{proximoVencimiento.order_title} · {fmt(proximoVencimiento.amount)} + {fmt(proximoVencimiento.projected_earnings)} de ganancia</div>
            <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600, marginTop: 4 }}>Vence el {fmtDate(proximoVencimiento.end_date)} — {daysLeft(proximoVencimiento.end_date)} días restantes</div>
          </div>
        </div>
      )}

      {inversiones.length > 0 && (
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 14 }}>Mis inversiones activas</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {inversiones.map(p => (
              <div key={p.participation_id} style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
                {p.imagen_url
                  ? <img src={p.imagen_url} alt={p.order_title} style={{ width: "100%", height: 120, objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: 80, background: "linear-gradient(135deg,#0f172a,#1e3a5f)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 28 }}>📈</span>
                    </div>
                }
                <div style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{p.order_title}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{p.target_company}</div>
                  </div>
                  <Badge status={p.status} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                  {[
                    { label: "Mi inversión", val: fmt(p.amount), color: "#0f172a" },
                    { label: "Tasa", val: `${(parseFloat(p.interest_rate) * 100).toFixed(1)}%`, color: "#16a34a" },
                    { label: "Ganaré", val: fmt(p.projected_earnings), color: "#16a34a" },
                    { label: "Recibiré", val: fmt(parseFloat(p.amount) + parseFloat(p.projected_earnings || 0)), color: "#7c3aed" },
                  ].map(m => (
                    <div key={m.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3, textTransform: "uppercase" }}>{m.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.val}</div>
                    </div>
                  ))}
                </div>
                {p.end_date && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
                      <span>Vence: {fmtDate(p.end_date)}</span>
                      <span>{daysLeft(p.end_date)} días restantes</span>
                    </div>
                  </div>
                )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PortalOportunidades({ profileId }) {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balanceDisponible, setBalanceDisponible] = useState(0);
  const [modalParticipar, setModalParticipar] = useState(null);
  const [monto, setMonto] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [exito, setExito] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: ords }, { data: myParts }, { data: profile }] = await Promise.all([
      supabase.from("order_summary").select("*").eq("status", "open"),
      supabase.from("participations").select("order_id").eq("investor_id", profileId).in("status", ["pending", "active"]),
      supabase.from("profiles").select("available_balance").eq("id", profileId).single(),
    ]);
    const misOrdenIds = new Set((myParts || []).map(p => p.order_id));
    setOrdenes((ords || []).filter(o => !misOrdenIds.has(o.id)));
    setBalanceDisponible(parseFloat(profile?.available_balance || 0));
    setLoading(false);
  }

  async function participar() {
    setErr("");
    const montoNum = parseFloat(monto);
    if (!monto || montoNum <= 0) { setErr("Ingresa un monto válido."); return; }
    if (montoNum < parseFloat(modalParticipar.minimum_amount || 0)) { setErr(`El monto mínimo es ${fmt(modalParticipar.minimum_amount)}.`); return; }
    const maxDisponible = Math.min(balanceDisponible, parseFloat(modalParticipar.remaining_amount || 0));
    if (montoNum > balanceDisponible) { setErr(`Tu balance disponible es ${fmt(balanceDisponible)}.`); return; }
    if (montoNum > parseFloat(modalParticipar.remaining_amount || 0)) { setErr(`Solo quedan ${fmt(modalParticipar.remaining_amount)} disponibles en esta orden.`); return; }
    if (montoNum > maxDisponible) { setErr(`El máximo que puedes invertir es ${fmt(maxDisponible)}.`); return; }
    setSaving(true);
    const { data: part, error } = await supabase.from("participations").insert({
      investor_id: profileId,
      order_id: modalParticipar.id,
      amount: montoNum,
      interest_rate: parseFloat(modalParticipar.interest_rate),
      status: "pending",
    }).select().single();
    if (error) { setErr("Error al procesar. Intenta de nuevo."); setSaving(false); return; }
    await supabase.rpc("record_capital_movement", {
      p_investor_id: profileId,
      p_amount: -montoNum,
      p_type: "investment_lock",
      p_description: `Capital bloqueado — ${modalParticipar.title}`,
      p_participation_id: part.id,
    });
    setExito(true);
    setTimeout(() => { setModalParticipar(null); setExito(false); setMonto(""); loadData(); }, 1500);
    setSaving(false);
  }

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Cargando...</div>;

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 8 }}>Oportunidades de inversión</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: "#94a3b8" }}>Órdenes disponibles para participar</div>
        <div style={{ background: "#f5f3ff", borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: "#7c3aed" }}>
          Balance disponible: {fmt(balanceDisponible)}
        </div>
      </div>

      {ordenes.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: 60, textAlign: "center", border: "1.5px solid #e2e8f0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No hay oportunidades disponibles</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>Ya participas en todas las órdenes abiertas o no hay nuevas por ahora</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 16 }}>
          {ordenes.map(o => (
            <div key={o.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1.5px solid #e2e8f0" }}>
              {/* IMAGEN */}
              {o.imagen_url
                ? <img src={o.imagen_url} alt={o.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                : <div style={{ width: "100%", height: 120, background: "linear-gradient(135deg,#0f172a,#1e3a5f)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 32, marginBottom: 4 }}>📈</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{o.target_company}</div>
                    </div>
                  </div>
              }
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{o.title}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>{o.target_company}</div>
                  </div>
                  <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "6px 12px", textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#16a34a" }}>{(parseFloat(o.interest_rate) * 100).toFixed(1)}%</div>
                    <div style={{ fontSize: 10, color: "#16a34a" }}>retorno</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>PLAZO</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{o.term_months} meses</div>
                  </div>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>MÍNIMO</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{fmt(o.minimum_amount || 0)}</div>
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "#64748b" }}>Disponible: {fmt(o.remaining_amount)}</span>
                    <span style={{ fontWeight: 700, color: "#2563eb" }}>{parseFloat(o.funding_percentage || 0).toFixed(0)}% fondeado</span>
                  </div>
                  <ProgressBar value={parseFloat(o.funded_amount)} max={parseFloat(o.required_amount)} color="#7c3aed" />
                </div>
                {o.description && <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>{o.description}</div>}
                <Btn onClick={() => { setModalParticipar(o); setMonto(""); setErr(""); }} style={{ width: "100%", background: "#7c3aed" }}>
                  Participar en esta orden
                </Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!modalParticipar} onClose={() => setModalParticipar(null)} title={`Participar — ${modalParticipar?.title}`} maxWidth={440}>
        {exito ? (
          <div style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#16a34a" }}>¡Participación registrada!</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>Tu capital ha sido reservado exitosamente.</div>
          </div>
        ) : (
          <>
            <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              {[
                ["Tasa del período", `${(parseFloat(modalParticipar?.interest_rate || 0) * 100).toFixed(1)}%`],
                ["Plazo", `${modalParticipar?.term_months} meses`],
                ["Monto mínimo", fmt(modalParticipar?.minimum_amount || 0)],
                ["Disponible en orden", fmt(modalParticipar?.remaining_amount || 0)],
                ["Tu balance disponible", fmt(balanceDisponible)],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#64748b" }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            {/* SIMULADOR */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Simula tu inversión</div>
              <input
                type="range"
                min={parseFloat(modalParticipar?.minimum_amount || 100)}
                max={Math.min(balanceDisponible, parseFloat(modalParticipar?.remaining_amount || 0))}
                step={100}
                value={monto || parseFloat(modalParticipar?.minimum_amount || 100)}
                onChange={e => { setMonto(e.target.value); setErr(""); }}
                style={{ width: "100%", marginBottom: 8, accentColor: "#7c3aed" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginBottom: 12 }}>
                <span>{fmt(modalParticipar?.minimum_amount || 0)}</span>
                <span style={{ fontWeight: 700, color: "#7c3aed", fontSize: 14 }}>{fmt(monto || 0)}</span>
                <span>{fmt(Math.min(balanceDisponible, parseFloat(modalParticipar?.remaining_amount || 0)))}</span>
              </div>
            </div>
            <Input label="O escribe el monto exacto ($)" type="number" value={monto} onChange={e => { setMonto(e.target.value); setErr(""); }} placeholder="5000" />
            {monto && parseFloat(monto) > 0 && (
              <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 14, marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 10 }}>📊 Resumen de tu inversión</div>
                {[
                  ["Inviertes", fmt(parseFloat(monto)), "#0f172a"],
                  ["Ganancia total", fmt(parseFloat(monto) * parseFloat(modalParticipar?.interest_rate || 0)), "#16a34a"],
                  ["Ganancia mensual est.", fmt(parseFloat(monto) * parseFloat(modalParticipar?.interest_rate || 0) / parseFloat(modalParticipar?.term_months || 1)), "#16a34a"],
                  ["Recibes al vencer", fmt(parseFloat(monto) * (1 + parseFloat(modalParticipar?.interest_rate || 0))), "#7c3aed"],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #dcfce7" }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>{l}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
            {err && <div style={{ color: "#dc2626", fontSize: 12, marginBottom: 12, padding: "8px 12px", background: "#fef2f2", borderRadius: 8 }}>⚠️ {err}</div>}
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="secondary" onClick={() => setModalParticipar(null)} style={{ flex: 1 }}>Cancelar</Btn>
              <Btn onClick={participar} disabled={saving} style={{ flex: 1, background: "#7c3aed", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Procesando..." : "Confirmar participación"}
              </Btn>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

function PortalHistorial({ profileId }) {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("participation_detail").select("*").eq("investor_id", profileId)
      .in("status", ["completed", "reinvested", "exited_early"]).order("end_date", { ascending: false })
      .then(({ data }) => { setHistorial(data || []); setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Cargando...</div>;

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 24 }}>Historial de inversiones</div>
      {historial.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: 60, textAlign: "center", border: "1.5px solid #e2e8f0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Sin historial aún</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>Aquí aparecerán tus inversiones completadas</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {historial.map(p => (
            <div key={p.participation_id} style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
              {p.imagen_url
                ? <img src={p.imagen_url} alt={p.order_title} style={{ width: "100%", height: 100, objectFit: "cover" }} />
                : <div style={{ width: "100%", height: 70, background: "linear-gradient(135deg,#0f172a,#1e3a5f)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 24 }}>📂</span>
                  </div>
              }
              <div style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{p.order_title}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{p.target_company}</div>
                </div>
                <Badge status={p.status} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>Capital invertido</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{fmt(p.amount)}</div>
                </div>
                <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#16a34a", marginBottom: 3 }}>Ganancia recibida</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#16a34a" }}>{fmt(p.actual_earnings || p.projected_earnings)}</div>
                </div>
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3 }}>Venció</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{fmtDate(p.end_date)}</div>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PortalMovimientos({ profileId }) {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("capital_movements").select("*").eq("investor_id", profileId)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setMovimientos(data || []); setLoading(false); });
  }, []);

  const tipoLabel = { deposit: "Depósito", withdrawal: "Retiro", investment_lock: "Capital bloqueado", investment_return: "Devolución capital", earnings_credit: "Ganancias", early_exit_return: "Salida anticipada", admin_adjustment: "Ajuste admin" };

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Cargando...</div>;

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 24 }}>Mis movimientos</div>
      {movimientos.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: 60, textAlign: "center", border: "1.5px solid #e2e8f0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Sin movimientos aún</div>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
          {movimientos.map((m, i) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: i < movimientos.length - 1 ? "1px solid #f1f5f9" : "none", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: parseFloat(m.amount) > 0 ? "#f0fdf4" : "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                {parseFloat(m.amount) > 0 ? "⬆️" : "⬇️"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{tipoLabel[m.type] || m.type}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{m.description} · {fmtDate(m.created_at?.split("T")[0])}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: parseFloat(m.amount) > 0 ? "#16a34a" : "#dc2626" }}>
                  {parseFloat(m.amount) > 0 ? "+" : ""}{fmt(m.amount)}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Saldo: {fmt(m.balance_after)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NAV / SIDEBAR ───────────────────────────────────────────────────────────
function Nav({ perfil, tab, setTab, tabs, onLogout, accentColor }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  function handleTab(id) {
    setTab(id);
    setMenuAbierto(false);
  }

  const LogoSVG = () => (
    <svg width="32" height="32" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 8, flexShrink: 0 }}>
      <defs>
        <linearGradient id="navbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af"/>
          <stop offset="100%" stopColor="#2563eb"/>
        </linearGradient>
        <linearGradient id="navgold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="100%" stopColor="#f59e0b"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="80" fill="url(#navbg)"/>
      <rect x="80" y="240" width="40" height="70" rx="6" fill="rgba(255,255,255,0.4)"/>
      <rect x="135" y="195" width="40" height="115" rx="6" fill="rgba(255,255,255,0.6)"/>
      <rect x="190" y="150" width="40" height="160" rx="6" fill="rgba(255,255,255,0.8)"/>
      <rect x="245" y="110" width="40" height="200" rx="6" fill="#fff"/>
      <polyline points="100,238 155,193 210,148 265,108" fill="none" stroke="url(#navgold)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="265" cy="108" r="18" fill="#fbbf24"/>
    </svg>
  );

  return (
    <>
      {/* TOP BAR */}
      <div style={{ background: "#fff", borderBottom: "1.5px solid #e2e8f0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: "auto" }}>
            <LogoSVG />
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", letterSpacing: "-0.02em" }}>InvestAdmin</div>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, marginTop: -2 }}>Sistema de inversiones</div>
            </div>
          </div>

          {/* TABS DESKTOP */}
          <div style={{ display: "flex", gap: 2, marginRight: 16 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => handleTab(t.id)}
                style={{ border: "none", background: tab === t.id ? "#eff6ff" : "transparent",
                  color: tab === t.id ? "#2563eb" : "#64748b", borderRadius: 9, padding: "7px 13px",
                  cursor: "pointer", fontSize: 12, fontWeight: tab === t.id ? 700 : 500,
                  borderBottom: tab === t.id ? "2px solid #2563eb" : "2px solid transparent",
                  transition: "all 0.15s", whiteSpace: "nowrap" }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* USUARIO */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{perfil?.full_name?.split(" ")[0]}</div>
              <div style={{ fontSize: 10, color: "#94a3b8" }}>{perfil?.role === "admin" ? "Administrador" : "Inversionista"}</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: accentColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, boxShadow: `0 2px 8px ${accentColor}40` }}>
              {perfil?.full_name?.[0] || "U"}
            </div>
          </div>

          {/* HAMBURGUESA */}
          <button onClick={() => setMenuAbierto(p => !p)}
            style={{ border: "none", background: menuAbierto ? "#f1f5f9" : "transparent", borderRadius: 8, cursor: "pointer", padding: "6px 8px", fontSize: 18, color: "#64748b", marginLeft: 8, display: "flex", alignItems: "center" }}>
            {menuAbierto ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE MÓVIL */}
      {menuAbierto && (
        <div style={{ background: "#fff", borderBottom: "1.5px solid #e2e8f0", padding: "10px 20px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", position: "sticky", top: 60, zIndex: 99 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 12, marginBottom: 10, border: "1.5px solid #e2e8f0" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: accentColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800 }}>
              {perfil?.full_name?.[0] || "U"}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{perfil?.full_name}</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{perfil?.email}</div>
            </div>
          </div>
          {tabs.map(t => (
            <button key={t.id} onClick={() => handleTab(t.id)}
              style={{ display: "flex", alignItems: "center", width: "100%", border: "none",
                background: tab === t.id ? "#eff6ff" : "transparent",
                color: tab === t.id ? "#2563eb" : "#374151",
                borderRadius: 10, padding: "12px 14px", cursor: "pointer", fontSize: 14,
                fontWeight: tab === t.id ? 700 : 400, marginBottom: 3, textAlign: "left",
                borderLeft: tab === t.id ? "3px solid #2563eb" : "3px solid transparent" }}>
              {t.label}
              {tab === t.id && <span style={{ marginLeft: "auto", background: "#2563eb", color: "#fff", borderRadius: 20, padding: "2px 8px", fontSize: 10 }}>●</span>}
            </button>
          ))}
          <div style={{ borderTop: "1.5px solid #f1f5f9", marginTop: 10, paddingTop: 10 }}>
            <button onClick={onLogout}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", border: "1.5px solid #fecaca", background: "#fef2f2", color: "#dc2626", borderRadius: 10, padding: "11px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              🚪 Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── VISTAS PRINCIPALES ──────────────────────────────────────────────────────

// ─── CALENDARIO ──────────────────────────────────────────────────────────────
function Calendario({ eventos, titulo }) {
  const hoy = new Date();
  const [mesActual, setMesActual] = useState(hoy.getMonth());
  const [anioActual, setAnioActual] = useState(hoy.getFullYear());

  const mesesNombre = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const diasSemana = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

  // Calcular días del mes
  const primerDia = new Date(anioActual, mesActual, 1).getDay();
  const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

  // Eventos del mes actual
  const eventosMes = eventos.filter(e => {
    const d = new Date(e.fecha);
    return d.getMonth() === mesActual && d.getFullYear() === anioActual;
  });

  // Eventos por día
  const eventosPorDia = {};
  eventosMes.forEach(e => {
    const dia = new Date(e.fecha).getDate();
    if (!eventosPorDia[dia]) eventosPorDia[dia] = [];
    eventosPorDia[dia].push(e);
  });

  function prevMes() {
    if (mesActual === 0) { setMesActual(11); setAnioActual(a => a - 1); }
    else setMesActual(m => m - 1);
  }
  function nextMes() {
    if (mesActual === 11) { setMesActual(0); setAnioActual(a => a + 1); }
    else setMesActual(m => m + 1);
  }

  const celdas = [];
  for (let i = 0; i < primerDia; i++) celdas.push(null);
  for (let i = 1; i <= diasEnMes; i++) celdas.push(i);

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "#0f172a" }}>
        <button onClick={prevMes} style={{ border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 16 }}>‹</button>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{mesesNombre[mesActual]} {anioActual}</div>
        <button onClick={nextMes} style={{ border: "none", background: "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 16 }}>›</button>
      </div>

      {/* Días de la semana */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: "#f8fafc" }}>
        {diasSemana.map(d => (
          <div key={d} style={{ padding: "8px 0", textAlign: "center", fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>{d}</div>
        ))}
      </div>

      {/* Días */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1, background: "#f1f5f9", padding: 1 }}>
        {celdas.map((dia, i) => {
          if (!dia) return <div key={i} style={{ background: "#fff", minHeight: 52 }} />;
          const esHoy = dia === hoy.getDate() && mesActual === hoy.getMonth() && anioActual === hoy.getFullYear();
          const eventos = eventosPorDia[dia] || [];
          const tieneAlerta = eventos.some(e => e.alerta);
          const tienePagado = eventos.some(e => e.pagado);
          return (
            <div key={i} style={{ background: "#fff", minHeight: 52, padding: 4, position: "relative" }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: esHoy ? "#0f172a" : "transparent",
                color: esHoy ? "#fff" : "#374151",
                fontSize: 12, fontWeight: esHoy ? 700 : 400, marginBottom: 2
              }}>{dia}</div>
              {eventos.map((e, j) => (
                <div key={j} title={e.label} style={{
                  fontSize: 9, fontWeight: 600, borderRadius: 4, padding: "1px 4px", marginBottom: 1,
                  background: e.pagado ? "#dcfce7" : tieneAlerta ? "#fee2e2" : "#dbeafe",
                  color: e.pagado ? "#15803d" : tieneAlerta ? "#991b1b" : "#1d4ed8",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                }}>
                  {e.icono} {e.label}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Leyenda de eventos del mes */}
      {eventosMes.length > 0 && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>Este mes</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {eventosMes.sort((a,b) => new Date(a.fecha) - new Date(b.fecha)).map((e, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: e.pagado ? "#16a34a" : e.alerta ? "#ef4444" : "#2563eb", flexShrink: 0 }} />
                <span style={{ color: "#374151" }}>{new Date(e.fecha).getDate()} {mesesNombre[mesActual]} — {e.label}</span>
                {e.monto && <span style={{ marginLeft: "auto", fontWeight: 700, color: "#16a34a" }}>{fmt(e.monto)}</span>}
                {e.pagado && <span style={{ background: "#dcfce7", color: "#15803d", borderRadius: 10, padding: "1px 6px", fontSize: 10 }}>✓ Pagado</span>}
                {e.alerta && !e.pagado && <span style={{ background: "#fee2e2", color: "#991b1b", borderRadius: 10, padding: "1px 6px", fontSize: 10 }}>⚠️ Próximo</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminCalendario() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: parts }, { data: pagos }] = await Promise.all([
      supabase.from("participation_detail").select("*").eq("status", "active"),
      supabase.from("pagos_mensuales").select("*"),
    ]);

    const hoy = new Date();
    const evs = [];

    (parts || []).forEach(p => {
      if (!p.start_date || !p.end_date) return;
      const start = new Date(p.start_date);
      const interesMensual = parseFloat(p.amount) * parseFloat(p.interest_rate) / (p.term_months || 1);

      for (let m = 1; m <= (p.term_months || 1); m++) {
        const fechaPago = new Date(start);
        fechaPago.setMonth(fechaPago.getMonth() + m);
        const mes = fechaPago.getMonth() + 1;
        const anio = fechaPago.getFullYear();
        const diasRestantes = Math.ceil((fechaPago - hoy) / (1000 * 60 * 60 * 24));

        // Ver si ya está pagado
        const pagoExistente = (pagos || []).find(pg =>
          pg.participation_id === p.participation_id && pg.mes === mes && pg.anio === anio
        );

        evs.push({
          fecha: fechaPago.toISOString().split("T")[0],
          label: `${p.investor_name} — ${p.order_title}`,
          monto: interesMensual,
          pagado: pagoExistente?.status === "pagado",
          alerta: diasRestantes <= 3 && diasRestantes >= 0 && !pagoExistente,
          icono: pagoExistente?.status === "pagado" ? "✅" : diasRestantes <= 3 ? "⚠️" : "💰",
        });
      }
    });

    setEventos(evs);
    setLoading(false);
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Cargando calendario...</div>;

  const hoy = new Date();
  const alertas = eventos.filter(e => e.alerta && !e.pagado);

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 20 }}>Calendario de pagos</div>

      {alertas.length > 0 && (
        <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 14, padding: "14px 18px", marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#dc2626", marginBottom: 8 }}>⚠️ {alertas.length} pago{alertas.length > 1 ? "s" : ""} próximo{alertas.length > 1 ? "s" : ""} en los próximos 3 días</div>
          {alertas.map((e, i) => (
            <div key={i} style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>
              • {e.label} — {fmt(e.monto)} — {fmtDate(e.fecha)}
            </div>
          ))}
        </div>
      )}

      <Calendario eventos={eventos} titulo="Pagos mensuales" />
    </div>
  );
}

function PortalCalendario({ profileId }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: parts }, { data: pagos }] = await Promise.all([
      supabase.from("participation_detail").select("*").eq("investor_id", profileId).eq("status", "active"),
      supabase.from("pagos_mensuales").select("*").eq("investor_id", profileId),
    ]);

    const hoy = new Date();
    const evs = [];

    (parts || []).forEach(p => {
      if (!p.start_date || !p.end_date) return;
      const start = new Date(p.start_date);
      const interesMensual = parseFloat(p.amount) * parseFloat(p.interest_rate) / (p.term_months || 1);

      for (let m = 1; m <= (p.term_months || 1); m++) {
        const fechaPago = new Date(start);
        fechaPago.setMonth(fechaPago.getMonth() + m);
        const mes = fechaPago.getMonth() + 1;
        const anio = fechaPago.getFullYear();
        const diasRestantes = Math.ceil((fechaPago - hoy) / (1000 * 60 * 60 * 24));

        const pagoExistente = (pagos || []).find(pg => pg.mes === mes && pg.anio === anio);

        evs.push({
          fecha: fechaPago.toISOString().split("T")[0],
          label: p.order_title,
          monto: interesMensual,
          pagado: pagoExistente?.status === "pagado",
          alerta: diasRestantes <= 3 && diasRestantes >= 0 && !pagoExistente,
          icono: pagoExistente?.status === "pagado" ? "✅" : "💰",
        });
      }
    });

    setEventos(evs);
    setLoading(false);
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Cargando...</div>;

  const proximoPago = eventos.filter(e => !e.pagado && new Date(e.fecha) >= new Date()).sort((a,b) => new Date(a.fecha) - new Date(b.fecha))[0];

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 20 }}>Mi calendario de cobros</div>

      {proximoPago && (
        <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 14, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 32 }}>💰</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#15803d" }}>Próximo cobro de interés</div>
            <div style={{ fontSize: 13, color: "#374151", marginTop: 3 }}>{proximoPago.label} — <strong>{fmt(proximoPago.monto)}</strong></div>
            <div style={{ fontSize: 12, color: "#16a34a", marginTop: 2, fontWeight: 600 }}>{fmtDate(proximoPago.fecha)} — {Math.ceil((new Date(proximoPago.fecha) - new Date()) / (1000*60*60*24))} días restantes</div>
          </div>
        </div>
      )}

      <Calendario eventos={eventos} titulo="Mis cobros" />
    </div>
  );
}
function autoVencimientoGlobal(fechaFacturacion, plazo) {
  if (!fechaFacturacion || !plazo) return "";
  const d = new Date(fechaFacturacion);
  d.setDate(d.getDate() + parseInt(plazo));
  return d.toISOString().split("T")[0];
}

function FormOC({ titulo, form, setForm, clientes, saving, docFile, setDocFile, docPreview, setDocPreview, analizando, onAnalizar, onGuardar, onCerrar }) {
  const docRef = useRef(null);

  function handleClienteChange(clienteId) {
    const cl = clientes.find(c => c.id === clienteId);
    const venc = form.fecha_facturacion ? autoVencimientoGlobal(form.fecha_facturacion, cl?.plazo_dias || 90) : "";
    setForm(p => ({ ...p, cliente_id: clienteId, fecha_vencimiento: venc }));
  }

  function handleFechaFacturacion(fecha) {
    const cl = clientes.find(c => c.id === form.cliente_id);
    const venc = autoVencimientoGlobal(fecha, cl?.plazo_dias || 90);
    setForm(p => ({ ...p, fecha_facturacion: fecha, fecha_vencimiento: venc }));
  }

  function handleDocFile(e) {
    const f = e.target.files[0]; if (!f) return;
    setDocFile(f); setDocPreview(URL.createObjectURL(f));
  }

  function handleDocPaste(e) {
    const items = e.clipboardData?.items; if (!items) return;
    for (let item of items) {
      if (item.type.startsWith("image/")) {
        const f = item.getAsFile();
        setDocFile(f); setDocPreview(URL.createObjectURL(f)); break;
      }
    }
  }

  return (
    <Modal open={true} onClose={onCerrar} title={titulo} maxWidth={600}>
      {/* ZONA DOCUMENTO CON IA */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Documento OC (imagen o PDF)
        </div>
        <div
          onClick={() => docRef.current?.click()}
          onPaste={handleDocPaste}
          tabIndex={0}
          style={{ border: "2px dashed #e2e8f0", borderRadius: 12, padding: docPreview ? 6 : 16, textAlign: "center", cursor: "pointer", background: "#fafafa", minHeight: 70, display: "flex", alignItems: "center", justifyContent: "center", outline: "none" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#2563eb"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}>
          {docPreview
            ? <img src={docPreview} alt="doc" style={{ maxHeight: 140, maxWidth: "100%", borderRadius: 8, objectFit: "contain" }} />
            : <div>
                <div style={{ fontSize: 22, marginBottom: 4 }}>📎</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>Clic para buscar archivo o pega imagen con Ctrl+V</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>PNG, JPG, PDF</div>
              </div>
          }
        </div>
        <input ref={docRef} type="file" accept="image/*,.pdf" onChange={handleDocFile} style={{ display: "none" }} />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {docPreview && (
            <button onClick={() => { setDocFile(null); setDocPreview(null); }}
              style={{ border: "none", background: "#fef2f2", color: "#dc2626", borderRadius: 8, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
              ✕ Quitar
            </button>
          )}
          {docFile && (
            <Btn onClick={onAnalizar} disabled={analizando} style={{ fontSize: 11, padding: "5px 14px", background: "#7c3aed", color: "#fff" }}>
              {analizando ? "⏳ Analizando con IA..." : "✨ Leer con IA y llenar campos"}
            </Btn>
          )}
        </div>
      </div>

      <div style={{ height: 1, background: "#f1f5f9", marginBottom: 16 }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ gridColumn: "1/-1" }}>
          <Sel label="Cliente *" value={form.cliente_id} onChange={e => handleClienteChange(e.target.value)}>
            <option value="">Seleccionar cliente...</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.plazo_dias}d)</option>)}
          </Sel>
        </div>
        <Input label="N° OC *" value={form.numero_oc} onChange={e => setForm(p => ({ ...p, numero_oc: e.target.value }))} placeholder="Ej: 265*000 OP" />
        <Input label="Monto total ($) *" type="number" value={form.monto_total} onChange={e => setForm(p => ({ ...p, monto_total: e.target.value }))} placeholder="2500.00" />
        <div style={{ gridColumn: "1/-1" }}>
          <Input label="Descripción" value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} placeholder="Ej: TARIMA PARA BARRIL" />
        </div>
        <Input label="Fecha facturación" type="date" value={form.fecha_facturacion} onChange={e => handleFechaFacturacion(e.target.value)} />
        <Input label="Fecha vencimiento (auto)" type="date" value={form.fecha_vencimiento} onChange={e => setForm(p => ({ ...p, fecha_vencimiento: e.target.value }))} />
        <Input label="Fecha pago esperado" type="date" value={form.fecha_pago_esperado} onChange={e => setForm(p => ({ ...p, fecha_pago_esperado: e.target.value }))} />
        <Input label="Fecha pago real (si ya cobró)" type="date" value={form.fecha_pago_real} onChange={e => setForm(p => ({ ...p, fecha_pago_real: e.target.value }))} />
        <div style={{ gridColumn: "1/-1" }}>
          <Input label="Notas (opcional)" value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} placeholder="Observaciones..." />
        </div>
      </div>
      {form.fecha_facturacion && form.monto_total && (
        <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#15803d" }}>
          💡 Vencimiento calculado automáticamente según el plazo del cliente seleccionado
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="secondary" onClick={onCerrar} style={{ flex: 1 }}>Cancelar</Btn>
        <Btn onClick={onGuardar} disabled={saving} style={{ flex: 1 }}>{saving ? "Guardando..." : "Guardar OC"}</Btn>
      </div>
    </Modal>
  );
}
// ─── ADMIN: OC x COBRAR ──────────────────────────────────────────────────────
function AdminOCxCobrar() {
  const [ordenes, setOrdenes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroCliente, setFiltroCliente] = useState("all");
  const [filtroEstado, setFiltroEstado] = useState("all");
  const [modalNueva, setModalNueva] = useState(false);
  const [modalEditar, setModalEditar] = useState(null);
  const [modalCliente, setModalCliente] = useState(false);
  const [modalPagar, setModalPagar] = useState(null);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: "", plazo_dias: 90 });
  const [form, setForm] = useState({
    cliente_id: "", numero_oc: "", descripcion: "",
    fecha_facturacion: "", monto_total: "",
    fecha_vencimiento: "", fecha_pago_esperado: "",
    fecha_pago_real: "", notas: ""
  });
  const [fechaPagoReal, setFechaPagoReal] = useState("");
  const [saving, setSaving] = useState(false);
  const [vistaCalendario, setVistaCalendario] = useState(false);
  const [docFile, setDocFile] = useState(null);
  const [docPreview, setDocPreview] = useState(null);
  const [analizando, setAnalizando] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: ords }, { data: cls }] = await Promise.all([
      supabase.from("ordenes_por_cobrar").select("*, clientes_oc(nombre, plazo_dias)").order("created_at", { ascending: false }),
      supabase.from("clientes_oc").select("*").order("nombre"),
    ]);
    setOrdenes(ords || []);
    setClientes(cls || []);
    setLoading(false);
  }

  function getEstadoReal(oc) {
    if (oc.fecha_pago_real) return "pagado";
    if (oc.fecha_vencimiento && new Date(oc.fecha_vencimiento) < new Date()) return "vencido";
    return "pendiente";
  }

  function autoVencimiento(fechaFacturacion, plazo) {
    if (!fechaFacturacion || !plazo) return "";
    const d = new Date(fechaFacturacion);
    d.setDate(d.getDate() + parseInt(plazo));
    return d.toISOString().split("T")[0];
  }

  function handleClienteChange(clienteId) {
    const cl = clientes.find(c => c.id === clienteId);
    const venc = form.fecha_facturacion
      ? autoVencimiento(form.fecha_facturacion, cl?.plazo_dias || 90)
      : "";
    setForm(p => ({ ...p, cliente_id: clienteId, fecha_vencimiento: venc }));
  }

  function handleFechaFacturacion(fecha) {
    const cl = clientes.find(c => c.id === form.cliente_id);
    const venc = autoVencimiento(fecha, cl?.plazo_dias || 90);
    setForm(p => ({ ...p, fecha_facturacion: fecha, fecha_vencimiento: venc }));
  }

  async function guardarOC(editando = false) {
    if (!form.cliente_id || !form.numero_oc || !form.monto_total) return;
    setSaving(true);
    const payload = {
      cliente_id: form.cliente_id,
      numero_oc: form.numero_oc,
      descripcion: form.descripcion,
      fecha_facturacion: form.fecha_facturacion || null,
      monto_total: parseFloat(form.monto_total),
      fecha_vencimiento: form.fecha_vencimiento || null,
      fecha_pago_esperado: form.fecha_pago_esperado || null,
      fecha_pago_real: form.fecha_pago_real || null,
      notas: form.notas,
      estado: form.fecha_pago_real ? "pagado" : "pendiente",
    };
    if (editando) {
      await supabase.from("ordenes_por_cobrar").update(payload).eq("id", modalEditar.id);
      setModalEditar(null);
    } else {
      await supabase.from("ordenes_por_cobrar").insert(payload);
      setModalNueva(false);
    }
    setForm({ cliente_id: "", numero_oc: "", descripcion: "", fecha_facturacion: "", monto_total: "", fecha_vencimiento: "", fecha_pago_esperado: "", fecha_pago_real: "", notas: "" });
    loadData();
    setSaving(false);
  }

  async function eliminarOC(id) {
    if (!window.confirm("¿Eliminar esta OC?")) return;
    await supabase.from("ordenes_por_cobrar").delete().eq("id", id);
    loadData();
  }

  async function marcarPagada(oc) {
    if (!fechaPagoReal) return;
    setSaving(true);
    await supabase.from("ordenes_por_cobrar").update({
      fecha_pago_real: fechaPagoReal,
      estado: "pagado"
    }).eq("id", oc.id);
    setModalPagar(null);
    setFechaPagoReal("");
    loadData();
    setSaving(false);
  }

  async function agregarCliente() {
    if (!nuevoCliente.nombre) return;
    setSaving(true);
    await supabase.from("clientes_oc").insert(nuevoCliente);
    setNuevoCliente({ nombre: "", plazo_dias: 90 });
    setModalCliente(false);
    loadData();
    setSaving(false);
  }

  function abrirEditar(oc) {
    setForm({
      cliente_id: oc.cliente_id,
      numero_oc: oc.numero_oc,
      descripcion: oc.descripcion || "",
      fecha_facturacion: oc.fecha_facturacion || "",
      monto_total: oc.monto_total || "",
      fecha_vencimiento: oc.fecha_vencimiento || "",
      fecha_pago_esperado: oc.fecha_pago_esperado || "",
      fecha_pago_real: oc.fecha_pago_real || "",
      notas: oc.notas || "",
    });
    setModalEditar(oc);
  }

  // KPIs
  const filtradas = ordenes.filter(o => {
    const est = getEstadoReal(o);
    const okCliente = filtroCliente === "all" || o.cliente_id === filtroCliente;
    const okEstado = filtroEstado === "all" || est === filtroEstado;
    return okCliente && okEstado;
  });

  const pagadas = ordenes.filter(o => getEstadoReal(o) === "pagado");
  const pendientes = ordenes.filter(o => getEstadoReal(o) === "pendiente");
  const vencidas = ordenes.filter(o => getEstadoReal(o) === "vencido");
  const sum = arr => arr.reduce((a, b) => a + parseFloat(b.monto_total || 0), 0);

  // Eventos para calendario
  const eventosCalendario = ordenes.flatMap(oc => {
    const evs = [];
    const estado = getEstadoReal(oc);
    const nombreCliente = oc.clientes_oc?.nombre || "";
    if (oc.fecha_facturacion) evs.push({ fecha: oc.fecha_facturacion, label: `📄 ${oc.numero_oc} ${nombreCliente}`, monto: null, pagado: false, alerta: false, icono: "📄" });
    if (oc.fecha_pago_real) evs.push({ fecha: oc.fecha_pago_real, label: `✅ ${oc.numero_oc} ${nombreCliente}`, monto: oc.monto_total, pagado: true, alerta: false, icono: "✅" });
    else if (oc.fecha_pago_esperado) {
      const dias = Math.ceil((new Date(oc.fecha_pago_esperado) - new Date()) / (1000*60*60*24));
      evs.push({ fecha: oc.fecha_pago_esperado, label: `💰 ${oc.numero_oc} ${nombreCliente}`, monto: oc.monto_total, pagado: false, alerta: dias <= 5 && dias >= 0, icono: estado === "vencido" ? "🔴" : "💰" });
    } else if (oc.fecha_vencimiento && estado !== "pagado") {
      const dias = Math.ceil((new Date(oc.fecha_vencimiento) - new Date()) / (1000*60*60*24));
      evs.push({ fecha: oc.fecha_vencimiento, label: `⚠️ ${oc.numero_oc} vence`, monto: oc.monto_total, pagado: false, alerta: dias <= 7 && dias >= 0, icono: estado === "vencido" ? "🔴" : "⚠️" });
    }
    return evs;
  });

  const estadoStyle = {
    pagado:   { bg: "#dcfce7", color: "#15803d", label: "✅ Cobrada" },
    pendiente:{ bg: "#fef9c3", color: "#854d0e", label: "⏳ Pendiente" },
    vencido:  { bg: "#fee2e2", color: "#991b1b", label: "🔴 Vencida" },
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Cargando...</div>;

  return (
    <div>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", letterSpacing: "-0.03em" }}>📦 OC × Cobrar</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary" onClick={() => setVistaCalendario(v => !v)}>
            {vistaCalendario ? "📋 Ver lista" : "📅 Ver calendario"}
          </Btn>
          <Btn variant="secondary" onClick={() => setModalCliente(true)}>+ Cliente</Btn>
          <Btn onClick={() => { setForm({ cliente_id: "", numero_oc: "", descripcion: "", fecha_facturacion: "", monto_total: "", fecha_vencimiento: "", fecha_pago_esperado: "", fecha_pago_real: "", notas: "" }); setModalNueva(true); }}>+ Nueva OC</Btn>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Cobradas", val: pagadas.length + " OC", sub: fmt(sum(pagadas)), color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
          { label: "Pendientes", val: pendientes.length + " OC", sub: fmt(sum(pendientes)), color: "#854d0e", bg: "#fef9c3", border: "#fde68a" },
          { label: "Vencidas", val: vencidas.length + " OC", sub: fmt(sum(vencidas)), color: "#991b1b", bg: "#fee2e2", border: "#fecaca" },
          { label: "Por cobrar", val: (pendientes.length + vencidas.length) + " OC", sub: fmt(sum([...pendientes, ...vencidas])), color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
        ].map(k => (
          <div key={k.label} style={{ background: k.bg, borderRadius: 14, padding: "16px 18px", border: `1.5px solid ${k.border}` }}>
            <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.val}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* FILTROS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <select value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)}
          style={{ padding: "7px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 12, color: "#374151", background: "#fff", cursor: "pointer" }}>
          <option value="all">Todos los clientes</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        {["all","pendiente","pagado","vencido"].map(f => (
          <button key={f} onClick={() => setFiltroEstado(f)}
            style={{ border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: filtroEstado === f ? "#0f172a" : "#f1f5f9", color: filtroEstado === f ? "#fff" : "#64748b" }}>
            {f === "all" ? "Todas" : f === "pendiente" ? "⏳ Pendientes" : f === "pagado" ? "✅ Cobradas" : "🔴 Vencidas"}
          </button>
        ))}
      </div>

      {/* VISTA CALENDARIO */}
      {vistaCalendario ? (
        <Calendario eventos={eventosCalendario} titulo="OC x Cobrar" />
      ) : (
        /* VISTA LISTA */
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Cliente", "N° OC", "Descripción", "Monto", "Facturación", "Vencimiento", "Pago Esp.", "Estado", ""].map(h => (
                  <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((oc, i) => {
                const est = getEstadoReal(oc);
                const s = estadoStyle[est];
                return (
                  <tr key={oc.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                    <td style={{ padding: "11px 14px", fontWeight: 600, fontSize: 12 }}>{oc.clientes_oc?.nombre}</td>
                    <td style={{ padding: "11px 14px", fontFamily: "monospace", fontSize: 11, color: "#64748b" }}>{oc.numero_oc}</td>
                    <td style={{ padding: "11px 14px", color: "#374151", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{oc.descripcion || "—"}</td>
                    <td style={{ padding: "11px 14px", fontWeight: 700 }}>{fmt(oc.monto_total)}</td>
                    <td style={{ padding: "11px 14px", color: "#64748b" }}>{fmtDate(oc.fecha_facturacion)}</td>
                    <td style={{ padding: "11px 14px", color: est === "vencido" ? "#dc2626" : "#64748b", fontWeight: est === "vencido" ? 700 : 400 }}>{fmtDate(oc.fecha_vencimiento)}</td>
                    <td style={{ padding: "11px 14px", color: "#64748b" }}>{fmtDate(oc.fecha_pago_esperado)}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{s.label}</span>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {est !== "pagado" && (
                          <Btn variant="success" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => { setModalPagar(oc); setFechaPagoReal(new Date().toISOString().split("T")[0]); }}>
                            💰 Cobrar
                          </Btn>
                        )}
                        <Btn variant="info" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => abrirEditar(oc)}>✏️</Btn>
                        <Btn variant="danger" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => eliminarOC(oc.id)}>🗑️</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtradas.length === 0 && (
                <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No hay OC registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL NUEVA OC */}
      {modalNueva && <FormOC titulo="Nueva OC por cobrar" onGuardar={() => guardarOC(false)} onCerrar={() => setModalNueva(false)} />}

      {/* MODAL EDITAR OC */}
      {modalEditar && <FormOC titulo={`Editar OC — ${modalEditar.numero_oc}`} onGuardar={() => guardarOC(true)} onCerrar={() => setModalEditar(null)} />}

      {/* MODAL MARCAR PAGADA */}
      <Modal open={!!modalPagar} onClose={() => setModalPagar(null)} title="Registrar cobro" maxWidth={400}>
        <div style={{ background: "#f8fafc", borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{modalPagar?.numero_oc} — {modalPagar?.clientes_oc?.nombre}</div>
          <div style={{ fontSize: 13 }}>Monto: <strong style={{ color: "#16a34a" }}>{fmt(modalPagar?.monto_total)}</strong></div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{modalPagar?.descripcion}</div>
        </div>
        <Input label="Fecha en que se recibió el pago" type="date" value={fechaPagoReal} onChange={e => setFechaPagoReal(e.target.value)} />
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary" onClick={() => setModalPagar(null)} style={{ flex: 1 }}>Cancelar</Btn>
          <Btn variant="success" onClick={() => marcarPagada(modalPagar)} disabled={saving} style={{ flex: 1 }}>✅ Confirmar cobro</Btn>
        </div>
      </Modal>

      {/* MODAL NUEVO CLIENTE */}
      <Modal open={modalCliente} onClose={() => setModalCliente(false)} title="Agregar cliente" maxWidth={380}>
        <Input label="Nombre del cliente *" value={nuevoCliente.nombre} onChange={e => setNuevoCliente(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Bimbo Panamá" />
        <Input label="Plazo de pago (días)" type="number" value={nuevoCliente.plazo_dias} onChange={e => setNuevoCliente(p => ({ ...p, plazo_dias: e.target.value }))} placeholder="90" />
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>El plazo se usa para calcular automáticamente la fecha de vencimiento al crear una OC.</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary" onClick={() => setModalCliente(false)} style={{ flex: 1 }}>Cancelar</Btn>
          <Btn onClick={agregarCliente} disabled={saving} style={{ flex: 1 }}>{saving ? "Guardando..." : "Agregar cliente"}</Btn>
        </div>
      </Modal>
    </div>
  );
}
function AdminView({ perfil, onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const [reload, setReload] = useState(0);
  const tabs = [
  { id: "dashboard", label: "📊 Dashboard" },
  { id: "ordenes", label: "📋 Órdenes" },
  { id: "inversionistas", label: "👥 Inversionistas" },
  { id: "pagos", label: "💳 Pagos mensuales" },
  { id: "calendario", label: "📅 Calendario" },
  { id: "vencimientos", label: "⏰ Vencimientos" },
  { id: "oc_cobrar", label: "📦 OC x Cobrar" },
];
  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Inter','DM Sans','Segoe UI',sans-serif" }}>
      <Nav perfil={perfil} tab={tab} setTab={setTab} tabs={tabs} onLogout={onLogout} accentColor="#2563eb" />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        {tab === "dashboard" && <AdminDashboard onReload={reload} />}
        {tab === "ordenes" && <AdminOrdenes profileId={perfil.id} />}
        {tab === "inversionistas" && <AdminInversionistas />}
        {tab === "pagos" && <AdminPagosMensuales />}
        {tab === "calendario" && <AdminCalendario />}
        {tab === "vencimientos" && <AdminVencimientos />}
        {tab === "oc_cobrar" && <AdminOCxCobrar />}
      </div>
    </div>
  );
}

function InvestorView({ perfil, onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const [reloadCount, setReloadCount] = useState(0);

  function handleTabChange(newTab) {
    setTab(newTab);
    if (newTab === "dashboard" || newTab === "inversiones") {
      setReloadCount(c => c + 1);
    }
  }

  const tabs = [
    { id: "dashboard", label: "📊 Mi cuenta" },
    { id: "oportunidades", label: "🔍 Oportunidades" },
    { id: "calendario", label: "📅 Calendario" },
    { id: "historial", label: "📂 Historial" },
    { id: "movimientos", label: "💳 Movimientos" },
  ];
  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Inter','DM Sans','Segoe UI',sans-serif" }}>
      <Nav perfil={perfil} tab={tab} setTab={handleTabChange} tabs={tabs} onLogout={onLogout} accentColor="#2563eb" />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        {tab === "dashboard" && <PortalDashboard profileId={perfil.id} reloadKey={reloadCount} />}
        {tab === "oportunidades" && <PortalOportunidades profileId={perfil.id} />}
        {tab === "calendario" && <PortalCalendario profileId={perfil.id} />}
        {tab === "historial" && <PortalHistorial profileId={perfil.id} />}
        {tab === "movimientos" && <PortalMovimientos profileId={perfil.id} />}
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ───────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadPerfil(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadPerfil(session.user.id);
      else { setPerfil(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadPerfil(userId) {
    const { data } = await supabase.from("profiles").select("*").eq("auth_user_id", userId).single();
    setPerfil(data);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#94a3b8", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>
      Cargando InvestAdmin...
    </div>
  );

  if (!session) return <Login />;
  if (!perfil) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#94a3b8", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Perfil no encontrado</div>
        <div style={{ fontSize: 13, marginTop: 6 }}>Contacta al administrador</div>
        <button onClick={handleLogout} style={{ marginTop: 16, border: "none", background: "#f1f5f9", borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>Cerrar sesión</button>
      </div>
    </div>
  );

  if (perfil.role === "admin") return <AdminView perfil={perfil} onLogout={handleLogout} />;
  if (perfil.role === "investor") return <InvestorView perfil={perfil} onLogout={handleLogout} />;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#94a3b8", fontFamily: "'DM Sans',sans-serif" }}>
      Rol no reconocido: {perfil.role}
    </div>
  );
}
