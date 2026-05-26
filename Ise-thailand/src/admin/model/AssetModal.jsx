import { useState, useEffect, useRef } from "react";
import { X, FileText, Image, Link, User, Tag } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../hook/useAuth";
import { UPLOADS_URL } from '../../constants/uploads_url.js'

export default function AssetModal({ open, onClose, onCreateSuccess, onUpdateSuccess, onError, editData = null, typeId = null }) {

    const { user } = useAuth();
    const isEdit = !!editData;
    const [researchers, setResearchers] = useState([]);
    const [assetTypes, setAssetTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        assettype_id: "", asset_name: "", asset_name_eng: "",
        asset_detail: "", asset_detail_eng: "",
        researcher_id: "", url_ebook: "",
        img_file: null, pdf_file: null,
    });

    useEffect(() => {
        api.get("/asset/count").then(res => setAssetTypes(res.data.data || [])).catch(console.error);
        api.get("/asset/researchers").then(res => setResearchers(res.data.data || [])).catch(console.error);
    }, []);

    // Auto-resize textarea hook
    const useAutoResize = (value) => {
        const ref = useRef(null);
        useEffect(() => {
            if (ref.current) {
                ref.current.style.height = "auto";
                ref.current.style.height = ref.current.scrollHeight + "px";
            }
        }, [value]);
        return ref;
    };

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
                img_file: null, pdf_file: null,
                old_img_file: editData.img_file || "",
                old_pdf_file: editData.pdf_file || "",
            });
        } else {
            setForm({
                assettype_id: typeId || "",
                asset_name: "", asset_name_eng: "",
                asset_detail: "", asset_detail_eng: "",
                researcher_id: "", url_ebook: "",
                img_file: null, pdf_file: null,
                old_img_file: "", old_pdf_file: "",
            });
        }
    }, [editData, open, typeId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) setForm(f => ({ ...f, [name]: files[0] }));
        else setForm(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!form.asset_name || !form.assettype_id) { onError("ชื่อและประเภทสินทรัพย์จำเป็นต้องกรอก"); return; }
        setLoading(true);
        const formData = new FormData();
        ["assettype_id", "asset_name", "asset_name_eng", "asset_detail", "asset_detail_eng", "researcher_id", "url_ebook"]
            .forEach(key => { if (form[key]) formData.append(key, form[key]); });
        if (form.img_file) formData.append("img_file", form.img_file);
        else if (form.old_img_file) formData.append("img_file", form.old_img_file);
        if (form.pdf_file) formData.append("pdf_file", form.pdf_file);
        else if (form.old_pdf_file) formData.append("pdf_file", form.old_pdf_file);
        if (user?.id) formData.append("u_id", user.id);
        try {
            if (isEdit) { await api.put(`/asset/${editData.asset_id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }); onUpdateSuccess(); }
            else { await api.post("/asset", formData, { headers: { "Content-Type": "multipart/form-data" } }); onCreateSuccess(); }
            onClose();
        } catch (err) { onError(err.message); }
        finally { setLoading(false); }
    };

    if (!open) return null;

    const inputClass = "w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm bg-white text-[var(--color-deep-text)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/40 transition-all placeholder:text-[var(--color-muted-text)]";
    const labelClass = "block text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wide mb-1.5";

    // preview URLs
    const imgPreviewUrl = form.img_file
        ? URL.createObjectURL(form.img_file)
        : form.old_img_file
            ? UPLOADS_URL + form.old_img_file
            : null;

    const pdfName = form.pdf_file?.name || form.old_pdf_file || null;
    const pdfUrl = form.old_pdf_file && !form.pdf_file ? UPLOADS_URL + form.old_pdf_file : null;

    // Section header component
    const SectionHeader = ({ icon: Icon, title }) => (
        <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-[var(--color-green-light)]/20 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-[var(--color-green)]" />
            </div>
            <span className="text-xs font-bold text-[var(--color-deep-text)] uppercase tracking-wide">{title}</span>
            <div className="flex-1 h-px bg-[var(--color-surface-3)]" />
        </div>
    );

    const AutoResizeTextarea = ({ name, value, onChange, placeholder, className, minRows = 2 }) => {
        const ref = useRef(null);

        useEffect(() => {
            if (ref.current) {
                ref.current.style.height = "auto";
                ref.current.style.height = Math.max(ref.current.scrollHeight, minRows * 24) + "px";
            }
        }, [value, minRows]);

        return (
            <textarea
                ref={ref}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={loading}
                rows={minRows}
                className={`${className} resize-none overflow-hidden`}
                style={{ minHeight: minRows * 24 + "px" }}
            />
        );
    };
    
    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-surface-3)] shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[var(--color-green-light)]/20 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-[var(--color-green)]" />
                        </div>
                        <div>
                            <h2 className="text-base font-extrabold text-[var(--color-deep-text)]">
                                {isEdit ? "แก้ไขสินทรัพย์" : "เพิ่มสินทรัพย์ใหม่"}
                            </h2>
                            <p className="text-xs text-[var(--color-muted-text)] mt-0.5">
                                {isEdit ? "แก้ไขข้อมูลสินทรัพย์" : "กรอกข้อมูลเพื่อเพิ่มสินทรัพย์ใหม่"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--color-surface-2)] text-[var(--color-muted-text)] transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* BODY — 2 คอลัมน์ */}
                <div className="flex flex-1 overflow-hidden">

                    {/* ซ้าย: ไฟล์แนบ */}
                    <div className="w-64 shrink-0 border-r border-[var(--color-surface-3)] flex flex-col gap-4 p-5 bg-[var(--color-surface)]/40 overflow-y-auto">

                        {/* รูปภาพ */}
                        <div>
                            <p className="text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wide mb-2">รูปภาพหลัก</p>
                            <label className="block cursor-pointer group">
                                {imgPreviewUrl ? (
                                    <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] aspect-square">
                                        <img src={imgPreviewUrl} alt="preview" className="w-full h-full object-cover" />
                                        {/* Overlay เมื่อ hover */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <Image className="w-6 h-6 mx-auto mb-1" />
                                                <p className="text-xs font-semibold">เปลี่ยนรูป</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-[var(--color-border)] rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 hover:border-[var(--color-green)] hover:bg-[var(--color-green-light)]/5 transition-all">
                                        <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center">
                                            <Image className="w-6 h-6 text-[var(--color-muted-text)]" />
                                        </div>
                                        <p className="text-xs font-bold text-[var(--color-deep-text)]">เลือกรูปภาพ</p>
                                        <p className="text-xs text-[var(--color-muted-text)]">คลิกเพื่ออัปโหลด</p>
                                    </div>
                                )}
                                <input type="file" name="img_file" accept="image/*" disabled={loading} onChange={handleChange} className="hidden" />
                            </label>
                            {imgPreviewUrl && (
                                <p className="text-xs text-center text-[var(--color-muted-text)] mt-1.5 truncate px-1">
                                    {form.img_file?.name || form.old_img_file}
                                </p>
                            )}
                        </div>

                        {/* PDF */}
                        <div>
                            <p className="text-xs font-bold text-[var(--color-muted-text)] uppercase tracking-wide mb-2">ไฟล์ PDF</p>
                            <label className={`flex flex-col items-center justify-center gap-2 py-4 border-2 border-dashed rounded-2xl transition-all ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-[var(--color-green)] hover:bg-[var(--color-green-light)]/5"} ${pdfName ? "border-[var(--color-green)]/50 bg-[var(--color-green-light)]/5" : "border-[var(--color-border)]"}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pdfName ? "bg-red-50" : "bg-[var(--color-surface-2)]"}`}>
                                    <FileText className={`w-5 h-5 ${pdfName ? "text-red-400" : "text-[var(--color-muted-text)]"}`} />
                                </div>
                                {pdfName ? (
                                    <p className="text-xs font-semibold text-[var(--color-green)] truncate max-w-[160px] text-center px-2">{pdfName}</p>
                                ) : (
                                    <>
                                        <p className="text-xs font-bold text-[var(--color-deep-text)]">เลือกไฟล์ PDF</p>
                                        <p className="text-xs text-[var(--color-muted-text)]">คลิกเพื่ออัปโหลด</p>
                                    </>
                                )}
                                <input type="file" name="pdf_file" accept="application/pdf" disabled={loading} onChange={handleChange} className="hidden" />
                            </label>
                            {pdfUrl && !form.pdf_file && (
                                <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 w-full py-2 mt-1 text-xs font-semibold text-[var(--color-green)] hover:underline">
                                    <FileText className="w-3.5 h-3.5" />
                                    เปิดดู PDF
                                </a>
                            )}
                        </div>
                    </div>

                    {/* ขวา: form fields */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {/* Section: ประเภท */}
                        {(isEdit || !typeId) && (
                            <div>
                                <SectionHeader icon={Tag} title="ประเภท" />
                                <select name="assettype_id" value={form.assettype_id} onChange={handleChange} className={inputClass}>
                                    <option value="">-- เลือกประเภท --</option>
                                    {assetTypes.map(type => (
                                        <option key={type.assettype_id} value={type.assettype_id}>{type.assettype_name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Section: ชื่อ */}
                        {/* ชื่อ */}
                        <div>
                            <SectionHeader icon={FileText} title="ชื่อสินทรัพย์" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>ภาษาไทย <span className="text-red-400 normal-case tracking-normal">*</span></label>
                                    <AutoResizeTextarea
                                        name="asset_name"
                                        value={form.asset_name}
                                        onChange={handleChange}
                                        placeholder="ชื่อสินทรัพย์ภาษาไทย..."
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>English</label>
                                    <AutoResizeTextarea
                                        name="asset_name_eng"
                                        value={form.asset_name_eng}
                                        onChange={handleChange}
                                        placeholder="Asset name in English..."
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* รายละเอียด */}
                        <div>
                            <SectionHeader icon={FileText} title="รายละเอียด" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>ภาษาไทย</label>
                                    <AutoResizeTextarea
                                        name="asset_detail"
                                        value={form.asset_detail}
                                        onChange={handleChange}
                                        placeholder="รายละเอียด..."
                                        className={inputClass}
                                        minRows={4}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>English</label>
                                    <AutoResizeTextarea
                                        name="asset_detail_eng"
                                        value={form.asset_detail_eng}
                                        onChange={handleChange}
                                        placeholder="Asset detail in English..."
                                        className={inputClass}
                                        minRows={4}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: นักวิจัย + URL */}
                        <div>
                            <SectionHeader icon={User} title="ข้อมูลเพิ่มเติม" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>นักวิจัย</label>
                                    <select name="researcher_id" value={form.researcher_id} onChange={handleChange} className={inputClass}>
                                        <option value="">-- เลือกนักวิจัย --</option>
                                        {researchers.map(r => (
                                            <option key={r.researcher_id} value={r.researcher_id}>{r.fullname}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>URL Ebook</label>
                                    <input type="text" name="url_ebook" value={form.url_ebook} onChange={handleChange}
                                        className={inputClass} placeholder="https://..." />
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
                            {loading ? "กำลังบันทึก..." : isEdit ? "บันทึกการแก้ไข" : "เพิ่มสินทรัพย์"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}