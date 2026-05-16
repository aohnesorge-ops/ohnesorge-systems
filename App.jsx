import { useState, useEffect, useRef } from "react";

const P="#8b5cf6",PD="rgba(139,92,246,.12)",PB="rgba(139,92,246,.3)";
const BG="#070707",B2="#0f0f0f",B3="#161616",BR="rgba(255,255,255,.07)";
const T="#f0f0f0",TD="rgba(240,240,240,.5)",TF="rgba(240,240,240,.25)";
const GR="#4ade80",RE="#f87171";
const BANNER_H=36;

const DEF_PAKETE=[
  {id:"starter",name:"Starter",price:"890 €",for:"Handwerker, Gastronomen, lokale Dienstleister",featured:false,feats:["5-seitige Website","Design nach Ihren Wünschen","Mobile-optimiert & schnell","Kontaktformular & Google Maps","Impressum & Datenschutz","3 Monate Support"]},
  {id:"professional",name:"Professional",price:"1.490 €",for:"Unternehmen die online wachsen wollen",featured:true,feats:["Alles aus Starter","Bis 10 Seiten","SEO-Optimierung","Blog / News-Bereich","Google Analytics","1 KI-Automation inklusive","6 Monate Support"]},
  {id:"automation",name:"Automation Only",price:"490 €",for:"Wer schon eine Website hat",featured:false,feats:["1 vollständiger Workflow","E-Mail / WhatsApp / CRM","Einrichtung & Einweisung","30 Tage Nachbetreuung"]},
];

function lsGet(k,d){try{const v=localStorage.getItem("os_content_"+k);return v?JSON.parse(v):d;}catch{return d;}}

const WORDS=["Websites erstellen","Kunden gewinnen","Prozesse automatisieren","online wachsen","Zeit sparen"];
const STATS=[{val:7,suf:" Tage",lab:"Ø Lieferzeit Website"},{val:100,suf:"%",lab:"Festpreis — kein Nachschlag"},{val:15,suf:"+",lab:"Projekte abgeschlossen"},{val:4.9,suf:"★",lab:"Kundenbewertung",fl:true}];
const CSTEPS=[
  {q:"Wie alt ist Ihre aktuelle Website?",opts:[{i:"🆕",l:"Noch keine Website",s:0},{i:"📅",l:"Unter 2 Jahre",s:25},{i:"🗓",l:"2–5 Jahre",s:12},{i:"💀",l:"Älter als 5 Jahre",s:0}]},
  {q:"Wie sieht Ihre Website auf dem Handy aus?",opts:[{i:"📱",l:"Perfekt optimiert",s:25},{i:"🤏",l:"Etwas unübersichtlich",s:10},{i:"🔍",l:"Man muss zoomen",s:0},{i:"❓",l:"Weiß ich nicht",s:5}]},
  {q:"Kommen Anfragen über Ihre Website?",opts:[{i:"📬",l:"Ja — mehrmals/Woche",s:25},{i:"📩",l:"Ab und zu",s:10},{i:"🦗",l:"Kaum oder gar nicht",s:0},{i:"🚫",l:"Kein Formular",s:0}]},
  {q:"Wie schnell lädt Ihre Website?",opts:[{i:"⚡",l:"Unter 2 Sekunden",s:25},{i:"🐢",l:"3–5 Sekunden",s:10},{i:"⏳",l:"Spürbar langsam",s:0},{i:"❓",l:"Keine Ahnung",s:5}]},
  {q:"Findet man Sie bei Google für Ihre Region?",opts:[{i:"🏆",l:"Ja — Seite 1",s:25},{i:"📄",l:"Seite 2 oder 3",s:10},{i:"👻",l:"Kaum sichtbar",s:0},{i:"❓",l:"Noch nie gesucht",s:5}]},
];
const ASTEPS=[{icon:"📨",label:"Anfrage eingeht",desc:"Formular, E-Mail oder WhatsApp"},{icon:"⚡",label:"Webhook ausgelöst",desc:"Make/Zapier verarbeitet sofort"},{icon:"📋",label:"CRM aktualisiert",desc:"Kunde automatisch angelegt"},{icon:"💬",label:"WhatsApp gesendet",desc:"Sie werden benachrichtigt"},{icon:"✅",label:"Kunde bestätigt",desc:"Automatische Bestätigungsmail"}];
const PROJS=[
  {name:"Walczak & Gogsch",cat:"Rechtsanwälte · Dresden",tag:"Website + KI-Fallanalyse",desc:"Professionelle Kanzleiwebsite mit KI-Tool zur ersten Falleinschätzung — in einer Woche.",tech:["React","Claude API","Lovable"],c1:"#060d1c",c2:"#60a5fa",days:6},
  {name:"Benedikt Tillmann",cat:"Rechtsanwalt · Dresden",tag:"Personal Brand Website",desc:"Persönliche Anwaltswebsite im hellen, modernen Stil — klar, vertrauenswürdig, überzeugend.",tech:["React","Lovable","Design"],c1:"#0a1a0a",c2:"#4ade80",days:5},
  {name:"Rollimaus e.V.",cat:"Kinderverein · Dresden",tag:"Pro-Bono · Verein",desc:"Vereinswebsite mit Spendenrechner und Bus-Kauf-Fortschrittsanzeige. Ziel: 35.000 €.",tech:["React","Donation Slider"],c1:"#1a0a14",c2:"#f472b6",days:7},
];
const TESTI=[
  {name:"Thomas K.",role:"Handwerksbetrieb, Dresden",text:"In einer Woche hatten wir eine Website die sich professionell anfühlt. Seitdem kommen Anfragen — vorher war das null.",stars:5},
  {name:"Sandra M.",role:"Dienstleistung, Sachsen",text:"Kein Agentur-Aufwand, kein ellenlanger Fragebogen. Ein Gespräch — eine Woche später war alles live.",stars:5},
  {name:"Michael B.",role:"Selbstständig, Dresden",text:"Die Automation spart mir täglich 1–2 Stunden. Anfragen kommen rein, werden automatisch eingetragen und ich kriege sofort eine SMS.",stars:5},
];
const FAQS=[
  ["Wie lange dauert eine Website?","In der Regel 5–7 Werktage nach Briefing und Materialübergabe (Logo, Fotos, Texte)."],
  ["Gibt es versteckte Kosten?","Nein. Festpreis ist Festpreis. Hosting läuft direkt beim Anbieter (8–15 €/Monat)."],
  ["Können Sie meine alte Website übernehmen?","In vielen Fällen ja — klären wir im Erstgespräch in 5 Minuten."],
  ["Was ist KI-Automatisierung konkret?","Anfrage rein → CRM aktualisiert → WhatsApp an Sie → Bestätigung an Kunden. Alles automatisch."],
  ["Arbeiten Sie außerhalb Dresdens?","Ja. Webdesign und Automation laufen remote. Für Schulungen bin ich auch vor Ort in Sachsen."],
  ["Was kostet das Erstgespräch?","Nichts. 30 Minuten, kostenlos, kein Kaufdruck."],
];
const LEGAL={
  impressum:{title:"Impressum",body:"Angaben gemäß § 5 TMG\n\nAlexandros Ohnesorge\nBergmannstraße 64\n01309 Dresden\n\nE-Mail: alex.ohnesorge@icloud.com\n\nGemäß § 19 UStG wird keine Umsatzsteuer berechnet.\nSteuernummer: [folgt] · Finanzamt Dresden"},
  datenschutz:{title:"Datenschutz",body:"1. Verantwortlicher\nAlexandros Ohnesorge, Bergmannstraße 64, 01309 Dresden\n\n2. Daten\nServer-Log-Dateien und Kontaktformulardaten zur Anfragenbearbeitung.\n\n3. KI-Tools\nTexte in Check/Chat → Anthropic API. Keine personenbezogenen Daten eingeben.\n\n4. Rechte\nAuskunft, Berichtigung, Löschung (Art. 15–21 DSGVO).\nKontakt: alex.ohnesorge@icloud.com"},
  agb:{title:"AGB",body:"§ 1 Geltungsbereich\nAlexandros Ohnesorge, Bergmannstraße 64, 01309 Dresden.\n\n§ 2 Vergütung\n50% Anzahlung, 50% nach Fertigstellung. Zahlungsziel: 14 Tage netto.\n\n§ 3 Lieferzeit\nRichtwert 5–7 Werktage nach vollständiger Materialübergabe.\n\n§ 4 Stornierung\nBis 7 Tage vor Start: kostenfrei. 3–7 Tage: 50%. Unter 3 Tage: 100%.\n\n§ 5 Gerichtsstand\nDresden. Deutsches Recht."},
};

