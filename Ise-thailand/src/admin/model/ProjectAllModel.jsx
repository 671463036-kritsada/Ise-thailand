import { useState, useEffect, useRef } from "react";
import { X, Upload, FileText, CheckSquare, AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";

const initialFormState = {
  project_id: "",
  name_thai: "",
  name_eng: "",
  type_id: "",
  researcher_id: "",
  year_budget: "",
  phase_project: "1",
  start_date: "",
  end_date: "",
  status: "1",
  intro: "",
  objective: "",
  methodology: "",
  scope: "",
  proj_tarket: "",
  indicators: "",
  proj_result: "",
  proj_output: "",
  cost: "",
  budget_pay: "0",
  proj_long: "1",
  pdffile: null,
  province_id: "",
  amphure_id: "",
  district_id: "",
};

const sections = [
  { key: "intro", label: "หลักการและเหตุผล" },
  { key: "objective", label: "วัตถุประสงค์" },
  { key: "methodology", label: "แนวทางการดำเนินงาน" },
  { key: "scope", label: "ขอบเขตการดำเนินงาน" },
  { key: "proj_tarket", label: "เป้าหมายของแผนงานย่อย" },
  { key: "indicators", label: "ตัวชี้วัดความสำเร็จ" },
  { key: "proj_result", label: "ผลผลิตระดับกิจกรรม" },
  { key: "proj_output", label: "ผลงานที่ต้องส่งมอบ" },
];

export default function ProjectAllModel({ isOpen, onClose, projectData, mode, onSave, saving }) {
  const [formValues, setFormValues] = useState(initialFormState);
  const [projectTypes, setProjectTypes] = useState([]);
  const [researchers, setResearchers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [districts, setDistricts] = useState([]);
  
  const fileInputRef = useRef(null);
  const isDeleteMode = mode === "delete";

  // โหลด dropdown data ครั้งเดียว
  useEffect(() => {
    api.get("/project/types").then(res => setProjectTypes(res.data.data || []));
    api.get("/project/statuses").then(res => setStatuses(res.data.data || []));
    api.get("/project/researchers").then(res => setResearchers(res.data.data || []));
    api.get("/project/provinces").then(res => setProvinces(res.data.data || []));
  }, []);

  // แปลงวันที่แบบไม่สนใจ timezone
  const toLocalDate = (dateStr) => {
    if (!dateStr) return "";
    return String(dateStr).substring(0, 10);
  };

  useEffect(() => {
    if (isOpen) {
      if (projectData) {
        setFormValues({
          ...initialFormState,
          ...projectData,
          start_date: toLocalDate(projectData.start_date),
          end_date: toLocalDate(projectData.end_date),
          pdffile: null,
          oldPdfFile: projectData.pdffile || null,
        });
      } else {
        setFormValues(initialFormState);
        setAmphures([]);
        setDistricts([]);
      }
    }
  }, [isOpen, projectData]);

  // โหลดอำเภอเมื่อมี province_id
  useEffect(() => {
    if (formValues.province_id) {
      api.get(`/project/amphures/${formValues.province_id}`)
        .then(res => setAmphures(res.data.data || []));
    } else {
      setAmphures([]);
      setDistricts([]);
    }
  }, [formValues.province_id]);

  // โหลดตำบลเมื่อมี amphure_id
  useEffect(() => {
    if (formValues.amphure_id) {
      api.get(`/project/districts/${formValues.amphure_id}`)
        .then(res => setDistricts(res.data.data || []));
    } else {
      setDistricts([]);
    }
  }, [formValues.amphure_id]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    if (field === "province_id") {
      setFormValues(prev => ({ ...prev, province_id: value, amphure_id: "", district_id: "" }));
      return;
    }
    if (field === "amphure_id") {
      setFormValues(prev => ({ ...prev, amphure_id: value, district_id: "" }));
      return;
    }
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFormValues(prev => ({ ...prev, pdffile: e.target.files[0] }));
    }
  };

  const handleFileClear = () => {
    setFormValues(prev => ({ ...prev, pdffile: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (saving) return;

    if (isDeleteMode) {
      onSave(formValues);
      return;
    }

    if (!formValues.name_thai.trim()) {
      Swal.fire({ 
        title: "กรุณากรอกข้อมูล", 
        text: "โปรดใส่ชื่อโครงการ (ไทย)", 
        icon: "warning", 
        confirmButtonColor: "var(--color-green)" 
      });
      return;
    }

    onSave(formValues);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-forest-green)]/40 font-sans antialiased p-2 sm:p-4 backdrop-blur-sm">
      
      {/* ── MAIN MODAL CONTAINER ── */}
      <div className="bg-[var(--color-white)] w-full max-w-[72rem] h-[95vh] sm:h-[90vh] rounded-2xl flex flex-col shadow-xl border border-[var(--color-border)] overflow-hidden">
        
        {/* ── HEADER ส่วนหัวฟอร์ม ── */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[var(--color-border)] shrink-0 bg-[var(--color-surface)]">
          <div>
            <h1 className="text-base sm:text-xl font-bold text-[var(--color-forest-green)]">
              {isDeleteMode 
                ? "🗑️ ยืนยันการลบโครงการ/งานวิจัย" 
                : formValues.project_id 
                  ? "แก้ไขโครงการ/งานวิจัย" 
                  : "เพิ่มโครงการ/งานวิจัยใหม่"}
            </h1>
            <p className="text-[11px] sm:text-xs font-medium text-[var(--color-muted-text)] mt-0.5">
              {isDeleteMode ? "โปรดตรวจสอบข้อมูลชุดนี้อย่างละเอียดก่อนกดปุ่มลบถาวร" : "กรอกข้อมูลรายละเอียดและเนื้อหาโครงการเพื่อบันทึกเข้าสู่ระบบ"}
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            disabled={saving} 
            className="p-1.5 rounded-lg text-[var(--color-muted-text)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-deep-text)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* ── FORM CONTENT ── */}
        {/* 💡 แยกการ Scroll ให้สมบูรณ์: จอเล็กเลื่อนดิ่งรวมที่ฟอร์มด้วย overflow-y-auto ส่วนจอใหญ่ lg ล็อคความสูงด้วย overflow-hidden แล้วแยกตัวสกรอลล์ด้านใน */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden bg-[var(--color-surface)]">
          
          {/* ── คอลัมน์ซ้าย (SIDEBAR): ส่วนจัดการไฟล์ PDF และเช็คลิสต์หัวข้อ ── */}
          {/* 💡 แก้ไข: เพิ่ม `lg:overflow-y-auto` และคลาส scrollbar เพื่อให้ฝั่งซ้ายสามารถ Scroll แยกเดี่ยวได้เมื่ออยู่บนหน้าจอคอมพิวเตอร์ขนาดใหญ่ */}
          <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 shrink-0 flex flex-col gap-4 lg:overflow-y-auto custom-project-scrollbar">
            
            {/* 1. ส่วนจัดการไฟล์แนบ (PDF) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-deep-text)]">
                ไฟล์แนบโครงการ (PDF)
              </label>
              <div className="bg-[var(--color-white)] p-3 rounded-xl border border-[var(--color-border)] flex flex-col gap-2 shadow-xs">
                <div className="w-full aspect-[21/9] sm:aspect-video rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col items-center justify-center p-3 text-center relative overflow-hidden">
                  <FileText className={`w-6 h-6 sm:w-8 sm:h-8 mb-1 ${formValues.pdffile || projectData?.pdffile ? "text-red-500" : "text-[var(--color-disabled)]"}`} />
                  <p className="text-xs font-semibold text-[var(--color-deep-text)] truncate w-full max-w-[200px]">
                    {formValues.pdffile ? formValues.pdffile.name : (projectData?.pdffile || "ไม่มีไฟล์ผูกไว้")}
                  </p>
                  <span className="text-[10px] text-[var(--color-muted-text)] mt-0.5">
                    {formValues.pdffile ? "ไฟล์รออัปโหลด" : projectData?.pdffile ? "ไฟล์เดิมในระบบ" : "PDF เท่านั้น"}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    disabled={isDeleteMode || saving}
                    onClick={() => fileInputRef.current?.click()}
                    className="col-span-3 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-[var(--color-border)] text-xs font-bold text-[var(--color-deep-text)] bg-[var(--color-white)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5 text-[var(--color-muted-text)]" />
                    <span>เลือกไฟล์</span>
                  </button>
                  <button
                    type="button"
                    disabled={isDeleteMode || saving || !formValues.pdffile}
                    onClick={handleFileClear}
                    className="col-span-1 flex items-center justify-center p-1.5 rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept=".pdf" 
                disabled={isDeleteMode || saving} 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>

            {/* 2. เช็คลิสต์รายการหัวข้อเนื้อหา */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-deep-text)]">
                ตรวจสอบเนื้อหา ({sections.filter(s => formValues[s.key]?.trim()).length}/{sections.length})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1">
                {sections.map(({ key, label }) => {
                  const hasContent = formValues[key]?.trim();
                  return (
                    <div key={key} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--color-white)] border border-[var(--color-border)] text-xs shadow-xs">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <CheckSquare className={`w-3.5 h-3.5 shrink-0 ${hasContent ? 'text-[var(--color-success)]' : 'text-[var(--color-disabled)]'}`} />
                        <span className="font-semibold text-[var(--color-deep-text)] truncate">{label}</span>
                      </div>
                      <span className={`text-[10px] font-bold shrink-0 ${hasContent ? "text-[var(--color-success)]" : "text-[var(--color-warning)]"}`}>
                        {hasContent ? "กรอกแล้ว" : "ว่าง"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ── คอลัมน์ขวา (MAIN CONTENT): ช่องกรอกฟอร์ม ข้อมูลหลัก ── */}
          <main className="flex-1 p-4 sm:p-6 space-y-6 bg-[var(--color-white)] lg:overflow-y-auto custom-project-scrollbar">
            
            {isDeleteMode && (
              <div className="flex items-start gap-3 p-4 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-xl text-[var(--color-error)] text-sm font-semibold">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p>คำเตือน: คุณกำลังอยู่ในโหมดลบข้อมูล</p>
                  <p className="text-xs font-normal opacity-80 mt-0.5">กรุณาตรวจสอบรายละเอียดโครงการด้านล่างก่อนคลิกปุ่มยืนยันด้านล่างสุด</p>
                </div>
              </div>
            )}

            {/* บล็อกที่ 1: ข้อมูลโครงการพื้นฐาน */}
            <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/40 rounded-xl p-3 sm:p-4 space-y-4 shadow-xs">
              <legend className="text-xs font-bold px-2 text-[var(--color-forest-green)] flex items-center gap-1.5">
                <span>ⓘ</span> ข้อมูลโครงการพื้นฐาน
              </legend>

              {formValues.project_id && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">รหัสโครงการ</label>
                  <input type="text" disabled value={formValues.project_id} 
                    className="w-full px-3 py-1.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-muted-text)] font-mono font-bold cursor-not-allowed" />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">ชื่อโครงการ (ไทย) <span className="text-[var(--color-error)]">*</span></label>
                  <textarea rows={3} required disabled={isDeleteMode || saving} value={formValues.name_thai} 
                    onChange={e => handleChange("name_thai", e.target.value)} placeholder="ชื่อโครงการภาษาไทย..." 
                    className="w-full px-3 py-2 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] disabled:bg-[var(--color-surface-2)] min-h-[70px] resize-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">ชื่อโครงการ (English)</label>
                  <textarea rows={3} disabled={isDeleteMode || saving} value={formValues.name_eng} 
                    onChange={e => handleChange("name_eng", e.target.value)} placeholder="Project name in English..." 
                    className="w-full px-3 py-2 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] disabled:bg-[var(--color-surface-2)] min-h-[70px] resize-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">ปีงบประมาณ <span className="text-[var(--color-error)]">*</span></label>
                  <input type="text" required disabled={isDeleteMode || saving} value={formValues.year_budget} onChange={e => handleChange("year_budget", e.target.value)} placeholder="เช่น 2566" 
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">เฟสโครงการ <span className="text-[var(--color-error)]">*</span></label>
                  <input type="number" required disabled={isDeleteMode || saving} value={formValues.phase_project} onChange={e => handleChange("phase_project", e.target.value)} 
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">ประเภทโครงการ <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode || saving} value={formValues.type_id} onChange={e => handleChange("type_id", e.target.value)} 
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)]">
                    <option value="">-- เลือกประเภท --</option>
                    {projectTypes.map(t => <option key={t.type_id} value={t.type_id}>{t.type_name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">หัวหน้าโครงการ</label>
                  <select disabled={isDeleteMode || saving} value={formValues.researcher_id} onChange={e => handleChange("researcher_id", e.target.value)} 
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)]">
                    <option value="">-- เลือกนักวิจัย --</option>
                    {researchers.map(r => <option key={r.researcher_id} value={r.researcher_id}>{r.researcher_name} {r.researcher_surname}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">วันที่เริ่มโครงการ</label>
                  <input type="date" disabled={isDeleteMode || saving} value={formValues.start_date} onChange={e => handleChange("start_date", e.target.value)} 
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">วันที่สิ้นสุดโครงการ</label>
                  <input type="date" disabled={isDeleteMode || saving} value={formValues.end_date} onChange={e => handleChange("end_date", e.target.value)} 
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">สถานะโครงการ <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode || saving} value={formValues.status} onChange={e => handleChange("status", e.target.value)} 
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)]">
                    {statuses.map(s => <option key={s.status_id} value={s.status_id}>{s.status_name}</option>)}
                  </select>
                </div>
              </div>
            </fieldset>

            {/* บล็อกที่ 2: พื้นที่และระยะเวลาดำเนินงาน */}
            <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/40 rounded-xl p-3 sm:p-4 space-y-4 shadow-xs">
              <legend className="text-xs font-bold px-2 text-[var(--color-forest-green)] flex items-center gap-1.5">
                <span>📍</span> พื้นที่และงบประมาณดำเนินงาน
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">จังหวัด <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode || saving} value={formValues.province_id} onChange={e => handleChange("province_id", e.target.value)}
                    className="w-full px-2 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-xs">
                    <option value="">-- เลือกจังหวัด --</option>
                    {provinces.map(p => <option key={p.province_id} value={p.province_id}>{p.name_th}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">อำเภอ <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode || saving || !formValues.province_id} value={formValues.amphure_id} onChange={e => handleChange("amphure_id", e.target.value)}
                    className="w-full px-2 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-xs">
                    <option value="">-- เลือกอำเภอ --</option>
                    {amphures.map(a => <option key={a.amphure_id} value={a.amphure_id}>{a.name_th}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">ตำบล <span className="text-[var(--color-error)]">*</span></label>
                  <select required disabled={isDeleteMode || saving || !formValues.amphure_id} value={formValues.district_id} onChange={e => handleChange("district_id", e.target.value)}
                    className="w-full px-2 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-xs">
                    <option value="">-- เลือกตำบล --</option>
                    {districts.map(d => <option key={d.district_id} value={d.district_id}>{d.name_th}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">วงเงินงบประมาณ (บาท)</label>
                  <input type="number" disabled={isDeleteMode || saving} value={formValues.cost} onChange={e => handleChange("cost", e.target.value)} placeholder="0.00" 
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">การเบิกจ่าย (บาท)</label>
                  <input type="number" disabled={isDeleteMode || saving} value={formValues.budget_pay} onChange={e => handleChange("budget_pay", e.target.value)} placeholder="0.00" 
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[var(--color-deep-text)]">ระยะเวลาดำเนินงาน (ปี)</label>
                  <input type="number" disabled={isDeleteMode || saving} value={formValues.proj_long} onChange={e => handleChange("proj_long", e.target.value)} 
                    className="w-full px-3 py-1.5 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)]" />
                </div>
              </div>
            </fieldset>

            {/* บล็อกที่ 3: รายละเอียดเนื้อหาโครงการย่อย */}
            <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/40 rounded-xl p-3 sm:p-4 space-y-5 shadow-xs">
              <legend className="text-xs font-bold px-2 text-[var(--color-forest-green)] flex items-center gap-1.5">
                <span>📋</span> รายละเอียดเนื้อหาโครงการ
              </legend>

              <div className="space-y-4">
                {sections.map(({ key, label }) => (
                  <div key={key} className="flex flex-col gap-1 bg-[var(--color-white)] p-3.5 border border-[var(--color-border)] rounded-xl shadow-2xs">
                    <label className="text-xs font-bold text-[var(--color-deep-text)] flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-3 bg-[var(--color-green)] rounded-full"></span>
                      {label}
                    </label>
                    <textarea
                      rows={5} 
                      disabled={isDeleteMode || saving}
                      value={formValues[key] || ""}
                      onChange={e => handleChange(key, e.target.value)}
                      placeholder={`พิมพ์เนื้อหาและคำอธิบายเกี่ยวกับ ${label}...`}
                      className="w-full px-3 py-2 bg-[var(--color-white)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)] resize-y min-h-[110px]"
                    />
                  </div>
                ))}
              </div>
            </fieldset>

          </main>
        </form>

        {/* ── FOOTER ส่วนควบคุมการส่งข้อมูล ── */}
        <footer className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] shrink-0">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={saving}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-[var(--color-white)] transition-all active:scale-98 cursor-pointer ${
              saving
                ? "bg-[var(--color-disabled)] cursor-not-allowed opacity-50"
                : isDeleteMode
                  ? "bg-[var(--color-error)] hover:opacity-90"
                  : "bg-[var(--color-green)] hover:bg-[var(--color-forest-green)]"
            }`}
          >
            {saving
              ? "กำลังบันทึกข้อมูล..."
              : isDeleteMode
                ? "ยืนยันการลบข้อมูลโครงการ"
                : "บันทึกข้อมูล"}
          </button>
          
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2.5 text-sm font-semibold text-[var(--color-muted-text)] border border-[var(--color-border)] bg-[var(--color-white)] hover:bg-[var(--color-surface-2)] rounded-xl transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
        </footer>

      </div>

      {/* ปรับแต่งความลื่นไหลและสไตล์ของแท่ง scrollbar */}
      <style jsx global>{`
        .custom-project-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-project-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-project-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 999px;
        }
        .custom-project-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-muted-text);
        }
      `}</style>

    </div>
  );
}