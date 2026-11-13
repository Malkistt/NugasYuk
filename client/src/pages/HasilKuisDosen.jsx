import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarDosen from '../components/SidebarDosen';
import NavbarDosen from '../components/NavbarDosen';
import { 
  Download, 
  Users, 
  BarChart2, 
  Trophy, 
  CheckCircle2, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown
} from 'lucide-react';
import { getSystemDateIndonesian } from '../utils/dateHelper';

const HasilKuisDosen = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pertemuanAktif, setPertemuanAktif] = useState(7);
  const totalPertemuan = 16;
  const [systemDate] = useState(() => getSystemDateIndonesian());

  const [searchQuery, setSearchQuery] = useState('');

  // 4 Kartu Metrik Ringkasan Hasil Kuis
  const stats = [
    {
      title: 'Peserta selesai',
      value: '32/32',
      subtext: 'Seluruh jawaban telah dinilai',
      icon: Users
    },
    {
      title: 'Rata-rata nilai',
      value: '84',
      subtext: 'Nilai maksimal 100',
      icon: BarChart2
    },
    {
      title: 'Nilai tertinggi',
      value: '100',
      subtext: 'Nilai terendah 60',
      icon: Trophy
    },
    {
      title: 'Mencapai KKM',
      value: '28',
      subtext: '87,5% mahasiswa · KKM 70',
      icon: CheckCircle2
    }
  ];

  // Data Rekap Nilai Mahasiswa
  const mahasiswaKuis = [
    { id: 1, nama: 'Aditya Pratama', nim: '231011001', pg: 80, esai: 20, nilai: 100, status: 'Selesai' },
    { id: 2, nama: 'Bella Safitri', nim: '231011005', pg: 80, esai: 5, nilai: 85, status: 'Selesai' },
    { id: 3, nama: 'Dimas Saputra', nim: '231011012', pg: 60, esai: 10, nilai: 70, status: 'Selesai' },
    { id: 4, nama: 'Fajar Maulana', nim: '231011016', pg: 60, esai: 20, nilai: 80, status: 'Selesai' },
    { id: 5, nama: 'Nadia Rahma', nim: '231011024', pg: 80, esai: 10, nilai: 90, status: 'Selesai' },
    { id: 6, nama: 'Siti Aisyah', nim: '231011029', pg: 80, esai: 15, nilai: 95, status: 'Selesai' },
  ];

  // Distribusi Nilai
  const distribusiNilai = [
    { rentang: '90–100', jumlah: '12 mhs', persentase: 37.5 },
    { rentang: '80–89', jumlah: '11 mhs', persentase: 34.4 },
    { rentang: '70–79', jumlah: '5 mhs', persentase: 15.6 },
    { rentang: '< 70', jumlah: '4 mhs', persentase: 12.5 },
  ];

  const filteredMahasiswa = mahasiswaKuis.filter(m => 
    m.nama.toLowerCase().includes(searchQuery.toLowerCase()) || m.nim.includes(searchQuery)
  );

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa] text-gray-800 antialiased font-sans">
      {/* Sidebar Dosen */}
      <SidebarDosen 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activePage="kuis"
        currentPertemuan={pertemuanAktif}
        totalPertemuan={totalPertemuan}
        onPertemuanChange={setPertemuanAktif}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 w-full min-h-screen">
        {/* Top Navbar */}
        <NavbarDosen 
          onToggleSidebar={() => setIsSidebarOpen(true)}
          breadcrumbs={['Ruang Dosen', 'Kuis']} 
          currentDate={systemDate}
          user={{ name: 'Dr. Maya Putri', role: 'Dosen', initials: 'MP' }}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <button 
                  type="button" 
                  onClick={() => navigate('/kuis')}
                  className="text-xs font-semibold text-[#4F46E5] hover:underline cursor-pointer"
                >
                  ← Kembali ke kelola kuis
                </button>
              </div>
              <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
                Hasil Kuis Dasar SQL
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Basis Data · TI-3A · 22 Oktober 2026, 09.00–12.00 WIB · 5 soal
              </p>
            </div>

            <button 
              type="button"
              onClick={() => alert('Mengunduh rekap hasil kuis...')}
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200/90 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-gray-400" />
              <span>Ekspor hasil</span>
            </button>
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

          {/* Grid Layout: Kiri (Tabel Rekap Mahasiswa) vs Kanan (Distribusi & Skema) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Kolom Kiri: Rekap Mahasiswa */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Rekap mahasiswa</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Nilai akhir = pilihan ganda + esai.</p>
                </div>

                {/* Search & Filter Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari nama / NIM..."
                      className="w-full bg-white border border-gray-200/90 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button type="button" className="flex items-center gap-1.5 bg-white border border-gray-200/90 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                      <span>Semua status</span>
                    </button>
                    <button type="button" className="flex items-center gap-1.5 bg-white border border-gray-200/90 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50">
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                      <span>Nama A-Z</span>
                    </button>
                  </div>
                </div>

                {/* Tabel Rekap Mahasiswa */}
                <div className="overflow-x-auto pt-1">
                  <table className="w-full text-left text-xs min-w-[540px]">
                    <thead>
                      <tr className="border-b border-gray-100/90 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                        <th className="pb-3 pr-4 font-semibold">MAHASISWA</th>
                        <th className="pb-3 px-4 font-semibold text-center">PG / 80</th>
                        <th className="pb-3 px-4 font-semibold text-center">ESAI / 20</th>
                        <th className="pb-3 px-4 font-semibold text-center">NILAI</th>
                        <th className="pb-3 pl-4 font-semibold text-center">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/80">
                      {filteredMahasiswa.map((m) => (
                        <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3.5 pr-4">
                            <p className="font-bold text-gray-900 text-xs">{m.nama}</p>
                            <p className="text-gray-400 text-[11px] mt-0.5">{m.nim}</p>
                          </td>
                          <td className="py-3.5 px-4 text-center font-medium text-gray-700">{m.pg}</td>
                          <td className="py-3.5 px-4 text-center font-medium text-gray-700">{m.esai}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-gray-900">{m.nilai}</td>
                          <td className="py-3.5 pl-4 text-center whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#EAF8F1] text-[#10B981]">
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 pt-3 border-t border-gray-50">
                  <p className="text-[11px]">Menampilkan 1-6 dari 32 mahasiswa</p>
                  <div className="flex items-center gap-1.5">
                    <button type="button" className="px-2.5 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-xs">
                      Sebelumnya
                    </button>
                    <button type="button" className="w-7 h-7 bg-[#4F46E5] text-white rounded-lg text-xs font-semibold">
                      1
                    </button>
                    <button type="button" className="w-7 h-7 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50">
                      2
                    </button>
                    <button type="button" className="px-2.5 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-xs">
                      Berikutnya
                    </button>
                  </div>
                </div>

                {/* Banner Status Nilai Terbit */}
                <div className="p-3.5 bg-[#EAF8F1] border border-[#C6ECD6] rounded-xl flex items-center gap-2.5 text-xs text-[#065F46] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Nilai akhir sudah diterbitkan kepada seluruh mahasiswa.</span>
                </div>

              </div>
            </div>

            {/* Kolom Kanan: Distribusi Nilai & Skema Penilaian */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Card 1: Distribusi Nilai */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Distribusi nilai</h3>
                  <p className="text-xs text-gray-400 mt-0.5">32 mahasiswa</p>
                </div>

                <div className="space-y-3.5 pt-1 text-xs">
                  {distribusiNilai.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-gray-600 font-medium">
                        <span>{item.rentang}</span>
                        <span className="text-gray-400 font-normal">{item.jumlah}</span>
                      </div>
                      <div className="w-full bg-[#f1f3f9] h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#4F46E5] h-full rounded-full transition-all duration-500" 
                          style={{ width: `${item.persentase}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Skema Penilaian */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                <h3 className="text-sm font-bold text-gray-900">Skema penilaian</h3>

                <span className="inline-block px-2.5 py-1 text-[11px] font-semibold text-[#4F46E5] bg-[#EEF2FF] rounded-md">
                  PG dinilai otomatis
                </span>

                <div className="space-y-1.5 text-xs text-gray-700">
                  <p>• 4 pilihan ganda × 20 poin</p>
                  <p>• 1 esai × 20 poin</p>
                </div>

                <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400 space-y-0.5">
                  <p>Esai diperiksa oleh dosen.</p>
                  <p>Durasi kuis: 30 menit.</p>
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

export default HasilKuisDosen;
