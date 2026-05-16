import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/home/index'
import ProjectsPage from './pages/project/index'
import ResearchPage from './pages/research'
import EbookPage from './pages/ebook'
import AcademicPage from './pages/academic'
import MediaPage from './pages/media'
import VideoPage from './pages/video'
import InstitutePage from './pages/institute/index'
import LoginPage from './pages/login/index'
import ProjectDetailPage from './pages/projectDetail/index'

// ── admin: import แค่บรรทัดเดียว sub-routes ทั้งหมดอยู่ใน admin.jsx ──
import AdminLayout from './admin/admin'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public routes (มี Navbar) ── */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <main className="container mx-auto mt-9 px-4 py-8">
                <Routes>
                  <Route path="/"             element={<HomePage />} />
                  <Route path="/projects"     element={<ProjectsPage />} />
                  <Route path="/research"     element={<ResearchPage />} />
                  <Route path="/ebook"        element={<EbookPage />} />
                  <Route path="/academic"     element={<AcademicPage />} />
                  <Route path="/media"        element={<MediaPage />} />
                  <Route path="/video"        element={<VideoPage />} />
                  <Route path="/institute"    element={<InstitutePage />} />
                  <Route path="/login"        element={<LoginPage />} />
                  <Route path="/projects/:id" element={<ProjectDetailPage />} />
                </Routes>
              </main>
            </>
          }
        />
        <Route path="/admin/*" element={<AdminLayout />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App