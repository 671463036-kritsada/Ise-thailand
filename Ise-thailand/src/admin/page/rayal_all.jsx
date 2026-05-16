import { useState } from "react";
import { Pencil, Trash2, Plus, Leaf } from "lucide-react";
import Swal from "sweetalert2";
import RoyalModel from "../model/RoyalModel"; // นำเข้าโมดอลจัดการโครงการหลัก

const initialProjects = [
  {
    id: "PROJ-001",
    name: "โครงการอ่างเก็บน้ำห้วยแม่พริกอันเนื่องมาจากพระราชดำริ",
    category: "1",
    province: "chiangmai",
    amphoe: "แม่พริก",
    tambon: "แม่พริก",
    sections: [
      { id: 1, title: "หลักการและเหตุผล", description: "" },
      { id: 2, title: "วัตถุประสงค์", description: "" },
      { id: 3, title: "แนวทางการดำเนินงาน", description: "" },
      { id: 4, title: "ขอบเขตการดำเนินงาน", description: "" },
      { id: 5, title: "ผลที่คาดว่าจะได้รับ", description: "" }
    ],
    infographic: "",
    source: "สำนักงาน กปร."
  },
  {
    id: "PROJ-002",
    name: "โครงการศูนย์ศึกษาการพัฒนาห้วยฮ่องไคร้อันเนื่องมาจากพระราชดำริ",
    category: "2",
    province: "chiangmai",
    amphoe: "ดอยสะเก็ด",
    tambon: "ป่าเมี่ยง",
    sections: [
      { id: 1, title: "หลักการและเหตุผล", description: "" },
      { id: 2, title: "วัตถุประสงค์", description: "" },
      { id: 3, title: "แนวทางการดำเนินงาน", description: "" },
      { id: 4, title: "ขอบเขตการดำเนินงาน", description: "" },
      { id: 5, title: "ผลที่คาดว่าจะได้รับ", description: "" }
    ],
    infographic: "",
    source: "สำนักงาน กปร."
  },
  {
    id: "PROJ-003",
    name: "โครงการพัฒนาพื้นที่ลุ่มน้ำแม่งอนอันเนื่องมาจากพระราชดำริ",
    category: "1",
    province: "chiangmai",
    amphoe: "ฝาง",
    tambon: "แม่งอน",
    sections: [
      { id: 1, title: "หลักการและเหตุผล", description: "" },
      { id: 2, title: "วัตถุประสงค์", description: "" },
      { id: 3, title: "แนวทางการดำเนินงาน", description: "" },
      { id: 4, title: "ขอบเขตการดำเนินงาน", description: "" },
      { id: 5, title: "ผลที่คาดว่าจะได้รับ", description: "" }
    ],
    infographic: "",
    source: "สำนักงาน กปร."
  },
  {
    id: "PROJ-004",
    name: "โครงการสถานีพัฒนาการเกษตรที่สูงตามพระราชดำริ ดอยม่อนล้าน",
    category: "2",
    province: "chiangmai",
    amphoe: "พร้าว",
    tambon: "ป่าไหน่",
    sections: [
      { id: 1, title: "หลักการและเหตุผล", description: "" },
      { id: 2, title: "วัตถุประสงค์", description: "" },
      { id: 3, title: "แนวทางการดำเนินงาน", description: "" },
      { id: 4, title: "ขอบเขตการดำเนินงาน", description: "" },
      { id: 5, title: "ผลที่คาดว่าจะได้รับ", description: "" }
    ],
    infographic: "",
    source: "สำนักงาน กปร."
  },
  {
    id: "PROJ-005",
    name: "โครงการธนาคารโค-กระบือเพื่อเกษตรกร ตามพระราชดำริ",
    category: "3",
    province: "chiangmai",
    amphoe: "เมืองเชียงใหม่",
    tambon: "ช้างเผือก",
    sections: [
      { id: 1, title: "หลักการและเหตุผล", description: "" },
      { id: 2, title: "วัตถุประสงค์", description: "" },
      { id: 3, title: "แนวทางการดำเนินงาน", description: "" },
      { id: 4, title: "ขอบเขตการดำเนินงาน", description: "" },
      { id: 5, title: "ผลที่คาดว่าจะได้รับ", description: "" }
    ],
    infographic: "",
    source: "กรมปศุสัตว์"
  }
];

function getCategoryLabel(catId) {
  if (catId === "1") return "โครงการพัฒนาด้านแหล่งน้ำ";
  if (catId === "2") return "โครงการพัฒนาด้านการเกษตร";
  if (catId === "3") return "โครงการพัฒนาด้านส่งเสริมอาชีพ";
  return "อื่นๆ";
}

