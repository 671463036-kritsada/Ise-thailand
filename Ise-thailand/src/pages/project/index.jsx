import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'
import { useTranslation } from 'react-i18next'
import api from '../../api/axios'
import { UPLOADS_URL } from '../../constants/uploads_url'

const PAGE_SIZE = 12

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [selectedTypeId, setSelectedTypeId] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState(0)
  const [sortBy, setSortBy] = useState('default')
  const [currentPage, setCurrentPage] = useState(1)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [projects, setProjects] = useState([])
  const [typeProject, setTypeProject] = useState([])
  const [geographies, setGeographies] = useState([])
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const { lang } = useLang()
  const { t } = useTranslation()

  useEffect(() => {
    const typeId = searchParams.get('typeId') || ''
    setSelectedTypeId(typeId || 'all')
  }, [searchParams])

  useEffect(() => {
    api.get('/royal/').then(res => setProjects(res.data.data || [])).catch(console.error)
    api.get('/royal/types').then(res => setTypeProject(res.data.data || [])).catch(console.error)
    api.get('/geographies/').then(res => setGeographies(res.data.data || [])).catch(console.error)
  }, [])

  const typeMap = useMemo(() => {
    const map = {}
    typeProject.forEach(t => { map[t.type_id] = t })
    return map
  }, [typeProject])

  const featuredList = useMemo(() =>
    projects.filter(p => p.img_banner || p.img_1).slice(0, 6)
    , [projects])

  const currentFeatured = featuredList[featuredIndex]

  useEffect(() => {
    if (featuredList.length <= 1) return
    const timer = setInterval(() => {
      setFeaturedIndex(i => (i + 1) % featuredList.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [featuredList])

  const suggestions = useMemo(() => {
    if (!search || search.length < 2) return []
    return projects
      .filter(p => {
        const name = lang === 'TH' ? p.royal_name : p.royal_name_eng
        return (name ?? '').toLowerCase().includes(search.toLowerCase())
      })
      .slice(0, 6)
  }, [search, projects, lang])

  const filtered = useMemo(() => {
    let result = projects.filter((p) => {
      const name = lang === 'TH' ? p.royal_name : p.royal_name_eng
      const matchType = selectedTypeId === 'all' || p.type_id === selectedTypeId
      const matchSearch = (name ?? '').toLowerCase().includes(search.toLowerCase())
      const matchRegion = selectedRegion === 0 || p.geography_id === selectedRegion
      return matchType && matchSearch && matchRegion
    })

    if (sortBy === 'az') {
      result = [...result].sort((a, b) => {
        const nameA = lang === 'TH' ? a.royal_name : a.royal_name_eng
        const nameB = lang === 'TH' ? b.royal_name : b.royal_name_eng
        return (nameA ?? '').localeCompare(nameB ?? '', lang === 'TH' ? 'th' : 'en')
      })
    } else if (sortBy === 'za') {
      result = [...result].sort((a, b) => {
        const nameA = lang === 'TH' ? a.royal_name : a.royal_name_eng
        const nameB = lang === 'TH' ? b.royal_name : b.royal_name_eng
        return (nameB ?? '').localeCompare(nameA ?? '', lang === 'TH' ? 'th' : 'en')
      })
    }

    return result
  }, [selectedTypeId, search, projects, sortBy, lang, selectedRegion])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const selectedType = typeProject.find(t => t.type_id === selectedTypeId)
  const selectedLabel = selectedTypeId === 'all'
    ? t('all')
    : (lang === 'TH' ? selectedType?.type_name : selectedType?.type_name_eng) ?? t('all')

  const handleSelectType = (typeId) => {
    setSelectedTypeId(typeId)
    setSearchParams(typeId !== 'all' ? { typeId } : {})
    setSearch('')
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getPageNumbers = () => {
    const pages = []
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pages.push(i)
    }
    return pages
  }

  const hasActiveFilter = selectedTypeId !== 'all' || search || selectedRegion !== 0 || sortBy !== 'default'

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>

      {/* Page Header */}
      <div className="mb-6">
        <h1 style={{
          color: 'var(--color-forest-green)',
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 'var(--font-weight-bold)',
        }}>
          {t('all_projects')}
        </h1>
      </div>

      {/* ── Featured Banner ── */}
      {currentFeatured && (
        <div className="relative w-full overflow-hidden rounded-2xl mb-8" style={{ height: '320px' }}>
          {featuredList.map((item, i) => (
            <div
              key={item.royal_id}
              className="absolute inset-0 transition-opacity duration-700 cursor-pointer group"
              style={{ opacity: i === featuredIndex ? 1 : 0, zIndex: i === featuredIndex ? 1 : 0 }}
              onClick={() => navigate(`/projects/${item.royal_id}`)}
            >
              <img
                src={`${UPLOADS_URL}${item.img_banner || item.img_1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />
            </div>
          ))}

          {/* Tag ประเภท */}
          {typeMap[currentFeatured.type_id] && (
            <div className="absolute top-4 right-4" style={{ zIndex: 10 }}>
              <span className="text-xs font-medium px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                {lang === 'TH' ? typeMap[currentFeatured.type_id].type_name : typeMap[currentFeatured.type_id].type_name_eng}
              </span>
            </div>
          )}

          {/* Content + controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6" style={{ zIndex: 10 }}>
            <p className="text-white font-bold mb-1" style={{ fontSize: '1.25rem', lineHeight: '1.4' }}>
              {lang === 'TH' ? currentFeatured.royal_name : currentFeatured.royal_name_eng}
            </p>
            {(currentFeatured.detail_1 || currentFeatured.detail_1_eng) && (
              <p className="text-white line-clamp-2" style={{ fontSize: '0.8rem', opacity: 0.85 }}>
                {lang === 'TH' ? currentFeatured.detail_1 : currentFeatured.detail_1_eng}
              </p>
            )}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={(e) => { e.stopPropagation(); setFeaturedIndex(i => (i - 1 + featuredList.length) % featuredList.length) }}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center gap-1.5">
                {featuredList.map((_, i) => (
                  <button key={i}
                    onClick={(e) => { e.stopPropagation(); setFeaturedIndex(i) }}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === featuredIndex ? '20px' : '6px',
                      height: '6px',
                      backgroundColor: i === featuredIndex ? '#fff' : 'rgba(255,255,255,0.4)',
                    }} />
                ))}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFeaturedIndex(i => (i + 1) % featuredList.length) }}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Search Bar + Filters ── */}
      <div className="p-5 rounded-2xl mb-6"
        style={{ backgroundColor: 'white', border: '1px solid var(--color-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

        {/* Row 1: Search + Region + Province */}
        <div className="flex gap-3 mb-3">

          {/* Search */}
          <div className="relative flex-1" ref={searchRef}>
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--color-placeholder)' }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={lang === 'TH' ? 'ชื่อโครงการ' : 'Project name'}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              className="w-full pl-11 pr-5 py-2.5 rounded-xl focus:outline-none transition-colors"
              style={{
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-deep-text)',
                fontSize: 'var(--font-size-sm)',
              }}
            />

            {/* Autocomplete */}
            {searchFocused && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                  zIndex: 50,
                }}>
                {suggestions.map((p) => {
                  const name = lang === 'TH' ? p.royal_name : p.royal_name_eng
                  const matchIndex = (name ?? '').toLowerCase().indexOf(search.toLowerCase())
                  return (
                    <button key={p.royal_id}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors hover:bg-gray-50"
                      onMouseDown={() => { setSearch(name); setSearchFocused(false); setCurrentPage(1) }}>
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: 'var(--color-surface-2)' }}>
                        {(p.img_banner || p.img_1) && (
                          <img src={`${UPLOADS_URL}${p.img_banner || p.img_1}`} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-deep-text)' }}>
                        {matchIndex >= 0 ? (
                          <>
                            {name.slice(0, matchIndex)}
                            <span style={{ color: 'var(--color-forest-green)', fontWeight: 600 }}>
                              {name.slice(matchIndex, matchIndex + search.length)}
                            </span>
                            {name.slice(matchIndex + search.length)}
                          </>
                        ) : name}
                      </span>
                      {typeMap[p.type_id] && (
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-muted-text)' }}>
                          {lang === 'TH' ? typeMap[p.type_id].type_name : typeMap[p.type_id].type_name_eng}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Region dropdown */}
          <div className="relative" style={{ minWidth: '160px' }}>
            <select
              value={selectedRegion}
              onChange={(e) => { setSelectedRegion(Number(e.target.value)); setCurrentPage(1) }}
              className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl focus:outline-none text-sm"
              style={{ border: '1.5px solid var(--color-border)', color: selectedRegion === 0 ? 'var(--color-placeholder)' : 'var(--color-deep-text)' }}
            >
              <option value={0}>{lang === 'TH' ? 'ภูมิภาค' : 'Region'}</option>
              {geographies.map(geo => (
                <option key={geo.id} value={geo.id}>
                  {lang === 'TH' ? geo.name : geo.name_eng}
                </option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--color-muted-text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Type dropdown */}
          <div className="relative" style={{ minWidth: '180px' }}>
            <select
              value={selectedTypeId}
              onChange={(e) => { handleSelectType(e.target.value) }}
              className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl focus:outline-none text-sm"
              style={{ border: '1.5px solid var(--color-border)', color: selectedTypeId === 'all' ? 'var(--color-placeholder)' : 'var(--color-deep-text)' }}
            >
              <option value="all">{lang === 'TH' ? 'ประเภท/ด้าน' : 'Type'}</option>
              {typeProject.map(type => (
                <option key={type.type_id} value={type.type_id}>
                  {lang === 'TH' ? type.type_name : type.type_name_eng}
                </option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--color-muted-text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Row 2: Sort + ปุ่มค้นหา */}
        <div className="flex gap-3">

          {/* Sort */}
          <div className="relative" style={{ minWidth: '180px' }}>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1) }}
              className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl focus:outline-none text-sm"
              style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-deep-text)' }}
            >
              <option value="default">{lang === 'TH' ? 'เรียงค่าเริ่มต้น' : 'Default'}</option>
              <option value="az">{lang === 'TH' ? 'ชื่อ ก → ฮ' : 'Name A → Z'}</option>
              <option value="za">{lang === 'TH' ? 'ชื่อ ฮ → ก' : 'Name Z → A'}</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--color-muted-text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* ปุ่มค้นหา */}
          <button
            onClick={() => setCurrentPage(1)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--color-forest-green)', color: '#fff' }}
          >
            {lang === 'TH' ? 'ค้นหา' : 'Search'}
          </button>

          {/* Clear */}
          {hasActiveFilter && (
            <button
              onClick={() => { handleSelectType('all'); setSelectedRegion(0); setSortBy('default'); setSearch('') }}
              className="px-4 py-2.5 rounded-xl text-sm transition-colors"
              style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-muted-text)' }}
            >
              ล้าง ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Region Filter ── */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {[{ id: 0, name: 'ทั้งหมด', name_eng: 'All' }, ...geographies].map((geo) => (
          <button
            key={geo.id}
            onClick={() => { setSelectedRegion(geo.id); setCurrentPage(1) }}
            className="flex-shrink-0 text-xs px-4 py-1.5 rounded-full transition-all duration-200 font-medium"
            style={{
              backgroundColor: selectedRegion === geo.id ? 'var(--color-forest-green)' : 'white',
              color: selectedRegion === geo.id ? '#fff' : 'var(--color-muted-text)',
              border: `1.5px solid ${selectedRegion === geo.id ? 'var(--color-forest-green)' : 'var(--color-border)'}`,
            }}
          >
            {lang === 'TH' ? geo.name : geo.name_eng}
          </button>
        ))}
      </div>

      {/* ── Type Filter Tabs ── */}
      <div
        className="flex flex-wrap gap-1 mb-6 p-1 rounded-xl"
        style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
      >
        {[{ type_id: 'all', type_name: t('all'), type_name_eng: t('all') }, ...typeProject].map((type) => {
          const isSelected = selectedTypeId === type.type_id
          const count = type.type_id === 'all'
            ? projects.length
            : projects.filter(p => p.type_id === type.type_id).length
          return (
            <button
              key={type.type_id}
              onClick={() => handleSelectType(type.type_id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 text-sm"
              style={{
                backgroundColor: isSelected ? 'var(--color-forest-green)' : 'transparent',
                color: isSelected ? '#ffffff' : 'var(--color-muted-text)',
                fontWeight: isSelected ? '600' : '400',
              }}
            >
              <span>{lang === 'TH' ? type.type_name : type.type_name_eng}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--color-surface-3)',
                  color: isSelected ? '#fff' : 'var(--color-muted-text)',
                  fontSize: '0.65rem',
                }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Result count + Clear ── */}
      <div className="flex items-center justify-between mb-5">
        <p style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-xs)' }}>
          {t('showing_projects')} <strong style={{ color: 'var(--color-deep-text)' }}>{filtered.length}</strong> {t('project_unit')}
          {selectedTypeId !== 'all' && (
            <span className="ml-1">
              {t('in_category')} "<span style={{ color: 'var(--color-green)' }}>{selectedLabel}</span>"
            </span>
          )}
        </p>
        {hasActiveFilter && (
          <button
            onClick={() => { handleSelectType('all'); setSelectedRegion(0); setSortBy('default'); setSearch('') }}
            className="text-xs px-3 py-1 rounded-full transition-colors"
            style={{ border: '1px solid var(--color-border)', color: 'var(--color-muted-text)', backgroundColor: 'white' }}
          >
            {t('clear_filter')} ✕
          </button>
        )}
      </div>

      {/* ── Cards Grid ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 gap-4">
          <svg className="w-14 h-14" style={{ color: 'var(--color-green-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-sm)' }}>{t('project_not_found')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginated.map((project) => {
              const displayImage = [project.img_banner, project.img_1, project.img_2, project.img_3, project.img_4, project.img_5].find(Boolean)
              const projectType = typeMap[project.type_id]

              return (
                <div
                  key={project.royal_id}
                  onClick={() => navigate(`/projects/${project.royal_id}`)}
                  className="cursor-pointer group"
                >
                  <div
                    className="w-full overflow-hidden mb-3 relative"
                    style={{
                      aspectRatio: '3/2',
                      backgroundColor: 'white',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    {displayImage ? (
                      <img
                        src={`${UPLOADS_URL}${displayImage}`}
                        alt={lang === 'TH' ? project.royal_name : project.royal_name_eng}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-10 h-10" style={{ color: 'var(--color-disabled)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {projectType && (
                      <div className="absolute top-2 left-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'var(--color-forest-green)', color: '#fff', opacity: 0.92 }}>
                          {lang === 'TH' ? projectType.type_name : projectType.type_name_eng}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="line-clamp-2 group-hover:underline transition-colors"
                    style={{ color: 'var(--color-deep-text)', fontSize: 'var(--font-size-sm)', lineHeight: '1.5' }}>
                    {lang === 'TH' ? project.royal_name : project.royal_name_eng}
                  </p>
                </div>
              )
            })}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-10">
              <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm disabled:opacity-30"
                style={{ color: 'var(--color-muted-text)' }}>«</button>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm disabled:opacity-30"
                style={{ color: 'var(--color-muted-text)' }}>‹</button>
              {getPageNumbers().map(page => (
                <button key={page} onClick={() => handlePageChange(page)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: currentPage === page ? 'var(--color-forest-green)' : 'transparent',
                    color: currentPage === page ? '#fff' : 'var(--color-muted-text)',
                  }}>
                  {page}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm disabled:opacity-30"
                style={{ color: 'var(--color-muted-text)' }}>›</button>
              <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm disabled:opacity-30"
                style={{ color: 'var(--color-muted-text)' }}>»</button>
              <div className="flex items-center gap-2 ml-3">
                <span className="text-xs" style={{ color: 'var(--color-muted-text)' }}>{t('GoToPage')}</span>
                <input
                  type="number" min={1} max={totalPages} defaultValue=""
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseInt(e.currentTarget.value)
                      if (val >= 1 && val <= totalPages) handlePageChange(val)
                    }
                  }}
                  className="w-12 h-8 text-center text-sm rounded-lg focus:outline-none"
                  style={{ border: '1px solid var(--color-border)', color: 'var(--color-deep-text)', backgroundColor: 'white' }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}