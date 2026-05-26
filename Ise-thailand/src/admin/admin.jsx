import { useState, useEffect } from "react";
import { Outlet, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./sideber/Sidebar";
import Topbar from "./topbar/Topbar";

import RayalAll from "./page/rayal_all";
import Dashboard from "./page/dashbord";
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
import AssetPage from "./page/asset_page";
import ActivityPage from "./page/activity_page";

function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setSidebarOpen(window.innerWidth >= 1024); // lg breakpoint
  //   };
  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* ส่ง onClose เพิ่มตรงนี้ */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onToggleSidebar={() => setSidebarOpen(v => !v)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <Routes>
      <Route element={<AdminShell />}>
        <Route index element={<Navigate to="royal_all" replace />} />
        <Route path="royal_all"        element={<RayalAll />} />
        <Route path="dashboard"        element={<Dashboard />} />
        <Route path="type-project"     element={<TypeProjectAll />} />
        <Route path="sector"           element={<SectorAll />} />
        <Route path="project_all"      element={<ProjectAll />} />
        <Route path="researchers"      element={<ResearcherAll />} />
        <Route path="plans"            element={<PlanAll />} />
        <Route path="sub-plans"        element={<SubPlans />} />
        <Route path="video-landing"    element={<VdoTitleAll />} />
        <Route path="report-overview"  element={<ReportInstitution />} />
        <Route path="report-region"    element={<ReportRegion />} />
        <Route path="report-province"  element={<ReportProvince />} />
        <Route path="asset/:typeId"    element={<AssetPage />} />
        <Route path="activity/:typeId" element={<ActivityPage />} />
      </Route>
    </Routes>
  );
}