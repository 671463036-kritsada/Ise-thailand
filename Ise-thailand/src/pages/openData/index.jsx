import React, { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useLang } from '../../context/LanguageContext'
import { useTranslation } from 'react-i18next'
import { UPLOADS_URL } from '../../constants/uploads_url'
import * as XLSX from 'xlsx'

export default function OpenDataPage() {
    const { lang } = useLang()
    const { t } = useTranslation()

    const [mainCategory, setMainCategory] = useState('royal') // 'royal' | 'institute'
    const [subTypes, setSubTypes] = useState([])
    const [selectedTypeId, setSelectedTypeId] = useState('all')
    const [dataList, setDataList] = useState([])
    const [loading, setLoading] = useState(false)
    const [previewItem, setPreviewItem] = useState(null)
    const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(null)

    // 1. ดึงประเภทหมวดย่อยตามหมวดหลัก
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                if (mainCategory === 'royal') {
                    const res = await api.get('/project/types')
                    const types = res.data?.data || []
                    setSubTypes(types)
                    setSelectedTypeId('all')
                } else {
                    // ฝั่งงานภายใต้สถาบัน ดึงหมวดจาก /asset/count
                    const res = await api.get('/asset/count')
                    const types = res.data?.data || []
                    setSubTypes(types)
                    // ถ้ามีประเภท ให้เลือกประเภทแรกไว้เป็นค่าเริ่มต้น (เช่น '01')
                    if (types.length > 0) {
                        setSelectedTypeId(types[0].assettype_id)
                    } else {
                        setSelectedTypeId('all')
                    }
                }
            } catch (err) {
                console.error("Error fetching categories:", err)
                setSubTypes([])
            }
        }
        fetchCategories()
    }, [mainCategory])

    // 2. ดึงข้อมูลโครงการ / สื่อเอกสาร
    useEffect(() => {
        const fetchDataset = async () => {
            setLoading(true)
            try {
                if (mainCategory === 'royal') {
                    // โครงการศาสตร์พระราชา
                    const res = await api.get('/royal/')
                    let items = res.data?.data || []
                    if (selectedTypeId !== 'all') {
                        items = items.filter(item => item.type_id === selectedTypeId)
                    }
                    setDataList(Array.isArray(items) ? items : [])
                } else {
                    // งานภายใต้สถาบัน: ดึงข้อมูลจาก /asset/${selectedTypeId}
                    if (selectedTypeId && selectedTypeId !== 'all') {
                        const res = await api.get(`/asset/${selectedTypeId}`)
                        setDataList(res.data?.data || [])
                    } else if (subTypes.length > 0) {
                        // กรณี selectedTypeId ยังไม่ถูกตั้งค่า ให้ดึงตัวแรกก่อน
                        const res = await api.get(`/asset/${subTypes[0].assettype_id}`)
                        setDataList(res.data?.data || [])
                    } else {
                        setDataList([])
                    }
                }
            } catch (err) {
                console.error("Error fetching dataset:", err)
                setDataList([])
            } finally {
                setLoading(false)
            }
        }
        fetchDataset()
    }, [mainCategory, selectedTypeId, subTypes])

    // ─── ฟังก์ชันดาวน์โหลดไฟล์ ─────────────────────────────
    const downloadCSV = (item) => {
        try {
            const isRoyal = mainCategory === 'royal'
            let exportData = []

            if (isRoyal) {
                //  ข้อมูลฝั่งศาสตร์ของพระราชา (ดึงครบทุกมิติ)
                exportData = [{
                    'รหัสโครงการ (ID)': item.royal_id || '-',
                    'ชื่อโครงการ (TH)': item.royal_name || '-',
                    'ชื่อโครงการ (EN)': item.royal_name_eng || '-',
                    'รหัสประเภทโครงการ': item.type_id || '-',
                    'รหัสภูมิภาค': item.geography_id || '-',
                    'หัวข้อ/รายละเอียด 1': item.detail_1 || item.title_1 || '-',
                    'รายละเอียด 1 (EN)': item.detail_1_eng || item.title_1_eng || '-',
                    'หัวข้อ/รายละเอียด 2': item.detail_2 || item.title_2 || '-',
                    'รายละเอียด 2 (EN)': item.detail_2_eng || item.title_2_eng || '-',
                    'หัวข้อ/รายละเอียด 3': item.detail_3 || item.title_3 || '-',
                    'รายละเอียด 3 (EN)': item.detail_3_eng || item.title_3_eng || '-',
                    'แหล่งข้อมูลอ้างอิง (TH)': item.reference || '-',
                    'แหล่งข้อมูลอ้างอิง (EN)': item.reference_eng || '-',
                    'ชื่อไฟล์แบนเนอร์': item.img_banner || '-',
                    'วันที่บันทึกข้อมูล': item.created_at ? new Date(item.created_at).toLocaleString('th-TH') : '-',
                    'วันที่อัปเดตล่าสุด': item.updated_at ? new Date(item.updated_at).toLocaleString('th-TH') : '-'
                }]
            } else {
                //  ข้อมูลฝั่งงานภายใต้สถาบัน (สื่อสิ่งพิมพ์ / Ebook / ผลงานวิชาการ)
                exportData = [{
                    'รหัสสื่อ/เอกสาร (ID)': item.asset_id || '-',
                    'ชื่อรายการ (TH)': item.asset_name || '-',
                    'ชื่อรายการ (EN)': item.asset_name_eng || '-',
                    'รหัสประเภทสื่อ': item.assettype_id || '-',
                    'ลิงก์ไฟล์ PDF': item.pdf_file ? `${UPLOADS_URL}${item.pdf_file}` : 'ไม่มีไฟล์',
                    'ลิงก์อ่านออนไลน์ (URL Ebook)': item.url_ebook || '-',
                    'ชื่อไฟล์รูปปก': item.img_file || '-',
                    'วันที่บันทึกข้อมูล': item.created_at ? new Date(item.created_at).toLocaleString('th-TH') : '-'
                }]
            }

            // สร้าง Sheet และ Export
            const worksheet = XLSX.utils.json_to_sheet(exportData)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "OpenData")
            
            // กำหนดชื่อไฟล์ตามประเภทข้อมูล
            const filename = isRoyal 
                ? `open-data-royal-project-${item.royal_id || 'export'}.csv`
                : `open-data-[#ISE]-asset-${item.asset_id || 'export'}.csv`

            XLSX.writeFile(workbook, filename)
        } catch (e) {
            console.error("Export CSV Error:", e)
        }
        setDownloadDropdownOpen(null)
    }

    const downloadJSON = (item) => {
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(item, null, 2))
            const anchor = document.createElement('a')
            anchor.setAttribute("href", dataStr)
            anchor.setAttribute("download", `open-data-${item.royal_id || item.asset_id || 'export'}.json`)
            document.body.appendChild(anchor)
            anchor.click()
            anchor.remove()
        } catch (e) {
            console.error("Export JSON Error:", e)
        }
        setDownloadDropdownOpen(null)
    }

    // ─── ฟังก์ชันดาวน์โหลด PDF ที่แก้ไขแล้ว ─────────────────────────────
    const downloadPDF = (item) => {
        setDownloadDropdownOpen(null)

        // กรณีที่ 1: ถ้าเป็นสื่อฝั่งสถาบันที่มีไฟล์ pdf_file ในเซิร์ฟเวอร์
        if (item.pdf_file) {
            window.open(`${UPLOADS_URL}${item.pdf_file}`, '_blank')
            return
        }

        // กรณีที่ 2: ถ้าเป็นโครงการที่มี royal_id ให้ลิงก์ไปยังหน้ารายละเอียดโครงการ
        if (item.royal_id) {
            // เปิดหน้า ProjectDetail ของโครงการนั้นในแท็บใหม่ เพื่อกด Export PDF ได้สมบูรณ์
            window.open(`/projects/${item.royal_id}`, '_blank')
            return
        }

        // กรณีที่ 3: ถ้าไม่มีไฟล์และไม่มีหน้ารายละเอียด ให้สร้างไฟล์ข้อความสรุปรายละเอียดโครงการให้ดาวน์โหลด
        const content = `=== ชุดข้อมูลโครงการ (Open Data) ===\n\n` +
            `ชื่อโครงการ (TH): ${item.royal_name || item.asset_name || '-'}\n` +
            `ชื่อโครงการ (EN): ${item.royal_name_eng || item.asset_name_eng || '-'}\n\n` +
            `รายละเอียด:\n${item.detail_1 || item.description || '-'}\n\n` +
            `อ้างอิง:\n${item.reference || '-'}\n\n` +
            `ส่งออกจากระบบเมื่อ: ${new Date().toLocaleString('th-TH')}`

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `open-data-${item.royal_id || item.asset_id || 'detail'}.txt`
        link.click()
    }

    return (
        <div className="min-h-screen py-10 px-4 max-w-5xl mx-auto pt-24" style={{ backgroundColor: 'var(--color-surface)' }}>
            
            {/* หัวข้อหน้า */}
            <div className="mb-8">
                <h1 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--color-deep-text)' }}>
                    {t('opendata_title')}
                </h1>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--color-muted-text)' }}>
                    {t('opendata_subtitle')}
                </p>
            </div>

            {/* แท็บเลือกหมวดหลัก */}
            <div className="flex gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button
                    onClick={() => setMainCategory('royal')}
                    className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                    style={mainCategory === 'royal'
                        ? { background: 'var(--color-forest-green)', color: 'var(--color-white)', boxShadow: '0 1px 2px var(--color-shadow)' }
                        : { background: 'var(--color-white)', border: '1px solid var(--color-border)', color: 'var(--color-muted-text)' }
                    }>
                    {t('opendata_tab_royal')}
                </button>
                <button
                    onClick={() => setMainCategory('institute')}
                    className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                    style={mainCategory === 'institute'
                        ? { background: 'var(--color-forest-green)', color: 'var(--color-white)', boxShadow: '0 1px 2px var(--color-shadow)' }
                        : { background: 'var(--color-white)', border: '1px solid var(--color-border)', color: 'var(--color-muted-text)' }
                    }>
                    {t('opendata_tab_institute')}
                </button>
            </div>

            {/* ตัวกรองหมวดย่อย */}
            <div className="flex items-center justify-between p-3 rounded-xl mb-6" style={{
                background: 'var(--color-white)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 1px 2px var(--color-shadow)',
            }}>
                <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--color-muted-text)' }}>{t('opendata_type_label')}</span>
                <select
                    value={selectedTypeId}
                    onChange={(e) => setSelectedTypeId(e.target.value)}
                    className="rounded-lg px-3 py-1.5 text-xs sm:text-sm focus:outline-none"
                    style={{ border: '1px solid var(--color-border)', color: 'var(--color-deep-text)', background: 'var(--color-white)' }}>
                    {mainCategory === 'royal' && <option value="all">{t('all')}</option>}
                    {subTypes.map((type) => (
                        <option key={type.type_id || type.assettype_id} value={type.type_id || type.assettype_id}>
                            {lang === 'TH' ? (type.type_name || type.assettype_name) : (type.type_name_eng || type.assettype_name_eng)}
                        </option>
                    ))}
                </select>
            </div>

            {/* ── กล่องรวมทรัพยากรข้อมูล ── */}
            <div className="rounded-2xl p-6" style={{
                background: 'var(--color-white)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 1px 2px var(--color-shadow)',
            }}>
                <h2 className="text-sm font-bold mb-4 pb-2" style={{ color: 'var(--color-deep-text)', borderBottom: '1px solid var(--color-surface-3)' }}>
                    {t('opendata_resource_count', { count: dataList.length })}
                </h2>

                {loading ? (
                    <div className="text-center py-8 text-xs" style={{ color: 'var(--color-placeholder)' }}>{t('opendata_loading')}</div>
                ) : dataList.length === 0 ? (
                    <div className="text-center py-8 text-xs" style={{ color: 'var(--color-placeholder)' }}>{t('opendata_no_data')}</div>
                ) : (
                    <div className="divide-y" style={{ borderColor: 'var(--color-surface-3)' }}>
                        {dataList.map((item, idx) => {
                            const name = lang === 'TH' 
                                ? (item.royal_name || item.asset_name) 
                                : (item.royal_name_eng || item.asset_name_eng)
                            
                            const detail = lang === 'TH' 
                                ? (item.detail_1 || item.asset_name || t('opendata_default_detail')) 
                                : (item.detail_1_eng || item.asset_name_eng || t('opendata_default_detail'))
                            
                            const itemId = item.royal_id || item.asset_id || idx

                            return (
                                <div key={itemId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: 'var(--color-surface-3)' }}>
                                    
                                    {/* ฝั่งซ้าย: ไอคอน + ชื่อ + รายละเอียด */}
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="w-9 h-9 rounded-lg flex flex-col items-center justify-center font-bold text-[9px] flex-shrink-0 mt-0.5" style={{
                                            background: 'var(--color-forest-green)',
                                            color: 'var(--color-white)',
                                            boxShadow: '0 1px 2px var(--color-shadow)',
                                        }}>
                                            <svg className="w-4 h-4 mb-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span>DATA</span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-sm leading-snug truncate" style={{ color: 'var(--color-deep-text)' }}>
                                                {name || t('opendata_no_name')}
                                            </h3>
                                            <p className="text-xs line-clamp-1 mt-0.5" style={{ color: 'var(--color-muted-text)' }}>
                                                {detail}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ฝั่งขวา: ปุ่มดูตัวอย่าง & ปุ่มดาวน์โหลด */}
                                    <div className="flex items-center gap-2 justify-end flex-shrink-0">
                                        
                                        {/* ปุ่มดูตัวอย่าง */}
                                        <button
                                            onClick={() => setPreviewItem(item)}
                                            className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                            style={{ border: '1px solid var(--color-border)', color: 'var(--color-deep-text)', background: 'var(--color-white)' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-white)'}>
                                            <svg className="w-3.5 h-3.5" style={{ color: 'var(--color-muted-text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            {t('opendata_preview')}
                                        </button>

                                        {/* ปุ่มดาวน์โหลด (Dropdown) */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setDownloadDropdownOpen(downloadDropdownOpen === itemId ? null : itemId)}
                                                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                                                style={{ background: 'var(--color-forest-green)', color: 'var(--color-white)', boxShadow: '0 1px 2px var(--color-shadow)' }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-deep-text)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-forest-green)'}>
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                {t('download')}
                                                <span className="text-[9px]">▼</span>
                                            </button>

                                            {/* เมนูย่อยเลือกไฟล์ที่จะโหลด */}
                                            {downloadDropdownOpen === itemId && (
                                                <div className="absolute right-0 top-full mt-1 w-32 rounded-lg z-20 py-1 text-xs" style={{
                                                    background: 'var(--color-white)',
                                                    border: '1px solid var(--color-border)',
                                                    boxShadow: '0 8px 24px var(--color-shadow-lg)',
                                                }}>
                                                    <button
                                                        onClick={() => downloadCSV(item)}
                                                        className="w-full text-left px-3 py-1.5 font-medium flex items-center gap-1.5 cursor-pointer transition-all"
                                                        style={{ color: 'var(--color-forest-green)' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-2)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                        📄 {t('opendata_download_csv')}
                                                    </button>
                                                    <button
                                                        onClick={() => downloadJSON(item)}
                                                        className="w-full text-left px-3 py-1.5 font-medium flex items-center gap-1.5 cursor-pointer transition-all"
                                                        style={{ color: 'var(--color-gold-hover)' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-gold-subtle)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                        📜 {t('opendata_download_json')}
                                                    </button>
                                                    <button
                                                        onClick={() => downloadPDF(item)}
                                                        className="w-full text-left px-3 py-1.5 font-medium flex items-center gap-1.5 cursor-pointer transition-all"
                                                        style={{ color: 'var(--color-error)' }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-2)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                                        📕 {t('opendata_download_pdf')}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Modal ดูตัวอย่าง */}
            {previewItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(61, 66, 48, 0.5)' }}>
                    <div className="rounded-2xl max-w-xl w-full p-5 max-h-[80vh] overflow-y-auto relative" style={{
                        background: 'var(--color-white)',
                        boxShadow: '0 20px 48px var(--color-shadow-lg)',
                    }}>
                        <button
                            onClick={() => setPreviewItem(null)}
                            className="absolute top-4 right-4 font-bold cursor-pointer transition-all"
                            style={{ color: 'var(--color-placeholder)' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-deep-text)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-placeholder)'}>
                            ✕
                        </button>
                        
                        <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--color-forest-green)' }}>
                            🔍 {t('opendata_preview_title')}: {lang === 'TH' ? (previewItem.royal_name || previewItem.asset_name) : (previewItem.royal_name_eng || previewItem.asset_name_eng)}
                        </h2>

                        <div className="p-3 rounded-xl text-xs font-mono overflow-x-auto" style={{
                            background: 'var(--color-surface)',
                            color: 'var(--color-deep-text)',
                            border: '1px solid var(--color-border)',
                        }}>
                            <pre>{JSON.stringify(previewItem, null, 2)}</pre>
                        </div>

                        <div className="mt-4 flex justify-end print-hide">
                            <button
                                onClick={() => setPreviewItem(null)}
                                className="px-4 py-1.5 text-xs rounded-lg cursor-pointer transition-all"
                                style={{ border: '1px solid var(--color-border)', color: 'var(--color-deep-text)' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                {t('opendata_close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}