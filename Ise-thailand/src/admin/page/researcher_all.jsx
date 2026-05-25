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
    switch (status ? parseInt(status) : 1) {
      case 1: return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case 0: return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  const getStatusLabel = (status) => (status ? parseInt(status) : 1) === 1 ? "ปฏิบัติงานปกติ" : "ระงับการทำงาน";

  return (
    <div className="p-3 sm:p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">

      {/* ── PAGE HEADER & ADD BUTTON (Responsive Wrap) ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--color-green)] shrink-0" />
            <span>ทะเบียนนักวิจัย</span>
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-[var(--color-muted-text)] mt-0.5 font-medium">
            จัดการข้อมูลนักวิจัยและผู้เชี่ยวชาญทั้งหมดในระบบ
          </p>
        </div>
        <button
          onClick={() => { setEditData(null); setModalOpen(true); }}
          className="w-full sm:w-auto px-4 py-2.5 bg-[var(--color-green)] text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มนักวิจัย</span>
        </button>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="bg-white p-3 sm:p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6">
        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อ, รหัส หรือ email..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm sm:text-base focus:outline-none focus:border-[var(--color-border-focus)] transition-all bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
        />
      </div>

      {/* ── DATA TABLE CARD ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full custom-horizontal-scrollbar">
          <table className="w-full text-left border-collapse min-w-[62rem]">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-xs sm:text-sm lg:text-base">
                <th className="px-4 py-3 font-bold w-28 text-center whitespace-nowrap">รหัส</th>
                <th className="px-4 py-3 font-bold min-w-[14rem]">ชื่อ-นามสกุล</th>
                <th className="px-4 py-3 font-bold min-w-[12rem]">สถาบัน</th>
                <th className="px-4 py-3 font-bold w-52 whitespace-nowrap">Email</th>
                <th className="px-4 py-3 font-bold w-36 whitespace-nowrap">โทรศัพท์</th>
                <th className="px-4 py-3 font-bold w-32 text-center whitespace-nowrap">สถานะ</th>
                <th className="px-4 py-3 font-bold w-24 text-center whitespace-nowrap">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-xs sm:text-sm lg:text-base">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-[var(--color-muted-text)] font-semibold">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr
                    key={row.researcher_id}
                    className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"}`}
                  >
                    <td className="px-4 py-3.5 font-bold text-[var(--color-green)] text-center font-mono whitespace-nowrap">
                      {row.researcher_id}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[var(--color-deep-text)]">
                      <div className="leading-relaxed">{row.researcher_name} {row.researcher_surname}</div>
                      {(row.researcher_name_eng || row.researcher_surname_eng) && (
                        <div className="text-[10px] sm:text-xs text-[var(--color-muted-text)] font-medium line-clamp-1 mt-0.5">
                          {row.researcher_name_eng} {row.researcher_surname_eng}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-[var(--color-muted-text)] font-semibold leading-relaxed">
                      {row.institute_name || "-"}
                    </td>
                    <td className="px-4 py-3.5 text-[var(--color-muted-text)] font-medium whitespace-nowrap font-mono">
                      {row.email || "-"}
                    </td>
                    <td className="px-4 py-3.5 text-[var(--color-muted-text)] font-medium whitespace-nowrap font-mono">
                      {row.telno || "-"}
                    </td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 sm:py-1 text-xs font-bold border rounded-full ${getStatusBadge(row.status)}`}>
                        {getStatusLabel(row.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
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
                  <td colSpan="7" className="px-5 py-10 text-center font-medium text-[var(--color-disabled)]">
                    ❌ ไม่พบข้อมูลนักวิจัยตามเงื่อนไขที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR (Responsive Block) ── */}
        <div className="px-4 sm:px-5 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-[11px] sm:text-xs">
          <p className="font-medium text-[var(--color-muted-text)] text-center sm:text-left">
            แสดง {currentItems.length} จาก {filtered.length} รายการ
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
                  className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 font-bold rounded-lg transition-colors cursor-pointer text-[11px] sm:text-xs ${
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
              className="px-2.5 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-3xs cursor-pointer"
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

      {/* แถบจัดแต่งสไตล์ความหนาของ Scrollbar แนวนอนของตารางเมื่อเปิดบนมือถือ */}
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
  );
}