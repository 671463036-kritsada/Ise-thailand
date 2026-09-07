import React, { useState, useEffect } from "react";
import { Mail, Search, Eye, CheckCircle2, Clock, X, Send } from "lucide-react";
import api from "../../api/axios";
import Swal from 'sweetalert2';

const ContactPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  
  // State สำหรับ Modal
  const [activeTab, setActiveTab] = useState("detail"); // 'detail' | 'reply'
  const [noteInput, setNoteInput] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingMail, setSendingMail] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/contact/admin");
      if (res.data?.success) {
        setContacts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleOpenDetail = (item) => {
    setSelectedContact(item);
    setNoteInput(item.admin_note || "");
    setReplyMessage("");
    setActiveTab("detail");
  };

  const handleUpdateStatus = async (id, status, note) => {
    try {
      await api.put(`/contact/admin/${id}/status`, {
        status,
        admin_note: note,
      });
      fetchContacts();
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact({ ...selectedContact, status, admin_note: note });
      }

      // แจ้งเตือนสำเร็จแบบ Toast มุมบนขวา ไม่รบกวนหน้าจอ
      Swal.fire({
        icon: 'success',
        title: 'บันทึกข้อมูลเรียบร้อย',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonColor: '#4c7c37',
      });
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อความ',
        text: 'โปรดพิมพ์ข้อความตอบกลับก่อนกดยืนยันการส่ง',
        confirmButtonColor: '#4c7c37',
      });
      return;
    }

    // Modal ถามยืนยันก่อนกดยิงอีเมลจริง
    const confirmResult = await Swal.fire({
      title: 'ยืนยันการส่งอีเมล?',
      html: `ต้องการส่งข้อความตอบกลับไปยัง <br><b>${selectedContact.email}</b> ใช่หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ยืนยันการส่ง',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#4c7c37',
      cancelButtonColor: '#9ca3af',
    });

    if (!confirmResult.isConfirmed) return;

    try {
      setSendingMail(true);
      await api.post(`/contact/admin/${selectedContact.id}/reply`, {
        toEmail: selectedContact.email,
        userName: `${selectedContact.first_name} ${selectedContact.last_name}`,
        replyMessage: replyMessage,
        admin_note: noteInput,
      });

      Swal.fire({
        icon: 'success',
        title: 'ส่งอีเมลสำเร็จ!',
        text: 'ระบบได้ทำการส่งข้อความตอบกลับเรียบร้อยแล้ว',
        confirmButtonColor: '#4c7c37',
      });

      setSelectedContact(null);
      fetchContacts();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'ส่งอีเมลไม่สำเร็จ',
        text: err.response?.data?.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่',
        confirmButtonColor: '#b85c4a',
      });
    } finally {
      setSendingMail(false);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-2xl font-bold text-[#2d4a22]">
          <Mail size={28} className="text-[#3b5e2b]" />
          <h1>ข้อความติดต่อจากผู้ใช้</h1>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          จัดการ ตอบกลับ และตรวจสอบข้อความจากแบบฟอร์มหน้าเว็บไซต์
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อ-นามสกุล, อีเมล หรือเบอร์โทร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4c7c37]"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4c7c37] bg-white text-gray-700 cursor-pointer"
        >
          <option value="all">ทุกสถานะ</option>
          <option value="pending">รอรับเรื่อง</option>
          <option value="completed">จัดการเรียบร้อย</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#edf2ea] border border-[#d6e2d1] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#d6e2d1] text-xs font-semibold text-gray-700 uppercase tracking-wider bg-[#edf2ea]">
                <th className="py-3.5 px-4 text-center w-16">ID</th>
                <th className="py-3.5 px-4">ชื่อ - นามสกุล</th>
                <th className="py-3.5 px-4">เบอร์โทรศัพท์</th>
                <th className="py-3.5 px-4">อีเมล</th>
                <th className="py-3.5 px-4">วันที่ส่ง</th>
                <th className="py-3.5 px-4 text-center">สถานะ</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">กำลังโหลดข้อมูล...</td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">ไม่พบข้อมูลข้อความติดต่อ</td>
                </tr>
              ) : (
                filteredContacts.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f9fbf9] transition-colors">
                    <td className="py-3.5 px-4 text-center text-gray-500 font-medium">#{item.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#2d4a22]">
                      {item.first_name} {item.last_name}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{item.phone}</td>
                    <td className="py-3.5 px-4 text-gray-600">{item.email}</td>
                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                      {new Date(item.created_at).toLocaleDateString("th-TH", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <CheckCircle2 size={12} /> จัดการแล้ว
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Clock size={12} /> รอรับเรื่อง
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenDetail(item)}
                        className="p-1.5 rounded-lg border border-gray-200 text-[#4c7c37] hover:bg-[#edf2ea] transition-colors cursor-pointer"
                        title="ดูรายละเอียด/ตอบกลับ"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
            
            {/* Header & Tabs */}
            <div className="p-4 border-b border-gray-100 bg-[#edf2ea] flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("detail")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "detail"
                      ? "bg-[#4c7c37] text-white shadow-xs"
                      : "bg-white/60 text-gray-700 hover:bg-white"
                  }`}
                >
                  รายละเอียด
                </button>
                <button
                  onClick={() => setActiveTab("reply")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === "reply"
                      ? "bg-[#4c7c37] text-white shadow-xs"
                      : "bg-white/60 text-gray-700 hover:bg-white"
                  }`}
                >
                  <Send size={12} /> ตอบกลับทางอีเมล
                </button>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-sm flex-1 overflow-y-auto">
              {activeTab === "detail" ? (
                <>
                  <div>
                    <span className="text-gray-400 text-xs block">ผู้ติดต่อ</span>
                    <span className="font-semibold text-gray-800">
                      {selectedContact.first_name} {selectedContact.last_name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400 text-xs block">เบอร์โทรศัพท์</span>
                      <a href={`tel:${selectedContact.phone}`} className="text-[#4c7c37] hover:underline font-medium">
                        {selectedContact.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">อีเมล</span>
                      <span className="text-gray-800 font-medium">{selectedContact.email}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400 text-xs block mb-1">ข้อความจากผู้ใช้</span>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedContact.message}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400 text-xs block mb-1">บันทึกช่วยจำ (Admin Note)</span>
                    <textarea
                      rows="3"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="พิมพ์บันทึกภายใน..."
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4c7c37]"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <p><b className="text-gray-500">ส่งถึง:</b> {selectedContact.first_name} {selectedContact.last_name}</p>
                    <p><b className="text-gray-500">อีเมลปลายทาง:</b> {selectedContact.email}</p>
                  </div>

                  <div>
                    <label className="text-gray-700 text-xs font-semibold block mb-1">
                      ข้อความตอบกลับ:
                    </label>
                    <textarea
                      rows="6"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="พิมพ์ข้อความที่ต้องการส่งหาผู้ใช้โดยตรง..."
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#4c7c37]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                สถานะ: <b>{selectedContact.status === "completed" ? "จัดการแล้ว" : "รอรับเรื่อง"}</b>
              </span>

              {activeTab === "detail" ? (
                <div className="flex gap-2">
                  {selectedContact.status === "pending" ? (
                    <button
                      onClick={() => handleUpdateStatus(selectedContact.id, "completed", noteInput)}
                      className="px-3.5 py-2 bg-[#4c7c37] hover:bg-[#3b5e2b] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 size={14} /> ทำเครื่องหมายว่าจัดการแล้ว
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(selectedContact.id, "pending", noteInput)}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      เปลี่ยนเป็นรอรับเรื่อง
                    </button>
                  )}
                  <button
                    onClick={() => handleUpdateStatus(selectedContact.id, selectedContact.status, noteInput)}
                    className="px-3 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    บันทึกโน้ต
                  </button>
                </div>
              ) : (
                <button
                  disabled={sendingMail}
                  onClick={handleSendReply}
                  className="px-5 py-2 bg-[#4c7c37] hover:bg-[#3b5e2b] disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Send size={14} />
                  {sendingMail ? "กำลังส่ง..." : "ส่งอีเมลทันที"}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;