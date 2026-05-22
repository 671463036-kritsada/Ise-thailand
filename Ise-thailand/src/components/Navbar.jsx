import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'
import { useLang } from '../context/LanguageContext'
import api from '../api/axios'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'

import imageLogo from '../../public/logo.jpg'

function Navbar() {
    const { lang, setLang } = useLang()
    const [langOpen, setLangOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mobileDropdown, setMobileDropdown] = useState('')
    const [activeDropdown, setActiveDropdown] = useState('')
    const [pinnedDropdown, setPinnedDropdown] = useState('')
    const navigate = useNavigate()
    const [typeProject, setTypeProject] = useState([])
    const [assetTypes, setAssetTypes] = useState([])
    const { user } = useAuth()
    const mobileRef = useRef(null)
    const langRef = useRef(null)
    const { t } = useTranslation()

    const languages = [
        { code: 'TH', label: 'ภาษาไทย', short: 'TH' },
        { code: 'EN', label: 'English', short: 'EN' },
    ]

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
        setMobileOpen(false)
    }

    const handleLogoutRequest = async () => {
        setMobileOpen(false)

        const result = await Swal.fire({
            title: 'ออกจากระบบ?',
            text: 'คุณต้องการออกจากระบบใช่หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ออกจากระบบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#b85c4a',
            cancelButtonColor: '#404e3b',
            background: '#1a2e1a',
            color: '#ffffff',
        })

        if (result.isConfirmed) {
            handleLogout()
        }
    }

    useEffect(() => {
        api.get('/asset/count').then(res => setAssetTypes(res.data.data || []))
        api.get('/project/types').then(res => setTypeProject(res.data.data || []))
    }, [])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (mobileRef.current && !mobileRef.current.contains(e.target)) {
                setMobileOpen(false)
            }
            if (langRef.current && !langRef.current.contains(e.target)) {
                setLangOpen(false)
            }
            // ปิด pinned dropdown เมื่อคลิกนอก navbar
            if (mobileRef.current && !mobileRef.current.contains(e.target)) {
                setPinnedDropdown('')
                setActiveDropdown('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // ปิดด้วย Escape
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') {
                setPinnedDropdown('')
                setActiveDropdown('')
                setLangOpen(false)
            }
        }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [])

    const handleSentTypeIdProject = (type_id) => {
        navigate(`/projects?typeId=${type_id}`)
        setMobileOpen(false)
    }

    const handleTogglePin = (name) => {
        setPinnedDropdown(p => p === name ? '' : name)
    }

    const isDropdownOpen = (name) => activeDropdown === name || pinnedDropdown === name

    return (
        <nav
            ref={mobileRef}
            className="w-full fixed top-0 left-0 z-50 transition-all duration-500"
            style={{
                background: scrolled
                    ? 'linear-gradient(135deg, rgba(30,42,28,0.98) 0%, rgba(50,66,44,0.98) 100%)'
                    : 'linear-gradient(135deg, rgba(30,42,28,0.95) 0%, rgba(50,66,44,0.93) 100%)',
                borderBottom: scrolled ? '1px solid rgba(197,168,105,0.3)' : '1px solid rgba(197,168,105,0.15)',
                boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.35), 0 1px 0 rgba(197,168,105,0.2)' : 'none',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
            }}
        >
            {/* Gold shimmer top line */}
            <div style={{
                height: '1.5px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(197,168,105,0.4) 20%, rgba(220,190,120,0.9) 50%, rgba(197,168,105,0.4) 80%, transparent 100%)',
            }} />

            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

                {/* Logo */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2.5 flex-shrink-0 group"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                    {/* <div style={{
                        width: 30, height: 30,
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, rgba(197,168,105,0.25), rgba(197,168,105,0.08))',
                        border: '1px solid rgba(197,168,105,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s',
                        boxShadow: '0 0 12px rgba(197,168,105,0.1)',
                    }}
                        className="group-hover:border-[rgba(197,168,105,0.7)] group-hover:shadow-[0_0_18px_rgba(197,168,105,0.25)]"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="rgba(197,168,105,0.9)" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                    </div> */}
                    <img className='w-10 h-10' src={imageLogo} alt="" />
                    <div className="flex flex-col leading-none">
                        <span style={{
                            fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em',
                            color: 'rgba(255,255,255,0.95)',
                            fontFamily: 'Georgia, serif',
                        }}>ISE</span>
                        <span style={{
                            fontSize: '0.55rem', letterSpacing: '0.2em',
                            color: 'rgba(197,168,105,0.8)', fontWeight: 500,
                        }}>THAILAND</span>
                    </div>
                </button>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">

                    <PremiumNavLink onClick={() => navigate('/')}>{t('nav_home')}</PremiumNavLink>

                    <PremiumDivider />

                    <PremiumDropdown
                        label={t('nav_royal')}
                        isOpen={isDropdownOpen('royal')}
                        isPinned={pinnedDropdown === 'royal'}
                        onOpen={() => setActiveDropdown('royal')}
                        onClose={() => setActiveDropdown('')}
                        onTogglePin={() => handleTogglePin('royal')}
                    >
                        <DropdownHeader label={t('nav_royal')} />
                        <DropdownItemPremium onClick={() => { navigate('/projects'); setPinnedDropdown(''); setActiveDropdown('') }} isFeature>
                            <span className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" /></svg>
                                {t('nav_royal_all')}
                            </span>
                        </DropdownItemPremium>
                        {typeProject.map(data => (
                            <DropdownItemPremium key={data.type_id} onClick={() => { handleSentTypeIdProject(data.type_id); setPinnedDropdown(''); setActiveDropdown('') }}>
                                {lang === 'TH' ? data.type_name : data.type_name_eng}
                            </DropdownItemPremium>
                        ))}
                    </PremiumDropdown>

                    <PremiumDivider />

                    <PremiumDropdown
                        label={t('nav_institute')}
                        isOpen={isDropdownOpen('institute')}
                        isPinned={pinnedDropdown === 'institute'}
                        onOpen={() => setActiveDropdown('institute')}
                        onClose={() => setActiveDropdown('')}
                        onTogglePin={() => handleTogglePin('institute')}
                    >
                        <DropdownHeader label={t('nav_institute')} />
                        <DropdownItemPremium onClick={() => { navigate('/research'); setPinnedDropdown(''); setActiveDropdown('') }} isFeature>
                            <span className="flex items-center gap-2">
                                <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                {t('nav_institute_research')}
                            </span>
                        </DropdownItemPremium>
                        {assetTypes.map(type => (
                            <DropdownItemPremium key={type.assettype_id} onClick={() => { navigate(`/ebook?typeId=${type.assettype_id}`); setPinnedDropdown(''); setActiveDropdown('') }}>
                                {lang === 'TH' ? type.assettype_name : type.assettype_name_eng}
                            </DropdownItemPremium>
                        ))}
                    </PremiumDropdown>

                    <PremiumDivider />

                    <PremiumNavLink onClick={() => navigate('/institute')}>{t('nav_about')}</PremiumNavLink>
                </div>

                {/* Right Section */}
                <div className="hidden lg:flex items-center gap-2 flex-shrink-0">

                    {/* Language Switcher */}
                    <div className="relative" ref={langRef}>
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200"
                            style={{
                                fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em',
                                color: 'rgba(197,168,105,0.9)',
                                border: '1px solid rgba(197,168,105,0.3)',
                                background: langOpen ? 'rgba(197,168,105,0.12)' : 'rgba(197,168,105,0.06)',
                                cursor: 'pointer',
                            }}
                        >
                            <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            {lang}
                            <svg className="w-2.5 h-2.5 transition-transform duration-200" style={{ transform: langOpen ? 'rotate(180deg)' : '' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {langOpen && (
                            <div className="absolute top-full right-0 mt-2 w-40 rounded-xl overflow-hidden z-50"
                                style={{
                                    background: 'linear-gradient(160deg, rgba(28,38,26,0.99), rgba(40,54,36,0.99))',
                                    border: '1px solid rgba(197,168,105,0.25)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(197,168,105,0.08)',
                                }}>
                                <div style={{ height: '1.5px', background: 'linear-gradient(90deg, transparent, rgba(197,168,105,0.7), transparent)' }} />
                                {languages.map(l => (
                                    <button key={l.code}
                                        onClick={() => { setLang(l.code); setLangOpen(false) }}
                                        className="w-full flex items-center justify-between px-4 py-3 transition-all duration-150"
                                        style={{
                                            background: lang === l.code ? 'rgba(197,168,105,0.1)' : 'transparent',
                                            border: 'none', cursor: 'pointer',
                                            fontSize: '0.75rem',
                                            color: lang === l.code ? 'rgba(220,190,120,1)' : 'rgba(255,255,255,0.65)',
                                            fontWeight: lang === l.code ? 600 : 400,
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        }}
                                    >
                                        <span>{l.label}</span>
                                        {lang === l.code && (
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }} />

                    {/* User / Login */}
                    {user ? (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{
                                    width: 24, height: 24, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, rgba(197,168,105,0.4), rgba(197,168,105,0.15))',
                                    border: '1px solid rgba(197,168,105,0.5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.65rem', fontWeight: 700, color: 'rgba(220,190,120,1)',
                                }}>
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user.name}
                                </span>
                            </div>
                            <GoldButton onClick={handleLogoutRequest} variant="ghost">{t('nav_logout')}</GoldButton>
                        </div>
                    ) : (
                        <GoldButton onClick={() => navigate('/login')}>{t('nav_login')}</GoldButton>
                    )}

                    {user?.role === 1 && (
                        <GoldButton onClick={() => navigate('/admin')} variant="solid">{t('nav_admin')}</GoldButton>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="lg:hidden relative w-9 h-9 flex flex-col justify-center items-center gap-1.5 rounded-lg transition-all duration-200 cursor-pointer"
                    style={{
                        background: mobileOpen ? 'rgba(197,168,105,0.15)' : 'rgba(255,255,255,0.06)',
                        border: mobileOpen ? '1px solid rgba(197,168,105,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <span className="block transition-all duration-300" style={{
                        width: 16, height: 1.5, borderRadius: 2,
                        background: mobileOpen ? 'rgba(197,168,105,0.9)' : 'rgba(255,255,255,0.85)',
                        transform: mobileOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none',
                    }} />
                    <span className="block transition-all duration-300" style={{
                        width: 16, height: 1.5, borderRadius: 2,
                        background: mobileOpen ? 'rgba(197,168,105,0.9)' : 'rgba(255,255,255,0.85)',
                        opacity: mobileOpen ? 0 : 1,
                    }} />
                    <span className="block transition-all duration-300" style={{
                        width: 16, height: 1.5, borderRadius: 2,
                        background: mobileOpen ? 'rgba(197,168,105,0.9)' : 'rgba(255,255,255,0.85)',
                        transform: mobileOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none',
                    }} />
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="lg:hidden overflow-y-auto max-h-[85vh]" style={{
                    background: 'linear-gradient(180deg, rgba(22,32,20,0.99) 0%, rgba(28,40,24,0.99) 100%)',
                    borderTop: '1px solid rgba(197,168,105,0.15)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                }}>
                    <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(197,168,105,0.5), transparent)' }} />

                    {/* User Block */}
                    {user && (
                        <div className="mx-4 mt-4 mb-2 p-4 rounded-2xl flex items-center gap-3" style={{
                            background: 'linear-gradient(135deg, rgba(197,168,105,0.1), rgba(197,168,105,0.04))',
                            border: '1px solid rgba(197,168,105,0.2)',
                        }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(197,168,105,0.35), rgba(197,168,105,0.1))',
                                border: '1.5px solid rgba(197,168,105,0.5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1rem', fontWeight: 700, color: 'rgba(220,190,120,1)',
                                flexShrink: 0,
                            }}>
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.92)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
                                <p style={{ fontSize: '0.7rem', color: 'rgba(197,168,105,0.7)', marginTop: 1 }}>
                                    {user.role === 1 ? t('nav_administrator') : t('nav_user')}
                                </p>
                            </div>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: '#4ade80',
                                boxShadow: '0 0 8px rgba(74,222,128,0.6)',
                                flexShrink: 0,
                            }} />
                        </div>
                    )}

                    <div className="py-2 px-2">
                        <MobileNavItem onClick={() => { navigate('/'); setMobileOpen(false) }} icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        }>หน้าหลัก</MobileNavItem>

                        <MobileDropdown
                            label="ศาสตร์ของพระราชา"
                            isOpen={mobileDropdown === 'royal'}
                            onToggle={() => setMobileDropdown(mobileDropdown === 'royal' ? '' : 'royal')}
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                        >
                            <MobileSubItem onClick={() => { navigate('/projects'); setMobileOpen(false) }} isFeature>ดูทั้งหมด</MobileSubItem>
                            {typeProject.map(data => (
                                <MobileSubItem key={data.type_id} onClick={() => handleSentTypeIdProject(data.type_id)}>
                                    {data.type_name}
                                </MobileSubItem>
                            ))}
                        </MobileDropdown>

                        <MobileDropdown
                            label="งานภายใต้สถาบัน"
                            isOpen={mobileDropdown === 'institute'}
                            onToggle={() => setMobileDropdown(mobileDropdown === 'institute' ? '' : 'institute')}
                            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                        >
                            <MobileSubItem onClick={() => { navigate('/research'); setMobileOpen(false) }} isFeature>โครงการ/งานวิจัย</MobileSubItem>
                            {assetTypes.map(type => (
                                <MobileSubItem key={type.assettype_id} onClick={() => { navigate(`/ebook?typeId=${type.assettype_id}`); setMobileOpen(false) }}>
                                    {type.assettype_name}
                                </MobileSubItem>
                            ))}
                        </MobileDropdown>

                        <MobileNavItem onClick={() => { navigate('/institute'); setMobileOpen(false) }} icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        }>สถาบันเศรษฐกิจพอเพียง</MobileNavItem>

                        {user?.role === 1 && (
                            <MobileNavItem onClick={() => { navigate('/admin'); setMobileOpen(false) }} icon={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            }>Admin Dashboard</MobileNavItem>
                        )}
                    </div>

                    {/* Bottom bar: Language + Login */}
                    <div className="mx-4 mb-4 mt-1 p-3 rounded-2xl flex items-center justify-between gap-3" style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                        <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(197,168,105,0.6)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                            {languages.map(l => (
                                <button key={l.code}
                                    onClick={() => { setLang(l.code) }}
                                    style={{
                                        padding: '4px 10px', borderRadius: 8, fontSize: '0.68rem', fontWeight: 600,
                                        cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.05em',
                                        background: lang === l.code ? 'rgba(197,168,105,0.2)' : 'transparent',
                                        border: lang === l.code ? '1px solid rgba(197,168,105,0.5)' : '1px solid rgba(255,255,255,0.1)',
                                        color: lang === l.code ? 'rgba(220,190,120,1)' : 'rgba(255,255,255,0.5)',
                                    }}>
                                    {l.short}
                                </button>
                            ))}
                        </div>

                        {user ? (
                            <button onClick={handleLogoutRequest} style={{
                                padding: '5px 14px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 600,
                                cursor: 'pointer', transition: 'all 0.2s',
                                background: 'rgba(239,68,68,0.12)',
                                border: '1px solid rgba(239,68,68,0.25)',
                                color: 'rgba(252,165,165,0.9)',
                            }}>
                                {t('nav_logout')}
                            </button>
                        ) : (
                            <button onClick={() => { navigate('/login'); setMobileOpen(false) }} style={{
                                padding: '5px 14px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 600,
                                cursor: 'pointer', transition: 'all 0.2s',
                                background: 'rgba(197,168,105,0.15)',
                                border: '1px solid rgba(197,168,105,0.35)',
                                color: 'rgba(220,190,120,0.95)',
                            }}>
                                {t('nav_login')}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

// ─── Sub-components ───────────────────────────────────────────────

function PremiumNavLink({ onClick, children }) {
    const [hovered, setHovered] = useState(false)
    return (
        <button onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: '6px 14px', borderRadius: 8,
                fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.08em',
                color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
                background: hovered ? 'rgba(255,255,255,0.07)' : 'transparent',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}>
            {children}
        </button>
    )
}

function PremiumDivider() {
    return <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
}

function DropdownHeader({ label }) {
    return (
        <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(100,120,90,0.7)' }}>{label}</p>
        </div>
    )
}

function PremiumDropdown({ label, children, isOpen, isPinned, onOpen, onClose, onTogglePin }) {
    const [hovered, setHovered] = useState(false)
    return (
        <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
            <button
                onClick={onTogglePin}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="flex items-center gap-1"
                style={{
                    padding: '6px 14px', borderRadius: 8,
                    fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.08em',
                    color: isOpen || hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
                    background: isPinned
                        ? 'rgba(197,168,105,0.12)'
                        : isOpen ? 'rgba(255,255,255,0.07)' : 'transparent',
                    border: isPinned ? '1px solid rgba(197,168,105,0.3)' : '1px solid transparent',
                    cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}>
                {label}
                {/* Pin indicator dot */}
                {isPinned && (
                    <span style={{
                        width: 4, height: 4, borderRadius: '50%',
                        background: 'rgba(197,168,105,0.9)',
                        display: 'inline-block', marginLeft: 2, flexShrink: 0,
                    }} />
                )}
                <svg className="w-3 h-3 transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(180deg)' : '' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: '50%',
                transform: isOpen ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(6px)',
                width: 240, borderRadius: 14, overflow: 'hidden', zIndex: 50,
                background: 'linear-gradient(160deg, #ffffff 0%, #f8faf7 100%)',
                border: isPinned ? '1px solid rgba(74,124,89,0.35)' : '1px solid rgba(180,200,170,0.4)',
                boxShadow: isPinned
                    ? '0 16px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08), 0 0 0 2px rgba(74,124,89,0.1)'
                    : '0 16px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)',
                opacity: isOpen ? 1 : 0,
                visibility: isOpen ? 'visible' : 'hidden',
                transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                pointerEvents: isOpen ? 'auto' : 'none',
            }}>
                {/* Top accent — gold when pinned */}
                <div style={{
                    height: 2,
                    background: isPinned
                        ? 'linear-gradient(90deg, rgba(197,168,105,0.8), rgba(220,190,120,1), rgba(197,168,105,0.8))'
                        : 'linear-gradient(90deg, #4a7c59, #2d5a3d)',
                }} />
                {children}
                <div style={{ height: 4, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.02))' }} />
            </div>
        </div>
    )
}

