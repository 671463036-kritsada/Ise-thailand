import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Boxes, Folder, BarChart3, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from '../../hook/useAuth'
import api from '../../api/axios'
import Swal from 'sweetalert2'

export default function Sidebar({ open }) {
  const location = useLocation()
  const navigator = useNavigate()
  const { user } = useAuth()
  const [assetTypes, setAssetTypes] = useState([])
  const [activityTypes, setActivityTypes] = useState([])
  const [openDropdown, setOpenDropdown] = useState("")

  useEffect(() => {
    api.get('/asset/count')
      .then(res => setAssetTypes(res.data.data || []))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    api.get('/activity/count')
      .then(res => setActivityTypes(res.data.data || []))
      .catch(err => console.error(err))
  }, [])

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
        ...assetTypes.map(type => ({
          label: `${type.assettype_name} (${type.total})`,
          href: `/admin/asset/${type.assettype_id}`
        })),
        ...activityTypes.map(type => ({
          label: `${type.typeact_name} (${type.total})`,
          href: `/admin/activity/${type.typeact_id}`
        })),
        { label: "นักวิจัย", href: "/admin/researchers" },
        { label: "แผน", href: "/admin/plans" },
        { label: "แผนย่อย", href: "/admin/sub-plans" },
        { label: "จัดการวีดีโอหน้าแรก", href: "/admin/video-landing" },
        { label: 'ตรวจสอบรูปภาพ Royal', href: '/admin/royal-images-check' }
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

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some(child => location.pathname === child.href);
        if (isChildActive) setOpenDropdown(item.label);
      }
    });
  }, [location.pathname]);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? "" : label);
  };

  return (
    <aside className={`${open ? "w-64" : "w-20"} transition-all duration-300 bg-white border-r border-[var(--color-border)] flex flex-col shrink-0 shadow-sm z-20 font-sans antialiased text-[var(--color-deep-text)] h-screen justify-between`}>
      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--color-blue)]/30 bg-[var(--color-forest-blue)]">
          <img width={40} src="../../logo.jpg" alt="IMG" width={60} height={60} />
          {open && (
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight leading-tight">ระบบสารสนเทศ</h2>
              <p className="text-[9px] text-white/60 font-bold tracking-wider uppercase leading-tight">สถาบันเศรษฐกิจพอเพียง</p>
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
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-bold transition-all duration-150 group cursor-pointer
                        ${isChildActive
                          ? "bg-[var(--color-surface-2)] text-[var(--color-blue)] shadow-sm"
                          : "text-[var(--color-muted-text)] hover:bg-[var(--color-surface)]/40 hover:text-[var(--color-deep-text)]"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent className={`w-4 h-4 shrink-0 transition-colors ${isChildActive ? "text-[var(--color-blue)]" : "text-[var(--color-muted-text)] group-hover:text-[var(--color-deep-text)]"}`} />
                        {open && <span>{item.label}</span>}
                      </div>
                      {open && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-[var(--color-muted-text)] ${isDropdownOpen ? "rotate-180" : ""}`} />
                      )}
                    </button>

                    {isDropdownOpen && open && (
                      <ul className="mt-0.5 ml-4 border-l-2 border-[var(--color-surface-3)] pl-2 space-y-0.5 animate-in fade-in duration-150">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <NavLink
                              to={child.href}
                              className={({ isActive }) => `
                                block flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                                ${isActive
                                  ? "text-[var(--color-blue)] font-bold bg-[var(--color-surface-2)]"
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

              return (
                <li key={item.label}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => `
                      flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-150 group
                      ${isActive
                        ? "bg-[var(--color-surface-2)] text-[var(--color-blue)] shadow-sm"
                        : "text-[var(--color-muted-text)] hover:bg-[var(--color-surface)]/40 hover:text-[var(--color-deep-text)]"
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <IconComponent className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-[var(--color-blue)]" : "text-[var(--color-muted-text)] group-hover:text-[var(--color-deep-text)]"}`} />
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

      <div className="p-3 border-t border-[var(--color-surface-3)] bg-[var(--color-surface)]/10">
        <button
          onClick={async () => {
            const result = await Swal.fire({
              title: 'ออกจากระบบ?',
              text: 'คุณต้องการออกจากระบบใช่หรือไม่?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'ออกจากระบบ',
              cancelButtonText: 'ยกเลิก',
              confirmButtonColor: '#b85c4a',
              cancelButtonColor: 'var(--color-forest-blue)',
            })
            if (result.isConfirmed) {
              localStorage.removeItem('token')
              navigator('/login')
            }
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