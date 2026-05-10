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
    primary:   { background: "#0f172a", color: "#fff" },
    secondary: { background: "#f1f5f9", color: "#374151" },
    danger:    { background: "#fef2f2", color: "#dc2626" },
    success:   { background: "#f0fdf4", color: "#16a34a" },
    info:      { background: "#eff6ff", color: "#2563eb" },
    purple:    { background: "#f5f3ff", color: "#7c3aed" },
    warning:   { background: "#fff7ed", color: "#c2410c" },
  };
  return (
    <button {...props} style={{ border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer", ...variants[variant], ...props.style }}>
      {children}
    </button>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}</div>}
      <input {...props} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none", color: "#0f172a", background: "#fafafa", boxSizing: "border-box", ...props.style }} />
    </div>
  );
}

function Sel({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}</div>}
      <select {...props} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none", color: "#0f172a", background: "#fafafa", boxSizing: "border-box" }}>
        {children}
      </select>
    </div>
  );
}

function Modal({ open, onClose, title, children, maxWidth = 520 }) {
  if (!open) return null;
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 28, width: "100%", maxWidth, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{title}</span>
          <button onClick={onClose} style={{ border: "none", background: "#f1f5f9", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 18, color: "#64748b" }}>×</button>
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
  return <span style={{ background: s.bg, color: s.color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{s.label}</span>;
}

function ProgressBar({ value, max, color = "#2563eb" }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 999, transition: "width 0.5s" }} />
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{pct.toFixed(0)}% fondeado</div>
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
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
    const ordenesActivas = (ords || []).filter(o => ["active", "open", "funded"].includes(o.status)).length;
    setStats({ capital, invertido, ganancias, ordenes: ordenesActivas });

    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const en30 = new Date(hoy); en30.setDate(en30.getDate() + 30);
    const venc = (parts || []).filter(p => {
      if (!p.end_date || p.status !== "active") return false;
      const d = new Date(p.end_date);
      return d >= hoy && d <= en30;
    }).sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
    setVencimientos(venc);
    setOrdenesAbiertas((ords || []).filter(o => o.status === "open"));
    setLoading(false);
  }

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Cargando dashboard...</div>;

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 24 }}>Dashboard General</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Capital total gestionado", val: fmt(stats.capital), icon: "💰", color: "#0ea5e9" },
          { label: "Capital invertido activo", val: fmt(stats.invertido), icon: "📈", color: "#7c3aed" },
          { label: "Ganancias pagadas", val: fmt(stats.ganancias), icon: "✅", color: "#16a34a" },
          { label: "Órdenes activas", val: stats.ordenes, icon: "📋", color: "#f59e0b" },
        ].map(k => (
          <div key={k.label} style={{ background: "#fff", borderRadius: 16, padding: "22px", border: "1.5px solid #e2e8f0" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{k.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: k.color, letterSpacing: "-0.5px" }}>{k.val}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {vencimientos.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 14 }}>⏰ Próximos vencimientos (30 días)</div>
          <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
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
        <div>
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
        <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a" }}>Órdenes de Inversión</div>
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
      <div style={{ fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 24 }}>Inversionistas</div>
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
  const [tab, setTab] = useState("inversiones");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: parts }, { data: movs }] = await Promise.all([
      supabase.from("participation_detail").select("*").eq("investor_id", inv.investor_id).order("created_at", { ascending: false }),
      supabase.from("capital_movements").select("*").eq("investor_id", inv.investor_id).order("created_at", { ascending: false }),
    ]);
    setParticipaciones(parts || []);
    setMovimientos(movs || []);
    setLoading(false);
  }

  return (
    <Modal open={true} onClose={onClose} title={inv.full_name} maxWidth={680}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
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

      <div style={{ display: "flex", gap: 0, borderBottom: "1.5px solid #e2e8f0", marginBottom: 16 }}>
        {[["inversiones","Inversiones"], ["movimientos","Movimientos"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ border: "none", background: "transparent", padding: "8px 16px", cursor: "pointer", fontSize: 13,
              fontWeight: tab === id ? 700 : 400, color: tab === id ? "#0f172a" : "#94a3b8",
              borderBottom: tab === id ? "2.5px solid #0f172a" : "2.5px solid transparent", marginBottom: -1.5 }}>
            {lbl}
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
    </Modal>
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
              <div key={p.participation_id} style={{ background: "#fff", borderRadius: 14, padding: 18, border: "1.5px solid #e2e8f0" }}>
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
            <div key={p.participation_id} style={{ background: "#fff", borderRadius: 14, padding: 18, border: "1.5px solid #e2e8f0" }}>
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

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ perfil, tab, setTab, tabs, onLogout, accentColor }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  function handleTab(id) {
    setTab(id);
    setMenuAbierto(false);
  }

  const LogoSVG = () => (
    <svg width="34" height="34" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 9 }}>
      <defs>
        <linearGradient id="navbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a"/>
          <stop offset="100%" stopColor="#1e3a5f"/>
        </linearGradient>
        <linearGradient id="navaccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>
        <linearGradient id="navgold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b"/>
          <stop offset="100%" stopColor="#fbbf24"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="80" fill="url(#navbg)"/>
      <rect x="80" y="240" width="40" height="70" rx="6" fill="url(#navaccent)" opacity="0.5"/>
      <rect x="135" y="195" width="40" height="115" rx="6" fill="url(#navaccent)" opacity="0.7"/>
      <rect x="190" y="150" width="40" height="160" rx="6" fill="url(#navaccent)" opacity="0.85"/>
      <rect x="245" y="110" width="40" height="200" rx="6" fill="url(#navaccent)"/>
      <polyline points="100,238 155,193 210,148 265,108" fill="none" stroke="url(#navgold)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="265" cy="108" r="20" fill="#fbbf24"/>
    </svg>
  );

  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", height: 56 }}>

        {/* LOGO */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: "auto" }}>
          <LogoSVG />
          <span style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>InvestAdmin</span>
        </div>

        {/* AVATAR */}
        <div style={{ width: 32, height: 32, borderRadius: 9, background: accentColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, marginRight: 8 }}>
          {perfil?.full_name?.[0] || "U"}
        </div>

        {/* HAMBURGUESA */}
        <button onClick={() => setMenuAbierto(p => !p)}
          style={{ border: "none", background: menuAbierto ? "#f1f5f9" : "transparent", borderRadius: 8, cursor: "pointer", padding: "6px 10px", fontSize: 18, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36 }}>
          {menuAbierto ? "✕" : "☰"}
        </button>
      </div>

      {/* MENÚ DESPLEGABLE */}
      {menuAbierto && (
        <div style={{ background: "#fff", borderTop: "1px solid #f1f5f9", padding: "8px 16px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
          {/* Info del usuario */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8fafc", borderRadius: 12, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: accentColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
              {perfil?.full_name?.[0] || "U"}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{perfil?.full_name}</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{perfil?.email}</div>
            </div>
          </div>

          {/* Opciones de navegación */}
          {tabs.map(t => (
            <button key={t.id} onClick={() => handleTab(t.id)}
              style={{ display: "flex", alignItems: "center", width: "100%", border: "none", background: tab === t.id ? "#f0f9ff" : "transparent", color: tab === t.id ? accentColor : "#374151", borderRadius: 10, padding: "12px 14px", cursor: "pointer", fontSize: 14, fontWeight: tab === t.id ? 700 : 400, marginBottom: 4, textAlign: "left", borderLeft: tab === t.id ? `3px solid ${accentColor}` : "3px solid transparent" }}>
              {t.label}
              {tab === t.id && <span style={{ marginLeft: "auto", background: accentColor, color: "#fff", borderRadius: 20, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>Activo</span>}
            </button>
          ))}

          {/* Cerrar sesión */}
          <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 8, paddingTop: 8 }}>
            <button onClick={onLogout}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", border: "none", background: "#fef2f2", color: "#dc2626", borderRadius: 10, padding: "12px 14px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
              🚪 Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VISTAS PRINCIPALES ──────────────────────────────────────────────────────
function AdminView({ perfil, onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const [reload, setReload] = useState(0);
  const tabs = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "ordenes", label: "📋 Órdenes" },
    { id: "inversionistas", label: "👥 Inversionistas" },
    { id: "vencimientos", label: "⏰ Vencimientos" },
  ];
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <Nav perfil={perfil} tab={tab} setTab={setTab} tabs={tabs} onLogout={onLogout} accentColor="#1d4ed8" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
        {tab === "dashboard" && <AdminDashboard onReload={reload} />}
        {tab === "ordenes" && <AdminOrdenes profileId={perfil.id} />}
        {tab === "inversionistas" && <AdminInversionistas />}
        {tab === "vencimientos" && <AdminVencimientos />}
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
    { id: "historial", label: "📂 Historial" },
    { id: "movimientos", label: "💳 Movimientos" },
  ];
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <Nav perfil={perfil} tab={tab} setTab={handleTabChange} tabs={tabs} onLogout={onLogout} accentColor="#7c3aed" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
        {tab === "dashboard" && <PortalDashboard profileId={perfil.id} reloadKey={reloadCount} />}
        {tab === "oportunidades" && <PortalOportunidades profileId={perfil.id} />}
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