export default function RoyalAll() {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  // ระบบค้นหาและคัดกรองคู่ขนาน (ชื่อโครงการ + ประเภท Dropdown)
  const filteredProjects = projects.filter((proj) => {
    const matchSearch = proj.name.toLowerCase().includes(searchTerm.toLowerCase()) || proj.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "ALL" || proj.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentItems = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const handleSaveProject = (formData) => {
    if (modalMode === "delete") {
      setProjects((prev) => prev.filter((p) => p.id !== formData.id));
      Swal.fire({ title: "ลบสำเร็จ!", text: "ลบข้อมูลโครงการเรียบร้อยแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    } else if (formData.id) {
      setProjects((prev) => prev.map((item) => item.id === formData.id ? formData : item));
      Swal.fire({ title: "บันทึกสำเร็จ!", text: "ปรับปรุงข้อมูลโครงการแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    } else {
      const newProj = {
        ...formData,
        id: `PROJ-${String(projects.length + 1).padStart(3, "0")}`
      };
      setProjects((prev) => [newProj, ...prev]);
      Swal.fire({ title: "เพิ่มสำเร็จ!", text: "เพิ่มข้อมูลโครงการใหม่เรียบร้อย", icon: "success", confirmButtonColor: "var(--color-green)" });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">
      
      {/* ── PAGE HEADER & ADD BUTTON ── */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          {/* กระชับขนาดฟอนต์หัวข้อหลักลงมาเหลือ text-2xl */}
          <h1 className="text-2xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
            <Leaf className="w-7 h-7 text-[var(--color-green)]" />
            <span>โครงการพระราชดำริ</span>
          </h1>
          <p className="text-sm text-[var(--color-muted-text)] mt-0.5 font-medium">
            จัดการและบันทึกข้อมูลโครงการพระราชดำริทั้งหมดในระบบ
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-[var(--color-green)] text-white text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มข้อมูลโครงการ</span>
        </button>
      </div>

      {/* ── SEARCH & FILTER TOOLBAR ── */}
      <div className="bg-white p-4 rounded-xl border border-[var(--color-border)] shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="ค้นหาด้วยรหัส หรือ ชื่อโครงการ..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 text-base border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-border-focus)] bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
          />
        </div>
        <div className="w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 text-base border border-[var(--color-border)] rounded-xl bg-white focus:outline-none cursor-pointer text-[var(--color-deep-text)] font-semibold"
          >
            <option value="ALL">ทุกประเภทโครงการ</option>
            <option value="1">โครงการพัฒนาด้านแหล่งน้ำ</option>
            <option value="2">โครงการพัฒนาด้านการเกษตร</option>
            <option value="3">โครงการพัฒนาด้านส่งเสริมอาชีพ</option>
          </select>
        </div>
      </div>

      {/* ── DATA TABLE CARD (กระชับขนาดฟอนต์เหลือระดับ text-sm / text-base) ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-sm">
                <th className="px-4 py-3 font-bold w-28 text-center">รหัส</th>
                <th className="px-4 py-3 font-bold">ชื่อโครงการ</th>
                <th className="px-4 py-3 font-bold w-56">ประเภทโครงการ</th>
                <th className="px-4 py-3 font-bold w-52">ที่อยู่ (ตำบล/อำเภอ)</th>
                <th className="px-4 py-3 font-bold w-24 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-sm">
              {currentItems.length > 0 ? (
                currentItems.map((row, idx) => (
                  <tr 
                    key={row.id} 
                    className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20"
                    }`}
                  >
                    <td className="px-4 py-3 font-bold text-[var(--color-green)] text-center font-mono text-sm">
                      {row.id}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-deep-text)] max-w-md">
                      <div className="line-clamp-1 hover:line-clamp-none transition-all">
                        {row.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-deep-text)] font-medium">
                      {getCategoryLabel(row.category)}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted-text)] font-medium">
                      ต.{row.tambon} อ.{row.amphoe}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all cursor-pointer"
                          title="แก้ไขข้อมูล"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all cursor-pointer"
                          title="ลบข้อมูล"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center font-medium text-[var(--color-disabled)]">
                    ❌ ไม่พบข้อมูลโครงการที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR ── */}
        <div className="px-4 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-xs">
          <p className="font-medium text-[var(--color-muted-text)]">
            แสดง {filteredProjects.length > 0 ? currentItems.length : 0} จากทั้งหมด {filteredProjects.length} รายการ
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
                    ? "bg-[var(--color-green)] text-white"
                    : "border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      {/* ── MODEL CONTAINER ── */}
      <RoyalModel 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectData={selectedData}
        mode={modalMode}
        onSave={handleSaveProject}
      />
    </div>
  );
}