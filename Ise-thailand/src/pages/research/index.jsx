import { useState, useEffect, useMemo } from 'react'
import { useLang } from '../../context/LanguageContext'
import { useTranslation } from 'react-i18next'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]
import api from '../../api/axios'

export default function ResearchPage() {
    const [data, setData] = useState([])
    const [search, setSearch] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    const {lang} = useLang()
    const { t } = useTranslation()

    useEffect(() => {
        api.get('/project/')
            .then(res => {
                setData(res.data.data || [])
            })
            .catch(err => console.error(err))
    }, [])

    const filtered = useMemo(() => {
        const q = search.toLowerCase()

        return data.filter(item =>
            (item.name_thai ?? '').toLowerCase().includes(q) ||
            (item.type_name ?? '').toLowerCase().includes(q) ||
            (item.researcher_fullname ?? '').toLowerCase().includes(q)
        )
    }, [search, data])

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))

    const paginated = filtered.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setCurrentPage(1)
    }

    const handlePageSize = (e) => {
        setPageSize(Number(e.target.value))
        setCurrentPage(1)
    }

    const goPage = (p) =>
        setCurrentPage(Math.max(1, Math.min(totalPages, p)))

    const from =
        filtered.length === 0
            ? 0
            : (currentPage - 1) * pageSize + 1

    const to = Math.min(currentPage * pageSize, filtered.length)

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: 'var(--color-surface)' }}
        >
            {/* Page header */}
            <div className="mb-6">
                <h1
                    className="font-semibold leading-tight"
                    style={{
                        color: 'var(--color-deep-text)',
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 'var(--font-weight-semibold)',
                    }}
                >
                    {t('project_research')}
                </h1>

                <p
                    style={{
                        color: 'var(--color-muted-text)',
                        fontSize: 'var(--font-size-sm)',
                        marginTop: 2,
                    }}
                >
                    {t('project_research_subtitle')}
                </p>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <span
                        style={{
                            color: 'var(--color-muted-text)',
                            fontSize: 'var(--font-size-sm)',
                        }}
                    >
                        {t('show')}
                    </span>

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
                        {PAGE_SIZE_OPTIONS.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>

                    <span
                        style={{
                            color: 'var(--color-muted-text)',
                            fontSize: 'var(--font-size-sm)',
                        }}
                    >
                        {t('items_per_page')}
                    </span>
                </div>

                <div className="relative flex items-center">
                    <svg
                        className="absolute left-2.5 w-4 h-4 pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ color: 'var(--color-placeholder)' }}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"
                        />
                    </svg>

                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder={t('search_placeholder')}
                        className="rounded-lg pl-8 pr-3 py-1.5 focus:outline-none transition-colors"
                        style={{
                            border: '1px solid var(--color-border)',
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-deep-text)',
                            backgroundColor: 'var(--color-surface-2)',
                            width: 200,
                        }}
                        onFocus={(e) =>
                        (e.currentTarget.style.borderColor =
                            'var(--color-border-focus)')
                        }
                        onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                            'var(--color-border)')
                        }
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
                <table
                    className="w-full"
                    style={{
                        fontSize: 'var(--font-size-sm)',
                        tableLayout: 'fixed',
                    }}
                >
                    <colgroup>
                        <col style={{ width: '48%' }} />
                        <col style={{ width: '32%' }} />
                        <col style={{ width: '20%' }} />
                    </colgroup>

                    <thead>
                        <tr
                            style={{
                                backgroundColor:
                                    'var(--color-forest-green)',
                            }}
                        >
                            {[
                                t('project_name'),
                                t('project_type'),
                                t('researcher_name'),
                            ].map((col) => (
                                <th
                                    key={col}
                                    className="px-5 py-3 text-left"
                                    style={{
                                        color: '#fff',
                                        fontWeight:
                                            'var(--font-weight-medium)',
                                        fontSize: 'var(--font-size-xs)',
                                        borderBottom:
                                            '2px solid var(--color-gold)',
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
                                <td
                                    colSpan={3}
                                    className="py-12 text-center"
                                    style={{
                                        color:
                                            'var(--color-muted-text)',
                                        fontSize:
                                            'var(--font-size-sm)',
                                    }}
                                >
                                    {t('no_data')}
                                </td>
                            </tr>
                        ) : (
                            paginated.map((item, index) => (
                                <tr
                                    key={item.id}
                                    style={{
                                        backgroundColor:
                                            index % 2 === 0
                                                ? 'var(--color-white)'
                                                : 'var(--color-surface-2)',
                                        borderBottom:
                                            '1px solid var(--color-border)',
                                        transition:
                                            'background-color 0.15s',
                                    }}
                                    onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                        'var(--color-surface-3)')
                                    }
                                    onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                        index % 2 === 0
                                            ? 'var(--color-white)'
                                            : 'var(--color-surface-2)')
                                    }
                                >
                                    <td
                                        className="px-5 py-3"
                                        style={{
                                            color:
                                                'var(--color-deep-text)',
                                            lineHeight:
                                                'var(--line-height-relaxed)',
                                        }}
                                    >
                                        {item.name_thai}
                                    </td>

                                    <td className="px-5 py-3">
                                        <CategoryBadge
                                            category={item.type_name}
                                        />
                                    </td>

                                    <td
                                        className="px-5 py-3"
                                        style={{
                                            color:
                                                'var(--color-muted-text)',
                                        }}
                                    >
                                        {item.researcher_fullname}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
                <span
                    style={{
                        color: 'var(--color-muted-text)',
                        fontSize: 'var(--font-size-xs)',
                    }}
                >
                    {t('showing_from_to')} {from}–{to} {t('from_total')} {filtered.length} {t('total_items')}
                </span>

                <div className="flex gap-1">
                    <PageBtn
                        onClick={() => goPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        ←
                    </PageBtn>

                    {Array.from(
                        { length: totalPages },
                        (_, i) => i + 1
                    ).map((p) => (
                        <PageBtn
                            key={p}
                            onClick={() => goPage(p)}
                            active={p === currentPage}
                        >
                            {p}
                        </PageBtn>
                    ))}

                    <PageBtn
                        onClick={() => goPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        →
                    </PageBtn>
                </div>
            </div>
        </div>
    )
}

function CategoryBadge({ category }) {
    return (
        <span
            className="px-2 py-1 rounded-lg"
            style={{
                backgroundColor: 'var(--color-surface-3)',
                color: 'var(--color-deep-text)',
                fontSize: 'var(--font-size-xs)',
            }}
        >
            {category || '-'}
        </span>
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
                border: `1px solid ${active
                        ? 'var(--color-forest-green)'
                        : 'var(--color-border)'
                    }`,
                backgroundColor: active
                    ? 'var(--color-forest-green)'
                    : hovered
                        ? 'var(--color-surface-3)'
                        : 'var(--color-white)',
                color: active
                    ? '#fff'
                    : 'var(--color-muted-text)',
                fontSize: 'var(--font-size-xs)',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </button>
    )
}