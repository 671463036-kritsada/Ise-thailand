import React, { useState, useEffect } from 'react'
import api from '../../api/axios'
import ActivityModal from '../../components/activity/ActivityModal'
import ActivityDetailFullscreen from '../../components/activity/ActivityDetailFullscreen'
import { useLang } from '../../context/LanguageContext'
import { useTranslation } from 'react-i18next'
import { UPLOADS_URL } from '../../constants/uploads_url'
import { motion, AnimatePresence } from 'framer-motion'
import heroImg from "/images/heroImage.png"
import VideoCard from '../../components/itemCard/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, PieChart, Pie } from 'recharts'

async function fetcher(endpoint) {
    const res = await api.get(endpoint)
    return res.data
}

function useRoyalData() {
    const [data, setData] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        fetcher('/royal/count').then((res) => setData(res.data)).catch(setError).finally(() => setLoading(false))
    }, [])
    return { data, loading, error }
}

function useResearcherData() {
    const [data, setData] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        fetcher('/researcher/count').then((res) => setData(res.data)).catch(setError).finally(() => setLoading(false))
    }, [])
    return { data, loading, error }
}

function useActivity() {
    const [news, setNews] = useState([])
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        fetcher('/activity/').then((res) => {
            const raw = res.data || []
            const grouped = Object.values(
                raw.reduce((acc, item) => {
                    if (!acc[item.docno]) acc[item.docno] = { ...item, gallery: [] }
                    if (item.act_imgname && !acc[item.docno].gallery.includes(item.act_imgname))
                        acc[item.docno].gallery.push(item.act_imgname)
                    return acc
                }, {})
            )
            setNews(grouped.filter(item => item.typeact_id === '01'))
            setActivities(grouped.filter(item => item.typeact_id === '02'))
        }).catch(setError).finally(() => setLoading(false))
    }, [])
    return { news, activities, loading, error }
}

function useEbookData() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        const colorPalette = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']
        fetcher('/Asset/count')
            .then((res) => {
                const rawArray = res.data?.data || res.data || []
                setData(rawArray.map((item, index) => ({
                    id: item.assettype_id,
                    name: item.assettype_name,
                    name_eng: item.assettype_name_eng,
                    value: Number(item.total) || 0,
                    color: colorPalette[index % colorPalette.length]
                })))
            })
            .catch(setError)
            .finally(() => setLoading(false))
    }, [])
    return { data, loading, error }
}

function useVrItems() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        fetcher('/video/vr').then((res) => setData(res.data)).catch(setError).finally(() => setLoading(false))
    }, [])
    return { data, loading, error }
}

function useVideoList() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        fetcher('/video/').then((res) => setData(res.data)).catch(setError).finally(() => setLoading(false))
    }, [])
    return { data, loading, error }
}

function useProjectData() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        Promise.all([fetcher('/project/types'), fetcher('/project/')])
            .then(([typesRes, projectsRes]) => {
                const types = typesRes.data || []
                const projects = projectsRes.data || []
                const colors = ['#404E3B', '#7B9669', '#6C8480', '#BAC8B1', '#2D3B28', '#5C7A50', '#8FA882', '#3D5C38', '#9DB090', '#4A6644']
                const countMap = projects.reduce((acc, item) => {
                    const id = item.type_id || '00'
                    acc[id] = (acc[id] || 0) + 1
                    return acc
                }, {})
                setData(types.map((type, i) => ({
                    name: type.type_name,
                    name_eng: type.type_name_eng,
                    value: countMap[type.type_id] || 0,
                    color: colors[i % colors.length]
                })))
            })
            .catch(setError)
            .finally(() => setLoading(false))
    }, [])
    return { data, loading, error }
}


// ── เพิ่ม component นี้ก่อน HomePage function ──

