import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Trash2, Plus, BookOpen } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";

const PER_PAGE = 10;

export default function AssetPage() {
  const { typeId } = useParams()
  const [assets, setAssets] = useState([])
  const [typeName, setTypeName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchAssets = () => {
    setLoading(true)
    api.get(`/asset/${typeId}`)
      .then(res => {
        const data = res.data.data || []
        setAssets(data)
        if (data.length > 0) setTypeName(data[0].assettype_name)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAssets()
    setCurrentPage(1)
  }, [typeId])

  const filtered = assets.filter(a =>
    (a.asset_name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.asset_id ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const currentItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const handleDelete = (asset) => {
    Swal.fire({
      title: 'ยืนยันการลบ?',
      text: asset.asset_name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--color-error)',
      cancelButtonColor: 'var(--color-green)',
      confirmButtonText: 'ลบ',
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
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">

      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-[var(--color-green)]" />
            <span>{typeName || 'กำลังโหลด...'}</span>
          </h1>
          <p className="text-base text-[var(--color-muted-text)] mt-0.5 font-medium">
            จัดการข้อมูล {typeName} ทั้งหมด
          </p>
        </div>
        <button
          className="px-5 py-2.5 bg-[var(--color-green)] text-white text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่ม{typeName}</span>
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6">
        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อหรือรหัส..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-base">
                <th className="px-5 py-3.5 font-bold w-36 text-center">รหัส</th>
                <th className="px-5 py-3.5 font-bold">ชื่อ</th>
                <th className="px-5 py-3.5 font-bold w-48">นักวิจัย</th>
                <th className="px-5 py-3.5 font-bold w-36 text-center">ไฟล์ PDF</th>
                <th className="px-5 py-3.5 font-bold w-36 text-center">ลิงก์</th>
                <th className="px-5 py-3.5 font-bold w-28 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-base">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-[var(--color-muted-text)]">กำลังโหลด...</td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr
                    key={row.asset_id}
                    className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"}`}
                  >
                    <td className="px-5 py-3.5 font-bold text-[var(--color-green)] text-center font-mono">
                      {row.asset_id}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-[var(--color-deep-text)] min-w-[280px]">
                      <div className="line-clamp-2">{row.asset_name}</div>
                      {row.asset_name_eng && (
                        <div className="text-xs text-[var(--color-muted-text)] line-clamp-1 mt-0.5">{row.asset_name_eng}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[var(--color-muted-text)]">
                      {row.researcher_fullname || '-'}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {row.pdf_file ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                          PDF
                        </span>
                      ) : (
                        <span className="text-[var(--color-disabled)] text-sm">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {row.url_ebook ? (
                        
                         <a href={row.url_ebook}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-[var(--color-green)] hover:underline"
                        >
                          เปิดลิงก์
                        </a>
                      ) : (
                        <span className="text-[var(--color-disabled)] text-sm">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1.5">
                        <button
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all duration-150 cursor-pointer"
                          title="แก้ไข"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all duration-150 cursor-pointer"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center font-medium text-[var(--color-disabled)]">
                    ❌ ไม่พบข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-5 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-xs">
          <p className="font-medium text-[var(--color-muted-text)]">
            แสดง {currentItems.length} จาก {filtered.length} รายการ
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
            >
              ย้อนกลับ
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 font-bold rounded-lg transition-colors cursor-pointer ${currentPage === p ? "bg-[var(--color-green)] text-white shadow-sm" : "border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)]"}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-[var(--color-disabled)] mt-6 font-medium">
        Copyright © 2026 สถาบันเศรษฐกิจพอเพียง
      </p>
    </div>
  )
}