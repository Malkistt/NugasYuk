import React, { useState, useMemo } from "react";
import {
  Search,
  CalendarCheck,
  ListChecks,
  ClipboardList,
  UserCog,
  ChevronDown,
  Headphones,
  Building2,
  Mail,
  Clock,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
} from "lucide-react";
import { getSystemDateIndonesian } from "../utils/dateHelper";

const HELP_CATEGORIES = [
  {
    key: "presensi",
    title: "Token & Presensi",
    description: "Cara generate token 6 digit, batas waktu sesi, dan konfirmasi izin/sakit mahasiswa.",
    icon: CalendarCheck,
  },
  {
    key: "kuis",
    title: "Kuis & Mode Fokus",
    description: "7 jenis pelanggaran anti-cheating, laporan pengawasan, dan penilaian esai.",
    icon: ListChecks,
  },
  {
    key: "tugas",
    title: "Tugas & Materi",
    description: "Membuat tugas, penilaian berkas, menambah materi perkuliahan via Google Drive.",
    icon: ClipboardList,
  },
  {
    key: "akun",
    title: "Akun Dosen",
    description: "Ubah kontak/password mandiri, koreksi NIDN/Nama via administrasi kampus.",
    icon: UserCog,
  },
];

const FAQ_ITEMS = [
  {
    id: 1,
    category: "presensi",
    categoryLabel: "Token & Presensi",
    question: "Bagaimana cara menghasilkan dan membagikan kode token 6 digit kepada mahasiswa?",
    answer:
      "Buka halaman Kelola Absensi, pilih mata kuliah dan pertemuan yang sedang berlangsung, lalu lihat kotak 'Kode Token Sesi Kelas' berwarna ungu di bagian atas. Kode 6 digit akan muncul secara otomatis saat Anda membuka sesi. Gunakan tombol 'Acak Kode' untuk memperbarui kode secara acak (misalnya jika Anda menduga kode sudah bocor) dan tombol 'Salin Kode' untuk menyalin ke papan klip lalu tampilkan ke layar proyektor agar mahasiswa dapat memasukkan kode tersebut pada layar presensi mereka.",
  },
  {
    id: 2,
    category: "presensi",
    categoryLabel: "Token & Presensi",
    question: "Bagaimana cara menyetujui atau menolak pengajuan Izin/Sakit mahasiswa?",
    answer:
      "Mahasiswa yang mengajukan Izin atau Sakit akan berstatus 'Menunggu Persetujuan' di tabel kehadiran dan ditandai dengan latar kuning. Klik baris mahasiswa tersebut untuk melihat panel 'Pengajuan Menunggu Konfirmasi' di sisi kanan, lalu klik 'Periksa Surat' untuk membuka modal verifikasi dan melihat detail alasan serta dokumen yang dilampirkan. Setelah diperiksa, klik 'Setujui' (status menjadi Izin/Sakit disetujui) atau 'Tolak' (status menjadi Alpa).",
  },
  {
    id: 3,
    category: "kuis",
    categoryLabel: "Kuis & Mode Fokus",
    question: "Apa saja 7 jenis pelanggaran yang terdeteksi otomatis oleh Mode Fokus (Anti-Cheating)?",
    answer:
      "Sistem Anti-Cheating merekam 7 kategori pelanggaran secara otomatis:\n1. Pindah Tab — berpindah tab browser atau meminimalkan jendela.\n2. Keluar Fullscreen — menekan Esc atau keluar dari mode layar penuh.\n3. Percobaan Copy-Paste — shortcut Ctrl/Cmd+C, V, X, U, P, S, atau klik kanan.\n4. Developer Tools — membuka Inspect Element atau DevTools (F12, Ctrl+Shift+I/J/C).\n5. Screenshot — menekan PrintScreen, Win+Shift+S, atau Cmd+Shift+3/4/5.\n6. Panel AI / Split Screen — membuka panel samping browser (Gemini, Copilot) saat fullscreen.\n7. Navigasi Keluar (Back) — menekan tombol Back browser atau mouse navigasi.\nSetiap kejadian tercatat dengan kategori, deskripsi, dan stempel waktu.",
  },
  {
    id: 4,
    category: "kuis",
    categoryLabel: "Kuis & Mode Fokus",
    question: "Di mana saya bisa melihat laporan pelanggaran anti-cheating mahasiswa?",
    answer:
      "Buka halaman Hasil Kuis dari menu Kuis lalu klik detail hasil kuis tertentu. Pada tabel 'Rekap Mahasiswa', terdapat kolom 'Pelanggaran' yang menampilkan badge merah jika ada pelanggaran atau badge hijau 'Bersih' jika tidak ada. Klik badge pelanggaran untuk membuka panel 'Catatan Pengawasan Ujian' yang merinci total pelanggaran, breakdown per kategori, dan riwayat waktu kejadian secara kronologis.",
  },
  {
    id: 5,
    category: "kuis",
    categoryLabel: "Kuis & Mode Fokus",
    question: "Bagaimana cara menilai soal esai mahasiswa secara manual?",
    answer:
      "Pada halaman Hasil Kuis, klik nama mahasiswa yang masih memiliki status 'Belum dinilai' pada kolom esai. Halaman penilaian akan menampilkan jawaban esai mahasiswa, panduan penilaian (rubrik) yang Anda buat saat menyusun soal, serta kolom input nilai dan komentar feedback. Setelah memberikan nilai, klik 'Simpan nilai' untuk menerbitkan nilai akhir kepada mahasiswa.",
  },
  {
    id: 6,
    category: "tugas",
    categoryLabel: "Tugas & Materi",
    question: "Bagaimana cara membuat tugas baru dan mengaturnya sebagai draf sebelum diterbitkan?",
    answer:
      "Buka halaman Tugas lalu klik tombol '+ Buat tugas' di pojok kanan atas. Isi formulir informasi tugas: mata kuliah, judul, deskripsi/instruksi pengerjaan, lampiran panduan, deadline, dan nilai maksimal. Jika belum siap diterbitkan, klik 'Simpan sebagai Draf' — tugas tidak akan terlihat oleh mahasiswa hingga Anda mengubah statusnya menjadi Aktif.",
  },
  {
    id: 7,
    category: "tugas",
    categoryLabel: "Tugas & Materi",
    question: "Mengapa link Google Drive materi yang saya unggah tidak bisa diakses mahasiswa?",
    answer:
      "Pastikan pengaturan berbagi (share) file atau folder Google Drive diubah dari 'Restricted' (hanya Anda) menjadi 'Anyone with the link' atau dibatasi pada domain Email Kampus (@student.cakrawala.ac.id). Lakukan perubahan ini di Google Drive sebelum menempelkan URL ke halaman Materi di platform NugasYuk.",
  },
  {
    id: 8,
    category: "akun",
    categoryLabel: "Akun Dosen",
    question: "Bagaimana cara mengubah Nama Lengkap atau NIDN yang tercetak keliru di profil?",
    answer:
      "Identitas akademik dosen (Nama Lengkap, NIDN, Jabatan Fungsional, dan Program Studi) dikelola oleh sistem SIMPEG Universitas dan dikunci di platform untuk menjaga integritas data. Silakan hubungi Bagian Kepegawaian / SDM Universitas Cakrawala dengan membawa dokumen resmi (SK Pengangkatan / Kartu NIDN) untuk pengajuan koreksi data.",
  },
  {
    id: 9,
    category: "akun",
    categoryLabel: "Akun Dosen",
    question: "Bagaimana cara mengubah password akun dosen saya?",
    answer:
      "Buka menu Profil & Keamanan dari dropdown profil di navbar kanan atas (klik foto/inisial Anda → Profil & Keamanan). Gulir ke bagian 'Keamanan Akun', masukkan password lama Anda pada kolom 'Password saat ini', lalu tentukan password baru yang kuat (minimal 8 karakter, kombinasi huruf besar, huruf kecil, angka, dan simbol). Klik 'Simpan password baru' untuk menerapkan perubahan.",
  },
];

