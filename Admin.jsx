import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════
   BUSINESS CONFIG
══════════════════════════════════════════════════════════ */
const BIZ = {
  name: "Alexandros Ohnesorge",
  firma: "Ohnesorge — Webdesign & KI-Automatisierung",
  adresse: "Bergmannstraße 64",
  plz: "01309 Dresden",
  email: "alex.ohnesorge@icloud.com",
  web: "ohnesorge-systems.vercel.app",
  steuer: "[Steuernummer folgt]",
  iban: "[IBAN folgt]",
  bank: "[Bank folgt]",
  zahlungsziel: 14,
};

const GOLD = "#e8c547";
const GOLD_DIM = "rgba(232,197,71,0.12)";
const GOLD_BORDER = "rgba(232,197,71,0.3)";
const BG = "#070707";
const BG2 = "#0f0f0f";
const BG3 = "#161616";
const BORDER = "rgba(255,255,255,0.07)";
const TEXT = "#f0f0f0";
const TEXT_DIM = "rgba(240,240,240,0.5)";
const TEXT_FAINT = "rgba(240,240,240,0.25)";
const GREEN = "#4ade80";
const RED = "#f87171";
const BLUE = "#60a5fa";

/* ══════════════════════════════════════════════════════════
   INITIAL USERS
══════════════════════════════════════════════════════════ */
const INITIAL_USERS = [
  { id: "admin", name: "Alexandros Ohnesorge", username: "alex", password: "Dresden50*", role: "admin" },
];

const PIPELINE_COLS = ["Lead", "Angebot", "Verhandlung", "Gewonnen", "Rechnung"];

const LEISTUNGEN_TEMPLATES = [
  { name: "Website Starter", beschreibung: "5-seitige Website, Mobile-optimiert, Kontaktformular, Impressum & Datenschutz, 3 Monate Support" },
  { name: "Website Professional", beschreibung: "Bis 10 Seiten, SEO-Optimierung, Blog/News-Bereich, Google Analytics, 6 Monate Support" },
  { name: "KI-Automatisierung", beschreibung: "1 vollständiger Workflow, E-Mail/WhatsApp/CRM-Anbindung, Einrichtung & Einweisung, 30 Tage Nachbetreuung" },
  { name: "Kombi-Paket", beschreibung: "Website + Automation aus einer Hand, 6 Monate Support, Schnellster ROI" },
  { name: "Individuelles Angebot", beschreibung: "" },
];

