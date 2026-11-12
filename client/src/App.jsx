import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardDosen from './pages/DashboardDosen';
import DaftarTugasDosen from './pages/DaftarTugasDosen';
import FormTugasDosen from './pages/FormTugasDosen';
import PenilaianTugasDosen from './pages/PenilaianTugasDosen';
import KelolaKuisDosen from './pages/KelolaKuisDosen';
import HasilKuisDosen from './pages/HasilKuisDosen';
import MateriDosen from './pages/MateriDosen';
import AbsensiDosen from './pages/AbsensiDosen';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-[#f8f9fa]">
        <Routes>
          {/* Dashboard Dosen */}
          <Route path="/dashboarddosen" element={<DashboardDosen />} />

          {/* Redirect Root ke Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
      
          
          {/* Halaman Daftar Tugas Dosen */}
          <Route path="/tugas" element={<DaftarTugasDosen />} />
          <Route path="/daftartugas" element={<DaftarTugasDosen />} />
          <Route path="/daftar-tugas" element={<DaftarTugasDosen />} />

          {/* Form Buat Tugas Baru (Persis seperti Edit Tugas, tapi isinya KOSONG) */}
          <Route path="/tugas/buat" element={<FormTugasDosen />} />
          <Route path="/buattugas" element={<FormTugasDosen />} />
          <Route path="/buat-tugas" element={<FormTugasDosen />} />

          {/* Form Edit Tugas */}
          <Route path="/tugas/edit" element={<FormTugasDosen />} />
          <Route path="/tugas/edit/:id" element={<FormTugasDosen />} />

          {/* Pengumpulan & Penilaian Tugas */}
          <Route path="/tugas/nilai" element={<PenilaianTugasDosen />} />
          <Route path="/tugas/nilai/:id" element={<PenilaianTugasDosen />} />
          <Route path="/tugas/detail" element={<PenilaianTugasDosen />} />
          <Route path="/tugas/detail/:id" element={<PenilaianTugasDosen />} />

          {/* Kuis Dosen */}
          <Route path="/kuis" element={<KelolaKuisDosen />} />
          <Route path="/kuis/kelola" element={<KelolaKuisDosen />} />
          <Route path="/kuis/hasil" element={<HasilKuisDosen />} />
          <Route path="/kuis/hasil/:id" element={<HasilKuisDosen />} />

          {/* Materi Dosen */}
          <Route path="/materi" element={<MateriDosen />} />

          {/* Absensi Dosen */}
          <Route path="/absensi" element={<AbsensiDosen />} />
          
          {/* Fallback untuk rute lainnya */}
          <Route path="*" element={<Navigate to="/dashboarddosen" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
