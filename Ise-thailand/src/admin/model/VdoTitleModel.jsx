import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";

export default function VdoTitleModel({ isOpen, onClose, videoData, mode, onSave }) {
  const initialFormState = {
    id: "",
    name: "", // ชื่อ เพิ่มวีดีโอหน้าแรก:
    url: ""   // url
  };

  const [formValues, setFormValues] = useState(initialFormState);
  
  // ตรวจเช็คสถานะโหมดลบเพื่อนำไปล็อคตัวกรอกข้อมูล
  const isDeleteMode = mode === "delete";

  useEffect(() => {
    if (isOpen) {
      if (videoData) {
        setFormValues({ ...videoData });
      } else {
        setFormValues(initialFormState);
      }
    }
  }, [isOpen, videoData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDeleteMode) {
      const result = await Swal.fire({
        title: 'ยืนยันการลบวิดีโอ?',
        text: `คุณต้องการลบวิดีโอ "${formValues.name}" ใช่หรือไม่?`,
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
      // ตรวจสอบ Validation เบื้องต้นตามรูปภาพ
      if (!formValues.name.trim() || !formValues.url.trim()) {
        Swal.fire({
          title: "ข้อมูลไม่ครบถ้วน",
          text: "โปรดระบุชื่อวิดีโอและ URL ให้ครบถ้วนก่อนบันทึก",
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
      
      {/* ── MODAL CONTAINER (ขนาดกลาง Medium Size สมดุลตามภาพ) ── */}
      <div className={`bg-white rounded-2xl shadow-2xl border w-full max-w-4xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200
        ${isDeleteMode ? "border-[var(--color-error)]/30" : "border-[var(--color-border)]"}`}
      >
        
        {/* ── HEADER (เลียนแบบหัวข้อจากในรูปภาพ) ── */}
        <header className="px-8 py-5 bg-white border-b border-[var(--color-surface-3)]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className={`text-2xl font-bold ${isDeleteMode ? "text-[var(--color-error)]" : "text-[var(--color-forest-green)]"}`}>
                {isDeleteMode ? "ลบวิดีโอหน้าแรก" : videoData ? "แก้ไขวีดีโอหน้าแรก" : "เพิ่มวีดีโอหน้าแรก"}
              </h2>
              <button 
                type="button" 
                onClick={onClose}
                className="text-sm font-medium text-slate-400 hover:text-[var(--color-green)] transition-colors mt-1"
              >
                [ ย้อนกลับ ]
              </button>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--color-disabled)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-deep-text)] transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* ── FORM CONTENT (ถอดรหัส input ตามภาพต้นฉบับเป๊ะ ๆ) ── */}
        <form onSubmit={handleSubmit}>
          <div className={`p-8 space-y-6 ${isDeleteMode ? "bg-red-50/10" : "bg-white"}`}>
            
            {/* 1. ชื่อ เพิ่มวีดีโอหน้าแรก: */}
            <div className="flex flex-col gap-2">
              <label className="text-base font-bold text-slate-700">ชื่อ เพิ่มวีดีโอหน้าแรก:</label>
              <input
                type="text"
                name="name"
                placeholder="กรอกชื่อสื่อวีดีโอ"
                required
                disabled={isDeleteMode}
                value={formValues.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg text-lg focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-white disabled:bg-[var(--color-surface-2)]"
              />
            </div>

            {/* 2. url */}
            <div className="flex flex-col gap-2">
              <label className="text-base font-bold text-slate-700">url</label>
              <input
                type="text"
                name="url"
                placeholder="https://www.youtube.com/watch?v=..."
                required
                disabled={isDeleteMode}
                value={formValues.url}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg text-lg font-mono focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-white disabled:bg-[var(--color-surface-2)] text-blue-600"
              />
            </div>

            {isDeleteMode && (
              <p className="text-sm font-bold text-[var(--color-error)] bg-red-50 p-4 rounded-xl border border-red-100">
                ⚠️ คำเตือน: วิดีโอนี้จะถูกถอดถอนออกจากการแสดงผลบนหน้าแรกของระบบทันที
              </p>
            )}

          </div>

          {/* ── FOOTER ACTIONS (ปุ่มบันทึกข้อมูลวางชิดขวาตามภาพต้นฉบับ) ── */}
          <footer className="px-8 py-5 border-t border-[var(--color-surface-3)] bg-[var(--color-surface)]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-base font-semibold text-[var(--color-muted-text)] border border-[var(--color-border)] hover:bg-white bg-[var(--color-surface)]/40 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className={`px-8 py-2 text-base font-bold text-white rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer
                ${isDeleteMode
                  ? "bg-[var(--color-error)] hover:bg-[var(--color-error)]/90 shadow-red-100"
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