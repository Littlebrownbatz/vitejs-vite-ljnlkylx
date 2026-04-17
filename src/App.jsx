import { useState, useEffect } from "react";

const SPORT_ICONS = {
  swim: "🏊",
  run: "🏃",
  bike: "🚴",
  lift: "🏋️",
  yoga: "🧘",
  rest: "😴",
  cross: "⚡",
  drill: "🎯",
};

const SPORT_COLORS = {
  swim: "#00d4ff",
  run: "#ff6b35",
  bike: "#a8ff3e",
  lift: "#ff3e9d",
  yoga: "#c084fc",
  rest: "#4ade80",
  cross: "#fbbf24",
  drill: "#f87171",
};

const INITIAL_CYCLES = [
  {
    id: "c1",
    name: "Base Build — Spring",
    status: "active",
    weeks: 4,
    startDate: "2026-04-14",
    sport: "swim",
    notes: "Focus on aerobic base. Long slow distance, drills every session.",
    days: [
      { day: "Mon", sport: "swim", title: "Endurance Set", distance: "4000m", intensity: "Z2", notes: "4×1000 on 1:20/100" },
      { day: "Tue", sport: "run", title: "Easy Run", distance: "6km", intensity: "Z1", notes: "Recovery pace, flat route" },
      { day: "Wed", sport: "swim", title: "Drill Focus", distance: "3000m", intensity: "Z1", notes: "Catch-up, fingertip drag, sculling" },
      { day: "Thu", sport: "lift", title: "Strength A", distance: "", intensity: "Mod", notes: "Pull: lat pull, rows, core" },
      { day: "Fri", sport: "swim", title: "Threshold", distance: "3500m", intensity: "Z3", notes: "10×200 on 3:00" },
      { day: "Sat", sport: "run", title: "Long Run", distance: "12km", intensity: "Z2", notes: "Aerobic long effort" },
      { day: "Sun", sport: "rest", title: "Rest / Mobility", distance: "", intensity: "", notes: "Foam roll, stretch 20min" },
    ],
  },
];

const DRAFT_CYCLES = [
  {
    id: "d1",
    name: "Taper Week",
    sport: "swim",
    notes: "Pre-meet taper. Cut volume 40%, maintain intensity.",
    days: [
      { day: "Mon", sport: "swim", title: "Easy Swim", distance: "2000m", intensity: "Z1", notes: "Feel the water" },
      { day: "Tue", sport: "run", title: "Short Shakeout", distance: "3km", intensity: "Z1", notes: "" },
      { day: "Wed", sport: "swim", title: "Race Pace", distance: "2500m", intensity: "Z4", notes: "Short race pace reps" },
      { day: "Thu", sport: "rest", title: "Rest", distance: "", intensity: "", notes: "" },
      { day: "Fri", sport: "swim", title: "Activation", distance: "1500m", intensity: "Z2", notes: "Warm up for tomorrow" },
      { day: "Sat", sport: "swim", title: "RACE DAY", distance: "", intensity: "MAX", notes: "🏆 Competition" },
      { day: "Sun", sport: "rest", title: "Recovery", distance: "", intensity: "", notes: "Sleep, eat, reflect" },
    ],
  },
];

const PAST_CYCLES = [
  {
    id: "p1",
    name: "Winter Foundation",
    status: "complete",
    weeks: 6,
    startDate: "2026-01-06",
    sport: "swim",
    notes: "Rebuilt base after holiday break.",
    days: [],
    summary: { totalSessions: 36, swimKm: 98, runKm: 45, topSet: "20×100 on 1:30" },
  },
  {
    id: "p2",
    name: "Speed Block",
    status: "complete",
    weeks: 3,
    startDate: "2026-03-02",
    sport: "swim",
    notes: "High intensity, max quality work.",
    days: [],
    summary: { totalSessions: 21, swimKm: 52, runKm: 18, topSet: "30×50 sprint" },
  },
];

const DAYS_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getTodayDay() {
  const d = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return d[new Date().getDay()];
}

