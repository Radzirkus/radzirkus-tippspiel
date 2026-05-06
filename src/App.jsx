import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { supabase } from './supabase.js';
import { T, R, ST, JER, PTS, gT, gR, gRT, tE, tL, fD, gI, isDL, dlStr, cSP, Badge, updateTeams, updateRiders, updateStages } from './data.jsx';

const ADMIN_NICK = "radzirkus";
const ADMIN_PASS = "Allback94!";

export default function App() {
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem('rz_user'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [nick, setNick] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [jTips, setJTips] = useState({});
  const [jDone, setJDone] = useState(false);
  const [editJ, setEditJ] = useState(false);
  const [tab, setTab] = useState("tippen");
  const [sel, setSel] = useState(null);
  const [vEval, setVEval] = useState(null);
  const [tips, setTips] = useState({});
  const [results, setRes] = useState({});
  const [search, setSearch] = useState("");
  const [isAdm, setIsAdm] = useState(false);
  const [aP, setAP] = useState(["", "", ""]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showImpr, setShowImpr] = useState(false);
  const [allScores, setAllScores] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [mob, setMob] = useState(window.innerWidth < 600);

  // ─── PERSIST LOGIN ───
  useEffect(() => { if (user) localStorage.setItem('rz_user', JSON.stringify(user)); }, [user]);

  // ─── MOBILE DETECTION ───
  useEffect(() => {
    const h = () => setMob(window.innerWidth < 600);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // ─── ADMIN CHECK ON RELOAD ───
  useEffect(() => {
    if (user && user.nickname.toLowerCase() === ADMIN_NICK && isAdm) {}
  }, [user]);

  const sT = m => { setToast(m); setTimeout(() => setToast(null), 2600); };
  const sortedRiders = useMemo(() => {
    const lastName = n => { const p = n.split(" "); return p[p.length - 1]; };
    return [...R].sort((a, b) => lastName(a.n).localeCompare(lastName(b.n)));
  }, [dataReady]);

  // ─── LOAD TEAMS & RIDERS FROM SUPABASE ───
  useEffect(() => {
    async function loadRosterData() {
      try {
        const { data: teams } = await supabase.from('teams').select('*');
        if (teams && teams.length > 0) updateTeams(teams);
        const { data: riders } = await supabase.from('riders').select('*').eq('active', true);
        if (riders && riders.length > 0) updateRiders(riders);
        const { data: stages } = await supabase.from('stages').select('*').order('id');
        if (stages && stages.length > 0) updateStages(stages);
      } catch (e) {
        console.log('Using fallback data');
      }
      setDataReady(true);
    }
    loadRosterData();
  }, []);

  // ─── LOGIN ───
  const login = async () => {
    const trimmed = nick.trim().toLowerCase();
    if (trimmed.length < 2) return;
    setLoading(true);
    try {
      let { data: existing } = await supabase
        .from('users').select('*').eq('nickname', trimmed).single();
     let loginUser = null;
      if (existing) {
        loginUser = existing;
        if (existing.pin) {
          const pin = prompt("Dein 4-stelliger PIN:");
          if (pin !== existing.pin) {
            sT("Falscher PIN");
            setLoading(false);
            return;
          }
        } else {
          const newPin = prompt("Erstelle einen 4-stelligen PIN (zum Schutz deines Accounts):");
          if (newPin && newPin.length === 4 && /^\d{4}$/.test(newPin)) {
            await supabase.from('users').update({ pin: newPin }).eq('id', existing.id);
            loginUser.pin = newPin;
          }
        }
      } else {
        const newPin = prompt("Wähle einen 4-stelligen PIN (zum Schutz deines Accounts):");
        if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
          sT("Bitte einen 4-stelligen Zahlen-PIN eingeben");
          setLoading(false);
          return;
        }
        const { data: newUser, error } = await supabase
          .from('users').insert({ nickname: trimmed, pin: newPin }).select().single();
        if (error) {
          sT(error.code === '23505' ? "Nickname bereits vergeben!" : "Fehler bei der Anmeldung");
          setLoading(false);
          return;
        }
        loginUser = newUser;
      }
      if (trimmed.toLowerCase() === ADMIN_NICK) {
        const pw = prompt("Admin-Passwort:");
        if (pw !== ADMIN_PASS) {
          sT("Falsches Passwort");
          setLoading(false);
          return;
        }
        setIsAdm(true);
      }
      setUser(loginUser);
      setShowHint(true);
    } catch (err) {
      sT("Verbindungsfehler");
    }
    setLoading(false);
  };

  // ─── LOAD DATA ───
  const loadData = useCallback(async () => {
    if (!user) return;
    const { data: stageTips } = await supabase.from('stage_tips').select('*').eq('user_id', user.id);
    if (stageTips) {
      const tipsMap = {};
      stageTips.forEach(t => { tipsMap[t.stage_id] = [t.pick_1, t.pick_2, t.pick_3]; });
      setTips(tipsMap);
    }
    const { data: jt } = await supabase.from('jersey_tips').select('*').eq('user_id', user.id).single();
    if (jt) {
      const jerseyMap = {};
      if (jt.rosa) jerseyMap.rosa = jt.rosa;
      if (jt.ciclamino) jerseyMap.cicl = jt.ciclamino;
      if (jt.azzurra) jerseyMap.azz = jt.azzurra;
      if (jt.bianca) jerseyMap.bia = jt.bianca;
      setJTips(jerseyMap);
      if (Object.keys(jerseyMap).length === 4) setJDone(true);
    }
    const { data: stageResults } = await supabase.from('stage_results').select('*');
    if (stageResults) {
      const resMap = {};
      stageResults.forEach(r => { resMap[r.stage_id] = [r.result_1, r.result_2, r.result_3]; });
      setRes(resMap);
    }
    await loadLeaderboard();
  }, [user]);

  useEffect(() => {
    if (user && !showHint) loadData();
  }, [user, showHint, loadData]);

  // ─── LEADERBOARD ───
  const loadLeaderboard = async () => {
    const { data: allUsers } = await supabase.from('users').select('*');
    const { data: allTips } = await supabase.from('stage_tips').select('*');
    const { data: allResults } = await supabase.from('stage_results').select('*');
    if (!allUsers || !allTips || !allResults) return;
    const resMap = {};
    allResults.forEach(r => { resMap[r.stage_id] = [r.result_1, r.result_2, r.result_3]; });
    const scores = allUsers.map(u => {
      const userTips = allTips.filter(t => t.user_id === u.id);
      let score = 0;
      userTips.forEach(t => {
        const res = resMap[t.stage_id];
        if (res) score += cSP([t.pick_1, t.pick_2, t.pick_3], res).total;
      });
      return { nickname: u.nickname, score, isMe: user && u.id === user.id };
    });
    scores.sort((a, b) => b.score - a.score);
    setAllScores(scores.map((u, i) => ({ ...u, rk: i + 1 })));
  };

  // ─── SAVE STAGE TIP ───
  const saveStageTip = async (stageId, picks) => {
    if (!user || !picks.every(Boolean)) return;
    const { error } = await supabase.from('stage_tips').upsert({
      user_id: user.id, stage_id: stageId,
      pick_1: picks[0], pick_2: picks[1], pick_3: picks[2],
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,stage_id' });
    if (error) sT("Fehler beim Speichern");
    else { sT(`Tipp für Etappe ${stageId} gespeichert! ✅`); setTips(p => ({ ...p, [stageId]: picks })); }
  };

  // ─── SAVE JERSEY TIPS ───
  const saveJerseyTips = async (jerseyTips) => {
    if (!user) return;
    const { error } = await supabase.from('jersey_tips').upsert({
      user_id: user.id,
      rosa: jerseyTips.rosa || null, ciclamino: jerseyTips.cicl || null,
      azzurra: jerseyTips.azz || null, bianca: jerseyTips.bia || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    if (error) sT("Fehler beim Speichern");
    else { sT("Trikot-Prognosen gespeichert! 🩷"); setJDone(true); setEditJ(false); }
  };

  // ─── SAVE RESULT (ADMIN) ───
  const saveResult = async (stageId, picks) => {
    if (!isAdm || !picks.every(Boolean)) return;
    const { error } = await supabase.from('stage_results').upsert({
      stage_id: stageId, result_1: picks[0], result_2: picks[1], result_3: picks[2],
    }, { onConflict: 'stage_id' });
    if (error) sT("Fehler beim Speichern");
    else { sT(`✅ Ergebnis Etappe ${stageId} gespeichert`); setRes(p => ({ ...p, [stageId]: [...picks] })); setTimeout(loadLeaderboard, 500); }
  };

  // ─── LOGOUT ───
  const logout = () => { localStorage.removeItem('rz_user'); setUser(null); setIsAdm(false); setTips({}); setJTips({}); setJDone(false); };

  // ─── COMPUTED ───
  const totS = useMemo(() => {
    let s = 0;
    Object.entries(results).forEach(([sid, res]) => { if (tips[sid]) s += cSP(tips[sid], res).total; });
    return s;
  }, [tips, results]);

  const lb = useMemo(() => {
    if (allScores.length > 0) return allScores;
    return [{ nickname: user?.nickname || "Du", score: totS, isMe: true, rk: 1 }];
  }, [allScores, totS, user]);

  const fR = useMemo(() => {
    if (!search) return sortedRiders;
    const q = search.toLowerCase();
    return sortedRiders.filter(r => r.n.toLowerCase().includes(q) || gT(r.t)?.n.toLowerCase().includes(q));
  }, [search, sortedRiders]);

  const eS = useMemo(() => Object.keys(results).map(Number).sort((a, b) => a - b), [results]);

  const cT = sel ? (tips[sel.id] || [null, null, null]) : [null, null, null];
  const hR = sel ? !!results[sel.id] : false;
  const cl = sel ? isDL(sel) : false;
  const jerseyLocked = isDL(ST[0]);

  const pickR = (rid, pos) => {
    if (!sel || hR || cl) return;
    const nt = [...cT]; const ex = nt.indexOf(rid);
    if (ex !== -1) nt[ex] = null; nt[pos] = rid;
    setTips(p => ({ ...p, [sel.id]: nt }));
  };
  const unR = pos => {
    if (cl || hR) return;
    const nt = [...cT]; nt[pos] = null;
    setTips(p => ({ ...p, [sel.id]: nt }));
  };

  // ─── LOADING ───
  if (!dataReady) {
    return (
      <div style={S.fw}><style>{CSS}</style>
        <div style={S.cd}>
          <div style={{ fontSize: 42, marginBottom: 8 }}>🚴</div>
          <h1 style={{ ...S.lg, fontSize: mob ? 32 : 42 }}>RADZIRKUS</h1>
          <div style={S.ac}>GIRO D'ITALIA TIPPSPIEL 2026</div>
          <p style={{ ...S.ds, marginTop: 20 }}>Daten werden geladen...</p>
        </div>
      </div>
    );
  }

  // ─── LOGIN ───
  if (!user) {
    return (
      <div style={S.fw}><style>{CSS}</style>
        <div style={{ ...S.cd, padding: mob ? "32px 20px" : "40px 28px" }}>
          <div style={{ fontSize: mob ? 36 : 42, marginBottom: 8 }}>🚴</div>
          <h1 style={{ ...S.lg, fontSize: mob ? 32 : 42 }}>RADZIRKUS</h1>
          <div style={{ ...S.ac, fontSize: mob ? 12 : 15 }}>GIRO D'ITALIA TIPPSPIEL 2026</div>
          <div style={S.dv} />
          <p style={S.ds}>Tippe die Top 3 jeder Etappe und die Trikotträger.<br />Sammle Punkte. Werde Tippkönig*in.</p>
          <div style={S.br}>
            <span style={S.bg}>🥇 10</span><span style={S.bg}>🥈 7</span>
            <span style={S.bg}>🥉 5</span><span style={S.bg}>🩷 25</span>
          </div>
          <input style={S.inp} placeholder="Dein Nickname" value={nick} onChange={e => setNick(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} maxLength={20} />
          <button style={{ ...S.bp, marginTop: 12, opacity: nick.trim().length >= 2 && !loading ? 1 : .4 }} onClick={login} disabled={loading}>
            {loading ? "WIRD GELADEN..." : "MITMACHEN →"}
          </button>
          <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.2)", fontSize: 12, color: "#f472b6", lineHeight: 1.5 }}>⚠️ Merk dir deinen Nickname — damit loggst du dich beim nächsten Mal wieder ein.</div>
        </div>
        {toast && <div style={S.tt}>{toast}</div>}
      </div>
    );
  }

  // ─── HINT ───
  if (showHint) {
    return (
      <div style={S.fw}><style>{CSS}</style>
        <div style={{ ...S.cd, maxWidth: 480 }}>
          <div style={{ fontSize: 38, marginBottom: 10 }}>👋</div>
          <h2 style={{ ...S.lg, fontSize: 26 }}>WILLKOMMEN, {user.nickname.toUpperCase()}!</h2>
          <p style={{ ...S.ds, margin: "14px 0 20px" }}>Das Tippspiel läuft über den gesamten Giro d'Italia 2026.<br />Für Etappen-Analysen und Tippspiel-Updates:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 300, margin: "0 auto" }}>
            <a href="https://youtube.com/@radzirkus" target="_blank" rel="noopener noreferrer" style={S.lk}>▶️ Radzirkus auf YouTube</a>
            <a href="https://instagram.com/radzirkus" target="_blank" rel="noopener noreferrer" style={S.lk}>📷 @radzirkus auf Instagram</a>
          </div>
          <button style={{ ...S.bp, marginTop: 22 }} onClick={() => setShowHint(false)}>WEITER ZUM TIPPSPIEL →</button>
          <button style={S.sk} onClick={() => setShowHint(false)}>Überspringen</button>
        </div>
      </div>
    );
  }

  // ─── JERSEY TIPS ───
  if (!jDone || editJ) {
    if (jerseyLocked && !jDone) { setJDone(true); setEditJ(false); }
    const af = JER.every(j => jTips[j.id]);
    return (
      <div style={S.fw}><style>{CSS}</style>
        <div style={{ ...S.cd, maxWidth: 500, textAlign: "left", padding: mob ? "28px 18px" : "40px 28px" }}>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div style={S.ac}>{editJ ? "BEARBEITEN" : "SCHRITT 1"}</div>
            <h2 style={{ ...S.lg, fontSize: 28, marginTop: 4 }}>TRIKOT-PROGNOSEN</h2>
            <p style={{ ...S.ds, margin: "6px 0 0" }}>Wer trägt die Trikots in Rom? Exakt = 25 Pkt · Top 3 = 10 Pkt</p>
          </div>
          {JER.map(j => {
            const sl = gR(jTips[j.id]);
            const tm = sl ? gRT(sl.i) : null;
            return (
              <div key={j.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 18 }}>{j.em}</span>
                  <span style={{ fontWeight: 700, color: j.cl, fontSize: 13 }}>{j.n}</span>
                  <span style={{ color: "#555", fontSize: 11 }}>({j.ds})</span>
                </div>
                <select style={S.sl} value={jTips[j.id] || ""} onChange={e => setJTips(p => ({ ...p, [j.id]: e.target.value }))}>
                  <option value="">Fahrer wählen...</option>
                  {sortedRiders.map(r => (<option key={r.i} value={r.i}>{r.n} ({gT(r.t)?.s})</option>))}
                </select>
                {sl && (<div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                  <Badge id={sl.i} sz={26} /><span style={{ fontSize: 12, color: "#999" }}>{sl.n} · {tm?.n}</span>
                </div>)}
              </div>
            );
          })}
          <button style={{ ...S.bp, marginTop: 18, opacity: af ? 1 : .4 }} onClick={() => af && saveJerseyTips(jTips)}>PROGNOSEN SPEICHERN →</button>
          <button style={S.sk} onClick={() => { setJDone(true); setEditJ(false); }}>{editJ ? "Abbrechen" : "Später ausfüllen"}</button>
        </div>
        {toast && <div style={S.tt}>{toast}</div>}
      </div>
    );
  }

  // ─── EVALUATION VIEW ───
  if (vEval !== null) {
    const stg = ST.find(s => s.id === vEval);
    const res = results[vEval];
    const tip = tips[vEval];
    const { total, bd } = cSP(tip, res);
    return (
      <div style={S.aw}><style>{CSS}</style>
        <header style={S.hd}>
          <span style={S.hl}>🚴 RADZIRKUS</span>
          {!mob && <span style={S.ha}>GIRO TIPPSPIEL</span>}
        </header>
        <main style={S.mn}>
          <button style={S.bk} onClick={() => setVEval(null)}>← Zurück</button>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={S.ac}>AUSWERTUNG</div>
            <h2 style={{ ...S.lg, fontSize: mob ? 22 : 26, marginTop: 4 }}>ETAPPE {stg.id}</h2>
            <p style={{ color: "#555", fontSize: 13 }}>{stg.t} · {stg.km} km</p>
          </div>
          <div style={S.sc}>
            <div style={S.st}>ERGEBNIS</div>
            {res.map((rid, i) => {
              const r = gR(rid);
              return (<div key={i} style={S.er}>
                <span style={{ fontSize: 18, width: 28 }}>{["🥇", "🥈", "🥉"][i]}</span>
                <Badge id={rid} sz={mob ? 28 : 30} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 13 }}>{r?.n}</div>
                  <div style={{ color: "#555", fontSize: 11 }}>{gRT(rid)?.n}</div>
                </div>
              </div>);
            })}
          </div>
          <div style={{ ...S.sc, marginTop: 14 }}>
            <div style={S.st}>DEIN TIPP — {total} PUNKTE</div>
            {tip ? bd.map((b, i) => (
              <div key={i} style={{ ...S.er, background: b.p > 0 ? "rgba(244,114,182,0.06)" : "transparent" }}>
                <Badge id={tip[i]} sz={mob ? 28 : 30} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: 13 }}>{b.r}</div>
                  <div style={{ color: b.p > 0 ? "#f472b6" : "#444", fontSize: 11 }}>{b.l}</div>
                </div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: b.p > 0 ? "#f472b6" : "#2a2a2a" }}>
                  {b.p > 0 ? `+${b.p}` : "0"}
                </div>
              </div>
            )) : (<p style={{ color: "#444", padding: 14, fontSize: 13 }}>Kein Tipp abgegeben.</p>)}
          </div>
        </main>
      </div>
    );
  }

  // ─── MAIN APP ───
  const pickLabels = ["🥇 1. Platz · 10", "🥈 2. Platz · 7", "🥉 3. Platz · 5"];
  const tabItems = [
    { id: "tippen", l: mob ? "🎯" : "🎯 Tippen" },
    { id: "auswertung", l: mob ? "📊" : "📊 Auswertung" },
    { id: "rangliste", l: mob ? "🏆" : "🏆 Rangliste" },
    { id: "tipps", l: mob ? "📋" : "📋 Meine Tipps" },
    ...(isAdm ? [{ id: "admin", l: mob ? "⚙️" : "⚙️ Admin" }] : []),
  ];

  return (
    <div style={S.aw}><style>{CSS}</style>
      {toast && <div style={S.tt}>{toast}</div>}

      <header style={{ ...S.hd, padding: mob ? "8px 12px" : "10px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: mob ? 6 : 10 }}>
          <span style={{ ...S.hl, fontSize: mob ? 15 : 18 }}>🚴 RADZIRKUS</span>
          {!mob && <span style={S.ha}>GIRO TIPPSPIEL</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: mob ? 5 : 8 }}>
          <div style={S.sp}>
            <span style={{ color: "#888", fontSize: mob ? 8 : 10 }}>PUNKTE</span>
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: mob ? 16 : 18, color: "#f472b6" }}>{totS}</span>
          </div>
          <span style={{ ...S.ub, fontSize: mob ? 10 : 11, padding: mob ? "4px 8px" : "5px 10px" }}>{user.nickname}</span>
          {isAdm && <span style={S.ab}>ADM</span>}
        </div>
      </header>

      <nav style={{ ...S.tb, top: mob ? 40 : 47, padding: mob ? "6px 10px" : "8px 16px" }}>
        {tabItems.map(t => (
          <button key={t.id} style={{ ...(tab === t.id ? { ...S.ta, ...S.to } : S.ta), padding: mob ? "6px 10px" : "6px 12px", minHeight: 36 }}
            onClick={() => { setTab(t.id); setSel(null); setSearch(""); if (t.id === "rangliste") loadLeaderboard(); }}>{t.l}</button>
        ))}
        <button style={{ ...S.ta, color: "#553", padding: mob ? "6px 10px" : "6px 12px" }} onClick={logout}>🚪</button>
      </nav>

      <main style={S.mn}>
        {/* TIPPEN: STAGE LIST */}
        {tab === "tippen" && !sel && (
          <div>
            <h2 style={{ ...S.ti, fontSize: mob ? 22 : 26 }}>ETAPPE WÄHLEN</h2>
            <p style={S.su}>Tipp schließt 5 Min. vor Etappenstart</p>
            {!JER.every(j => jTips[j.id]) && !jerseyLocked && (
              <button onClick={() => setEditJ(true)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: mob ? "10px 12px" : "12px 16px", marginBottom: 14, borderRadius: 9, background: "rgba(244,114,182,0.06)", border: "1px solid rgba(244,114,182,0.2)", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textAlign: "left" }}>
                <span style={{ fontSize: 20 }}>🩷</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f472b6" }}>Trikot-Prognosen ausfüllen</div>
                  <div style={{ fontSize: 11, color: "#777" }}>Bis zu 100 Bonuspunkte</div>
                </div>
                <span style={{ color: "#f472b6", fontSize: 13 }}>→</span>
              </button>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {ST.map(s => {
                const ht = tips[s.id]?.every(Boolean);
                const hr = !!results[s.id];
                const c = isDL(s);
                return (
                  <button key={s.id} style={{ ...S.sc2, borderColor: hr ? "#4ade80" : ht ? "#f472b6" : c ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)", opacity: c && !ht && !hr ? .4 : 1, padding: mob ? "9px 10px" : "11px 14px", gap: mob ? 8 : 12, minHeight: 44 }} onClick={() => setSel(s)}>
                    <div style={{ ...S.sn, width: mob ? 32 : 36, height: mob ? 32 : 36 }}>
                      <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: mob ? 15 : 17, color: hr ? "#4ade80" : ht ? "#f472b6" : "#555" }}>{s.id}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: mob ? 10 : 11, color: "#555" }}>{fD(s.d)} · {s.km} km · Start {s.tm}</div>
                      <div style={{ fontSize: mob ? 12 : 13, fontWeight: 600, color: "#ddd", marginTop: 1 }}>{s.t}</div>
                      <div style={{ fontSize: mob ? 10 : 11, color: "#666", marginTop: 1 }}>{tE(s.y)} {tL(s.y)}</div>
                    </div>
                    <span style={{ fontSize: mob ? 13 : 15 }}>{hr ? "✅" : ht ? "📝" : c ? "🔒" : "○"}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TIPPEN: STAGE DETAIL */}
        {tab === "tippen" && sel && (
          <div>
            <button style={S.bk} onClick={() => { setSel(null); setSearch(""); }}>← Alle Etappen</button>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={S.ac}>ETAPPE {sel.id}</div>
              <h2 style={{ ...S.lg, fontSize: mob ? 20 : 24, marginTop: 3 }}>{sel.t}</h2>
              <div style={{ color: "#555", fontSize: 12, marginTop: 3 }}>{fD(sel.d)} · {sel.km} km · {tE(sel.y)} {tL(sel.y)}</div>
              {!hR && (
                <div style={{ marginTop: 8, padding: "5px 14px", borderRadius: 7, display: "inline-block", fontSize: 11, fontWeight: 600, background: cl ? "rgba(239,68,68,0.1)" : "rgba(74,222,128,0.08)", color: cl ? "#ef4444" : "#4ade80", border: `1px solid ${cl ? "rgba(239,68,68,0.25)" : "rgba(74,222,128,0.2)"}` }}>
                  {cl ? "🔒 TIPP GESCHLOSSEN" : `⏰ Deadline: ${fD(sel.d)} ${dlStr(sel)}`}
                </div>
              )}
            </div>

            {/* PICK SLOTS - stack on mobile */}
            <div style={{ display: "flex", gap: 7, marginBottom: 14, flexWrap: "wrap", flexDirection: mob ? "column" : "row" }}>
              {pickLabels.map((l, i) => {
                const r = gR(cT[i]);
                const tm = r ? gRT(r.i) : null;
                const isNext = !r && cT.indexOf(null) === i;
                return (
                  <div key={i} style={{ flex: mob ? "none" : "1 1 180px", padding: "11px 13px", borderRadius: 10, border: `1px solid ${r ? "#f472b6" : isNext ? "#f472b680" : "rgba(255,255,255,0.08)"}`, background: r ? "rgba(244,114,182,0.05)" : isNext ? "rgba(244,114,182,0.03)" : "rgba(255,255,255,0.015)", transition: "all 0.2s" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: isNext ? "#f472b6" : "#666", letterSpacing: .5, marginBottom: 7, textTransform: "uppercase" }}>{l} {isNext && "⬅"}</div>
                    {r ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <Badge id={r.i} sz={32} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{r.n}</div>
                          <div style={{ fontSize: 11, color: "#666" }}>{tm?.n}</div>
                        </div>
                        {!cl && !hR && (
                          <button onClick={() => unR(i)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#777", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                        )}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: isNext ? "#f472b680" : "#333", fontStyle: "italic" }}>{cl ? "Nicht getippt" : isNext ? "Wähle einen Fahrer ↓" : "—"}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {cT.every(Boolean) && !cl && !hR && (
              <button style={S.bp} onClick={() => saveStageTip(sel.id, cT)}>TIPP SPEICHERN ✓</button>
            )}

            {hR && (
              <div style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 11, padding: mob ? 14 : 18, marginBottom: 18, textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 2, color: "#4ade80", marginBottom: 10 }}>ERGEBNIS</div>
                <div style={{ display: "flex", justifyContent: "center", gap: mob ? 10 : 16, flexWrap: "wrap" }}>
                  {results[sel.id].map((rid, i) => {
                    const r = gR(rid);
                    return (<div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Badge id={rid} sz={mob ? 22 : 26} />
                      <span style={{ fontSize: mob ? 12 : 13, color: "#ccc" }}>{["🥇", "🥈", "🥉"][i]} {r?.n}</span>
                    </div>);
                  })}
                </div>
                <button style={{ ...S.bs, marginTop: 12 }} onClick={() => setVEval(sel.id)}>AUSWERTUNG ANSEHEN →</button>
              </div>
            )}

            {/* RIDER SELECTOR - single column on mobile */}
            {!hR && !cl && (
              <>
                <div style={{ padding: "8px 12px", marginBottom: 8, borderRadius: 8, background: "rgba(244,114,182,0.06)", fontSize: 12, color: "#f472b6", textAlign: "center" }}>
                  👆 Tippe einen Fahrer an — füllt {cT[0] === null ? "Platz 1" : cT[1] === null ? "Platz 2" : "Platz 3"}
                </div>
                <input style={S.sb} placeholder="Fahrer oder Team suchen..." value={search} onChange={e => setSearch(e.target.value)} />
                <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(auto-fill,minmax(230px,1fr))", gap: 4 }}>
                  {fR.map(r => {
                    const tm = gT(r.t);
                    const isSel = cT.includes(r.i);
                    const nE = cT.indexOf(null);
                    return (
                      <button key={r.i} style={{ ...S.rc, opacity: isSel ? .3 : 1, borderColor: isSel ? "#f472b6" : "rgba(255,255,255,0.05)", minHeight: 44 }} onClick={() => !isSel && nE !== -1 && pickR(r.i, nE)}>
                        <Badge id={r.i} sz={32} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#ddd" }}>{r.n}</div>
                          <div style={{ fontSize: 11, color: "#555" }}>{tm?.n}</div>
                        </div>
                        {isSel && <span style={{ fontSize: 15 }}>{["🥇", "🥈", "🥉"][cT.indexOf(r.i)]}</span>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* AUSWERTUNG */}
        {tab === "auswertung" && (
          <div>
            <h2 style={{ ...S.ti, fontSize: mob ? 22 : 26 }}>ETAPPEN-AUSWERTUNG</h2>
            <p style={S.su}>{eS.length} von 21 Etappen ausgewertet</p>
            {eS.length === 0 ? (
              <div style={S.em}><div style={{ fontSize: 44, marginBottom: 10 }}>📊</div><p>Noch keine Etappen ausgewertet.</p></div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {eS.map(sid => {
                  const st = ST.find(s => s.id === sid);
                  const { total } = cSP(tips[sid], results[sid]);
                  return (
                    <button key={sid} style={S.sc2} onClick={() => setVEval(sid)}>
                      <div style={{ ...S.sn, background: "rgba(74,222,128,0.08)" }}>
                        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 17, color: "#4ade80" }}>{sid}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#ddd" }}>{st?.t}</div>
                        <div style={{ fontSize: 11, color: "#555" }}>{fD(st.d)} · {st.km} km</div>
                      </div>
                      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: total > 0 ? "#f472b6" : "#333" }}>
                        {total > 0 ? `+${total}` : "0"}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            <div style={{ ...S.sc, marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={S.st}>DEINE TRIKOT-PROGNOSEN</div>
                {!jerseyLocked && <button style={S.bs} onClick={() => setEditJ(true)}>✏️ Bearbeiten</button>}
              </div>
              {JER.map(j => {
                const r = gR(jTips[j.id]);
                return (
                  <div key={j.id} style={S.er}>
                    <span style={{ fontSize: 18, width: 28 }}>{j.em}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: j.cl, fontSize: 12 }}>{j.n}</div>
                      <div style={{ color: "#888", fontSize: 11 }}>{r ? `${r.n} (${gRT(r.i)?.s})` : "Nicht getippt"}</div>
                    </div>
                    <span style={{ color: "#444", fontSize: 11 }}>25 Pkt</span>
                  </div>
                );
              })}
              <p style={{ color: "#444", fontSize: 11, paddingTop: 8, textAlign: "center" }}>Auswertung nach der Schlussetappe in Rom</p>
            </div>
          </div>
        )}

        {/* RANGLISTE */}
        {tab === "rangliste" && (
          <div>
            <h2 style={{ ...S.ti, fontSize: mob ? 22 : 26 }}>RANGLISTE</h2>
            <p style={S.su}>{eS.length} von 21 Etappen ausgewertet · {lb.length} Teilnehmer</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {lb.map((u, idx) => (
                <div key={idx} style={{ ...S.lr, background: u.isMe ? "rgba(244,114,182,0.08)" : "rgba(255,255,255,0.015)", borderColor: u.isMe ? "#f472b6" : "rgba(255,255,255,0.05)", padding: mob ? "10px 12px" : "12px 14px" }}>
                  <div style={{ width: 32, textAlign: "center", fontSize: 18, flexShrink: 0 }}>
                    {u.rk <= 3 ? ["🥇", "🥈", "🥉"][u.rk - 1] : <span style={{ fontSize: 15, fontWeight: 700, color: "#444" }}>{u.rk}</span>}
                  </div>
                  <div style={{ flex: 1, fontWeight: u.isMe ? 700 : 400, color: u.isMe ? "#fff" : "#ccc", fontSize: mob ? 13 : 14 }}>
                    {u.nickname || u.n} {u.isMe && <span style={{ color: "#f472b6" }}>(DU)</span>}
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: mob ? 18 : 20, color: "#f472b6" }}>{u.score || u.s || 0}</div>
                </div>
              ))}
            </div>
            <div style={{ ...S.sc, marginTop: 24 }}>
              <div style={S.st}>PUNKTESYSTEM</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "7px 14px", fontSize: 12, color: "#888" }}>
                <span>🎯 Exakter 1. Platz</span><span style={{ color: "#f472b6", fontWeight: 700 }}>10</span>
                <span>🎯 Exakter 2. Platz</span><span style={{ color: "#f472b6", fontWeight: 700 }}>7</span>
                <span>🎯 Exakter 3. Platz</span><span style={{ color: "#f472b6", fontWeight: 700 }}>5</span>
                <span>↕️ Richtig, falsche Pos.</span><span style={{ color: "#f472b6", fontWeight: 700 }}>3</span>
                <span>👕 Richtiges Team</span><span style={{ color: "#f472b6", fontWeight: 700 }}>1</span>
                <span style={{ gridColumn: "1/-1", borderTop: "1px solid rgba(255,255,255,0.05)", height: 0, margin: "2px 0" }}></span>
                <span>🩷 Trikot exakt</span><span style={{ color: "#f472b6", fontWeight: 700 }}>25</span>
                <span>🏅 Trikot Top 3</span><span style={{ color: "#f472b6", fontWeight: 700 }}>10</span>
              </div>
            </div>
          </div>
        )}

        {/* MEINE TIPPS */}
        {tab === "tipps" && (
          <div>
            <h2 style={{ ...S.ti, fontSize: mob ? 22 : 26 }}>MEINE TIPPS</h2>
            {Object.keys(tips).length === 0 && !JER.some(j => jTips[j.id]) ? (
              <div style={S.em}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>📋</div>
                <p>Noch keine Tipps.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", marginTop: 14 }}>
                  <button style={{ ...S.bp, maxWidth: 220 }} onClick={() => setTab("tippen")}>Etappen tippen →</button>
                  {!jerseyLocked && <button style={S.bs} onClick={() => setEditJ(true)}>🩷 Trikot-Prognosen</button>}
                </div>
              </div>
            ) : (
              <>
                <div style={{ ...S.sc, marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={S.st}>TRIKOT-PROGNOSEN</div>
                    {!jerseyLocked && <button style={S.bs} onClick={() => setEditJ(true)}>
                      {JER.some(j => jTips[j.id]) ? "✏️ Bearbeiten" : "🩷 Jetzt tippen"}
                    </button>}
                  </div>
                  {JER.some(j => jTips[j.id]) ? JER.filter(j => jTips[j.id]).map(j => {
                    const r = gR(jTips[j.id]);
                    return (
                      <div key={j.id} style={S.er}>
                        <span style={{ fontSize: 16 }}>{j.em}</span>
                        <Badge id={jTips[j.id]} sz={26} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: "#ddd", fontSize: 13 }}>{r?.n}</div>
                          <div style={{ color: j.cl, fontSize: 11 }}>{j.n}</div>
                        </div>
                      </div>
                    );
                  }) : (
                    <p style={{ color: "#444", fontSize: 12, textAlign: "center", padding: "8px 0" }}>Noch keine Trikot-Prognosen.</p>
                  )}
                </div>
                {Object.entries(tips).sort(([a], [b]) => Number(a) - Number(b)).map(([sid, tip]) => {
                  const st = ST.find(s => s.id === Number(sid));
                  const hr = !!results[sid];
                  const { total } = hr ? cSP(tip, results[sid]) : { total: null };
                  return (
                    <div key={sid} style={{ ...S.sc2, marginBottom: 5, cursor: hr ? "pointer" : "default" }} onClick={() => hr && setVEval(Number(sid))}>
                      <div style={{ ...S.sn, background: hr ? "rgba(74,222,128,0.08)" : "rgba(244,114,182,0.07)" }}>
                        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 17, color: hr ? "#4ade80" : "#f472b6" }}>{sid}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: "#555", marginBottom: 3 }}>{st?.t}</div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {tip.map((rid, i) => {
                            const r = gR(rid);
                            return r ? (
                              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <Badge id={rid} sz={20} />
                                <span style={{ fontSize: 11, color: "#999" }}>{["🥇", "🥈", "🥉"][i]} {r.n}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                      {hr && <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: total > 0 ? "#f472b6" : "#333" }}>+{total}</div>}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* ADMIN */}
        {tab === "admin" && isAdm && (
          <div>
            <h2 style={{ ...S.ti, fontSize: mob ? 22 : 26 }}>⚙️ ERGEBNISSE EINTRAGEN</h2>
            <p style={S.su}>Etappe wählen, Top-3 eintragen.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
              {ST.map(s => (
                <button key={s.id} onClick={() => { setSel(s); setAP(results[s.id] || ["", "", ""]); }}
                  style={{ width: mob ? 36 : 40, height: mob ? 36 : 40, borderRadius: 7, border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", fontFamily: "'Bebas Neue',sans-serif", fontSize: mob ? 13 : 15, display: "flex", alignItems: "center", justifyContent: "center", background: sel?.id === s.id ? "#f472b6" : results[s.id] ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.03)", color: sel?.id === s.id ? "#000" : results[s.id] ? "#4ade80" : "#555" }}>
                  {s.id}
                </button>
              ))}
            </div>
            {sel && (
              <div style={S.sc}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: "#fff", marginBottom: 16 }}>
                  ETAPPE {sel.id}: {sel.t}
                </div>
                {["🥇 1. Platz", "🥈 2. Platz", "🥉 3. Platz"].map((l, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#777", marginBottom: 4 }}>{l}</label>
                    <select style={S.sl} value={aP[i]} onChange={e => { const n = [...aP]; n[i] = e.target.value; setAP(n); }}>
                      <option value="">Fahrer wählen...</option>
                      {sortedRiders.map(r => (<option key={r.i} value={r.i}>{r.n} ({gT(r.t)?.s})</option>))}
                    </select>
                  </div>
                ))}
                <button style={{ ...S.bp, marginTop: 6, opacity: aP.every(Boolean) ? 1 : .4 }} onClick={() => saveResult(sel.id, aP)}>
                  ERGEBNIS SPEICHERN
                </button>
              </div>
            )}
          </div>
        )}
      </main>

     <footer style={{ textAlign: "center", padding: mob ? 12 : 16, fontSize: mob ? 8 : 10, color: "#444", letterSpacing: 2, fontFamily: "'Bebas Neue',sans-serif", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div>RADZIRKUS · GIRO D'ITALIA TIPPSPIEL 2026</div>
        <div style={{ marginTop: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 11, letterSpacing: 0, lineHeight: 1.6 }}>
          <button onClick={() => setShowImpr(!showImpr)} style={{ background: "none", border: "none", color: "#555", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textDecoration: "underline" }}>Impressum</button>
          {showImpr && (
            <div style={{ marginTop: 10, padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 8, textAlign: "left", color: "#888", fontSize: 11, lineHeight: 1.8 }}>
              <strong style={{ color: "#aaa" }}>Impressum gemäß § 5 ECG</strong><br />
              Marcus Hauser<br />
              Cottagegasse 45<br />
              1190 Wien<br />
              Österreich<br /><br />
              Kontakt: marcus@radzirkus.de<br />
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{background:#0a0a0f}::selection{background:#f472b6;color:#000}input::placeholder{color:#444}select option{background:#13131d;color:#ddd}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#252530;border-radius:3px}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`;
const S = {
  fw: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#08080d,#10101a 40%,#0d0d14)", fontFamily: "'DM Sans',sans-serif", padding: 16 },
  cd: { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "40px 28px", maxWidth: 420, width: "100%", textAlign: "center", animation: "fadeUp .6s ease" },
  lg: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 42, letterSpacing: 5, color: "#fff", lineHeight: 1 },
  ac: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: 4, color: "#f472b6" },
  dv: { width: 50, height: 2, background: "linear-gradient(90deg,transparent,#f472b6,transparent)", margin: "20px auto" },
  ds: { color: "#aaa", fontSize: 13, lineHeight: 1.7 },
  br: { display: "flex", justifyContent: "center", gap: 8, margin: "16px 0" },
  bg: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "4px 11px", fontSize: 12, color: "#999" },
  inp: { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 9, padding: "12px 14px", fontSize: 15, color: "#fff", outline: "none", textAlign: "center", fontFamily: "'DM Sans',sans-serif" },
  bp: { width: "100%", background: "#f472b6", color: "#000", border: "none", borderRadius: 9, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: .5 },
  bs: { background: "rgba(244,114,182,0.1)", color: "#f472b6", border: "1px solid rgba(244,114,182,0.25)", borderRadius: 7, padding: "8px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
  hn: { color: "#888", fontSize: 11, marginTop: 12 },
  sk: { background: "none", border: "none", color: "#444", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginTop: 8, padding: 3 },
  lk: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, color: "#ccc", textDecoration: "none", fontSize: 13, fontWeight: 500 },
  sl: { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 7, padding: "9px 12px", fontSize: 13, color: "#ddd", outline: "none", fontFamily: "'DM Sans',sans-serif" },
  aw: { minHeight: "100vh", background: "#0a0a0f", color: "#e0e0e0", fontFamily: "'DM Sans',sans-serif" },
  hd: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(10,10,15,0.95)", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" },
  hl: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 3, color: "#fff" },
  ha: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: 2, color: "#f472b6", opacity: .8 },
  sp: { display: "flex", flexDirection: "column", alignItems: "center", padding: "1px 10px", background: "rgba(244,114,182,0.07)", borderRadius: 7, border: "1px solid rgba(244,114,182,0.18)" },
  ub: { background: "rgba(255,255,255,0.05)", borderRadius: 7, padding: "5px 10px", fontSize: 11, fontWeight: 600, color: "#999" },
  ab: { background: "rgba(244,114,182,0.12)", color: "#f472b6", borderRadius: 5, padding: "3px 7px", fontSize: 9, fontWeight: 700, letterSpacing: 1 },
  tb: { display: "flex", gap: 3, padding: "8px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(10,10,15,0.8)", position: "sticky", top: 47, zIndex: 40, overflowX: "auto" },
  tta: { background: "none", border: "none", borderRadius: 7, padding: "6px 12px", color: "#555", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" },
 to: { background: "rgba(244,114,182,0.12)", border: "1px solid rgba(244,114,182,0.35)", color: "#f472b6" },
  mn: { maxWidth: 720, margin: "0 auto", padding: "20px 14px 70px" },
  ti: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: 2, color: "#fff", marginBottom: 3 },
  su: { color: "#444", fontSize: 12, marginBottom: 16 },
  bk: { background: "none", border: "none", color: "#f472b6", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 14, padding: 0, fontWeight: 500 },
  sc2: { display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textAlign: "left", width: "100%" },
  sn: { width: 36, height: 36, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sb: { width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "10px 12px", fontSize: 13, color: "#fff", outline: "none", marginBottom: 10, fontFamily: "'DM Sans',sans-serif" },
  rc: { display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 7, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textAlign: "left" },
  sc: { padding: 18, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 11 },
  st: { fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: 2, color: "#777", marginBottom: 12 },
  er: { display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 7, marginBottom: 3 },
  lr: { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 9 },
  em: { textAlign: "center", padding: "44px 16px", color: "#3a3a3a" },
  tt: { position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "#f472b6", color: "#000", padding: "10px 24px", borderRadius: 9, fontSize: 13, fontWeight: 700, zIndex: 100, boxShadow: "0 6px 28px rgba(244,114,182,0.3)", animation: "fadeUp .3s ease" },
};
