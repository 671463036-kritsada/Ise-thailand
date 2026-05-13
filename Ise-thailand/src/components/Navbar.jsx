import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


const INSTITUTE_MENUS = [
    { label: 'โครงการ/งานวิจัย ภายใต้สถาบันเศรษฐกิจพอเพียง', path: '/research' },
    { label: 'EBOOK', path: '/ebook' },
    { label: 'ผลงานวิชาการ', path: '/academic' },
    { label: 'สื่อนวัตกรรมการเรียนรู้', path: '/media' },
    { label: 'วีดีทัศน์', path: '/video' },
]

// CSS variable shortcuts
const C = {
    forestGreen: 'var(--color-forest-green)',
    green: 'var(--color-green)',
    greenLight: 'var(--color-green-light)',
    white: 'var(--color-white)',
    deepText: 'var(--color-deep-text)',
    mutedText: 'var(--color-muted-text)',
}

// Dropdown menu styles
const dropdownStyle = {
    backgroundColor: C.white,
    border: `1px solid ${C.greenLight}`,
}

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
                color: hovered || strong ? C.deepText : C.mutedText,
                fontWeight: strong ? 600 : 400,
                backgroundColor: hovered ? 'rgba(186,200,177,0.2)' : 'transparent',
                borderBottom: strong ? `1px solid rgba(186,200,177,0.3)` : 'none',
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
                console.log('Fetched project types:', data)
            } catch (err) {
                console.error('API error:', err)
                setError(err.message)  // ถ้ามี state สำหรับ error
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

    const navStyle = {
        backgroundColor: scrolled ? 'rgba(64,78,59,0.97)' : 'rgba(64,78,59,0.92)',
        borderBottom: '1px solid rgba(186,200,177,0.3)',
        boxShadow: scrolled ? '0 2px 16px rgba(64,78,59,0.2)' : 'none',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
    }

    return (
        <nav className="w-full fixed top-0 left-0 z-50  transition-all duration-500" style={navStyle} >

            {/* Top accent line */}
            <div style={{ height: '2px', background: `linear-gradient(to right, transparent, ${C.green}, ${C.greenLight})` }} />

            <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-center gap-8">

                {/* หน้าหลัก */}
                <NavLink href="/">หน้าหลัก</NavLink>

                <Dot />

                {/* ศาสตร์ของพระราชา */}
                <DropdownMenu label="ศาสตร์ของพระราชา">
                    <div style={{ height: '2px', background: `linear-gradient(to right, ${C.green}, ${C.forestGreen})` }} />
                    <DropdownItem onClick={() => navigate('/projects')} strong>ดูทั้งหมด</DropdownItem>
                    {typeProject.map((data) => (
                        <DropdownItem key={data.type_id} onClick={() => handleSentTypeIdProject(data.type_id)}>{data.type_name}</DropdownItem>
                    ))}
                </DropdownMenu>

                <Dot />

                {/* งานภายใต้สถาบัน */}
                <DropdownMenu label="งานภายใต้สถาบันเศรษฐกิจพอเพียง">
                    <div style={{ height: '2px', background: `linear-gradient(to right, ${C.green}, ${C.forestGreen})` }} />
                    {INSTITUTE_MENUS.map((menu) => (
                        <DropdownItem key={menu.path} onClick={() => navigate(menu.path)}>{menu.label}</DropdownItem>
                    ))}
                </DropdownMenu>

                <Dot />

                {/* สถาบันเศรษฐกิจพอเพียง */}
                <NavLink as="button" onClick={() => navigate('/institute')}>สถาบันเศรษฐกิจพอเพียง</NavLink>

                {/* Separator */}
                <span style={{ width: '1px', height: '16px', background: `linear-gradient(to bottom, transparent, ${C.greenLight}, transparent)` }} />

                {/* เข้าสู่ระบบ */}
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
                            style={dropdownStyle}
                        >
                            <div style={{ height: '2px', background: `linear-gradient(to right, ${C.green}, ${C.forestGreen})` }} />
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
                                                <svg className="w-3 h-3 ml-auto" fill="currentColor" viewBox="0 0 20 20" style={{ color: C.green }}>
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

// --- Sub-components ---

function Dot() {
    return <span style={{ width: '4px', height: '4px', borderRadius: '9999px', backgroundColor: 'var(--color-green)', opacity: 0.4, flexShrink: 0 }} />
}

function NavLink({ href, onClick, children }) {
    const [hovered, setHovered] = useState(false)
    const base = {
        fontSize: '0.75rem',
        fontWeight: 500,
        color: hovered ? '#ffffff' : 'rgba(255,255,255,0.9)',
        letterSpacing: '0.1em',
        whiteSpace: 'nowrap',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        position: 'relative',
        transition: 'color 0.2s',
        textDecoration: 'none',
    }
    const Tag = href ? 'a' : 'button'
    return (
        <Tag
            href={href}
            onClick={onClick}
            style={base}
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
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                className="flex items-center gap-1"
                style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: hovered ? '#ffffff' : 'rgba(255,255,255,0.9)',
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
                className="absolute top-full left-0 mt-3 w-64 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200"
                style={{
                    ...dropdownStyle,
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
                color: hovered ? '#ffffff' : 'rgba(255,255,255,0.9)',
                letterSpacing: '0.1em',
                whiteSpace: 'nowrap',
                padding: '6px 16px',
                borderRadius: '4px',
                border: hovered ? '1px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.3)',
                backgroundColor: hovered ? 'rgba(255,255,255,0.15)' : 'transparent',
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