import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/home/index'
import ProjectsPage from './pages/project/index'
import ResearchPage from './pages/research'
import EbookPage from './pages/ebook'
import InstitutePage from './pages/institute/index'
import LoginPage from './pages/login/index'
import ProjectDetailPage from './pages/projectDetail/index'
// ── admin: import แค่บรรทัดเดียว sub-routes ทั้งหมดอยู่ใน admin.jsx ──
import AdminLayout from './admin/admin'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public routes (มี Navbar) ── */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <main className="container max-w-6xl mx-auto mt-10 px-4 py-8">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/research" element={<ResearchPage />} />
                    <Route path="/ebook" element={<EbookPage />} />
                    <Route path="/institute" element={<InstitutePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/projects/:id" element={<ProjectDetailPage />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />

          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}
export default App