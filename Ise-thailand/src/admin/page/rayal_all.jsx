import { useState, useCallback, useEffect } from "react";
import { Pencil, Trash2, Plus, Leaf, Images } from "lucide-react";
import Swal from "sweetalert2";
import RoyalModel from "../model/RoyalModel";
import api from "../../api/axios";
import GalleryModal from "../model/GalleryModal";

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

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const filteredProjects = projects.filter((proj) => {
    const matchSearch =
      proj.royal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.royal_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "ALL" || proj.type_id === selectedCategory;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentItems = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAddModal = () => { setModalMode("add"); setSelectedData(null); setIsModalOpen(true); };
  const handleOpenEditModal = (row) => { setModalMode("edit"); setSelectedData(row); setIsModalOpen(true); };
  const handleOpenDeleteModal = (row) => { setModalMode("delete"); setSelectedData(row); setIsModalOpen(true); };

  const handleSaveProject = async ({ formValues, fileValues }) => {
    try {
      if (modalMode === "delete") {
        await api.delete(`/royal/${formValues.royal_id}`);
        Swal.fire({ title: "ลบสำเร็จ!", text: "ลบข้อมูลโครงการเรียบร้อยแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
      } else if (modalMode === "edit") {
        const payload = new FormData();
        Object.entries(formValues).forEach(([key, val]) => { if (val !== undefined && val !== null) payload.append(key, val); });
        const imageFields = ["img_banner", "img_1", "img_2", "img_3", "img_4", "img_5", "infographic"];
        imageFields.forEach((field) => { if (selectedData?.[field]) payload.append(`old_${field}`, selectedData[field]); });
        Object.entries(fileValues).forEach(([key, file]) => { payload.append(key, file); });
        await api.put(`/royal/${formValues.royal_id}`, payload, { headers: { "Content-Type": "multipart/form-data" } });
        Swal.fire({ title: "บันทึกสำเร็จ!", text: "ปรับปรุงข้อมูลโครงการแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
      } else {
        const payload = new FormData();
        Object.entries(formValues).forEach(([key, val]) => { if (val !== undefined && val !== null) payload.append(key, val); });
        Object.entries(fileValues).forEach(([key, file]) => { payload.append(key, file); });
        await api.post("/royal", payload, { headers: { "Content-Type": "multipart/form-data" } });
        Swal.fire({ title: "เพิ่มสำเร็จ!", text: "เพิ่มข้อมูลโครงการใหม่เรียบร้อย", icon: "success", confirmButtonColor: "var(--color-green)" });
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.message, icon: "error" });
    }
  };

  return (
    // ✅ padding เล็กลงบนมือถือ
    <div className="p-3 sm:p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">

      {/* ── PAGE HEADER ── */}
      {/* ✅ stack เป็น column บนมือถือ */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
            <Leaf className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--color-green)]" />
            <span>โครงการพระราชดำริ</span>
          </h1>
          <p className="text-sm text-[var(--color-muted-text)] mt-0.5 font-medium">
            จัดการและบันทึกข้อมูลโครงการพระราชดำริทั้งหมดในระบบ
          </p>
        </div>
        {/* ✅ ปุ่มขยายเต็มบนมือถือ */}
        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto px-4 py-2 bg-[var(--color-green)] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มข้อมูลโครงการ</span>
        </button>
      </div>

      {/* ── SEARCH & FILTER ── */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-[var(--color-border)] shadow-sm mb-6 flex flex-col gap-3">
        <input
          type="text"
          placeholder="ค้นหาด้วยรหัส หรือ ชื่อโครงการ..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-border-focus)] bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
        />
        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
          className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-xl bg-white focus:outline-none cursor-pointer text-[var(--color-deep-text)] font-semibold"
        >
          <option value="ALL">ทุกประเภทโครงการ</option>
          {types.map((t) => (
            <option key={t.type_id} value={t.type_id}>{t.type_name}</option>
          ))}
        </select>
      </div>

      {/* ── TABLE — mobile แสดงเป็น card, desktop แสดงเป็น table ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">

        {/* Desktop Table — ซ่อนบน mobile */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-sm">
                <th className="px-4 py-3 font-bold w-28 text-center">รหัส</th>
                <th className="px-4 py-3 font-bold">ชื่อโครงการ</th>
                <th className="px-4 py-3 font-bold w-56">ประเภทโครงการ</th>
                <th className="px-4 py-3 font-bold w-52">ที่อยู่</th>
                <th className="px-4 py-3 font-bold w-24 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-[var(--color-muted-text)]">กำลังโหลดข้อมูล...</td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr key={row.royal_id} className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"}`}>
                    <td className="px-4 py-3 font-bold text-[var(--color-green)] text-center font-mono text-sm">{row.royal_id}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-deep-text)] max-w-md">
                      <div className="line-clamp-1">{row.royal_name}</div>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-deep-text)] font-medium">{row.type_name ?? getCategoryLabel(row.type_id, types)}</td>
                    <td className="px-4 py-3 text-[var(--color-muted-text)] font-medium">อ.{row.amphure_id} จ.{row.province_id}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button onClick={() => handleOpenEditModal(row)} className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all cursor-pointer" title="แก้ไขข้อมูล">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setGalleryRoyalId(row.royal_id); setGalleryModalOpen(true); }} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer" title="จัดการรูป Gallery">
                          <Images className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleOpenDeleteModal(row)} className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all cursor-pointer" title="ลบข้อมูล">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center font-medium text-[var(--color-disabled)]">ไม่พบข้อมูลโครงการที่ค้นหา</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Mobile Card List — แสดงแค่บน mobile */}
        <div className="sm:hidden divide-y divide-[var(--color-surface-3)]">
          {loading ? (
            <div className="px-4 py-10 text-center text-sm text-[var(--color-muted-text)]">กำลังโหลดข้อมูล...</div>
          ) : currentItems.length > 0 ? (
            currentItems.map((row) => (
              <div key={row.royal_id} className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono font-bold text-[var(--color-green)]">{row.royal_id}</p>
                    <p className="text-sm font-semibold text-[var(--color-deep-text)] mt-0.5 line-clamp-2">{row.royal_name}</p>
                  </div>
                  {/* ปุ่มจัดการ */}
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => handleOpenEditModal(row)} className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all cursor-pointer">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setGalleryRoyalId(row.royal_id); setGalleryModalOpen(true); }} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                      <Images className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleOpenDeleteModal(row)} className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-muted-text)]">
                  <span>📂 {row.type_name ?? getCategoryLabel(row.type_id, types)}</span>
                  <span>📍 อ.{row.amphure_id} จ.{row.province_id}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-10 text-center text-sm font-medium text-[var(--color-disabled)]">ไม่พบข้อมูลโครงการที่ค้นหา</div>
          )}
        </div>

        {/* ── PAGINATION ── */}
        <div className="px-4 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-xs">
          <p className="font-medium text-[var(--color-muted-text)]">
            แสดง {currentItems.length} จากทั้งหมด {filteredProjects.length} รายการ
          </p>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm">
              ย้อนกลับ
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 font-bold rounded-lg transition-colors cursor-pointer ${currentPage === p ? "bg-[var(--color-green)] text-white" : "border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)]"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm">
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      <RoyalModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} projectData={selectedData} mode={modalMode} onSave={handleSaveProject} />
      <GalleryModal open={galleryModalOpen} onClose={() => setGalleryModalOpen(false)} royalId={galleryRoyalId} />
    </div>
  );
}