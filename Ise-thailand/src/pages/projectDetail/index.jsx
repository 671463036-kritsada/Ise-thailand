import { useState, useEffect } from 'react'
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
    const [loading, setLoading] = useState(true)
    const [currentImg, setCurrentImg] = useState(0)
    const [validImages, setValidImages] = useState([])

    const { lang } = useLang()
    const { t } = useTranslation()

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

    useEffect(() => {
        if (!project) return
        const imgs = [project.img_banner, project.img_1, project.img_2, project.img_3, project.img_4, project.img_5]
            .filter(isValidImg)
            .map(f => `${UPLOADS_URL}${f}`)

        Promise.all(
            imgs.map(src => new Promise(resolve => {
                const img = new Image()
                img.onload = () => resolve(src)
                img.onerror = () => resolve(null)
                img.src = src
            }))
        ).then(results => {
            setValidImages(results.filter(Boolean))
        })
    }, [project])

    const prev = () => setCurrentImg(i => (i - 1 + validImages.length) % validImages.length)
    const next = () => setCurrentImg(i => (i + 1) % validImages.length)

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <p style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-sm)' }}>{t('loading')}</p>
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
            image: isValidImg(project[`img_${n}`]) ? `${UPLOADS_URL}${project[`img_${n}`]}` : null,
        }))
        .filter(s => s.title || s.detail)

    const references =
        lang === 'TH'
            ? (project.reference ? project.reference.split('\n').filter(Boolean) : [])
            : (project.reference_eng ? project.reference_eng.split('\n').filter(Boolean) : [])

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
                {t('back')}
            </button>

            {/* Hero Slider */}
            {validImages.length > 0 && (
                <div className="relative rounded-3xl overflow-hidden mb-6 group"
                    style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.18)' }}>

                    {/* Main Image */}
                    <img src={validImages[currentImg]}
                        alt={lang === 'TH' ? project.royal_name : project.royal_name_eng}
                        className="w-full transition-all duration-700"
                        style={{
                            display: 'block',
                            maxHeight: '80vh',
                            width: '100%',
                            objectFit: 'contain',
                            backgroundColor: 'rgba(28,40,24,0.04)',
                        }} />

                    {/* Gradient overlay — บางลง ไม่บดบังรูป */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(to top, rgba(20,32,18,0.85) 0%, rgba(20,32,18,0.1) 40%, transparent 70%)' }} />

                    {/* Gold top bar */}
                    <div className="absolute top-0 left-0 right-0 h-[3px]"
                        style={{ background: 'linear-gradient(to right, var(--color-gold), rgba(186,160,80,0.4), var(--color-gold))' }} />

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 px-8 py-7">
                        {project.type_name && (
                            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full mb-3 backdrop-blur-md"
                                style={{
                                    color: 'var(--color-gold)',
                                    backgroundColor: 'rgba(186,160,80,0.12)',
                                    border: '1px solid rgba(186,160,80,0.35)',
                                    letterSpacing: '0.06em',
                                    fontWeight: 600,
                                }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--color-gold)', display: 'inline-block' }} />
                                {lang === 'TH' ? project.type_name : project.type_name_eng}
                            </span>
                        )}
                        <h1 className="font-bold leading-snug text-white"
                            style={{
                                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                                maxWidth: '70%',
                                textShadow: '0 2px 16px rgba(0,0,0,0.5)',
                                letterSpacing: '-0.01em',
                            }}>
                            {lang === 'TH' ? project.royal_name : project.royal_name_eng}
                        </h1>
                    </div>

                    {/* Prev/Next */}
                    {validImages.length > 1 && <>
                        <button onClick={prev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.92)',
                                color: 'var(--color-forest-green)',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                                backdropFilter: 'blur(4px)',
                            }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button onClick={next}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.92)',
                                color: 'var(--color-forest-green)',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                                backdropFilter: 'blur(4px)',
                            }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Counter + dot indicators */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                {validImages.map((_, idx) => (
                                    <button key={idx} onClick={() => setCurrentImg(idx)}
                                        className="transition-all duration-300"
                                        style={{
                                            width: idx === currentImg ? 20 : 6,
                                            height: 6,
                                            borderRadius: 99,
                                            backgroundColor: idx === currentImg ? 'var(--color-gold)' : 'rgba(255,255,255,0.45)',
                                        }} />
                                ))}
                            </div>
                            <span className="text-xs px-2.5 py-1 rounded-full font-medium ml-1"
                                style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                                {currentImg + 1} / {validImages.length}
                            </span>
                        </div>
                    </>}
                </div>
            )}

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div className="flex gap-3 mb-8 overflow-x-auto pb-1">
                    {validImages.map((src, i) => (
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
                                    {lang === 'TH' ? s.title : s.title_eng}
                                </h2>
                            )}
                            {s.detail && (
                                <p className="text-sm leading-relaxed"
                                    style={{ color: 'var(--color-muted-text)', lineHeight: '1.9' }}>
                                    {lang === 'TH' ? s.detail : s.detail_eng}
                                </p>
                            )}
                        </div>


                        {/* Image */}
                        {s.image && (
                            <div className="flex-shrink-0 rounded-2xl overflow-hidden"
                                style={{ width: '42%', boxShadow: '0 2px 12px var(--color-shadow-md)' }}>
                                <img
                                    src={s.image}
                                    alt={s.title}
                                    className="w-full h-auto rounded-2xl"
                                    onError={e => e.currentTarget.closest('div').style.display = 'none'}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Infographic */}
            {isValidImg(project.infographic) && (
                <div className="mt-12">
                    <div className="h-px w-full mb-6" style={{ backgroundColor: 'var(--color-border)' }} />
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-lg font-semibold" style={{ color: 'var(--color-deep-text)' }}>{t('infographic')}</p>
                        <div className="rounded-xl overflow-hidden w-2/4"
                            style={{ boxShadow: '0 2px 8px var(--color-shadow-md)' }}>
                            <img
                                src={`${UPLOADS_URL}${project.infographic}`}
                                alt="infographic"
                                className="w-full h-full object-cover"
                                onError={e => e.currentTarget.closest('div').parentElement.style.display = 'none'}
                            />
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
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-deep-text)' }}>{t('references')}</p>
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
                    {t('back_to_all_projects')}
                </button>
            </div>
        </div>
    )
}