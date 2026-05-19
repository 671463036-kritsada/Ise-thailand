import { useState, useEffect, useRef } from "react";
import { X, Upload, Trash2, Images } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../api/axios";

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      await api.post(`/activity/${docno}/gallery`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      title: "ลบรูปนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-error)",
      cancelButtonColor: "var(--color-green)",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await api.delete(`/activity/gallery/${img.roworder}`, {
          data: { docno },
        });
        await fetchGallery();
      } catch (err) {
        Swal.fire({ title: "ลบไม่สำเร็จ", text: err.message, icon: "error" });
      }
    });
  };

  const handleDeleteAll = () => {
    Swal.fire({
      title: "ลบรูปทั้งหมด?",
      text: "ไม่สามารถกู้คืนได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-error)",
      cancelButtonColor: "var(--color-green)",
      confirmButtonText: "ลบทั้งหมด",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await api.delete(`/activity/${docno}/gallery`);
        await fetchGallery();
      } catch (err) {
        Swal.fire({ title: "ลบไม่สำเร็จ", text: err.message, icon: "error" });
      }
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-surface-3)] shrink-0">
          <div className="flex items-center gap-2">
            <Images className="w-5 h-5 text-[var(--color-green)]" />
            <h2 className="text-lg font-extrabold text-[var(--color-forest-green)]">
              จัดการรูป Gallery
            </h2>
            <span className="text-xs font-bold text-[var(--color-muted-text)] bg-[var(--color-surface-2)] px-2 py-0.5 rounded-full">
              {docno}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] text-[var(--color-muted-text)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="flex items-center gap-3">
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
                className="flex items-center gap-2 px-4 py-2 border border-[var(--color-error)]/30 text-[var(--color-error)] text-sm font-bold rounded-xl hover:bg-[var(--color-error)]/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                ลบทั้งหมด
              </button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </div>

          {loading ? (
            <p className="text-center text-[var(--color-muted-text)] py-10">กำลังโหลด...</p>
          ) : images.length === 0 ? (
            <div className="text-center py-16 text-[var(--color-disabled)]">
              <Images className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="font-medium">ยังไม่มีรูปใน Gallery</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img) => (
                <div
                  key={img.roworder}
                  className="relative group rounded-xl overflow-hidden border border-[var(--color-border)] aspect-video bg-[var(--color-surface-2)]"
                >
                  <img
                    src={`/uploads/${img.act_imgname}`}
                    alt={img.act_imgname}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleDelete(img)}
                      className="p-2 bg-[var(--color-error)] text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 border-t border-[var(--color-surface-3)] flex justify-between items-center shrink-0 bg-[var(--color-surface)]/10">
          <p className="text-xs text-[var(--color-muted-text)] font-medium">
            ทั้งหมด {images.length} รูป
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
}