import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useLang } from '../../context/LanguageContext'
import { useTranslation } from 'react-i18next'
import { UPLOADS_URL } from '../../constants/uploads_url'

const isValidImg = (f) => f && f.trim() !== '' && f !== 'undefined' && f !== 'null'

export default function ProjectDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [gallery, setGallery] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentImg, setCurrentImg] = useState(0)
    const { lang } = useLang()
    const { t } = useTranslation()
    const contentRef = useRef(null)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [projRes, galleryRes] = await Promise.all([
                    api.get(`/royal/type/${id}`),
                    api.get(`/royal/${id}/gallery`),
                ])
                const item = Array.isArray(projRes.data.data) ? projRes.data.data[0] : projRes.data.data
                setProject(item || null)

                const galleryImgs = (galleryRes.data.data || [])
                    .map(g => g.royal_imgname)
                    .filter(isValidImg)
                    .map(f => `${UPLOADS_URL}${f}`)

                if (galleryImgs.length > 0) {
                    setGallery(galleryImgs)
                } else if (item) {
                    const fallback = [item.img_banner, item.img_1, item.img_2, item.img_3, item.img_4, item.img_5]
                        .filter(isValidImg)
                        .map(f => `${UPLOADS_URL}${f}`)
                    setGallery(fallback)
                }
            } catch (err) {
                console.error('API error:', err)
                setProject(null)
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [id])

    const handleExportPDF = () => {
        window.print()
    }

    const prev = () => setCurrentImg(i => (i - 1 + gallery.length) % gallery.length)
    const next = () => setCurrentImg(i => (i + 1) % gallery.length)

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <p style={{ color: 'var(--color-muted-text)' }}>{t('loading')}</p>
        </div>
    )

    if (!project) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <p style={{ color: 'var(--color-muted-text)' }}>{t('project_not_found_detail')}</p>
            <button onClick={() => navigate('/projects')}
                className="text-sm px-4 py-2 rounded-xl"
                style={{ backgroundColor: 'var(--color-forest-green)', color: '#fff' }}>
                {t('back_to_projects')}
            </button>
        </div>
    )

    const sections = [1, 2, 3, 4, 5]
        .map(n => ({
            title: project[`title_${n}`],
            title_eng: project[`title_${n}_eng`],
            detail: project[`detail_${n}`],
            detail_eng: project[`detail_${n}_eng`],
        }))
        .filter(s => s.title || s.detail)

    const references = lang === 'TH'
        ? (project.reference ? project.reference.split('\n').filter(Boolean) : [])
        : (project.reference_eng ? project.reference_eng.split('\n').filter(Boolean) : [])

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>

            {/* Back + Export — ซ่อนตอน print */}
            <div className="print-hide flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm transition-colors"
                    style={{ color: 'var(--color-muted-text)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-forest-green)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted-text)'}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('back')}
                </button>

                <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-all"
                    style={{ backgroundColor: 'var(--color-forest-green)', color: '#fff' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-green)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-forest-green)'}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t('export_pdf') || 'Export PDF'}
                </button>
            </div>

            {/* ── Content ที่จะ print ── */}
            <div ref={contentRef} id="print-content">

                {/* ชื่อโครงการ */}
                <h1 className="text-center text-xl font-bold mb-6 leading-relaxed"
                    style={{ color: 'var(--color-deep-text)' }}>
                    {lang === 'TH' ? project.royal_name : project.royal_name_eng}
                </h1>

                {/* Main Slider */}
                {gallery.length > 0 && (
                    <div className="relative mb-3 flex items-center justify-center gap-4">

                        <button onClick={prev}
                            className="print-hide flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                            style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-forest-green)' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-green-light)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-3)'}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="rounded-xl overflow-hidden flex-1 max-w-2xl"
                            style={{ boxShadow: '0 4px 20px var(--color-shadow-lg)' }}>
                            <img
                                src={gallery[currentImg]}
                                alt={lang === 'TH' ? project.royal_name : project.royal_name_eng}
                                className="w-full object-contain"
                                style={{ maxHeight: 480, backgroundColor: 'var(--color-surface)' }}
                            />
                        </div>

                        <button onClick={next}
                            className="print-hide flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                            style={{ backgroundColor: 'var(--color-surface-3)', color: 'var(--color-forest-green)' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-green-light)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-3)'}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Thumbnails — ซ่อนตอน print */}
                {gallery.length > 1 && (
                    <div className="print-hide flex gap-2 mb-8 overflow-x-auto pb-1 justify-center">
                        {gallery.map((src, i) => (
                            <button key={i} onClick={() => setCurrentImg(i)}
                                className="flex-shrink-0 rounded-lg overflow-hidden transition-all duration-200"
                                style={{
                                    border: `2px solid ${i === currentImg ? 'var(--color-green)' : 'var(--color-border)'}`,
                                    opacity: i === currentImg ? 1 : 0.55,
                                }}>
                                <img src={src} alt="" className="w-20 h-14 object-contain" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Sections */}
                <div className="mt-8 space-y-8 max-w-4xl mx-auto">
                    {sections.map((s, i) => (
                        <div key={i}>
                            {s.title && (
                                <h2 className="font-bold mb-3"
                                    style={{ color: 'var(--color-deep-text)', fontSize: 'var(--font-size-base)' }}>
                                    {lang === 'TH' ? s.title : s.title_eng}
                                </h2>
                            )}
                            {s.detail && (
                                <p className="text-sm leading-relaxed whitespace-pre-line"
                                    style={{ color: 'var(--color-deep-text)', lineHeight: '1.9', textIndent: '2em' }}>
                                    {lang === 'TH' ? s.detail : s.detail_eng}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Infographic */}
                {isValidImg(project.infographic) && (
                    <div className="mt-12 max-w-4xl mx-auto">
                        <div className="h-px w-full mb-6" style={{ backgroundColor: 'var(--color-border)' }} />
                        <p className="text-base font-semibold mb-4 text-center"
                            style={{ color: 'var(--color-deep-text)' }}>
                            {t('infographic')}
                        </p>
                        <div className="rounded-xl overflow-hidden mx-auto" style={{ maxWidth: '60%' }}>
                            <img
                                src={`${UPLOADS_URL}${project.infographic}`}
                                alt="infographic"
                                className="w-full"
                                onError={e => e.currentTarget.closest('div').parentElement.style.display = 'none'}
                            />
                        </div>
                    </div>
                )}

                {/* References */}
                {references.length > 0 && (
                    <div className="references-box mt-10 max-w-4xl mx-auto rounded-xl p-5"
                        style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                        <p className="text-sm font-semibold mb-3"
                            style={{ color: 'var(--color-deep-text)' }}>
                            {t('references')}
                        </p>
                        <div className="space-y-1">
                            {references.map((ref, i) => (
                                <p key={i} className="text-xs leading-relaxed"
                                    style={{ color: 'var(--color-muted-text)' }}>
                                    {ref}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

            </div>
            {/* ── End print-content ── */}

            {/* Bottom nav — ซ่อนตอน print */}
            <div className="print-hide mt-12 pt-6 max-w-4xl mx-auto"
                style={{ borderTop: '1px solid var(--color-border)' }}>
                <button onClick={() => navigate('/projects')}
                    className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl transition-all"
                    style={{ backgroundColor: 'var(--color-forest-green)', color: '#fff' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-green)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-forest-green)'}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('back_to_all_projects')}
                </button>
            </div>

        </div>
    )
}