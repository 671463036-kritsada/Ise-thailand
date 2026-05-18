import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import api from "../../api/axios";

export default function AssetModal({ open, onClose, onSuccess, editData = null }) {
    const isEdit = !!editData;

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
            });
        } else {
            setForm({
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
        if (!form.asset_name || !form.assettype_id) {
            alert("กรุณากรอกชื่อและประเภทสินทรัพย์");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => {
            if (val !== null && val !== undefined && val !== "") {
                formData.append(key, val);
            }
        });

        try {
            if (isEdit) {
                await api.put(`/asset/${editData.asset_id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                await api.post("/asset", formData, {
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
                        {isEdit ? "แก้ไขสินทรัพย์" : "เพิ่มสินทรัพย์ใหม่"}
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

                    {/* ประเภท */}
                    <div>
                        <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
                            ประเภท <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="assettype_id"
                            value={form.assettype_id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-white text-[var(--color-deep-text)]"
                        >
                            <option value="">-- เลือกประเภท --</option>
                            {assetTypes.map(type => (
                                <option key={type.assettype_id} value={type.assettype_id}>
                                    {type.assettype_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ชื่อ (ไทย) */}
                    <div>
                        <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
                            ชื่อ (ไทย) <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="asset_name"
                            value={form.asset_name}
                            onChange={handleChange}
                            rows={2}
                            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-none text-[var(--color-deep-text)]"
                            placeholder="ชื่อสินทรัพย์ภาษาไทย..."
                        />
                    </div>

                    {/* ชื่อ (อังกฤษ) */}
                    <div>
                        <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
                            ชื่อ (English)
                        </label>
                        <textarea
                            name="asset_name_eng"
                            value={form.asset_name_eng}
                            onChange={handleChange}
                            rows={2}
                            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-none text-[var(--color-deep-text)]"
                            placeholder="Asset name in English..."
                        />
                    </div>

                    {/* รายละเอียด (ไทย) */}
                    <div>
                        <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
                            รายละเอียด (ไทย)
                        </label>
                        <textarea
                            name="asset_detail"
                            value={form.asset_detail}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-none text-[var(--color-deep-text)]"
                            placeholder="รายละเอียด..."
                        />
                    </div>

                    {/* รายละเอียด (อังกฤษ) */}
                    <div>
                        <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
                            รายละเอียด (English)
                        </label>
                        <textarea
                            name="asset_detail_eng"
                            value={form.asset_detail_eng}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all resize-none text-[var(--color-deep-text)]"
                            placeholder="Asset detail in English..."
                        />
                    </div>

                    {/* รหัสนักวิจัย + URL */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
                                รหัสนักวิจัย
                            </label>
                            <input
                                type="text"
                                name="researcher_id"
                                value={form.researcher_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)]"
                                placeholder="เช่น 00001"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[var(--color-deep-text)] mb-1">
                                URL Ebook
                            </label>
                            <input
                                type="text"
                                name="url_ebook"
                                value={form.url_ebook}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all text-[var(--color-deep-text)]"
                                placeholder="https://..."
                            />
                        </div>
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
                        {loading ? "กำลังบันทึก..." : isEdit ? "บันทึกการแก้ไข" : "เพิ่มสินทรัพย์"}
                    </button>
                </div>

            </div>
        </div>
    );
}