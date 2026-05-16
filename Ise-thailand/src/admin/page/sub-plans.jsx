import { useState } from "react";
import { Pencil, Trash2, Plus, Search, Layers } from "lucide-react";
import Swal from "sweetalert2";
import SubPlansModel from "../model/SubPlansModel"; // นำเข้าโมดอลจัดการแผนย่อย

const initialSubPlans = [
  {
    id: "SUB-001",
    name: "การพัฒนาระบบน้ำดื่มชุมชนตามหลักปรัชญาเศรษฐกิจพอเพียง",
    planName: "เศรษฐกิจพอเพียง"
  },
  {
    id: "SUB-002",
    name: "โครงการยกระดับเกษตรกรรมยั่งยืนและการแปรรูปผลผลิตในพื้นที่",
    planName: "เศรษฐกิจพอเพียง"
  }
];

const PER_PAGE = 5;

export default function SubPlans() {
  const [subPlans, setSubPlans] = useState(initialSubPlans);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = PER_PAGE;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  // ค้นหาข้อมูลจากชื่อแผนย่อย หรือ ชื่อแผนหลักที่ผูกอยู่
  const filteredSubPlans = subPlans.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubPlans.length / itemsPerPage);
  const currentItems = filteredSubPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const handleSaveSubPlan = (formData) => {
    if (modalMode === "delete") {
      setSubPlans((prev) => prev.filter((p) => p.id !== formData.id));
      Swal.fire({ title: "ลบสำเร็จ!", text: "ลบข้อมูลแผนย่อยออกจากระบบแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    } else if (formData.id) {
      setSubPlans((prev) => prev.map((item) => item.id === formData.id ? formData : item));
      Swal.fire({ title: "บันทึกสำเร็จ!", text: "ปรับปรุงข้อมูลแผนย่อยเรียบร้อยแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    } else {
      const newSubPlan = {
        id: `SUB-${String(subPlans.length + 1).padStart(3, "0")}`,
        name: formData.name,
        planName: formData.planName || "เศรษฐกิจพอเพียง"
      };
      setSubPlans((prev) => [newSubPlan, ...prev]);
      Swal.fire({ title: "เพิ่มสำเร็จ!", text: "เพิ่มแผนย่อยใหม่เข้าสู่ระบบแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">
      
      {/* ── HEADER ── */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
            <Layers className="w-8 h-8 text-[var(--color-green)]" />
            <span>จัดการข้อมูลแผนย่อย</span>
          </h1>
          <p className="text-base text-[var(--color-muted-text)] mt-0.5 font-medium">
            ระบบบันทึกและเชื่อมโยงชุดข้อมูลแผนย่อยเข้ากับแผนงานวิจัยหลัก
          </p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[var(--color-green)] text-white text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มแผนย่อย</span>
        </button>
      </div>

      {/* ── TOOLBAR ค้นหา ── */}
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative flex items-center">
          <Search className="w-5 h-5 text-[var(--color-disabled)] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อแผนย่อย หรือ ชื่อแผนงานหลัก..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
          />
        </div>
      </div>

      {/* ── DATA TABLE (สเกลฟอนต์ระดับกลาง text-base ถอดแบบจากโครงร่างเป๊ะๆ) ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-base">
                <th className="px-5 py-4 font-bold w-32 text-center">รหัสแผนย่อย</th>
                <th className="px-5 py-4 font-bold">ชื่อแผนย่อย</th>
                <th className="px-5 py-4 font-bold w-72">ชื่อแผน</th>
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
                    <td className="px-5 py-4 text-center font-mono font-bold text-[var(--color-green)]">
                      {row.id}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[var(--color-deep-text)]">
                      {row.name}
                    </td>
                    <td className="px-5 py-4 text-[var(--color-deep-text)] font-medium">
                      {row.planName}
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all duration-150 cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all duration-150 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center font-medium text-[var(--color-disabled)]">
                    ❌ ไม่พบข้อมูลรายชื่อแผนย่อยที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ── */}
        <div className="px-5 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-xs">
          <p className="font-medium text-[var(--color-muted-text)]">
            แสดง {filteredSubPlans.length > 0 ? currentItems.length : 0} จากทั้งหมด {filteredSubPlans.length} รายการ
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
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

      {/* โมดอลสำหรับฟอร์ม จัดการแผนย่อย */}
      {isModalOpen && (
        <SubPlansModel 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          subPlanData={selectedData}
          mode={modalMode}
          onSave={handleSaveSubPlan}
        />
      )}
    </div>
  );
}