import { useState } from "react";

const SPORT_ICONS = {
  swim: "🏊", run: "🏃", bike: "🚴", lift: "🏋️",
  yoga: "🧘", rest: "😴", cross: "⚡", drill: "🎯",
};

const SPORT_COLORS = {
  swim: "#00d4ff", run: "#ff6b35", bike: "#a8ff3e", lift: "#ff3e9d",
  yoga: "#c084fc", rest: "#4ade80", cross: "#fbbf24", drill: "#f87171",
};

const DAYS_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getTodayDay() {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
}

function blankSession(sport = "swim") {
  return { id: `s${Date.now()}${Math.random()}`, sport, title: "", distance: "", intensity: "", notes: "" };
}

const INITIAL_CYCLES = [
  {
    id: "c1", name: "Base Build — Spring", status: "active",
    weeks: 4, startDate: "2026-04-14", sport: "swim",
    notes: "Focus on aerobic base. Long slow distance, drills every session.",
    days: [
      { day: "Mon", sessions: [
        { id: "s1", sport: "swim", title: "Morning Endurance", distance: "4000m", intensity: "Z2", notes: "4×1000 on 1:20/100" },
        { id: "s2", sport: "lift", title: "Afternoon Strength", distance: "", intensity: "Mod", notes: "Pull: lat pull, rows, core" },
      ]},
      { day: "Tue", sessions: [
        { id: "s3", sport: "run", title: "Easy Run", distance: "6km", intensity: "Z1", notes: "Recovery pace, flat route" },
      ]},
      { day: "Wed", sessions: [
        { id: "s4", sport: "swim", title: "AM Drill Focus", distance: "3000m", intensity: "Z1", notes: "Catch-up, fingertip drag, sculling" },
        { id: "s5", sport: "yoga", title: "PM Mobility", distance: "", intensity: "Low", notes: "Hip flexors, thoracic spine" },
      ]},
      { day: "Thu", sessions: [
        { id: "s6", sport: "lift", title: "Strength A", distance: "", intensity: "Mod", notes: "Push: bench, shoulder press, triceps" },
      ]},
      { day: "Fri", sessions: [
        { id: "s7", sport: "swim", title: "Threshold AM", distance: "3500m", intensity: "Z3", notes: "10×200 on 3:00" },
        { id: "s8", sport: "run", title: "Shakeout PM", distance: "3km", intensity: "Z1", notes: "Easy legs" },
      ]},
      { day: "Sat", sessions: [
        { id: "s9", sport: "run", title: "Long Run", distance: "12km", intensity: "Z2", notes: "Aerobic long effort" },
      ]},
      { day: "Sun", sessions: [
        { id: "s10", sport: "rest", title: "Rest / Mobility", distance: "", intensity: "", notes: "Foam roll, stretch 20min" },
      ]},
    ],
  },
];

const DRAFT_CYCLES = [
  {
    id: "d1", name: "Taper Week", sport: "swim",
    notes: "Pre-meet taper. Cut volume 40%, maintain intensity.",
    days: [
      { day: "Mon", sessions: [{ id: "sd1", sport: "swim", title: "Easy Swim", distance: "2000m", intensity: "Z1", notes: "Feel the water" }] },
      { day: "Tue", sessions: [{ id: "sd2", sport: "run", title: "Short Shakeout", distance: "3km", intensity: "Z1", notes: "" }] },
      { day: "Wed", sessions: [{ id: "sd3", sport: "swim", title: "Race Pace", distance: "2500m", intensity: "Z4", notes: "Short race pace reps" }] },
      { day: "Thu", sessions: [{ id: "sd4", sport: "rest", title: "Rest", distance: "", intensity: "", notes: "" }] },
      { day: "Fri", sessions: [{ id: "sd5", sport: "swim", title: "Activation", distance: "1500m", intensity: "Z2", notes: "Warm up for tomorrow" }] },
      { day: "Sat", sessions: [{ id: "sd6", sport: "swim", title: "RACE DAY 🏆", distance: "", intensity: "MAX", notes: "Competition" }] },
      { day: "Sun", sessions: [{ id: "sd7", sport: "rest", title: "Recovery", distance: "", intensity: "", notes: "Sleep, eat, reflect" }] },
    ],
  },
];