/* HOOKS */
function useTypewriter(words,speed=78){
  const[text,setText]=useState("");const[wi,setWi]=useState(0);const[del,setDel]=useState(false);const p=useRef(null);
  useEffect(()=>{const cur=words[wi];const t=setTimeout(()=>{if(!del){if(text.length<cur.length)setText(cur.slice(0,text.length+1));else p.current=setTimeout(()=>setDel(true),1800);}else{if(text.length>0)setText(cur.slice(0,text.length-1));else{setDel(false);setWi((wi+1)%words.length);}}},del?38:speed);return()=>{clearTimeout(t);clearTimeout(p.current);};},[text,wi,del]);return text;
}
function useCountUp(target,dur=1600,start=false){
  const[val,setVal]=useState(target);const done=useRef(false);
  useEffect(()=>{if(!start||done.current)return;done.current=true;setVal(0);let t0=null;const step=ts=>{if(!t0)t0=ts;const pp=Math.min((ts-t0)/dur,1);setVal(parseFloat((pp*pp*target).toFixed(1)));if(pp<1)requestAnimationFrame(step);else setVal(target);};requestAnimationFrame(step);},[start,target]);return val;
}
function useInView(th=0.15){
  const ref=useRef(null);const[vis,setVis]=useState(false);
  useEffect(()=>{const ob=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:th});if(ref.current)ob.observe(ref.current);return()=>ob.disconnect();},[]);return[ref,vis];
}
function useActiveSection(ids){
  const[active,setActive]=useState("");
  useEffect(()=>{const obs=ids.map(id=>{const el=document.getElementById(id);if(!el)return null;const ob=new IntersectionObserver(([e])=>{if(e.isIntersecting)setActive(id);},{threshold:0.3});ob.observe(el);return ob;}).filter(Boolean);return()=>obs.forEach(o=>o.disconnect());},[]);return active;
}
function useCountdown(iso){
  const calc=()=>{const d=new Date(iso)-new Date();if(d<=0)return{d:0,h:0,m:0,s:0};return{d:Math.floor(d/86400000),h:Math.floor((d%86400000)/3600000),m:Math.floor((d%3600000)/60000),s:Math.floor((d%60000)/1000)};};
  const[time,setTime]=useState(calc);useEffect(()=>{const t=setInterval(()=>setTime(calc()),1000);return()=>clearInterval(t);},[]);return time;
}

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:#070707;color:#f0f0f0;overflow-x:hidden}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0f0f0f}::-webkit-scrollbar-thumb{background:#8b5cf6;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.fade{opacity:0;transform:translateY(22px);transition:opacity .55s ease,transform .55s ease}
.fade.vis{opacity:1;transform:none}
.d1{transition-delay:.08s}.d2{transition-delay:.16s}.d3{transition-delay:.24s}
.W{max-width:1180px;margin:0 auto;padding:0 40px}
.S{padding:100px 0}.Sd{background:#0f0f0f;border-top:1px solid rgba(255,255,255,.07)}
.LBL{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(240,240,240,.4);margin-bottom:14px}
.H2{font-size:clamp(28px,4vw,50px);font-weight:800;letter-spacing:-.03em;line-height:1.08;color:#f0f0f0}
.MT{margin-top:52px}
.G3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.G2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.G2R{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.G2C{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start}
.G2K{display:grid;grid-template-columns:1fr 440px;gap:72px;align-items:start}
.G2U{display:grid;grid-template-columns:320px 1fr;gap:64px;align-items:center}
.G4S{display:grid;grid-template-columns:repeat(4,1fr)}
.G4P{display:grid;grid-template-columns:repeat(4,1fr);gap:0;position:relative}
.G3H{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;max-width:680px;width:100%}
.btn{background:#8b5cf6;color:#fff;border:none;border-radius:8px;padding:13px 26px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:transform .15s,opacity .15s;display:inline-flex;align-items:center;gap:8px;justify-content:center;text-decoration:none}
.btn:hover{transform:scale(1.03);opacity:.92}
.btnL{padding:15px 32px;font-size:15px}
.btnF{width:100%}
.btnO{background:transparent;color:#f0f0f0;border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:12px 22px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;transition:border-color .15s;display:inline-flex;align-items:center;gap:8px;justify-content:center}
.btnO:hover{border-color:rgba(255,255,255,.4)}
.INP{background:#161616;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:12px 16px;color:#f0f0f0;font-size:14px;font-family:inherit;outline:none;width:100%;transition:border-color .15s}
.INP:focus{border-color:#8b5cf6}
input[type=range]{width:100%;appearance:none;height:4px;background:#1a1a1a;border-radius:2px;outline:none;cursor:pointer}
input[type=range]::-webkit-slider-thumb{appearance:none;width:20px;height:20px;background:#8b5cf6;border-radius:50%;cursor:pointer;box-shadow:0 0 0 4px rgba(139,92,246,.15)}
@media(max-width:1024px){.G2K{grid-template-columns:1fr;gap:48px}.G2U{grid-template-columns:1fr;gap:40px}.G2C{grid-template-columns:1fr;gap:40px}}
@media(max-width:900px){
  .G3{grid-template-columns:1fr 1fr}.G4S{grid-template-columns:1fr 1fr}
  .G4P{grid-template-columns:1fr 1fr;gap:32px}.PL{display:none!important}
  .G2R{grid-template-columns:1fr}.NLS{display:none!important}.HAM{display:flex!important}
  .NCTA{display:none!important}.W{padding:0 20px}.S{padding:72px 0}
}
@media(max-width:640px){
  .G3{grid-template-columns:1fr}.G3H{grid-template-columns:1fr}
  .G2{grid-template-columns:1fr}.G4P{grid-template-columns:1fr}
  .G4S .SI{border-right:none!important;border-bottom:1px solid rgba(255,255,255,.07)!important;padding:22px 12px}
  .G4S{grid-template-columns:1fr 1fr}
  .G4S .SI:nth-child(odd){border-right:1px solid rgba(255,255,255,.07)!important}
  .G4S .SI:nth-last-child(-n+2){border-bottom:none!important}
  .HBTNS{flex-direction:column!important;align-items:stretch!important}
  .RGO{grid-template-columns:1fr!important}.RSTOP{flex-direction:column!important}
  .RADIOG{grid-template-columns:1fr!important}.LCTAB{flex-direction:column!important}
}
@media(max-width:480px){.COPT{padding:10px 12px;font-size:13px}.PSTEP{padding:0 6px}}
`;

/* COUNTDOWN */
function CountdownBanner(){
  const{d,h,m,s}=useCountdown("2026-06-30T09:00:00");const pad=n=>String(n).padStart(2,"0");
  return(
    <div style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:BANNER_H,background:P,display:"flex",alignItems:"center",justifyContent:"center",gap:8,overflow:"hidden"}}>
      <span style={{fontSize:11,fontWeight:700,color:"#fff",whiteSpace:"nowrap"}}>⚡ Nur noch 2 freie Plätze im Juni</span>
      <div style={{display:"flex",gap:3}}>{[["d",d],["h",h],["m",m],["s",s]].map(([u,v])=><span key={u} style={{background:"rgba(0,0,0,.2)",borderRadius:4,padding:"1px 6px",fontFamily:"monospace",fontSize:13,fontWeight:700,color:"#fff"}}>{pad(v)}</span>)}</div>
      <span style={{fontSize:11,color:"rgba(255,255,255,.7)",whiteSpace:"nowrap"}}>Tage·Std·Min·Sek</span>
    </div>
  );
}

/* NAV */
function Nav({scrollY,to}){
  const[open,setOpen]=useState(false);
  const active=useActiveSection(["hero","check","leistungen","preise","projekte","kontakt"]);
  const links=[["check","Website-Check"],["leistungen","Leistungen"],["preise","Preise"],["projekte","Projekte"],["kontakt","Kontakt"]];
  const sc=scrollY>60;
  return(
    <nav style={{position:"fixed",top:BANNER_H,left:0,right:0,zIndex:150,height:64,display:"flex",alignItems:"center",background:sc?"rgba(7,7,7,.95)":"transparent",backdropFilter:sc?"blur(16px)":"none",borderBottom:sc?"1px solid rgba(255,255,255,.06)":"none",transition:"all .3s"}}>
      <div className="W" style={{display:"flex",alignItems:"center",gap:24,width:"100%"}}>
        <div onClick={()=>to("hero")} style={{fontSize:19,fontWeight:800,letterSpacing:"-.04em",color:T,cursor:"pointer",flexShrink:0}}>Ohnesorge<span style={{color:P}}>.</span></div>
        <div className="NLS" style={{display:"flex",gap:28,alignItems:"center",flex:1}}>
          {links.map(([id,l])=><span key={id} onClick={()=>to(id)} style={{fontSize:13,fontWeight:500,cursor:"pointer",color:active===id?P:TD,borderBottom:active===id?`1.5px solid ${P}`:"1.5px solid transparent",paddingBottom:2,transition:"all .18s",whiteSpace:"nowrap"}}>{l}</span>)}
        </div>
        <button onClick={()=>to("kontakt")} className="btn NCTA" style={{padding:"10px 20px",fontSize:13,borderRadius:6}}>Anfragen ✦</button>
        <button onClick={()=>setOpen(o=>!o)} className="HAM" style={{display:"none",background:"none",border:"none",cursor:"pointer",color:T,padding:6}}>
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d={open?"M1 1L21 15M21 1L1 15":"M0 1h22M0 8h22M0 15h22"} stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
      {open&&(
        <div style={{position:"fixed",inset:0,top:BANNER_H+64,background:"rgba(7,7,7,.98)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:28,zIndex:149}}>
          {links.map(([id,l])=><span key={id} onClick={()=>{to(id);setOpen(false);}} style={{fontSize:22,fontWeight:700,color:T,cursor:"pointer"}}>{l}</span>)}
          <button onClick={()=>{to("kontakt");setOpen(false);}} className="btn" style={{padding:"14px 32px",fontSize:16,borderRadius:8}}>Kostenlos anfragen ✦</button>
        </div>
      )}
    </nav>
  );
}

/* HERO */
function Hero({to}){
  const text=useTypewriter(WORDS);
  return(
    <section id="hero" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",position:"relative",overflow:"hidden",paddingTop:BANNER_H+64}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px)",backgroundSize:"56px 56px",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"8%",left:"50%",transform:"translateX(-50%)",width:700,height:350,background:`radial-gradient(ellipse,rgba(139,92,246,.09) 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 20px 80px",maxWidth:900,width:"100%"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,border:"1px solid rgba(255,255,255,.12)",borderRadius:20,padding:"7px 16px",fontSize:12,fontWeight:500,color:TD,marginBottom:28,animation:"fadeUp .5s ease both"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:P,animation:"pulse 2s infinite",flexShrink:0}}/>
          Webdesign & KI-Automatisierung · Dresden
        </div>
        <h1 style={{fontSize:"clamp(40px,7vw,78px)",fontWeight:800,lineHeight:1.04,letterSpacing:"-.04em",color:T,marginBottom:20,animation:"fadeUp .5s .1s ease both"}}>
          Mehr Kunden.<br/>Weniger Aufwand.<br/><span style={{color:P}}>Ab morgen.</span>
        </h1>
        <div style={{fontSize:"clamp(15px,2vw,20px)",color:TD,marginBottom:36,minHeight:28,animation:"fadeUp .5s .2s ease both"}}>
          Ich helfe Ihnen beim <span style={{color:T,fontWeight:600}}>{text}<span style={{borderRight:`2px solid ${P}`,paddingRight:1,animation:"blink 1s infinite",display:"inline-block"}}> </span></span>
        </div>
        <div className="HBTNS" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:40,animation:"fadeUp .5s .3s ease both"}}>
          <button onClick={()=>to("check")} className="btn btnL">Kostenloser Website-Check ✦</button>
          <button onClick={()=>to("projekte")} className="btnO btnL">Projekte ansehen</button>
        </div>
        <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginBottom:52,animation:"fadeUp .5s .4s ease both"}}>
          {["✓ Fertig in 7 Tagen","✓ Festpreis","✓ Kostenlose Erstberatung"].map(t=>(
            <span key={t} style={{fontSize:13,color:TD,display:"flex",alignItems:"center",gap:5}}><span style={{color:GR}}>{t[0]}</span>{t.slice(1)}</span>
          ))}
        </div>
        <div className="G3H" style={{animation:"fadeUp .5s .5s ease both"}}>
          {[{icon:"⚡",title:"7 Tage",sub:"Ø Lieferzeit"},{icon:"💰",title:"Ab 890 €",sub:"Festpreis, kein Nachschlag"},{icon:"🎯",title:"15+ Projekte",sub:"abgeschlossen in Dresden"}].map(({icon,title,sub})=>(
            <div key={title} style={{background:B2,border:`1px solid ${BR}`,borderRadius:12,padding:"20px 14px",textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:8}}>{icon}</div>
              <div style={{fontSize:18,fontWeight:800,color:T,letterSpacing:"-.03em"}}>{title}</div>
              <div style={{fontSize:11,color:TF,marginTop:3}}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* STATS */
function StatItem({val,suf,lab,fl,vis,last}){
  const count=useCountUp(val,1600,vis);
  return(
    <div className="SI" style={{padding:"36px 16px",textAlign:"center",borderRight:last?`none`:`1px solid ${BR}`}}>
      <div style={{fontSize:38,fontWeight:800,color:T,letterSpacing:"-.04em",lineHeight:1}}>{fl?count.toFixed(1):Math.floor(count)}{suf}</div>
      <div style={{fontSize:12,color:TF,marginTop:6}}>{lab}</div>
    </div>
  );
}
function StatsBar(){
  const[ref,vis]=useInView(0.3);
  return(
    <div style={{background:B2,borderTop:`1px solid ${BR}`,borderBottom:`1px solid ${BR}`}} ref={ref}>
      <div className="G4S W">
        {STATS.map(({val,suf,lab,fl},i)=>(
          <StatItem key={i} val={val} suf={suf} lab={lab} fl={fl} vis={vis} last={i===STATS.length-1}/>
        ))}
      </div>
    </div>
  );
}

/* PROBLEM */
function ProblemSection(){
  const[ref,vis]=useInView();
  const PROBS=[{icon:"📉",title:"Ihre Website sieht aus wie 2012",desc:"Kunden springen ab bevor sie anrufen. Sie verlieren täglich Aufträge an Konkurrenten die einfach besser online aussehen."},{icon:"⏱",title:"Alles läuft noch manuell",desc:"Anfragen werden von Hand bearbeitet, Termine manuell eingetragen. Ihr Konkurrent hat das längst automatisiert."},{icon:"💸",title:"Agenturen sind zu teuer & langsam",desc:"3 Monate Wartezeit. 6.000 € Angebot. Am Ende eine Vorlage wie jeder andere. Für KMU in Dresden geht das besser."}];
  return(
    <section className="S"><div className="W" ref={ref}>
      <p className="LBL">— Das Problem —</p>
      <h2 className={`H2 fade ${vis?"vis":""}`}>Kommt Ihnen das bekannt vor?</h2>
      <div className="G3 MT">
        {PROBS.map(({icon,title,desc},i)=>(
          <div key={i} className={`fade ${vis?"vis":""} d${i+1}`} style={{background:B3,border:`1px solid ${BR}`,borderRadius:14,padding:28,transition:"border-color .2s"}} onMouseOver={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.18)"} onMouseOut={e=>e.currentTarget.style.borderColor=BR}>
            <div style={{fontSize:24,marginBottom:14}}>{icon}</div>
            <h3 style={{fontSize:17,fontWeight:700,color:T,marginBottom:10}}>{title}</h3>
            <p style={{fontSize:14,color:TD,lineHeight:1.7}}>{desc}</p>
          </div>
        ))}
      </div>
      <div className={`fade ${vis?"vis":""}`} style={{textAlign:"right",marginTop:44,fontSize:"clamp(20px,3vw,30px)",fontWeight:800,color:P,letterSpacing:"-.03em"}}>→ Das machen wir anders.</div>
    </div></section>
  );
}

/* SCHNELLCHECK */
function SchnellcheckTool(){
  const[step,setStep]=useState(0);const[ans,setAns]=useState({});const[result,setResult]=useState(null);const[loading,setLoading]=useState(false);const[email,setEmail]=useState("");const[sent,setSent]=useState(false);
  const cur=CSTEPS[step];
  const select=opt=>{const next={...ans,[step]:opt};setAns(next);if(step<CSTEPS.length-1)setTimeout(()=>setStep(s=>s+1),260);else setTimeout(()=>run(next),260);};
  const run=async(a)=>{
    setLoading(true);const score=Object.values(a).reduce((s,v)=>s+(v?.s??0),0);const txt=CSTEPS.map((s,i)=>`${s.q}: ${a[i]?.l??"—"}`).join("\n");
    try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:`Webdesign-Experte. Score ${score}/100.\n${txt}\nNur JSON ohne Markdown: {"headline":"max 8 Wörter","summary":"1-2 Sätze","problems":["P1","P2","P3"],"quickwins":["Q1","Q2","Q3"],"cta":"persönlicher Satz"}`})});const data=await res.json();const parsed=JSON.parse((data.reply||"").replace(/```json|```/g,"").trim());setResult({...parsed,score});}
    catch{setResult({score,headline:score>=75?"Gute Basis — Potenzial liegt oben drauf":"Verbesserungsbedarf erkannt",summary:score<50?"Ihre Website kostet Sie aktiv Kunden.":"Gezielte Optimierungen können deutlich mehr herausholen.",problems:["Mobile Optimierung ausbaubar","Zu wenig Anfragen","Google-Sichtbarkeit schwach"],quickwins:["Kontaktformular auf Startseite","Google My Business ausfüllen","Ladezeit verbessern"],cta:"In einem kostenlosen Gespräch zeige ich konkret was ich ändern würde."});}
    finally{setLoading(false);}
  };
  const Gauge=({score})=>{const c=score>=75?GR:score>=40?P:RE;const lbl=score>=75?"Gut":score>=40?"Ausbaufähig":"Kritisch";const pct=(score/100)*283;return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,flexShrink:0}}><svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="8"/><circle cx="50" cy="50" r="45" fill="none" stroke={c} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${pct} 283`} strokeDashoffset="71" style={{transition:"stroke-dasharray 1s ease"}} transform="rotate(-90 50 50)"/><text x="50" y="46" textAnchor="middle" fontSize="20" fontWeight="800" fill="#f0f0f0">{score}</text><text x="50" y="60" textAnchor="middle" fontSize="10" fill="rgba(240,240,240,.5)">/100</text></svg><span style={{fontSize:13,fontWeight:700,color:c}}>{lbl}</span></div>);};
  if(loading)return(<div style={{textAlign:"center",padding:"60px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}><div style={{width:44,height:44,border:`3px solid ${PD}`,borderTop:`3px solid ${P}`,borderRadius:"50%",animation:"spin .7s linear infinite"}}/><p style={{fontSize:15,fontWeight:600,color:T}}>KI analysiert…</p></div>);
  if(result)return(
    <div style={{animation:"fadeUp .4s ease both"}}>
      <div className="RSTOP" style={{display:"flex",gap:20,alignItems:"flex-start",marginBottom:18,flexWrap:"wrap"}}><Gauge score={result.score}/><div style={{flex:1,minWidth:150}}><div style={{fontSize:10,fontWeight:700,color:P,letterSpacing:".1em",textTransform:"uppercase",marginBottom:6}}>Ihr Website-Score</div><h3 style={{fontSize:18,fontWeight:800,color:T,marginBottom:8,letterSpacing:"-.02em"}}>{result.headline}</h3><p style={{fontSize:13,color:TD,lineHeight:1.7}}>{result.summary}</p></div></div>
      <div className="RGO" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <div style={{background:"rgba(248,113,113,.06)",border:"1px solid rgba(248,113,113,.2)",borderRadius:10,padding:14}}><div style={{fontSize:10,fontWeight:700,color:RE,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Top-Probleme</div>{result.problems?.map((p,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6,fontSize:12,color:TD}}><span style={{color:RE,flexShrink:0}}>✗</span>{p}</div>)}</div>
        <div style={{background:"rgba(74,222,128,.06)",border:"1px solid rgba(74,222,128,.2)",borderRadius:10,padding:14}}><div style={{fontSize:10,fontWeight:700,color:GR,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Quick Wins</div>{result.quickwins?.map((q,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:6,fontSize:12,color:TD}}><span style={{color:GR,flexShrink:0}}>✓</span>{q}</div>)}</div>
      </div>
      <div style={{background:PD,border:`1px solid ${PB}`,borderRadius:10,padding:14,fontSize:13,color:T,lineHeight:1.65,marginBottom:14}}>💡 {result.cta}</div>
      {!sent?(<div><div style={{fontSize:13,fontWeight:600,color:T,marginBottom:8}}>Ergebnis + kostenloses Gespräch sichern:</div><div style={{display:"flex",gap:8}}><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="ihre@email.de" className="INP" style={{flex:1}}/><button onClick={()=>{if(email.includes("@"))setSent(true);}} className="btn" style={{padding:"10px 16px",fontSize:13,whiteSpace:"nowrap"}}>Senden →</button></div><button onClick={()=>{setStep(0);setAns({});setResult(null);setSent(false);}} style={{background:"none",border:"none",color:TF,fontSize:12,cursor:"pointer",marginTop:10,fontFamily:"inherit"}}>↩ Neue Analyse</button></div>)
      :(<div style={{textAlign:"center",padding:16,background:"rgba(74,222,128,.07)",borderRadius:10,border:"1px solid rgba(74,222,128,.2)"}}><div style={{fontSize:24}}>✓</div><div style={{fontWeight:700,color:GR}}>Ich melde mich innerhalb von 24h!</div></div>)}
    </div>
  );
  return(
    <div>
      <div style={{display:"flex",gap:6,marginBottom:20}}>{CSTEPS.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:99,background:i<=step?P:"rgba(255,255,255,.1)",transition:"background .3s"}}/>)}</div>
      <div style={{fontSize:10,fontWeight:600,color:TD,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Frage {step+1} / {CSTEPS.length}</div>
      <h3 style={{fontSize:18,fontWeight:800,color:T,marginBottom:20,letterSpacing:"-.02em"}}>{cur.q}</h3>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {cur.opts.map((opt,i)=>(
          <button key={i} onClick={()=>select(opt)} className="COPT" style={{background:ans[step]===opt?PD:"rgba(255,255,255,.03)",border:`1.5px solid ${ans[step]===opt?P:"rgba(255,255,255,.1)"}`,borderRadius:10,padding:"13px 16px",cursor:"pointer",fontFamily:"inherit",fontSize:14,color:ans[step]===opt?P:TD,display:"flex",alignItems:"center",gap:10,textAlign:"left",transition:"all .15s"}}>
            <span style={{fontSize:18,flexShrink:0}}>{opt.i}</span><span style={{flex:1}}>{opt.l}</span>{ans[step]===opt&&<span>✓</span>}
          </button>
        ))}
      </div>
      {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{background:"none",border:"none",color:TF,fontSize:12,cursor:"pointer",marginTop:12,fontFamily:"inherit"}}>← Zurück</button>}
    </div>
  );
}

/* AUTOMATION */
function AutomationVisualizer(){
  const[ref,vis]=useInView(0.2);const[active,setActive]=useState(0);
  useEffect(()=>{if(!vis)return;const t=setInterval(()=>setActive(a=>(a+1)%ASTEPS.length),1400);return()=>clearInterval(t);},[vis]);
  return(
    <div ref={ref}>
      <div style={{display:"flex",alignItems:"flex-start",overflowX:"auto",paddingBottom:8}}>
        {ASTEPS.map(({icon,label,desc},i)=>(
          <div key={i} style={{display:"flex",alignItems:"flex-start"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,minWidth:100,opacity:vis?1:0,transform:vis?"none":"translateY(16px)",transition:`all .4s ${i*.1}s`}}>
              <div style={{width:56,height:56,borderRadius:"50%",background:active===i?PD:B3,border:`2px solid ${active===i?P:BR}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,transition:"all .3s",boxShadow:active===i?`0 0 20px ${PD}`:""}}>
                {icon}
              </div>
              <div style={{fontSize:12,fontWeight:700,color:active===i?P:T,textAlign:"center",transition:"color .3s"}}>{label}</div>
              <div style={{fontSize:10,color:TF,textAlign:"center",lineHeight:1.4,maxWidth:90}}>{desc}</div>
            </div>
            {i<ASTEPS.length-1&&<div style={{display:"flex",alignItems:"center",padding:"0 8px",marginTop:28}}><div style={{width:40,height:2,background:active>i?P:BR,transition:"background .3s"}}/></div>}
          </div>
        ))}
      </div>
      <div style={{background:PD,border:`1px solid ${PB}`,borderRadius:8,padding:"11px 16px",fontSize:12,color:TD,marginTop:20}}>⚡ Dieser Prozess läuft vollständig automatisch — in unter 30 Sekunden, während Sie schlafen.</div>
    </div>
  );
}

