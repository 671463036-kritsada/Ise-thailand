import { useState, useEffect } from "react";
import { X, BookOpen, CircleAlert } from "lucide-react";
import Swal from "sweetalert2";

export default function PlanAllModel({ isOpen, onClose, planData, mode, onSave }) {
  const [formValues, setFormValues] = useState({ plan_id: "", plan_name: "", plan_name_eng: "" });
  const isDeleteMode = mode === "delete";

  useEffect(() => {
    if (isOpen) {
      setFormValues(planData ? { ...planData } : { plan_id: "", plan_name: "", plan_name_eng: "" });
    }
  }, [isOpen, planData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDeleteMode) {
      const result = await Swal.fire({
        title: "ยืนยันการลบแผนงาน?",
        text: `คุณต้องการลบแผนงาน "${formValues.plan_name}" ใช่หรือไม่?`,
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
      if (!formValues.plan_name.trim()) {
        Swal.fire({ title: "ข้อมูลไม่ครบถ้วน", text: "โปรดกรอกชื่อแผนงานวิจัย", icon: "warning", confirmButtonColor: "var(--color-green)" });
        return;
      }
    }
    onSave(formValues);
  };

  const inputClass = "w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/40 transition-all resize-none placeholder:text-[var(--color-muted-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]";
  const labelClass = "block text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wide mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm font-sans antialiased">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-surface-3)]">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDeleteMode ? "bg-red-50" : "bg-[var(--color-green-light)]/20"}`}>
              <BookOpen className={`w-4 h-4 ${isDeleteMode ? "text-red-400" : "text-[var(--color-green)]"}`} />
            </div>
            <div>
              <h2 className={`text-base font-extrabold ${isDeleteMode ? "text-red-500" : "text-[var(--color-deep-text)]"}`}>
                {isDeleteMode ? "ยืนยันการลบแผนงาน" : planData ? "แก้ไขข้อมูลแผนงาน" : "เพิ่มแผนงานใหม่"}
              </h2>
              <p className="text-xs text-[var(--color-muted-text)] mt-0.5">
                {isDeleteMode ? "โปรดตรวจสอบข้อมูลก่อนยืนยัน" : "กรอกชื่อแผนงานวิจัย"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--color-surface-2)] text-[var(--color-muted-text)] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">

            {formValues.plan_id && (
              <div>
                <label className={labelClass}>รหัสแผนงาน</label>
                <input type="text" disabled value={String(formValues.plan_id).padStart(2, "0")}
                  className={`${inputClass} font-mono font-bold cursor-not-allowed`} />
              </div>
            )}

            <div>
              <label className={labelClass}>ชื่อแผนงานวิจัย <span className="text-red-400 normal-case tracking-normal">*</span></label>
              <textarea name="plan_name" rows={3} placeholder="กรอกชื่อแผนงานภาษาไทย..."
                disabled={isDeleteMode} value={formValues.plan_name} onChange={handleChange}
                className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>ชื่อแผนงานวิจัย (English)</label>
              <textarea name="plan_name_eng" rows={3} placeholder="กรอกชื่อแผนงานภาษาอังกฤษ..."
                disabled={isDeleteMode} value={formValues.plan_name_eng ?? ""} onChange={handleChange}
                className={inputClass} />
            </div>

            {isDeleteMode && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                <span className="text-red-400 text-sm mt-0.5"><CircleAlert /></span>
                <p className="text-xs font-medium text-red-500">การลบแผนงานจะส่งผลให้ข้อมูลหายไปจากระบบอย่างถาวร</p>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t border-[var(--color-surface-3)] flex items-center justify-between bg-[var(--color-surface)]/50">
            <p className="text-xs text-[var(--color-muted-text)]">
              {!isDeleteMode && <><span className="text-red-400">*</span> จำเป็นต้องกรอก</>}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={onClose}
                className="px-5 py-2.5 text-sm font-bold text-[var(--color-muted-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] rounded-xl transition-colors cursor-pointer">
                ยกเลิก
              </button>
              <button type="submit"
                className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-colors cursor-pointer ${isDeleteMode ? "bg-red-500 hover:bg-red-600" : "bg-[var(--color-green)] hover:bg-[var(--color-forest-green)]"}`}>
                {isDeleteMode ? "ยืนยันการลบ" : "บันทึกข้อมูล"}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}