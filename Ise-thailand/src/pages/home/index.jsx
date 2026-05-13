import React, { useState } from 'react'
import heroImg from "/images/heroImage.png"
import VideoCard from '../../components/itemCard/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, PieChart, Pie } from 'recharts'

const chartData = [
    { name: 'ไม่ระบุ', value: 2, color: '#7B9669' },
    { name: 'โครงการสวัสดิการสังคม การศึกษา', value: 1, color: '#6C8480' },
    { name: 'โครงการพัฒนาแบบ บูรณาการ และ อื่นๆ', value: 1, color: '#BAC8B1' },
    { name: 'โครงการภายใต้สถาบันเศรษฐกิจพอเพียง', value: 22, color: '#404E3B' },
]

const ebookData = [
    { name: 'EBOOK', value: 6, color: '#7B9669' },
    { name: 'ผลงานวิชาการ', value: 1, color: '#BAC8B1' },
]

const vrItems = [
    { label: 'โครงการบ้านบัว', videoSrc: '/videos/LearningMedia/meta1.mp4' },
    { label: 'กลุ่มข้าวคุณค่า ชาวนาคุณธรรม', videoSrc: '/videos/LearningMedia/meta2.mp4' },
    { label: 'นายสุนัน เผ้าหอม (ขอนแก่น)', videoSrc: '/videos/LearningMedia/meta3.mp4' },
    { label: 'นายสมชาย นิลอนันต์ (สุราษฎร์ธานี)', videoSrc: '/videos/LearningMedia/meta4.mp4' },
    { label: 'นายบุญเป็ง จันต๊ะภา (เชียงราย)', videoSrc: '/videos/LearningMedia/meta5.mp4' },
]

