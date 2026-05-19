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
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // กำหนดพาเลทสี สำหรับแจกจ่ายให้ Pie Chart แต่ละหมวดหมู่
        const colorPalette = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"];

        fetcher('/Asset/count')
            .then((res) => {
                //  เช็คว่าเข้าถึงชั้นข้อมูล Array ด้านในถูกจุด
                const rawArray = res.data?.data || res.data || [];

                //  ปรับแต่งโครงสร้างฟิลด์ให้ตรงล็อกหน้าบ้านต้องการทันที
                const formattedData = rawArray.map((item, index) => ({
                    id: item.assettype_id,
                    name: item.assettype_name,
                    name_eng: item.assettype_name_eng,
                    value: Number(item.total) || 0,
                    color: colorPalette[index % colorPalette.length] // ยัดสีประจำแท่ง
                }));

                setData(formattedData);
            })
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
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

const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const Reveal = ({ children }) => (
    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
        {children}
    </motion.div>
)



function Divider() {
    return <div className="h-px w-full my-8 bg-green-light/30" />
}

function SectionHeader({ title, badge }) {
    return (
        <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-deep-text">{title}</h2>
            {badge && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold text-muted-text bg-green-light/20">
                    {badge}
                </span>
            )}
        </div>
    )
}

function StatCard({ label, value, unit, dark = false, onClick }) {
    const base = "rounded-xl p-5 flex flex-col justify-between min-h-[120px] transition-all duration-200"
    const style = dark
        ? `${base} bg-forest-green text-white shadow-md`
        : `${base} bg-white border border-green-light shadow-[0_2px_8px_var(--color-shadow)] ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : ''}`

    return (
        <motion.div whileHover={onClick ? { y: -4 } : {}} className={style} onClick={onClick}>
            <p className={`text-xs font-medium ${dark ? 'opacity-60' : 'text-muted-text'}`}>{label}</p>
            <div>
                <p className={`text-4xl font-bold ${dark ? '' : 'text-deep-text'}`}>{value}</p>
                <p className={`text-xs mt-0.5 ${dark ? 'opacity-40' : 'text-green font-semibold'}`}>{unit}</p>
            </div>
        </motion.div>
    )
}

function ClickableCard({ label, icon, onClick }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="rounded-xl p-5 flex flex-col justify-between min-h-[120px] cursor-pointer bg-white border border-green-light shadow-[0_2px_8px_var(--color-shadow)] hover:shadow-md transition-all"
            onClick={onClick}
        >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-green/10">
                {icon}
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-deep-text">{label}</span>
                <svg className="w-4 h-4 text-green-light" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </motion.div>
    )
}

