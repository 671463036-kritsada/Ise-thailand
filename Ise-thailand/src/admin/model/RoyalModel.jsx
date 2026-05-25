import { useState, useEffect, useRef } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";
import { UPLOADS_URL } from "../../constants/uploads_url";

/* ─── ImageUploadField (เหมือนเดิม ไม่เปลี่ยน) ─── */
function ImageUploadField({ label, fieldName, currentFileName, fileValue, onChange, onClear, disabled, required, compact = false }) {
  const inputRef = useRef(null);
  const previewUrl = fileValue
    ? URL.createObjectURL(fileValue)
    : currentFileName
      ? `${UPLOADS_URL}${currentFileName}`
      : null;

  if (compact) {
    /* ── Compact mode: ใช้ใน sidebar ── */
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-[var(--color-deep-text)]">
            {label} {required && <span className="text-[var(--color-error)]">*</span>}
          </label>
        )}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-2)] flex items-center justify-center">
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-2">
              <ImageIcon className="w-6 h-6 text-[var(--color-disabled)] mx-auto mb-1" />
              <p className="text-[10px] text-[var(--color-disabled)]">ไม่มีรูปภาพ</p>
            </div>
          )}
          {previewUrl && (
            <p className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-black/40 text-white py-0.5 truncate px-1">
              {currentFileName || fileValue?.name || ""}
            </p>
          )}
        </div>
        {!disabled && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-border-focus)] bg-white hover:bg-[var(--color-surface)] transition-all text-xs font-medium text-[var(--color-deep-text)]"
            >
              <Upload className="w-3.5 h-3.5 text-[var(--color-muted-text)]" />
              เลือกรูป
            </button>
            {previewUrl && (
              <button
                type="button"
                onClick={() => { onClear(); if (inputRef.current) inputRef.current.value = ""; }}
                className="p-2 rounded-xl border border-[var(--color-error)]/30 text-[var(--color-error)] bg-[var(--color-error)]/5 hover:bg-[var(--color-error)]/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" disabled={disabled} className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); }} />
      </div>
    );
  }

  /* ── Normal mode ── */
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-[var(--color-deep-text)]">
          {label} {required && <span className="text-[var(--color-error)]">*</span>}
        </label>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-2)] flex items-center justify-center">
          {previewUrl
            ? <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
            : <div className="text-center p-4"><ImageIcon className="w-8 h-8 text-[var(--color-disabled)] mx-auto mb-1" /><p className="text-xs text-[var(--color-disabled)]">ไม่มีรูปภาพ</p></div>
          }
        </div>
        <div className="flex flex-col justify-center gap-2">
          {!disabled && (
            <>
              <button type="button" onClick={() => inputRef.current?.click()}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-border-focus)] bg-[var(--color-surface)] hover:bg-[var(--color-green-light)]/10 transition-all text-sm font-medium text-[var(--color-deep-text)]">
                <Upload className="w-4 h-4 text-[var(--color-muted-text)]" />
                {previewUrl ? "เปลี่ยนรูปภาพใหม่" : "คลิกเพื่อเลือกรูปภาพ"}
              </button>
              {previewUrl && (
                <button type="button" onClick={() => { onClear(); if (inputRef.current) inputRef.current.value = ""; }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-[var(--color-error)]/30 text-[var(--color-error)] bg-[var(--color-error)]/5 hover:bg-[var(--color-error)]/10 transition-colors text-sm font-medium">
                  <X className="w-4 h-4" /> ลบรูปภาพนี้
                </button>
              )}
            </>
          )}
          {fileValue && <p className="text-xs text-[var(--color-muted-text)] bg-[var(--color-surface-2)] p-2 rounded-lg truncate">📎 {fileValue.name}</p>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" disabled={disabled} className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); }} />
    </div>
  );
}

