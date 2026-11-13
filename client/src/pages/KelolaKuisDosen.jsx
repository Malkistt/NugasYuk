import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  Clock, 
  ExternalLink, 
  ChevronDown, 
  Check,
  Copy,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { getSystemDateIndonesian } from '../utils/dateHelper';

// ---------- Konstanta & helper ----------
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const OPSI_HURUF = ['A', 'B', 'C', 'D'];
const TIPE_LABEL = { pg: 'Pilihan ganda', esai: 'Esai' };
const TIPE_SHORT = { pg: 'PG', esai: 'Esai' };
const MATA_KULIAH = [
  'IF203 · Basis Data — TI-3A (32 mahasiswa)',
  'IF205 · Pemrograman Web — TI-3A (32 mahasiswa)'
];
const STATUS_BADGE = {
  Aktif: 'bg-[#EAF8F1] text-[#10B981]',
  Terjadwal: 'bg-[#EEF2FF] text-[#4F46E5]',
  Selesai: 'bg-gray-100 text-gray-600',
  Draf: 'bg-amber-50 text-amber-600'
};

// "2026-10-29T09:00" -> { y, m, d, h, mi }
const parseLocal = (v) => {
  if (!v) return null;
  const [tgl, jam = '00:00'] = v.split('T');
  const [y, m, d] = tgl.split('-').map(Number);
  const [h, mi] = jam.split(':');
  return { y, m, d, h, mi };
};

const formatJadwal = (buka, tutup) => {
  const a = parseLocal(buka);
  const b = parseLocal(tutup);
  if (!a && !b) return 'Jadwal belum diatur';
  if (a && !b) return `${a.d} ${BULAN[a.m - 1]} · ${a.h}.${a.mi}`;
  if (!a && b) return `Ditutup ${b.d} ${BULAN[b.m - 1]} · ${b.h}.${b.mi}`;
  if (a.y === b.y && a.m === b.m && a.d === b.d) {
    return `${a.d} ${BULAN[a.m - 1]} · ${a.h}.${a.mi}–${b.h}.${b.mi}`;
  }
  return `${a.d} ${BULAN[a.m - 1]} ${a.h}.${a.mi} – ${b.d} ${BULAN[b.m - 1]} ${b.h}.${b.mi}`;
};

const DURASI_PRESET = [15, 30, 45, 60, 90, 120];
const DURASI_MAKS = 600;

const formatDurasi = (m) => {
  const n = Number(m) || 0;
  if (n < 60) return `${n} menit`;
  const jam = Math.floor(n / 60);
  const sisa = n % 60;
  return sisa ? `${jam} jam ${sisa} menit` : `${jam} jam`;
};

const buatSoal = (id, tipe) => ({
  id,
  tipe,
  bobot: 20,
  tanya: '',
  opsi: ['', '', '', ''],
  kunci: 0,
  panduan: ''
});

const sumBobot = (list) => list.reduce((acc, s) => acc + (Number(s.bobot) || 0), 0);