const VIDEO_LIST = [
    { url: "https://www.youtube.com/embed/gJqEVuI5QHk?si=PtcExCEdrJBszODA", title: "การพัฒนาและยกระดับศักยภาพและความเข้มแข็งของชุมชนตามหลักปรัชญาเศรษฐกิจพอเพียง ในจังหวัดกาญจนบุรี", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง, ชุมชนบ้านหนองสะแก ตำบลวังศาลา อำเภอท่าม่วง จังหวัดกาญจนบุรี" },
    { url: "https://www.youtube.com/embed/7yYWbcVvgqg?si=ofYVUdhNBjmVmd7e", title: "การพัฒนาและยกระดับศักยภาพและความเข้มแข็งของชุมชนตามหลักปรัชญาเศรษฐกิจพอเพียง ในจังหวัดกาญจนบุรี", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง, ชุมชนบ้านหนองสะแก ตำบลวังศาลา อำเภอท่าม่วง จังหวัดกาญจนบุรี" },
    { url: "https://www.youtube.com/embed/hAo3nl3OA3c?si=Fsq4P1f7dfiOdf9Y", title: "การพัฒนาและยกระดับศักยภาพและความเข้มแข็งของชุมชนตามหลักปรัชญาเศรษฐกิจพอเพียง ในจังหวัดกาญจนบุรี", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง, ชุมชนบ้านหนองสะแก ตำบลวังศาลา อำเภอท่าม่วง จังหวัดกาญจนบุรี" },
    { url: "https://www.youtube.com/embed/3Fge1VIXEMU?si=3X-PcSDiYM5Go31p", title: "การพัฒนาและยกระดับศักยภาพและความเข้มแข็งของชุมชนตามหลักปรัชญาเศรษฐกิจพอเพียง ในจังหวัดกาญจนบุรี", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง, ชุมชนบ้านหนองสะแก ตำบลวังศาลา อำเภอท่าม่วง จังหวัดกาญจนบุรี" },
    { url: "https://www.youtube.com/embed/42mn1j9A2bM?si=BwSkn_TshXDhXTMj", title: "การพัฒนาและยกระดับศักยภาพและความเข้มแข็งของชุมชนตามหลักปรัชญาเศรษฐกิจพอเพียง ในจังหวัดกาญจนบุรี", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง, ชุมชนบ้านหนองสะแก ตำบลวังศาลา อำเภอท่าม่วง จังหวัดกาญจนบุรี" },
    { url: "https://www.youtube.com/embed/MyvuOPbiROo?si=hAWFravChiivVVJM", title: "การพัฒนาและยกระดับศักยภาพและความเข้มแข็งของชุมชนตามหลักปรัชญาเศรษฐกิจพอเพียง ในจังหวัดกาญจนบุรี", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง, ชุมชนบ้านหนองสะแก ตำบลวังศาลา อำเภอท่าม่วง จังหวัดกาญจนบุรี" },
    { url: "https://www.youtube.com/embed/GgXcjhypu7o?si=AzOShKiYeQHC1fls", title: "การพัฒนาและยกระดับศักยภาพและความเข้มแข็งของชุมชนตามหลักปรัชญาเศรษฐกิจพอเพียง ในจังหวัดกาญจนบุรี", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง, ชุมชนบ้านหนองสะแก ตำบลวังศาลา อำเภอท่าม่วง จังหวัดกาญจนบุรี" },
    { url: "https://www.youtube.com/embed/iw5Fvuvu8Eo?si=jav1QYbBYMr8YdpM", title: "การพัฒนาและยกระดับศักยภาพและความเข้มแข็งของชุมชนตามหลักปรัชญาเศรษฐกิจพอเพียง ในจังหวัดกาญจนบุรี", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง, ชุมชนบ้านหนองสะแก ตำบลวังศาลา อำเภอท่าม่วง จังหวัดกาญจนบุรี" },
    { url: "https://www.youtube.com/embed/CUeL7kgvOk0?si=HrgO98wrVn6orZjW", title: "การพัฒนาและยกระดับศักยภาพและความเข้มแข็งของชุมชนตามหลักปรัชญาเศรษฐกิจพอเพียง ในจังหวัดกาญจนบุรี", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง, ชุมชนบ้านหนองสะแก ตำบลวังศาลา อำเภอท่าม่วง จังหวัดกาญจนบุรี" },
    { url: "https://www.youtube.com/embed/4oDZ1Vkc9RI?si=5YjL8LqOUPFzddEq", title: "การพัฒนาและยกระดับศักยภาพและความเข้มแข็งของชุมชนตามหลักปรัชญาเศรษฐกิจพอเพียง ในจังหวัดกาญจนบุรี", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง, ชุมชนบ้านหนองสะแก ตำบลวังศาลา อำเภอท่าม่วง จังหวัดกาญจนบุรี" },
    { url: "https://www.youtube.com/embed/MyvuOPbiROo?si=hAWFravChiivVVJM", title: "การพัฒนาและยกระดับศักยภาพและความเข้มแข็งของชุมชนตามหลักปรัชญาเศรษฐกิจพอเพียง ในจังหวัดกาญจนบุรี", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง, ชุมชนบ้านหนองสะแก ตำบลวังศาลา อำเภอท่าม่วง จังหวัดกาญจนบุรี" },
]

// CSS variable shortcuts
const C = {
    forestGreen: 'var(--color-forest-green)',   // #404e3b
    green: 'var(--color-green)',                // #7b9669
    greenLight: 'var(--color-green-light)',     // #bac8b1
    white: 'var(--color-white)',                // #ffffff
    shadow: 'var(--color-shadow)',
    deepText: 'var(--color-deep-text)',         // #404e3b
    mutedText: 'var(--color-muted-text)',       // #6c8480
}

function Divider() {
    return <div style={{ borderTop: `1px solid ${C.greenLight}` }} />
}

function SectionHeader({ title, badge }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: C.deepText }}>
                {title}
            </h2>
            {badge && (
                <span
                    className="px-3 py-1.5 rounded-full text-xs"
                    style={{ color: C.mutedText, backgroundColor: '#bac8b133' }}
                >
                    {badge}
                </span>
            )}
        </div>
    )
}

function VideoModal({ src, title, onClose }) {
    if (!src) return null
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
            onClick={onClose}
        >
            <div
                className="relative rounded-2xl overflow-hidden shadow-2xl w-[90%] max-w-3xl bg-black"
                onClick={e => e.stopPropagation()}
            >
                <div
                    className="flex items-center justify-between px-5 py-3"
                    style={{ backgroundColor: C.white }}
                >
                    <p className="font-medium truncate pr-4 text-sm" style={{ color: C.deepText }}>{title}</p>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                        style={{ backgroundColor: '#bac8b133', color: C.deepText }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#bac8b166'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#bac8b133'}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <video key={src} controls autoPlay className="w-full max-h-[70vh] block">
                    <source src={src} type="video/mp4" />
                </video>
            </div>
        </div>
    )
}

function HomePage() {
    const [activeVideo, setActiveVideo] = useState(null)

    const cardBase = {
        backgroundColor: C.white,
        border: `1px solid ${C.greenLight}`,
        boxShadow: `0 2px 8px ${C.shadow}`,
    }

    return (
        <div className="space-y-12 py-4" style={{ backgroundColor: C.white }}>
            <VideoModal
                src={activeVideo?.src}
                title={activeVideo?.title}
                onClose={() => setActiveVideo(null)}
            />

            {/* Hero */}
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.greenLight}` }}>
                <img src={heroImg} alt="Hero" className="w-full h-[600px] object-cover" />
            </div>

            {/* Stats + Shortcuts */}
            <section>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* นักวิจัย */}
                    <div className="rounded-2xl p-6 flex flex-col justify-between min-h-[140px]" style={cardBase}>
                        <p className="text-sm" style={{ color: C.mutedText }}>นักวิจัย</p>
                        <div>
                            <p className="text-5xl font-bold leading-none" style={{ color: C.deepText }}>19</p>
                            <p className="text-xs mt-1" style={{ color: C.green }}>คน</p>
                        </div>
                    </div>

                    {/* โครงการพระราชดำริ */}
                    <div
                        className="rounded-2xl p-6 flex flex-col justify-between min-h-[140px]"
                        style={{ backgroundColor: C.forestGreen, border: `1px solid ${C.forestGreen}`, boxShadow: `0 2px 8px ${C.shadow}` }}
                    >
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>โครงการพระราชดำริ</p>
                        <div>
                            <p className="text-5xl font-bold leading-none text-white">71</p>
                            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>โครงการ</p>
                        </div>
                    </div>

                    {/* ข่าวประชาสัมพันธ์ */}

                    <a href="/news"
                        className="rounded-2xl p-6 flex flex-col justify-between min-h-[140px] no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                        style={cardBase}
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${C.green}26` }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: C.green }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
                            </svg>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-sm font-medium" style={{ color: C.deepText }}>ข่าวประชาสัมพันธ์</p>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: C.greenLight }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>

                    {/* กิจกรรม */}

                    <a href="/activities"
                        className="rounded-2xl p-6 flex flex-col justify-between min-h-[140px] no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                        style={cardBase}
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${C.green}26` }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: C.green }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-sm font-medium" style={{ color: C.deepText }}>กิจกรรม</p>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: C.greenLight }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>
                </div>
            </section>

            <Divider />

            {/* วิดีโอแนะนำสถาบัน + Ebook */}
            <section>
                <SectionHeader title="วิดีโอแนะนำสถาบัน" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.greenLight}` }}>
                        <VideoCard isYoutube={false} videoUrl="/videos/proj_20230803.mp4" />
                    </div>
                    <div className="rounded-2xl p-6 flex flex-col gap-5" style={cardBase}>
                        <p className="text-base font-semibold" style={{ color: C.deepText }}>สื่อเผยแพร่</p>
                        <div className="flex justify-center">
                            <PieChart width={160} height={160}>
                                <Pie data={ebookData} cx={80} cy={80} innerRadius={44} outerRadius={72} dataKey="value" startAngle={90} endAngle={-270}>
                                    {ebookData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                            </PieChart>
                        </div>
                        <div className="space-y-3">
                            {ebookData.map((d, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                                        <p className="text-sm" style={{ color: C.mutedText }}>{d.name}</p>
                                    </div>
                                    <p className="text-sm font-semibold" style={{ color: C.deepText }}>{d.value} เรื่อง</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Divider />

            {/* โครงการ summary + chart */}
            <section>
                <SectionHeader title="โครงการภายใต้สถาบันเศรษฐกิจพอเพียง" badge="26 โครงการ" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="flex flex-col gap-3">
                        {chartData.map((item, i) => (
                            <div key={i} className="rounded-2xl p-4 flex items-center gap-4" style={cardBase}>
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: `${item.color}22` }}
                                >
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-xs" style={{ color: C.mutedText }}>{item.name}</p>
                                </div>
                                <p className="text-xl font-bold flex-shrink-0" style={{ color: C.deepText }}>{item.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="lg:col-span-2 rounded-2xl p-6" style={cardBase}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 80 }} barCategoryGap="35%">
                                <defs>
                                    {chartData.map((entry, index) => (
                                        <linearGradient key={index} id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                                            <stop offset="100%" stopColor={entry.color} stopOpacity={0.4} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(186,200,177,0.3)" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6C8480' }} interval={0} height={80} axisLine={false} tickLine={false} angle={-10} textAnchor="middle" />
                                <YAxis domain={[0, 25]} tickCount={6} tick={{ fontSize: 12, fill: '#6C8480' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '14px', border: '1px solid #BAC8B1', fontSize: '13px', padding: '10px 16px', backgroundColor: '#ffffff' }}
                                    cursor={{ fill: 'rgba(186,200,177,0.1)', radius: 8 }}
                                    formatter={(value) => [`${value} โครงการ`, 'จำนวน']}
                                />
                                <Bar dataKey="value" radius={[10, 10, 0, 0]} maxBarSize={80}>
                                    {chartData.map((entry, index) => <Cell key={index} fill={`url(#grad-${index})`} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            <Divider />

            {/* สื่อ VR + วีดีทัศน์ */}
            <section>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="flex flex-col h-full">
                        <SectionHeader title="สื่อการเรียนรู้เสมือนจริง" />
                        <div className="rounded-2xl overflow-hidden flex-1" style={cardBase}>
                            {vrItems.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveVideo({ src: item.videoSrc, title: item.label })}
                                    className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer bg-transparent transition-colors duration-150"
                                    style={{ borderBottom: i < vrItems.length - 1 ? '1px solid rgba(186,200,177,0.3)' : 'none' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(186,200,177,0.1)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium"
                                        style={{ backgroundColor: 'rgba(123,150,105,0.15)', color: C.forestGreen }}
                                    >
                                        {i + 1}
                                    </div>
                                    <p className="flex-1 text-sm leading-relaxed" style={{ color: C.deepText }}>{item.label}</p>
                                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" style={{ color: C.green }}>
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <SectionHeader title="วีดีทัศน์โครงการ" badge={`${VIDEO_LIST.length} รายการ`} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                            {VIDEO_LIST.map((v, i) => (
                                <VideoCard key={i} isYoutube={true} videoUrl={v.url} title={v.title} description={v.description} detailLink="#" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage