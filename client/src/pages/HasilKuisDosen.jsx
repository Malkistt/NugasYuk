import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  Users, 
  BarChart2, 
  Trophy, 
  CheckCircle2, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown,
  FileText,
  Check,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getSystemDateIndonesian } from '../utils/dateHelper';

const HasilKuisDosen = () => {
  const navigate = useNavigate();
  const [systemDate] = useState(() => getSystemDateIndonesian());

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('nama-az'); // 'nama-az', 'nama-za', 'nilai-tinggi', 'nilai-rendah'
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // 3 mahasiswa per halaman

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

  // Data Rekap Nilai Mahasiswa dengan Detail Soal PG & Esai
  const [mahasiswaList, setMahasiswaList] = useState([
    { 
      id: 1, 
      nama: 'Aditya Pratama', 
      nim: '231011001', 
      pg: 80, 
      esai: 20, 
      nilai: 100, 
      status: 'Selesai',
      jawabanPG: [
        { no: 1, soal: 'Perintah SQL untuk mengambil data dari tabel adalah...', pilihan: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'], jawabanMhs: 'SELECT', jawabanBenar: 'SELECT', benar: true },
        { no: 2, soal: 'Bentuk normal yang menghilangkan ketergantungan parsial adalah...', pilihan: ['1NF', '2NF', '3NF', 'BCNF'], jawabanMhs: '2NF', jawabanBenar: '2NF', benar: true },
        { no: 3, soal: 'Constraint untuk memastikan nilai unik pada kolom adalah...', pilihan: ['PRIMARY KEY', 'UNIQUE', 'FOREIGN KEY', 'CHECK'], jawabanMhs: 'UNIQUE', jawabanBenar: 'UNIQUE', benar: true },
        { no: 4, soal: 'Perintah untuk menghapus tabel secara permanen dari database...', pilihan: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], jawabanMhs: 'DROP', jawabanBenar: 'DROP', benar: true },
      ],
      esaiSoal: 'Jelaskan apa yang dimaksud dengan normalisasi pada basis data dan sebutkan tujuannya!',
      esaiJawaban: 'Normalisasi adalah proses penguraian relasi tabel ke bentuk normal (1NF, 2NF, 3NF) untuk menghilangkan redundansi data dan anomali pembaruan.',
      feedback: 'Analisis esai sangat akurat dan penjelasan tahapan normalisasi lengkap.'
    },
    { 
      id: 2, 
      nama: 'Bella Safitri', 
      nim: '231011005', 
      pg: 80, 
      esai: 5, 
      nilai: 85, 
      status: 'Selesai',
      jawabanPG: [
        { no: 1, soal: 'Perintah SQL untuk mengambil data dari tabel adalah...', pilihan: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'], jawabanMhs: 'SELECT', jawabanBenar: 'SELECT', benar: true },
        { no: 2, soal: 'Bentuk normal yang menghilangkan ketergantungan parsial adalah...', pilihan: ['1NF', '2NF', '3NF', 'BCNF'], jawabanMhs: '2NF', jawabanBenar: '2NF', benar: true },
        { no: 3, soal: 'Constraint untuk memastikan nilai unik pada kolom adalah...', pilihan: ['PRIMARY KEY', 'UNIQUE', 'FOREIGN KEY', 'CHECK'], jawabanMhs: 'UNIQUE', jawabanBenar: 'UNIQUE', benar: true },
        { no: 4, soal: 'Perintah untuk menghapus tabel secara permanen dari database...', pilihan: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], jawabanMhs: 'DELETE', jawabanBenar: 'DROP', benar: false },
      ],
      esaiSoal: 'Jelaskan apa yang dimaksud dengan normalisasi pada basis data dan sebutkan tujuannya!',
      esaiJawaban: 'Normalisasi membuat database lebih rapi dan terstruktur.',
      feedback: 'Jawaban esai terlalu singkat, perlu menjelaskan anomali data.'
    },
    { 
      id: 3, 
      nama: 'Dimas Saputra', 
      nim: '231011012', 
      pg: 60, 
      esai: 10, 
      nilai: 70, 
      status: 'Selesai',
      jawabanPG: [
        { no: 1, soal: 'Perintah SQL untuk mengambil data dari tabel adalah...', pilihan: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'], jawabanMhs: 'INSERT', jawabanBenar: 'SELECT', benar: false },
        { no: 2, soal: 'Bentuk normal yang menghilangkan ketergantungan parsial adalah...', pilihan: ['1NF', '2NF', '3NF', 'BCNF'], jawabanMhs: '2NF', jawabanBenar: '2NF', benar: true },
        { no: 3, soal: 'Constraint untuk memastikan nilai unik pada kolom adalah...', pilihan: ['PRIMARY KEY', 'UNIQUE', 'FOREIGN KEY', 'CHECK'], jawabanMhs: 'UNIQUE', jawabanBenar: 'UNIQUE', benar: true },
        { no: 4, soal: 'Perintah untuk menghapus tabel secara permanen dari database...', pilihan: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], jawabanMhs: 'DROP', jawabanBenar: 'DROP', benar: true },
      ],
      esaiSoal: 'Jelaskan apa yang dimaksud dengan normalisasi pada basis data dan sebutkan tujuannya!',
      esaiJawaban: 'Mencegah duplikasi data dengan memecah tabel menjadi beberapa relasi.',
      feedback: 'Cukup baik, namun contoh bentuk normal belum disertakan.'
    },
    { 
      id: 4, 
      nama: 'Fajar Maulana', 
      nim: '231011016', 
      pg: 60, 
      esai: 20, 
      nilai: 80, 
      status: 'Selesai',
      jawabanPG: [
        { no: 1, soal: 'Perintah SQL untuk mengambil data dari tabel adalah...', pilihan: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'], jawabanMhs: 'SELECT', jawabanBenar: 'SELECT', benar: true },
        { no: 2, soal: 'Bentuk normal yang menghilangkan ketergantungan parsial adalah...', pilihan: ['1NF', '2NF', '3NF', 'BCNF'], jawabanMhs: '1NF', jawabanBenar: '2NF', benar: false },
        { no: 3, soal: 'Constraint untuk memastikan nilai unik pada kolom adalah...', pilihan: ['PRIMARY KEY', 'UNIQUE', 'FOREIGN KEY', 'CHECK'], jawabanMhs: 'UNIQUE', jawabanBenar: 'UNIQUE', benar: true },
        { no: 4, soal: 'Perintah untuk menghapus tabel secara permanen dari database...', pilihan: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], jawabanMhs: 'DROP', jawabanBenar: 'DROP', benar: true },
      ],
      esaiSoal: 'Jelaskan apa yang dimaksud dengan normalisasi pada basis data dan sebutkan tujuannya!',
      esaiJawaban: 'Tujuan utamanya adalah menghindari anomali insert, update, dan delete pada basis data relasional.',
      feedback: 'Penjelasan esai sangat tepat sasaran.'
    },
    { 
      id: 5, 
      nama: 'Nadia Rahma', 
      nim: '231011024', 
      pg: 80, 
      esai: 10, 
      nilai: 90, 
      status: 'Selesai',
      jawabanPG: [
        { no: 1, soal: 'Perintah SQL untuk mengambil data dari tabel adalah...', pilihan: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'], jawabanMhs: 'SELECT', jawabanBenar: 'SELECT', benar: true },
        { no: 2, soal: 'Bentuk normal yang menghilangkan ketergantungan parsial adalah...', pilihan: ['1NF', '2NF', '3NF', 'BCNF'], jawabanMhs: '2NF', jawabanBenar: '2NF', benar: true },
        { no: 3, soal: 'Constraint untuk memastikan nilai unik pada kolom adalah...', pilihan: ['PRIMARY KEY', 'UNIQUE', 'FOREIGN KEY', 'CHECK'], jawabanMhs: 'UNIQUE', jawabanBenar: 'UNIQUE', benar: true },
        { no: 4, soal: 'Perintah untuk menghapus tabel secara permanen dari database...', pilihan: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], jawabanMhs: 'DROP', jawabanBenar: 'DROP', benar: true },
      ],
      esaiSoal: 'Jelaskan apa yang dimaksud dengan normalisasi pada basis data dan sebutkan tujuannya!',
      esaiJawaban: 'Proses pembentukan struktur tabel agar efisien dan konsisten.',
      feedback: 'Pemahaman konsep dasar sudah baik.'
    },
    { 
      id: 6, 
      nama: 'Siti Aisyah', 
      nim: '231011029', 
      pg: 80, 
      esai: 15, 
      nilai: 95, 
      status: 'Selesai',
      jawabanPG: [
        { no: 1, soal: 'Perintah SQL untuk mengambil data dari tabel adalah...', pilihan: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'], jawabanMhs: 'SELECT', jawabanBenar: 'SELECT', benar: true },
        { no: 2, soal: 'Bentuk normal yang menghilangkan ketergantungan parsial adalah...', pilihan: ['1NF', '2NF', '3NF', 'BCNF'], jawabanMhs: '2NF', jawabanBenar: '2NF', benar: true },
        { no: 3, soal: 'Constraint untuk memastikan nilai unik pada kolom adalah...', pilihan: ['PRIMARY KEY', 'UNIQUE', 'FOREIGN KEY', 'CHECK'], jawabanMhs: 'UNIQUE', jawabanBenar: 'UNIQUE', benar: true },
        { no: 4, soal: 'Perintah untuk menghapus tabel secara permanen dari database...', pilihan: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], jawabanMhs: 'DROP', jawabanBenar: 'DROP', benar: true },
      ],
      esaiSoal: 'Jelaskan apa yang dimaksud dengan normalisasi pada basis data dan sebutkan tujuannya!',
      esaiJawaban: 'Menghilangkan ketergantungan parsial dan transitif melalui tahapan 1NF, 2NF, hingga 3NF.',
      feedback: 'Sangat komprehensif dan terstruktur dengan baik.'
    },
  ]);

  // Selected student for viewing answers & grading essay
  const [selectedStudent, setSelectedStudent] = useState(mahasiswaList[0]);
  const [esaiInput, setEsaiInput] = useState(selectedStudent.esai.toString());
  const [feedbackInput, setFeedbackInput] = useState(selectedStudent.feedback);
  const [isSaved, setIsSaved] = useState(false);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setEsaiInput(student.esai.toString());
    setFeedbackInput(student.feedback);
    setIsSaved(false);
  };

  const handleSaveEsaiGrade = (e) => {
    e.preventDefault();
    const newEsaiScore = parseInt(esaiInput) || 0;
    const newTotalNilai = selectedStudent.pg + newEsaiScore;

    setMahasiswaList(prev => prev.map(m => {
      if (m.id === selectedStudent.id) {
        return {
          ...m,
          esai: newEsaiScore,
          nilai: newTotalNilai,
          feedback: feedbackInput
        };
      }
      return m;
    }));

    setSelectedStudent(prev => ({
      ...prev,
      esai: newEsaiScore,
      nilai: newTotalNilai,
      feedback: feedbackInput
    }));

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Toggle Sorting Nama (A-Z <-> Z-A)
  const handleToggleSortNama = () => {
    setSortOption(prev => prev === 'nama-az' ? 'nama-za' : 'nama-az');
    setCurrentPage(1);
  };

  // Toggle Sorting Nilai (Tertinggi -> Terendah -> A-Z)
  const handleToggleSortNilai = () => {
    setSortOption(prev => {
      if (prev === 'nilai-tinggi') return 'nilai-rendah';
      if (prev === 'nilai-rendah') return 'nama-az';
      return 'nilai-tinggi';
    });
    setCurrentPage(1);
  };

  // Filter & Sort Mahasiswa
  const filteredMahasiswa = mahasiswaList.filter(m => 
    m.nama.toLowerCase().includes(searchQuery.toLowerCase()) || m.nim.includes(searchQuery)
  ).sort((a, b) => {
    if (sortOption === 'nama-az') {
      return a.nama.localeCompare(b.nama);
    } else if (sortOption === 'nama-za') {
      return b.nama.localeCompare(a.nama);
    } else if (sortOption === 'nilai-tinggi') {
      return b.nilai - a.nilai;
    } else if (sortOption === 'nilai-rendah') {
      return a.nilai - b.nilai;
    }
    return 0;
  });

  // Pagination Calculation
  const totalPages = Math.max(1, Math.ceil(filteredMahasiswa.length / itemsPerPage));
  const paginatedMahasiswa = filteredMahasiswa.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Distribusi Nilai
  const distribusiNilai = [
    { rentang: '90–100', jumlah: '12 mhs', persentase: 37.5 },
    { rentang: '80–89', jumlah: '11 mhs', persentase: 34.4 },
    { rentang: '70–79', jumlah: '5 mhs', persentase: 15.6 },
    { rentang: '< 70', jumlah: '4 mhs', persentase: 12.5 },
  ];

  return (
    <div className="space-y-6">
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
            Basis Data · TI-3A · 22 Oktober 2026, 09.00–12.00 WIB · 4 PG & 1 Esai
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

      {/* Grid Layout: Kiri (Tabel Rekap Mahasiswa) vs Kanan (Detail Jawaban PG & Esai) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kolom Kiri: Rekap Mahasiswa */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Rekap mahasiswa</h2>
              <p className="text-xs text-gray-400 mt-0.5">Klik baris mahasiswa untuk melihat jawaban PG, Esai, dan penilaian.</p>
            </div>

            {/* Search & Sorting Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Cari nama / NIM..."
                  className="w-full bg-white border border-gray-200/90 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Tombol Sorting Nilai */}
                <button 
                  type="button" 
                  onClick={handleToggleSortNilai}
                  className={`flex items-center gap-1.5 border px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                    sortOption.includes('nilai') 
                      ? 'bg-[#EEF2FF] border-indigo-200 text-[#4F46E5] font-semibold' 
                      : 'bg-white border-gray-200/90 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {sortOption === 'nilai-tinggi' ? 'Nilai Tertinggi' : sortOption === 'nilai-rendah' ? 'Nilai Terendah' : 'Semua nilai'}
                  </span>
                </button>

                {/* Tombol Sorting Nama */}
                <button 
                  type="button" 
                  onClick={handleToggleSortNama}
                  className={`flex items-center gap-1.5 border px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                    sortOption.includes('nama') 
                      ? 'bg-[#EEF2FF] border-indigo-200 text-[#4F46E5] font-semibold' 
                      : 'bg-white border-gray-200/90 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  <span>{sortOption === 'nama-za' ? 'Nama Z-A' : 'Nama A-Z'}</span>
                </button>
              </div>
            </div>

            {/* Tabel Rekap Mahasiswa */}
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-100/90 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                    <th className="pb-3 pr-4 font-semibold">MAHASISWA</th>
                    <th className="pb-3 px-3 font-semibold text-center">PG / 80</th>
                    <th className="pb-3 px-3 font-semibold text-center">ESAI / 20</th>
                    <th className="pb-3 px-3 font-semibold text-center">NILAI</th>
                    <th className="pb-3 pl-3 font-semibold text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/80">
                  {paginatedMahasiswa.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-400">
                        Tidak ada mahasiswa yang ditemukan.
                      </td>
                    </tr>
                  ) : (
                    paginatedMahasiswa.map((m) => {
                      const isSelected = selectedStudent.id === m.id;
                      return (
                        <tr 
                          key={m.id} 
                          onClick={() => handleSelectStudent(m)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-[#EEF2FF]/60 hover:bg-[#EEF2FF]/80' : 'hover:bg-gray-50/50'
                          }`}
                        >
                          <td className="py-3.5 pr-4">
                            <p className={`font-bold text-xs ${isSelected ? 'text-[#4F46E5]' : 'text-gray-900'}`}>{m.nama}</p>
                            <p className="text-gray-400 text-[11px] mt-0.5">{m.nim}</p>
                          </td>
                          <td className="py-3.5 px-3 text-center font-medium text-gray-700">{m.pg}</td>
                          <td className="py-3.5 px-3 text-center font-medium text-gray-700">{m.esai}</td>
                          <td className="py-3.5 px-3 text-center font-bold text-gray-900">{m.nilai}</td>
                          <td className="py-3.5 pl-3 text-center whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#EAF8F1] text-[#10B981]">
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Fungsional */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 pt-3 border-t border-gray-50">
              <p className="text-[11px]">
                Menampilkan {filteredMahasiswa.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredMahasiswa.length)} dari {filteredMahasiswa.length} mahasiswa
              </p>
              <div className="flex items-center gap-1.5">
                <button 
                  type="button" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Sebelumnya
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button 
                    key={p} 
                    type="button" 
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold cursor-pointer ${
                      currentPage === p ? 'bg-[#4F46E5] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button 
                  type="button" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Berikutnya
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Kolom Kanan: Detail Soal, Jawaban PG, Jawaban Esai, & Form Penilaian */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card 1: Review Jawaban Pilihan Ganda (PG) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">{selectedStudent.nama} — Jawaban Pilihan Ganda</h3>
              <p className="text-xs text-gray-400 mt-0.5">Skor PG: {selectedStudent.pg} / 80</p>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {selectedStudent.jawabanPG.map((pgItem) => (
                <div key={pgItem.no} className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-gray-800">Soal {pgItem.no}: {pgItem.soal}</p>
                    {pgItem.benar ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold shrink-0 text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" /> Benar (+20)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-600 font-semibold shrink-0 text-[11px]">
                        <XCircle className="w-3.5 h-3.5" /> Salah (0)
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-600 space-y-0.5 pt-1">
                    <p><span className="font-semibold">Jawaban Mahasiswa:</span> <span className={pgItem.benar ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>{pgItem.jawabanMhs}</span></p>
                    {!pgItem.benar && (
                      <p><span className="font-semibold">Kunci Jawaban:</span> <span className="text-emerald-700 font-bold">{pgItem.jawabanBenar}</span></p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Review & Penilaian Esai */}
          <form onSubmit={handleSaveEsaiGrade} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Jawaban & Penilaian Esai</h3>
              <p className="text-xs text-gray-400 mt-0.5">Skor Esai (Maksimal 20 poin)</p>
            </div>

            <div className="p-3 bg-[#f8f9fa] border border-gray-100 rounded-xl space-y-1.5 text-xs">
              <p className="font-bold text-gray-700">Soal Esai:</p>
              <p className="text-gray-600 italic">"{selectedStudent.esaiSoal}"</p>
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-bold text-gray-700">Jawaban Mahasiswa:</p>
              <p className="text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                {selectedStudent.esaiJawaban}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">Nilai Esai (0–20)</label>
                <input 
                  type="number"
                  min="0"
                  max="20"
                  value={esaiInput}
                  onChange={(e) => setEsaiInput(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">Feedback Esai</label>
                <input 
                  type="text"
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Catatan untuk mahasiswa..."
                  className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                />
              </div>
            </div>

            <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-3 flex items-center gap-2.5 text-xs text-gray-500">
              <Info className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Nilai akhir otomatis menjadi: <strong>{parseInt(esaiInput || 0) + selectedStudent.pg}</strong> (PG + Esai).</span>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Nilai esai & feedback disimpan!</span>
                </>
              ) : (
                <span>Simpan & perbarui nilai akhir</span>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

export default HasilKuisDosen;