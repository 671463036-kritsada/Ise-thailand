import { useState } from "react";
import { FileSpreadsheet, Printer, Search, BarChart3, RefreshCw } from "lucide-react";
import * as XLSX from "xlsx"; // เรียกใช้งานไลบรารีสำหรับสร้างไฟล์ .xlsx แท้
import Swal from "sweetalert2";

// ── ข้อมูลจำลองในตาราง ถอดแบบและแปลงให้เข้ากับโครงสร้างแยกตามจังหวัดตามภาพของคุณ ──
const initialReportData = [
  { id: 1, name: "โครงการพัฒนาคลังความรู้การนำปรัชญาของเศรษฐกิจพอเพียงไปประยุกต์ใช้ ในรูปแบบเว็บไซต์", projectType: "โครงการภายใต้สถาบันเศรษฐกิจพอเพียง", province: "กรุงเทพมหานคร", typeId: "CAT-001", provId: "PROV-BKK" },
  { id: 2, name: "การบริหารจัดการเครือข่ายเศรษฐกิจพอเพียงแบบบูรณาการ", projectType: "โครงการพัฒนาแบบ บูรณาการ และ อื่นๆ", province: "กรุงเทพมหานคร", typeId: "CAT-002", provId: "PROV-BKK" },
  { id: 3, name: "โครงการจัดทำ Sufficiency Living Case Book ระยะที่ 1", projectType: "โครงการสวัสดิการสังคม การศึกษา", province: "กรุงเทพมหานคร", typeId: "CAT-003", provId: "PROV-BKK" },
  { id: 4, name: "การบริหารราชการแผ่นดินบนพื้นฐานหลักปรัชญาของเศรษฐกิจพอเพียง ระยะที่ 1", projectType: "โครงการภายใต้สถาบันเศรษฐกิจพอเพียง", province: "กรุงเทพมหานคร", typeId: "CAT-001", provId: "PROV-BKK" },
  { id: 5, name: "การสำรวจการรับรู้และความเข้าใจของประชาชนเกี่ยวกับปรัชญาของเศรษฐกิจพอเพียง", projectType: "โครงการภายใต้สถาบันเศรษฐกิจพอเพียง", province: "กรุงเทพมหานคร", typeId: "CAT-001", provId: "PROV-BKK" },
  { id: 6, name: "โครงการพัฒนาดิจิทัลแพลตฟอร์มศูนย์กลางการเรียนรู้บูรณาการปรัชญาของเศรษฐกิจพอเพียงกับนวัตกรรมเพื่อการพัฒนาที่ยั่งยืน สมดุล และมั่นคง", projectType: "โครงการภายใต้สถาบันเศรษฐกิจพอเพียง", province: "ไม่ระบุ", typeId: "CAT-001", provId: "PROV-NONE" },
  { id: 7, name: "โครงการพัฒนาดิจิทัลแพลตฟอร์มศูนย์กลางการเรียนรู้บูรณาการปรัชญาของเศรษฐกิจพอเพียงกับนวัตกรรมเพื่อการพัฒนาที่ยั่งยืน สมดุล และมั่นคง", projectType: "โครงการภายใต้สถาบันเศรษฐกิจพอเพียง", province: "ไม่ระบุ", typeId: "CAT-001", provId: "PROV-NONE" },
  { id: 8, name: "โครงการจัดทำ Sufficiency Living Case Book (ระยะที่ 2)", projectType: "โครงการภายใต้สถาบันเศรษฐกิจพอเพียง", province: "ไม่ระบุ", typeId: "CAT-001", provId: "PROV-NONE" },
  { id: 9, name: "โครงการเชื่อมโยงองค์ความรู้ด้านเศรษฐกิจพอเพียงเพื่อความยั่งยืนแบบบูรณาการ", projectType: "โครงการภายใต้สถาบันเศรษฐกิจพอเพียง", province: "ไม่ระบุ", typeId: "CAT-001", provId: "PROV-NONE" },
  { id: 10, name: "โครงการวิจัยการบริหารราชการแผ่นดินบนพื้นฐานหลักปรัชญาของเศรษฐกิจพอเพียง ระยะที่ 2", projectType: "โครงการภายใต้สถาบันเศรษฐกิจพอเพียง", province: "ไม่ระบุ", typeId: "CAT-001", provId: "PROV-NONE" }
];

