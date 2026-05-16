import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Swal from "sweetalert2";
import TypeProjectModal from "../model/TypeProjectModal"; // นำเข้า Modal

const initialCategories = [
  { id: "CAT-001", name: "โครงการพัฒนาด้านแหล่งน้ำ", count: 12 },
  { id: "CAT-002", name: "โครงการพัฒนาด้านการเกษตร", count: 8 },
  { id: "CAT-003", name: "โครงการพัฒนาด้านสิ่งแวดล้อม", count: 5 },
  { id: "CAT-004", name: "โครงการพัฒนาด้านส่งเสริมอาชีพ", count: 9 },
  { id: "CAT-005", name: "โครงการพัฒนาด้านคมนาคม/สื่อสาร", count: 6 },
  { id: "CAT-006", name: "โครงการพัฒนาด้านสาธารณสุข", count: 4 },
  { id: "CAT-007", name: "โครงการพัฒนาด้านสวัสดิการสังคม/การศึกษา", count: 7 },
  { id: "CAT-008", name: "โครงการพัฒนาด้านบูรณาการ/อื่นๆ", count: 3 },
];

export default function TypeProjectAll() {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  const handleOpenAddModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleSaveCategory = (formData) => {
    if (formData.id) {
      setCategories(categories.map(item => item.id === formData.id ? { ...item, name: formData.name } : item));
      Swal.fire({ title: "แก้ไขสำเร็จ!", text: "ปรับปรุงข้อมูลประเภทโครงการแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    } else {
      const newCategory = {
        id: `CAT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        count: 0
      };
      setCategories([...categories, newCategory]);
      Swal.fire({ title: "เพิ่มสำเร็จ!", text: "เพิ่มประเภทโครงการใหม่เรียบร้อย", icon: "success", confirmButtonColor: "var(--color-green)" });
    }
  };

  const handleDelete = async (cat) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจใช่ไหม?",
      html: `<p class="text-lg font-medium text-[var(--color-deep-text)]">ต้องการลบประเภทโครงการ <br><b class="text-[var(--color-error)]">"${cat.name}"</b> ออกจากระบบถาวร?</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-error)",
      cancelButtonColor: "var(--color-muted-text)",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
      customClass: { title: "text-xl font-bold text-[var(--color-deep-text)]" }
    });

    if (result.isConfirmed) {
      setCategories(categories.filter((item) => item.id !== cat.id));
      Swal.fire({ title: "ลบสำเร็จ!", text: "ลบข้อมูลเรียบร้อยแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    }
  };

  return (
    // 🌲 ขนาดตัวอักษรและระยะขอบ Layout ระดับกลาง (Medium Scale) สวยเนียนตากับ index.css
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">
      
      {/* ── PAGE HEADER & ADD BUTTON (ขยับเป็น text-3xl และ text-base) ── */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-forest-green)] tracking-tight">จัดการประเภทโครงการทั้งหมด</h1>
          <p className="text-base text-[var(--color-muted-text)] mt-0.5 font-medium">แสดงรายการประเภทโครงการในระบบอันเนื่องมาจากพระราชดำริ</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[var(--color-green)] text-white text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มประเภทโครงการ</span>
        </button>
      </div>

      {/* ── SEARCH TOOLBAR ── */}
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="ค้นหาชื่อประเภทโครงการ..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
          />
        </div>
      </div>

      {/* ── DATA TABLE CARD (ปรับขนาดฟอนต์หัวข้อและตารางเป็น text-base และ text-lg) ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-base">
                <th className="px-5 py-3.5 font-bold w-32 text-center">รหัสประเภท</th>
                <th className="px-5 py-3.5 font-bold">ชื่อประเภทโครงการ</th>
                <th className="px-5 py-3.5 font-bold w-56 text-center">จำนวนโครงการที่มี</th>
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
                    {/* รหัสประเภทโครงการ ฟอนต์โมโนสวยอ่านง่าย */}
                    <td className="px-5 py-3.5 text-base font-bold text-[var(--color-green)] text-center font-mono">
                      {row.id}
                    </td>
                    
                    {/* รายชื่อประเภทโครงการขยับเป็น text-base */}
                    <td className="px-5 py-3.5 font-semibold text-[var(--color-deep-text)] whitespace-nowrap">
                      {row.name}
                    </td>

                    {/* ปริมาณจำนวน ครอบตัว Pill Badge อักษรหนาชัดเจน */}
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-3.5 py-1 bg-[var(--color-surface-2)] text-[var(--color-green)] font-bold text-sm rounded-full border border-[var(--color-surface-3)]">
                        {row.count} รายการ
                      </span>
                    </td>

                    {/* ปุ่มแอ็กชันแก้ไขและลบ ขนาดกำลังพอดีมือ */}
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(row)} 
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all duration-150 cursor-pointer" 
                          title="แก้ไขประเภทโครงการ"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(row)} 
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all duration-150 cursor-pointer" 
                          title="ลบประเภทโครงการ"
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
                    ไม่พบข้อมูลประเภทโครงการที่ตรงตามเงื่อนไข
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR (สเกลปุ่มกระชับระดับกลาง) ── */}
        <div className="px-5 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-xs">
          <p className="font-medium text-[var(--color-muted-text)]">
            แสดง {filteredCategories.length > 0 ? indexOfFirstItem + 1 : 0} ถึง {Math.min(indexOfLastItem, filteredCategories.length)} จากทั้งหมด {filteredCategories.length} รายการ
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

      <p className="text-center text-sm text-[var(--color-disabled)] mt-6 font-medium">Copyright © 2026 TypeProject Inventory</p>

      {/* เรียกใช้งานโมดอลประเภทโครงการตัวอัปเดตขนาดฟอนต์ */}
      <TypeProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        editData={selectedCategory}
      />
    </div>
  );
}