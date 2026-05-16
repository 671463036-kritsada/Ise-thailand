import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";

export default function ProjectAllModel({ isOpen, onClose, projectData, mode, onSave }) {
  // 1. กำหนดสถานะฟิลด์ข้อมูลทั้งหมด (นำฟิลด์รูปภาพออกจากโครงสร้างประมวลผล)
  const initialFormState = {
    id: "",
    name: "",             // ชื่อโครงการ (ไทย) *
    name_eng: "",         // ชื่อโครงการ (Eng) *
    year: "2665",         // ปีงบประมาณ *
    phase: "1",           // เฟส *
    type_id: "",          // ประเภทโครงการ *
    leader_name: "",      // หัวหน้าโครงการ *
    start_date: "2026-05-16", // วันที่เริ่มโครงการ *
    end_date: "2026-05-16",   // วันที่สิ้นสุดโครงการ *
    status: "ยื่นข้อเสนอ",     // สถานะ *
    province: "ไม่ระบุ",    // จังหวัด *
    amphoe: "ไม่ระบุ",      // อำเภอ *
    tambon: "ไม่ระบุ",      // ตำบล *
    sections: [
      { id: 1, title: "หลักการและเหตุผล", description: "" }, // เหลือเพียงฟิลด์ข้อความบรรยายรายละเอียด
      { id: 2, title: "วัตถุประสงค์", description: "" },
      { id: 3, title: "แนวทางการดำเนินงาน", description: "" },
      { id: 4, title: "ขอบเขตการดำเนินงาน", description: "" },
      { id: 5, title: "เป้าหมายของแผนงานย่อย", description: "" },
      { id: 6, title: "ตัวชี้วัดความสำเร็จของโครงการ", description: "" },
      { id: 7, title: "ผลผลิตระดับกิจกรรม", description: "" },
      { id: 8, title: "ผลงานที่ต้องส่งมอบ", description: "" }
    ],
    budget_total: "",     // วงเงินงบประมาณ * (บาท)
    budget_paid: "0",     // การเบิกจ่าย * (บาท)
    duration_year: "1",   // ระยะเวลาในการดำเนินงาน (ปี)
    pdf_file: "",         // ไฟล์แนบ (pdf)
    source: ""            // แหล่งอ้างอิงข้อมูลท้ายฟอร์ม
  };

  const [formValues, setFormValues] = useState(initialFormState);
  
  // ตรวจสอบสถานะโหมดลบเพื่อล็อกอินพุตฟอร์มทั้งหมด
  const isDeleteMode = mode === "delete";

  useEffect(() => {
    if (isOpen) {
      if (projectData) {
        setFormValues({ ...projectData });
      } else {
        setFormValues(initialFormState);
      }
    }
  }, [isOpen, projectData]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSectionTextChange = (index, field, value) => {
    const updatedSections = [...formValues.sections];
    updatedSections[index][field] = value;
    setFormValues((prev) => ({ ...prev, sections: updatedSections }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isDeleteMode) {
      onSave(formValues);
      onClose();
      return;
    }

    if (!formValues.name.trim()) {
      Swal.fire({ title: "กรุณากรอกข้อมูล", text: "โปรดใส่ชื่อโครงการ (ไทย)", icon: "warning", confirmButtonColor: "var(--color-green)" });
      return;
    }

    onSave(formValues);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-surface)] transition-all duration-300 animate-in fade-in zoom-in-95 font-sans antialiased text-[var(--color-deep-text)]">
      
      {/* ── HEADER ปรับเปลี่ยนสีตามสถานะโหมดการกดยืนยันรายการ ────────────────── */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[var(--color-surface-3)] shrink-0 shadow-sm">
        <div>
          {/* ปรับขนาดหัวข้อหลักจาก text-4xl เหลือ text-2xl ให้กระชับขึ้น */}
          <h1 className={`text-2xl font-bold ${isDeleteMode ? "text-[var(--color-error)]" : "text-[var(--color-forest-green)]"}`}>
            {isDeleteMode ? "🗑️ ตรวจสอบข้อมูลก่อนยืนยันการลบโครงการ" : formValues.id ? "แก้ไขโครงการพระราชดำริ" : "เพิ่มโครงการพระราชดำริ"}
          </h1>
          {/* ปรับขนาดคำอธิบายย่อยจาก text-2xl เหลือ text-sm */}
          <p className="text-sm text-[var(--color-muted-text)] font-medium mt-0.5">
            {isDeleteMode ? "โปรดตรวจสอบเนื้อหาด้านล่างนี้ให้ถี่ถ้วนก่อนกดปุ่มยืนยันการลบออก" : "กรอกข้อมูลรายละเอียดโครงการเพื่อบันทึกเข้าสู่ระบบ"}
          </p>
        </div>
        
        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg text-[var(--color-muted-text)] hover:bg-[var(--color-surface-3)]/50 hover:text-[var(--color-deep-text)] transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      {/* ── CONTENT / FORM ────────────────── */}
      <main className="flex-1 overflow-y-auto p-6 max-w-[95rem] mx-auto w-full">
        <div className={`bg-white border rounded-2xl shadow-sm p-5 md:p-6 ${isDeleteMode ? "border-[var(--color-error)]/30 bg-[var(--color-error)]/5" : "border-[var(--color-border)]"}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ข้อมูลพื้นฐานโครงการ */}
            <div className="space-y-4">

              {formValues.id && (
                <div className="flex flex-col gap-1">
                  {/* ย่อขนาด label จาก text-2xl เหลือ text-sm และบีบ input เหลือ text-base */}
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                    รหัสโครงการ
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formValues.id}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-[var(--color-surface-2)] text-[var(--color-muted-text)] font-bold cursor-not-allowed"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                    ชื่อโครงการ (ไทย) <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <input type="text" required disabled={isDeleteMode} placeholder="-" value={formValues.name} onChange={(e) => handleChange("name", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                    ชื่อโครงการ (Eng) <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <input type="text" required disabled={isDeleteMode} placeholder="-" value={formValues.name_eng} onChange={(e) => handleChange("name_eng", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">ปีงบประมาณ <span className="text-[var(--color-error)]">*</span></label>
                  <input type="number" required disabled={isDeleteMode} value={formValues.year} onChange={(e) => handleChange("year", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base font-mono focus:outline-none bg-white disabled:bg-[var(--color-surface-2)] text-[var(--color-deep-text)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">เฟส <span className="text-[var(--color-error)]">*</span></label>
                  <input type="number" required disabled={isDeleteMode} value={formValues.phase} onChange={(e) => handleChange("phase", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base font-mono focus:outline-none bg-white disabled:bg-[var(--color-surface-2)] text-[var(--color-deep-text)]" />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">ประเภทโครงการ <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode} value={formValues.type_id} onChange={(e) => handleChange("type_id", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none cursor-pointer disabled:bg-[var(--color-surface-2)] text-[var(--color-deep-text)]">
                    <option value="">-ไม่ระบุ-</option>
                    <option value="CAT-001">โครงการพัฒนาด้านแหล่งน้ำ</option>
                    <option value="CAT-002">โครงการพัฒนาด้านการเกษตร</option>
                    <option value="CAT-003">โครงการพัฒนาด้านสิ่งแวดล้อม</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">หัวหน้าโครงการ <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode} value={formValues.leader_name} onChange={(e) => handleChange("leader_name", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none cursor-pointer disabled:bg-[var(--color-surface-2)] text-[var(--color-deep-text)]">
                    <option value="">--กรุณาเลือกหัวหน้าโครงการ--</option>
                    <option value="อัจฉรา โยมสินธุ์">อัจฉรา โยมสินธุ์</option>
                    <option value="กัลยาณีย์ เสนาสุ">กัลยาณีย์ เสนาสุ</option>
                    <option value="ณดา จันทร์สม">ณดา จันทร์สม</option>
                    <option value="ปริยศ สิทธิสรวง">ปริยศ สิทธิสรวง</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">สถานะ <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode} value={formValues.status} onChange={(e) => handleChange("status", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none font-bold cursor-pointer disabled:bg-[var(--color-surface-2)] text-[var(--color-deep-text)]">
                    <option value="ยื่นข้อเสนอ">ยื่นข้อเสนอ</option>
                    <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                    <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                    <option value="ปิดโครงการ">ปิดโครงการ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">วันที่เริ่มโครงการ <span className="text-[var(--color-error)]">*</span></label>
                  <input type="date" required disabled={isDeleteMode} value={formValues.start_date} onChange={(e) => handleChange("start_date", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base font-mono focus:outline-none bg-white disabled:bg-[var(--color-surface-2)] text-[var(--color-deep-text)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">วันที่สิ้นสุดโครงการ <span className="text-[var(--color-error)]">*</span></label>
                  <input type="date" required disabled={isDeleteMode} value={formValues.end_date} onChange={(e) => handleChange("end_date", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base font-mono focus:outline-none bg-white disabled:bg-[var(--color-surface-2)] text-[var(--color-deep-text)]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">จังหวัด <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode} value={formValues.province} onChange={(e) => handleChange("province", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] cursor-pointer"><option value="ไม่ระบุ">ไม่ระบุ</option><option value="chiangmai">เชียงใหม่</option></select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">อำเภอ <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode} value={formValues.amphoe} onChange={(e) => handleChange("amphoe", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] cursor-pointer"><option value="ไม่ระบุ">-ไม่ระบุ-</option><option value="เมือง">เมือง</option><option value="แม่พริก">แม่พริก</option><option value="ฝาง">ฝาง</option></select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">ตำบล <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode} value={formValues.tambon} onChange={(e) => handleChange("tambon", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] cursor-pointer"><option value="ไม่ระบุ">-ไม่ระบุ-</option><option value="สุเทพ">สุเทพ</option><option value="แม่พริก">แม่พริก</option><option value="ศรีดงเย็น">ศรีดงเย็น</option></select>
                </div>
              </div>
            </div>

            <hr className="border-[var(--color-surface-3)]" />

            {/* ── SECTIONS BLOCK: ส่วนของเนื้อหาบรรยายรายละเอียดย่นฟอนต์เป็น text-lg ── */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[var(--color-forest-green)] mb-1">
                📋 รายละเอียดเนื้อหาและแผนงานย่อยของโครงการ
              </h3>
              {formValues.sections.map((section, index) => {
                const num = index + 1;
                return (
                  <div key={num} className="flex flex-col gap-1 pt-1 border-b border-dashed border-[var(--color-surface-3)] pb-4 last:border-none">
                    <label className="text-base font-bold text-slate-700">{section.title} {num === 1 && <span className="text-[var(--color-error)]">*</span>}</label>
                    <textarea 
                      rows={6} 
                      placeholder={`พิมพ์เนื้อหารายละเอียดส่วนของ ${section.title}...`} 
                      required={num === 1} 
                      disabled={isDeleteMode} 
                      value={section.description} 
                      onChange={(e) => handleSectionTextChange(index, "description", e.target.value)} 
                      className="w-full min-h-[120px] px-3 py-2 border border-[var(--color-border)] rounded-xl text-lg focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-y text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] bg-white" 
                    />
                  </div>
                );
              })}
            </div>

            <hr className="border-[var(--color-surface-3)]" />

            {/* ส่วนท้ายฟอร์ม */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">วงเงินงบประมาณ * (บาท)</label>
                  <input type="text" disabled={isDeleteMode} value={formValues.budget_total} onChange={(e) => handleChange("budget_total", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base font-mono bg-white disabled:bg-[var(--color-surface-2)] text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">การเบิกจ่าย * (บาท)</label>
                  <input type="text" disabled={isDeleteMode} value={formValues.budget_paid} onChange={(e) => handleChange("budget_paid", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base font-mono bg-white disabled:bg-[var(--color-surface-2)] text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">ระยะเวลาในการดำเนินงาน (ปี)</label>
                  <input type="number" disabled={isDeleteMode} value={formValues.duration_year} onChange={(e) => handleChange("duration_year", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base font-mono bg-white disabled:bg-[var(--color-surface-2)] text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)]" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-deep-text)]">ไฟล์แนบ (pdf)</label>
                <div className="w-full border border-[var(--color-border)] p-3 rounded-xl bg-[var(--color-surface-2)] flex items-center gap-2">
                  <input type="file" accept=".pdf" disabled={isDeleteMode} className="text-base text-[var(--color-deep-text)] cursor-pointer disabled:cursor-not-allowed" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-deep-text)]">แหล่งอ้างอิงข้อมูล <span className="text-[var(--color-error)]">*</span></label>
                <textarea rows="3" placeholder="ระบุแหล่งที่มาหรือแหล่งอ้างอิงของข้อมูล..." required disabled={isDeleteMode} value={formValues.source} onChange={(e) => handleChange("source", e.target.value)} className="w-full min-h-[160px] px-3 py-2 border border-[var(--color-border)] rounded-xl text-lg focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-y text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] bg-white" />
              </div>
            </div>

            {/* ปุ่มทำรายการสิ้นสุดฟอร์ม */}
            <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-surface-3)]">
              <button 
                type="submit" 
                className={`px-6 py-2.5 text-xl font-semibold text-white rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer
                  ${isDeleteMode 
                    ? "bg-[var(--color-error)] hover:bg-[var(--color-error)]/90 shadow-[var(--color-error)]/20" 
                    : "bg-[var(--color-green)] hover:bg-[var(--color-forest-green)] shadow-[var(--color-green-light)]/30"
                  }`}
              >
                {isDeleteMode ? "ยืนยันการลบข้อมูลโครงการนี้" : "บันทึกข้อมูล"}
              </button>
              <button 
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xl font-semibold text-[var(--color-muted-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] rounded-xl transition-colors cursor-pointer"
              >
                ยกเลิกและย้อนกลับ
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}