import { useState } from "react";
import { Pencil, Trash2, Plus, Search, Video } from "lucide-react";
import Swal from "sweetalert2";
import VdoTitleModel from "../model/VdoTitleModel"; // นำเข้าโมดอลจัดการวิดีโอหน้าแรก

const initialVideos = [
  {
    id: "VDO-001",
    name: "กลยุทธ์การน้อมนำหลักปรัชญาของเศรษฐกิจพอเพียงสู่การประยุกต์ใช้สำหรับเยาวชนในอนุภูมิภาคลุ่มน้ำโขง",
    url: "https://www.youtube.com/watch?v=example1"
  },
  {
    id: "VDO-002",
    name: "ชุมชนต้นแบบ จ.กาญจนบุรี",
    url: "https://www.youtube.com/watch?v=example2"
  },
  {
    id: "VDO-003",
    name: "ชุมชนเศรษฐกิจพอเพียง จ.พังงา",
    url: "https://www.youtube.com/watch?v=example3"
  },
  {
    id: "VDO-004",
    name: "ชุมชนเศรษฐกิจพอเพียง จ.สกลนคร",
    url: "https://www.youtube.com/watch?v=example4"
  },
  {
    id: "VDO-005",
    name: "ชุมชนเศรษฐกิจพอเพียง จ.สมุทรสงคราม",
    url: "https://www.youtube.com/watch?v=example5"
  },
  {
    id: "VDO-006",
    name: "ชุมชนเศรษฐกิจพอเพียง จ.สุพรรณบุรี",
    url: "https://www.youtube.com/watch?v=example6"
  },
  {
    id: "VDO-007",
    name: "ชุมชนเศรษฐกิจพอเพียง จ.เชียงราย",
    url: "https://www.youtube.com/watch?v=example7"
  },
  {
    id: "VDO-008",
    name: "ประชาสัมพันธ์สถาบันเศรษฐกิจพอเพียง",
    url: "https://www.youtube.com/watch?v=example8"
  },
  {
    id: "VDO-009",
    name: "เรียนรู้เศรษฐกิจพอเพียง : กรณีศึกษาเยาวชนไทย - รัฐฉาน",
    url: "https://www.youtube.com/watch?v=example9"
  },
  {
    id: "VDO-010",
    name: "เศรษฐกิจพอเพียง จ.จันทบุรี",
    url: "https://www.youtube.com/watch?v=example10"
  }
];

const PER_PAGE = 10; // แสดงผลแถวตาราง 10 รายการต่อหน้าตามรูปภาพต้นฉบับ

export default function VdoTitleAll() {
  const [videos, setVideos] = useState(initialVideos);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = PER_PAGE;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  const filteredVideos = videos.filter((vdo) =>
    vdo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vdo.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const currentItems = filteredVideos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setSelectedData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (row) => {
    setModalMode("edit");
    setSelectedData(row);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (row) => {
    setModalMode("delete");
    setSelectedData(row);
    setIsModalOpen(true);
  };

  const handleSaveVideo = (formData) => {
    if (modalMode === "delete") {
      setVideos((prev) => prev.filter((v) => v.id !== formData.id));
      Swal.fire({ title: "ลบสำเร็จ!", text: "ลบข้อมูลวิดีโอหน้าแรกออกแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    } else if (formData.id) {
      setVideos((prev) => prev.map((item) => item.id === formData.id ? formData : item));
      Swal.fire({ title: "บันทึกสำเร็จ!", text: "ปรับปรุงข้อมูลสื่อวิดีโอเรียบร้อยแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    } else {
      const newVideo = {
        id: `VDO-${String(videos.length + 1).padStart(3, "0")}`,
        name: formData.name,
        url: formData.url
      };
      setVideos((prev) => [...prev, newVideo]);
      Swal.fire({ title: "เพิ่มสำเร็จ!", text: "เพิ่มข้อมูลวีดีโอหน้าแรกเรียบร้อยแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">
      
      {/* ── HEADER ── */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
            <Video className="w-8 h-8 text-[var(--color-green)]" />
            <span>จัดการวีดีโอหน้าแรก</span>
          </h1>
          <p className="text-base text-[var(--color-muted-text)] mt-0.5 font-medium">
            ระบบจัดสรรและเลือกแสดงสื่อวิดีโอมัลติมีเดียที่จะแสดงบนหน้าหลัก (Landing Page)
          </p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[var(--color-green)] text-white text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มวีดีโอ</span>
        </button>
      </div>

      {/* ── TOOLBAR ค้นหา ── */}
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative flex items-center">
          <Search className="w-5 h-5 text-[var(--color-disabled)] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="ค้นหาชื่อสื่อมัลติมีเดีย หรือ ลิ้งก์ URL..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
          />
        </div>
      </div>

      {/* ── DATA TABLE (สเกลฟอนต์ระดับกลาง text-base ถอดแบบจากคอลัมน์ในรูปภาพเป๊ะ ๆ) ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-base">
                <th className="px-5 py-4 font-bold">ชื่อสื่อมัลติมีเดีย จัดการวีดีโอหน้าแรก</th>
                <th className="px-5 py-4 font-bold w-96">URL</th>
                <th className="px-5 py-4 font-bold w-28 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-base">
              {currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr 
                    key={row.id} 
                    className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"
                    }`}
                  >
                    {/* ชื่อสื่อมัลติมีเดีย */}
                    <td className="px-5 py-4 font-semibold text-[var(--color-deep-text)]">
                      {row.name}
                    </td>

                    {/* ลิ้งก์ URL ของวิดีโอ */}
                    <td className="px-5 py-4 text-sm font-mono text-[var(--color-muted-text)] truncate max-w-xs">
                      <a 
                        href={row.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-600 hover:underline transition-all block truncate"
                        title={row.url}
                      >
                        {row.url}
                      </a>
                    </td>

                    {/* ปุ่มแก้ไข / ลบข้อมูลท้ายตาราง */}
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all duration-150 cursor-pointer"
                          title="แก้ไขข้อมูลวิดีโอ"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all duration-150 cursor-pointer"
                          title="ลบวิดีโอ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-5 py-10 text-center font-medium text-[var(--color-disabled)]">
                    ❌ ไม่พบข้อมูลสื่อวีดีโอหน้าแรกที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR ── */}
        <div className="px-5 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-xs">
          <p className="font-medium text-[var(--color-muted-text)]">
            Showing {filteredVideos.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredVideos.length)} of {filteredVideos.length} entries
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 font-bold rounded-lg transition-colors cursor-pointer ${
                  currentPage === p
                    ? "bg-[var(--color-green)] text-white shadow-sm"
                    : "border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-[var(--color-disabled)] mt-6 font-medium">
        Copyright © 2026 Institute Vdo Presentation Landing Inventory System
      </p>

      {/* โมดอลสำหรับฟอร์ม จัดการเพิ่ม/แก้ไข วิดีโอ */}
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