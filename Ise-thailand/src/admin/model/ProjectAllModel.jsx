import { useState, useEffect } from "react";
import { X, Upload, FileText } from "lucide-react";
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
  { key: "intro",       label: "หลักการและเหตุผล" },
  { key: "objective",   label: "วัตถุประสงค์" },
  { key: "methodology", label: "แนวทางการดำเนินงาน" },
  { key: "scope",       label: "ขอบเขตการดำเนินงาน" },
  { key: "proj_tarket", label: "เป้าหมายของแผนงานย่อย" },
  { key: "indicators",  label: "ตัวชี้วัดความสำเร็จ" },
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
  const isDeleteMode = mode === "delete";

  useEffect(() => {
    api.get("/project/types").then(res => setProjectTypes(res.data.data || []));
    api.get("/project/statuses").then(res => setStatuses(res.data.data || []));
    api.get("/project/researchers").then(res => setResearchers(res.data.data || []));
    api.get("/project/provinces").then(res => setProvinces(res.data.data || []));
  }, []);

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
    setFormValues(prev => ({ ...prev, pdffile: e.target.files[0] }));
  };

  const handleClearFile = () => {
    setFormValues(prev => ({ ...prev, pdffile: null, oldPdfFile: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDeleteMode) { onSave(formValues); return; }
    if (!formValues.name_thai.trim()) {
      Swal.fire({ title: "กรุณากรอกข้อมูล", text: "โปรดใส่ชื่อโครงการ (ไทย)", icon: "warning", confirmButtonColor: "var(--color-green)" });
      return;
    }
    onSave(formValues);
  };

  // filled count for checklist
  const filledCount = sections.filter(({ key }) => formValues[key]?.trim()).length;

  const inputClass = `w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] bg-white`;
  const textareaClass = `w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-y text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] bg-white`;
  const labelClass = "block text-sm font-bold text-[var(--color-deep-text)] mb-1";

  const currentPdfName = formValues.pdffile?.name || formValues.oldPdfFile || null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white font-sans antialiased text-[var(--color-deep-text)]">

      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[var(--color-surface-3)] shrink-0">
        <div>
          <h1 className={`text-xl font-extrabold ${isDeleteMode ? "text-[var(--color-error)]" : "text-[var(--color-deep-text)]"}`}>
            {isDeleteMode ? "🗑️ ยืนยันการลบโครงการ" : formValues.project_id ? "แก้ไขโครงการ/งานวิจัย" : "เพิ่มโครงการ/งานวิจัยใหม่"}
          </h1>
          <p className="text-xs text-[var(--color-muted-text)] mt-0.5">
            {isDeleteMode ? "โปรดตรวจสอบข้อมูลก่อนยืนยันการลบ" : "กรอกข้อมูลรายละเอียดและเนื้อหาโครงการเพื่อบันทึกเข้าสู่ระบบ"}
          </p>
        </div>
        <button onClick={onClose} disabled={saving} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-muted-text)] transition-colors cursor-pointer disabled:opacity-50">
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* BODY — 2-column layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT SIDEBAR */}
        <aside className="w-72 shrink-0 border-r border-[var(--color-surface-3)] flex flex-col gap-5 p-5 overflow-y-auto bg-white">

          {/* PDF Upload */}
          <div>
            <p className="text-sm font-bold text-[var(--color-deep-text)] mb-3">ไฟล์แนบโครงการ (PDF)</p>

            {/* Preview box */}
            <div className="border border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)] flex flex-col items-center justify-center py-8 mb-3 gap-2">
              <FileText className="w-10 h-10 text-[var(--color-muted-text)]/50" />
              {currentPdfName ? (
                <p className="text-xs text-center text-[var(--color-deep-text)] font-medium px-2 break-all">{currentPdfName}</p>
              ) : (
                <>
                  <p className="text-sm font-semibold text-[var(--color-muted-text)]">ไม่มีไฟล์ผูกไว้</p>
                  <p className="text-xs text-[var(--color-muted-text)]">PDF เท่านั้น</p>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <label className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-deep-text)] bg-white transition-all ${isDeleteMode || saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[var(--color-surface-2)]"}`}>
                <Upload className="w-3.5 h-3.5" />
                เลือกไฟล์
                <input type="file" accept=".pdf" disabled={isDeleteMode || saving} onChange={handleFileChange} className="hidden" />
              </label>
              {currentPdfName && (
                <button
                  type="button"
                  onClick={handleClearFile}
                  disabled={isDeleteMode || saving}
                  className="px-3 py-2 border border-[var(--color-border)] rounded-xl text-[var(--color-muted-text)] hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Checklist */}
          <div>
            <p className="text-sm font-bold text-[var(--color-deep-text)] mb-3">
              ตรวจสอบเนื้อหา ({filledCount}/{sections.length})
            </p>
            <div className="space-y-2">
              {sections.map(({ key, label }) => {
                const filled = !!formValues[key]?.trim();
                return (
                  <div key={key} className="flex items-center justify-between px-3 py-2 bg-[var(--color-surface)] rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${filled ? "bg-[var(--color-green)] border-[var(--color-green)]" : "border-[var(--color-border)]"}`}>
                        {filled && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-xs text-[var(--color-deep-text)]">{label}</span>
                    </div>
                    {!filled && (
                      <span className="text-xs font-semibold text-amber-500">ว่าง</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[var(--color-surface)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* ข้อมูลโครงการพื้นฐาน */}
            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[var(--color-muted-text)]">ⓘ</span>
                <h3 className="text-sm font-bold text-[var(--color-deep-text)]">ข้อมูลโครงการพื้นฐาน</h3>
              </div>

              <div className="space-y-4">
                {/* รหัสโครงการ */}
                {formValues.project_id && (
                  <div>
                    <label className={labelClass}>รหัสโครงการ</label>
                    <input type="text" disabled value={formValues.project_id} className={`${inputClass} font-mono font-bold cursor-not-allowed`} />
                  </div>
                )}

                {/* ชื่อโครงการ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>ชื่อโครงการ (ไทย) <span className="text-red-500">*</span></label>
                    <textarea rows={3} required disabled={isDeleteMode || saving} value={formValues.name_thai} onChange={e => handleChange("name_thai", e.target.value)} placeholder="ชื่อโครงการภาษาไทย..." className={textareaClass} />
                  </div>
                  <div>
                    <label className={labelClass}>ชื่อโครงการ (English)</label>
                    <textarea rows={3} disabled={isDeleteMode || saving} value={formValues.name_eng} onChange={e => handleChange("name_eng", e.target.value)} placeholder="Project name in English..." className={textareaClass} />
                  </div>
                </div>

                {/* ปีงบ + เฟส + ประเภท + หัวหน้า */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={labelClass}>ปีงบประมาณ <span className="text-red-500">*</span></label>
                    <input type="text" required disabled={isDeleteMode || saving} value={formValues.year_budget} onChange={e => handleChange("year_budget", e.target.value)} placeholder="เช่น 2566" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>เฟสโครงการ <span className="text-red-500">*</span></label>
                    <input type="number" required disabled={isDeleteMode || saving} value={formValues.phase_project} onChange={e => handleChange("phase_project", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>ประเภทโครงการ <span className="text-red-500">*</span></label>
                    <select required disabled={isDeleteMode || saving} value={formValues.type_id} onChange={e => handleChange("type_id", e.target.value)} className={inputClass}>
                      <option value="">ไม่ระบุ</option>
                      {projectTypes.map(t => <option key={t.type_id} value={t.type_id}>{t.type_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>หัวหน้าโครงการ</label>
                    <select disabled={isDeleteMode || saving} value={formValues.researcher_id} onChange={e => handleChange("researcher_id", e.target.value)} className={inputClass}>
                      <option value="">-- เลือกนักวิจัย --</option>
                      {researchers.map(r => <option key={r.researcher_id} value={r.researcher_id}>{r.researcher_name} {r.researcher_surname}</option>)}
                    </select>
                  </div>
                </div>

                {/* วันที่ + สถานะ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>วันที่เริ่มโครงการ</label>
                    <input type="date" disabled={isDeleteMode || saving} value={formValues.start_date} onChange={e => handleChange("start_date", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>วันที่สิ้นสุดโครงการ</label>
                    <input type="date" disabled={isDeleteMode || saving} value={formValues.end_date} onChange={e => handleChange("end_date", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>สถานะโครงการ <span className="text-red-500">*</span></label>
                    <select required disabled={isDeleteMode || saving} value={formValues.status} onChange={e => handleChange("status", e.target.value)} className={inputClass}>
                      {statuses.map(s => <option key={s.status_id} value={s.status_id}>{s.status_name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* พื้นที่และงบประมาณ */}
            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-500">📍</span>
                <h3 className="text-sm font-bold text-[var(--color-deep-text)]">พื้นที่และงบประมาณดำเนินงาน</h3>
              </div>

              <div className="space-y-4">
                {/* จังหวัด + อำเภอ + ตำบล */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>จังหวัด <span className="text-red-500">*</span></label>
                    <select required disabled={isDeleteMode || saving} value={formValues.province_id} onChange={e => handleChange("province_id", e.target.value)} className={inputClass}>
                      <option value="">-- เลือกจังหวัด --</option>
                      {provinces.map(p => <option key={p.province_id} value={p.province_id}>{p.name_th}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>อำเภอ <span className="text-red-500">*</span></label>
                    <select required disabled={isDeleteMode || saving || !formValues.province_id} value={formValues.amphure_id} onChange={e => handleChange("amphure_id", e.target.value)} className={inputClass}>
                      <option value="">-- เลือกอำเภอ --</option>
                      {amphures.map(a => <option key={a.amphure_id} value={a.amphure_id}>{a.name_th}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>ตำบล <span className="text-red-500">*</span></label>
                    <select required disabled={isDeleteMode || saving || !formValues.amphure_id} value={formValues.district_id} onChange={e => handleChange("district_id", e.target.value)} className={inputClass}>
                      <option value="">-- เลือกตำบล --</option>
                      {districts.map(d => <option key={d.district_id} value={d.district_id}>{d.name_th}</option>)}
                    </select>
                  </div>
                </div>

                {/* งบประมาณ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>วงเงินงบประมาณ (บาท)</label>
                    <input type="number" disabled={isDeleteMode || saving} value={formValues.cost} onChange={e => handleChange("cost", e.target.value)} placeholder="0" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>การเบิกจ่าย (บาท)</label>
                    <input type="number" disabled={isDeleteMode || saving} value={formValues.budget_pay} onChange={e => handleChange("budget_pay", e.target.value)} placeholder="0" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>ระยะเวลาดำเนินงาน (ปี)</label>
                    <input type="number" disabled={isDeleteMode || saving} value={formValues.proj_long} onChange={e => handleChange("proj_long", e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* รายละเอียดเนื้อหาโครงการ */}
            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[var(--color-muted-text)]">☰</span>
                <h3 className="text-sm font-bold text-[var(--color-deep-text)]">รายละเอียดเนื้อหาโครงการ</h3>
              </div>

              <div className="space-y-4">
                {sections.map(({ key, label }) => (
                  <div key={key} className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-surface)]">
                      <span className="w-1.5 h-5 rounded-full bg-[var(--color-green)] inline-block shrink-0" />
                      <span className="text-sm font-bold text-[var(--color-deep-text)]">{label}</span>
                    </div>
                    <div className="p-3 bg-white">
                      <textarea
                        rows={5}
                        disabled={isDeleteMode || saving}
                        value={formValues[key] || ""}
                        onChange={e => handleChange(key, e.target.value)}
                        placeholder={`พิมพ์เนื้อหาและคำอธิบายเกี่ยวกับ ${label}...`}
                        className={`${textareaClass} border-0 focus:ring-0 px-1`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </form>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="flex items-center gap-3 px-6 py-4 bg-white border-t border-[var(--color-surface-3)] shrink-0">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all cursor-pointer disabled:opacity-50
            ${isDeleteMode ? "bg-[var(--color-error)] hover:bg-[var(--color-error)]/90" : "bg-[var(--color-green)] hover:bg-[var(--color-forest-green)]"}`}
        >
          {saving ? "กำลังบันทึก..." : isDeleteMode ? "ยืนยันการลบ" : "บันทึกข้อมูล"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="px-5 py-2.5 text-sm font-bold text-[var(--color-muted-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
        >
          ยกเลิก
        </button>
      </footer>

    </div>
  );
}