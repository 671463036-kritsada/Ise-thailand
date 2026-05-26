import { useState, useEffect } from "react";
import { X, User, MapPin, Lock, Phone } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";

const INITIAL_FORM = {
  researcher_name: "", researcher_surname: "",
  researcher_name_eng: "", researcher_surname_eng: "",
  t_code: "", institute_id: "", district_id: "",
  addno: "", telno: "", email: "", zip_code: "",
  id_card: "", password: "", status: 1, username: "",
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

  useEffect(() => {
    api.get("/location/titles").then(res => setTCodes(res.data.data || [])).catch(console.error);
    api.get("/location/institutes").then(res => setInstitutes(res.data.data || [])).catch(console.error);
    api.get("/location/provinces").then(res => setProvinces(res.data.data || [])).catch(console.error);
  }, []);

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
  }, [open, editData]);

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
    if (pid) api.get(`/location/amphures/${pid}`).then(res => setAmphures(res.data.data || [])).catch(console.error);
  };

  const handleAmphureChange = (e) => {
    const aid = e.target.value;
    setSelectedAmphure(aid);
    setDistricts([]);
    setForm(f => ({ ...f, district_id: "" }));
    if (aid) api.get(`/location/districts/${aid}`).then(res => setDistricts(res.data.data || [])).catch(console.error);
  };

  const handleDistrictChange = (e) => {
    const did = e.target.value;
    const selected = districts.find(d => d.district_id === did);
    setForm(f => ({ ...f, district_id: did, zip_code: selected?.zip_code || f.zip_code }));
  };

  const handleSubmit = async () => {
    if (!form.researcher_name.trim() || !form.researcher_surname.trim()) {
      Swal.fire({ title: "กรุณากรอกชื่อและนามสกุล", icon: "warning", confirmButtonColor: "var(--color-green)" }); return;
    }
    if (!isEdit && !form.password.trim()) {
      Swal.fire({ title: "กรุณากรอกรหัสผ่าน", icon: "warning", confirmButtonColor: "var(--color-green)" }); return;
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
    } finally { setLoading(false); }
  };

  if (!open) return null;

  const inputClass = "w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/40 transition-all placeholder:text-[var(--color-muted-text)]";
  const labelClass = "block text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wide mb-1.5";

  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-6 h-6 rounded-lg bg-[var(--color-green-light)]/20 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-[var(--color-green)]" />
      </div>
      <span className="text-xs font-bold text-[var(--color-deep-text)] uppercase tracking-wide">{title}</span>
      <div className="flex-1 h-px bg-[var(--color-surface-3)]" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-surface-3)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-green-light)]/20 flex items-center justify-center">
              <User className="w-4 h-4 text-[var(--color-green)]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[var(--color-deep-text)]">
                {isEdit ? "แก้ไขข้อมูลนักวิจัย" : "เพิ่มนักวิจัยใหม่"}
              </h2>
              <p className="text-xs text-[var(--color-muted-text)] mt-0.5">
                {isEdit ? "แก้ไขข้อมูลส่วนตัวและการเข้าสู่ระบบ" : "กรอกข้อมูลเพื่อเพิ่มนักวิจัยใหม่"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--color-surface-2)] text-[var(--color-muted-text)] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-5">

            {/* ซ้าย: ข้อมูลส่วนตัว */}
            <div className="space-y-3 bg-[var(--color-surface)]/40 rounded-2xl p-4 border border-[var(--color-surface-3)]">
              <SectionHeader icon={User} title="ข้อมูลส่วนตัว" />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>คำนำหน้า</label>
                  <select name="t_code" value={form.t_code} onChange={handleChange} className={inputClass}>
                    <option value="">-- เลือกคำนำหน้า --</option>
                    {tCodes.map(t => <option key={t.t_code} value={t.t_code}>{t.t_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>สถาบัน</label>
                  <select name="institute_id" value={form.institute_id} onChange={handleChange} className={inputClass}>
                    <option value="">-- เลือกสถาบัน --</option>
                    {institutes.map(i => <option key={i.institute_id} value={i.institute_id}>{i.institute_name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>ชื่อ (ไทย) <span className="text-red-400 normal-case tracking-normal">*</span></label>
                  <input name="researcher_name" value={form.researcher_name} onChange={handleChange} className={inputClass} placeholder="ชื่อภาษาไทย" />
                </div>
                <div>
                  <label className={labelClass}>นามสกุล (ไทย) <span className="text-red-400 normal-case tracking-normal">*</span></label>
                  <input name="researcher_surname" value={form.researcher_surname} onChange={handleChange} className={inputClass} placeholder="นามสกุลภาษาไทย" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>ชื่อ (English)</label>
                  <input name="researcher_name_eng" value={form.researcher_name_eng} onChange={handleChange} className={inputClass} placeholder="First name" />
                </div>
                <div>
                  <label className={labelClass}>นามสกุล (English)</label>
                  <input name="researcher_surname_eng" value={form.researcher_surname_eng} onChange={handleChange} className={inputClass} placeholder="Last name" />
                </div>
              </div>

              <div>
                <label className={labelClass}>สถานะ</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                  <option value={1}>ปฏิบัติงานปกติ</option>
                  <option value={0}>ระงับการทำงาน</option>
                </select>
              </div>
            </div>

            {/* ขวา: ที่อยู่ + บัญชี */}
            <div className="space-y-4">

              <div className="space-y-3 bg-[var(--color-surface)]/40 rounded-2xl p-4 border border-[var(--color-surface-3)]">
                <SectionHeader icon={MapPin} title="ที่อยู่และการติดต่อ" />

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>จังหวัด</label>
                    <select value={selectedProvince} onChange={handleProvinceChange} className={inputClass}>
                      <option value="">-- เลือก --</option>
                      {provinces.map(p => <option key={p.province_id} value={p.province_id}>{p.name_th}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>อำเภอ/เขต</label>
                    <select value={selectedAmphure} onChange={handleAmphureChange} disabled={!selectedProvince} className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}>
                      <option value="">-- เลือก --</option>
                      {amphures.map(a => <option key={a.amphure_id} value={a.amphure_id}>{a.name_th}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>ตำบล/แขวง</label>
                    <select value={form.district_id} onChange={handleDistrictChange} disabled={!selectedAmphure} className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}>
                      <option value="">-- เลือก --</option>
                      {districts.map(d => <option key={d.district_id} value={d.district_id}>{d.name_th}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>ที่อยู่</label>
                    <input name="addno" value={form.addno} onChange={handleChange} className={inputClass} placeholder="เลขที่/อาคาร/หมู่" />
                  </div>
                  <div>
                    <label className={labelClass}>รหัสไปรษณีย์</label>
                    <input name="zip_code" value={form.zip_code} onChange={handleChange} className={`${inputClass} font-mono`} placeholder="50000" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="example@email.com" />
                  </div>
                  <div>
                    <label className={labelClass}>โทรศัพท์</label>
                    <input name="telno" value={form.telno} onChange={handleChange} className={inputClass} placeholder="08X-XXX-XXXX" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>เลขบัตรประชาชน</label>
                  <input name="id_card" value={form.id_card} onChange={handleChange} maxLength={13} className={`${inputClass} font-mono tracking-widest`} placeholder="1234567890123" />
                </div>
              </div>

              <div className="space-y-3 bg-[var(--color-surface)]/40 rounded-2xl p-4 border border-[var(--color-surface-3)]">
                <SectionHeader icon={Lock} title="บัญชีเข้าสู่ระบบ" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Username <span className="text-red-400 normal-case tracking-normal">*</span></label>
                    <input name="username" value={form.username} onChange={handleChange} className={inputClass} placeholder="username" />
                  </div>
                  <div>
                    <label className={labelClass}>Password {!isEdit && <span className="text-red-400 normal-case tracking-normal">*</span>}</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} className={inputClass} placeholder={isEdit ? "เว้นว่างถ้าไม่ต้องการเปลี่ยน" : "รหัสผ่าน"} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-[var(--color-surface-3)] flex items-center justify-between bg-[var(--color-surface)]/50 shrink-0">
          <p className="text-xs text-[var(--color-muted-text)]">
            <span className="text-red-400">*</span> จำเป็นต้องกรอก
          </p>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer">
              ยกเลิก
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[var(--color-green)] text-white text-sm font-bold hover:bg-[var(--color-forest-green)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "กำลังบันทึก..." : isEdit ? "บันทึกการแก้ไข" : "เพิ่มนักวิจัย"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}