function DropdownItemPremium({ onClick, children, isFeature }) {
    const [hovered, setHovered] = useState(false)
    return (
        <button onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: isFeature ? '11px 16px' : '9px 16px',
                fontSize: '0.75rem',
                fontWeight: isFeature ? 600 : 400,
                color: hovered ? '#1a3a22' : isFeature ? '#2d5a3d' : '#4a6050',
                background: hovered ? 'rgba(74,124,89,0.08)' : 'transparent',
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                borderBottom: isFeature ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(0,0,0,0.03)',
            }}>
            {children}
        </button>
    )
}

function GoldButton({ onClick, children, variant = 'outline' }) {
    const [hovered, setHovered] = useState(false)
    const styles = {
        outline: {
            background: hovered ? 'rgba(197,168,105,0.15)' : 'transparent',
            border: '1px solid rgba(197,168,105,0.35)',
            color: 'rgba(220,190,120,0.9)',
        },
        ghost: {
            background: hovered ? 'rgba(239,68,68,0.1)' : 'transparent',
            border: '1px solid rgba(239,68,68,0.2)',
            color: hovered ? 'rgba(252,165,165,0.9)' : 'rgba(255,255,255,0.5)',
        },
        solid: {
            background: hovered ? 'rgba(197,168,105,0.25)' : 'rgba(197,168,105,0.15)',
            border: '1px solid rgba(197,168,105,0.5)',
            color: 'rgba(220,190,120,1)',
        },
    }
    return (
        <button onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: '5px 14px', borderRadius: 8,
                fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em',
                cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                ...styles[variant],
            }}>
            {children}
        </button>
    )
}

