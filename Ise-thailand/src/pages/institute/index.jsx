import { useState } from 'react'

export default function InstitutePage() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        detail: '',
    })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = () => {
        // TODO: เชื่อม API ส่งข้อมูลจริง
        console.log(form)
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-yellow-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-10 shadow text-center">
                    <svg className="w-14 h-14 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-lg font-semibold text-stone-700 mb-2">ส่งข้อมูลเรียบร้อยแล้ว</h2>
                    <p className="text-sm text-stone-400">เราจะติดต่อกลับโดยเร็วที่สุด</p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="mt-6 px-6 py-2 text-sm bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                    >
                        ส่งข้อมูลใหม่
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-yellow-50 flex items-center justify-center py-12 px-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-2xl p-10">
                <h1 className="text-xl font-semibold text-stone-700 text-center mb-8">ติดต่อสถาบัน</h1>

                {/* ชื่อ - นามสกุล */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm text-stone-600 mb-1 block">ชื่อ :</label>
                        <input
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="ชื่อ"
                            className="w-full px-4 py-2 rounded-full border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-stone-600 mb-1 block">นามสกุล :</label>
                        <input
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            placeholder="นามสกุล"
                            className="w-full px-4 py-2 rounded-full border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                    </div>
                </div>

                {/* อีเมล */}
                <div className="mb-4">
                    <label className="text-sm text-stone-600 mb-1 block">อีเมล :</label>
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="อีเมล"
                        type="email"
                        className="w-full px-4 py-2 rounded-full border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>

                {/* เบอร์โทร */}
                <div className="mb-4">
                    <label className="text-sm text-stone-600 mb-1 block">เบอร์โทรติดต่อ :</label>
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="เบอร์โทรติดต่อ"
                        type="tel"
                        className="w-full px-4 py-2 rounded-full border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>

                {/* รายละเอียด */}
                <div className="mb-8">
                    <label className="text-sm text-stone-600 mb-1 block">รายละเอียด :</label>
                    <textarea
                        name="detail"
                        value={form.detail}
                        onChange={handleChange}
                        placeholder="รายละเอียด"
                        rows={6}
                        className="w-full px-4 py-3 rounded-2xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    />
                </div>

                {/* Submit */}
                <div className="flex justify-center">
                    <button
                        onClick={handleSubmit}
                        className="px-10 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-full transition-colors duration-200 shadow"
                    >
                        ส่งข้อมูล
                    </button>
                </div>
            </div>
        </div>
    )
}