import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════ */
const TYPEWRITER_WORDS = ["Websites erstellen","Kunden gewinnen","Prozesse automatisieren","online wachsen","Anfragen automatisieren","Zeit sparen"];

const STATS = [
  { val: 7, suffix: " Tage", label: "Ø Lieferzeit Website" },
  { val: 100, suffix: "%", label: "Festpreis — kein Nachschlag" },
  { val: 15, suffix: "+", label: "Projekte abgeschlossen" },
  { val: 4.9, suffix: "★", label: "Kundenbewertung", isFloat: true },
];

const SCHNELLCHECK_STEPS = [
  { q: "Wie alt ist Ihre aktuelle Website?", opts: [
    { icon: "🆕", l: "Noch keine Website", score: 0 },
    { icon: "📅", l: "Unter 2 Jahre alt", score: 25 },
    { icon: "🗓", l: "2–5 Jahre alt", score: 12 },
    { icon: "💀", l: "Älter als 5 Jahre", score: 0 },
  ]},
  { q: "Wie sieht Ihre Website auf dem Handy aus?", opts: [
    { icon: "📱", l: "Perfekt mobil-optimiert", score: 25 },
    { icon: "🤏", l: "Etwas unübersichtlich", score: 10 },
    { icon: "🔍", l: "Man muss zoomen & scrollen", score: 0 },
    { icon: "❓", l: "Weiß ich nicht", score: 5 },
  ]},
  { q: "Kommen Anfragen über Ihre Website?", opts: [
    { icon: "📬", l: "Ja — mehrmals pro Woche", score: 25 },
    { icon: "📩", l: "Ab und zu — ein paar pro Monat", score: 10 },
    { icon: "🦗", l: "Kaum oder gar nicht", score: 0 },
    { icon: "🚫", l: "Kein Kontaktformular", score: 0 },
  ]},
  { q: "Wie schnell lädt Ihre Website?", opts: [
    { icon: "⚡", l: "Unter 2 Sekunden", score: 25 },
    { icon: "🐢", l: "3–5 Sekunden", score: 10 },
    { icon: "⏳", l: "Spürbar langsam", score: 0 },
    { icon: "❓", l: "Keine Ahnung", score: 5 },
  ]},
  { q: "Findet man Sie bei Google für Ihre Region?", opts: [
    { icon: "🏆", l: "Ja — Seite 1 regional", score: 25 },
    { icon: "📄", l: "Manchmal — Seite 2 oder 3", score: 10 },
    { icon: "👻", l: "Nein — praktisch unsichtbar", score: 0 },
    { icon: "❓", l: "Hab nie gesucht", score: 5 },
  ]},
];

const AUTOMATION_STEPS = [
  { icon: "📨", label: "Anfrage eingeht", desc: "Formular, E-Mail oder WhatsApp" },
  { icon: "⚡", label: "Webhook ausgelöst", desc: "Make / Zapier verarbeitet sofort" },
  { icon: "📋", label: "CRM aktualisiert", desc: "Kunde automatisch angelegt" },
  { icon: "💬", label: "WhatsApp gesendet", desc: "Sie werden sofort informiert" },
  { icon: "✅", label: "Kunde bestätigt", desc: "Automatische Bestätigungsmail" },
];

const PROJECTS = [
  { name: "Walczak & Gogsch", cat: "Rechtsanwälte · Dresden", tag: "Website + KI-Fallanalyse", desc: "Professionelle Kanzleiwebsite mit integriertem KI-Tool zur ersten Falleinschätzung für Mandanten — komplett in einer Woche.", tech: ["React","Claude API","Lovable"], color: "#060d1c", accent: "#60a5fa", days: 6 },
  { name: "Benedikt Tillmann", cat: "Rechtsanwalt · Dresden", tag: "Personal Brand Website", desc: "Persönliche Anwaltswebsite im hellen, modernen Stil — klar, vertrauenswürdig, überzeugend. Iteriert auf sauberes Light-Design.", tech: ["React","Lovable","Clean Design"], color: "#0a1a0a", accent: "#4ade80", days: 5 },
  { name: "Rollimaus e.V.", cat: "Kinderverein · Dresden", tag: "Pro-Bono · Verein", desc: "Vereinswebsite mit interaktivem Spendenrechner und Fortschrittsanzeige für den Bus-Kauf. Ziel: 35.000 €.", tech: ["React","Donation Slider","Progress Bar"], color: "#1a0a14", accent: "#f472b6", days: 7 },
];

const TESTIMONIALS = [
  { name: "Thomas K.", role: "Handwerksbetrieb, Dresden", text: "In einer Woche hatten wir eine Website die sich professionell anfühlt. Seitdem kommen Anfragen über das Formular — vorher war das null.", stars: 5 },
  { name: "Sandra M.", role: "Dienstleistung, Sachsen", text: "Kein Agentur-Aufwand, kein ellenlanger Fragebogen. Ein Gespräch — eine Woche später war alles live. Genau so wollte ich das.", stars: 5 },
  { name: "Michael B.", role: "Selbstständig, Dresden", text: "Die Automation spart mir täglich 1–2 Stunden. Anfragen kommen rein, werden automatisch eingetragen und ich kriege sofort eine SMS.", stars: 5 },
];

const FAQS = [
  ["Wie lange dauert eine Website?","In der Regel 5–7 Werktage nach Briefing und Materialübergabe (Logo, Fotos, Texte). Je mehr vorbereitet, desto schneller."],
  ["Gibt es versteckte Kosten?","Nein. Festpreis ist Festpreis. Was im Angebot steht, zahlen Sie — nichts mehr. Hosting läuft direkt beim Anbieter (8–15 €/Monat)."],
  ["Können Sie meine alte Website übernehmen?","In vielen Fällen ja. Im Erstgespräch klären wir das in 5 Minuten. Oft ist ein Neuaufbau schneller und günstiger."],
  ["Was ist KI-Automatisierung konkret?","Anfrage kommt rein → automatisch ins CRM → Sie kriegen WhatsApp → Kunde kriegt Bestätigung. Alles ohne dass Sie etwas tun."],
  ["Arbeiten Sie außerhalb Dresdens?","Ja. Webdesign und Automation laufen remote. Für Schulungen bin ich auch vor Ort in Sachsen unterwegs."],
  ["Was kostet das Erstgespräch?","Nichts. 30 Minuten, kostenlos, kein Kaufdruck. Wir schauen ob ich der Richtige bin — und wenn nicht, sag ich es Ihnen."],
];

const LEGAL = {
  impressum: { title: "Impressum", body: `Angaben gemäß § 5 TMG\n\nAlexandros Ohnesorge\nSchlüterstraße 24\n01277 Dresden\n\nKontakt:\nE-Mail: [IHRE EMAIL]\nWebsite: ohnesorge-websites.de\n\nUmsatzsteuer:\nGemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).\n\nVerantwortlich für den Inhalt nach § 55 Abs. 2 RStV:\nAlexandros Ohnesorge\nSchlüterstraße 24, 01277 Dresden\n\nHaftungshinweis: Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.` },
  datenschutz: { title: "Datenschutzerklärung", body: `1. Verantwortlicher\nAlexandros Ohnesorge, Schlüterstraße 24, 01277 Dresden\n\n2. Erhobene Daten\nBeim Besuch werden Server-Log-Dateien gespeichert (IP, Browser, Betriebssystem, Zeitstempel). Kontaktformulardaten (Name, E-Mail, Nachricht) werden zur Bearbeitung Ihrer Anfrage verarbeitet.\n\n3. Rechtsgrundlagen\nArt. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) für Logdaten.\nArt. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) für Kontaktanfragen.\n\n4. KI-Tools\nTexte die Sie in den Website-Check oder Chat eingeben, werden an die Anthropic API übermittelt. Bitte keine personenbezogenen Daten eingeben. Details: anthropic.com/privacy\n\n5. Cookies\nNur technisch notwendige Cookies (Cookie-Einwilligung). Optionale Analyse-Cookies nur nach Zustimmung.\n\n6. Ihre Rechte\nAuskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch (Art. 15–21 DSGVO). Kontakt: [IHRE EMAIL]\n\nBeschwerderecht: Sächsischer Datenschutzbeauftragter (saechsdsb.de).` },
  agb: { title: "AGB", body: `§ 1 Geltungsbereich\nDiese AGB gelten für alle Verträge zwischen Alexandros Ohnesorge und dem Auftraggeber über Webdesign, KI-Automatisierung und verwandte Dienstleistungen.\n\n§ 2 Vertragsschluss\nDurch schriftliche Auftragsbestätigung (E-Mail genügt) oder Annahme eines Angebots.\n\n§ 3 Vergütung\nAlle Preise als Nettopreise, zzgl. MwSt. Gemäß § 19 UStG wird keine USt. berechnet (Kleinunternehmer).\n— 50% Anzahlung bei Auftragserteilung\n— 50% nach Fertigstellung\n— Zahlungsziel: 14 Tage netto\n\n§ 4 Lieferzeit\nRichtwert: 5–7 Werktage nach vollständiger Materialübergabe. Verzögerungen durch fehlende Mitwirkung des Kunden sind nicht zu vertreten.\n\n§ 5 Stornierung\n— Bis 7 Tage vor Start: kostenfrei\n— 3–7 Tage vorher: 50% der Vergütung\n— Unter 3 Tage: 100% der Vergütung\n\n§ 6 Urheberrecht\nSchulungsunterlagen und Code-Deliverables: einfaches Nutzungsrecht für internen Gebrauch. Weitergabe an Dritte bedarf schriftlicher Zustimmung.\n\n§ 7 Haftung\nUnbeschränkt bei Vorsatz und grober Fahrlässigkeit. Im Übrigen auf vertragstypischen Schaden begrenzt. Kein Erfolgsversprechen für Umsatz- oder Ranking-Ziele.\n\n§ 8 Gerichtsstand\nDresden. Es gilt deutsches Recht.` },
};

