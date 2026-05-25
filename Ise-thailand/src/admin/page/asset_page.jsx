import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Trash2, Plus, BookOpen } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";
import AssetModal from "../model/AssetModal";

const PER_PAGE = 10;

export default function AssetPage() {
    const { typeId } = useParams()
    const [assets, setAssets] = useState([])
    const [typeName, setTypeName] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState(null)

    const fetchAssets = useCallback(() => {
        setLoading(true)
        api.get(`/asset/${typeId}`)
            .then(res => {
                const data = res.data.data || []
                setAssets(data)
                if (data.length > 0) setTypeName(data[0].assettype_name)
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [typeId])

    useEffect(() => {
        fetchAssets()
        setCurrentPage(1)
    }, [typeId, fetchAssets])

    const filtered = assets.filter(a =>
        (a.asset_name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.asset_id ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filtered.length / PER_PAGE)
    const currentItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

    const handleCreateSuccess = () => {
        Swal.fire({ title: "เพิ่มสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-green)" })
        fetchAssets()
    }

    const handleUpdateSuccess = () => {
        Swal.fire({ title: "แก้ไขสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-green)" })
        fetchAssets()
    }

    const handleError = (message) => {
        Swal.fire({ title: "เกิดข้อผิดพลาด", text: message, icon: "error", confirmButtonColor: "var(--color-error)" })
    }

    const handleDelete = (asset) => {
        Swal.fire({
            title: 'ยืนยันการลบ?',
            html: `ต้องการลบ <b>${asset.asset_name}</b>?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--color-error)',
            cancelButtonColor: 'var(--color-muted-text)',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/asset/${asset.asset_id}`)
                    Swal.fire({ title: 'ลบสำเร็จ!', icon: 'success', confirmButtonColor: 'var(--color-green)' })
                    fetchAssets()
                } catch (err) {
                    Swal.fire({ title: 'เกิดข้อผิดพลาด', text: err.message, icon: 'error' })
                }
            }
        })
    }

    return (
        <div className="p-3 sm:p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">

            {/* ── PAGE HEADER & ADD BUTTON (Responsive Wrap) ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
                        <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[var(--color-green)] shrink-0" />
                        <span>{typeName || 'กำลังโหลด...'}</span>
                    </h1>
                    <p className="text-xs sm:text-sm lg:text-base text-[var(--color-muted-text)] mt-0.5 font-medium">
                        จัดการข้อมูล {typeName || 'สินทรัพย์'} ทั้งหมดในระบบ
                    </p>
                </div>
                <button
                    onClick={() => { setEditData(null); setModalOpen(true); }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[var(--color-green)] text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                >
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                    <span>เพิ่ม{typeName || 'สินทรัพย์'}</span>
                </button>
            </div>

            {/* ── SEARCH BAR ── */}
            <div className="bg-white p-3 sm:p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6">
                <input
                    type="text"
                    placeholder="ค้นหาด้วยชื่อหรือรหัส..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm sm:text-base focus:outline-none focus:border-[var(--color-border-focus)] transition-all bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
                />
            </div>

            {/* ── DATA TABLE CARD ── */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
                <div className="overflow-x-auto w-full custom-horizontal-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[55rem]">
                        <thead>
                            <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-xs sm:text-sm lg:text-base">
                                <th className="px-4 sm:px-5 py-3 font-bold w-28 text-center whitespace-nowrap">รหัส</th>
                                <th className="px-4 sm:px-5 py-3 font-bold min-w-[16rem]">ชื่อ</th>
                                <th className="px-4 sm:px-5 py-3 font-bold w-44 whitespace-nowrap">นักวิจัย</th>
                                <th className="px-4 sm:px-5 py-3 font-bold w-28 text-center whitespace-nowrap">ไฟล์ PDF</th>
                                <th className="px-4 sm:px-5 py-3 font-bold w-28 text-center whitespace-nowrap">ลิงก์</th>
                                <th className="px-4 sm:px-5 py-3 font-bold w-24 text-center whitespace-nowrap">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-surface-3)] text-xs sm:text-sm lg:text-base">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-10 text-center text-[var(--color-muted-text)] font-semibold">กำลังโหลดข้อมูล...</td>
                                </tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((row, idx) => (
                                    <tr
                                        key={row.asset_id}
                                        className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"}`}
                                    >
                                        <td className="px-4 sm:px-5 py-3.5 font-bold text-[var(--color-green)] text-center font-mono whitespace-nowrap">
                                            {row.asset_id}
                                        </td>
                                        <td className="px-4 sm:px-5 py-3.5 font-semibold text-[var(--color-deep-text)]">
                                            <div className="line-clamp-2 leading-relaxed">{row.asset_name}</div>
                                            {row.asset_name_eng && (
                                                <div className="text-[10px] sm:text-xs text-[var(--color-muted-text)] font-medium line-clamp-1 mt-0.5">{row.asset_name_eng}</div>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-5 py-3.5 text-[var(--color-muted-text)] font-semibold">
                                            {row.researcher_fullname || '-'}
                                        </td>
                                        <td className="px-4 sm:px-5 py-3.5 text-center whitespace-nowrap">
                                            {row.pdf_file ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                                                    PDF
                                                </span>
                                            ) : (
                                                <span className="text-[var(--color-disabled)] font-bold text-xs sm:text-sm">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-5 py-3.5 text-center whitespace-nowrap">
                                            {row.url_ebook ? (
                                                <a href={row.url_ebook} target="_blank" rel="noreferrer"
                                                    className="text-xs font-bold text-[var(--color-green)] hover:text-[var(--color-forest-green)] hover:underline transition-colors">
                                                    เปิดลิงก์
                                                </a>
                                            ) : (
                                                <span className="text-[var(--color-disabled)] font-bold text-xs sm:text-sm">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 sm:px-5 py-3.5 text-center whitespace-nowrap">
                                            <div className="flex justify-center gap-1.5">
                                                <button
                                                    onClick={() => { setEditData(row); setModalOpen(true); }}
                                                    className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all cursor-pointer active:scale-90"
                                                    title="แก้ไข"
                                                >
                                                    <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(row)}
                                                    className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all cursor-pointer active:scale-90"
                                                    title="ลบ"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-5 py-10 text-center font-medium text-[var(--color-disabled)]">
                                         ไม่พบข้อมูลในหมวดหมู่นี้
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── PAGINATION BAR (Responsive Block) ── */}
                <div className="px-4 sm:px-5 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-[11px] sm:text-xs">
                    <p className="font-medium text-[var(--color-muted-text)] text-center sm:text-left">
                        ทั้งหมด {filtered.length} รายการ
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-1.5 w-full sm:w-auto">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-2.5 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-3xs"
                        >
                            ย้อนกลับ
                        </button>
                        
                        <div className="flex items-center gap-1 max-w-[12rem] sm:max-w-none overflow-x-auto custom-horizontal-scrollbar py-0.5">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button 
                                    key={p} 
                                    onClick={() => setCurrentPage(p)}
                                    className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 font-bold text-[11px] sm:text-xs rounded-lg transition-colors cursor-pointer ${
                                        currentPage === p 
                                            ? "bg-[var(--color-green)] text-white shadow-3xs" 
                                            : "border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)]"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-2.5 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-3xs"
                        >
                            ถัดไป
                        </button>
                    </div>
                </div>
            </div>

            <AssetModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreateSuccess={handleCreateSuccess}
                onUpdateSuccess={handleUpdateSuccess}
                onError={handleError}
                editData={editData}
                typeId={typeId}
            />

            {/* แถบแต่งความหนาของ Scrollbar ตารางแนวนอนบนโมบายล์ */}
            <style jsx global>{`
                .custom-horizontal-scrollbar::-webkit-scrollbar {
                    height: 4px;
                }
                .custom-horizontal-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-horizontal-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--color-surface-3);
                    border-radius: 999px;
                }
                .custom-horizontal-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--color-disabled);
                }
            `}</style>
        </div>
    )
}