import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [selectedProjectByTypeId, setSelectedProjectByTypeId] = useState('ทั้งหมด')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  
  const [projects, setProjects] = useState([])
  const [typeProject, setTypeProject] = useState([])

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const cat = decodeURIComponent(searchParams.get('typeId') || '')
    setSelectedCategory(cat || 'ทั้งหมด')
  }, [searchParams])


  // fetch project data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:2000/api/project')
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        const data = await res.json()
        setProjects(data.data || [])
      } catch (err) {
        console.error('API error:', err)
      }
    }
    fetchProjects()
  }, [])

  // fetch project types for dropdown
  useEffect(() => {
    const fetchTypeProject = async () => {
      try {
        const res = await fetch('http://localhost:2000/api/royal/types')
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        const data = await res.json()
        // เพิ่ม "ทั้งหมด" ไว้ตัวแรก
        setTypeProject(['ทั้งหมด', ...(data.data || []).map(t => t.type_name)])
      } catch (err) {
        console.error('API error:', err)
      }
    }
    fetchTypeProject()
  }, [])

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = selectedCategory === 'ทั้งหมด' || p.type_name === selectedCategory
      const matchSearch = (p.name_thai ?? '').toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [selectedCategory, search, projects])

  const handleCategory = (cat) => {
    setSelectedCategory(cat)
    setSearchParams(cat !== 'ทั้งหมด' ? { category: encodeURIComponent(cat) } : {})
    setSearch('')
    setDropdownOpen(false)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface)' }}>

      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="font-bold"
          style={{ color: 'var(--color-text)', fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }}
        >
          โครงการทั้งหมด
        </h1>
      </div>

      {/* Search + Dropdown — row เดียวกัน */}
      <div className="flex gap-3 mb-8 items-center">

        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'var(--color-text-muted)' }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="ค้นหาโครงการ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-5 py-3 rounded-2xl focus:outline-none"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-primary-light)',
              color: 'var(--color-text)',
              fontSize: 'var(--font-size-sm)',
            }}
          />
        </div>

        {/* Dropdown */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl transition-colors duration-150"
            style={{
              backgroundColor: selectedCategory !== 'ทั้งหมด'
                ? 'var(--color-primary-dark)'
                : 'var(--color-surface)',
              border: '1px solid var(--color-primary-light)',
              color: selectedCategory !== 'ทั้งหมด'
                ? '#ffffff'
                : 'var(--color-text)',
              fontSize: 'var(--font-size-sm)',
              minWidth: 180,
            }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              style={{ color: selectedCategory !== 'ทั้งหมด' ? '#ffffff' : 'var(--color-text-muted)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <span className="flex-1 text-left truncate">
              {selectedCategory}
            </span>
            <svg
              className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
              style={{
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                color: selectedCategory !== 'ทั้งหมด' ? '#ffffff' : 'var(--color-text-muted)',
              }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 rounded-2xl shadow-lg overflow-hidden z-50"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-primary-light)',
                minWidth: 220,
                top: '100%',
              }}
            >
              {typeProject.map((cat, i) => {
                const isSelected = selectedCategory === cat
                return (
                  <button
                    key={i}
                    onClick={() => handleCategory(cat)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-100"
                    style={{
                      backgroundColor: isSelected
                        ? 'rgba(123,150,105,0.12)'
                        : 'transparent',
                      borderBottom: i < typeProject.length - 1
                        ? '1px solid rgba(186,200,177,0.3)'
                        : 'none',
                      color: isSelected
                        ? 'var(--color-primary-dark)'
                        : 'var(--color-text)',
                      fontSize: 'var(--font-size-sm)',
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(186,200,177,0.15)'
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        style={{ color: 'var(--color-primary-dark)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    <span className={isSelected ? '' : 'ml-[22px]'}>{cat}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Result count */}
      <p className="mb-5" style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
        {filtered.length} โครงการ
        {selectedCategory !== 'ทั้งหมด' && (
          <span className="ml-1" style={{ color: 'var(--color-primary)' }}>
            ใน "{selectedCategory}"
          </span>
        )}
        {selectedCategory !== 'ทั้งหมด' && (
          <button
            onClick={() => handleCategory('ทั้งหมด')}
            className="ml-2 underline transition-colors"
            style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary-dark)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
          >
            ล้างตัวกรอง
          </button>
        )}
      </p>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 gap-4">
          <svg className="w-14 h-14" style={{ color: 'var(--color-primary-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>ไม่พบโครงการที่ค้นหา</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <div
              key={project.project_id}
              onClick={() => navigate(`/projects/${project.project_id}`)}
              className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={project.image}
                alt={project.name_thai}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(64,78,59,0.9) 0%, rgba(64,78,59,0.2) 50%, transparent 100%)' }}
              />
              <div className="absolute top-3 left-3">
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm"
                  style={{
                    color: '#ffffff',
                    backgroundColor: 'rgba(123,150,105,0.4)',
                    border: '1px solid rgba(186,200,177,0.5)',
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  {project.type_name}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <h3
                  className="text-white font-semibold leading-relaxed line-clamp-2 drop-shadow"
                  style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}
                >
                  {project.name_thai}
                </h3>
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span style={{ color: 'var(--color-primary-light)', fontSize: 'var(--font-size-xs)' }}>ดูรายละเอียด</span>
                  <svg className="w-3 h-3" style={{ color: 'var(--color-primary-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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