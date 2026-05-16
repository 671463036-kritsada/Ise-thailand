import { useState } from "react";
import { Pencil, Trash2, Plus, Search, UserCheck } from "lucide-react";
import Swal from "sweetalert2";
import ResearcherAllModel from "../model/ResearcherAllModel"; // นำเข้าโมดอลจัดการข้อมูลนักวิจัย

// ── อัปเดตโครงสร้างฟิลด์ข้อมูลนักวิจัยให้รองรับและผูกคู่ขนานไปกับโมดอลสเปกใหม่ ──
const initialResearchers = [
  {
    id: "RES-001",
    prefix: "ดร.",
    firstName: "อัจฉรา",
    lastName: "โยมสินธุ์",
    sector_id: "SEC-001",
    sectorName: "มหาวิทยาลัยราชภัฏพระนครศรีอยุธยา",
    idCard: "1234567890123",
    address: "123/45 หมู่ 1",
    province: "พระนครศรีอยุธยา",
    amphoe: "เมือง",
    tambon: "สุเทพ",
    zipcode: "13000",
    email: "achara.y@institute.or.th",
    phone: "081-234-5678",
    username: "achara_y",
    password: "••••••••",
    status: "ปฏิบัติงานปกติ"
  },
  {
    id: "RES-002",
    prefix: "ผศ.ดร.",
    firstName: "กัลยาณีย์",
    lastName: "เสนาสุ",
    sector_id: "SEC-002",
    sectorName: "สถาบันบัณฑิตพัฒนบริหารศาสตร์",
    idCard: "9876543210987",
    address: "99/1 อาคารวิจัย",
    province: "เชียงใหม่",
    amphoe: "เมือง",
    tambon: "สุเทพ",
    zipcode: "50200",
    email: "kanlayanee.s@institute.or.th",
    phone: "089-876-5432",
    username: "kanlayanee_s",
    password: "••••••••",
    status: "ปฏิบัติงานปกติ"
  },
  {
    id: "RES-003",
    prefix: "นาย",
    firstName: "นาวิน",
    lastName: "พรมใจสา",
    sector_id: "SEC-003",
    sectorName: "มหาวิทยาลัยราชภัฏเชียงราย",
    idCard: "5554443332221",
    address: "74 หมู่ 5",
    province: "ลำพูน",
    amphoe: "ป่าซาง",
    tambon: "แม่แรง",
    zipcode: "51120",
    email: "navin.p@institute.or.th",
    phone: "084-555-1234",
    username: "navin_p",
    password: "••••••••",
    status: "ปฏิบัติงานปกติ"
  }
];

const PER_PAGE = 5;