/* ══════════════════════════════════════════════════════════
   LOCAL STORAGE HELPERS
══════════════════════════════════════════════════════════ */
const ls = {
  get: (key, fallback = null) => { try { const v = localStorage.getItem("os_admin_" + key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set: (key, val) => { try { localStorage.setItem("os_admin_" + key, JSON.stringify(val)); } catch {} },
};

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
const fmt = (n) => Number(n).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
const today = () => new Date().toISOString().split("T")[0];
const dateDE = (iso) => { if (!iso) return "—"; const [y, m, d] = iso.split("-"); return `${d}.${m}.${y}`; };
const uid = () => Math.random().toString(36).slice(2, 10);
const rechnungsNr = () => { const n = ls.get("rechnungs_counter", 1); ls.set("rechnungs_counter", n + 1); return `RE-2026-${String(n).padStart(3, "0")}`; };
const angebotsNr = () => { const n = ls.get("angebots_counter", 1); ls.set("angebots_counter", n + 1); return `AN-2026-${String(n).padStart(3, "0")}`; };

/* ══════════════════════════════════════════════════════════
   PDF GENERATOR
══════════════════════════════════════════════════════════ */
function generatePDF({ type, nummer, kunde, leistung, preis, datum, faellig, signatureDataUrl, verkaeufer, notizen }) {
  const html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"/>
  <title>${type} ${nummer}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#1a1a1a;padding:48px;max-width:800px;margin:0 auto}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px;padding-bottom:24px;border-bottom:2px solid #1a1a1a}
    .logo{font-size:22px;font-weight:800;letter-spacing:-0.03em}
    .logo span{color:#e8c547}
    .biz-info{font-size:11px;color:#666;text-align:right;line-height:1.7}
    .doc-title{font-size:28px;font-weight:800;margin-bottom:8px;letter-spacing:-0.02em}
    .doc-meta{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:40px}
    .meta-block h4{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#999;margin-bottom:8px}
    .meta-block p{font-size:13px;line-height:1.7;color:#1a1a1a}
    .meta-block p strong{font-weight:600}
    table{width:100%;border-collapse:collapse;margin-bottom:32px}
    th{background:#1a1a1a;color:#fff;padding:10px 14px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}
    td{padding:12px 14px;border-bottom:1px solid #eee;font-size:13px;vertical-align:top}
    tr:last-child td{border-bottom:none}
    .total-row td{font-weight:700;font-size:15px;background:#f9f9f9;border-top:2px solid #1a1a1a}
    .total-price{color:#1a1a1a;font-size:18px;font-weight:800}
    .sig-section{margin-top:48px;padding-top:24px;border-top:1px solid #eee}
    .sig-section h4{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#999;margin-bottom:16px}
    .sig-img{max-width:240px;height:80px;object-fit:contain;border-bottom:1px solid #1a1a1a;padding-bottom:4px}
    .sig-name{font-size:12px;color:#666;margin-top:6px}
    .footer{margin-top:48px;padding-top:16px;border-top:1px solid #eee;font-size:10px;color:#999;line-height:1.7}
    .badge{display:inline-block;background:#e8c547;color:#1a1a1a;font-size:10px;font-weight:700;padding:3px 10px;border-radius:3px;text-transform:uppercase;letter-spacing:.06em}
    .iban-block{margin-top:16px;background:#f5f5f5;padding:12px 16px;border-radius:4px;font-size:12px}
    .iban-block strong{display:block;margin-bottom:4px}
    @media print{body{padding:24px}.no-print{display:none}}
  </style>
  </head><body>
  <div class="header">
    <div><div class="logo">Ohnesorge<span>.</span></div><div style="font-size:11px;color:#666;margin-top:4px;">Webdesign & KI-Automatisierung</div></div>
    <div class="biz-info">
      <strong>${BIZ.name}</strong><br>
      ${BIZ.adresse}<br>${BIZ.plz}<br>
      ${BIZ.email}<br>${BIZ.web}
    </div>
  </div>

  <div class="doc-title">${type === "Rechnung" ? "Rechnung" : "Angebot"}</div>
  <div style="margin-bottom:32px"><span class="badge">${nummer}</span></div>

  <div class="doc-meta">
    <div class="meta-block">
      <h4>Auftraggeber</h4>
      <p><strong>${kunde.name}</strong><br>
      ${kunde.firma ? kunde.firma + "<br>" : ""}
      ${kunde.email ? kunde.email + "<br>" : ""}
      ${kunde.telefon || ""}
      </p>
    </div>
    <div class="meta-block">
      <h4>Dokument-Details</h4>
      <p>
        <strong>${type === "Rechnung" ? "Rechnungsdatum" : "Angebotsdatum"}:</strong> ${dateDE(datum)}<br>
        ${type === "Rechnung" ? `<strong>Fällig bis:</strong> ${dateDE(faellig)}<br>` : `<strong>Gültig bis:</strong> ${dateDE(faellig)}<br>`}
        <strong>Betreuer:</strong> ${verkaeufer || BIZ.name}
      </p>
    </div>
  </div>

  <table>
    <thead><tr><th>Leistung</th><th>Beschreibung</th><th style="text-align:right">Betrag</th></tr></thead>
    <tbody>
      <tr>
        <td><strong>${leistung.name}</strong></td>
        <td style="color:#666">${leistung.beschreibung || "Gemäß Vereinbarung"}</td>
        <td style="text-align:right;font-weight:600">${preis ? fmt(preis) : "Auf Anfrage"}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="total-row">
        <td colspan="2">Gesamtbetrag (gemäß § 19 UStG keine MwSt.)</td>
        <td style="text-align:right" class="total-price">${preis ? fmt(preis) : "Auf Anfrage"}</td>
      </tr>
    </tfoot>
  </table>

  ${notizen ? `<div style="background:#f9f9f9;padding:16px;border-radius:4px;margin-bottom:24px;font-size:13px;color:#666"><strong>Hinweise:</strong> ${notizen}</div>` : ""}

  ${type === "Rechnung" ? `
  <div class="iban-block">
    <strong>Bankverbindung</strong>
    IBAN: ${BIZ.iban}<br>
    ${BIZ.bank}<br>
    Verwendungszweck: ${nummer}
  </div>
  <p style="font-size:12px;color:#666;margin-top:12px">Bitte überweisen Sie den Betrag innerhalb von ${BIZ.zahlungsziel} Tagen auf das oben genannte Konto.</p>
  ` : `<p style="font-size:12px;color:#666">Dieses Angebot ist 30 Tage gültig. Bei Fragen stehe ich Ihnen gerne zur Verfügung.</p>`}

  ${signatureDataUrl ? `
  <div class="sig-section">
    <h4>Unterschrift Auftraggeber</h4>
    <img class="sig-img" src="${signatureDataUrl}" alt="Unterschrift"/>
    <div class="sig-name">${kunde.name} · ${dateDE(datum)}</div>
  </div>` : ""}

  <div class="footer">
    ${BIZ.name} · ${BIZ.adresse} · ${BIZ.plz} · ${BIZ.email}<br>
    Steuernummer: ${BIZ.steuer} · Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).
  </div>

  <div class="no-print" style="margin-top:32px;text-align:center">
    <button onclick="window.print()" style="background:#1a1a1a;color:#fff;border:none;padding:12px 32px;font-size:14px;font-weight:600;border-radius:6px;cursor:pointer;font-family:inherit">
      Als PDF speichern / Drucken
    </button>
  </div>
  </body></html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 600);
}

/* ══════════════════════════════════════════════════════════
   SIGNATURE PAD COMPONENT
══════════════════════════════════════════════════════════ */
function SignaturePad({ onSave, onCancel }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const client = e.touches ? e.touches[0] : e;
    return { x: client.clientX - rect.left, y: client.clientY - rect.top };
  };

  const start = (e) => { e.preventDefault(); drawing.current = true; lastPos.current = getPos(e); };
  const end = () => { drawing.current = false; lastPos.current = null; };
  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const clear = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const save = () => {
    const dataUrl = canvasRef.current.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 28, maxWidth: 560, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Digitale Unterschrift</div>
            <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 2 }}>Mit Finger oder Maus unterschreiben</div>
          </div>
          <button onClick={onCancel} style={{ background: "none", border: "none", color: TEXT_DIM, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ background: "#fff", borderRadius: 10, border: `2px solid ${BORDER}`, marginBottom: 16, overflow: "hidden" }}>
          <canvas ref={canvasRef} width={500} height={160} style={{ display: "block", width: "100%", touchAction: "none", cursor: "crosshair" }}
            onMouseDown={start} onMouseMove={draw} onMouseUp={end} onMouseLeave={end}
            onTouchStart={start} onTouchMove={draw} onTouchEnd={end} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={clear} style={{ background: "transparent", border: `1px solid ${BORDER}`, color: TEXT_DIM, borderRadius: 8, padding: "10px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Löschen</button>
          <button onClick={onCancel} style={{ background: "transparent", border: `1px solid ${BORDER}`, color: TEXT_DIM, borderRadius: 8, padding: "10px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Abbrechen</button>
          <button onClick={save} style={{ flex: 1, background: GOLD, color: "#070707", border: "none", borderRadius: 8, padding: "10px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            ✓ Unterschrift übernehmen
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LOGIN SCREEN
══════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = () => {
    const users = ls.get("users", INITIAL_USERS);
    const user = users.find(u => u.username === username.trim() && u.password === password);
    if (user) { onLogin(user); setError(""); }
    else setError("Benutzername oder Passwort falsch.");
  };

  const inp = { background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px 16px", color: TEXT, fontSize: 14, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 40, maxWidth: 400, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: TEXT }}>Ohnesorge<span style={{ color: GOLD }}>.</span></div>
          <div style={{ fontSize: 13, color: TEXT_DIM, marginTop: 6 }}>Admin-Bereich · Bitte einloggen</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Benutzername</label>
          <input style={inp} value={username} onChange={e => setUsername(e.target.value)} placeholder="benutzername" onKeyDown={e => e.key === "Enter" && login()} autoFocus
            onFocus={e => e.currentTarget.style.borderColor = GOLD} onBlur={e => e.currentTarget.style.borderColor = BORDER} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Passwort</label>
          <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && login()}
            onFocus={e => e.currentTarget.style.borderColor = GOLD} onBlur={e => e.currentTarget.style.borderColor = BORDER} />
        </div>
        {error && <div style={{ background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: RED, marginBottom: 16 }}>{error}</div>}
        <button onClick={login} style={{ width: "100%", background: GOLD, color: "#070707", border: "none", borderRadius: 8, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Einloggen →
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════ */
function Sidebar({ view, setView, user, onLogout }) {
  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "pipeline", icon: "🎯", label: "Pipeline" },
    { id: "kunden", icon: "👥", label: "Kunden" },
    { id: "angebote", icon: "📄", label: "Angebote" },
    { id: "rechnungen", icon: "💶", label: "Rechnungen" },
    ...(user.role === "admin" ? [{ id: "team", icon: "🔐", label: "Team" }] : []),
  ];

  return (
    <div style={{ width: 220, background: BG2, borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 100 }}>
      <div style={{ padding: "24px 20px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.03em", color: TEXT }}>Ohnesorge<span style={{ color: GOLD }}>.</span></div>
        <div style={{ fontSize: 11, color: TEXT_FAINT, marginTop: 2 }}>Admin-Bereich</div>
      </div>
      <div style={{ padding: "16px 12px", flex: 1 }}>
        {navItems.map(({ id, icon, label }) => (
          <button key={id} onClick={() => setView(id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", background: view === id ? GOLD_DIM : "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: view === id ? 600 : 400, color: view === id ? GOLD : TEXT_DIM, transition: "all .15s", marginBottom: 2, borderLeft: view === id ? `3px solid ${GOLD}` : "3px solid transparent", textAlign: "left" }}>
            <span style={{ fontSize: 16 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
      <div style={{ padding: "16px 20px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 2 }}>{user.name}</div>
        <div style={{ fontSize: 11, color: TEXT_FAINT, marginBottom: 12 }}>{user.role === "admin" ? "Administrator" : "Verkäufer"}</div>
        <button onClick={onLogout} style={{ width: "100%", background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px", fontSize: 12, color: TEXT_DIM, cursor: "pointer", fontFamily: "inherit" }}>Ausloggen</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════ */
function Dashboard({ leads, rechnungen, user }) {
  const myLeads = user.role === "admin" ? leads : leads.filter(l => l.verkaeufer_id === user.id);
  const gewonnen = myLeads.filter(l => l.status === "Gewonnen" || l.status === "Rechnung");
  const offeneRechnungen = rechnungen.filter(r => r.status === "Offen" && (user.role === "admin" || r.verkaeufer_id === user.id));
  const umsatz = rechnungen.filter(r => r.status === "Bezahlt" && (user.role === "admin" || r.verkaeufer_id === user.id)).reduce((s, r) => s + (r.preis || 0), 0);
  const pipeline_wert = myLeads.filter(l => l.preis && l.status !== "Rechnung").reduce((s, l) => s + (l.preis || 0), 0);

  const StatCard = ({ icon, label, value, color }) => (
    <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "24px 20px" }}>
      <div style={{ fontSize: 22, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: color || TEXT, letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 6 }}>{label}</div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>Guten Morgen, {user.name.split(" ")[0]} 👋</div>
        <div style={{ fontSize: 14, color: TEXT_DIM, marginTop: 4 }}>Hier ist deine aktuelle Übersicht.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
        <StatCard icon="🎯" label="Aktive Leads" value={myLeads.filter(l => l.status !== "Rechnung").length} />
        <StatCard icon="✅" label="Abschlüsse" value={gewonnen.length} color={GREEN} />
        <StatCard icon="💶" label="Pipeline-Wert" value={pipeline_wert ? fmt(pipeline_wert) : "—"} color={GOLD} />
        <StatCard icon="📈" label="Umsatz (bezahlt)" value={umsatz ? fmt(umsatz) : "—"} color={BLUE} />
      </div>

      {offeneRechnungen.length > 0 && (
        <div style={{ background: "rgba(248,113,113,.06)", border: "1px solid rgba(248,113,113,.2)", borderRadius: 14, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: RED, marginBottom: 12 }}>⚠ Offene Rechnungen ({offeneRechnungen.length})</div>
          {offeneRechnungen.map(r => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid rgba(248,113,113,.1)` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{r.kunde_name}</div>
                <div style={{ fontSize: 11, color: TEXT_DIM }}>{r.nummer} · fällig {dateDE(r.faellig)}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: RED }}>{fmt(r.preis)}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 16 }}>Letzte Aktivitäten</div>
        {myLeads.slice(-5).reverse().map(l => (
          <div key={l.id} style={{ display: "flex", justify: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{l.name}</span>
              <span style={{ fontSize: 12, color: TEXT_DIM, marginLeft: 8 }}>{l.leistung_name || "—"}</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {l.preis && <span style={{ fontSize: 12, color: GOLD, fontWeight: 600 }}>{fmt(l.preis)}</span>}
              <span style={{ fontSize: 11, background: l.status === "Gewonnen" || l.status === "Rechnung" ? "rgba(74,222,128,.1)" : GOLD_DIM, color: l.status === "Gewonnen" || l.status === "Rechnung" ? GREEN : GOLD, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>{l.status}</span>
            </div>
          </div>
        ))}
        {myLeads.length === 0 && <div style={{ fontSize: 13, color: TEXT_FAINT, textAlign: "center", padding: "20px 0" }}>Noch keine Leads. Erstelle deinen ersten in der Pipeline.</div>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PIPELINE
══════════════════════════════════════════════════════════ */
function Pipeline({ leads, setLeads, user, users, onOpenLead }) {
  const myLeads = user.role === "admin" ? leads : leads.filter(l => l.verkaeufer_id === user.id);

  const moveStatus = (id, status) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const deleteLead = (id) => {
    if (!confirm("Lead wirklich löschen?")) return;
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const gesamtwert = myLeads.filter(l => l.preis).reduce((s, l) => s + (l.preis || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>Sales Pipeline</div>
          <div style={{ fontSize: 13, color: TEXT_DIM, marginTop: 4 }}>Pipeline-Wert: <span style={{ color: GOLD, fontWeight: 700 }}>{fmt(gesamtwert)}</span></div>
        </div>
        <button onClick={() => onOpenLead(null)} style={{ background: GOLD, color: "#070707", border: "none", borderRadius: 8, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
          + Neuer Lead
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, overflowX: "auto" }}>
        {PIPELINE_COLS.map(col => {
          const colLeads = myLeads.filter(l => l.status === col);
          const colWert = colLeads.filter(l => l.preis).reduce((s, l) => s + (l.preis || 0), 0);
          return (
            <div key={col}>
              <div style={{ marginBottom: 12, padding: "0 4px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: TEXT_DIM }}>{col}</div>
                <div style={{ fontSize: 11, color: TEXT_FAINT, marginTop: 2 }}>{colLeads.length} Leads{colWert ? ` · ${fmt(colWert)}` : ""}</div>
              </div>
              <div style={{ background: "rgba(255,255,255,.02)", borderRadius: 10, padding: 8, minHeight: 200 }}>
                {colLeads.map(lead => {
                  const vk = users.find(u => u.id === lead.verkaeufer_id);
                  return (
                    <div key={lead.id} style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px", marginBottom: 8, cursor: "pointer", transition: "border-color .15s" }}
                      onMouseOver={e => e.currentTarget.style.borderColor = GOLD_BORDER} onMouseOut={e => e.currentTarget.style.borderColor = BORDER}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: TEXT, flex: 1 }}>{lead.name}</div>
                        <button onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }} style={{ background: "none", border: "none", color: TEXT_FAINT, cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                      </div>
                      {lead.firma && <div style={{ fontSize: 11, color: TEXT_DIM, marginBottom: 4 }}>{lead.firma}</div>}
                      {lead.leistung_name && <div style={{ fontSize: 11, color: TEXT_DIM, marginBottom: 6 }}>{lead.leistung_name}</div>}
                      {lead.preis && <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, marginBottom: 8 }}>{fmt(lead.preis)}</div>}
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        <button onClick={() => onOpenLead(lead)} style={{ fontSize: 10, background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, color: GOLD, borderRadius: 4, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit" }}>Öffnen</button>
                        {PIPELINE_COLS.filter(c => c !== col).map(c => (
                          <button key={c} onClick={() => moveStatus(lead.id, c)} style={{ fontSize: 10, background: "rgba(255,255,255,.04)", border: `1px solid ${BORDER}`, color: TEXT_FAINT, borderRadius: 4, padding: "3px 6px", cursor: "pointer", fontFamily: "inherit" }}>→ {c}</button>
                        ))}
                      </div>
                      {vk && user.role === "admin" && <div style={{ fontSize: 10, color: TEXT_FAINT, marginTop: 8 }}>👤 {vk.name}</div>}
                    </div>
                  );
                })}
                {colLeads.length === 0 && <div style={{ textAlign: "center", padding: "24px 8px", fontSize: 12, color: TEXT_FAINT }}>Leer</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LEAD MODAL (New / Edit)
══════════════════════════════════════════════════════════ */
function LeadModal({ lead, user, users, onSave, onClose, onCreateAngebot, onSignature }) {
  const isNew = !lead;
  const [form, setForm] = useState(lead || {
    id: uid(), name: "", firma: "", email: "", telefon: "", leistung_name: "", leistung_beschreibung: "", preis: "", status: "Lead", verkaeufer_id: user.id, notizen: "", erstellt: today(),
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inp = { background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", color: TEXT, fontSize: 13, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color .15s" };
  const focus = e => e.currentTarget.style.borderColor = GOLD;
  const blur = e => e.currentTarget.style.borderColor = BORDER;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 20, maxWidth: 600, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>{isNew ? "Neuer Lead" : "Lead bearbeiten"}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: TEXT_DIM, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Name *</label>
              <input style={inp} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Max Mustermann" onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Firma</label>
              <input style={inp} value={form.firma || ""} onChange={e => set("firma", e.target.value)} placeholder="Musterfirma GmbH" onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>E-Mail</label>
              <input style={inp} type="email" value={form.email || ""} onChange={e => set("email", e.target.value)} placeholder="max@firma.de" onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Telefon</label>
              <input style={inp} value={form.telefon || ""} onChange={e => set("telefon", e.target.value)} placeholder="+49 351 ..." onFocus={focus} onBlur={blur} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Leistung</label>
            <select style={{ ...inp, cursor: "pointer" }} value={form.leistung_name || ""} onChange={e => { const t = LEISTUNGEN_TEMPLATES.find(t => t.name === e.target.value); set("leistung_name", e.target.value); if (t?.beschreibung) set("leistung_beschreibung", t.beschreibung); }} onFocus={focus} onBlur={blur}>
              <option value="">— Bitte wählen —</option>
              {LEISTUNGEN_TEMPLATES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Leistungsbeschreibung</label>
            <textarea style={{ ...inp, resize: "vertical", minHeight: 70 }} value={form.leistung_beschreibung || ""} onChange={e => set("leistung_beschreibung", e.target.value)} placeholder="Beschreibung der Leistung..." onFocus={focus} onBlur={blur} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Preis (€) — frei festlegen</label>
              <input style={inp} type="number" value={form.preis || ""} onChange={e => set("preis", e.target.value ? Number(e.target.value) : "")} placeholder="z.B. 1490" onFocus={focus} onBlur={blur} />
              <div style={{ fontSize: 11, color: TEXT_FAINT, marginTop: 4 }}>Leer lassen wenn noch offen</div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Status</label>
              <select style={{ ...inp, cursor: "pointer" }} value={form.status} onChange={e => set("status", e.target.value)} onFocus={focus} onBlur={blur}>
                {PIPELINE_COLS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {user.role === "admin" && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Verkäufer</label>
              <select style={{ ...inp, cursor: "pointer" }} value={form.verkaeufer_id} onChange={e => set("verkaeufer_id", e.target.value)} onFocus={focus} onBlur={blur}>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          )}

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Wiedervorlage / Nächster Kontakt</label>
            <input style={inp} type="date" value={form.wiedervorlage || ""} onChange={e => set("wiedervorlage", e.target.value)} onFocus={focus} onBlur={blur} />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Notizen</label>
            <textarea style={{ ...inp, resize: "vertical", minHeight: 80 }} value={form.notizen || ""} onChange={e => set("notizen", e.target.value)} placeholder="Gesprächsnotizen, Besonderheiten..." onFocus={focus} onBlur={blur} />
          </div>
        </div>

        <div style={{ padding: "16px 28px 24px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => onSave(form)} style={{ background: GOLD, color: "#070707", border: "none", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Speichern</button>
          {!isNew && form.name && (
            <>
              <button onClick={() => onCreateAngebot(form)} style={{ background: BG3, border: `1px solid ${BORDER}`, color: TEXT, borderRadius: 8, padding: "11px 20px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>📄 Angebot erstellen</button>
              <button onClick={() => onSignature(form)} style={{ background: BG3, border: `1px solid ${BORDER}`, color: TEXT, borderRadius: 8, padding: "11px 20px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>✍️ Unterschrift</button>
            </>
          )}
          <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${BORDER}`, color: TEXT_DIM, borderRadius: 8, padding: "11px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}>Schließen</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ANGEBOTE
══════════════════════════════════════════════════════════ */
function Angebote({ angebote, setAngebote, leads, user, users }) {
  const [showForm, setShowForm] = useState(false);
  const [editAngebot, setEditAngebot] = useState(null);
  const myAngebote = user.role === "admin" ? angebote : angebote.filter(a => a.verkaeufer_id === user.id);

  const openNew = () => { setEditAngebot({ id: uid(), nummer: angebotsNr(), kunde_name: "", kunde_firma: "", kunde_email: "", leistung_name: "", leistung_beschreibung: "", preis: "", datum: today(), faellig: "", notizen: "", status: "Offen", verkaeufer_id: user.id }); setShowForm(true); };

  const save = (a) => {
    setAngebote(prev => { const exists = prev.find(x => x.id === a.id); return exists ? prev.map(x => x.id === a.id ? a : x) : [...prev, a]; });
    setShowForm(false);
  };

  const deleteit = (id) => { if (confirm("Angebot löschen?")) setAngebote(prev => prev.filter(a => a.id !== id)); };

  const printAngebot = (a) => {
    const vk = users.find(u => u.id === a.verkaeufer_id);
    generatePDF({ type: "Angebot", nummer: a.nummer, kunde: { name: a.kunde_name, firma: a.kunde_firma, email: a.kunde_email }, leistung: { name: a.leistung_name, beschreibung: a.leistung_beschreibung }, preis: a.preis, datum: a.datum, faellig: a.faellig, verkaeufer: vk?.name, notizen: a.notizen });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>Angebote</div>
        <button onClick={openNew} style={{ background: GOLD, color: "#070707", border: "none", borderRadius: 8, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Neues Angebot</button>
      </div>

      {showForm && editAngebot && (
        <AngebotForm angebot={editAngebot} user={user} users={users} leads={leads} onSave={save} onClose={() => setShowForm(false)} onPrint={printAngebot} />
      )}

      <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto auto auto", gap: 0, padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 600, color: TEXT_DIM, textTransform: "uppercase", letterSpacing: ".06em" }}>
          <span>Nummer</span><span>Kunde</span><span>Preis</span><span>Datum</span><span>Status</span><span></span>
        </div>
        {myAngebote.length === 0 && <div style={{ textAlign: "center", padding: "40px", fontSize: 14, color: TEXT_FAINT }}>Noch keine Angebote. Erstelle dein erstes.</div>}
        {myAngebote.map(a => (
          <div key={a.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto auto auto auto", gap: 0, padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, alignItems: "center" }}>
            <span style={{ fontSize: 13, fontFamily: "monospace", color: GOLD }}>{a.nummer}</span>
            <div><div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{a.kunde_name}</div>{a.kunde_firma && <div style={{ fontSize: 11, color: TEXT_DIM }}>{a.kunde_firma}</div>}</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, paddingRight: 20 }}>{a.preis ? fmt(a.preis) : "—"}</span>
            <span style={{ fontSize: 12, color: TEXT_DIM, paddingRight: 20 }}>{dateDE(a.datum)}</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: a.status === "Angenommen" ? "rgba(74,222,128,.1)" : a.status === "Abgelehnt" ? "rgba(248,113,113,.1)" : GOLD_DIM, color: a.status === "Angenommen" ? GREEN : a.status === "Abgelehnt" ? RED : GOLD, marginRight: 12 }}>{a.status}</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => { setEditAngebot(a); setShowForm(true); }} style={{ fontSize: 11, background: BG3, border: `1px solid ${BORDER}`, color: TEXT_DIM, borderRadius: 5, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>Bearbeiten</button>
              <button onClick={() => printAngebot(a)} style={{ fontSize: 11, background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, color: GOLD, borderRadius: 5, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>PDF</button>
              <button onClick={() => deleteit(a.id)} style={{ fontSize: 11, background: "rgba(248,113,113,.06)", border: "1px solid rgba(248,113,113,.15)", color: RED, borderRadius: 5, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AngebotForm({ angebot, user, users, leads, onSave, onClose, onPrint }) {
  const [form, setForm] = useState({ ...angebot });
  const [showSig, setShowSig] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inp = { background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", color: TEXT, fontSize: 13, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" };
  const focus = e => e.currentTarget.style.borderColor = GOLD;
  const blur = e => e.currentTarget.style.borderColor = BORDER;

  const fillFromLead = (leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) { set("kunde_name", lead.name); set("kunde_firma", lead.firma || ""); set("kunde_email", lead.email || ""); set("leistung_name", lead.leistung_name || ""); set("leistung_beschreibung", lead.leistung_beschreibung || ""); set("preis", lead.preis || ""); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 20, maxWidth: 640, width: "100%", maxHeight: "92vh", overflow: "auto" }}>
        {showSig && <SignaturePad onSave={sig => { set("signatur", sig); setShowSig(false); }} onCancel={() => setShowSig(false)} />}
        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Angebot — <span style={{ color: GOLD, fontFamily: "monospace" }}>{form.nummer}</span></div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: TEXT_DIM, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Aus Lead befüllen</label>
            <select style={{ ...inp, cursor: "pointer" }} onChange={e => fillFromLead(e.target.value)} onFocus={focus} onBlur={blur}>
              <option value="">— Lead auswählen (optional) —</option>
              {leads.filter(l => user.role === "admin" || l.verkaeufer_id === user.id).map(l => <option key={l.id} value={l.id}>{l.name}{l.firma ? ` · ${l.firma}` : ""}</option>)}
            </select>
          </div>
          <div style={{ height: 1, background: BORDER }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Kundenname *</label><input style={inp} value={form.kunde_name} onChange={e => set("kunde_name", e.target.value)} placeholder="Max Mustermann" onFocus={focus} onBlur={blur} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Firma</label><input style={inp} value={form.kunde_firma || ""} onChange={e => set("kunde_firma", e.target.value)} onFocus={focus} onBlur={blur} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>E-Mail Kunde</label><input style={inp} type="email" value={form.kunde_email || ""} onChange={e => set("kunde_email", e.target.value)} onFocus={focus} onBlur={blur} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Angebotsdatum</label><input style={inp} type="date" value={form.datum} onChange={e => set("datum", e.target.value)} onFocus={focus} onBlur={blur} /></div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Leistung</label>
            <select style={{ ...inp, cursor: "pointer", marginBottom: 8 }} value={form.leistung_name || ""} onChange={e => { const t = LEISTUNGEN_TEMPLATES.find(t => t.name === e.target.value); set("leistung_name", e.target.value); if (t?.beschreibung) set("leistung_beschreibung", t.beschreibung); }} onFocus={focus} onBlur={blur}>
              <option value="">— Vorlage wählen —</option>
              {LEISTUNGEN_TEMPLATES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
            <textarea style={{ ...inp, resize: "vertical", minHeight: 80 }} value={form.leistung_beschreibung || ""} onChange={e => set("leistung_beschreibung", e.target.value)} placeholder="Leistungsbeschreibung anpassen..." onFocus={focus} onBlur={blur} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Preis (€) — frei</label>
              <input style={inp} type="number" value={form.preis || ""} onChange={e => set("preis", e.target.value ? Number(e.target.value) : "")} placeholder="z.B. 1490" onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Gültig bis</label>
              <input style={inp} type="date" value={form.faellig || ""} onChange={e => set("faellig", e.target.value)} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Status</label>
              <select style={{ ...inp, cursor: "pointer" }} value={form.status} onChange={e => set("status", e.target.value)} onFocus={focus} onBlur={blur}>
                {["Offen","Angenommen","Abgelehnt"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Notizen / Bedingungen</label><textarea style={{ ...inp, resize: "vertical", minHeight: 60 }} value={form.notizen || ""} onChange={e => set("notizen", e.target.value)} onFocus={focus} onBlur={blur} /></div>
          {form.signatur && <div style={{ background: "#fff", borderRadius: 8, padding: 12, textAlign: "center" }}><img src={form.signatur} alt="Unterschrift" style={{ maxWidth: 200, height: 60, objectFit: "contain" }} /><div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>✓ Unterschrift vorhanden</div></div>}
        </div>
        <div style={{ padding: "16px 28px 24px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => onSave(form)} style={{ background: GOLD, color: "#070707", border: "none", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Speichern</button>
          <button onClick={() => onPrint(form)} style={{ background: BG3, border: `1px solid ${BORDER}`, color: TEXT, borderRadius: 8, padding: "11px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>📄 PDF / Drucken</button>
          <button onClick={() => setShowSig(true)} style={{ background: BG3, border: `1px solid ${BORDER}`, color: TEXT, borderRadius: 8, padding: "11px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>✍️ Unterschrift</button>
          <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${BORDER}`, color: TEXT_DIM, borderRadius: 8, padding: "11px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}>Schließen</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   RECHNUNGEN
══════════════════════════════════════════════════════════ */
function Rechnungen({ rechnungen, setRechnungen, leads, angebote, user, users }) {
  const [showForm, setShowForm] = useState(false);
  const [editR, setEditR] = useState(null);
  const myR = user.role === "admin" ? rechnungen : rechnungen.filter(r => r.verkaeufer_id === user.id);
  const offen = myR.filter(r => r.status === "Offen").reduce((s, r) => s + (r.preis || 0), 0);
  const bezahlt = myR.filter(r => r.status === "Bezahlt").reduce((s, r) => s + (r.preis || 0), 0);

  const openNew = () => {
    const faellig = new Date();
    faellig.setDate(faellig.getDate() + BIZ.zahlungsziel);
    setEditR({ id: uid(), nummer: rechnungsNr(), kunde_name: "", kunde_firma: "", kunde_email: "", leistung_name: "", leistung_beschreibung: "", preis: "", datum: today(), faellig: faellig.toISOString().split("T")[0], status: "Offen", verkaeufer_id: user.id, notizen: "" });
    setShowForm(true);
  };

  const save = (r) => { setRechnungen(prev => { const e = prev.find(x => x.id === r.id); return e ? prev.map(x => x.id === r.id ? r : x) : [...prev, r]; }); setShowForm(false); };
  const deleteit = (id) => { if (confirm("Rechnung löschen?")) setRechnungen(prev => prev.filter(r => r.id !== id)); };
  const toggleStatus = (id) => setRechnungen(prev => prev.map(r => r.id === id ? { ...r, status: r.status === "Offen" ? "Bezahlt" : "Offen" } : r));

  const printR = (r) => {
    const vk = users.find(u => u.id === r.verkaeufer_id);
    generatePDF({ type: "Rechnung", nummer: r.nummer, kunde: { name: r.kunde_name, firma: r.kunde_firma, email: r.kunde_email }, leistung: { name: r.leistung_name, beschreibung: r.leistung_beschreibung }, preis: r.preis, datum: r.datum, faellig: r.faellig, verkaeufer: vk?.name, notizen: r.notizen });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>Rechnungen</div>
        <button onClick={openNew} style={{ background: GOLD, color: "#070707", border: "none", borderRadius: 8, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Neue Rechnung</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        <div style={{ background: "rgba(248,113,113,.06)", border: "1px solid rgba(248,113,113,.15)", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 11, color: RED, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>Offen</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: RED, letterSpacing: "-0.03em" }}>{offen ? fmt(offen) : "—"}</div>
          <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 4 }}>{myR.filter(r => r.status === "Offen").length} Rechnungen</div>
        </div>
        <div style={{ background: "rgba(74,222,128,.06)", border: "1px solid rgba(74,222,128,.15)", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 11, color: GREEN, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>Bezahlt</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: GREEN, letterSpacing: "-0.03em" }}>{bezahlt ? fmt(bezahlt) : "—"}</div>
          <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 4 }}>{myR.filter(r => r.status === "Bezahlt").length} Rechnungen</div>
        </div>
      </div>

      {showForm && editR && (
        <RechnungForm rechnung={editR} user={user} users={users} leads={leads} angebote={angebote} onSave={save} onClose={() => setShowForm(false)} onPrint={printR} />
      )}

      <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr auto auto auto auto", gap: 0, padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 600, color: TEXT_DIM, textTransform: "uppercase", letterSpacing: ".06em" }}>
          <span style={{ marginRight: 16 }}>Nr.</span><span>Kunde</span><span>Leistung</span><span style={{ paddingRight: 20 }}>Preis</span><span style={{ paddingRight: 20 }}>Fällig</span><span style={{ marginRight: 12 }}>Status</span><span></span>
        </div>
        {myR.length === 0 && <div style={{ textAlign: "center", padding: "40px", fontSize: 14, color: TEXT_FAINT }}>Noch keine Rechnungen.</div>}
        {myR.map(r => {
          const ueberfaellig = r.status === "Offen" && r.faellig && new Date(r.faellig) < new Date();
          return (
            <div key={r.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr auto auto auto auto", gap: 0, padding: "12px 20px", borderBottom: `1px solid ${BORDER}`, alignItems: "center", background: ueberfaellig ? "rgba(248,113,113,.04)" : "transparent" }}>
              <span style={{ fontSize: 12, fontFamily: "monospace", color: GOLD, marginRight: 16 }}>{r.nummer}</span>
              <div><div style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{r.kunde_name}</div>{r.kunde_firma && <div style={{ fontSize: 11, color: TEXT_DIM }}>{r.kunde_firma}</div>}</div>
              <div style={{ fontSize: 12, color: TEXT_DIM }}>{r.leistung_name || "—"}</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, paddingRight: 20 }}>{r.preis ? fmt(r.preis) : "—"}</span>
              <span style={{ fontSize: 12, color: ueberfaellig ? RED : TEXT_DIM, paddingRight: 20 }}>{dateDE(r.faellig)}{ueberfaellig ? " ⚠" : ""}</span>
              <button onClick={() => toggleStatus(r.id)} style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, border: "none", background: r.status === "Bezahlt" ? "rgba(74,222,128,.1)" : "rgba(248,113,113,.1)", color: r.status === "Bezahlt" ? GREEN : RED, cursor: "pointer", fontFamily: "inherit", marginRight: 12, whiteSpace: "nowrap" }}>{r.status}</button>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { setEditR(r); setShowForm(true); }} style={{ fontSize: 11, background: BG3, border: `1px solid ${BORDER}`, color: TEXT_DIM, borderRadius: 5, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit" }}>✏</button>
                <button onClick={() => printR(r)} style={{ fontSize: 11, background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, color: GOLD, borderRadius: 5, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit" }}>PDF</button>
                <button onClick={() => deleteit(r.id)} style={{ fontSize: 11, background: "rgba(248,113,113,.06)", border: "1px solid rgba(248,113,113,.15)", color: RED, borderRadius: 5, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit" }}>×</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RechnungForm({ rechnung, user, users, leads, angebote, onSave, onClose, onPrint }) {
  const [form, setForm] = useState({ ...rechnung });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inp = { background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", color: TEXT, fontSize: 13, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" };
  const focus = e => e.currentTarget.style.borderColor = GOLD;
  const blur = e => e.currentTarget.style.borderColor = BORDER;

  const fillFromAngebot = (id) => {
    const a = angebote.find(x => x.id === id);
    if (a) { set("kunde_name", a.kunde_name); set("kunde_firma", a.kunde_firma || ""); set("kunde_email", a.kunde_email || ""); set("leistung_name", a.leistung_name || ""); set("leistung_beschreibung", a.leistung_beschreibung || ""); set("preis", a.preis || ""); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 20, maxWidth: 600, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ padding: "24px 28px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>Rechnung — <span style={{ color: GOLD, fontFamily: "monospace" }}>{form.nummer}</span></div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: TEXT_DIM, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Aus Angebot übernehmen</label>
            <select style={{ ...inp, cursor: "pointer" }} onChange={e => fillFromAngebot(e.target.value)} onFocus={focus} onBlur={blur}>
              <option value="">— Angebot wählen (optional) —</option>
              {angebote.filter(a => user.role === "admin" || a.verkaeufer_id === user.id).map(a => <option key={a.id} value={a.id}>{a.nummer} · {a.kunde_name}</option>)}
            </select>
          </div>
          <div style={{ height: 1, background: BORDER }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Kundenname *</label><input style={inp} value={form.kunde_name} onChange={e => set("kunde_name", e.target.value)} onFocus={focus} onBlur={blur} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Firma</label><input style={inp} value={form.kunde_firma || ""} onChange={e => set("kunde_firma", e.target.value)} onFocus={focus} onBlur={blur} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>E-Mail (für Versand)</label><input style={inp} type="email" value={form.kunde_email || ""} onChange={e => set("kunde_email", e.target.value)} onFocus={focus} onBlur={blur} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Rechnungsdatum</label><input style={inp} type="date" value={form.datum} onChange={e => set("datum", e.target.value)} onFocus={focus} onBlur={blur} /></div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Leistung</label>
            <select style={{ ...inp, cursor: "pointer", marginBottom: 8 }} value={form.leistung_name || ""} onChange={e => { const t = LEISTUNGEN_TEMPLATES.find(t => t.name === e.target.value); set("leistung_name", e.target.value); if (t?.beschreibung) set("leistung_beschreibung", t.beschreibung); }} onFocus={focus} onBlur={blur}>
              <option value="">— Vorlage wählen —</option>
              {LEISTUNGEN_TEMPLATES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
            <textarea style={{ ...inp, resize: "vertical", minHeight: 70 }} value={form.leistung_beschreibung || ""} onChange={e => set("leistung_beschreibung", e.target.value)} placeholder="Beschreibung..." onFocus={focus} onBlur={blur} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Preis (€)</label><input style={inp} type="number" value={form.preis || ""} onChange={e => set("preis", e.target.value ? Number(e.target.value) : "")} placeholder="z.B. 1490" onFocus={focus} onBlur={blur} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Fällig am</label><input style={inp} type="date" value={form.faellig || ""} onChange={e => set("faellig", e.target.value)} onFocus={focus} onBlur={blur} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Status</label><select style={{ ...inp, cursor: "pointer" }} value={form.status} onChange={e => set("status", e.target.value)} onFocus={focus} onBlur={blur}>{["Offen","Bezahlt","Storniert"].map(s => <option key={s}>{s}</option>)}</select></div>
          </div>
          <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Notizen</label><textarea style={{ ...inp, resize: "vertical", minHeight: 60 }} value={form.notizen || ""} onChange={e => set("notizen", e.target.value)} onFocus={focus} onBlur={blur} /></div>
        </div>
        <div style={{ padding: "16px 28px 24px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => onSave(form)} style={{ background: GOLD, color: "#070707", border: "none", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Speichern</button>
          <button onClick={() => onPrint(form)} style={{ background: BG3, border: `1px solid ${BORDER}`, color: TEXT, borderRadius: 8, padding: "11px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>📄 PDF / Drucken</button>
          <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${BORDER}`, color: TEXT_DIM, borderRadius: 8, padding: "11px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}>Schließen</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   KUNDEN (CRM)
══════════════════════════════════════════════════════════ */
function Kunden({ leads, setLeads, user, users }) {
  const [search, setSearch] = useState("");
  const myLeads = user.role === "admin" ? leads : leads.filter(l => l.verkaeufer_id === user.id);
  const filtered = myLeads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || (l.firma || "").toLowerCase().includes(search.toLowerCase()) || (l.email || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>Kunden & Leads</div>
        <div style={{ fontSize: 13, color: TEXT_DIM }}>{filtered.length} Einträge</div>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Suchen nach Name, Firma, E-Mail..." style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 16px", color: TEXT, fontSize: 14, fontFamily: "inherit", outline: "none", width: "100%", marginBottom: 20 }} />
      <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px", fontSize: 14, color: TEXT_FAINT }}>Keine Einträge gefunden.</div>}
        {filtered.map((lead, i) => {
          const vk = users.find(u => u.id === lead.verkaeufer_id);
          return (
            <div key={lead.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 16, padding: "16px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : "none", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{lead.name}</div>
                {lead.firma && <div style={{ fontSize: 12, color: TEXT_DIM }}>{lead.firma}</div>}
                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  {lead.email && <a href={`mailto:${lead.email}`} style={{ fontSize: 12, color: BLUE, textDecoration: "none" }}>{lead.email}</a>}
                  {lead.telefon && <span style={{ fontSize: 12, color: TEXT_DIM }}>{lead.telefon}</span>}
                </div>
                {lead.notizen && <div style={{ fontSize: 12, color: TEXT_FAINT, marginTop: 4, fontStyle: "italic" }}>{lead.notizen.slice(0, 80)}{lead.notizen.length > 80 ? "..." : ""}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                {lead.preis && <div style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>{fmt(lead.preis)}</div>}
                {lead.leistung_name && <div style={{ fontSize: 11, color: TEXT_DIM }}>{lead.leistung_name}</div>}
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: lead.status === "Gewonnen" ? "rgba(74,222,128,.1)" : GOLD_DIM, color: lead.status === "Gewonnen" ? GREEN : GOLD }}>{lead.status}</div>
                {vk && user.role === "admin" && <div style={{ fontSize: 10, color: TEXT_FAINT, marginTop: 4 }}>{vk.name}</div>}
              </div>
              {lead.wiedervorlage && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: TEXT_FAINT }}>Wiedervorlage</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: new Date(lead.wiedervorlage) <= new Date() ? RED : TEXT }}>{dateDE(lead.wiedervorlage)}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TEAM MANAGEMENT (Admin only)
══════════════════════════════════════════════════════════ */
function Team({ users, setUsers }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: "", name: "", username: "", password: "", role: "verkaeufer" });
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const inp = { background: BG3, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", color: TEXT, fontSize: 13, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" };

  const save = () => {
    if (!form.name || !form.username || !form.password) return;
    const newUser = { ...form, id: form.id || uid() };
    setUsers(prev => { const e = prev.find(u => u.id === newUser.id); return e ? prev.map(u => u.id === newUser.id ? newUser : u) : [...prev, newUser]; });
    setShowForm(false);
    setForm({ id: "", name: "", username: "", password: "", role: "verkaeufer" });
  };

  const deleteUser = (id) => { if (id === "admin") return alert("Admin-Account kann nicht gelöscht werden."); if (confirm("Benutzer löschen?")) setUsers(prev => prev.filter(u => u.id !== id)); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em" }}>Team verwalten</div>
          <div style={{ fontSize: 13, color: TEXT_DIM, marginTop: 4 }}>{users.length} Benutzer · max. empfohlen: 7</div>
        </div>
        <button onClick={() => { setForm({ id: uid(), name: "", username: "", password: "", role: "verkaeufer" }); setShowForm(true); }} style={{ background: GOLD, color: "#070707", border: "none", borderRadius: 8, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Verkäufer hinzufügen</button>
      </div>

      {showForm && (
        <div style={{ background: BG2, border: `1px solid ${GOLD_BORDER}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 20 }}>Neuer Benutzer</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Vollständiger Name</label><input style={inp} value={form.name} onChange={e => setF("name", e.target.value)} placeholder="Max Mustermann" /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Benutzername (Login)</label><input style={inp} value={form.username} onChange={e => setF("username", e.target.value.toLowerCase().replace(/\s/g, ""))} placeholder="max.mustermann" /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Passwort</label><input style={inp} type="password" value={form.password} onChange={e => setF("password", e.target.value)} placeholder="Sicheres Passwort" /></div>
            <div><label style={{ fontSize: 12, fontWeight: 600, color: TEXT_DIM, display: "block", marginBottom: 7 }}>Rolle</label><select style={{ ...inp, cursor: "pointer" }} value={form.role} onChange={e => setF("role", e.target.value)}><option value="verkaeufer">Verkäufer</option><option value="admin">Administrator</option></select></div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={save} style={{ background: GOLD, color: "#070707", border: "none", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Speichern</button>
            <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: `1px solid ${BORDER}`, color: TEXT_DIM, borderRadius: 8, padding: "11px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Abbrechen</button>
          </div>
        </div>
      )}

      <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
        {users.map((u, i) => (
          <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: i < users.length - 1 ? `1px solid ${BORDER}` : "none" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: GOLD, flexShrink: 0 }}>
              {u.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>{u.name}</div>
              <div style={{ fontSize: 12, color: TEXT_DIM }}>@{u.username} · {u.role === "admin" ? "Administrator" : "Verkäufer"}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setForm(u); setShowForm(true); }} style={{ fontSize: 12, background: BG3, border: `1px solid ${BORDER}`, color: TEXT_DIM, borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>Bearbeiten</button>
              {u.id !== "admin" && <button onClick={() => deleteUser(u.id)} style={{ fontSize: 12, background: "rgba(248,113,113,.06)", border: "1px solid rgba(248,113,113,.15)", color: RED, borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>Löschen</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SIGNATURE FLOW (from Lead)
══════════════════════════════════════════════════════════ */
function SignatureFlow({ lead, user, onClose, onSigned }) {
  const [showPad, setShowPad] = useState(false);
  const [sig, setSig] = useState(null);
  const [done, setDone] = useState(false);

  const complete = (dataUrl) => {
    setSig(dataUrl);
    setShowPad(false);
    setDone(true);
    generatePDF({
      type: "Angebot", nummer: angebotsNr(), kunde: { name: lead.name, firma: lead.firma, email: lead.email },
      leistung: { name: lead.leistung_name, beschreibung: lead.leistung_beschreibung }, preis: lead.preis,
      datum: today(), faellig: "", signatureDataUrl: dataUrl, verkaeufer: user.name, notizen: lead.notizen,
    });
    onSigned({ ...lead, status: "Gewonnen", unterschrift: dataUrl, gewonnen_am: today() });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      {showPad && <SignaturePad onSave={complete} onCancel={() => setShowPad(false)} />}
      {!showPad && (
        <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 20, maxWidth: 520, width: "100%", padding: 32 }}>
          {!done ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: TEXT }}>Auftrag vor Ort abschließen</div>
                <button onClick={onClose} style={{ background: "none", border: "none", color: TEXT_DIM, cursor: "pointer", fontSize: 20 }}>✕</button>
              </div>
              <div style={{ background: BG3, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 12 }}>Auftragsdetails</div>
                {[["Kunde", lead.name + (lead.firma ? ` · ${lead.firma}` : "")], ["Leistung", lead.leistung_name || "—"], ["Preis", lead.preis ? fmt(lead.preis) : "Auf Vereinbarung"], ["Betreuer", user.name]].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: `0.5px solid ${BORDER}` }}>
                    <span style={{ color: TEXT_DIM }}>{l}</span><span style={{ color: TEXT, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 24 }}>
                Nach der Unterschrift wird automatisch ein PDF generiert und kann heruntergeladen werden. Der Lead wird auf <strong style={{ color: GREEN }}>„Gewonnen"</strong> gesetzt.
              </div>
              <button onClick={() => setShowPad(true)} style={{ width: "100%", background: GOLD, color: "#070707", border: "none", borderRadius: 10, padding: "15px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                ✍️ Jetzt unterschreiben
              </button>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: GREEN, marginBottom: 8 }}>Auftrag abgeschlossen!</div>
              <div style={{ fontSize: 14, color: TEXT_DIM, marginBottom: 8 }}>PDF wurde geöffnet — als Datei speichern oder drucken.</div>
              <div style={{ background: "#fff", borderRadius: 8, padding: 12, display: "inline-block", marginBottom: 20 }}>
                <img src={sig} alt="Unterschrift" style={{ maxWidth: 200, height: 60, objectFit: "contain" }} />
                <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{lead.name} · {dateDE(today())}</div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={() => complete(sig)} style={{ background: BG3, border: `1px solid ${BORDER}`, color: TEXT, borderRadius: 8, padding: "10px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>PDF erneut öffnen</button>
                <button onClick={onClose} style={{ background: GOLD, color: "#070707", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Fertig</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN ADMIN APP
══════════════════════════════════════════════════════════ */
export default function Admin() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [leads, setLeadsRaw] = useState(() => ls.get("leads", []));
  const [rechnungen, setRechnungenRaw] = useState(() => ls.get("rechnungen", []));
  const [angebote, setAngeboteRaw] = useState(() => ls.get("angebote", []));
  const [users, setUsersRaw] = useState(() => ls.get("users", INITIAL_USERS));
  const [leadModal, setLeadModal] = useState(null);
  const [sigFlow, setSigFlow] = useState(null);
  const [angebotFromLead, setAngebotFromLead] = useState(null);

  const setLeads = (v) => { const next = typeof v === "function" ? v(leads) : v; ls.set("leads", next); setLeadsRaw(next); };
  const setRechnungen = (v) => { const next = typeof v === "function" ? v(rechnungen) : v; ls.set("rechnungen", next); setRechnungenRaw(next); };
  const setAngebote = (v) => { const next = typeof v === "function" ? v(angebote) : v; ls.set("angebote", next); setAngeboteRaw(next); };
  const setUsers = (v) => { const next = typeof v === "function" ? v(users) : v; ls.set("users", next); setUsersRaw(next); };

  const handleSaveLead = (lead) => { setLeads(prev => { const e = prev.find(l => l.id === lead.id); return e ? prev.map(l => l.id === lead.id ? lead : l) : [...prev, lead]; }); setLeadModal(null); };
  const handleSigned = (lead) => { setLeads(prev => prev.map(l => l.id === lead.id ? lead : l)); setSigFlow(null); };

  const handleCreateAngebotFromLead = (lead) => {
    const faellig = new Date(); faellig.setDate(faellig.getDate() + 30);
    const a = { id: uid(), nummer: angebotsNr(), kunde_name: lead.name, kunde_firma: lead.firma || "", kunde_email: lead.email || "", leistung_name: lead.leistung_name || "", leistung_beschreibung: lead.leistung_beschreibung || "", preis: lead.preis || "", datum: today(), faellig: faellig.toISOString().split("T")[0], status: "Offen", verkaeufer_id: user.id, notizen: lead.notizen || "" };
    setAngebote(prev => [...prev, a]);
    setLeadModal(null);
    setView("angebote");
  };

  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: BG, color: TEXT, minHeight: "100vh", display: "flex" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0} ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#0f0f0f} ::-webkit-scrollbar-thumb{background:#e8c547;border-radius:2px} @media(max-width:768px){.admin-sidebar{display:none!important}.admin-main{margin-left:0!important;padding:20px!important}}`}</style>

      <Sidebar view={view} setView={setView} user={user} onLogout={() => setUser(null)} />

      <div className="admin-main" style={{ marginLeft: 220, flex: 1, padding: "40px", overflowY: "auto", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {view === "dashboard" && <Dashboard leads={leads} rechnungen={rechnungen} user={user} />}
          {view === "pipeline" && <Pipeline leads={leads} setLeads={setLeads} user={user} users={users} onOpenLead={(lead) => setLeadModal(lead || { id: uid(), name: "", firma: "", email: "", telefon: "", leistung_name: "", leistung_beschreibung: "", preis: "", status: "Lead", verkaeufer_id: user.id, notizen: "", erstellt: today() })} />}
          {view === "kunden" && <Kunden leads={leads} setLeads={setLeads} user={user} users={users} />}
          {view === "angebote" && <Angebote angebote={angebote} setAngebote={setAngebote} leads={leads} user={user} users={users} />}
          {view === "rechnungen" && <Rechnungen rechnungen={rechnungen} setRechnungen={setRechnungen} leads={leads} angebote={angebote} user={user} users={users} />}
          {view === "team" && user.role === "admin" && <Team users={users} setUsers={setUsers} />}
        </div>
      </div>

      {leadModal !== null && (
        <LeadModal lead={leadModal.name !== undefined && leadModal.id ? leads.find(l => l.id === leadModal.id) || leadModal : leadModal}
          user={user} users={users} onSave={handleSaveLead} onClose={() => setLeadModal(null)}
          onCreateAngebot={handleCreateAngebotFromLead}
          onSignature={(lead) => { setSigFlow(lead); setLeadModal(null); }} />
      )}

      {sigFlow && <SignatureFlow lead={sigFlow} user={user} onClose={() => setSigFlow(null)} onSigned={handleSigned} />}
    </div>
  );
}
