import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  ListChecks,
  FolderOpen,
  CalendarCheck,
  ArrowRight,
  FolderClosed,
  FileText,
  HelpCircle,
  ExternalLink,
  Download,
  ShieldAlert,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Contoh struktur array kuis yang sedang berlangsung (untuk referensi integrasi BE & DB)
const ACTIVE_QUIZZES_DASHBOARD = [
  {
    id: 1,
    mataKuliah: "Basis Data",
    kelas: "TI-3A",
    judul: "Kuis Normalisasi",
    jumlahSoal: 5,
    durasiMenit: 30,
    tanggalText: "24 Okt 2026, 09.00–12.00 WIB",
  },
  {
    id: 4,
    mataKuliah: "Pemrograman Web",
    kelas: "TI-3A",
    judul: "Kuis Layouting CSS & Tailwind",
    jumlahSoal: 10,
    durasiMenit: 25,
    tanggalText: "24 Okt 2026, 10.00–13.00 WIB",
  },
  {
    id: 5,
    mataKuliah: "Jaringan Komputer",
    kelas: "TI-3A",
    judul: "Kuis Subnetting IPv4",
    jumlahSoal: 8,
    durasiMenit: 40,
    tanggalText: "24 Okt 2026, 13.00–16.00 WIB",
  },
];

const DEADLINE_TERDEKAT = [
  {
    id: 1,
    judul: "Perancangan ERD",
    mataKuliah: "Basis Data",
    deadline: "26 Okt, 23.59 WIB",
    sisaWaktu: "2 hari lagi",
    status: "Belum dikumpulkan",
    isSubmitted: false,
  },
  {
    id: 2,
    judul: "Halaman Web Responsif",
    mataKuliah: "Pemrograman Web",
    deadline: "28 Okt, 23.59 WIB",
    sisaWaktu: "4 hari lagi",
    status: "Sudah dikumpulkan",
    isSubmitted: true,
  },
];

const MATERI_TERBARU = [
  {
    id: 101,
    judul: "Normalisasi 1NF–3NF",
    sumber: "Google Drive",
    mataKuliah: "Basis Data",
    pertemuan: "Pertemuan 7",
    tanggal: "23 Okt",
  },
  {
    id: 201,
    judul: "CSS Flexbox & Grid",
    sumber: "Google Drive",
    mataKuliah: "Pemrograman Web",
    pertemuan: "Pertemuan 6",
    tanggal: "22 Okt",
  },
  {
    id: 102,
    judul: "Modul Latihan Query SQL.pdf",
    sumber: "PDF",
    mataKuliah: "Basis Data",
    pertemuan: "Pertemuan 6",
    tanggal: "19 Okt",
  },
];

