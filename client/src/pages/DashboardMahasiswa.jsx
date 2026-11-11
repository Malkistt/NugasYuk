import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  HelpCircle,
  FolderKanban,
  UserCheck,
  Bell,
  User,
  LifeBuoy,
  ChevronDown,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  Download,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";

export default function DashboardMahasiswa() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-slate-100 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      {/* Sidebar Kiri */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="p-6 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
              <BookOpen size={20} strokeWidth={2.2} />
            </span>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              ruangkuliah
            </span>
          </div>

          {/* Info Fakultas & Prodi */}
          <div className="mx-4 mb-6 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              FAKULTAS INFORMATIKA
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Universitas Cakrawala</p>
            <span className="mt-2 inline-block px-2.5 py-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md">
              Ruang Mahasiswa
            </span>
          </div>

          {/* Menu Navigasi Utama */}
          <nav className="px-4 space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Perkuliahan
            </p>

            <Link
              to="/dashboardmahasiswa"
              onClick={() => setActiveMenu("dashboard")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeMenu === "dashboard"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>

            <Link
              to="#tugas"
              onClick={() => setActiveMenu("tugas")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeMenu === "tugas"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <FileText size={17} />
              Tugas
            </Link>

            <Link
              to="#kuis"
              onClick={() => setActiveMenu("kuis")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeMenu === "kuis"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <HelpCircle size={17} />
              Kuis
            </Link>

            <Link
              to="#materi"
              onClick={() => setActiveMenu("materi")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeMenu === "materi"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <FolderKanban size={17} />
              Materi
            </Link>

            <Link
              to="#absensi"
              onClick={() => setActiveMenu("absensi")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeMenu === "absensi"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <UserCheck size={17} />
              Absensi
            </Link>

            <div className="pt-4">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Personal
              </p>

              <Link
                to="#notifikasi"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
              >
                <div className="flex items-center gap-3">
                  <Bell size={17} />
                  Notifikasi
                </div>
                <span className="bg-indigo-100 text-indigo-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  4
                </span>
              </Link>

              <Link
                to="#profil"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
              >
                <User size={17} />
                Profil &amp; keamanan
              </Link>
            </div>
          </nav>
        </div>

        {/* Card Info Semester & Helpdesk */}
        <div className="p-4 space-y-3">
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
            <p className="text-xs font-bold text-indigo-700">Ganjil 2026/2027</p>
            <p className="text-[11px] text-indigo-600 mt-1">Pertemuan 7 dari 16</p>
            <div className="w-full bg-indigo-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-600 h-full w-[43.75%]" />
            </div>
          </div>

          <a
            href="#help"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
          >
            <LifeBuoy size={16} />
            Pusat bantuan
          </a>
        </div>
      </aside>

      {/* Konten Utama Sisi Kanan */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Ruang Mahasiswa</span>
            <span>/</span>
            <span className="font-semibold text-slate-800">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 font-medium">
              Sabtu, 24 Oktober 2026
            </span>

            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                NR
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  Nadia Rahma
                </p>
                <p className="text-[10px] text-slate-400">Mahasiswa</p>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Isi Main Dashboard */}
        <main className="p-8 space-y-6 overflow-y-auto">
          {/* Section Greeting */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Selamat pagi, Nadia <span className="inline-block animate-bounce">👋</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Satu langkah lebih dekat ke target belajarmu. Ini yang perlu kamu cek hari ini.
              </p>
            </div>
            <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold rounded-lg">
              TI-3A · Semester 3
            </span>
          </div>

          {/* Grid 4 Metric Cards Top */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500">
                  Tugas belum dikumpulkan
                </span>
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FileText size={16} />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">1</span>
                <p className="text-[11px] text-slate-400 mt-2">
                  Deadline terdekat 26 Oktober
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500">
                  Kuis aktif
                </span>
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <HelpCircle size={16} />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">1</span>
                <p className="text-[11px] text-slate-400 mt-2">
                  Normalisasi · Tutup 12.00 WIB
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500">
                  Materi tersedia
                </span>
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FolderKanban size={16} />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">4</span>
                <p className="text-[11px] text-slate-400 mt-2">
                  2 mata kuliah yang diikuti
                </p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500">
                  Kehadiran Basis Data
                </span>
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Calendar size={16} />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900">100%</span>
                <p className="text-[11px] text-slate-400 mt-2">
                  6 dari 6 pertemuan selesai
                </p>
              </div>
            </div>
          </div>

          {/* Banner Alert Presisi Hari Ini */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <Calendar size={20} />
              </span>
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  Kamu belum presensi hari ini.
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Basis Data · Pertemuan 7 · Sesi dibuka sampai 09.30 WIB.
                </p>
              </div>
            </div>
            <button className="px-4 py-2.5 bg-white border border-emerald-200 text-emerald-800 font-semibold text-xs rounded-xl shadow-sm hover:bg-emerald-100/50 transition shrink-0 flex items-center gap-2">
              <ArrowRight size={14} />
              Isi presensi
            </button>
          </div>

          {/* Grid Layout 2 Kolom (Konten Kiri & Panel Kanan) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column Kiri (Wide 2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card 1: Deadline Terdekat */}
              <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Deadline terdekat
                  </h3>
                  <a
                    href="#tugas"
                    className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    Semua tugas <ArrowRight size={12} />
                  </a>
                </div>

                <div className="space-y-3">
                  {/* Task 1 */}
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <span className="p-2.5 bg-white border border-slate-200 text-indigo-600 rounded-lg">
                        <FileText size={18} />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Perancangan ERD
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Basis Data · 26 Okt, 23.59 WIB
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md">
                        2 hari lagi
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Belum dikumpulkan
                      </p>
                    </div>
                  </div>

                  {/* Task 2 */}
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <span className="p-2.5 bg-white border border-slate-200 text-indigo-600 rounded-lg">
                        <FileText size={18} />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Halaman Web Responsif
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Pemrograman Web · 28 Okt, 23.59 WIB
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md">
                        4 hari lagi
                      </span>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                        Sudah dikumpulkan
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Materi Terbaru */}
              <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Materi terbaru
                  </h3>
                  <a
                    href="#materi"
                    className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    Pustaka materi <ArrowRight size={12} />
                  </a>
                </div>

                <div className="space-y-3">
                  {/* Material 1 */}
                  <div className="p-4 border border-slate-200/80 rounded-xl flex items-center justify-between hover:bg-slate-50/50 transition">
                    <div className="flex items-center gap-3.5">
                      <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                        <FolderKanban size={18} />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Normalisasi 1NF-3NF
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Google Drive · Basis Data · Pertemuan 7 · 23 Okt
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                      <button className="hover:text-indigo-600 transition">Buka</button>
                      <span>·</span>
                      <button className="hover:text-indigo-600 transition">Unduh</button>
                    </div>
                  </div>

                  {/* Material 2 */}
                  <div className="p-4 border border-slate-200/80 rounded-xl flex items-center justify-between hover:bg-slate-50/50 transition">
                    <div className="flex items-center gap-3.5">
                      <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                        <FolderKanban size={18} />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          CSS Flexbox &amp; Grid
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Google Drive · Pemrograman Web · Pertemuan 6 · 22 Okt
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                      <button className="hover:text-indigo-600 transition">Buka</button>
                      <span>·</span>
                      <button className="hover:text-indigo-600 transition">Unduh</button>
                    </div>
                  </div>

                  {/* Material 3 */}
                  <div className="p-4 border border-slate-200/80 rounded-xl flex items-center justify-between hover:bg-slate-50/50 transition">
                    <div className="flex items-center gap-3.5">
                      <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                        <FileSpreadsheet size={18} />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Modul Latihan Query SQL.pdf
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Basis Data · Pertemuan 6 · 19 Okt
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                      <button className="hover:text-indigo-600 transition">Buka</button>
                      <span>·</span>
                      <button className="hover:text-indigo-600 transition">Unduh</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column Kanan (Narrow 1/3) */}
            <div className="space-y-6">
              {/* Card Kuis Sedang Berlangsung (Dark Purple Card) */}
              <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />

                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wide rounded-md border border-emerald-500/30">
                  Kuis sedang berlangsung
                </span>

                <h3 className="text-xl font-bold mt-4">Kuis Normalisasi</h3>
                <p className="text-xs text-slate-300 mt-1">Basis Data · TI-3A</p>
                <p className="text-xs text-slate-400 mt-0.5">5 soal · 30 menit</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  24 Okt 2026, 09.00–12.00 WIB
                </p>

                <button className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition">
                  <ArrowRight size={15} />
                  Kerjakan kuis
                </button>
              </div>

              {/* Card Pencapaian Terbaru */}
              <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Pencapaian terbaru
                </h3>

                <div className="flex items-center gap-4 pt-1">
                  <span className="text-4xl font-extrabold text-indigo-600">
                    88
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Latihan Query SQL
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Nilai terbit 23 Oktober
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-xs italic text-slate-600 leading-relaxed">
                    &ldquo;Query sudah tepat. Perhatikan konsistensi penulisan alias tabel.&rdquo;
                  </p>
                </div>

                <a
                  href="#nilai"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline pt-1"
                >
                  Lihat nilai &amp; feedback <ArrowRight size={12} />
                </a>
              </div>

              {/* Help Box Banner */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-start gap-3">
                <HelpCircle size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-900 leading-relaxed">
                  Butuh bantuan? Hubungi dosen melalui kontak mata kuliah.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-4 bg-white border-t border-slate-200 text-xs text-slate-400 flex items-center justify-between">
          <span>© 2026 Ruangkuliah · Universitas Cakrawala</span>
          <span>Semester ganjil 2026/2027</span>
        </footer>
      </div>
    </div>
  );
}