/* VORHER NACHHER */
function VorherNachher(){
  const[after,setAfter]=useState(false);
  const bef=[{t:"8:30",tx:"Telefonanfrage — alles von Hand notieren",d:"15 Min"},{t:"9:00",tx:"Angebot manuell erstellen und per E-Mail senden",d:"45 Min"},{t:"10:30",tx:"Termin in Kalender manuell eintragen",d:"10 Min"},{t:"14:00",tx:"Nachfass-E-Mail nicht vergessen",d:"20 Min"}];
  const aft=[{t:"8:30",tx:"Formular-Anfrage eingeht — System reagiert sofort",d:"0 Min"},{t:"8:30",tx:"CRM aktualisiert, Angebot automatisch generiert",d:"Auto"},{t:"8:31",tx:"Kalender gebucht, Bestätigung an Kunden gesendet",d:"Auto"},{t:"8:32",tx:"Sie kriegen WhatsApp — fertig verarbeitet",d:"2 Min"}];
  const items=after?aft:bef;const c=after?GR:RE;
  return(
    <div style={{background:B3,border:`1px solid ${BR}`,borderRadius:14,overflow:"hidden"}}>
      <div style={{display:"flex"}}>
        {[false,true].map(isAfter=>(
          <button key={String(isAfter)} onClick={()=>setAfter(isAfter)} style={{flex:1,padding:13,border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700,background:after===isAfter?(isAfter?"#16a34a":"#dc2626"):"transparent",color:after===isAfter?"#fff":"rgba(240,240,240,.35)",transition:"all .2s"}}>
            {isAfter?"✓ Mit Automation":"✗ Ohne Automation"}
          </button>
        ))}
      </div>
      <div style={{padding:20}}>
        {items.map(({t,tx,d},i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:14,alignItems:"center"}}>
            <span style={{fontSize:11,fontFamily:"monospace",color:TF,flexShrink:0,width:38}}>{t}</span>
            <span style={{flex:1,fontSize:13,color:TD}}>{tx}</span>
            <span style={{fontSize:13,fontWeight:700,color:c,flexShrink:0}}>{d}</span>
          </div>
        ))}
        <div style={{marginTop:16,padding:"11px 16px",borderRadius:8,background:`${c}15`,textAlign:"center",fontSize:14,fontWeight:700,color:c}}>
          {after?"✓ ~2 Minuten pro Anfrage — vollautomatisch":"✗ ~90 Minuten pro Anfrage — alles manuell"}
        </div>
      </div>
    </div>
  );
}

