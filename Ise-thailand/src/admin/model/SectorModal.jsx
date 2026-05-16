import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";

export default function SectorModal({ isOpen, onClose, sectorData, mode, onSave }) {
  const initialFormState = {
    id: "",
    name: "",
    description: ""
  };

  const [formValues, setFormValues] = useState(initialFormState);
  
  // ตรวจเช็คสถานะโหมดลบเพื่อนำไปล็อคตัวกรอกข้อมูล
  const isDeleteMode = mode === "delete";

  useEffect(() => {
    if (isOpen) {
      if (sectorData) {
        setFormValues({ ...sectorData });
      } else {
        setFormValues(initialFormState);
      }
    }
  }, [isOpen, sectorData]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // กรณีเป็นโหมดลบข้อมูล: แสดงป๊อปอัพยืนยันความปลอดภัย
    if (isDeleteMode) {
      const result = await Swal.fire({
        title: 'คุณแน่ใจใช่ไหม?',
        text: `ต้องการลบข้อมูลหน่วยงาน "${formValues.name}" ออกจากระบบ?`,
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
          confirmButton: 'text-base px-5 py-2 rounded-xl',
          cancelButton: 'text-base px-5 py-2 rounded-xl'
        }
      });

      if (!result.isConfirmed) return;
    }

    onSave(formValues);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40  font-sans antialiased text-[var(--color-deep-text)] animate-in fade-in duration-200">
      
      {/* ── MODAL CONTAINER (ขยายความกว้างสูงสุดขึ้นเป็น max-w-lg เพื่อความโปร่งสบาย) ── */}
      <div className={`bg-white rounded-2xl shadow-xl border w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in-95 duration-200
        ${isDeleteMode ? "border-[var(--color-error)]/30" : "border-[var(--color-border)]"}`}
      >
        
        {/* ── HEADER (ปรับขนาดฟอนต์หัวข้อขึ้นเป็น text-xl / text-2xl) ── */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[var(--color-surface-3)]">
          <div>
            <h2 className={`text-2xl font-bold ${isDeleteMode ? "text-[var(--color-error)]" : "text-[var(--color-forest-green)]"}`}>
              {isDeleteMode ? "🗑️ ยืนยันการลบหน่วยงาน" : sectorData ? "แก้ไขหน่วยงาน / ภาคส่วน" : "เพิ่มหน่วยงาน / ภาคส่วน"}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-deep-text)] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* ── FORM CONTENT (ขยายขนาด Label เป็น text-base และช่องกรอกข้อมูลเป็น text-lg) ── */}
        <form onSubmit={handleSubmit}>
          <div className={`p-6 space-y-4 ${isDeleteMode ? "bg-[var(--color-error)]/5" : "bg-white"}`}>
            
            {/* รหัสหน่วยงาน (แสดงเฉพาะตอนแก้ไขหรือลบ) */}
            {formValues.id && (
              <div className="flex flex-col gap-1.5">
                <label className="text-base font-semibold text-[var(--color-deep-text)]">
                  รหัสหน่วยงาน
                </label>
                <input
                  type="text"
                  disabled
                  value={formValues.id}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-lg bg-[var(--color-surface-2)] text-[var(--color-muted-text)] font-mono font-bold cursor-not-allowed"
                />
              </div>
            )}

            {/* ชื่อหน่วยงาน / ภาคส่วน */}
            <div className="flex flex-col gap-1.5">
              <label className="text-base font-semibold text-[var(--color-deep-text)]">
                ชื่อหน่วยงาน / ภาคส่วน <span className="text-[var(--color-error)]">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น คณะเกษตรศาสตร์, สำนักงาน กปร."
                required
                disabled={isDeleteMode}
                value={formValues.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-lg focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] bg-white"
              />
            </div>

            {/* คำอธิบาย / รายละเอียดเพิ่มเติม */}
            <div className="flex flex-col gap-1.5">
              <label className="text-base font-semibold text-[var(--color-deep-text)]">
                คำอธิบาย / รายละเอียดเพิ่มเติม
              </label>
              <textarea
                rows="4"
                placeholder="ระบุรายละเอียดเพิ่มเติมเกี่ยวกับหน่วยงาน..."
                disabled={isDeleteMode}
                value={formValues.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-lg focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-none disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] bg-white text-[var(--color-deep-text)]"
              />
            </div>

          </div>

          {/* ── FOOTER ACTIONS (ปรับปุ่มกดให้มีมิติขนาดใหญ่ขึ้นในระดับ text-base) ── */}
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
              className={`px-5 py-2 text-base font-bold text-white rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer
                ${isDeleteMode
                  ? "bg-[var(--color-error)] hover:bg-[var(--color-error)]/90"
                  : "bg-[var(--color-green)] hover:bg-[var(--color-forest-green)]"
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