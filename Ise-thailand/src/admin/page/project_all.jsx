import { useState } from "react";
import { Pencil, Trash2, Plus, FileText } from "lucide-react";
import Swal from "sweetalert2";
import ProjectAllModel from "../model/ProjectAllModel"; // นำเข้าโมดอลจัดการโครงการวิจัย

const initialProjects = [
  {
    id: "PROJ-R001",
    name: "โครงการพัฒนาพื้นที่ลุ่มน้ำแม่อาวอันเนื่องมาจากพระราชดำริ อำเภอป่าซาง จังหวัดลำพูน",
    type_id: "CAT-001",
    sector_id: "SEC-001",
    year: "2566",
    budget: "1,250,000",
    status: "เสร็จสิ้น",
    sections: [
      { id: 1, title: "", description: "", img: "" },
      { id: 2, title: "", description: "", img: "" },
      { id: 3, title: "", description: "", img: "" },
      { id: 4, title: "", description: "", img: "" },
      { id: 5, title: "", description: "", img: "" }
    ],
    source: "สำนักงาน กปร."
  },
  {
    id: "PROJ-R002",
    name: "การศึกษาวิจัยการประเมินผลสัมฤทธิ์โครงการพัฒนาเบ็ดเสร็จลุ่มน้ำแม่ปิงอันเนื่องมาจากพระราชดำริ",
    type_id: "CAT-002",
    sector_id: "SEC-004",
    year: "2567",
    budget: "850,000",
    status: "กำลังดำเนินการ",
    sections: [
      { id: 1, title: "", description: "", img: "" },
      { id: 2, title: "", description: "", img: "" },
      { id: 3, title: "", description: "", img: "" },
      { id: 4, title: "", description: "", img: "" },
      { id: 5, title: "", description: "", img: "" }
    ],
    source: "สถาบันวิจัยและพัฒนาพื้นที่สูง (สวพส.)"
  },
  {
    id: "PROJ-R003",
    name: "โครงการจัดทำระบบฐานข้อมูลสารสนเทศภูมิศาสตร์ (GIS) โครงการอันเนื่องมาจากพระราชดำริ ระยะที่ 2",
    type_id: "CAT-001",
    sector_id: "SEC-001",
    year: "2567",
    budget: "1,500,000",
    status: "กำลังดำเนินการ",
    sections: [
      { id: 1, title: "", description: "", img: "" },
      { id: 2, title: "", description: "", img: "" },
      { id: 3, title: "", description: "", img: "" },
      { id: 4, title: "", description: "", img: "" },
      { id: 5, title: "", description: "", img: "" }
    ],
    source: "สำนักงาน กปร."
  },
  {
    id: "PROJ-R004",
    name: "การวิเคราะห์แนวทางการพัฒนาอาชีพและยกระดับรายได้เกษตรกรในพื้นที่โครงการพระราชดำริปางตอง",
    type_id: "CAT-004",
    sector_id: "SEC-004",
    year: "2566",
    budget: "620,000",
    status: "เสร็จสิ้น",
    sections: [
      { id: 1, title: "", description: "", img: "" },
      { id: 2, title: "", description: "", img: "" },
      { id: 3, title: "", description: "", img: "" },
      { id: 4, title: "", description: "", img: "" },
      { id: 5, title: "", description: "", img: "" }
    ],
    source: "สถาบันวิจัยและพัฒนาพื้นที่สูง (สวพส.)"
  },
  {
    id: "PROJ-R005",
    name: "โครงการถอดบทเรียนการจัดการน้ำชุมชนตามแนวพระราชดำริ เพื่อการปรับตัวต่อการเปลี่ยนแปลงสภาพภูมิอากาศ",
    type_id: "CAT-003",
    sector_id: "SEC-002",
    year: "2568",
    budget: "980,000",
    status: "รอดำเนินการ",
    sections: [
      { id: 1, title: "", description: "", img: "" },
      { id: 2, title: "", description: "", img: "" },
      { id: 3, title: "", description: "", img: "" },
      { id: 4, title: "", description: "", img: "" },
      { id: 5, title: "", description: "", img: "" }
    ],
    source: "กรมพัฒนาที่ดิน"
  },
];

const PER_PAGE = 5;

// ฟังก์ชันแปลงรหัส ID สำหรับแสดงข้อความหมวดหมู่ในตารางหน้าแรก
function getTypeName(typeId) {
  if (typeId === "CAT-001") return "พัฒนาด้านแหล่งน้ำ";
  if (typeId === "CAT-002") return "พัฒนาด้านการเกษตร";
  if (typeId === "CAT-003") return "พัฒนาด้านสิ่งแวดล้อม";
  if (typeId === "CAT-004") return "พัฒนาด้านส่งเสริมอาชีพ";
  return "อื่นๆ";
}

