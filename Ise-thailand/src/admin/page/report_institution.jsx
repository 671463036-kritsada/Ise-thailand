import { useState } from "react";
import { FileSpreadsheet, Printer, Search, BarChart3, RefreshCw } from "lucide-react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const initialReportData = [
  { id: 1, name: "โครงการพัฒนาคลังความรู้การนำปรัชญาของเศรษฐกิจพอเพียงไปประยุกต์ใช้ ในรูปแบบเว็บไซต์", leader: "ปรียานุช", budget: 2500000.00, start: "17/05/2026", end: "17/05/2026", type: "CAT-001" },
  { id: 2, name: "การบริหารจัดการเครือข่ายเศรษฐกิจพอเพียงแบบบูรณาการ", leader: "อัจฉรา", budget: 1450000.00, start: "17/05/2026", end: "17/05/2026", type: "CAT-002" },
  { id: 3, name: "โครงการจัดทำ Sufficiency Living Case Book ระยะที่ 1", leader: "ปรียานุช", budget: 2000000.00, start: "17/05/2026", end: "17/05/2026", type: "CAT-001" },
  { id: 4, name: "การบริหารราชการแผ่นดินบนพื้นฐานหลักปรัชญาของเศรษฐกิจพอเพียง ระยะที่ 1", leader: "กัลยาณีย์", budget: 1643723.00, start: "17/05/2026", end: "17/05/2026", type: "CAT-003" },
  { id: 5, name: "การสำรวจการรับรู้และความเข้าใจของประชาชนเกี่ยวกับปรัชญาของเศรษฐกิจพอเพียง", leader: "นิด้าโพลล์", budget: 899800.00, start: "17/05/2026", end: "17/05/2026", type: "CAT-004" },
  { id: 6, name: "โครงการพัฒนาดิจิทัลแพลตฟอร์มศูนย์กลางการเรียนรู้บูรณาการปรัชญาของเศรษฐกิจพอเพียงกับนวัตกรรมเพื่อการพัฒนาที่ยั่งยืน สมดุล และมั่นคง", leader: "ไม่ระบุ", budget: 4250000.00, start: "17/05/2026", end: "17/05/2026", type: "CAT-001" },
  { id: 7, name: "โครงการพัฒนาดิจิทัลแพลตฟอร์มศูนย์กลางการเรียนรู้บูรณาการปรัชญาของเศรษฐกิจพอเพียงกับนวัตกรรมเพื่อการพัฒนาที่ยั่งยืน สมดุล และมั่นคง", leader: "มานะ", budget: 4250000.00, start: "17/05/2026", end: "17/05/2026", type: "CAT-001" },
  { id: 8, name: "โครงการจัดทำ Sufficiency Living Case Book (ระยะที่ 2)", leader: "ปรียานุช", budget: 4850000.00, start: "17/05/2026", end: "17/05/2026", type: "CAT-001" },
  { id: 9, name: "โครงการเชื่อมโยงองค์ความรู้ด้านเศรษฐกิจพอเพียงเพื่อความยั่งยืนแบบบูรณาการ", leader: "วิสาขา", budget: 1000000.00, start: "17/05/2026", end: "17/05/2026", type: "CAT-002" },
  { id: 10, name: "โครงการวิจัยการบริหารราชการแผ่นดินบนพื้นฐานหลักปรัชญาของเศรษฐกิจพอเพียง ระยะที่ 2", leader: "กัลยาณีย์", budget: 4545796.00, start: "17/05/2026", end: "17/05/2026", type: "CAT-003" }
];

