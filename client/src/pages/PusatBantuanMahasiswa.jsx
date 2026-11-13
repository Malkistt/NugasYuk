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
} from "lucide-react";

const HELP_CATEGORIES = [
  {
    key: "absensi",
    title: "Presensi & Izin/Sakit",
    description: "Token 6 digit, batas waktu sesi, dan pengajuan bukti izin.",
    icon: CalendarCheck,
  },
  {
    key: "kuis",
    title: "Kuis & Mode Fokus",
    description: "Aturan layar penuh, pindah tab, dan kendala koneksi ujian.",
    icon: ListChecks,
  },
  {
    key: "tugas",
    title: "Tugas & Materi",
    description: "Unggah file tugas, revisi pengumpulan, dan akses Google Drive.",
    icon: ClipboardList,
  },
  {
    key: "akun",
    title: "Akun & Data Akademik",
    description: "Ubah kontak/password mandiri dan koreksi NIM/Nama kampus.",
    icon: UserCog,
  },
];

const FAQ_ITEMS = [
  {
    id: 1,
    category: "absensi",
    categoryLabel: "Presensi & Izin/Sakit",
    question:
      "Mengapa tombol presensi meminta 6 digit kode token dan kode saya ditolak?",
    answer:
      "Untuk mencegah kecurangan presensi dari luar kelas, sistem mewajibkan 6 digit kode token dinamis yang ditampilkan dosen pada layar kelas saat sesi berlangsung. Pastikan kode yang dimasukkan sesuai dengan sesi mata kuliah yang sedang aktif dan belum melewati batas waktu presensi yang ditentukan dosen.",
  },
  {
    id: 2,
    category: "absensi",
    categoryLabel: "Presensi & Izin/Sakit",
    question:
      "Status pengajuan Izin/Sakit saya masih 'Menunggu', bagaimana perhitungannya terhadap syarat 75%?",
    answer:
      "Pengajuan Izin atau Sakit yang disertai bukti lampiran (surat dokter/surat resmi) akan berstatus 'Menunggu persetujuan' hingga diverifikasi oleh dosen pengampu. Selama masih menunggu, pertemuan tersebut belum masuk ke pembagi persentase. Setelah disetujui dosen, status tercatat sebagai Izin/Sakit (bukan Alpa), namun pada rekap syarat minimum 75% tetap dihitung berdasarkan kehadiran fisik (kebijakan toleransi diserahkan kepada dosen pengampu).",
  },
  {
    id: 3,
    category: "kuis",
    categoryLabel: "Kuis & Mode Fokus",
    question:
      "Apa yang terjadi jika saya tidak sengaja keluar dari layar penuh saat mengerjakan Kuis?",
    answer:
      "Kuis menggunakan Mode Fokus layar penuh (Fullscreen). Setiap percobaan keluar dari layar penuh, berpindah tab browser, atau membuka aplikasi lain akan tercatat otomatis sebagai log pelanggaran dan dilaporkan kepada dosen pengampu. Pastikan menutup notifikasi pop-up atau aplikasi lain sebelum menekan tombol 'Mulai Kuis (Mode Fokus)'.",
  },
  {
    id: 4,
    category: "kuis",
    categoryLabel: "Kuis & Mode Fokus",
    question:
      "Bagaimana jika koneksi internet terputus saat sedang mengerjakan kuis?",
    answer:
      "Jawaban yang sudah Anda pilih tersimpan sementara pada sesi browser. Segera hubungkan kembali internet dan lanjutkan pengerjaan sebelum durasi waktu berakhir, karena penghitung waktu kuis berjalan terus di server dan tidak dapat dijeda.",
  },
  {
    id: 5,
    category: "tugas",
    categoryLabel: "Tugas & Materi",
    question:
      "File tugas saya salah kirim sebelum batas deadline, apakah masih bisa diganti?",
    answer:
      "Selama batas waktu pengumpulan (deadline) belum terlewati dan tugas belum dinilai oleh dosen, Anda masih dapat membuka detail tugas terkait dan memperbarui file pengumpulan Anda.",
  },
  {
    id: 6,
    category: "tugas",
    categoryLabel: "Tugas & Materi",
    question:
      "Mengapa tautan materi Google Drive tidak bisa dibuka atau meminta akses?",
    answer:
      "Pastikan Anda membuka tautan Google Drive menggunakan akun Email Kampus (@student...) yang terdaftar di NugasYuk. Jika masih meminta izin akses, hubungi dosen pengampu mata kuliah agar pengaturan berbagi tautan diperbarui.",
  },
  {
    id: 7,
    category: "akun",
    categoryLabel: "Akun & Data Akademik",
    question:
      "Bagaimana cara mengubah Nama Lengkap, NIM, Kelas, atau Email Kampus yang salah?",
    answer:
      "Identitas akademik (Nama lengkap, NIM, Email kampus, Kelas, dan Program Studi) dikelola langsung oleh institusi dan dikunci pada sistem untuk menjaga validitas nilai serta presensi. Silakan hubungi bagian Akademik Fakultas dengan membawa KTM/KRS untuk proses pembaruan data.",
  },
  {
    id: 8,
    category: "akun",
    categoryLabel: "Akun & Data Akademik",
    question:
      "Saya lupa password akun NugasYuk, bagaimana cara memulihkannya?",
    answer:
      "Gunakan fitur 'Lupa password' pada halaman masuk (Login) dengan memasukkan Email Kampus atau Email Pemulihan pribadi yang sudah Anda simpan pada menu Profil & keamanan. Tautan pengaturan ulang password akan dikirimkan ke email tersebut.",
  },
];