export default function ProjectAll() {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = PER_PAGE;

  // ── STATE ควบคุมหน้าต่างโมดอล POP-UP ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // ควบคุมโหมด: "add" | "edit" | "delete"

  // ฟังก์ชันสลับสีสไตล์ตามสถานะโครงการ
  const getStatusStyle = (status) => {
    switch (status) {
      case "เสร็จสิ้น":
        return "bg-[var(--color-surface-2)] text-[var(--color-success)] border-[var(--color-success)]/20";
      case "กำลังดำเนินการ":
        return "bg-[var(--color-gold-subtle)] text-[var(--color-gold-hover)] border-[var(--color-gold-border)]";
      case "รอดำเนินการ":
        return "bg-slate-100 text-slate-500 border-slate-200";
      default:
        return "bg-slate-50 text-slate-400";
    }
  };

  const filteredProjects = projects.filter(
    (proj) =>
      proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentItems = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ฟังก์ชันยิงสัญญาณเปิดโมดอลโหมด เพิ่มโครงการ
  const handleOpenAddModal = () => {
    setModalMode("add");
    setSelectedData(null);
    setIsModalOpen(true);
  };

  // ฟังก์ชันยิงสัญญาณเปิดโมดอลโหมด แก้ไขโครงการ
  const handleOpenEditModal = (row) => {
    setModalMode("edit");
    setSelectedData(row);
    setIsModalOpen(true);
  };

  // ฟังก์ชันยิงสัญญาณเปิดโมดอลโหมด ลบโครงการ
  const handleOpenDeleteModal = (row) => {
    setModalMode("delete");
    setSelectedData(row);
    setIsModalOpen(true);
  };

  // ฟังก์ชันรับส่งชุดข้อมูลกรอกกลับมา บันทึก หรือ ลบ ในหน้าหลักเรียบร้อยแล้ว
  const handleSaveProject = (formData) => {
    if (modalMode === "delete") {
      setProjects((prev) => prev.filter((p) => p.id !== formData.id));
      Swal.fire({ title: "ลบสำเร็จ!", text: "ลบข้อมูลโครงการเรียบร้อยแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    } else if (formData.id) {
      setProjects((prev) => prev.map((item) => item.id === formData.id ? formData : item));
      Swal.fire({ title: "บันทึกสำเร็จ!", text: "ปรับปรุงข้อมูลโครงการวิจัยแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    } else {
      const newProj = {
        ...formData,
        id: `PROJ-R${String(projects.length + 1).padStart(3, "0")}`
      };
      setProjects((prev) => [newProj, ...prev]);
      Swal.fire({ title: "เพิ่มสำเร็จ!", text: "เพิ่มโครงการวิจัยเข้าสู่ระบบแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    }
    setIsModalOpen(false);
  };

  return (
    // 🌲 คุมขนาดฟอนต์หน้ากระดาษและแถบเครื่องมือด้วยสเกลระดับกลาง (Medium Scale) สวยเด่นชัดขึ้น
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">
      
      {/* ── PAGE HEADER & ADD BUTTON (ปรับขนาดหัวเรื่องเป็น text-3xl และคำอธิบายเป็น text-base) ── */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8 text-[var(--color-green)]" />
            <span>โครงการ / งานวิจัยสถาบัน</span>
          </h1>
          <p className="text-base text-[var(--color-muted-text)] mt-0.5 font-medium">
            ระบบจัดการและติดตามสถานะงานวิจัยและโครงการของสถาบันเศรษฐกิจสร้างสรรค์
          </p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[var(--color-green)] text-white text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มโครงการวิจัย</span>
        </button>
      </div>

      {/* ── SEARCH TOOLBAR ── */}
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 ค้นหาด้วยชื่อโครงการ หรือรหัสงานวิจัย..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
          />
        </div>
      </div>

      {/* ── DATA TABLE CARD (ขยับขนาดฟอนต์หัวตารางและเนื้อหาในแถวตารางขึ้นมาเป็นข้อความขนาดกลาง text-base อ่านง่ายมาก) ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-base">
                <th className="px-5 py-3.5 font-bold w-36 text-center">รหัสโครงการ</th>
                <th className="px-5 py-3.5 font-bold">ชื่อโครงการวิจัย / งานสถาบัน</th>
                <th className="px-5 py-3.5 font-bold w-48 text-center">ประเภทโครงการ</th>
                <th className="px-5 py-3.5 font-bold w-28 text-center">ปีงบประมาณ</th>
                <th className="px-5 py-3.5 font-bold w-40 text-right">งบประมาณ (บาท)</th>
                <th className="px-5 py-3.5 font-bold w-44 text-center">สถานะ</th>
                <th className="px-5 py-3.5 font-bold w-28 text-center">จัดการ</th>
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
                    <td className="px-5 py-3.5 font-bold text-[var(--color-green)] text-center font-mono">
                      {row.id}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-[var(--color-deep-text)] min-w-[320px]">
                      <div className="line-clamp-2 hover:line-clamp-none transition-all duration-150">
                        {row.name}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <span className="inline-block px-3.5 py-1 rounded-2xl font-semibold bg-indigo-50/60 text-indigo-700 border border-indigo-100 whitespace-nowrap text-sm">
                        {getTypeName(row.type_id)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-center font-mono">
                      {row.year}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-right font-mono text-slate-700">
                      {row.budget}
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 font-bold text-sm rounded-full border ${getStatusStyle(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all duration-150 cursor-pointer"
                          title="แก้ไขข้อมูลโครงการ"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all duration-150 cursor-pointer"
                          title="ลบโครงการ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center font-medium text-[var(--color-disabled)]">
                    ❌ ไม่พบข้อมูลโครงการ/งานวิจัยที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR (ปรับสเกลขนาดแถบควบคุมให้พอดีหน้าข้อความ) ── */}
        <div className="px-5 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-xs">
          <p className="font-medium text-[var(--color-muted-text)]">
            แสดง {filteredProjects.length > 0 ? currentItems.length : 0} จาก {filteredProjects.length} โครงการ
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
            >
              ย้อนกลับ
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
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-[var(--color-disabled)] mt-6 font-medium">
        Copyright © 2026 Institute Project Inventory
      </p>

      {/* เรียกเปิดโมดอลตามโครงสร้างระบบพร้อมแนบโหมดฟอร์ม */}
      <ProjectAllModel 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectData={selectedData}
        mode={modalMode}
        onSave={handleSaveProject}
      />
    </div>
  );
}