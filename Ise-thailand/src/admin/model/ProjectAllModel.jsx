import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
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
    // ถ้าเป็น "2026-05-18" หรือ "2026-05-18T00:00:00.000Z" ให้ตัดเอาแค่ YYYY-MM-DD
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
          oldPdfFile: projectData.pdffile || null, // เก็บชื่อไฟล์เดิมไว้
        });
      } else {
        setFormValues(initialFormState);
        setAmphures([]);
        setDistricts([]);
      }
    }
  }, [isOpen, projectData]);

  // โหลดอำเภอเมื่อมี province_id (รวมตอน edit)
  useEffect(() => {
    if (formValues.province_id) {
      api.get(`/project/amphures/${formValues.province_id}`)
        .then(res => setAmphures(res.data.data || []));
    } else {
      setAmphures([]);
      setDistricts([]);
    }
  }, [formValues.province_id]);

  // โหลดตำบลเมื่อมี amphure_id (รวมตอน edit)
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
    // ถ้าเปลี่ยนจังหวัด ให้ reset อำเภอและตำบล
    if (field === "province_id") {
      setFormValues(prev => ({ ...prev, province_id: value, amphure_id: "", district_id: "" }));
      return;
    }
    // ถ้าเปลี่ยนอำเภอ ให้ reset ตำบล
    if (field === "amphure_id") {
      setFormValues(prev => ({ ...prev, amphure_id: value, district_id: "" }));
      return;
    }
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setFormValues(prev => ({ ...prev, pdffile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isDeleteMode) {
      onSave(formValues);
      return;
    }

    if (!formValues.name_thai.trim()) {
      Swal.fire({ title: "กรุณากรอกข้อมูล", text: "โปรดใส่ชื่อโครงการ (ไทย)", icon: "warning", confirmButtonColor: "var(--color-green)" });
      return;
    }

    onSave(formValues);
  };

  const inputClass = `w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] bg-white`;
  const textareaClass = `w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-y text-[var(--color-deep-text)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)] bg-white`;
  const labelClass = "block text-sm font-bold text-[var(--color-deep-text)] mb-1";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-surface)] font-sans antialiased text-[var(--color-deep-text)]">

      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[var(--color-surface-3)] shrink-0 shadow-sm">
        <div>
          <h1 className={`text-xl font-extrabold ${isDeleteMode ? "text-[var(--color-error)]" : "text-[var(--color-forest-green)]"}`}>
            {isDeleteMode
              ? "🗑️ ยืนยันการลบโครงการ"
              : formValues.project_id
                ? "แก้ไขโครงการ/งานวิจัย"
                : "เพิ่มโครงการ/งานวิจัยใหม่"}
          </h1>
          <p className="text-xs text-[var(--color-muted-text)] font-medium mt-0.5">
            {isDeleteMode ? "โปรดตรวจสอบข้อมูลก่อนยืนยันการลบ" : "กรอกข้อมูลรายละเอียดโครงการ"}
          </p>
        </div>
        <button
          onClick={onClose}
          disabled={saving}
          className="p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-muted-text)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* BODY */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className={`bg-white border rounded-2xl shadow-sm p-6 max-w-5xl mx-auto ${isDeleteMode ? "border-red-200 bg-red-50/20" : "border-[var(--color-border)]"}`}>
          <form onSubmit={handleSubmit} className="space-y-6">

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
                <label className={labelClass}>ชื่อโครงการ (Eng)</label>
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
                <label className={labelClass}>เฟส <span className="text-red-500">*</span></label>
                <input type="number" required disabled={isDeleteMode || saving} value={formValues.phase_project} onChange={e => handleChange("phase_project", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>ประเภทโครงการ <span className="text-red-500">*</span></label>
                <select required disabled={isDeleteMode || saving} value={formValues.type_id} onChange={e => handleChange("type_id", e.target.value)} className={inputClass}>
                  <option value="">-- เลือกประเภท --</option>
                  {projectTypes.map(t => (
                    <option key={t.type_id} value={t.type_id}>{t.type_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>หัวหน้าโครงการ</label>
                <select disabled={isDeleteMode || saving} value={formValues.researcher_id} onChange={e => handleChange("researcher_id", e.target.value)} className={inputClass}>
                  <option value="">-- เลือกนักวิจัย --</option>
                  {researchers.map(r => (
                    <option key={r.researcher_id} value={r.researcher_id}>
                      {r.researcher_name} {r.researcher_surname}
                    </option>
                  ))}
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
                <label className={labelClass}>สถานะ <span className="text-red-500">*</span></label>
                <select required disabled={isDeleteMode || saving} value={formValues.status} onChange={e => handleChange("status", e.target.value)} className={inputClass}>
                  {statuses.map(s => (
                    <option key={s.status_id} value={s.status_id}>{s.status_name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* จังหวัด + อำเภอ + ตำบล */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>จังหวัด <span className="text-red-500">*</span></label>
                <select
                  required
                  disabled={isDeleteMode || saving}
                  value={formValues.province_id}
                  onChange={e => handleChange("province_id", e.target.value)}
                  className={inputClass}
                >
                  <option value="">-- เลือกจังหวัด --</option>
                  {provinces.map(p => (
                    <option key={p.province_id} value={p.province_id}>{p.name_th}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>อำเภอ <span className="text-red-500">*</span></label>
                <select
                  required
                  disabled={isDeleteMode || saving || !formValues.province_id}
                  value={formValues.amphure_id}
                  onChange={e => handleChange("amphure_id", e.target.value)}
                  className={inputClass}
                >
                  <option value="">-- เลือกอำเภอ --</option>
                  {amphures.map(a => (
                    <option key={a.amphure_id} value={a.amphure_id}>{a.name_th}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>ตำบล <span className="text-red-500">*</span></label>
                <select
                  required
                  disabled={isDeleteMode || saving || !formValues.amphure_id}
                  value={formValues.district_id}
                  onChange={e => handleChange("district_id", e.target.value)}
                  className={inputClass}
                >
                  <option value="">-- เลือกตำบล --</option>
                  {districts.map(d => (
                    <option key={d.district_id} value={d.district_id}>{d.name_th}</option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="border-[var(--color-surface-3)]" />

            {/* SECTIONS */}
            <div>
              <h3 className="text-base font-extrabold text-[var(--color-forest-green)] mb-4">
                รายละเอียดเนื้อหาโครงการ
              </h3>
              <div className="space-y-4">
                {sections.map(({ key, label }) => (
                  <div key={key}>
                    <label className={labelClass}>{label}</label>
                    <textarea
                      rows={5}
                      disabled={isDeleteMode || saving}
                      value={formValues[key] || ""}
                      onChange={e => handleChange(key, e.target.value)}
                      placeholder={`พิมพ์เนื้อหา ${label}...`}
                      className={textareaClass}
                    />
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-[var(--color-surface-3)]" />

            {/* งบประมาณ + ระยะเวลา */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>วงเงินงบประมาณ (บาท)</label>
                <input type="number" disabled={isDeleteMode || saving} value={formValues.cost} onChange={e => handleChange("cost", e.target.value)} placeholder="0.00" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>การเบิกจ่าย (บาท)</label>
                <input type="number" disabled={isDeleteMode || saving} value={formValues.budget_pay} onChange={e => handleChange("budget_pay", e.target.value)} placeholder="0.00" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>ระยะเวลาดำเนินงาน (ปี)</label>
                <input type="number" disabled={isDeleteMode || saving} value={formValues.proj_long} onChange={e => handleChange("proj_long", e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* ไฟล์ PDF */}
            <div>
              <label className={labelClass}>ไฟล์แนบ (PDF)</label>
              <label className={`flex items-center gap-2 px-4 py-2 border border-dashed border-[var(--color-border)] rounded-xl transition-all ${isDeleteMode || saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-[var(--color-green)] hover:bg-[var(--color-surface)]/20"}`}>
                <Upload className="w-4 h-4 text-[var(--color-muted-text)]" />
                <span className="text-sm text-[var(--color-muted-text)] truncate">
                  {formValues.pdffile ? formValues.pdffile.name : (projectData?.pdffile || "เลือกไฟล์ PDF...")}
                </span>
                <input type="file" accept=".pdf" disabled={isDeleteMode || saving} onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-surface-3)]">
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                  ${isDeleteMode
                    ? "bg-[var(--color-error)] hover:bg-[var(--color-error)]/90"
                    : "bg-[var(--color-green)] hover:bg-[var(--color-forest-green)]"
                  }`}
              >
                {saving
                  ? "กำลังบันทึก..."
                  : isDeleteMode
                    ? "ยืนยันการลบ"
                    : "บันทึกข้อมูล"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-bold text-[var(--color-muted-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ยกเลิก
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}