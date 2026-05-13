import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
    const [form, setForm] = useState({ username: '', password: '' })
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleLogin = () => {
        // TODO: เชื่อม API login จริง
        console.log(form)
    }

    const handleRegister = () => {
        navigate('/register') // หรือ route ที่ต้องการ
    }

    return (
        <div className="min-h-screen bg-[#eef0f8] flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-md px-10 py-10">

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <img src="/image/logo.png" alt="logo" className="w-24 h-24 object-contain mb-2" />
                    <p className="text-sm text-stone-500 text-center">ระบบบริหารจัดการคลังข้อมูลสถาบันเศรษฐกิจพอเพียง</p>
                </div>

                {/* Username */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-stone-700 mb-1 block">ชื่อผู้ใช้งาน</label>
                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="ชื่อผู้ใช้งาน"
                        className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-stone-700 mb-1 block">รหัสผ่าน</label>
                    <input
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="รหัสผ่าน"
                        type="password"
                        className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Buttons */}
                <button
                    onClick={handleLogin}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 mb-3"
                >
                    เข้าสู่ระบบ
                </button>
                <button
                    onClick={handleRegister}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                    สร้างบัญชีผู้ใช้
                </button>

            </div>
        </div>
    )
}