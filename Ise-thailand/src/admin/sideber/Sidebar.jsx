import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Boxes, Folder, BarChart3, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from '../../hook/useAuth'  // เพิ่ม s
import api from '../../api/axios'

export default function Sidebar({ open }) {
  const location = useLocation()
  const navigator = useNavigate()
  const { user } = useAuth()
  const [assetTypes, setAssetTypes] = useState([])
  const [openDropdown, setOpenDropdown] = useState("")

  useEffect(() => {
    api.get('/asset/count')
      .then(res => setAssetTypes(res.data.data || []))
      .catch(err => console.error(err))
  }, [])

  // navItems เปลี่ยนมาเป็น function เพื่อรับ assetTypes
  const navItems = [
    { icon: LayoutDashboard, label: "ภาพรวม", href: "/admin/dashboard" },
    {
      icon: Boxes,
      label: "โครงการพระราชดำริ",
      children: [
        { label: "โครงการ", href: "/admin/royal_all" },
        { label: "ประเภทโครงการ", href: "/admin/type-project" },
        { label: "พื้นที่", href: "/admin/sector" },
      ]
    },
    {
      icon: Folder,
      label: "งานสถาบันเศรษฐกิจฯ",
      children: [
        { label: "โครงการ/งานวิจัย", href: "/admin/project_all" },
        // loop จาก API
        ...assetTypes.map(type => ({
          label: `${type.assettype_name} (${type.total})`,
          href: `/admin/asset/${type.assettype_id}`
        })),
        { label: "ข่าวประชาสัมพันธ์", href: "/admin/news" },
        { label: "กิจกรรม", href: "/admin/activities" },
        { label: "นักวิจัย", href: "/admin/researchers" },
        { label: "แผน", href: "/admin/plans" },
        { label: "แผนย่อย", href: "/admin/sub-plans" },
        { label: "จัดการวีดีโอหน้าแรก", href: "/admin/video-landing" },
      ]
    },
    {
      icon: BarChart3,
      label: "รายงาน",
      children: [
        { label: "เงื่อนไขตามประเภทโครงการ", href: "/admin/report-overview" },
        { label: "เงื่อนไขตามพื้นที่ภาค", href: "/admin/report-region" },
        { label: "เงื่อนไขตามจังหวัด", href: "/admin/report-province" },
      ]
    }
  ]

  // ส่วนที่เหลือเหมือนเดิมทุกอย่าง

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some(child => location.pathname === child.href);
        if (isChildActive) {
          setOpenDropdown(item.label);
        }
      }
    });
  }, [location.pathname]);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? "" : label);
  };

  return (
    <aside
      className={`${open ? "w-64" : "w-20"} transition-all duration-300 bg-white border-r border-[var(--color-border)] flex flex-col shrink-0 shadow-sm z-20 font-sans antialiased text-[var(--color-deep-text)] h-screen justify-between`}
    >
      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--color-surface-3)]">
          <img width={40} src="data:image/png;base64,iVBORw0KGgoAAA0KGgoAAA0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSPIIAAABIFBMVEXjAAv///8AAAD/7QDkAAvdAAv/8AD/8wD/+AD/7wD/9QD/9gD/+QDp6en09PTY2Njxlgf4wgWtra1vb2+YmJiioqJ5eXnv7+/Ozs7l5eVeXl44ODjBwcGDg4O0tLT0qAb5zATl1QAjIyPc3NxQUFCLi4tGRkaZmZnpWQnsAAv94gIUFBRAQEAyMjLWAArteAjyngfugQjoSwqekwDUxQD71QO3qgBwaAD2uQXv3gDmNwrwkAfpVQnqYgm9AAn1sAZiWwCNgwDZygAXFQCsoABKRQDJuwB+dQDsbgkxAAImAALEAAmTAAeGAAYSEQAsKQBzawBNSAA8OAAhHwDmPAp7AAYXAAGfAAhlAAVGAAT7AAyuAAhcAAQpJgAdHR1AOwDZrmFvAAARxklEQVR4nO1caVvbSBI2MtEJBpvLGBtjBwM24TC2uQm2QwyZZHJnJnPm//+Llfpud7XU7O48+4jV+yFPsEqtfruqq6pLrc5ZTx25/3UH/nH8fzA8fPZUcUgYPpt9qnjGGOaeJjKG6UfGram..." alt="IMG" />
          {open && (
            <div>
              <h2 className="text-sm font-extrabold text-[var(--color-forest-green)] tracking-tight leading-tight">ระบบสารสนเทศ</h2>
              <p className="text-[9px] text-[var(--color-muted-text)] font-bold tracking-wider uppercase leading-tight">สถาบันเศรษฐกิจพอเพียง</p>
            </div>
          )}
        </div>

        {/* Navigation Area */}
        <nav className="py-3 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
          {open && (
            <p className="px-4 pb-1 text-[11px] font-bold uppercase tracking-widest text-[var(--color-muted-text)]">
              Main Navigation
            </p>
          )}
          <ul className="space-y-0.5 px-2">
            {navItems.map((item) => {
              const hasChildren = !!item.children;
              const isChildActive = hasChildren && item.children.some(child => location.pathname === child.href);
              const isDropdownOpen = openDropdown === item.label;
              const IconComponent = item.icon;

              if (hasChildren) {
                return (
                  <li key={item.label} className="flex flex-col">
                    {/* ปุ่มเมนูหลักที่มีดร็อปดาวน์ย่อย - กระชับขนาดฟอนต์จาก text-xl เหลือ text-sm และปรับไอคอนเหลือ w-4 h-4 */}
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-bold transition-all duration-150 group cursor-pointer
                        ${isChildActive
                          ? "bg-[var(--color-surface-2)] text-[var(--color-green)] shadow-sm"
                          : "text-[var(--color-muted-text)] hover:bg-[var(--color-surface)]/40 hover:text-[var(--color-deep-text)]"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent className={`w-4 h-4 shrink-0 transition-colors ${isChildActive ? "text-[var(--color-green)]" : "text-[var(--color-muted-text)] group-hover:text-[var(--color-deep-text)]"}`} />
                        {open && <span>{item.label}</span>}
                      </div>
                      {open && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-[var(--color-muted-text)] ${isDropdownOpen ? "rotate-180" : ""}`} />
                      )}
                    </button>

                    {/* รายการเมนูลูกย่อย - กระชับขนาดตัวอักษรลงมาอยู่ที่ระดับ text-xs */}
                    {isDropdownOpen && open && (
                      <ul className="mt-0.5 ml-4 border-l-2 border-[var(--color-surface-3)] pl-2 space-y-0.5 animate-in fade-in duration-150">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <NavLink
                              to={child.href}
                              className={({ isActive }) => `
                                block flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                                ${isActive
                                  ? "text-[var(--color-green)] font-bold bg-[var(--color-surface-2)]"
                                  : "text-[var(--color-muted-text)] hover:text-[var(--color-deep-text)] hover:bg-[var(--color-surface)]/30"
                                }
                              `}
                            >
                              {child.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              // เมนูทั่วไปที่ไม่มีแถบย่อย (เช่น ภาพรวม) - ปรับขนาดเป็น text-sm นุ่มนวลพอดีแถว
              return (
                <li key={item.label}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => `
                      flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-150 group
                      ${isActive
                        ? "bg-[var(--color-surface-2)] text-[var(--color-green)] shadow-sm"
                        : "text-[var(--color-muted-text)] hover:bg-[var(--color-surface)]/40 hover:text-[var(--color-deep-text)]"
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <IconComponent className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[var(--color-green)]" : "text-[var(--color-muted-text)] group-hover:text-[var(--color-deep-text)]"}`} />
                        {open && <span>{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* User Footer - ปรับความกว้างและไอคอนเป็น w-3.5 h-3.5 และฟอนต์เป็น text-xs ให้บาลานซ์กันอย่างเรียบร้อย */}
      <div className="p-3 border-t border-[var(--color-surface-3)] bg-[var(--color-surface)]/10">
        {open && user && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-xl bg-[var(--color-surface-2)]">
            <div style={{
              width: 28, height: 28,
              borderRadius: '50%',
              backgroundColor: 'var(--color-forest-green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, color: 'white',
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-deep-text)]">{user.name}</p>
              <p className="text-[10px] text-[var(--color-muted-text)]">Administrator</p>
            </div>
          </div>
        )}
        <button
          onClick={() => {
            localStorage.removeItem('token')
            navigator("/login")
          }}
          className={`flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all duration-200 group font-bold text-xs cursor-pointer
                ${open ? "w-full px-3 py-2 gap-2 shadow-sm shadow-rose-100" : "w-8 h-8"}`}
        >
          <LogOut className="w-3.5 h-3.5 shrink-0 group-hover:scale-105 transition-transform" />
          {open && <span>ออกจากระบบ</span>}
        </button>
      </div>
    </aside>
  );
}