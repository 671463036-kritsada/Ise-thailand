import { useState, useEffect, useRef } from "react";
import { X, Upload, ImageIcon, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";
import { UPLOADS_URL } from "../../constants/uploads_url";

// ── Component ย่อยอัปโหลดรูปภาพฝั่งซ้าย (Sidebar) อิงตามธีมธรรมชาติ ──
function SidebarImageUpload({ label, fieldName, currentFileName, fileValue, onChange, onClear, disabled, required }) {
  const inputRef = useRef(null);

  const previewUrl = fileValue
    ? URL.createObjectURL(fileValue)
    : currentFileName
      ? `${UPLOADS_URL}${currentFileName}`
      : null;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-deep-text)]">
          {label} {required && <span className="text-[var(--color-error)]">*</span>}
        </label>
      )}

      <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-border)] flex flex-col gap-2">
        {/* Preview Container */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-2)] flex flex-col items-center justify-center p-2">
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center flex flex-col items-center gap-1">
              <ImageIcon className="w-5 h-5 text-[var(--color-disabled)]" />
              <p className="text-[11px] text-[var(--color-muted-text)]">ไม่มีรูปภาพ</p>
            </div>
          )}
          <span className="absolute bottom-1 text-[10px] text-[var(--color-muted-text)] bg-[var(--color-surface-3)]/80 px-1.5 py-0.5 rounded truncate max-w-[90%]">
            {fileValue ? fileValue.name : fieldName}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="col-span-3 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-[var(--color-border)] text-xs font-semibold text-[var(--color-deep-text)] bg-[var(--color-white)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5 text-[var(--color-muted-text)]" />
            <span>เลือกรูป</span>
          </button>
          
          <button
            type="button"
            disabled={disabled || !previewUrl}
            onClick={() => {
              onClear();
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="col-span-1 flex items-center justify-center p-1.5 rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

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

// ── Component ย่อยสำหรับกล่องพรีวิวรูปภาพตรงช่องเนื้อหาแต่ละส่วน ──
function InlineImageField({ fieldName, currentFileName, fileValue, onChange, disabled }) {
  const inputRef = useRef(null);
  const previewUrl = fileValue ? URL.createObjectURL(fileValue) : currentFileName ? `${UPLOADS_URL}${currentFileName}` : null;

  return (
    <div 
      onClick={() => !disabled && inputRef.current?.click()}
      className={`w-full aspect-square rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col items-center justify-center p-2 relative ${!disabled ? 'cursor-pointer hover:bg-[var(--color-surface-2)] transition-colors' : ''}`}
    >
      {previewUrl ? (
        <img src={previewUrl} alt="section" className="w-full h-full object-cover rounded-lg" />
      ) : (
        <div className="text-center flex flex-col items-center gap-1">
          <ImageIcon className="w-5 h-5 text-[var(--color-disabled)]" />
          <p className="text-[11px] text-[var(--color-muted-text)]">ยังไม่มีรูป</p>
        </div>
      )}
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
    royal_name: "", type_id: "", province_id: "", amphure_id: "", district_id: "",
    img_banner: "",
    title_1: "", img_1: "", detail_1: "",
    title_2: "", img_2: "", detail_2: "",
    title_3: "", img_3: "", detail_3: "",
    title_4: "", img_4: "", detail_4: "",
    title_5: "", img_5: "", detail_5: "",
    infographic: "", reference: "", latitude: "", longitude: "", royal_name_eng: "",
    title_1_eng: "", detail_1_eng: "",
    title_2_eng: "", detail_2_eng: "",
    title_3_eng: "", detail_3_eng: "",
    title_4_eng: "", detail_4_eng: "",
    title_5_eng: "", detail_5_eng: "",
    reference_eng: "",
  };

  const [formValues, setFormValues] = useState(initialFormState);
  const [fileValues, setFileValues] = useState({});
  const [types, setTypes] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDeleteMode = mode === "delete";

  useEffect(() => {
    api.get("/royal/types").then((res) => setTypes(res.data?.data ?? [])).catch((err) => console.error(err));
    api.get("/project/provinces").then(res => setProvinces(res.data.data || []));
  }, []);

  useEffect(() => {
    if (formValues.province_id) {
      api.get(`/project/amphures/${formValues.province_id}`).then(res => setAmphures(res.data.data || []));
    } else { setAmphures([]); setDistricts([]); }
  }, [formValues.province_id]);

  useEffect(() => {
    if (formValues.amphure_id) {
      api.get(`/project/districts/${formValues.amphure_id}`).then(res => setDistricts(res.data.data || []));
    } else { setDistricts([]); }
  }, [formValues.amphure_id]);

  useEffect(() => {
    if (isOpen) {
      setFormValues(projectData ? { ...projectData } : initialFormState);
      setFileValues({});
      setIsSubmitting(false);
    }
  }, [isOpen, projectData]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file) => {
    setFileValues((prev) => ({ ...prev, [field]: file }));
  };

  const handleFileClear = (field) => {
    setFileValues((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setIsSubmitting(true);
      await onSave({ formValues, fileValues });
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const sections = [1, 2, 3, 4, 5].map((n) => ({
    num: n,
    title: formValues[`title_${n}`] || "",
    titleEng: formValues[`title_${n}_eng`] || "",
    img: formValues[`img_${n}`],
    detail: formValues[`detail_${n}`] || "",
    detailEng: formValues[`detail_${n}_eng`] || "",
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-forest-green)]/40 font-sans antialiased p-2 sm:p-4 backdrop-blur-sm">
      
      {/* ── MAIN MODAL CONTAINER (ปรับให้ยืดหยุ่นหดเต็มความสูงพิกัดบนจอมือถือ) ── */}
      <div className="bg-[var(--color-white)] w-full max-w-[70rem] h-[95vh] sm:h-[90vh] rounded-2xl flex flex-col shadow-xl border border-[var(--color-border)] overflow-hidden">
        
        {/* ── HEADER ส่วนหัวฟอร์ม ── */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[var(--color-border)] shrink-0 bg-[var(--color-surface)]">
          <div>
            <h1 className={`text-base sm:text-xl font-bold ${isDeleteMode ? "text-[var(--color-error)]" : "text-[var(--color-forest-green)]"}`}>
              {isDeleteMode ? "🗑️ ยืนยันการลบข้อมูลโครงการพระราชดำริ" : projectData ? "แก้ไขโครงการพระราชดำริ" : "เพิ่มโครงการพระราชดำริ"}
            </h1>
            <p className="text-[11px] sm:text-xs font-medium text-[var(--color-muted-text)] mt-0.5">
              กรอกข้อมูลรายละเอียดโครงการเพื่อบันทึกเข้าสู่ระบบ
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            disabled={isSubmitting} 
            className="p-1.5 rounded-lg text-[var(--color-muted-text)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-deep-text)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* ── FORM CONTENT (ปรับให้ม้วน Scroll รวมแผงเดียวกันแนวตั้งบนโมบายล์ และแยกฝั่งตามเดิมเมื่อจอใหญ่ lg) ── */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden bg-[var(--color-surface)]">
          
          {/* ── คอลัมน์ซ้าย (SIDEBAR): ส่วนจัดการรูปภาพทั้งหมดตาม Mockup ── */}
          <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 shrink-0 flex flex-col gap-4">
            
            {/* 1. รูป BANNER */}
            <SidebarImageUpload
              label="รูป BANNER"
              fieldName="img_banner"
              currentFileName={formValues.img_banner}
              fileValue={fileValues["img_banner"]}
              onChange={(file) => handleFileChange("img_banner", file)}
              onClear={() => handleFileClear("img_banner")}
              disabled={isDeleteMode || isSubmitting}
            />

            {/* 2. สถานะรูปแต่ละส่วน */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-deep-text)]">รูปแต่ละส่วน</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1">
                {[1, 2, 3, 4, 5].map((n) => {
                  const hasImg = fileValues[`img_${n}`] || formValues[`img_${n}`];
                  return (
                    <div key={n} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--color-white)] border border-[var(--color-border)] text-xs shadow-xs">
                      <div className="flex items-center gap-2">
                        <ImageIcon className={`w-3.5 h-3.5 ${hasImg ? 'text-[var(--color-success)]' : 'text-[var(--color-disabled)]'}`} />
                        <span className="font-semibold text-[var(--color-deep-text)]">ส่วนที่ {n}</span>
                      </div>
                      <span className="text-[10px] font-medium text-[var(--color-muted-text)]">
                        {hasImg ? "มีรูปภาพ" : "ไม่มีรูป"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. INFOGRAPHIC */}
            <SidebarImageUpload
              label="INFOGRAPHIC"
              fieldName="infographic"
              currentFileName={formValues.infographic}
              fileValue={fileValues["infographic"]}
              onChange={(file) => handleFileChange("infographic", file)}
              onClear={() => handleFileClear("infographic")}
              disabled={isDeleteMode || isSubmitting}
            />
          </aside>

          {/* ── คอลัมน์ขวา (MAIN CONTENT): ส่วนข้อมูล Text และรายละเอียดฟอร์ม ── */}
          <main className="flex-1 p-4 sm:p-6 space-y-6 bg-[var(--color-white)] lg:overflow-y-auto custom-theme-scrollbar">
            
            {/* 1. กล่องข้อมูลพื้นฐาน */}
            <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/40 rounded-xl p-3 sm:p-4 space-y-4 shadow-xs">
              <legend className="text-xs font-bold px-2 text-[var(--color-forest-green)] flex items-center gap-1.5">
                <span>ⓘ</span> ข้อมูลพื้นฐาน
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">ประเภทโครงการ <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode || isSubmitting} value={formValues.type_id}
                    onChange={(e) => handleChange("type_id", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] disabled:bg-[var(--color-surface-2)]">
                    <option value="">-กรุณาเลือก-</option>
                    {types.map((t) => <option key={t.type_id} value={t.type_id}>{t.type_name}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">รหัสโครงการ</label>
                  <input type="text" disabled value={formValues.royal_id || "RY-00123"}
                    className="w-full px-3 py-1.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-muted-text)] font-bold cursor-not-allowed" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">ชื่อโครงการ (ไทย) <span className="text-[var(--color-error)]">*</span></label>
                  <input type="text" placeholder="กรอกชื่อโครงการภาษาไทย" required disabled={isDeleteMode || isSubmitting}
                    value={formValues.royal_name} onChange={(e) => handleChange("royal_name", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)] disabled:bg-[var(--color-surface-2)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">ชื่อโครงการ (English)</label>
                  <input type="text" placeholder="Project name in English" disabled={isDeleteMode || isSubmitting}
                    value={formValues.royal_name_eng} onChange={(e) => handleChange("royal_name_eng", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)] disabled:bg-[var(--color-surface-2)]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">จังหวัด <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode || isSubmitting} value={formValues.province_id}
                    onChange={(e) => { handleChange("province_id", e.target.value); handleChange("amphure_id", ""); handleChange("district_id", ""); }}
                    className="w-full px-2 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-deep-text)]">
                    <option value="">-เลือกจังหวัด-</option>
                    {provinces.map((p) => <option key={p.province_id} value={p.province_id}>{p.name_th}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">อำเภอ <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode || isSubmitting || !formValues.province_id} value={formValues.amphure_id}
                    onChange={(e) => { handleChange("amphure_id", e.target.value); handleChange("district_id", ""); }}
                    className="w-full px-2 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-deep-text)]">
                    <option value="">-เลือกอำเภอ-</option>
                    {amphures.map((a) => <option key={a.amphure_id} value={a.amphure_id}>{a.name_th}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">ตำบล/เขต <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode || isSubmitting || !formValues.amphure_id} value={formValues.district_id}
                    onChange={(e) => handleChange("district_id", e.target.value)}
                    className="w-full px-2 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-deep-text)]">
                    <option value="">-เลือกตำบล-</option>
                    {districts.map((d) => <option key={d.district_id} value={d.district_id}>{d.name_th}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">Latitude</label>
                  <input type="number" step="any" placeholder="0.000000" disabled={isDeleteMode || isSubmitting}
                    value={formValues.latitude} onChange={(e) => handleChange("latitude", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">Longitude</label>
                  <input type="number" step="any" placeholder="0.000000" disabled={isDeleteMode || isSubmitting}
                    value={formValues.longitude} onChange={(e) => handleChange("longitude", e.target.value)}
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)]" />
                </div>
              </div>
            </fieldset>

            {/* 2. กล่องเนื้อหาแต่ละส่วน (แบ่ง Grid 2 คอลัมน์บนจอคอมพิวเตอร์) */}
            <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/40 rounded-xl p-3 sm:p-4 space-y-4 shadow-xs">
              <legend className="text-xs font-bold px-2 text-[var(--color-forest-green)] flex items-center gap-1.5">
                <span>㗊</span> เนื้อหาแต่ละส่วน
              </legend>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sections.map(({ num, title, titleEng, img, detail, detailEng }) => (
                  <div key={num} className="bg-[var(--color-white)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[11px] font-bold text-[var(--color-forest-green)] border border-[var(--color-border)]">
                        {num}
                      </span>
                      <span className="text-xs font-bold text-[var(--color-deep-text)]">ส่วนที่ {num} {num === 1 && <span className="text-[var(--color-error)]">*</span>}</span>
                    </div>

                    {/* จัดหน้ากากรูปด้านซ้าย และ Input ขวา (ปรับเป็นคอลัมน์เดียวบนโมบายล์แคบ) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="col-span-1">
                        <InlineImageField
                          fieldName={`img_${num}`}
                          currentFileName={img}
                          fileValue={fileValues[`img_${num}`]}
                          onChange={(file) => handleFileChange(`img_${num}`, file)}
                          disabled={isDeleteMode || isSubmitting}
                        />
                      </div>
                      
                      <div className="col-span-1 sm:col-span-2 flex flex-col gap-2">
                        <input 
                          type="text" 
                          placeholder="ระบุหัวข้อ (ไทย)"
                          required={num === 1}
                          disabled={isDeleteMode || isSubmitting}
                          value={title}
                          onChange={(e) => handleChange(`title_${num}`, e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)]" 
                        />
                        <input 
                          type="text" 
                          placeholder="Section title (English)"
                          disabled={isDeleteMode || isSubmitting}
                          value={titleEng}
                          onChange={(e) => handleChange(`title_${num}_eng`, e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)]" 
                        />
                      </div>
                    </div>

                    {/* เท็กซ์ฟิลด์ข้อความยาวสำหรับรายละเอียด */}
                    <div className="flex flex-col gap-2">
                      <textarea 
                        rows="10" 
                        placeholder="พิมพ์เนื้อหารายละเอียด (ไทย)..."
                        required={num === 1}
                        disabled={isDeleteMode || isSubmitting}
                        value={detail}
                        onChange={(e) => handleChange(`detail_${num}`, e.target.value)}
                        className="w-full px-2.5 py-2 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)] resize-y min-h-[120px]"
                      />
                      <textarea 
                        rows="10" 
                        placeholder="Detail in English..."
                        disabled={isDeleteMode || isSubmitting}
                        value={detailEng}
                        onChange={(e) => handleChange(`detail_${num}_eng`, e.target.value)}
                        className="w-full px-2.5 py-2 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)] resize-y min-h-[120px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>

            {/* 3. กล่องแหล่งอ้างอิงข้อมูล */}
            <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/40 rounded-xl p-3 sm:p-4 space-y-4 shadow-xs">
              <legend className="text-xs font-bold px-2 text-[var(--color-forest-green)] flex items-center gap-1.5">
                <span>📚</span> แหล่งอ้างอิงข้อมูล
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">อ้างอิง (ไทย) <span className="text-[var(--color-error)]">*</span></label>
                  <textarea rows="5" placeholder="ระบุแหล่งที่มาข้อมูล..." required
                    disabled={isDeleteMode || isSubmitting} value={formValues.reference}
                    onChange={(e) => handleChange("reference", e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] resize-y min-h-[80px]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">อ้างอิง (English)</label>
                  <textarea rows="5" placeholder="Reference in English..." disabled={isDeleteMode || isSubmitting}
                    value={formValues.reference_eng} onChange={(e) => handleChange("reference_eng", e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] resize-y min-h-[80px]" />
                </div>
              </div>
            </fieldset>

          </main>
        </form>

        {/* ── FOOTER ส่วนควบคุมการกดบันทึก/ยกเลิกด้านล่างสุด ── */}
        <footer className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] shrink-0">
          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--color-white)] transition-all active:scale-98 cursor-pointer ${
              isSubmitting 
                ? "bg-[var(--color-disabled)] cursor-not-allowed opacity-50" 
                : isDeleteMode 
                ? "bg-[var(--color-error)] hover:opacity-90" 
                : "bg-[var(--color-green)] hover:bg-[var(--color-forest-green)]"
            }`}
          >
            {isSubmitting ? "กำลังบันทึกข้อมูล..." : isDeleteMode ? "ยืนยันการลบข้อมูล" : "บันทึกข้อมูล"}
          </button>
          
          <button 
            type="button" 
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 text-sm font-semibold text-[var(--color-muted-text)] border border-[var(--color-border)] bg-[var(--color-white)] hover:bg-[var(--color-surface-2)] rounded-xl transition-colors cursor-pointer"
          >
            ยกเลิกและย้อนกลับ
          </button>
        </footer>

      </div>
      
      {/* จัดการความสวยงามของแถบ Scrollbar ย่อยฝั่งสีธรรมชาติ */}
      <style jsx global>{`
        .custom-theme-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-theme-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-theme-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 999px;
        }
        .custom-theme-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-muted-text);
        }
      `}</style>

    </div>
  );
}