// ---------- Data awal ----------
const DATA_AWAL = [
  {
    id: 1,
    judul: 'Kuis Normalisasi',
    status: 'Aktif',
    progress: '12/32 memulai',
    durasi: 30,
    mataKuliah: MATA_KULIAH[0],
    waktuBuka: '2026-10-24T09:00',
    waktuTutup: '2026-10-24T12:00',
    autoGrading: true,
    questions: [
      { id: 11, tipe: 'pg', bobot: 50, tanya: 'Apa syarat utama bentuk normal pertama (1NF)?', opsi: ['Tidak ada atribut bernilai ganda', 'Tidak ada ketergantungan transitif', 'Setiap tabel memiliki foreign key', 'Semua atribut bergantung parsial'], kunci: 0, panduan: '' },
      { id: 12, tipe: 'pg', bobot: 50, tanya: 'Tujuan utama normalisasi basis data adalah...', opsi: ['Mengurangi redundansi data', 'Menambah jumlah tabel sebanyak mungkin', 'Menghapus primary key', 'Mempercepat koneksi jaringan'], kunci: 0, panduan: '' }
    ]
  },
  {
    id: 2,
    judul: 'Kuis Relasi & JOIN',
    status: 'Terjadwal',
    progress: 'Belum dibuka',
    durasi: 30,
    mataKuliah: MATA_KULIAH[0],
    waktuBuka: '2026-10-29T09:00',
    waktuTutup: '2026-10-29T12:00',
    autoGrading: true,
    questions: [
      { id: 1, tipe: 'pg', bobot: 20, tanya: 'Jenis JOIN apa yang hanya menampilkan baris dengan nilai cocok pada kedua tabel?', opsi: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN'], kunci: 0, panduan: '' },
      { id: 2, tipe: 'pg', bobot: 20, tanya: 'Apa fungsi foreign key dalam relasi antartabel?', opsi: ['Menjamin keunikan setiap baris', 'Menghubungkan baris ke primary key tabel lain', 'Mempercepat pencarian dengan indeks', 'Mengurutkan data secara otomatis'], kunci: 1, panduan: '' },
      { id: 3, tipe: 'pg', bobot: 20, tanya: 'Klausa apa yang menentukan kondisi penggabungan pada JOIN?', opsi: ['WHERE', 'GROUP BY', 'ON', 'HAVING'], kunci: 2, panduan: '' },
      { id: 4, tipe: 'pg', bobot: 20, tanya: 'Pada LEFT JOIN, apa yang terjadi jika baris tabel kiri tidak punya pasangan di tabel kanan?', opsi: ['Baris dihapus dari hasil', 'Baris tetap tampil dengan NULL di kolom tabel kanan', 'Query menghasilkan error', 'Baris tampil dengan nilai 0'], kunci: 1, panduan: '' },
      { id: 5, tipe: 'esai', bobot: 20, tanya: 'Jelaskan perbedaan INNER JOIN dan LEFT JOIN. Berikan contoh query untuk menampilkan semua anggota perpustakaan, termasuk yang belum pernah meminjam buku.', opsi: ['', '', '', ''], kunci: 0, panduan: 'Konsep 10 poin · Ketepatan query 10 poin' }
    ]
  },
  {
    id: 3,
    judul: 'Kuis Dasar SQL',
    status: 'Selesai',
    progress: '32/32 selesai',
    durasi: 30,
    mataKuliah: MATA_KULIAH[0],
    waktuBuka: '2026-10-22T09:00',
    waktuTutup: '2026-10-22T12:00',
    autoGrading: true,
    questions: [
      { id: 31, tipe: 'pg', bobot: 50, tanya: 'Perintah SQL untuk mengambil data dari tabel adalah...', opsi: ['SELECT', 'INSERT', 'UPDATE', 'DROP'], kunci: 0, panduan: '' },
      { id: 32, tipe: 'pg', bobot: 50, tanya: 'Klausa yang digunakan untuk menyaring baris hasil query adalah...', opsi: ['ORDER BY', 'WHERE', 'LIMIT', 'AS'], kunci: 1, panduan: '' }
    ]
  }
];

// ---------- Field tanggal & jam (kalender + jam) ----------
const DateTimeField = ({ label, value, onChange, min, invalid }) => {
  const ref = useRef(null);
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <input
          ref={ref}
          type="datetime-local"
          value={value}
          min={min || undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-white border rounded-xl pl-4 pr-10 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] transition-colors cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${
            invalid ? 'border-red-300' : 'border-gray-200/90'
          }`}
        />
        <Calendar
          className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#4F46E5] transition-colors"
          onClick={() => {
            try { ref.current?.showPicker?.(); } catch { /* picker belum bisa dibuka */ }
          }}
        />
      </div>
    </div>
  );
};

// ---------- Field durasi (pilihan cepat + kustom) ----------
const DurasiField = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const toggle = () => {
    setDraft(String(value));
    setOpen((o) => !o);
  };

  const handleCustom = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setDraft(raw);
    const n = Number(raw);
    if (n >= 1) onChange(Math.min(n, DURASI_MAKS));
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-700">Durasi</label>
      <div className="relative">
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={`w-full text-left bg-white border rounded-xl pl-4 pr-10 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] transition-colors cursor-pointer ${
            open ? 'border-[#4F46E5]' : 'border-gray-200/90'
          }`}
        >
          {formatDurasi(value)}
        </button>
        <Clock className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div
              role="dialog"
              aria-label="Pilih durasi"
              className="absolute right-0 top-full mt-2 z-20 w-64 bg-white border border-gray-100 rounded-xl shadow-lg p-3 space-y-3"
            >
              <div className="grid grid-cols-3 gap-1.5">
                {DURASI_PRESET.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { onChange(m); setOpen(false); }}
                    className={`px-2 py-2 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      Number(value) === m
                        ? 'bg-[#4F46E5] text-white'
                        : 'bg-[#f8f9fa] text-gray-600 hover:bg-[#EEF2FF] hover:text-[#4F46E5]'
                    }`}
                  >
                    {formatDurasi(m)}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100">
                <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                  Durasi kustom
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={draft}
                    onChange={handleCustom}
                    onBlur={() => setDraft(String(value))}
                    onKeyDown={(e) => { if (e.key === 'Enter') setOpen(false); }}
                    aria-label="Durasi dalam menit"
                    className="w-20 bg-white border border-gray-200/90 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                  />
                  <span className="text-xs text-gray-500">menit</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5">Maksimal {DURASI_MAKS} menit (10 jam).</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const KelolaKuisDosen = () => {
  const navigate = useNavigate();
  const [systemDate] = useState(() => getSystemDateIndonesian());

  const nextId = useRef(100);
  const [quizzes, setQuizzes] = useState(DATA_AWAL);
  const [selectedQuizId, setSelectedQuizId] = useState(2);
  const [activeQuestionId, setActiveQuestionId] = useState(1);
  const [scrollTarget, setScrollTarget] = useState(null);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null); // 'draf' | 'jadwal' | null
  const [formError, setFormError] = useState('');

  const quiz = quizzes.find((k) => k.id === selectedQuizId) || null;

  // Scroll ke soal yang baru ditambah / diduplikat / dipilih dari navigasi
  useEffect(() => {
    if (scrollTarget == null) return;
    document
      .getElementById(`soal-${scrollTarget}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setScrollTarget(null);
  }, [scrollTarget]);

  // ---------- Kuis ----------
  const updateQuiz = (patch) => {
    setQuizzes((prev) => prev.map((k) => (k.id === selectedQuizId ? { ...k, ...patch } : k)));
  };

  const selectQuiz = (k) => {
    setSelectedQuizId(k.id);
    setActiveQuestionId(k.questions[0]?.id ?? null);
    setFormError('');
    setSaveMsg(null);
    setShowAddMenu(false);
  };

  const createQuiz = () => {
    const id = nextId.current++;
    const soalId = nextId.current++;
    const baru = {
      id,
      judul: 'Kuis Baru',
      status: 'Draf',
      progress: 'Belum dibuka',
      durasi: 30,
      mataKuliah: MATA_KULIAH[0],
      waktuBuka: '',
      waktuTutup: '',
      autoGrading: true,
      questions: [buatSoal(soalId, 'pg')]
    };
    setQuizzes((prev) => [baru, ...prev]);
    setSelectedQuizId(id);
    setActiveQuestionId(soalId);
    setFormError('');
    setSaveMsg(null);
  };

  const confirmDeleteQuiz = () => {
    if (!quizToDelete) return;
    const sisa = quizzes.filter((k) => k.id !== quizToDelete.id);
    setQuizzes(sisa);
    if (selectedQuizId === quizToDelete.id) {
      const berikut = sisa[0];
      setSelectedQuizId(berikut ? berikut.id : null);
      setActiveQuestionId(berikut?.questions[0]?.id ?? null);
    }
    setQuizToDelete(null);
  };

  // ---------- Soal ----------
  const updateQuestions = (fn) => {
    setQuizzes((prev) =>
      prev.map((k) => (k.id === selectedQuizId ? { ...k, questions: fn(k.questions) } : k))
    );
  };

  const updateQuestion = (qid, patch) => {
    updateQuestions((list) => list.map((s) => (s.id === qid ? { ...s, ...patch } : s)));
  };

  const updateOpsi = (qid, idx, teks) => {
    updateQuestions((list) =>
      list.map((s) =>
        s.id === qid ? { ...s, opsi: s.opsi.map((o, i) => (i === idx ? teks : o)) } : s
      )
    );
  };

  const addQuestion = (tipe) => {
    const id = nextId.current++;
    updateQuestions((list) => [...list, buatSoal(id, tipe)]);
    setActiveQuestionId(id);
    setScrollTarget(id);
    setShowAddMenu(false);
  };

  const duplicateQuestion = (qid) => {
    const newId = nextId.current++;
    updateQuestions((list) => {
      const i = list.findIndex((s) => s.id === qid);
      if (i < 0) return list;
      const salinan = { ...list[i], id: newId, opsi: [...list[i].opsi] };
      return [...list.slice(0, i + 1), salinan, ...list.slice(i + 1)];
    });
    setActiveQuestionId(newId);
    setScrollTarget(newId);
  };

  const deleteQuestion = (qid) => {
    const sisa = quiz.questions.filter((s) => s.id !== qid);
    updateQuestions((list) => list.filter((s) => s.id !== qid));
    if (activeQuestionId === qid) setActiveQuestionId(sisa[0]?.id ?? null);
  };

  // ---------- Simpan ----------
  const flashSaved = (jenis) => {
    setSaveMsg(jenis);
    setTimeout(() => setSaveMsg(null), 2000);
  };

  const handleSaveDraft = () => {
    setFormError('');
    flashSaved('draf');
  };

  const urutWaktuSalah =
    quiz && quiz.waktuBuka && quiz.waktuTutup && quiz.waktuTutup <= quiz.waktuBuka;

  const handleSchedule = () => {
    if (!quiz.waktuBuka || !quiz.waktuTutup) {
      setFormError('Lengkapi waktu buka dan waktu tutup terlebih dahulu.');
      return;
    }
    if (urutWaktuSalah) {
      setFormError('Waktu tutup harus setelah waktu buka.');
      return;
    }
    if (quiz.questions.length === 0) {
      setFormError('Tambahkan minimal satu soal sebelum menjadwalkan kuis.');
      return;
    }
    setFormError('');
    if (quiz.status === 'Draf') updateQuiz({ status: 'Terjadwal' });
    flashSaved('jadwal');
  };

  // ---------- Ringkasan penilaian ----------
  const pgSoal = quiz ? quiz.questions.filter((s) => s.tipe === 'pg') : [];
  const esaiSoal = quiz ? quiz.questions.filter((s) => s.tipe === 'esai') : [];
  const totalPoin = quiz ? sumBobot(quiz.questions) : 0;

  const inputCls =
    'w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]';

  return (
    <div className="space-y-6">
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
          onClick={createQuiz}
          className="inline-flex items-center justify-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat kuis</span>
        </button>
      </div>

      {/* Grid Layout 2 Kolom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kolom Kiri: Daftar Kuis & Navigasi Soal */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Daftar Kuis */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Daftar kuis</h2>
              <p className="text-xs text-gray-400 mt-0.5">Basis Data · TI-3A</p>
            </div>

            {quizzes.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">
                Belum ada kuis. Klik &quot;Buat kuis&quot; untuk memulai.
              </p>
            ) : (
              <div className="space-y-3">
                {quizzes.map((kuis) => {
                  const isSelected = selectedQuizId === kuis.id;
                  return (
                    <div 
                      key={kuis.id}
                      onClick={() => selectQuiz(kuis)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-[#4F46E5] bg-[#EEF2FF]/30 shadow-2xs' 
                          : 'border-gray-100 bg-[#f8f9fa] hover:border-gray-200'
                      }`}
                    >
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_BADGE[kuis.status]}`}>
                        {kuis.status}
                      </span>

                      <h3 className="text-xs font-bold text-gray-900 mt-2">{kuis.judul || 'Tanpa judul'}</h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">{formatJadwal(kuis.waktuBuka, kuis.waktuTutup)}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{kuis.progress}</p>

                      <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-100 text-xs font-semibold text-[#4F46E5]">
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); selectQuiz(kuis); }}
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
                          onClick={(e) => { e.stopPropagation(); setQuizToDelete(kuis); }}
                          className="text-gray-400 hover:text-red-600 hover:underline cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Card 2: Navigasi Soal */}
          {quiz && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
              <h2 className="text-sm font-bold text-gray-900">Navigasi soal</h2>

              {quiz.questions.length === 0 ? (
                <p className="text-xs text-gray-400">Belum ada soal.</p>
              ) : (
                <div className="space-y-1.5">
                  {quiz.questions.map((soal, i) => {
                    const isActive = activeQuestionId === soal.id;
                    return (
                      <button
                        key={soal.id}
                        type="button"
                        title={soal.tanya}
                        onClick={() => {
                          setActiveQuestionId(soal.id);
                          setScrollTarget(soal.id);
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="truncate text-left">
                          {i + 1} - {soal.tanya.trim() || 'Soal belum diisi'}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold shrink-0">{TIPE_SHORT[soal.tipe]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Kolom Kanan: Editor Kuis & Daftar Soal */}
        <div className="lg:col-span-8 space-y-6">
          {!quiz ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <p className="text-sm font-bold text-gray-900">Tidak ada kuis yang dipilih</p>
              <p className="text-xs text-gray-400 mt-1">
                Pilih kuis dari daftar atau buat kuis baru untuk mulai menyusun soal.
              </p>
            </div>
          ) : (
            <>
              {/* Card 1: Pengaturan Editor Kuis */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h2 className="text-sm font-bold text-gray-900 truncate">Editor: {quiz.judul || 'Tanpa judul'}</h2>
                </div>

                {/* Judul Kuis & Durasi */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">Judul kuis</label>
                    <input 
                      type="text" 
                      value={quiz.judul}
                      onChange={(e) => updateQuiz({ judul: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <DurasiField
                    value={quiz.durasi}
                    onChange={(v) => updateQuiz({ durasi: v })}
                  />
                </div>

                {/* Mata Kuliah / Kelas */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Mata kuliah / kelas</label>
                  <div className="relative">
                    <select
                      value={quiz.mataKuliah}
                      onChange={(e) => updateQuiz({ mataKuliah: e.target.value })}
                      className="w-full appearance-none bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                    >
                      {MATA_KULIAH.map((mk) => (
                        <option key={mk} value={mk}>{mk}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Waktu Buka & Waktu Tutup (kalender + jam) */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DateTimeField
                      label="Waktu buka"
                      value={quiz.waktuBuka}
                      onChange={(v) => { updateQuiz({ waktuBuka: v }); setFormError(''); }}
                    />
                    <DateTimeField
                      label="Waktu tutup"
                      value={quiz.waktuTutup}
                      min={quiz.waktuBuka}
                      invalid={urutWaktuSalah}
                      onChange={(v) => { updateQuiz({ waktuTutup: v }); setFormError(''); }}
                    />
                  </div>
                  {urutWaktuSalah ? (
                    <p className="text-[11px] text-red-500">Waktu tutup harus setelah waktu buka.</p>
                  ) : (
                    <p className="text-[11px] text-gray-400">Pilih tanggal dan jam. Zona waktu mengikuti WIB.</p>
                  )}
                </div>

                {/* Toggle Penilaian Otomatis Box */}
                <div className="p-4 bg-[#EEF2FF]/60 border border-[#E0E7FF] rounded-2xl flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => updateQuiz({ autoGrading: !quiz.autoGrading })}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mt-0.5 ${
                      quiz.autoGrading ? 'bg-[#4F46E5]' : 'bg-gray-300'
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        quiz.autoGrading ? 'translate-x-5' : 'translate-x-0'
                      }`} 
                    />
                  </button>

                  <div className="text-xs leading-relaxed">
                    <p className="font-bold text-gray-900">
                      Penilaian otomatis pilihan ganda {quiz.autoGrading ? 'aktif' : 'nonaktif'}
                    </p>
                    <p className="text-gray-500 mt-0.5">
                      {quiz.autoGrading
                        ? `${pgSoal.length} soal PG (${sumBobot(pgSoal)} poin) dinilai otomatis. ${esaiSoal.length} soal esai (${sumBobot(esaiSoal)} poin) dinilai manual. Total nilai maksimal ${totalPoin}.`
                        : `Semua soal (${quiz.questions.length} soal, ${totalPoin} poin) dinilai manual oleh dosen.`}
                    </p>
                    {totalPoin !== 100 && quiz.questions.length > 0 && (
                      <p className="text-amber-600 mt-1">Total bobot saat ini {totalPoin} poin, bukan 100.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Daftar Soal */}
              {quiz.questions.length === 0 && (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                  <p className="text-xs font-semibold text-gray-700">Belum ada soal</p>
                  <p className="text-[11px] text-gray-400 mt-1">Klik &quot;Tambah soal&quot; untuk mulai menyusun kuis.</p>
                </div>
              )}

              {quiz.questions.map((soal, idx) => (
                <div
                  key={soal.id}
                  id={`soal-${soal.id}`}
                  onFocus={() => setActiveQuestionId(soal.id)}
                  className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4 scroll-mt-6 transition-colors ${
                    activeQuestionId === soal.id ? 'border-[#C7D2FE]' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="text-sm font-bold text-gray-900">
                      Soal {idx + 1} · {TIPE_LABEL[soal.tipe]}
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-semibold text-[#4F46E5]">
                      <button
                        type="button"
                        onClick={() => duplicateQuestion(soal.id)}
                        className="hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Duplikat</span>
                      </button>
                      <span className="text-gray-300">·</span>
                      <button
                        type="button"
                        onClick={() => deleteQuestion(soal.id)}
                        className="text-gray-400 hover:text-red-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>

                  {/* Tipe soal & Bobot */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700">Tipe soal</label>
                      <div className="relative">
                        <select
                          value={soal.tipe}
                          onChange={(e) => updateQuestion(soal.id, { tipe: e.target.value })}
                          className="w-full appearance-none bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                        >
                          <option value="pg">Pilihan ganda</option>
                          <option value="esai">Esai</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700">Bobot (poin)</label>
                      <input 
                        type="number"
                        min="0"
                        value={soal.bobot}
                        onChange={(e) =>
                          updateQuestion(soal.id, {
                            bobot: e.target.value === '' ? '' : Math.max(0, Number(e.target.value))
                          })
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Pertanyaan */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">Pertanyaan</label>
                    {soal.tipe === 'esai' ? (
                      <textarea 
                        rows={4}
                        value={soal.tanya}
                        onChange={(e) => updateQuestion(soal.id, { tanya: e.target.value })}
                        placeholder="Tulis pertanyaan esai..."
                        className="w-full bg-white border border-gray-200/90 rounded-xl p-3.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] leading-relaxed resize-y"
                      />
                    ) : (
                      <input 
                        type="text" 
                        value={soal.tanya}
                        onChange={(e) => updateQuestion(soal.id, { tanya: e.target.value })}
                        placeholder="Tulis pertanyaan..."
                        className={inputCls}
                      />
                    )}
                  </div>

                  {soal.tipe === 'pg' ? (
                    /* Opsi Pilihan Jawaban */
                    <div className="space-y-2 pt-1">
                      {OPSI_HURUF.map((huruf, i) => {
                        const isKey = soal.kunci === i;
                        return (
                          <div 
                            key={huruf}
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all ${
                              isKey 
                                ? 'bg-[#EAF8F1] border-[#C6ECD6]' 
                                : 'bg-white border-gray-200/80'
                            }`}
                          >
                            <button
                              type="button"
                              title="Jadikan kunci jawaban"
                              aria-label={`Jadikan opsi ${huruf} kunci jawaban`}
                              onClick={() => updateQuestion(soal.id, { kunci: i })}
                              className={`w-4 h-4 shrink-0 rounded-full border flex items-center justify-center cursor-pointer ${
                                isKey ? 'border-[#10B981] bg-[#10B981] text-white' : 'border-gray-400'
                              }`}
                            >
                              {isKey && <Check className="w-3 h-3 stroke-3" />}
                            </button>
                            <span className={`text-xs font-semibold ${isKey ? 'text-[#065F46]' : 'text-gray-500'}`}>
                              {huruf}.
                            </span>
                            <input
                              type="text"
                              value={soal.opsi[i]}
                              onChange={(e) => updateOpsi(soal.id, i, e.target.value)}
                              placeholder={`Opsi ${huruf}`}
                              className="flex-1 min-w-0 bg-transparent text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none"
                            />
                            {isKey && (
                              <span className="text-[11px] font-bold text-[#10B981] bg-white px-2.5 py-0.5 rounded-full border border-[#C6ECD6] shrink-0">
                                Kunci jawaban
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-700">Panduan penilaian</label>
                        <input 
                          type="text" 
                          value={soal.panduan}
                          onChange={(e) => updateQuestion(soal.id, { panduan: e.target.value })}
                          placeholder="Contoh: Konsep 10 poin · Ketepatan query 10 poin"
                          className={inputCls}
                        />
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Jawaban esai diperiksa dan dinilai oleh dosen.
                      </p>
                    </>
                  )}
                </div>
              ))}

              {/* Bottom Action Bar */}
              <div className="space-y-2 pt-2">
                {formError && (
                  <p className="flex items-center gap-1.5 text-[11px] text-red-500">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {formError}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Tambah soal (pilih tipe) */}
                  <div className="relative w-full sm:w-auto">
                    <button 
                      type="button"
                      onClick={() => setShowAddMenu((v) => !v)}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-gray-400" />
                      <span>Tambah soal</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>

                    {showAddMenu && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowAddMenu(false)} />
                        <div className="absolute bottom-full left-0 mb-2 z-20 w-full sm:w-44 bg-white border border-gray-100 rounded-xl shadow-lg p-1.5">
                          <button
                            type="button"
                            onClick={() => addQuestion('pg')}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#EEF2FF] hover:text-[#4F46E5] rounded-lg cursor-pointer"
                          >
                            Pilihan ganda
                          </button>
                          <button
                            type="button"
                            onClick={() => addQuestion('esai')}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#EEF2FF] hover:text-[#4F46E5] rounded-lg cursor-pointer"
                          >
                            Esai
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                      type="button"
                      onClick={handleSaveDraft}
                      className="w-full sm:w-auto bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      {saveMsg === 'draf' ? 'Draf tersimpan!' : 'Simpan draf'}
                    </button>
                    <button 
                      type="button"
                      onClick={handleSchedule}
                      className="w-full sm:w-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      {saveMsg === 'jadwal' ? 'Tersimpan & Terjadwal!' : 'Simpan & jadwalkan'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* Modal Konfirmasi Hapus Kuis */}
      {quizToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40"
          onClick={() => setQuizToDelete(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-hapus-kuis"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl space-y-4"
          >
            <div className="flex items-start gap-3">
              <span className="p-2 bg-red-50 text-red-600 rounded-full shrink-0">
                <AlertCircle className="w-5 h-5" />
              </span>
              <div>
                <h3 id="judul-hapus-kuis" className="text-sm font-bold text-gray-900">
                  Hapus kuis ini?
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  &quot;{quizToDelete.judul || 'Tanpa judul'}&quot; beserta {quizToDelete.questions.length} soal di dalamnya akan dihapus.
                  {(quizToDelete.status === 'Aktif' || quizToDelete.status === 'Selesai') &&
                    ' Hasil pengerjaan mahasiswa juga ikut terhapus.'}{' '}
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setQuizToDelete(null)}
                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold py-2 px-4 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteQuiz}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-colors cursor-pointer"
              >
                Hapus kuis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaKuisDosen;