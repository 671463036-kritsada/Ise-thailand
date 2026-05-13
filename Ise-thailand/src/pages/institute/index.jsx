import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, ChevronDown, CheckCircle2 } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';

const InstitutePage = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', subject: 'เลือกหัวข้อการติดต่อ', detail: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  /* เทคนิค "Full Width Breakout" 
     ใช้ได้แม้จะอยู่ใน Container บีบอยู่ โดยการขยายออกไป 50vw 
     แล้วดึงกลับมาตรงกลางด้วย -50% ของความกว้างหน้าจอ */
  const fullWidthClass = "relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen";

  return (
    /* ปรับปรุง Container หลักให้รองรับการล้างค่า Margin/Padding จาก App.jsx */
    <div className="font-['Nunito'] antialiased">
      
      {/* 1. Hero Section - Full Width */}
      <section className={`${fullWidthClass} -mt-9 h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 z-0">
          <img 
            alt="สถาบันเศรษฐกิจพอเพียง" 
            className="w-full h-full object-cover brightness-[0.4]" 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-green/30 to-surface"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          <h1 className="text-3xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            ติดต่อสถาบัน
          </h1>
          <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto font-medium">
            ร่วมสืบสานศาสตร์พระราชาและปรัชญาเศรษฐกิจพอเพียง
          </p>
        </motion.div>
      </section>

      {/* 2. Main Content - ส่วนนี้จะกลับเข้ามาอยู่ใน Container ตาม max-w-7xl */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-16 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-forest-green p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              <h2 className="text-xl md:text-2xl font-bold mb-8 relative z-10">ข้อมูลการติดต่อ</h2>
              
              <div className="space-y-6 relative z-10">
                <ContactInfoItem icon={<MapPin size={22} />} title="ที่อยู่สถาบัน" desc="99 หมู่ 1 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ" />
                <ContactInfoItem icon={<Phone size={22} />} title="เบอร์โทรศัพท์" desc="02-123-4567" />
                <ContactInfoItem icon={<Mail size={22} />} title="อีเมล" desc="info@sufficiency.or.th" />
              </div>

              <div className="mt-10 pt-6 border-t border-white/10 relative z-10">
                <div className="flex gap-3">
                  <SocialBtn icon={<FaFacebookF size={14} />} />
                  <SocialBtn icon={<FaInstagram size={16} />} />
                  <SocialBtn icon={<FaYoutube size={16} />} />
                </div>
              </div>
            </motion.div>

            <div className="bg-white p-6 rounded-[2rem] border border-green-light/30 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center text-green shrink-0">
                <Clock size={24} />
              </div>
              <div className="text-sm">
                <h3 className="font-bold text-deep-text">เวลาทำการ</h3>
                <p className="text-muted-text">จันทร์ - ศุกร์ | 08.30 - 16.30 น.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-green-light/20 text-center h-full flex flex-col justify-center items-center"
                >
                  <CheckCircle2 size={50} className="text-green mb-4" />
                  <h2 className="text-xl font-bold text-forest-green mb-2">ส่งข้อมูลสำเร็จ</h2>
                  <button onClick={() => setSubmitted(false)} className="mt-4 text-green font-bold hover:underline">ส่งอีกครั้ง</button>
                </motion.div>
              ) : (
                <motion.div 
                  key="form" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl p-6 md:p-12 border border-green-light/20"
                >
                  <h2 className="text-2xl font-extrabold text-forest-green mb-8">ส่งข้อความถึงเรา</h2>
                  <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <InputField label="ชื่อ" name="firstName" value={form.firstName} onChange={handleChange} placeholder="ระบุชื่อ" required />
                      <InputField label="นามสกุล" name="lastName" value={form.lastName} onChange={handleChange} placeholder="ระบุนามสกุล" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <InputField label="เบอร์โทรศัพท์" name="phone" value={form.phone} onChange={handleChange} placeholder="08X-XXX-XXXX" type="tel" required />
                      <InputField label="อีเมล" name="email" value={form.email} onChange={handleChange} placeholder="example@email.com" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-deep-text ml-1 uppercase">รายละเอียด</label>
                      <textarea 
                        name="detail" value={form.detail} onChange={handleChange}
                        className="w-full bg-surface-2 border border-green-light/30 rounded-xl px-4 py-3 focus:outline-none focus:border-green text-sm min-h-[120px]" 
                        placeholder="พิมพ์ข้อความที่นี่..." required
                      />
                    </div>
                    <button type="submit" className="w-full bg-green hover:bg-forest-green text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                      ส่งข้อความ <Send size={16} />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* 3. Map Section - Full Width */}
      <section className={`${fullWidthClass} h-[350px] bg-surface-2 relative group`}>
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer z-10">
          <div className="text-center p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-green-light shadow-xl transition-transform group-hover:scale-105">
             <MapPin size={32} className="mx-auto text-green mb-2 animate-bounce" />
             <p className="font-bold text-forest-green">คลิกเพื่อดูแผนที่</p>
          </div>
        </div>
      </section>

      {/* Footer - Full Width */}
      <footer className={`${fullWidthClass} bg-forest-green py-10 text-center border-t-4 border-gold text-white/60 text-xs md:text-sm`}>
        <p className="px-6 italic">© 2026 Institute of Sufficiency Economy. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Components
const ContactInfoItem = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">{icon}</div>
    <div>
      <h3 className="font-bold text-green-light text-[10px] uppercase tracking-wider">{title}</h3>
      <p className="text-white/90 text-xs md:text-sm">{desc}</p>
    </div>
  </div>
);

const SocialBtn = ({ icon }) => (
  <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-forest-green transition-all">{icon}</button>
);

const InputField = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-deep-text ml-1 uppercase">{label}</label>
    <input className="w-full bg-surface-2 border border-green-light/30 rounded-xl px-4 py-3 focus:outline-none focus:border-green text-sm" {...props} />
  </div>
);

export default InstitutePage;