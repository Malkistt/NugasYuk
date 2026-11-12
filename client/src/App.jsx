import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
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
    </BrowserRouter>
  );
}

export default App;