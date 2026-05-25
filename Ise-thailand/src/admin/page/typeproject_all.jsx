import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
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

  const fetchData = () => {
    setLoading(true)
    api.get("/type-project")
      .then(res => setCategories(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

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
        Swal.fire({ title: "แก้ไขสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-blue)" })
      } else {
        await api.post("/type-project", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        Swal.fire({ title: "เพิ่มสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-blue)" })
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
        Swal.fire({ title: "ลบสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-blue)" })
        fetchData()
      } catch (err) {
        Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.message, icon: "error" })
      }
    }
  }

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">

      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-forest-blue)] tracking-tight">จัดการประเภทโครงการ</h1>
          <p className="text-base text-[var(--color-muted-text)] mt-0.5 font-medium">แสดงรายการประเภทโครงการในระบบ</p>
        </div>
        <button
          onClick={() => { setSelectedCategory(null); setIsModalOpen(true) }}
          className="px-4 py-2.5 bg-[var(--color-blue)] text-white text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-blue)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มประเภทโครงการ</span>
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6">
        <input type="text" placeholder="ค้นหาชื่อประเภทโครงการ..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] transition-all bg-[var(--color-surface)]/20 placeholder:text-[var(--color-placeholder)]"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-forest-blue)] border-b border-[var(--color-surface-3)] text-white text-base">
                <th className="px-5 py-3.5 font-bold w-24 text-center">รหัส</th>
                <th className="px-5 py-3.5 font-bold w-28 text-center">รูปภาพ</th>
                <th className="px-5 py-3.5 font-bold">ชื่อประเภท (ไทย)</th>
                <th className="px-5 py-3.5 font-bold">ชื่อประเภท (อังกฤษ)</th>
                <th className="px-5 py-3.5 font-bold w-28 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-base">
              {loading ? (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-[var(--color-muted-text)]">กำลังโหลด...</td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr key={row.type_id}
                    className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"}`}>
                    <td className="px-5 py-3.5 font-bold text-[var(--color-blue)] text-center font-mono">{row.type_id}</td>
                    <td className="px-5 py-3.5 text-center">
                      {row.type_image ? (
                        <img
                          src={`${UPLOADS_URL}${row.type_image}`}
                          alt={row.type_name}
                          className="w-10 h-10 object-contain mx-auto rounded-lg"
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <span className="text-[var(--color-disabled)] text-xs">ไม่มีรูป</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-semibold">{row.type_name}</td>
                    <td className="px-5 py-3.5 text-[var(--color-muted-text)]">{row.type_name_eng || '-'}</td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => { setSelectedCategory(row); setIsModalOpen(true) }}
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-blue)] hover:bg-[var(--color-blue)] hover:text-white transition-all cursor-pointer">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-5 py-10 text-center text-[var(--color-disabled)]">ไม่พบข้อมูล</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-5 py-3 border-t border-[var(--color-surface-3)] flex justify-between items-center bg-[var(--color-surface)]/10 text-xs">
          <p className="font-medium text-[var(--color-muted-text)]">ทั้งหมด {filtered.length} รายการ</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 cursor-pointer">
              ย้อนกลับ
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 font-bold rounded-lg cursor-pointer ${currentPage === p ? "bg-[var(--color-blue)] text-white" : "border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)]"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 cursor-pointer">
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
    </div>
  )
}