import { useState, useEffect, useRef } from "react";

const P="#8b5cf6",PD="rgba(139,92,246,.1)",PB="rgba(139,92,246,.25)";
const BG="#060606",B2="#0e0e0e",B3="#151515",BR="rgba(255,255,255,.06)",BR2="rgba(255,255,255,.12)";
const T="#f2f2f2",TD="rgba(242,242,242,.5)",TF="rgba(242,242,242,.25)";
const GR="#4ade80",RE="#f87171";

const DEF_PAKETE=[
  {id:"starter",name:"Starter",price:"890 €",priceNote:"Einmalig, kein Abo",for:"Handwerker · Gastronomen · Lokale Dienstleister",featured:false,feats:["5-seitige Website nach Ihren Wünschen","Mobile-optimiert & schnell","Kontaktformular + Google Maps","Impressum & Datenschutz","3 Monate Support"]},
  {id:"professional",name:"Professional",price:"1.490 €",priceNote:"Einmalig, kein Abo",for:"Unternehmen die online wachsen wollen",featured:true,feats:["Alles aus Starter","Bis 10 Seiten + Blog","SEO-Optimierung vollständig","Google Analytics","1 KI-Automation kostenlos dazu","6 Monate Support"]},
  {id:"automation",name:"Automation Only",price:"490 €",priceNote:"Einmalig, kein Abo",for:"Sie haben bereits eine Website",featured:false,feats:["1 vollständiger Automation-Workflow","E-Mail / WhatsApp / CRM","Einrichtung & Einweisung","30 Tage Nachbetreuung"]},
];
function lsGet(k,d){try{const v=localStorage.getItem("os_content_"+k);return v?JSON.parse(v):d;}catch{return d;}}

const WORDS=["eine neue Website","mehr Kundenanfragen","automatisierte Prozesse","messbares Wachstum","eine starke Online-Präsenz"];
const MARKET_STATS=[
  {num:"73%",label:"der Kunden prüfen eine Website bevor sie anrufen"},
  {num:"8 Sek.",label:"— so lange haben Sie um online zu überzeugen"},
  {num:"3×",label:"mehr Anfragen mit einer optimierten Website"},
  {num:"890 €",label:"Einstiegspreis — Festpreis, kein Nachschlag"},
];
const BA=[
  {time:"08:30",b:"Telefonanfrage — alles von Hand notieren",bd:"15 Min",a:"Formular-Anfrage eingeht — System reagiert sofort",ad:"0 Min"},
  {time:"09:00",b:"Angebot manuell schreiben und per E-Mail senden",bd:"45 Min",a:"CRM aktualisiert, Angebot automatisch generiert",ad:"Auto"},
  {time:"10:30",b:"Termin in Kalender manuell eintragen",bd:"10 Min",a:"Kalender gebucht, Bestätigung an Kunden",ad:"Auto"},
  {time:"14:00",b:"Nachfass-E-Mail nicht vergessen — wieder von Hand",bd:"20 Min",a:"Sie erhalten WhatsApp — Anfrage vollständig erledigt",ad:"2 Min"},
];
const CSTEPS=[
  {q:"Wo verliert Ihre Website aktuell Kunden?",multi:true,opts:[{i:"📱",l:"Schlechte Mobile-Ansicht"},{i:"🐢",l:"Lädt zu langsam"},{i:"🔍",l:"Nicht bei Google auffindbar"},{i:"📞",l:"Kein klares Kontaktformular"},{i:"💀",l:"Design veraltet"},{i:"🤷",l:"Ich weiß es nicht"}]},
  {q:"Wie viele Anfragen kommen monatlich über Ihre Website?",multi:false,opts:[{i:"0️⃣",l:"Keine — kein Formular vorhanden"},{i:"1️⃣",l:"1–3 Anfragen"},{i:"📬",l:"4–10 Anfragen"},{i:"🚀",l:"Mehr als 10 Anfragen"}]},
  {q:"Was ist Ihr wichtigstes Ziel in den nächsten 90 Tagen?",multi:false,opts:[{i:"📈",l:"Mehr Kundenanfragen generieren"},{i:"⚡",l:"Prozesse automatisieren & Zeit sparen"},{i:"🏆",l:"Professioneller online auftreten"},{i:"🎯",l:"Alles davon"}]},
];
const LEISTUNGEN=[
  {icon:"🌐",name:"Webdesign",tag:"Ab 890 € · Festpreis",desc:"Keine Templates. Kein Baukastensystem. Eine Website die Ihre Persönlichkeit zeigt und Besucher in Anfragen verwandelt.",highlights:["Fertig in 7 Werktagen","Mobile-first, SEO-ready","Kontaktformular + Tracking"]},
  {icon:"⚡",name:"KI-Automatisierung",tag:"Ab 490 € · Festpreis",desc:"Anfragen rein, alles läuft automatisch. CRM, WhatsApp, E-Mail — verbunden und abgearbeitet ohne einen Finger zu rühren.",highlights:["Spart 1–3 Std. täglich","Make & Zapier Workflows","Einrichtung + Einweisung"]},
  {icon:"🎯",name:"Kombi-Paket",tag:"Ab 1.290 € · Festpreis",desc:"Website + Automation aus einer Hand. Kein Medienbruch. Der schnellste Weg zum ROI.",highlights:["Alles aus einer Hand","6 Monate Support","Günstigster ROI"]},
];
const ZIELGRUPPEN=[
  {icon:"🔨",title:"Handwerk & Gewerbe",desc:"Sie sind gut in Ihrem Handwerk — aber online fast unsichtbar. Das ändern wir in einer Woche.",examples:"Elektriker · Maler · Sanitär · Schreiner"},
  {icon:"🍕",title:"Gastronomie & Retail",desc:"Ihre Gäste buchen online. Ihre Konkurrenz auch. Eine saubere Präsenz entscheidet über die Wahl.",examples:"Restaurants · Cafés · Einzelhandel · Hotels"},
  {icon:"💼",title:"Dienstleistung & Beratung",desc:"Vertrauen beginnt online. Eine professionelle Website konvertiert Besucher in zahlende Kunden.",examples:"Steuerberater · Coaching · Agenturen · Freelancer"},
];
const FAQS=[
  ["Wie lange dauert eine Website?","5–7 Werktage nach vollständiger Materialübergabe (Logo, Fotos, Texte). Mit Briefing an Tag 1 sind Sie an Tag 7 live."],
  ["Gibt es versteckte Kosten?","Nein. Festpreis bedeutet Festpreis. Hosting läuft direkt beim Anbieter (8–15 €/Monat) — kein laufender Vertrag mit mir."],
  ["Können Sie meine alte Website übernehmen?","Oft ja — klären wir im Erstgespräch in 5 Minuten."],
  ["Was genau ist KI-Automatisierung?","Formular-Anfrage kommt rein → CRM aktualisiert → WhatsApp an Sie → Bestätigung an Kunden. Alles ohne Ihr Zutun."],
  ["Arbeiten Sie auch außerhalb Dresdens?","Ja — Webdesign und Automation laufen vollständig remote."],
  ["Was kostet das Erstgespräch?","Nichts. 30 Minuten, kostenlos, kein Kaufdruck."],
];
const PROJEKTE=[
  {name:"Walczak & Gogsch",cat:"Rechtsanwaltskanzlei · Dresden",tag:"Website + KI-Fallanalyse",desc:"Kanzleiwebsite mit KI-Tool zur Falleinschätzung. Mandanten qualifizieren sich selbst.",tech:["React","Claude API","Lovable"],result:"Weniger unqualifizierte Erstgespräche",c1:"#060d1c",c2:"#60a5fa",days:6},
  {name:"Benedikt Tillmann",cat:"Rechtsanwalt · Personal Brand",tag:"Personal Brand Website",desc:"Klare, helle Anwaltswebsite. Vertrauen durch Persönlichkeit statt Stockfotos.",tech:["React","Lovable"],result:"Mehr direkte Mandatsanfragen",c1:"#0d1a0d",c2:"#4ade80",days:5},
  {name:"Rollimaus e.V.",cat:"Kinderverein · Dresden",tag:"Pro-Bono · Spendenrechner",desc:"Vereinswebsite mit interaktivem Spendenrechner und Bus-Kauf-Fortschrittsanzeige.",tech:["React","Donation Slider"],result:"Spendenfortschritt transparent sichtbar",c1:"#1a0a14",c2:"#f472b6",days:7},
];
const LEGAL={
  impressum:{title:"Impressum",body:"Angaben gemäß § 5 TMG\n\nAlexandros Ohnesorge\nBergmannstraße 64\n01309 Dresden\n\nE-Mail: alex.ohnesorge@icloud.com\n\nGemäß § 19 UStG wird keine Umsatzsteuer berechnet.\nSteuernummer: [folgt] · Finanzamt Dresden"},
  datenschutz:{title:"Datenschutz",body:"1. Verantwortlicher\nAlexandros Ohnesorge, Bergmannstraße 64, 01309 Dresden\n\n2. Erhobene Daten\nKontaktformulardaten und Server-Logs.\n\n3. KI-Tools\nTexte in Check/Chat werden an Anthropic API übermittelt.\n\n4. Rechte\nAuskunft, Berichtigung, Löschung (Art. 15–21 DSGVO).\nKontakt: alex.ohnesorge@icloud.com"},
  agb:{title:"AGB",body:"§ 1 Geltungsbereich\nAlexandros Ohnesorge, Bergmannstraße 64, 01309 Dresden.\n\n§ 2 Vergütung\n50% Anzahlung, 50% nach Fertigstellung. Zahlungsziel: 14 Tage.\n\n§ 3 Lieferzeit\n5–7 Werktage nach vollständiger Materialübergabe.\n\n§ 4 Gerichtsstand\nDresden. Deutsches Recht."},
};