/* ══════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════ */
function useTypewriter(words, speed = 78) {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [del, setDel] = useState(false);
  const pause = useRef(null);
  useEffect(() => {
    const cur = words[wi];
    const t = setTimeout(() => {
      if (!del) {
        if (text.length < cur.length) setText(cur.slice(0, text.length + 1));
        else pause.current = setTimeout(() => setDel(true), 1800);
      } else {
        if (text.length > 0) setText(cur.slice(0, text.length - 1));
        else { setDel(false); setWi((wi + 1) % words.length); }
      }
    }, del ? 38 : speed);
    return () => { clearTimeout(t); clearTimeout(pause.current); };
  }, [text, wi, del, words, speed]);
  return text;
}

function useCountUp(target, duration = 1600, start = false) {
  const [val, setVal] = useState(target);
  const done = useRef(false);
  useEffect(() => {
    if (!start || done.current) return;
    done.current = true;
    setVal(0);
    let t0 = null;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setVal(parseFloat((p * p * target).toFixed(1)));
      if (p < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return val;
}

function useInView(threshold = 0.18) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function useActiveSection(ids) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const obs = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(id); }, { threshold: 0.3 });
      ob.observe(el);
      return ob;
    }).filter(Boolean);
    return () => obs.forEach(o => o.disconnect());
  }, [ids]);
  return active;
}

