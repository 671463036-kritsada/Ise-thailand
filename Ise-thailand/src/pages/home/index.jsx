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
import { useNavigate } from 'react-router-dom'

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
                const countMap = projects.reduce((acc, item) => {
                    const id = item.type_id || '00'
                    acc[id] = (acc[id] || 0) + 1
                    return acc
                }, {})
                setData(types.map((type) => ({
                    name: type.type_name,
                    name_eng: type.type_name_eng,
                    value: countMap[type.type_id] || 0,
                })))
            })
            .catch(setError)
            .finally(() => setLoading(false))
    }, [])
    return { data, loading, error }
}

function useRoyalProjects() {
    const [allData, setAllData] = useState([])
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetcher('/royal/').then((res) => {
            const all = res.data || []
            setAllData(all)
            setData([...all].sort(() => Math.random() - 0.5).slice(0, 4))
        }).catch(console.error).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (allData.length === 0) return
        const timer = setInterval(() => {
            setData([...allData].sort(() => Math.random() - 0.5).slice(0, 4))
        }, 8000)
        return () => clearInterval(timer)
    }, [allData])

    return { data, loading }
}

// ── Activity Slider ──────────────────────────────────────────────────────────

function ActivitySlider({ news, activities, loading, lang, onSelect }) {
    const [current, setCurrent] = useState(0)
    const combined = [...news, ...activities]
    const { t } = useTranslation()

    useEffect(() => {
        if (combined.length === 0) return
        const timer = setInterval(() => setCurrent(i => (i + 1) % combined.length), 5000)
        return () => clearInterval(timer)
    }, [combined.length])

    if (loading) return (
        <div className="rounded-3xl bg-white border border-green-light/20 h-72 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (combined.length === 0) return null
    const item = combined[current]

    return (
        <div className="relative rounded-3xl overflow-hidden shadow-md border border-green-light/20 bg-white">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.38, ease: 'easeOut' }}
                    className="grid grid-cols-1 md:grid-cols-2"
                >
                    {/* Image */}
                    <div className="relative overflow-hidden h-64 md:h-96">
                        {item.img_file ? (
                            <img
                                src={`${UPLOADS_URL}${item.img_file}`}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-surface-2 flex items-center justify-center">
                                <svg className="w-10 h-10 text-green-light/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        {/* Badge */}
                        <div className="absolute top-4 left-4">
                            <span className="text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm"
                                style={{
                                    background: item.typeact_id === '01'
                                        ? 'rgba(123,150,105,0.85)'
                                        : 'rgba(40,60,35,0.85)',
                                    color: '#fff',
                                    letterSpacing: '0.03em',
                                }}>
                                {lang === 'TH' ? item.typeact_name : item.typeact_name_eng}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-between p-8 md:p-10 bg-white">
                        <div className="space-y-4">
                            {item.activity_date && (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-px bg-green/40" />
                                    <p className="text-xs tracking-wide text-muted-text">
                                        {new Date(item.activity_date).toLocaleDateString(
                                            lang === 'EN' ? 'en-EN' : 'th-TH',
                                            { year: 'numeric', month: 'long', day: 'numeric' }
                                        )}
                                    </p>
                                </div>
                            )}
                            <h3 className="text-lg font-bold text-deep-text leading-relaxed line-clamp-3">
                                {lang === 'TH' ? item.title : item.title_eng}
                            </h3>
                            <p className="text-sm text-muted-text leading-relaxed line-clamp-5">
                                {lang === 'TH' ? item.detail : item.detail_eng}
                            </p>
                        </div>
                        <button
                            onClick={() => onSelect(item)}
                            className="mt-8 self-start flex items-center gap-2.5 text-sm font-semibold text-green hover:gap-4 transition-all duration-200 group"
                        >
                            {t('Read_more_details')}
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-1.5 md:hidden">
                {combined.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                        className="transition-all duration-300 rounded-full"
                        style={{
                            width: i === current ? 22 : 6, height: 6,
                            background: i === current ? 'var(--color-green)' : 'var(--color-green-light)',
                            opacity: i === current ? 1 : 0.4,
                        }} />
                ))}
            </div>

            {/* Prev/Next */}
            {combined.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrent(i => (i - 1 + combined.length) % combined.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-green-light/30 flex items-center justify-center hover:bg-white hover:shadow-md transition-all"
                    >
                        <svg className="w-4 h-4 text-deep-text" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setCurrent(i => (i + 1) % combined.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-green-light/30 flex items-center justify-center hover:bg-white hover:shadow-md transition-all"
                    >
                        <svg className="w-4 h-4 text-deep-text" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Slide counter — desktop right side */}
            <div className="hidden md:flex absolute bottom-5 right-6 items-center gap-2">
                {combined.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                        className="transition-all duration-300 rounded-full"
                        style={{
                            width: i === current ? 22 : 6, height: 6,
                            background: i === current ? 'var(--color-green)' : 'var(--color-green-light)',
                            opacity: i === current ? 1 : 0.35,
                        }} />
                ))}
            </div>
        </div>
    )
}

