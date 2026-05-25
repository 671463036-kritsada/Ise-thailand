import { useState, useEffect } from "react";
import { X, User, MapPin, Phone, Lock } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";

const INITIAL_FORM = {
  researcher_name: "",
  researcher_surname: "",
  researcher_name_eng: "",
  researcher_surname_eng: "",
  t_code: "",
  institute_id: "",
  district_id: "",
  addno: "",
  telno: "",
  email: "",
  zip_code: "",
  id_card: "",
  password: "",
  status: 1,
  username: "",
};

export default function ResearcherModal({ open, onClose, editData, onSuccess }) {
  const isEdit = !!editData;
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const [tCodes, setTCodes] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedAmphure, setSelectedAmphure] = useState("");

  // ดึงข้อมูล dropdown ตอนโหลด
  useEffect(() => {
    api.get("/location/titles").then(res => setTCodes(res.data.data || [])).catch(console.error);
    api.get("/location/institutes").then(res => setInstitutes(res.data.data || []).catch(console.error));
    api.get("/location/provinces").then(res => setProvinces(res.data.data || [])).catch(console.error);
  }, []);

  // set form เมื่อเปิด modal
  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      setForm({ ...INITIAL_FORM, ...editData, password: "" });
    } else {
      setForm(INITIAL_FORM);
      setSelectedProvince("");
      setSelectedAmphure("");
      setAmphures([]);
      setDistricts([]);
    }
  }, [open, editData, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleProvinceChange = (e) => {
    const pid = e.target.value;
    setSelectedProvince(pid);
    setSelectedAmphure("");
    setAmphures([]);
    setDistricts([]);
    setForm(f => ({ ...f, district_id: "" }));
    if (pid) {
      api.get(`/location/amphures/${pid}`)
        .then(res => setAmphures(res.data.data || []))
        .catch(console.error);
    }
  };

  const handleAmphureChange = (e) => {
    const aid = e.target.value;
    setSelectedAmphure(aid);
    setDistricts([]);
    setForm(f => ({ ...f, district_id: "" }));
    if (aid) {
      api.get(`/location/districts/${aid}`)
        .then(res => setDistricts(res.data.data || []))
        .catch(console.error);
    }
  };

  const handleDistrictChange = (e) => {
    const did = e.target.value;
    const selected = districts.find(d => d.district_id === did);
    setForm(f => ({
      ...f,
      district_id: did,
      zip_code: selected?.zip_code || f.zip_code,
    }));
  };

  const handleSubmit = async () => {
    if (!form.researcher_name.trim() || !form.researcher_surname.trim()) {
      Swal.fire({ title: "กรุณากรอกชื่อและนามสกุล", icon: "warning", confirmButtonColor: "var(--color-green)" });
      return;
    }
    if (!isEdit && !form.password.trim()) {
      Swal.fire({ title: "กรุณากรอกรหัสผ่าน", icon: "warning", confirmButtonColor: "var(--color-green)" });
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/researcher/${editData.researcher_id}`, form);
        Swal.fire({ title: "แก้ไขสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-green)" });
      } else {
        await api.post("/researcher", form);
        Swal.fire({ title: "เพิ่มสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-green)" });
      }
      onSuccess();
    } catch (err) {
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.response?.data?.message || err.message, icon: "error" });
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
            {isEdit ? "✏️ แก้ไขข้อมูลนักวิจัย" : "✨ ลงทะเบียนเพิ่มนักวิจัยใหม่"}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-3)] text-[var(--color-muted-text)] hover:text-[var(--color-deep-text)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 px-5 sm:px-6 py-4 overflow-y-auto space-y-5 custom-modal-scrollbar bg-white">

          {/* บล็อกที่ 1: ข้อมูลส่วนตัวและชื่อสังกัด */}
          <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/30 rounded-xl p-3 sm:p-4 space-y-3.5 shadow-3xs">
            <legend className="text-xs font-bold px-1.5 text-[var(--color-forest-green)] flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> ข้อมูลประจำตัวและสังกัด
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">คำนำหน้า</label>
                <select name="t_code" value={form.t_code} onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all cursor-pointer">
                  <option value="">-- เลือกคำนำหน้า --</option>
                  {tCodes.map(t => (
                    <option key={t.t_code} value={t.t_code}>{t.t_name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">สถาบัน / สังกัด</label>
                <select name="institute_id" value={form.institute_id} onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all cursor-pointer">
                  <option value="">-- เลือกสถาบัน --</option>
                  {institutes.map(i => (
                    <option key={i.institute_id} value={i.institute_id}>{i.institute_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">ชื่อ (ไทย) <span className="text-[var(--color-error)]">*</span></label>
                <input name="researcher_name" value={form.researcher_name} onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all placeholder-[var(--color-placeholder)]"
                  placeholder="ชื่อภาษาไทย" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">นามสกุล (ไทย) <span className="text-[var(--color-error)]">*</span></label>
                <input name="researcher_surname" value={form.researcher_surname} onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all placeholder-[var(--color-placeholder)]"
                  placeholder="นามสกุลภาษาไทย" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">ชื่อ (English)</label>
                <input name="researcher_name_eng" value={form.researcher_name_eng} onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all placeholder-[var(--color-placeholder)]"
                  placeholder="First name" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">นามสกุล (English)</label>
                <input name="researcher_surname_eng" value={form.researcher_surname_eng} onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all placeholder-[var(--color-placeholder)]"
                  placeholder="Last name" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">เลขบัตรประชาชน</label>
                <input name="id_card" value={form.id_card} onChange={handleChange} maxLength={13}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm font-mono text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all placeholder-[var(--color-placeholder)]"
                  placeholder="1234567890123" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">สถานะการปฏิบัติงาน</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all cursor-pointer">
                  <option value={1}>🟢 ปฏิบัติงานปกติ</option>
                  <option value={0}>🔴 ระงับการทำงาน</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* บล็อกที่ 2: ที่อยู่และการติดต่อ */}
          <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/30 rounded-xl p-3 sm:p-4 space-y-3.5 shadow-3xs">
            <legend className="text-xs font-bold px-1.5 text-[var(--color-forest-green)] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> ข้อมูลที่อยู่และการติดต่อ
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">จังหวัด</label>
                <select value={selectedProvince} onChange={handleProvinceChange}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all cursor-pointer">
                  <option value="">-- เลือกจังหวัด --</option>
                  {provinces.map(p => (
                    <option key={p.province_id} value={p.province_id}>{p.name_th}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">อำเภอ/เขต</label>
                <select value={selectedAmphure} onChange={handleAmphureChange} disabled={!selectedProvince}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all cursor-pointer disabled:bg-[var(--color-surface-2)] disabled:cursor-not-allowed">
                  <option value="">-- เลือกอำเภอ --</option>
                  {amphures.map(a => (
                    <option key={a.amphure_id} value={a.amphure_id}>{a.name_th}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">ตำบล/แขวง</label>
                <select value={form.district_id} onChange={handleDistrictChange} disabled={!selectedAmphure}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all cursor-pointer disabled:bg-[var(--color-surface-2)] disabled:cursor-not-allowed">
                  <option value="">-- เลือกตำบล --</option>
                  {districts.map(d => (
                    <option key={d.district_id} value={d.district_id}>{d.name_th}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">ที่อยู่ (เลขที่/อาคาร/หมู่)</label>
                <input name="addno" value={form.addno} onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all placeholder-[var(--color-placeholder)]"
                  placeholder="ตัวอย่าง 123/45 หมู่ 1 ซอย..." />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">รหัสไปรษณีย์</label>
                <input name="zip_code" value={form.zip_code} onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm font-mono text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all placeholder-[var(--color-placeholder)]"
                  placeholder="50000" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">เบอร์โทรศัพท์ติดต่อ</label>
                <input name="telno" value={form.telno} onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all placeholder-[var(--color-placeholder)]"
                  placeholder="08X-XXX-XXXX" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">อีเมล (Email)</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all placeholder-[var(--color-placeholder)]"
                  placeholder="example@email.com" />
              </div>
            </div>
          </fieldset>

          {/* บล็อกที่ 3: บัญชีผู้ใช้งานระบบ */}
          <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/40 rounded-xl p-3 sm:p-4 space-y-3.5 shadow-xs">
            <legend className="text-xs font-bold px-2 text-[var(--color-forest-green)] flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> สิทธิ์เข้าใช้งานระบบ
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">Username <span className="text-[var(--color-error)]">*</span></label>
                <input name="username" value={form.username} onChange={handleChange} disabled={isEdit}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all placeholder-[var(--color-placeholder)] disabled:bg-[var(--color-surface-2)] disabled:text-[var(--color-disabled)]"
                  placeholder="ระบุบัญชีผู้ใช้" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-deep-text)]">
                  Password {!isEdit && <span className="text-[var(--color-error)]">*</span>}
                </label>
                <input type="password" name="password" value={form.password} onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all placeholder-[var(--color-placeholder)]"
                  placeholder={isEdit ? "เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน" : "กำหนดรหัสผ่านใหม่"} />
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
            {loading ? "กำลังบันทึกข้อมูล..." : isEdit ? "บันทึกการแก้ไข" : "ลงทะเบียนนักวิจัย"}
          </button>
        </div>

      </div>

      {/* Custom Scrollbar */}
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