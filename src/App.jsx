import { useState, useEffect, useMemo } from 'react'
import { START, DAYS, CATS, ST, HR, MERN, SYLLABUS, TOPICS, PLAN, key, dowOf, fmt, idxOf } from './data'

const KEY = 'cpt-v1'
const PAGES = ['Dashboard', 'Today', 'Calendar', 'DSA', 'Interview', 'HR', 'MERN Interview', 'Projects', 'Certificates', 'Hackathons', 'Jobs', 'Progress', 'Settings']
const BASE = { settings: { goal: 240, theme: null }, done: {}, ts: {}, notes: {}, dsa: {}, lists: { projects: [], certs: [], hacks: [], jobs: [] } }
const merge = p => ({ ...BASE, ...p, settings: { ...BASE.settings, ...p.settings }, lists: { ...BASE.lists, ...p.lists } })
const load = () => { try { return merge(JSON.parse(localStorage.getItem(KEY)) || {}) } catch { return merge({}) } }
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0)
const W = [0, 1 / 3, 2 / 3, 1]

function Bar({ v }) { return <div className="bar"><i style={{ width: v + '%' }} /></div> }
function Sel({ v, set, o }) { return <select value={v} onChange={e => set(e.target.value)}>{o.map(x => <option key={x}>{x}</option>)}</select> }

function Tasks({ d, x }) {
  const future = d > x.ti
  return <ul className="tasks">{(PLAN[d] || []).map(t => {
    const on = !!x.s.done[key(d)]?.[t.id]
    return <li key={t.id} className={on ? 'on' : ''}>
      <label><input type="checkbox" checked={on} disabled={future} onChange={() => x.toggle(d, t.id)} /><span>{t.text}</span></label>
      <b className="cat" style={{ background: CATS[t.cat] }}>{t.cat}</b>
      <span className="muted">{t.min} min</span>
      <span className={'state ' + (on ? 'ok' : '')}>{on ? 'Completed' : future ? 'Upcoming' : 'Pending'}</span>
    </li>
  })}</ul>
}

function Heatmap({ x }) {
  const cols = Math.ceil((DAYS + 6) / 7)
  const cells = []
  for (let c = 0; c < cols; c++) for (let r = 0; r < 7; r++) {
    const d = c * 7 + r - 6
    if (d < 0 || d >= DAYS) { cells.push(<i key={c + '-' + r} className="cell blank" />); continue }
    const n = d <= x.ti ? x.cnt(d) : 0
    const lv = n === 0 ? 0 : n < 3 ? 1 : n < 5 ? 2 : 3
    cells.push(<button key={c + '-' + r} className={`cell l${lv} ${d > x.ti ? 'future' : ''}`} title={`${fmt(d, { day: 'numeric', month: 'short' })}: ${n} done`} aria-label={`${key(d)} ${n} tasks done`} onClick={() => { x.setSel(d); x.go('Calendar') }} />)
  }
  return <div className="heat">{cells}</div>
}

function Today({ x }) {
  const { ti, s } = x
  if (ti < 0) return <div className="card"><h2>Starts 3 October 2026</h2><p className="muted">{-ti} day(s) to go. Nothing is counted before the start date.</p></div>
  if (ti >= DAYS) return <div className="card"><h2>Plan finished</h2><p className="muted">The 60-day plan ended on {fmt(DAYS - 1)}. Use the Calendar to review any day.</p></div>
  const tasks = PLAN[ti], done = x.cnt(ti)
  const mins = tasks.filter(t => s.done[key(ti)]?.[t.id]).reduce((a, t) => a + t.min, 0)
  return <>
    <div className="card"><h2>{fmt(ti)}</h2>
      <p className="muted">Day {ti + 1} of {DAYS}</p>
      <div className="row"><strong data-testid="today-pct">{pct(done, tasks.length)}%</strong><span>{done}/{tasks.length} tasks</span></div>
      <Bar v={pct(done, tasks.length)} />
      <p className="muted">{mins} of {s.settings.goal} min daily goal</p><Bar v={Math.min(100, pct(mins, s.settings.goal))} /></div>
    <div className="card"><Tasks d={ti} x={x} /></div>
  </>
}

