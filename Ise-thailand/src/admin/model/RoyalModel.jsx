import { useState, useEffect, useRef } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";

// ── helper: สร้าง input file + preview ──
function ImageUploadField({ label, fieldName, currentFileName, fileValue, onChange, onClear, disabled, required }) {
  const inputRef = useRef(null);

  // ตรวจสอบ URL สำหรับแสดงภาพตัวอย่าง
  const previewUrl = fileValue
    ? URL.createObjectURL(fileValue)
    : currentFileName
      ? `/uploads/${currentFileName}` // ปรับ base path ให้ตรงกับ server
      : null;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-[var(--color-deep-text)]">
          {label} {required && <span className="text-[var(--color-error)]">*</span>}
        </label>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* ── 1. ส่วนแสดงรูปตัวอย่าง (Preview Area) ── */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-2)] flex items-center justify-center">
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-4">
              <ImageIcon className="w-8 h-8 text-[var(--color-disabled)] mx-auto mb-1" />
              <p className="text-xs text-[var(--color-disabled)]">ไม่มีรูปภาพ</p>
            </div>
          )}
        </div>

        {/* ── 2. ส่วนปุ่มควบคุมการอัปโหลด/ลบรูปภาพ (Control Area) ── */}
        <div className="flex flex-col justify-center gap-2">
          {!disabled && (
            <>
              {/* ปุ่มเลือกรูปภาพใหม่ (กดเปลี่ยนได้ตลอดเวลา) */}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-border-focus)] bg-[var(--color-surface)] hover:bg-[var(--color-green-light)]/10 transition-all cursor-pointer text-sm font-medium text-[var(--color-deep-text)]"
              >
                <Upload className="w-4 h-4 text-[var(--color-muted-text)]" />
                <span>{previewUrl ? "เปลี่ยนรูปภาพใหม่" : "คลิกเพื่อเลือกรูปภาพ"}</span>
              </button>

              {/* ปุ่มลบรูปภาพ (จะแสดงขึ้นมาเมื่อมีรูปในระบบหรือรูปที่พึ่งเลือก) */}
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => {
                    onClear();
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-[var(--color-error)]/30 text-[var(--color-error)] bg-[var(--color-error)]/5 hover:bg-[var(--color-error)]/10 transition-colors cursor-pointer text-sm font-medium"
                >
                  <X className="w-4 h-4" />
                  <span>ลบรูปภาพนี้</span>
                </button>
              )}
            </>
          )}

          {/* แสดงชื่อไฟล์ที่เลือกจากเครื่องคอมพิวเตอร์ */}
          {fileValue && (
            <p className="text-xs text-[var(--color-muted-text)] bg-[var(--color-surface-2)] p-2 rounded-lg truncate mt-1">
              📎 {fileValue.name}
            </p>
          )}
        </div>
      </div>

      {/* Input File ซ่อนไว้ */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
        }}
      />
    </div>
  );
}

