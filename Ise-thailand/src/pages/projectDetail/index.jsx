import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const C = {
    forestGreen: 'var(--color-forest-green)',
    green: 'var(--color-green)',
    greenLight: 'var(--color-green-light)',
    white: 'var(--color-white)',
    deepText: 'var(--color-deep-text)',
    mutedText: 'var(--color-muted-text)',
}

const ALL_PROJECTS = [
]

export default function ProjectDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const project = ALL_PROJECTS.find(p => p.id === Number(id))
    const [currentImg, setCurrentImg] = useState(0)
    const [allprojects, setAllProjects] = useState(ALL_PROJECTS)


    useEffect(() => {
        const result = fetch('/api/royal/projects/')
        result.then(res => res.json()).then(data => {
            console.log('API response:', data)
            setAllProjects(data.data || [])
        }).catch(err => {
            console.error('API error:', err)
        })
    }, [])

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <svg className="w-16 h-16" style={{ color: C.greenLight }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg" style={{ color: C.mutedText }}>ไม่พบโครงการนี้</p>
                <button
                    onClick={() => navigate('/projects')}
                    className="text-sm px-4 py-2 rounded-xl transition-colors"
                    style={{ backgroundColor: C.forestGreen, color: '#ffffff' }}
                >
                    กลับไปหน้าโครงการ
                </button>
            </div>
        )
    }

    const images = project.headerImage?.length ? project.headerImage : [project.image]
    const prev = () => setCurrentImg(i => (i - 1 + images.length) % images.length)
    const next = () => setCurrentImg(i => (i + 1) % images.length)
    const footerData = project.footer?.[0]

    return (
        <div className="min-h-screen" style={{ backgroundColor: C.white }}>

            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm mb-6 transition-colors"
                style={{ color: C.mutedText }}
                onMouseEnter={e => e.currentTarget.style.color = C.green}
                onMouseLeave={e => e.currentTarget.style.color = C.mutedText}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                กลับ
            </button>

            {/* Hero Image Slider */}
            <div className="relative rounded-2xl overflow-hidden mb-3 shadow-lg group" style={{ height: '420px' }}>
                <img
                    src={images[currentImg]}
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-500"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(64,78,59,0.75) 0%, rgba(64,78,59,0.1) 50%, transparent 100%)' }} />

                {/* Title overlay on image */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span
                        className="inline-block text-xs px-3 py-1 rounded-full mb-3 backdrop-blur-sm"
                        style={{ color: '#ffffff', backgroundColor: 'rgba(123,150,105,0.5)', border: '1px solid rgba(186,200,177,0.5)' }}
                    >
                        {project.category}
                    </span>
                    <h1 className="text-2xl font-bold leading-relaxed text-white drop-shadow-md">
                        {project.title}
                    </h1>
                </div>

                {/* Prev / Next */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                            style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: C.forestGreen }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                            style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: C.forestGreen }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Counter */}
                        <div
                            className="absolute top-4 right-4 text-xs px-2.5 py-1 rounded-full backdrop-blur-sm"
                            style={{ backgroundColor: 'rgba(64,78,59,0.6)', color: '#ffffff' }}
                        >
                            {currentImg + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnail strip + dots */}
            {images.length > 1 && (
                <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentImg(i)}
                            className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200"
                            style={{
                                border: `2px solid ${i === currentImg ? C.green : 'transparent'}`,
                                opacity: i === currentImg ? 1 : 0.5,
                                transform: i === currentImg ? 'scale(1.05)' : 'scale(1)',
                            }}
                        >
                            <img src={img} alt="" className="w-20 h-14 object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {/* Content Blocks */}
            <div className="space-y-12 mt-8">
                {project.content?.map((block, i) => {
                    if (block.type === 'text-image') {
                        const isRight = block.imagePosition === 'right'
                        return (
                            <div key={i} className={`flex gap-8 items-start ${isRight ? 'flex-row' : 'flex-row-reverse'}`}>
                                {/* Text side */}
                                <div className="flex-1 min-w-0">
                                    {/* Section number */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                            style={{ backgroundColor: C.forestGreen }}
                                        >
                                            {i + 1}
                                        </div>
                                        <div className="h-px flex-1" style={{ backgroundColor: C.greenLight }} />
                                    </div>
                                    {block.heading && (
                                        <h2 className="font-bold mb-3 leading-relaxed" style={{ color: C.deepText, fontSize: 'var(--font-size-lg)' }}>
                                            {block.heading}
                                        </h2>
                                    )}
                                    <p className="text-sm leading-relaxed" style={{ color: C.mutedText, lineHeight: '1.9' }}>
                                        {block.text}
                                    </p>
                                </div>

                                {/* Image side */}
                                <div className="flex-shrink-0 rounded-2xl overflow-hidden shadow-md" style={{ width: '42%' }}>
                                    <img
                                        src={block.image}
                                        alt={block.heading}
                                        className="w-full object-cover"
                                        style={{ height: '240px' }}
                                    />
                                </div>
                            </div>
                        )
                    }

                    if (block.type === 'image-only') {
                        return (
                            <div key={i} className="rounded-2xl overflow-hidden shadow-md">
                                <img src={block.image} alt="" className="w-full object-cover" style={{ maxHeight: 400 }} />
                            </div>
                        )
                    }

                    if (block.type === 'text-only') {
                        return (
                            <div key={i} className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(186,200,177,0.1)', border: `1px solid ${C.greenLight}` }}>
                                {block.heading && (
                                    <h2 className="font-bold mb-3" style={{ color: C.deepText, fontSize: 'var(--font-size-lg)' }}>
                                        {block.heading}
                                    </h2>
                                )}
                                <p className="text-sm leading-relaxed" style={{ color: C.mutedText, lineHeight: '1.9' }}>
                                    {block.text}
                                </p>
                            </div>
                        )
                    }
                    return null
                })}
            </div>

            {/* Footer Section */}
            {footerData && (
                <div className="mt-16 space-y-8">

                    {/* Divider */}
                    <div className="h-px w-full" style={{ backgroundColor: C.greenLight }} />

                    {/* Infographic image */}
                    {footerData.footerImage && (
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-sm font-semibold mb-3" style={{ color: C.deepText }}>
                                {footerData.text}
                            </p>
                            <p className="text-sm font-semibold mb-3" style={{ color: C.deepText }}>
                                {footerData.footerHeaderText}
                            </p>
                            <div className="rounded-2xl overflow-hidden shadow-md">
                                <img src={footerData.footerImage} alt="infographic" className="w-full object-cover" />
                            </div>
                        </div>
                    )}

                    {/* References */}
                    {footerData.Referencesource?.filter(r => r).length > 0 && (
                        <div
                            className="rounded-2xl p-6"
                            style={{ backgroundColor: 'rgba(186,200,177,0.08)', border: `1px solid ${C.greenLight}` }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <svg className="w-4 h-4" style={{ color: C.green }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <p className="text-sm font-semibold" style={{ color: C.deepText }}>แหล่งอ้างอิง</p>
                            </div>
                            <ol className="space-y-2">
                                {footerData.Referencesource.filter(r => r).map((ref, i) => (
                                    <li key={i} className="flex gap-3">
                                        <span className="text-xs font-medium flex-shrink-0 mt-0.5" style={{ color: C.green }}>
                                            {i + 1}.
                                        </span>
                                        <p className="text-xs leading-relaxed" style={{ color: C.mutedText }}>{ref}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            )}

            {/* Bottom nav */}
            <div className="mt-12 pt-6" style={{ borderTop: `1px solid ${C.greenLight}` }}>
                <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl transition-all duration-200"
                    style={{ backgroundColor: C.forestGreen, color: '#ffffff' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = C.green}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = C.forestGreen}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    กลับไปยังโครงการทั้งหมด
                </button>
            </div>
        </div>
    )
}