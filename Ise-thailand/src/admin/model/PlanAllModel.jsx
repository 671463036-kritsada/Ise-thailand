import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";

export default function PlanAllModel({ isOpen, onClose, planData, mode, onSave }) {
  const initialFormState = {
    id: "",
    name: ""
  };

  const [formValues, setFormValues] = useState(initialFormState);
  
  // ตรวจเช็คสถานะโหมดลบเพื่อนำไปล็อคตัวกรอกข้อมูล
  const isDeleteMode = mode === "delete";

  useEffect(() => {
    if (isOpen) {
      if (planData) {
        setFormValues({ ...planData });
      } else {
        setFormValues(initialFormState);
      }
    }
  }, [isOpen, planData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // กรณีเป็นโหมดลบข้อมูล: แสดงป๊อปอัพยืนยันความปลอดภัยก่อน
    if (isDeleteMode) {
      const result = await Swal.fire({
        title: 'ยืนยันการลบแผนงาน?',
        text: `คุณต้องการลบแผนงาน "${formValues.name}" ใช่หรือไม่?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--color-error)',
        cancelButtonColor: 'var(--color-muted-text)',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true,
        customClass: {
          title: 'text-2xl font-bold text-[var(--color-deep-text)]',
          htmlContainer: 'text-base text-[var(--color-muted-text)]',
          confirmButton: 'text-base px-6 py-2 rounded-xl',
          cancelButton: 'text-base px-6 py-2 rounded-xl'
        }
      });

      if (!result.isConfirmed) return;
    } else {
      // ตรวจสอบค่าว่างกรณีเพิ่มหรือแก้ไข
      if (!formValues.name.trim()) {
        Swal.fire({
          title: "ข้อมูลไม่ครบถ้วน",
          text: "โปรดกรอกชื่อแผนงานวิจัย",
          icon: "warning",
          confirmButtonColor: "var(--color-green)"
        });
        return;
      }
    }

    onSave(formValues);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40  font-sans antialiased text-[var(--color-deep-text)] animate-in fade-in duration-200">
      
      {/* ── MODAL CONTAINER (ขนาดกลาง Medium Size สมดุลพอดีหน้าจอ) ── */}
      <div className={`bg-white rounded-2xl shadow-2xl border w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in-95 duration-200
        ${isDeleteMode ? "border-[var(--color-error)]/30" : "border-[var(--color-border)]"}`}
      >
        
        {/* ── HEADER ── */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[var(--color-surface-3)]">
          <h2 className={`text-2xl font-bold ${isDeleteMode ? "text-[var(--color-error)]" : "text-[var(--color-forest-green)]"}`}>
            {isDeleteMode ? "🗑️ ยืนยันการลบแผนงาน" : planData ? "📝 แก้ไขข้อมูลแผนงาน" : "✨ เพิ่มแผนงานใหม่"}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-disabled)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-deep-text)] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* ── FORM CONTENT ── */}
        <form onSubmit={handleSubmit}>
          <div className={`p-6 space-y-5 ${isDeleteMode ? "bg-[var(--color-error)]/5" : "bg-white"}`}>
            
            {/* แสดงรหัสแผนงาน (กรณีแก้ไข หรือ ลบ เท่านั้น) */}
            {formValues.id && (
              <div className="flex flex-col gap-1.5">
                <label className="text-base font-bold text-slate-700">
                  รหัสประจำแผนงาน
                </label>
                <input
                  type="text"
                  disabled
                  value={formValues.id}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-lg bg-[var(--color-surface-2)] text-[var(--color-muted-text)] font-mono font-bold cursor-not-allowed"
                />
              </div>
            )}

            {/* ชื่อแผนงานวิจัย */}
            <div className="flex flex-col gap-1.5">
              <label className="text-base font-bold text-slate-700">
                ชื่อแผนงานวิจัย <span className="text-[var(--color-error)]">*</span>
              </label>
              <textarea
                name="name"
                rows="4"
                placeholder="กรอกชื่อแผนงานที่ต้องการบันทึก..."
                required
                disabled={isDeleteMode}
                value={formValues.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-lg focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-none bg-white disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]"
              />
            </div>

            {isDeleteMode && (
              <p className="text-sm font-medium text-[var(--color-error)] bg-red-50 p-3 rounded-lg border border-red-100">
                ⚠️ คำเตือน: การลบแผนงานจะส่งผลให้ข้อมูลแผนงานนี้หายไปจากระบบอย่างถาวร
              </p>
            )}

          </div>

          {/* ── FOOTER ACTIONS (ปรับปุ่มกดขนาดกลาง Medium Button) ── */}
          <footer className="px-6 py-4 border-t border-[var(--color-surface-3)] bg-[var(--color-surface)]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-base font-semibold text-[var(--color-muted-text)] border border-[var(--color-border)] hover:bg-white bg-[var(--color-surface)]/40 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-base font-bold text-white rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer
                ${isDeleteMode
                  ? "bg-[var(--color-error)] hover:bg-[var(--color-error)]/90"
                  : "bg-[var(--color-green)] hover:bg-[var(--color-forest-green)] shadow-[var(--color-green-light)]/30"
                }`}
            >
              {isDeleteMode ? "ยืนยันการลบ" : "บันทึกข้อมูล"}
            </button>
          </footer>
        </form>

      </div>
    </div>
  );
}