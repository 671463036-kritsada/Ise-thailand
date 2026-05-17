import React, { useState, useEffect, useRef } from 'react'
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
    const [drawerOpen, setDrawerOpen] = useState(false)
    const navigate = useNavigate()
    const [typeProject, setTypeProject] = useState([])
    const drawerRef = useRef(null)

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

    // Close drawer on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (drawerOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
                setDrawerOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [drawerOpen])

    // Prevent body scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [drawerOpen])

    const handleSentTypeIdProject = (type_id) => {
        navigate(`/projects?typeId=${type_id}`)
        setDrawerOpen(false)
    }

    const handleNavAndClose = (path) => {
        navigate(path)
        setDrawerOpen(false)
    }

    return (
        <>
            <style>{`
                @media (max-width: 767px) {
                    .navbar-desktop { display: none !important; }
                    .navbar-hamburger { display: flex !important; }
                }
                @media (min-width: 768px) {
                    .navbar-desktop { display: flex !important; }
                    .navbar-hamburger { display: none !important; }
                    .mobile-drawer-overlay { display: none !important; }
                }
                .drawer-slide {
                    transform: translateX(-100%);
                    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
                }
                .drawer-slide.open {
                    transform: translateX(0);
                }
                .drawer-overlay {
                    opacity: 0;
                    transition: opacity 0.35s ease;
                    pointer-events: none;
                }
                .drawer-overlay.open {
                    opacity: 1;
                    pointer-events: auto;
                }
                .drawer-accordion-content {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s cubic-bezier(0.4,0,0.2,1);
                }
                .drawer-accordion-content.open {
                    max-height: 600px;
                }
                .hamburger-line {
                    display: block;
                    width: 22px;
                    height: 2px;
                    background: rgba(255,255,255,0.9);
                    border-radius: 2px;
                    transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
                    transform-origin: center;
                }
                .ham-open .hamburger-line:nth-child(1) { transform: translateY(8px) rotate(45deg); }
                .ham-open .hamburger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
                .ham-open .hamburger-line:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
            `}</style>

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

                {/* ── DESKTOP NAV ── */}
                <div className="navbar-desktop max-w-7xl mx-auto px-8 h-14 items-center justify-center gap-8">
                    <NavLink href="/">หน้าหลัก</NavLink>
                    <Dot />

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

                    <span style={{
                        width: '1px', height: '16px',
                        background: 'linear-gradient(to bottom, transparent, rgba(186,200,177,0.5), transparent)',
                    }} />

                    <OutlineButton onClick={() => navigate('/login')}>เข้าสู่ระบบ</OutlineButton>
                    <OutlineButton onClick={() => navigate('/admin')}>Admin</OutlineButton>

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

                {/* ── MOBILE TOPBAR ── */}
                <div
                    className="navbar-hamburger"
                    style={{
                        display: 'none', // overridden by media query
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 20px',
                        height: '56px',
                    }}
                >
                    {/* Logo / Site name */}
                    <button
                        onClick={() => handleNavAndClose('/')}
                        style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.9)',
                            letterSpacing: '0.08em',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                        }}
                    >
                        สถาบันเศรษฐกิจพอเพียง
                    </button>

                    {/* Hamburger button — right side */}
                    <button
                        onClick={() => setDrawerOpen(!drawerOpen)}
                        className={drawerOpen ? 'ham-open' : ''}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '6px',
                            borderRadius: '6px',
                        }}
                        aria-label="Toggle menu"
                    >
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                    </button>
                </div>
            </nav>

            {/* ── DRAWER OVERLAY ── */}
            <div
                className={`mobile-drawer-overlay drawer-overlay ${drawerOpen ? 'open' : ''}`}
                onClick={() => setDrawerOpen(false)}
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(20,30,18,0.55)',
                    zIndex: 40,
                    backdropFilter: 'blur(2px)',
                }}
            />

            {/* ── SLIDE-IN DRAWER (left) ── */}
            <div
                ref={drawerRef}
                className={`drawer-slide ${drawerOpen ? 'open' : ''}`}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '280px',
                    height: '100dvh',
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'rgba(38,50,34,0.98)',
                    backdropFilter: 'blur(16px)',
                    borderRight: '1px solid rgba(186,200,177,0.2)',
                    boxShadow: '4px 0 32px rgba(20,30,18,0.4)',
                    overflowY: 'auto',
                }}
            >
                {/* Drawer header */}
                <div style={{
                    padding: '20px 20px 16px',
                    borderBottom: '1px solid rgba(186,200,177,0.15)',
                    background: 'linear-gradient(180deg, rgba(64,78,59,0.6) 0%, transparent 100%)',
                }}>
                    <div style={{
                        height: '2px',
                        background: 'linear-gradient(to right, var(--color-gold, #c9a84c), transparent)',
                        marginBottom: '14px',
                        borderRadius: '2px',
                    }} />
                    <p style={{
                        fontSize: '0.65rem',
                        color: 'rgba(186,200,177,0.5)',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                    }}>เมนูหลัก</p>
                </div>

                {/* Drawer body */}
                <div style={{ flex: 1, padding: '8px 0' }}>

                    {/* หน้าหลัก */}
                    <DrawerNavItem onClick={() => handleNavAndClose('/')}>หน้าหลัก</DrawerNavItem>

                    {/* ศาสตร์ของพระราชา accordion */}
                    <DrawerAccordion label="ศาสตร์ของพระราชา">
                        <DrawerSubItem onClick={() => { navigate('/projects'); setDrawerOpen(false) }} strong>
                            ดูทั้งหมด
                        </DrawerSubItem>
                        {typeProject.map((data) => (
                            <DrawerSubItem key={data.type_id} onClick={() => handleSentTypeIdProject(data.type_id)}>
                                {data.type_name}
                            </DrawerSubItem>
                        ))}
                    </DrawerAccordion>

                    {/* งานภายใต้สถาบัน accordion */}
                    <DrawerAccordion label="งานภายใต้สถาบันฯ">
                        {INSTITUTE_MENUS.map((menu) => (
                            <DrawerSubItem key={menu.path} onClick={() => handleNavAndClose(menu.path)}>
                                {menu.label}
                            </DrawerSubItem>
                        ))}
                    </DrawerAccordion>

                    {/* สถาบันเศรษฐกิจพอเพียง */}
                    <DrawerNavItem onClick={() => handleNavAndClose('/institute')}>สถาบันเศรษฐกิจพอเพียง</DrawerNavItem>
                </div>

                {/* Drawer footer */}
                <div style={{
                    padding: '16px 20px 32px',
                    borderTop: '1px solid rgba(186,200,177,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}>
                    <DrawerOutlineBtn onClick={() => handleNavAndClose('/login')}>เข้าสู่ระบบ</DrawerOutlineBtn>
                    <DrawerOutlineBtn onClick={() => handleNavAndClose('/admin')}>Admin</DrawerOutlineBtn>

                    {/* Language toggle */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        {languages.map((lang) => {
                            const isSelected = selectedLang.code === lang.code
                            return (
                                <button
                                    key={lang.code}
                                    onClick={() => setSelectedLang(lang)}
                                    style={{
                                        flex: 1,
                                        padding: '7px 0',
                                        fontSize: '0.72rem',
                                        fontWeight: isSelected ? 600 : 400,
                                        borderRadius: '6px',
                                        border: isSelected
                                            ? '1px solid rgba(201,168,76,0.7)'
                                            : '1px solid rgba(186,200,177,0.2)',
                                        color: isSelected ? 'var(--color-gold, #c9a84c)' : 'rgba(255,255,255,0.55)',
                                        backgroundColor: isSelected ? 'rgba(201,168,76,0.1)' : 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    {lang.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

// ── Drawer sub-components ──────────────────────────────

function DrawerNavItem({ onClick, children }) {
    const [hovered, setHovered] = useState(false)
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '13px 24px',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: hovered ? '#fff' : 'rgba(255,255,255,0.78)',
                background: hovered ? 'rgba(186,200,177,0.08)' : 'none',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.06em',
                transition: 'all 0.15s',
            }}
        >
            {children}
        </button>
    )
}

function DrawerAccordion({ label, children }) {
    const [open, setOpen] = useState(false)
    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '13px 24px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: open ? '#fff' : 'rgba(255,255,255,0.78)',
                    background: open ? 'rgba(186,200,177,0.06)' : 'none',
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                }}
            >
                <span>{label}</span>
                <svg
                    width="14" height="14"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    style={{
                        flexShrink: 0,
                        opacity: 0.6,
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                    }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div className={`drawer-accordion-content ${open ? 'open' : ''}`}>
                <div style={{
                    borderLeft: '2px solid rgba(201,168,76,0.3)',
                    marginLeft: '24px',
                    paddingLeft: '4px',
                    marginBottom: '4px',
                }}>
                    {children}
                </div>
            </div>
        </div>
    )
}

function DrawerSubItem({ onClick, children, strong }) {
    const [hovered, setHovered] = useState(false)
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                fontSize: '0.75rem',
                fontWeight: strong ? 600 : 400,
                color: hovered || strong ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
                background: hovered ? 'rgba(186,200,177,0.08)' : 'none',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.03em',
                transition: 'all 0.15s',
            }}
        >
            {children}
        </button>
    )
}

function DrawerOutlineBtn({ onClick, children }) {
    const [hovered, setHovered] = useState(false)
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: '100%',
                padding: '10px',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: hovered ? '#fff' : 'rgba(255,255,255,0.75)',
                border: hovered ? '1px solid rgba(255,255,255,0.45)' : '1px solid rgba(255,255,255,0.2)',
                backgroundColor: hovered ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                letterSpacing: '0.08em',
                transition: 'all 0.2s',
            }}
        >
            {children}
        </button>
    )
}

// ── Desktop sub-components ──────────────────────────────

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