function Dashboard({ x }) {
  const st = x.stats, t = PLAN[x.ti] || []
  return <>
    <div className="stats">
      {[['Current streak', st.cur], ['Longest streak', st.longest], ['Active days', st.active], ['Tasks completed', st.total], ['Today', t.length ? pct(x.cnt(x.ti), t.length) + '%' : '–']].map(([k, v]) =>
        <div className="card stat" key={k}><span className="muted">{k}</span><strong>{v}</strong></div>)}
    </div>
    <div className="card"><h3>Activity</h3><Heatmap x={x} /><p className="muted">Tracking from {fmt(0, { day: 'numeric', month: 'long', year: 'numeric' })}. Click a day to open it.</p></div>
    {t.length > 0 && <div className="card"><h3>Today</h3><Tasks d={x.ti} x={x} /></div>}
  </>
}

function Calendar({ x }) {
  const d = x.sel ?? Math.min(Math.max(x.ti, 0), DAYS - 1)
  const [m, setM] = useState(() => { const t = new Date(START + d * 864e5); return { y: t.getUTCFullYear(), m: t.getUTCMonth() } })
  const first = Date.UTC(m.y, m.m, 1), len = new Date(Date.UTC(m.y, m.m + 1, 0)).getUTCDate()
  const lead = (new Date(first).getUTCDay() + 6) % 7
  const idx = day => Math.round((Date.UTC(m.y, m.m, day) - START) / 864e5)
  const move = n => { const t = new Date(Date.UTC(m.y, m.m + n, 1)); setM({ y: t.getUTCFullYear(), m: t.getUTCMonth() }) }
  const mon = d - ((dowOf(d) + 6) % 7)
  const inPlan = i => i >= 0 && i < DAYS
  return <>
    <div className="card"><div className="row between"><button className="btn" onClick={() => move(-1)} aria-label="Previous month">‹</button>
      <h3>{new Date(first).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</h3>
      <button className="btn" onClick={() => move(1)} aria-label="Next month">›</button></div>
      <div className="cal">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(n => <b key={n} className="muted">{n}</b>)}
        {Array.from({ length: lead }, (_, i) => <i key={'b' + i} />)}
        {Array.from({ length: len }, (_, i) => { const di = idx(i + 1), n = inPlan(di) && di <= x.ti ? x.cnt(di) : 0
          return <button key={i} data-day={inPlan(di) ? key(di) : undefined} className={`day ${di === d ? 'sel' : ''} ${di === x.ti ? 'today' : ''} ${!inPlan(di) ? 'off' : ''}`} onClick={() => x.setSel(inPlan(di) ? di : null)} disabled={!inPlan(di)}>
            {i + 1}{n > 0 && <small>✓{n}</small>}</button> })}
      </div></div>
    <div className="card"><h3>{fmt(d)}</h3>
      {d > x.ti && <p className="muted">Upcoming day: tasks can be ticked once the day arrives.</p>}
      <p className="muted">{d <= x.ti ? `${x.cnt(d)}/${PLAN[d].length} completed` : `${PLAN[d].length} planned`}</p><Tasks d={d} x={x} /></div>
    <div className="card"><h3>Weekly plan (Mon–Sun)</h3><div className="week">{Array.from({ length: 7 }, (_, i) => mon + i).map(di =>
      <div key={di} className={'wk ' + (di === d ? 'sel' : '')}>
        <b>{fmt(di, { weekday: 'short', day: 'numeric', month: 'short' })}</b>
        {inPlan(di) ? <>
          <span className="muted">{di <= x.ti ? x.cnt(di) : 0}/{PLAN[di].length} done</span>
          <ul>{PLAN[di].map(t => <li key={t.id} className={x.s.done[key(di)]?.[t.id] ? 'on' : ''}>{t.text}</li>)}</ul>
        </> : <span className="muted">No plan</span>}
      </div>)}</div></div>
  </>
}

