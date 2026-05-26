import { useState, useEffect } from "react";
import api from "../../api/axios";
import { BookOpen, GraduationCap, Lightbulb, Video, Users, FileSpreadsheet, Layers } from "lucide-react";

const ASSET_CONFIG = {
  "01": { icon: BookOpen,      color: "#404e3b" },
  "02": { icon: GraduationCap, color: "#7b9669" },
  "03": { icon: Lightbulb,     color: "#c9a84c" },
  "04": { icon: Video,         color: "#6C8480" },
}

const TYPE_COLORS = {
  "00": "#b8c4b4", "01": "#404e3b", "02": "#7b9669",
  "03": "#5a8a5a", "04": "#b8923e", "05": "#5a8a5a",
  "06": "#c9a84c", "07": "#b85c4a", "08": "#94a89e", "09": "#2d3829",
}

function useAssetCount() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/asset/count').then(res => setData(res.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [])
  return { data, loading }
}
function useResearcherCount() {
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/researcher/count').then(res => setTotal(res.data.data || 0)).catch(console.error).finally(() => setLoading(false))
  }, [])
  return { total, loading }
}
function useProjectCount() {
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/project/count').then(res => setTotal(res.data.data || 0)).catch(console.error).finally(() => setLoading(false))
  }, [])
  return { total, loading }
}
function useProjectByType() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/project/count-by-type').then(res => setData(res.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }, [])
  return { data, loading }
}

/* ── Skeleton ── */
function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-[var(--color-surface-3)] ${className}`} />
}

/* ── Mini stat card (4 ช่องบนสุด) ── */
function MiniCard({ label, value, loading, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] px-4 py-3.5 flex items-center gap-3 shadow-[0_1px_3px_var(--color-shadow)]">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
        <Icon className="w-4 h-4" style={{ color }} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        {loading
          ? <Skeleton className="h-5 w-12 mb-1" />
          : <p className="text-lg font-bold text-[var(--color-deep-text)] leading-none">{Number(value).toLocaleString()}</p>
        }
        <p className="text-[11px] text-[var(--color-muted-text)] mt-1 truncate">{label}</p>
      </div>
    </div>
  )
}

/* ── Hero stat (Researcher + Project) ── */
function HeroCard({ label, value, loading, icon: Icon, dark = false }) {
  const base = "rounded-xl px-5 py-4 flex items-center justify-between border shadow-[0_1px_3px_var(--color-shadow)]"
  return (
    <div className={dark
      ? `${base} bg-[var(--color-forest-green)] border-transparent`
      : `${base} bg-white border-[var(--color-border)]`
    }>
      <div>
        <p className={`text-xs font-semibold mb-2 ${dark ? 'text-white/60' : 'text-[var(--color-muted-text)]'}`}>{label}</p>
        {loading
          ? <Skeleton className={`h-9 w-20 ${dark ? 'bg-white/20' : ''}`} />
          : <p className={`text-3xl font-bold leading-none ${dark ? 'text-white' : 'text-[var(--color-deep-text)]'}`}>
              {Number(value).toLocaleString()}
            </p>
        }
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${dark ? 'bg-white/10' : 'bg-[var(--color-surface-2)]'}`}>
        <Icon className={`w-6 h-6 ${dark ? 'text-white' : 'text-[var(--color-forest-green)]'}`} strokeWidth={1.5} />
      </div>
    </div>
  )
}

/* ── Inline bar (ใน table) ── */
function InlineBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="flex-1 h-1.5 rounded-full bg-[var(--color-surface-3)] overflow-hidden" style={{ minWidth: 60 }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold text-[var(--color-deep-text)] w-7 text-right flex-shrink-0">{pct}%</span>
    </div>
  )
}

