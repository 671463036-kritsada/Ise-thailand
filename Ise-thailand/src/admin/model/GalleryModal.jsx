import { useState, useEffect, useRef } from "react";
import { X, Upload, Trash2, ImageIcon } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";

import { UPLOADS_URL } from "../../constants/uploads_url";


export default function GalleryModal({ open, onClose, royalId }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    const [coverImg, setCoverImg] = useState(null);
    const [uploadingCover, setUploadingCover] = useState(false);
    const coverInputRef = useRef(null);

    const fetchGallery = () => {
        if (!royalId) return;
        setLoading(true);
        api.get(`/royal/${royalId}/gallery`)
            .then(res => setImages(res.data.data || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const fetchCover = () => {
        api.get(`/royal/${royalId}/cover`)
            .then(res => setCoverImg(res.data.data || null))
            .catch(console.error);
    };

    useEffect(() => {
        if (open && royalId) {
            fetchGallery();
            fetchCover();
        }
    }, [open, royalId]);

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file);
        setUploading(true);
        try {
            await api.post(`/royal/${royalId}/gallery`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            Swal.fire({ title: "เพิ่มรูปสำเร็จ!", icon: "success", timer: 1500, showConfirmButton: false });
            fetchGallery();
        } catch (err) {
            Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.message, icon: "error" });
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const handleDelete = (img) => {
        Swal.fire({
            title: "ยืนยันการลบรูป?",
            text: img.royal_imgname,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--color-error)",
            cancelButtonColor: "var(--color-green)",
            confirmButtonText: "ลบ",
            cancelButtonText: "ยกเลิก",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/royal/gallery/${img.roworder}`, {
                        data: { royal_id: royalId }
                    });
                    Swal.fire({ title: "ลบสำเร็จ!", icon: "success", timer: 1500, showConfirmButton: false });
                    fetchGallery();
                } catch (err) {
                    Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.message, icon: "error" });
                }
            }
        });
    };

    const handleUploadCover = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file);
        formData.append("type_id", "");
        setUploadingCover(true);
        try {
            await api.post(`/royal/${royalId}/cover`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            Swal.fire({ title: "บันทึกรูป Cover สำเร็จ!", icon: "success", timer: 1500, showConfirmButton: false });
            fetchCover();
        } catch (err) {
            Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.message, icon: "error" });
        } finally {
            setUploadingCover(false);
            if (coverInputRef.current) coverInputRef.current.value = "";
        }
    };

    const handleDeleteCover = async () => {
        const result = await Swal.fire({
            title: "ยืนยันการลบรูป Cover?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--color-error)",
            cancelButtonColor: "var(--color-green)",
            confirmButtonText: "ลบ",
            cancelButtonText: "ยกเลิก",
        });
        if (result.isConfirmed) {
            try {
                await api.delete(`/royal/${royalId}/cover`);
                Swal.fire({ title: "ลบสำเร็จ!", icon: "success", timer: 1500, showConfirmButton: false });
                setCoverImg(null);
            } catch (err) {
                Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.message, icon: "error" });
            }
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-surface-3)]">
                    <div>
                        <h2 className="text-lg font-extrabold text-[var(--color-forest-green)]">
                            จัดการรูปภาพ
                        </h2>
                        <p className="text-xs text-[var(--color-muted-text)] mt-0.5">รหัสโครงการ: {royalId}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-muted-text)] transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* BODY */}
                <div className="px-6 py-5 space-y-6">

                    {/* ── COVER SECTION ── */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-extrabold text-[var(--color-forest-green)]">รูป Cover</h3>

                        {coverImg ? (
                            <div className="relative group rounded-xl overflow-hidden border border-[var(--color-border)] aspect-video bg-[var(--color-surface-2)]">
                                <img src={`${UPLOADS_URL}${coverImg.image_path}`} alt="cover" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={handleDeleteCover} className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 cursor-pointer">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center aspect-video rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)]">
                                <p className="text-sm text-[var(--color-disabled)]">ยังไม่มีรูป Cover</p>
                            </div>
                        )}

                        <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-dashed border-[var(--color-border)] hover:border-[var(--color-green)] hover:bg-[var(--color-surface)]/20 transition-all cursor-pointer">
                            <Upload className="w-4 h-4 text-[var(--color-muted-text)]" />
                            <span className="text-sm font-bold text-[var(--color-deep-text)]">
                                {uploadingCover ? "กำลังอัปโหลด..." : coverImg ? "เปลี่ยนรูป Cover" : "เพิ่มรูป Cover"}
                            </span>
                            <input ref={coverInputRef} type="file" accept="image/*" disabled={uploadingCover} onChange={handleUploadCover} className="hidden" />
                        </label>
                    </div>

                    <hr className="border-[var(--color-surface-3)]" />

                    {/* ── GALLERY SECTION ── */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-extrabold text-[var(--color-forest-green)]">รูป Gallery</h3>

                        <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-green)] hover:bg-[var(--color-surface)]/20 transition-all cursor-pointer">
                            <Upload className="w-5 h-5 text-[var(--color-muted-text)]" />
                            <span className="text-sm font-bold text-[var(--color-deep-text)]">
                                {uploading ? "กำลังอัปโหลด..." : "คลิกเพื่อเพิ่มรูปภาพ Gallery"}
                            </span>
                            <input ref={inputRef} type="file" accept="image/*" disabled={uploading} onChange={handleUpload} className="hidden" />
                        </label>

                        {loading ? (
                            <p className="text-center text-sm text-[var(--color-muted-text)] py-8">กำลังโหลด...</p>
                        ) : images.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {images.map((img) => (
                                    <div key={img.roworder} className="relative group rounded-xl overflow-hidden border border-[var(--color-border)] aspect-video bg-[var(--color-surface-2)]">
                                        <img src={`${UPLOADS_URL}${img.royal_imgname}`} alt={img.royal_imgname} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button onClick={() => handleDelete(img)} className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                                            <p className="text-white text-[10px] truncate">{img.royal_imgname}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-[var(--color-disabled)]">
                                <ImageIcon className="w-12 h-12 mb-2" />
                                <p className="text-sm font-medium">ยังไม่มีรูปใน Gallery</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="px-6 py-4 border-t border-[var(--color-surface-3)] flex justify-end">
                    <button onClick={onClose} className="px-5 py-2 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer">
                        ปิด
                    </button>
                </div>

            </div>
        </div>
    );
}