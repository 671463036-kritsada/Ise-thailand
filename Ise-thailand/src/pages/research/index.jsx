import { useState, useMemo } from 'react'

const MOCK_DATA = [
    { id: 1, title: 'การบริหารจัดการเครือข่ายเศรษฐกิจพอเพียงแบบบูรณาการ', category: 'โครงการพัฒนาแบบ บูรณาการ และ อื่นๆ', researcher: 'อัจฉรา โยมสินธุ์' },
    { id: 2, title: 'การบริหารราชการแผ่นดินบนพื้นฐานหลักปรัชญาของเศรษฐกิจพอเพียง ระยะที่ 1', category: 'โครงการภายใต้สถาบันเศรษฐกิจพอเพียง', researcher: 'กัลยาณี เสนาสุ' },
    { id: 3, title: 'การสำรวจการรับรู้และความเข้าใจของประชาชนเกี่ยวกับปรัชญาของเศรษฐกิจพอเพียง', category: 'โครงการภายใต้สถาบันเศรษฐกิจพอเพียง', researcher: 'นิดาโพลล์ -' },
    { id: 4, title: 'บทเรียนเชิงปฏิบัติเพื่อการบรรลุเป้าหมายการพัฒนาที่ยั่งยืน', category: 'โครงการภายใต้สถาบันเศรษฐกิจพอเพียง', researcher: 'ณดา จันทร์สม' },
    { id: 5, title: 'รายงานผลการทำกิจกรรมส่งเสริมและสนับสนุนการวิจัย การสำรวจการรับรู้และความเข้าใจของประชาชน', category: 'ไม่ระบุ', researcher: 'นิดาโพลล์ -' },
    { id: 6, title: 'โครงการ กลไกการขับเคลื่อนเพื่อการเติบโตทางเศรษฐกิจอย่างยั่งยืนด้วยหลักปรัชญาของเศรษฐกิจพอเพียง : กรณีศึกษาจังหวัดลำปาง', category: 'โครงการภายใต้สถาบันเศรษฐกิจพอเพียง', researcher: 'ปริเยศ สิทธิสรวง' },
    { id: 7, title: 'โครงการกลยุทธ์การน้อมนำหลักปรัชญาของเศรษฐกิจพอเพียงสู่การประยุกต์ใช้ในการดำเนินชีวิตอย่างยั่งยืนสำหรับเยาวชนในอนุภาคลุ่มน้ำโขง', category: 'โครงการภายใต้สถาบันเศรษฐกิจพอเพียง', researcher: 'นาวิน พรมใจสา' },
    { id: 8, title: 'โครงการการจัดการความรู้สู่การพัฒนาที่ยั่งยืนตามปรัชญาของเศรษฐกิจพอเพียง กรณีศึกษากลุ่มมหาวิทยาลัยราชภัฏกลุ่มศรีอยุธยา', category: 'โครงการภายใต้สถาบันเศรษฐกิจพอเพียง', researcher: 'กมลวรรณ วรรณรนัง' },
    { id: 9, title: 'โครงการการพัฒนาชุมชนต้นแบบเพื่อการยกระดับคุณภาพชีวิตภายใต้ปรัชญาของเศรษฐกิจพอเพียงสู่ความยั่งยืนของประเทศระยะที่ 1', category: 'โครงการภายใต้สถาบันเศรษฐกิจพอเพียง', researcher: 'วารุณี ศรีสงคราม' },
    { id: 10, title: 'โครงการการพัฒนารูปแบบเครือข่ายความร่วมมือจากวิธีปฏิบัติของชุมชนต้นแบบเพื่อการเรียนรู้เพื่อการพัฒนาที่ยั่งยืน', category: 'โครงการภายใต้สถาบันเศรษฐกิจพอเพียง', researcher: 'หนึ่งฤทัย เอกธรรมทัศน์' },
]

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50]

function CategoryBadge({ category }) {
    const isUnspecified = category === 'ไม่ระบุ'
    return (
        <span
            className="inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
            style={{
                backgroundColor: isUnspecified ? 'var(--color-surface-3)' : 'var(--color-gold-subtle)',
                color: isUnspecified ? 'var(--color-muted-text)' : 'var(--color-forest-green)',
                border: `1px solid ${isUnspecified ? 'var(--color-border)' : 'var(--color-gold-border)'}`,
                fontSize: 'var(--font-size-xs)',
            }}
        >
            {category}
        </span>
    )
}

