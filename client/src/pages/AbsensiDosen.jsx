import React, { useState } from 'react';
import SidebarDosen from '../components/SidebarDosen';
import NavbarDosen from '../components/NavbarDosen';
import { 
  Download, 
  Plus, 
  Clock, 
  CheckCircle2, 
  UserCheck, 
  Mail, 
  HeartPulse, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  ChevronDown,
  ArrowRight,
  Check
} from 'lucide-react';
import { getSystemDateIndonesian } from '../utils/dateHelper';

const AbsensiDosen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pertemuanAktif, setPertemuanAktif] = useState(7);
  const totalPertemuan = 16;
  const [systemDate] = useState(() => getSystemDateIndonesian());

  // Form Sesi Absensi
  const [isSessionOpen, setIsSessionOpen] = useState(true);
  const [mataKuliah, setMataKuliah] = useState('IF203 · Basis Data — TI-3A');
  const [pertemuanSesi, setPertemuanSesi] = useState('7 dari 16');
  const [batasWaktu, setBatasWaktu] = useState('24 Okt, 09.30 WIB');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // 4 Kartu Metrik Absensi 
  const stats = [
    {
      title: 'Hadir',
      value: '24',
      subtext: '75% dari 32 mahasiswa',
      icon: UserCheck,
      color: 'text-[#4F46E5]'
    },
    {
      title: 'Izin',
      value: '2',
      subtext: 'Disetujui oleh dosen',
      icon: Mail,
      color: 'text-[#4F46E5]'
    },
    {
      title: 'Sakit',
      value: '1',
      subtext: 'Dengan surat keterangan',
      icon: HeartPulse,
      color: 'text-[#4F46E5]'
    },
    {
      title: 'Belum presensi',
      value: '5',
      subtext: 'Sesi ditutup 15 menit lagi',
      icon: Clock,
      color: 'text-[#D97706]'
    }
  ];

  // Data Mahasiswa Kehadiran
  const [students, setStudents] = useState([
    { id: 1, nama: 'Aditya Pratama', nim: '231011001', waktu: '09.04 WIB', status: 'Hadir', statusCode: 'hadir', rekap: '6/6 hadir' },
    { id: 2, nama: 'Bella Safitri', nim: '231011005', waktu: '09.02 WIB', status: 'Hadir', statusCode: 'hadir', rekap: '5/6 hadir' },
    { id: 3, nama: 'Dimas Saputra', nim: '231011012', waktu: '—', status: 'Izin', statusCode: 'izin', rekap: '5/6 hadir' },
    { id: 4, nama: 'Fajar Maulana', nim: '231011016', waktu: '09.03 WIB', status: 'Hadir', statusCode: 'hadir', rekap: '6/6 hadir' },
    { id: 5, nama: 'Nadia Rahma', nim: '231011024', waktu: '—', status: 'Belum', statusCode: 'belum', rekap: '6/6 hadir' },
    { id: 6, nama: 'Asa Mitaka', nim: '231011029', waktu: '—', status: 'Sakit', statusCode: 'sakit', rekap: '5/6 hadir' },
  ]);

  // Mahasiswa yang dipilih untuk ubah status manual 
  const [selectedStudent, setSelectedStudent] = useState(students[4]);
  const [selectedStatus, setSelectedStatus] = useState('Hadir');
  const [reasonInput, setReasonInput] = useState('');
  const [isStatusSaved, setIsStatusSaved] = useState(false);

  const handleSelectStudent = (st) => {
    setSelectedStudent(st);
    setSelectedStatus(st.status === 'Belum' ? 'Hadir' : st.status);
    setReasonInput('');
    setIsStatusSaved(false);
  };

  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setStudents(prev => prev.map(item => {
      if (item.id === selectedStudent.id) {
        return {
          ...item,
          status: selectedStatus,
          statusCode: selectedStatus.toLowerCase(),
          waktu: selectedStatus === 'Hadir' ? '09.15 WIB' : '—'
        };
      }
      return item;
    }));

    setIsStatusSaved(true);
    setTimeout(() => {
      setIsStatusSaved(false);
    }, 1500);
  };

  const filteredStudents = students.filter(s =>
    s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || s.nim.includes(searchQuery)
  );

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa] text-gray-800 antialiased font-sans">
      {/* Sidebar Dosen */}
      <SidebarDosen 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activePage="absensi"
        currentPertemuan={pertemuanAktif}
        totalPertemuan={totalPertemuan}
        onPertemuanChange={setPertemuanAktif}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 w-full min-h-screen">
        {/* Top Navbar */}
        <NavbarDosen 
          onToggleSidebar={() => setIsSidebarOpen(true)}
          breadcrumbs={['Ruang Dosen', 'Absensi']} 
          currentDate={systemDate}
          user={{ name: 'Dr. Maya Putri', role: 'Dosen', initials: 'MP' }}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
                Kelola absensi
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Buka sesi kehadiran dan pantau partisipasi mahasiswa.
              </p>
            </div>

            <button 
              type="button"
              onClick={() => alert('Mengekspor rekap absensi (.xlsx)...')}
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200/90 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-gray-400" />
              <span>Ekspor rekap</span>
            </button>
          </div>

          {/* Card Top: Sesi Pertemuan 7 · Normalisasi */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">Sesi pertemuan 7 · Normalisasi</h2>
              <span className="text-xs font-semibold text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-1 rounded-md">
                {isSessionOpen ? 'Sesi terbuka' : 'Sesi ditutup'}
              </span>
            </div>

            {/* Form Kontrol Sesi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Mata Kuliah */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">Mata kuliah</label>
                <div className="relative">
                  <select 
                    value={mataKuliah}
                    onChange={(e) => setMataKuliah(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                  >
                    <option value="IF203 · Basis Data — TI-3A">IF203 · Basis Data — TI-3A</option>
                    <option value="IF205 · Pemrograman Web — TI-3A">IF205 · Pemrograman Web — TI-3A</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Pertemuan */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">Pertemuan</label>
                <div className="relative">
                  <select 
                    value={pertemuanSesi}
                    onChange={(e) => setPertemuanSesi(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                  >
                    <option value="7 dari 16">7 dari 16</option>
                    <option value="8 dari 16">8 dari 16</option>
                    <option value="9 dari 16">9 dari 16</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Batas Waktu */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">Batas waktu</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={batasWaktu}
                    onChange={(e) => setBatasWaktu(e.target.value)}
                    className="w-full bg-white border border-gray-200/90 rounded-xl pl-4 pr-9 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                  />
                  <Clock className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Tombol Buka / Tutup Sesi */}
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  onClick={() => alert('Membuka sesi baru...')}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold py-2.5 px-3 rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buka sesi baru</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsSessionOpen(!isSessionOpen)}
                  className={`flex-1 flex items-center justify-center text-white text-xs font-semibold py-2.5 px-3 rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap ${
                    isSessionOpen ? 'bg-[#4F46E5] hover:bg-[#4338CA]' : 'bg-[#10B981] hover:bg-[#059669]'
                  }`}
                >
                  {isSessionOpen ? 'Tutup sesi' : 'Buka sesi'}
                </button>
              </div>
            </div>

            {/* Banner Informasi Sesi Aktif */}
            <div className="bg-[#EAF8F1] border border-[#C6ECD6] rounded-xl p-3.5 flex items-start gap-2.5 text-xs leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#065F46]">Sesi berlangsung · 09.00–09.30 WIB</p>
                <p className="text-[#047857] mt-0.5">
                  Mahasiswa yang belum presensi akan tercatat alpa setelah sesi ditutup. Status dapat dikoreksi manual.
                </p>
              </div>
            </div>
          </div>

          {/* 4 Kartu Metrik Ringkasan Kehadiran */}
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
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="mt-3">
                    <p className="text-3xl font-bold text-gray-900 leading-none">{stat.value}</p>
                    <p className="text-[11px] text-gray-400 mt-2 truncate">{stat.subtext}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid Layout 2 Kolom: Kiri (Kehadiran Mahasiswa) vs Kanan (Ubah Manual & Rekap) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Kolom Kiri: Kehadiran Mahasiswa */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Kehadiran mahasiswa</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Pertemuan 7 · 24 Oktober 2026</p>
                </div>

                {/* Search & Filter Bar */}
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

                {/* Tabel Kehadiran */}
                <div className="overflow-x-auto pt-1">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead>
                      <tr className="border-b border-gray-100/90 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                        <th className="pb-3 pr-4 font-semibold">MAHASISWA</th>
                        <th className="pb-3 px-4 font-semibold text-center">WAKTU</th>
                        <th className="pb-3 px-4 font-semibold text-center">STATUS</th>
                        <th className="pb-3 pl-4 font-semibold text-right">REKAP P1–6</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/80">
                      {filteredStudents.map((s) => {
                        const isSelected = selectedStudent?.id === s.id;
                        return (
                          <tr 
                            key={s.id} 
                            onClick={() => handleSelectStudent(s)}
                            className={`cursor-pointer transition-colors ${
                              isSelected 
                                ? 'bg-[#EEF2FF]/60 hover:bg-[#EEF2FF]/80' 
                                : 'hover:bg-gray-50/50'
                            }`}
                          >
                            <td className="py-3.5 pr-4">
                              <p className={`font-bold text-xs ${isSelected ? 'text-[#4F46E5]' : 'text-gray-900'}`}>
                                {s.nama}
                              </p>
                              <p className="text-gray-400 text-[11px] mt-0.5">{s.nim}</p>
                            </td>

                            <td className="py-3.5 px-4 text-center font-normal text-gray-600">
                              {s.waktu}
                            </td>

                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                                s.statusCode === 'hadir' ? 'bg-[#EAF8F1] text-[#10B981]' :
                                s.statusCode === 'izin' ? 'bg-[#FEF3C7] text-[#D97706]' :
                                s.statusCode === 'sakit' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {s.status}
                              </span>
                            </td>

                            <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                              <span className="font-semibold text-xs text-[#4F46E5]">
                                {s.rekap}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
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

              </div>
            </div>

            {/* Kolom Kanan: Ubah Status Manual & Rekap Semester */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Card 1: Ubah Status Manual */}
              <form onSubmit={handleSaveStatus} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Ubah status manual</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedStudent ? `${selectedStudent.nama} · ${selectedStudent.nim}` : 'Pilih mahasiswa dari tabel'}
                  </p>
                </div>

                {/* Dropdown Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Status kehadiran</label>
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                    >
                      <option value="Hadir">Hadir</option>
                      <option value="Izin">Izin</option>
                      <option value="Sakit">Sakit</option>
                      <option value="Alpa">Alpa</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Quick Status Badges */}
                <div className="flex items-center gap-2 pt-1">
                  {['Hadir', 'Izin', 'Sakit', 'Alpa'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStatus(st)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        selectedStatus === st
                          ? 'ring-2 ring-offset-1 ring-[#4F46E5] font-bold'
                          : 'opacity-70 hover:opacity-100'
                      } ${
                        st === 'Hadir' ? 'bg-[#EAF8F1] text-[#10B981]' :
                        st === 'Izin' ? 'bg-[#FEF3C7] text-[#D97706]' :
                        st === 'Sakit' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                        'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Catatan Perubahan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Catatan perubahan</label>
                  <input 
                    type="text"
                    value={reasonInput}
                    onChange={(e) => setReasonInput(e.target.value)}
                    placeholder="Tambahkan alasan..."
                    className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>

                {/* Tombol Simpan Status */}
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isStatusSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Status berhasil diubah!</span>
                    </>
                  ) : (
                    <span>Simpan status</span>
                  )}
                </button>
              </form>

              {/* Card 2: Rekap Semester */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Rekap semester</h3>
                  <p className="text-xs text-gray-400 mt-0.5">6 pertemuan yang sudah selesai</p>
                </div>

                {/* Big Percentage */}
                <div>
                  <p className="text-3xl font-extrabold text-[#4F46E5] tracking-tight">91%</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Rata-rata kehadiran Basis Data dari 192 catatan kehadiran.
                  </p>
                </div>

                {/* Detail Breakdown */}
                <div className="pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-800">174 Hadir · 10 Izin</p>
                  <p className="font-semibold text-gray-800">4 Sakit · 4 Alpa</p>
                </div>

                <button 
                  type="button" 
                  onClick={() => alert('Mengunduh rekap semester (.xlsx)...')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] hover:underline pt-1 cursor-pointer"
                >
                  <span>Unduh rekap semester (.xlsx)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
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

export default AbsensiDosen;
