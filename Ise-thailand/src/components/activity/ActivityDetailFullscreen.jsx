import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { UPLOADS_URL } from '../../constants/uploads_url'

import { useLang } from '../../context/LanguageContext'

export default function ActivityDetailFullscreen({ item, onClose }) {
    const { lang } = useLang()

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    return (
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
                    กลับ
                </button>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0
                        ${item.typeact_id === '01'
                            ? 'bg-green/10 text-green'
                            : 'bg-forest-green/10 text-forest-green'
                        }`}
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
                                    <h3 className="text-lg font-bold text-deep-text">อัลบั้มรูปภาพ</h3>
                                    <p className="text-sm text-muted-text">ทั้งหมด {item.gallery.length} รูป</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {item.gallery.map((img, index) => (
                                    <div
                                        key={index}
                                        className="group relative overflow-hidden rounded-2xl aspect-[4/3] border border-green-light"
                                    >
                                        <img
                                            src={`${UPLOADS_URL}${img}`}
                                            alt={`gallery-${index}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 bg-gradient-to-t from-black/55 to-transparent">
                                            <p className="text-white text-xs font-medium">รูปที่ {index + 1}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {item.pdf_file && (

                        <a href={`${UPLOADS_URL}${item.pdf_file}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex mt-10 items-center gap-2 text-sm font-medium px-5 py-3 rounded-xl bg-green/10 text-green hover:opacity-80 transition-opacity"
                        >
                            ดาวน์โหลด PDF →
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    )
}