export default function ReportInstitution() {
  const [data, setData] = useState(initialReportData);
  const [selectedType, setSelectedType] = useState("");
  const [processedType, setProcessedType] = useState(""); 
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatMoney = (value) => {
    return new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleProcess = (e) => {
    e.preventDefault();
    setProcessedType(selectedType);
    setCurrentPage(1);
    Swal.fire({
      title: "ประมวลผลสำเร็จ",
      text: "ดึงข้อมูลรายงานโครงการตามเงื่อนไขเรียบร้อยแล้ว",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
      confirmButtonColor: "var(--color-green)"
    });
  };

    const handleExportExcel = () => {
        // 1. ปรับโครงสร้างข้อมูล Array ให้หัวคอลัมน์เป็นภาษาไทยตามโครงสร้างหน้าเว็บ
        const exportData = filteredData.map((item, index) => ({
            "ลำดับที่": index + 1,
            "ชื่อโครงการ": item.name,
            "ชื่อหัวหน้าโครงการ": item.leader,
            "งบประมาณ (บาท)": item.budget,
            "วันที่ทำสัญญา": item.start,
            "วันที่สิ้นสุดสัญญา": item.end,
        }));

        // 2. สร้างโครงสร้าง Worksheet และ Workbook ของ Excel ผ่านไลบรารี
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "โครงการสถาบัน");

        // 3. สั่งเขียนไฟล์และเด้งหน้าต่างดาวน์โหลดเป็น .xlsx ออกมาทันที
        XLSX.writeFile(workbook, `รายงานโครงการ_${new Date().toISOString().slice(0,10)}.xlsx`);
        // XLSX.writeFile(workbook, `TASSASCIT  ADMIN.xlsx`);

        Swal.fire({
            title: "ส่งออกข้อมูลสำเร็จ",
            text: "ดาวน์โหลดไฟล์เอกสาร .xlsx เรียบร้อยแล้ว",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });
    };

  const handlePrint = () => {
    window.print();
  };

  const filteredData = data.filter((item) => {
    const matchesType = processedType === "" || item.type === processedType;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.leader.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)] print:p-0 print:bg-white">
      
      {/* ── แทรก CSS สำหรับควบคุม Layout และเอา Scrollbar ออกเมื่อสั่งพิมพ์ ── */}
      <style>{`
        @media print {
          /* 1. ซ่อน Sidebar ส่วนประกอบเว็บ และปุ่มกดทั้งหมด */
          .print-hidden,
          aside,
          nav,
          header,
          footer,
          button {
            display: none !important;
          }

          /* 2. บังคับเคลียร์โครงสร้างรอบนอก ปลดล็อก Flexbox/Grid เพื่อแก้ปัญหาตัวลีบยาว */
          body, html, #root, main, .min-h-screen {
            background: #fff !important;
            color: #000 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
          }

          /* 3. 🛠️ แก้ปัญหาแก้ Scrollbar โผล่: สั่งให้กล่องหุ้มตารางขยายตัวตามเนื้อหาจริง ไม่ให้เลื่อน */
          .overflow-x-auto, .overflow-y-auto {
            overflow: visible !important;
            max-height: none !important;
            width: 100% !important;
          }

          /* ซ่อนตัว Scrollbar ของบราวเซอร์เพื่อความปลอดภัย */
          ::-webkit-scrollbar {
            display: none !important;
          }

          /* 4. จัดสไตล์ตารางให้แผ่กว้างอย่างอิสระ */
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

          /* 5. ตั้งค่าระยะหน้ากระดาษ A4 แนวตั้ง */
          @page {
            size: A4 portrait;
            margin: 15mm 10mm 15mm 10mm;
          }
        }
      `}</style>

      {/* ── PRINT HEADER (แสดงผลเฉพาะบนกระดาษพิมพ์) ── */}
      <div className="hidden print:block mb-6">
        <div className="flex justify-between items-baseline border-b pb-2">
          <h1 className="text-2xl font-black tracking-wider text-black">TASSASCIT || ADMIN</h1>
          <span className="text-xs font-bold text-slate-500">TASSASCIT || ADMIN</span>
        </div>
        <div className="text-xs font-bold text-slate-500 mt-1">
          {new Date().toLocaleDateString("th-TH")}
        </div>
      </div>

      {/* ── DASHBOARD HEADER ── */}
      <div className="mb-6 print-hidden">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-[var(--color-green)]" />
          <span>รายงานโครงการภายใต้สถาบันเศรษฐกิจพอเพียง (ตามประเภทโครงการ)</span>
        </h1>
        <p className="text-sm text-[var(--color-muted-text)] mt-0.5 font-medium">
          หน้าจอเรียกดูข้อมูล ตรวจสอบสถิติงบประมาณ และสรุปรายงานวันสิ้นสุดสัญญาของสถาบัน
        </p>
      </div>

      {/* ── แผงเครื่องมือตัวกรอง ── */}
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-5 print-hidden">
        <form onSubmit={handleProcess} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-full sm:w-80 flex flex-col gap-1">
            <label className="text-sm font-bold text-slate-700">ประเภทโครงการ * :</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--color-border-focus)] cursor-pointer text-[var(--color-deep-text)]"
            >
              <option value="">-เลือกทั้งหมด-</option>
              <option value="CAT-001">โครงการพัฒนาด้านแหล่งน้ำ</option>
              <option value="CAT-002">โครงการพัฒนาด้านการเกษตร</option>
              <option value="CAT-003">โครงการพัฒนาด้านสิ่งแวดล้อม</option>
              <option value="CAT-004">โครงการพัฒนาด้านส่งเสริมอาชีพ</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 mt-6 bg-slate-600 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>ประมวลผล</span>
          </button>
        </form>
      </div>

      {/* ── TOOLBAR สั่งพิมพ์ / ส่งออกไฟล์ ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 print-hidden">
        <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
          <button 
            onClick={handleExportExcel}
            className="hover:text-emerald-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel</span>
          </button>
          <button 
            onClick={handlePrint}
            className="hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
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
            className="w-full pl-9 pr-3 py-1.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)] bg-white text-[var(--color-deep-text)] placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* ── DATA TABLE ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
        {/* กล่องชั้นนี้แหละครับที่มีคลาส overflow-x-auto ซึ่งสไตล์ด้านบนได้ทำการปลดล็อกให้แสดงตัวเป็นปกติเวลาพิมพ์แล้ว */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2B6CB0] border-b border-slate-300 text-white text-sm print:bg-white print:text-black">
                <th className="px-4 py-3 font-bold w-16 text-center border-r border-blue-500/30 print:border-black/20 print:text-black">ลำดับที่</th>
                <th className="px-4 py-3 font-bold border-r border-blue-500/30 print:border-black/20 print:text-black">ชื่อโครงการ</th>
                <th className="px-4 py-3 font-bold w-44 border-r border-blue-500/30 print:border-black/20 print:text-black">ชื่อหัวหน้าโครงการ</th>
                <th className="px-4 py-3 font-bold w-40 text-right border-r border-blue-500/30 print:border-black/20 print:text-black">งบประมาณ</th>
                <th className="px-4 py-3 font-bold w-32 text-center border-r border-blue-500/30 print:border-black/20 print:text-black">วันที่ ทำสัญญา</th>
                <th className="px-4 py-3 font-bold w-32 text-center print:text-black">วันที่ สิ้นสุดสัญญา</th>
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
                    <td className="px-4 py-3.5 text-slate-800 font-semibold max-w-md leading-relaxed border-r border-slate-100 print:border-black/10 print:text-black text-sm">
                      {row.name}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium border-r border-slate-100 print:border-black/10 print:text-black text-sm">
                      {row.leader}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-slate-700 border-r border-slate-100 print:border-black/10 print:text-black">
                      {formatMoney(row.budget)}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-500 border-r border-slate-100 print:border-black/10 print:text-black">
                      {row.start}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-500 print:text-black">
                      {row.end}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-slate-400 font-medium bg-slate-50/30">
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
              className="px-3 py-1.5 font-bold rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 font-extrabold rounded-lg transition-all cursor-pointer ${
                  currentPage === p
                    ? "bg-slate-200 text-slate-700 border border-slate-300 font-black shadow-inner"
                    : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 font-bold rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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