export default function ResearcherAll() {
  const [researchers, setResearchers] = useState(initialResearchers);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = PER_PAGE;

  // ── STATE ควบคุมหน้าต่างโมดอล POP-UP ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // ควบคุมโหมด: "add" | "edit" | "delete"

  // ฟังก์ชันสลับสีสไตล์ตามสถานะของนักวิจัย
  const getStatusStyle = (status) => {
    switch (status) {
      case "ปฏิบัติงานปกติ":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "ลาศึกษาต่อ":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "พักงาน/ระงับการทำงาน":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  // การกรองข้อมูลนักวิจัยจากคำค้นหาและหน่วยงานสังกัด
  const filteredResearchers = researchers.filter((res) => {
    const fullName = `${res.prefix}${res.firstName} ${res.lastName}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = sectorFilter === "" || res.sector_id === sectorFilter;

    return matchesSearch && matchesSector;
  });

  const totalPages = Math.ceil(filteredResearchers.length / itemsPerPage);
  const currentItems = filteredResearchers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ฟังก์ชันควบคุมสัญญาณเปิดหน้าต่างโมดอล
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

  // ฟังก์ชันรับส่งชุดข้อมูลจากคอมโพเนนต์ลูกกลับมาบันทึกผล
  const handleSaveResearcher = (formData) => {
    if (modalMode === "delete") {
      setResearchers((prev) => prev.filter((p) => p.id !== formData.id));
      Swal.fire({ title: "ลบสำเร็จ!", text: "ลบข้อมูลบุคคลนักวิจัยเรียบร้อยแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    } else if (formData.id) {
      // ดึงรายชื่อหน่วยงานแมปปิ้งกลับมาลงตารางหน้าแรกให้สมบูรณ์
      const sectorMap = { "SEC-001": "มหาวิทยาลัยราชภัฏพระนครศรีอยุธยา", "SEC-002": "สถาบันบัณฑิตพัฒนบริหารศาสตร์", "SEC-003": "มหาวิทยาลัยราชภัฏเชียงราย", "SEC-004": "มหาวิทยาลัยราชภัฏยะลา" };
      const updatedRow = { ...formData, sectorName: sectorMap[formData.sector_id] || "ไม่ระบุ" };
      setResearchers((prev) => prev.map((item) => item.id === formData.id ? updatedRow : item));
      Swal.fire({ title: "บันทึกสำเร็จ!", text: "ปรับปรุงข้อมูลประวัตินักวิจัยแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    } else {
      const sectorMap = { "SEC-001": "มหาวิทยาลัยราชภัฏพระนครศรีอยุธยา", "SEC-002": "สถาบันบัณฑิตพัฒนบริหารศาสตร์", "SEC-003": "มหาวิทยาลัยราชภัฏเชียงราย", "SEC-004": "มหาวิทยาลัยราชภัฏยะลา" };
      const newRes = {
        ...formData,
        id: `RES-${String(researchers.length + 1).padStart(3, "0")}`,
        sectorName: sectorMap[formData.sector_id] || "ไม่ระบุ"
      };
      setResearchers((prev) => [newRes, ...prev]);
      Swal.fire({ title: "เพิ่มสำเร็จ!", text: "เพิ่มบุคลากรนักวิจัยเข้าสู่ระบบแล้ว", icon: "success", confirmButtonColor: "var(--color-green)" });
    }
    setIsModalOpen(false);
  };

  return (
    // 🌲 คุมขนาดขอบเขตหน้ากระดาษ ฟอนต์ และช่องไฟด้วยระดับ "ขนาดกลาง (Medium Scale)" สบายตาสากล
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)]">
      
      {/* ── PAGE HEADER & ADD BUTTON (ปรับหัวเรื่องเป็น text-3xl และปุ่มกดระดับพรีเมียม text-base) ── */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-forest-green)] tracking-tight flex items-center gap-2">
            <UserCheck className="w-8 h-8 text-[var(--color-green)]" />
            <span>ทะเบียนข้อมูลนักวิจัยและผู้เชี่ยวชาญ</span>
          </h1>
          <p className="text-base text-[var(--color-muted-text)] mt-0.5 font-medium">
            ระบบจัดการทำเนียบบุคลากร ฝ่ายนักวิจัย และคณะที่ปรึกษาโครงการวิจัยสถาบัน
          </p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[var(--color-green)] text-white text-base font-bold rounded-xl shadow-md hover:bg-[var(--color-forest-green)] transition-all duration-200 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>เพิ่มทะเบียนนักวิจัย</span>
        </button>
      </div>

      {/* ── SEARCH & FILTER TOOLBAR (ปรับกล่อง Dropdown และอินพุตคัดกรองเป็นขนาดฟอนต์ text-base) ── */}
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative flex items-center">
          <Search className="w-5 h-5 text-[var(--color-disabled)] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อ-นามสกุล, รหัสประจำตัว หรือจังหวัดของนักวิจัย..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-11 pr-4 py-2 border border-[var(--color-border)] rounded-xl text-base focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-green-light)]/50 transition-all bg-[var(--color-surface)]/20 text-[var(--color-deep-text)] placeholder:text-[var(--color-placeholder)]"
          />
        </div>
        <div>
          <select
            value={sectorFilter}
            onChange={(e) => { setSectorFilter(e.target.value); setCurrentPage(1); }}
            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl text-base bg-white focus:outline-none cursor-pointer text-[var(--color-deep-text)] font-semibold"
          >
            <option value="">ทุกหน่วยงานสังกัด / สถาบัน</option>
            <option value="SEC-001">มหาวิทยาลัยราชภัฏพระนครศรีอยุธยา</option>
            <option value="SEC-002">สถาบันบัณฑิตพัฒนบริหารศาสตร์</option>
            <option value="SEC-003">มหาวิทยาลัยราชภัฏเชียงราย</option>
            <option value="SEC-004">มหาวิทยาลัยราชภัฏยะลา</option>
          </select>
        </div>
      </div>

      {/* ── DATA TABLE CARD (ปรับขนาดฟอนต์ของตารางเป็น text-base คมชัด อิงคอลัมน์สวยงามตามโครงสร้างเดิม) ── */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-surface-3)] text-[var(--color-forest-green)] text-base">
                <th className="px-5 py-4 font-bold w-32 text-center">รหัสบุคลากร</th>
                <th className="px-5 py-4 font-bold w-64">ข้อมูลชื่อนักวิจัย</th>
                <th className="px-5 py-4 font-bold">หน่วยงานที่สังกัด</th>
                <th className="px-5 py-4 font-bold w-64">พื้นที่ติดต่อ (จังหวัด)</th>
                <th className="px-5 py-4 font-bold w-36 text-center">สถานะการทำงาน</th>
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
                    {/* รหัสประจำตัวนักวิจัย ฟอนต์โมโนเด่น */}
                    <td className="px-5 py-4 text-center font-mono font-bold text-[var(--color-green)] text-base">
                      {row.id}
                    </td>
                    
                    {/* คำนำหน้าชื่อ - ชื่อ - นามสกุล */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-[var(--color-deep-text)] text-base">
                        {row.prefix} {row.firstName} {row.lastName}
                      </div>
                      <div className="text-xs text-[var(--color-muted-text)] font-mono mt-0.5">ID: {row.idCard || "-"}</div>
                    </td>

                    {/* หน่วยงานที่สังกัดต้นสังกัด */}
                    <td className="px-5 py-4">
                      <span className="inline-block px-3 py-1 text-sm font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl leading-tight">
                        {row.sectorName || "ไม่ระบุ"}
                      </span>
                    </td>

                    {/* ข้อมูลที่อยู่ติดต่อ / จังหวัด */}
                    <td className="px-5 py-4 font-medium text-[var(--color-deep-text)]">
                      {row.province ? `จ.${row.province} (อ.${row.amphoe || "-"})` : "- ไม่ระบุพื้นที่ -"}
                    </td>

                    {/* สถานةการปฏิบัติงานสวม Badge สีสันสดใสตามชุดสถานะ */}
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-bold border rounded-full ${getStatusStyle(row.status)}`}>
                        {row.status}
                      </span>
                    </td>

                    {/* ปุ่มแก้ไขและลบ สัดส่วนพอดีมือพิมพ์และใช้งาน */}
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-surface-2)] text-[var(--color-green)] hover:bg-[var(--color-green)] hover:text-white transition-all duration-150 cursor-pointer"
                          title="แก้ไขข้อมูลประวัตินักวิจัย"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(row)}
                          className="p-1.5 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white transition-all duration-150 cursor-pointer"
                          title="ลบข้อมูลนักวิจัยออกจากระบบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center font-medium text-[var(--color-disabled)]">
                    ❌ ไม่พบข้อมูลรายชื่อนักวิจัยที่ตรงตามเงื่อนไขการค้นหาของคุณ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR ── */}
        <div className="px-5 py-3 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-xs">
          <p className="font-medium text-[var(--color-muted-text)]">
            แสดง {filteredResearchers.length > 0 ? currentItems.length : 0} จากทั้งหมด {filteredResearchers.length} รายชื่อบุคลากร
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
        Copyright © 2026 Institute Researcher Inventory System
      </p>

      {/* เรียกใช้งานหน้าต่างโมดอลป็อปอัปในการ เพิ่ม/แก้ไข/ลบ ข้อมูล */}
      {isModalOpen && (
        <ResearcherAllModel 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          researcherData={selectedData}
          mode={modalMode}
          onSave={handleSaveResearcher}
        />
      )}
    </div>
  );
} 