function useTypewriter(words,speed=80){
  const[text,setText]=useState("");const[wi,setWi]=useState(0);const[del,setDel]=useState(false);const p=useRef(null);
  useEffect(()=>{const cur=words[wi];const t=setTimeout(()=>{if(!del){if(text.length<cur.length)setText(cur.slice(0,text.length+1));else p.current=setTimeout(()=>setDel(true),2000);}else{if(text.length>0)setText(cur.slice(0,text.length-1));else{setDel(false);setWi((wi+1)%words.length);}}},del?40:speed);return()=>{clearTimeout(t);clearTimeout(p.current);};},[text,wi,del]);return text;
}
function useInView(th=0.1){
  const ref=useRef(null);const[vis,setVis]=useState(false);
  useEffect(()=>{const ob=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:th});if(ref.current)ob.observe(ref.current);return()=>ob.disconnect();},[]);return[ref,vis];
}
function useActiveSection(ids){
  const[active,setActive]=useState("");
  useEffect(()=>{const obs=ids.map(id=>{const el=document.getElementById(id);if(!el)return null;const ob=new IntersectionObserver(([e])=>{if(e.isIntersecting)setActive(id);},{threshold:0.25});ob.observe(el);return ob;}).filter(Boolean);return()=>obs.forEach(o=>o.disconnect());},[]);return active;
}

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:#060606;color:#f2f2f2;overflow-x:hidden;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#060606}::-webkit-scrollbar-thumb{background:#8b5cf6;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.fade{opacity:0;transform:translateY(28px);transition:opacity .6s ease,transform .6s ease}
.fade.vis{opacity:1;transform:none}
.d1{transition-delay:.07s}.d2{transition-delay:.14s}.d3{transition-delay:.21s}
.W{max-width:1160px;margin:0 auto;padding:0 48px}
.S{padding:112px 0}.SD{background:#0e0e0e}.SDB{border-top:1px solid rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.05)}
.TAG{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(242,242,242,.35);margin-bottom:0}
.H2{font-size:clamp(30px,4vw,52px);font-weight:800;letter-spacing:-.035em;line-height:1.06;color:#f2f2f2}
.MT{margin-top:56px}
.G3G{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.G2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.G2L{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
.G2U{display:grid;grid-template-columns:380px 1fr;gap:80px;align-items:center}
.G2C{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start}
.B{background:#8b5cf6;color:#fff;border:none;border-radius:10px;padding:14px 28px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;display:inline-flex;align-items:center;gap:8px;justify-content:center;text-decoration:none}
.B:hover{background:#7c3aed;transform:translateY(-1px)}
.BO{background:transparent;color:#f2f2f2;border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:13px 26px;font-size:15px;font-weight:500;cursor:pointer;font-family:inherit;transition:all .15s;display:inline-flex;align-items:center;gap:8px}
.BO:hover{border-color:rgba(255,255,255,.38);background:rgba(255,255,255,.04)}
.BF{width:100%;justify-content:center}
.INP{background:#151515;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:12px 16px;color:#f2f2f2;font-size:14px;font-family:inherit;outline:none;width:100%;transition:border-color .15s}
.INP:focus{border-color:#8b5cf6}
input[type=range]{width:100%;appearance:none;height:3px;background:#1c1c1c;border-radius:2px;outline:none;cursor:pointer}
input[type=range]::-webkit-slider-thumb{appearance:none;width:18px;height:18px;background:#8b5cf6;border-radius:50%;cursor:pointer;box-shadow:0 0 0 4px rgba(139,92,246,.15)}
.NAV{position:fixed;top:0;left:0;right:0;z-index:150;height:68px;display:flex;align-items:center;transition:all .3s}
.NAV.SC{background:rgba(6,6,6,.96);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.05)}
.LOGO{font-size:20px;font-weight:800;letter-spacing:-.045em;cursor:pointer;flex-shrink:0}
.NL{font-size:13px;font-weight:500;cursor:pointer;color:rgba(242,242,242,.5);white-space:nowrap;padding:4px 0;border-bottom:1.5px solid transparent;transition:all .15s}
.NL:hover{color:#f2f2f2}.NL.ACT{color:#8b5cf6;border-bottom-color:#8b5cf6}
.HAM{display:none;background:none;border:1px solid rgba(255,255,255,.15);border-radius:8px;cursor:pointer;color:#f2f2f2;padding:8px 10px}
.COPT{background:rgba(255,255,255,.03);border:1.5px solid rgba(255,255,255,.08);border-radius:10px;padding:12px 16px;cursor:pointer;font-family:inherit;font-size:14px;color:rgba(242,242,242,.7);display:flex;align-items:center;gap:10px;text-align:left;transition:all .15s;width:100%}
.COPT:hover{border-color:rgba(139,92,246,.4);background:rgba(139,92,246,.05)}
.COPT.SEL{border-color:#8b5cf6;background:rgba(139,92,246,.1);color:#fff}
.LC{background:#0e0e0e;border:1px solid rgba(255,255,255,.06);padding:36px;position:relative;transition:border-color .2s}
.LC:hover{border-color:rgba(255,255,255,.15)}
.LC.FEAT{border-color:rgba(139,92,246,.3);background:linear-gradient(160deg,rgba(139,92,246,.06) 0%,#0e0e0e 60%)}
.PROJ{background:#0e0e0e;border:1px solid rgba(255,255,255,.06);border-radius:14px;overflow:hidden;cursor:pointer;transition:all .2s}
.PROJ:hover{border-color:rgba(255,255,255,.18);transform:translateY(-3px)}
.FAQIT{border-bottom:1px solid rgba(255,255,255,.06)}
.FAQB{width:100%;background:none;border:none;padding:22px 0;display:flex;align-items:center;justify-content:space-between;gap:20px;cursor:pointer;font-family:inherit;font-size:16px;font-weight:600;color:#f2f2f2;text-align:left;transition:color .15s}
.FAQB:hover{color:#8b5cf6}
.SECL{display:flex;align-items:center;gap:16px;margin-bottom:48px}
.SECL::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.06)}
.CHATW{position:fixed;bottom:76px;right:20px;width:320px;max-height:460px;background:#0e0e0e;border:1px solid rgba(255,255,255,.1);border-radius:16px;display:flex;flex-direction:column;z-index:300;box-shadow:0 32px 80px rgba(0,0,0,.6);animation:fadeUp .25s ease}
@media(max-width:1024px){.G2L{grid-template-columns:1fr;gap:48px}.G2U{grid-template-columns:1fr;gap:48px}.G2C{grid-template-columns:1fr;gap:48px}}
@media(max-width:900px){
  .G3G{grid-template-columns:1fr 1fr}.NLS{display:none!important}.NCTA{display:none!important}
  .HAM{display:flex!important;margin-left:auto}.W{padding:0 24px}.S{padding:80px 0}
  .STAT-GRD{grid-template-columns:1fr 1fr!important}
}
@media(max-width:640px){
  .G3G{grid-template-columns:1fr}.G2{grid-template-columns:1fr}
  .HBTNS{flex-direction:column!important;align-items:stretch!important}
  .STAT-GRD{grid-template-columns:1fr 1fr!important}
  .RGO{grid-template-columns:1fr!important}.RADIOG{grid-template-columns:1fr!important}
}
@media(max-width:480px){.W{padding:0 20px}}
`;

function Nav({scrollY,to}){
  const[open,setOpen]=useState(false);
  const active=useActiveSection(["hero","check","leistungen","preise","projekte","kontakt"]);
  const links=[["check","Website-Check"],["leistungen","Leistungen"],["preise","Preise"],["projekte","Projekte"],["kontakt","Kontakt"]];
  return(
    <nav className={`NAV ${scrollY>40?"SC":""}`}>
      <div className="W" style={{display:"flex",alignItems:"center",gap:32,width:"100%"}}>
        <div onClick={()=>to("hero")} className="LOGO">Ohnesorge<span style={{color:P}}>.</span></div>
        <div className="NLS" style={{display:"flex",gap:32,flex:1}}>
          {links.map(([id,l])=><span key={id} onClick={()=>to(id)} className={`NL ${active===id?"ACT":""}`}>{l}</span>)}
        </div>
        <button onClick={()=>to("kontakt")} className="B NCTA" style={{padding:"10px 22px",fontSize:13,borderRadius:8}}>Jetzt anfragen ✦</button>
        <button onClick={()=>setOpen(o=>!o)} className="HAM">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d={open?"M1 1L17 13M17 1L1 13":"M0 1h18M0 7h18M0 13h18"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
      </div>
      {open&&(
        <div style={{position:"fixed",inset:0,top:68,background:"rgba(6,6,6,.98)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:32,zIndex:149}}>
          {links.map(([id,l])=><span key={id} onClick={()=>{to(id);setOpen(false);}} style={{fontSize:26,fontWeight:700,color:T,cursor:"pointer"}}>{l}</span>)}
          <button onClick={()=>{to("kontakt");setOpen(false);}} className="B" style={{padding:"16px 40px",fontSize:17,marginTop:8}}>Jetzt anfragen ✦</button>
        </div>
      )}
    </nav>
  );
}

function Hero({to}){
  const text=useTypewriter(WORDS);
  return(
    <section id="hero" style={{minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden",paddingTop:68}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)",backgroundSize:"64px 64px",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"-20%",right:"-10%",width:800,height:800,background:"radial-gradient(ellipse,rgba(139,92,246,.07) 0%,transparent 65%)",pointerEvents:"none"}}/>
      <div className="W" style={{position:"relative",zIndex:1,paddingTop:40,paddingBottom:80,display:"flex",justifyContent:"space-between",alignItems:"center",gap:40}}>
        <div style={{maxWidth:700,flex:1}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(74,222,128,.06)",border:"1px solid rgba(74,222,128,.2)",borderRadius:6,padding:"7px 14px",fontSize:12,fontWeight:600,color:GR,marginBottom:28,animation:"fadeUp .5s ease both"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:GR,animation:"pulse 2s infinite"}}/>
            Aktuell verfügbar · 2 freie Plätze im Juni
          </div>
          <h1 style={{fontSize:"clamp(42px,6.5vw,82px)",fontWeight:800,letterSpacing:"-.04em",lineHeight:1.03,color:T,marginBottom:24,animation:"fadeUp .5s .1s ease both"}}>
            Ihr Unternehmen braucht<br/><span style={{color:P}}>{text}<span style={{borderRight:"2.5px solid #8b5cf6",marginLeft:1,animation:"blink 1s infinite",display:"inline-block",width:2}}> </span></span>
          </h1>
          <p style={{fontSize:"clamp(16px,1.8vw,19px)",color:TD,lineHeight:1.78,maxWidth:560,marginBottom:40,animation:"fadeUp .5s .2s ease both"}}>
            Professionelle Websites und KI-Automatisierungen für lokale Unternehmen in Dresden. Festpreis. Fertig in 7 Tagen. Kein Agentur-Aufwand.
          </p>
          <div className="HBTNS" style={{display:"flex",gap:14,flexWrap:"wrap",animation:"fadeUp .5s .3s ease both",marginBottom:44}}>
            <button onClick={()=>to("check")} className="B" style={{padding:"16px 32px",fontSize:16}}>Kostenloser Website-Check ✦</button>
            <button onClick={()=>to("kontakt")} className="BO" style={{padding:"15px 28px",fontSize:16}}>Erstgespräch buchen</button>
          </div>
          <div style={{display:"flex",gap:24,flexWrap:"wrap",animation:"fadeUp .5s .4s ease both"}}>
            {["✓ Fertig in 7 Tagen","✓ Festpreis garantiert","✓ Erstgespräch kostenlos"].map(t=>(
              <span key={t} style={{fontSize:14,color:TF,display:"flex",alignItems:"center",gap:6}}><span style={{color:GR}}>{t[0]}</span>{t.slice(1)}</span>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:3,animation:"fadeIn .8s .5s ease both",opacity:0,animationFillMode:"forwards",flexShrink:0}} className="HFC">
          {[["7 Tage","Lieferzeit"],["890 €","Einstiegspreis"],["Festpreis","Garantiert"],["15+","Projekte"]].map(([n,l])=>(
            <div key={l} style={{background:B2,border:`1px solid ${BR}`,borderRadius:10,padding:"14px 20px",minWidth:148}}>
              <div style={{fontSize:20,fontWeight:800,color:T,letterSpacing:"-.03em"}}>{n}</div>
              <div style={{fontSize:11,color:TF,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:900px){.HFC{display:none!important}}`}</style>
    </section>
  );
}

function StatsBar(){
  return(
    <div className="SD" style={{borderTop:"1px solid rgba(255,255,255,.05)",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
      <div className="W STAT-GRD" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
        {MARKET_STATS.map(({num,label},i)=>(
          <div key={i} style={{padding:"40px 32px",position:"relative",borderRight:i<3?"1px solid rgba(255,255,255,.05)":"none"}}>
            <div style={{fontSize:"clamp(26px,3vw,40px)",fontWeight:800,letterSpacing:"-.04em",color:i===3?P:T,lineHeight:1,marginBottom:8}}>{num}</div>
            <div style={{fontSize:13,color:TD,lineHeight:1.5,maxWidth:200}}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProblemSection(){
  const[ref,vis]=useInView();const[after,setAfter]=useState(false);
  return(
    <section className="S"><div className="W" ref={ref}>
      <div className="G2C">
        <div>
          <div className="SECL"><p className="TAG">Das Problem</p></div>
          <h2 className={`H2 fade ${vis?"vis":""}`} style={{marginBottom:20}}>
            Täglich verlieren<br/>Unternehmen Kunden —<br/><span style={{color:P}}>ohne es zu merken.</span>
          </h2>
          <p style={{fontSize:16,color:TD,lineHeight:1.8,marginBottom:28}}>Eine veraltete Website, manuelle Prozesse, keine Sichtbarkeit bei Google — jeder dieser Punkte kostet Sie täglich Aufträge die an Konkurrenten gehen.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {["🔨 Handwerk","🍕 Gastronomie","⚖️ Beratung","💅 Beauty","🏠 Immobilien","🏋️ Fitness"].map(b=>(
              <span key={b} style={{fontSize:12,background:B3,border:`1px solid ${BR2}`,borderRadius:20,padding:"5px 12px",color:TD}}>{b}</span>
            ))}
          </div>
        </div>
        <div className={`fade ${vis?"vis":""} d2`}>
          <div style={{display:"flex",background:B3,borderRadius:"10px 10px 0 0",overflow:"hidden"}}>
            {[false,true].map(isAfter=>(
              <button key={String(isAfter)} onClick={()=>setAfter(isAfter)} style={{flex:1,padding:13,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700,background:after===isAfter?(isAfter?"rgba(74,222,128,.12)":"rgba(248,113,113,.12)"):"transparent",color:after===isAfter?(isAfter?GR:RE):TF,transition:"all .2s",borderBottom:`2px solid ${after===isAfter?(isAfter?GR:RE):"transparent"}`}}>
                {isAfter?"✓ Mit Ohnesorge":"✗ Ohne Ohnesorge"}
              </button>
            ))}
          </div>
          <div style={{background:B3,borderRadius:"0 0 10px 10px",padding:20}}>
            {BA.map(({time,b,bd,a,ad},i)=>(
              <div key={i} style={{display:"flex",gap:12,marginBottom:i<BA.length-1?14:0,alignItems:"flex-start"}}>
                <span style={{fontSize:11,fontFamily:"monospace",color:TF,flexShrink:0,width:40,paddingTop:1}}>{time}</span>
                <span style={{flex:1,fontSize:13,color:TD,lineHeight:1.5}}>{after?a:b}</span>
                <span style={{fontSize:12,fontWeight:700,color:after?GR:RE,flexShrink:0,minWidth:38,textAlign:"right"}}>{after?ad:bd}</span>
              </div>
            ))}
            <div style={{marginTop:16,padding:"10px 14px",borderRadius:8,background:after?"rgba(74,222,128,.08)":"rgba(248,113,113,.08)",border:`1px solid ${after?"rgba(74,222,128,.2)":"rgba(248,113,113,.2)"}`,fontSize:13,fontWeight:700,color:after?GR:RE,textAlign:"center"}}>
              {after?"✓ ~2 Minuten — vollautomatisch":"✗ ~90 Minuten — alles manuell, täglich"}
            </div>
          </div>
          <div style={{textAlign:"right",marginTop:16,fontSize:"clamp(18px,2.5vw,26px)",fontWeight:800,color:P,letterSpacing:"-.03em"}}>→ Das ändert sich.</div>
        </div>
      </div>
    </div></section>
  );
}

function CheckTool(){
  const[step,setStep]=useState(0);const[ans,setAns]=useState({});const[result,setResult]=useState(null);const[loading,setLoading]=useState(false);const[email,setEmail]=useState("");const[sent,setSent]=useState(false);
  const cur=CSTEPS[step];const isMulti=cur?.multi;
  const toggle=opt=>{
    if(!isMulti){const next={...ans,[step]:[opt]};setAns(next);if(step<CSTEPS.length-1)setTimeout(()=>setStep(s=>s+1),280);else setTimeout(()=>run(next),280);}
    else{const cs=ans[step]||[];const already=cs.includes(opt);setAns(prev=>({...prev,[step]:already?cs.filter(x=>x!==opt):[...cs,opt]}));}
  };
  const isSel=opt=>(ans[step]||[]).includes(opt);
  const next=()=>{if(step<CSTEPS.length-1)setStep(s=>s+1);else run(ans);};
  const run=async(a)=>{
    setLoading(true);
    const summary=CSTEPS.map((s,i)=>`${s.q}: ${(a[i]||[]).map(x=>x.l).join(", ")}`).join("\n");
    try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:`Webdesign-Experte.\n${summary}\nNur JSON: {"headline":"direkt max 8 Wörter","summary":"2 konkrete Sätze","problems":["P1","P2","P3"],"quickwins":["Q1","Q2","Q3"],"cta":"1 motivierender Satz"}`})});const data=await res.json();const parsed=JSON.parse((data.reply||"").replace(/```json|```/g,"").trim());setResult({...parsed});}
    catch{setResult({headline:"Klarer Handlungsbedarf erkannt",summary:"Basierend auf Ihren Angaben gibt es konkrete Hebel die sofort wirken. Eine neue Website oder Automation wäre der logische nächste Schritt.",problems:["Website-Performance und Mobile","Zu wenige Online-Anfragen","Manuelle Prozesse kosten täglich Zeit"],quickwins:["Google My Business vollständig ausfüllen","Kontaktformular prominent platzieren","Einmal schauen was automatisierbar ist"],cta:"Lassen Sie uns in 30 Minuten schauen was bei Ihnen am schnellsten wirkt."});}
    finally{setLoading(false);}
  };
  if(loading)return(<div style={{textAlign:"center",padding:"60px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}><div style={{width:40,height:40,border:`3px solid ${PD}`,borderTop:`3px solid ${P}`,borderRadius:"50%",animation:"spin .7s linear infinite"}}/><p style={{fontSize:15,fontWeight:600,color:T}}>Analyse wird erstellt…</p></div>);
  if(result)return(
    <div style={{animation:"fadeUp .4s ease"}}>
      <div style={{background:`linear-gradient(135deg,rgba(139,92,246,.08),rgba(139,92,246,.03))`,border:`1px solid ${PB}`,borderRadius:12,padding:"20px 24px",marginBottom:20}}>
        <div style={{fontSize:10,fontWeight:700,color:P,letterSpacing:".12em",textTransform:"uppercase",marginBottom:8}}>Ihr persönliches Ergebnis</div>
        <h3 style={{fontSize:20,fontWeight:800,color:T,letterSpacing:"-.02em",marginBottom:8}}>{result.headline}</h3>
        <p style={{fontSize:14,color:TD,lineHeight:1.7}}>{result.summary}</p>
      </div>
      <div className="RGO" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div style={{background:"rgba(248,113,113,.06)",border:"1px solid rgba(248,113,113,.18)",borderRadius:10,padding:16}}>
          <div style={{fontSize:10,fontWeight:700,color:RE,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Wo Kunden verloren gehen</div>
          {result.problems?.map((p,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7,fontSize:13,color:TD}}><span style={{color:RE,flexShrink:0}}>✗</span>{p}</div>)}
        </div>
        <div style={{background:"rgba(74,222,128,.06)",border:"1px solid rgba(74,222,128,.18)",borderRadius:10,padding:16}}>
          <div style={{fontSize:10,fontWeight:700,color:GR,textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Was sofort wirkt</div>
          {result.quickwins?.map((q,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7,fontSize:13,color:TD}}><span style={{color:GR,flexShrink:0}}>✓</span>{q}</div>)}
        </div>
      </div>
      <div style={{fontSize:14,color:TD,fontStyle:"italic",marginBottom:18,padding:"12px 16px",borderLeft:`2px solid ${P}`}}>„{result.cta}"</div>
      {!sent?(
        <div>
          <div style={{fontSize:13,fontWeight:600,color:T,marginBottom:8}}>Ergebnis sichern + kostenloses Gespräch:</div>
          <div style={{display:"flex",gap:8,marginBottom:10}}><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="ihre@email.de" className="INP" style={{flex:1}}/><button onClick={()=>{if(email.includes("@"))setSent(true);}} className="B" style={{padding:"10px 18px",fontSize:13,borderRadius:8,whiteSpace:"nowrap"}}>Senden</button></div>
          <div style={{textAlign:"center",fontSize:12,color:TF,margin:"8px 0"}}>— oder direkt —</div>
          <a href="https://wa.me/49IHRE_NUMMER?text=Hallo%2C%20ich%20habe%20den%20Website-Check%20gemacht." target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"#25d366",color:"#fff",borderRadius:8,padding:11,fontSize:14,fontWeight:700,textDecoration:"none"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Direkt via WhatsApp antworten
          </a>
          <button onClick={()=>{setStep(0);setAns({});setResult(null);setSent(false);}} style={{background:"none",border:"none",color:TF,fontSize:12,cursor:"pointer",marginTop:12,fontFamily:"inherit",display:"block",width:"100%",textAlign:"center"}}>↩ Neue Analyse</button>
        </div>
      ):(
        <div style={{textAlign:"center",padding:20,background:"rgba(74,222,128,.07)",borderRadius:10,border:"1px solid rgba(74,222,128,.2)"}}>
          <div style={{fontSize:28,marginBottom:8}}>✓</div>
          <div style={{fontWeight:700,color:GR}}>Ich melde mich innerhalb von 24h!</div>
        </div>
      )}
    </div>
  );
  return(
    <div>
      <div style={{display:"flex",gap:6,marginBottom:24}}>
        {CSTEPS.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:99,background:i<step?P:i===step?"rgba(139,92,246,.4)":"rgba(255,255,255,.08)",transition:"background .3s"}}/>)}
      </div>
      <div style={{fontSize:10,fontWeight:700,color:P,letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>Schritt {step+1} von {CSTEPS.length}{isMulti&&" · Mehrfachauswahl"}</div>
      <h3 style={{fontSize:18,fontWeight:800,color:T,marginBottom:20,letterSpacing:"-.02em",lineHeight:1.3}}>{cur.q}</h3>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {cur.opts.map((opt,i)=>(
          <button key={i} onClick={()=>toggle(opt)} className={`COPT ${isSel(opt)?"SEL":""}`}>
            <span style={{fontSize:18,flexShrink:0}}>{opt.i}</span><span style={{flex:1}}>{opt.l}</span>{isSel(opt)&&<span style={{color:P,fontWeight:700}}>✓</span>}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:10,marginTop:16}}>
        {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{background:"none",border:"none",color:TF,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>← Zurück</button>}
        {isMulti&&(ans[step]||[]).length>0&&(
          <button onClick={next} className="B" style={{marginLeft:"auto",padding:"11px 24px",fontSize:14,borderRadius:8}}>
            {step<CSTEPS.length-1?"Weiter →":"Analyse starten →"}
          </button>
        )}
      </div>
    </div>
  );
}

function Leistungen({to}){
  const[ref,vis]=useInView();const pakete=lsGet("pakete",DEF_PAKETE);
  return(
    <section id="leistungen" className="S SD SDB"><div className="W" ref={ref}>
      <div className="SECL"><p className="TAG">Leistungen</p></div>
      <h2 className={`H2 fade ${vis?"vis":""}`} style={{marginBottom:14}}>Was ich für Sie tue.</h2>
      <p style={{fontSize:17,color:TD,marginBottom:56,maxWidth:520}}>Zwei Kernleistungen. Jede kann Ihr Business allein verändern — zusammen sind sie unschlagbar.</p>
      <div className="G3G" style={{marginBottom:40}}>
        {LEISTUNGEN.map(({icon,name,tag,desc,highlights},i)=>(
          <div key={i} className={`LC fade ${vis?"vis":""} d${i+1}`}>
            <div style={{fontSize:28,marginBottom:20}}>{icon}</div>
            <div style={{fontSize:11,fontWeight:600,color:P,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>{tag}</div>
            <h3 style={{fontSize:20,fontWeight:700,color:T,letterSpacing:"-.02em",marginBottom:12}}>{name}</h3>
            <p style={{fontSize:14,color:TD,lineHeight:1.75,marginBottom:20}}>{desc}</p>
            <div style={{borderTop:`1px solid ${BR}`,paddingTop:16,display:"flex",flexDirection:"column",gap:8}}>
              {highlights.map(h=><div key={h} style={{fontSize:13,color:TD,display:"flex",gap:8}}><span style={{color:GR,flexShrink:0}}>✓</span>{h}</div>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{background:B3,border:`1px solid ${BR}`,borderRadius:2,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)"}} className="ZIELG">
          {ZIELGRUPPEN.map(({icon,title,desc,examples},i)=>(
            <div key={i} style={{padding:"28px 32px",borderRight:i<2?`1px solid ${BR}`:"none"}}>
              <div style={{fontSize:24,marginBottom:12}}>{icon}</div>
              <h4 style={{fontSize:16,fontWeight:700,color:T,marginBottom:8}}>{title}</h4>
              <p style={{fontSize:13,color:TD,lineHeight:1.65,marginBottom:10}}>{desc}</p>
              <div style={{fontSize:12,color:TF}}>{examples}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:640px){.ZIELG{grid-template-columns:1fr!important}}`}</style>
    </div></section>
  );
}

function Preise({to}){
  const[ref,vis]=useInView();const pakete=lsGet("pakete",DEF_PAKETE);
  return(
    <section id="preise" className="S"><div className="W" ref={ref}>
      <div className="SECL"><p className="TAG">Preise</p></div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:20,marginBottom:40}}>
        <h2 className="H2">Was Sie investieren.</h2>
        <div style={{display:"flex",gap:0,background:B3,border:`1px solid ${BR}`,borderRadius:10,overflow:"hidden",flexShrink:0}}>
          <div style={{padding:"12px 20px",borderRight:`1px solid ${BR}`,textAlign:"center"}}>
            <div style={{fontSize:11,color:TF,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Typische Agentur</div>
            <div style={{fontSize:15,fontWeight:800,color:RE}}>6.000–20.000 €</div>
            <div style={{fontSize:11,color:TF,marginTop:2}}>3–6 Monate Wartezeit</div>
          </div>
          <div style={{padding:"12px 20px",background:PD,textAlign:"center"}}>
            <div style={{fontSize:11,color:P,textTransform:"uppercase",letterSpacing:".08em",marginBottom:3}}>Ohnesorge</div>
            <div style={{fontSize:15,fontWeight:800,color:GR}}>Ab 890 €</div>
            <div style={{fontSize:11,color:TF,marginTop:2}}>Fertig in 7 Tagen</div>
          </div>
        </div>
      </div>
      <div className="G3G" style={{alignItems:"start"}}>
        {pakete.map(({id,name,price,priceNote,for:f,feats,featured},i)=>(
          <div key={id||i} className={`LC fade ${vis?"vis":""} d${i+1} ${featured?"FEAT":""}`}>
            {featured&&<div style={{position:"absolute",top:0,left:"50%",transform:"translate(-50%,-50%)",background:P,color:"#fff",fontSize:11,fontWeight:700,padding:"4px 16px",borderRadius:20,whiteSpace:"nowrap",letterSpacing:".04em"}}>Beliebteste Wahl</div>}
            <div style={{fontSize:12,fontWeight:600,color:TF,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>{name}</div>
            <div style={{fontSize:42,fontWeight:800,color:T,letterSpacing:"-.04em",lineHeight:1,marginBottom:4}}>{price}</div>
            <div style={{fontSize:12,color:TF,marginBottom:6}}>{priceNote||"Einmalig, kein Abo"}</div>
            <div style={{fontSize:13,color:TD,marginBottom:20,paddingBottom:20,borderBottom:`1px solid ${BR}`}}>{f}</div>
            <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {feats.map(feat=><li key={feat} style={{fontSize:13,color:TD,display:"flex",gap:9,alignItems:"flex-start"}}><span style={{color:GR,flexShrink:0,marginTop:1}}>✓</span>{feat}</li>)}
            </ul>
            <button onClick={()=>to("kontakt")} className={`${featured?"B":"BO"} BF`}>Jetzt anfragen</button>
          </div>
        ))}
      </div>
      <p style={{textAlign:"center",fontSize:12,color:TF,marginTop:20}}>Alle Preise zzgl. MwSt. · Einmalig · Kein Abo · Kein laufender Vertrag</p>
    </div></section>
  );
}

function Prozess(){
  const[ref,vis]=useInView();
  const steps=[
    {n:"Tag 1",t:"Erstgespräch",d:"30 Min. kostenlos. Wir klären konkret was Sie brauchen — ich gebe eine erste ehrliche Einschätzung. Kein Kaufdruck."},
    {n:"Tag 2",t:"Angebot",d:"Am nächsten Werktag: schriftliches Festpreis-Angebot. Transparent, vollständig, ohne versteckte Posten."},
    {n:"Tag 3–6",t:"Umsetzung",d:"Sie sehen täglich den Fortschritt. Feedback fließt sofort ein. Sie kümmern sich um nichts."},
    {n:"Tag 7",t:"Launch & Übergabe",d:"Ihre Website ist live. Sie erhalten alle Zugänge, eine Anleitung und 3 Monate Support inklusive."},
  ];
  return(
    <section className="S SD SDB"><div className="W" ref={ref}>
      <div className="SECL"><p className="TAG">Ablauf</p></div>
      <h2 className="H2" style={{marginBottom:56}}>Von der Anfrage zur fertigen Website — in einer Woche.</h2>
      <div style={{position:"relative"}}>
        <div style={{position:"absolute",left:27,top:0,bottom:0,width:1,background:`linear-gradient(to bottom,${P},rgba(139,92,246,.08))`}}/>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {steps.map(({n,t,d},i)=>(
            <div key={i} className={`fade ${vis?"vis":""} d${i+1}`} style={{display:"flex",gap:24,paddingBottom:i<steps.length-1?44:0}}>
              <div style={{width:54,height:54,borderRadius:"50%",background:B3,border:`2px solid ${PB}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative",zIndex:1}}>
                <span style={{fontSize:9,fontWeight:700,color:P,letterSpacing:".04em",textTransform:"uppercase"}}>{n.split(" ")[0]}</span>
                <span style={{fontSize:11,fontWeight:800,color:P}}>{n.split(" ")[1]}</span>
              </div>
              <div style={{paddingTop:12}}>
                <h3 style={{fontSize:17,fontWeight:700,color:T,marginBottom:6}}>{t}</h3>
                <p style={{fontSize:14,color:TD,lineHeight:1.7,maxWidth:480}}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div></section>
  );
}

function FAQ(){
  const[open,setOpen]=useState(null);
  return(
    <section className="S"><div style={{maxWidth:760,margin:"0 auto",padding:"0 48px"}}>
      <div className="SECL"><p className="TAG">Häufige Fragen</p></div>
      <h2 className="H2" style={{marginBottom:40}}>Alles klar?</h2>
      {FAQS.map(([q,a],i)=>(
        <div key={i} className="FAQIT">
          <button onClick={()=>setOpen(open===i?null:i)} className="FAQB">
            {q}<span style={{color:TF,fontSize:22,transform:open===i?"rotate(45deg)":"none",transition:"transform .2s",flexShrink:0,lineHeight:1}}>+</span>
          </button>
          {open===i&&<p style={{fontSize:14,color:TD,lineHeight:1.78,paddingBottom:20,animation:"fadeUp .2s ease"}}>{a}</p>}
        </div>
      ))}
    </div></section>
  );
}

function ProjektGalerie(){
  const[open,setOpen]=useState(null);const[ref,vis]=useInView();
  return(
    <section id="projekte" className="S SD SDB"><div className="W" ref={ref}>
      <div className="SECL"><p className="TAG">Referenzen</p></div>
      <h2 className="H2" style={{marginBottom:10}}>Projekte aus Dresden.</h2>
      <p style={{fontSize:16,color:TD,marginBottom:48}}>Echte Kunden. Messbare Ergebnisse. Alle in unter einer Woche geliefert.</p>
      <div className="G3G">
        {PROJEKTE.map((p,i)=>(
          <div key={i} onClick={()=>setOpen(p)} className={`PROJ fade ${vis?"vis":""} d${i+1}`}>
            <div style={{height:170,background:`linear-gradient(135deg,${p.c1},${p.c2}28)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,position:"relative"}}>
              <div style={{position:"absolute",top:12,right:12,background:"rgba(74,222,128,.12)",border:"1px solid rgba(74,222,128,.25)",borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700,color:GR}}>Live ✓</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>{p.cat}</div>
              <div style={{fontSize:19,fontWeight:800,color:"#fff"}}>{p.name}</div>
              <div style={{fontSize:11,color:p.c2,background:`${p.c2}18`,border:`1px solid ${p.c2}35`,borderRadius:20,padding:"3px 10px"}}>{p.tag}</div>
            </div>
            <div style={{padding:"20px 22px"}}>
              <p style={{fontSize:13,color:TD,lineHeight:1.65,marginBottom:10}}>{p.desc}</p>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>{p.tech.map(t=><span key={t} style={{fontSize:11,background:B3,border:`1px solid ${BR}`,borderRadius:4,padding:"2px 8px",color:TF}}>{t}</span>)}</div>
              <div style={{fontSize:12,color:P,fontWeight:600}}>→ {p.result}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {open&&(
      <div onClick={()=>setOpen(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",backdropFilter:"blur(10px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div onClick={e=>e.stopPropagation()} style={{background:B2,border:`1px solid ${BR2}`,borderRadius:16,maxWidth:500,width:"100%",overflow:"hidden",animation:"fadeUp .25s ease"}}>
          <div style={{height:180,background:`linear-gradient(135deg,${open.c1},${open.c2}33)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
            <button onClick={()=>setOpen(null)} style={{position:"absolute",top:14,right:14,background:"rgba(255,255,255,.1)",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",color:T,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            <div style={{textAlign:"center"}}><div style={{fontSize:13,color:"rgba(255,255,255,.4)"}}>{open.cat}</div><div style={{fontSize:22,fontWeight:800,color:"#fff"}}>{open.name}</div></div>
          </div>
          <div style={{padding:28}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
              {[["Lieferzeit",`${open.days} Tage`],["Status","Live ✓"],["Ergebnis",open.result]].map(([l,v])=>(
                <div key={l} style={{background:B3,borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:10,color:TF,textTransform:"uppercase",marginBottom:3}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:T}}>{v}</div></div>
              ))}
            </div>
            <p style={{fontSize:14,color:TD,lineHeight:1.7}}>{open.desc}</p>
          </div>
        </div>
      </div>
    )}
    </section>
  );
}

function UeberMich({to}){
  const[ref,vis]=useInView();
  return(
    <section className="S"><div className="W" ref={ref}>
      <div className={`G2U fade ${vis?"vis":""}`}>
        <div style={{display:"flex",justifyContent:"center"}}>
          <div style={{background:B2,border:`1px solid ${BR}`,borderRadius:20,aspectRatio:"1",maxWidth:360,width:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,position:"relative"}}>
            <div style={{width:88,height:88,borderRadius:"50%",background:PD,border:`1.5px solid ${PB}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,fontWeight:800,color:P}}>AO</div>
            <div style={{fontSize:13,color:TF,fontFamily:"monospace"}}>Foto folgt</div>
            <div style={{position:"absolute",bottom:-14,right:-14,background:B2,border:`1px solid ${BR2}`,borderRadius:10,padding:"8px 14px",display:"flex",alignItems:"center",gap:8,fontSize:13,fontWeight:600}}>📍 Dresden</div>
          </div>
        </div>
        <div>
          <div className="SECL"><p className="TAG">Über mich</p></div>
          <h2 className="H2" style={{marginBottom:20}}>Ich bin Alexandros Ohnesorge.</h2>
          <p style={{fontSize:16,color:TD,lineHeight:1.85,marginBottom:16}}>Ich mache Websites und KI-Automatisierungen für lokale Unternehmen in Dresden und Sachsen — schnell, direkt, zum Festpreis.</p>
          <p style={{fontSize:16,color:TD,lineHeight:1.85,marginBottom:28}}>Kein Agentur-Betrieb mit Projektmanagern und Wartelisten. Eine Person, die Ihr Projekt von Anfang bis Ende selbst umsetzt.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:32}}>
            {[["⚡","Webdesign mit Lovable"],["🤖","Automation mit Make & Zapier"],["🎓","KI-Schulungen → Ohnesorge.KI"]].map(([ic,l])=>(
              <div key={l} style={{background:B3,border:`1px solid ${BR}`,borderRadius:8,padding:"9px 14px",fontSize:13,color:TD,display:"flex",gap:8}}><span>{ic}</span>{l}</div>
            ))}
          </div>
          <button onClick={()=>to("kontakt")} className="B" style={{padding:"13px 28px",fontSize:15}}>Direkt Kontakt aufnehmen</button>
        </div>
      </div>
    </div></section>
  );
}

function Kontakt(){
  const[form,setForm]=useState({name:"",email:"",firma:"",service:"",msg:""});const[sent,setSent]=useState(false);const[sending,setSending]=useState(false);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=async()=>{if(!form.name||!form.email||!form.msg)return;setSending(true);await new Promise(r=>setTimeout(r,800));setSent(true);setSending(false);};
  return(
    <section id="kontakt" className="S SD SDB"><div className="W">
      <div className="G2L">
        <div>
          <div className="SECL"><p className="TAG">Kontakt</p></div>
          <h2 className="H2" style={{marginBottom:16}}>Schreiben Sie mir direkt.</h2>
          <p style={{fontSize:16,color:TD,lineHeight:1.8,marginBottom:32,maxWidth:360}}>Kein Formular-Dschungel. Kein Chatbot. Ich antworte persönlich — innerhalb von 24 Stunden.</p>
          <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:28}}>
            {[["📧","alex.ohnesorge@icloud.com"],["📍","Dresden, Sachsen"],["⏱","Antwort innerhalb von 24h"]].map(([ic,tx])=>(
              <div key={tx} style={{display:"flex",alignItems:"center",gap:14,fontSize:15,color:TD}}><span style={{fontSize:20,width:32}}>{ic}</span>{tx}</div>
            ))}
          </div>
          <a href="https://wa.me/49IHRE_NUMMER" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:10,background:"#25d366",color:"#fff",borderRadius:10,padding:"13px 24px",fontSize:15,fontWeight:700,textDecoration:"none"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp schreiben
          </a>
        </div>
        <div style={{background:B3,border:`1px solid ${BR}`,borderRadius:16,padding:36}}>
          {sent?(
            <div style={{textAlign:"center",padding:"48px 0"}}>
              <div style={{fontSize:52,marginBottom:14}}>✓</div>
              <h3 style={{fontSize:22,fontWeight:800,color:GR,marginBottom:8}}>Nachricht erhalten!</h3>
              <p style={{fontSize:15,color:TD}}>Ich melde mich persönlich innerhalb von 24h.</p>
            </div>
          ):(
            <>
              <div className="G2" style={{marginBottom:14}}>
                <div><label style={{fontSize:12,fontWeight:600,color:TD,display:"block",marginBottom:7}}>Name *</label><input className="INP" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Max Mustermann"/></div>
                <div><label style={{fontSize:12,fontWeight:600,color:TD,display:"block",marginBottom:7}}>E-Mail *</label><input className="INP" type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="max@firma.de"/></div>
              </div>
              <div style={{marginBottom:14}}><label style={{fontSize:12,fontWeight:600,color:TD,display:"block",marginBottom:7}}>Unternehmen</label><input className="INP" value={form.firma} onChange={e=>set("firma",e.target.value)} placeholder="Optional"/></div>
              <div style={{marginBottom:14}}>
                <label style={{fontSize:12,fontWeight:600,color:TD,display:"block",marginBottom:7}}>Was brauchen Sie?</label>
                <div className="RADIOG" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {["Website","Automation","Beides","Unklar"].map(s=>(
                    <label key={s} style={{display:"flex",alignItems:"center",gap:8,background:form.service===s?PD:B2,border:`1px solid ${form.service===s?PB:BR}`,borderRadius:8,padding:"10px 12px",cursor:"pointer",fontSize:13,color:form.service===s?P:TD,transition:"all .15s"}}>
                      <input type="radio" name="svc" value={s} checked={form.service===s} onChange={()=>set("service",s)} style={{accentColor:P}}/>{s}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:22}}><label style={{fontSize:12,fontWeight:600,color:TD,display:"block",marginBottom:7}}>Nachricht *</label><textarea className="INP" style={{resize:"vertical",minHeight:90}} value={form.msg} onChange={e=>set("msg",e.target.value)} placeholder="Was ist Ihre aktuelle Situation?"/></div>
              <button onClick={submit} disabled={sending||!form.name||!form.email||!form.msg} className="B BF" style={{fontSize:15,opacity:(!form.name||!form.email||!form.msg)?.5:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {sending?<><div style={{width:18,height:18,border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Wird gesendet…</>:"Anfrage senden →"}
              </button>
              <p style={{textAlign:"center",fontSize:12,color:TF,marginTop:10}}>🔒 Vertraulich · Keine Weitergabe · Antwort in 24h</p>
            </>
          )}
        </div>
      </div>
    </div></section>
  );
}

function ChatWidget(){
  const[open,setOpen]=useState(false);const[msgs,setMsgs]=useState([{role:"assistant",text:"Hallo! Fragen zu Webdesign, Preisen oder Automation? Ich helfe direkt weiter."}]);const[input,setInput]=useState("");const[loading,setLoading]=useState(false);const bottom=useRef(null);
  useEffect(()=>{bottom.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=async()=>{const q=input.trim();if(!q||loading)return;setInput("");setMsgs(p=>[...p,{role:"user",text:q}]);setLoading(true);try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q})});const data=await res.json();setMsgs(p=>[...p,{role:"assistant",text:data.reply||"Fehler."}]);}catch{setMsgs(p=>[...p,{role:"assistant",text:"Gerade nicht erreichbar — schreib direkt auf WhatsApp!"}]);}finally{setLoading(false);}};
  return(
    <>
      {open&&(
        <div className="CHATW">
          <div style={{background:B3,borderRadius:"16px 16px 0 0",padding:"14px 16px",borderBottom:`1px solid ${BR}`,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:PD,border:`1px solid ${PB}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🤖</div>
            <div><div style={{fontSize:13,fontWeight:700,color:T}}>Ohnesorge Assistant</div><div style={{fontSize:11,color:GR,display:"flex",alignItems:"center",gap:4}}><div style={{width:5,height:5,borderRadius:"50%",background:GR}}/>Online</div></div>
            <button onClick={()=>setOpen(false)} style={{marginLeft:"auto",background:"none",border:"none",color:TD,cursor:"pointer",fontSize:18}}>✕</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:14}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:10}}>
                <div style={{maxWidth:"85%",padding:"9px 13px",borderRadius:m.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px",background:m.role==="user"?P:B3,color:m.role==="user"?"#fff":"rgba(242,242,242,.85)",fontSize:13,lineHeight:1.55}}>{m.text}</div>
              </div>
            ))}
            {loading&&<div style={{display:"flex",gap:4,padding:"10px 14px",background:B3,borderRadius:"12px 12px 12px 2px",width:"fit-content"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:TD,animation:`bounce .8s ${i*.15}s infinite`}}/>)}</div>}
            <div ref={bottom}/>
          </div>
          <div style={{padding:10,borderTop:`1px solid ${BR}`,display:"flex",gap:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Frage stellen…" className="INP" style={{flex:1,fontSize:13}}/>
            <button onClick={send} disabled={!input.trim()||loading} className="B" style={{padding:"9px 14px",opacity:input.trim()&&!loading?1:.4,borderRadius:8}}>→</button>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} style={{position:"fixed",bottom:20,right:20,width:52,height:52,borderRadius:"50%",background:open?B3:P,border:open?`1px solid ${BR}`:"none",color:open?"#f2f2f2":"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 24px rgba(139,92,246,.4)",zIndex:300,transition:"all .2s"}}>
        {open?"✕":"🤖"}
      </button>
    </>
  );
}

function CookieBanner(){
  const[vis,setVis]=useState(false);
  useEffect(()=>{try{if(!localStorage.getItem("os_cookie"))setVis(true);}catch{setVis(true);}},[]); 
  const accept=all=>{try{localStorage.setItem("os_cookie",all?"all":"essential");}catch{}setVis(false);};
  if(!vis)return null;
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:400,background:"rgba(6,6,6,.97)",backdropFilter:"blur(12px)",borderTop:`1px solid ${BR}`,padding:"16px 48px",animation:"fadeUp .4s ease"}}>
      <div style={{maxWidth:1160,margin:"0 auto",display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",justifyContent:"space-between"}}>
        <p style={{fontSize:14,color:TD,lineHeight:1.6,flex:1,minWidth:240}}>🍪 Technisch notwendige Cookies. Mit „Alle akzeptieren" stimmen Sie Analyse-Cookies zu.</p>
        <div style={{display:"flex",gap:10,flexShrink:0}}>
          <button onClick={()=>accept(false)} className="BO" style={{padding:"9px 16px",fontSize:13}}>Nur notwendige</button>
          <button onClick={()=>accept(true)} className="B" style={{padding:"9px 18px",fontSize:13,borderRadius:8}}>Alle akzeptieren</button>
        </div>
      </div>
    </div>
  );
}

function LegalModal({id,onClose}){
  const c=LEGAL[id];if(!c)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",backdropFilter:"blur(8px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:B2,border:`1px solid ${BR2}`,borderRadius:20,maxWidth:680,width:"100%",maxHeight:"85vh",display:"flex",flexDirection:"column",animation:"fadeUp .3s ease"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",borderBottom:`1px solid ${BR}`}}><h2 style={{fontSize:18,fontWeight:800,color:T}}>{c.title}</h2><button onClick={onClose} style={{background:B3,border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",color:TD,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>
        <div style={{overflowY:"auto",padding:24}}><pre style={{fontFamily:"inherit",fontSize:14,lineHeight:1.78,color:TD,whiteSpace:"pre-wrap"}}>{c.body}</pre></div>
      </div>
    </div>
  );
}

function Footer({setLegal,to}){
  return(
    <footer style={{background:"#040404",borderTop:`1px solid rgba(255,255,255,.05)`,padding:"52px 0 28px"}}>
      <div className="W">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:40,flexWrap:"wrap",gap:28}}>
          <div>
            <div style={{fontSize:21,fontWeight:800,letterSpacing:"-.04em",marginBottom:6}}>Ohnesorge<span style={{color:P}}>.</span></div>
            <div style={{fontSize:13,color:TF}}>Webdesign & KI-Automatisierung · Dresden</div>
          </div>
          <div style={{display:"flex",gap:48,flexWrap:"wrap"}}>
            <div><div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".1em",color:TF,marginBottom:14}}>Leistungen</div>{["Webdesign","KI-Automatisierung","Preise","Projekte"].map(l=><div key={l} onClick={()=>to(l.toLowerCase())} style={{fontSize:14,color:TD,marginBottom:10,cursor:"pointer",transition:"color .15s"}} onMouseOver={e=>e.currentTarget.style.color=P} onMouseOut={e=>e.currentTarget.style.color=TD}>{l}</div>)}</div>
            <div><div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".1em",color:TF,marginBottom:14}}>Rechtliches</div>{[["impressum","Impressum"],["datenschutz","Datenschutz"],["agb","AGB"]].map(([id,l])=><div key={id} onClick={()=>setLegal(id)} style={{fontSize:14,color:TD,marginBottom:10,cursor:"pointer",transition:"color .15s"}} onMouseOver={e=>e.currentTarget.style.color=P} onMouseOut={e=>e.currentTarget.style.color=TD}>{l}</div>)}</div>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,paddingTop:24,borderTop:"1px solid rgba(255,255,255,.04)",fontSize:12,color:TF}}>
          <span>© 2026 Alexandros Ohnesorge · Dresden · Alle Rechte vorbehalten</span><span>Made in Dresden ♥</span>
        </div>
      </div>
    </footer>
  );
}

export default function App(){
  const[scrollY,setScrollY]=useState(0);const[legal,setLegal]=useState(null);
  useEffect(()=>{const fn=()=>setScrollY(window.scrollY);window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn);},[]);
  const to=id=>{const el=document.getElementById(id);if(!el){window.scrollTo({top:0,behavior:"smooth"});return;}window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-80,behavior:"smooth"});};
  return(
    <>
      <style>{CSS}</style>
      <Nav scrollY={scrollY} to={to}/>
      <Hero to={to}/>
      <StatsBar/>
      <ProblemSection/>
      <section id="check" className="S SD SDB"><div className="W">
        <div className="G2C">
          <div>
            <div className="SECL"><p className="TAG">Kostenlose Analyse</p></div>
            <h2 className="H2" style={{marginBottom:16}}>Finden Sie heraus wo Ihre Website Kunden verliert.</h2>
            <p style={{fontSize:16,color:TD,lineHeight:1.8,marginBottom:32}}>3 kurze Fragen — ich erstelle sofort eine persönliche Empfehlung. Powered by Claude AI.</p>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[["⏱","Ergebnis in unter 60 Sekunden"],["🎯","Auf Ihre Situation zugeschnitten"],["📊","Konkrete Probleme + sofort umsetzbare Maßnahmen"],["💬","Gratis-Gespräch wenn Sie mehr wollen"]].map(([ic,tx])=>(
                <div key={tx} style={{display:"flex",gap:14,alignItems:"center"}}>
                  <div style={{width:36,height:36,borderRadius:9,background:PD,border:`1px solid ${PB}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{ic}</div>
                  <span style={{fontSize:14,color:TD}}>{tx}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:B3,border:`1px solid ${BR2}`,borderRadius:16,padding:36}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:28,paddingBottom:20,borderBottom:`1px solid ${BR}`}}>
              <div style={{width:36,height:36,borderRadius:9,background:PD,border:`1px solid ${PB}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✦</div>
              <div><div style={{fontSize:13,fontWeight:700,color:T}}>Website-Analyse</div><div style={{fontSize:11,color:TF}}>Powered by Claude AI</div></div>
            </div>
            <CheckTool/>
          </div>
        </div>
      </div></section>
      <Leistungen to={to}/>
      <Preise to={to}/>
      <Prozess/>
      <FAQ/>
      <ProjektGalerie/>
      <UeberMich to={to}/>
      <section style={{background:"linear-gradient(180deg,#0e0e0e 0%,#060606 100%)",borderTop:`1px solid ${PB}`,padding:"112px 0",textAlign:"center"}}>
        <div className="W" style={{maxWidth:620}}>
          <p style={{fontSize:11,fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:TF,marginBottom:16}}>Nächster Schritt</p>
          <h2 className="H2" style={{marginBottom:16}}>Bereit für den Unterschied?</h2>
          <p style={{fontSize:17,color:TD,lineHeight:1.8,marginBottom:44}}>Erstgespräch kostenlos. Website-Check kostenlos. Kein Kaufdruck.</p>
          <div className="HBTNS" style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>to("check")} className="B" style={{padding:"16px 32px",fontSize:16}}>Website-Check starten ✦</button>
            <button onClick={()=>to("kontakt")} className="BO" style={{padding:"15px 28px",fontSize:16}}>Erstgespräch buchen</button>
          </div>
        </div>
      </section>
      <Kontakt/>
      <Footer setLegal={setLegal} to={to}/>
      {legal&&<LegalModal id={legal} onClose={()=>setLegal(null)}/>}
      <CookieBanner/>
      <ChatWidget/>
      {scrollY>500&&<button onClick={()=>to("hero")} style={{position:"fixed",bottom:76,left:20,width:40,height:40,borderRadius:"50%",background:B3,border:`1px solid ${BR}`,color:T,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,fontSize:14,transition:"transform .2s"}} onMouseOver={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseOut={e=>e.currentTarget.style.transform=""}>↑</button>}
    </>
  );
}
