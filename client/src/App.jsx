import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
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

// Layouts & Mahasiswa Pages
import MahasiswaLayout from "./layouts/MahasiswaLayout";
import DashboardMahasiswa from "./pages/DashboardMahasiswa";
import TugasMahasiswa from "./pages/TugasMahasiswa";
import KuisMahasiswa from "./pages/KuisMahasiswa";
import PengerjaanKuisMahasiswa from "./pages/PengerjaanKuisMahasiswa";
import HasilKuisMahasiswa from "./pages/HasilKuisMahasiswa";
import MateriMahasiswa from "./pages/MateriMahasiswa";
import AbsensiMahasiswa from "./pages/AbsensiMahasiswa";
import DetailAbsensiMahasiswa from "./pages/DetailAbsensiMahasiswa";
import NotifikasiMahasiswa from "./pages/NotifikasiMahasiswa";
import ProfilMahasiswa from "./pages/ProfilMahasiswa";
import PusatBantuanMahasiswa from "./pages/PusatBantuanMahasiswa";

// Dosen Pages
import DashboardDosen from "./pages/DashboardDosen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Mahasiswa Routes */}
        <Route element={<MahasiswaLayout />}>
          <Route path="/mahasiswa/dashboard" element={<DashboardMahasiswa />} />
          <Route path="/mahasiswa/tugas" element={<TugasMahasiswa />} />
          <Route path="/mahasiswa/kuis" element={<KuisMahasiswa />} />
          <Route path="/mahasiswa/kuis/:id/hasil" element={<HasilKuisMahasiswa />} />
          <Route path="/mahasiswa/materi" element={<MateriMahasiswa />} />
          <Route path="/mahasiswa/absensi" element={<AbsensiMahasiswa />} />
          <Route path="/mahasiswa/absensi/:kodeMk" element={<DetailAbsensiMahasiswa />} />
          <Route path="/mahasiswa/notifikasi" element={<NotifikasiMahasiswa />} />
          <Route path="/mahasiswa/profil" element={<ProfilMahasiswa />} />
          <Route path="/mahasiswa/bantuan" element={<PusatBantuanMahasiswa />} />
        </Route>

        {/* Mode Fokus Ujian (Mahasiswa) */}
        <Route
          path="/mahasiswa/kuis/:id/kerjakan"
          element={<PengerjaanKuisMahasiswa />}
        />

        {/* Dosen Routes */}
        <Route path="/dashboarddosen" element={<DashboardDosen />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
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
