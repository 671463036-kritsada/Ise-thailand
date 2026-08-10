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
        <div className="min-h-screen py-10 px-4 max-w-5xl mx-auto pt-24" style={{ backgroundColor: 'var(--color-surface, #f9fafb)' }}>
            
            {/* หัวข้อหน้า */}
            <div className="mb-8">
                <h1 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--color-deep-text, #111827)' }}>
                    ชุดข้อมูลและทรัพยากร (Open Data)
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                    ดาวน์โหลดข้อมูลโครงการ สื่อสิ่งพิมพ์ และทรัพยากรในรูปแบบไฟล์ CSV, JSON หรือ PDF
                </p>
            </div>

            {/* แท็บเลือกหมวดหลัก */}
            <div className="flex gap-2 mb-4 border-b border-gray-200 pb-3">
                <button
                    onClick={() => setMainCategory('royal')}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        mainCategory === 'royal' 
                            ? 'bg-[#2d5a3d] text-white shadow-sm' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    ศาสตร์ของพระราชา
                </button>
                <button
                    onClick={() => setMainCategory('institute')}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        mainCategory === 'institute' 
                            ? 'bg-[#2d5a3d] text-white shadow-sm' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    งานภายใต้สถาบัน
                </button>
            </div>

            {/* ตัวกรองหมวดย่อย */}
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 mb-6 shadow-sm">
                <span className="text-xs sm:text-sm font-medium text-gray-600">ประเภท:</span>
                <select
                    value={selectedTypeId}
                    onChange={(e) => setSelectedTypeId(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm focus:outline-none">
                    {mainCategory === 'royal' && <option value="all">ทั้งหมด</option>}
                    {subTypes.map((type) => (
                        <option key={type.type_id || type.assettype_id} value={type.type_id || type.assettype_id}>
                            {lang === 'TH' ? (type.type_name || type.assettype_name) : (type.type_name_eng || type.assettype_name_eng)}
                        </option>
                    ))}
                </select>
            </div>

            {/* ── กล่องรวมทรัพยากรข้อมูล ── */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-gray-700 mb-4 border-b border-gray-100 pb-2">
                    ข้อมูลและทรัพยากร ({dataList.length})
                </h2>

                {loading ? (
                    <div className="text-center py-8 text-xs text-gray-400">กำลังโหลดข้อมูล...</div>
                ) : dataList.length === 0 ? (
                    <div className="text-center py-8 text-xs text-gray-400">ไม่พบชุดข้อมูล</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {dataList.map((item, idx) => {
                            const name = lang === 'TH' 
                                ? (item.royal_name || item.asset_name) 
                                : (item.royal_name_eng || item.asset_name_eng)
                            
                            const detail = lang === 'TH' 
                                ? (item.detail_1 || item.asset_name || 'สื่อสิ่งพิมพ์ / เอกสารสถาบัน') 
                                : (item.detail_1_eng || item.asset_name_eng || 'Institute Resources')
                            
                            const itemId = item.royal_id || item.asset_id || idx

                            return (
                                <div key={itemId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    
                                    {/* ฝั่งซ้าย: ไอคอน + ชื่อ + รายละเอียด */}
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex flex-col items-center justify-center font-bold text-[9px] flex-shrink-0 shadow-sm mt-0.5">
                                            <svg className="w-4 h-4 mb-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span>DATA</span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-gray-800 text-sm leading-snug truncate">
                                                {name || 'ไม่มีชื่อรายการ'}
                                            </h3>
                                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                                {detail}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ฝั่งขวา: ปุ่มดูตัวอย่าง & ปุ่มดาวน์โหลด */}
                                    <div className="flex items-center gap-2 justify-end flex-shrink-0">
                                        
                                        {/* ปุ่มดูตัวอย่าง */}
                                        <button
                                            onClick={() => setPreviewItem(item)}
                                            className="px-3 py-1.5 text-xs border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all flex items-center gap-1 cursor-pointer">
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            ดูตัวอย่าง
                                        </button>

                                        {/* ปุ่มดาวน์โหลด (Dropdown) */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setDownloadDropdownOpen(downloadDropdownOpen === itemId ? null : itemId)}
                                                className="px-3 py-1.5 text-xs bg-[#1f2937] hover:bg-black text-white font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                ดาวน์โหลด
                                                <span className="text-[9px]">▼</span>
                                            </button>

                                            {/* เมนูย่อยเลือกไฟล์ที่จะโหลด */}
                                            {downloadDropdownOpen === itemId && (
                                                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg border border-gray-200 shadow-lg z-20 py-1 text-xs">
                                                    <button
                                                        onClick={() => downloadCSV(item)}
                                                        className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-emerald-800 font-medium flex items-center gap-1.5 cursor-pointer">
                                                        📄 CSV / Excel
                                                    </button>
                                                    <button
                                                        onClick={() => downloadJSON(item)}
                                                        className="w-full text-left px-3 py-1.5 hover:bg-amber-50 text-amber-800 font-medium flex items-center gap-1.5 cursor-pointer">
                                                        📜 JSON
                                                    </button>
                                                    <button
                                                        onClick={() => downloadPDF(item)}
                                                        className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-800 font-medium flex items-center gap-1.5 cursor-pointer">
                                                        📕 PDF
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
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-xl w-full p-5 max-h-[80vh] overflow-y-auto relative shadow-xl">
                        <button
                            onClick={() => setPreviewItem(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold cursor-pointer">
                            ✕
                        </button>
                        
                        <h2 className="text-sm font-bold mb-3 text-[#2d5a3d]">
                            🔍 ตัวอย่างข้อมูล: {lang === 'TH' ? (previewItem.royal_name || previewItem.asset_name) : (previewItem.royal_name_eng || previewItem.asset_name_eng)}
                        </h2>

                        <div className="bg-gray-50 p-3 rounded-xl text-xs font-mono text-gray-700 border border-gray-200 overflow-x-auto">
                            <pre>{JSON.stringify(previewItem, null, 2)}</pre>
                        </div>

                        <div className="mt-4 flex justify-end print-hide">
                            <button
                                onClick={() => setPreviewItem(null)}
                                className="px-4 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer">
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}