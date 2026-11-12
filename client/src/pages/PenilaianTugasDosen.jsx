import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarDosen from '../components/SidebarDosen';
import NavbarDosen from '../components/NavbarDosen';
import { 
  Download, 
  Inbox, 
  Clock, 
  FileText, 
  BarChart2, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Info,
  Check
} from 'lucide-react';
import { getSystemDateIndonesian } from '../utils/dateHelper';

const PenilaianTugasDosen = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pertemuanAktif, setPertemuanAktif] = useState(7);
  const totalPertemuan = 16;
  const [systemDate] = useState(() => getSystemDateIndonesian());

  // Filter State
  const [activeTab, setActiveTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // 4 Metrik Statistik Penilaian 
  const stats = [
    {
      title: 'Sudah mengumpulkan',
      value: '32/32',
      subtext: '100% mahasiswa',
      icon: Inbox
    },
    {
      title: 'Tepat waktu',
      value: '30',
      subtext: '2 pengumpulan terlambat',
      icon: Clock
    },
    {
      title: 'Sudah dinilai',
      value: '24',
      subtext: '8 mahasiswa menunggu nilai',
      icon: FileText
    },
    {
      title: 'Rata-rata sementara',
      value: '86',
      subtext: 'Dari 24 nilai yang diterbitkan',
      icon: BarChart2
    }
  ];

  // Data Pengumpulan Mahasiswa
  const students = [
    {
      id: 1,
      nama: 'Aditya Pratama',
      nim: '231011001',
      kelas: 'TI-3A',
      status: 'Tepat waktu',
      statusCode: 'tepat',
      nilai: null,
      submittedAt: '21 Okt 2026, 20.45 WIB',
      file: '231011001_Aditya_SQL.pdf',
      fileSize: '1,8 MB',
      catatan: 'Berikut hasil query dan tangkapan layar pengujian saya, Bu.',
      feedback: 'Query sudah tepat dan hasil pengujian lengkap. Perhatikan penggunaan alias agar query lebih mudah dibaca.',
      inputNilai: '90'
    },
    {
      id: 2,
      nama: 'Bella Safitri',
      nim: '231011005',
      kelas: 'TI-3A',
      status: 'Tepat waktu',
      statusCode: 'tepat',
      nilai: 92,
      submittedAt: '21 Okt 2026, 18.20 WIB',
      file: '231011005_Bella_SQL.pdf',
      fileSize: '2,1 MB',
      catatan: 'Tugas query sudah selesai dikerjakan.',
      feedback: 'Sangat baik dan struktur relasi rapi.',
      inputNilai: '92'
    },
    {
      id: 3,
      nama: 'Dimas Saputra',
      nim: '231011012',
      kelas: 'TI-3A',
      status: 'Terlambat',
      statusCode: 'terlambat',
      nilai: 80,
      submittedAt: '22 Okt 2026, 01.10 WIB',
      file: '231011012_Dimas_SQL.pdf',
      fileSize: '1,5 MB',
      catatan: 'Mohon maaf Bu terlambat mengumpulkan karena kendala koneksi.',
      feedback: 'Query cukup baik, perhatikan deadline pengumpulan berikutnya.',
      inputNilai: '80'
    },
    {
      id: 4,
      nama: 'Fajar Maulana',
      nim: '231011016',
      kelas: 'TI-3A',
      status: 'Tepat waktu',
      statusCode: 'tepat',
      nilai: null,
      submittedAt: '21 Okt 2026, 21.05 WIB',
      file: '231011016_Fajar_SQL.pdf',
      fileSize: '1,9 MB',
      catatan: 'Pengumpulan latihan query database.',
      feedback: '',
      inputNilai: ''
    },
    {
      id: 5,
      nama: 'Nadia Rahma',
      nim: '231011024',
      kelas: 'TI-3A',
      status: 'Tepat waktu',
      statusCode: 'tepat',
      nilai: 88,
      submittedAt: '20 Okt 2026, 16.40 WIB',
      file: '231011024_Nadia_SQL.pdf',
      fileSize: '2,0 MB',
      catatan: 'Telah diperiksa kembali hasil query-nya.',
      feedback: 'Hasil query tepat sasaran.',
      inputNilai: '88'
    },
    {
      id: 6,
      nama: 'Siti Aisyah',
      nim: '231011029',
      kelas: 'TI-3A',
      status: 'Terlambat',
      statusCode: 'terlambat',
      nilai: 95,
      submittedAt: '22 Okt 2026, 00.30 WIB',
      file: '231011029_Aisyah_SQL.pdf',
      fileSize: '2,4 MB',
      catatan: 'Terima kasih atas bimbingannya Bu.',
      feedback: 'Analisis query sangat komprehensif.',
      inputNilai: '95'
    }
  ];

  // Mahasiswa yang sedang dipilih untuk dinilai (Default: Aditya Pratama)
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [gradeInput, setGradeInput] = useState(selectedStudent.inputNilai || '');
  const [feedbackInput, setFeedbackInput] = useState(selectedStudent.feedback || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setGradeInput(student.inputNilai || '');
    setFeedbackInput(student.feedback || '');
    setIsSaved(false);
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const filteredStudents = students.filter(s => {
    const matchTab = 
      activeTab === 'semua' ? true :
      activeTab === 'tepat' ? s.statusCode === 'tepat' :
      activeTab === 'terlambat' ? s.statusCode === 'terlambat' : true;
    
    const matchSearch = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.nim.includes(searchQuery);
    return matchTab && matchSearch;
  });

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa] text-gray-800 antialiased font-sans">
      {/* Sidebar Dosen */}
      <SidebarDosen 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activePage="tugas"
        currentPertemuan={pertemuanAktif}
        totalPertemuan={totalPertemuan}
        onPertemuanChange={setPertemuanAktif}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 w-full min-h-screen">
        {/* Top Navbar */}
        <NavbarDosen 
          onToggleSidebar={() => setIsSidebarOpen(true)}
          breadcrumbs={['Ruang Dosen', 'Tugas']} 
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
                  onClick={() => navigate('/tugas')}
                  className="text-xs font-semibold text-[#4F46E5] hover:underline cursor-pointer"
                >
                  ← Kembali ke tugas
                </button>
              </div>
              <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
                Latihan Query SQL
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Basis Data · TI-3A · Deadline 21 Oktober 2026, 23.59 WIB
              </p>
            </div>

            <button 
              type="button"
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200/90 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-gray-400" />
              <span>Unduh semua berkas</span>
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

          {/* Grid Layout 2 Kolom: Daftar Mahasiswa & Form Penilaian */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Kolom Kiri: Pengumpulan Mahasiswa */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <h2 className="text-sm font-bold text-gray-900">Pengumpulan mahasiswa</h2>

                {/* Tabs Filter */}
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
                    Semua (32)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('tepat')}
                    className={`pb-2.5 cursor-pointer font-medium transition-all ${
                      activeTab === 'tepat'
                        ? 'border-b-2 border-[#4F46E5] text-[#4F46E5] font-semibold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Tepat (30)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('terlambat')}
                    className={`pb-2.5 cursor-pointer font-medium transition-all ${
                      activeTab === 'terlambat'
                        ? 'border-b-2 border-[#4F46E5] text-[#4F46E5] font-semibold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Terlambat (2)
                  </button>
                  <button 
                    type="button" 
                    className="pb-2.5 text-gray-400 font-medium cursor-not-allowed"
                  >
                    Belum (0)
                  </button>
                </div>

                {/* Search & Filter Controls */}
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
                    <button type="button" className="flex items-center gap-1.5 bg-white border border-gray-200/90 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                      <span>Semua nilai</span>
                    </button>
                    <button type="button" className="flex items-center gap-1.5 bg-white border border-gray-200/90 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50">
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                      <span>Nama A-Z</span>
                    </button>
                  </div>
                </div>

                {/* Tabel Mahasiswa */}
                <div className="overflow-x-auto pt-1">
                  <table className="w-full text-left text-xs min-w-[480px]">
                    <thead>
                      <tr className="border-b border-gray-100/90 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                        <th className="pb-3 pr-4 font-semibold">MAHASISWA</th>
                        <th className="pb-3 px-4 font-semibold text-center">STATUS</th>
                        <th className="pb-3 pl-4 font-semibold text-right">NILAI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50/80">
                      {filteredStudents.map((s) => {
                        const isSelected = selectedStudent.id === s.id;
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

                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                                s.statusCode === 'terlambat'
                                  ? 'bg-[#FEF3C7] text-[#D97706]'
                                  : 'bg-[#EAF8F1] text-[#10B981]'
                              }`}>
                                {s.status}
                              </span>
                            </td>

                            <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                              <span className={`font-semibold text-xs ${s.nilai ? 'text-gray-900' : 'text-gray-400'}`}>
                                {s.nilai !== null ? s.nilai : '—'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Bar */}
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

            {/* Kolom Kanan: Detail Berkas Mahasiswa & Form Input Nilai */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Card 1: Pengumpulan Mahasiswa Terpilih */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{selectedStudent.nama}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedStudent.nim} · {selectedStudent.kelas}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                    selectedStudent.statusCode === 'terlambat'
                      ? 'bg-[#FEF3C7] text-[#D97706]'
                      : 'bg-[#EAF8F1] text-[#10B981]'
                  }`}>
                    {selectedStudent.status}
                  </span>
                  <span className="text-[11px] text-gray-400">{selectedStudent.submittedAt}</span>
                </div>

                {/* Berkas Pengumpulan */}
                <div className="p-3 bg-[#f8f9fa] border border-gray-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="p-2 bg-[#EEF2FF] text-[#4F46E5] rounded-lg shrink-0">
                      <FileText className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{selectedStudent.file}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">PDF • {selectedStudent.fileSize}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[#4F46E5] shrink-0">
                    <button type="button" className="hover:underline cursor-pointer">Buka</button>
                    <span className="text-gray-300">·</span>
                    <button type="button" className="hover:underline cursor-pointer">Unduh</button>
                  </div>
                </div>

                {/* Catatan Mahasiswa */}
                {selectedStudent.catatan && (
                  <p className="text-[11px] text-gray-500 italic bg-gray-50 p-2.5 rounded-lg border border-gray-100/80">
                    <span className="font-semibold not-italic text-gray-700">Catatan mahasiswa: </span>
                    {selectedStudent.catatan}
                  </p>
                )}
              </div>

              {/* Card 2: Form Input Nilai & Feedback */}
              <form onSubmit={handleSaveGrade} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Nilai & feedback</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {selectedStudent.nilai ? `Nilai saat ini: ${selectedStudent.nilai}` : 'Nilai belum diterbitkan untuk mahasiswa ini.'}
                  </p>
                </div>

                {/* Input Nilai */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Nilai (0–100)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    placeholder="90"
                    required
                    className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>

                {/* Input Feedback */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Feedback untuk mahasiswa</label>
                  <textarea 
                    rows={4}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Tuliskan catatan dan feedback untuk mahasiswa..."
                    className="w-full bg-white border border-gray-200/90 rounded-xl p-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5] leading-relaxed resize-y"
                  />
                </div>

                {/* Info Feedback Box */}
                <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-3 flex items-center gap-2.5 text-xs text-gray-500">
                  <Info className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>Feedback akan terlihat setelah nilai diterbitkan.</span>
                </div>

                {/* Tombol Simpan Nilai */}
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Nilai berhasil diterbitkan!</span>
                    </>
                  ) : (
                    <span>Simpan & terbitkan nilai</span>
                  )}
                </button>
              </form>

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

export default PenilaianTugasDosen;
