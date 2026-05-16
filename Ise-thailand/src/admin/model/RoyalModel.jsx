import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import Swal from 'sweetalert2';

export default function RoyalModel({ isOpen, onClose, projectData, mode, onSave }) {
  const initialFormState = {
    id: "",
    name: "",
    category: "",
    province: "",
    amphoe: "",
    tambon: "",
    sections: [
      { id: 1, title: "", description: "", img: "" },
      { id: 2, title: "", description: "", img: "" },
      { id: 3, title: "", description: "", img: "" },
      { id: 4, title: "", description: "", img: "" },
      { id: 5, title: "", description: "", img: "" }
    ],
    infographic: "",
    source: ""
  };

  const [formValues, setFormValues] = useState(initialFormState);
  
  // ตรวจเช็คสถานะโหมดลบเพื่อนำไปล็อคตัวกรอกข้อมูล (เป็น true เมื่ออยู่ในโหมด delete)
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

  const handleSectionChange = (index, field, value) => {
    setFormValues((prev) => {
      const updatedSections = [...prev.sections];
      updatedSections[index] = { ...updatedSections[index], [field]: value };
      return { ...prev, sections: updatedSections };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. กรณีเป็นโหมดลบข้อมูล: แสดง Modal ป๊อปอัพสุดสวย
    if (isDeleteMode) {
      const result = await Swal.fire({
        title: 'คุณแน่ใจใช่ไหม?',
        text: `ต้องการลบข้อมูลโครงการ "${formValues.name}" ออกจากระบบถาวร?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--color-error)', // ผูกตัวแปรสีจาก index.css
        cancelButtonColor: 'var(--color-muted-text)',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก',
        reverseButtons: true , // เอาปุ่มยกเลิกไว้ซ้าย ปุ่มยืนยันไว้ขวา
        customClass: {
          title: 'text-2xl font-bold text-[var(--color-deep-text)]', 
          htmlContainer: 'text-base text-[var(--color-muted-text)]',    
          confirmButton: 'text-base px-5 py-2',     
          cancelButton: 'text-base px-5 py-2'       
        }
      });

      if (!result.isConfirmed) return;
    }

    onSave(formValues);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-surface)] transition-all duration-300 animate-in fade-in zoom-in-95 font-sans antialiased text-[var(--color-deep-text)]">
      
      {/* ── HEADER ปรับเปลี่ยนสีและหัวข้อตามโหมด (ปรับขนาดฟอนต์กระชับลงเหลือ text-2xl และ text-sm) ── */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[var(--color-surface-3)] shrink-0 shadow-sm">
        <div>
          <h1 className={`text-2xl font-bold ${isDeleteMode ? "text-[var(--color-error)]" : "text-[var(--color-forest-green)]"}`}>
            {isDeleteMode ? "🗑️ ตรวจสอบข้อมูลก่อนยืนยันการลบโครงการ" : projectData ? "แก้ไขโครงการพระราชดำริ" : "เพิ่มโครงการพระราชดำริ"}
          </h1>
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

      {/* ── CONTENT / FORM (แนบสไตล์ย่อขนาดอินพุตฟอร์มให้เล็กลง) ── */}
      <main className="flex-1 overflow-y-auto p-6 max-w-[95rem] mx-auto w-full">
        <div className={`bg-white border rounded-2xl shadow-sm p-5 md:p-6 ${isDeleteMode ? "border-[var(--color-error)]/30 bg-[var(--color-error)]/5" : "border-[var(--color-border)]"}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ข้อมูลพื้นฐานโครงการ */}
            <div className="space-y-4">

              {formValues.id && (
                <div className="flex flex-col gap-1">
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
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                  ประเภทโครงการ <span className="text-[var(--color-error)]">*</span>
                </label>
                <select 
                  required
                  disabled={isDeleteMode} 
                  value={formValues.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full md:w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] cursor-pointer disabled:cursor-not-allowed"
                >
                  <option value="">-กรุณาเลือก-</option>
                  <option value="1">โครงการพัฒนาด้านแหล่งน้ำ</option>
                  <option value="2">โครงการพัฒนาด้านการเกษตร</option>
                  <option value="3">โครงการพัฒนาด้านสิ่งแวดล้อม</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                  ชื่อโครงการ <span className="text-[var(--color-error)]">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="กรอกชื่อโครงการ" 
                  required
                  disabled={isDeleteMode} 
                  value={formValues.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]"
                />
              </div>

              {/* ที่อยู่: จังหวัด อำเภอ ตำบล Dropdown แถวเดียวกัน */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">จังหวัด <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode} value={formValues.province} onChange={(e) => handleChange("province", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] cursor-pointer"><option value="">-กรุณาเลือกจังหวัด-</option><option value="chiangmai">เชียงใหม่</option></select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">อำเภอ <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode} value={formValues.amphoe} onChange={(e) => handleChange("amphoe", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] cursor-pointer"><option value="">-กรุณาเลือกอำเภอ-</option><option value="เมือง">เมือง</option><option value="แม่พริก">แม่พริก</option><option value="ฝาง">ฝาง</option></select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">ตำบล <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode} value={formValues.tambon} onChange={(e) => handleChange("tambon", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] cursor-pointer"><option value="">-กรุณาเลือกตำบล-</option><option value="สุเทพ">สุเทพ</option><option value="แม่พริก">แม่พริก</option><option value="ศรีดงเย็น">ศรีดงเย็น</option></select>
                </div>
              </div>
            </div>

            <hr className="border-[var(--color-surface-3)]" />

            {/* ส่วนเนื้อหาที่ 1 ถึง 5 วนลูป (ย่อยฟอนต์หัวเรื่องและเนื้อหาเหลือ text-base / text-lg) */}
            <div className="space-y-6">
              {formValues.sections.map((section, index) => {
                const num = index + 1;
                return (
                  <div key={num} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 border-b border-dashed border-[var(--color-surface-3)] pb-4 last:border-none">
                    <div className="md:col-span-1 space-y-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[var(--color-deep-text)]">ส่วนที่ {num} หัวข้อ {num === 1 && <span className="text-[var(--color-error)]">*</span>}</label>
                        <input type="text" placeholder={`ระบุหัวข้อส่วนที่ ${num}`} required={num === 1} disabled={isDeleteMode} value={section.title} onChange={(e) => handleSectionChange(index, "title", e.target.value)} className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[var(--color-deep-text)]">รูปประกอบ {num === 1 && <span className="text-[var(--color-error)]">*</span>}</label>
                        <div className={`relative flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed border-[var(--color-border)] rounded-xl p-2 bg-[var(--color-surface)]/30 overflow-hidden ${isDeleteMode ? "cursor-not-allowed" : "cursor-pointer hover:bg-[var(--color-surface-2)]"}`}>
                          <input type="file" accept="image/*" disabled={isDeleteMode} onChange={(e) => { const file = e.target.files[0]; if (file) { handleSectionChange(index, "img", URL.createObjectURL(file)); } }} className="absolute inset-0 w-full h-full opacity-0 disabled:cursor-not-allowed z-10 cursor-pointer" />
                          {section.img ? (
                            <div className="relative w-full h-full flex flex-col items-center justify-center gap-1.5 p-0.5">
                              <img src={section.img} alt={`Preview ส่วนที่ ${num}`} className="max-h-56 object-contain rounded-lg shadow-sm border border-[var(--color-surface-3)] bg-white" />
                              {!isDeleteMode && <span className="text-xs font-semibold text-[var(--color-green)]">คลิกที่รูปเพื่อเปลี่ยนรูปใหม่</span>}
                            </div>
                          ) : (
                            <div className="text-center flex flex-col items-center gap-1 py-2">
                              <Upload className="w-6 h-6 text-[var(--color-disabled)]" />
                              <span className="text-sm font-medium text-[var(--color-muted-text)]">ไม่มีรูปภาพประกอบ</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-1">
                      <label className="text-sm font-semibold text-[var(--color-deep-text)]">รายละเอียดส่วนที่ {num} {num === 1 && <span className="text-[var(--color-error)]">*</span>}</label>
                      <textarea rows="8" placeholder={`พิมพ์เนื้อหารายละเอียดส่วนที่ ${num}...`} required={num === 1} disabled={isDeleteMode} value={section.description} onChange={(e) => handleSectionChange(index, "description", e.target.value)} className="w-full min-h-[160px] px-3 py-2 border border-[var(--color-border)] rounded-xl text-lg focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-y disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] text-[var(--color-deep-text)] bg-white" />
                    </div>
                  </div>
                );
              })}
            </div>

            <hr className="border-[var(--color-surface-3)]" />

            {/* ส่วนท้ายฟอร์ม: Infographic & แหล่งอ้างอิงข้อมูล */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-deep-text)]">Infographic <span className="text-[var(--color-error)]">*</span></label>
                <div className={`relative flex items-center justify-center w-full md:w-1/2 border-2 border-dashed border-[var(--color-border)] rounded-xl p-3 bg-[var(--color-surface)]/30 ${isDeleteMode ? "cursor-not-allowed" : "cursor-pointer hover:bg-[var(--color-surface-2)]"}`}>
                  <input type="file" accept="image/*" disabled={isDeleteMode} className="absolute inset-0 w-full h-full opacity-0 disabled:cursor-not-allowed z-10 cursor-pointer" />
                  <div className="text-center flex flex-col items-center gap-1">
                    <Upload className="w-6 h-6 text-[var(--color-disabled)]" />
                    <span className="text-sm font-semibold text-[var(--color-muted-text)]">{isDeleteMode ? "ไฟล์รูปภาพ Infographic" : "อัปโหลดรูปภาพ Infographic"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-deep-text)]">แหล่งอ้างอิงข้อมูล <span className="text-[var(--color-error)]">*</span></label>
                <textarea rows="3" placeholder="ระบุแหล่งที่มาหรือแหล่งอ้างอิงของข้อมูล..." required disabled={isDeleteMode} value={formValues.source} onChange={(e) => handleChange("source", e.target.value)} className="w-full min-h-[160px] px-3 py-2 border border-[var(--color-border)] rounded-xl text-lg focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-y disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] bg-white text-[var(--color-deep-text)]" />
              </div>
            </div>

            {/* ปุ่มส่งฟอร์ม */}
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