export default function App() {
  const [tab, setTab] = useState("today");
  const [cycles, setCycles] = useState(INITIAL_CYCLES);
  const [drafts, setDrafts] = useState(DRAFT_CYCLES);
  const [past] = useState(PAST_CYCLES);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [editingDraft, setEditingDraft] = useState(null);
  const [modal, setModal] = useState(null); // { type, data }
  const [newCycleFlow, setNewCycleFlow] = useState(false);

  const activeCycle = cycles.find((c) => c.status === "active") || null;
  const todayDay = getTodayDay();
  const todayWorkout = activeCycle?.days?.find((d) => d.day === todayDay);

  // --- STYLES ---
  const s = {
    root: {
      fontFamily: "'Barlow Condensed', sans-serif",
      background: "#080e1a",
      minHeight: "100vh",
      color: "#e8f4f8",
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    },
    header: {
      padding: "20px 20px 10px",
      borderBottom: "1px solid #1a2a3a",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      fontSize: 22,
      fontWeight: 800,
      letterSpacing: 2,
      color: "#00d4ff",
      textTransform: "uppercase",
    },
    dateStr: { fontSize: 12, color: "#4a7a8a", letterSpacing: 1 },
    nav: {
      display: "flex",
      borderBottom: "1px solid #1a2a3a",
      background: "#080e1a",
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    navBtn: (active) => ({
      flex: 1,
      padding: "12px 2px",
      background: "none",
      border: "none",
      color: active ? "#00d4ff" : "#3a5a6a",
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      cursor: "pointer",
      borderBottom: active ? "2px solid #00d4ff" : "2px solid transparent",
      transition: "all 0.2s",
    }),
    page: { padding: "16px 16px 100px", overflowY: "auto" },
    card: {
      background: "#0d1824",
      border: "1px solid #1a2a3a",
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    cardAccent: (color) => ({
      background: "#0d1824",
      border: `1px solid ${color}40`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    }),
    label: {
      fontSize: 10,
      letterSpacing: 2,
      color: "#3a6a7a",
      textTransform: "uppercase",
      marginBottom: 4,
    },
    h1: { fontSize: 28, fontWeight: 800, letterSpacing: 1, lineHeight: 1.1 },
    h2: { fontSize: 20, fontWeight: 700, letterSpacing: 0.5 },
    h3: { fontSize: 16, fontWeight: 700 },
    sub: { fontSize: 13, color: "#4a8a9a", lineHeight: 1.4 },
    pill: (color) => ({
      display: "inline-block",
      background: `${color}22`,
      color,
      border: `1px solid ${color}55`,
      borderRadius: 20,
      padding: "2px 10px",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 1,
    }),
    btn: (variant = "primary") => ({
      display: "block",
      width: "100%",
      padding: "13px 20px",
      borderRadius: 10,
      border: variant === "primary" ? "none" : "1px solid #1a3a4a",
      background:
        variant === "primary"
          ? "linear-gradient(135deg, #00d4ff, #0090b0)"
          : "#0d1824",
      color: variant === "primary" ? "#000" : "#00d4ff",
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: 2,
      textTransform: "uppercase",
      cursor: "pointer",
      marginBottom: 10,
    }),
    btnSm: (color = "#00d4ff") => ({
      padding: "7px 14px",
      borderRadius: 8,
      border: `1px solid ${color}55`,
      background: `${color}15`,
      color,
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 1,
      cursor: "pointer",
    }),
    row: { display: "flex", alignItems: "center", gap: 10 },
    spaceBetween: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    dayRow: (isToday, sport) => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      borderRadius: 8,
      background: isToday ? `${SPORT_COLORS[sport] || "#00d4ff"}15` : "#0a131d",
      border: isToday ? `1px solid ${SPORT_COLORS[sport] || "#00d4ff"}40` : "1px solid transparent",
      marginBottom: 6,
      cursor: "pointer",
      transition: "all 0.15s",
    }),
    input: {
      width: "100%",
      background: "#0a131d",
      border: "1px solid #1a3a4a",
      borderRadius: 8,
      padding: "10px 12px",
      color: "#e8f4f8",
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 14,
      marginBottom: 10,
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      background: "#0a131d",
      border: "1px solid #1a3a4a",
      borderRadius: 8,
      padding: "10px 12px",
      color: "#e8f4f8",
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 14,
      marginBottom: 10,
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      background: "#0a131d",
      border: "1px solid #1a3a4a",
      borderRadius: 8,
      padding: "10px 12px",
      color: "#e8f4f8",
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 13,
      marginBottom: 10,
      boxSizing: "border-box",
      resize: "vertical",
      minHeight: 60,
    },
    overlay: {
      position: "fixed",
      inset: 0,
      background: "#000000cc",
      zIndex: 50,
      display: "flex",
      alignItems: "flex-end",
      maxWidth: 430,
      margin: "0 auto",
    },
    sheet: {
      background: "#0d1824",
      border: "1px solid #1a2a3a",
      borderRadius: "20px 20px 0 0",
      padding: 20,
      width: "100%",
      maxHeight: "85vh",
      overflowY: "auto",
    },
    grip: {
      width: 40,
      height: 4,
      background: "#1a3a4a",
      borderRadius: 2,
      margin: "0 auto 16px",
    },
  };

  // ---- TODAY TAB ----
  const TodayTab = () => (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{ marginBottom: 20 }}>
        <div style={s.label}>Today — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
        {todayWorkout ? (
          <div
            style={{
              ...s.cardAccent(SPORT_COLORS[todayWorkout.sport] || "#00d4ff"),
              cursor: "pointer",
            }}
            onClick={() => setModal({ type: "workout", data: todayWorkout })}
          >
            <div style={s.spaceBetween}>
              <div>
                <div style={s.label}>{activeCycle?.name}</div>
                <div style={{ ...s.h1, fontSize: 32 }}>
                  {SPORT_ICONS[todayWorkout.sport]} {todayWorkout.title}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                {todayWorkout.distance && (
                  <div style={{ fontSize: 24, fontWeight: 800, color: SPORT_COLORS[todayWorkout.sport] }}>
                    {todayWorkout.distance}
                  </div>
                )}
                {todayWorkout.intensity && (
                  <div style={s.pill(SPORT_COLORS[todayWorkout.sport])}>{todayWorkout.intensity}</div>
                )}
              </div>
            </div>
            {todayWorkout.notes && (
              <div style={{ ...s.sub, marginTop: 10, color: "#7ab0bc" }}>{todayWorkout.notes}</div>
            )}
            <div style={{ marginTop: 12, ...s.label }}>Tap for full details →</div>
          </div>
        ) : (
          <div style={s.card}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>😴</div>
            <div style={s.h2}>Rest Day</div>
            <div style={s.sub}>No workout scheduled. Recover well.</div>
          </div>
        )}
      </div>

      {activeCycle && (
        <div style={s.card}>
          <div style={s.label}>This Week — {activeCycle.name}</div>
          {DAYS_ORDER.map((d) => {
            const w = activeCycle.days.find((x) => x.day === d);
            const isToday = d === todayDay;
            return (
              <div
                key={d}
                style={s.dayRow(isToday, w?.sport || "rest")}
                onClick={() => w && setModal({ type: "workout", data: w })}
              >
                <div style={{ width: 36, fontSize: 11, fontWeight: 700, color: isToday ? "#00d4ff" : "#3a5a6a", letterSpacing: 1 }}>
                  {d}
                </div>
                <div style={{ fontSize: 18 }}>{SPORT_ICONS[w?.sport || "rest"]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isToday ? "#e8f4f8" : "#8ab0bc" }}>
                    {w?.title || "Rest"}
                  </div>
                  {w?.distance && <div style={{ fontSize: 11, color: "#4a7a8a" }}>{w.distance}</div>}
                </div>
                {w?.intensity && (
                  <div style={{ fontSize: 11, color: SPORT_COLORS[w.sport], fontWeight: 700 }}>{w.intensity}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!activeCycle && (
        <div style={{ ...s.card, textAlign: "center", padding: 30 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏊</div>
          <div style={s.h2}>No Active Cycle</div>
          <div style={{ ...s.sub, marginBottom: 16 }}>Head to Cycles to start a new training block.</div>
          <button style={s.btn()} onClick={() => setTab("cycles")}>Go to Cycles</button>
        </div>
      )}
    </div>
  );

  // ---- CYCLES TAB ----
  const CyclesTab = () => (
    <div style={s.page}>
      <div style={{ ...s.spaceBetween, marginBottom: 16 }}>
        <div style={s.h2}>Training Cycles</div>
        <button style={s.btnSm()} onClick={() => setModal({ type: "newCycle" })}>+ New</button>
      </div>

      {cycles.length > 0 && (
        <>
          <div style={s.label}>Active</div>
          {cycles.map((c) => (
            <div key={c.id} style={s.cardAccent(SPORT_COLORS[c.sport])} onClick={() => setSelectedCycle(c)}>
              <div style={s.spaceBetween}>
                <div>
                  <div style={s.h3}>{SPORT_ICONS[c.sport]} {c.name}</div>
                  <div style={{ ...s.sub, marginTop: 4 }}>{c.weeks}w · started {new Date(c.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
                <div style={s.pill(SPORT_COLORS[c.sport])}>ACTIVE</div>
              </div>
              {c.notes && <div style={{ ...s.sub, marginTop: 8, fontSize: 12 }}>{c.notes}</div>}
              <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                <button style={s.btnSm(SPORT_COLORS[c.sport])} onClick={(e) => { e.stopPropagation(); setSelectedCycle(c); }}>View Schedule</button>
                <button style={s.btnSm("#ff6b35")} onClick={(e) => { e.stopPropagation(); setModal({ type: "editCycle", data: c }); }}>Edit</button>
              </div>
            </div>
          ))}
        </>
      )}

      <div style={{ ...s.spaceBetween, marginTop: 16, marginBottom: 8 }}>
        <div style={s.label}>Draft Cycles</div>
        <button style={s.btnSm("#fbbf24")} onClick={() => setModal({ type: "newDraft" })}>+ Draft</button>
      </div>
      {drafts.length === 0 && <div style={{ ...s.sub, marginBottom: 12 }}>No drafts yet.</div>}
      {drafts.map((d) => (
        <div key={d.id} style={s.card}>
          <div style={s.spaceBetween}>
            <div>
              <div style={s.h3}>{SPORT_ICONS[d.sport]} {d.name}</div>
              <div style={{ ...s.sub, marginTop: 4, fontSize: 12 }}>{d.notes}</div>
            </div>
            <div style={s.pill("#fbbf24")}>DRAFT</div>
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
            <button style={s.btnSm("#fbbf24")} onClick={() => setModal({ type: "viewDraft", data: d })}>View</button>
            <button style={s.btnSm("#4ade80")} onClick={() => {
              const active = { ...d, id: `c${Date.now()}`, status: "active", weeks: 4, startDate: new Date().toISOString().split("T")[0] };
              setCycles((prev) => prev.map((c) => ({ ...c, status: "complete" })).concat(active));
              setDrafts((prev) => prev.filter((x) => x.id !== d.id));
            }}>Activate</button>
            <button style={s.btnSm("#f87171")} onClick={() => setDrafts((prev) => prev.filter((x) => x.id !== d.id))}>Delete</button>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 16, marginBottom: 8 }}>
        <div style={s.label}>Past Cycles</div>
      </div>
      {past.map((c) => (
        <div key={c.id} style={s.card} onClick={() => setModal({ type: "pastCycle", data: c })}>
          <div style={s.spaceBetween}>
            <div>
              <div style={s.h3}>{SPORT_ICONS[c.sport]} {c.name}</div>
              <div style={{ ...s.sub, marginTop: 4 }}>{c.weeks}w · {new Date(c.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</div>
            </div>
            <div style={s.pill("#4ade80")}>DONE</div>
          </div>
          {c.summary && (
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#00d4ff" }}>{c.summary.swimKm}km</div>
                <div style={{ fontSize: 10, color: "#4a7a8a", letterSpacing: 1 }}>SWIM</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#ff6b35" }}>{c.summary.runKm}km</div>
                <div style={{ fontSize: 10, color: "#4a7a8a", letterSpacing: 1 }}>RUN</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#e8f4f8" }}>{c.summary.totalSessions}</div>
                <div style={{ fontSize: 10, color: "#4a7a8a", letterSpacing: 1 }}>SESSIONS</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // ---- SCHEDULE TAB (selected cycle week view) ----
  const ScheduleTab = () => {
    const c = selectedCycle || activeCycle;
    if (!c) return (
      <div style={{ ...s.page, textAlign: "center", paddingTop: 60 }}>
        <div style={{ fontSize: 48 }}>📅</div>
        <div style={{ ...s.h2, marginTop: 12 }}>No Cycle Selected</div>
        <div style={{ ...s.sub, marginBottom: 20 }}>Go to Cycles to select or create one.</div>
        <button style={s.btn()} onClick={() => setTab("cycles")}>Go to Cycles</button>
      </div>
    );
    return (
      <div style={s.page}>
        <div style={{ ...s.spaceBetween, marginBottom: 4 }}>
          <div>
            <div style={s.label}>Weekly Schedule</div>
            <div style={s.h2}>{c.name}</div>
          </div>
          <button style={s.btnSm()} onClick={() => setModal({ type: "editCycle", data: c })}>Edit</button>
        </div>
        <div style={{ ...s.sub, marginBottom: 16 }}>{c.notes}</div>

        {DAYS_ORDER.map((d) => {
          const w = c.days.find((x) => x.day === d);
          const isToday = d === todayDay && c.status === "active";
          const color = SPORT_COLORS[w?.sport || "rest"];
          return (
            <div
              key={d}
              style={{
                ...s.cardAccent(color),
                opacity: w ? 1 : 0.5,
                cursor: w ? "pointer" : "default",
              }}
              onClick={() => w && setModal({ type: "workout", data: w })}
            >
              <div style={s.spaceBetween}>
                <div style={s.row}>
                  <div style={{ fontSize: 24 }}>{SPORT_ICONS[w?.sport || "rest"]}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: isToday ? "#00d4ff" : "#4a6a7a", letterSpacing: 2 }}>
                      {d.toUpperCase()}{isToday ? " — TODAY" : ""}
                    </div>
                    <div style={{ fontSize: 17, fontWeight: 700 }}>{w?.title || "Rest"}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {w?.distance && <div style={{ fontSize: 15, fontWeight: 800, color }}>{w.distance}</div>}
                  {w?.intensity && <div style={s.pill(color)}>{w.intensity}</div>}
                </div>
              </div>
              {w?.notes && <div style={{ ...s.sub, fontSize: 12, marginTop: 6 }}>{w.notes}</div>}
            </div>
          );
        })}
      </div>
    );
  };

  // ---- STATS TAB ----
  const StatsTab = () => {
    const allCycles = [...past, ...cycles.filter((c) => c.status === "complete")];
    return (
      <div style={s.page}>
        <div style={s.label}>Training Stats</div>
        <div style={s.h2}>Your History</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0" }}>
          {[
            { label: "Total Cycles", value: allCycles.length + cycles.filter((c) => c.status === "active").length, color: "#00d4ff" },
            { label: "Swim Sessions", value: "57", color: "#00d4ff" },
            { label: "Run Sessions", value: "22", color: "#ff6b35" },
            { label: "Strength Days", value: "18", color: "#ff3e9d" },
          ].map((s2) => (
            <div key={s2.label} style={{ ...s.card, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: s2.color }}>{s2.value}</div>
              <div style={{ fontSize: 11, color: "#4a7a8a", letterSpacing: 1, textTransform: "uppercase" }}>{s2.label}</div>
            </div>
          ))}
        </div>

        <div style={s.label}>Completed Cycles</div>
        {allCycles.map((c) => (
          <div key={c.id} style={s.card}>
            <div style={s.spaceBetween}>
              <div style={s.h3}>{SPORT_ICONS[c.sport]} {c.name}</div>
              <div style={{ ...s.sub, fontSize: 12 }}>{new Date(c.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</div>
            </div>
            {c.summary && (
              <>
                <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                  <div><span style={{ color: "#00d4ff", fontWeight: 800 }}>{c.summary.swimKm}km</span> <span style={{ color: "#4a7a8a", fontSize: 12 }}>swim</span></div>
                  <div><span style={{ color: "#ff6b35", fontWeight: 800 }}>{c.summary.runKm}km</span> <span style={{ color: "#4a7a8a", fontSize: 12 }}>run</span></div>
                  <div><span style={{ color: "#e8f4f8", fontWeight: 800 }}>{c.summary.totalSessions}</span> <span style={{ color: "#4a7a8a", fontSize: 12 }}>sessions</span></div>
                </div>
                <div style={{ ...s.sub, marginTop: 6, fontSize: 12 }}>Top set: {c.summary.topSet}</div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  // ---- MODALS ----
  const WorkoutModal = ({ data }) => (
    <div style={s.overlay} onClick={() => setModal(null)}>
      <div style={s.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={s.grip} />
        <div style={s.row}>
          <div style={{ fontSize: 36 }}>{SPORT_ICONS[data.sport]}</div>
          <div>
            <div style={s.label}>{data.day}</div>
            <div style={s.h2}>{data.title}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, margin: "12px 0" }}>
          {data.distance && <div style={s.pill(SPORT_COLORS[data.sport])}>{data.distance}</div>}
          {data.intensity && <div style={s.pill(SPORT_COLORS[data.sport])}>{data.intensity}</div>}
          <div style={s.pill("#3a5a6a")}>{data.sport.toUpperCase()}</div>
        </div>
        {data.notes && (
          <div style={{ ...s.card, background: "#0a131d" }}>
            <div style={s.label}>Notes / Details</div>
            <div style={{ fontSize: 15, lineHeight: 1.6 }}>{data.notes}</div>
          </div>
        )}
        <button style={s.btn("secondary")} onClick={() => setModal(null)}>Close</button>
      </div>
    </div>
  );

  const NewCycleModal = ({ draft = false, existing = null }) => {
    const [form, setForm] = useState(existing || {
      name: "", sport: "swim", weeks: 4, notes: "",
      days: DAYS_ORDER.map((d) => ({ day: d, sport: "swim", title: "", distance: "", intensity: "", notes: "" })),
    });
    const [step, setStep] = useState(0);

    const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const setDayField = (idx, k, v) => setForm((f) => {
      const days = [...f.days];
      days[idx] = { ...days[idx], [k]: v };
      return { ...f, days };
    });

    const save = () => {
      if (draft) {
        if (existing) {
          setDrafts((prev) => prev.map((d) => d.id === existing.id ? { ...form } : d));
        } else {
          setDrafts((prev) => [...prev, { ...form, id: `d${Date.now()}` }]);
        }
      } else {
        const newC = { ...form, id: `c${Date.now()}`, status: "active", startDate: new Date().toISOString().split("T")[0] };
        setCycles((prev) => prev.map((c) => ({ ...c, status: "complete" })).concat(newC));
      }
      setModal(null);
    };

    return (
      <div style={s.overlay} onClick={() => setModal(null)}>
        <div style={{ ...s.sheet, maxHeight: "90vh" }} onClick={(e) => e.stopPropagation()}>
          <div style={s.grip} />
          <div style={s.spaceBetween}>
            <div style={s.h3}>{existing ? "Edit" : draft ? "New Draft" : "New Cycle"}</div>
            <div style={{ ...s.label }}>{step === 0 ? "Step 1/2: Info" : "Step 2/2: Schedule"}</div>
          </div>
          <div style={{ margin: "12px 0 6px", height: 4, background: "#0a131d", borderRadius: 2 }}>
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
              <button style={s.btn()} onClick={() => setStep(1)}>Next →</button>
            </>
          ) : (
            <>
              <div style={{ ...s.sub, marginBottom: 10 }}>Set each day's workout for the repeating weekly template.</div>
              {form.days.map((day, i) => (
                <div key={day.day} style={{ ...s.card, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ fontWeight: 800, color: "#00d4ff", letterSpacing: 2, fontSize: 12, marginBottom: 6 }}>{day.day.toUpperCase()}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    <select style={{ ...s.select, marginBottom: 0 }} value={day.sport} onChange={(e) => setDayField(i, "sport", e.target.value)}>
                      {Object.keys(SPORT_ICONS).map((k) => <option key={k} value={k}>{SPORT_ICONS[k]} {k}</option>)}
                    </select>
                    <input style={{ ...s.input, marginBottom: 0 }} placeholder="Title" value={day.title} onChange={(e) => setDayField(i, "title", e.target.value)} />
                    <input style={{ ...s.input, marginBottom: 0 }} placeholder="Distance (e.g. 3000m)" value={day.distance} onChange={(e) => setDayField(i, "distance", e.target.value)} />
                    <input style={{ ...s.input, marginBottom: 0 }} placeholder="Intensity (Z2, Mod…)" value={day.intensity} onChange={(e) => setDayField(i, "intensity", e.target.value)} />
                  </div>
                  <input style={{ ...s.input, marginTop: 6, marginBottom: 0 }} placeholder="Notes / sets" value={day.notes} onChange={(e) => setDayField(i, "notes", e.target.value)} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button style={{ ...s.btn("secondary"), flex: 1 }} onClick={() => setStep(0)}>← Back</button>
                <button style={{ ...s.btn(), flex: 2 }} onClick={save}>
                  {draft ? "Save Draft" : "Activate Cycle"}
                </button>
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
            {[
              { k: "Swim", v: `${data.summary.swimKm}km`, c: "#00d4ff" },
              { k: "Run", v: `${data.summary.runKm}km`, c: "#ff6b35" },
              { k: "Sessions", v: data.summary.totalSessions, c: "#e8f4f8" },
            ].map((x) => (
              <div key={x.k} style={{ ...s.card, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: x.c }}>{x.v}</div>
                <div style={{ fontSize: 10, color: "#4a7a8a", letterSpacing: 1 }}>{x.k}</div>
              </div>
            ))}
          </div>
        )}
        {data.summary?.topSet && (
          <div style={s.card}>
            <div style={s.label}>Top Set</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{data.summary.topSet}</div>
          </div>
        )}
        <button style={s.btn("secondary")} onClick={() => setModal(null)}>Close</button>
      </div>
    </div>
  );

  return (
    <div style={s.root}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.logo}>⚡ LAPLOG</div>
          <div style={s.dateStr}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" }).toUpperCase()}</div>
        </div>
        {activeCycle && (
          <div style={s.pill(SPORT_COLORS[activeCycle.sport])}>
            {SPORT_ICONS[activeCycle.sport]} {activeCycle.name.split(" ")[0]}
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={s.nav}>
        {[["today", "Today"], ["schedule", "Schedule"], ["cycles", "Cycles"], ["stats", "Stats"]].map(([id, label]) => (
          <button key={id} style={s.navBtn(tab === id)} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {/* Pages */}
      {tab === "today" && <TodayTab />}
      {tab === "schedule" && <ScheduleTab />}
      {tab === "cycles" && <CyclesTab />}
      {tab === "stats" && <StatsTab />}

      {/* Modals */}
      {modal?.type === "workout" && <WorkoutModal data={modal.data} />}
      {modal?.type === "newCycle" && <NewCycleModal />}
      {modal?.type === "newDraft" && <NewCycleModal draft />}
      {modal?.type === "editCycle" && <NewCycleModal existing={modal.data} draft={modal.data?.status === undefined} />}
      {modal?.type === "viewDraft" && <NewCycleModal draft existing={modal.data} />}
      {modal?.type === "pastCycle" && <PastCycleModal data={modal.data} />}
    </div>
  );
}