/* ══════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [sortKey, setSortKey] = useState("value") // "value" | "name"
  const [sortDir, setSortDir] = useState("desc")

  const { data: assetData,        loading: assetLoading }        = useAssetCount()
  const { total: researcherTotal, loading: researcherLoading }   = useResearcherCount()
  const { total: projectTotal,    loading: projectLoading }      = useProjectCount()
  const { data: projectByTypeData, loading: projectByTypeLoading } = useProjectByType()

  const tableData = projectByTypeData
    .map(d => ({ ...d, name: d.type_name, value: Number(d.value) || 0, color: TYPE_COLORS[d.type_id] || "#94a89e" }))
    .filter(d => d.value > 0)

  const maxVal = Math.max(...tableData.map(d => d.value), 1)

  const sorted = [...tableData].sort((a, b) => {
    const mul = sortDir === "desc" ? -1 : 1
    if (sortKey === "value") return mul * (a.value - b.value)
    return mul * a.name.localeCompare(b.name, 'th')
  })

  const totalProjects = tableData.reduce((s, d) => s + d.value, 0)

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc")
    else { setSortKey(key); setSortDir("desc") }
  }

  const SortIcon = ({ k }) => (
    <span className="ml-1 text-[10px] text-[var(--color-muted-text)]">
      {sortKey === k ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
    </span>
  )

  return (
    <div
      className="min-h-screen bg-[var(--color-surface)] text-[var(--color-deep-text)] px-6 py-8"
      style={{ fontFamily: "'Sarabun', sans-serif" }}
    >
      <div className="space-y-6">

        {/* ── Page header ── */}
        <div>
          <p className="text-xs font-semibold text-[var(--color-muted-text)] uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-xl font-bold text-[var(--color-deep-text)]">ภาพรวมระบบสารสนเทศ</h1>
          <p className="text-xs text-[var(--color-muted-text)] mt-0.5">สถาบันเศรษฐกิจพอเพียง</p>
        </div>

        {/* ── Row 1: Hero (นักวิจัย + โครงการ) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <HeroCard
            label="นักวิจัยทั้งหมด" value={researcherTotal}
            loading={researcherLoading} icon={Users} dark
          />
          <HeroCard
            label="โครงการสถาบันเศรษฐกิจพอเพียง" value={projectTotal}
            loading={projectLoading} icon={Layers}
          />
        </div>

        {/* ── Row 2: Asset mini cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {assetLoading
            ? Array(4).fill(null).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-[var(--color-border)] px-4 py-3.5">
                  <Skeleton className="h-5 w-12 mb-2" /><Skeleton className="h-3 w-20" />
                </div>
              ))
            : assetData.map(stat => {
                const cfg = ASSET_CONFIG[stat.assettype_id] || { icon: FileSpreadsheet, color: "#94a89e" }
                return <MiniCard key={stat.assettype_id} label={stat.assettype_name} value={stat.total} loading={false} icon={cfg.icon} color={cfg.color} />
              })
          }
        </div>

        {/* ── Row 3: Ranking table ── */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-[0_1px_3px_var(--color-shadow)] overflow-hidden">

          {/* table header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-surface-3)] bg-[var(--color-surface)]">
            <div>
              <p className="text-sm font-bold text-[var(--color-deep-text)]">สถิติโครงการพระราชดำริ</p>
              <p className="text-xs text-[var(--color-muted-text)] mt-0.5">จำแนกตามประเภท — รวม {totalProjects.toLocaleString()} โครงการ</p>
            </div>
          </div>

          {/* table */}
          {projectByTypeLoading ? (
            <div className="p-5 space-y-3">
              {Array(5).fill(null).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-surface-3)]">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-[var(--color-muted-text)] w-8">#</th>
                  <th
                    className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--color-muted-text)] cursor-pointer hover:text-[var(--color-deep-text)] transition-colors select-none"
                    onClick={() => toggleSort("name")}
                  >
                    ประเภทโครงการ <SortIcon k="name" />
                  </th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-[var(--color-muted-text)] w-48">สัดส่วน</th>
                  <th
                    className="text-right px-5 py-2.5 text-xs font-semibold text-[var(--color-muted-text)] cursor-pointer hover:text-[var(--color-deep-text)] transition-colors select-none w-24"
                    onClick={() => toggleSort("value")}
                  >
                    จำนวน <SortIcon k="value" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((item, i) => (
                  <tr key={item.type_id} className="border-b border-[var(--color-surface-3)] last:border-0 hover:bg-[var(--color-surface)] transition-colors">
                    {/* rank */}
                    <td className="px-5 py-3">
                      <span className="text-xs font-bold text-[var(--color-muted-text)]">{i + 1}</span>
                    </td>
                    {/* ชื่อ + dot */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="font-medium text-[var(--color-deep-text)]">{item.name}</span>
                      </div>
                    </td>
                    {/* bar */}
                    <td className="px-3 py-3">
                      <InlineBar value={item.value} max={maxVal} color={item.color} />
                    </td>
                    {/* จำนวน */}
                    <td className="px-5 py-3 text-right">
                      <span
                        className="inline-block text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{ backgroundColor: `${item.color}18`, color: item.color }}
                      >
                        {item.value.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* footer total */}
              <tfoot>
                <tr className="bg-[var(--color-surface-2)]">
                  <td colSpan={3} className="px-5 py-3 text-xs font-bold text-[var(--color-muted-text)]">รวมทั้งหมด</td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-sm font-bold text-[var(--color-forest-green)]">{totalProjects.toLocaleString()}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* ── Footer ── */}
        <p className="text-center text-[11px] text-[var(--color-disabled)] pb-2">
          © 2026 สถาบันเศรษฐกิจพอเพียง — ระบบสารสนเทศภูมิศาสตร์
        </p>

      </div>
    </div>
  )
}