function MobileNavItem({ onClick, children, icon }) {
    const [hovered, setHovered] = useState(false)
    return (
        <button onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-0.5 transition-all duration-150 cursor-pointer"
            style={{
                background: hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: 'none',
                color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
                fontSize: '0.82rem', fontWeight: 500, textAlign: 'left',
            }}>
            {icon && <span style={{ color: 'rgba(197,168,105,0.7)', flexShrink: 0 }}>{icon}</span>}
            {children}
        </button>
    )
}

function MobileDropdown({ label, isOpen, onToggle, children, icon }) {
    return (
        <div className="mb-0.5">
            <button onClick={onToggle}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer"
                style={{
                    background: isOpen ? 'rgba(197,168,105,0.08)' : 'transparent',
                    border: isOpen ? '1px solid rgba(197,168,105,0.15)' : '1px solid transparent',
                    color: isOpen ? 'rgba(220,190,120,0.9)' : 'rgba(255,255,255,0.7)',
                    fontSize: '0.82rem', fontWeight: 500,
                }}>
                {icon && <span style={{ color: isOpen ? 'rgba(197,168,105,0.8)' : 'rgba(197,168,105,0.6)', flexShrink: 0 }}>{icon}</span>}
                <span className="flex-1 text-left">{label}</span>
                <svg className="w-4 h-4 transition-transform duration-200 flex-shrink-0"
                    style={{ transform: isOpen ? 'rotate(180deg)' : '' }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="ml-4 mt-1 rounded-xl overflow-hidden" style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderLeft: '2px solid rgba(197,168,105,0.3)',
                }}>
                    {children}
                </div>
            )}
        </div>
    )
}

function MobileSubItem({ onClick, children, isFeature }) {
    const [hovered, setHovered] = useState(false)
    return (
        <button onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="w-full text-left px-4 py-2.5 transition-all duration-150 cursor-pointer"
            style={{
                background: hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                color: isFeature ? 'rgba(197,168,105,0.85)' : 'rgba(255,255,255,0.55)',
                fontSize: '0.75rem',
                fontWeight: isFeature ? 600 : 400,
            }}>
            {children}
        </button>
    )
}

export default Navbar