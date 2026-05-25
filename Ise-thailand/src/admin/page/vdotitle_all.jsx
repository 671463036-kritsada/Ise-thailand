import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, Search, Video, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import VdoTitleModel from "../model/VdoTitleModel";
import api from "../../api/axios";

const PER_PAGE = 10;

export default function VdoTitleAll() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/video/admin");
      const data = Array.isArray(res.data) ? res.data : res.data.data ?? [];
      setVideos(data);
    } catch {
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: "ไม่สามารถโหลดข้อมูลวิดีโอได้", icon: "error", confirmButtonColor: "var(--color-blue)" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  const filtered = videos.filter((v) =>
    v.video_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.video_url?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleOpenAddModal = () => { setModalMode("add"); setSelectedData(null); setIsModalOpen(true); };
  const handleOpenEditModal = (row) => { setModalMode("edit"); setSelectedData(row); setIsModalOpen(true); };
  const handleOpenDeleteModal = (row) => { setModalMode("delete"); setSelectedData(row); setIsModalOpen(true); };

  const handleSaveVideo = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("video_title", formData.video_title);
      payload.append("video_title_eng", formData.video_title_eng || "");
      payload.append("status", formData.status ?? 1);
      if (formData.videoFile) {
        payload.append("video", formData.videoFile);
      } else {
        payload.append("video_url", formData.video_url);
      }

      if (modalMode === "delete") {
        await api.delete(`/video/${formData.video_id}`);
        Swal.fire({ title: "ลบสำเร็จ!", text: "ลบข้อมูลวิดีโอออกแล้ว", icon: "success", confirmButtonColor: "var(--color-blue)" });
      } else if (modalMode === "edit") {
        await api.put(`/video/${formData.video_id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({ title: "บันทึกสำเร็จ!", text: "ปรับปรุงข้อมูลวิดีโอแล้ว", icon: "success", confirmButtonColor: "var(--color-blue)" });
      } else {
        await api.post("/video", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({ title: "เพิ่มสำเร็จ!", text: "เพิ่มวิดีโอใหม่เข้าสู่ระบบแล้ว", icon: "success", confirmButtonColor: "var(--color-blue)" });
      }
      setIsModalOpen(false);
      fetchVideos();
    } catch (err) {
      const msg = err.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้";
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: msg, icon: "error", confirmButtonColor: "var(--color-blue)" });
    }
  };

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">

      {/* ── HEADER ── */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-forest-blue)] tracking-tight flex items-center gap-2">
            <Video className="w-8 h-8 text-[var(--color-blue)]" />
            <span>จัดการวีดีโอหน้าแรก</span>
          </h1>
          <p className="text-base text-[var(--color-muted-text)] mt-0.5 font-medium">
            ระบบจัดสรรและเลือกแสดงสื่อวิดีโอมัลติมีเดียที่จะแสดงบนหน้าหลัก
          </p>
        </div>
        <button onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[var(--color-blue)] text-white text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-blue)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0">
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มวีดีโอ</span>
        </button>
      </div>

      {/* ── SEARCH ── */}
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-[var(--color-disabled)] absolute left-3.5 pointer-events-none" />
          <input type="text" placeholder="ค้นหาชื่อสื่อมัลติมีเดีย หรือ ลิ้งก์ URL..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-blue-light)]/50 transition-all bg-[var(--color-surface)]/20 placeholder:text-[var(--color-placeholder)]"
          />
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-forest-blue)] text-white text-base">
                <th className="px-5 py-4 font-bold w-28 text-center">รหัส</th>
                <th className="px-5 py-4 font-bold">ชื่อสื่อมัลติมีเดีย</th>
                <th className="px-5 py-4 font-bold w-80">URL</th>
                <th className="px-5 py-4 font-bold w-24 text-center">สถานะ</th>
                <th className="px-5 py-4 font-bold w-28 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-base">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-[var(--color-disabled)]">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--color-blue)]" />
                    <span className="font-medium">กำลังโหลดข้อมูล...</span>
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr key={row.video_id}
                    className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"}`}>
                    <td className="px-5 py-4 text-center font-mono font-bold text-[var(--color-blue)]">
                      {row.video_id}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[var(--color-deep-text)]">
                      {row.video_title}
                      {row.video_title_eng && (
                        <p className="text-sm font-normal text-[var(--color-muted-text)] mt-0.5">{row.video_title_eng}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm font-mono text-[var(--color-muted-text)] max-w-xs">
                      <a href={row.video_url} target="_blank" rel="noreferrer"
                        className="text-[var(--color-blue)] hover:underline block truncate" title={row.video_url}>
                        {row.video_url}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${row.status == 1 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {row.status == 1 ? "แสดง" : "ซ่อน"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => handleOpenEditModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-blue)] hover:bg-[var(--color-blue)] hover:text-white transition-all duration-150 cursor-pointer">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenDeleteModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all duration-150 cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center font-medium text-[var(--color-disabled)]">
                    ❌ ไม่พบข้อมูลสื่อวีดีโอที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ── */}
        <div className="px-5 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-xs">
          <p className="font-medium text-[var(--color-muted-text)]">
            แสดง {currentItems.length} จากทั้งหมด {filtered.length} รายการ
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer">
              ย้อนกลับ
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 font-bold rounded-lg transition-colors cursor-pointer ${currentPage === p ? "bg-[var(--color-blue)] text-white shadow-sm" : "border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)]"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer">
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <VdoTitleModel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoData={selectedData}
          mode={modalMode}
          onSave={handleSaveVideo}
        />
      )}
    </div>
  );
}