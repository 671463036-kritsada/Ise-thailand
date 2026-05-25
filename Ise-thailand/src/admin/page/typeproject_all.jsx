import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, LayoutGrid } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";
import TypeProjectModal from "../model/TypeProjectModal";

const PER_PAGE = 10;
import { UPLOADS_URL } from '../../constants/uploads_url'

export default function TypeProjectAll() {
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(() => {
    setLoading(true)
    api.get("/type-project")
      .then(res => setCategories(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = categories.filter(c =>
    c.type_name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const currentItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const handleSave = async (formData) => {
    try {
      const typeId = formData.get('type_id')
      if (typeId) {
        await api.put(`/type-project/${typeId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        Swal.fire({ title: "แก้ไขสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-green)" })
      } else {
        await api.post("/type-project", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        Swal.fire({ title: "เพิ่มสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-green)" })
      }
      fetchData()
      setIsModalOpen(false)
    } catch (err) {
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.message, icon: "error" })
    }
  }

  const handleDelete = async (cat) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจใช่ไหม?",
      html: `ต้องการลบ <b>${cat.type_name}</b>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-error)",
      cancelButtonColor: "var(--color-muted-text)",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    })

    if (result.isConfirmed) {
      try {
        await api.delete(`/type-project/${cat.type_id}`)
        Swal.fire({ title: "ลบสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-green)" })
        fetchData()
      } catch (err) {
        Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.message, icon: "error" })
      }
    }
  }

  return (
    <div className="p-3 sm:p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">

      {/* ── PAGE HEADER & ADD BUTTON (Responsive Wrap) ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
            <LayoutGrid className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--color-green)]" />
            <span>จัดการประเภทโครงการ</span>
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-[var(--color-muted-text)] mt-0.5 font-medium">
            แสดงรายการประเภทโครงการในระบบ
          </p>
        </div>
        <button
          onClick={() => { setSelectedCategory(null); setIsModalOpen(true) }}
          className="w-full sm:w-auto px-4 py-2.5 bg-[var(--color-green)] text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มประเภทโครงการ</span>
        </button>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="bg-white p-3 sm:p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6">
        <input 
          type="text" 
          placeholder="ค้นหาชื่อประเภทโครงการ..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm sm:text-base focus:outline-none focus:border-[var(--color-border-focus)] transition-all bg-[var(--color-surface)]/20 placeholder:text-[var(--color-placeholder)]"
        />
      </div>

      {/* ── DATA TABLE CARD ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full custom-horizontal-scrollbar">
          <table className="w-full text-left border-collapse min-w-[45rem]">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-xs sm:text-sm lg:text-base">
                <th className="px-4 sm:px-5 py-3 font-bold w-20 text-center whitespace-nowrap">รหัส</th>
                <th className="px-4 sm:px-5 py-3 font-bold w-24 text-center whitespace-nowrap">รูปภาพ</th>
                <th className="px-4 sm:px-5 py-3 font-bold min-w-[12rem]">ชื่อประเภท (ไทย)</th>
                <th className="px-4 sm:px-5 py-3 font-bold min-w-[12rem]">ชื่อประเภท (อังกฤษ)</th>
                <th className="px-4 sm:px-5 py-3 font-bold w-24 text-center whitespace-nowrap">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-xs sm:text-sm lg:text-base">
              {loading ? (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-[var(--color-muted-text)] font-semibold">กำลังโหลดข้อมูล...</td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr key={row.type_id}
                    className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"}`}>
                    <td className="px-4 sm:px-5 py-3.5 font-bold text-[var(--color-green)] text-center font-mono whitespace-nowrap">{row.type_id}</td>
                    <td className="px-4 sm:px-5 py-3.5 text-center whitespace-nowrap">
                      {row.type_image ? (
                        <img
                          src={`${UPLOADS_URL}${row.type_image}`}
                          alt={row.type_name}
                          className="w-9 h-9 sm:w-10 sm:h-10 object-contain mx-auto rounded-lg shadow-3xs"
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <span className="text-[var(--color-disabled)] text-[10px] sm:text-xs">ไม่มีรูป</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 font-semibold text-[var(--color-deep-text)]">{row.type_name}</td>
                    <td className="px-4 sm:px-5 py-3.5 text-[var(--color-muted-text)] font-medium">{row.type_name_eng || '-'}</td>
                    <td className="px-4 sm:px-5 py-3.5 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1.5">
                        <button 
                          onClick={() => { setSelectedCategory(row); setIsModalOpen(true) }}
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all cursor-pointer active:scale-90"
                          title="แก้ไขข้อมูล"
                        >
                          <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all cursor-pointer active:scale-90"
                          title="ลบข้อมูล"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-[var(--color-disabled)] font-medium">ไม่พบข้อมูลประเภทโครงการ</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR (Responsive Layout) ── */}
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
                  className={`w-7 h-7 sm:w-8 sm:h-8 font-bold text-[11px] sm:text-xs rounded-lg shrink-0 transition-colors cursor-pointer ${
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

      <TypeProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editData={selectedCategory}
      />

      {/* แกน Scrollbar แนวนอนสำหรับตารางบนสมาร์ตโฟน */}
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