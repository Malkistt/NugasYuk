import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarDosen from '../components/SidebarDosen';
import NavbarDosen from '../components/NavbarDosen';
import { 
  Plus, 
  Clock, 
  Calendar, 
  ExternalLink, 
  ChevronDown, 
  Check,
  Copy,
  Trash2
} from 'lucide-react';
import { getSystemDateIndonesian } from '../utils/dateHelper';

const KelolaKuisDosen = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pertemuanAktif, setPertemuanAktif] = useState(7);
  const totalPertemuan = 16;
  const [systemDate] = useState(() => getSystemDateIndonesian());

  // Kuis yang sedang diedit (Default: Kuis Relasi & JOIN)
  const [selectedQuizId, setSelectedQuizId] = useState(2);
  const [activeQuestionId, setActiveQuestionId] = useState(1);
  const [autoGrading, setAutoGrading] = useState(true);

  // Form Fields Kuis
  const [judulKuis, setJudulKuis] = useState('Kuis Relasi & JOIN');
  const [durasi, setDurasi] = useState('30 menit');
  const [mataKuliah, setMataKuliah] = useState('IF203 · Basis Data — TI-3A (32 mahasiswa)');
  const [waktuBuka, setWaktuBuka] = useState('29 Okt 2026, 09.00 WIB');
  const [waktuTutup, setWaktuTutup] = useState('29 Okt 2026, 12.00 WIB');

  // Soal 1 (Pilihan Ganda)
  const [soal1Bobot, setSoal1Bobot] = useState('20 poin');
  const [soal1Tanya, setSoal1Tanya] = useState('Jenis JOIN apa yang hanya menampilkan baris dengan nilai cocok pada kedua tabel?');
  const [soal1Kunci, setSoal1Kunci] = useState('A');

  // Soal 5 (Esai)
  const [soal5Bobot, setSoal5Bobot] = useState('20 poin');
  const [soal5Panduan, setSoal5Panduan] = useState('Konsep 10 poin · Ketepatan query 10 poin');
  const [soal5Tanya, setSoal5Tanya] = useState(
    'Jelaskan perbedaan INNER JOIN dan LEFT JOIN. Berikan contoh query untuk menampilkan semua anggota perpustakaan, termasuk yang belum pernah meminjam buku.'
  );

  const [isSaved, setIsSaved] = useState(false);

  // Daftar Kuis di Kolom Kiri
  const daftarKuis = [
    {
      id: 1,
      judul: 'Kuis Normalisasi',
      status: 'Aktif',
      statusCode: 'aktif',
      jadwal: '24 Okt · 09.00–12.00',
      progress: '12/32 memulai',
      badgeClass: 'bg-[#EAF8F1] text-[#10B981]'
    },
    {
      id: 2,
      judul: 'Kuis Relasi & JOIN',
      status: 'Terjadwal',
      statusCode: 'terjadwal',
      jadwal: '29 Okt · 09.00–12.00',
      progress: 'Belum dibuka',
      badgeClass: 'bg-[#EEF2FF] text-[#4F46E5]'
    },
    {
      id: 3,
      judul: 'Kuis Dasar SQL',
      status: 'Selesai',
      statusCode: 'selesai',
      jadwal: '22 Okt · 09.00–12.00',
      progress: '32/32 selesai',
      badgeClass: 'bg-gray-100 text-gray-600'
    }
  ];

  // Navigasi Soal
  const navigasiSoal = [
    { id: 1, label: '1 - Jenis JOIN', tipe: 'PG' },
    { id: 2, label: '2 - Relasi antartabel', tipe: 'PG' },
    { id: 3, label: '3 - Klausa ON', tipe: 'PG' },
    { id: 4, label: '4 - Hasil LEFT JOIN', tipe: 'PG' },
    { id: 5, label: '5 - Analisis query', tipe: 'Esai' },
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

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
              <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
                Kelola kuis
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Susun soal, atur jadwal, dan tentukan skema penilaian.
              </p>
            </div>

            <button 
              type="button"
              onClick={() => {
                setJudulKuis('Kuis Baru');
                setDurasi('30 menit');
              }}
              className="inline-flex items-center justify-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Buat kuis</span>
            </button>
          </div>

          {/* Grid Layout 2 Kolom: Kiri (Daftar & Navigasi) vs Kanan (Editor Kuis) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Kolom Kiri: Daftar Kuis & Navigasi Soal */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Card 1: Daftar Kuis */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Daftar kuis</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Basis Data · TI-3A</p>
                </div>

                <div className="space-y-3">
                  {daftarKuis.map((kuis) => {
                    const isSelected = selectedQuizId === kuis.id;
                    return (
                      <div 
                        key={kuis.id}
                        onClick={() => setSelectedQuizId(kuis.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-[#4F46E5] bg-[#EEF2FF]/30 shadow-2xs' 
                            : 'border-gray-100 bg-[#f8f9fa] hover:border-gray-200'
                        }`}
                      >
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${kuis.badgeClass}`}>
                          {kuis.status}
                        </span>

                        <h3 className="text-xs font-bold text-gray-900 mt-2">{kuis.judul}</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">{kuis.jadwal}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{kuis.progress}</p>

                        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-100 text-xs font-semibold text-[#4F46E5]">
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); setSelectedQuizId(kuis.id); }}
                            className="hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300">·</span>
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); navigate('/kuis/hasil'); }}
                            className="hover:underline cursor-pointer"
                          >
                            Hasil
                          </button>
                          <span className="text-gray-300">·</span>
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); alert(`Hapus ${kuis.judul}`); }}
                            className="text-gray-400 hover:text-red-600 hover:underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card 2: Navigasi Soal */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
                <h2 className="text-sm font-bold text-gray-900">Navigasi soal</h2>

                <div className="space-y-1.5">
                  {navigasiSoal.map((soal) => {
                    const isActive = activeQuestionId === soal.id;
                    return (
                      <button
                        key={soal.id}
                        type="button"
                        onClick={() => setActiveQuestionId(soal.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{soal.label}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{soal.tipe}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Kolom Kanan: Editor Kuis & Daftar Soal */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Card 1: Pengaturan Editor Kuis */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h2 className="text-sm font-bold text-gray-900">Editor: {judulKuis}</h2>
                  <button type="button" className="text-xs font-semibold text-[#4F46E5] hover:underline inline-flex items-center gap-1 cursor-pointer">
                    <span>Pratinjau kuis</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Form Row: Judul Kuis & Durasi */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">Judul kuis</label>
                    <input 
                      type="text" 
                      value={judulKuis}
                      onChange={(e) => setJudulKuis(e.target.value)}
                      className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">Durasi</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={durasi}
                        onChange={(e) => setDurasi(e.target.value)}
                        className="w-full bg-white border border-gray-200/90 rounded-xl pl-4 pr-9 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                      />
                      <Clock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Mata Kuliah / Kelas */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Mata kuliah / kelas</label>
                  <div className="relative">
                    <select
                      value={mataKuliah}
                      onChange={(e) => setMataKuliah(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                    >
                      <option value="IF203 · Basis Data — TI-3A (32 mahasiswa)">IF203 · Basis Data — TI-3A (32 mahasiswa)</option>
                      <option value="IF205 · Pemrograman Web — TI-3A (32 mahasiswa)">IF205 · Pemrograman Web — TI-3A (32 mahasiswa)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Waktu Buka & Waktu Tutup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">Waktu buka</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={waktuBuka}
                        onChange={(e) => setWaktuBuka(e.target.value)}
                        className="w-full bg-white border border-gray-200/90 rounded-xl pl-4 pr-9 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">Waktu tutup</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={waktuTutup}
                        onChange={(e) => setWaktuTutup(e.target.value)}
                        className="w-full bg-white border border-gray-200/90 rounded-xl pl-4 pr-9 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Toggle Penilaian Otomatis Box */}
                <div className="p-4 bg-[#EEF2FF]/60 border border-[#E0E7FF] rounded-2xl flex items-start gap-3.5">
                  {/* Switch Button */}
                  <button
                    type="button"
                    onClick={() => setAutoGrading(!autoGrading)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mt-0.5 ${
                      autoGrading ? 'bg-[#4F46E5]' : 'bg-gray-300'
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        autoGrading ? 'translate-x-5' : 'translate-x-0'
                      }`} 
                    />
                  </button>

                  <div className="text-xs leading-relaxed">
                    <p className="font-bold text-gray-900">Penilaian otomatis pilihan ganda aktif</p>
                    <p className="text-gray-500 mt-0.5">
                      4 soal PG × 20 poin = 80 poin. Esai 20 poin dinilai manual. Total nilai maksimal 100.
                    </p>
                  </div>
                </div>

              </div>

              {/* Card 2: Soal 1 · Pilihan Ganda */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-bold text-gray-900">Soal 1 · Pilihan ganda</h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-[#4F46E5]">
                    <button type="button" className="hover:underline inline-flex items-center gap-1 cursor-pointer">
                      <Copy className="w-3 h-3" />
                      <span>Duplikat</span>
                    </button>
                    <span className="text-gray-300">·</span>
                    <button type="button" className="text-gray-400 hover:text-red-600 hover:underline inline-flex items-center gap-1 cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">Tipe soal</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] cursor-pointer">
                        <option>Pilihan ganda</option>
                        <option>Esai</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700">Bobot</label>
                    <input 
                      type="text" 
                      value={soal1Bobot}
                      onChange={(e) => setSoal1Bobot(e.target.value)}
                      className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                </div>

                {/* Pertanyaan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Pertanyaan</label>
                  <input 
                    type="text" 
                    value={soal1Tanya}
                    onChange={(e) => setSoal1Tanya(e.target.value)}
                    className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>

                {/* Opsi Pilihan Jawaban */}
                <div className="space-y-2 pt-1">
                  {/* Opsi A (Kunci Jawaban) */}
                  <div 
                    onClick={() => setSoal1Kunci('A')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      soal1Kunci === 'A' 
                        ? 'bg-[#EAF8F1] border-[#C6ECD6] text-[#065F46]' 
                        : 'bg-white border-gray-200/80 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs font-medium">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        soal1Kunci === 'A' ? 'border-[#10B981] bg-[#10B981] text-white' : 'border-gray-400'
                      }`}>
                        {soal1Kunci === 'A' && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                      <span className="font-semibold">A. INNER JOIN</span>
                    </div>

                    {soal1Kunci === 'A' && (
                      <span className="text-[11px] font-bold text-[#10B981] bg-white px-2.5 py-0.5 rounded-full border border-[#C6ECD6]">
                        Kunci jawaban
                      </span>
                    )}
                  </div>

                  {/* Opsi B */}
                  <div 
                    onClick={() => setSoal1Kunci('B')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      soal1Kunci === 'B' 
                        ? 'bg-[#EAF8F1] border-[#C6ECD6] text-[#065F46]' 
                        : 'bg-white border-gray-200/80 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs font-medium">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        soal1Kunci === 'B' ? 'border-[#10B981] bg-[#10B981] text-white' : 'border-gray-400'
                      }`}>
                        {soal1Kunci === 'B' && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                      <span>B. LEFT JOIN</span>
                    </div>
                  </div>

                  {/* Opsi C */}
                  <div 
                    onClick={() => setSoal1Kunci('C')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      soal1Kunci === 'C' 
                        ? 'bg-[#EAF8F1] border-[#C6ECD6] text-[#065F46]' 
                        : 'bg-white border-gray-200/80 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs font-medium">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        soal1Kunci === 'C' ? 'border-[#10B981] bg-[#10B981] text-white' : 'border-gray-400'
                      }`}>
                        {soal1Kunci === 'C' && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                      <span>C. RIGHT JOIN</span>
                    </div>
                  </div>

                  {/* Opsi D */}
                  <div 
                    onClick={() => setSoal1Kunci('D')}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      soal1Kunci === 'D' 
                        ? 'bg-[#EAF8F1] border-[#C6ECD6] text-[#065F46]' 
                        : 'bg-white border-gray-200/80 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs font-medium">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        soal1Kunci === 'D' ? 'border-[#10B981] bg-[#10B981] text-white' : 'border-gray-400'
                      }`}>
                        {soal1Kunci === 'D' && <Check className="w-3 h-3 stroke-3" />}
                      </div>
                      <span>D. CROSS JOIN</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Card 3: Soal 5 · Esai */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-bold text-gray-900">Soal 5 · Esai</h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-[#4F46E5]">
                    <button type="button" className="hover:underline inline-flex items-center gap-1 cursor-pointer">
                      <Copy className="w-3 h-3" />
                      <span>Duplikat</span>
                    </button>
                    <span className="text-gray-300">·</span>
                    <button type="button" className="text-gray-400 hover:text-red-600 hover:underline inline-flex items-center gap-1 cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>

                {/* Pertanyaan Esai */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Pertanyaan</label>
                  <textarea 
                    rows={4}
                    value={soal5Tanya}
                    onChange={(e) => setSoal5Tanya(e.target.value)}
                    className="w-full bg-white border border-gray-200/90 rounded-xl p-3.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] leading-relaxed resize-y"
                  />
                </div>

                {/* Bobot & Panduan Penilaian */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">Bobot</label>
                    <input 
                      type="text" 
                      value={soal5Bobot}
                      onChange={(e) => setSoal5Bobot(e.target.value)}
                      className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">Panduan penilaian</label>
                    <input 
                      type="text" 
                      value={soal5Panduan}
                      onChange={(e) => setSoal5Panduan(e.target.value)}
                      className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-gray-400">
                  Jawaban esai diperiksa dan dinilai oleh dosen.
                </p>
              </div>

              {/* Bottom Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button 
                  type="button"
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-gray-400" />
                  <span>Tambah soal</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    type="button"
                    onClick={handleSave}
                    className="w-full sm:w-auto bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Simpan draf
                  </button>
                  <button 
                    type="button"
                    onClick={handleSave}
                    className="w-full sm:w-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {isSaved ? 'Tersimpan & Terjadwal!' : 'Simpan & jadwalkan'}
                  </button>
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

export default KelolaKuisDosen;
