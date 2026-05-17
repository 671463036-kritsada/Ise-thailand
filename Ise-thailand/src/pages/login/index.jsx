import { useState } from 'react'
import { FaGoogle, FaFacebook } from 'react-icons/fa'

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [loginForm, setLoginForm] = useState({ email: '', password: '' })
    const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' })

    const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value })
    const handleRegisterChange = (e) => setRegisterForm({ ...registerForm, [e.target.name]: e.target.value })

    const handleLogin = () => console.log('Login:', loginForm)
    const handleRegister = () => console.log('Register:', registerForm)

    return (
        <>
            <style>{`
                /* ── FLIP CARD (mobile only) ── */
                @media (max-width: 767px) {
                    .flip-wrapper {
                        perspective: 1200px;
                    }
                    .flip-inner {
                        position: relative;
                        width: 100%;
                        transition: transform 0.7s cubic-bezier(.6,.2,.3,1);
                        transform-style: preserve-3d;
                    }
                    .flip-inner.flipped {
                        transform: rotateY(180deg);
                    }
                    .flip-front,
                    .flip-back {
                        backface-visibility: hidden;
                        -webkit-backface-visibility: hidden;
                    }
                    .flip-back {
                        position: absolute;
                        inset: 0;
                        transform: rotateY(180deg);
                    }
                }
            `}</style>

            <div
                className="font-['Nunito']"
                style={{
                    position: 'fixed',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    overflow: 'hidden',
                }}
            >
                {/* Blur + color overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backdropFilter: 'blur(3px)',
                    WebkitBackdropFilter: 'blur(3px)',
                    background: 'linear-gradient(to bottom, rgba(55,68,50,0.55) 0%, rgba(85,98,75,0.35) 50%, rgba(140,150,120,0.25) 100%)',
                    zIndex: 0,
                }} />

                {/* ════════════════════════════════
                    DESKTOP  (≥ md) – original sliding overlay
                    ════════════════════════════════ */}
                <div className="hidden md:block auth-card relative w-[820px] min-h-[520px] rounded-[30px] overflow-hidden bg-white shadow-[0_24px_64px_rgba(64,78,59,0.15)]" style={{ position: 'relative', zIndex: 1 }}>

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
                            <button className="text-[0.8rem] text-muted-text my-4 hover:text-green transition-colors">Forgot Your Password?</button>
                            <button className="w-full py-3 bg-green text-white rounded-sm text-sm font-bold tracking-widest hover:bg-forest-green active:scale-95 transition-all" onClick={handleLogin}>
                                SIGN IN
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
                            <button className="w-full py-3 bg-green text-white rounded-sm text-sm font-bold tracking-widest hover:bg-forest-green active:scale-95 transition-all mt-4" onClick={handleRegister}>
                                SIGN UP
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
                                onClick={() => setIsRegister(!isRegister)}
                            >
                                {isRegister ? 'SIGN UP' : 'SIGN IN'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════════
                    MOBILE  (< md) – flip card
                    ════════════════════════════════ */}
                <div className="md:hidden flip-wrapper w-full max-w-[400px]" style={{ position: 'relative', zIndex: 1 }}>
                    <div className={`flip-inner ${isRegister ? 'flipped' : ''}`} style={{ minHeight: 560 }}>

                        {/* FRONT – Sign In */}
                        <div className="flip-front w-full rounded-[30px] overflow-hidden bg-white shadow-[0_24px_64px_rgba(64,78,59,0.15)]">
                            <div className="bg-gradient-to-br from-forest-green to-[#2e3828] relative overflow-hidden px-8 pt-10 pb-8 text-center text-white">
                                <div className="absolute w-[160px] h-[160px] rounded-full bg-white/5 -top-12 -right-10" />
                                <div className="absolute w-[100px] h-[100px] rounded-full bg-white/5 -bottom-8 -left-8" />
                                <h3 className="relative text-2xl font-bold tracking-tight mb-1">Welcome Back!</h3>
                                <p className="relative text-sm text-white/75">Sign in to continue</p>
                            </div>

                            <div className="flex flex-col items-center px-8 py-7">
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
                                <button className="text-[0.8rem] text-muted-text my-4 hover:text-green transition-colors">Forgot Your Password?</button>
                                <button className="w-full py-3 bg-green text-white rounded-sm text-sm font-bold tracking-widest hover:bg-forest-green active:scale-95 transition-all" onClick={handleLogin}>
                                    SIGN IN
                                </button>
                                <p className="text-xs text-muted-text mt-5">
                                    Don't have an account?{' '}
                                    <button className="text-green font-bold hover:underline" onClick={() => setIsRegister(true)}>
                                        Sign Up
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* BACK – Sign Up */}
                        <div className="flip-back w-full rounded-[30px] overflow-hidden bg-white shadow-[0_24px_64px_rgba(64,78,59,0.15)]">
                            <div className="bg-gradient-to-br from-forest-green to-[#2e3828] relative overflow-hidden px-8 pt-10 pb-8 text-center text-white">
                                <div className="absolute w-[160px] h-[160px] rounded-full bg-white/5 -top-12 -right-10" />
                                <div className="absolute w-[100px] h-[100px] rounded-full bg-white/5 -bottom-8 -left-8" />
                                <h3 className="relative text-2xl font-bold tracking-tight mb-1">Hello, Friend!</h3>
                                <p className="relative text-sm text-white/75">Create your account</p>
                            </div>

                            <div className="flex flex-col items-center px-8 py-7">
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
                                <button className="w-full py-3 bg-green text-white rounded-sm text-sm font-bold tracking-widest hover:bg-forest-green active:scale-95 transition-all mt-5" onClick={handleRegister}>
                                    SIGN UP
                                </button>
                                <p className="text-xs text-muted-text mt-5">
                                    Already have an account?{' '}
                                    <button className="text-green font-bold hover:underline" onClick={() => setIsRegister(false)}>
                                        Sign In
                                    </button>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

// ── Reusable Components ──
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

// ── Icons ──
const GoogleIcon = () => <FaGoogle size={18} color="#EA4335" />
const FacebookIcon = () => <FaFacebook size={18} color="white" />
const EyeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
const EyeOffIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>