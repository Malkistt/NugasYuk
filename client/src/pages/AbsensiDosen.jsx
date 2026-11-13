import React, { useState } from 'react';
import { 
  Download, 
  Plus, 
  Clock, 
  CheckCircle2, 
  UserCheck, 
  Mail, 
  Search, 
  ArrowUpDown, 
  ChevronDown,
  ArrowRight,
  Check,
  Copy,
  RefreshCw,
  KeyRound,
  FileText,
  AlertTriangle,
  X,
  ExternalLink,
  ShieldCheck,
  Ban
} from 'lucide-react';

const INITIAL_STUDENTS = [
  { 
    id: 1, 
    nama: 'Aditya Pratama', 
    nim: '231011001', 
    waktu: '09.04 WIB', 
    status: 'Hadir', 
    statusCode: 'hadir', 
    rekap: '6/6 hadir',
    pengajuan: null 
  },
  { 
    id: 2, 
    nama: 'Bella Safitri', 
    nim: '231011005', 
    waktu: '09.02 WIB', 
    status: 'Hadir', 
    statusCode: 'hadir', 
    rekap: '5/6 hadir',
    pengajuan: null 
  },
  { 
    id: 3, 
    nama: 'Nadia Rahma', 
    nim: '231011024', 
    waktu: '08.55 WIB (Pengajuan)', 
    status: 'Izin (Menunggu)', 
    statusCode: 'menunggu', 
    rekap: '6/6 hadir',
    pengajuan: {
      jenis: 'Izin',
      alasan: 'Mengikuti kompetisi UI/UX Design tingkat nasional mewakili Universitas Cakrawala di Jakarta.',
      buktiNama: 'Surat_Dispensasi_Dekan_Lomba.pdf',
      buktiUkuran: '1.8 MB',
      waktuKirim: 'Hari ini, 08.55 WIB'
    }
  },
  { 
    id: 4, 
    nama: 'Dimas Saputra', 
    nim: '231011012', 
    waktu: '08.40 WIB (Pengajuan)', 
    status: 'Sakit (Menunggu)', 
    statusCode: 'menunggu', 
    rekap: '5/6 hadir',
    pengajuan: {
      jenis: 'Sakit',
      alasan: 'Mengalami gejala demam tinggi dan radang tenggorokan akut, dokter menyarankan istirahat tirah baring 2 hari.',
      buktiNama: 'Surat_Keterangan_Sakit_Klinik.pdf',
      buktiUkuran: '2.4 MB',
      waktuKirim: 'Hari ini, 08.40 WIB'
    }
  },
  { 
    id: 5, 
    nama: 'Fajar Maulana', 
    nim: '231011016', 
    waktu: '09.03 WIB', 
    status: 'Hadir', 
    statusCode: 'hadir', 
    rekap: '6/6 hadir',
    pengajuan: null 
  },
  { 
    id: 6, 
    nama: 'Asa Mitaka', 
    nim: '231011029', 
    waktu: '08.30 WIB', 
    status: 'Sakit', 
    statusCode: 'sakit', 
    rekap: '5/6 hadir',
    pengajuan: {
      jenis: 'Sakit',
      alasan: 'Pemulihan pasca tindakan medis di RS Medika.',
      buktiNama: 'Surat_Dokter_RSMedika.pdf',
      buktiUkuran: '1.2 MB',
      disetujui: true
    }
  },
  { 
    id: 7, 
    nama: 'Rizky Ramadhan', 
    nim: '231011033', 
    waktu: '09.08 WIB', 
    status: 'Hadir', 
    statusCode: 'hadir', 
    rekap: '6/6 hadir',
    pengajuan: null 
  },
  { 
    id: 8, 
    nama: 'Siti Aisyah', 
    nim: '231011040', 
    waktu: '—', 
    status: 'Belum', 
    statusCode: 'belum', 
    rekap: '6/6 hadir',
    pengajuan: null 
  },
];

