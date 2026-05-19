import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";

// plans = array ของ { plan_id, plan_name } รับมาจาก SubPlans.jsx
export default function SubPlansModel({ isOpen, onClose, subPlanData, plans = [], mode, onSave }) {
  const [formValues, setFormValues] = useState({ subplan_id: "", plan_id: "", subplan_name: "" });
  const isDeleteMode = mode === "delete";

  useEffect(() => {
    if (isOpen) {
      setFormValues(subPlanData ? { ...subPlanData } : { subplan_id: "", plan_id: "", subplan_name: "" });
    }
  }, [isOpen, subPlanData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDeleteMode) {
      const result = await Swal.fire({
        title: "ยืนยันการลบแผนย่อย?",
        text: `คุณต้องการลบแผนย่อย "${formValues.subplan_name}" ใช่หรือไม่?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--color-error)",
        cancelButtonColor: "var(--color-muted-text)",
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ยกเลิก",
        reverseButtons: true,
      });
      if (!result.isConfirmed) return;
    } else {
      if (!formValues.plan_id) {
        Swal.fire({ title: "ข้อมูลไม่ครบถ้วน", text: "โปรดเลือกแผนหลักที่ต้องการเชื่อมโยง", icon: "warning", confirmButtonColor: "var(--color-green)" });
        return;
      }
      if (!formValues.subplan_name.trim()) {
        Swal.fire({ title: "ข้อมูลไม่ครบถ้วน", text: "โปรดกรอกชื่อแผนย่อย", icon: "warning", confirmButtonColor: "var(--color-green)" });
        return;
      }
    }

    onSave(formValues);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 font-sans antialiased text-[var(--color-deep-text)]">
      <div className={`bg-white rounded-2xl shadow-2xl border w-full max-w-2xl overflow-hidden ${isDeleteMode ? "border-[var(--color-error)]/30" : "border-[var(--color-border)]"}`}>

        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[var(--color-surface-3)]">
          <h2 className={`text-2xl font-bold ${isDeleteMode ? "text-[var(--color-error)]" : "text-[var(--color-forest-green)]"}`}>
            {isDeleteMode ? "ยืนยันการลบข้อมูลแผนย่อย" : subPlanData ? "แก้ไขรายละเอียดแผนย่อย" : "เพิ่มแผนย่อย"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--color-disabled)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-deep-text)] transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className={`p-6 space-y-4 ${isDeleteMode ? "bg-red-50/10" : "bg-white"}`}>

            {formValues.subplan_id && (
              <div className="flex flex-col gap-1.5">
                <label className="text-base font-bold text-slate-700">รหัสประจำแผนย่อย</label>
                <input
                  type="text"
                  disabled
                  value={String(formValues.subplan_id).padStart(3, "0")}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base bg-[var(--color-surface-2)] text-[var(--color-muted-text)] font-mono font-bold cursor-not-allowed"
                />
              </div>
            )}

            {/* Dropdown ดึงจาก API จริง */}
            <div className="flex flex-col gap-1.5">
              <label className="text-base font-bold text-slate-700">เลือกแผน * :</label>
              <select
                name="plan_id"
                value={formValues.plan_id}
                onChange={handleChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/40 transition-all cursor-pointer disabled:bg-[var(--color-surface-2)] disabled:cursor-not-allowed"
              >
                <option value="">-กรุณาเลือกแผน-</option>
                {plans.map((p) => (
                  <option key={p.plan_id} value={p.plan_id}>
                    {p.plan_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-base font-bold text-slate-700">ชื่อแผนย่อย :</label>
              <input
                type="text"
                name="subplan_name"
                placeholder="กรอกชื่อแผนย่อย"
                disabled={isDeleteMode}
                value={formValues.subplan_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/40 transition-all bg-white disabled:bg-[var(--color-surface-2)] disabled:cursor-not-allowed font-medium"
              />
            </div>

            {isDeleteMode && (
              <div className="text-sm font-medium text-[var(--color-error)] bg-rose-50 p-3 rounded-lg border border-rose-100">
                ⚠️ ระวัง: การยืนยันนี้จะทำให้ข้อมูลแผนย่อยหลุดถอนออกจากฐานข้อมูลหลักของระบบ
              </div>
            )}
          </div>

          <footer className="px-6 py-4 border-t border-[var(--color-surface-3)] bg-[var(--color-surface)]/20 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose}
              className="px-5 py-2 text-base font-semibold text-[var(--color-muted-text)] border border-[var(--color-border)] hover:bg-white bg-[var(--color-surface)]/40 rounded-xl transition-colors cursor-pointer">
              ยกเลิก
            </button>
            <button type="submit"
              className={`px-5 py-2 text-base font-bold text-white rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer ${isDeleteMode ? "bg-[var(--color-error)] hover:bg-[var(--color-error)]/90" : "bg-[var(--color-green)] hover:bg-[var(--color-forest-green)]"}`}>
              {isDeleteMode ? "ยืนยันการลบ" : "บันทึกข้อมูล"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}