export default function PusatBantuanDosen() {
  const [systemDate] = useState(() => getSystemDateIndonesian());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [openFaqId, setOpenFaqId] = useState(1);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTopic, setReportTopic] = useState("Token & Presensi");
  const [reportDetail, setReportDetail] = useState("");
  const [reportError, setReportError] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchCategory =
        selectedCategory === "semua" || item.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchSearch =
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.categoryLabel.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCategoryToggle = (key) => {
    setSelectedCategory((prev) => (prev === key ? "semua" : key));
  };

  const handleToggleFaq = (id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleOpenReportModal = () => {
    setReportTopic("Token & Presensi");
    setReportDetail("");
    setReportError("");
    setShowReportModal(true);
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!reportDetail.trim() || reportDetail.trim().length < 10) {
      setReportError("Jelaskan kendala teknis yang Anda alami (minimal 10 karakter).");
      return;
    }
    setShowReportModal(false);
    showToast("Laporan kendala teknis terkirim ke tim IT Support. Balasan akan dikirim ke email dosen Anda.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-slate-800 sm:text-[26px]">
          Pusat bantuan
        </h1>
        <p className="mt-1 text-[12px] text-slate-500 sm:text-[13px]">
          Panduan penggunaan fitur dosen, pengelolaan kelas, dan saluran dukungan teknis.
        </p>
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-[#EEF2FF]/90 via-white to-[#EEF2FF]/60 p-5 sm:p-6">
        <label htmlFor="helpSearchDosen" className="block text-[13px] font-bold text-slate-800">
          Ada kendala atau pertanyaan seputar fitur dosen?
        </label>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Ketik kata kunci seperti token presensi, laporan pelanggaran kuis, penilaian esai, atau tambah materi.
        </p>
        <div className="relative mt-3.5 max-w-2xl">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="helpSearchDosen"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari panduan atau pertanyaan dosen..."
            className="h-11 w-full rounded-xl border border-slate-200/90 bg-white pl-11 pr-4 text-[12px] text-slate-700 shadow-2xs outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {HELP_CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => handleCategoryToggle(cat.key)}
              className={`flex flex-col items-start rounded-2xl border p-5 text-left transition cursor-pointer ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50/40 shadow-2xs"
                  : "border-slate-200/80 bg-white hover:border-indigo-200 hover:bg-slate-50/50"
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isSelected ? "bg-[#4F46E5] text-white" : "bg-indigo-50 text-indigo-600"}`}>
                <IconComponent size={19} strokeWidth={1.9} />
              </div>
              <h2 className="mt-3.5 text-[14px] font-bold text-slate-800">{cat.title}</h2>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{cat.description}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-[15px] font-bold text-slate-800">Panduan &amp; pertanyaan umum</h2>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Menampilkan {filteredFaqs.length} panduan{selectedCategory !== "semua" ? " pada kategori terpilih" : ""}
              </p>
            </div>
            {selectedCategory !== "semua" && (
              <button type="button" onClick={() => setSelectedCategory("semua")} className="rounded-lg bg-indigo-50 px-3 py-1.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-100 cursor-pointer">
                Tampilkan semua kategori
              </button>
            )}
          </div>
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-slate-400">
              Tidak ditemukan panduan yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="py-3.5 first:pt-1 last:pb-1">
                    <button type="button" onClick={() => handleToggleFaq(faq.id)} className="flex w-full items-start justify-between gap-4 text-left cursor-pointer">
                      <div>
                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">{faq.categoryLabel}</span>
                        <h3 className={`mt-1.5 text-[13px] font-bold leading-snug transition ${isOpen ? "text-indigo-600" : "text-slate-800 hover:text-indigo-600"}`}>
                          {faq.question}
                        </h3>
                      </div>
                      <div className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition ${isOpen ? "border-indigo-200 bg-indigo-50 text-indigo-600" : "border-slate-200 bg-white text-slate-400"}`}>
                        <ChevronDown size={15} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="mt-3 rounded-xl bg-slate-50/90 p-4 text-[12px] leading-relaxed text-slate-600 whitespace-pre-line">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-5 lg:col-span-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Headphones size={19} /></div>
              <div>
                <h2 className="text-[15px] font-bold text-slate-800">Dukungan teknis IT</h2>
                <p className="text-[11px] text-slate-400">Bug sistem, token error, &amp; akses akun</p>
              </div>
            </div>
            <p className="mt-3.5 text-[12px] leading-relaxed text-slate-600">
              Mengalami kendala pada fitur token presensi, sistem kuis, penilaian esai, atau pengunggahan materi? Kirim laporan ke tim teknis kami.
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-slate-50/80 p-3.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2"><Mail size={14} className="text-indigo-600" /><span>support@nugasyuk.ac.id</span></div>
              <div className="flex items-center gap-2"><Clock size={14} className="text-indigo-600" /><span>Senin–Sabtu · 07.30–17.00 WIB</span></div>
            </div>
            <button type="button" onClick={handleOpenReportModal} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 cursor-pointer">
              <Send size={14} /><span>Laporkan kendala teknis</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Building2 size={19} /></div>
              <div>
                <h2 className="text-[15px] font-bold text-slate-800">Admin akademik</h2>
                <p className="text-[11px] text-slate-400">Koreksi NIDN, Nama, Jadwal Mengajar</p>
              </div>
            </div>
            <p className="mt-3.5 text-[12px] leading-relaxed text-slate-600">
              Untuk perubahan data identitas dosen yang dikunci di profil atau penugasan mata kuliah, hubungi staf Kepegawaian / Admin Akademik Fakultas.
            </p>
            <div className="mt-4 space-y-2 rounded-xl bg-slate-50/80 p-3.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2"><Mail size={14} className="text-emerald-700" /><span>simpeg@cakrawala.ac.id</span></div>
              <div className="flex items-center gap-2"><ExternalLink size={14} className="text-emerald-700" /><span>Gedung Rektorat Lt. 2 · Senin–Jumat</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100/80 bg-amber-50/40 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-amber-700" />
              <h3 className="text-[13px] font-bold text-amber-900">7 Pelanggaran Mode Fokus</h3>
            </div>
            <ul className="space-y-1.5 text-[11px] text-amber-800">
              {["Pindah Tab / Minimize","Keluar Fullscreen","Percobaan Copy-Paste","Buka Developer Tools","Screenshot / PrintScreen","Panel AI / Split Screen","Navigasi Keluar (Back)"].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10px] text-amber-700 leading-relaxed">
              Semua pelanggaran tercatat otomatis dengan stempel waktu dan dilaporkan di halaman Hasil Kuis.
            </p>
          </div>
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Headphones size={20} /></div>
                <div>
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">Tiket Bantuan IT — Dosen</span>
                  <h3 className="mt-1 text-[16px] font-bold text-slate-800">Laporkan kendala teknis</h3>
                </div>
              </div>
              <button type="button" onClick={() => setShowReportModal(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmitReport} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-700">Modul terkait</label>
                <select value={reportTopic} onChange={(e) => setReportTopic(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[12px] font-medium text-slate-700 outline-none focus:border-indigo-500 cursor-pointer">
                  <option value="Token & Presensi">Token Presensi &amp; Absensi</option>
                  <option value="Kuis & Mode Fokus">Kuis &amp; Mode Fokus Anti-Cheating</option>
                  <option value="Penilaian Tugas">Penilaian Tugas &amp; Berkas Mahasiswa</option>
                  <option value="Materi Drive">Materi Perkuliahan &amp; Google Drive</option>
                  <option value="Login & Akun">Login &amp; Keamanan Akun Dosen</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-700">Deskripsi kendala <span className="text-rose-500">*</span></label>
                <textarea rows={4} value={reportDetail} onChange={(e) => { setReportDetail(e.target.value); if (reportError) setReportError(""); }} placeholder="Jelaskan kronologi kendala, nama mata kuliah/kelas, serta perangkat/browser yang digunakan..." className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10" />
              </div>
              {reportError && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-[11px] font-medium text-rose-700">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" /><span>{reportError}</span>
                </div>
              )}
              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button type="button" onClick={() => setShowReportModal(false)} className="h-10 rounded-xl border border-slate-200 px-4 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer">Batal</button>
                <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#4F46E5] px-5 text-[12px] font-semibold text-white shadow-sm hover:bg-indigo-700 cursor-pointer">
                  <Send size={14} /><span>Kirim laporan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-[12px] font-medium text-white shadow-lg">
          <CheckCircle2 size={15} className="text-emerald-400" /><span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}