function useCountdown(iso) {
  const calc = () => {
    const diff = new Date(iso) - new Date();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return { d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => { const t = setInterval(() => setTime(calc()), 1000); return () => clearInterval(t); }, [iso]);
  return time;
}

/* ══════════════════════════════════════════════════════════
   COUNTDOWN BANNER
══════════════════════════════════════════════════════════ */
const BANNER_H = 36;
function CountdownBanner() {
  const { d, h, m, s } = useCountdown("2026-06-30T09:00:00");
  const pad = n => String(n).padStart(2, "0");
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: BANNER_H, background: "#e8c547", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, overflow: "hidden" }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#070707", letterSpacing: ".06em" }}>⚡ Nur noch 2 freie Plätze im Juni</span>
      <div style={{ display: "flex", gap: 4 }}>
        {[["d",d],["h",h],["m",m],["s",s]].map(([u, v]) => (
          <span key={u} style={{ background: "rgba(0,0,0,0.15)", borderRadius: 4, padding: "1px 7px", fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#070707" }}>{pad(v)}</span>
        ))}
      </div>
      <span style={{ fontSize: 11, color: "#070707", opacity: 0.7 }}>Tage · Std · Min · Sek</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════════ */
function Nav({ scrollY, to }) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(["hero","check","leistungen","preise","projekte","kontakt"]);
  const links = [["check","Website-Check"],["leistungen","Leistungen"],["preise","Preise"],["projekte","Projekte"],["kontakt","Kontakt"]];
  const scrolled = scrollY > 60;
  return (
    <nav style={{ position: "fixed", top: BANNER_H, left: 0, right: 0, zIndex: 150, height: 64, background: scrolled ? "rgba(7,7,7,0.95)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,.06)" : "none", transition: "all .3s", display: "flex", alignItems: "center", padding: "0 32px", justifyContent: "space-between" }}>
      <div onClick={() => to("hero")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 19, fontWeight: 800, color: "#f0f0f0", letterSpacing: "-0.04em" }}>Ohnesorge</span>
        <span style={{ fontSize: 19, fontWeight: 800, color: "#e8c547", letterSpacing: "-0.04em" }}>.</span>
      </div>
      <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="nav-links-desktop">
        {links.map(([id, l]) => (
          <span key={id} onClick={() => to(id)} style={{ fontSize: 13, fontWeight: 500, cursor: "pointer", color: active === id ? "#e8c547" : "rgba(240,240,240,0.6)", borderBottom: active === id ? "1.5px solid #e8c547" : "1.5px solid transparent", paddingBottom: 2, transition: "all .18s" }}>{l}</span>
        ))}
      </div>
      <button onClick={() => to("kontakt")} style={{ background: "#e8c547", color: "#070707", border: "none", borderRadius: 6, padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
        Anfragen ✦
      </button>
      {/* Mobile hamburger */}
      <button onClick={() => setOpen(o => !o)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 6, color: "#f0f0f0" }} className="ham-btn">
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d={open ? "M1 1L21 15M21 1L1 15" : "M0 1h22M0 8h22M0 15h22"} stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
      {open && (
        <div style={{ position: "fixed", inset: 0, top: BANNER_H + 64, background: "rgba(7,7,7,0.98)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, zIndex: 149 }}>
          {links.map(([id, l]) => <span key={id} onClick={() => { to(id); setOpen(false); }} style={{ fontSize: 22, fontWeight: 700, color: "#f0f0f0", cursor: "pointer" }}>{l}</span>)}
          <button onClick={() => { to("kontakt"); setOpen(false); }} style={{ background: "#e8c547", color: "#070707", border: "none", borderRadius: 8, padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>Kostenlos anfragen ✦</button>
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════ */
function Hero({ to }) {
  const text = useTypewriter(TYPEWRITER_WORDS);
  return (
    <section id="hero" style={{ minHeight: "100vh", background: "#070707", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: `${BANNER_H + 64 + 40}px 40px 80px`, position: "relative", overflow: "hidden" }}>
      {/* Grid bg */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)", backgroundSize: "56px 56px", pointerEvents: "none" }} />
      {/* Glow */}
      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse,rgba(232,197,71,.06) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,.12)", borderRadius: 20, padding: "7px 16px", fontSize: 12, fontWeight: 500, color: "rgba(240,240,240,.6)", marginBottom: 32, animation: "fadeUp .5s ease both" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#e8c547", animation: "blink 2s infinite" }} />
        Webdesign & KI-Automatisierung · Dresden
      </div>

      <h1 style={{ fontSize: "clamp(44px,7vw,80px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.04em", color: "#f0f0f0", marginBottom: 24, animation: "fadeUp .5s .1s ease both" }}>
        Mehr Kunden.<br />
        Weniger Aufwand.<br />
        <span style={{ color: "#e8c547" }}>Ab morgen.</span>
      </h1>

      {/* Typewriter */}
      <div style={{ fontSize: "clamp(16px,2.2vw,22px)", color: "rgba(240,240,240,0.5)", marginBottom: 40, height: 32, animation: "fadeUp .5s .2s ease both" }}>
        Ich helfe Ihnen beim{" "}
        <span style={{ color: "#f0f0f0", fontWeight: 600, borderRight: "2px solid #e8c547", paddingRight: 2, animation: "blink 1s infinite" }}>{text}</span>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48, animation: "fadeUp .5s .3s ease both" }}>
        <button onClick={() => to("check")} style={{ background: "#e8c547", color: "#070707", border: "none", borderRadius: 8, padding: "15px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, transition: "transform .15s, opacity .15s" }} onMouseOver={e => e.currentTarget.style.transform="scale(1.03)"} onMouseOut={e => e.currentTarget.style.transform=""}>
          Kostenloser Website-Check ✦
        </button>
        <button onClick={() => to("projekte")} style={{ background: "transparent", color: "#f0f0f0", border: "1px solid rgba(255,255,255,.2)", borderRadius: 8, padding: "14px 28px", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "border-color .15s" }} onMouseOver={e => e.currentTarget.style.borderColor="rgba(255,255,255,.4)"} onMouseOut={e => e.currentTarget.style.borderColor="rgba(255,255,255,.2)"}>
          Projekte ansehen
        </button>
      </div>

      <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap", animation: "fadeUp .5s .4s ease both" }}>
        {["✓ Fertig in 7 Tagen","✓ Festpreis","✓ Kostenlose Erstberatung"].map(t => (
          <span key={t} style={{ fontSize: 13, color: "rgba(240,240,240,0.5)", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#00e87a", fontWeight: 700 }}>{t.slice(0,1)}</span>{t.slice(1)}
          </span>
        ))}
      </div>

      {/* Hero cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginTop: 64, maxWidth: 720, width: "100%", animation: "fadeUp .5s .5s ease both" }}>
        {[
          { icon: "⚡", title: "7 Tage", sub: "Ø Lieferzeit" },
          { icon: "💰", title: "Ab 890 €", sub: "Festpreis, kein Nachschlag" },
          { icon: "🎯", title: "15+ Projekte", sub: "abgeschlossen in Dresden" },
        ].map(({ icon, title, sub }) => (
          <div key={title} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#f0f0f0", letterSpacing: "-0.03em" }}>{title}</div>
            <div style={{ fontSize: 12, color: "rgba(240,240,240,.4)", marginTop: 3 }}>{sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   STATS BAR
══════════════════════════════════════════════════════════ */
function StatsBar() {
  const [ref, vis] = useInView(0.3);
  return (
    <div ref={ref} style={{ background: "#0f0f0f", borderTop: "1px solid rgba(255,255,255,.07)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: "0 40px" }}>
        {STATS.map(({ val, suffix, label, isFloat }, i) => {
          const count = useCountUp(val, 1600, vis);
          return (
            <div key={i} style={{ padding: "36px 24px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(255,255,255,.07)" : "none" }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: "#f0f0f0", letterSpacing: "-0.04em", lineHeight: 1 }}>
                {isFloat ? count.toFixed(1) : Math.floor(count)}{suffix}
              </div>
              <div style={{ fontSize: 12, color: "rgba(240,240,240,.4)", marginTop: 6 }}>{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROBLEM SECTION
══════════════════════════════════════════════════════════ */
function ProblemSection() {
  const [ref, vis] = useInView();
  return (
    <section style={{ padding: "100px 40px", maxWidth: 1180, margin: "0 auto" }}>
      <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: "all .5s" }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(240,240,240,.4)", marginBottom: 16 }}>— Das Problem —</p>
        <h2 style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0f0f0", marginBottom: 56 }}>Kommt Ihnen das bekannt vor?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[
            { icon: "📉", title: "Ihre Website sieht aus wie 2012", desc: "Kunden springen ab bevor sie anrufen. Sie verlieren täglich Aufträge an Konkurrenten die einfach besser online aussehen." },
            { icon: "⏱", title: "Alles läuft noch manuell", desc: "Anfragen werden von Hand bearbeitet, Termine manuell eingetragen, E-Mails einzeln beantwortet. Ihr Konkurrent hat das längst automatisiert." },
            { icon: "💸", title: "Agenturen sind zu teuer & langsam", desc: "3 Monate Wartezeit. 6.000€ Angebot. Am Ende eine Vorlage wie jeder andere. Für KMU in Dresden geht das besser." },
          ].map(({ icon, title, desc }, i) => (
            <div key={i} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "28px", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: `all .5s ${i * .1}s` }}>
              <div style={{ fontSize: 24, marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f0f0f0", marginBottom: 10 }}>{title}</h3>
              <p style={{ fontSize: 14, color: "rgba(240,240,240,.5)", lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "right", marginTop: 48, fontSize: 28, fontWeight: 800, color: "#e8c547", letterSpacing: "-0.03em" }}>→ Das machen wir anders.</div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   WEBSITE SCHNELLCHECK (STAR FEATURE — Claude API)
══════════════════════════════════════════════════════════ */
function SchnellcheckTool() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const abortRef = useRef(null);

  const totalScore = Object.values(answers).reduce((s, v) => s + (v?.score ?? 0), 0);
  const cur = SCHNELLCHECK_STEPS[step];

  const select = (opt) => {
    const next = { ...answers, [step]: opt };
    setAnswers(next);
    if (step < SCHNELLCHECK_STEPS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 260);
    } else {
      setTimeout(() => runCheck(next), 260);
    }
  };

  const runCheck = async (ans) => {
    setLoading(true);
    abortRef.current = new AbortController();
    const timeout = setTimeout(() => abortRef.current?.abort(), 25000);
    const answerText = SCHNELLCHECK_STEPS.map((s, i) => `${s.q}: ${ans[i]?.l ?? "—"}`).join("\n");
    const score = Object.values(ans).reduce((s, v) => s + (v?.score ?? 0), 0);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "Du bist ein Webdesign-Experte der kleine und mittelständische Unternehmen in Deutschland berät. Antworte NUR mit validem JSON, kein Markdown, keine Backticks, kein Kommentar.",
          messages: [{
            role: "user",
            content: `Analysiere diese Website-Bewertungsantworten eines Unternehmers und gib eine ehrliche, direkte Bewertung zurück. Score: ${score}/100.\n\nAntworten:\n${answerText}\n\nGib zurück (NUR JSON, keine anderen Zeichen):\n{\n  "headline": "kurze direkte Überschrift (max 8 Wörter)",\n  "summary": "1–2 Sätze ehrliche Zusammenfassung, was das für ihr Business bedeutet",\n  "problems": ["Problem 1 konkret", "Problem 2 konkret", "Problem 3 konkret"],\n  "quickwins": ["Quick Win 1 — was sie heute noch tun können", "Quick Win 2", "Quick Win 3"],\n  "cta": "ein direkter, persönlicher Satz der zur Kontaktaufnahme motiviert"\n}`
          }]
        })
      });
      clearTimeout(timeout);
      const data = await res.json();
      const raw = data.content?.[0]?.text ?? "";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setResult({ ...parsed, score });
    } catch {
      clearTimeout(timeout);
      setResult({
        score,
        headline: score >= 75 ? "Solide Basis — Potenzial liegt oben drauf" : score >= 40 ? "Verbesserungsbedarf — der Konkurrent schläft nicht" : "Dringendes Handlungsbedarf erkannt",
        summary: score < 50 ? "Ihre Website kostet Sie aktiv Kunden. Jeder Monat ohne Verbesserung sind verpasste Aufträge." : "Grundlegendes stimmt — aber mit gezielten Optimierungen können Sie deutlich mehr herausholen.",
        problems: ["Keine oder veraltete mobile Optimierung", "Zu wenig Anfragen über die Website", "Google-Sichtbarkeit in der Region ausbaubar"],
        quickwins: ["Kontaktformular prominent auf die Startseite", "Google My Business Profil vollständig ausfüllen", "Ladezeit durch Bildkomprimierung verbessern"],
        cta: "In einem 30-minütigen kostenlosen Gespräch zeige ich Ihnen konkret was ich ändern würde — ohne Kaufdruck.",
      });
    } finally {
      setLoading(false);
    }
  };

  const ScoreGauge = ({ score }) => {
    const color = score >= 75 ? "#00e87a" : score >= 40 ? "#e8c547" : "#ff4040";
    const label = score >= 75 ? "Gut" : score >= 40 ? "Ausbaufähig" : "Kritisch";
    const pct = (score / 100) * 283;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <svg width="120" height="120" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8"/>
          <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${pct} 283`} strokeDashoffset="71" style={{ transition: "stroke-dasharray 1s ease" }} transform="rotate(-90 50 50)"/>
          <text x="50" y="46" textAnchor="middle" fontSize="22" fontWeight="800" fill="#f0f0f0">{score}</text>
          <text x="50" y="60" textAnchor="middle" fontSize="10" fill="rgba(240,240,240,.5)">/100</text>
        </svg>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{label}</span>
      </div>
    );
  };

  if (loading) return (
    <div style={{ textAlign: "center", padding: "60px 0" }}>
      <div style={{ width: 52, height: 52, border: "3px solid rgba(232,197,71,.15)", borderTop: "3px solid #e8c547", borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 20px" }} />
      <p style={{ fontSize: 16, fontWeight: 600, color: "#f0f0f0" }}>KI analysiert Ihre Website…</p>
      <p style={{ fontSize: 13, color: "rgba(240,240,240,.4)", marginTop: 6 }}>Personalisierte Empfehlung wird erstellt</p>
    </div>
  );

  if (result) return (
    <div style={{ animation: "fadeUp .4s ease both" }}>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap" }}>
        <ScoreGauge score={result.score} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#e8c547", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Ihr Website-Score</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f0f0f0", marginBottom: 10, letterSpacing: "-0.02em" }}>{result.headline}</h3>
          <p style={{ fontSize: 14, color: "rgba(240,240,240,.6)", lineHeight: 1.7 }}>{result.summary}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "rgba(255,64,64,.06)", border: "1px solid rgba(255,64,64,.2)", borderRadius: 10, padding: "16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#ff4040", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Top-Probleme</div>
          {result.problems?.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, fontSize: 13, color: "rgba(240,240,240,.7)" }}>
              <span style={{ color: "#ff4040", flexShrink: 0 }}>✗</span>{p}
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(0,232,122,.06)", border: "1px solid rgba(0,232,122,.2)", borderRadius: 10, padding: "16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#00e87a", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Quick Wins</div>
          {result.quickwins?.map((q, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, fontSize: 13, color: "rgba(240,240,240,.7)" }}>
              <span style={{ color: "#00e87a", flexShrink: 0 }}>✓</span>{q}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(232,197,71,.06)", border: "1px solid rgba(232,197,71,.2)", borderRadius: 10, padding: "16px", marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: "#f0f0f0", lineHeight: 1.65 }}>💡 {result.cta}</p>
      </div>

      {!sent ? (
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f0f0", marginBottom: 10 }}>Ergebnis + kostenloses Gespräch sichern:</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="ihre@email.de"
              style={{ flex: 1, background: "#161616", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "11px 14px", color: "#f0f0f0", fontSize: 14, fontFamily: "inherit", outline: "none" }}
              onFocus={e => e.currentTarget.style.borderColor="#e8c547"} onBlur={e => e.currentTarget.style.borderColor="rgba(255,255,255,.12)"} />
            <button onClick={() => { if (email.includes("@")) setSent(true); }} style={{ background: "#e8c547", color: "#070707", border: "none", borderRadius: 8, padding: "11px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Senden →</button>
          </div>
          <button onClick={() => { setStep(0); setAnswers({}); setResult(null); setSent(false); }} style={{ background: "none", border: "none", color: "rgba(240,240,240,.3)", fontSize: 12, cursor: "pointer", marginTop: 10, fontFamily: "inherit" }}>↩ Neue Analyse</button>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "20px", background: "rgba(0,232,122,.08)", borderRadius: 10, border: "1px solid rgba(0,232,122,.2)" }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>✓</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#00e87a" }}>Ich melde mich innerhalb von 24h!</div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {SCHNELLCHECK_STEPS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i <= step ? "#e8c547" : "rgba(255,255,255,.1)", transition: "background .3s" }} />
        ))}
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(240,240,240,.35)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Frage {step + 1} / {SCHNELLCHECK_STEPS.length}</div>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#f0f0f0", marginBottom: 20, letterSpacing: "-0.02em" }}>{cur.q}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cur.opts.map((opt, i) => (
          <button key={i} onClick={() => select(opt)} style={{ background: answers[step] === opt ? "rgba(232,197,71,.1)" : "rgba(255,255,255,.03)", border: `1.5px solid ${answers[step] === opt ? "#e8c547" : "rgba(255,255,255,.1)"}`, borderRadius: 10, padding: "13px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: 14, color: answers[step] === opt ? "#e8c547" : "rgba(240,240,240,.75)", display: "flex", alignItems: "center", gap: 10, textAlign: "left", transition: "all .15s" }}>
            <span style={{ fontSize: 20, width: 26, flexShrink: 0 }}>{opt.icon}</span>
            <span style={{ flex: 1 }}>{opt.l}</span>
            {answers[step] === opt && <span style={{ flexShrink: 0 }}>✓</span>}
          </button>
        ))}
      </div>
      {step > 0 && (
        <button onClick={() => setStep(s => s - 1)} style={{ background: "none", border: "none", color: "rgba(240,240,240,.35)", fontSize: 12, cursor: "pointer", marginTop: 14, fontFamily: "inherit" }}>← Zurück</button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AUTOMATION FLOW VISUALIZER
══════════════════════════════════════════════════════════ */
function AutomationVisualizer() {
  const [ref, vis] = useInView(0.2);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!vis) return;
    const t = setInterval(() => setActive(a => (a + 1) % AUTOMATION_STEPS.length), 1400);
    return () => clearInterval(t);
  }, [vis]);

  return (
    <div ref={ref}>
      <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "nowrap", overflowX: "auto", paddingBottom: 8 }}>
        {AUTOMATION_STEPS.map(({ icon, label, desc }, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(16px)", transition: `all .4s ${i * .1}s` }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: active === i ? "rgba(232,197,71,.12)" : "#161616", border: `2px solid ${active === i ? "#e8c547" : "rgba(255,255,255,.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, transition: "all .3s", boxShadow: active === i ? "0 0 20px rgba(232,197,71,.2)" : "none" }}>
                {icon}
              </div>
              <div style={{ textAlign: "center", maxWidth: 88 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: active === i ? "#e8c547" : "#f0f0f0", transition: "color .3s" }}>{label}</div>
                <div style={{ fontSize: 10, color: "rgba(240,240,240,.35)", marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
              </div>
            </div>
            {i < AUTOMATION_STEPS.length - 1 && (
              <div style={{ width: 40, height: 2, background: active > i ? "#e8c547" : "rgba(255,255,255,.1)", margin: "0 6px", marginBottom: 28, transition: "background .3s", flexShrink: 0, position: "relative" }}>
                {active > i && <div style={{ position: "absolute", right: -4, top: -4, width: 10, height: 10, borderRight: "2px solid #e8c547", borderTop: "2px solid #e8c547", transform: "rotate(45deg)" }} />}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(232,197,71,.05)", border: "1px solid rgba(232,197,71,.15)", borderRadius: 8, fontSize: 13, color: "rgba(240,240,240,.6)" }}>
        ⚡ Dieser Prozess läuft vollständig automatisch — in unter 30 Sekunden, während Sie schlafen.
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   VORHER / NACHHER TOGGLE
══════════════════════════════════════════════════════════ */
function VorherNachher() {
  const [after, setAfter] = useState(false);
  const before = [
    { time: "8:30", text: "Telefonanfrage — alles von Hand notieren", dur: "15 Min" },
    { time: "9:00", text: "Angebot manuell erstellen und per E-Mail senden", dur: "45 Min" },
    { time: "10:30", text: "Termin in Kalender manuell eintragen", dur: "10 Min" },
    { time: "14:00", text: "Nachfass-E-Mail nicht vergessen — wieder von Hand", dur: "20 Min" },
  ];
  const aft = [
    { time: "8:30", text: "Formular-Anfrage geht ein — System reagiert sofort", dur: "0 Min" },
    { time: "8:30", text: "CRM aktualisiert, Angebot automatisch generiert", dur: "Auto" },
    { time: "8:31", text: "Kalender gebucht, Bestätigung an Kunden gesendet", dur: "Auto" },
    { time: "8:32", text: "Sie kriegen WhatsApp — Anfrage fertig verarbeitet", dur: "2 Min" },
  ];
  const items = after ? aft : before;
  const c = after ? "#00e87a" : "#ff4040";
  return (
    <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ display: "flex" }}>
        {[false, true].map(isAfter => (
          <button key={String(isAfter)} onClick={() => setAfter(isAfter)} style={{ flex: 1, padding: "14px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700, background: after === isAfter ? (isAfter ? "#00e87a" : "#ff4040") : "transparent", color: after === isAfter ? "#070707" : "rgba(240,240,240,.35)", transition: "all .2s" }}>
            {isAfter ? "✓ Mit Automation" : "✗ Ohne Automation"}
          </button>
        ))}
      </div>
      <div style={{ padding: 24 }}>
        {items.map(({ time, text, dur }, i) => (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < items.length - 1 ? 16 : 0, animation: "fadeUp .3s ease both", animationDelay: `${i * .05}s` }}>
            <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(240,240,240,.3)", flexShrink: 0, paddingTop: 2 }}>{time}</span>
            <span style={{ flex: 1, fontSize: 14, color: "rgba(240,240,240,.8)" }}>{text}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: c, flexShrink: 0 }}>{dur}</span>
          </div>
        ))}
        <div style={{ marginTop: 20, padding: "12px 16px", background: `${c}15`, borderRadius: 8, textAlign: "center", fontSize: 14, fontWeight: 700, color: c }}>
          {after ? "✓ ~2 Minuten pro Anfrage — vollautomatisch" : "✗ ~90 Minuten pro Anfrage — alles manuell"}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ROI CALCULATOR
══════════════════════════════════════════════════════════ */
function ROICalculator() {
  const [besucher, setBesucher] = useState(200);
  const [rate, setRate] = useState(2);
  const [wert, setWert] = useState(500);
  const aktuell = Math.round(besucher * rate / 100);
  const potenzial = aktuell * 3;
  const monat = (potenzial - aktuell) * wert;
  const jahr = monat * 12;
  const fmt = n => n.toLocaleString("de-DE") + " €";
  const SliderRow = ({ label, value, set, min, max, step = 1, unit }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
        <span style={{ color: "rgba(240,240,240,.7)", fontWeight: 500 }}>{label}</span>
        <span style={{ color: "#e8c547", fontWeight: 700, fontFamily: "monospace" }}>{value.toLocaleString("de-DE")} {unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))} style={{ width: "100%", accentColor: "#e8c547", height: 4, cursor: "pointer" }} />
    </div>
  );
  return (
    <div style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: 32 }}>
      <SliderRow label="Besucher pro Monat" value={besucher} set={setBesucher} min={50} max={2000} step={10} unit="Besucher" />
      <SliderRow label="Anfragen-Rate" value={rate} set={setRate} min={1} max={20} unit="%" />
      <SliderRow label="Ø Auftragswert" value={wert} set={setWert} min={100} max={5000} step={50} unit="€" />
      <div style={{ background: "#161616", border: "1px solid rgba(232,197,71,.2)", borderRadius: 12, padding: 24, marginTop: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          {[["Aktuelle Anfragen", aktuell, "rgba(240,240,240,.5)"], ["Mit neuer Website (3×)", potenzial, "#00e87a"], ["Verpasst/Monat", fmt(monat), "#ff4040"]].map(([l, v, c]) => (
            <div key={l}>
              <div style={{ fontSize: 11, color: "rgba(240,240,240,.35)", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>{l}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: c, letterSpacing: "-0.03em" }}>{v}</div>
            </div>
          ))}
          <div>
            <div style={{ fontSize: 11, color: "rgba(240,240,240,.35)", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>Verpasst/Jahr</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#e8c547", letterSpacing: "-0.04em" }}>{fmt(jahr)}</div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "rgba(240,240,240,.35)", lineHeight: 1.6 }}>Eine neue Website ab 890 € amortisiert sich nach der ersten zusätzlichen Anfrage.</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LEISTUNGEN
══════════════════════════════════════════════════════════ */
function Leistungen({ to }) {
  const [ref, vis] = useInView();
  const cards = [
    { icon: "⚡", title: "Webdesign", sub: "Ab 890 € · Festpreis", feats: ["Design nach Ihren Wünschen","Mobile-optimiert & schnell","SEO-Grundlagen inklusive","Kontaktformular & Impressum","Fertig in 7 Werktagen","3 Monate kostenloser Support"], tag: null },
    { icon: "🤖", title: "KI-Automatisierung", sub: "Ab 490 € · Festpreis", feats: ["Automatische Anfragenverarbeitung","E-Mail & WhatsApp Automation","CRM & Kalender-Anbindung","KI-Chatbot für Ihre Website","Make & Zapier Workflows","Einrichtung & Einweisung"], tag: "Zeitsparer" },
    { icon: "🎯", title: "Kombi-Paket", sub: "Ab 1.290 € · Festpreis", feats: ["Website + Automation aus einer Hand","Anfragen werden sofort verarbeitet","Kein Medienbruch, alles integriert","6 Monate Support inklusive","Schnellster ROI","Beliebteste Wahl"], tag: "Beliebt" },
  ];
  return (
    <section id="leistungen" style={{ background: "#0f0f0f", borderTop: "1px solid rgba(255,255,255,.07)", padding: "100px 40px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: "all .5s" }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(240,240,240,.4)", marginBottom: 16 }}>— Was ich tue —</p>
          <h2 style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0f0f0", marginBottom: 56 }}>Zwei Dinge. Richtig gut.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 32 }}>
          {cards.map(({ icon, title, sub, feats, tag }, i) => (
            <div key={i} style={{ background: "#161616", border: `1px solid ${tag === "Beliebt" ? "rgba(232,197,71,.3)" : "rgba(255,255,255,.07)"}`, borderRadius: 14, padding: 32, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: `all .5s ${i * .1}s`, position: "relative" }}>
              {tag && <div style={{ position: "absolute", top: -12, left: 24, background: tag === "Beliebt" ? "#e8c547" : "#0f0f0f", color: tag === "Beliebt" ? "#070707" : "#e8c547", border: tag !== "Beliebt" ? "1px solid #e8c547" : "none", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, letterSpacing: ".06em" }}>{tag}</div>}
              <div style={{ fontSize: 28, marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f0f0f0", marginBottom: 4, letterSpacing: "-0.02em" }}>{title}</h3>
              <div style={{ fontSize: 13, color: "#e8c547", fontWeight: 600, marginBottom: 24 }}>{sub}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {feats.map(f => <li key={f} style={{ fontSize: 14, color: "rgba(240,240,240,.6)", display: "flex", gap: 8 }}><span style={{ color: "#00e87a", flexShrink: 0 }}>✓</span>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(232,197,71,.05)", border: "1px solid rgba(232,197,71,.2)", borderRadius: 14, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f0", marginBottom: 6 }}>Nicht sicher was Sie brauchen?</h3>
            <p style={{ fontSize: 14, color: "rgba(240,240,240,.5)" }}>Machen Sie den kostenlosen Website-Check — ich sage Ihnen in 3 Minuten was bei Ihnen am meisten bringt.</p>
          </div>
          <button onClick={() => to("check")} style={{ background: "#e8c547", color: "#070707", border: "none", borderRadius: 8, padding: "13px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Website-Check starten →</button>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   PROZESS
══════════════════════════════════════════════════════════ */
function Prozess() {
  const [ref, vis] = useInView();
  return (
    <section style={{ padding: "100px 40px", maxWidth: 1180, margin: "0 auto" }} ref={ref}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(240,240,240,.4)", marginBottom: 16 }}>— Ablauf —</p>
      <h2 style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0f0f0", marginBottom: 64 }}>Von der Anfrage zur Website<br />in einer Woche.</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, position: "relative" }}>
        <div style={{ position: "absolute", top: 27, left: "8%", right: "8%", height: 1, background: "rgba(255,255,255,.07)" }} />
        {[
          ["01","Erstgespräch","30 Min. kostenlos — wir klären was Sie wirklich brauchen."],
          ["02","Angebot","Am nächsten Tag: konkretes Festpreis-Angebot."],
          ["03","Umsetzung","7 Tage — Sie sehen täglich den Fortschritt."],
          ["04","Launch","Live. Online. Kunden kommen. Inklusive 3 Mon. Support."],
        ].map(([n, t, d], i) => (
          <div key={i} style={{ padding: "0 16px", textAlign: "center", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: `all .5s ${i * .1}s` }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#161616", border: "1px solid rgba(232,197,71,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", position: "relative", zIndex: 1 }}>
              <span style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 800, color: "#e8c547" }}>{n}</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f0f0", marginBottom: 8 }}>{t}</h3>
            <p style={{ fontSize: 13, color: "rgba(240,240,240,.45)", lineHeight: 1.65 }}>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   PREISE
══════════════════════════════════════════════════════════ */
function Preise({ to }) {
  const [ref, vis] = useInView();
  const tiers = [
    { name: "Starter", price: "890 €", for: "Handwerker, Gastronomen, lokale Dienstleister", feats: ["5-seitige Website","Design nach Briefing","Mobile-optimiert","Kontaktformular","Google Maps","Impressum & Datenschutz","3 Monate Support"], featured: false },
    { name: "Professional", price: "1.490 €", for: "Unternehmen die online wachsen wollen", feats: ["Alles aus Starter","Bis 10 Seiten","SEO-Optimierung","Blog / News-Bereich","Google Analytics","1 KI-Automation inklusive","6 Monate Support"], featured: true },
    { name: "Automation Only", price: "490 €", for: "Wer schon eine Website hat", feats: ["1 vollständiger Workflow","E-Mail / WhatsApp / CRM","Einrichtung & Einweisung","30 Tage Nachbetreuung"], featured: false },
  ];
  return (
    <section id="preise" style={{ background: "#0f0f0f", borderTop: "1px solid rgba(255,255,255,.07)", padding: "100px 40px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }} ref={ref}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(240,240,240,.4)", marginBottom: 16 }}>— Transparent —</p>
        <h2 style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0f0f0", marginBottom: 56 }}>Was Sie investieren.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, alignItems: "start" }}>
          {tiers.map(({ name, price, for: f, feats, featured }, i) => (
            <div key={i} style={{ background: "#161616", border: `1px solid ${featured ? "rgba(232,197,71,.35)" : "rgba(255,255,255,.07)"}`, borderRadius: 14, padding: 32, position: "relative", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: `all .5s ${i * .1}s` }}>
              {featured && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#e8c547", color: "#070707", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>Beliebt</div>}
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,240,240,.4)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>{name}</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: "#f0f0f0", letterSpacing: "-0.04em", marginBottom: 6 }}>{price}</div>
              <div style={{ fontSize: 12, color: "rgba(240,240,240,.35)", marginBottom: 24 }}>{f}</div>
              <div style={{ height: 1, background: "rgba(255,255,255,.07)", marginBottom: 22 }} />
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {feats.map(f => <li key={f} style={{ fontSize: 14, color: "rgba(240,240,240,.6)", display: "flex", gap: 8 }}><span style={{ color: "#00e87a", flexShrink: 0 }}>✓</span>{f}</li>)}
              </ul>
              <button onClick={() => to("kontakt")} style={{ width: "100%", background: featured ? "#e8c547" : "transparent", color: featured ? "#070707" : "#f0f0f0", border: featured ? "none" : "1px solid rgba(255,255,255,.2)", borderRadius: 8, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
                Jetzt anfragen
              </button>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(240,240,240,.3)", marginTop: 28 }}>Alle Preise zzgl. MwSt. · Kein Abo · Keine versteckten Kosten · Individuelle Projekte auf Anfrage</p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   PROJEKT GALERIE + LIGHTBOX
══════════════════════════════════════════════════════════ */
function ProjektGalerie() {
  const [open, setOpen] = useState(null);
  const [ref, vis] = useInView();
  return (
    <section id="projekte" style={{ padding: "100px 40px", maxWidth: 1180, margin: "0 auto" }} ref={ref}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(240,240,240,.4)", marginBottom: 16 }}>— Referenzen —</p>
      <h2 style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0f0f0", marginBottom: 16 }}>Projekte aus Dresden.</h2>
      <p style={{ fontSize: 16, color: "rgba(240,240,240,.5)", marginBottom: 56 }}>Echte Kunden. Echte Ergebnisse. Alle in unter einer Woche geliefert.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
        {PROJECTS.map((p, i) => (
          <div key={i} onClick={() => setOpen(p)} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, overflow: "hidden", cursor: "pointer", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: `all .5s ${i * .1}s` }} onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.18)"; }} onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; }}>
            <div style={{ height: 160, background: `linear-gradient(135deg, ${p.color} 0%, ${p.accent}22 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, position: "relative" }}>
              <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,232,122,.15)", border: "1px solid rgba(0,232,122,.3)", borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 700, color: "#00e87a" }}>Live</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", letterSpacing: ".08em" }}>{p.cat}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{p.name}</div>
              <div style={{ fontSize: 11, color: p.accent, background: `${p.accent}20`, border: `1px solid ${p.accent}40`, borderRadius: 20, padding: "3px 10px", marginTop: 4 }}>{p.tag}</div>
            </div>
            <div style={{ padding: "20px 22px" }}>
              <p style={{ fontSize: 13, color: "rgba(240,240,240,.5)", lineHeight: 1.65, marginBottom: 14 }}>{p.desc}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {p.tech.map(t => <span key={t} style={{ fontSize: 11, background: "#161616", border: "1px solid rgba(255,255,255,.07)", borderRadius: 4, padding: "3px 8px", color: "rgba(240,240,240,.4)" }}>{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* LIGHTBOX */}
      {open && (
        <div onClick={() => setOpen(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", backdropFilter: "blur(8px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.12)", borderRadius: 20, maxWidth: 560, width: "100%", overflow: "hidden", animation: "fadeUp .25s ease" }}>
            <div style={{ height: 200, background: `linear-gradient(135deg, ${open.color} 0%, ${open.accent}33 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, position: "relative" }}>
              <button onClick={() => setOpen(null)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,.1)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "#fff", fontSize: 16 }}>✕</button>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)" }}>{open.cat}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>{open.name}</div>
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[["Lieferzeit", `${open.days} Tage`], ["Status", "Live"], ["Typ", open.tag]].map(([l, v]) => (
                  <div key={l} style={{ background: "#161616", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "rgba(240,240,240,.35)", marginBottom: 4, textTransform: "uppercase" }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f0f0" }}>{v}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 14, color: "rgba(240,240,240,.6)", lineHeight: 1.7, marginBottom: 20 }}>{open.desc}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                {open.tech.map(t => <span key={t} style={{ fontSize: 12, background: "#161616", border: "1px solid rgba(255,255,255,.1)", borderRadius: 6, padding: "4px 10px", color: "rgba(240,240,240,.5)" }}>{t}</span>)}
              </div>
              <p style={{ fontSize: 13, color: "rgba(240,240,240,.35)", fontStyle: "italic" }}>Möchten Sie ein ähnliches Projekt? → Kostenloses Erstgespräch.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════════════════════ */
function Testimonials() {
  const [ref, vis] = useInView();
  return (
    <section style={{ background: "#0f0f0f", borderTop: "1px solid rgba(255,255,255,.07)", padding: "100px 40px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }} ref={ref}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(240,240,240,.4)", marginBottom: 16 }}>— Stimmen —</p>
        <h2 style={{ fontSize: "clamp(30px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0f0f0", marginBottom: 56 }}>Echte Kunden.<br />Echte Ergebnisse.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 40 }}>
          {TESTIMONIALS.map(({ name, role, text, stars }, i) => (
            <div key={i} style={{ background: "#161616", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: 28, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: `all .5s ${i * .1}s` }}>
              <div style={{ color: "#e8c547", fontSize: 14, marginBottom: 16 }}>{"★".repeat(stars)}</div>
              <p style={{ fontSize: 14, color: "rgba(240,240,240,.6)", lineHeight: 1.75, fontStyle: "italic", marginBottom: 20 }}>„{text}"</p>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f0f0" }}>{name}</div>
              <div style={{ fontSize: 12, color: "rgba(240,240,240,.3)", marginTop: 2 }}>{role}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 48 }}>
          {[["15+","Projekte"],["100%","Festpreis-Garantie"],["4.9★","Bewertung"],["7 Tage","Ø Lieferzeit"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#e8c547", letterSpacing: "-0.03em" }}>{v}</div>
              <div style={{ fontSize: 12, color: "rgba(240,240,240,.35)", marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   ÜBER MICH
══════════════════════════════════════════════════════════ */
function UeberMich({ to }) {
  const [ref, vis] = useInView();
  return (
    <section style={{ padding: "100px 40px", maxWidth: 1180, margin: "0 auto" }} ref={ref}>
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 80, alignItems: "center", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: "all .6s" }}>
        <div style={{ aspectRatio: "1", background: "#0f0f0f", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, position: "relative" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(232,197,71,.08)", border: "1px solid rgba(232,197,71,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800, color: "#e8c547" }}>AO</div>
          <div style={{ fontSize: 12, color: "rgba(240,240,240,.3)", fontFamily: "monospace" }}>Foto folgt</div>
          <div style={{ position: "absolute", bottom: -14, right: -14, background: "#0f0f0f", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "#f0f0f0" }}>
            <span>📍</span> Dresden
          </div>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(240,240,240,.4)", marginBottom: 20 }}>— Kein Konzern. Kein Bullshit. —</p>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0f0f0", marginBottom: 24 }}>Hallo, ich bin<br />Alexandros Ohnesorge.</h2>
          <p style={{ fontSize: 15, color: "rgba(240,240,240,.6)", lineHeight: 1.8, marginBottom: 16 }}>Ich mache Websites und KI-Automatisierungen für lokale Unternehmen in Dresden und Sachsen — schnell, direkt und zum Festpreis.</p>
          <p style={{ fontSize: 15, color: "rgba(240,240,240,.6)", lineHeight: 1.8, marginBottom: 16 }}>Ich bin kein Agentur-Verbund mit 20 Projektmanagern. Ich bin eine Person, die Ihr Projekt von Anfang bis Ende selbst umsetzt. Kein „zuständiger Kollege". Kein Warten auf Feedback-Schleifen.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
            {[["⚡","Webdesign mit Lovable & modernen Tools"],["🤖","Automation mit Make & Zapier"],["🎓","KI-Schulungen → Ohnesorge.KI"]].map(([ic, l]) => (
              <div key={l} style={{ background: "#161616", border: "1px solid rgba(255,255,255,.08)", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "rgba(240,240,240,.6)", display: "flex", alignItems: "center", gap: 8 }}>
                <span>{ic}</span>{l}
              </div>
            ))}
          </div>
          <button onClick={() => to("kontakt")} style={{ marginTop: 32, background: "#e8c547", color: "#070707", border: "none", borderRadius: 8, padding: "13px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Direktkontakt aufnehmen</button>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   FAQ
══════════════════════════════════════════════════════════ */
function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ background: "#0f0f0f", borderTop: "1px solid rgba(255,255,255,.07)", padding: "100px 40px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(240,240,240,.4)", marginBottom: 16 }}>— FAQ —</p>
        <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0f0f0", marginBottom: 48 }}>Alles klar?</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {FAQS.map(([q, a], i) => (
            <div key={i} style={{ background: "#161616", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, overflow: "hidden" }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, cursor: "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: 600, color: "#f0f0f0", textAlign: "left" }}>
                {q}
                <span style={{ color: "rgba(240,240,240,.3)", fontSize: 20, transform: open === i ? "rotate(45deg)" : "none", transition: "transform .2s", flexShrink: 0 }}>+</span>
              </button>
              {open === i && <p style={{ fontSize: 14, color: "rgba(240,240,240,.55)", lineHeight: 1.75, padding: "0 24px 20px", animation: "fadeUp .2s ease" }}>{a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   KONTAKT
══════════════════════════════════════════════════════════ */
function Kontakt() {
  const [form, setForm] = useState({ name: "", email: "", firma: "", service: "", msg: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const submit = async () => {
    if (!form.name || !form.email || !form.msg) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    setSending(false);
  };
  const inp = { background: "#161616", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "12px 16px", color: "#f0f0f0", fontSize: 14, fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color .15s" };
  const focus = e => { e.currentTarget.style.borderColor = "#e8c547"; };
  const blur = e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; };
  return (
    <section id="kontakt" style={{ background: "#0f0f0f", borderTop: "1px solid rgba(255,255,255,.07)", padding: "100px 40px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 500px", gap: 80, alignItems: "start" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(240,240,240,.4)", marginBottom: 20 }}>— Bereit? —</p>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0f0f0", marginBottom: 20 }}>Ihr erstes Gespräch<br />ist kostenlos.</h2>
          <p style={{ fontSize: 15, color: "rgba(240,240,240,.55)", lineHeight: 1.8, marginBottom: 40, maxWidth: 380 }}>30 Minuten. Kein Verkaufsgespräch. Kein Druck. Wir schauen gemeinsam was Sie brauchen — und ob ich der Richtige dafür bin.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[["📧","[IHRE EMAIL]"],["📍","Dresden, Sachsen"],["⏱","Antwort innerhalb von 24h"]].map(([ic, t]) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "rgba(240,240,240,.5)" }}>
                <span style={{ fontSize: 18 }}>{ic}</span>{t}
              </div>
            ))}
          </div>
          {/* WhatsApp Button */}
          <a href="https://wa.me/49IHRE_NUMMER" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 32, background: "#25d366", color: "#fff", borderRadius: 8, padding: "13px 24px", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp schreiben
          </a>
        </div>
        <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: 36 }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: "#00e87a", marginBottom: 8 }}>Nachricht erhalten!</h3>
              <p style={{ fontSize: 14, color: "rgba(240,240,240,.5)" }}>Ich melde mich innerhalb von 24h persönlich.</p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div><label style={{ fontSize: 12, fontWeight: 600, color: "rgba(240,240,240,.6)", display: "block", marginBottom: 7 }}>Name *</label><input style={inp} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Max Mustermann" onFocus={focus} onBlur={blur} /></div>
                <div><label style={{ fontSize: 12, fontWeight: 600, color: "rgba(240,240,240,.6)", display: "block", marginBottom: 7 }}>E-Mail *</label><input style={inp} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="max@firma.de" onFocus={focus} onBlur={blur} /></div>
              </div>
              <div style={{ marginBottom: 14 }}><label style={{ fontSize: 12, fontWeight: 600, color: "rgba(240,240,240,.6)", display: "block", marginBottom: 7 }}>Unternehmen</label><input style={inp} value={form.firma} onChange={e => set("firma", e.target.value)} placeholder="Optional" onFocus={focus} onBlur={blur} /></div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(240,240,240,.6)", display: "block", marginBottom: 7 }}>Was brauchen Sie?</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {["Website","Automation","Beides","Unklar"].map(s => (
                    <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, background: form.service === s ? "rgba(232,197,71,.08)" : "#0f0f0f", border: `1px solid ${form.service === s ? "rgba(232,197,71,.35)" : "rgba(255,255,255,.08)"}`, borderRadius: 8, padding: "10px 12px", cursor: "pointer", fontSize: 13, color: form.service === s ? "#e8c547" : "rgba(240,240,240,.55)", transition: "all .15s" }}>
                      <input type="radio" name="service" value={s} checked={form.service === s} onChange={() => set("service", s)} style={{ accentColor: "#e8c547" }} />{s}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 20 }}><label style={{ fontSize: 12, fontWeight: 600, color: "rgba(240,240,240,.6)", display: "block", marginBottom: 7 }}>Nachricht *</label><textarea style={{ ...inp, resize: "vertical", minHeight: 100 }} value={form.msg} onChange={e => set("msg", e.target.value)} placeholder="Was ist Ihre aktuelle Situation?" onFocus={focus} onBlur={blur} /></div>
              <button onClick={submit} disabled={sending || !form.name || !form.email || !form.msg} style={{ width: "100%", background: "#e8c547", color: "#070707", border: "none", borderRadius: 8, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: (!form.name || !form.email || !form.msg) ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {sending ? <><div style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,.2)", borderTop: "2px solid #070707", borderRadius: "50%", animation: "spin .7s linear infinite" }} />Wird gesendet…</> : "Anfrage senden →"}
              </button>
              <p style={{ textAlign: "center", fontSize: 12, color: "rgba(240,240,240,.25)", marginTop: 12 }}>🔒 Vertraulich — keine Weitergabe an Dritte</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   CHAT WIDGET (Claude API)
══════════════════════════════════════════════════════════ */
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "assistant", text: "Hallo! Ich bin Alexandros' KI-Assistent. Fragen zu Website, Preisen oder Automation? Ich helfe gerne!" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottom = useRef(null);
  const abort = useRef(null);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMsgs(p => [...p, { role: "user", text: q }]);
    setLoading(true);
    abort.current = new AbortController();
    const tid = setTimeout(() => abort.current?.abort(), 20000);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        signal: abort.current.signal,
        body: JSON.stringify({ message: q }),
      });
      clearTimeout(tid);
      const data = await res.json();
      setMsgs(p => [...p, { role: "assistant", text: data.reply || "Entschuldigung, ein Fehler ist aufgetreten." }]);
    } catch {
      clearTimeout(tid);
      setMsgs(p => [...p, { role: "assistant", text: "Gerade nicht erreichbar — schreib mir direkt per E-Mail oder WhatsApp!" }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      {open && (
        <div style={{ position: "fixed", bottom: 80, right: 20, width: 320, maxHeight: 460, background: "#0f0f0f", border: "1px solid rgba(255,255,255,.1)", borderRadius: 16, display: "flex", flexDirection: "column", zIndex: 300, boxShadow: "0 24px 64px rgba(0,0,0,.5)", animation: "fadeUp .25s ease" }}>
          <div style={{ background: "#161616", borderRadius: "16px 16px 0 0", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(232,197,71,.1)", border: "1px solid rgba(232,197,71,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f0" }}>Ohnesorge Assistant</div>
              <div style={{ fontSize: 11, color: "#00e87a", display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e87a" }} />Online</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(240,240,240,.4)", cursor: "pointer", fontSize: 18 }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                <div style={{ maxWidth: "85%", padding: "9px 13px", borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: m.role === "user" ? "#e8c547" : "#1a1a1a", color: m.role === "user" ? "#070707" : "rgba(240,240,240,.85)", fontSize: 13, lineHeight: 1.55 }}>{m.text}</div>
              </div>
            ))}
            {loading && <div style={{ display: "flex", gap: 4, padding: "10px 14px", background: "#1a1a1a", borderRadius: "12px 12px 12px 2px", width: "fit-content" }}>{[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(240,240,240,.3)", animation: `bounce .8s ${i * .15}s infinite` }} />)}</div>}
            <div ref={bottom} />
          </div>
          <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,.07)", display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Frage stellen…" style={{ flex: 1, background: "#161616", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "9px 12px", color: "#f0f0f0", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
            <button onClick={send} disabled={!input.trim() || loading} style={{ background: "#e8c547", color: "#070707", border: "none", borderRadius: 8, padding: "9px 12px", fontSize: 14, cursor: "pointer", opacity: input.trim() && !loading ? 1 : .4 }}>→</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} style={{ position: "fixed", bottom: 20, right: 20, width: 52, height: 52, borderRadius: "50%", background: open ? "#161616" : "#e8c547", border: open ? "1px solid rgba(255,255,255,.12)" : "none", color: open ? "#f0f0f0" : "#070707", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(232,197,71,.3)", zIndex: 300, transition: "all .25s" }}>
        {open ? "✕" : "🤖"}
      </button>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   COOKIE BANNER
══════════════════════════════════════════════════════════ */
function CookieBanner() {
  const [vis, setVis] = useState(false);
  useEffect(() => { try { if (!localStorage.getItem("os_cookie")) setVis(true); } catch { setVis(true); } }, []);
  const accept = all => { try { localStorage.setItem("os_cookie", all ? "all" : "essential"); } catch {} setVis(false); };
  if (!vis) return null;
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 400, background: "rgba(7,7,7,.97)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,.08)", padding: "20px 32px", animation: "fadeUp .4s ease" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", justifyContent: "space-between" }}>
        <p style={{ fontSize: 14, color: "rgba(240,240,240,.6)", lineHeight: 1.6, flex: 1, minWidth: 240 }}>🍪 Wir nutzen technisch notwendige Cookies. Mit „Alle akzeptieren" stimmen Sie zusätzlich Analyse-Cookies zu. <a href="#datenschutz" style={{ color: "#e8c547", textDecoration: "none" }}>Mehr erfahren</a></p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => accept(false)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,.2)", color: "rgba(240,240,240,.6)", borderRadius: 8, padding: "10px 18px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Nur notwendige</button>
          <button onClick={() => accept(true)} style={{ background: "#e8c547", color: "#070707", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Alle akzeptieren</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LEGAL MODAL
══════════════════════════════════════════════════════════ */
function LegalModal({ id, onClose }) {
  const c = LEGAL[id];
  if (!c) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", backdropFilter: "blur(6px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,.1)", borderRadius: 20, maxWidth: 680, width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column", animation: "fadeUp .3s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f0f0f0", letterSpacing: "-0.02em" }}>{c.title}</h2>
          <button onClick={onClose} style={{ background: "#161616", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "rgba(240,240,240,.6)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ overflowY: "auto", padding: 24 }}>
          <pre style={{ fontFamily: "inherit", fontSize: 14, lineHeight: 1.75, color: "rgba(240,240,240,.6)", whiteSpace: "pre-wrap", margin: 0 }}>{c.body}</pre>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════ */
function Footer({ setLegal }) {
  return (
    <footer style={{ background: "#040404", borderTop: "1px solid rgba(255,255,255,.06)", padding: "48px 40px 32px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>
              <span style={{ color: "#f0f0f0" }}>Ohnesorge</span><span style={{ color: "#e8c547" }}>.</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(240,240,240,.3)" }}>Webdesign & KI-Automatisierung · Dresden</div>
          </div>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", color: "rgba(240,240,240,.3)", marginBottom: 12 }}>Leistungen</div>
              {["Webdesign","KI-Automatisierung","Preise","Projekte"].map(l => <div key={l} style={{ fontSize: 14, color: "rgba(240,240,240,.4)", marginBottom: 8, cursor: "pointer" }}>{l}</div>)}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", color: "rgba(240,240,240,.3)", marginBottom: 12 }}>Rechtliches</div>
              {[["impressum","Impressum"],["datenschutz","Datenschutz"],["agb","AGB"]].map(([id, l]) => <div key={id} onClick={() => setLegal(id)} style={{ fontSize: 14, color: "rgba(240,240,240,.4)", marginBottom: 8, cursor: "pointer", transition: "color .15s" }} onMouseOver={e => e.currentTarget.style.color="#e8c547"} onMouseOut={e => e.currentTarget.style.color="rgba(240,240,240,.4)"}>{l}</div>)}
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 12, color: "rgba(240,240,240,.2)" }}>© 2026 Alexandros Ohnesorge · Dresden · Alle Rechte vorbehalten</span>
          <span style={{ fontSize: 12, color: "rgba(240,240,240,.2)" }}>Made in Dresden ♥</span>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════
   SCROLL TO TOP
══════════════════════════════════════════════════════════ */
function ScrollTop({ scrollY, to }) {
  if (scrollY < 500) return null;
  return (
    <button onClick={() => to("hero")} style={{ position: "fixed", bottom: 80, right: 20, width: 40, height: 40, borderRadius: "50%", background: "#161616", border: "1px solid rgba(255,255,255,.12)", color: "#f0f0f0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, fontSize: 16, transition: "transform .2s" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseOut={e => e.currentTarget.style.transform = ""}>
      ↑
    </button>
  );
}

/* ══════════════════════════════════════════════════════════
   MOBILE CTA BAR
══════════════════════════════════════════════════════════ */
function MobileCTABar({ to }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 150, display: "none", padding: "12px 16px", background: "rgba(7,7,7,.97)", borderTop: "1px solid rgba(255,255,255,.08)" }} className="mobile-cta">
      <button onClick={() => to("check")} style={{ width: "100%", background: "#e8c547", color: "#070707", border: "none", borderRadius: 8, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
        Kostenloser Website-Check ✦
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════ */
export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [legal, setLegal] = useState(null);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const OFFSET = BANNER_H + 64 + 16;
  const to = (id) => {
    const el = document.getElementById(id);
    if (!el) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - OFFSET, behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#070707", color: "#f0f0f0", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @media(max-width:900px){
          .nav-links-desktop{display:none!important}
          .ham-btn{display:flex!important}
          .mobile-cta{display:block!important}
        }
        @media(max-width:768px){
          section{padding:72px 20px!important}
          h1{font-size:40px!important}
          h2{font-size:28px!important}
        }
        @media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0f0f0f}
        ::-webkit-scrollbar-thumb{background:#e8c547;border-radius:2px}
      `}</style>

      <CountdownBanner />
      <Nav scrollY={scrollY} to={to} />
      <Hero to={to} />
      <StatsBar />
      <ProblemSection />

      {/* WEBSITE SCHNELLCHECK (STAR FEATURE) */}
      <section id="check" style={{ background: "#0f0f0f", borderTop: "1px solid rgba(255,255,255,.07)", padding: "100px 40px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(232,197,71,.08)", border: "1px solid rgba(232,197,71,.2)", borderRadius: 20, padding: "7px 16px", fontSize: 12, fontWeight: 600, color: "#e8c547", marginBottom: 24 }}>✦ Kostenlos & sofort</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0f0f0", marginBottom: 20 }}>Website-Check.<br />In 3 Minuten.</h2>
            <p style={{ fontSize: 16, color: "rgba(240,240,240,.55)", lineHeight: 1.8, marginBottom: 32 }}>5 Fragen — und Sie wissen sofort wo Ihre Website Kunden kostet. Powered by Claude AI.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["🎯","Personalisiertes Ergebnis — kein generisches Feedback"],["⚡","Sofortiger Score mit konkreten Empfehlungen"],["📊","Top-3 Probleme + Quick Wins für diese Woche"],["💬","Gratis-Gespräch wenn Sie mehr wissen wollen"]].map(([ic, t]) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "rgba(240,240,240,.6)" }}>
                  <span style={{ fontSize: 20, width: 28, flexShrink: 0 }}>{ic}</span>{t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(232,197,71,.08)", border: "1px solid rgba(232,197,71,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✦</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f0" }}>Website-Schnellcheck</div>
                <div style={{ fontSize: 11, color: "rgba(240,240,240,.35)" }}>Powered by Claude AI</div>
              </div>
            </div>
            <SchnellcheckTool />
          </div>
        </div>
      </section>

      {/* AUTOMATION VISUALIZER */}
      <section style={{ padding: "100px 40px", maxWidth: 1180, margin: "0 auto" }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(240,240,240,.4)", marginBottom: 16 }}>— So funktioniert Automation —</p>
        <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0f0f0", marginBottom: 16 }}>Eine Anfrage rein.<br />Alles passiert automatisch.</h2>
        <p style={{ fontSize: 16, color: "rgba(240,240,240,.5)", marginBottom: 56 }}>In unter 30 Sekunden. Ohne dass Sie etwas tun müssen.</p>
        <AutomationVisualizer />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 48 }}>
          <VorherNachher />
          <ROICalculator />
        </div>
      </section>

      <Leistungen to={to} />
      <Prozess />
      <Preise to={to} />
      <ProjektGalerie />
      <Testimonials />
      <UeberMich to={to} />
      <FAQ />
      <Kontakt />

      {/* FINAL CTA */}
      <section style={{ background: "linear-gradient(135deg,#0a0a0a 0%,#161616 100%)", borderTop: "1px solid rgba(232,197,71,.15)", padding: "100px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#f0f0f0", marginBottom: 16 }}>Bereit für den ersten Schritt?</h2>
          <p style={{ fontSize: 16, color: "rgba(240,240,240,.5)", lineHeight: 1.8, marginBottom: 40 }}>Website-Check kostenlos. Erstgespräch kostenlos. Kein Kaufdruck. Versprochen.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => to("check")} style={{ background: "#e8c547", color: "#070707", border: "none", borderRadius: 8, padding: "16px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Website-Check starten ✦</button>
            <button onClick={() => to("kontakt")} style={{ background: "transparent", color: "#f0f0f0", border: "1px solid rgba(255,255,255,.2)", borderRadius: 8, padding: "15px 28px", fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Direkt anfragen</button>
          </div>
        </div>
      </section>

      <Footer setLegal={setLegal} />
      {legal && <LegalModal id={legal} onClose={() => setLegal(null)} />}
      <CookieBanner />
      <ChatWidget />
      <ScrollTop scrollY={scrollY} to={to} />
      <MobileCTABar to={to} />
    </div>
  );
}
