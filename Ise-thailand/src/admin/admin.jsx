import { useState } from "react";
import { Outlet, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./sideber/Sidebar";
import Topbar from "./topbar/Topbar";

// ── Import หน้าทั้งหมดของ admin ที่นี่ ──────────────────────────────
import RayalAll from "./page/rayal_all";
import Dashboard  from "./page/dashbord";
import TypeProjectAll from "./page/typeproject_all";
import SectorAll from "./page/sector-all";  
import ProjectAll from "./page/project_all";
import ResearcherAll from "./page/researcher_all";
import PlanAll from "./page/plan-all";
import SubPlans from "./page/sub-plans";
import VdoTitleAll from "./page/vdotitle_all";
import ReportInstitution from "./page/report_institution";
import ReportRegion from "./page/report_regoin";
import ReportProvince from "./page/report_province";


function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className="flex h-screen bg-slate-50 overflow-hidden"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      <Sidebar open={sidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// ── ไฟล์นี้คือตัวเดียวที่ App.jsx เรียกใช้
// ── sub-routes ทั้งหมดจัดการภายในที่นี่
export default function AdminLayout() {
  return (
    <Routes>
      <Route element={<AdminShell />}>
        {/* /admin  →  redirect ไป /admin/royal_all */}
        <Route index element={<Navigate to="royal_all" replace />} />

        {/* /admin/royal_all */}
        <Route path="royal_all" element={<RayalAll />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="type-project" element={<TypeProjectAll />} />
        <Route path="sector" element={<SectorAll />} />
        <Route path="project_all" element={<ProjectAll />} />
        <Route path="researchers" element={<ResearcherAll />} />
        <Route path="plans" element={<PlanAll />} />
        <Route path="sub-plans" element={<SubPlans />} />
        <Route path="video-landing" element={<VdoTitleAll />} />
        <Route path="report-overview" element={<ReportInstitution />} />
        <Route path="report-region" element={<ReportRegion />} />
        <Route path="report-province" element={<ReportProvince />} />



      </Route>
    </Routes>
  );
}