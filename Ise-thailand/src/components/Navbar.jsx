import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const INSTITUTE_MENUS = [
    { label: 'โครงการ/งานวิจัย ภายใต้สถาบันเศรษฐกิจพอเพียง', path: '/research' },
    { label: 'EBOOK', path: '/ebook' },
    { label: 'ผลงานวิชาการ', path: '/academic' },
    { label: 'สื่อนวัตกรรมการเรียนรู้', path: '/media' },
    { label: 'วีดีทัศน์', path: '/video' },
]

const dropdownItemBase = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px 20px',
    fontSize: '0.75rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.15s, color 0.15s',
}

function DropdownItem({ onClick, children, strong }) {
    const [hovered, setHovered] = useState(false)
    return (
        <button
            onClick={onClick}
            style={{
                ...dropdownItemBase,
                color: hovered || strong ? 'var(--color-deep-text)' : 'var(--color-muted-text)',
                fontWeight: strong ? 600 : 400,
                backgroundColor: hovered ? 'var(--color-surface-3)' : 'transparent',
                borderBottom: strong ? '1px solid var(--color-border)' : 'none',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </button>
    )
}

function Navbar() {
    const [langOpen, setLangOpen] = useState(false)
    const [selectedLang, setSelectedLang] = useState({ code: 'TH', label: 'ไทย' })
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()
    const [typeProject, setTypeProject] = useState([])

    const languages = [
        { code: 'TH', label: 'ไทย' },
        { code: 'EN', label: 'English' },
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:2000/api/project/types')
                if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
                const data = await res.json()
                setTypeProject(data.data || [])
            } catch (err) {
                console.error('API error:', err)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSentTypeIdProject = (type_id) => {
        navigate(`/projects?typeId=${type_id}`)
    }

    return (
        <nav
            className="w-full fixed top-0 left-0 z-50 transition-all duration-500"
            style={{
                backgroundColor: scrolled ? 'rgba(64,78,59,0.97)' : 'rgba(64,78,59,0.92)',
                borderBottom: '1px solid rgba(186,200,177,0.25)',
                boxShadow: scrolled ? '0 2px 20px rgba(40,56,36,0.25)' : 'none',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}
        >
            {/* Gold top accent line */}
            <div style={{
                height: '2px',
                background: 'linear-gradient(to right, transparent, var(--color-gold), var(--color-gold-border), transparent)',
            }} />

            <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-center gap-8">

                <NavLink href="/">หน้าหลัก</NavLink>
                <Dot />

                {/* ศาสตร์ของพระราชา */}
                <DropdownMenu label="ศาสตร์ของพระราชา">
                    <GradientBar />
                    <DropdownItem onClick={() => navigate('/projects')} strong>ดูทั้งหมด</DropdownItem>
                    {typeProject.map((data) => (
                        <DropdownItem key={data.type_id} onClick={() => handleSentTypeIdProject(data.type_id)}>
                            {data.type_name}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
                <Dot />

                {/* งานภายใต้สถาบัน */}
                <DropdownMenu label="งานภายใต้สถาบันเศรษฐกิจพอเพียง">
                    <GradientBar />
                    {INSTITUTE_MENUS.map((menu) => (
                        <DropdownItem key={menu.path} onClick={() => navigate(menu.path)}>
                            {menu.label}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
                <Dot />

                <NavLink as="button" onClick={() => navigate('/institute')}>สถาบันเศรษฐกิจพอเพียง</NavLink>

                {/* Separator */}
                <span style={{
                    width: '1px', height: '16px',
                    background: 'linear-gradient(to bottom, transparent, rgba(186,200,177,0.5), transparent)',
                }} />

                <OutlineButton onClick={() => navigate('/login')}>เข้าสู่ระบบ</OutlineButton>

                {/* Language Switcher */}
                <div className="relative">
                    <OutlineButton onClick={() => setLangOpen(!langOpen)}>
                        <span>{selectedLang.code}</span>
                        <svg
                            className="w-3 h-3 transition-transform duration-200"
                            style={{ transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    </OutlineButton>

                    {langOpen && (
                        <div
                            className="absolute top-full right-0 mt-3 w-36 rounded-xl shadow-xl z-50 overflow-hidden"
                            style={{
                                backgroundColor: 'var(--color-white)',
                                border: '1px solid var(--color-border)',
                                boxShadow: '0 8px 24px var(--color-shadow-lg)',
                            }}
                        >
                            <GradientBar />
                            {languages.map((lang) => {
                                const isSelected = selectedLang.code === lang.code
                                return (
                                    <DropdownItem
                                        key={lang.code}
                                        onClick={() => { setSelectedLang(lang); setLangOpen(false) }}
                                        strong={isSelected}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span>{lang.label}</span>
                                            {isSelected && (
                                                <svg className="w-3 h-3 ml-auto" fill="currentColor" viewBox="0 0 20 20"
                                                    style={{ color: 'var(--color-green)' }}>
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </span>
                                    </DropdownItem>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

// ── Sub-components ──────────────────────────────

function GradientBar() {
    return (
        <div style={{
            height: '2px',
            background: 'linear-gradient(to right, var(--color-green), var(--color-forest-green))',
        }} />
    )
}

function Dot() {
    return (
        <span style={{
            width: '4px', height: '4px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-green-light)',
            opacity: 0.5,
            flexShrink: 0,
        }} />
    )
}

function NavLink({ href, onClick, children }) {
    const [hovered, setHovered] = useState(false)
    const Tag = href ? 'a' : 'button'
    return (
        <Tag
            href={href}
            onClick={onClick}
            style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: hovered ? 'var(--color-white)' : 'rgba(255,255,255,0.85)',
                letterSpacing: '0.1em',
                whiteSpace: 'nowrap',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'color 0.2s',
                textDecoration: 'none',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </Tag>
    )
}

function DropdownMenu({ label, children }) {
    const [open, setOpen] = useState(false)
    const [hovered, setHovered] = useState(false)
    return (
        <div className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                className="flex items-center gap-1"
                style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: hovered ? 'var(--color-white)' : 'rgba(255,255,255,0.85)',
                    letterSpacing: '0.1em',
                    whiteSpace: 'nowrap',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {label}
                <svg
                    className="w-3 h-3 mt-0.5 transition-transform duration-200"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className="absolute top-full left-0 mt-3 w-64 rounded-xl z-50 overflow-hidden transition-all duration-200"
                style={{
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 8px 24px var(--color-shadow-lg)',
                    opacity: open ? 1 : 0,
                    visibility: open ? 'visible' : 'hidden',
                    transform: open ? 'translateY(0)' : 'translateY(6px)',
                }}
            >
                {children}
            </div>
        </div>
    )
}

function OutlineButton({ onClick, children }) {
    const [hovered, setHovered] = useState(false)
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2"
            style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: hovered ? 'var(--color-white)' : 'rgba(255,255,255,0.85)',
                letterSpacing: '0.1em',
                whiteSpace: 'nowrap',
                padding: '6px 16px',
                borderRadius: 'var(--radius-sm)',
                border: hovered ? '1px solid rgba(255,255,255,0.55)' : '1px solid rgba(255,255,255,0.25)',
                backgroundColor: hovered ? 'rgba(255,255,255,0.12)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </button>
    )
}

export default Navbar