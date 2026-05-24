import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'
import { useTranslation } from 'react-i18next'
import api from '../../api/axios'
import { UPLOADS_URL } from '../../constants/uploads_url'

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [selectedTypeId, setSelectedTypeId] = useState('all')
  const navigate = useNavigate()
  const { lang } = useLang()
  const { t } = useTranslation()
  const [projects, setProjects] = useState([])
  const [typeProject, setTypeProject] = useState([])

  useEffect(() => {
    const typeId = searchParams.get('typeId') || ''
    setSelectedTypeId(typeId || 'all')
  }, [searchParams])

  useEffect(() => {
    api.get('/royal/').then(res => setProjects(res.data.data || [])).catch(console.error)
  }, [])

  useEffect(() => {
    api.get('/royal/types').then(res => setTypeProject(res.data.data || [])).catch(console.error)
  }, [])

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchType = selectedTypeId === 'all' || p.type_id === selectedTypeId
      const matchSearch = (p.royal_name ?? '').toLowerCase().includes(search.toLowerCase())
      return matchType && matchSearch
    })
  }, [selectedTypeId, search, projects])

  const selectedType = typeProject.find(t => t.type_id === selectedTypeId)
  const selectedLabel = selectedTypeId === 'all'
    ? t('all')
    : (lang === 'TH' ? selectedType?.type_name : selectedType?.type_name_eng) ?? t('all')

  const handleSelectType = (typeId) => {
    setSelectedTypeId(typeId)
    setSearchParams(typeId !== 'all' ? { typeId } : {})
    setSearch('')
  }

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

      {/* Search */}
      <div className="relative mb-5">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: 'var(--color-placeholder)' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder={t('search_projects')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-5 py-2.5 rounded-xl focus:outline-none transition-colors"
          style={{
            backgroundColor: 'white',
            border: '1.5px solid var(--color-border)',
            color: 'var(--color-deep-text)',
            fontSize: 'var(--font-size-sm)',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--color-border-focus)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
        />
      </div>

      {/* Filter Tabs */}
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
              style={{
                backgroundColor: isSelected ? 'var(--color-forest-green)' : 'transparent',
                color: isSelected ? '#ffffff' : 'var(--color-muted-text)',
                fontWeight: isSelected ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
              }}
            >
              <span>{lang === 'TH' ? type.type_name : type.type_name_eng}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--color-surface-3)',
                  color: isSelected ? '#ffffff' : 'var(--color-muted-text)',
                  fontSize: '0.65rem',
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between mb-5">
        <p style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-xs)' }}>
          {t('showing_projects')} <strong style={{ color: 'var(--color-deep-text)' }}>{filtered.length}</strong> {t('project_unit')}
          {selectedTypeId !== 'all' && (
            <span className="ml-1">
              {t('in_category')} "<span style={{ color: 'var(--color-green)' }}>{selectedLabel}</span>"
            </span>
          )}
        </p>
        {selectedTypeId !== 'all' && (
          <button
            onClick={() => handleSelectType('all')}
            className="text-xs px-3 py-1 rounded-full transition-colors"
            style={{
              border: '1px solid var(--color-border)',
              color: 'var(--color-muted-text)',
              backgroundColor: 'white',
            }}
          >
            {t('clear_filter')} ✕
          </button>
        )}
      </div>

      {/* Cards Grid — รูปบน ชื่อล่าง เหมือนในรูป */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 gap-4">
          <svg className="w-14 h-14" style={{ color: 'var(--color-green-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-sm)' }}>{t('project_not_found')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((project) => {
            const displayImage = [project.img_banner, project.img_1, project.img_2, project.img_3, project.img_4, project.img_5]
              .find(Boolean)

            return (
              <div
                key={project.royal_id}
                onClick={() => navigate(`/projects/${project.royal_id}`)}
                className="cursor-pointer group"
              >
                {/* รูปภาพ */}
                <div
                  className="w-full rounded-xl overflow-hidden mb-3 relative"
                  style={{ height: 200, backgroundColor: 'var(--color-surface-3)' }}
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
                </div>

                {/* ชื่อโครงการ */}
                <p
                  className="line-clamp-3 group-hover:text-forest-green transition-colors"
                  style={{
                    color: 'var(--color-deep-text)',
                    fontSize: 'var(--font-size-sm)',
                    lineHeight: 'var(--line-height-relaxed)',
                  }}
                >
                  {lang === 'TH' ? project.royal_name : project.royal_name_eng}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}