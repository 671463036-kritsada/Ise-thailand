import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";

export default function ResearcherAllModel({ isOpen, onClose, researcherData, mode, onSave }) {
  // 1. กำหนดสถานะเริ่มต้นของฟอร์ม (ถอดฟิลด์ข้อมูลตามโครงร่างภาพหน้าจอแบบ 100%)
  const initialFormState = {
    id: "",
    prefix: "",               // คำนำหน้าชื่อ *
    firstName: "",            // ชื่อ *
    lastName: "",             // นามสกุล *
    sector_id: "",            // หน่วยงานสังกัด *
    idCard: "",               // หมายเลขบัตรประชาชน *
    address: "",              // ที่อยู่ เลขที่/อาคาร/หมู่
    province: "",             // จังหวัด *
    amphoe: "",               // อำเภอ *
    tambon: "",               // ตำบล *
    zipcode: "",              // รหัสไปรษณีย์ *
    email: "",                // Email Address *
    phone: "",                // เบอร์โทรศัพท์ *
    username: "",             // USERNAME *
    password: "",             // PASSWORD *
    status: "ปฏิบัติงานปกติ"     // สถานะภายในระบบ
  };

  const [formValues, setFormValues] = useState(initialFormState);
  const isDeleteMode = mode === "delete";

  // พรีโหลดข้อมูลกรณีเปิดโหมดแก้ไขหรือลบ
  useEffect(() => {
    if (isOpen) {
      if (researcherData) {
        setFormValues({ ...researcherData });
      } else {
        setFormValues(initialFormState);
      }
    }
  }, [isOpen, researcherData]);

  if (!isOpen) return null;

  // ฟังก์ชันตรวจจับการเปลี่ยนค่าภายในอินพุตฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isDeleteMode) {
      // ดักตรวจสอบ Validation ข้อมูลจำเป็นพื้นฐานตามที่ระบบดอกจันไว้
      if (!formValues.prefix || !formValues.firstName.trim() || !formValues.lastName.trim()) {
        Swal.fire({
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          text: "โปรดกรอกคำนำหน้าชื่อ ชื่อ และนามสกุลของนักวิจัย",
          icon: "warning",
          confirmButtonColor: "var(--color-green)"
        });
        return;
      }
    }

    onSave(formValues);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40  font-sans antialiased animate-fade-in text-[var(--color-deep-text)]">
      {/* ── MODAL CONTAINER (ปรับสัดส่วนกล่องฟอร์มแผ่กว้างสไตล์พรีเมียมรองรับฟิลด์จำนวนมาก) ── */}
      <div className={`bg-white w-full max-w-5xl rounded-2xl shadow-2xl border flex flex-col max-h-[92vh] overflow-hidden transform transition-all animate-in zoom-in-95 duration-200
        ${isDeleteMode ? "border-[var(--color-error)]/30" : "border-[var(--color-border)]"}`}
      >
        
        {/* ── HEADER MODAL ── */}
        <header className="px-6 py-4 border-b border-[var(--color-surface-3)] flex justify-between items-center bg-[var(--color-surface)]/30 shrink-0">
          <div>
            <h2 className={`text-2xl font-bold ${isDeleteMode ? "text-[var(--color-error)]" : "text-[var(--color-forest-green)]"}`}>
              {isDeleteMode ? "🗑️ ยืนยันการลบข้อมูลบุคลากรนักวิจัย" : researcherData ? "แก้ไขข้อมูลนักวิจัย" : "เพิ่มนักวิจัย"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--color-disabled)] hover:bg-slate-100 hover:text-[var(--color-deep-text)] transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* ── FORM CONTENT AREA (ถอดบล็อก Grid เรียงแถวตามรูปแบบหน้าจอเดิมเป๊ะๆ) ── */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-base">
          
          {isDeleteMode && (
            <div className="p-4 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl font-medium">
              ⚠️ ระบบกำลังดำเนินการลบประวัตินักวิจัย โปรดตรวจสอบข้อมูลด้านล่างก่อนกดยืนยันทำรายการลบถาวร
            </div>
          )}

          {/* แถวที่ 1: คำนำหน้าชื่อ | ชื่อ | นามสกุล */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">คำนำหน้าชื่อ *</label>
              <select
                name="prefix"
                value={formValues.prefix}
                onChange={handleInputChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] transition-all disabled:bg-[var(--color-surface-2)] cursor-pointer"
              >
                <option value="">-- เลือกคำนำหน้า --</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
                <option value="ดร.">ดร.</option>
                <option value="ผศ.ดร.">ผศ.ดร.</option>
                <option value="รศ.ดร.">รศ.ดร.</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">ชื่อ *</label>
              <input
                type="text"
                name="firstName"
                placeholder="กรอกชื่อจริง"
                value={formValues.firstName}
                onChange={handleInputChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] bg-white disabled:bg-[var(--color-surface-2)]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">นามสกุล *</label>
              <input
                type="text"
                name="lastName"
                placeholder="กรอกนามสกุล"
                value={formValues.lastName}
                onChange={handleInputChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] bg-white disabled:bg-[var(--color-surface-2)]"
              />
            </div>
          </div>

          {/* แถวที่ 2: หน่วยงานสังกัด | หมายเลขบัตรประชาชน | ที่อยู่ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">หน่วยงานสังกัด *</label>
              <select
                name="sector_id"
                value={formValues.sector_id}
                onChange={handleInputChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] transition-all disabled:bg-[var(--color-surface-2)] cursor-pointer"
              >
                <option value="ไม่ระบุ">ไม่ระบุ</option>
                <option value="SEC-001">มหาวิทยาลัยราชภัฏพระนครศรีอยุธยา</option>
                <option value="SEC-002">สถาบันบัณฑิตพัฒนบริหารศาสตร์</option>
                <option value="SEC-003">มหาวิทยาลัยราชภัฏเชียงราย</option>
                <option value="SEC-004">มหาวิทยาลัยราชภัฏยะลา</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">หมายเลขบัตรประชาชน *</label>
              <input
                type="text"
                name="idCard"
                maxLength={13}
                placeholder="-"
                value={formValues.idCard}
                onChange={handleInputChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base font-mono focus:outline-none focus:border-[var(--color-border-focus)] bg-white disabled:bg-[var(--color-surface-2)]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">ที่อยู่ เลขที่/อาคาร/หมู่ :</label>
              <input
                type="text"
                name="address"
                placeholder="-"
                value={formValues.address}
                onChange={handleInputChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] bg-white disabled:bg-[var(--color-surface-2)]"
              />
            </div>
          </div>

          {/* แถวที่ 3: จังหวัด | อำเภอ | ตำบล | รหัสไปรษณีย์ (จัด 4 คอลัมน์ย่อยเรียงระเบียบเรียบร้อย) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">จังหวัด *</label>
              <select
                name="province"
                value={formValues.province}
                onChange={handleInputChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none cursor-pointer disabled:bg-[var(--color-surface-2)]"
              >
                <option value="">-กรุณาเลือกจังหวัด-</option>
                <option value="เชียงใหม่">เชียงใหม่</option>
                <option value="ลำพูน">ลำพูน</option>
                <option value="พระนครศรีอยุธยา">พระนครศรีอยุธยา</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">อำเภอ *</label>
              <select
                name="amphoe"
                value={formValues.amphoe}
                onChange={handleInputChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none cursor-pointer disabled:bg-[var(--color-surface-2)]"
              >
                <option value="">-โปรดเลือกอำเภอ-</option>
                <option value="เมือง">เมือง</option>
                <option value="ป่าซาง">ป่าซาง</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">ตำบล *</label>
              <select
                name="tambon"
                value={formValues.tambon}
                onChange={handleInputChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none cursor-pointer disabled:bg-[var(--color-surface-2)]"
              >
                <option value="">-โปรดเลือกตำบล-</option>
                <option value="สุเทพ">สุเทพ</option>
                <option value="แม่แรง">แม่แรง</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">รหัสไปรษณีย์ *</label>
              <input
                type="text"
                name="zipcode"
                placeholder="-"
                value={formValues.zipcode}
                onChange={handleInputChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base font-mono focus:outline-none focus:border-[var(--color-border-focus)] bg-white disabled:bg-[var(--color-surface-2)]"
              />
            </div>
          </div>

          {/* แถวที่ 4: Email Address | เบอร์โทรศัพท์ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="-"
                value={formValues.email}
                onChange={handleInputChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] bg-white disabled:bg-[var(--color-surface-2)]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์ *</label>
              <input
                type="text"
                name="phone"
                placeholder="-"
                value={formValues.phone}
                onChange={handleInputChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base font-mono focus:outline-none focus:border-[var(--color-border-focus)] bg-white disabled:bg-[var(--color-surface-2)]"
              />
            </div>
          </div>

          {/* แถวที่ 5: USERNAME * | PASSWORD * */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">USERNAME *</label>
              <input
                type="text"
                name="username"
                placeholder="-"
                value={formValues.username}
                onChange={handleInputChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] bg-white disabled:bg-[var(--color-surface-2)]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">PASSWORD *</label>
              <input
                type="password"
                name="password"
                placeholder="."
                value={formValues.password}
                onChange={handleInputChange}
                disabled={isDeleteMode}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] bg-white disabled:bg-[var(--color-surface-2)]"
              />
            </div>
          </div>

        </form>

        {/* ── FOOTER ACTIONS BUTTONS ── */}
        <footer className="px-6 py-4 border-t border-[var(--color-surface-3)] bg-[var(--color-surface)]/40 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-base font-semibold text-[var(--color-muted-text)] bg-white border border-[var(--color-border)] rounded-xl shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`px-6 py-2 text-base font-bold text-white rounded-xl transition-all shadow-md active:scale-95 cursor-pointer
              ${isDeleteMode
                ? "bg-[var(--color-error)] hover:bg-[var(--color-error)]/90"
                : "bg-[var(--color-green)] hover:bg-[var(--color-forest-green)]"
              }`}
          >
            {isDeleteMode ? "ยืนยันการลบข้อมูล" : "บันทึกข้อมูล"}
          </button>
        </footer>

      </div>
    </div>
  );
}