export default function ResearchPage() {
    const [search, setSearch] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return MOCK_DATA.filter((item) =>
            item.title.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.researcher.toLowerCase().includes(q)
        )
    }, [search])

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const handleSearch = (e) => { setSearch(e.target.value); setCurrentPage(1) }
    const handlePageSize = (e) => { setPageSize(Number(e.target.value)); setCurrentPage(1) }
    const goPage = (p) => setCurrentPage(Math.max(1, Math.min(totalPages, p)))

    const from = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
    const to = Math.min(currentPage * pageSize, filtered.length)

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>

            {/* Page header */}
            <div className="mb-6">
                <h1
                    className="font-semibold leading-tight"
                    style={{ color: 'var(--color-deep-text)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)' }}
                >
                    โครงการ / งานวิจัย
                </h1>
                <p style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-sm)', marginTop: 2 }}>
                    ภายใต้สถาบันเศรษฐกิจพอเพียง
                </p>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <span style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-sm)' }}>แสดง</span>
                    <select
                        value={pageSize}
                        onChange={handlePageSize}
                        className="rounded-lg px-2 py-1.5 focus:outline-none"
                        style={{
                            border: '1px solid var(--color-border)',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-deep-text)',
                            backgroundColor: 'var(--color-surface-2)',
                        }}
                    >
                        {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <span style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-sm)' }}>รายการ</span>
                </div>

                <div className="relative flex items-center">
                    <svg className="absolute left-2.5 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        style={{ color: 'var(--color-placeholder)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="ค้นหา..."
                        className="rounded-lg pl-8 pr-3 py-1.5 focus:outline-none transition-colors"
                        style={{
                            border: '1px solid var(--color-border)',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-deep-text)',
                            backgroundColor: 'var(--color-surface-2)',
                            width: 200,
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--color-border-focus)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                    />
                </div>
            </div>

            {/* Table */}
            <div
                className="rounded-xl overflow-hidden"
                style={{
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-white)',
                    boxShadow: '0 1px 4px var(--color-shadow)',
                }}
            >
                <table className="w-full" style={{ fontSize: 'var(--font-size-sm)', tableLayout: 'fixed' }}>
                    <colgroup>
                        <col style={{ width: '48%' }} />
                        <col style={{ width: '32%' }} />
                        <col style={{ width: '20%' }} />
                    </colgroup>
                    <thead>
                        <tr style={{ backgroundColor: 'var(--color-forest-green)' }}>
                            {['ชื่อโครงการ', 'ประเภทโครงการ', 'ชื่อนักวิจัย'].map((col) => (
                                <th
                                    key={col}
                                    className="px-5 py-3 text-left"
                                    style={{
                                        color: '#fff',
                                        fontWeight: 'var(--font-weight-medium)',
                                        fontSize: 'var(--font-size-xs)',
                                        borderBottom: '2px solid var(--color-gold)',
                                    }}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-12 text-center"
                                    style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-sm)' }}>
                                    ไม่พบข้อมูล
                                </td>
                            </tr>
                        ) : (
                            paginated.map((item, index) => (
                                <tr
                                    key={item.id}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? 'var(--color-white)' : 'var(--color-surface-2)',
                                        borderBottom: '1px solid var(--color-border)',
                                        transition: 'background-color 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-3)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'var(--color-white)' : 'var(--color-surface-2)'}
                                >
                                    <td className="px-5 py-3"
                                        style={{ color: 'var(--color-deep-text)', lineHeight: 'var(--line-height-relaxed)' }}>
                                        {item.title}
                                    </td>
                                    <td className="px-5 py-3">
                                        <CategoryBadge category={item.category} />
                                    </td>
                                    <td className="px-5 py-3" style={{ color: 'var(--color-muted-text)' }}>
                                        {item.researcher}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
                <span style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-xs)' }}>
                    แสดง {from}–{to} จาก {filtered.length} รายการ
                </span>
                <div className="flex gap-1">
                    <PageBtn onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}>←</PageBtn>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <PageBtn key={p} onClick={() => goPage(p)} active={p === currentPage}>{p}</PageBtn>
                    ))}
                    <PageBtn onClick={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}>→</PageBtn>
                </div>
            </div>
        </div>
    )
}

function PageBtn({ onClick, disabled, active, children }) {
    const [hovered, setHovered] = useState(false)
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
                border: `1px solid ${active ? 'var(--color-forest-green)' : 'var(--color-border)'}`,
                backgroundColor: active
                    ? 'var(--color-forest-green)'
                    : hovered ? 'var(--color-surface-3)' : 'var(--color-white)',
                color: active ? '#fff' : 'var(--color-muted-text)',
                fontSize: 'var(--font-size-xs)',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </button>
    )
}