// ── Featured Projects ─────────────────────────────────────────────────────────

function FeaturedProjects({ lang }) {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [allProjects, setAllProjects] = useState([])
    const [typeProject, setTypeProject] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            api.get('/royal/').then(r => r.data.data || []),
            api.get('/royal/types').then(r => r.data.data || []),
        ]).then(([projects, types]) => {
            setAllProjects(projects)
            setTypeProject(types)
        }).catch(console.error).finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="h-40 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="space-y-14">
            {typeProject.map((type) => {
                const allOfType = allProjects.filter(p => p.type_id === type.type_id)
                if (allOfType.length === 0) return null
                return (
                    <div key={type.type_id}>
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-1 h-7 rounded-full" style={{ background: 'var(--color-forest-green)' }} />
                            <h3 className="text-sm font-bold tracking-wide" style={{ color: 'var(--color-forest-green)' }}>
                                {lang === 'TH' ? type.type_name : type.type_name_eng}
                            </h3>
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                                style={{ background: 'var(--color-surface-2)', color: 'var(--color-muted-text)' }}>
                                {allOfType.length} {t('royal_project_unit')}
                            </span>
                            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                            <button
                                onClick={() => navigate(`/projects?typeId=${type.type_id}`)}
                                className="text-xs flex items-center gap-1 font-semibold transition-all hover:gap-2 duration-200 group"
                                style={{ color: 'var(--color-green)' }}
                            >
                                {t('nav_royal_all')}
                                <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>

                        {/* Horizontal scroll cards */}
                        <div className="overflow-x-auto pb-3 scrollbar-hide" style={{ scrollSnapType: 'x mandatory' }}>
                            <div className="flex gap-5" style={{ width: 'max-content' }}>
                                {allOfType.map((item) => (
                                    <motion.button
                                        key={item.royal_id}
                                        whileHover={{ y: -5 }}
                                        whileTap={{ scale: 0.985 }}
                                        onClick={() => navigate(`/projects/${item.royal_id}`)}
                                        className="text-left rounded-2xl overflow-hidden bg-white transition-all duration-200 group flex-shrink-0"
                                        style={{
                                            border: '1px solid var(--color-border)',
                                            width: 380,
                                            scrollSnapAlign: 'start',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                        }}
                                    >
                                        <div className="relative overflow-hidden"
                                            style={{ aspectRatio: '16/9', background: 'var(--color-surface-2)' }}>
                                            {item.img_banner || item.img_1 ? (
                                                <img
                                                    src={`${UPLOADS_URL}${item.img_banner || item.img_1}`}
                                                    alt={lang === 'TH' ? item.royal_name : item.royal_name_eng}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-8 h-8" style={{ color: 'var(--color-disabled)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                        </div>
                                        <div className="p-4">
                                            <p className="text-sm font-semibold leading-snug line-clamp-2 transition-colors group-hover:text-green"
                                                style={{ color: 'var(--color-deep-text)' }}>
                                                {lang === 'TH' ? item.royal_name : item.royal_name_eng}
                                            </p>
                                            {(item.detail_1 || item.detail_1_eng) && (
                                                <p className="text-xs mt-2 line-clamp-2 leading-relaxed"
                                                    style={{ color: 'var(--color-muted-text)' }}>
                                                    {lang === 'TH' ? item.detail_1 : item.detail_1_eng}
                                                </p>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// ── Primitives ────────────────────────────────────────────────────────────────

const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

const Reveal = ({ children, delay = 0 }) => (
    <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        transition={{ delay }}
    >
        {children}
    </motion.div>
)

function SectionLabel({ text }) {
    return (
        <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-px bg-green/50" />
            <p className="text-xs font-semibold tracking-widest uppercase text-green">
                {text}
            </p>
        </div>
    )
}

function SectionTitle({ title, badge }) {
    return (
        <div className="flex items-end justify-between mb-7">
            <h2 className="text-xl font-bold text-deep-text leading-tight">{title}</h2>
            {badge && (
                <span className="text-xs font-medium text-muted-text bg-surface-2 px-3 py-1 rounded-full">
                    {badge}
                </span>
            )}
        </div>
    )
}

function Divider() {
    return (
        <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-green-light/15" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-light/30" />
            <div className="flex-1 h-px bg-green-light/15" />
        </div>
    )
}

function ActionCard({ label, description, icon, onClick }) {
    return (
        <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className="rounded-2xl p-6 bg-white border border-green-light/30 text-left flex flex-col gap-4 hover:border-green/40 hover:shadow-lg transition-all duration-200 group"
        >
            <div className="w-11 h-11 rounded-xl bg-green/8 flex items-center justify-center group-hover:bg-green/15 transition-colors">
                {icon}
            </div>
            <div>
                <p className="font-bold text-deep-text text-sm">{label}</p>
                {description && <p className="text-xs text-muted-text mt-0.5">{description}</p>}
            </div>
            <svg className="w-4 h-4 text-green-light group-hover:text-green transition-all mt-auto group-hover:translate-x-1 duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </motion.button>
    )
}

// ── VR List Item ──────────────────────────────────────────────────────────────

function VrListItem({ item, index, lang, onClick }) {
    return (
        <motion.button
            whileHover={{ backgroundColor: 'rgba(123,150,105,0.05)' }}
            whileTap={{ scale: 0.99 }}
            onClick={onClick}
            className="w-full flex items-center gap-4 px-5 py-4 text-left transition-colors group"
        >
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors"
                style={{
                    background: 'var(--color-forest-green)',
                    color: '#fff',
                }}>
                {index + 1}
            </span>
            <p className="flex-1 text-sm text-deep-text leading-snug group-hover:text-green transition-colors">
                {lang === 'TH' ? item.meta_name : item.name_eng}
            </p>
            <div className="w-7 h-7 rounded-full border border-green-light/30 flex items-center justify-center flex-shrink-0 group-hover:border-green/40 group-hover:bg-green/5 transition-all">
                <svg className="w-3.5 h-3.5 text-green-light group-hover:text-green transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                </svg>
            </div>
        </motion.button>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function HomePage() {
    const [selectedActivity, setSelectedActivity] = useState(null)
    const [showActivityModal, setShowActivityModal] = useState(false)
    const [showNewsModal, setShowNewsModal] = useState(false)
    const [selectedVr, setSelectedVr] = useState(null)

    const royalProjects = useRoyalProjects()
    const { lang } = useLang()
    const { t } = useTranslation()
    const navigate = useNavigate()

    const activity = useActivity()
    const vr = useVrItems()
    const videoList = useVideoList()
    const projectData = useProjectData()

    const introVideo = videoList.data.find(v => !v.video_url.includes('youtube'))
    const youtubeVideos = videoList.data.filter(v => v.video_url.includes('youtube'))

    const [heroIndex, setHeroIndex] = useState(0)

    useEffect(() => {
        const banners = royalProjects.data.filter(p => p.img_banner)
        if (banners.length === 0) return
        const timer = setInterval(() => setHeroIndex(i => (i + 1) % banners.length), 8000)
        return () => clearInterval(timer)
    }, [royalProjects.data])

    return (
        <div className="space-y-16 pb-16">

            {/* ── Hero ── */}
            <Reveal>
                {(() => {
                    const banners = royalProjects.data.filter(p => p.img_banner)
                    if (royalProjects.loading || banners.length === 0) {
                        return (
                            <div className="relative rounded-3xl overflow-hidden">
                                <img src={heroImg} alt="Hero" className="w-full object-cover max-h-[500px]" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            </div>
                        )
                    }

                    const current = banners[heroIndex % banners.length]

                    return (
                        <div className="relative rounded-3xl overflow-hidden" style={{ height: 500 }}>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={current.royal_id}
                                    src={`${UPLOADS_URL}${current.img_banner}`}
                                    alt={lang === 'TH' ? current.royal_name : current.royal_name_eng}
                                    initial={{ opacity: 0, scale: 1.04 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.7 }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </AnimatePresence>

                            {/* Multi-stop gradient — richer depth */}
                            <div className="absolute inset-0"
                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />

                            {/* Text */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current.royal_id + '_text'}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.5, delay: 0.15 }}
                                    className="absolute bottom-0 left-0 right-0 p-8 md:p-12"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-4 h-px" style={{ background: 'var(--color-gold)' }} />
                                        <p className="text-xs font-semibold tracking-widest uppercase"
                                            style={{ color: 'var(--color-gold)' }}>
                                            {lang === 'TH' ? current.type_name : current.type_name_eng}
                                        </p>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed line-clamp-2 drop-shadow-lg max-w-2xl">
                                        {lang === 'TH' ? current.royal_name : current.royal_name_eng}
                                    </h2>
                                </motion.div>
                            </AnimatePresence>

                            {/* Dots */}
                            <div className="absolute bottom-6 right-8 flex gap-2">
                                {banners.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setHeroIndex(i)}
                                        className="transition-all duration-300 rounded-full"
                                        style={{
                                            width: i === heroIndex % banners.length ? 24 : 6,
                                            height: 6,
                                            backgroundColor: i === heroIndex % banners.length
                                                ? 'var(--color-gold)'
                                                : 'rgba(255,255,255,0.35)',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })()}
            </Reveal>

            {/* ── Activity Slider ── */}
            <Reveal>
                <ActivitySlider
                    news={activity.news}
                    activities={activity.activities}
                    loading={activity.loading}
                    lang={lang}
                    onSelect={(item) => setSelectedActivity(item)}
                />
            </Reveal>

            {/* ── Featured Royal Projects ── */}
            <Reveal delay={0.05}>
                <FeaturedProjects lang={lang} />
            </Reveal>

            {/* ── Quick Action Cards ── */}
            <Reveal>
                <SectionLabel text={t('overview') || 'ภาพรวม'} />
                <div className="grid grid-cols-2 gap-4">
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

            {/* ── Institute Video ── */}
            <Reveal>
                <SectionLabel text={t('institute_video') || 'วิดีโอสถาบัน'} />
                <SectionTitle title={t('institute_video')} />
                <div className="rounded-2xl overflow-hidden border border-green-light/20 bg-neutral-100 aspect-video shadow-sm">
                    {videoList.loading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : introVideo ? (
                        <VideoCard
                            isYoutube={true}
                            videoUrl={introVideo.video_url}
                            title={lang === 'TH' ? introVideo.video_title : introVideo.video_title_eng}
                        />
                    ) : null}
                </div>
            </Reveal>

            <Divider />

            {/* ── VR ── */}
            <Reveal>
                <SectionLabel text="VR" />
                <SectionTitle title={t('vr_learning')} />
                <div className="rounded-2xl border border-green-light/20 overflow-hidden bg-white divide-y divide-green-light/15 shadow-sm">
                    {vr.loading ? (
                        <div className="p-8 flex justify-center">
                            <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : vr.data.map((item, i) => (
                        <VrListItem
                            key={item.meta_id}
                            item={item}
                            index={i}
                            lang={lang}
                            onClick={() => setSelectedVr(item)}
                        />
                    ))}
                </div>
            </Reveal>

            {/* ── YouTube Videos ── */}
            <Reveal>
                <SectionLabel text={t('project_videos') || 'วิดีโอโครงการ'} />
                <SectionTitle
                    title={t('project_videos')}
                    badge={videoList.loading ? '...' : `${youtubeVideos.length} ${t('list_unit')}`}
                />
                {videoList.loading ? (
                    <div className="h-40 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {youtubeVideos.map((v) => (
                            <div key={v.video_id} className="rounded-2xl overflow-hidden border border-green-light/20 shadow-sm">
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
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                        style={{ backgroundColor: 'rgba(15,20,15,0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
                        onClick={() => setSelectedVr(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 24, scale: 0.97 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full sm:max-w-2xl mx-4 mb-4 sm:mb-0 overflow-hidden"
                            style={{
                                borderRadius: 24,
                                background: '#fff',
                                boxShadow: '0 24px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Video */}
                            <div style={{ position: 'relative', background: '#000', borderRadius: '24px 24px 0 0', overflow: 'hidden' }}>
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

                                {/* VR badge */}
                                <div style={{
                                    position: 'absolute', top: 14, left: 14,
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '5px 10px', borderRadius: 99,
                                    background: 'rgba(255,255,255,0.12)',
                                    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    pointerEvents: 'none',
                                }}>
                                    <span style={{
                                        width: 6, height: 6, borderRadius: '50%',
                                        background: '#4ade80',
                                        boxShadow: '0 0 6px #4ade80',
                                        animation: 'vrpulse 2s ease-in-out infinite',
                                        display: 'inline-block',
                                    }} />
                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>
                                        VR 360°
                                    </span>
                                </div>

                                {/* Close — top right */}
                                <motion.button
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.92 }}
                                    onClick={() => setSelectedVr(null)}
                                    style={{
                                        position: 'absolute', top: 14, right: 14,
                                        width: 34, height: 34, borderRadius: 99,
                                        background: 'rgba(0,0,0,0.35)',
                                        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', color: '#fff',
                                    }}
                                >
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </motion.button>
                            </div>

                            {/* Info bar */}
                            <div style={{ padding: '18px 22px 20px', background: '#fff' }}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        {/* Label */}
                                        <p style={{
                                            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em',
                                            color: 'var(--color-green)', textTransform: 'uppercase', marginBottom: 5,
                                        }}>
                                            {t('vr_learning')}
                                        </p>
                                        {/* Title */}
                                        <p style={{
                                            fontSize: '0.95rem', fontWeight: 700,
                                            color: 'var(--color-deep-text)', lineHeight: 1.45,
                                        }}>
                                            {lang === 'TH' ? selectedVr.meta_name : selectedVr.name_eng}
                                        </p>
                                    </div>

                                    {/* Hint */}
                                    <p style={{
                                        fontSize: '0.65rem', color: 'var(--color-muted-text)',
                                        whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2,
                                    }}>
                                        {t('VR_Video_Click_empty_space_to_close')}
                                    </p>
                                </div>

                                {/* Thin divider */}
                                <div style={{ height: 1, background: 'var(--color-border)', margin: '14px 0' }} />

                                {/* Bottom row */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div style={{
                                            width: 28, height: 28, borderRadius: 8,
                                            background: 'var(--color-surface-2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <svg width="13" height="13" fill="none" stroke="var(--color-green)" strokeWidth="1.8" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.89L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                                            </svg>
                                        </div>
                                        <span style={{ fontSize: '0.72rem', color: 'var(--color-muted-text)', fontWeight: 500 }}>
                                            Virtual Reality
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => setSelectedVr(null)}
                                        style={{
                                            fontSize: '0.72rem', fontWeight: 600,
                                            color: 'var(--color-muted-text)',
                                            display: 'flex', alignItems: 'center', gap: 5,
                                            cursor: 'pointer', border: 'none', background: 'none',
                                            padding: '6px 12px', borderRadius: 8,
                                            transition: 'background 0.15s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-2)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                    >
                                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        ปิด
                                    </button>
                                </div>
                            </div>

                            <style>{`
                @keyframes vrpulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(0.65); }
                }
            `}</style>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default HomePage