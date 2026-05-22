// src/components/Footer.jsx
import { MapPin, Phone, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation()

    const navLinks = [
        { label: t('footer_nav_home'), href: '/' },
        { label: t('footer_nav_about'), href: '/institute' },
        { label: t('footer_nav_research'), href: '/research' },
        { label: t('footer_nav_news'), href: '#' },
    ]

    const policyLinks = [
        { label: t('footer_privacy'), href: '#' },
        { label: t('footer_terms'), href: '#' },
    ]

    return (
        <footer className="bg-forest-green text-white px-8 pt-12 pb-6">
            <div className="max-w-6xl mx-auto">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/15 mb-6">

                    {/* Brand */}
                    <div>
                        <h3 className="text-gold text-lg font-semibold mb-3">
                            {t('footer_brand')}
                        </h3>
                        <p className="text-green-light text-sm leading-relaxed whitespace-pre-line">
                            {t('footer_tagline')}
                        </p>
                    </div>

                    {/* Nav Links */}
                    <div>
                        <h4 className="text-gold text-xs font-semibold uppercase tracking-widest mb-4">
                            {t('footer_menu')}
                        </h4>
                        <ul className="space-y-2">
                            {navLinks.map((item) => (
                                <li key={item.label}>
                                    <a href={item.href}
                                        className="text-green-light text-sm hover:text-white transition-colors duration-200"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-gold text-xs font-semibold uppercase tracking-widest mb-4">
                            {t('footer_contact')}
                        </h4>
                        <address className="not-italic text-green-light text-sm leading-relaxed space-y-2">
                            <p className="flex items-center gap-2">
                                <MapPin size={15} className="shrink-0" />
                                {t('footer_address')}
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone size={15} className="shrink-0" />
                                {t('footer_phone')}
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail size={15} className="shrink-0" />
                                {t('footer_email')}
                            </p>
                        </address>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-wrap justify-between items-center gap-3">
                    <p className="text-green-light/60 text-xs">
                        {t('footer_copyright')}
                    </p>
                    <div className="flex gap-5">
                        {policyLinks.map((item) => (
                            <a key={item.label}
                                href={item.href}
                                className="text-green-light/60 text-xs hover:text-white transition-colors duration-200"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </footer>
    );
}