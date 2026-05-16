import { useState } from "react";
import { Pencil, Trash2, Plus, Building2 } from "lucide-react";
import Swal from "sweetalert2";
import SectorModal from "../model/SectorModal"; // นำเข้า Modal จัดการหน่วยงาน

const initialSectors = [
  { id: "SEC-001", name: "กรมชลประทาน", description: "รับผิดชอบการบริหารจัดการน้ำและพัฒนาแหล่งน้ำ" },
  { id: "SEC-002", name: "กรมพัฒนาที่ดิน", description: "รับผิดชอบการวิเคราะห์และยกระดับคุณภาพดินเพื่อการเกษตร" },
  { id: "SEC-003", name: "กรมอุทยานแห่งชาติ สัตว์ป่า และพันธุ์พืช", description: "ดูแลและอนุรักษ์พื้นที่ป่าไม้และสิ่งแวดล้อม" },
  { id: "SEC-004", name: "สถาบันวิจัยและพัฒนาพื้นที่สูง (สวพส.)", description: "สนับสนุนการวิจัยและพัฒนาอาชีพเกษตรกรบนพื้นที่สูง" },
  { id: "SEC-005", name: "กรมส่งเสริมการเกษตร", description: "ส่งเสริมและถ่ายทอดเทคโนโลยีการเกษตรสู่ชุมชน" },
  { id: "SEC-006", name: "คณะเกษตรศาสตร์ มหาวิทยาลัยเชียงใหม่", description: "หน่วยงานร่วมวิจัยด้านนวัตกรรมและการพัฒนาการเกษตร" },
];

export default function SectorAll() {
  const [sectors, setSectors] = useState(initialSectors);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit" | "delete"

  const filteredSectors = sectors.filter((sec) =>
    sec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sec.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSectors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSectors.slice(indexOfFirstItem, indexOfLastItem);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setSelectedSector(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sec) => {
    setModalMode("edit");
    setSelectedSector(sec);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (sec) => {
    setModalMode("delete");
    setSelectedSector(sec);
    setIsModalOpen(true);
  };

  const handleSaveSector = (formData) => {
    if (modalMode === "delete") {
      setSectors(sectors.filter((item) => item.id !== formData.id));
      Swal.fire({ title: "ลบสำเร็จ!", text: "ลบข้อมูลหน่วยงานเรียบร้อยแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    } else if (formData.id) {
      setSectors(sectors.map(item => item.id === formData.id ? formData : item));
      Swal.fire({ title: "แก้ไขสำเร็จ!", text: "ปรับปรุงข้อมูลหน่วยงาน/ภาคส่วนแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    } else {
      const newSector = {
        id: `SEC-${String(sectors.length + 1).padStart(3, "0")}`,
        name: formData.name,
        description: formData.description
      };
      setSectors([...sectors, newSector]);
      Swal.fire({ title: "เพิ่มสำเร็จ!", text: "เพิ่มหน่วยงานใหม่เรียบร้อย", icon: "success", confirmButtonColor: "var(--color-green)" });
    }
    setIsModalOpen(false);
  };

  return (
    // 🌲 ขนาดตัวอักษรและระยะขอบ Layout ระดับกลาง (Medium Scale) สวยงามลงตัว
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">
      
      {/* ── PAGE HEADER & ADD BUTTON (ขยับความเด่นชัดเป็น text-3xl และปุ่มกด text-base) ── */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
            <Building2 className="w-8 h-8 text-[var(--color-green)]" />
            <span>จัดการหน่วยงาน / ภาคส่วน</span>
          </h1>
          <p className="text-base text-[var(--color-muted-text)] mt-0.5 font-medium">จัดการและเชื่อมโยงภาคส่วนที่รับผิดชอบโครงการพระราชดำริ</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[var(--color-green)] text-white text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มหน่วยงานใหม่</span>
        </button>
      </div>

      {/* ── SEARCH TOOLBAR ── */}
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="ค้นหาด้วยรหัส หรือชื่อหน่วยงาน / ภาคส่วน..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
          />
        </div>
      </div>

      {/* ── DATA TABLE CARD (ปรับขนาดฟอนต์ตารางเป็น text-base เด่นชัดเจน) ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-base">
                <th className="px-5 py-3.5 font-bold w-32 text-center">รหัสหน่วยงาน</th>
                <th className="px-5 py-3.5 font-bold w-72">ชื่อหน่วยงาน / ภาคส่วน</th>
                <th className="px-5 py-3.5 font-bold">รายละเอียด / คำอธิบาย</th>
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
                    {/* รหัสหน่วยงาน ฟอนต์โมโนเด่นชัด */}
                    <td className="px-5 py-3.5 text-base font-bold text-[var(--color-green)] text-center font-mono">
                      {row.id}
                    </td>
                    
                    {/* ชื่อหน่วยงาน ฟอนต์ text-base หนาปานกลาง */}
                    <td className="px-5 py-3.5 font-semibold text-[var(--color-deep-text)]">
                      {row.name}
                    </td>

                    {/* รายละเอียดคำอธิบาย ย่อข้อความยาวเกินหน้าจอ */}
                    <td className="px-5 py-3.5 text-[var(--color-muted-text)] font-medium max-w-sm truncate">
                      {row.description || "- ไม่มีคำอธิบายเพิ่มเติม -"}
                    </td>

                    {/* ปุ่มแอ็กชันแก้ไขและลบ สไตล์มาตรฐานระบบ */}
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(row)} 
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all duration-150 cursor-pointer" 
                          title="แก้ไขข้อมูลหน่วยงาน"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(row)} 
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all duration-150 cursor-pointer" 
                          title="ลบข้อมูลหน่วยงาน"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center text-base font-medium text-[var(--color-disabled)]">
                    ❌ ไม่พบข้อมูลหน่วยงาน / ภาคส่วนที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR ── */}
        <div className="px-5 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-xs">
          <p className="font-medium text-[var(--color-muted-text)]">
            แสดง {filteredSectors.length > 0 ? indexOfFirstItem + 1 : 0} ถึง {Math.min(indexOfLastItem, filteredSectors.length)} จากทั้งหมด {filteredSectors.length} รายการ
          </p>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
              disabled={currentPage === 1} 
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ย้อนกลับ
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button 
                key={p} 
                onClick={() => setCurrentPage(p)} 
                className={`w-8 h-8 font-bold rounded-lg transition-all cursor-pointer ${
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
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-[var(--color-disabled)] mt-6 font-medium">Copyright © 2026 Sector Inventory</p>

      {/* เรียกใช้งานโมดอลจัดการหน่วยงานตัวปรับขนาดกลาง (Medium Size) */}
      <SectorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sectorData={selectedSector}
        mode={modalMode}
        onSave={handleSaveSector}
      />
    </div>
  );
}