/* ROI */
function ROICalculator(){
  const[b,setB]=useState(200);const[r,setR]=useState(2);const[w,setW]=useState(500);
  const ak=Math.round(b*r/100);const po=ak*3;const mo=(po-ak)*w;const ja=mo*12;const fmt=n=>n.toLocaleString("de-DE")+" €";
  return(
    <div style={{background:B3,border:`1px solid ${BR}`,borderRadius:14,padding:24}}>
      {[{label:"Besucher pro Monat",value:b,set:setB,min:50,max:2000,step:10,unit:"Besucher"},{label:"Anfragen-Rate",value:r,set:setR,min:1,max:20,step:1,unit:"%"},{label:"Ø Auftragswert",value:w,set:setW,min:100,max:5000,step:50,unit:"€"}].map(({label,value,set,min,max,step,unit})=>(
        <div key={label} style={{marginBottom:22}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:14,marginBottom:10}}><span style={{color:TD}}>{label}</span><span style={{color:P,fontFamily:"monospace",fontWeight:700}}>{value.toLocaleString("de-DE")} {unit}</span></div>
          <input type="range" min={min} max={max} step={step} value={value} onChange={e=>set(Number(e.target.value))}/>
        </div>
      ))}
      <div style={{background:B2,border:`1px solid ${PB}`,borderRadius:12,padding:20,marginTop:10}}>
        <div className="RGO" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          {[["Aktuelle Anfragen",ak,TD,18],["Mit Website (3×)",po,GR,18],["Verpasst/Monat",fmt(mo),RE,18],["Verpasst/Jahr",fmt(ja),P,24]].map(([l,v,c,fs])=>(
            <div key={l}><div style={{fontSize:11,color:TF,textTransform:"uppercase",letterSpacing:".06em",marginBottom:4}}>{l}</div><div style={{fontSize:fs,fontWeight:800,color:c,letterSpacing:"-.03em"}}>{v}</div></div>
          ))}
        </div>
        <p style={{fontSize:12,color:TF,lineHeight:1.6}}>Eine neue Website ab 890 € amortisiert sich nach der ersten zusätzlichen Anfrage.</p>
      </div>
    </div>
  );
}