export default function DashboardMahasiswa() {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedQuizModal, setSelectedQuizModal] = useState(null);
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);

  const totalActiveQuizzes = ACTIVE_QUIZZES_DASHBOARD.length;
  const currentActiveQuiz =
    ACTIVE_QUIZZES_DASHBOARD[activeQuizIndex] || ACTIVE_QUIZZES_DASHBOARD[0];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  // Trigger Fullscreen & Masuk ke Pengerjaan Kuis (identik dengan KuisMahasiswa.jsx)
  const handleStartFocusMode = async () => {
    if (!selectedQuizModal) return;
    const quizId = selectedQuizModal.id;

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request bypassed:", err);
    }

    setSelectedQuizModal(null);
    navigate(`/mahasiswa/kuis/${quizId}/kerjakan`);
  };

  const handlePrevQuiz = () => {
    setActiveQuizIndex((prev) =>
      prev === 0 ? totalActiveQuizzes - 1 : prev - 1
    );
  };

  const handleNextQuiz = () => {
    setActiveQuizIndex((prev) =>
      prev === totalActiveQuizzes - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Sambutan */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-slate-800 sm:text-[26px]">
            Selamat pagi, Nadia 👋
          </h1>
          <p className="mt-1 text-[12px] text-slate-500 sm:text-[13px]">
            Satu langkah lebih dekat ke target belajarmu. Ini yang perlu kamu
            cek hari ini.
          </p>
        </div>

        <span className="self-start rounded-lg bg-indigo-50 px-3 py-1.5 text-[11px] font-semibold text-indigo-600 sm:self-auto">
          TI-3A · Semester 3
        </span>
      </div>

      {/* 4 Kartu Statistik Utama */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1 */}
        <Link
          to="/mahasiswa/tugas"
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition hover:border-indigo-200"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[12px] font-medium">
              Tugas belum dikumpulkan
            </span>
            <ClipboardList size={16} className="text-indigo-500" />
          </div>
          <p className="mt-3 text-[28px] font-bold text-slate-800">1</p>
          <p className="mt-1 text-[11px] text-slate-400">
            Deadline terdekat 26 Oktober
          </p>
        </Link>

        {/* Card 2 */}
        <Link
          to="/mahasiswa/kuis"
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition hover:border-indigo-200"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[12px] font-medium">Kuis aktif</span>
            <ListChecks size={16} className="text-indigo-500" />
          </div>
          <p className="mt-3 text-[28px] font-bold text-slate-800">
            {totalActiveQuizzes}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {currentActiveQuiz.judul.replace(/^Kuis\s+/i, "")} · Tutup 12.00 WIB
          </p>
        </Link>

        {/* Card 3 */}
        <Link
          to="/mahasiswa/materi"
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition hover:border-indigo-200"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[12px] font-medium">Materi tersedia</span>
            <FolderOpen size={16} className="text-indigo-500" />
          </div>
          <p className="mt-3 text-[28px] font-bold text-slate-800">8</p>
          <p className="mt-1 text-[11px] text-slate-400">
            4 mata kuliah yang diikuti
          </p>
        </Link>

        {/* Card 4 */}
        <Link
          to="/mahasiswa/absensi"
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition hover:border-indigo-200"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[12px] font-medium">
              Kehadiran Basis Data
            </span>
            <CalendarCheck size={16} className="text-indigo-500" />
          </div>
          <p className="mt-3 text-[28px] font-bold text-slate-800">100%</p>
          <p className="mt-1 text-[11px] text-slate-400">
            6 dari 6 pertemuan selesai
          </p>
        </Link>
      </div>

      {/* Banner Alert Presensi */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-200/80 bg-[#ECFDF5] px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3.5 sm:items-center">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700 sm:mt-0">
            <CalendarCheck size={18} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate-800">
              Kamu belum presensi hari ini.
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-emerald-700">
              Basis Data · Pertemuan 7 · Sesi dibuka sampai 09.30 WIB.
            </p>
          </div>
        </div>

        <Link
          to="/mahasiswa/absensi"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-700 shadow-2xs transition hover:border-emerald-300 hover:text-emerald-700"
        >
          <ArrowRight size={14} />
          <span>Isi presensi</span>
        </Link>
      </div>

      {/* Grid 2 Kolom Konten Bawah */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Kolom Kiri (8/12): Deadline Terdekat & Materi Terbaru */}
        <div className="space-y-6 lg:col-span-8">
          {/* Section: Deadline Terdekat */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-slate-800">
                Deadline terdekat
              </h2>
              <Link
                to="/mahasiswa/tugas"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline"
              >
                <span>Semua tugas</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-3">
              {DEADLINE_TERDEKAT.map((tugas) => (
                <Link
                  key={tugas.id}
                  to="/mahasiswa/tugas"
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/20"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <ClipboardList size={18} />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold text-slate-800">
                        {tugas.judul}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {tugas.mataKuliah} · {tugas.deadline}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block rounded-md bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-600">
                      {tugas.sisaWaktu}
                    </span>
                    <p
                      className={`mt-1 text-[10px] ${
                        tugas.isSubmitted
                          ? "font-medium text-emerald-600"
                          : "text-slate-400"
                      }`}
                    >
                      {tugas.status}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Section: Materi Terbaru */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-slate-800">
                Materi terbaru
              </h2>
              <Link
                to="/mahasiswa/materi"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline"
              >
                <span>Pustaka materi</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-3">
              {MATERI_TERBARU.map((materi) => {
                const isDrive = materi.sumber === "Google Drive";
                return (
                  <div
                    key={materi.id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-slate-200 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        {isDrive ? (
                          <FolderClosed size={18} />
                        ) : (
                          <FileText size={18} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-[13px] font-semibold text-slate-800">
                          {materi.judul}
                        </h3>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {isDrive ? `${materi.sumber} · ` : ""}
                          {materi.mataKuliah} · {materi.pertemuan} ·{" "}
                          {materi.tanggal}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end text-[11px] font-semibold text-indigo-600 sm:self-auto">
                      <button
                        type="button"
                        onClick={() =>
                          showToast(
                            `Membuka "${materi.judul}" (${materi.sumber})...`
                          )
                        }
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        <span>{isDrive ? "Buka Drive" : "Buka"}</span>
                        {isDrive && <ExternalLink size={11} />}
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        type="button"
                        onClick={() =>
                          showToast(`Mengunduh "${materi.judul}"...`)
                        }
                        className="inline-flex items-center gap-1 hover:underline"
                      >
                        <span>Unduh</span>
                        <Download size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Kolom Kanan (4/12): Kuis Berlangsung (Karousel), Pencapaian, Info Bantuan */}
        <div className="space-y-6 lg:col-span-4">
          {/* Card Kuis Sedang Berlangsung (Otomatis jadi Karousel jika > 1 kuis) */}
          <div className="rounded-2xl bg-[#1A1B41] p-6 text-white shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-block rounded-md bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                Kuis sedang berlangsung
              </span>

              {totalActiveQuizzes > 1 && (
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-200">
                  {activeQuizIndex + 1} / {totalActiveQuizzes}
                </span>
              )}
            </div>

            <h2 className="mt-4 text-[20px] font-bold tracking-tight">
              {currentActiveQuiz.judul}
            </h2>

            <div className="mt-3 space-y-1 text-[11px] text-slate-300">
              <p>
                {currentActiveQuiz.mataKuliah} · {currentActiveQuiz.kelas}
              </p>
              <p>
                {currentActiveQuiz.jumlahSoal} soal ·{" "}
                {currentActiveQuiz.durasiMenit} menit
              </p>
              <p>{currentActiveQuiz.tanggalText}</p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedQuizModal(currentActiveQuiz)}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] text-[12px] font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.99]"
            >
              <ArrowRight size={15} />
              <span>Kerjakan kuis</span>
            </button>

            {/* Kontrol Navigasi Karousel (Muncul saat kuis aktif > 1) */}
            {totalActiveQuizzes > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3.5">
                <div className="flex items-center gap-1.5">
                  {ACTIVE_QUIZZES_DASHBOARD.map((quizItem, idx) => (
                    <button
                      key={quizItem.id}
                      type="button"
                      aria-label={`Lihat ${quizItem.judul}`}
                      onClick={() => setActiveQuizIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === activeQuizIndex
                          ? "w-5 bg-indigo-400"
                          : "w-1.5 bg-white/25 hover:bg-white/45"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Kuis sebelumnya"
                    onClick={handlePrevQuiz}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 transition hover:bg-white/15 hover:text-white"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    aria-label="Kuis berikutnya"
                    onClick={handleNextQuiz}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-200 transition hover:bg-white/15 hover:text-white"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card Pencapaian Terbaru */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
            <h2 className="text-[15px] font-bold text-slate-800">
              Pencapaian terbaru
            </h2>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-[32px] font-bold text-indigo-600">88</span>
              <div>
                <p className="text-[13px] font-bold text-slate-800">
                  Latihan Query SQL
                </p>
                <p className="text-[11px] text-slate-400">
                  Nilai terbit 23 Oktober
                </p>
              </div>
            </div>

            <p className="mt-3 text-[11px] italic leading-relaxed text-slate-500">
              “Query sudah tepat. Perhatikan konsistensi penulisan alias tabel.”
            </p>

            <Link
              to="/mahasiswa/tugas"
              className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline"
            >
              <span>Lihat nilai &amp; feedback</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Info Box Kontak Dosen */}
          <div className="flex items-start gap-3 rounded-2xl bg-indigo-50/70 p-4 text-indigo-900">
            <HelpCircle size={18} className="mt-0.5 shrink-0 text-indigo-600" />
            <p className="text-[11px] leading-relaxed text-slate-600">
              Butuh bantuan? Hubungi dosen melalui kontak mata kuliah.
            </p>
          </div>
        </div>
      </div>

      {/* ================= MODAL KONFIRMASI MODE FOKUS ================= */}
      {selectedQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Mode Fokus Ujian
                  </span>
                  <h3 className="mt-1 text-[17px] font-bold text-slate-800">
                    {selectedQuizModal.judul}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuizModal(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-[12px] leading-relaxed text-slate-600">
              <p>
                Ketika Anda menekan <strong>Mulai Kuis</strong>, sistem akan
                mengaktifkan <strong>Mode Fokus (Layar Penuh)</strong> dan
                mengunci navigasi menu lainnya hingga kuis selesai dikumpulkan.
              </p>

              <div className="space-y-1.5 pt-1">
                <p className="font-bold text-slate-800">
                  Ketentuan Pengawasan Ujian:
                </p>
                <ul className="list-disc space-y-1 pl-5 text-[11px] text-slate-600">
                  <li>
                    Dilarang keluar dari mode layar penuh (<em>Fullscreen</em>),
                    berpindah tab browser, atau membuka aplikasi lain.
                  </li>
                  <li>
                    Setiap percobaan keluar layar atau berpindah tab akan{" "}
                    <strong className="text-rose-600">
                      tercatat secara otomatis
                    </strong>{" "}
                    dan dilaporkan kepada dosen pengampu.
                  </li>
                  <li>
                    Durasi pengerjaan (
                    <strong>{selectedQuizModal.durasiMenit} menit</strong>)
                    berjalan terus dan tidak dapat dijeda.
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedQuizModal(null)}
                className="h-10 rounded-xl border border-slate-200 px-4 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleStartFocusMode}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#4F46E5] px-5 text-[12px] font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                <Maximize2 size={14} />
                <span>Mulai Kuis (Mode Fokus)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback Aksi */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-[12px] font-medium text-white shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
}