// ActivityModal.jsx
import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import api from "../../api/axios";

export default function ActivityModal({ open, onClose, onSuccess, editData = null }) {
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
      });
    } else {
      setForm({
        title: "",
        title_eng: "",
        detail: "",
        detail_eng: "",
        activity_date: "",
        typeact_id: "",
        img_file: null,
        pdf_file: null,
      });
    }
  }, [editData, open]);

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
      alert("กรุณากรอกข้อมูลที่จำเป็น: ชื่อ, วันที่, ประเภท");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null && val !== undefined) formData.append(key, val);
    });

    try {
      if (isEdit) {
        await api.put(`/activity/${editData.docno}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await api.post("/activity", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-surface-3)]">
          <h2 className="text-lg font-extrabold text-[var(--color-forest-green)]">
            {isEdit ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรมใหม่"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-muted-text)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 space-y-4">

          {/* ประเภทกิจกรรม */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
              ประเภทกิจกรรม <span className="text-red-500">*</span>
            </label>
            <select
              name="typeact_id"
              value={form.typeact_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-white text-[var(--color-deep-text)]"
            >
              <option value="">-- เลือกประเภท --</option>
              {activityTypes.map(type => (
                <option key={type.typeact_id} value={type.typeact_id}>
                  {type.typeact_name}
                </option>
              ))}
            </select>
          </div>

          {/* ชื่อกิจกรรม (ไทย) */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
              ชื่อกิจกรรม (ไทย) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="title"
              value={form.title}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-none text-[var(--color-deep-text)]"
              placeholder="ชื่อกิจกรรมภาษาไทย..."
            />
          </div>

          {/* ชื่อกิจกรรม (อังกฤษ) */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
              ชื่อกิจกรรม (English)
            </label>
            <textarea
              name="title_eng"
              value={form.title_eng}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-none text-[var(--color-deep-text)]"
              placeholder="Activity title in English..."
            />
          </div>

          {/* รายละเอียด (ไทย) */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
              รายละเอียด (ไทย)
            </label>
            <textarea
              name="detail"
              value={form.detail}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-none text-[var(--color-deep-text)]"
              placeholder="รายละเอียดกิจกรรม..."
            />
          </div>

          {/* รายละเอียด (อังกฤษ) */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
              รายละเอียด (English)
            </label>
            <textarea
              name="detail_eng"
              value={form.detail_eng}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-none text-[var(--color-deep-text)]"
              placeholder="Activity detail in English..."
            />
          </div>

          {/* วันที่จัดกิจกรรม */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
              วันที่จัดกิจกรรม <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="activity_date"
              value={form.activity_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)]"
            />
          </div>

          {/* รูปภาพ + PDF */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
                รูปภาพหลัก
              </label>
              <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-[var(--color-border)] rounded-xl cursor-pointer hover:border-[var(--color-green)] hover:bg-[var(--color-surface)]/20 transition-all">
                <Upload className="w-4 h-4 text-[var(--color-muted-text)]" />
                <span className="text-sm text-[var(--color-muted-text)] truncate">
                  {form.img_file ? form.img_file.name : (isEdit && editData?.img_file) ? editData.img_file : "เลือกไฟล์รูป..."}
                </span>
                <input
                  type="file"
                  name="img_file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
                ไฟล์ PDF
              </label>
              <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-[var(--color-border)] rounded-xl cursor-pointer hover:border-[var(--color-green)] hover:bg-[var(--color-surface)]/20 transition-all">
                <Upload className="w-4 h-4 text-[var(--color-muted-text)]" />
                <span className="text-sm text-[var(--color-muted-text)] truncate">
                  {form.pdf_file ? form.pdf_file.name : (isEdit && editData?.pdf_file) ? editData.pdf_file : "เลือกไฟล์ PDF..."}
                </span>
                <input
                  type="file"
                  name="pdf_file"
                  accept="application/pdf"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-[var(--color-surface-3)] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-[var(--color-green)] text-white text-sm font-bold hover:bg-[var(--color-forest-green)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "กำลังบันทึก..." : isEdit ? "บันทึกการแก้ไข" : "เพิ่มกิจกรรม"}
          </button>
        </div>

      </div>
    </div>
  );
}