function HomePage() {
    const [selectedActivity, setSelectedActivity] = useState(null)
    const [showActivityModal, setShowActivityModal] = useState(false)
    const [showNewsModal, setShowNewsModal] = useState(false)
    const [selectedVr, setSelectedVr] = useState(null)

    const { lang } = useLang()
    const { t } = useTranslation()

    const activity = useActivity()
    const { data: ebookData, loading } = useEbookData();
    const vr = useVrItems()
    const videoList = useVideoList()
    const royalData = useRoyalData()
    const researcherData = useResearcherData()
    const projectData = useProjectData()

    const introVideo = videoList.data.find(v => !v.video_url.includes('youtube'))

    return (
        <div className="space-y-10">
            {/* 1. Hero */}
            <Reveal>
                <div className="rounded-2xl overflow-hidden border border-green-light">
                    <img src={heroImg} alt="Hero" className="w-full h-full object-cover bg-neutral-100" />
                </div>
            </Reveal>

            {/* 2. Stats Grid */}
            <Reveal>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label={t('researcher')}
                        value={researcherData.loading ? '...' : researcherData.data}
                        unit={t('researcher_unit')}
                    />
                    <StatCard
                        label={t('royal_project')}
                        value={royalData.loading ? '...' : royalData.data}
                        unit={t('royal_project_unit')}
                        dark
                    />
                    <ClickableCard
                        label={t('news')}
                        onClick={() => setShowNewsModal(true)}
                        icon={
                            <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
                            </svg>
                        }
                    />
                    <ClickableCard
                        label={t('activities')}
                        onClick={() => setShowActivityModal(true)}
                        icon={
                            <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        }
                    />
                </div>
            </Reveal>

            <Divider />

            {/* 3. Institute Video & E-Book */}
            <Reveal>
                <section>
                    <SectionHeader title={t('institute_video')} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Video */}
                        <div className="lg:col-span-2 rounded-xl overflow-hidden border border-green-light">
                            {videoList.loading ? (
                                <div className="aspect-video bg-neutral-100 flex items-center justify-center">
                                    <p className="text-sm text-muted-text">{t('loading')}</p>
                                </div>
                            ) : introVideo ? (
                                <VideoCard
                                    isYoutube={false}
                                    videoUrl={introVideo.video_url}
                                    title={lang === 'TH' ? introVideo.video_title : introVideo.video_title_eng}
                                />
                            ) : null}
                        </div>

                        {/* E-Book Pie */}

                        {loading ? <p>{t('processing_media')}</p> :
                            <>
                                <div className="rounded-xl p-6 bg-white border border-green-light shadow-[0_2px_8px_var(--color-shadow)]">
                                    <p className="text-sm font-bold mb-4 text-deep-text">{t('media')}</p>
                                    <div className="flex justify-center mb-4">
                                        <PieChart width={160} height={160}>
                                            <Pie data={ebookData} cx={80} cy={80} innerRadius={44} outerRadius={70} dataKey="value">
                                                {ebookData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                            </Pie>
                                        </PieChart>
                                    </div>
                                    <div className="space-y-2.5">
                                        {ebookData.map((d, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                                                    <p className="text-xs text-muted-text">{lang === 'TH' ? d.name : d.name_eng}</p>
                                                </div>
                                                <p className="text-xs font-bold text-deep-text">{d.value} {t('media_unit')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>}
                    </div>
                </section>
            </Reveal>

            <Divider />

            {/* 4. Projects & Bar Chart */}
            <Reveal>
                <section>
                    <SectionHeader
                        title={t('institute_projects')}
                        badge={projectData.loading ? '...' : `${projectData.data.reduce((s, d) => s + d.value, 0)} ${t('project_unit')}`}
                    />
                    {projectData.loading ? (
                        <p className="text-sm text-muted-text">{t('loading')}</p>
                    ) : (
                        <div className="flex flex-col gap-6">

                            {/* Bar Chart — เต็มความกว้าง */}
                            <div className="rounded-xl p-6 bg-white border border-green-light shadow-[0_2px_8px_var(--color-shadow)]">
                                <ResponsiveContainer width="100%" height={projectData.data.filter(d => d.value > 0).length * 60 + 60}>
                                    <BarChart
                                        data={projectData.data.filter(d => d.value > 0)}
                                        layout="vertical"
                                        margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                                        <XAxis
                                            type="number"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'var(--color-muted-text)', fontSize: 11 }}
                                            allowDecimals={false}
                                        />
                                        <YAxis
                                            type="category"
                                            dataKey={lang === 'TH' ? 'name' : 'name_eng'}
                                            width={160}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'var(--color-muted-text)', fontSize: 11 }}
                                            tickFormatter={(val) => val.length > 18 ? val.slice(0, 18) + '...' : val}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(186,200,177,0.15)' }}
                                            formatter={(value, name, props) => [
                                                `${value} ${t('royal_project_unit')}`,
                                                lang === 'TH' ? props.payload.name : props.payload.name_eng
                                            ]}
                                            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #BAC8B1' }}
                                        />
                                        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
                                            {projectData.data.filter(d => d.value > 0).map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Type List */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {projectData.data.filter(d => d.value > 0).map((item, i) => (
                                    <div key={i} className="rounded-lg px-4 py-3 flex items-center gap-3 bg-white border border-green-light shadow-[0_2px_8px_var(--color-shadow)]">
                                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                        <p className="flex-1 text-xs text-muted-text leading-snug">{lang === 'TH' ? item.name : item.name_eng}</p>
                                        <p className="text-base font-bold text-deep-text">{item.value}</p>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}
                </section>
            </Reveal>

            <Divider />

            {/* 5. VR & Video List */}
            <Reveal>
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* VR List */}
                    <div>
                        <SectionHeader title={t('vr_learning')} />
                        <div className="rounded-xl overflow-hidden border border-green-light">
                            {vr.loading ? (
                                <p className="px-5 py-4 text-sm text-muted-text">{t('loading')}</p>
                            ) : vr.data.map((item, i) => (
                                <button
                                    key={item.meta_id}
                                    onClick={() => setSelectedVr(item)}
                                    className="w-full flex items-center gap-3 px-5 py-4 border-b border-green-light/20 last:border-0 text-left hover:bg-green/5 transition-colors"
                                >
                                    {console.log("vr data", vr)}
                                    <span className="w-6 h-6 rounded-full bg-green/10 text-green flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        {i + 1}
                                    </span>
                                    <p className="text-sm text-deep-text">{lang === 'TH' ? item.meta_name : item.name_eng}</p>
                                    <svg className="w-4 h-4 text-green-light ml-auto flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Video List */}
                    <div className="lg:col-span-2">
                        <SectionHeader
                            title={t('project_videos')}
                            badge={videoList.loading ? '...' : `${videoList.data.filter(v => v.video_url.includes('youtube')).length} ${t('list_unit')}`}
                        />
                        {videoList.loading ? (
                            <p className="text-sm text-muted-text">{t('loading')}</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {videoList.data.filter(v => v.video_url.includes('youtube')).map((v) => (
                                    <VideoCard
                                        key={v.video_id}
                                        isYoutube={true}
                                        videoUrl={v.video_url}
                                        title={lang === 'TH' ? v.video_title : v.video_title_eng}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                </section>
            </Reveal>

            {/* Modals */}
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
                        style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                        onClick={() => setSelectedVr(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-3xl rounded-2xl overflow-hidden bg-white"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-green-light/30">
                                <h3 className="text-sm font-bold text-deep-text">{lang === 'TH' ? selectedVr.meta_name : selectedVr.name_eng}</h3>
                                <button
                                    onClick={() => setSelectedVr(null)}
                                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-green/10 transition-colors"
                                >
                                    <svg className="w-4 h-4 text-muted-text" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="w-full aspect-video bg-black">
                                <video key={selectedVr.meta_id} className="w-full h-full" controls autoPlay preload="metadata">
                                    <source src={`${UPLOADS_URL}${selectedVr.path}`} type="video/mp4" />
                                </video>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default HomePage