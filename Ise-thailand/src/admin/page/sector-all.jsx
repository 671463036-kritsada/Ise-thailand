import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";
import SectorModal from "../model/SectorModal";

const PER_PAGE = 10;

export default function SectorAll() {
  const [sectors, setSectors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    api.get("/sector")
      .then(res => setSectors(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = sectors.filter(s =>
    s.sector_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.sector_name_eng || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleSave = async (formData) => {
    try {
      if (formData.sector_id) {
        await api.put(`/sector/${formData.sector_id}`, formData);
        Swal.fire({ title: "แก้ไขสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-green)" });
      } else {
        await api.post("/sector", formData);
        Swal.fire({ title: "เพิ่มสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-green)" });
      }
      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.message, icon: "error" });
    }
  };

  const handleDelete = async (sector) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจใช่ไหม?",
      html: `ต้องการลบ <b>${sector.sector_name}</b>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-error)",
      cancelButtonColor: "var(--color-muted-text)",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/sector/${sector.sector_id}`);
        Swal.fire({ title: "ลบสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-green)" });
        fetchData();
      } catch (err) {
        Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.message, icon: "error" });
      }
    }
  };

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">

      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-forest-green)] tracking-tight">จัดการภาคส่วน</h1>
          <p className="text-base text-[var(--color-muted-text)] mt-0.5 font-medium">แสดงรายการภาคส่วนในระบบ</p>
        </div>
        <button
          onClick={() => { setSelectedSector(null); setIsModalOpen(true); }}
          className="px-4 py-2.5 bg-[var(--color-green)] text-white text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มภาคส่วน</span>
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6">
        <input type="text" placeholder="ค้นหาชื่อภาคส่วน..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] transition-all bg-[var(--color-surface)]/20 placeholder:text-[var(--color-placeholder)]"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-base">
                <th className="px-5 py-3.5 font-bold w-24 text-center">รหัส</th>
                <th className="px-5 py-3.5 font-bold">ชื่อภาคส่วน (ไทย)</th>
                <th className="px-5 py-3.5 font-bold">ชื่อภาคส่วน (อังกฤษ)</th>
                <th className="px-5 py-3.5 font-bold w-28 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-base">
              {loading ? (
                <tr><td colSpan="4" className="px-5 py-10 text-center text-[var(--color-muted-text)]">กำลังโหลด...</td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr key={row.sector_id}
                    className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"}`}>
                    <td className="px-5 py-3.5 font-bold text-[var(--color-green)] text-center font-mono">{row.sector_id}</td>
                    <td className="px-5 py-3.5 font-semibold">{row.sector_name}</td>
                    <td className="px-5 py-3.5 text-[var(--color-muted-text)]">{row.sector_name_eng || "-"}</td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => { setSelectedSector(row); setIsModalOpen(true); }}
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all cursor-pointer">
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
                <tr><td colSpan="4" className="px-5 py-10 text-center text-[var(--color-disabled)]">ไม่พบข้อมูล</td></tr>
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
                className={`w-8 h-8 font-bold rounded-lg cursor-pointer ${currentPage === p ? "bg-[var(--color-green)] text-white" : "border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)]"}`}>
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

      <SectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editData={selectedSector}
      />
    </div>
  );
}