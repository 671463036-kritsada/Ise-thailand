import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { UPLOADS_URL } from '../../constants/uploads_url'
import { useLang } from '../../context/LanguageContext'

export default function ActivityModal({ title, data, loading, error, onClose, onSelectActivity }) {

    const { lang } = useLang()

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
        >
            <div className="absolute inset-0 backdrop-blur-sm bg-forest-green/55" />

            <motion.div
                className="relative w-full max-w-7xl z-10 rounded-3xl overflow-hidden flex flex-col bg-white shadow-[0_40px_80px_rgba(0,0,0,0.25)]"
                style={{ maxHeight: '90vh' }}
                initial={{ opacity: 0, y: 32, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 32, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative px-8 pt-7 pb-6 flex-shrink-0 overflow-hidden bg-gradient-to-br from-forest-green to-green">
                    <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium mb-1 text-white/60">
                                ทั้งหมด {data?.length ?? '—'} รายการ
                            </p>
                            <h2 className="text-xl font-bold text-white">{title}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 z-10 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 bg-white/20 text-white"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
                    {loading && [...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 rounded-2xl animate-pulse bg-green-light/20" />
                    ))}

                    {error && (
                        <p className="text-sm text-error text-center py-8">โหลดข้อมูลไม่สำเร็จ</p>
                    )}

                    {data?.map((item, i) => (
                        <motion.button
                            key={item.docno}
                            onClick={() => onSelectActivity(item)}
                            className="w-full text-left rounded-3xl overflow-hidden border border-green-light bg-white shadow-[0_4px_12px_var(--color-shadow)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_var(--color-shadow-lg)]"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-[260px] h-[220px] md:h-auto flex-shrink-0 overflow-hidden">
                                    <img
                                        src={`${UPLOADS_URL}${item.img_file}`}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                                <div className="flex-1 p-6 flex flex-col">
                                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                                        <span className={`text-xs px-3 py-1 rounded-full font-semibold
                                            ${item.typeact_id === '01'
                                                ? 'bg-green/10 text-green'
                                                : 'bg-forest-green/10 text-forest-green'
                                            }`}
                                        >
                                            {lang === 'TH' ? item.typeact_name : item.typeact_name_eng}
                                        </span>
                                        {item.activity_date && (
                                            <span className="text-xs text-muted-text">
                                                {new Date(item.activity_date).toLocaleDateString(
                                                    lang === 'TH' ? 'th-TH' : 'en-EN', {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold leading-relaxed line-clamp-2 mb-3 text-deep-text">
                                        {lang === 'TH' ? item.title : item.title_eng}
                                    </h3>
                                    <p className="text-sm leading-7 line-clamp-3 flex-1 text-muted-text">
                                        {lang === 'TH' ? item.detail : item.detail_eng}
                                    </p>
                                    <div className="flex items-center justify-between mt-6">
                                        <span className="text-sm font-medium text-green">
                                            อ่านรายละเอียดเพิ่มเติม →
                                        </span>
                                        {item.pdf_file && (
                                            <span className="text-xs px-3 py-1 rounded-full bg-green/10 text-green">
                                                PDF
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}