/* ─── SectionCard: card แต่ละส่วนใน grid ─── */
function SectionCard({ num, formValues, fileValues, handleChange, handleFileChange, handleFileClear, isDeleteMode, isSubmitting }) {
  const img = formValues[`img_${num}`];
  const previewUrl = fileValues[`img_${num}`]
    ? URL.createObjectURL(fileValues[`img_${num}`])
    : img ? `${UPLOADS_URL}${img}` : null;
  const inputRef = useRef(null);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 space-y-3">
      {/* หัวข้อ card */}
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-[var(--color-forest-green)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {num}
        </span>
        <p className="text-sm font-bold text-[var(--color-forest-green)]">
          ส่วนที่ {num} {num === 1 && <span className="text-[var(--color-error)] text-xs">*</span>}
        </p>
      </div>

      {/* รูป + ชื่อหัวข้อ (row) */}
      <div className="flex gap-3">
        {/* Thumbnail รูป */}
        <div
          className="relative w-24 h-20 rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-2)] flex-shrink-0 flex items-center justify-center cursor-pointer group"
          onClick={() => !isDeleteMode && !isSubmitting && inputRef.current?.click()}
        >
          {previewUrl
            ? <img src={previewUrl} alt="" className="w-full h-full object-cover" />
            : <ImageIcon className="w-6 h-6 text-[var(--color-disabled)]" />
          }
          {!isDeleteMode && !isSubmitting && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-4 h-4 text-white" />
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" disabled={isDeleteMode || isSubmitting}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileChange(`img_${num}`, f); }} />
        </div>

        {/* หัวข้อ ไทย + Eng */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <input type="text" placeholder={`หัวข้อส่วนที่ ${num} (ไทย)`}
            required={num === 1} disabled={isDeleteMode || isSubmitting}
            value={formValues[`title_${num}`]}
            onChange={(e) => handleChange(`title_${num}`, e.target.value)}
            className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]" />
          <input type="text" placeholder={`Section ${num} title (English)`}
            disabled={isDeleteMode || isSubmitting}
            value={formValues[`title_${num}_eng`]}
            onChange={(e) => handleChange(`title_${num}_eng`, e.target.value)}
            className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]" />
        </div>
      </div>

      {/* รายละเอียด ไทย + Eng */}
      <textarea rows={5} placeholder={`รายละเอียดส่วนที่ ${num} (ไทย)...`}
        required={num === 1} disabled={isDeleteMode || isSubmitting}
        value={formValues[`detail_${num}`]}
        onChange={(e) => handleChange(`detail_${num}`, e.target.value)}
        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-y disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] text-[var(--color-deep-text)] bg-white" />
      <textarea rows={5} placeholder={`Section ${num} detail (English)...`}
        disabled={isDeleteMode || isSubmitting}
        value={formValues[`detail_${num}_eng`]}
        onChange={(e) => handleChange(`detail_${num}_eng`, e.target.value)}
        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-y disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] text-[var(--color-deep-text)] bg-white" />
    </div>
  );
}

