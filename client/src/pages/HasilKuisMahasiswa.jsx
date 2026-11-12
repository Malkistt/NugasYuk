import React, { useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  FileEdit,
  Timer,
  Info,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";

// Data default untuk simulasi saat mahasiswa klik "Lihat hasil" dari Daftar Kuis (Kuis Dasar SQL)
const MOCK_HASIL_KUIS_3 = {
  id: 3,
  mataKuliah: "Basis Data",
  kelas: "TI-3A",
  judul: "Kuis Dasar SQL",
  dikumpulkanAt: "22 Oktober 2026, 09.26 WIB",
  nilaiAkhir: 90,
  nilaiMaksimal: 100,
  kkm: 70,
  statusNilai: "Nilai sudah diterbitkan dosen.",
  pgSkor: 80,
  pgMaksimal: 80,
  pgBenarCount: 4,
  pgTotalCount: 4,
  esaiSkor: 10,
  esaiMaksimal: 20,
  esaiStatus: "Sudah diperiksa dosen",
  waktuPengerjaanText: "26 mnt",
  durasiMenit: 30,
  bannerTitle: "Kerja bagus, Nadia! Kamu sudah menguasai dasar SQL.",
  bannerDesc:
    "Tinjau feedback essai untuk memperkuat penggunaan GROUP BY dan fungsi agregat.",
  violationLogs: [
    {
      category: "Pindah Tab",
      reason: "Terdeteksi berpindah tab atau meminimalkan browser.",
      waktu: "09.18.14",
    },
    {
      category: "Screenshot",
      reason: "Terdeteksi menekan tombol PrintScreen (Screenshot).",
      waktu: "09.21.45",
    },
  ],
  soal: [
    {
      nomor: 1,
      tipe: "pilihan_ganda",
      poinDiperoleh: 20,
      poinMaksimal: 20,
      statusHasil: "Benar",
      pertanyaan:
        "Perintah SQL apa yang digunakan untuk mengambil data dari sebuah tabel?",
      jawabanMahasiswaKey: "A",
      jawabanMahasiswaText: "A. SELECT",
      kunciJawabanText: "A. SELECT",
      pembahasan:
        "SELECT digunakan untuk mengambil data. WHERE menyaring baris sesuai kondisi.",
    },
    {
      nomor: 2,
      tipe: "pilihan_ganda",
      poinDiperoleh: 20,
      poinMaksimal: 20,
      statusHasil: "Benar",
      pertanyaan:
        "Klausa SQL manakah yang digunakan untuk menyaring baris data berdasarkan kondisi tertentu?",
      jawabanMahasiswaKey: "B",
      jawabanMahasiswaText: "B. WHERE",
      kunciJawabanText: "B. WHERE",
      pembahasan:
        "Klausa WHERE digunakan untuk memfilter record sebelum pengelompokan (GROUP BY) dilakukan.",
    },
    {
      nomor: 3,
      tipe: "pilihan_ganda",
      poinDiperoleh: 20,
      poinMaksimal: 20,
      statusHasil: "Benar",
      pertanyaan:
        "Fungsi agregat SQL yang digunakan untuk menghitung jumlah baris dalam suatu tabel adalah...",
      jawabanMahasiswaKey: "C",
      jawabanMahasiswaText: "C. COUNT()",
      kunciJawabanText: "C. COUNT()",
      pembahasan:
        "COUNT() menghitung jumlah baris yang cocok dengan kriteria query.",
    },
    {
      nomor: 4,
      tipe: "pilihan_ganda",
      poinDiperoleh: 20,
      poinMaksimal: 20,
      statusHasil: "Benar",
      pertanyaan:
        "Perintah SQL untuk mengurutkan hasil query secara menurun (dari besar ke kecil) adalah...",
      jawabanMahasiswaKey: "D",
      jawabanMahasiswaText: "D. ORDER BY kolom DESC",
      kunciJawabanText: "D. ORDER BY kolom DESC",
      pembahasan:
        "DESC (Descending) mengurutkan data dari nilai terbesar ke terkecil, sedangkan ASC untuk sebaliknya.",
    },
    {
      nomor: 5,
      tipe: "esai",
      poinDiperoleh: 10,
      poinMaksimal: 20,
      statusHasil: "Dinilai",
      pertanyaan:
        "Tuliskan query untuk menghitung jumlah peminjaman setiap anggota perpustakaan.",
      jawabanEssai: "SELECT id_anggota, COUNT(*) FROM peminjaman;",
      namaDosen: "Dr. Maya Putri",
      feedbackDosen:
        "Fungsi COUNT sudah tepat, tetapi query belum menyertakan GROUP BY id_anggota. Tambahkan klausa tersebut agar hasil terkelompok per anggota.",
    },
  ],
};

// Format total detik menjadi "X mnt Y dtk" (atau "Y dtk" jika < 1 menit)
function formatDurasiDetail(totalSeconds = 0) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  if (mins === 0) return `${secs} dtk`;
  if (secs === 0) return `${mins} mnt`;
  return `${mins} mnt ${secs} dtk`;
}