function Topics({ x, rows, notes }) {
  const get = id => x.s.ts[id] || ST[0]
  return <div className="rows">{rows.map(r => <div className="row-item" key={r.id}>
    <span>{r.text}</span><Sel v={get(r.id)} set={v => x.patch(p => ({ ts: { ...p.ts, [r.id]: v } }))} o={ST} />
    {notes && <textarea placeholder="Notes / your answer" value={x.s.notes[r.id] || ''} onChange={e => x.patch(p => ({ notes: { ...p.notes, [r.id]: e.target.value } }))} />}
  </div>)}</div>
}
const count = (x, ids) => ST.map(s => ids.filter(id => (x.s.ts[id] || ST[0]) === s).length)

function Interview({ x }) {
  return <>{SYLLABUS.map((sec, si) => {
    const rows = TOPICS.filter(t => t.sec === sec.name), c = count(x, rows.map(r => r.id))
    return <div className="card" key={sec.name}><h3>{sec.name} <span className="muted">· {c[3]}/{rows.length} Ready</span></h3>
      {sec.groups.map((g, gi) => <div key={gi}>{g.t && <h4>{g.t}</h4>}
        <Topics x={x} rows={rows.filter(r => r.group === g.t).map(r => ({ id: r.id, text: `${r.n}. ${r.text}` }))} /></div>)}</div>
  })}</>
}

function Dsa({ x }) {
  const row = n => ({ topic: '', video: false, lc: 0, hr: 0, practice: false, ...x.s.dsa[n] })
  const set = (n, k, v) => x.patch(p => ({ dsa: { ...p.dsa, [n]: { ...row(n), [k]: v } } }))
  return <div className="card scroll"><table><thead><tr><th>#</th><th>Topic</th><th>Video</th><th>LeetCode</th><th>HackerRank</th><th>Practice</th></tr></thead>
    <tbody>{Array.from({ length: DAYS }, (_, i) => i + 1).map(n => { const r = row(n); return <tr key={n}>
      <td>{n}</td><td><input value={r.topic} placeholder="Topic" onChange={e => set(n, 'topic', e.target.value)} /></td>
      <td><input type="checkbox" checked={r.video} aria-label={`Video ${n} completed`} onChange={e => set(n, 'video', e.target.checked)} /></td>
      <td><input type="number" min="0" value={r.lc} onChange={e => set(n, 'lc', Math.max(0, +e.target.value || 0))} /></td>
      <td><input type="number" min="0" value={r.hr} onChange={e => set(n, 'hr', Math.max(0, +e.target.value || 0))} /></td>
      <td><input type="checkbox" checked={r.practice} aria-label={`Practice ${n} completed`} onChange={e => set(n, 'practice', e.target.checked)} /></td></tr> })}</tbody></table></div>
}

function Crud({ x, name, fields, blank, status }) {
  const items = x.s.lists[name], set = v => x.patch(p => ({ lists: { ...p.lists, [name]: v } }))
  const up = (id, k, v) => set(items.map(it => it.id === id ? { ...it, [k]: v } : it))
  return <>
    <button className="btn primary" onClick={() => set([...items, { id: Date.now() + Math.random(), ...blank }])}>+ Add</button>
    {!items.length && <p className="muted">Nothing added yet.</p>}
    <div className="cards">{items.map(it => <div className="card form" key={it.id}>
      {fields.map(([k, l, t, o]) => <label key={k}><span className="muted">{l}</span>
        {o ? <Sel v={it[k]} set={v => up(it.id, k, v)} o={o} /> : t === 'area' ? <textarea value={it[k]} onChange={e => up(it.id, k, e.target.value)} />
          : <input type={t || 'text'} value={it[k]} onChange={e => up(it.id, k, e.target.value)} />}</label>)}
      <button className="btn danger" onClick={() => confirm('Delete this entry?') && set(items.filter(i => i.id !== it.id))}>Delete</button></div>)}</div>
  </>
}