/* ─── SidebarSectionItem: รายการ ส่วนที่ N ใน sidebar ─── */
function SidebarSectionItem({ num, formValues, fileValues }) {
  const img = formValues[`img_${num}`];
  const hasImg = fileValues[`img_${num}`] || img;
  const previewUrl = fileValues[`img_${num}`]
    ? URL.createObjectURL(fileValues[`img_${num}`])
    : img ? `${UPLOADS_URL}${img}` : null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--color-border)] bg-white hover:bg-[var(--color-surface)] transition-colors">
      {previewUrl
        ? <img src={previewUrl} alt="" className="w-7 h-7 rounded-lg object-cover flex-shrink-0 border border-[var(--color-border)]" />
        : <div className="w-7 h-7 rounded-lg bg-[var(--color-surface-2)] flex items-center justify-center flex-shrink-0">
          <ImageIcon className="w-4 h-4 text-[var(--color-disabled)]" />
        </div>
      }
      <span className="flex-1 text-sm font-medium text-[var(--color-deep-text)]">ส่วนที่ {num}</span>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${hasImg ? 'bg-[var(--color-green-light)]/30 text-[var(--color-forest-green)]' : 'bg-[var(--color-surface-3)] text-[var(--color-muted-text)]'}`}>
        {hasImg ? 'มีรูปภาพ' : 'ไม่มีรูป'}
      </span>
    </div>
  );
}

/* ─── SectionHeader (ป้ายหัวข้อ section ในฟอร์มขวา) ─── */
function FormSectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-base">{icon}</span>
      <h3 className="text-sm font-bold text-[var(--color-deep-text)]">{title}</h3>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function RoyalModel({ isOpen, onClose, projectData, mode, onSave }) {
  const initialFormState = {
    royal_name: "", type_id: "", province_id: "", amphure_id: "", district_id: "",
    img_banner: "",
    title_1: "", img_1: "", detail_1: "",
    title_2: "", img_2: "", detail_2: "",
    title_3: "", img_3: "", detail_3: "",
    title_4: "", img_4: "", detail_4: "",
    title_5: "", img_5: "", detail_5: "",
    infographic: "", reference: "", latitude: "", longitude: "",
    royal_name_eng: "",
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [districts, setDistricts] = useState([]);
  const isDeleteMode = mode === "delete";

  useEffect(() => {
    api.get("/royal/types").then((res) => setTypes(res.data?.data ?? [])).catch(console.error);
  }, []);
  useEffect(() => {
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

  const handleChange = (field, value) => setFormValues(prev => ({ ...prev, [field]: value }));
  const handleFileChange = (field, file) => setFileValues(prev => ({ ...prev, [field]: file }));
  const handleFileClear = (field) => setFileValues(prev => { const n = { ...prev }; delete n[field]; return n; });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (isDeleteMode) {
      const result = await Swal.fire({
        title: "คุณแน่ใจใช่ไหม?",
        text: `ต้องการลบโครงการ "${formValues.royal_name}" ออกจากระบบถาวร?`,
        icon: "warning", showCancelButton: true,
        confirmButtonColor: "var(--color-error)", cancelButtonColor: "var(--color-muted-text)",
        confirmButtonText: "ใช่, ลบเลย!", cancelButtonText: "ยกเลิก", reverseButtons: true,
      });
      if (!result.isConfirmed) return;
    }
    try {
      setIsSubmitting(true);
      await onSave({ formValues, fileValues });
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      setIsSubmitting(false);
    }
  };

  /* select style ที่ใช้ซ้ำ */
  const selectCls = "w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] cursor-pointer disabled:cursor-not-allowed";
  const inputCls = "w-full px-3 py-1.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]";

  return (
    /* ── Overlay ── */
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}>

      {/* ── Modal Box ── */}
      <div className="relative w-full max-w-5xl bg-[var(--color-surface)] rounded-3xl shadow-2xl flex flex-col my-auto"
        style={{ maxHeight: '92vh' }}>

        {/* ── HEADER ── */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[var(--color-border)] bg-white rounded-t-3xl flex-shrink-0">
          <div>
            <h1 className={`text-xl font-bold ${isDeleteMode ? "text-[var(--color-error)]" : "text-[var(--color-deep-text)]"}`}>
              {isDeleteMode ? "🗑️ ยืนยันการลบโครงการ" : projectData ? "แก้ไขโครงการพระราชดำริ" : "เพิ่มโครงการพระราชดำริ"}
            </h1>
            <p className="text-xs text-[var(--color-muted-text)] mt-0.5">
              {isDeleteMode ? "ตรวจสอบข้อมูลก่อนยืนยันการลบออก" : "กรอกข้อมูลรายละเอียดโครงการเพื่อบันทึกเข้าสู่ระบบ"}
            </p>
          </div>
          <button onClick={onClose} disabled={isSubmitting}
            className="p-1.5 rounded-xl text-[var(--color-muted-text)] hover:bg-[var(--color-surface-3)] transition-colors disabled:opacity-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="flex flex-1 overflow-hidden rounded-b-3xl">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="w-60 flex-shrink-0 bg-[var(--color-surface-2)] border-r border-[var(--color-border)] overflow-y-auto p-4 space-y-5 rounded-bl-3xl">

            {/* Banner */}
            <div>
              <p className="text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wider mb-2">รูป BANNER</p>
              <ImageUploadField
                fieldName="img_banner"
                currentFileName={formValues.img_banner}
                fileValue={fileValues["img_banner"]}
                onChange={(file) => handleFileChange("img_banner", file)}
                onClear={() => handleFileClear("img_banner")}
                disabled={isDeleteMode || isSubmitting}
                compact
              />
            </div>

            {/* รูปแต่ละส่วน */}
            <div>
              <p className="text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wider mb-2">รูปแต่ละส่วน</p>
              <div className="space-y-1.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <SidebarSectionItem key={n} num={n} formValues={formValues} fileValues={fileValues} />
                ))}
              </div>
            </div>

            {/* Infographic */}
            <div>
              <p className="text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wider mb-2">INFOGRAPHIC</p>
              <ImageUploadField
                fieldName="infographic"
                currentFileName={formValues.infographic}
                fileValue={fileValues["infographic"]}
                onChange={(file) => handleFileChange("infographic", file)}
                onClear={() => handleFileClear("infographic")}
                disabled={isDeleteMode || isSubmitting}
                compact
              />
            </div>
          </aside>

          {/* ── RIGHT CONTENT ── */}
          <main className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-8">

              {/* ══ ข้อมูลพื้นฐาน ══ */}
              <section className="bg-white rounded-2xl border border-[var(--color-border)] p-5 space-y-4">
                <FormSectionHeader icon="" title="ข้อมูลพื้นฐาน" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* ประเภทโครงการ */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--color-deep-text)]">
                      ประเภทโครงการ <span className="text-[var(--color-error)]">*</span>
                    </label>
                    <select required disabled={isDeleteMode || isSubmitting} value={formValues.type_id}
                      onChange={(e) => handleChange("type_id", e.target.value)} className={selectCls}>
                      <option value="">-กรุณาเลือก-</option>
                      {types.map(t => <option key={t.type_id} value={t.type_id}>{t.type_name}</option>)}
                    </select>
                  </div>

                  {/* รหัสโครงการ */}
                  {formValues.royal_id && (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[var(--color-deep-text)]">รหัสโครงการ</label>
                      <input type="text" disabled value={formValues.royal_id}
                        className={`${inputCls} bg-[var(--color-surface-2)] font-bold cursor-not-allowed`} />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* ชื่อโครงการ ไทย */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--color-deep-text)]">
                      ชื่อโครงการ (ไทย) <span className="text-[var(--color-error)]">*</span>
                    </label>
                    <input type="text" placeholder="กรอกชื่อโครงการภาษาไทย" required
                      disabled={isDeleteMode || isSubmitting} value={formValues.royal_name}
                      onChange={(e) => handleChange("royal_name", e.target.value)} className={inputCls} />
                  </div>
                  {/* ชื่อโครงการ Eng */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--color-deep-text)]">ชื่อโครงการ (English)</label>
                    <input type="text" placeholder="Project name in English"
                      disabled={isDeleteMode || isSubmitting} value={formValues.royal_name_eng}
                      onChange={(e) => handleChange("royal_name_eng", e.target.value)} className={inputCls} />
                  </div>
                </div>

                {/* จังหวัด / อำเภอ / ตำบล */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--color-deep-text)]">จังหวัด <span className="text-[var(--color-error)]">*</span></label>
                    <select required disabled={isDeleteMode || isSubmitting} value={formValues.province_id}
                      onChange={(e) => { handleChange("province_id", e.target.value); handleChange("amphure_id", ""); handleChange("district_id", ""); }}
                      className={selectCls}>
                      <option value="">-กรุณาเลือกจังหวัด-</option>
                      {provinces.map(p => <option key={p.province_id} value={p.province_id}>{p.name_th}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--color-deep-text)]">อำเภอ <span className="text-[var(--color-error)]">*</span></label>
                    <select required disabled={isDeleteMode || isSubmitting || !formValues.province_id} value={formValues.amphure_id}
                      onChange={(e) => { handleChange("amphure_id", e.target.value); handleChange("district_id", ""); }}
                      className={selectCls}>
                      <option value="">-กรุณาเลือกอำเภอ-</option>
                      {amphures.map(a => <option key={a.amphure_id} value={a.amphure_id}>{a.name_th}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--color-deep-text)]">ตำบล/เขต <span className="text-[var(--color-error)]">*</span></label>
                    <select required disabled={isDeleteMode || isSubmitting || !formValues.amphure_id} value={formValues.district_id}
                      onChange={(e) => handleChange("district_id", e.target.value)} className={selectCls}>
                      <option value="">-กรุณาเลือกตำบล-</option>
                      {districts.map(d => <option key={d.district_id} value={d.district_id}>{d.name_th}</option>)}
                    </select>
                  </div>
                </div>

                {/* Lat / Lng */}
                <div className="grid grid-cols-2 gap-3">
                  {[{ label: "Latitude", field: "latitude" }, { label: "Longitude", field: "longitude" }].map(({ label, field }) => (
                    <div key={field} className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-[var(--color-deep-text)]">{label}</label>
                      <input type="number" step="any" placeholder="0.000000"
                        disabled={isDeleteMode || isSubmitting} value={formValues[field]}
                        onChange={(e) => handleChange(field, e.target.value)} className={inputCls} />
                    </div>
                  ))}
                </div>
              </section>

              {/* ══ เนื้อหาแต่ละส่วน ══ */}
              <section className="bg-white rounded-2xl border border-[var(--color-border)] p-5">
                <FormSectionHeader icon="" title="เนื้อหาแต่ละส่วน" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5].map(n => (
                    <SectionCard
                      key={n} num={n}
                      formValues={formValues} fileValues={fileValues}
                      handleChange={handleChange}
                      handleFileChange={handleFileChange}
                      handleFileClear={handleFileClear}
                      isDeleteMode={isDeleteMode}
                      isSubmitting={isSubmitting}
                    />
                  ))}
                </div>
              </section>

              {/* ══ แหล่งอ้างอิง ══ */}
              <section className="bg-white rounded-2xl border border-[var(--color-border)] p-5 space-y-4">
                <FormSectionHeader icon="" title="แหล่งอ้างอิงข้อมูล" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--color-deep-text)]">
                      อ้างอิง (ไทย) <span className="text-[var(--color-error)]">*</span>
                    </label>
                    <textarea rows={5} placeholder="ระบุแหล่งที่มาหรือแหล่งอ้างอิงของข้อมูล..." required
                      disabled={isDeleteMode || isSubmitting} value={formValues.reference}
                      onChange={(e) => handleChange("reference", e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-y disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] bg-white text-[var(--color-deep-text)]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--color-deep-text)]">อ้างอิง (English)</label>
                    <textarea rows={5} placeholder="Reference in English..."
                      disabled={isDeleteMode || isSubmitting} value={formValues.reference_eng}
                      onChange={(e) => handleChange("reference_eng", e.target.value)}
                      className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-y disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] bg-white text-[var(--color-deep-text)]" />
                  </div>
                </div>
              </section>

            </form>
          </main>
        </div>

        {/* ── FOOTER / ปุ่ม ── */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[var(--color-border)] bg-white rounded-b-3xl flex-shrink-0">
          <button type="submit" form="royal-form" disabled={isSubmitting}
            onClick={handleSubmit}
            className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm active:scale-95 ${isSubmitting ? "bg-gray-400 cursor-not-allowed opacity-70"
                : isDeleteMode ? "bg-[var(--color-error)] hover:bg-[var(--color-error)]/90"
                  : "bg-[var(--color-forest-green)] hover:bg-[var(--color-deep-text)]"
              }`}>
            {isSubmitting ? "กำลังบันทึกข้อมูล..." : isDeleteMode ? "ยืนยันการลบโครงการนี้" : "บันทึกข้อมูล"}
          </button>
          <button type="button" onClick={onClose} disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-[var(--color-muted-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] rounded-xl transition-colors disabled:opacity-50">
            ยกเลิกและย้อนกลับ
          </button>
        </div>

      </div>
    </div>
  );
}