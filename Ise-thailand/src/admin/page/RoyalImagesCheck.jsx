import { useState, useEffect } from 'react'
import api from '../../api/axios'

export default function RoyalImagesCheck() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all | missing | complete

    const fetchData = () => {
        setLoading(true)
        api.get('/royal/missing-images')
            .then(res => setData(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchData() }, [])

    const totalImages = data.reduce((s, p) => s + p.images.length, 0)
    const totalMissing = data.reduce((s, p) => s + p.missingCount, 0)
    const totalFound = totalImages - totalMissing
    const projectsMissing = data.filter(p => p.missingCount > 0).length

    const filtered = data.filter(p => {
        if (filter === 'missing') return p.missingCount > 0
        if (filter === 'complete') return p.missingCount === 0
        return true
    })

    return (
        <div className="p-6 max-w-4xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-[var(--color-deep-text)]">
                        ตรวจสอบรูปภาพ Royal Projects
                    </h1>
                    <p className="text-sm text-[var(--color-muted-text)] mt-1">
                        คลิกปุ่ม copy เพื่อคัดลอกชื่อไฟล์ไปใช้ตั้งชื่อรูป
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-deep-text)',
                    }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    รีเฟรช
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'โครงการทั้งหมด', value: data.length, color: 'var(--color-surface-2)', border: 'var(--color-border)', text: 'var(--color-deep-text)' },
                    { label: 'โครงการที่ขาดรูป', value: projectsMissing, color: '#fef2f2', border: '#fca5a5', text: '#dc2626' },
                    { label: 'รูปที่มีแล้ว', value: totalFound, color: '#f0fdf4', border: '#86efac', text: '#15803d' },
                    { label: 'รูปที่ขาด', value: totalMissing, color: '#fef2f2', border: '#fca5a5', text: '#dc2626' },
                ].map((s, i) => (
                    <div key={i} className="rounded-xl p-4 text-center"
                        style={{ background: s.color, border: `1px solid ${s.border}` }}>
                        <p className="text-2xl font-bold" style={{ color: s.text }}>{s.value}</p>
                        <p className="text-xs mt-1" style={{ color: s.text, opacity: 0.8 }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-4">
                {[
                    { key: 'all', label: 'ทั้งหมด' },
                    { key: 'missing', label: 'ขาดรูป' },
                    { key: 'complete', label: 'ครบแล้ว' },
                ].map(f => (
                    <button key={f.key} onClick={() => setFilter(f.key)}
                        className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                        style={{
                            background: filter === f.key ? 'var(--color-forest-green)' : 'var(--color-surface-2)',
                            color: filter === f.key ? '#fff' : 'var(--color-muted-text)',
                            border: '1px solid var(--color-border)',
                        }}>
                        {f.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-2 border-[var(--color-green)] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(project => (
                        <div key={project.id} className="rounded-xl overflow-hidden"
                            style={{ border: '1px solid var(--color-border)', background: 'var(--color-white)' }}>

                            {/* Project header */}
                            <div className="flex items-center justify-between px-5 py-3"
                                style={{ background: 'var(--color-surface-2)', borderBottom: '1px solid var(--color-border)' }}>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[var(--color-muted-text)]">
                                        #{project.id}
                                    </span>
                                    <p className="text-sm font-bold text-[var(--color-deep-text)] truncate max-w-xs">
                                        {project.name}
                                    </p>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                    project.missingCount === 0
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-600'
                                }`}>
                                    {project.missingCount === 0 ? '✓ ครบแล้ว' : `✗ ขาด ${project.missingCount} รูป`}
                                </span>
                            </div>

                            {/* Images list */}
                            <div className="divide-y divide-[var(--color-border)]">
                                {project.images.map(img => (
                                    <div key={img.field}
                                        className="flex items-center justify-between px-5 py-2.5"
                                        style={{ background: img.exists ? 'transparent' : '#fff8f8' }}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs font-semibold text-[var(--color-muted-text)] w-24 inline-block">
                                                {img.field}
                                            </span>
                                            <span className="text-xs font-mono text-[var(--color-deep-text)] select-all">
                                                {img.filename || <span className="text-gray-300 italic">ไม่มีใน DB</span>}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                                            {img.filename && !img.exists && (
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(img.filename)}
                                                    className="px-2 py-1 rounded-lg text-xs font-medium"
                                                    style={{
                                                        background: '#fef2f2',
                                                        border: '1px solid #fca5a5',
                                                        color: '#dc2626',
                                                    }}
                                                >
                                                    copy
                                                </button>
                                            )}
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                img.exists
                                                    ? 'bg-green-100 text-green-700'
                                                    : img.filename
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {img.exists ? '✓' : img.filename ? '✗' : '—'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}