import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'  // เปลี่ยนมาใช้ axios

import { UPLOADS_URL } from '../../constants/uploads_url'

export default function ProjectDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentImg, setCurrentImg] = useState(0)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/royal/type/${id}`)
                const item = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data
                setProject(item || null)
            } catch (err) {
                console.error('API error:', err)
                setProject(null)
            } finally {
                setLoading(false)
            }
        }
        fetchProject()
    }, [id])


    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <p style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-sm)' }}>กำลังโหลด...</p>
        </div>
    )

    if (!project) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <p style={{ color: 'var(--color-muted-text)' }}>ไม่พบโครงการนี้</p>
            <button onClick={() => navigate('/projects')}
                className="text-sm px-4 py-2 rounded-xl"
                style={{ backgroundColor: 'var(--color-forest-green)', color: '#fff' }}>
                กลับไปหน้าโครงการ
            </button>
        </div>
    )

    const images = [project.img_banner, project.img_1, project.img_2, project.img_3, project.img_4, project.img_5]
        .filter(Boolean)
        .map(f => `${UPLOADS_URL}${f}`)

    const sections = [1, 2, 3, 4, 5]
        .map(n => ({
            title: project[`title_${n}`],
            detail: project[`detail_${n}`],
            image: project[`img_${n}`] ? `${UPLOADS_URL}${project[`img_${n}`]}` : null,
        }))
        .filter(s => s.title || s.detail)

    const references = project.reference
        ? project.reference.split('\n').filter(Boolean)
        : []

    const prev = () => setCurrentImg(i => (i - 1 + images.length) % images.length)
    const next = () => setCurrentImg(i => (i + 1) % images.length)

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>

            {/* Back */}
            <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm mb-6 transition-colors"
                style={{ color: 'var(--color-muted-text)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-forest-green)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted-text)'}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                กลับ
            </button>

            {/* Hero Slider */}
            {images.length > 0 && (
                <div className="relative rounded-2xl overflow-hidden mb-3 group"
                    style={{ height: 720, boxShadow: '0 4px 20px var(--color-shadow-lg)' }}>
                    <img src={images[currentImg]} alt={project.royal_name}
                        className="w-full h-full object-cover transition-all duration-500" />
                    <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(40,56,36,0.88) 0%, rgba(40,56,36,0.15) 55%, transparent 100%)' }} />

                    {/* Gold accent top bar */}
                    <div className="absolute top-0 left-0 right-0 h-1"
                        style={{ backgroundColor: 'var(--color-gold)' }} />

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {project.type_name && (
                                <span className="text-xs px-3 py-1 rounded-full backdrop-blur-sm"
                                    style={{
                                        color: '#fff',
                                        backgroundColor: 'rgba(123,150,105,0.5)',
                                        border: '1px solid rgba(186,200,177,0.5)',
                                        fontSize: 'var(--font-size-xs)',
                                    }}>
                                    {project.type_name}
                                </span>
                            )}
                            {project.royal_id && (
                                <span className="text-xs px-3 py-1 rounded-full backdrop-blur-sm"
                                    style={{
                                        color: 'var(--color-gold)',
                                        backgroundColor: 'rgba(201,168,76,0.15)',
                                        border: '1px solid rgba(201,168,76,0.4)',
                                        fontSize: 'var(--font-size-xs)',
                                    }}>
                                    #{project.royal_id}
                                </span>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold leading-relaxed text-white drop-shadow-md">
                            {project.royal_name}
                        </h1>
                    </div>

                    {images.length > 1 && <>
                        <button onClick={prev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.92)',
                                color: 'var(--color-forest-green)',
                                boxShadow: '0 2px 8px var(--color-shadow-md)',
                            }}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button onClick={next}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.92)',
                                color: 'var(--color-forest-green)',
                                boxShadow: '0 2px 8px var(--color-shadow-md)',
                            }}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div className="absolute top-6 right-4 text-xs px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: 'rgba(40,56,36,0.65)', color: '#fff' }}>
                            {currentImg + 1} / {images.length}
                        </div>
                    </>}
                </div>
            )}

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 mb-8 overflow-x-auto pb-1">
                    {images.map((src, i) => (
                        <button key={i} onClick={() => setCurrentImg(i)}
                            className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200"
                            style={{
                                border: `2px solid ${i === currentImg ? 'var(--color-green)' : 'var(--color-border)'}`,
                                opacity: i === currentImg ? 1 : 0.5,
                                transform: i === currentImg ? 'scale(1.05)' : 'scale(1)',
                            }}>
                            <img src={src} alt="" className="w-20 h-14 object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {/* Sections */}
            <div className="space-y-12 mt-8">
                {sections.map((s, i) => (
                    <div key={i} className={`flex gap-8 items-start ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                    style={{ backgroundColor: 'var(--color-forest-green)' }}>
                                    {i + 1}
                                </div>
                                <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
                            </div>
                            {s.title && (
                                <h2 className="font-bold mb-3 leading-relaxed"
                                    style={{ color: 'var(--color-deep-text)', fontSize: 'var(--font-size-lg)' }}>
                                    {s.title}
                                </h2>
                            )}
                            {s.detail && (
                                <p className="text-sm leading-relaxed"
                                    style={{ color: 'var(--color-muted-text)', lineHeight: '1.9' }}>
                                    {s.detail}
                                </p>
                            )}
                        </div>

                        {/* Image */}
                        {s.image && (
                            <div className="flex-shrink-0 rounded-2xl overflow-hidden"
                                style={{ width: '42%', boxShadow: '0 2px 12px var(--color-shadow-md)' }}>
                                <img src={s.image} alt={s.title} className="w-full object-cover" style={{ height: 240 }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Infographic */}
            {project.infographic && (
                <div className="mt-12">
                    <div className="h-px w-full mb-6" style={{ backgroundColor: 'var(--color-border)' }} />
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-xs font-semibold" style={{ color: 'var(--color-deep-text)' }}>อินโฟกราฟิก</p>
                        <div className="rounded-xl overflow-hidden w-2/4"
                            style={{ boxShadow: '0 2px 8px var(--color-shadow-md)' }}>
                            <img src={`${UPLOADS_URL}${project.infographic}`} alt="infographic" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            )}

            {/* References */}
            {references.length > 0 && (
                <div className="mt-10 rounded-2xl p-6"
                    style={{
                        backgroundColor: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border)',
                    }}>
                    <div className="flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4" style={{ color: 'var(--color-green)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-deep-text)' }}>แหล่งอ้างอิง</p>
                    </div>
                    <ol className="space-y-2">
                        {references.map((ref, i) => (
                            <li key={i} className="flex gap-3">
                                <span className="text-xs font-semibold flex-shrink-0 mt-0.5"
                                    style={{ color: 'var(--color-green)' }}>{i + 1}.</span>
                                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-muted-text)' }}>{ref}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Bottom nav */}
            <div className="mt-12 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                <button onClick={() => navigate('/projects')}
                    className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl transition-all"
                    style={{ backgroundColor: 'var(--color-forest-green)', color: '#fff' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-green)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-forest-green)'}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    กลับไปยังโครงการทั้งหมด
                </button>
            </div>
        </div>
    )
}