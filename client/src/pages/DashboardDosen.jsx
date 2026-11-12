import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarDosen from '../components/SidebarDosen';
import NavbarDosen from '../components/NavbarDosen';
import { 
  FileText, 
  Sliders, 
  Inbox, 
  Users, 
  CheckCircle2, 
  Plus, 
  FolderPlus, 
  CalendarCheck, 
  ArrowRight,
  ChevronDown,
  FolderOpen,
  Award
} from 'lucide-react';
import { getSystemDateIndonesian } from '../utils/dateHelper';

const DashboardDosen = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State Dinamis Pertemuan (1 sampai 16, default: 7)
  const [pertemuanAktif, setPertemuanAktif] = useState(7);
  const totalPertemuan = 16;

  // Tanggal Sistem Dinamis
  const [systemDate] = useState(() => getSystemDateIndonesian());

  // Data Dummy: 4 Metrik Statistik Utama
  const stats = [
    {
      title: 'Tugas semester ini',
      value: '4',
      subtext: '2 aktif · 1 penilaian · 1 draf',
      icon: FileText
    },
    {
      title: 'Kuis terjadwal',
      value: '3',
      subtext: '1 aktif · 1 mendatang · 1 selesai',
      icon: Sliders
    },
    {
      title: 'Pengumpulan masuk',
      value: '57',
      subtext: '33 berkas menunggu penilaian',
      icon: Inbox
    },
    {
      title: 'Rata-rata kehadiran',
      value: '91%',
      subtext: 'Basis Data · 6 pertemuan selesai',
      icon: Users
    }
  ];

  // Data Dummy: 
  const tugasList = [
    {
      id: 1,
      judul: 'Perancangan ERD',
      mk: 'Basis Data · TI-3A',
      deadline: '26 Okt, 23.59',
      badgeText: '24/32 masuk',
      badgeType: 'primary' // indigo pill
    },
    {
      id: 2,
      judul: 'Latihan Query SQL',
      mk: 'Basis Data · TI-3A',
      deadline: '21 Okt, 23.59',
      badgeText: '8 belum dinilai',
      badgeType: 'warning' // amber pill
    },
    {
      id: 3,
      judul: 'Halaman Web Responsif',
      mk: 'Pemrograman Web · TI-3A',
      deadline: '28 Okt, 23.59',
      badgeText: '1/32 masuk',
      badgeType: 'primary' // indigo pill
    }
  ];

  // Data Dummy: Mata Kuliah Yang Diampu
  const mataKuliah = [
    {
      id: 'IF203',
      nama: 'Basis Data',
      kelas: 'TI-3A',
      pertemuan: pertemuanAktif,
      mahasiswa: 32
    },
    {
      id: 'IF205',
      nama: 'Pemrograman Web',
      kelas: 'TI-3A',
      pertemuan: Math.max(1, pertemuanAktif - 1),
      mahasiswa: 32
    }
  ];

  // Data Dummy: Aktivitas Terbaru
  const aktivitasList = [
    {
      icon: Inbox,
      text: 'Aditya mengumpulkan ERD',
      time: 'Hari ini, 08.42'
    },
    {
      icon: Sliders,
      text: 'Kuis Normalisasi dibuka',
      time: 'Hari ini, 09.00'
    },
    {
      icon: FolderOpen,
      text: 'Materi Normalisasi ditambahkan',
      time: '23 Okt, 16.00'
    },
    {
      icon: Award,
      text: 'Nilai SQL Nadia diterbitkan',
      time: '23 Okt, 14.30'
    }
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa] text-gray-800 antialiased font-sans">
      {/* Sidebar Dosen */}
      <SidebarDosen 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activePage="dashboard"
        currentPertemuan={pertemuanAktif}
        totalPertemuan={totalPertemuan}
        onPertemuanChange={setPertemuanAktif}
      />

      {/* Main Container yang Memenuhi Layar */}
      <div className="flex-1 flex flex-col min-w-0 w-full min-h-screen">
        {/* Top Navbar */}
        <NavbarDosen 
          onToggleSidebar={() => setIsSidebarOpen(true)}
          breadcrumbs={['Ruang Dosen', 'Dashboard']} 
          currentDate={systemDate}
          user={{ name: 'Dr. Maya Putri', role: 'Dosen', initials: 'MP' }}
        />

        {/* Dashboard Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full space-y-6">
          
          {/* Header & Filter Semester */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
                Selamat pagi, Bu Maya 👋
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Berikut ringkasan perkuliahan Anda hari ini{systemDate ? `, ${systemDate}` : ''}.
              </p>
            </div>

            {/* Dropdown Semester Ganjil */}
            <div className="self-start sm:self-auto">
              <button 
                type="button"
                className="inline-flex items-center gap-2 bg-white border border-gray-200/90 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-xs font-medium shadow-xs transition-colors cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                <span>Semester ganjil 2026/2027</span>
              </button>
            </div>
          </div>

          {/* 4 Kartu Metrik Ringkasan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-indigo-100/80 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">{stat.title}</span>
                    <Icon className="w-4 h-4 text-[#4F46E5]" />
                  </div>
                  <div className="mt-3">
                    <p className="text-3xl font-bold text-gray-900 leading-none">{stat.value}</p>
                    <p className="text-[11px] text-gray-400 mt-2 truncate">{stat.subtext}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Absensi Aktif */}
          <div className="bg-[#EAF8F1] border border-[#C6ECD6] rounded-2xl p-4 flex items-start sm:items-center gap-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5 sm:mt-0" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-gray-900">
                Absensi Basis Data sedang dibuka hingga 09.30 WIB.
              </span>
              <span className="text-gray-600 sm:ml-1 block sm:inline mt-0.5 sm:mt-0">
                Pertemuan {pertemuanAktif} · Normalisasi basis data · 24 dari 32 mahasiswa sudah hadir.
              </span>
            </div>
          </div>

          {/* Grid Konten 2 Kolom */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Kolom Kiri: Perlu Perhatian Anda & Mata Kuliah */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Card 1: Perlu Perhatian Anda */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">Perlu perhatian Anda</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Prioritas penilaian dan deadline terdekat.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => navigate('/tugas')}
                    className="text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] flex items-center gap-1 self-start sm:self-auto transition-colors cursor-pointer"
                  >
                    <span>Lihat semua tugas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tabel / Daftar Tugas Responsif */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[480px]">
                    <thead>
                      <tr className="border-b border-gray-100/90 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                        <th className="pb-3 pr-4 font-semibold">TUGAS / MATA KULIAH</th>
                        <th className="pb-3 px-4 font-semibold">DEADLINE</th>
                        <th className="pb-3 pl-4 font-semibold text-right">PENGUMPULAN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/80">
                      {tugasList.map((tugas) => (
                        <tr 
                          key={tugas.id} 
                          onClick={() => navigate('/tugas')}
                          className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                        >
                          <td className="py-3.5 pr-4">
                            <p className="font-bold text-gray-900 text-xs hover:text-[#4F46E5] transition-colors">{tugas.judul}</p>
                            <p className="text-gray-400 text-[11px] mt-0.5">{tugas.mk}</p>
                          </td>
                          <td className="py-3.5 px-4 text-gray-600 font-normal whitespace-nowrap">
                            {tugas.deadline}
                          </td>
                          <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                            <span 
                              className={`inline-block px-3 py-1 rounded-md text-[11px] font-semibold text-center ${
                                tugas.badgeType === 'warning'
                                  ? 'bg-[#FEF3C7] text-[#D97706]'
                                  : 'bg-[#EEF2FF] text-[#4F46E5]'
                              }`}
                            >
                              {tugas.badgeText}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card 2: Mata Kuliah Yang Diampu */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-900">Mata kuliah yang diampu</h2>
                  <span className="text-xs text-gray-400 font-normal">
                    {mataKuliah.length} mata kuliah
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mataKuliah.map((mk) => (
                    <div 
                      key={mk.id} 
                      className="bg-[#f8f9fa] p-5 rounded-2xl border border-gray-100/90 flex flex-col justify-between hover:border-gray-200 transition-all group"
                    >
                      <div>
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-[#EEF2FF] text-[#4F46E5] rounded">
                          {mk.id}
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 mt-2.5 group-hover:text-[#4F46E5] transition-colors">
                          {mk.nama}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {mk.pertemuan} pertemuan · {mk.mahasiswa} mahasiswa
                        </p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => navigate('/tugas')}
                        className="text-xs font-semibold text-[#4F46E5] flex items-center gap-1 mt-4 group-hover:gap-1.5 transition-all self-start cursor-pointer"
                      >
                        <span>Kelas {mk.kelas}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Kolom Kanan: Akses Cepat & Aktivitas Terbaru */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Card 3: Akses Cepat */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                <h2 className="text-sm font-bold text-gray-900 mb-1">Akses cepat</h2>
                
                {/* 2 Tombol Atas Sejajar */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => navigate('/tugas/buat')}
                    className="flex items-center justify-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat tugas</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => navigate('/kuis')}
                    className="flex items-center justify-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-gray-400" />
                    <span>Buat kuis</span>
                  </button>
                </div>

                {/* Tombol Tambah Materi */}
                <button 
                  type="button"
                  onClick={() => navigate('/materi')}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4 text-gray-400" />
                  <span>Tambah materi</span>
                </button>

                {/* Tombol Kelola Absensi */}
                <button 
                  type="button"
                  onClick={() => navigate('/absensi')}
                  className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4 text-gray-400" />
                  <span>Kelola absensi</span>
                </button>
              </div>

              {/* Card 4: Aktivitas Terbaru */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Aktivitas terbaru</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">Hari ini & kemarin</p>
                </div>

                <div className="space-y-4 text-xs">
                  {aktivitasList.map((akt, idx) => {
                    const Icon = akt.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3 group">
                        <span className="p-1.5 bg-[#EEF2FF] text-[#4F46E5] rounded-lg mt-0.5 group-hover:bg-indigo-100 transition-colors shrink-0">
                          <Icon className="w-3.5 h-3.5"/>
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-xs leading-snug">{akt.text}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{akt.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Footer Bagian Bawah */}
          <footer className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 border-t border-transparent">
            <p>© 2026 NugasYuk • Universitas Cakrawala</p>
            <p>Semester ganjil 2026/2027</p>
          </footer>

        </main>
      </div>
    </div>
  );
};

export default DashboardDosen;
