import { useState, useEffect, useRef } from "react"
import { X, Image } from "lucide-react"

import {UPLOADS_URL} from "../../constants/uploads_url.js"

export default function TypeProjectModal({ isOpen, onClose, onSave, editData }) {
  const [form, setForm] = useState({ type_name: '', type_name_eng: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (editData) {
      setForm({
        type_id: editData.type_id,
        type_name: editData.type_name || '',
        type_name_eng: editData.type_name_eng || '',
        type_image: editData.type_image || '',
      })
      setImagePreview(editData.type_image ? `${UPLOADS_URL}${editData.type_image}` : null)
    } else {
      setForm({ type_name: '', type_name_eng: '' })
      setImagePreview(null)
    }
    setImageFile(null)
  }, [editData, isOpen])

  if (!isOpen) return null

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = () => {
    const formData = new FormData()
    formData.append('type_name', form.type_name)
    formData.append('type_name_eng', form.type_name_eng || '')
    if (imageFile) {
      formData.append('type_image', imageFile)
    } else {
      formData.append('type_image', form.type_image || '')
    }
    if (form.type_id) formData.append('type_id', form.type_id)
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
          <h2 className="text-lg font-bold text-[var(--color-forest-green)]">
            {editData ? 'แก้ไขประเภทโครงการ' : 'เพิ่มประเภทโครงการ'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-3)] transition-colors cursor-pointer">
            <X className="w-5 h-5 text-[var(--color-muted-text)]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-sm font-semibold text-[var(--color-deep-text)] mb-1.5 block">
              ชื่อประเภท (ไทย) <span className="text-red-500">*</span>
            </label>
            <input name="type_name" value={form.type_name} onChange={handleChange}
              placeholder="เช่น โครงการพัฒนาด้านแหล่งน้ำ"
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] transition-all bg-[var(--color-surface)]/20" />
          </div>
          <div>
            <label className="text-sm font-semibold text-[var(--color-deep-text)] mb-1.5 block">
              ชื่อประเภท (อังกฤษ)
            </label>
            <input name="type_name_eng" value={form.type_name_eng} onChange={handleChange}
              placeholder="เช่น Water resource development project"
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:border-[var(--color-border-focus)] transition-all bg-[var(--color-surface)]/20" />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-semibold text-[var(--color-deep-text)] mb-1.5 block">
              รูปภาพ
            </label>
            {imagePreview ? (
              <div className="relative mb-2 rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-2)]" style={{ height: 140 }}>
                <img src={imagePreview} alt="preview" className="w-full h-full object-contain p-2" />
                <button
                  onClick={() => { setImagePreview(null); setImageFile(null); setForm(f => ({ ...f, type_image: '' })) }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600 cursor-pointer">
                  ✕
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 h-[140px] rounded-xl border-2 border-dashed border-[var(--color-green-light)] bg-[var(--color-surface-2)] cursor-pointer hover:border-[var(--color-green)] hover:bg-[var(--color-surface-3)] transition-all">
                <Image className="w-8 h-8 text-[var(--color-green-light)]" />
                <p className="text-sm font-semibold text-[var(--color-muted-text)]">คลิกเพื่อเลือกรูปภาพ</p>
                <p className="text-xs text-[var(--color-disabled)]">JPG, PNG, WEBP ขนาดไม่เกิน 5MB</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileChange} className="hidden" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]/10">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-[var(--color-border)] rounded-xl text-sm font-semibold text-[var(--color-muted-text)] hover:bg-[var(--color-surface-2)] transition-all cursor-pointer">
            ยกเลิก
          </button>
          <button onClick={handleSave} disabled={!form.type_name}
            className="flex-1 py-2.5 bg-[var(--color-green)] text-white rounded-xl text-sm font-bold hover:bg-[var(--color-forest-green)] transition-all disabled:opacity-50 cursor-pointer">
            {editData ? 'บันทึกการแก้ไข' : 'เพิ่มประเภทโครงการ'}
          </button>
        </div>
      </div>
    </div>
  )
}