// Fallback helper jika log tidak menyertakan field category
function categorizeViolation(reason = "") {
  const lower = reason.toLowerCase();
  if (
    lower.includes("screenshot") ||
    lower.includes("printscreen") ||
    lower.includes("tangkapan layar")
  ) {
    return "Screenshot";
  }
  if (
    lower.includes("tab") ||
    lower.includes("jendela") ||
    lower.includes("minimalkan")
  ) {
    return "Pindah Tab";
  }
  if (lower.includes("fullscreen") || lower.includes("layar penuh")) {
    return "Keluar Fullscreen";
  }
  if (
    lower.includes("copy") ||
    lower.includes("cut") ||
    lower.includes("paste") ||
    lower.includes("clipboard") ||
    lower.includes("shortcut")
  ) {
    return "Percobaan Copy-Paste";
  }
  if (lower.includes("sidebar ai") || lower.includes("split")) {
    return "Panel AI / Split Screen";
  }
  if (
    lower.includes("kembali") ||
    lower.includes("back") ||
    lower.includes("mouse")
  ) {
    return "Navigasi Keluar (Back)";
  }
  return "Aktivitas Mencurigakan Lainnya";
}

export default function HasilKuisMahasiswa() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // State index soal yang sedang ditampilkan di Carousel (0 s/d totalSoal - 1)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Bangun data hasil kuis secara dinamis jika berasal dari submit pengerjaan kuis,
  // atau gunakan data simulasi MOCK_HASIL_KUIS_3 jika dibuka langsung dari Daftar Kuis.
  const hasilData = useMemo(() => {
    const submittedState = location.state;
    if (submittedState && submittedState.quiz) {
      const {
        quiz,
        answers = {},
        violationLogs = [],
        elapsedSecs = 60,
        durasiMenit = Math.round((quiz.durasiDetikAwal || 1800) / 60),
      } = submittedState;

      // Kunci jawaban simulasi untuk Kuis Normalisasi (id: 1)
      const mockKeys = { 1: "A", 2: "B", 3: "D", 4: "C" };

      let pgBenar = 0;
      let pgTotal = 0;
      let pgScore = 0;
      let pgMax = 0;
      let esaiMax = 0;

      const mappedSoal = quiz.soal.map((s) => {
        if (s.tipe === "pilihan_ganda") {
          pgTotal += 1;
          pgMax += s.poin;
          const userKey = answers[s.nomor];
          const correctKey = mockKeys[s.nomor] || "A";
          const isCorrect = userKey === correctKey;
          if (isCorrect) {
            pgBenar += 1;
            pgScore += s.poin;
          }

          const userOption = s.opsi.find((o) => o.key === userKey);
          const correctOption = s.opsi.find((o) => o.key === correctKey);

          return {
            nomor: s.nomor,
            tipe: "pilihan_ganda",
            poinDiperoleh: isCorrect ? s.poin : 0,
            poinMaksimal: s.poin,
            statusHasil: isCorrect ? "Benar" : "Salah",
            pertanyaan: s.pertanyaan,
            jawabanMahasiswaKey: userKey || "-",
            jawabanMahasiswaText: userOption
              ? `${userOption.key}. ${userOption.text}`
              : "Tidak dijawab",
            kunciJawabanText: correctOption
              ? `${correctOption.key}. ${correctOption.text}`
              : "",
            pembahasan:
              "Penilaian pilihan ganda dihitung otomatis berdasarkan kunci jawaban dosen.",
          };
        }

        // Tipe Esai (menunggu pemeriksaan dosen)
        esaiMax += s.poin;
        return {
          nomor: s.nomor,
          tipe: "esai",
          poinDiperoleh: 0,
          poinMaksimal: s.poin,
          statusHasil: "Menunggu",
          pertanyaan: s.pertanyaan,
          jawabanEssai: answers[s.nomor] || "(Tidak ada jawaban yang ditulis)",
          namaDosen: "Dr. Maya Putri",
          feedbackDosen:
            "Jawaban esai telah diterima dan sedang menunggu pemeriksaan serta penilaian dari dosen pengampu.",
        };
      });

      const nowStr = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      return {
        id: quiz.id,
        mataKuliah: quiz.mataKuliah,
        kelas: "TI-3A",
        judul: quiz.judul,
        dikumpulkanAt: `${nowStr}, baru saja`,
        nilaiAkhir: pgScore, // Skor sementara dari PG sebelum esai dinilai
        nilaiMaksimal: quiz.nilaiMaksimal,
        kkm: 70,
        statusNilai: "Nilai PG terbit · Menunggu nilai esai.",
        pgSkor: pgScore,
        pgMaksimal: pgMax,
        pgBenarCount: pgBenar,
        pgTotalCount: pgTotal,
        esaiSkor: 0,
        esaiMaksimal: esaiMax,
        esaiStatus: "Menunggu pemeriksaan dosen",
        waktuPengerjaanText: formatDurasiDetail(elapsedSecs),
        durasiMenit,
        bannerTitle: "Jawaban kuis berhasil dikirim!",
        bannerDesc:
          "Skor pilihan ganda telah dihitung otomatis. Nilai akhir akan diperbarui setelah dosen memeriksa jawaban esai.",
        violationLogs,
        soal: mappedSoal,
      };
    }

    return MOCK_HASIL_KUIS_3;
  }, [location.state, id]);

  // Agregasi rincian pelanggaran berdasarkan kategori (Total + per kategori)
  const violationSummary = useMemo(() => {
    const logs = hasilData.violationLogs || [];
    const grouped = {};

    logs.forEach((log) => {
      const cat = log.category || categorizeViolation(log.reason);
      grouped[cat] = (grouped[cat] || 0) + 1;
    });

    return {
      total: logs.length,
      breakdown: Object.entries(grouped).map(([kategori, jumlah]) => ({
        kategori,
        jumlah,
      })),
      logs,
    };
  }, [hasilData.violationLogs]);

  const currentSoal =
    hasilData.soal[activeSlideIndex] || hasilData.soal[0];
  const isTuntas = hasilData.nilaiAkhir >= hasilData.kkm;

  return (
    <div className="space-y-5">
      {/* Header Judul & Tombol Kembali */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-slate-800 sm:text-[26px]">
            Hasil {hasilData.judul}
          </h1>
          <p className="mt-1 text-[12px] text-slate-500">
            {hasilData.mataKuliah} · {hasilData.kelas} · Dikumpulkan{" "}
            {hasilData.dikumpulkanAt}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/mahasiswa/kuis")}
          className="inline-flex h-10 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:self-auto"
        >
          <ArrowLeft size={15} />
          <span>Kembali ke daftar kuis</span>
        </button>
      </div>

      {/* Baris Atas: Kartu Nilai Gelap (Kiri) + 3 Kartu Metrik & Banner Motivasi (Kanan) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Kartu Nilai Akhir (Dark Indigo Card) */}
        <div className="flex flex-col justify-between rounded-2xl bg-[#1E1B4B] p-6 text-white lg:col-span-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-indigo-200">
              Nilai akhir Anda
            </span>
            <Award size={18} className="text-indigo-300" />
          </div>

          <div className="my-5 flex items-baseline gap-1.5">
            <span className="text-[48px] font-bold leading-none tracking-tight">
              {hasilData.nilaiAkhir}
            </span>
            <span className="text-[16px] font-medium text-indigo-300">
              / {hasilData.nilaiMaksimal}
            </span>
          </div>

          <div>
            <span
              className={`inline-block rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                isTuntas
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-800"
              }`}
            >
              {isTuntas
                ? `Tuntas · KKM ${hasilData.kkm}`
                : `Belum Tuntas · KKM ${hasilData.kkm}`}
            </span>
            <p className="mt-3 text-[11px] text-indigo-200/80">
              {hasilData.statusNilai}
            </p>
          </div>
        </div>

        {/* Kanan: 3 Kartu Statistik + Banner Evaluasi */}
        <div className="flex flex-col justify-between gap-4 lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Stat 1: Pilihan Ganda */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500">
                  Pilihan ganda
                </span>
                <CheckCircle2 size={16} className="text-indigo-600" />
              </div>
              <p className="mt-3 text-[24px] font-bold tracking-tight text-slate-800">
                {hasilData.pgSkor}/{hasilData.pgMaksimal}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {hasilData.pgBenarCount} dari {hasilData.pgTotalCount} jawaban
                benar
              </p>
            </div>

            {/* Stat 2: Esai */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500">
                  Esai
                </span>
                <FileEdit size={16} className="text-indigo-600" />
              </div>
              <p className="mt-3 text-[24px] font-bold tracking-tight text-slate-800">
                {hasilData.esaiSkor}/{hasilData.esaiMaksimal}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {hasilData.esaiStatus}
              </p>
            </div>

            {/* Stat 3: Waktu Pengerjaan */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-slate-500">
                  Waktu pengerjaan
                </span>
                <Timer size={16} className="text-indigo-600" />
              </div>
              <p className="mt-3 text-[24px] font-bold tracking-tight text-slate-800">
                {hasilData.waktuPengerjaanText}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Dari durasi {hasilData.durasiMenit} menit
              </p>
            </div>
          </div>

          {/* Banner Evaluasi Hijau */}
          <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/80 p-4 sm:items-center">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-emerald-600 sm:mt-0"
            />
            <div>
              <p className="text-[12px] font-bold text-emerald-950">
                {hasilData.bannerTitle}
              </p>
              <p className="mt-0.5 text-[11px] text-emerald-800">
                {hasilData.bannerDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Baris Bawah: Ringkasan Jawaban & Log Pengawasan (Kiri) + Carousel Histori Soal (Kanan) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* ================= KOLOM KIRI ================= */}
        <div className="space-y-5 lg:col-span-5">
          {/* 1. Tabel Ringkasan Jawaban */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <h2 className="text-[15px] font-bold text-slate-800">
              Ringkasan jawaban
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {hasilData.pgTotalCount} pilihan ganda ·{" "}
              {hasilData.soal.length - hasilData.pgTotalCount} esai
            </p>

            {/* Header Tabel */}
            <div className="mt-4 grid grid-cols-3 rounded-lg bg-slate-50 px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Soal</span>
              <span className="text-center">Hasil</span>
              <span className="text-right">Poin</span>
            </div>

            {/* Baris Item Soal (Klik untuk lompat ke slide carousel soal tersebut) */}
            <div className="divide-y divide-slate-100">
              {hasilData.soal.map((item, idx) => {
                const isSelectedSlide = idx === activeSlideIndex;
                return (
                  <button
                    key={item.nomor}
                    type="button"
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`grid w-full grid-cols-3 items-center px-3.5 py-3 text-left text-[12px] transition ${
                      isSelectedSlide
                        ? "bg-indigo-50/60 font-semibold"
                        : "hover:bg-slate-50/80"
                    }`}
                  >
                    <span className="font-medium text-slate-700">
                      {item.nomor} ·{" "}
                      {item.tipe === "pilihan_ganda" ? "PG" : "Esai"}
                    </span>

                    <div className="flex justify-center">
                      {item.statusHasil === "Benar" && (
                        <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                          Benar
                        </span>
                      )}
                      {item.statusHasil === "Salah" && (
                        <span className="rounded-md bg-rose-50 px-2.5 py-0.5 text-[10px] font-semibold text-rose-700">
                          Salah
                        </span>
                      )}
                      {item.statusHasil === "Dinilai" && (
                        <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                          Dinilai
                        </span>
                      )}
                      {item.statusHasil === "Menunggu" && (
                        <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          Menunggu
                        </span>
                      )}
                    </div>

                    <span className="text-right font-bold text-indigo-600">
                      {item.poinDiperoleh}/{item.poinMaksimal}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-[10px] leading-relaxed text-slate-400">
              Klik baris soal di atas untuk melihat detail pembahasan pada
              panel sebelah kanan.
            </p>
          </div>

          {/* 2. Kartu Catatan Pengawasan Ujian (Detail Pelanggaran) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {violationSummary.total > 0 ? (
                  <ShieldAlert size={17} className="text-rose-600" />
                ) : (
                  <ShieldCheck size={17} className="text-emerald-600" />
                )}
                <h2 className="text-[14px] font-bold text-slate-800">
                  Catatan pengawasan ujian
                </h2>
              </div>

              <span
                className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold ${
                  violationSummary.total > 0
                    ? "bg-rose-50 text-rose-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                Total Pelanggaran: {violationSummary.total}
              </span>
            </div>

            {violationSummary.total === 0 ? (
              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                Tidak ada pelanggaran yang tercatat selama ujian berlangsung.
                Integritas pengerjaan terjaga dengan baik.
              </p>
            ) : (
              <div className="mt-3.5 space-y-3">
                {/* Rincian per Kategori (Contoh: Pindah Tab: 1, Screenshot: 1) */}
                <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3.5">
                  <p className="text-[11px] font-bold text-slate-800">
                    Total Pelanggaran: {violationSummary.total}
                  </p>
                  <ul className="mt-1.5 space-y-1 text-[11px] font-medium text-rose-700">
                    {violationSummary.breakdown.map((item) => (
                      <li
                        key={item.kategori}
                        className="flex items-center justify-between"
                      >
                        <span>- {item.kategori}</span>
                        <span className="font-bold">{item.jumlah}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Log Waktu Kejadian */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Riwayat Waktu Kejadian
                  </p>
                  <div className="max-h-[120px] space-y-1.5 overflow-y-auto pr-1 text-[11px]">
                    {violationSummary.logs.map((log, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-slate-600"
                      >
                        <span className="line-clamp-1">{log.reason}</span>
                        <span className="shrink-0 font-mono text-[10px] text-slate-400">
                          {log.waktu}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= KOLOM KANAN: CAROUSEL HISTORI JAWABAN PER SOAL ================= */}
        <div className="space-y-4 lg:col-span-7">
          {/* Header Kontrol Carousel */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-slate-700">
                Pembahasan &amp; Histori Jawaban
              </span>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                {activeSlideIndex + 1} / {hasilData.soal.length}
              </span>
            </div>

            {/* Tombol Prev / Next + Dot Indicators */}
            <div className="flex items-center gap-2">
              <div className="mr-2 hidden items-center gap-1.5 sm:flex">
                {hasilData.soal.map((s, idx) => (
                  <button
                    key={s.nomor}
                    type="button"
                    aria-label={`Soal ${s.nomor}`}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeSlideIndex
                        ? "w-5 bg-[#4F46E5]"
                        : "w-2 bg-slate-200 hover:bg-slate-300"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                disabled={activeSlideIndex === 0}
                onClick={() =>
                  setActiveSlideIndex((prev) => Math.max(0, prev - 1))
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                disabled={activeSlideIndex === hasilData.soal.length - 1}
                onClick={() =>
                  setActiveSlideIndex((prev) =>
                    Math.min(hasilData.soal.length - 1, prev + 1)
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Kartu Slide Aktif (Perbedaan Desain PG vs Esai) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7">
            {/* Header Nomor & Poin Soal */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-slate-500">
                Soal {currentSoal.nomor} ·{" "}
                {currentSoal.tipe === "pilihan_ganda"
                  ? "Pilihan ganda"
                  : "Esai"}
              </span>
              <span className="text-[13px] font-bold text-indigo-600">
                {currentSoal.poinDiperoleh}/{currentSoal.poinMaksimal} poin
              </span>
            </div>

            {/* Pertanyaan */}
            <h3 className="mt-4 text-[16px] font-medium leading-relaxed text-slate-800 sm:text-[17px]">
              {currentSoal.pertanyaan}
            </h3>

            {/* === DESAIN KHUSUS TIPE 1: PILIHAN GANDA === */}
            {currentSoal.tipe === "pilihan_ganda" && (
              <div className="mt-5 space-y-3">
                {currentSoal.statusHasil === "Benar" ? (
                  <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50/90 px-4 py-3.5 text-[13px] font-semibold text-emerald-800">
                    <CheckCircle2
                      size={17}
                      className="shrink-0 text-emerald-600"
                    />
                    <span>
                      {currentSoal.jawabanMahasiswaText} — Jawaban Anda benar
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 rounded-xl bg-rose-50/90 px-4 py-3.5 text-[13px] font-semibold text-rose-800">
                      <XCircle size={17} className="shrink-0 text-rose-600" />
                      <span>
                        {currentSoal.jawabanMahasiswaText} — Jawaban Anda kurang
                        tepat
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50/70 px-4 py-3 text-[12px] font-semibold text-emerald-800">
                      <CheckCircle2
                        size={16}
                        className="shrink-0 text-emerald-600"
                      />
                      <span>Kunci jawaban: {currentSoal.kunciJawabanText}</span>
                    </div>
                  </div>
                )}

                {currentSoal.pembahasan && (
                  <p className="pt-1 text-[12px] leading-relaxed text-slate-500">
                    {currentSoal.pembahasan}
                  </p>
                )}
              </div>
            )}

            {/* === DESAIN KHUSUS TIPE 2: ESAI === */}
            {currentSoal.tipe === "esai" && (
              <div className="mt-5 space-y-4">
                {/* Kotak Jawaban Mahasiswa */}
                <div className="rounded-xl bg-slate-50/90 p-4 font-mono text-[12px] leading-relaxed text-slate-700">
                  {currentSoal.jawabanEssai}
                </div>

                {/* Kotak Feedback Dosen */}
                <div className="flex items-start gap-3 rounded-xl bg-indigo-50/75 p-4">
                  <Info
                    size={17}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />
                  <div>
                    <p className="text-[12px] font-bold text-slate-800">
                      Feedback {currentSoal.namaDosen}
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-600">
                      {currentSoal.feedbackDosen}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Navigasi Bawah Kartu Carousel */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                disabled={activeSlideIndex === 0}
                onClick={() =>
                  setActiveSlideIndex((prev) => Math.max(0, prev - 1))
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                <span>Soal sebelumnya</span>
              </button>

              <button
                type="button"
                disabled={activeSlideIndex === hasilData.soal.length - 1}
                onClick={() =>
                  setActiveSlideIndex((prev) =>
                    Math.min(hasilData.soal.length - 1, prev + 1)
                  )
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 text-[12px] font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>Soal berikutnya</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}