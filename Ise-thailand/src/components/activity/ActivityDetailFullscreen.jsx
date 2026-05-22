import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UPLOADS_URL } from '../../constants/uploads_url'
import { useLang } from '../../context/LanguageContext'
import { useTranslation  } from 'react-i18next'

export default function ActivityDetailFullscreen({ item, onClose }) {
    const { lang } = useLang()
    const { t }  = useTranslation()
    const [lightboxIndex, setLightboxIndex] = useState(null)

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') {
                if (lightboxIndex !== null) setLightboxIndex(null)
                else onClose()
            }
            if (lightboxIndex !== null) {
                if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % item.gallery.length)
                if (e.key === 'ArrowLeft') setLightboxIndex(i => (i - 1 + item.gallery.length) % item.gallery.length)
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose, lightboxIndex, item.gallery?.length])

    const goNext = useCallback(() => setLightboxIndex(i => (i + 1) % item.gallery.length), [item.gallery?.length])
    const goPrev = useCallback(() => setLightboxIndex(i => (i - 1 + item.gallery.length) % item.gallery.length), [item.gallery?.length])

    return (
        <>
            <motion.div
                className="fixed inset-0 z-[60] flex flex-col bg-white"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Top Bar */}
                <div className="flex-shrink-0 flex items-center gap-4 px-6 py-4 border-b border-green-light/30">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-green/10 text-green hover:opacity-80 transition-opacity"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M15 19l-7-7 7-7" />
                        </svg>
                        {t('back')}
                    </button>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0
                            ${item.typeact_id === '01' ? 'bg-green/10 text-green' : 'bg-forest-green/10 text-forest-green'}`}
                        >
                            {lang === 'TH' ? item.typeact_name : item.typeact_name_eng}
                        </span>
                        {item.activity_date && (
                            <span className="text-xs text-muted-text truncate">
                                {new Date(item.activity_date).toLocaleDateString(
                                    lang === 'EN' ? 'en-EN' : 'th-TH',
                                    { year: 'numeric', month: 'long', day: 'numeric' }
                                )}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-light/30 text-deep-text hover:opacity-70"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-6 py-10">

                        {item.img_file && (
                            <div className="w-full rounded-2xl overflow-hidden mb-8 h-full">
                                <img
                                    src={`${UPLOADS_URL}${item.img_file}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <h1 className="text-3xl font-bold leading-relaxed mb-6 text-deep-text">
                            {lang === 'TH' ? item.title : item.title_eng}
                        </h1>

                        <div className="text-base leading-9 whitespace-pre-line text-deep-text">
                            {lang === 'TH' ? item.detail : item.detail_eng}
                        </div>

                        {item.gallery?.length > 0 && (
                            <div className="mt-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green/10">
                                        <svg className="w-5 h-5 text-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                            <path d="M14 6h.01" />
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-deep-text">{t('Image_Gallery')}</h3>
                                        <p className="text-sm text-muted-text">{t('all')} {item.gallery.length} {t('unit_image')}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {item.gallery.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setLightboxIndex(index)}
                                            className="group relative overflow-hidden rounded-2xl aspect-[4/3] border border-green-light focus:outline-none focus:ring-2 focus:ring-green"
                                        >
                                            <img
                                                src={`${UPLOADS_URL}${img}`}
                                                alt={`gallery-${index}`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 bg-gradient-to-t from-black/55 to-transparent">
                                                <p className="text-white text-xs font-medium">{t('image_at')} {index + 1}</p>
                                            </div>
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow">
                                                    <svg className="w-4 h-4 text-deep-text" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* {item.pdf_file && (
                            <a href={`${UPLOADS_URL}${item.pdf_file}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex mt-10 items-center gap-2 text-sm font-medium px-5 py-3 rounded-xl bg-green/10 text-green hover:opacity-80 transition-opacity"
                            >
                                {t('download')} PDF →
                            </a>
                        )} */}
                    </div>
                </div>
            </motion.div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setLightboxIndex(null)}
                    >
                        {/* Counter */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
                            {lightboxIndex + 1} / {item.gallery.length}
                        </div>

                        {/* Close */}
                        <button
                            onClick={() => setLightboxIndex(null)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Prev */}
                        {item.gallery.length > 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); goPrev() }}
                                className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}

                        {/* Image */}
                        <motion.img
                            key={lightboxIndex}
                            src={`${UPLOADS_URL}${item.gallery[lightboxIndex]}`}
                            alt={`gallery-${lightboxIndex}`}
                            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Next */}
                        {item.gallery.length > 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); goNext() }}
                                className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}