import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
    api.get("/location/institutes").then(res => setInstitutes(res.data.data || [])).catch(console.error);
    api.get("/location/provinces").then(res => setProvinces(res.data.data || [])).catch(console.error);
  }, []);

  // set form เมื่อเปิด modal
  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      setForm({ ...INITIAL_FORM, ...editData, password: "" });
      // ถ้า editData มี district_id ให้ดึง amphure และ province ที่เกี่ยวข้องด้วย
      // (optional: ถ้าอยากให้ dropdown แสดงค่าเดิมตอน edit)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-surface-3)]">
          <h2 className="text-lg font-extrabold text-[var(--color-forest-green)]">
            {isEdit ? "แก้ไขข้อมูลนักวิจัย" : "เพิ่มนักวิจัยใหม่"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-muted-text)] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 space-y-4">

          {/* ชื่อ-นามสกุล ไทย */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
                ชื่อ (ไทย) <span className="text-red-500">*</span>
              </label>
              <input name="researcher_name" value={form.researcher_name} onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)]"
                placeholder="ชื่อภาษาไทย" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
                นามสกุล (ไทย) <span className="text-red-500">*</span>
              </label>
              <input name="researcher_surname" value={form.researcher_surname} onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)]"
                placeholder="นามสกุลภาษาไทย" />
            </div>
          </div>

          {/* ชื่อ-นามสกุล อังกฤษ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">ชื่อ (English)</label>
              <input name="researcher_name_eng" value={form.researcher_name_eng} onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)]"
                placeholder="First name" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">นามสกุล (English)</label>
              <input name="researcher_surname_eng" value={form.researcher_surname_eng} onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)]"
                placeholder="Last name" />
            </div>
          </div>

          {/* คำนำหน้า + สถาบัน */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">คำนำหน้า</label>
              <select name="t_code" value={form.t_code} onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)] cursor-pointer">
                <option value="">-- เลือกคำนำหน้า --</option>
                {tCodes.map(t => (
                  <option key={t.t_code} value={t.t_code}>{t.t_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">สถาบัน</label>
              <select name="institute_id" value={form.institute_id} onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)] cursor-pointer">
                <option value="">-- เลือกสถาบัน --</option>
                {institutes.map(i => (
                  <option key={i.institute_id} value={i.institute_id}>{i.institute_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* จังหวัด / อำเภอ / ตำบล */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">จังหวัด</label>
              <select value={selectedProvince} onChange={handleProvinceChange}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)] cursor-pointer">
                <option value="">-- เลือกจังหวัด --</option>
                {provinces.map(p => (
                  <option key={p.province_id} value={p.province_id}>{p.name_th}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">อำเภอ/เขต</label>
              <select value={selectedAmphure} onChange={handleAmphureChange}
                disabled={!selectedProvince}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">-- เลือกอำเภอ --</option>
                {amphures.map(a => (
                  <option key={a.amphure_id} value={a.amphure_id}>{a.name_th}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">ตำบล/แขวง</label>
              <select value={form.district_id} onChange={handleDistrictChange}
                disabled={!selectedAmphure}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">-- เลือกตำบล --</option>
                {districts.map(d => (
                  <option key={d.district_id} value={d.district_id}>{d.name_th}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Email + โทรศัพท์ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)]"
                placeholder="example@email.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">โทรศัพท์</label>
              <input name="telno" value={form.telno} onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)]"
                placeholder="08X-XXX-XXXX" />
            </div>
          </div>

          {/* เลขบัตร + รหัสไปรษณีย์ (zip_code set อัตโนมัติจากตำบล) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">เลขบัตรประชาชน</label>
              <input name="id_card" value={form.id_card} onChange={handleChange} maxLength={13}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm font-mono focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)]"
                placeholder="1234567890123" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
                รหัสไปรษณีย์ <span className="text-xs font-normal text-[var(--color-muted-text)]">(กรอกอัตโนมัติจากตำบล)</span>
              </label>
              <input name="zip_code" value={form.zip_code} onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm font-mono focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)]"
                placeholder="50000" />
            </div>
          </div>

          {/* ที่อยู่ */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">ที่อยู่</label>
            <input name="addno" value={form.addno} onChange={handleChange}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)]"
              placeholder="เลขที่/อาคาร/หมู่" />
          </div>

          {/* สถานะ */}
          <div>
            <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">สถานะ</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)] cursor-pointer">
              <option value={1}>ปฏิบัติงานปกติ</option>
              <option value={0}>ระงับการทำงาน</option>
            </select>
          </div>

          {/* Username + Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input name="username" value={form.username} onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)]"
                placeholder="username" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
                Password {!isEdit && <span className="text-red-500">*</span>}
              </label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] text-[var(--color-deep-text)]"
                placeholder={isEdit ? "เว้นว่างถ้าไม่ต้องการเปลี่ยน" : "รหัสผ่าน"} />
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-[var(--color-surface-3)] flex justify-end gap-2">
          <button onClick={onClose}
            className="px-5 py-2 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] cursor-pointer">
            ยกเลิก
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-5 py-2 rounded-xl bg-[var(--color-green)] text-white text-sm font-bold hover:bg-[var(--color-forest-green)] cursor-pointer disabled:opacity-50">
            {loading ? "กำลังบันทึก..." : isEdit ? "บันทึกการแก้ไข" : "เพิ่มนักวิจัย"}
          </button>
        </div>

      </div>
    </div>
  );
}