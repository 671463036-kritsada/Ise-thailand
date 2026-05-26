import { useState, useEffect, useRef } from "react";
import { X, Trash2, Images, Upload, ImageOff } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";
import { UPLOADS_URL } from "../../constants/uploads_url";

export default function ActivityGalleryModal({ open, onClose, docno }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const fetchGallery = async () => {
    if (!docno) return;
    setLoading(true);
    try {
      const res = await api.get(`/activity/${docno}/gallery`);
      setImages(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (open && docno) fetchGallery();
  }, [open, docno]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      await api.post(`/activity/${docno}/gallery`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      await fetchGallery();
    } catch (err) {
      Swal.fire({ title: "อัปโหลดไม่สำเร็จ", text: err.response?.data?.message || err.message, icon: "error" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = (img) => {
    Swal.fire({
      title: "ลบรูปนี้?", icon: "warning", showCancelButton: true,
      confirmButtonColor: "var(--color-error)", cancelButtonColor: "var(--color-green)",
      confirmButtonText: "ลบ", cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await api.delete(`/activity/gallery/${img.roworder}`, { data: { docno } });
        await fetchGallery();
      } catch (err) { Swal.fire({ title: "ลบไม่สำเร็จ", text: err.message, icon: "error" }); }
    });
  };

  const handleDeleteAll = () => {
    Swal.fire({
      title: "ลบรูปทั้งหมด?", text: "ไม่สามารถกู้คืนได้", icon: "warning", showCancelButton: true,
      confirmButtonColor: "var(--color-error)", cancelButtonColor: "var(--color-green)",
      confirmButtonText: "ลบทั้งหมด", cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await api.delete(`/activity/${docno}/gallery`);
        await fetchGallery();
      } catch (err) { Swal.fire({ title: "ลบไม่สำเร็จ", text: err.message, icon: "error" }); }
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-surface-3)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-green-light)]/20 flex items-center justify-center">
              <Images className="w-4 h-4 text-[var(--color-green)]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[var(--color-deep-text)]">จัดการรูป Gallery</h2>
              <p className="text-xs text-[var(--color-muted-text)] mt-0.5">
                กิจกรรม <span className="font-bold text-[var(--color-deep-text)]">{docno}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--color-surface-2)] text-[var(--color-muted-text)] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TOOLBAR */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-[var(--color-surface-3)] bg-[var(--color-surface)]/40 shrink-0">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-green)] text-white text-sm font-bold rounded-xl hover:bg-[var(--color-forest-green)] transition-colors cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "กำลังอัปโหลด..." : "อัปโหลดรูปใหม่"}
          </button>
          {images.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              ลบทั้งหมด
            </button>
          )}
          <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          <span className="ml-auto text-xs text-[var(--color-muted-text)] font-medium">
            {images.length} รูป
          </span>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="flex flex-col items-center gap-3 text-[var(--color-muted-text)]">
                <div className="w-8 h-8 border-2 border-[var(--color-green)] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm">กำลังโหลด...</p>
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-[var(--color-muted-text)]">
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-2)] flex items-center justify-center">
                <ImageOff className="w-8 h-8 opacity-40" />
              </div>
              <p className="text-sm font-medium">ยังไม่มีรูปใน Gallery</p>
              <p className="text-xs">คลิก "อัปโหลดรูปใหม่" เพื่อเพิ่มรูป</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img) => (
                <div key={img.roworder}
                  className="relative group rounded-2xl overflow-hidden border border-[var(--color-border)] aspect-video bg-[var(--color-surface-2)]">
                  <img
                    src={UPLOADS_URL + img.act_imgname}
                    alt={img.act_imgname}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(img)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      ลบรูป
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-[var(--color-surface-3)] flex justify-end shrink-0 bg-[var(--color-surface)]/50">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer">
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
}