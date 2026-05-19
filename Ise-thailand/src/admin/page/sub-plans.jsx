import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, Search, Layers, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import SubPlansModel from "../model/SubPlansModel";
import api from "../../api/axios";

const PER_PAGE = 5;

export default function SubPlans() {
  const [subPlans, setSubPlans] = useState([]);
  const [plans, setPlans] = useState([]); // สำหรับ dropdown ใน modal
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  // ── FETCH ──
  const fetchSubPlans = useCallback(async () => {
    try {
      setLoading(true);
      const [subRes, planRes] = await Promise.all([
        api.get("/plan/subplan"),
        api.get("/plan"),
      ]);
      const subData = Array.isArray(subRes.data) ? subRes.data : subRes.data.data ?? [];
      const planData = Array.isArray(planRes.data) ? planRes.data : planRes.data.data ?? [];
      setSubPlans(subData);
      setPlans(planData);
    } catch {
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: "ไม่สามารถโหลดข้อมูลแผนย่อยได้", icon: "error", confirmButtonColor: "var(--color-green)" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSubPlans(); }, [fetchSubPlans]);

  // ── FILTER & PAGINATION ──
  const filtered = subPlans.filter((s) =>
    s.subplan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(s.subplan_id).includes(searchTerm) ||
    // หา plan_name จาก plans array เพื่อ search
    plans.find((p) => p.plan_id === s.plan_id)?.plan_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const getPlanName = (plan_id) => plans.find((p) => p.plan_id === plan_id)?.plan_name ?? "-";

  // ── MODAL HANDLERS ──
  const handleOpenAddModal = () => { setModalMode("add"); setSelectedData(null); setIsModalOpen(true); };
  const handleOpenEditModal = (row) => { setModalMode("edit"); setSelectedData(row); setIsModalOpen(true); };
  const handleOpenDeleteModal = (row) => { setModalMode("delete"); setSelectedData(row); setIsModalOpen(true); };

  // ── SAVE ──
  const handleSaveSubPlan = async (formData) => {
    try {
      if (modalMode === "delete") {
        await api.delete(`/plan/subplan/${formData.subplan_id}`);
        Swal.fire({ title: "ลบสำเร็จ!", text: "ลบข้อมูลแผนย่อยออกจากระบบแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
      } else if (modalMode === "edit") {
        await api.put(`/plan/subplan/${formData.subplan_id}`, {
          subplan_name: formData.subplan_name,
          plan_id: formData.plan_id,
        });
        Swal.fire({ title: "บันทึกสำเร็จ!", text: "ปรับปรุงข้อมูลแผนย่อยเรียบร้อยแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
      } else {
        await api.post("/plan/subplan", {
          subplan_name: formData.subplan_name,
          plan_id: formData.plan_id,
        });
        Swal.fire({ title: "เพิ่มสำเร็จ!", text: "เพิ่มแผนย่อยใหม่เข้าสู่ระบบแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
      }
      setIsModalOpen(false);
      fetchSubPlans();
    } catch (err) {
      const msg = err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้";
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: msg, icon: "error", confirmButtonColor: "var(--color-green)" });
    }
  };

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">

      {/* ── HEADER ── */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
            <Layers className="w-8 h-8 text-[var(--color-green)]" />
            <span>จัดการข้อมูลแผนย่อย</span>
          </h1>
          <p className="text-base text-[var(--color-muted-text)] mt-0.5 font-medium">
            ระบบบันทึกและเชื่อมโยงชุดข้อมูลแผนย่อยเข้ากับแผนงานวิจัยหลัก
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[var(--color-green)] text-white text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มแผนย่อย</span>
        </button>
      </div>

      {/* ── SEARCH ── */}
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-[var(--color-disabled)] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อแผนย่อย หรือ ชื่อแผนงานหลัก..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
          />
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-base">
                <th className="px-5 py-4 font-bold w-32 text-center">รหัสแผนย่อย</th>
                <th className="px-5 py-4 font-bold">ชื่อแผนย่อย</th>
                <th className="px-5 py-4 font-bold w-72">ชื่อแผน</th>
                <th className="px-5 py-4 font-bold w-28 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-base">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center text-[var(--color-disabled)]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--color-green)]" />
                    <span className="font-medium">กำลังโหลดข้อมูล...</span>
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr key={row.subplan_id}
                    className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"}`}>
                    <td className="px-5 py-4 text-center font-mono font-bold text-[var(--color-green)]">
                      {String(row.subplan_id).padStart(3, "0")}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[var(--color-deep-text)]">
                      {row.subplan_name}
                    </td>
                    <td className="px-5 py-4 text-[var(--color-deep-text)] font-medium">
                      {getPlanName(row.plan_id)}
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => handleOpenEditModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all duration-150 cursor-pointer">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenDeleteModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all duration-150 cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center font-medium text-[var(--color-disabled)]">
                    ❌ ไม่พบข้อมูลรายชื่อแผนย่อยที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ── */}
        <div className="px-5 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-xs">
          <p className="font-medium text-[var(--color-muted-text)]">
            แสดง {currentItems.length} จากทั้งหมด {filtered.length} รายการ
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer">
              ย้อนกลับ
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 font-bold rounded-lg transition-colors cursor-pointer ${currentPage === p ? "bg-[var(--color-green)] text-white shadow-sm" : "border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)]"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer">
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <SubPlansModel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          subPlanData={selectedData}
          plans={plans}
          mode={modalMode}
          onSave={handleSaveSubPlan}
        />
      )}
    </div>
  );
}