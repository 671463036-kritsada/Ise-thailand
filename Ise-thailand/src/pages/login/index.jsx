import { useState, useEffect } from 'react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useTranslation } from 'react-i18next'

const STEPS_KEYS = ['register_step_1', 'register_step_2', 'register_step_3', 'register_step_4']

const initialRegister = {
    t_code: '', researcher_name: '', researcher_surname: '',
    researcher_name_eng: '', researcher_surname_eng: '',
    institute_id: '', email: '', telno: '', addno: '',
    zip_code: '', id_card: '', province_id: '', amphure_id: '',
    district_id: '', username: '', password: ''
}

export default function LoginPage() {
    const { t } = useTranslation()
    const [isRegister, setIsRegister] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [loginForm, setLoginForm] = useState({ email: '', password: '' })
    const [registerForm, setRegisterForm] = useState(initialRegister)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(0)

    const [titles, setTitles] = useState([])
    const [institutes, setInstitutes] = useState([])
    const [provinces, setProvinces] = useState([])
    const [amphures, setAmphures] = useState([])
    const [districts, setDistricts] = useState([])
    const [instituteSearch, setInstituteSearch] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        api.get('/location/titles').then(res => setTitles(res.data.data || []))
        api.get('/location/institutes').then(res => setInstitutes(res.data.data || []))
        api.get('/location/provinces').then(res => setProvinces(res.data.data || []))
    }, [])

    useEffect(() => {
        if (registerForm.province_id) {
            setAmphures([])
            setDistricts([])
            setRegisterForm(f => ({ ...f, amphure_id: '', district_id: '' }))
            api.get(`/location/amphures/${registerForm.province_id}`)
                .then(res => setAmphures(res.data.data || []))
        }
    }, [registerForm.province_id])

    useEffect(() => {
        if (registerForm.amphure_id) {
            setDistricts([])
            setRegisterForm(f => ({ ...f, district_id: '' }))
            api.get(`/location/districts/${registerForm.amphure_id}`)
                .then(res => setDistricts(res.data.data || []))
        }
    }, [registerForm.amphure_id])

    useEffect(() => {
        if (isRegister) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [isRegister])

    const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
    const handleRegisterChange = (e) => setRegisterForm({ ...registerForm, [e.target.name]: e.target.value })

    const handleLogin = async () => {
        try {
            setLoading(true)
            setError('')
            const res = await api.post('/auth/login', loginForm)
            const token = res.data.token
            localStorage.setItem('token', token)
            const user = jwtDecode(token)
            if (user.role === 1) navigate('/admin')
            else navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async () => {
        try {
            setLoading(true)
            setError('')
            await api.post('/auth/register', registerForm)
            setIsRegister(false)
            setStep(0)
            setRegisterForm(initialRegister)
        } catch (err) {
            setError(err.response?.data?.message || 'Register failed')
        } finally {
            setLoading(false)
        }
    }

    const closeModal = () => {
        setIsRegister(false)
        setStep(0)
        setError('')
        setRegisterForm(initialRegister)
    }

    const filteredInstitutes = institutes.filter(i => {
        const nameThai = i.institute_name?.toLowerCase() || "";
        const nameEng = i.institute_name_eng?.toLowerCase() || "";
        const search = instituteSearch.toLowerCase();

        //พิมพ์ค้นหาได้ทั้งชื่อไทยและชื่ออังกฤษ
        return nameThai.includes(search) || nameEng.includes(search);
    });

    return (
        <>
            {/* ─── LOGIN PAGE ─── */}
            <div className="min-h-screen flex items-center justify-center bg-[#f0f3ee] p-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green/5" />
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-forest-green/5" />
                </div>

                <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(64,78,59,0.15)] p-10">
                    {/* Logo / Brand */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-green to-green flex items-center justify-center mb-3 shadow-lg">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-extrabold text-forest-green tracking-tight">{t('login_brand')}</h1>
                        <p className="text-xs text-muted-text mt-1">{t('login_brand_subtitle')}</p>
                    </div>

                    {/* Social Login */}
                    <div className="flex gap-3 mb-5">
                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all">
                            <GoogleIcon /> {t('login_google')}
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1877F2] text-xs font-semibold text-white hover:bg-[#166FE5] transition-all">
                            <FacebookIcon /> {t('login_facebook')}
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-xs text-muted-text">{t('login_or_email')}</span>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* Form */}
                    <div className="space-y-3">
                        <InputField
                            name="email" value={loginForm.email}
                            onChange={handleLoginChange} placeholder="Email"
                            icon={<MailIcon />}
                        />
                        <div className="relative">
                            <InputField
                                name="password" value={loginForm.password}
                                onChange={handleLoginChange} placeholder="Password"
                                type={showPassword ? 'text' : 'password'}
                                icon={<LockIcon />}
                                className="pr-10"
                            />
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text hover:text-green transition-colors"
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-xs text-center mt-3">{error}</p>}

                    <div className="flex justify-end mt-2 mb-5">
                        <button className="text-xs text-green hover:underline">{t('login_forgot_password')}</button>
                    </div>

                    <button
                        onClick={handleLogin} disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-forest-green to-green text-white rounded-xl text-sm font-bold tracking-widest hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_4px_15px_rgba(64,78,59,0.3)]">
                        {loading ? t('login_loading') : t('login_submit')}
                    </button>

                    <p className="text-center text-xs text-muted-text mt-6">
                        {t('login_no_account')}{' '}
                        <button
                            onClick={() => setIsRegister(true)}
                            className="text-green font-bold hover:underline">
                            {t('login_register')}
                        </button>
                    </p>
                </div>
            </div>

            {/* ─── REGISTER MODAL ─── */}
            {isRegister && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />

                    <div className="relative m-auto w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                        style={{ animation: 'fadeUp 0.3s ease' }}>

                        {/* Header */}
                        <div className="bg-gradient-to-r from-forest-green to-green px-8 pt-8 pb-6 text-white">
                            <button
                                onClick={closeModal}
                                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all text-white">
                                ✕
                            </button>
                            <h2 className="text-2xl font-extrabold tracking-tight mb-1">{t('register_title')}</h2>
                            <p className="text-white/70 text-sm">{t('register_subtitle')}</p>

                            {/* Step Indicator */}
                            <div className="flex items-center mt-6">
                                {STEPS_KEYS.map((key, i) => (
                                    <div key={i} className="flex items-center flex-1 last:flex-none">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                                                ${i === step
                                                    ? 'bg-white text-forest-green border-white shadow-lg scale-110'
                                                    : i < step
                                                        ? 'bg-white/30 text-white border-white/30'
                                                        : 'bg-transparent text-white/50 border-white/30'}`}>
                                                {i < step ? '✓' : i + 1}
                                            </div>
                                            <span className={`text-[10px] mt-1 font-semibold whitespace-nowrap
                                                ${i === step ? 'text-white' : 'text-white/50'}`}>
                                                {t(key)}
                                            </span>
                                        </div>
                                        {i < STEPS_KEYS.length - 1 && (
                                            <div className={`flex-1 h-0.5 mb-4 mx-1 transition-all ${i < step ? 'bg-white/60' : 'bg-white/20'}`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-8 py-6 max-h-[55vh] overflow-y-auto">

                            {/* Step 0 */}
                            {step === 0 && (
                                <div className="space-y-3">
                                    <label className="block text-xs font-semibold text-forest-green mb-1">{t('register_title_prefix')}</label>
                                    <SelectField name="t_code" value={registerForm.t_code} onChange={handleRegisterChange}>
                                        <option value="">{t('register_title_prefix_placeholder')}</option>
                                        {titles.map(t => <option key={t.t_code} value={t.t_code}>{t.t_name}</option>)}
                                    </SelectField>

                                    <label className="block text-xs font-semibold text-forest-green mb-1 mt-3">{t('register_name_thai')}</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <InputField name="researcher_name" value={registerForm.researcher_name}
                                            onChange={handleRegisterChange} placeholder={t('register_firstname_placeholder')} />
                                        <InputField name="researcher_surname" value={registerForm.researcher_surname}
                                            onChange={handleRegisterChange} placeholder={t('register_lastname_placeholder')} />
                                    </div>

                                    <label className="block text-xs font-semibold text-forest-green mb-1 mt-3">{t('register_name_eng')}</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <InputField name="researcher_name_eng" value={registerForm.researcher_name_eng}
                                            onChange={handleRegisterChange} placeholder="First Name" />
                                        <InputField name="researcher_surname_eng" value={registerForm.researcher_surname_eng}
                                            onChange={handleRegisterChange} placeholder="Last Name" />
                                    </div>

                                    <label className="block text-xs font-semibold text-forest-green mb-1 mt-3">{t('register_institute')}</label>
                                    <InputField
                                        placeholder={t('register_institute_search')}
                                        value={instituteSearch}
                                        onChange={e => setInstituteSearch(e.target.value)}
                                    />
                                    <select
                                        name="institute_id"
                                        value={registerForm.institute_id}
                                        onChange={handleRegisterChange}
                                        size={4}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-forest-green outline-none focus:border-green transition-all"
                                    >
                                        <option value="">{t('register_institute_placeholder')}</option>
                                        {filteredInstitutes.map(i => (
                                            <option key={i.institute_id} value={i.institute_id}>
                                                {i.institute_name} {i.institute_name_eng ? `(${i.institute_name_eng})` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Step 1 */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-forest-green mb-1">{t('register_email')}</label>
                                        <InputField name="email" value={registerForm.email}
                                            onChange={handleRegisterChange} placeholder="example@email.com" type="email"
                                            icon={<MailIcon />} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-forest-green mb-1">{t('register_phone')}</label>
                                        <InputField name="telno" value={registerForm.telno}
                                            onChange={handleRegisterChange} placeholder="0xx-xxx-xxxx"
                                            icon={<PhoneIcon />} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-forest-green mb-1">{t('register_id_card')}</label>
                                        <InputField name="id_card" value={registerForm.id_card}
                                            onChange={handleRegisterChange} placeholder="x-xxxx-xxxxx-xx-x"
                                            icon={<CardIcon />} />
                                    </div>
                                </div>
                            )}

                            {/* Step 2 */}
                            {step === 2 && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-forest-green mb-1">{t('register_address')}</label>
                                        <InputField name="addno" value={registerForm.addno}
                                            onChange={handleRegisterChange} placeholder={t('register_address_placeholder')} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-forest-green mb-1">{t('register_zipcode')}</label>
                                        <InputField name="zip_code" value={registerForm.zip_code}
                                            onChange={handleRegisterChange} placeholder="xxxxx" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-forest-green mb-1">{t('register_province')}</label>
                                            <SelectField name="province_id" value={registerForm.province_id} onChange={handleRegisterChange}>
                                                <option value="">{t('register_province_placeholder')}</option>
                                                {provinces.map(p => <option key={p.province_id} value={p.province_id}>{p.name_th} {p.name_en ? `(${p.name_en})` : ""} </option>)}
                                            </SelectField>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-forest-green mb-1">{t('register_amphure')}</label>
                                            <SelectField name="amphure_id" value={registerForm.amphure_id} onChange={handleRegisterChange}>
                                                <option value="">{t('register_amphure_placeholder')}</option>
                                                {amphures.map(a => <option key={a.amphure_id} value={a.amphure_id}>{a.name_th} {a.name_en ? `(${a.name_en})` : ""}</option>)}
                                            </SelectField>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-forest-green mb-1">{t('register_district')}</label>
                                            <SelectField name="district_id" value={registerForm.district_id} onChange={handleRegisterChange}>
                                                <option value="">{t('register_district_placeholder')}</option>
                                                {districts.map(d => <option key={d.district_id} value={d.district_id}>{d.name_th} {d.name_en ? `(${d.name_en})` : ""}</option>)}
                                            </SelectField>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3 */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-forest-green mb-1">{t('register_username')}</label>
                                        <InputField name="username" value={registerForm.username}
                                            onChange={handleRegisterChange} placeholder={t('register_username_placeholder')}
                                            icon={<UserIcon />} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-forest-green mb-1">{t('register_password')}</label>
                                        <InputField name="password" value={registerForm.password}
                                            onChange={handleRegisterChange} placeholder={t('register_password_placeholder')}
                                            type="password" icon={<LockIcon />} />
                                    </div>
                                    <div className="bg-green/5 rounded-xl p-4 text-xs text-muted-text leading-relaxed">
                                        <p className="font-semibold text-forest-green mb-1">{t('register_password_rules_title')}</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>{t('register_password_rule_1')}</li>
                                            <li>{t('register_password_rule_2')}</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {error && <p className="text-red-500 text-xs text-center mt-3">{error}</p>}
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-xs text-muted-text">
                                {t('register_step_label')} {step + 1} {t('register_step_of')} {STEPS_KEYS.length}
                            </p>
                            <div className="flex gap-3">
                                {step > 0 && (
                                    <button onClick={() => setStep(s => s - 1)}
                                        className="px-5 py-2.5 border border-green text-green rounded-xl text-sm font-bold hover:bg-green/5 transition-all">
                                        {t('register_back')}
                                    </button>
                                )}
                                {step < STEPS_KEYS.length - 1 ? (
                                    <button onClick={() => setStep(s => s + 1)}
                                        className="px-6 py-2.5 bg-gradient-to-r from-forest-green to-green text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-[0_4px_12px_rgba(64,78,59,0.25)]">
                                        {t('register_next')}
                                    </button>
                                ) : (
                                    <button onClick={handleRegister} disabled={loading}
                                        className="px-6 py-2.5 bg-gradient-to-r from-forest-green to-green text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-[0_4px_12px_rgba(64,78,59,0.25)]">
                                        {loading ? t('register_loading') : t('register_submit')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </>
    )
}

const SelectField = ({ name, value, onChange, children }) => (
    <select name={name} value={value} onChange={onChange}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-forest-green outline-none focus:border-green focus:ring-2 focus:ring-green/15 transition-all">
        {children}
    </select>
)

const InputField = ({ className = '', icon, ...props }) => (
    <div className="relative">
        {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text">
                {icon}
            </span>
        )}
        <input
            className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-forest-green outline-none focus:border-green focus:ring-2 focus:ring-green/15 focus:bg-white transition-all placeholder:text-muted-text ${icon ? 'pl-9' : ''} ${className}`}
            {...props}
        />
    </div>
)

const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 3.1 29.5 1 24 1 14.9 1 7.2 6.4 3.8 14l7 5.4C12.5 13.3 17.8 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4c4.1-3.8 6.5-9.4 6.5-16.2z" />
        <path fill="#FBBC05" d="M10.8 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7-5.4A23 23 0 0 0 1 24c0 3.7.9 7.2 2.5 10.3l7.3-5.7z" />
        <path fill="#34A853" d="M24 47c5.5 0 10.1-1.8 13.5-4.9l-7-5.4c-1.8 1.2-4.1 2-6.5 2-6.2 0-11.5-3.8-13.2-9.1l-7.3 5.7C7.2 41.6 14.9 47 24 47z" />
    </svg>
)
const FacebookIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" /></svg>
const EyeIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
const EyeOffIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
const MailIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
const LockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
const PhoneIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
const CardIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>