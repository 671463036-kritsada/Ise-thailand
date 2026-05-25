import { useState, useEffect } from "react";
import { X, Upload, FileText, Image as ImageIcon } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../hook/useAuth";

export default function AssetModal({ open, onClose, onCreateSuccess, onUpdateSuccess, onError, editData = null, typeId = null }) {
    const { user } = useAuth();
    const isEdit = !!editData;
    const [researchers, setResearchers] = useState([]);
    const [assetTypes, setAssetTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        assettype_id: "",
        asset_name: "",
        asset_name_eng: "",
        asset_detail: "",
        asset_detail_eng: "",
        researcher_id: "",
        url_ebook: "",
        img_file: null,
        pdf_file: null,
    });

    useEffect(() => {
        api.get("/asset/count")
            .then(res => setAssetTypes(res.data.data || []))
            .catch(err => console.error(err));
        api.get("/asset/researchers")
            .then(res => setResearchers(res.data.data || []))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (isEdit && editData) {
            setForm({
                assettype_id: editData.assettype_id || "",
                asset_name: editData.asset_name || "",
                asset_name_eng: editData.asset_name_eng || "",
                asset_detail: editData.asset_detail || "",
                asset_detail_eng: editData.asset_detail_eng || "",
                researcher_id: editData.researcher_id || "",
                url_ebook: editData.url_ebook || "",
                img_file: null,
                pdf_file: null,
                old_img_file: editData.img_file || "",
                old_pdf_file: editData.pdf_file || "",
            });
        } else {
            setForm({
                assettype_id: typeId || "",
                asset_name: "",
                asset_name_eng: "",
                asset_detail: "",
                asset_detail_eng: "",
                researcher_id: "",
                url_ebook: "",
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
        if (!form.asset_name || !form.assettype_id) {
            onError("ชื่อและประเภทสินทรัพย์จำเป็นต้องกรอก");
            return;
        }

        setLoading(true);
        const formData = new FormData();

        const fields = ["assettype_id", "asset_name", "asset_name_eng", "asset_detail", "asset_detail_eng", "researcher_id", "url_ebook"];
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
                await api.put(`/asset/${editData.asset_id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                onUpdateSuccess();
            } else {
                await api.post("/asset", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                onCreateSuccess();
            }
            onClose();
        } catch (err) {
            onError(err.message);
        } finally {
            setForm(f => ({ ...f, img_file: null, pdf_file: null })); // เคลียร์ไฟล์ชั่วคราวหลังเซฟสำเร็จ
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-forest-green)]/40 p-2 sm:p-4 backdrop-blur-sm">
            
            {/* ── MAIN MODAL CONTAINER (ปรับสัดส่วนความกว้าง-สูงให้ลื่นไหลตามขนาดหน้าจอ) ── */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-full max-h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden border border-[var(--color-border)] animate-in fade-in zoom-in-95 duration-150">

                {/* HEADER */}
                <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--color-surface-3)] bg-[var(--color-surface)] shrink-0">
                    <h2 className="text-base sm:text-lg font-extrabold text-[var(--color-forest-green)]">
                        {isEdit ? "✏️ แก้ไขข้อมูลสินทรัพย์" : "✨ เพิ่มสินทรัพย์ใหม่เข้าสู่ระบบ"}
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

                {/* BODY (เปิด scroll แนวนอนภายในเมื่อข้อมูลยาวเกินพิกัดจอโมบายล์) */}
                <div className="flex-1 px-5 sm:px-6 py-4 overflow-y-auto space-y-4 custom-modal-scrollbar">
                    
                    {/* ── ส่วนที่ 1: การ์ดจับคู่ชื่อและประเภท ── */}
                    <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/30 rounded-xl p-3 sm:p-4 space-y-3.5 shadow-3xs">
                        <legend className="text-xs font-bold px-1.5 text-[var(--color-forest-green)]">ข้อมูลทั่วไป</legend>
                        
                        {/* ประเภทสินทรัพย์ */}
                        {(isEdit || !typeId) && (
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-[var(--color-deep-text)]">
                                    ประเภทสินทรัพย์ <span className="text-[var(--color-error)]">*</span>
                                </label>
                                <select 
                                    name="assettype_id" 
                                    value={form.assettype_id} 
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all disabled:bg-[var(--color-surface-2)] cursor-pointer"
                                >
                                    <option value="">-- เลือกประเภทสินทรัพย์ --</option>
                                    {assetTypes.map(type => (
                                        <option key={type.assettype_id} value={type.assettype_id}>
                                            {type.assettype_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* ชื่อสินทรัพย์ (จัดคู่ขนานซ้าย-ขวาบนจอคอมพิวเตอร์) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-[var(--color-deep-text)]">
                                  ชื่อสินทรัพย์ (ไทย) <span className="text-[var(--color-error)]">*</span>
                              </label>
                              <textarea name="asset_name" value={form.asset_name} onChange={handleChange} rows={5} disabled={loading}
                                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all resize-none min-h-[55px]"
                                  placeholder="กรอกชื่อสินทรัพย์ภาษาไทย..." />
                          </div>

                          <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-[var(--color-deep-text)]">ชื่อสินทรัพย์ (English)</label>
                              <textarea name="asset_name_eng" value={form.asset_name_eng} onChange={handleChange} rows={5} disabled={loading}
                                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all resize-none min-h-[55px]"
                                  placeholder="Asset name in English..." />
                          </div>
                        </div>
                    </fieldset>

                    {/* ── ส่วนที่ 2: รายละเอียดสินทรัพย์ย่อย ── */}
                    <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/30 rounded-xl p-3 sm:p-4 space-y-3.5 shadow-3xs">
                        <legend className="text-xs font-bold px-1.5 text-[var(--color-forest-green)]">คำอธิบายรายละเอียด</legend>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-[var(--color-deep-text)]">รายละเอียดคำอธิบาย (ไทย)</label>
                              <textarea name="asset_detail" value={form.asset_detail} onChange={handleChange} rows={10} disabled={loading}
                                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all resize-y min-h-[90px]"
                                  placeholder="ระบุคำอธิบายหรือเนื้อหาเพิ่มเติม..." />
                          </div>

                          <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-[var(--color-deep-text)]">รายละเอียดคำอธิบาย (English)</label>
                              <textarea name="asset_detail_eng" value={form.asset_detail_eng} onChange={handleChange} rows={10} disabled={loading}
                                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all resize-y min-h-[90px]"
                                  placeholder="Asset detail description in English..." />
                          </div>
                        </div>
                    </fieldset>

                    {/* ── ส่วนที่ 3: แหล่งอ้างอิงและผู้รับผิดชอบ ── */}
                    <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/30 rounded-xl p-3 sm:p-4 space-y-3.5 shadow-3xs">
                        <legend className="text-xs font-bold px-1.5 text-[var(--color-forest-green)]">ผู้รับผิดชอบและลิงก์เชื่อมโยง</legend>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-[var(--color-deep-text)]">ผู้จัดทำ / นักวิจัย</label>
                                <select name="researcher_id" value={form.researcher_id} onChange={handleChange} disabled={loading}
                                    className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all disabled:bg-[var(--color-surface-2)] cursor-pointer">
                                    <option value="">-- เลือกผู้รับผิดชอบโครงการ --</option>
                                    {researchers.map(r => (
                                        <option key={r.researcher_id} value={r.researcher_id}>{r.fullname}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-[var(--color-deep-text)]">ลิงก์ภายนอก URL Ebook</label>
                                <input type="text" name="url_ebook" value={form.url_ebook} onChange={handleChange} disabled={loading}
                                    className="w-full px-3 py-2 border border-[var(--color-border)] bg-white rounded-xl text-xs sm:text-sm text-[var(--color-deep-text)] placeholder-[var(--color-placeholder)] focus:outline-none focus:border-[var(--color-border-focus)] transition-all"
                                    placeholder="https://example.com/ebook" />
                            </div>
                        </div>
                    </fieldset>

                    {/* ── ส่วนที่ 4: ไฟล์เอกสารประกอบแนบ ── */}
                    <fieldset className="border border-[var(--color-border)] bg-[var(--color-surface)]/30 rounded-xl p-3 sm:p-4 space-y-3.5 shadow-3xs">
                        <legend className="text-xs font-bold px-1.5 text-[var(--color-forest-green)]">ไฟล์เอกสารแนบประกอบ</legend>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {/* อัปโหลดรูปหลัก */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-[var(--color-deep-text)]">รูปภาพหน้าปก / รูปหลัก</label>
                                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-[var(--color-border)] bg-white rounded-xl cursor-pointer hover:border-[var(--color-green)] hover:bg-[var(--color-surface)]/30 transition-all overflow-hidden">
                                    <ImageIcon className="w-4 h-4 text-[var(--color-muted-text)] shrink-0" />
                                    <span className="text-xs text-[var(--color-muted-text)] truncate flex-1">
                                        {form.img_file ? form.img_file.name : (isEdit && editData?.img_file) ? editData.img_file : "เลือกไฟล์รูปภาพหลัก..."}
                                    </span>
                                    <input type="file" name="img_file" accept="image/*" onChange={handleChange} disabled={loading} className="hidden" />
                                </label>
                            </div>

                            {/* อัปโหลด PDF */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-[var(--color-deep-text)]">เอกสารรายงานฉบับเต็ม (PDF)</label>
                                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-[var(--color-border)] bg-white rounded-xl cursor-pointer hover:border-[var(--color-green)] hover:bg-[var(--color-surface)]/30 transition-all overflow-hidden">
                                    <FileText className="w-4 h-4 text-[var(--color-muted-text)] shrink-0" />
                                    <span className="text-xs text-[var(--color-muted-text)] truncate flex-1">
                                        {form.pdf_file ? form.pdf_file.name : (isEdit && editData?.pdf_file) ? editData.pdf_file : "เลือกเอกสารแนบ PDF..."}
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
                        {loading ? "กำลังบันทึกข้อมูล..." : isEdit ? "บันทึกการแก้ไข" : "ยืนยันเพิ่มสินทรัพย์"}
                    </button>
                </div>

            </div>

            {/* Сustom Scrollbar สล๊อตสำหรับโมดอลข้อมูล */}
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