import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [selectedTypeId, setSelectedTypeId] = useState('ทั้งหมด')
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [typeProject, setTypeProject] = useState([])

  useEffect(() => {
    const typeId = searchParams.get('typeId') || ''
    setSelectedTypeId(typeId || 'ทั้งหมด')
  }, [searchParams])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:2000/api/royal/')
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        const data = await res.json()
        setProjects(data.data || [])
      } catch (err) {
        console.error('API error:', err)
      }
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    const fetchTypeProject = async () => {
      try {
        const res = await fetch('http://localhost:2000/api/royal/types')
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        const data = await res.json()
        setTypeProject(data.data || [])
      } catch (err) {
        console.error('API error:', err)
      }
    }
    fetchTypeProject()
  }, [])

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchType = selectedTypeId === 'ทั้งหมด' || p.type_id === selectedTypeId
      const matchSearch = (p.royal_name ?? '').toLowerCase().includes(search.toLowerCase())
      return matchType && matchSearch
    })
  }, [selectedTypeId, search, projects])

  const selectedLabel = selectedTypeId === 'ทั้งหมด'
    ? 'ทั้งหมด'
    : typeProject.find(t => t.type_id === selectedTypeId)?.type_name ?? 'ทั้งหมด'

  const handleSelectType = (typeId) => {
    setSelectedTypeId(typeId)
    setSearchParams(typeId !== 'ทั้งหมด' ? { typeId } : {})
    setSearch('')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>

      {/* Page Header */}
      <div className="mb-8">
        <h1 style={{
          color: 'var(--color-deep-text)',
          fontSize: 'var(--font-size-3xl)',
          fontWeight: 'var(--font-weight-bold)',
        }}>
          โครงการทั้งหมด
        </h1>
        <p style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-sm)', marginTop: 4 }}>
          {projects.length} โครงการทั้งหมด
        </p>
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
          placeholder="ค้นหาโครงการ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-5 py-3 rounded-2xl focus:outline-none transition-colors"
          style={{
            backgroundColor: 'var(--color-surface-2)',
            border: '1.5px solid var(--color-border)',
            color: 'var(--color-deep-text)',
            fontSize: 'var(--font-size-sm)',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--color-border-focus)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
        />
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ type_id: 'ทั้งหมด', type_name: 'ทั้งหมด' }, ...typeProject].map((t) => {
          const isSelected = selectedTypeId === t.type_id
          const count = t.type_id === 'ทั้งหมด'
            ? projects.length
            : projects.filter(p => p.type_id === t.type_id).length

          return (
            <button
              key={t.type_id}
              onClick={() => handleSelectType(t.type_id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200"
              style={{
                backgroundColor: isSelected ? 'var(--color-forest-green)' : 'var(--color-surface-2)',
                border: `1.5px solid ${isSelected ? 'var(--color-forest-green)' : 'var(--color-border)'}`,
                color: isSelected ? '#ffffff' : 'var(--color-muted-text)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isSelected ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                boxShadow: isSelected ? '0 2px 8px var(--color-shadow-md)' : 'none',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-3)'
                  e.currentTarget.style.borderColor = 'var(--color-green-light)'
                  e.currentTarget.style.color = 'var(--color-deep-text)'
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.color = 'var(--color-muted-text)'
                }
              }}
            >
              <span>{t.type_name}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--color-surface-3)',
                  color: isSelected ? '#ffffff' : 'var(--color-green)',
                  fontSize: '0.65rem',
                  fontWeight: 'var(--font-weight-semibold)',
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Result count */}
      <p className="mb-5" style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-xs)' }}>
        แสดง {filtered.length} โครงการ
        {selectedTypeId !== 'ทั้งหมด' && (
          <>
            <span className="mx-1" style={{ color: 'var(--color-green)' }}>
              ใน "{selectedLabel}"
            </span>
            <button
              onClick={() => handleSelectType('ทั้งหมด')}
              className="underline ml-1"
              style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-xs)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-forest-green)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted-text)'}
            >
              ล้างตัวกรอง
            </button>
          </>
        )}
      </p>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 gap-4">
          <svg className="w-14 h-14" style={{ color: 'var(--color-green-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p style={{ color: 'var(--color-muted-text)', fontSize: 'var(--font-size-sm)' }}>ไม่พบโครงการที่ค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <div
              key={project.royal_id}
              onClick={() => navigate(`/projects/${project.royal_id}`)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300"
              style={{
                height: 256,
                boxShadow: '0 1px 4px var(--color-shadow)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px var(--color-shadow-lg)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px var(--color-shadow)'}
            >
              <img
                src={project.img_banner}
                alt={project.royal_name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(40,56,36,0.92) 0%, rgba(40,56,36,0.25) 55%, transparent 100%)' }}
              />

              {/* Type badge */}
              <div className="absolute top-3 left-3">
                <span
                  className="px-2.5 py-1 rounded-full backdrop-blur-sm"
                  style={{
                    color: '#ffffff',
                    backgroundColor: 'rgba(123,150,105,0.45)',
                    border: '1px solid rgba(186,200,177,0.55)',
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  {project.type_name}
                </span>
              </div>

              {/* Gold accent line on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: 'var(--color-gold)' }}
              />

              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <h3
                  className="text-white leading-relaxed line-clamp-2 drop-shadow"
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                  }}
                >
                  {project.royal_name}
                </h3>
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span style={{ color: 'var(--color-gold)', fontSize: 'var(--font-size-xs)' }}>ดูรายละเอียด</span>
                  <svg className="w-3 h-3" style={{ color: 'var(--color-gold)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}