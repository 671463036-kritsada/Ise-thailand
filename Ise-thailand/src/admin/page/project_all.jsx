import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, FileText } from "lucide-react";
import Swal from "sweetalert2";
import ProjectAllModel from "../model/ProjectAllModel";
import api from "../../api/axios";
import { useAuth } from "../../hook/useAuth";

const PER_PAGE = 10;

export default function ProjectAll() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  const { user } = useAuth(); // ดึง user จาก token

  const fetchProjects = useCallback(() => {
    setLoading(true);
    api.get("/project/")
      .then(res => setProjects(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "ปิดโครงการ":
        return "bg-[var(--color-surface-2)] text-[var(--color-success)] border-[var(--color-success)]/20";
      case "ยื่นข้อเสนอ":
        return "bg-[var(--color-gold-subtle)] text-[var(--color-gold-hover)] border-[var(--color-gold-border)]";
      default:
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  const filteredProjects = projects.filter(p =>
    (p.name_thai ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.project_id ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / PER_PAGE);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const currentItems = filteredProjects.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

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

  const handleSaveProject = async (formData) => {
    setSaving(true);
    try {
      if (modalMode === "delete") {
        await api.delete(`/project/${formData.project_id}`, {
          data: { pdffile: selectedData?.pdffile } // ใช้ selectedData แทน formData
        });
        Swal.fire({ title: "ลบสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-green)" });
      } else {
        const payload = new FormData();

        // แนบ u_id จาก token
        if (user?.id) payload.append("u_id", user.id);

        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            payload.append(key, value);
          }
        });

        if (modalMode === "edit") {
          await api.put(`/project/${formData.project_id}`, payload, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          Swal.fire({ title: "บันทึกสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-green)" });
        } else {
          await api.post("/project/", payload, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          Swal.fire({ title: "เพิ่มสำเร็จ!", icon: "success", confirmButtonColor: "var(--color-green)" });
        }
      }

      fetchProjects();
      setIsModalOpen(false);
    } catch (err) {
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.message, icon: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">

      {/* ── PAGE HEADER & ADD BUTTON (Responsive Wrap) ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[var(--color-green)]" />
            <span>โครงการ / งานวิจัยสถาบัน</span>
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-[var(--color-muted-text)] mt-0.5 font-medium leading-relaxed">
            ระบบจัดการและติดตามสถานะงานวิจัยและโครงการของสถาบันเศรษฐกิจสร้างสรรค์
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          disabled={saving}
          className="w-full sm:w-auto px-5 py-2.5 bg-[var(--color-green)] text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่ม...โครงการวิจัย</span>
        </button>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="bg-white p-3 sm:p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6">
        <input
          type="text"
          placeholder="ค้นหาด้วยชื่อโครงการ หรือรหัสงานวิจัย..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="w-full px-3 py-2 border border-[var(--color-border)] rounded-xl text-sm sm:text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
        />
      </div>

      {/* ── DATA TABLE CARD ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full custom-horizontal-scrollbar">
          <table className="w-full text-left border-collapse min-w-[55rem]">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-xs sm:text-sm lg:text-base">
                <th className="px-4 sm:px-5 py-3 font-bold w-32 text-center whitespace-nowrap">รหัสโครงการ</th>
                <th className="px-4 sm:px-5 py-3 font-bold min-w-[18rem]">ชื่อโครงการ</th>
                <th className="px-4 sm:px-5 py-3 font-bold w-48 text-center whitespace-nowrap">ประเภทโครงการ</th>
                <th className="px-4 sm:px-5 py-3 font-bold w-32 text-center whitespace-nowrap">สถานะ</th>
                <th className="px-4 sm:px-5 py-3 font-bold w-24 text-center whitespace-nowrap">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-xs sm:text-sm lg:text-base">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-[var(--color-muted-text)] font-semibold">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr
                    key={row.project_id}
                    className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"}`}
                  >
                    <td className="px-4 sm:px-5 py-3.5 font-bold text-[var(--color-green)] text-center font-mono whitespace-nowrap">
                      {row.project_id}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 font-semibold text-[var(--color-deep-text)]">
                      <div className="line-clamp-2 leading-relaxed text-xs sm:text-sm">{row.name_thai}</div>
                      {row.name_eng && row.name_eng !== "-" && (
                        <div className="text-[10px] sm:text-xs text-[var(--color-muted-text)] line-clamp-1 mt-0.5 font-medium">
                          {row.name_eng}
                        </div>
                      )}
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 text-center whitespace-nowrap">
                      <span className="inline-block px-3 py-1 rounded-2xl font-semibold bg-indigo-50/60 text-indigo-700 border border-indigo-100 text-xs sm:text-sm">
                        {row.type_name}
                      </span>
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 font-bold text-xs sm:text-sm rounded-full border ${getStatusStyle(row.status_name)}`}>
                        {row.status_name}
                      </span>
                    </td>
                    <td className="px-4 sm:px-5 py-3.5 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(row)}
                          disabled={saving}
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-90"
                          title="แก้ไข"
                        >
                          <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(row)}
                          disabled={saving}
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-90"
                          title="ลบ"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center font-medium text-[var(--color-disabled)]">
                    ❌ ไม่พบข้อมูลโครงการ/งานวิจัยที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR (Responsive Pagination Block) ── */}
        <div className="px-4 sm:px-5 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-[11px] sm:text-xs">
          <p className="font-medium text-[var(--color-muted-text)] text-center sm:text-left">
            แสดง {currentItems.length} จาก {filteredProjects.length} โครงการ
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-3xs"
            >
              ย้อนกลับ
            </button>
            
            <div className="flex items-center gap-1 max-w-[12rem] sm:max-w-none overflow-x-auto custom-horizontal-scrollbar py-0.5">
              {getPageNumbers().map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 font-bold rounded-lg transition-colors cursor-pointer text-[11px] sm:text-xs ${currentPage === p
                    ? "bg-[var(--color-green)] text-white shadow-3xs"
                    : "border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)]"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2.5 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-3xs cursor-pointer"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs sm:text-sm text-[var(--color-disabled)] mt-6 font-medium">
        Copyright © 2026 สถาบันเศรษฐกิจพอเพียง
      </p>

      <ProjectAllModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectData={selectedData}
        mode={modalMode}
        onSave={handleSaveProject}
        saving={saving}
      />

      {/* แถบจัดแต่ง Scrollbar แนวนอนของตารางบนจอมือถือ */}
      <style jsx global>{`
        .custom-horizontal-scrollbar::-webkit-scrollbar {
          height: 4px;
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