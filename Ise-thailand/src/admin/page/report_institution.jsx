import { useState, useEffect } from "react";
import { FileSpreadsheet, Printer, Search, BarChart3, RefreshCw } from "lucide-react";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

import api from "../../api/axios";

export default function ReportInstitution() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // โหลด dropdown ประเภทโครงการ
  useEffect(() => {
    api.get("/type-project")              
      .then((res) => {
        if (res.data.success) setTypeOptions(res.data.data);
      })
      .catch(console.error);
  }, []);

  // โหลดข้อมูลครั้งแรก
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (type_id = "") => {
    setLoading(true);
    try {
      const params = {};
      if (type_id) params.type_id = type_id;

      const res = await api.get("/reports/budget", { params });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: err.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  const formatMoney = (value) =>
    new Intl.NumberFormat("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

  const formatDate = (dateStr) => {
    if (!dateStr) return "ไม่ระบุ";
    const d = new Date(dateStr);
    return d.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const handleProcess = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData(selectedType);
    Swal.fire({
      title: "ประมวลผลสำเร็จ",
      text: "ดึงข้อมูลรายงานโครงการตามเงื่อนไขเรียบร้อยแล้ว",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const filteredData = data.filter((item) => {
    const name = item.name_thai || "";
    const leader = item.researcher_name || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      "ลำดับที่": index + 1,
      "ชื่อโครงการ": item.name_thai,
      "ชื่อหัวหน้าโครงการ": item.researcher_name || "ไม่ระบุ",
      "งบประมาณ (บาท)": item.cost,
      "วันที่ทำสัญญา": formatDate(item.startdate),
      "วันที่สิ้นสุดสัญญา": formatDate(item.enddate),
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "โครงการสถาบัน");
    XLSX.writeFile(workbook, `รายงานโครงการ_${new Date().toISOString().slice(0, 10)}.xlsx`);
    Swal.fire({ title: "ส่งออกข้อมูลสำเร็จ", icon: "success", timer: 1500, showConfirmButton: false });
  };

  const handlePrint = () => window.print();

  return (
    <div className="p-6 bg-[var(--color-surface)] min-h-screen font-sans antialiased text-[var(--color-deep-text)] print:p-0 print:bg-white">
      <style>{`
        @media print {
          .print-hidden, aside, nav, header, footer, button { display: none !important; }
          body, html, #root, main, .min-h-screen {
            background: #fff !important; color: #000 !important;
            width: 100% !important; max-width: 100% !important;
            margin: 0 !important; padding: 0 !important; display: block !important;
          }
          .overflow-x-auto, .overflow-y-auto { overflow: visible !important; max-height: none !important; width: 100% !important; }
          ::-webkit-scrollbar { display: none !important; }
          table { width: 100% !important; table-layout: auto !important; border-collapse: collapse !important; }
          th { background-color: #ffffff !important; color: #000000 !important; border-bottom: 2px solid #000000 !important; font-weight: bold !important; }
          td, th { padding: 8px 6px !important; border: 1px solid #cbd5e1 !important; white-space: normal !important; }
          @page { size: A4 portrait; margin: 15mm 10mm 15mm 10mm; }
        }
      `}</style>

      <div className="hidden print:block mb-6">
        <div className="flex justify-between items-baseline border-b pb-2">
          <h1 className="text-2xl font-black tracking-wider text-black">TASSASCIT || ADMIN</h1>
          <span className="text-xs font-bold text-slate-500">TASSASCIT || ADMIN</span>
        </div>
        <div className="text-xs font-bold text-slate-500 mt-1">{new Date().toLocaleDateString("th-TH")}</div>
      </div>

      <div className="mb-6 print-hidden">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-[var(--color-green)]" />
          <span>รายงานโครงการภายใต้สถาบันเศรษฐกิจพอเพียง (ตามประเภทโครงการ)</span>
        </h1>
      </div>

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
              {typeOptions.map((t) => (
                <option key={t.type_id} value={t.type_id}>{t.type_name}</option>
              ))}
            </select>
          </div>
          {/* เปลี่ยนสีปุ่มประมวลผลเป็นสีเขียวแบรนด์หลัก */}
          <button
            type="submit"
            className="px-4 py-2 mt-6 bg-[var(--color-green)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--color-forest-green)] transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>ประมวลผล</span>
          </button>
        </form>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 print-hidden">
        <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
          <button onClick={handleExportExcel} className="hover:text-emerald-600 flex items-center gap-1 transition-colors cursor-pointer">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /><span>Excel</span>
          </button>
          <button onClick={handlePrint} className="hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer">
            <Printer className="w-4 h-4 text-blue-600" /><span>Print</span>
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* เปลี่ยนสีหัวตารางจากระบบสีเดิมเป็นสีเขียวป่าไม้ (Forest Green) */}
              <tr className="bg-[var(--color-surface-2)] border-b border-slate-300 text-black text-sm print:bg-white print:text-black">
                <th className="px-4 py-3 font-bold w-16 text-center border-r border-[var(--color-green-light)]/30 print:text-black">ลำดับที่</th>
                <th className="px-4 py-3 font-bold border-r border-[var(--color-green-light)]/30 print:text-black">ชื่อโครงการ</th>
                <th className="px-4 py-3 font-bold w-44 border-r border-[var(--color-green-light)]/30 print:text-black">ชื่อหัวหน้าโครงการ</th>
                <th className="px-4 py-3 font-bold w-40 text-right border-r border-[var(--color-green-light)]/30 print:text-black">งบประมาณ</th>
                <th className="px-4 py-3 font-bold w-32 text-center border-r border-[var(--color-green-light)]/30 print:text-black">วันที่ทำสัญญา</th>
                <th className="px-4 py-3 font-bold w-32 text-center print:text-black">วันที่สิ้นสุดสัญญา</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm font-medium text-slate-700 print:divide-slate-300">
              {loading ? (
                <tr><td colSpan="6" className="px-4 py-12 text-center text-slate-400">กำลังโหลดข้อมูล...</td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                  <tr key={row.project_id} className={`hover:bg-slate-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50 print:bg-white"}`}>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-500 border-r border-slate-100 print:text-black">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3.5 text-slate-800 font-semibold max-w-md leading-relaxed border-r border-slate-100 print:text-black">
                      {row.name_thai}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium border-r border-slate-100 print:text-black">
                      {row.researcher_name || "ไม่ระบุ"}
                    </td>
                    {/* เปลี่ยนตัวหนังสือมูลค่างบประมาณให้แมตช์เข้ากับสีเขียวป่าไม้ */}
                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-[var(--color-forest-green)] border-r border-slate-100 print:text-black">
                      {formatMoney(row.cost)}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-500 border-r border-slate-100 print:text-black">
                      {formatDate(row.startdate)}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-slate-500 print:text-black">
                      {formatDate(row.enddate)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="px-4 py-12 text-center text-slate-400 font-medium bg-slate-50/30">ไม่พบข้อมูลรายงานโครงการวิจัยภายใต้เงื่อนไขนี้</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-50/50 text-xs print-hidden">
          <p className="font-semibold text-slate-500">
            Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="px-3 py-1.5 font-bold rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              /* ปรับเปลี่ยนสีปุ่มตัวเลขระบุหน้า (Pagination) หน้าปัจจุบันให้แสดงเป็นสีเขียวแบรนด์หลัก */
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 font-extrabold rounded-lg transition-all cursor-pointer ${currentPage === p ? "bg-[var(--color-green)] text-white border border-[var(--color-forest-green)] shadow-inner" : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 font-bold rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
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