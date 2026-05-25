import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Boxes, 
  Folder, 
  BarChart3, 
  LogOut, 
  ChevronDown,
  FileText,
  BookOpen,
  GraduationCap,
  Sparkles,
  Video,
  Newspaper,
  Calendar,
  Users,
  Layers
} from "lucide-react";
import { useAuth } from '../../hook/useAuth';
import api from '../../api/axios';
import Swal from 'sweetalert2';

export default function Sidebar({ open }) {
  const location = useLocation();
  const navigator = useNavigate();
  const { user } = useAuth();
  const [assetTypes, setAssetTypes] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [openDropdown, setOpenDropdown] = useState("");

  useEffect(() => {
    api.get('/asset/count')
      .then(res => setAssetTypes(res.data.data || []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    api.get('/activity/count')
      .then(res => setActivityTypes(res.data.data || []))
      .catch(err => console.error(err));
  }, []);

  // ฟังก์ชันช่วยเลือกไอคอนย่อยตามคีย์เวิร์ด เพื่อให้เมนูจาก API มีไอคอนแสดงสวยงาม
  const getSubIcon = (label) => {
    const text = label.toLowerCase();
    if (text.includes("ebook")) return BookOpen;
    if (text.includes("วิชาการ")) return GraduationCap;
    if (text.includes("นวัตกรรม")) return Sparkles;
    if (text.includes("วีดีทัศน์") || text.includes("วิดีโอ")) return Video;
    if (text.includes("ข่าว")) return Newspaper;
    if (text.includes("กิจกรรม")) return Calendar;
    return FileText; // Default icon
  };

  const navItems = [
    { icon: LayoutDashboard, label: "ภาพรวม", href: "/admin/dashboard" },
    {
      icon: Boxes,
      label: "โครงการพระราชดำริ",
      children: [
        { label: "โครงการ", href: "/admin/royal_all", icon: Layers },
        { label: "ประเภทโครงการ", href: "/admin/type-project", icon: Layers },
        { label: "พื้นที่", href: "/admin/sector", icon: Layers },
      ]
    },
    {
      icon: Folder,
      label: "งานสถาบันเศรษฐกิจฯ",
      children: [
        { label: "โครงการ/งานวิจัย", href: "/admin/project_all", icon: FileText },
        ...assetTypes.map(type => ({
          label: `${type.assettype_name} (${type.total})`,
          href: `/admin/asset/${type.assettype_id}`,
          icon: getSubIcon(type.assettype_name)
        })),
        ...activityTypes.map(type => ({
          label: `${type.typeact_name} (${type.total})`,
          href: `/admin/activity/${type.typeact_id}`,
          icon: getSubIcon(type.typeact_name)
        })),
        { label: "นักวิจัย", href: "/admin/researchers", icon: Users },
        { label: "แผน", href: "/admin/plans", icon: Layers },
        { label: "แผนย่อย", href: "/admin/sub-plans", icon: Layers },
        { label: "จัดการวีดีโอหน้าแรก", href: "/admin/video-landing", icon: Video },
      ]
    },
    {
      icon: BarChart3,
      label: "รายงาน",
      children: [
        { label: "เงื่อนไขตามประเภทโครงการ", href: "/admin/report-overview", icon: FileText },
        { label: "เงื่อนไขตามพื้นที่ภาค", href: "/admin/report-region", icon: FileText },
        { label: "เงื่อนไขตามจังหวัด", href: "/admin/report-province", icon: FileText },
      ]
    }
  ];

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
      className={`${open ? "w-64" : "w-20"} transition-all duration-300 bg-white border-r border-[var(--color-border)] flex flex-col shrink-0 shadow-sm z-20 font-sans antialiased text-[var(--color-deep-text)] h-full justify-between`}
    >
      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--color-border)] bg-[var(--color-green)]">
  <img width={40} src="../../logo.jpg" alt="IMG" className="rounded-lg shadow-2xs" />
  {open && (
    <div className="animate-in fade-in duration-200">
      <h2 className="text-sm font-extrabold text-white tracking-tight leading-tight">ระบบสารสนเทศ</h2>
      <p className="text-[9px] text-[var(--color-surface)] font-bold tracking-wider uppercase leading-tight">สถาบันเศรษฐกิจพอเพียง</p>
    </div>
  )}
</div>

        {/* Navigation Area */}
        <nav className="py-3 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
          {open && (
            <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-disabled)]">
              Main Navigation
            </p>
          )}
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const hasChildren = !!item.children;
              const isChildActive = hasChildren && item.children.some(child => location.pathname === child.href);
              const isDropdownOpen = openDropdown === item.label;
              const IconComponent = item.icon;

              if (hasChildren) {
                return (
                  <li key={item.label} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.label)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-bold transition-all duration-150 group cursor-pointer
                        ${isChildActive
                          ? "bg-[var(--color-surface-2)] text-[var(--color-forest-green)] shadow-2xs"
                          : "text-[var(--color-deep-text)] hover:bg-[var(--color-surface)]/50 hover:text-[var(--color-forest-green)]"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent className={`w-4 h-4 shrink-0 transition-colors ${isChildActive ? "text-[var(--color-green)]" : "text-[var(--color-muted-text)] group-hover:text-[var(--color-deep-text)]"}`} />
                        {open && <span>{item.label}</span>}
                      </div>
                      {open && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-[var(--color-muted-text)] ${isDropdownOpen ? "rotate-180 text-[var(--color-green)]" : ""}`} />
                      )}
                    </button>

                    {/* ── รายการเมนูลูกย่อยสไตล์ Modern Minimalist มีเส้นเชื่อมโยงทางซ้าย ── */}
                    {isDropdownOpen && open && (
                      <ul className="mt-1 ml-5 border-l-2 border-[var(--color-border)] pl-2.5 space-y-0.5 animate-in slide-in-from-top-1 fade-in duration-200">
                        {item.children.map((child) => {
                          const SubIcon = child.icon || FileText;
                          return (
                            <li key={child.label}>
                              <NavLink
                                to={child.href}
                                className={({ isActive }) => `
                                  flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150
                                  ${isActive
                                    ? "text-[var(--color-forest-green)] font-bold bg-[var(--color-green-light)]/20 shadow-3xs"
                                    : "text-[var(--color-muted-text)] hover:text-[var(--color-deep-text)] hover:bg-[var(--color-surface-2)]/60"
                                  }
                                `}
                              >
                                {({ isActive }) => (
                                  <>
                                    <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[var(--color-green)]" : "text-[var(--color-disabled)]"}`} />
                                    <span className="truncate">{child.label}</span>
                                  </>
                                )}
                              </NavLink>
                            </li>
                          );
                        })}
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
                        ? "bg-[var(--color-surface-2)] text-[var(--color-forest-green)] shadow-2xs"
                        : "text-[var(--color-deep-text)] hover:bg-[var(--color-surface)]/50 hover:text-[var(--color-forest-green)]"
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

      {/* Logout Section */}
      <div className="p-3 border-t border-[var(--color-surface-3)] bg-[var(--color-surface)]/20">
        <button
          type="button"
          onClick={async () => {
            const result = await Swal.fire({
              title: 'ออกจากระบบ?',
              text: 'คุณต้องการออกจากระบบใช่หรือไม่?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'ออกจากระบบ',
              cancelButtonText: 'ยกเลิก',
              confirmButtonColor: 'var(--color-error)',
              cancelButtonColor: 'var(--color-forest-green)',
            });
            if (result.isConfirmed) {
              localStorage.removeItem('token');
              navigator('/login');
            }
          }}
          className={`flex items-center justify-center rounded-xl bg-red-50 text-[var(--color-error)] hover:bg-red-100/70 transition-all duration-200 group font-bold text-xs cursor-pointer
            ${open ? "w-full px-3 py-2 gap-2 shadow-xs shadow-red-100" : "w-8 h-8 mx-auto"}`}
        >
          <LogOut className="w-3.5 h-3.5 shrink-0 group-hover:scale-105 transition-transform" />
          {open && <span>ออกจากระบบ</span>}
        </button>
      </div>
    </aside>
  );
}