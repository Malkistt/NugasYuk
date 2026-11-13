import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  BarChart2, 
  Clock, 
  FileText, 
  FileEdit, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Info 
} from 'lucide-react';
import { getSystemDateIndonesian } from '../utils/dateHelper';

const DaftarTugasDosen = () => {
  const navigate = useNavigate();
  const [systemDate] = useState(() => getSystemDateIndonesian());

  // Filter & Search State
  const [activeTab, setActiveTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [sortOrder, setSortOrder] = useState('deadline');

  // Data Dummy Statistik Kelola Tugas
  const stats = [
    {
      title: 'Semua tugas',
      value: '4',
      subtext: '2 mata kuliah · Kelas TI-3A',
      icon: BarChart2
    },
    {
      title: 'Tugas aktif',
      value: '2',
      subtext: 'Deadline terdekat 26 Oktober',
      icon: Clock
    },
    {
      title: 'Menunggu penilaian',
      value: '33',
      subtext: '24 ERD · 8 SQL · 1 Web',
      icon: FileText
    },
    {
      title: 'Tugas draf',
      value: '1',
      subtext: 'Belum terlihat oleh mahasiswa',
      icon: FileEdit
    }
  ];

  // Data Dummy Daftar Tugas 
  const [tugasList, setTugasList] = useState([
    {
      id: 1,
      judul: 'Perancangan ERD',
      mk: 'Basis Data · TI-3A',
      deadlineDate: '26 Okt 2026',
      deadlineTime: '23.59 WIB',
      status: 'Aktif',
      statusCode: 'aktif',
      pengumpulanMain: '24/32 mahasiswa',
      pengumpulanSub: '8 belum mengumpulkan',
      badgeClass: 'bg-[#EAF8F1] text-[#10B981]'
    },
    {
      id: 2,
      judul: 'Halaman Web Responsif',
      mk: 'Pemrograman Web · TI-3A',
      deadlineDate: '28 Okt 2026',
      deadlineTime: '23.59 WIB',
      status: 'Aktif',
      statusCode: 'aktif',
      pengumpulanMain: '1/32 mahasiswa',
      pengumpulanSub: '31 belum mengumpulkan',
      badgeClass: 'bg-[#EAF8F1] text-[#10B981]'
    },
    {
      id: 3,
      judul: 'Latihan Query SQL',
      mk: 'Basis Data · TI-3A',
      deadlineDate: '21 Okt 2026',
      deadlineTime: '23.59 WIB',
      status: 'Penilaian',
      statusCode: 'penilaian',
      pengumpulanMain: '32/32 · 2 terlambat',
      pengumpulanSub: '24/32 sudah dinilai',
      badgeClass: 'bg-[#FEF3C7] text-[#D97706]'
    },
    {
      id: 4,
      judul: 'Studi Kasus Normalisasi',
      mk: 'Basis Data · TI-3A',
      deadlineDate: '2 Nov 2026',
      deadlineTime: '23.59 WIB',
      status: 'Draf',
      statusCode: 'draf',
      pengumpulanMain: 'Belum diterbitkan',
      pengumpulanSub: '',
      badgeClass: 'bg-gray-100 text-gray-600'
    }
  ]);

  // Handler Hapus Tugas
  const handleDeleteTugas = (id, judul) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus tugas "${judul}"?`)) {
      setTugasList(prev => prev.filter(t => t.id !== id));
    }
  };

  // Filter List
  const filteredTugas = tugasList.filter(tugas => {
    const matchTab = 
      activeTab === 'semua' ? true :
      activeTab === 'aktif' ? tugas.statusCode === 'aktif' :
      activeTab === 'penilaian' ? tugas.statusCode === 'penilaian' :
      activeTab === 'draf' ? tugas.statusCode === 'draf' : true;

    const matchStatus = selectedStatus === 'semua' || tugas.statusCode === selectedStatus;
    const matchSearch = tugas.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        tugas.mk.toLowerCase().includes(searchQuery.toLowerCase());

    return matchTab && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Tombol Buat Tugas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
            Kelola tugas
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Atur tugas, pantau pengumpulan, dan berikan penilaian dalam satu tempat.
          </p>
        </div>

        <button 
          type="button"
          onClick={() => navigate('/tugas/buat')}
          className="inline-flex items-center justify-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat tugas</span>
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

      {/* Card Utama: Daftar Tugas */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        
        {/* Judul Card */}
        <div>
          <h2 className="text-sm font-bold text-gray-900">Daftar tugas</h2>
          <p className="text-xs text-gray-400 mt-0.5">Seluruh tugas semester ganjil 2026/2027.</p>
        </div>

        {/* Tab Filter Navigasi */}
        <div className="flex items-center gap-6 border-b border-gray-100 text-xs">
          <button 
            type="button"
            onClick={() => setActiveTab('semua')}
            className={`pb-2.5 cursor-pointer font-medium transition-all ${
              activeTab === 'semua'
                ? 'border-b-2 border-[#4F46E5] text-[#4F46E5] font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Semua (4)
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('aktif')}
            className={`pb-2.5 cursor-pointer font-medium transition-all ${
              activeTab === 'aktif'
                ? 'border-b-2 border-[#4F46E5] text-[#4F46E5] font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Aktif (2)
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('penilaian')}
            className={`pb-2.5 cursor-pointer font-medium transition-all ${
              activeTab === 'penilaian'
                ? 'border-b-2 border-[#4F46E5] text-[#4F46E5] font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Penilaian (1)
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('draf')}
            className={`pb-2.5 cursor-pointer font-medium transition-all ${
              activeTab === 'draf'
                ? 'border-b-2 border-[#4F46E5] text-[#4F46E5] font-semibold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Draf (1)
          </button>
        </div>

        {/* Search Bar & Dropdown Filter Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul tugas..."
              className="w-full bg-white border border-gray-200/90 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button 
                type="button"
                onClick={() => setSelectedStatus(prev => prev === 'semua' ? 'aktif' : prev === 'aktif' ? 'penilaian' : 'semua')}
                className="flex items-center gap-2 bg-white border border-gray-200/90 hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-medium shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                <span>{selectedStatus === 'semua' ? 'Semua status' : `Status: ${selectedStatus}`}</span>
              </button>
            </div>

            <div className="relative">
              <button 
                type="button"
                onClick={() => setSortOrder(prev => prev === 'deadline' ? 'nama' : 'deadline')}
                className="flex items-center gap-2 bg-white border border-gray-200/90 hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-medium shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                <span>{sortOrder === 'deadline' ? 'Deadline terdekat' : 'Nama A-Z'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Petunjuk Pengurutan */}
        <p className="text-[10px] text-gray-400">
          Urutkan berdasarkan: Tanggal dibuat · Deadline · Nama · Status
        </p>

        {/* Tabel Daftar Tugas */}
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-xs min-w-[680px]">
            <thead>
              <tr className="border-b border-gray-100/90 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="pb-3 pr-4 font-semibold">TUGAS / MATA KULIAH</th>
                <th className="pb-3 px-4 font-semibold">DEADLINE</th>
                <th className="pb-3 px-4 font-semibold">STATUS</th>
                <th className="pb-3 px-4 font-semibold">PENGUMPULAN</th>
                <th className="pb-3 pl-4 font-semibold text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/80">
              {filteredTugas.map((tugas) => (
                <tr key={tugas.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Judul & Mata Kuliah */}
                  <td className="py-4 pr-4">
                    <p className="font-bold text-gray-900 text-xs hover:text-[#4F46E5] transition-colors cursor-pointer" onClick={() => navigate(`/tugas/edit/${tugas.id}`)}>
                      {tugas.judul}
                    </p>
                    <p className="text-gray-400 text-[11px] mt-0.5">{tugas.mk}</p>
                  </td>

                  {/* Deadline */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <p className="text-gray-700 font-medium text-xs">{tugas.deadlineDate}</p>
                    <p className="text-gray-400 text-[11px] mt-0.5">{tugas.deadlineTime}</p>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${tugas.badgeClass}`}>
                      {tugas.status}
                    </span>
                  </td>

                  {/* Pengumpulan */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <p className="text-gray-800 font-medium text-xs">{tugas.pengumpulanMain}</p>
                    {tugas.pengumpulanSub && (
                      <p className="text-gray-400 text-[11px] mt-0.5">{tugas.pengumpulanSub}</p>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="py-4 pl-4 text-right whitespace-nowrap text-xs font-semibold">
                    <div className="inline-flex items-center gap-1.5 text-[#4F46E5]">
                      {tugas.statusCode === 'penilaian' ? (
                        <>
                          <button 
                            type="button" 
                            onClick={() => navigate(`/tugas/nilai/${tugas.id}`)}
                            className="hover:underline cursor-pointer"
                          >
                            Nilai
                          </button>
                          <span className="text-gray-300">·</span>
                          <button 
                            type="button" 
                            onClick={() => navigate(`/tugas/edit/${tugas.id}`)}
                            className="hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">·</span>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteTugas(tugas.id, tugas.judul)}
                            className="text-gray-400 hover:text-red-600 hover:underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        </>
                      ) : tugas.statusCode === 'draf' ? (
                        <>
                          <button 
                            type="button" 
                            onClick={() => navigate(`/tugas/edit/${tugas.id}`)}
                            className="hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">·</span>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteTugas(tugas.id, tugas.judul)}
                            className="text-gray-400 hover:text-red-600 hover:underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            type="button" 
                            onClick={() => navigate(`/tugas/nilai/${tugas.id}`)}
                            className="hover:underline cursor-pointer"
                          >
                            Detail
                          </button>
                          <span className="text-gray-300">·</span>
                          <button 
                            type="button" 
                            onClick={() => navigate(`/tugas/edit/${tugas.id}`)}
                            className="hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">·</span>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteTugas(tugas.id, tugas.judul)}
                            className="text-gray-400 hover:text-red-600 hover:underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Tabel */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-50">
          <p>Menampilkan semua {filteredTugas.length} tugas</p>
          <p>32 mahasiswa per mata kuliah</p>
        </div>

      </div>

      {/* Banner Informasi di Bawah */}
      <div className="bg-[#EEF2FF]/60 border border-[#E0E7FF]/80 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-[#4F46E5] shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <p className="font-bold text-gray-900">
            Pengumpulan tetap tercatat meskipun melewati deadline.
          </p>
          <p className="text-gray-500 mt-0.5">
            Berkas terlambat diberi penanda khusus. Draf hanya dapat dilihat oleh dosen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DaftarTugasDosen;