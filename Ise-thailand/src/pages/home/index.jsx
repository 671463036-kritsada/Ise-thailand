import React, { useState } from 'react'
import { motion } from 'framer-motion'
import heroImg from "/images/heroImage.png"
import VideoCard from '../../components/itemCard/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, PieChart, Pie } from 'recharts'

// --- Animation Config ---
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.8, ease: "easeOut" } 
    }
}

const Reveal = ({ children }) => (
    <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
    >
        {children}
    </motion.div>
)

// --- Full Data (ข้อมูลเดิมครบถ้วน) ---
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
    { label: 'นายสุนัน เผ้าหอม (ขอนแก่น)', videoSrc: '/videos/LearningMedia/meta1.mp4' },
    { label: 'นายสมชาย นิลอนันต์ (สุราษฎร์ธานี)', videoSrc: '/videos/LearningMedia/meta2.mp4' },
    { label: 'นายบุญเป็ง จันต๊ะภา (เชียงราย)', videoSrc: '/videos/LearningMedia/meta1.mp4' },
]

const VIDEO_LIST = [
    { url: "https://www.youtube.com/embed/gJqEVuI5QHk", title: "การพัฒนาและยกระดับศักยภาพ... (กาญจนบุรี)", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง..." },
    { url: "https://www.youtube.com/embed/7yYWbcVvgqg", title: "การพัฒนาและยกระดับศักยภาพ... (กาญจนบุรี)", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง..." },
    { url: "https://www.youtube.com/embed/hAo3nl3OA3c", title: "การพัฒนาและยกระดับศักยภาพ... (กาญจนบุรี)", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง..." },
    { url: "https://www.youtube.com/embed/3Fge1VIXEMU", title: "การพัฒนาและยกระดับศักยภาพ... (กาญจนบุรี)", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง..." },
    { url: "https://www.youtube.com/embed/42mn1j9A2bM", title: "การพัฒนาและยกระดับศักยภาพ... (กาญจนบุรี)", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง..." },
    { url: "https://www.youtube.com/embed/MyvuOPbiROo", title: "การพัฒนาและยกระดับศักยภาพ... (กาญจนบุรี)", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง..." },
    { url: "https://www.youtube.com/embed/GgXcjhypu7o", title: "การพัฒนาและยกระดับศักยภาพ... (กาญจนบุรี)", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง..." },
    { url: "https://www.youtube.com/embed/iw5Fvuvu8Eo", title: "การพัฒนาและยกระดับศักยภาพ... (กาญจนบุรี)", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง..." },
    { url: "https://www.youtube.com/embed/CUeL7kgvOk0", title: "การพัฒนาและยกระดับศักยภาพ... (กาญจนบุรี)", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง..." },
    { url: "https://www.youtube.com/embed/4oDZ1Vkc9RI", title: "การพัฒนาและยกระดับศักยภาพ... (กาญจนบุรี)", description: "ชุมชนบ้านหนองปลวก ตำบลทุ่งทอง..." },
]

// CSS Variables Mapping
const C = {
    forestGreen: 'var(--color-forest-green)',
    green: 'var(--color-green)',
    greenLight: 'var(--color-green-light)',
    white: 'var(--color-white)',
    shadow: 'var(--color-shadow)',
    deepText: 'var(--color-deep-text)',
    mutedText: 'var(--color-muted-text)',
}

// --- Internal Components ---
function Divider() {
    return <div className="h-px w-full my-12" style={{ backgroundColor: C.greenLight, opacity: 0.3 }} />
}

function SectionHeader({ title, badge }) {
    return (
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold" style={{ color: C.deepText }}>{title}</h2>
            {badge && (
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold" style={{ color: C.mutedText, backgroundColor: '#bac8b133' }}>
                    {badge}
                </span>
            )}
        </div>
    )
}

function HomePage() {
    const [activeVideo, setActiveVideo] = useState(null)

    const cardStyle = {
        backgroundColor: C.white,
        border: `1px solid ${C.greenLight}`,
        boxShadow: `0 4px 12px ${C.shadow}`,
    }

    return (
        <div className="space-y-16 " style={{ backgroundColor: C.white }}>
            
            {/* 1. Hero Section */}
            <Reveal>
                <div className="rounded-[2rem] overflow-hidden " style={{ borderColor: C.greenLight }}>
                    {/* ปรับเป็น object-contain เพื่อให้เห็นภาพเต็ม */}
                    <img 
                        src={heroImg} 
                        alt="Hero" 
                        className="w-full h-full object-cover bg-neutral-100" 
                    />
                </div>  
            </Reveal>

           {/* 2. Stats Grid */}
            <Reveal>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* นักวิจัย */}
                    <div className="rounded-2xl p-8 flex flex-col justify-between min-h-[160px]" style={cardStyle}>
                        <p className="text-sm font-medium" style={{ color: C.mutedText }}>นักวิจัย</p>
                        <div>
                            <p className="text-5xl font-bold" style={{ color: C.deepText }}>19</p>
                            <p className="text-xs font-bold mt-1" style={{ color: C.green }}>คน</p>
                        </div>
                    </div>

                    {/* โครงการพระราชดำริ */}
                    <div className="rounded-2xl p-8 flex flex-col justify-between min-h-[160px] text-white shadow-lg" style={{ backgroundColor: C.forestGreen }}>
                        <p className="text-sm opacity-70">โครงการพระราชดำริ</p>
                        <div>
                            <p className="text-5xl font-bold">71</p>
                            <p className="text-xs opacity-50 mt-1">โครงการ</p>
                        </div>
                    </div>

                    {/* ข่าวประชาสัมพันธ์ (ปุ่มที่หายไป) */}
                    <motion.a 
                        href="/news"
                        whileHover={{ y: -8 }}
                        className="rounded-2xl p-8 flex flex-col justify-between min-h-[160px] no-underline transition-shadow hover:shadow-xl"
                        style={cardStyle}
                    >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.green}15` }}>
                            <svg className="w-6 h-6" fill="none" stroke={C.green} strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
                            </svg>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-bold" style={{ color: C.deepText }}>ข่าวประชาสัมพันธ์</span>
                            <svg className="w-5 h-5" fill="none" stroke={C.greenLight} strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </motion.a>

                    {/* กิจกรรม (ปุ่มที่หายไป) */}
                    <motion.a 
                        href="/activities"
                        whileHover={{ y: -8 }}
                        className="rounded-2xl p-8 flex flex-col justify-between min-h-[160px] no-underline transition-shadow hover:shadow-xl"
                        style={cardStyle}
                    >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.green}15` }}>
                            <svg className="w-6 h-6" fill="none" stroke={C.green} strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-bold" style={{ color: C.deepText }}>กิจกรรม</span>
                            <svg className="w-5 h-5" fill="none" stroke={C.greenLight} strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </motion.a>

                </div>
            </Reveal>

            <Divider />

            {/* 3. Institute Video & E-Book */}
            <Reveal>
                <section>
                    <SectionHeader title="วิดีโอแนะนำสถาบัน" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 rounded-2xl overflow-hidden border" style={{ borderColor: C.greenLight }}>
                            <VideoCard isYoutube={false} videoUrl="/videos/proj_20230803.mp4" />
                        </div>
                        <div className="rounded-2xl p-8" style={cardStyle}>
                            <p className="text-lg font-bold mb-6" style={{ color: C.deepText }}>สื่อเผยแพร่</p>
                            <div className="flex justify-center mb-6">
                                <PieChart width={180} height={180}>
                                    <Pie data={ebookData} cx={90} cy={90} innerRadius={50} outerRadius={80} dataKey="value">
                                        {ebookData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                    </Pie>
                                </PieChart>
                            </div>
                            <div className="space-y-4">
                                {ebookData.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                                            <p className="text-sm" style={{ color: C.mutedText }}>{d.name}</p>
                                        </div>
                                        <p className="text-sm font-bold" style={{ color: C.deepText }}>{d.value} เรื่อง</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </Reveal>

            <Divider />

            {/* 4. Projects & Bar Chart */}
            <Reveal>
                <section>
                    <SectionHeader title="โครงการภายใต้สถาบันเศรษฐกิจพอเพียง" badge="26 โครงการ" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="flex flex-col gap-4">
                            {chartData.map((item, i) => (
                                <div key={i} className="rounded-xl p-5 flex items-center gap-4" style={cardStyle}>
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}22` }}>
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    </div>
                                    <p className="flex-1 text-xs font-medium" style={{ color: C.mutedText }}>{item.name}</p>
                                    <p className="text-xl font-bold" style={{ color: C.deepText }}>{item.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-2 rounded-2xl p-8" style={cardStyle}>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="name" hide />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: C.mutedText, fontSize: 12}} />
                                    <Tooltip cursor={{fill: 'transparent'}} />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                        {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </section>
            </Reveal>

            <Divider />

            {/* 5. VR & Video List */}
            <Reveal>
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div>
                        <SectionHeader title="สื่อการเรียนรู้เสมือนจริง" />
                        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: C.greenLight }}>
                            {vrItems.map((item, i) => (
                                <button 
                                    key={i} 
                                    className="w-full flex items-center gap-4 px-6 py-5 border-b last:border-0 text-left hover:bg-green/5 transition-colors"
                                    style={{ borderColor: `${C.greenLight}33` }}
                                >
                                    <span className="w-7 h-7 rounded-full bg-green/10 text-green flex items-center justify-center text-xs font-bold">{i+1}</span>
                                    <p className="text-sm font-medium" style={{ color: C.deepText }}>{item.label}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <SectionHeader title="วีดีทัศน์โครงการ" badge={`${VIDEO_LIST.length} รายการ`} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {VIDEO_LIST.map((v, i) => (
                                <VideoCard key={i} isYoutube={true} videoUrl={v.url} title={v.title} description={v.description} />
                            ))}
                        </div>
                    </div>
                </section>
            </Reveal>
        </div>
    )
}

export default HomePage