/* LEISTUNGEN */
function Leistungen({to}){
  const[ref,vis]=useInView();const[pakete,setPakete]=useState(DEF_PAKETE);
  useEffect(()=>{setPakete(lsGet("pakete",DEF_PAKETE));},[]);
  return(
    <section id="leistungen" className="S Sd"><div className="W" ref={ref}>
      <p className="LBL">— Was ich tue —</p>
      <h2 className={`H2 fade ${vis?"vis":""}`}>Zwei Dinge. Richtig gut.</h2>
      <div className="G3 MT">
        {pakete.map(({id,name,price,for:f,feats,featured},i)=>(
          <div key={id||i} className={`fade ${vis?"vis":""} d${i+1}`} style={{background:B3,border:`1px solid ${featured?"rgba(139,92,246,.4)":BR}`,borderRadius:14,padding:30,position:"relative",background:featured?"linear-gradient(160deg,rgba(139,92,246,.06) 0%,#161616 50%)":B3}}>
            {featured&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:P,color:"#fff",fontSize:11,fontWeight:700,padding:"3px 14px",borderRadius:20,whiteSpace:"nowrap"}}>Beliebt</div>}
            <div style={{fontSize:12,fontWeight:600,color:TF,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>{name}</div>
            <div style={{fontSize:36,fontWeight:800,color:T,letterSpacing:"-.04em",marginBottom:4}}>{price}</div>
            <div style={{fontSize:12,color:TF,marginBottom:20}}>{f}</div>
            <div style={{height:1,background:BR,marginBottom:18}}/>
            <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:9}}>
              {feats.map(feat=><li key={feat} style={{fontSize:13,color:TD,display:"flex",gap:8,alignItems:"flex-start"}}><span style={{color:GR,flexShrink:0}}>✓</span>{feat}</li>)}
            </ul>
            <button onClick={()=>to("kontakt")} className={`${featured?"btn":"btnO"} btnF`} style={{marginTop:24}}>Jetzt anfragen</button>
          </div>
        ))}
      </div>
      <div className="LCTAB" style={{background:PD,border:`1px solid ${PB}`,borderRadius:14,padding:"24px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,marginTop:24,flexWrap:"wrap"}}>
        <div><h3 style={{fontSize:17,fontWeight:700,color:T,marginBottom:6}}>Nicht sicher was Sie brauchen?</h3><p style={{fontSize:14,color:TD}}>Machen Sie den kostenlosen Website-Check — in 3 Minuten wissen Sie was am meisten bringt.</p></div>
        <button onClick={()=>to("check")} className="btn" style={{padding:"12px 24px",fontSize:14,whiteSpace:"nowrap",flexShrink:0}}>Website-Check starten →</button>
      </div>
    </div></section>
  );
}

