import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const InstitutePage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', subject: 'เลือกหัวข้อการติดต่อ', detail: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contact', form);
      setSubmitted(true);
    } catch {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  };

  const fullWidthClass = 'relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen';

  return (
    <div>
      {/* Hero */}
      <section className={`${fullWidthClass} -mt-9 h-[360px] md:h-[440px] flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 z-0">
          <img
            alt="สถาบันเศรษฐกิจพอเพียง"
            className="w-full h-full object-cover brightness-50"
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-green/40 to-surface" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center px-4 max-w-3xl"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
            {t('contact_title')}
          </h1>
          <p className="text-base md:text-lg text-white/80 font-normal">
            {t('contact_subtitle')}
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 -mt-12 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-5 space-y-4">

            {/* Contact Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-forest-green p-7 md:p-9 rounded-2xl text-white shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -mr-12 -mt-12 pointer-events-none" />

              <h2 className="text-xl font-semibold mb-7 relative z-10">
                {t('contact_info')}
              </h2>

              <div className="space-y-5 relative z-10">
                <ContactInfoItem icon={<MapPin size={20} />} title={t('contact_address_title')} desc={t('contact_address_desc')} />
                <ContactInfoItem icon={<Phone size={20} />} title={t('contact_phone_title')} desc={t('contact_phone_desc')} />
                <ContactInfoItem icon={<Mail size={20} />} title={t('contact_email_title')} desc={t('contact_email_desc')} />
              </div>

              <div className="mt-8 pt-5 border-t border-white/10 relative z-10">
                <div className="flex gap-2">
                  <SocialBtn icon={<FaFacebookF size={15} />} />
                  <SocialBtn icon={<FaInstagram size={16} />} />
                  <SocialBtn icon={<FaYoutube size={16} />} />
                </div>
              </div>
            </motion.div>

            {/* Hours Card */}
            <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-surface-2 flex items-center justify-center text-green shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-deep-text text-base">{t('contact_hours_title')}</h3>
                <p className="text-sm text-muted-text mt-0.5">{t('contact_hours_desc')}</p>
              </div>
            </div>
          </div>

          {/* Right Column — Form */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl shadow-md p-8 md:p-12 border border-border text-center h-full flex flex-col justify-center items-center"
                >
                  <CheckCircle2 size={48} className="text-green mb-4" />
                  <h2 className="text-lg font-semibold text-forest-green mb-1">{t('contact_success_title')}</h2>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-green text-sm font-medium hover:underline"
                  >
                    {t('contact_submit_again')}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-md p-6 md:p-10 border border-border"
                >
                  <h2 className="text-xl font-semibold text-forest-green mb-6">
                    {t('contact_form_title')}
                  </h2>

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label={t('contact_firstname')} name="firstName" value={form.firstName} onChange={handleChange} placeholder={t('contact_firstname_placeholder')} required />
                      <InputField label={t('contact_lastname')} name="lastName" value={form.lastName} onChange={handleChange} placeholder={t('contact_lastname_placeholder')} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label={t('contact_phone')} name="phone" value={form.phone} onChange={handleChange} placeholder="08X-XXX-XXXX" type="tel" required />
                      <InputField label={t('contact_email')} name="email" value={form.email} onChange={handleChange} placeholder="example@email.com" type="email" required />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-deep-text ml-0.5">
                        {t('contact_detail')}
                      </label>
                      <textarea
                        name="detail"
                        value={form.detail}
                        onChange={handleChange}
                        className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-deep-text placeholder:text-placeholder focus:outline-none focus:border-border-focus transition-colors min-h-[130px] resize-none"
                        placeholder={t('contact_detail_placeholder')}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-green hover:bg-forest-green text-white font-semibold text-base py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      {t('contact_submit')} <Send size={16} />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
};

// Sub-components

const ContactInfoItem = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3">
    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-medium text-green-light text-sm uppercase tracking-wide mb-0.5">
        {title}
      </h3>
      <p className="text-white/85 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const SocialBtn = ({ icon }) => (
  <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-forest-green transition-all">
    {icon}
  </button>
);

const InputField = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-deep-text ml-0.5">
      {label}
    </label>
    <input
      className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-deep-text placeholder:text-placeholder focus:outline-none focus:border-border-focus transition-colors"
      {...props}
    />
  </div>
);

export default InstitutePage;