export default function PusatBantuanMahasiswa() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [openFaqId, setOpenFaqId] = useState(1);

  // State Modal Laporkan Kendala Teknis
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTopic, setReportTopic] = useState("Presensi & Token");
  const [reportDetail, setReportDetail] = useState("");
  const [reportError, setReportError] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Filter daftar FAQ berdasarkan kategori & kata kunci pencarian
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
    setReportTopic("Presensi & Token");
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
    showToast(
      "Laporan kendala teknis terkirim ke tim IT Support. Balasan akan dikirim ke email Anda."
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Judul */}
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-slate-800 sm:text-[26px]">
          Pusat bantuan
        </h1>
        <p className="mt-1 text-[12px] text-slate-500 sm:text-[13px]">
          Temukan panduan penggunaan platform atau hubungi tim akademik dan
          dukungan teknis.
        </p>
      </div>

      {/* Hero Search Bar */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-[#EEF2FF]/90 via-white to-[#EEF2FF]/60 p-5 sm:p-6">
        <label
          htmlFor="helpSearch"
          className="block text-[13px] font-bold text-slate-800"
        >
          Ada kendala apa hari ini?
        </label>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Ketik kata kunci seperti token absensi, mode fokus kuis, unggah tugas,
          atau perubahan data akademik.
        </p>

        <div className="relative mt-3.5 max-w-2xl">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="helpSearch"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pertanyaan atau panduan..."
            className="h-11 w-full rounded-xl border border-slate-200/90 bg-white pl-11 pr-4 text-[12px] text-slate-700 shadow-2xs outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      {/* 4 Kartu Kategori Topik Populer */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {HELP_CATEGORIES.map((cat) => {
          const IconComponent = cat.icon;
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => handleCategoryToggle(cat.key)}
              className={`flex flex-col items-start rounded-2xl border p-5 text-left transition ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50/40 shadow-2xs"
                  : "border-slate-200/80 bg-white hover:border-indigo-200 hover:bg-slate-50/50"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isSelected
                    ? "bg-[#4F46E5] text-white"
                    : "bg-indigo-50 text-indigo-600"
                }`}
              >
                <IconComponent size={19} strokeWidth={1.9} />
              </div>

              <h2 className="mt-3.5 text-[14px] font-bold text-slate-800">
                {cat.title}
              </h2>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                {cat.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Grid Bawah: Daftar FAQ Accordion (Kiri 8/12) + Kanal Bantuan (Kanan 4/12) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* ================= KOLOM KIRI: PERTANYAAN UMUM (FAQ) ================= */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-[15px] font-bold text-slate-800">
                Pertanyaan yang sering diajukan (FAQ)
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Menampilkan {filteredFaqs.length} panduan
                {selectedCategory !== "semua" ? " pada kategori terpilih" : ""}
              </p>
            </div>

            {selectedCategory !== "semua" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("semua")}
                className="rounded-lg bg-indigo-50 px-3 py-1.5 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-100"
              >
                Tampilkan semua kategori
              </button>
            )}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-slate-400">
              Tidak ditemukan panduan yang cocok dengan kata kunci &ldquo;
              {searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="py-3.5 first:pt-1 last:pb-1">
                    <button
                      type="button"
                      onClick={() => handleToggleFaq(faq.id)}
                      className="flex w-full items-start justify-between gap-4 text-left"
                    >
                      <div>
                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                          {faq.categoryLabel}
                        </span>
                        <h3
                          className={`mt-1.5 text-[13px] font-bold leading-snug transition ${
                            isOpen
                              ? "text-indigo-600"
                              : "text-slate-800 hover:text-indigo-600"
                          }`}
                        >
                          {faq.question}
                        </h3>
                      </div>

                      <div
                        className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition ${
                          isOpen
                            ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                            : "border-slate-200 bg-white text-slate-400"
                        }`}
                      >
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="mt-3 rounded-xl bg-slate-50/90 p-4 text-[12px] leading-relaxed text-slate-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= KOLOM KANAN: KANAL BANTUAN LANGSUNG ================= */}
        <div className="space-y-5 lg:col-span-4">
          {/* Kartu 1: Dukungan Teknis Platform */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Headphones size={19} />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-slate-800">
                  Dukungan teknis IT
                </h2>
                <p className="text-[11px] text-slate-400">
                  Kendala sistem, bug, &amp; akses akun
                </p>
              </div>
            </div>

            <p className="mt-3.5 text-[12px] leading-relaxed text-slate-600">
              Mengalami kendala teknis saat presensi, pengerjaan kuis, atau
              gagal mengunggah berkas tugas? Kirim laporan ke tim teknis kami.
            </p>

            <div className="mt-4 space-y-2 rounded-xl bg-slate-50/80 p-3.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-indigo-600" />
                <span>support@nugasyuk.ac.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-indigo-600" />
                <span>Senin–Sabtu · 07.30–17.00 WIB</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenReportModal}
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Send size={14} />
              <span>Laporkan kendala teknis</span>
            </button>
          </div>

          {/* Kartu 2: Layanan Akademik Fakultas */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Building2 size={19} />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-slate-800">
                  Akademik fakultas
                </h2>
                <p className="text-[11px] text-slate-400">
                  Perubahan NIM, Nama, KRS, &amp; Kelas
                </p>
              </div>
            </div>

            <p className="mt-3.5 text-[12px] leading-relaxed text-slate-600">
              Untuk koreksi identitas mahasiswa yang terkunci di halaman Profil
              atau permasalahan plotting mata kuliah, hubungi staf Akademik
              Fakultas Informatika.
            </p>

            <div className="mt-4 space-y-2 rounded-xl bg-slate-50/80 p-3.5 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-emerald-700" />
                <span>akademik.if@cakrawala.ac.id</span>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink size={14} className="text-emerald-700" />
                <span>Gedung Fakultas Informatika Lt. 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL LAPORKAN KENDALA TEKNIS ================= */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Headphones size={20} />
                </div>
                <div>
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                    Tiket Bantuan IT
                  </span>
                  <h3 className="mt-1 text-[16px] font-bold text-slate-800">
                    Laporkan kendala teknis
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-700">
                  Modul terkait
                </label>
                <select
                  value={reportTopic}
                  onChange={(e) => setReportTopic(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[12px] font-medium text-slate-700 outline-none focus:border-indigo-500"
                >
                  <option value="Presensi & Token">
                    Presensi &amp; Token Sesi
                  </option>
                  <option value="Kuis & Mode Fokus">
                    Kuis &amp; Mode Fokus
                  </option>
                  <option value="Unggah Tugas">
                    Pengumpulan / Unggah Tugas
                  </option>
                  <option value="Akses Materi">Akses Materi Perkuliahan</option>
                  <option value="Login & Akun">Login &amp; Keamanan Akun</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-700">
                  Deskripsi kendala <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={reportDetail}
                  onChange={(e) => {
                    setReportDetail(e.target.value);
                    if (reportError) setReportError("");
                  }}
                  placeholder="Jelaskan kronologi kendala, nama mata kuliah, serta perangkat/browser yang Anda gunakan..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {reportError && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-[11px] font-medium text-rose-700">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{reportError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="h-10 rounded-xl border border-slate-200 px-4 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#4F46E5] px-5 text-[12px] font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  <Send size={14} />
                  <span>Kirim laporan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Konfirmasi */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-[12px] font-medium text-white shadow-lg">
          <CheckCircle2 size={15} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}