const AbsensiDosen = () => {
  // Form Sesi Absensi
  const [isSessionOpen, setIsSessionOpen] = useState(true);
  const [mataKuliah, setMataKuliah] = useState('IF203 · Basis Data — TI-3A');
  const [pertemuanSesi, setPertemuanSesi] = useState('7 dari 16');
  const [batasWaktu, setBatasWaktu] = useState('24 Okt, 09.30 WIB');
  
  // Token Presensi Acak 6 Digit
  const [sessionToken, setSessionToken] = useState('849201');
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  
  // Data Mahasiswa Kehadiran
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  
  // Mahasiswa yang dipilih untuk ubah status manual atau review pengajuan
  const [selectedStudent, setSelectedStudent] = useState(INITIAL_STUDENTS[2]);
  const [selectedStatus, setSelectedStatus] = useState('Hadir');
  const [reasonInput, setReasonInput] = useState('');
  const [isStatusSaved, setIsStatusSaved] = useState(false);
  
  // Modal Verifikasi Izin / Sakit
  const [reviewModalStudent, setReviewModalStudent] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerateRandomToken = () => {
    setIsGeneratingToken(true);
    setTimeout(() => {
      const newToken = Math.floor(100000 + Math.random() * 900000).toString();
      setSessionToken(newToken);
      setIsGeneratingToken(false);
      showToast(`Kode token berhasil diacak: ${newToken}`);
    }, 250);
  };

  const handleCopyToken = () => {
    navigator.clipboard?.writeText(sessionToken);
    setIsCopied(true);
    showToast(`Kode token ${sessionToken} berhasil disalin!`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleApprovePengajuan = (studentId) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const jenis = s.pengajuan?.jenis || 'Izin';
        return {
          ...s,
          status: `${jenis}`,
          statusCode: jenis.toLowerCase(),
          waktu: `${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB (Disetujui)`,
          pengajuan: {
            ...s.pengajuan,
            disetujui: true
          }
        };
      }
      return s;
    }));
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(prev => ({
        ...prev,
        status: prev.pengajuan?.jenis || 'Izin',
        statusCode: (prev.pengajuan?.jenis || 'Izin').toLowerCase(),
        pengajuan: { ...prev.pengajuan, disetujui: true }
      }));
    }
    if (reviewModalStudent?.id === studentId) {
      setReviewModalStudent(null);
    }
    showToast('Pengajuan berhasil disetujui!');
  };

  const handleRejectPengajuan = (studentId) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          status: 'Alpa',
          statusCode: 'alpa',
          waktu: '—',
          pengajuan: {
            ...s.pengajuan,
            ditolak: true,
            disetujui: false
          }
        };
      }
      return s;
    }));
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(prev => ({
        ...prev,
        status: 'Alpa',
        statusCode: 'alpa',
        pengajuan: { ...prev.pengajuan, ditolak: true, disetujui: false }
      }));
    }
    if (reviewModalStudent?.id === studentId) {
      setReviewModalStudent(null);
    }
    showToast('Pengajuan ditolak. Status mahasiswa menjadi Alpa.');
  };

  const handleSelectStudent = (st) => {
    setSelectedStudent(st);
    if (st.statusCode === 'menunggu') {
      setSelectedStatus(st.pengajuan?.jenis || 'Izin');
    } else if (st.statusCode === 'belum') {
      setSelectedStatus('Hadir');
    } else {
      setSelectedStatus(st.status);
    }
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
    showToast(`Status kehadiran ${selectedStudent.nama} berhasil diperbarui.`);
    setTimeout(() => {
      setIsStatusSaved(false);
    }, 1500);
  };

  const hadirCount = students.filter(s => s.statusCode === 'hadir').length;
  const izinCount = students.filter(s => s.statusCode === 'izin').length;
  const sakitCount = students.filter(s => s.statusCode === 'sakit').length;
  const menungguCount = students.filter(s => s.statusCode === 'menunggu').length;
  const belumCount = students.filter(s => s.statusCode === 'belum').length;

  const stats = [
    {
      title: 'Hadir',
      value: hadirCount.toString(),
      subtext: `${Math.round((hadirCount / students.length) * 100)}% dari ${students.length} mahasiswa`,
      icon: UserCheck,
      color: 'text-[#10B981]'
    },
    {
      title: 'Menunggu Persetujuan',
      value: menungguCount.toString(),
      subtext: 'Izin/Sakit butuh verifikasi',
      icon: AlertTriangle,
      color: 'text-[#F59E0B]',
      badge: menungguCount > 0 ? `${menungguCount} Baru` : null
    },
    {
      title: 'Izin & Sakit Disetujui',
      value: (izinCount + sakitCount).toString(),
      subtext: `${izinCount} Izin · ${sakitCount} Sakit`,
      icon: Mail,
      color: 'text-[#4F46E5]'
    },
    {
      title: 'Belum presensi',
      value: belumCount.toString(),
      subtext: isSessionOpen ? 'Sesi ditutup 15 menit lagi' : 'Tercatat Alpa',
      icon: Clock,
      color: 'text-[#D97706]'
    }
  ];

  const filteredStudents = students.filter(s => {
    const matchQuery = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || s.nim.includes(searchQuery);
    if (!matchQuery) return false;
    if (filterStatus === 'menunggu') return s.statusCode === 'menunggu';
    if (filterStatus === 'hadir') return s.statusCode === 'hadir';
    if (filterStatus === 'izin') return s.statusCode === 'izin';
    if (filterStatus === 'sakit') return s.statusCode === 'sakit';
    if (filterStatus === 'belum') return s.statusCode === 'belum';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
            Kelola absensi
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Buka sesi kehadiran, bagikan kode token 6 digit, dan konfirmasi pengajuan izin/sakit mahasiswa.
          </p>
        </div>
        <button 
          type="button"
          onClick={() => showToast('Mengekspor rekap absensi (.xlsx)...')}
          className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200/90 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-gray-400" />
          <span>Ekspor rekap</span>
        </button>
      </div>

      {/* Card Top: Sesi Pertemuan 7 & KODE TOKEN DINAMIS */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Sesi pertemuan 7 · Normalisasi</h2>
            <p className="text-xs text-gray-400 mt-0.5">Basis Data · Kelas TI-3A (32 mahasiswa)</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full self-start sm:self-auto ${
            isSessionOpen ? 'text-[#10B981] bg-[#EAF8F1] border border-[#C6ECD6]' : 'text-gray-600 bg-gray-100'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isSessionOpen ? 'bg-[#10B981] animate-pulse' : 'bg-gray-400'}`}></span>
            {isSessionOpen ? 'Sesi Presensi Terbuka' : 'Sesi Ditutup'}
          </span>
        </div>

        {/* BOX KODE TOKEN 6 DIGIT RANDOM DOSEN */}
        <div className="bg-gradient-to-r from-[#EEF2FF] to-[#F5F3FF] border border-[#C7D2FE] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-indigo-100 flex items-center justify-center text-[#4F46E5] shrink-0">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F46E5] bg-white px-2 py-0.5 rounded-md border border-indigo-100">
                  Kode Token Sesi Kelas
                </span>
                <span className="text-[11px] text-gray-500 hidden sm:inline">
                  (Tampilkan ke mahasiswa)
                </span>
              </div>
              <div className="flex items-baseline gap-3 mt-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-widest text-[#4F46E5] font-mono select-all">
                  {sessionToken}
                </span>
                <span className="text-xs text-gray-500">
                  6 digit dinamis
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Mahasiswa memasukkan 6 digit kode token ini pada layar presensi mereka untuk verifikasi hadir di kelas.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleGenerateRandomToken}
              disabled={isGeneratingToken}
              className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-indigo-200 text-[#4F46E5] text-xs font-semibold py-2.5 px-3.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title="Generate kode token 6 digit baru secara acak"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingToken ? 'animate-spin' : ''}`} />
              <span>Acak Kode</span>
            </button>
            <button
              type="button"
              onClick={handleCopyToken}
              className="flex items-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-3.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Salin kode token ke papan klip"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Tersalin' : 'Salin Kode'}</span>
            </button>
          </div>
        </div>

        {/* Form Kontrol Sesi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end pt-1">
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
          
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={() => showToast('Membuka sesi presensi baru...')}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold py-2.5 px-3 rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Buka sesi baru</span>
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsSessionOpen(!isSessionOpen);
                showToast(isSessionOpen ? 'Sesi presensi ditutup.' : 'Sesi presensi dibuka kembali.');
              }}
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
            <p className="font-bold text-[#065F46]">Sesi presensi berlangsung · 09.00–09.30 WIB</p>
            <p className="text-[#047857] mt-0.5">
              Mahasiswa presensi mandiri dengan token 6 digit. Mahasiswa yang tidak hadir dapat mengajukan Izin/Sakit dengan mengunggah bukti surat, dan statusnya menunggu persetujuan Anda di bawah.
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
                <div className="flex items-center gap-1.5">
                  {stat.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 animate-pulse">
                      {stat.badge}
                    </span>
                  )}
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
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
        {/* Kolom Kiri: Kehadiran Mahasiswa & Pengajuan Menunggu */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Kehadiran mahasiswa</h2>
                <p className="text-xs text-gray-400 mt-0.5">Pertemuan 7 · 24 Oktober 2026</p>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setFilterStatus('semua')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    filterStatus === 'semua' ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Semua ({students.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('menunggu')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    filterStatus === 'menunggu' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  <span>Menunggu</span>
                  <span className="font-bold bg-white/30 px-1.5 py-0.2 rounded-full text-[10px]">
                    {menungguCount}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('hadir')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    filterStatus === 'hadir' ? 'bg-[#10B981] text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  Hadir ({hadirCount})
                </button>
              </div>
            </div>

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
                <button 
                  type="button" 
                  onClick={() => setFilterStatus(prev => prev === 'menunggu' ? 'semua' : 'menunggu')}
                  className={`flex items-center gap-1.5 border px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                    filterStatus === 'menunggu' ? 'bg-amber-500 text-white border-amber-600' : 'bg-white border-gray-200/90 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{filterStatus === 'menunggu' ? 'Lihat Semua' : 'Butuh Konfirmasi'}</span>
                </button>
                <button type="button" className="flex items-center gap-1.5 bg-white border border-gray-200/90 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  <span>Nama A-Z</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left text-xs min-w-[560px]">
                <thead>
                  <tr className="border-b border-gray-100/90 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                    <th className="pb-3 pr-4 font-semibold">MAHASISWA</th>
                    <th className="pb-3 px-4 font-semibold text-center">WAKTU</th>
                    <th className="pb-3 px-4 font-semibold text-center">STATUS</th>
                    <th className="pb-3 px-4 font-semibold text-center">AKSI / BUKTI</th>
                    <th className="pb-3 pl-4 font-semibold text-right">REKAP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/80">
                  {filteredStudents.map((s) => {
                    const isSelected = selectedStudent?.id === s.id;
                    const hasPending = s.statusCode === 'menunggu';
                    return (
                      <tr 
                        key={s.id} 
                        onClick={() => handleSelectStudent(s)}
                        className={`cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-[#EEF2FF]/60 hover:bg-[#EEF2FF]/80' 
                            : hasPending
                              ? 'bg-amber-50/40 hover:bg-amber-50/70'
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
                          {hasPending ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#FEF3C7] text-[#B45309] border border-amber-200">
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              <span>{s.status}</span>
                            </span>
                          ) : (
                            <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                              s.statusCode === 'hadir' ? 'bg-[#EAF8F1] text-[#10B981]' :
                              s.statusCode === 'izin' ? 'bg-[#FEF3C7] text-[#D97706]' :
                              s.statusCode === 'sakit' ? 'bg-[#FEE2E2] text-[#DC2626]' :
                              s.statusCode === 'alpa' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {s.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {s.pengajuan ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReviewModalStudent(s);
                              }}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                                hasPending
                                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                                  : 'bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5]'
                              }`}
                            >
                              <FileText className="w-3 h-3" />
                              <span>{hasPending ? 'Periksa Surat' : 'Lihat Surat'}</span>
                            </button>
                          ) : (
                            <span className="text-gray-300 text-[11px]">—</span>
                          )}
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

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 pt-3 border-t border-gray-50">
              <p className="text-[11px]">Menampilkan {filteredStudents.length} dari {students.length} mahasiswa</p>
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

        {/* Kolom Kanan: Verifikasi Pengajuan Izin / Ubah Manual & Rekap */}
        <div className="lg:col-span-4 space-y-6">
          {selectedStudent?.pengajuan && (
            <div className="bg-white rounded-2xl border-2 border-amber-200/90 p-5 sm:p-6 shadow-[0_2px_8px_rgba(245,158,11,0.08)] space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      {selectedStudent.statusCode === 'menunggu' ? 'Pengajuan Menunggu Konfirmasi' : 'Arsip Bukti Pengajuan'}
                    </h3>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">
                      {selectedStudent.nama} · {selectedStudent.nim}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {selectedStudent.pengajuan.jenis}
                </span>
              </div>
              
              <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 text-xs space-y-1">
                <p className="font-semibold text-amber-900">Alasan ketidakhadiran:</p>
                <p className="text-gray-700 leading-relaxed italic">
                  "{selectedStudent.pengajuan.alasan}"
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-2 bg-gray-50/60">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-5 h-5 text-red-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {selectedStudent.pengajuan.buktiNama}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {selectedStudent.pengajuan.buktiUkuran || 'PDF Document'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewModalStudent(selectedStudent)}
                  className="text-xs font-semibold text-[#4F46E5] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>Lihat</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {selectedStudent.statusCode === 'menunggu' ? (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleRejectPengajuan(selectedStudent.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold py-2 px-3 rounded-xl transition-colors cursor-pointer"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Tolak</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApprovePengajuan(selectedStudent.id)}
                    className="flex-2 flex items-center justify-center gap-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold py-2 px-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Setujui {selectedStudent.pengajuan.jenis}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-[#065F46] bg-[#EAF8F1] border border-[#C6ECD6] p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Pengajuan telah disetujui dosen.</span>
                </div>
              )}
            </div>
          )}

          {/* Card 2: Ubah Status Manual */}
          <form onSubmit={handleSaveStatus} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Ubah status manual</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {selectedStudent ? `${selectedStudent.nama} · ${selectedStudent.nim}` : 'Pilih mahasiswa dari tabel'}
              </p>
            </div>
            
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

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">Catatan perubahan</label>
              <input 
                type="text"
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Tambahkan alasan atau nomor surat..."
                className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5]"
              />
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {isStatusSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Status berhasil disimpan!</span>
                </>
              ) : (
                <span>Simpan status kehadiran</span>
              )}
            </button>
          </form>

          {/* Card 3: Rekap Semester */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Rekap semester</h3>
              <p className="text-xs text-gray-400 mt-0.5">6 pertemuan yang sudah selesai</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#4F46E5] tracking-tight">91%</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Rata-rata kehadiran Basis Data dari 192 catatan kehadiran mahasiswa.
              </p>
            </div>
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800">174 Hadir · 10 Izin</p>
              <p className="font-semibold text-gray-800">4 Sakit · 4 Alpa</p>
            </div>
            <button 
              type="button" 
              onClick={() => showToast('Mengunduh rekap semester (.xlsx)...')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] hover:underline pt-1 cursor-pointer"
            >
              <span>Unduh rekap semester (.xlsx)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL VERIFIKASI PENGISIAN SURAT IZIN / SAKIT MAHASISWA */}
      {reviewModalStudent && reviewModalStudent.pengajuan && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Verifikasi Surat Pengajuan {reviewModalStudent.pengajuan.jenis}
                  </h3>
                  <p className="text-[11px] text-gray-400">Pertemuan 7 · Basis Data (TI-3A)</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setReviewModalStudent(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Nama Mahasiswa:</span>
                <span className="font-bold text-gray-900">{reviewModalStudent.nama}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">NIM:</span>
                <span className="font-medium text-gray-700">{reviewModalStudent.nim}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Jenis Keterangan:</span>
                <span className="font-bold text-[#4F46E5]">{reviewModalStudent.pengajuan.jenis}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Waktu Diajukan:</span>
                <span className="text-gray-600">{reviewModalStudent.pengajuan.waktuKirim || 'Hari ini'}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-gray-700">Alasan ketidakhadiran:</span>
              <p className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-gray-800 italic leading-relaxed">
                "{reviewModalStudent.pengajuan.alasan}"
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-gray-700">Dokumen bukti yang diunggah:</span>
              <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-xs">{reviewModalStudent.pengajuan.buktiNama}</p>
                    <p className="text-[11px] text-gray-400">{reviewModalStudent.pengajuan.buktiUkuran || '2.1 MB'} · Dokumen Terverifikasi Digital</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Membuka berkas: ${reviewModalStudent.pengajuan.buktiNama}`)}
                  className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-[#4F46E5] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Buka Berkas
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setReviewModalStudent(null)}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => handleRejectPengajuan(reviewModalStudent.id)}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-semibold text-red-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Tolak Pengajuan</span>
              </button>
              <button
                type="button"
                onClick={() => handleApprovePengajuan(reviewModalStudent.id)}
                className="px-5 py-2 bg-[#10B981] hover:bg-[#059669] text-xs font-semibold text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Setujui {reviewModalStudent.pengajuan.jenis}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbsensiDosen;