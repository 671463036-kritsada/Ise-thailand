import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";

export default function TypeProjectModal({ isOpen, onClose, onSave, editData }) {
  const [formValues, setFormValues] = useState({ id: "", name: "" });

  // อัปเดตข้อมูลในฟอร์มเมื่อมีการส่ง editData เข้ามา (กรณีแก้ไข)
  useEffect(() => {
    if (editData) {
      setFormValues(editData);
    } else {
      setFormValues({ id: "", name: "" });
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ดักตรวจสอบค่าว่าง
    if (!formValues.name.trim()) {
      Swal.fire({
        title: "กรุณากรอกข้อมูล",
        text: "โปรดใส่ชื่อประเภทโครงการก่อนบันทึก",
        icon: "warning",
        confirmButtonColor: "var(--color-green)",
      });
      return;
    }

    // ส่งข้อมูลกลับไปให้หน้าหลักจัดการต่อ
    onSave(formValues);
    onClose(); // ปิด Modal
  };

  return (
    // ปรับแต่งโทนสีเบื้องหลังตามสไตล์สากลของระบบธีมธรรมชาติ (var จาก index.css)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40  font-sans antialiased text-[var(--color-deep-text)] animate-in fade-in duration-200">
      
      {/* ── MODAL CONTAINER (ปรับความกว้างสูงสุดเป็น max-w-lg กำลังดี) ── */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl border border-[var(--color-border)] overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* ── HEADER (ปรับขนาดฟอนต์หัวข้อขึ้นเป็น text-2xl เด่นชัด) ── */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[var(--color-surface-3)]">
          <h2 className="text-2xl font-bold text-[var(--color-forest-green)]">
            {editData ? "📝 แก้ไขประเภทโครงการ" : "✨ เพิ่มประเภทโครงการใหม่"}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-deep-text)] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* ── FORM CONTENT (ขยายขนาด Label เป็น text-base และช่องกรอกข้อความมีมิติเป็น text-lg) ── */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 bg-white">
            
            {/* แสดงกล่องรหัสประเภทโครงการ ด้านบนสุด (จะขึ้นเฉพาะเมื่อมี id เช่น โหมดแก้ไข) */}
            {formValues.id && (
              <div className="flex flex-col gap-1.5">
                <label className="block text-base font-semibold text-[var(--color-deep-text)]">
                  รหัสประเภทโครงการ
                </label>
                <input
                  type="text"
                  disabled
                  value={formValues.id}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-lg bg-[var(--color-surface-2)] text-[var(--color-muted-text)] font-mono font-bold cursor-not-allowed"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="block text-base font-semibold text-[var(--color-deep-text)]">
                ชื่อประเภทโครงการ <span className="text-[var(--color-error)]">*</span>
              </label>
              <input
                type="text"
                placeholder="ตัวอย่างเช่น โครงการพัฒนาด้านแหล่งน้ำ"
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-lg focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all placeholder:text-[var(--color-placeholder)] bg-white text-[var(--color-deep-text)] font-medium"
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
              className="px-5 py-2 text-base font-bold text-white bg-[var(--color-green)] hover:bg-[var(--color-forest-green)] rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              {editData ? "บันทึกการแก้ไข" : "ยืนยันเพิ่มข้อมูล"}
            </button>
          </footer>
        </form>

      </div>
    </div>
  );
}