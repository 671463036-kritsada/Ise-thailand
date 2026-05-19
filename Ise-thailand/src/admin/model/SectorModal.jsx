import { useState, useEffect } from "react";
import { X } from "lucide-react";

const initialForm = { sector_name: "", sector_name_eng: "" };

export default function SectorModal({ isOpen, onClose, onSave, editData }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (isOpen) {
      setForm(editData
        ? { sector_name: editData.sector_name, sector_name_eng: editData.sector_name_eng || "" }
        : initialForm
      );
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editData ? { ...form, sector_id: editData.sector_id } : form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 font-sans antialiased">
      <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-border)] w-full max-w-md overflow-hidden">

        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-surface-3)]">
          <h2 className="text-2xl font-bold text-[var(--color-forest-green)]">
            {editData ? "แก้ไขภาคส่วน" : "เพิ่มภาคส่วน"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">

            {editData && (
              <div className="flex flex-col gap-1.5">
                <label className="text-base font-semibold text-[var(--color-deep-text)]">รหัส</label>
                <input disabled value={editData.sector_id}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-base bg-[var(--color-surface-2)] text-[var(--color-muted-text)] font-mono font-bold cursor-not-allowed" />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-base font-semibold text-[var(--color-deep-text)]">
                ชื่อภาคส่วน (ไทย) <span className="text-[var(--color-error)]">*</span>
              </label>
              <input required type="text" placeholder="เช่น ภาคเหนือ"
                value={form.sector_name}
                onChange={e => setForm(f => ({ ...f, sector_name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] transition-all bg-white text-[var(--color-deep-text)]" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-base font-semibold text-[var(--color-deep-text)]">ชื่อภาคส่วน (อังกฤษ)</label>
              <input type="text" placeholder="เช่น Northern Region"
                value={form.sector_name_eng}
                onChange={e => setForm(f => ({ ...f, sector_name_eng: e.target.value }))}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] transition-all bg-white text-[var(--color-deep-text)]" />
            </div>

          </div>

          {/* FOOTER */}
          <footer className="px-6 py-4 border-t border-[var(--color-surface-3)] bg-[var(--color-surface)]/20 flex justify-end gap-3">
            <button type="button" onClick={onClose}
              className="px-5 py-2 text-base font-semibold text-[var(--color-muted-text)] border border-[var(--color-border)] rounded-xl hover:bg-white transition-colors cursor-pointer">
              ยกเลิก
            </button>
            <button type="submit"
              className="px-5 py-2 text-base font-bold text-white bg-[var(--color-green)] hover:bg-[var(--color-forest-green)] rounded-xl shadow-sm transition-all cursor-pointer">
              บันทึก
            </button>
          </footer>
        </form>

      </div>
    </div>
  );
}