function ActivitySlider({ news, activities, loading, lang, onSelect }) {
    const [current, setCurrent] = useState(0)
    const combined = [...news, ...activities]
    const {t} = useTranslation()

    useEffect(() => {
        if (combined.length === 0) return
        const timer = setInterval(() => {
            setCurrent(i => (i + 1) % combined.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [combined.length])

    if (loading) return (
        <div className="rounded-3xl bg-white border border-green-light/30 h-72 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (combined.length === 0) return null

    const item = combined[current]

    return (
        <div className="relative rounded-3xl overflow-hidden bg-white border border-green-light/30 shadow-sm">
            {/* Slide content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-0"
                >
                    {/* รูปซ้าย */}
                    <div className="relative overflow-hidden h-64 md:h-80">
                        {item.img_file ? (
                            <img
                                src={`${UPLOADS_URL}${item.img_file}`}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-surface-2 flex items-center justify-center">
                                <svg className="w-12 h-12 text-green-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        {/* Badge ประเภท */}
                        <div className="absolute top-3 left-3">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                style={{
                                    background: item.typeact_id === '01' ? 'rgba(123,150,105,0.9)' : 'rgba(64,78,59,0.9)',
                                    color: '#fff',
                                    backdropFilter: 'blur(4px)',
                                }}>
                                {lang === 'TH' ? item.typeact_name : item.typeact_name_eng}
                            </span>
                        </div>
                    </div>

                    {/* เนื้อหาขวา */}
                    <div className="flex flex-col justify-between p-7">
                        <div>
                            {item.activity_date && (
                                <p className="text-xs text-muted-text mb-2">
                                    {new Date(item.activity_date).toLocaleDateString(
                                        lang === 'EN' ? 'en-EN' : 'th-TH',
                                        { year: 'numeric', month: 'long', day: 'numeric' }
                                    )}
                                </p>
                            )}
                            <h3 className="text-base font-bold text-deep-text leading-relaxed mb-3 line-clamp-3">
                                {lang === 'TH' ? item.title : item.title_eng}
                            </h3>
                            <p className="text-sm text-muted-text leading-relaxed line-clamp-4">
                                {lang === 'TH' ? item.detail : item.detail_eng}
                            </p>
                        </div>
                        <button
                            onClick={() => onSelect(item)}
                            className="mt-5 self-start flex items-center gap-2 text-sm font-semibold text-green hover:opacity-75 transition-opacity"
                        >
                            {t('Read_more_details')}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dots + Arrows */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
                {combined.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className="transition-all duration-300 rounded-full"
                        style={{
                            width: i === current ? 20 : 6,
                            height: 6,
                            background: i === current ? 'var(--color-green)' : 'var(--color-green-light)',
                            opacity: i === current ? 1 : 0.5,
                        }}
                    />
                ))}
            </div>

            {/* Prev / Next */}
            {combined.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrent(i => (i - 1 + combined.length) % combined.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 border border-green-light/30 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                    >
                        <svg className="w-4 h-4 text-deep-text" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setCurrent(i => (i + 1) % combined.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 border border-green-light/30 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                    >
                        <svg className="w-4 h-4 text-deep-text" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    )
}


// ─── UI Primitives ───────────────────────────────────────────────────────────

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

const Reveal = ({ children, delay = 0 }) => (
    <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        transition={{ delay }}
    >
        {children}
    </motion.div>
)

function SectionLabel({ text }) {
    return (
        <p className="text-xs font-semibold tracking-widest uppercase text-green mb-2">
            {text}
        </p>
    )
}

function SectionTitle({ title, badge }) {
    return (
        <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold text-deep-text leading-tight">{title}</h2>
            {badge && (
                <span className="text-xs font-medium text-muted-text bg-green-light/20 px-3 py-1 rounded-full">
                    {badge}
                </span>
            )}
        </div>
    )
}

function Divider() {
    return <div className="w-full h-px bg-green-light/20 my-2" />
}

// ─── Stat Cards ──────────────────────────────────────────────────────────────

function StatCard({ label, value, unit, accent = false }) {
    return (
        <div className={`rounded-2xl p-6 flex flex-col gap-3 ${accent ? 'bg-forest-green text-white' : 'bg-white border border-green-light/40'}`}>
            <p className={`text-xs font-medium tracking-wide uppercase ${accent ? 'text-white/50' : 'text-muted-text'}`}>
                {label}
            </p>
            <div>
                <p className={`text-5xl font-bold leading-none ${accent ? 'text-white' : 'text-deep-text'}`}>
                    {value}
                </p>
                <p className={`text-xs mt-2 font-medium ${accent ? 'text-white/40' : 'text-green'}`}>
                    {unit}
                </p>
            </div>
        </div>
    )
}

function ActionCard({ label, description, icon, onClick }) {
    return (
        <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="rounded-2xl p-6 bg-white border border-green-light/40 text-left flex flex-col gap-4 hover:border-green/40 hover:shadow-lg transition-all duration-200 group"
        >
            <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center group-hover:bg-green/20 transition-colors">
                {icon}
            </div>
            <div>
                <p className="font-bold text-deep-text text-sm">{label}</p>
                {description && <p className="text-xs text-muted-text mt-0.5">{description}</p>}
            </div>
            <svg className="w-4 h-4 text-green-light group-hover:text-green transition-colors mt-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </motion.button>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function HomePage() {
    const [selectedActivity, setSelectedActivity] = useState(null)
    const [showActivityModal, setShowActivityModal] = useState(false)
    const [showNewsModal, setShowNewsModal] = useState(false)
    const [selectedVr, setSelectedVr] = useState(null)

    const { lang } = useLang()
    const { t } = useTranslation()

    const activity = useActivity()
    const { data: ebookData, loading: ebookLoading } = useEbookData()
    const vr = useVrItems()
    const videoList = useVideoList()
    const royalData = useRoyalData()
    const researcherData = useResearcherData()
    const projectData = useProjectData()

    const introVideo = videoList.data.find(v => !v.video_url.includes('youtube'))
    const youtubeVideos = videoList.data.filter(v => v.video_url.includes('youtube'))
    const totalProjects = projectData.data.reduce((s, d) => s + d.value, 0)

    return (
        <div className=" space-y-16">

            {/* ── Hero ── */}
            <Reveal>
                <div className="relative rounded-3xl overflow-hidden">
                    <img
                        src={heroImg}
                        alt="Hero"
                        className="w-full object-cover max-h-[480px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
            </Reveal>

            <Reveal>
                <ActivitySlider
                    news={activity.news}
                    activities={activity.activities}
                    loading={activity.loading}
                    lang={lang}
                    onSelect={(item) => setSelectedActivity(item)}
                />
            </Reveal>

            {/* ── Stats ── */}
            <Reveal delay={0.05}>
                <SectionLabel text={t('overview') || 'ภาพรวม'} />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label={t('researcher')}
                        value={researcherData.loading ? '—' : researcherData.data}
                        unit={t('researcher_unit')}
                    />
                    <StatCard
                        label={t('royal_project')}
                        value={royalData.loading ? '—' : royalData.data}
                        unit={t('royal_project_unit')}
                        accent
                    />
                    <ActionCard
                        label={t('news')}
                        icon={
                            <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
                            </svg>
                        }
                        onClick={() => setShowNewsModal(true)}
                    />
                    <ActionCard
                        label={t('activities')}
                        icon={
                            <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        }
                        onClick={() => setShowActivityModal(true)}
                    />
                </div>
            </Reveal>

            <Divider />

            {/* ── Video + Media ── */}
            <Reveal>
                <SectionLabel text={t('institute_video') || 'วิดีโอสถาบัน'} />
                <SectionTitle title={t('institute_video')} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Video Player */}
                    <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-green-light/30 bg-neutral-100 aspect-video">
                        {videoList.loading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : introVideo ? (
                            <VideoCard
                                isYoutube={true}
                                videoUrl={introVideo.video_url}
                                title={lang === 'TH' ? introVideo.video_title : introVideo.video_title_eng}
                            />
                        ) : null}
                    </div>

                    {/* Media Pie */}
                    <div className="rounded-2xl p-6 bg-white border border-green-light/30 flex flex-col">
                        <p className="text-sm font-bold text-deep-text mb-5">{t('media')}</p>
                        {ebookLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-center mb-5">
                                    <PieChart width={150} height={150}>
                                        <Pie data={ebookData} cx={75} cy={75} innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                                            {ebookData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                        </Pie>
                                    </PieChart>
                                </div>
                                <div className="space-y-3 mt-auto">
                                    {ebookData.map((d, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                                                <p className="text-xs text-muted-text">{lang === 'TH' ? d.name : d.name_eng}</p>
                                            </div>
                                            <p className="text-xs font-bold text-deep-text">{d.value} {t('media_unit')}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </Reveal>

            <Divider />

            {/* ── Projects ── */}
            <Reveal>
                <SectionLabel text={t('institute_projects') || 'โครงการ'} />
                <SectionTitle
                    title={t('institute_projects')}
                    badge={projectData.loading ? '...' : `${totalProjects} ${t('project_unit')}`}
                />
                {projectData.loading ? (
                    <div className="h-40 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="rounded-2xl bg-white border border-green-light/30 p-6">
                        <ResponsiveContainer width="100%" height={projectData.data.filter(d => d.value > 0).length * 52 + 40}>
                            <BarChart
                                data={projectData.data.filter(d => d.value > 0)}
                                layout="vertical"
                                margin={{ left: 0, right: 32, top: 4, bottom: 4 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" opacity={0.6} />
                                <XAxis
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#5a7065', fontSize: 11 }}
                                    allowDecimals={false}
                                />
                                <YAxis
                                    type="category"
                                    dataKey={lang === 'TH' ? 'name' : 'name_eng'}
                                    width={170}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#5a7065', fontSize: 11 }}
                                    tickFormatter={(val) => val.length > 20 ? val.slice(0, 20) + '…' : val}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(186,200,177,0.1)' }}
                                    formatter={(value, name, props) => [
                                        `${value} ${t('royal_project_unit')}`,
                                        lang === 'TH' ? props.payload.name : props.payload.name_eng
                                    ]}
                                    contentStyle={{
                                        fontSize: 12,
                                        borderRadius: 10,
                                        border: '1px solid #BAC8B1',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                    }}
                                />
                                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                                    {projectData.data.filter(d => d.value > 0).map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        {/* Legend chips */}
                        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-green-light/20">
                            {projectData.data.filter(d => d.value > 0).map((item, i) => (
                                <div key={i} className="flex items-center gap-1.5 bg-green-light/10 rounded-full px-3 py-1">
                                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs text-muted-text">{lang === 'TH' ? item.name : item.name_eng}</span>
                                    <span className="text-xs font-bold text-deep-text ml-1">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Reveal>

            <Divider />

            {/* ── VR + Videos ── */}
            <Reveal>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">

                    {/* VR */}
                    <div>
                        <SectionLabel text="VR" />
                        <SectionTitle title={t('vr_learning')} />
                        <div className="rounded-2xl border border-green-light/30 overflow-hidden bg-white divide-y divide-green-light/20">
                            {vr.loading ? (
                                <div className="p-8 flex justify-center">
                                    <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : vr.data.map((item, i) => (
                                <motion.button
                                    key={item.meta_id}
                                    whileHover={{ backgroundColor: 'rgba(123,150,105,0.04)' }}
                                    onClick={() => setSelectedVr(item)}
                                    className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors"
                                >
                                    <span className="w-7 h-7 rounded-full bg-forest-green text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        {i + 1}
                                    </span>
                                    <p className="flex-1 text-sm text-deep-text leading-snug">
                                        {lang === 'TH' ? item.meta_name : item.name_eng}
                                    </p>
                                    <svg className="w-4 h-4 text-green-light flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M10 8l6 4-6 4V8z" fill="currentColor" stroke="none" />
                                    </svg>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* YouTube Videos */}
                    <div className="lg:col-span-2">
                        <SectionLabel text={t('project_videos') || 'วิดีโอโครงการ'} />
                        <SectionTitle
                            title={t('project_videos')}
                            badge={videoList.loading ? '...' : `${youtubeVideos.length} ${t('list_unit')}`}
                        />
                        {videoList.loading ? (
                            <div className="h-40 flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-green border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {youtubeVideos.map((v) => (
                                    <div key={v.video_id} className="rounded-2xl overflow-hidden border border-green-light/30">
                                        <VideoCard
                                            isYoutube={true}
                                            videoUrl={v.video_url}
                                            detailLink={v.video_detail}
                                            title={lang === 'TH' ? v.video_title : v.video_title_eng}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Reveal>

            {/* ── Modals ── */}
            <AnimatePresence>
                {showNewsModal && !selectedActivity && (
                    <ActivityModal
                        key="news-modal"
                        title={lang === 'TH' ? activity.news[0]?.typeact_name : activity.news[0]?.typeact_name_eng}
                        data={activity.news}
                        loading={activity.loading}
                        error={activity.error}
                        onClose={() => setShowNewsModal(false)}
                        onSelectActivity={(item) => setSelectedActivity(item)}
                    />
                )}
                {showActivityModal && !selectedActivity && (
                    <ActivityModal
                        key="activity-modal"
                        title={lang === 'TH' ? activity.activities[0]?.typeact_name : activity.activities[0]?.typeact_name_eng}
                        data={activity.activities}
                        loading={activity.loading}
                        error={activity.error}
                        onClose={() => setShowActivityModal(false)}
                        onSelectActivity={(item) => setSelectedActivity(item)}
                    />
                )}
                {selectedActivity && (
                    <ActivityDetailFullscreen
                        key="detail"
                        item={selectedActivity}
                        onClose={() => setSelectedActivity(null)}
                    />
                )}
                {selectedVr && (
                    <motion.div
                        key="vr-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
                        onClick={() => setSelectedVr(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 16 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 16 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full max-w-6xl overflow-hidden"
                            style={{
                                borderRadius: 20,
                                background: 'linear-gradient(160deg, #1a2e1a 0%, #0f1f0f 100%)',
                                border: '1px solid rgba(197,168,105,0.25)',
                                boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(197,168,105,0.08)',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Gold shimmer line */}
                            <div style={{
                                height: 2,
                                background: 'linear-gradient(90deg, transparent, rgba(197,168,105,0.5) 30%, rgba(220,190,120,0.9) 50%, rgba(197,168,105,0.5) 70%, transparent)',
                            }} />

                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4">
                                {/* Left: icon + title */}
                                <div className="flex items-center gap-3 min-w-0">
                                    <div style={{
                                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                                        background: 'rgba(197,168,105,0.12)',
                                        border: '1px solid rgba(197,168,105,0.3)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <svg width="16" height="16" fill="none" stroke="rgba(197,168,105,0.9)" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.89L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p style={{
                                            fontSize: '0.82rem',
                                            fontWeight: 600,
                                            color: 'rgba(255,255,255,0.92)',
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                            maxWidth: 420,
                                        }}>
                                            {lang === 'TH' ? selectedVr.meta_name : selectedVr.name_eng}
                                        </p>
                                        <p style={{ fontSize: '0.68rem', color: 'rgba(197,168,105,0.65)', marginTop: 1 }}>
                                            วิดีโอ VR · กดพื้นที่ว่างเพื่อปิด
                                        </p>
                                    </div>
                                </div>

                                {/* Close */}
                                <button
                                    onClick={() => setSelectedVr(null)}
                                    style={{
                                        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        color: 'rgba(255,255,255,0.5)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(239,68,68,0.15)'
                                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'
                                        e.currentTarget.style.color = 'rgba(252,165,165,0.9)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                                    }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Separator */}
                            <div style={{ height: 1, background: 'rgba(197,168,105,0.12)', margin: '0 20px' }} />

                            {/* Video */}
                            <div style={{ position: 'relative', background: '#000', margin: '16px 20px 20px', borderRadius: 12, overflow: 'hidden' }}>
                                {/* Aspect ratio box */}
                                <div style={{ paddingTop: '56.25%', position: 'relative' }}>
                                    <video
                                        key={selectedVr.meta_id}
                                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
                                        controls
                                        autoPlay
                                        preload="metadata"
                                    >
                                        <source src={`${UPLOADS_URL}${selectedVr.path}`} type="video/mp4" />
                                    </video>
                                </div>

                                {/* Corner badge */}
                                <div style={{
                                    position: 'absolute', top: 10, left: 10,
                                    padding: '3px 8px', borderRadius: 6,
                                    background: 'rgba(0,0,0,0.55)',
                                    border: '1px solid rgba(197,168,105,0.3)',
                                    fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em',
                                    color: 'rgba(197,168,105,0.9)',
                                    backdropFilter: 'blur(4px)',
                                    pointerEvents: 'none',
                                }}>
                                    VR
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default HomePage