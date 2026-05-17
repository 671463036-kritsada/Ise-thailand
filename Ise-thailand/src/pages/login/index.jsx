import { useState } from 'react'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'

import { jwtDecode } from 'jwt-decode'


export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [loginForm, setLoginForm] = useState({ email: '', password: '' })
    const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
    const handleRegisterChange = (e) => setRegisterForm({ ...registerForm, [e.target.name]: e.target.value })

    const handleLogin = async () => {
        try {
            setLoading(true)
            setError('')
            const res = await api.post('/auth/login', loginForm)

            const token = res.data.token
            localStorage.setItem('token', token)

            // decode token เพื่อเช็ค role
            const user = jwtDecode(token)

            if (user.role === 1) {
                navigate('/admin')  // admin
            } else {
                navigate('/')       // user ทั่วไป
            }
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
        } catch (err) {
            setError(err.response?.data?.message || 'Register failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen flex items-center justify-center font-['Nunito'] p-4">
            <div className="auth-card relative w-[820px] min-h-[520px] rounded-[30px] overflow-hidden bg-white shadow-[0_24px_64px_rgba(64,78,59,0.15)]">

                {/* Forms Container */}
                <div className="absolute inset-0 flex">

                    {/* LEFT: Sign In */}
                    <div className="w-1/2 h-full flex flex-col items-center justify-center px-11 py-13 bg-white">
                        <h2 className="text-2xl font-bold text-forest-green mb-5 tracking-tight">Sign In</h2>

                        <div className="flex gap-2.5 mb-4">
                            <SocialButton title="Google" icon={<GoogleIcon />} />
                            <SocialButton title="Facebook" icon={<FacebookIcon />} className="bg-[#1877F2] border-[#1877F2]" />
                        </div>

                        <p className="text-xs text-muted-text mb-4">or use your email password</p>

                        <div className="w-full space-y-3">
                            <InputField name="email" value={loginForm.email} onChange={handleLoginChange} placeholder="Email" />
                            <div className="relative">
                                <InputField
                                    name="password"
                                    value={loginForm.password}
                                    onChange={handleLoginChange}
                                    placeholder="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="pr-10"
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-green" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        {error && !isRegister && (
                            <p className="text-red-500 text-xs text-center mt-2">{error}</p>
                        )}

                        <button className="text-[0.8rem] text-muted-text my-4 hover:text-green transition-colors">Forgot Your Password?</button>
                        <button
                            className="w-full py-3 bg-green text-white rounded-sm text-sm font-bold tracking-widest hover:bg-forest-green active:scale-95 transition-all disabled:opacity-50"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading && !isRegister ? 'กำลังเข้าสู่ระบบ...' : 'SIGN IN'}
                        </button>
                    </div>

                    {/* RIGHT: Sign Up */}
                    <div className="w-1/2 h-full flex flex-col items-center justify-center px-11 py-13 bg-white">
                        <h2 className="text-2xl font-bold text-forest-green mb-5 tracking-tight">Create Account</h2>

                        <div className="flex gap-2.5 mb-4">
                            <SocialButton title="Google" icon={<GoogleIcon />} />
                            <SocialButton title="Facebook" icon={<FacebookIcon />} className="bg-[#1877F2] border-[#1877F2]" />
                        </div>

                        <p className="text-xs text-muted-text mb-4">or use your email for registration</p>

                        <div className="w-full space-y-3">
                            <InputField name="name" value={registerForm.name} onChange={handleRegisterChange} placeholder="Full Name" />
                            <InputField name="email" value={registerForm.email} onChange={handleRegisterChange} placeholder="Email" />
                            <InputField name="password" value={registerForm.password} onChange={handleRegisterChange} placeholder="Password" type="password" />
                        </div>

                        {error && isRegister && (
                            <p className="text-red-500 text-xs text-center mt-2">{error}</p>
                        )}

                        <button
                            className="w-full py-3 bg-green text-white rounded-sm text-sm font-bold tracking-widest hover:bg-forest-green active:scale-95 transition-all mt-4 disabled:opacity-50"
                            onClick={handleRegister}
                            disabled={loading}
                        >
                            {loading && isRegister ? 'กำลังสมัคร...' : 'SIGN UP'}
                        </button>
                    </div>
                </div>

                {/* Sliding Overlay */}
                <div
                    className={`absolute top-0 w-1/2 h-full z-10 bg-gradient-to-br from-forest-green to-[#2e3828] flex flex-col items-center justify-center px-10 text-center text-white transition-all duration-700 ease-in-out overflow-hidden
                        ${isRegister ? 'left-0 rounded-r-[30px] rounded-l-[30px]' : 'left-1/2 rounded-l-[30px] rounded-r-[30px]'}`}
                >
                    <div className="absolute w-[220px] h-[220px] rounded-full bg-white/5 -top-20 -right-15" />
                    <div className="absolute w-[140px] h-[140px] rounded-full bg-white/5 -bottom-12 -left-10" />

                    <div className="relative z-1">
                        <h3 className="text-[1.6rem] font-bold mb-3.5 tracking-tight">
                            {isRegister ? 'Hello, Friend!' : 'Welcome Back!'}
                        </h3>
                        <p className="text-sm leading-relaxed text-white/80 mb-8">
                            {isRegister
                                ? 'Register with your personal details to use all of the site features.'
                                : 'Already have an account? Sign in to continue where you left off.'}
                        </p>
                        <button
                            className="px-10 py-2.5 border-2 border-gold text-gold rounded-sm text-[0.82rem] font-bold tracking-widest hover:bg-gold hover:text-forest-green transition-colors"
                            onClick={() => { setIsRegister(!isRegister); setError('') }}
                        >
                            {isRegister ? 'SIGN IN' : 'SIGN UP'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SocialButton = ({ icon, title, className = "" }) => (
    <button className={`w-11 h-11 rounded-sm border-1.5 border-green-light flex items-center justify-center hover:border-green hover:shadow-[0_2px_8px_rgba(123,150,105,0.2)] transition-all ${className}`} title={title}>
        {icon}
    </button>
)

const InputField = ({ className = "", ...props }) => (
    <input
        className={`w-full px-4 py-3 rounded-sm border-1.5 border-green-light bg-[#f7f9f6] text-sm text-forest-green outline-none focus:border-green focus:shadow-[0_0_0_3px_rgba(123,150,105,0.15)] focus:bg-white transition-all placeholder:text-muted-text ${className}`}
        {...props}
    />
)

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 3.1 29.5 1 24 1 14.9 1 7.2 6.4 3.8 14l7 5.4C12.5 13.3 17.8 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4c4.1-3.8 6.5-9.4 6.5-16.2z" />
        <path fill="#FBBC05" d="M10.8 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7-5.4A23 23 0 0 0 1 24c0 3.7.9 7.2 2.5 10.3l7.3-5.7z" />
        <path fill="#34A853" d="M24 47c5.5 0 10.1-1.8 13.5-4.9l-7-5.4c-1.8 1.2-4.1 2-6.5 2-6.2 0-11.5-3.8-13.2-9.1l-7.3 5.7C7.2 41.6 14.9 47 24 47z" />
    </svg>
)
const FacebookIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" /></svg>
const EyeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
const EyeOffIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>