export default function RoyalModel({ isOpen, onClose, projectData, mode, onSave }) {
  const initialFormState = {
    royal_name: "",
    type_id: "",
    province_id: "",
    amphure_id: "",
    district_id: "",
    img_banner: "",
    title_1: "", img_1: "", detail_1: "",
    title_2: "", img_2: "", detail_2: "",
    title_3: "", img_3: "", detail_3: "",
    title_4: "", img_4: "", detail_4: "",
    title_5: "", img_5: "", detail_5: "",
    infographic: "",
    reference: "",
    latitude: "",
    longitude: "",
    royal_name_eng: "",
    title_1_eng: "", detail_1_eng: "",
    title_2_eng: "", detail_2_eng: "",
    title_3_eng: "", detail_3_eng: "",
    title_4_eng: "", detail_4_eng: "",
    title_5_eng: "", detail_5_eng: "",
    reference_eng: "",
  };

  // state แยก: formValues = ข้อมูล text, fileValues = File objects
  const [formValues, setFormValues] = useState(initialFormState);
  const [fileValues, setFileValues] = useState({}); // { img_banner: File, img_1: File, ... }
  const [types, setTypes] = useState([]);
  const isDeleteMode = mode === "delete";

  // 🔄 สเตทดักจับจังหวะการส่งข้อมูลป้องกันการกดเบิ้ลคลิก
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    api.get("/royal/types")
      .then((res) => setTypes(res.data?.data ?? []))
      .catch((err) => console.error("โหลด types ไม่สำเร็จ", err));
  }, []);

  useEffect(() => {
    api.get("/project/provinces").then(res => setProvinces(res.data.data || []));
  }, []);

  useEffect(() => {
    if (formValues.province_id) {
      api.get(`/project/amphures/${formValues.province_id}`)
        .then(res => setAmphures(res.data.data || []));
    } else {
      setAmphures([]);
      setDistricts([]);
    }
  }, [formValues.province_id]);

  useEffect(() => {
    if (formValues.amphure_id) {
      api.get(`/project/districts/${formValues.amphure_id}`)
        .then(res => setDistricts(res.data.data || []));
    } else {
      setDistricts([]);
    }
  }, [formValues.amphure_id]);

  useEffect(() => {
    if (isOpen) {
      setFormValues(projectData ? { ...projectData } : initialFormState);
      setFileValues({}); // reset files ทุกครั้งที่เปิด modal
      setIsSubmitting(false); // 🔄 เคลียร์สเตทซับมิตเมื่อเปิดหน้าต่างใหม่
    }
  }, [isOpen, projectData]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  // set File object ลง fileValues
  const handleFileChange = (field, file) => {
    setFileValues((prev) => ({ ...prev, [field]: file }));
  };

  // ลบไฟล์ที่เลือก + ล้างชื่อไฟล์เดิม (ถ้าต้องการลบรูปเดิมด้วย ให้ส่ง flag ไป API เอง)
  const handleFileClear = (field) => {
    setFileValues((prev) => { const next = { ...prev }; delete next[field]; return next; });
    // ถ้าต้องการล้างชื่อไฟล์เดิมด้วย: handleChange(field, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔄 ถ้าปุ่มโดนบล็อกอยู่จากซับมิตก่อนหน้า ไม่ให้ทำซ้ำอีก
    if (isSubmitting) return;

    if (isDeleteMode) {
      const result = await Swal.fire({
        title: "คุณแน่ใจใช่ไหม?",
        text: `ต้องการลบโครงการ "${formValues.royal_name}" ออกจากระบบถาวร?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--color-error)",
        cancelButtonColor: "var(--color-muted-text)",
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ยกเลิก",
        reverseButtons: true,
      });
      if (!result.isConfirmed) return;
    }

    try {
      setIsSubmitting(true); // 🔄 บล็อกการคลิกเพิ่มเติมทันทีหลังกดปุ่ม
      
      // ส่งออกทั้ง formValues และ fileValues ให้ parent จัดการ FormData
      // เติมคำสั่ง await เพื่อให้กระบวนการฝั่ง parent ทำเสร็จสิ้นก่อนล้างสเตท
      await onSave({ formValues, fileValues });
      
    } catch (error) {
      console.error("เกิดข้อผิดพลาดตอนบันทึกข้อมูล:", error);
      setIsSubmitting(false); // 🔄 ปลดล็อกปุ่มให้กดใหม่ได้หากเกิด Error ระหว่างทาง
    }
  };

  const sections = [1, 2, 3, 4, 5].map((n) => ({
    num: n,
    title: formValues[`title_${n}`],
    img: formValues[`img_${n}`],
    detail: formValues[`detail_${n}`],
  }));

  // image fields ทั้งหมดที่ต้องเปลี่ยน
  const IMAGE_FIELDS = ["img_banner", "img_1", "img_2", "img_3", "img_4", "img_5", "infographic"];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-surface)] transition-all duration-300 animate-in fade-in zoom-in-95 font-sans antialiased text-[var(--color-deep-text)]">

      {/* ── HEADER ── */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[var(--color-surface-3)] shrink-0 shadow-sm">
        <div>
          <h1 className={`text-2xl font-bold ${isDeleteMode ? "text-[var(--color-error)]" : "text-[var(--color-forest-green)]"}`}>
            {isDeleteMode ? "🗑️ ตรวจสอบข้อมูลก่อนยืนยันการลบโครงการ" : projectData ? "แก้ไขโครงการพระราชดำริ" : "เพิ่มโครงการพระราชดำริ"}
          </h1>
          <p className="text-sm text-[var(--color-muted-text)] font-medium mt-0.5">
            {isDeleteMode ? "โปรดตรวจสอบเนื้อหาด้านล่างนี้ให้ถี่ถ้วนก่อนกดปุ่มยืนยันการลบออก" : "กรอกข้อมูลรายละเอียดโครงการเพื่อบันทึกเข้าสู่ระบบ"}
          </p>
        </div>
        <button onClick={onClose} disabled={isSubmitting} className="p-1.5 rounded-lg text-[var(--color-muted-text)] hover:bg-[var(--color-surface-3)]/50 hover:text-[var(--color-deep-text)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          <X className="w-6 h-6" />
        </button>
      </header>

      {/* ── FORM ── */}
      <main className="flex-1 overflow-y-auto p-6 max-w-[95rem] mx-auto w-full">
        <div className={`bg-white border rounded-2xl shadow-sm p-5 md:p-6 ${isDeleteMode ? "border-[var(--color-error)]/30 bg-[var(--color-error)]/5" : "border-[var(--color-border)]"}`}>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ── ข้อมูลพื้นฐาน ── */}
            <div className="space-y-4">

              {formValues.royal_id && (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">รหัสโครงการ</label>
                  <input type="text" disabled value={formValues.royal_id}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-[var(--color-surface-2)] text-[var(--color-muted-text)] font-bold cursor-not-allowed" />
                </div>
              )}

              {/* img_banner */}
              <ImageUploadField
                label="รูป Banner โครงการ"
                fieldName="img_banner"
                currentFileName={formValues.img_banner}
                fileValue={fileValues["img_banner"]}
                onChange={(file) => handleFileChange("img_banner", file)}
                onClear={() => handleFileClear("img_banner")}
                disabled={isDeleteMode || isSubmitting}
              />

              {/* ประเภทโครงการ */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                  ประเภทโครงการ <span className="text-[var(--color-error)]">*</span>
                </label>
                <select required disabled={isDeleteMode || isSubmitting} value={formValues.type_id}
                  onChange={(e) => handleChange("type_id", e.target.value)}
                  className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] cursor-pointer disabled:cursor-not-allowed">
                  <option value="">-กรุณาเลือก-</option>
                  {types.map((t) => (
                    <option key={t.type_id} value={t.type_id}>{t.type_name}</option>
                  ))}
                </select>
              </div>

              {/* ชื่อโครงการ ไทย / อังกฤษ */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                  ชื่อโครงการ (ไทย) <span className="text-[var(--color-error)]">*</span>
                </label>
                <input type="text" placeholder="กรอกชื่อโครงการภาษาไทย" required disabled={isDeleteMode || isSubmitting}
                  value={formValues.royal_name} onChange={(e) => handleChange("royal_name", e.target.value)}
                  className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-deep-text)]">ชื่อโครงการ (English)</label>
                <input type="text" placeholder="Project name in English" disabled={isDeleteMode || isSubmitting}
                  value={formValues.royal_name_eng} onChange={(e) => handleChange("royal_name_eng", e.target.value)}
                  className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]" />
              </div>

              {/* province / amphure / district */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                    จังหวัด <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <select required disabled={isDeleteMode || isSubmitting} value={formValues.province_id}
                    onChange={(e) => { handleChange("province_id", e.target.value); handleChange("amphure_id", ""); handleChange("district_id", ""); }}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] cursor-pointer disabled:cursor-not-allowed">
                    <option value="">-กรุณาเลือกจังหวัด-</option>
                    {provinces.map((p) => <option key={p.province_id} value={p.province_id}>{p.name_th}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                    อำเภอ <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <select required disabled={isDeleteMode || isSubmitting || !formValues.province_id} value={formValues.amphure_id}
                    onChange={(e) => { handleChange("amphure_id", e.target.value); handleChange("district_id", ""); }}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] cursor-pointer disabled:cursor-not-allowed">
                    <option value="">-กรุณาเลือกอำเภอ-</option>
                    {amphures.map((a) => <option key={a.amphure_id} value={a.amphure_id}>{a.name_th}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                    ตำบล/เขต <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <select required disabled={isDeleteMode || isSubmitting || !formValues.amphure_id} value={formValues.district_id}
                    onChange={(e) => handleChange("district_id", e.target.value)}
                    className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] cursor-pointer disabled:cursor-not-allowed">
                    <option value="">-กรุณาเลือกตำบล-</option>
                    {districts.map((d) => <option key={d.district_id} value={d.district_id}>{d.name_th}</option>)}
                  </select>
                </div>
              </div>

              {/* lat / lng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{ label: "Latitude", field: "latitude" }, { label: "Longitude", field: "longitude" }].map(({ label, field }) => (
                  <div key={field} className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-[var(--color-deep-text)]">{label}</label>
                    <input type="number" step="any" placeholder="0.000000" disabled={isDeleteMode || isSubmitting}
                      value={formValues[field]} onChange={(e) => handleChange(field, e.target.value)}
                      className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]" />
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-[var(--color-surface-3)]" />

            {/* ── sections 1-5 ── */}
            <div className="space-y-6">
              {sections.map(({ num, title, img, detail }) => (
                <div key={num} className="border border-dashed border-[var(--color-surface-3)] rounded-xl p-4 space-y-4">

                  {/* หัวข้อ section */}
                  <p className="text-sm font-bold text-[var(--color-forest-green)]">ส่วนที่ {num}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* ── คอลัมน์ซ้าย: หัวข้อ + รูป ── */}
                    <div className="md:col-span-1 space-y-3">

                      {/* หัวข้อ (ไทย) */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                          หัวข้อ (ไทย) {num === 1 && <span className="text-[var(--color-error)]">*</span>}
                        </label>
                        <input type="text" placeholder={`ระบุหัวข้อส่วนที่ ${num}`}
                          required={num === 1} disabled={isDeleteMode || isSubmitting} value={title}
                          onChange={(e) => handleChange(`title_${num}`, e.target.value)}
                          className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]" />
                      </div>

                      {/* หัวข้อ (English) */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                          หัวข้อ (English)
                        </label>
                        <input type="text" placeholder={`Section ${num} title in English`}
                          disabled={isDeleteMode || isSubmitting} value={formValues[`title_${num}_eng`]}
                          onChange={(e) => handleChange(`title_${num}_eng`, e.target.value)}
                          className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]" />
                      </div>

                      {/* รูปภาพ */}
                      <ImageUploadField
                        label="รูปภาพประกอบ"
                        fieldName={`img_${num}`}
                        currentFileName={img}
                        fileValue={fileValues[`img_${num}`]}
                        onChange={(file) => handleFileChange(`img_${num}`, file)}
                        onClear={() => handleFileClear(`img_${num}`)}
                        disabled={isDeleteMode || isSubmitting}
                      />
                    </div>

                    {/* ── คอลัมน์ขวา: รายละเอียด ── */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">

                      {/* รายละเอียด (ไทย) */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                          รายละเอียด (ไทย) {num === 1 && <span className="text-[var(--color-error)]">*</span>}
                        </label>
                        <textarea rows="8" placeholder={`พิมพ์เนื้อหารายละเอียดส่วนที่ ${num}...`}
                          required={num === 1} disabled={isDeleteMode || isSubmitting} value={detail}
                          onChange={(e) => handleChange(`detail_${num}`, e.target.value)}
                          className="w-full min-h-[160px] px-3 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-y disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] text-[var(--color-deep-text)] bg-white" />
                      </div>

                      {/* รายละเอียด (English) */}
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                          รายละเอียด (English)
                        </label>
                        <textarea rows="8" placeholder={`Section ${num} detail in English...`}
                          disabled={isDeleteMode || isSubmitting} value={formValues[`detail_${num}_eng`]}
                          onChange={(e) => handleChange(`detail_${num}_eng`, e.target.value)}
                          className="w-full min-h-[160px] px-3 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-y disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] text-[var(--color-deep-text)] bg-white" />
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-[var(--color-surface-3)]" />

            {/* ── ส่วนท้าย ── */}
            <div className="space-y-4">

              {/* 🔄 infographic เปลี่ยนเป็น file upload */}
              <ImageUploadField
                label="ไฟล์ Infographic"
                fieldName="infographic"
                currentFileName={formValues.infographic}
                fileValue={fileValues["infographic"]}
                onChange={(file) => handleFileChange("infographic", file)}
                onClear={() => handleFileClear("infographic")}
                disabled={isDeleteMode || isSubmitting}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-deep-text)]">
                  แหล่งอ้างอิงข้อมูล (ไทย) <span className="text-[var(--color-error)]">*</span>
                </label>
                <textarea rows="3" placeholder="ระบุแหล่งที่มาหรือแหล่งอ้างอิงของข้อมูล..." required
                  disabled={isDeleteMode || isSubmitting} value={formValues.reference}
                  onChange={(e) => handleChange("reference", e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-y disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] bg-white text-[var(--color-deep-text)]" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[var(--color-deep-text)]">แหล่งอ้างอิงข้อมูล (English)</label>
                <textarea rows="3" placeholder="Reference in English..." disabled={isDeleteMode || isSubmitting}
                  value={formValues.reference_eng} onChange={(e) => handleChange("reference_eng", e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-y disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] bg-white text-[var(--color-deep-text)]" />
              </div>
            </div>

            {/* ── ปุ่ม submit ── */}
            <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-surface-3)]">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 text-xl font-semibold text-white rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer ${
                  isSubmitting 
                    ? "bg-gray-400 cursor-not-allowed opacity-70" 
                    : isDeleteMode 
                    ? "bg-[var(--color-error)] hover:bg-[var(--color-error)]/90" 
                    : "bg-[var(--color-green)] hover:bg-[var(--color-forest-green)]"
                }`}
              >
                {isSubmitting ? "กำลังบันทึกข้อมูล..." : isDeleteMode ? "ยืนยันการลบข้อมูลโครงการนี้" : "บันทึกข้อมูล"}
              </button>
              <button 
                type="button" 
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xl font-semibold text-[var(--color-muted-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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