export default function ReportProvince() {
  const [data] = useState(initialReportData);
  const [selectedType, setSelectedType] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [processedType, setProcessedType] = useState("");
  const [processedProvince, setProcessedProvince] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ฟังก์ชันกดประมวลผลคัดกรองข้อมูลรายงาน
  const handleProcess = (e) => {
    e.preventDefault();
    setProcessedType(selectedType);
    setProcessedProvince(selectedProvince);
    setCurrentPage(1);
    Swal.fire({
      title: "ประมวลผลสำเร็จ",
      text: "ระบบคัดกรองข้อมูลตามประเภทและพื้นที่จังหวัดเรียบร้อยแล้ว",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
      confirmButtonColor: "var(--color-green)"
    });
  };

  // 🛠️ ฟังก์ชัน Export Excel นามสกุล .xlsx แท้ โครงสร้างตามภาพโปรเจกต์แยกตามจังหวัด
  const handleExportExcel = () => {
    // 1. ปรับโครงสร้างข้อมูลใน Array ให้หัวคอลัมน์เป็นภาษาไทยตามหน้าเว็บเป๊ะๆ
    const exportData = filteredData.map((item, index) => ({
      "ลำดับที่": index + 1,
      "ชื่อโครงการ": item.name,
      "ประเภทโครงการ": item.projectType,
      "จังหวัด": item.province
    }));

    // 2. สร้างโครงสร้าง Worksheet และ Workbook ของ Excel ผ่านไลบรารี
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "แยกตามจังหวัด");

    // 3. สั่งเขียนไฟล์และเด้งหน้าต่างดาวน์โหลดเป็นไฟล์ .xlsx ทันที
    XLSX.writeFile(workbook, `รายงานแยกตามจังหวัด_${new Date().toISOString().slice(0, 10)}.xlsx`);

    Swal.fire({
      title: "ส่งออกข้อมูลสำเร็จ",
      text: "ดาวน์โหลดไฟล์เอกสาร .xlsx เรียบร้อยแล้ว",
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    });
  };

  // สั่งพิมพ์หน้ากระดาษพรีวิว
  const handlePrint = () => {
    window.print();
  };

  // กรองข้อมูลด้วยเครื่องมือค้นหา (Search) และค่าของตัวเลือกหลังกดปุ่มประมวลผล
  const filteredData = data.filter((item) => {
    const matchesType = processedType === "" || item.typeId === processedType;
    const matchesProvince = processedProvince === "" || item.provId === processedProvince;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.province.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesProvince && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)] print:p-0 print:bg-white">
      
      {/* ── CSS สไตล์พิมพ์แบบเนียนตา แก้ภาพลีบแบน และเอาแนว Scrollbar ออกถาวร ── */}
      <style>{`
        @media print {
          .print-hidden, aside, nav, header, footer, button {
            display: none !important;
          }
          body, html, #root, main, .min-h-screen {
            background: #fff !important;
            color: #000 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
          }
          /* 🛠️ กำจัด Scrollbar หรือแถบเลื่อนออกไปเวลาพิมพ์เพื่อไม่ให้พิมพ์เส้นติดลงกระดาษ */
          .overflow-x-auto, .overflow-y-auto {
            overflow: visible !important;
            max-height: none !important;
            width: 100% !important;
          }
          ::-webkit-scrollbar {
            display: none !important;
          }
          table {
            width: 100% !important;
            table-layout: auto !important;
            border-collapse: collapse !important;
          }
          th {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-bottom: 2px solid #000000 !important;
            font-weight: bold !important;
          }
          td, th {
            padding: 8px 6px !important;
            border: 1px solid #cbd5e1 !important;
            white-space: normal !important;
          }
          @page {
            size: A4 portrait;
            margin: 15mm 10mm 15mm 10mm;
          }
        }
      `}</style>

      {/* ── PRINT HEADER (แสดงเฉพาะตอนปริ้นเอกสารตามภาพสไตล์ระบบของคุณ) ── */}
      <div className="hidden print:block mb-6">
        <div className="flex justify-between items-baseline border-b pb-2">
          <h1 className="text-2xl font-black tracking-wider text-black">TASSASCIT || ADMIN</h1>
          <span className="text-xs font-bold text-slate-500">ise-thailand</span>
        </div>
        <div className="text-xs font-bold text-slate-500 mt-1">
          {new Date().toLocaleDateString("th-TH")}
        </div>
      </div>

      {/* ── WEB PAGE HEADER ── */}
      <div className="mb-6 print-hidden">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-[var(--color-green)]" />
          <span>รายงานโครงการภายใต้สถาบันเศรษฐกิจพอเพียง (แยกตามประเภทโครงการ/พื้นที่จังหวัด)</span>
        </h1>
      </div>

      {/* ── แผงตัวกรองแบบแถวคู่: ประเภทโครงการ และ จังหวัด ── */}
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-5 print-hidden">
        <form onSubmit={handleProcess} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-slate-700">ประเภทโครงการ *:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-sm bg-white focus:outline-none"
            >
              <option value="">-เลือกทั้งหมด-</option>
              <option value="CAT-001">โครงการภายใต้สถาบันเศรษฐกิจพอเพียง</option>
              <option value="CAT-002">โครงการพัฒนาแบบ บูรณาการ และ อื่นๆ</option>
              <option value="CAT-003">โครงการสวัสดิการสังคม การศึกษา</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-slate-700">จังหวัด *:</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-sm bg-white focus:outline-none"
            >
              <option value="">-เลือกทั้งหมด-</option>
              <option value="PROV-BKK">กรุงเทพมหานคร</option>
              <option value="PROV-NONE">ไม่ระบุ</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-600 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>ประมวลผล</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── ACTIONS BAR TOOLBAR & QUICK SEARCH ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 print-hidden">
        <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
          <button onClick={handleExportExcel} className="hover:text-emerald-600 flex items-center gap-1 transition-colors cursor-pointer">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel</span>
          </button>
          <button onClick={handlePrint} className="hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer">
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Print</span>
          </button>
        </div>

        <div className="w-full sm:w-72 relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-1.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none bg-white text-[var(--color-deep-text)]"
          />
        </div>
      </div>

      {/* ── DATA TABLE สเกลขนาดกลางลบ Overflow เวลาพิมพ์ ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2B6CB0] border-b border-slate-300 text-white text-sm print:bg-white print:text-black">
                <th className="px-4 py-3 font-bold w-16 text-center border-r border-blue-500/30 print:border-black/20 print:text-black">ลำดับที่</th>
                <th className="px-4 py-3 font-bold border-r border-blue-500/30 print:border-black/20 print:text-black">ชื่อโครงการ</th>
                <th className="px-4 py-3 font-bold w-72 border-r border-blue-500/30 print:border-black/20 print:text-black">ประเภทโครงการ</th>
                <th className="px-4 py-3 font-bold w-44 text-center print:text-black">จังหวัด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm font-medium text-slate-700 print:divide-slate-300">
              {currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                  <tr 
                    key={row.id} 
                    className={`hover:bg-slate-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/50 print:bg-white"
                    }`}
                  >
                    <td className="px-4 py-3.5 text-center font-mono text-slate-500 border-r border-slate-100 print:border-black/10 print:text-black">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3.5 text-slate-800 font-semibold max-w-md leading-relaxed border-r border-slate-100 print:border-black/10 print:text-black">
                      {row.name}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 border-r border-slate-100 print:border-black/10 print:text-black">
                      {row.projectType}
                    </td>
                    <td className="px-4 py-3.5 text-center text-slate-600 print:text-black">
                      {row.province}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-12 text-center text-slate-400 font-medium bg-slate-50/30">
                    ไม่พบข้อมูลรายงานโครงการวิจัยภายใต้เงื่อนไขนี้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION BAR ── */}
        <div className="px-5 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50/50 text-xs print-hidden">
          <p className="font-semibold text-slate-500">
            Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 font-bold rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 font-extrabold rounded-lg transition-all cursor-pointer ${
                  currentPage === p
                    ? "bg-slate-200 text-slate-700 border border-slate-300 font-black"
                    : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 font-bold rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between text-xs font-semibold text-slate-400 print:hidden">
        <span>Showing 1 to {Math.min(itemsPerPage, filteredData.length)} of {filteredData.length} entries</span>
        <span>2022 © TASSA</span>
      </div>
    </div>
  );
}