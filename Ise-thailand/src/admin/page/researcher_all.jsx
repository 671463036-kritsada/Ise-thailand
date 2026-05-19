import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, UserCheck } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";
import ResearcherModal from "../model/ResearcherAllModel";

const PER_PAGE = 10;

export default function ResearcherPage() {
  const [researchers, setResearchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchResearchers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/researcher");
      setResearchers(res.data.data || []);
    } catch (err) {
      Swal.fire({ title: "โหลดข้อมูลไม่สำเร็จ", text: err.message, icon: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchResearchers(); }, [fetchResearchers]);

  const filtered = researchers.filter(r => {
    const fullname = `${r.researcher_name} ${r.researcher_surname}`.toLowerCase();
    return (
      fullname.includes(searchTerm.toLowerCase()) ||
      r.researcher_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleDelete = (row) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: `${row.researcher_name} ${row.researcher_surname}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-error)",
      cancelButtonColor: "var(--color-green)",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await api.delete(`/researcher/${row.researcher_id}`);
        Swal.fire({ title: "ลบสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-green)" });
        fetchResearchers();
      } catch (err) {
        Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.message, icon: "error" });
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (parseInt(status)) {
      case 1: return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case 0: return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  const getStatusLabel = (status) => parseInt(status) === 1 ? "ปฏิบัติงานปกติ" : "ระงับการทำงาน";

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-forest-green)] flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-[var(--color-green)]" />
            ทะเบียนนักวิจัย
          </h1>
          <p className="text-sm text-[var(--color-muted-text)] mt-0.5 font-medium">
            จัดการข้อมูลนักวิจัยและผู้เชี่ยวชาญทั้งหมด
          </p>
        </div>
        <button
          onClick={() => { setEditData(null); setModalOpen(true); }}
          className="px-4 py-2 bg-[var(--color-green)] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          เพิ่มนักวิจัย
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-[var(--color-border)] shadow-sm mb-6">
        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อ, รหัส หรือ email..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] transition-all text-[var(--color-deep-text)]"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-sm">
                <th className="px-4 py-3 font-bold w-28 text-center">รหัส</th>
                <th className="px-4 py-3 font-bold">ชื่อ-นามสกุล</th>
                <th className="px-4 py-3 font-bold">สถาบัน</th>
                <th className="px-4 py-3 font-bold w-48">Email</th>
                <th className="px-4 py-3 font-bold w-32">โทรศัพท์</th>
                <th className="px-4 py-3 font-bold w-32 text-center">สถานะ</th>
                <th className="px-4 py-3 font-bold w-24 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-[var(--color-muted-text)]">
                    กำลังโหลด...
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr
                    key={row.researcher_id}
                    className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"}`}
                  >
                    <td className="px-4 py-3 text-center font-mono font-bold text-[var(--color-green)]">
                      {row.researcher_id}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {row.researcher_name} {row.researcher_surname}
                      {(row.researcher_name_eng || row.researcher_surname_eng) && (
                        <div className="text-xs text-[var(--color-muted-text)]">
                          {row.researcher_name_eng} {row.researcher_surname_eng}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted-text)]">
                      {row.institute_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted-text)]">
                      {row.email || "-"}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted-text)]">
                      {row.telno || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-bold border rounded-full ${getStatusBadge(row.status)}`}>
                        {getStatusLabel(row.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => { setEditData(row); setModalOpen(true); }}
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all cursor-pointer"
                          title="แก้ไข"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all cursor-pointer"
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
                  <td colSpan="7" className="py-10 text-center text-[var(--color-disabled)]">
                    ไม่พบข้อมูลนักวิจัย
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-4 py-3 border-t border-[var(--color-surface-3)] flex justify-between items-center bg-[var(--color-surface)]/10 text-xs">
          <p className="text-[var(--color-muted-text)] font-medium">
            แสดง {currentItems.length} จาก {filtered.length} รายการ
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ย้อนกลับ
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 font-bold rounded-lg transition-colors cursor-pointer ${
                  currentPage === p
                    ? "bg-[var(--color-green)] text-white"
                    : "border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      <ResearcherModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editData={editData}
        onSuccess={() => {
          fetchResearchers();
          setModalOpen(false);
        }}
      />
    </div>
  );
}