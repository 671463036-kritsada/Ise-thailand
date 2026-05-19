import { useState, useEffect, useRef } from "react";
import { X, UploadCloud, Link, FileVideo } from "lucide-react";
import Swal from "sweetalert2";

export default function VdoTitleModel({ isOpen, onClose, videoData, mode, onSave }) {
  const [formValues, setFormValues] = useState({
    video_id: "", video_title: "", video_title_eng: "", video_url: "", status: 1
  });
  const [uploadMode, setUploadMode] = useState("url"); // "url" | "file"
  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();
  const isDeleteMode = mode === "delete";

  useEffect(() => {
    if (isOpen) {
      setFormValues(videoData
        ? { ...videoData }
        : { video_id: "", video_title: "", video_title_eng: "", video_url: "", status: 1 }
      );
      setVideoFile(null);
      setPreview(null);
      setUploadMode("url");
    }
  }, [isOpen, videoData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDeleteMode) {
      const result = await Swal.fire({
        title: "ยืนยันการลบวิดีโอ?",
        text: `คุณต้องการลบ "${formValues.video_title}" ใช่หรือไม่?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--color-error)",
        cancelButtonColor: "var(--color-muted-text)",
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ยกเลิก",
        reverseButtons: true,
      });
      if (!result.isConfirmed) return;
    } else {
      if (!formValues.video_title.trim()) {
        Swal.fire({ title: "ข้อมูลไม่ครบถ้วน", text: "โปรดกรอกชื่อวิดีโอ", icon: "warning", confirmButtonColor: "var(--color-green)" });
        return;
      }
      if (uploadMode === "url" && !formValues.video_url.trim()) {
        Swal.fire({ title: "ข้อมูลไม่ครบถ้วน", text: "โปรดกรอก URL หรืออัปโหลดไฟล์วิดีโอ", icon: "warning", confirmButtonColor: "var(--color-green)" });
        return;
      }
      if (uploadMode === "file" && !videoFile && !formValues.video_url) {
        Swal.fire({ title: "ข้อมูลไม่ครบถ้วน", text: "โปรดเลือกไฟล์วิดีโอ", icon: "warning", confirmButtonColor: "var(--color-green)" });
        return;
      }
    }

    onSave({ ...formValues, videoFile: uploadMode === "file" ? videoFile : null });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 font-sans antialiased text-[var(--color-deep-text)]">
      <div className={`bg-white rounded-2xl shadow-2xl border w-full max-w-2xl overflow-hidden ${isDeleteMode ? "border-[var(--color-error)]/30" : "border-[var(--color-border)]"}`}>

        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-[var(--color-surface-3)]">
          <h2 className={`text-2xl font-bold ${isDeleteMode ? "text-[var(--color-error)]" : "text-[var(--color-forest-green)]"}`}>
            {isDeleteMode ? "ลบวิดีโอหน้าแรก" : videoData ? "แก้ไขวีดีโอหน้าแรก" : "เพิ่มวีดีโอหน้าแรก"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--color-disabled)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className={`p-6 space-y-5 ${isDeleteMode ? "bg-red-50/10" : "bg-white"}`}>

            {/* video_id (แสดงตอนแก้ไข/ลบ) */}
            {formValues.video_id && (
              <div className="flex flex-col gap-1.5">
                <label className="text-base font-bold text-slate-700">รหัสวิดีโอ</label>
                <input type="text" disabled value={formValues.video_id}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface-2)] text-[var(--color-muted-text)] font-mono font-bold cursor-not-allowed" />
              </div>
            )}

            {/* ชื่อวิดีโอ (ไทย) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-base font-bold text-slate-700">
                ชื่อวิดีโอ (ภาษาไทย) <span className="text-[var(--color-error)]">*</span>
              </label>
              <input type="text" name="video_title" placeholder="กรอกชื่อสื่อวีดีโอ"
                disabled={isDeleteMode} value={formValues.video_title} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-white disabled:bg-[var(--color-surface-2)]" />
            </div>

            {/* ชื่อวิดีโอ (อังกฤษ) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-base font-bold text-slate-700">ชื่อวิดีโอ (ภาษาอังกฤษ)</label>
              <input type="text" name="video_title_eng" placeholder="กรอกชื่อสื่อวีดีโอภาษาอังกฤษ (ไม่บังคับ)"
                disabled={isDeleteMode} value={formValues.video_title_eng ?? ""} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-white disabled:bg-[var(--color-surface-2)]" />
            </div>

            {/* สถานะ */}
            <div className="flex flex-col gap-1.5">
              <label className="text-base font-bold text-slate-700">สถานะการแสดงผล</label>
              <select name="status" value={formValues.status} onChange={handleChange} disabled={isDeleteMode}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none focus:border-[var(--color-border-focus)] transition-all disabled:bg-[var(--color-surface-2)] cursor-pointer">
                <option value={1}>แสดงบนหน้าแรก</option>
                <option value={0}>ซ่อน</option>
              </select>
            </div>

            {/* แหล่งที่มาของวิดีโอ */}
            {!isDeleteMode && (
              <div className="flex flex-col gap-2">
                <label className="text-base font-bold text-slate-700">แหล่งวิดีโอ <span className="text-[var(--color-error)]">*</span></label>

                {/* Toggle URL / File */}
                <div className="flex gap-2 p-1 bg-[var(--color-surface-2)] rounded-xl w-fit">
                  <button type="button" onClick={() => setUploadMode("url")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${uploadMode === "url" ? "bg-white text-[var(--color-green)] shadow-sm" : "text-[var(--color-muted-text)]"}`}>
                    <Link className="w-4 h-4" /> URL
                  </button>
                  <button type="button" onClick={() => setUploadMode("file")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${uploadMode === "file" ? "bg-white text-[var(--color-green)] shadow-sm" : "text-[var(--color-muted-text)]"}`}>
                    <UploadCloud className="w-4 h-4" /> อัปโหลดไฟล์
                  </button>
                </div>

                {uploadMode === "url" ? (
                  <input type="text" name="video_url" placeholder="https://www.youtube.com/embed/..."
                    value={formValues.video_url} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-base font-mono text-blue-600 focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all" />
                ) : (
                  <div>
                    <div
                      onClick={() => fileRef.current.click()}
                      className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--color-green)] hover:bg-[var(--color-green-light)]/10 transition-all">
                      {videoFile ? (
                        <div className="flex items-center justify-center gap-2 text-[var(--color-green)] font-semibold">
                          <FileVideo className="w-5 h-5" />
                          <span>{videoFile.name}</span>
                          <span className="text-xs text-[var(--color-muted-text)]">({(videoFile.size / 1024 / 1024).toFixed(1)} MB)</span>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-10 h-10 mx-auto text-[var(--color-disabled)] mb-2" />
                          <p className="font-semibold text-[var(--color-muted-text)]">คลิกเพื่อเลือกไฟล์วิดีโอ</p>
                          <p className="text-xs text-[var(--color-disabled)] mt-1">รองรับ mp4, webm, mov (สูงสุด 500MB)</p>
                        </>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime"
                      onChange={handleFileChange} className="hidden" />
                    {/* Preview */}
                    {preview && (
                      <video src={preview} controls className="mt-3 w-full rounded-xl max-h-48 object-contain bg-black" />
                    )}
                    {/* URL เดิม (กรณีแก้ไข ยังไม่เลือกไฟล์ใหม่) */}
                    {!videoFile && formValues.video_url && (
                      <p className="text-xs text-[var(--color-muted-text)] mt-2">
                        URL ปัจจุบัน: <span className="text-blue-600 font-mono">{formValues.video_url}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {isDeleteMode && (
              <p className="text-sm font-medium text-[var(--color-error)] bg-red-50 p-3 rounded-lg border border-red-100">
                ⚠️ คำเตือน: วิดีโอนี้จะถูกถอดออกจากการแสดงผลบนหน้าแรกของระบบ
              </p>
            )}
          </div>

          <footer className="px-6 py-4 border-t border-[var(--color-surface-3)] bg-[var(--color-surface)]/20 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose}
              className="px-5 py-2 text-base font-semibold text-[var(--color-muted-text)] border border-[var(--color-border)] hover:bg-white bg-[var(--color-surface)]/40 rounded-xl transition-colors cursor-pointer">
              ยกเลิก
            </button>
            <button type="submit"
              className={`px-6 py-2 text-base font-bold text-white rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer ${isDeleteMode ? "bg-[var(--color-error)] hover:bg-[var(--color-error)]/90" : "bg-[var(--color-green)] hover:bg-[var(--color-forest-green)]"}`}>
              {isDeleteMode ? "ยืนยันการลบ" : "บันทึกข้อมูล"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}