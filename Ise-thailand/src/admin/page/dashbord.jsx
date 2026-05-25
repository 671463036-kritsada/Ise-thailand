import { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  BookOpen, GraduationCap, Lightbulb, Video, Users, FileSpreadsheet, Layers
} from "lucide-react";

const ASSET_CONFIG = {
  "01": { icon: BookOpen, color: "bg-[var(--color-blue-light)]/20 text-[var(--color-forest-blue)] border-[var(--color-blue-light)]/40" },
  "02": { icon: GraduationCap, color: "bg-[var(--color-surface-2)] text-[var(--color-blue)] border-[var(--color-border)]" },
  "03": { icon: Lightbulb, color: "bg-slate-50 text-slate-400 border-slate-200" },
  "04": { icon: Video, color: "bg-slate-50 text-slate-400 border-slate-200" },
}

const TYPE_COLORS = {
  "00": "#a0b4cc",
  "01": "#0f2044",
  "02": "#1a4080",
  "03": "#1e5fa8",
  "04": "#b8923e",
  "05": "#2e7d5e",
  "06": "#c9a84c",
  "07": "#b85c4a",
  "08": "#6b8cae",
  "09": "#0a1628",
}

function useAssetCount() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/asset/count')
      .then(res => setData(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])
  return { data, loading }
}

function useResearcherCount() {
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/researcher/count')
      .then(res => setTotal(res.data.data || 0))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])
  return { total, loading }
}

function useProjectCount() {
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/project/count')
      .then(res => setTotal(res.data.data || 0))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])
  return { total, loading }
}

function useProjectByType() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/project/count-by-type')
      .then(res => setData(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])
  return { data, loading }
}

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState("ALL")
  const { data: assetData, loading: assetLoading } = useAssetCount()
  const { total: researcherTotal, loading: researcherLoading } = useResearcherCount()
  const { total: projectTotal, loading: projectLoading } = useProjectCount()
  const { data: projectByTypeData, loading: projectByTypeLoading } = useProjectByType()

  const chartData = projectByTypeData.map(d => ({
    ...d,
    name: d.type_name,
    color: TYPE_COLORS[d.type_id] || "#7da3b3"
  }))

  const filteredGraphData = selectedFilter === "ALL"
    ? chartData
    : chartData.filter(item => item.type_id === selectedFilter)

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">

      {/* PAGE TITLE */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-forest-blue)] tracking-tight">ภาพรวมระบบสารสนเทศ</h1>
        <p className="text-sm text-[var(--color-muted-text)] font-medium mt-0.5">ระบบรายงานสถิติข้อมูลสถาบันเศรษฐกิจพอเพียง</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {assetLoading ? (
          <p className="text-sm text-[var(--color-muted-text)]">กำลังโหลด...</p>
        ) : (
          assetData.map((stat) => {
            const config = ASSET_CONFIG[stat.assettype_id] || { icon: FileSpreadsheet, color: "bg-slate-50 text-slate-400 border-slate-200" }
            const IconComp = config.icon
            return (
              <div key={stat.assettype_id} className="rounded-xl border p-4 flex items-center justify-between shadow-sm bg-white border-[var(--color-border)]">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wider">{stat.assettype_name}</p>
                  <p className="text-2xl font-black text-[var(--color-deep-text)] font-mono">{stat.total}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${config.color} shrink-0`}>
                  <IconComp className="w-6 h-6 stroke-[2.5]" />
                </div>
              </div>
            )
          })
        )}

        {/* Researcher Card */}
        <div className="rounded-xl border p-4 flex items-center justify-between shadow-sm bg-white border-[var(--color-border)]">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wider">นักวิจัยทั้งหมด</p>
            <p className="text-2xl font-black text-[var(--color-deep-text)] font-mono">
              {researcherLoading ? '...' : researcherTotal}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center border bg-[var(--color-surface-2)] text-[var(--color-blue)] border-[var(--color-border)] shrink-0">
            <Users className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Project Count Card */}
        <div className="rounded-xl border p-4 flex items-center justify-between shadow-sm bg-white border-[var(--color-border)]">
          <div className="space-y-1">
            <p className="text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wider">โครงการสถาบันเศรษฐกิจพอเพียง</p>
            <p className="text-2xl font-black text-[var(--color-deep-text)] font-mono">
              {projectLoading ? '...' : projectTotal}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center border bg-[var(--color-surface-2)] text-[var(--color-blue)] border-[var(--color-border)] shrink-0">
            <Layers className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* CHARTS TITLE */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[var(--color-forest-blue)] tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--color-blue)]" />
          <span>สถิติจำแนกตามประเภทโครงการพระราชดำริ</span>
        </h2>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-surface-3)] bg-[var(--color-surface)]/30">
            <h3 className="text-sm font-bold text-[var(--color-forest-blue)]">แผนภูมิแท่งเปรียบเทียบสัดส่วนงาน</h3>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-xs border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 bg-white font-semibold text-[var(--color-deep-text)] focus:outline-none cursor-pointer"
            >
              <option value="ALL">แสดงทุกประเภทโครงการ</option>
              {chartData.map(item => (
                <option key={item.type_id} value={item.type_id}>{item.type_name}</option>
              ))}
            </select>
          </div>
          <div className="p-4 h-64 flex-1">
            {projectByTypeLoading ? (
              <p className="text-sm text-[var(--color-muted-text)]">กำลังโหลด...</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredGraphData} margin={{ top: 15, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-surface-3)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--color-deep-text)", fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(text) => text.length > 10 ? `${text.substring(0, 10)}...` : text} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-text)", fontFamily: "monospace" }} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v, name, props) => [`${v} รายการ`, props.payload.name]} contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid var(--color-border)" }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={30}>
                    {filteredGraphData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-[var(--color-surface-3)] bg-[var(--color-surface)]/30">
            <h3 className="text-sm font-bold text-[var(--color-forest-blue)]">อัตราส่วนโครงสร้างสถิติ</h3>
          </div>
          <div className="p-4 flex flex-col justify-center items-center h-64 flex-1">
            <div className="w-full h-40 shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={filteredGraphData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value">
                    {filteredGraphData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} โครงการ`, "ปริมาณ"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-black text-[var(--color-deep-text)] font-mono">
                  {filteredGraphData.reduce((acc, curr) => acc + curr.value, 0)}
                </span>
                <span className="text-[10px] text-[var(--color-muted-text)] font-bold">รวม</span>
              </div>
            </div>
            <div className="w-full overflow-y-auto max-h-24 px-1 mt-2 space-y-1">
              {filteredGraphData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-1.5 truncate mr-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[var(--color-deep-text)] truncate text-[11px] font-semibold">{item.name}</span>
                  </div>
                  <span className="font-bold font-mono text-[var(--color-blue)] text-[11px] bg-[var(--color-surface-2)] px-1.5 py-0.5 rounded shrink-0">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-[var(--color-disabled)] mt-6 font-medium">
        Copyright © 2026 สถาบันเศรษฐกิจพอเพียง Dashboard ระบบสารสนเทศภูมิศาสตร์
      </p>
    </div>
  )
}