/* PROZESS */
function Prozess(){
  const[ref,vis]=useInView();
  return(
    <section className="S"><div className="W" ref={ref}>
      <p className="LBL">— Ablauf —</p>
      <h2 className="H2">Von der Anfrage zur Website<br/>in einer Woche.</h2>
      <div className="G4P MT">
        <div className="PL" style={{position:"absolute",top:27,left:"10%",right:"10%",height:1,background:BR}}/>
        {[["01","Erstgespräch","30 Min. kostenlos — wir klären was Sie wirklich brauchen."],["02","Angebot","Am nächsten Tag: konkretes Festpreis-Angebot."],["03","Umsetzung","7 Tage — Sie sehen täglich den Fortschritt."],["04","Launch","Live. Kunden kommen. Inklusive 3 Mon. Support."]].map(([n,t,d],i)=>(
          <div key={i} className={`PSTEP fade ${vis?"vis":""} d${i+1}`} style={{padding:"0 14px",textAlign:"center"}}>
            <div style={{width:54,height:54,borderRadius:"50%",background:B3,border:`1px solid ${PB}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",position:"relative",zIndex:1}}>
              <span style={{fontFamily:"monospace",fontSize:16,fontWeight:800,color:P}}>{n}</span>
            </div>
            <h3 style={{fontSize:16,fontWeight:700,color:T,marginBottom:8}}>{t}</h3>
            <p style={{fontSize:13,color:TF,lineHeight:1.65}}>{d}</p>
          </div>
        ))}
      </div>
    </div></section>
  );
}

/* PREISE */
function Preise({to}){
  const[ref,vis]=useInView();const[pakete,setPakete]=useState(DEF_PAKETE);
  useEffect(()=>{setPakete(lsGet("pakete",DEF_PAKETE));},[]);
  return(
    <section id="preise" className="S Sd"><div className="W" ref={ref}>
      <p className="LBL">— Transparent —</p>
      <h2 className="H2">Was Sie investieren.</h2>
      <div className="G3 MT" style={{alignItems:"start"}}>
        {pakete.map(({id,name,price,for:f,feats,featured},i)=>(
          <div key={id||i} className={`fade ${vis?"vis":""} d${i+1}`} style={{background:featured?"linear-gradient(160deg,rgba(139,92,246,.06) 0%,#161616 50%)":B3,border:`1px solid ${featured?"rgba(139,92,246,.4)":BR}`,borderRadius:14,padding:30,position:"relative"}}>
            {featured&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:P,color:"#fff",fontSize:11,fontWeight:700,padding:"3px 14px",borderRadius:20}}>Beliebt</div>}
            <div style={{fontSize:12,fontWeight:600,color:TF,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>{name}</div>
            <div style={{fontSize:36,fontWeight:800,color:T,letterSpacing:"-.04em",marginBottom:4}}>{price}</div>
            <div style={{fontSize:12,color:TF,marginBottom:20}}>{f}</div>
            <div style={{height:1,background:BR,marginBottom:18}}/>
            <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:9,marginBottom:24}}>
              {feats.map(feat=><li key={feat} style={{fontSize:13,color:TD,display:"flex",gap:8,alignItems:"flex-start"}}><span style={{color:GR,flexShrink:0}}>✓</span>{feat}</li>)}
            </ul>
            <button onClick={()=>to("kontakt")} className={`${featured?"btn":"btnO"} btnF`}>Jetzt anfragen</button>
          </div>
        ))}
      </div>
      <p style={{textAlign:"center",fontSize:12,color:TF,marginTop:24}}>Alle Preise zzgl. MwSt. · Kein Abo · Keine versteckten Kosten · Individuelle Projekte auf Anfrage</p>
    </div></section>
  );
}

/* PROJEKTE */
function ProjektGalerie(){
  const[open,setOpen]=useState(null);const[ref,vis]=useInView();
  return(
    <section id="projekte" className="S"><div className="W" ref={ref}>
      <p className="LBL">— Referenzen —</p>
      <h2 className="H2">Projekte aus Dresden.</h2>
      <p style={{fontSize:15,color:TD,margin:"8px 0 40px"}}>Echte Kunden. Echte Ergebnisse. Alle in unter einer Woche geliefert.</p>
      <div className="G3">
        {PROJS.map((p,i)=>(
          <div key={i} onClick={()=>setOpen(p)} className={`fade ${vis?"vis":""} d${i+1}`} style={{background:B2,border:`1px solid ${BR}`,borderRadius:14,overflow:"hidden",cursor:"pointer",transition:"border-color .2s,transform .2s"}} onMouseOver={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.2)";e.currentTarget.style.transform="translateY(-4px)";}} onMouseOut={e=>{e.currentTarget.style.borderColor=BR;e.currentTarget.style.transform="";}}>
            <div style={{height:160,background:`linear-gradient(135deg,${p.c1} 0%,${p.c2}22 100%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,position:"relative"}}>
              <div style={{position:"absolute",top:12,right:12,background:"rgba(74,222,128,.15)",border:"1px solid rgba(74,222,128,.3)",borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700,color:GR}}>Live</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.4)"}}>{p.cat}</div>
              <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>{p.name}</div>
              <div style={{fontSize:11,color:p.c2,background:`${p.c2}20`,border:`1px solid ${p.c2}40`,borderRadius:20,padding:"3px 10px"}}>{p.tag}</div>
            </div>
            <div style={{padding:"18px 20px"}}>
              <p style={{fontSize:13,color:TD,lineHeight:1.65,marginBottom:12}}>{p.desc}</p>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{p.tech.map(t=><span key={t} style={{fontSize:11,background:B3,border:`1px solid ${BR}`,borderRadius:4,padding:"2px 8px",color:TF}}>{t}</span>)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {open&&(
      <div onClick={()=>setOpen(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",backdropFilter:"blur(8px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div onClick={e=>e.stopPropagation()} style={{background:B2,border:`1px solid rgba(255,255,255,.12)`,borderRadius:20,maxWidth:520,width:"100%",overflow:"hidden",animation:"fadeUp .25s ease"}}>
          <div style={{height:180,background:`linear-gradient(135deg,${open.c1},${open.c2}33)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
            <button onClick={()=>setOpen(null)} style={{position:"absolute",top:14,right:14,background:"rgba(255,255,255,.1)",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",color:T,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            <div style={{textAlign:"center"}}><div style={{fontSize:13,color:"rgba(255,255,255,.4)"}}>{open.cat}</div><div style={{fontSize:24,fontWeight:800,color:"#fff"}}>{open.name}</div></div>
          </div>
          <div style={{padding:24}}>
            <div className="G3" style={{gap:10,marginBottom:16}}>
              {[["Lieferzeit",`${open.days} Tage`],["Status","Live"],["Typ",open.tag]].map(([l,v])=>(
                <div key={l} style={{background:B3,borderRadius:8,padding:"10px 12px",textAlign:"center"}}><div style={{fontSize:10,color:TF,textTransform:"uppercase",marginBottom:3}}>{l}</div><div style={{fontSize:13,fontWeight:700,color:T}}>{v}</div></div>
              ))}
            </div>
            <p style={{fontSize:14,color:TD,lineHeight:1.7,marginBottom:14}}>{open.desc}</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{open.tech.map(t=><span key={t} style={{fontSize:12,background:B3,border:`1px solid ${BR}`,borderRadius:6,padding:"4px 10px",color:TF}}>{t}</span>)}</div>
          </div>
        </div>
      </div>
    )}
    </section>
  );
}

/* TESTIMONIALS */
function Testimonials(){
  const[ref,vis]=useInView();
  return(
    <section className="S Sd"><div className="W" ref={ref}>
      <p className="LBL">— Stimmen —</p>
      <h2 className="H2">Echte Kunden.<br/>Echte Ergebnisse.</h2>
      <div className="G3 MT">
        {TESTI.map(({name,role,text,stars},i)=>(
          <div key={i} className={`fade ${vis?"vis":""} d${i+1}`} style={{background:B3,border:`1px solid ${BR}`,borderRadius:14,padding:26}}>
            <div style={{color:P,fontSize:14,marginBottom:14}}>{"★".repeat(stars)}</div>
            <p style={{fontSize:14,color:TD,lineHeight:1.75,fontStyle:"italic",marginBottom:18}}>„{text}"</p>
            <div style={{fontSize:14,fontWeight:700,color:T}}>{name}</div>
            <div style={{fontSize:12,color:TF,marginTop:2}}>{role}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:40,justifyContent:"center",flexWrap:"wrap",marginTop:40,background:"rgba(255,255,255,.03)",border:`1px solid ${BR}`,borderRadius:14,padding:20}}>
        {[["15+","Projekte"],["100%","Festpreis-Garantie"],["4.9★","Bewertung"],["7 Tage","Ø Lieferzeit"]].map(([v,l])=>(
          <div key={l} style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:800,color:P,letterSpacing:"-.03em"}}>{v}</div><div style={{fontSize:11,color:TF,marginTop:3}}>{l}</div></div>
        ))}
      </div>
    </div></section>
  );
}

/* ÜBER MICH */
function UeberMich({to}){
  const[ref,vis]=useInView();
  return(
    <section className="S"><div className="W" ref={ref}>
      <div className={`G2U fade ${vis?"vis":""}`}>
        <div style={{display:"flex",justifyContent:"center"}}>
          <div style={{background:B2,border:`1px solid ${BR}`,borderRadius:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,aspectRatio:"1",position:"relative",maxWidth:320,width:"100%"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:PD,border:`1px solid ${PB}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:800,color:P}}>AO</div>
            <div style={{fontSize:12,color:TF,fontFamily:"monospace"}}>Foto folgt</div>
            <div style={{position:"absolute",bottom:-14,right:-14,background:B2,border:`1px solid rgba(255,255,255,.1)`,borderRadius:10,padding:"8px 14px",display:"flex",alignItems:"center",gap:7,fontSize:13,fontWeight:600,color:T}}>📍 Dresden</div>
          </div>
        </div>
        <div>
          <p className="LBL">— Kein Konzern. Kein Bullshit. —</p>
          <h2 className="H2" style={{marginBottom:20}}>Hallo, ich bin<br/>Alexandros Ohnesorge.</h2>
          <p style={{fontSize:15,color:TD,lineHeight:1.8,marginBottom:14}}>Ich mache Websites und KI-Automatisierungen für lokale Unternehmen in Dresden und Sachsen — schnell, direkt und zum Festpreis.</p>
          <p style={{fontSize:15,color:TD,lineHeight:1.8,marginBottom:14}}>Kein Agentur-Verbund mit 20 Projektmanagern. Eine Person, von Anfang bis Ende. Kein „zuständiger Kollege". Kein Warten auf Feedback-Schleifen.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:24}}>
            {[["⚡","Webdesign mit Lovable & modernen Tools"],["🤖","Automation mit Make & Zapier"],["🎓","KI-Schulungen → Ohnesorge.KI"]].map(([ic,l])=>(
              <div key={l} style={{background:B3,border:`1px solid ${BR}`,borderRadius:8,padding:"8px 14px",fontSize:13,color:TD,display:"flex",alignItems:"center",gap:8}}><span>{ic}</span>{l}</div>
            ))}
          </div>
          <button onClick={()=>to("kontakt")} className="btn" style={{marginTop:28,padding:"12px 28px",fontSize:14}}>Direktkontakt aufnehmen</button>
        </div>
      </div>
    </div></section>
  );
}

/* FAQ */
function FAQ(){
  const[open,setOpen]=useState(null);
  return(
    <section className="S Sd"><div style={{maxWidth:780,margin:"0 auto",padding:"0 40px"}}>
      <p className="LBL">— FAQ —</p>
      <h2 className="H2" style={{marginBottom:40}}>Alles klar?</h2>
      {FAQS.map(([q,a],i)=>(
        <div key={i} style={{background:B3,border:`1px solid ${BR}`,borderRadius:10,overflow:"hidden",marginBottom:2}}>
          <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",background:"none",border:"none",padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,cursor:"pointer",fontFamily:"inherit",fontSize:15,fontWeight:600,color:T,textAlign:"left",transition:"background .15s"}} onMouseOver={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"} onMouseOut={e=>e.currentTarget.style.background="none"}>
            {q}<span style={{color:TF,fontSize:20,transform:open===i?"rotate(45deg)":"none",transition:"transform .2s",flexShrink:0}}>+</span>
          </button>
          {open===i&&<p style={{fontSize:14,color:TD,lineHeight:1.75,padding:"0 24px 20px",animation:"fadeUp .2s ease"}}>{a}</p>}
        </div>
      ))}
    </div></section>
  );
}

/* KONTAKT */
function Kontakt(){
  const[form,setForm]=useState({name:"",email:"",firma:"",service:"",msg:""});const[sent,setSent]=useState(false);const[sending,setSending]=useState(false);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=async()=>{if(!form.name||!form.email||!form.msg)return;setSending(true);await new Promise(r=>setTimeout(r,800));setSent(true);setSending(false);};
  return(
    <section id="kontakt" className="S Sd"><div className="W">
      <div className="G2K">
        <div>
          <p className="LBL">— Bereit? —</p>
          <h2 className="H2" style={{marginBottom:16}}>Ihr erstes Gespräch<br/>ist kostenlos.</h2>
          <p style={{fontSize:15,color:TD,lineHeight:1.8,marginBottom:28,maxWidth:380}}>30 Minuten. Kein Verkaufsgespräch. Kein Druck. Wir schauen gemeinsam was Sie brauchen — und ob ich der Richtige dafür bin.</p>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:28}}>
            {[["📧","alex.ohnesorge@icloud.com"],["📍","Dresden, Sachsen"],["⏱","Antwort innerhalb von 24h"]].map(([ic,tx])=>(
              <div key={tx} style={{display:"flex",alignItems:"center",gap:12,fontSize:14,color:TD}}><span style={{fontSize:18}}>{ic}</span>{tx}</div>
            ))}
          </div>
          <a href="https://wa.me/49IHRE_NUMMER" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:10,background:"#25d366",color:"#fff",borderRadius:8,padding:"12px 22px",fontSize:14,fontWeight:700,textDecoration:"none"}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp schreiben
          </a>
        </div>
        <div style={{background:B3,border:`1px solid rgba(255,255,255,.08)`,borderRadius:16,padding:32}}>
          {sent?(
            <div style={{textAlign:"center",padding:"40px 0"}}>
              <div style={{fontSize:48,marginBottom:12}}>✓</div>
              <h3 style={{fontSize:20,fontWeight:800,color:GR,marginBottom:8}}>Nachricht erhalten!</h3>
              <p style={{fontSize:14,color:TD}}>Ich melde mich innerhalb von 24h persönlich.</p>
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
              <div style={{marginBottom:20}}><label style={{fontSize:12,fontWeight:600,color:TD,display:"block",marginBottom:7}}>Nachricht *</label><textarea className="INP" style={{resize:"vertical",minHeight:90}} value={form.msg} onChange={e=>set("msg",e.target.value)} placeholder="Was ist Ihre aktuelle Situation?"/></div>
              <button onClick={submit} disabled={sending||!form.name||!form.email||!form.msg} className="btn btnF" style={{fontSize:15,opacity:(!form.name||!form.email||!form.msg)?.5:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {sending?<><div style={{width:18,height:18,border:"2px solid rgba(255,255,255,.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>Wird gesendet…</>:"Anfrage senden →"}
              </button>
              <p style={{textAlign:"center",fontSize:12,color:TF,marginTop:10}}>🔒 Vertraulich — keine Weitergabe an Dritte</p>
            </>
          )}
        </div>
      </div>
    </div></section>
  );
}

/* CHAT WIDGET */
function ChatWidget(){
  const[open,setOpen]=useState(false);const[msgs,setMsgs]=useState([{role:"assistant",text:"Hallo! Fragen zu Website, Preisen oder Automation? Ich helfe gerne!"}]);const[input,setInput]=useState("");const[loading,setLoading]=useState(false);const bottom=useRef(null);
  useEffect(()=>{bottom.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=async()=>{const q=input.trim();if(!q||loading)return;setInput("");setMsgs(p=>[...p,{role:"user",text:q}]);setLoading(true);try{const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q})});const data=await res.json();setMsgs(p=>[...p,{role:"assistant",text:data.reply||"Ein Fehler ist aufgetreten."}]);}catch{setMsgs(p=>[...p,{role:"assistant",text:"Gerade nicht erreichbar — schreib mir direkt per WhatsApp!"}]);}finally{setLoading(false);}};
  return(
    <>
      {open&&(
        <div style={{position:"fixed",bottom:80,right:20,width:320,maxHeight:460,background:B2,border:`1px solid rgba(255,255,255,.1)`,borderRadius:16,display:"flex",flexDirection:"column",zIndex:300,boxShadow:"0 24px 64px rgba(0,0,0,.5)",animation:"fadeUp .25s ease"}}>
          <div style={{background:B3,borderRadius:"16px 16px 0 0",padding:"14px 16px",borderBottom:`1px solid ${BR}`,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:PD,border:`1px solid ${PB}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🤖</div>
            <div><div style={{fontSize:13,fontWeight:700,color:T}}>Ohnesorge Assistant</div><div style={{fontSize:11,color:GR,display:"flex",alignItems:"center",gap:4}}><div style={{width:5,height:5,borderRadius:"50%",background:GR}}/>Online</div></div>
            <button onClick={()=>setOpen(false)} style={{marginLeft:"auto",background:"none",border:"none",color:TD,cursor:"pointer",fontSize:18}}>✕</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:14}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:10}}>
                <div style={{maxWidth:"85%",padding:"9px 13px",borderRadius:m.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px",background:m.role==="user"?P:B3,color:m.role==="user"?"#fff":"rgba(240,240,240,.85)",fontSize:13,lineHeight:1.55}}>{m.text}</div>
              </div>
            ))}
            {loading&&<div style={{display:"flex",gap:4,padding:"10px 14px",background:B3,borderRadius:"12px 12px 12px 2px",width:"fit-content"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:TD,animation:`bounce .8s ${i*.15}s infinite`}}/>)}</div>}
            <div ref={bottom}/>
          </div>
          <div style={{padding:10,borderTop:`1px solid ${BR}`,display:"flex",gap:8}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Frage stellen…" className="INP" style={{flex:1,fontSize:13}}/>
            <button onClick={send} disabled={!input.trim()||loading} className="btn" style={{padding:"9px 14px",opacity:input.trim()&&!loading?1:.4}}>→</button>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} style={{position:"fixed",bottom:20,right:20,width:52,height:52,borderRadius:"50%",background:open?B3:P,border:open?`1px solid ${BR}`:"none",color:open?T:"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 20px rgba(139,92,246,.35)`,zIndex:300,transition:"all .25s"}}>
        {open?"✕":"🤖"}
      </button>
    </>
  );
}

/* COOKIE */
function CookieBanner(){
  const[vis,setVis]=useState(false);
  useEffect(()=>{try{if(!localStorage.getItem("os_cookie"))setVis(true);}catch{setVis(true);}},[]); 
  const accept=all=>{try{localStorage.setItem("os_cookie",all?"all":"essential");}catch{}setVis(false);};
  if(!vis)return null;
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:400,background:"rgba(7,7,7,.97)",backdropFilter:"blur(12px)",borderTop:`1px solid ${BR}`,padding:"18px 40px",animation:"fadeUp .4s ease"}}>
      <div style={{maxWidth:1180,margin:"0 auto",display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",justifyContent:"space-between"}}>
        <p style={{fontSize:14,color:TD,lineHeight:1.6,flex:1,minWidth:240}}>🍪 Wir nutzen technisch notwendige Cookies. Mit „Alle akzeptieren" stimmen Sie Analyse-Cookies zu.</p>
        <div style={{display:"flex",gap:10,flexShrink:0}}>
          <button onClick={()=>accept(false)} className="btnO" style={{padding:"10px 16px",fontSize:13}}>Nur notwendige</button>
          <button onClick={()=>accept(true)} className="btn" style={{padding:"10px 18px",fontSize:13}}>Alle akzeptieren</button>
        </div>
      </div>
    </div>
  );
}

/* LEGAL */
function LegalModal({id,onClose}){
  const c=LEGAL[id];if(!c)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",backdropFilter:"blur(6px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{background:B2,border:`1px solid rgba(255,255,255,.1)`,borderRadius:20,maxWidth:680,width:"100%",maxHeight:"85vh",display:"flex",flexDirection:"column",animation:"fadeUp .3s ease"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",borderBottom:`1px solid ${BR}`}}><h2 style={{fontSize:18,fontWeight:800,color:T}}>{c.title}</h2><button onClick={onClose} style={{background:B3,border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",color:TD,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>
        <div style={{overflowY:"auto",padding:24}}><pre style={{fontFamily:"inherit",fontSize:14,lineHeight:1.75,color:TD,whiteSpace:"pre-wrap",margin:0}}>{c.body}</pre></div>
      </div>
    </div>
  );
}

/* FOOTER */
function Footer({setLegal,to}){
  return(
    <footer style={{background:"#040404",borderTop:`1px solid rgba(255,255,255,.06)`,padding:"48px 0 28px"}}>
      <div className="W">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32,flexWrap:"wrap",gap:24}}>
          <div><div style={{fontSize:20,fontWeight:800,letterSpacing:"-.03em"}}>Ohnesorge<span style={{color:P}}>.</span></div><div style={{fontSize:13,color:TD,marginTop:4}}>Webdesign & KI-Automatisierung · Dresden</div></div>
          <div style={{display:"flex",gap:40,flexWrap:"wrap"}}>
            <div><div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",color:TF,marginBottom:14}}>Leistungen</div>{["Webdesign","KI-Automatisierung","Preise","Projekte"].map(l=><div key={l} onClick={()=>to(l.toLowerCase())} style={{fontSize:14,color:TD,marginBottom:8,cursor:"pointer",transition:"color .15s"}} onMouseOver={e=>e.currentTarget.style.color=P} onMouseOut={e=>e.currentTarget.style.color=TD}>{l}</div>)}</div>
            <div><div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",color:TF,marginBottom:14}}>Rechtliches</div>{[["impressum","Impressum"],["datenschutz","Datenschutz"],["agb","AGB"]].map(([id,l])=><div key={id} onClick={()=>setLegal(id)} style={{fontSize:14,color:TD,marginBottom:8,cursor:"pointer",transition:"color .15s"}} onMouseOver={e=>e.currentTarget.style.color=P} onMouseOut={e=>e.currentTarget.style.color=TD}>{l}</div>)}</div>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,paddingTop:20,borderTop:"1px solid rgba(255,255,255,.05)",fontSize:12,color:TF}}>
          <span>© 2026 Alexandros Ohnesorge · Dresden · Alle Rechte vorbehalten</span><span>Made in Dresden ♥</span>
        </div>
      </div>
    </footer>
  );
}

/* MAIN */
export default function App(){
  const[scrollY,setScrollY]=useState(0);const[legal,setLegal]=useState(null);
  useEffect(()=>{const fn=()=>setScrollY(window.scrollY);window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn);},[]);
  const OFFSET=BANNER_H+64+16;
  const to=id=>{const el=document.getElementById(id);if(!el){window.scrollTo({top:0,behavior:"smooth"});return;}window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-OFFSET,behavior:"smooth"});};
  return(
    <>
      <style>{CSS}</style>
      <CountdownBanner/><Nav scrollY={scrollY} to={to}/><Hero to={to}/><StatsBar/><ProblemSection/>

      <section id="check" className="S Sd"><div className="W">
        <div className="G2C">
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:PD,border:`1px solid ${PB}`,borderRadius:20,padding:"7px 16px",fontSize:12,fontWeight:600,color:P,marginBottom:20}}>✦ Kostenlos & sofort</div>
            <h2 className="H2" style={{marginBottom:16}}>Website-Check.<br/>In 3 Minuten.</h2>
            <p style={{fontSize:15,color:TD,lineHeight:1.8,marginBottom:28}}>5 Fragen — und Sie wissen sofort wo Ihre Website Kunden kostet. Powered by Claude AI.</p>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[["🎯","Personalisiertes Ergebnis — kein generisches Feedback"],["⚡","Sofortiger Score mit konkreten Empfehlungen"],["📊","Top-3 Probleme + Quick Wins"],["💬","Gratis-Gespräch wenn Sie mehr wissen wollen"]].map(([ic,tx])=>(
                <div key={tx} style={{display:"flex",alignItems:"center",gap:12,fontSize:14,color:TD}}><span style={{fontSize:20,width:28,flexShrink:0}}>{ic}</span>{tx}</div>
              ))}
            </div>
          </div>
          <div style={{background:B3,border:`1px solid rgba(255,255,255,.08)`,borderRadius:20,padding:"clamp(22px,4vw,36px)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
              <div style={{width:34,height:34,borderRadius:9,background:PD,border:`1px solid ${PB}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✦</div>
              <div><div style={{fontSize:13,fontWeight:700,color:T}}>Website-Schnellcheck</div><div style={{fontSize:11,color:TF}}>Powered by Claude AI</div></div>
            </div>
            <SchnellcheckTool/>
          </div>
        </div>
      </div></section>

      <section className="S"><div className="W">
        <p className="LBL">— So funktioniert Automation —</p>
        <h2 className="H2">Eine Anfrage rein.<br/>Alles passiert automatisch.</h2>
        <p style={{fontSize:15,color:TD,margin:"8px 0 48px"}}>In unter 30 Sekunden. Ohne dass Sie etwas tun müssen.</p>
        <AutomationVisualizer/>
        <div className="G2R" style={{marginTop:40}}><VorherNachher/><ROICalculator/></div>
      </div></section>

      <Leistungen to={to}/><Prozess/><Preise to={to}/><ProjektGalerie/><Testimonials/><UeberMich to={to}/><FAQ/><Kontakt/>

      <section style={{background:"linear-gradient(135deg,#0a0a0a 0%,#161616 100%)",borderTop:`1px solid ${PB}`,padding:"100px 0",textAlign:"center"}}>
        <div className="W" style={{maxWidth:640}}>
          <h2 className="H2" style={{marginBottom:14}}>Bereit für den ersten Schritt?</h2>
          <p style={{fontSize:16,color:TD,lineHeight:1.8,marginBottom:40}}>Website-Check kostenlos. Erstgespräch kostenlos. Kein Kaufdruck. Versprochen.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>to("check")} className="btn btnL">Website-Check starten ✦</button>
            <button onClick={()=>to("kontakt")} className="btnO btnL">Direkt anfragen</button>
          </div>
        </div>
      </section>

      <Footer setLegal={setLegal} to={to}/>
      {legal&&<LegalModal id={legal} onClose={()=>setLegal(null)}/>}
      <CookieBanner/><ChatWidget/>

      {scrollY>500&&(
        <button onClick={()=>to("hero")} style={{position:"fixed",bottom:80,right:20,width:40,height:40,borderRadius:"50%",background:B3,border:`1px solid ${BR}`,color:T,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,fontSize:16,transition:"transform .2s"}} onMouseOver={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseOut={e=>e.currentTarget.style.transform=""}>↑</button>
      )}
      <style>{`.MOBCTA{display:none!important}@media(max-width:640px){.MOBCTA{display:block!important}}`}</style>
      <div className="MOBCTA" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:150,padding:"12px 16px",background:"rgba(7,7,7,.97)",borderTop:`1px solid ${BR}`}}>
        <button onClick={()=>to("check")} className="btn btnF" style={{fontSize:15}}>Kostenloser Website-Check ✦</button>
      </div>
    </>
  );
}
