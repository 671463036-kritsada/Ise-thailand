import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, Search, Layers, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import PlanAllModel from "../model/PlanAllModel";
import api from "../../api/axios";

const PER_PAGE = 5;

export default function PlanAll() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  // ── FETCH ──
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/plan");
      const data = Array.isArray(res.data) ? res.data : res.data.data ?? [];
      setPlans(data);
    } catch {
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: "ไม่สามารถโหลดข้อมูลแผนงานได้", icon: "error", confirmButtonColor: "var(--color-green)" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  // ── FILTER & PAGINATION ──
  const filtered = plans.filter((p) =>
    p.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.plan_id).includes(searchTerm)
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // ── MODAL HANDLERS ──
  const handleOpenAddModal = () => { setModalMode("add"); setSelectedData(null); setIsModalOpen(true); };
  const handleOpenEditModal = (row) => { setModalMode("edit"); setSelectedData(row); setIsModalOpen(true); };
  const handleOpenDeleteModal = (row) => { setModalMode("delete"); setSelectedData(row); setIsModalOpen(true); };

  // ── SAVE (ADD / EDIT / DELETE) ──
  const handleSavePlan = async (formData) => {
    try {
      if (modalMode === "delete") {
        await api.delete(`/plan/${formData.plan_id}`);
        Swal.fire({ title: "ลบสำเร็จ!", text: "ลบข้อมูลแผนงานออกจากระบบแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
      } else if (modalMode === "edit") {
        await api.put(`/plan/${formData.plan_id}`, {
          plan_name: formData.plan_name,
          plan_name_eng: formData.plan_name_eng || null,
        });
        Swal.fire({ title: "บันทึกสำเร็จ!", text: "ปรับปรุงข้อมูลแผนงานแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
      } else {
        const nextId = String(plans.length + 1).padStart(3, "0"); // varchar(3) เช่น "002"
        await api.post("/plan", {
          plan_id: nextId,
          plan_name: formData.plan_name,
          plan_name_eng: formData.plan_name_eng || null,
        });
        Swal.fire({ title: "เพิ่มสำเร็จ!", text: "เพิ่มแผนงานใหม่เข้าสู่ระบบแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch {
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: "ไม่สามารถบันทึกข้อมูลได้", icon: "error", confirmButtonColor: "var(--color-green)" });
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">

      {/* ── PAGE HEADER & ADD BUTTON (Responsive Wrap) ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[var(--color-green)] shrink-0" />
            <span>ทะเบียนข้อมูลแผนงานวิจัย</span>
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-[var(--color-muted-text)] mt-0.5 font-medium">
            ระบบจัดการและรวบรวมรายชื่อแผนงานวิจัยของสถาบัน
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-[var(--color-green)] text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มแผนงาน</span>
        </button>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="bg-white p-3 sm:p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-disabled)] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อแผนงาน หรือรหัสประจำแผนงาน..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 sm:pl-11 pr-4 py-2 border border-[var(--color-border)] rounded-xl text-sm sm:text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
          />
        </div>
      </div>

      {/* ── DATA TABLE CARD ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full custom-horizontal-scrollbar">
          <table className="w-full text-left border-collapse min-w-[45rem]">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-xs sm:text-sm lg:text-base">
                <th className="px-4 sm:px-5 py-3.5 font-bold w-36 text-center whitespace-nowrap">รหัสแผนงาน</th>
                <th className="px-4 sm:px-5 py-3.5 font-bold min-w-[14rem]">ชื่อแผนงาน</th>
                <th className="px-4 sm:px-5 py-3.5 font-bold min-w-[14rem]">ชื่อแผนงาน (English)</th>
                <th className="px-4 sm:px-5 py-3.5 font-bold w-24 text-center whitespace-nowrap">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-xs sm:text-sm lg:text-base">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-12 text-center text-[var(--color-disabled)] font-semibold">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--color-green)]" />
                    <span>กำลังโหลดข้อมูล...</span>
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr
                    key={row.plan_id}
                    className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"}`}
                  >
                    <td className="px-4 sm:px-5 py-4 text-center font-mono font-bold text-[var(--color-green)] whitespace-nowrap">
                      {String(row.plan_id).padStart(2, "0")}
                    </td>
                    <td className="px-4 sm:px-5 py-4 font-semibold text-[var(--color-deep-text)] leading-relaxed">
                      {row.plan_name}
                    </td>
                    <td className="px-4 sm:px-5 py-4 font-semibold text-[var(--color-muted-text)] text-xs sm:text-sm leading-relaxed">
                      {row.plan_name_eng || "-"}
                    </td>
                    <td className="px-4 sm:px-5 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all duration-150 cursor-pointer active:scale-90"
                          title="แก้ไขแผนงาน"
                        >
                          <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all duration-150 cursor-pointer active:scale-90"
                          title="ลบแผนงาน"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center font-medium text-[var(--color-disabled)]">
                    ❌ ไม่พบข้อมูลรายชื่อแผนงานวิจัยที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR (Responsive Design Block) ── */}
        <div className="px-4 sm:px-5 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-[11px] sm:text-xs">
          <p className="font-medium text-[var(--color-muted-text)] text-center sm:text-left">
            แสดง {currentItems.length} จากทั้งหมด {filtered.length} รายการ
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 w-full sm:w-auto">
            <button 
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-3xs"
            >
              ย้อนกลับ
            </button>
            
            <div className="flex items-center gap-1 max-w-[12rem] sm:max-w-none overflow-x-auto custom-horizontal-scrollbar py-0.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2.5 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-3xs"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <PlanAllModel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          planData={selectedData}
          mode={modalMode}
          onSave={handleSavePlan}
        />
      )}

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