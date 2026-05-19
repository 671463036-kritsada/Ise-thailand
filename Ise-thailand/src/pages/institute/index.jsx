import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, ChevronDown, CheckCircle2 } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';

import { useTranslation } from 'react-i18next'

import api from '../../api/axios'

const InstitutePage = () => {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', subject: 'เลือกหัวข้อการติดต่อ', detail: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/contact", form);
      setSubmitted(true);
    } catch (err) {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };



  const fullWidthClass = "relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen";

  return (
    <div>

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
          <h1 className="text-4xl md:text-7xl font-extrabold text-black/70 mb-4 tracking-tight leading-tight">
            {t('contact_title')}
          </h1>
          <p className="text-4xl md:text-4xl text-white/90 max-w-4xl mx-auto font-medium">
          {t('contact_subtitle')}
          </p>
        </motion.div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 -mt-16 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-forest-green p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              <h2 className="text-2xl md:text-3xl font-bold mb-8 relative z-10">{t('contact_info')}</h2>

              <div className="space-y-6 relative z-10">
                <ContactInfoItem icon={<MapPin size={26} />} title={t('contact_address_title')} desc={t('contact_address_desc')} />
                <ContactInfoItem icon={<Phone size={26} />} title={t('contact_phone_title')} desc={t('contact_phone_desc')} />
                <ContactInfoItem icon={<Mail size={26} />} title={t('contact_email_title')} desc={t('contact_email_desc')} />
              </div>

              <div className="mt-10 pt-6 border-t border-white/10 relative z-10">
                <div className="flex gap-3">
                  <SocialBtn icon={<FaFacebookF size={18} />} />
                  <SocialBtn icon={<FaInstagram size={20} />} />
                  <SocialBtn icon={<FaYoutube size={20} />} />
                </div>
              </div>
            </motion.div>

            <div className="bg-white p-4 rounded-[2rem] border border-green-light/30 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-surface-2 flex items-center justify-center text-green shrink-0">
                <Clock size={28} />
              </div>
              <div className="text-base">
                <h3 className="font-bold text-deep-text text-xl">{t('contact_hours_title')}</h3>
                <p className="text-lg">{t('contact_hours_desc')}</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl p-8 md:p-12 border border-green-light/20 text-center h-full flex flex-col justify-center items-center"
                >
                  <CheckCircle2 size={60} className="text-green mb-4" />
                  <h2 className="text-2xl font-bold text-forest-green mb-2">{t('contact_success_title')}</h2>
                  <button onClick={() => setSubmitted(false)} className="mt-4 text-green font-bold text-lg hover:underline">{t('contact_submit_again')}</button>
                </motion.div>
              ) : (
                <motion.div
                  key="form" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl p-6 md:p-12 border border-green-light/20"
                >
                  <h2 className="text-3xl font-extrabold text-forest-green mb-8">{t('contact_form_title')}</h2>
                  <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <InputField label={t('contact_firstname')} name="firstName" value={form.firstName} onChange={handleChange} placeholder={t('contact_firstname_placeholder')} required />
                      <InputField label={t('contact_lastname')} name="lastName" value={form.lastName} onChange={handleChange} placeholder={t('contact_lastname_placeholder')} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <InputField label={t('contact_phone')} name="phone" value={form.phone} onChange={handleChange} placeholder="08X-XXX-XXXX" type="tel" required />
                      <InputField label={t('contact_email')} name="email" value={form.email} onChange={handleChange} placeholder="example@email.com" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xl md:text-xl font-bold text-deep-text ml-1 uppercase">{t('contact_detail')}</label>
                      <textarea
                        name="detail" value={form.detail} onChange={handleChange}
                        className="w-full bg-surface-2 border border-green-light/30 rounded-xl px-4 py-3 focus:outline-none focus:border-green text-lg min-h-[140px]"
                        placeholder={t('contact_detail_placeholder')} required
                      />
                    </div>
                    <button type="submit" className="w-full bg-green hover:bg-forest-green text-white font-bold text-2xl py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                      {t('contact_submit')} <Send size={20} />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${fullWidthClass} bg-forest-green py-10 text-center border-t-4 border-gold text-white/60 text-lg md:text-2xl`}>
        <p className="px-6 italic">© 2026 Institute of Sufficiency Economy. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Components
const ContactInfoItem = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">{icon}</div>
    <div>
      <h3 className="font-bold text-green-light text-2xl md:text-2xl uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-white/90 text-xl md:text-xl">{desc}</p>
    </div>
  </div>
);

const SocialBtn = ({ icon }) => (
  <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-forest-green transition-all">{icon}</button>
);

const InputField = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-xl md:text-xl font-bold text-deep-text ml-1 uppercase">{label}</label>
    <input className="w-full bg-surface-2 border border-green-light/30 rounded-xl px-4 py-3 focus:outline-none focus:border-green text-lg" {...props} />
  </div>
);

export default InstitutePage;