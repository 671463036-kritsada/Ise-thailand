import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, Leaf, Images } from "lucide-react";
import Swal from "sweetalert2";
import RoyalModel from "../model/RoyalModel";
import GalleryModal from "../model/GalleryModal";
import api from "../../api/axios";

function getCategoryLabel(typeId, types) {
  return types.find((t) => t.type_id === typeId)?.type_name ?? "อื่นๆ";
}

export default function RoyalAll() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryRoyalId, setGalleryRoyalId] = useState(null);

  const [types, setTypes] = useState([]);

  // ── FETCH ──
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/royal/");
      setProjects(res.data?.data ?? []);
    } catch (err) {
      Swal.fire({ title: "โหลดข้อมูลไม่สำเร็จ", text: err.message, icon: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    api.get("/royal/types")
      .then((res) => setTypes(res.data?.data ?? []))
      .catch((err) => console.error("โหลด types ไม่สำเร็จ", err));
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ── FILTER & PAGINATION ──
  const filteredProjects = projects.filter((proj) => {
    const matchSearch =
      proj.royal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.royal_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat =
      selectedCategory === "ALL" || proj.type_id === selectedCategory;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentItems = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ── MODAL HANDLERS ──
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

  // ── SAVE (CREATE / UPDATE / DELETE) ──
  const handleSaveProject = async ({ formValues, fileValues }) => {
    try {
      if (modalMode === "delete") {
        await api.delete(`/royal/${formValues.royal_id}`);
        Swal.fire({ title: "ลบสำเร็จ!", text: "ลบข้อมูลโครงการเรียบร้อยแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
      } else if (modalMode === "edit") {
        const payload = new FormData();

        Object.entries(formValues).forEach(([key, val]) => {
          if (val !== undefined && val !== null) payload.append(key, val);
        });

        const imageFields = ["img_banner", "img_1", "img_2", "img_3", "img_4", "img_5", "infographic"];
        imageFields.forEach((field) => {
          if (selectedData && selectedData[field]) {
            payload.append(`old_${field}`, selectedData[field]);
          }
        });

        Object.entries(fileValues).forEach(([key, file]) => {
          payload.append(key, file);
        });

        await api.put(`/royal/${formValues.royal_id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({ title: "บันทึกสำเร็จ!", text: "ปรับปรุงข้อมูลโครงการแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
      } else {
        const payload = new FormData();
        Object.entries(formValues).forEach(([key, val]) => {
          if (val !== undefined && val !== null) payload.append(key, val);
        });
        Object.entries(fileValues).forEach(([key, file]) => {
          payload.append(key, file);
        });
        await api.post("/royal", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({ title: "เพิ่มสำเร็จ!", text: "เพิ่มข้อมูลโครงการใหม่เรียบร้อย", icon: "success", confirmButtonColor: "var(--color-green)" });
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.message, icon: "error" });
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">

      {/* ── PAGE HEADER & ADD BUTTON (ปรับโครงสร้างปุ่มให้พอดีบนจอเล็ก) ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
            <Leaf className="w-6 sm:w-7 h-6 sm:h-7 text-[var(--color-green)]" />
            <span>โครงการพระราชดำริ</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-muted-text)] mt-0.5 font-medium">
            จัดการและบันทึกข้อมูลโครงการพระราชดำริทั้งหมดในระบบ
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto px-4 py-2 bg-[var(--color-green)] text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มข้อมูลโครงการ</span>
        </button>
      </div>

      {/* ── SEARCH & FILTER TOOLBAR (ปรับทูลบาร์แบบเรียงแถวบนโมบายล์) ── */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[var(--color-border)] shadow-sm mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="ค้นหาด้วยรหัส หรือ ชื่อโครงการ..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 text-sm sm:text-base border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-border-focus)] bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 text-sm sm:text-base border border-[var(--color-border)] rounded-xl bg-white focus:outline-none cursor-pointer text-[var(--color-deep-text)] font-semibold"
          >
            <option value="ALL">ทุกประเภทโครงการ</option>
            {types.map((t) => (
              <option key={t.type_id} value={t.type_id}>
                {t.type_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── DATA TABLE CARD ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        {/* คุมตารางด้วยการ Scroll แนวนอนเฉพาะตัวมันเองบนอุปกรณ์พกพา */}
        <div className="overflow-x-auto w-full custom-horizontal-scrollbar">
          <table className="w-full text-left border-collapse min-w-[50rem]">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-xs sm:text-sm">
                <th className="px-4 py-3 font-bold w-24 text-center whitespace-nowrap">รหัส</th>
                <th className="px-4 py-3 font-bold min-w-[15rem]">ชื่อโครงการ</th>
                <th className="px-4 py-3 font-bold w-48 whitespace-nowrap">ประเภทโครงการ</th>
                <th className="px-4 py-3 font-bold w-44 whitespace-nowrap">ที่อยู่</th>
                <th className="px-4 py-3 font-bold w-28 text-center whitespace-nowrap">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-[var(--color-muted-text)] font-semibold">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr
                    key={row.royal_id}
                    className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"
                    }`}
                  >
                    <td className="px-4 py-3 font-bold text-[var(--color-green)] text-center font-mono whitespace-nowrap">
                      {row.royal_id}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-deep-text)]">
                      <div className="line-clamp-1 hover:line-clamp-none max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl transition-all">
                        {row.royal_name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-deep-text)] font-medium whitespace-nowrap">
                      {row.type_name ?? getCategoryLabel(row.type_id, types)}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted-text)] font-medium whitespace-nowrap">
                      อ.{row.amphure_id} จ.{row.province_id}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all cursor-pointer active:scale-90"
                          title="แก้ไขข้อมูล"
                        >
                          <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>

                        <button
                          onClick={() => { setGalleryRoyalId(row.royal_id); setGalleryModalOpen(true); }}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer active:scale-90"
                          title="จัดการรูป Gallery"
                        >
                          <Images className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenDeleteModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all cursor-pointer active:scale-90"
                          title="ลบข้อมูล"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center font-medium text-[var(--color-disabled)]">
                    ไม่พบข้อมูลโครงการที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR (ปรับให้หดเรียงแถวแนวตั้งบนโมบายล์เพื่อปุ่มกดไม่ทับซ้อนกัน) ── */}
        <div className="px-4 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface)]/10 text-[11px] sm:text-xs">
          <p className="font-medium text-[var(--color-muted-text)] text-center sm:text-left">
            แสดง {currentItems.length} จากทั้งหมด {filteredProjects.length} รายการ
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-3xs text-[11px] sm:text-xs"
            >
              ย้อนกลับ
            </button>
            
            {/* ซ่อนหน้าเว็บส่วนเกินบนหน้าจอขนาดเล็กเพื่อความคลีนสายตา */}
            <div className="flex items-center gap-1 max-w-[12rem] sm:max-w-none overflow-x-auto">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 font-bold text-[11px] sm:text-xs rounded-lg transition-colors cursor-pointer ${
                    currentPage === p
                      ? "bg-[var(--color-green)] text-white"
                      : "border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2.5 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-3xs text-[11px] sm:text-xs"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL CONTAINER ── */}
      <RoyalModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectData={selectedData}
        mode={modalMode}
        onSave={handleSaveProject}
      />

      <GalleryModal
        open={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        royalId={galleryRoyalId}
      />

      {/* สไตล์จัดแต่งแกน Scroll แนวนอนให้ดูสวยเรียบเนียนยิ่งขึ้น */}
      <style jsx global>{`
        .custom-horizontal-scrollbar::-webkit-scrollbar {
          height: 5px;
        }
        .custom-horizontal-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-horizontal-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-surface-3);
          border-radius: 999px;
        }
        .custom-horizontal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-disabled);
        }
      `}</style>
    </div>
  );
}