const L = {
  projects: { fields: [['name', 'Project name'], ['stack', 'Tech stack'], ['gh', 'GitHub link', 'url'], ['live', 'Live link', 'url'], ['status', 'Status', 0, ['Idea', 'In Progress', 'Completed']], ['start', 'Start date', 'date'], ['end', 'End date', 'date'], ['notes', 'Notes', 'area']], blank: { name: '', stack: '', gh: '', live: '', status: 'Idea', start: '', end: '', notes: '' } },
  certs: { fields: [['name', 'Certificate name'], ['platform', 'Platform'], ['topic', 'Topic'], ['status', 'Status', 0, ['Planned', 'In Progress', 'Completed']], ['link', 'Certificate link', 'url']], blank: { name: '', platform: '', topic: '', status: 'Planned', link: '' } },
  hacks: { fields: [['name', 'Hackathon'], ['platform', 'Platform'], ['reg', 'Registration deadline', 'date'], ['team', 'Team status', 0, ['Solo', 'Looking for team', 'Team formed']], ['idea', 'Idea', 'area'], ['sub', 'Submission deadline', 'date'], ['status', 'Status', 0, ['Planned', 'Registered', 'Building', 'Submitted']]], blank: { name: '', platform: '', reg: '', team: 'Solo', idea: '', sub: '', status: 'Planned' } },
  jobs: { fields: [['company', 'Company'], ['role', 'Role'], ['link', 'Job link', 'url'], ['applied', 'Applied date', 'date'], ['status', 'Status', 0, ['Saved', 'Applied', 'Assessment', 'Interview', 'Rejected', 'Offer']], ['interview', 'Interview date', 'date'], ['notes', 'Notes', 'area']], blank: { company: '', role: '', link: '', applied: '', status: 'Saved', interview: '', notes: '' } },
}

function Progress({ x }) {
  return <div className="card">{x.progress.map(p => <div key={p.name} className="prog"><div className="row between"><b>{p.name}</b><span>{p.v}% <span className="muted">· {p.note}</span></span></div><Bar v={p.v} /></div>)}
    <p className="muted">All values are calculated from your saved data. Topic progress weights Learning ⅓, Revised ⅔, Ready 1.</p></div>
}

function Settings({ x }) {
  const exp = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(x.s, null, 2)], { type: 'application/json' })); a.download = 'career-tracker.json'; a.click(); URL.revokeObjectURL(a.href) }
  const imp = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { const o = JSON.parse(t); if (!o || typeof o.done !== 'object' || o.done === null) throw 0; x.setS(merge(o)); alert('Import complete') }).catch(() => alert('Invalid file: not a Career Tracker export.')); e.target.value = '' }
  return <div className="card form">
    <label><span className="muted">Daily study goal (minutes)</span><input type="number" min="0" value={x.s.settings.goal} onChange={e => x.patch(p => ({ settings: { ...p.settings, goal: Math.max(0, +e.target.value || 0) } }))} /></label>
    <div className="row"><button className="btn" onClick={exp}>Export JSON</button>
      <label className="btn">Import JSON<input type="file" accept="application/json,.json" hidden onChange={imp} /></label>
      <button className="btn danger" onClick={() => confirm('Reset ALL data? This cannot be undone.') && x.setS(merge({ settings: { theme: x.s.settings.theme } }))}>Reset all data</button></div></div>
}

