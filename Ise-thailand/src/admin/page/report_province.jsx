import { useState, useEffect } from "react";
import { FileSpreadsheet, Printer, Search, BarChart3, RefreshCw } from "lucide-react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import api from "../../api/axios";

export default function ReportProvince() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    api.get("/type-project")
      .then((res) => { if (res.data.success) setTypeOptions(res.data.data); })
      .catch(console.error);

    api.get("/reports/provinces")
      .then((res) => { if (res.data.success) setProvinceOptions(res.data.data); })
      .catch(console.error);

    fetchData();
  }, []);

  const fetchData = async (type_id = "", province_id = "") => {
    setLoading(true);
    try {
      const res = await api.get("/reports", {
        params: { type_id: type_id || undefined, province_id: province_id || undefined },
      });
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      Swal.fire({ title: "เกิดข้อผิดพลาด", text: err.message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData(selectedType, selectedProvince);
    Swal.fire({
      title: "ประมวลผลสำเร็จ",
      text: "ระบบคัดกรองข้อมูลตามประเภทและพื้นที่จังหวัดเรียบร้อยแล้ว",
      icon: "success", timer: 1200, showConfirmButton: false,
    });
  };

  const filteredData = data.filter((item) => {
    const name = item.name_thai || "";
    const type = item.type_name || "";
    const province = item.province_name || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      province.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExportExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      "ลำดับที่": index + 1,
      "ชื่อโครงการ": item.name_thai,
      "ประเภทโครงการ": item.type_name || "ไม่ระบุ",
      "จังหวัด": item.province_name || "ไม่ระบุ",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "แยกตามจังหวัด");
    XLSX.writeFile(workbook, `รายงานแยกตามจังหวัด_${new Date().toISOString().slice(0, 10)}.xlsx`);
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

      {/* PRINT HEADER */}
      <div className="hidden print:block mb-6">
        <div className="flex justify-between items-baseline border-b pb-2">
          <h1 className="text-2xl font-black tracking-wider text-black">TASSASCIT || ADMIN</h1>
          <span className="text-xs font-bold text-slate-500">ise-thailand</span>
        </div>
        <div className="text-xs font-bold text-slate-500 mt-1">{new Date().toLocaleDateString("th-TH")}</div>
      </div>

      {/* HEADER */}
      <div className="mb-6 print-hidden">
        <h1 className="text-2xl font-bold text-[var(--color-forest-blue)] tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-[var(--color-blue)]" />
          <span>รายงานโครงการภายใต้สถาบันเศรษฐกิจพอเพียง (แยกตามประเภทโครงการ/พื้นที่จังหวัด)</span>
        </h1>
      </div>

      {/* FILTER FORM */}
      <div className="bg-white p-5 rounded-xl border border-[var(--color-border)] shadow-sm mb-5 print-hidden">
        <form onSubmit={handleProcess} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-[var(--color-deep-text)]">ประเภทโครงการ *:</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--color-border-focus)]">
              <option value="">-เลือกทั้งหมด-</option>
              {typeOptions.map((t) => (
                <option key={t.type_id} value={t.type_id}>{t.type_name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-[var(--color-deep-text)]">จังหวัด *:</label>
            <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-1.5 border border-[var(--color-border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--color-border-focus)]">
              <option value="">-เลือกทั้งหมด-</option>
              {provinceOptions.map((p) => (
                <option key={p.province_id} value={p.province_id}>{p.name_th}</option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit"
              className="px-4 py-1.5 bg-[var(--color-blue)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--color-forest-blue)] transition-colors cursor-pointer flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" /><span>ประมวลผล</span>
            </button>
          </div>
        </form>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 print-hidden">
        <div className="flex items-center gap-4 text-sm font-semibold text-[var(--color-muted-text)]">
          <button onClick={handleExportExcel} className="hover:text-emerald-600 flex items-center gap-1 transition-colors cursor-pointer">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /><span>Excel</span>
          </button>
          <button onClick={handlePrint} className="hover:text-[var(--color-blue)] flex items-center gap-1 transition-colors cursor-pointer">
            <Printer className="w-4 h-4 text-[var(--color-blue)]" /><span>Print</span>
          </button>
        </div>
        <div className="w-full sm:w-72 relative flex items-center">
          <Search className="w-4 h-4 text-[var(--color-disabled)] absolute left-3 pointer-events-none" />
          <input type="text" placeholder="ค้นหา..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-1.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-blue-light)]/50 bg-white text-[var(--color-deep-text)]" />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden print:border-none print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-forest-blue)] text-white text-sm print:bg-white print:text-black">
                <th className="px-4 py-3 font-bold w-16 text-center border-r border-white/10 print:text-black">ลำดับที่</th>
                <th className="px-4 py-3 font-bold border-r border-white/10 print:text-black">ชื่อโครงการ</th>
                <th className="px-4 py-3 font-bold w-72 border-r border-white/10 print:text-black">ประเภทโครงการ</th>
                <th className="px-4 py-3 font-bold w-44 text-center print:text-black">จังหวัด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-3)] text-sm font-medium text-[var(--color-deep-text)] print:divide-slate-300">
              {loading ? (
                <tr><td colSpan="4" className="px-4 py-12 text-center text-[var(--color-muted-text)]">กำลังโหลดข้อมูล...</td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                  <tr key={row.project_id} className={`hover:bg-[var(--color-surface-2)]/30 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[var(--color-surface)]/20 print:bg-white"}`}>
                    <td className="px-4 py-3.5 text-center font-mono text-[var(--color-blue)] border-r border-[var(--color-surface-3)] print:text-black">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[var(--color-deep-text)] max-w-md leading-relaxed border-r border-[var(--color-surface-3)] print:text-black">
                      {row.name_thai}
                    </td>
                    <td className="px-4 py-3.5 text-[var(--color-muted-text)] border-r border-[var(--color-surface-3)] print:text-black">
                      {row.type_name || "ไม่ระบุ"}
                    </td>
                    <td className="px-4 py-3.5 text-center text-[var(--color-muted-text)] print:text-black">
                      {row.province_name || "ไม่ระบุ"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="px-4 py-12 text-center text-[var(--color-disabled)] font-medium">ไม่พบข้อมูลรายงานโครงการวิจัยภายใต้เงื่อนไขนี้</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-5 py-3.5 border-t border-[var(--color-surface-3)] flex flex-col sm:flex-row justify-between items-center gap-3 bg-[var(--color-surface)]/10 text-xs print-hidden">
          <p className="font-medium text-[var(--color-muted-text)]">
            แสดง {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} ถึง {Math.min(currentPage * itemsPerPage, filteredData.length)} จาก {filteredData.length} รายการ
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer">
              ย้อนกลับ
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 font-bold rounded-lg transition-colors cursor-pointer ${currentPage === p ? "bg-[var(--color-blue)] text-white shadow-sm" : "border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)]"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages || totalPages === 0}
              className="px-3 py-1.5 font-semibold rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer">
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between text-xs font-semibold text-[var(--color-disabled)] print:hidden">
        <span>แสดง 1 ถึง {Math.min(itemsPerPage, filteredData.length)} จาก {filteredData.length} รายการ</span>
        <span>2022 © TASSA</span>
      </div>
    </div>
  );
}