const PAST_CYCLES = [
  {
    id: "p1", name: "Winter Foundation", status: "complete", weeks: 6,
    startDate: "2026-01-06", sport: "swim", notes: "Rebuilt base after holiday break.", days: [],
    summary: { totalSessions: 36, swimKm: 98, runKm: 45, topSet: "20×100 on 1:30" },
  },
  {
    id: "p2", name: "Speed Block", status: "complete", weeks: 3,
    startDate: "2026-03-02", sport: "swim", notes: "High intensity, max quality work.", days: [],
    summary: { totalSessions: 21, swimKm: 52, runKm: 18, topSet: "30×50 sprint" },
  },
];

export default function App() {
  const [tab, setTab] = useState("today");
  const [cycles, setCycles] = useState(INITIAL_CYCLES);
  const [drafts, setDrafts] = useState(DRAFT_CYCLES);
  const [past] = useState(PAST_CYCLES);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [modal, setModal] = useState(null);

  const activeCycle = cycles.find((c) => c.status === "active") || null;
  const todayDay = getTodayDay();
  const todayDayData = activeCycle?.days?.find((d) => d.day === todayDay);

  const s = {
    root: { fontFamily: "'Barlow Condensed', sans-serif", background: "#080e1a", minHeight: "100vh", color: "#e8f4f8", maxWidth: 430, margin: "0 auto", position: "relative" },
    header: { padding: "20px 20px 10px", borderBottom: "1px solid #1a2a3a", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { fontSize: 22, fontWeight: 800, letterSpacing: 2, color: "#00d4ff", textTransform: "uppercase" },
    dateStr: { fontSize: 12, color: "#4a7a8a", letterSpacing: 1 },
    nav: { display: "flex", borderBottom: "1px solid #1a2a3a", background: "#080e1a", position: "sticky", top: 0, zIndex: 10 },
    navBtn: (a) => ({ flex: 1, padding: "12px 2px", background: "none", border: "none", color: a ? "#00d4ff" : "#3a5a6a", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", borderBottom: a ? "2px solid #00d4ff" : "2px solid transparent", transition: "all 0.2s" }),
    page: { padding: "16px 16px 100px", overflowY: "auto" },
    card: { background: "#0d1824", border: "1px solid #1a2a3a", borderRadius: 12, padding: 16, marginBottom: 12 },
    cardAccent: (c) => ({ background: "#0d1824", border: `1px solid ${c}40`, borderLeft: `3px solid ${c}`, borderRadius: 12, padding: 16, marginBottom: 10 }),
    label: { fontSize: 10, letterSpacing: 2, color: "#3a6a7a", textTransform: "uppercase", marginBottom: 4 },
    h2: { fontSize: 20, fontWeight: 700, letterSpacing: 0.5 },
    h3: { fontSize: 16, fontWeight: 700 },
    sub: { fontSize: 13, color: "#4a8a9a", lineHeight: 1.4 },
    pill: (c) => ({ display: "inline-block", background: `${c}22`, color: c, border: `1px solid ${c}55`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 1 }),
    btn: (v = "primary") => ({ display: "block", width: "100%", padding: "13px 20px", borderRadius: 10, border: v === "primary" ? "none" : "1px solid #1a3a4a", background: v === "primary" ? "linear-gradient(135deg,#00d4ff,#0090b0)" : "#0d1824", color: v === "primary" ? "#000" : "#00d4ff", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", marginBottom: 10 }),
    btnSm: (c = "#00d4ff") => ({ padding: "7px 14px", borderRadius: 8, border: `1px solid ${c}55`, background: `${c}15`, color: c, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: "pointer" }),
    btnTiny: (c = "#00d4ff") => ({ padding: "4px 10px", borderRadius: 6, border: `1px solid ${c}44`, background: `${c}11`, color: c, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, cursor: "pointer" }),
    row: { display: "flex", alignItems: "center", gap: 10 },
    sb: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    input: { width: "100%", background: "#0a131d", border: "1px solid #1a3a4a", borderRadius: 8, padding: "10px 12px", color: "#e8f4f8", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, marginBottom: 8, boxSizing: "border-box" },
    select: { width: "100%", background: "#0a131d", border: "1px solid #1a3a4a", borderRadius: 8, padding: "10px 12px", color: "#e8f4f8", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, marginBottom: 8, boxSizing: "border-box" },
    textarea: { width: "100%", background: "#0a131d", border: "1px solid #1a3a4a", borderRadius: 8, padding: "10px 12px", color: "#e8f4f8", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, marginBottom: 8, boxSizing: "border-box", resize: "vertical", minHeight: 56 },
    overlay: { position: "fixed", inset: 0, background: "#000000cc", zIndex: 50, display: "flex", alignItems: "flex-end", maxWidth: 430, margin: "0 auto" },
    sheet: { background: "#0d1824", border: "1px solid #1a2a3a", borderRadius: "20px 20px 0 0", padding: 20, width: "100%", maxHeight: "88vh", overflowY: "auto" },
    grip: { width: 40, height: 4, background: "#1a3a4a", borderRadius: 2, margin: "0 auto 16px" },
  };

  const SessionChip = ({ session, onTap }) => {
    const color = SPORT_COLORS[session.sport] || "#00d4ff";
    return (
      <div style={{ ...s.cardAccent(color), cursor: "pointer", padding: "10px 14px" }} onClick={() => onTap && onTap(session)}>
        <div style={s.sb}>
          <div style={s.row}>
            <span style={{ fontSize: 20 }}>{SPORT_ICONS[session.sport]}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{session.title || session.sport}</div>
              {session.notes && <div style={{ fontSize: 11, color: "#4a7a8a", marginTop: 2 }}>{session.notes}</div>}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            {session.distance && <div style={{ fontSize: 13, fontWeight: 800, color }}>{session.distance}</div>}
            {session.intensity && <div style={s.pill(color)}>{session.intensity}</div>}
          </div>
        </div>
      </div>
    );
  };

  const TodayTab = () => (
    <div style={s.page}>
      <div style={{ marginBottom: 20 }}>
        <div style={s.label}>Today — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
        {todayDayData && todayDayData.sessions.length > 0 ? (
          <>
            <div style={{ ...s.sb, marginBottom: 10 }}>
              <div style={s.h2}>{activeCycle?.name}</div>
              <div style={s.pill("#00d4ff")}>{todayDayData.sessions.length} SESSION{todayDayData.sessions.length > 1 ? "S" : ""}</div>
            </div>
            {todayDayData.sessions.map((sess, i) => (
              <div key={sess.id}>
                <div style={{ fontSize: 10, color: "#2a5a6a", letterSpacing: 2, marginBottom: 4 }}>SESSION {i + 1}</div>
                <SessionChip session={sess} onTap={(s2) => setModal({ type: "workout", data: s2 })} />
              </div>
            ))}
          </>
        ) : (
          <div style={{ ...s.card, textAlign: "center", padding: 28 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>😴</div>
            <div style={s.h2}>Rest Day</div>
            <div style={s.sub}>No sessions scheduled today.</div>
          </div>
        )}
      </div>

      {activeCycle && (
        <div style={s.card}>
          <div style={s.label}>This Week</div>
          {DAYS_ORDER.map((d) => {
            const dayData = activeCycle.days.find((x) => x.day === d);
            const sessions = dayData?.sessions || [];
            const isToday = d === todayDay;
            const primarySport = sessions[0]?.sport || "rest";
            const color = SPORT_COLORS[primarySport];
            return (
              <div key={d}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, background: isToday ? `${color}15` : "#0a131d", border: isToday ? `1px solid ${color}40` : "1px solid transparent", marginBottom: 5, cursor: sessions.length ? "pointer" : "default" }}
                onClick={() => sessions.length && setModal({ type: "dayDetail", data: { day: d, sessions, cycleName: activeCycle.name } })}>
                <div style={{ width: 34, fontSize: 11, fontWeight: 700, color: isToday ? "#00d4ff" : "#3a5a6a", letterSpacing: 1 }}>{d}</div>
                <div style={{ display: "flex", gap: 3 }}>
                  {sessions.length > 0 ? sessions.map((se) => <span key={se.id} style={{ fontSize: 15 }}>{SPORT_ICONS[se.sport]}</span>) : <span style={{ fontSize: 15 }}>😴</span>}
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: isToday ? "#e8f4f8" : "#6a9aaa" }}>
                  {sessions.length > 0 ? sessions.map((se) => se.title || se.sport).join(" + ") : "Rest"}
                </div>
                {sessions.length > 1 && <div style={{ ...s.pill(color), fontSize: 10 }}>{sessions.length}</div>}
              </div>
            );
          })}
        </div>
      )}

      {!activeCycle && (
        <div style={{ ...s.card, textAlign: "center", padding: 30 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏊</div>
          <div style={s.h2}>No Active Cycle</div>
          <div style={{ ...s.sub, marginBottom: 16 }}>Head to Cycles to start a training block.</div>
          <button style={s.btn()} onClick={() => setTab("cycles")}>Go to Cycles</button>
        </div>
      )}
    </div>
  );

  const ScheduleTab = () => {
    const c = selectedCycle || activeCycle;
    if (!c) return (
      <div style={{ ...s.page, textAlign: "center", paddingTop: 60 }}>
        <div style={{ fontSize: 48 }}>📅</div>
        <div style={{ ...s.h2, marginTop: 12 }}>No Cycle Selected</div>
        <div style={{ ...s.sub, marginBottom: 20 }}>Go to Cycles to select one.</div>
        <button style={s.btn()} onClick={() => setTab("cycles")}>Go to Cycles</button>
      </div>
    );
    return (
      <div style={s.page}>
        <div style={{ ...s.sb, marginBottom: 4 }}>
          <div><div style={s.label}>Weekly Schedule</div><div style={s.h2}>{c.name}</div></div>
          <button style={s.btnSm()} onClick={() => setModal({ type: "editCycle", data: c })}>Edit</button>
        </div>
        <div style={{ ...s.sub, marginBottom: 16 }}>{c.notes}</div>
        {DAYS_ORDER.map((d) => {
          const dayData = c.days.find((x) => x.day === d);
          const sessions = dayData?.sessions || [];
          const isToday = d === todayDay && c.status === "active";
          return (
            <div key={d} style={{ marginBottom: 16 }}>
              <div style={{ ...s.sb, marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: isToday ? "#00d4ff" : "#3a5a6a" }}>
                  {d.toUpperCase()}{isToday ? " · TODAY" : ""}
                </div>
                <div style={{ fontSize: 11, color: "#2a4a5a" }}>{sessions.length} session{sessions.length !== 1 ? "s" : ""}</div>
              </div>
              {sessions.length === 0 && (
                <div style={{ ...s.card, padding: "10px 14px", opacity: 0.45 }}>
                  <span style={{ fontSize: 16 }}>😴</span> <span style={{ fontSize: 13, color: "#4a6a7a" }}>Rest</span>
                </div>
              )}
              {sessions.map((sess) => (
                <SessionChip key={sess.id} session={sess} onTap={(s2) => setModal({ type: "workout", data: s2 })} />
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const CyclesTab = () => (
    <div style={s.page}>
      <div style={{ ...s.sb, marginBottom: 16 }}>
        <div style={s.h2}>Training Cycles</div>
        <button style={s.btnSm()} onClick={() => setModal({ type: "newCycle" })}>+ New</button>
      </div>
      {cycles.length > 0 && <>
        <div style={s.label}>Active</div>
        {cycles.map((c) => (
          <div key={c.id} style={s.cardAccent(SPORT_COLORS[c.sport])}>
            <div style={s.sb}>
              <div><div style={s.h3}>{SPORT_ICONS[c.sport]} {c.name}</div><div style={{ ...s.sub, marginTop: 4 }}>{c.weeks}w · started {new Date(c.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div></div>
              <div style={s.pill(SPORT_COLORS[c.sport])}>ACTIVE</div>
            </div>
            {c.notes && <div style={{ ...s.sub, marginTop: 8, fontSize: 12 }}>{c.notes}</div>}
            <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
              <button style={s.btnSm(SPORT_COLORS[c.sport])} onClick={() => { setSelectedCycle(c); setTab("schedule"); }}>Schedule</button>
              <button style={s.btnSm("#ff6b35")} onClick={() => setModal({ type: "editCycle", data: c })}>Edit</button>
            </div>
          </div>
        ))}
      </>}
      <div style={{ ...s.sb, marginTop: 16, marginBottom: 8 }}>
        <div style={s.label}>Draft Cycles</div>
        <button style={s.btnSm("#fbbf24")} onClick={() => setModal({ type: "newDraft" })}>+ Draft</button>
      </div>
      {drafts.length === 0 && <div style={{ ...s.sub, marginBottom: 12 }}>No drafts yet.</div>}
      {drafts.map((d) => (
        <div key={d.id} style={s.card}>
          <div style={s.sb}>
            <div><div style={s.h3}>{SPORT_ICONS[d.sport]} {d.name}</div><div style={{ ...s.sub, fontSize: 12, marginTop: 4 }}>{d.notes}</div></div>
            <div style={s.pill("#fbbf24")}>DRAFT</div>
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
            <button style={s.btnSm("#fbbf24")} onClick={() => setModal({ type: "editCycle", data: d, draft: true })}>Edit</button>
            <button style={s.btnSm("#4ade80")} onClick={() => {
              const active = { ...d, id: `c${Date.now()}`, status: "active", weeks: d.weeks || 4, startDate: new Date().toISOString().split("T")[0] };
              setCycles((prev) => prev.map((c) => ({ ...c, status: "complete" })).concat(active));
              setDrafts((prev) => prev.filter((x) => x.id !== d.id));
            }}>Activate</button>
            <button style={s.btnSm("#f87171")} onClick={() => setDrafts((prev) => prev.filter((x) => x.id !== d.id))}>Delete</button>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 16, marginBottom: 8 }}><div style={s.label}>Past Cycles</div></div>
      {past.map((c) => (
        <div key={c.id} style={s.card} onClick={() => setModal({ type: "pastCycle", data: c })}>
          <div style={s.sb}>
            <div><div style={s.h3}>{SPORT_ICONS[c.sport]} {c.name}</div><div style={{ ...s.sub, marginTop: 4 }}>{c.weeks}w · {new Date(c.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</div></div>
            <div style={s.pill("#4ade80")}>DONE</div>
          </div>
          {c.summary && (
            <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
              <div><span style={{ color: "#00d4ff", fontWeight: 800 }}>{c.summary.swimKm}km</span> <span style={{ color: "#4a7a8a", fontSize: 12 }}>swim</span></div>
              <div><span style={{ color: "#ff6b35", fontWeight: 800 }}>{c.summary.runKm}km</span> <span style={{ color: "#4a7a8a", fontSize: 12 }}>run</span></div>
              <div><span style={{ fontWeight: 800 }}>{c.summary.totalSessions}</span> <span style={{ color: "#4a7a8a", fontSize: 12 }}>sessions</span></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const StatsTab = () => (
    <div style={s.page}>
      <div style={s.label}>Training Stats</div>
      <div style={s.h2}>Your History</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0" }}>
        {[{ label: "Total Cycles", value: past.length + cycles.length, color: "#00d4ff" }, { label: "Swim Sessions", value: "57", color: "#00d4ff" }, { label: "Run Sessions", value: "22", color: "#ff6b35" }, { label: "Strength Days", value: "18", color: "#ff3e9d" }].map((x) => (
          <div key={x.label} style={{ ...s.card, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: x.color }}>{x.value}</div>
            <div style={{ fontSize: 11, color: "#4a7a8a", letterSpacing: 1, textTransform: "uppercase" }}>{x.label}</div>
          </div>
        ))}
      </div>
      {past.map((c) => (
        <div key={c.id} style={s.card}>
          <div style={s.sb}><div style={s.h3}>{SPORT_ICONS[c.sport]} {c.name}</div><div style={{ ...s.sub, fontSize: 12 }}>{new Date(c.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</div></div>
          {c.summary && (<>
            <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
              <div><span style={{ color: "#00d4ff", fontWeight: 800 }}>{c.summary.swimKm}km</span> <span style={{ fontSize: 12, color: "#4a7a8a" }}>swim</span></div>
              <div><span style={{ color: "#ff6b35", fontWeight: 800 }}>{c.summary.runKm}km</span> <span style={{ fontSize: 12, color: "#4a7a8a" }}>run</span></div>
              <div><span style={{ fontWeight: 800 }}>{c.summary.totalSessions}</span> <span style={{ fontSize: 12, color: "#4a7a8a" }}>sessions</span></div>
            </div>
            <div style={{ ...s.sub, marginTop: 6, fontSize: 12 }}>Top set: {c.summary.topSet}</div>
          </>)}
        </div>
      ))}
    </div>
  );

  const WorkoutModal = ({ data }) => {
    const color = SPORT_COLORS[data.sport] || "#00d4ff";
    return (
      <div style={s.overlay} onClick={() => setModal(null)}>
        <div style={s.sheet} onClick={(e) => e.stopPropagation()}>
          <div style={s.grip} />
          <div style={s.row}>
            <div style={{ fontSize: 36 }}>{SPORT_ICONS[data.sport]}</div>
            <div><div style={s.label}>{data.sport.toUpperCase()}</div><div style={s.h2}>{data.title || data.sport}</div></div>
          </div>
          <div style={{ display: "flex", gap: 8, margin: "12px 0", flexWrap: "wrap" }}>
            {data.distance && <div style={s.pill(color)}>{data.distance}</div>}
            {data.intensity && <div style={s.pill(color)}>{data.intensity}</div>}
          </div>
          {data.notes && (
            <div style={{ ...s.card, background: "#0a131d" }}>
              <div style={s.label}>Notes / Sets</div>
              <div style={{ fontSize: 15, lineHeight: 1.6 }}>{data.notes}</div>
            </div>
          )}
          <button style={s.btn("secondary")} onClick={() => setModal(null)}>Close</button>
        </div>
      </div>
    );
  };

  const DayDetailModal = ({ data }) => (
    <div style={s.overlay} onClick={() => setModal(null)}>
      <div style={s.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={s.grip} />
        <div style={s.sb}>
          <div><div style={s.label}>{data.cycleName}</div><div style={s.h2}>{data.day} — {data.sessions.length} Session{data.sessions.length > 1 ? "s" : ""}</div></div>
        </div>
        <div style={{ marginTop: 14 }}>
          {data.sessions.map((sess, i) => {
            const color = SPORT_COLORS[sess.sport] || "#00d4ff";
            return (
              <div key={sess.id} style={{ ...s.cardAccent(color), marginBottom: 10 }}>
                <div style={s.sb}>
                  <div style={s.row}>
                    <span style={{ fontSize: 24 }}>{SPORT_ICONS[sess.sport]}</span>
                    <div>
                      <div style={{ fontSize: 10, color: "#3a6a7a", letterSpacing: 2 }}>SESSION {i + 1}</div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{sess.title || sess.sport}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {sess.distance && <div style={{ fontSize: 14, fontWeight: 800, color }}>{sess.distance}</div>}
                    {sess.intensity && <div style={s.pill(color)}>{sess.intensity}</div>}
                  </div>
                </div>
                {sess.notes && <div style={{ ...s.sub, fontSize: 12, marginTop: 8 }}>{sess.notes}</div>}
              </div>
            );
          })}
        </div>
        <button style={s.btn("secondary")} onClick={() => setModal(null)}>Close</button>
      </div>
    </div>
  );

  const CycleEditorModal = ({ draft = false, existing = null }) => {
    const makeDefaultDays = () => DAYS_ORDER.map((d) => ({ day: d, sessions: [] }));
    const [form, setForm] = useState(() =>
      existing ? { ...existing, days: existing.days?.length ? existing.days.map(d => ({...d, sessions: [...(d.sessions||[])]})) : makeDefaultDays() }
               : { name: "", sport: "swim", weeks: 4, notes: "", days: makeDefaultDays() }
    );
    const [step, setStep] = useState(0);
    const [editingSession, setEditingSession] = useState(null);
    const [sessionForm, setSessionForm] = useState(null);

    const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const addSession = (dayIdx) => {
      const newSess = blankSession(form.sport);
      setForm((f) => {
        const days = f.days.map((d, i) => i === dayIdx ? { ...d, sessions: [...d.sessions, newSess] } : d);
        return { ...f, days };
      });
      setEditingSession({ dayIdx, sessIdx: form.days[dayIdx].sessions.length });
      setSessionForm({ ...newSess });
    };

    const removeSession = (dayIdx, sessIdx) => {
      setForm((f) => {
        const days = f.days.map((d, i) => i === dayIdx ? { ...d, sessions: d.sessions.filter((_, si) => si !== sessIdx) } : d);
        return { ...f, days };
      });
    };

    const openEditSession = (dayIdx, sessIdx) => {
      setEditingSession({ dayIdx, sessIdx });
      setSessionForm({ ...form.days[dayIdx].sessions[sessIdx] });
    };

    const saveSession = () => {
      const { dayIdx, sessIdx } = editingSession;
      setForm((f) => {
        const days = f.days.map((d, i) => {
          if (i !== dayIdx) return d;
          const sessions = d.sessions.map((s2, si) => si === sessIdx ? { ...sessionForm } : s2);
          return { ...d, sessions };
        });
        return { ...f, days };
      });
      setEditingSession(null);
      setSessionForm(null);
    };

    const save = () => {
      if (draft) {
        if (existing) setDrafts((prev) => prev.map((d) => d.id === existing.id ? { ...form } : d));
        else setDrafts((prev) => [...prev, { ...form, id: `d${Date.now()}` }]);
      } else {
        const newC = { ...form, id: existing?.id || `c${Date.now()}`, status: "active", startDate: existing?.startDate || new Date().toISOString().split("T")[0] };
        if (existing) setCycles((prev) => prev.map((c) => c.id === existing.id ? newC : c));
        else setCycles((prev) => prev.map((c) => ({ ...c, status: "complete" })).concat(newC));
      }
      setModal(null);
    };

    if (editingSession && sessionForm) {
      const setSF = (k, v) => setSessionForm((f) => ({ ...f, [k]: v }));
      const dayName = form.days[editingSession.dayIdx]?.day;
      return (
        <div style={s.overlay} onClick={() => { setEditingSession(null); setSessionForm(null); }}>
          <div style={{ ...s.sheet, maxHeight: "85vh" }} onClick={(e) => e.stopPropagation()}>
            <div style={s.grip} />
            <div style={{ ...s.sb, marginBottom: 14 }}>
              <div style={s.h3}>Edit Session · {dayName}</div>
              <button style={s.btnTiny("#f87171")} onClick={() => { removeSession(editingSession.dayIdx, editingSession.sessIdx); setEditingSession(null); setSessionForm(null); }}>Remove</button>
            </div>
            <div style={s.label}>Sport</div>
            <select style={s.select} value={sessionForm.sport} onChange={(e) => setSF("sport", e.target.value)}>
              {Object.keys(SPORT_ICONS).map((k) => <option key={k} value={k}>{SPORT_ICONS[k]} {k.charAt(0).toUpperCase() + k.slice(1)}</option>)}
            </select>
            <div style={s.label}>Title</div>
            <input style={s.input} placeholder="e.g. Morning Endurance" value={sessionForm.title} onChange={(e) => setSF("title", e.target.value)} />
            <div style={s.label}>Distance / Volume</div>
            <input style={s.input} placeholder="e.g. 3000m, 45min" value={sessionForm.distance} onChange={(e) => setSF("distance", e.target.value)} />
            <div style={s.label}>Intensity</div>
            <input style={s.input} placeholder="e.g. Z2, Mod, Max" value={sessionForm.intensity} onChange={(e) => setSF("intensity", e.target.value)} />
            <div style={s.label}>Notes / Sets</div>
            <textarea style={s.textarea} placeholder="Details, intervals, cues..." value={sessionForm.notes} onChange={(e) => setSF("notes", e.target.value)} />
            <button style={s.btn()} onClick={saveSession}>Save Session ✓</button>
            <button style={s.btn("secondary")} onClick={() => { setEditingSession(null); setSessionForm(null); }}>Cancel</button>
          </div>
        </div>
      );
    }

    return (
      <div style={s.overlay} onClick={() => setModal(null)}>
        <div style={{ ...s.sheet, maxHeight: "92vh" }} onClick={(e) => e.stopPropagation()}>
          <div style={s.grip} />
          <div style={s.sb}>
            <div style={s.h3}>{existing ? "Edit" : draft ? "New Draft" : "New Cycle"}</div>
            <div style={s.label}>{step === 0 ? "1/2 Info" : "2/2 Schedule"}</div>
          </div>
          <div style={{ margin: "10px 0 6px", height: 4, background: "#0a131d", borderRadius: 2 }}>
            <div style={{ width: step === 0 ? "50%" : "100%", height: "100%", background: "#00d4ff", borderRadius: 2, transition: "width 0.3s" }} />
          </div>
          {step === 0 ? (
            <>
              <div style={s.label}>Cycle Name</div>
              <input style={s.input} placeholder="e.g. Spring Base Build" value={form.name} onChange={(e) => setField("name", e.target.value)} />
              <div style={s.label}>Primary Sport</div>
              <select style={s.select} value={form.sport} onChange={(e) => setField("sport", e.target.value)}>
                {Object.keys(SPORT_ICONS).map((k) => <option key={k} value={k}>{SPORT_ICONS[k]} {k.charAt(0).toUpperCase() + k.slice(1)}</option>)}
              </select>
              <div style={s.label}>Duration (weeks)</div>
              <input style={s.input} type="number" min={1} max={52} value={form.weeks} onChange={(e) => setField("weeks", e.target.value)} />
              <div style={s.label}>Notes / Goals</div>
              <textarea style={s.textarea} placeholder="What's the focus of this block?" value={form.notes} onChange={(e) => setField("notes", e.target.value)} />
              <button style={s.btn()} onClick={() => setStep(1)}>Next: Build Schedule →</button>
            </>
          ) : (
            <>
              <div style={{ ...s.sub, marginBottom: 12, fontSize: 12 }}>
                Tap <strong style={{ color: "#00d4ff" }}>+ Session</strong> on any day. Each day supports unlimited sessions.
              </div>
              {form.days.map((day, dayIdx) => (
                <div key={day.day} style={{ marginBottom: 14 }}>
                  <div style={{ ...s.sb, marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "#4a7a9a" }}>{day.day.toUpperCase()}</div>
                    <button style={s.btnTiny()} onClick={() => addSession(dayIdx)}>+ Session</button>
                  </div>
                  {day.sessions.length === 0 && (
                    <div style={{ ...s.card, padding: "8px 12px", opacity: 0.4, fontSize: 13, color: "#4a6a7a" }}>😴 Rest — tap + Session to add</div>
                  )}
                  {day.sessions.map((sess, sessIdx) => {
                    const color = SPORT_COLORS[sess.sport] || "#00d4ff";
                    return (
                      <div key={sess.id} style={{ ...s.cardAccent(color), padding: "8px 12px", cursor: "pointer" }} onClick={() => openEditSession(dayIdx, sessIdx)}>
                        <div style={s.sb}>
                          <div style={s.row}>
                            <span style={{ fontSize: 18 }}>{SPORT_ICONS[sess.sport]}</span>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700 }}>{sess.title || "(untitled)"}</div>
                              {(sess.distance || sess.intensity) && <div style={{ fontSize: 11, color: "#4a7a8a" }}>{[sess.distance, sess.intensity].filter(Boolean).join(" · ")}</div>}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontSize: 11, color: "#3a6a7a" }}>edit</span>
                            <button style={{ ...s.btnTiny("#f87171"), padding: "2px 7px" }} onClick={(e) => { e.stopPropagation(); removeSession(dayIdx, sessIdx); }}>✕</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button style={{ ...s.btn("secondary"), flex: 1 }} onClick={() => setStep(0)}>← Back</button>
                <button style={{ ...s.btn(), flex: 2 }} onClick={save}>{draft ? "Save Draft" : "Activate Cycle"}</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const PastCycleModal = ({ data }) => (
    <div style={s.overlay} onClick={() => setModal(null)}>
      <div style={s.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={s.grip} />
        <div style={s.pill("#4ade80")}>COMPLETED</div>
        <div style={{ ...s.h2, marginTop: 8 }}>{SPORT_ICONS[data.sport]} {data.name}</div>
        <div style={s.sub}>{data.weeks} weeks · {new Date(data.startDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
        {data.notes && <div style={{ ...s.sub, margin: "10px 0" }}>{data.notes}</div>}
        {data.summary && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, margin: "16px 0" }}>
            {[{ k: "Swim", v: `${data.summary.swimKm}km`, c: "#00d4ff" }, { k: "Run", v: `${data.summary.runKm}km`, c: "#ff6b35" }, { k: "Sessions", v: data.summary.totalSessions, c: "#e8f4f8" }].map((x) => (
              <div key={x.k} style={{ ...s.card, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: x.c }}>{x.v}</div>
                <div style={{ fontSize: 10, color: "#4a7a8a", letterSpacing: 1 }}>{x.k}</div>
              </div>
            ))}
          </div>
        )}
        {data.summary?.topSet && <div style={s.card}><div style={s.label}>Top Set</div><div style={{ fontWeight: 700, fontSize: 15 }}>{data.summary.topSet}</div></div>}
        <button style={s.btn("secondary")} onClick={() => setModal(null)}>Close</button>
      </div>
    </div>
  );

  return (
    <div style={s.root}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={s.header}>
        <div>
          <div style={s.logo}>⚡ LAPLOG</div>
          <div style={s.dateStr}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" }).toUpperCase()}</div>
        </div>
        {activeCycle && <div style={s.pill(SPORT_COLORS[activeCycle.sport])}>{SPORT_ICONS[activeCycle.sport]} {activeCycle.name.split(" ")[0]}</div>}
      </div>
      <div style={s.nav}>
        {[["today", "Today"], ["schedule", "Schedule"], ["cycles", "Cycles"], ["stats", "Stats"]].map(([id, label]) => (
          <button key={id} style={s.navBtn(tab === id)} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      {tab === "today" && <TodayTab />}
      {tab === "schedule" && <ScheduleTab />}
      {tab === "cycles" && <CyclesTab />}
      {tab === "stats" && <StatsTab />}
      {modal?.type === "workout" && <WorkoutModal data={modal.data} />}
      {modal?.type === "dayDetail" && <DayDetailModal data={modal.data} />}
      {modal?.type === "newCycle" && <CycleEditorModal />}
      {modal?.type === "newDraft" && <CycleEditorModal draft />}
      {modal?.type === "editCycle" && <CycleEditorModal existing={modal.data} draft={modal.draft} />}
      {modal?.type === "pastCycle" && <PastCycleModal data={modal.data} />}
    </div>
  );
}