export default function App() {
  const [s, setS] = useState(load)
  const [page, setPage] = useState(() => (PAGES.includes(decodeURIComponent(location.hash.slice(1))) ? decodeURIComponent(location.hash.slice(1)) : 'Dashboard'))
  const [now, setNow] = useState(Date.now())
  const [sel, setSel] = useState(null)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* storage unavailable */ } }, [s])
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t) }, [])
  const theme = s.settings.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  const go = p => { setPage(p); location.hash = p; window.scrollTo(0, 0) }
  const patch = f => setS(p => ({ ...p, ...f(p) }))
  const ti = idxOf(new Date(now))
  const cnt = d => (d >= 0 && d < DAYS ? PLAN[d].filter(t => s.done[key(d)]?.[t.id]).length : 0)
  const toggle = (d, id) => { if (d > ti || d < 0 || d >= DAYS) return; setS(p => { const k = key(d), day = { ...p.done[k] }; if (day[id]) delete day[id]; else day[id] = true; return { ...p, done: { ...p.done, [k]: day } } }) }

  const stats = useMemo(() => {
    const last = Math.min(ti, DAYS - 1); let longest = 0, run = 0, active = 0, total = 0
    for (let d = 0; d <= last; d++) { const n = cnt(d); total += n; if (n) { active++; run++; longest = Math.max(longest, run) } else run = 0 }
    let cur = 0, d = last; if (last >= 0 && ti < DAYS && !cnt(d)) d-- // today still pending: streak holds until the day ends
    while (d >= 0 && cnt(d)) { cur++; d-- }
    return { cur, longest, active, total }
  }, [s.done, ti]) // eslint-disable-line react-hooks/exhaustive-deps

  const progress = useMemo(() => {
    const tp = ids => Math.round(ids.reduce((a, id) => a + W[ST.indexOf(s.ts[id] || ST[0])], 0) / ids.length * 100)
    const ids = pre => (pre === 'i' ? TOPICS.map(t => t.id) : (pre === 'hr' ? HR : MERN).map((_, i) => pre + i))
    const all = PLAN.flat().length
    const dsaRows = Array.from({ length: DAYS }, (_, i) => s.dsa[i + 1] || {}), dv = dsaRows.filter(r => r.video).length, dp = dsaRows.filter(r => r.practice).length
    const L2 = s.lists, c = (a, f) => a.filter(f).length, pr = L2.projects.length, ce = L2.certs.length, ha = L2.hacks.length, jb = L2.jobs.length
    const jobDone = c(L2.jobs, j => j.status !== 'Saved')
    return [
      { name: 'Overall', v: pct(stats.total, all), note: `${stats.total}/${all} planned tasks done` },
      { name: 'DSA', v: pct(dv + dp, DAYS * 2), note: `${dv} videos, ${dp} practice days of ${DAYS}` },
      { name: 'Interview', v: tp(ids('i')), note: `${TOPICS.filter(t => s.ts[t.id] === 'Ready').length}/${TOPICS.length} topics Ready` },
      { name: 'HR', v: tp(ids('hr')), note: `${HR.filter((_, i) => s.ts['hr' + i] === 'Ready').length}/${HR.length} answers Ready` },
      { name: 'MERN', v: tp(ids('m')), note: `${MERN.filter((_, i) => s.ts['m' + i] === 'Ready').length}/${MERN.length} topics Ready` },
      { name: 'Projects', v: pct(c(L2.projects, p => p.status === 'Completed'), pr), note: `${c(L2.projects, p => p.status === 'Completed')}/${pr} completed` },
      { name: 'Certificates', v: pct(c(L2.certs, p => p.status === 'Completed'), ce), note: `${c(L2.certs, p => p.status === 'Completed')}/${ce} completed` },
      { name: 'Hackathons', v: pct(c(L2.hacks, p => p.status === 'Submitted'), ha), note: `${c(L2.hacks, p => p.status === 'Submitted')}/${ha} submitted` },
      { name: 'Job search', v: pct(jobDone, jb), note: `${jobDone}/${jb} past "Saved"` },
    ]
  }, [s, stats])

  const x = { s, setS, patch, ti, cnt, toggle, sel, setSel, go, stats, progress }
  const body = {
    Dashboard: <Dashboard x={x} />, Today: <Today x={x} />, Calendar: <Calendar x={x} />, DSA: <Dsa x={x} />, Interview: <Interview x={x} />,
    HR: <div className="card"><Topics x={x} notes rows={HR.map((t, i) => ({ id: 'hr' + i, text: t }))} /></div>,
    'MERN Interview': <div className="card"><Topics x={x} notes rows={MERN.map((t, i) => ({ id: 'm' + i, text: t }))} /></div>,
    Projects: <Crud x={x} name="projects" {...L.projects} />, Certificates: <Crud x={x} name="certs" {...L.certs} />,
    Hackathons: <Crud x={x} name="hacks" {...L.hacks} />, Jobs: <Crud x={x} name="jobs" {...L.jobs} />, Progress: <Progress x={x} />, Settings: <Settings x={x} />,
  }[page]
  return <div className="app">
    <nav>{PAGES.map(p => <button key={p} className={p === page ? 'active' : ''} onClick={() => go(p)}>{p}</button>)}</nav>
    <main><header><h1>{page}</h1><button className="btn" onClick={() => patch(p => ({ settings: { ...p.settings, theme: theme === 'dark' ? 'light' : 'dark' } }))}>{theme === 'dark' ? '☀ Light' : '☾ Dark'}</button></header>{body}</main>
  </div>
}
