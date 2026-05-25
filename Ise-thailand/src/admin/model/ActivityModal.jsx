import { useState, useEffect } from "react";
import { X, Upload, Calendar, FileText, Image as ImageIcon } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../hook/useAuth";
import { UPLOADS_URL } from "../../constants/uploads_url";

export default function ActivityModal({ open, onClose, onCreateSuccess, onUpdateSuccess, onError, editData = null, typeId = null }) {
  const { user } = useAuth();
  const isEdit = !!editData;

  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    title_eng: "",
    detail: "",
    detail_eng: "",
    activity_date: "",
    typeact_id: "",
    img_file: null,
    pdf_file: null,
  });

  // โหลด activity_type สำหรับ dropdown
  useEffect(() => {
    api.get("/activity/count")
      .then(res => setActivityTypes(res.data.data || []))
      .catch(err => console.error(err));
  }, []);

  // ถ้าเป็น edit ให้ fill ข้อมูลเดิม
  useEffect(() => {
    if (isEdit && editData) {
      setForm({
        title: editData.title || "",
        title_eng: editData.title_eng || "",
        detail: editData.detail || "",
        detail_eng: editData.detail_eng || "",
        activity_date: editData.activity_date
          ? new Date(editData.activity_date).toISOString().split("T")[0]
          : "",
        typeact_id: editData.typeact_id || "",
        img_file: null,
        pdf_file: null,
        old_img_file: editData.img_file || "",
        old_pdf_file: editData.pdf_file || "",
      });
    } else {
      setForm({
        title: "",
        title_eng: "",
        detail: "",
        detail_eng: "",
        activity_date: "",
        typeact_id: typeId || "",
        img_file: null,
        pdf_file: null,
        old_img_file: "",
        old_pdf_file: "",
      });
    }
  }, [editData, open, typeId, isEdit]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm(f => ({ ...f, [name]: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.activity_date || !form.typeact_id) {
      onError("กรุณากรอกข้อมูลที่จำเป็น: ชื่อ, วันที่, ประเภท");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    const fields = ["typeact_id", "title", "title_eng", "detail", "detail_eng", "activity_date"];
    fields.forEach(key => {
      if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
        formData.append(key, form[key]);
      }
    });

    if (form.img_file) {
      formData.append("img_file", form.img_file);
    } else if (form.old_img_file) {
      formData.append("img_file", form.old_img_file);
    }

    if (form.pdf_file) {
      formData.append("pdf_file", form.pdf_file);
    } else if (form.old_pdf_file) {
      formData.append("pdf_file", form.old_pdf_file);
    }

    if (user?.id) formData.append("u_id", user.id);

    try {
      if (isEdit) {
        await api.put(`/activity/${editData.docno}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        onUpdateSuccess();
      } else {
        await api.post("/activity", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        onCreateSuccess();
      }
      onClose();
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-forest-green)]/40 p-2 sm:p-4 backdrop-blur-sm">
      
      {/* ── MAIN MODAL CONTAINER ── */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-full max-h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden border border-[var(--color-border)] animate-in fade-in zoom-in-95 duration-150">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--color-surface-3)] bg-[var(--color-surface)] shrink-0">
          <h2 className="text-base sm:text-lg font-extrabold text-[var(--color-forest-green)]">
            {isEdit ? "✏️ แก้ไขข้อมูลกิจกรรม" : "✨ เพิ่มกิจกรรมใหม่ของสถาบันฯ"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-3)] text-[var(--color-muted-text)] hover:text-[var(--color-deep-text)] transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 px-5 sm:px-6 py-4 overflow-y-auto space-y-4 custom-modal-scrollbar bg-white">
          
          {/* ── ส่วนที่ 1: ข้อมูลกิจกรรมพื้นฐาน ── */}
          <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/30 rounded-xl p-3 sm:p-4 space-y-3.5 shadow-3xs">
            <legend className="text-xs font-bold px-1.5 text-[var(--color-forest-green)]">หมวดหมู่และวันเวลา</legend>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ประเภทกิจกรรม */}
              {(isEdit || !typeId) && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[var(--color-deep-text)]">
                    ประเภทกิจกรรม <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <select
                    name="typeact_id"
                    value={form.typeact_id}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all disabled:bg-[var(--color-surface-2)] cursor-pointer"
                  >
                    <option value="">-- เลือกประเภทกิจกรรม --</option>
                    {activityTypes.map(type => (
                      <option key={type.typeact_id} value={type.typeact_id}>
                        {type.typeact_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* วันที่จัดกิจกรรม */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">
                  วันที่จัดกิจกรรม <span className="text-[var(--color-error)]">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    name="activity_date"
                    value={form.activity_date}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all"
                  />
                </div>
              </div>
            </div>
          </fieldset>

          {/* ── ส่วนที่ 2: ชื่อและหัวข้อกิจกรรม ── */}
          <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/30 rounded-xl p-3 sm:p-4 space-y-3.5 shadow-3xs">
            <legend className="text-xs font-bold px-1.5 text-[var(--color-forest-green)]">ชื่อหัวข้อกิจกรรม</legend>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ชื่อกิจกรรม (ไทย) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">
                  ชื่อกิจกรรม (ไทย) <span className="text-[var(--color-error)]">*</span>
                </label>
                <textarea
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  rows={2}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all resize-none min-h-[55px]"
                  placeholder="ชื่อกิจกรรมภาษาไทย..."
                />
              </div>

              {/* ชื่อกิจกรรม (อังกฤษ) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">ชื่อกิจกรรม (English)</label>
                <textarea
                  name="title_eng"
                  value={form.title_eng}
                  onChange={handleChange}
                  rows={2}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all resize-none min-h-[55px]"
                  placeholder="Activity title in English..."
                />
              </div>
            </div>
          </fieldset>

          {/* ── ส่วนที่ 3: คำอธิบายรายละเอียด ── */}
          <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/30 rounded-xl p-3 sm:p-4 space-y-3.5 shadow-3xs">
            <legend className="text-xs font-bold px-1.5 text-[var(--color-forest-green)]">รายละเอียดกิจกรรม</legend>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* รายละเอียด (ไทย) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">รายละเอียดคำอธิบาย (ไทย)</label>
                <textarea
                  name="detail"
                  value={form.detail}
                  onChange={handleChange}
                  rows={4}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all resize-y min-h-[90px]"
                  placeholder="รายละเอียดกิจกรรม..."
                />
              </div>

              {/* รายละเอียด (อังกฤษ) */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">รายละเอียดคำอธิบาย (English)</label>
                <textarea
                  name="detail_eng"
                  value={form.detail_eng}
                  onChange={handleChange}
                  rows={4}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all resize-y min-h-[90px]"
                  placeholder="Activity detail in English..."
                />
              </div>
            </div>
          </fieldset>

          {/* ── ส่วนที่ 4: ไฟล์แนบหลักฐานรูปภาพ + PDF ── */}
          <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/30 rounded-xl p-3 sm:p-4 space-y-3.5 shadow-3xs">
            <legend className="text-xs font-bold px-1.5 text-[var(--color-forest-green)]">ไฟล์เอกสารแนบประกอบ</legend>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ส่วนจัดการรูปภาพและกลุ่ม Preview */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">รูปภาพหน้าปก / รูปหลัก</label>
                
                {/* พรีวิวรูปเดิมจาก Server */}
                {!form.img_file && editData?.img_file && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-2)] mb-2 p-1">
                    <img src={`${UPLOADS_URL}${editData.img_file}`} alt="preview-old" className="w-full h-full object-cover rounded-lg" />
                  </div>
                )}
                {/* พรีวิวรูปที่เลือกใหม่จากเครื่อง */}
                {form.img_file && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-2)] mb-2 p-1">
                    <img src={URL.createObjectURL(form.img_file)} alt="preview-new" className="w-full h-full object-cover rounded-lg" />
                  </div>
                )}

                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-[var(--color-border)] bg-white rounded-xl cursor-pointer hover:border-[var(--color-green)] hover:bg-[var(--color-surface)]/30 transition-all overflow-hidden shadow-3xs">
                  <ImageIcon className="w-4 h-4 text-[var(--color-muted-text)] shrink-0" />
                  <span className="text-xs text-[var(--color-muted-text)] truncate flex-1">
                    {form.img_file ? form.img_file.name : (isEdit && editData?.img_file) ? editData.img_file : "เลือกไฟล์รูปภาพหลัก..."}
                  </span>
                  <input type="file" name="img_file" accept="image/*" onChange={handleChange} disabled={loading} className="hidden" />
                </label>
              </div>

              {/* ส่วนจัดการไฟล์เอกสาร PDF */}
              <div className="flex flex-col gap-1 justify-end">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">ไฟล์เอกสารสรุปกิจกรรม (PDF)</label>
                
                {/* เพิ่มบล็อกไอคอนบอกสถานะ PDF สวยๆ ถ้ามีไฟล์อยู่แล้ว */}
                {(form.pdf_file || (isEdit && editData?.pdf_file)) && (
                  <div className="w-full aspect-video rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] mb-2 flex flex-col items-center justify-center p-2 text-center text-red-600">
                    <FileText className="w-8 h-8 mb-1" />
                    <span className="text-[10px] text-[var(--color-muted-text)] font-semibold truncate w-full max-w-[200px]">
                      {form.pdf_file ? form.pdf_file.name : editData.pdf_file}
                    </span>
                  </div>
                )}

                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-[var(--color-border)] bg-white rounded-xl cursor-pointer hover:border-[var(--color-green)] hover:bg-[var(--color-surface)]/30 transition-all overflow-hidden shadow-3xs">
                  <FileText className="w-4 h-4 text-[var(--color-muted-text)] shrink-0" />
                  <span className="text-xs text-[var(--color-muted-text)] truncate flex-1">
                    {form.pdf_file ? form.pdf_file.name : (isEdit && editData?.pdf_file) ? editData.pdf_file : "เลือกไฟล์รายงาน PDF..."}
                  </span>
                  <input type="file" name="pdf_file" accept="application/pdf" onChange={handleChange} disabled={loading} className="hidden" />
                </label>
              </div>
            </div>
          </fieldset>

        </div>

        {/* FOOTER */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[var(--color-surface-3)] bg-[var(--color-surface)] flex justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs sm:text-sm font-bold text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-deep-text)] bg-white transition-colors cursor-pointer disabled:opacity-40"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-[var(--color-green)] text-white text-xs sm:text-sm font-bold hover:bg-[var(--color-forest-green)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
          >
            {loading ? "กำลังบันทึกข้อมูล..." : isEdit ? "บันทึกการแก้ไข" : "เพิ่มกิจกรรมใหม่"}
          </button>
        </div>

      </div>

      {/* Custom Scrollbar ย่อยแบรนด์ธรรมชาติ */}
      <style jsx global>{`
        .custom-modal-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-modal-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-modal-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-surface-3);
          border-radius: 999px;
        }
        .custom-modal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-disabled);
        }
      `}</style>
    </div>
  );
}