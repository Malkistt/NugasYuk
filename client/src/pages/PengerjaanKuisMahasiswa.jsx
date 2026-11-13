import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Timer,
  Info,
  ArrowLeft,
  ArrowRight,
  ListChecks,
  Send,
  CheckCircle2,
  X,
  AlertCircle,
  ShieldAlert,
  Maximize2,
  BookOpen,
} from "lucide-react";

const QUIZ_DATA = {
  id: 1,
  mataKuliah: "Basis Data",
  judul: "Kuis Normalisasi",
  totalSoal: 5,
  nilaiMaksimal: 100,
  mulaiPukul: "09.15 WIB",
  durasiDetikAwal: 30 * 60, // 30 menit
  soal: [
    {
      nomor: 1,
      tipe: "pilihan_ganda",
      poin: 20,
      pertanyaan:
        "Manakah syarat utama sebuah tabel memenuhi bentuk normal pertama (1NF)?",
      opsi: [
        { key: "A", text: "Setiap atribut memiliki nilai yang atomik." },
        { key: "B", text: "Semua atribut bukan kunci bergantung transitif." },
        { key: "C", text: "Tabel tidak memiliki primary key." },
        { key: "D", text: "Semua data disimpan dalam satu kolom." },
      ],
    },
    {
      nomor: 2,
      tipe: "pilihan_ganda",
      poin: 20,
      pertanyaan:
        "Ketergantungan fungsional di mana atribut non-kunci bergantung hanya pada sebagian dari composite primary key disebut...",
      opsi: [
        { key: "A", text: "Ketergantungan transitif (Transitive dependency)" },
        { key: "B", text: "Ketergantungan parsial (Partial dependency)" },
        { key: "C", text: "Ketergantungan penuh (Full functional dependency)" },
        { key: "D", text: "Ketergantungan multivalued (Multivalued dependency)" },
      ],
    },
    {
      nomor: 3,
      tipe: "pilihan_ganda",
      poin: 20,
      pertanyaan:
        "Sebuah relasi sudah berada dalam bentuk 2NF dan tidak memiliki ketergantungan transitif antar atribut non-kunci. Bentuk normal apakah yang telah terpenuhi?",
      opsi: [
        { key: "A", text: "Unnormalized Form (UNF)" },
        { key: "B", text: "First Normal Form (1NF)" },
        { key: "C", text: "Second Normal Form (2NF)" },
        { key: "D", text: "Third Normal Form (3NF)" },
      ],
    },
    {
      nomor: 4,
      tipe: "pilihan_ganda",
      poin: 20,
      pertanyaan:
        "Anomali yang terjadi ketika penghapusan suatu baris data menyebabkan hilangnya informasi penting lain yang tidak terkait langsung disebut...",
      opsi: [
        { key: "A", text: "Insertion anomaly" },
        { key: "B", text: "Update anomaly" },
        { key: "C", text: "Deletion anomaly" },
        { key: "D", text: "Selection anomaly" },
      ],
    },
    {
      nomor: 5,
      tipe: "esai",
      poin: 20,
      pertanyaan:
        "Jelaskan perbedaan ketergantungan parsial dan transitif. Berikan contoh perbaikan tabel peminjaman perpustakaan hingga memenuhi 3NF.",
    },
  ],
};

export default function PengerjaanKuisMahasiswa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sessionKey = `nugasyuk_kuis_session_${id || QUIZ_DATA.id}`;

  // Muat sesi tersimpan dari localStorage agar timer & jawaban persisten
  const loadInitialSession = () => {
    try {
      const raw = localStorage.getItem(sessionKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.endTime > Date.now()) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    const freshSession = {
      endTime: Date.now() + QUIZ_DATA.durasiDetikAwal * 1000,
      answers: {}, // Mulai kosong tanpa jawaban terpilih
      violationCount: 0,
      violationLogs: [],
    };
    localStorage.setItem(sessionKey, JSON.stringify(freshSession));
    return freshSession;
  };

  const initialSession = useMemo(() => loadInitialSession(), [sessionKey]);

  const [currentNomor, setCurrentNomor] = useState(1);
  const [answers, setAnswers] = useState(initialSession.answers);
  const [endTime] = useState(initialSession.endTime);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((initialSession.endTime - Date.now()) / 1000))
  );

  // State Pelanggaran Mode Fokus (Anti-Cheating)
  const [violationCount, setViolationCount] = useState(
    initialSession.violationCount || 0
  );
  const [violationLogs, setViolationLogs] = useState(
    initialSession.violationLogs || []
  );
  const [warningModal, setWarningModal] = useState(null);
  const isSubmittingRef = useRef(false);
  const lastViolationTimeRef = useRef(0);

  const [lastSavedTime, setLastSavedTime] = useState("Baru dimulai");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const currentSoal = useMemo(
    () =>
      QUIZ_DATA.soal.find((s) => s.nomor === currentNomor) || QUIZ_DATA.soal[0],
    [currentNomor]
  );

  // Simpan progres sesi ke localStorage
  useEffect(() => {
    if (isSubmittingRef.current) return;
    localStorage.setItem(
      sessionKey,
      JSON.stringify({
        endTime,
        answers,
        violationCount,
        violationLogs,
      })
    );
  }, [answers, violationCount, violationLogs, endTime, sessionKey]);

  // Pencatat pelanggaran dengan kategori eksplisit & override jika blur dipicu oleh Screenshot
  const recordViolation = (category, reason, isScreenshotOverride = false) => {
    if (isSubmittingRef.current) return;
    const now = Date.now();
    const timeDiff = now - lastViolationTimeRef.current;

    const timeStr = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Jika blur baru saja terjadi (< 1 detik) lalu disusul tombol Screenshot,
    // perbarui log terakhir menjadi "Screenshot" tanpa menambah double-count
    if (isScreenshotOverride && timeDiff < 1000) {
      setViolationLogs((prev) => {
        if (prev.length === 0) return [{ category, reason, waktu: timeStr }];
        const updated = [...prev];
        updated[updated.length - 1] = { category, reason, waktu: timeStr };
        return updated;
      });
      setWarningModal(reason);
      return;
    }

    if (timeDiff < 1500) return;
    lastViolationTimeRef.current = now;

    setViolationCount((prev) => prev + 1);
    setViolationLogs((prev) => [...prev, { category, reason, waktu: timeStr }]);
    setWarningModal(reason);
  };

  // Listener Lengkap: Pindah Tab, Fullscreen, Anti-Copas, Screenshot, & Sidebar AI
  useEffect(() => {
    // 1. Pindah Tab / Minimize Browser
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation(
          "Pindah Tab",
          "Terdeteksi berpindah tab atau meminimalkan browser."
        );
      }
    };

    // 2. Kehilangan Fokus Jendela (termasuk klik panel Ask Gemini / Copilot)
    const handleWindowBlur = () => {
      recordViolation(
        "Pindah Tab",
        "Terdeteksi meninggalkan jendela ujian atau membuka panel samping."
      );
    };

    // 3. Keluar dari Mode Fullscreen
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isSubmittingRef.current) {
        recordViolation(
          "Keluar Fullscreen",
          "Terdeteksi keluar dari mode layar penuh (Fullscreen)."
        );
      }
    };

    // 4. Blokir Copy, Cut, Paste, & Klik Kanan
    const preventClipboard = (e) => {
      e.preventDefault();
      recordViolation(
        "Percobaan Copy-Paste",
        `Percobaan melakukan ${e.type.toUpperCase()} atau klik kanan diblokir.`
      );
    };

    // 5. Deteksi Shortcut Keyboard (Copy/Paste, DevTools, Snipping Tool)
    const handleKeyDown = (e) => {
      // Blokir Ctrl/Cmd + C, V, X, U, P, S
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "v", "x", "u", "p", "s"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        recordViolation(
          "Percobaan Copy-Paste",
          `Shortcut keyboard (${e.key.toUpperCase()}) tidak diizinkan selama ujian.`
        );
      }

      // Blokir F12 & Ctrl+Shift+I/J/C (Inspect Element)
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          ["i", "j", "c"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        recordViolation(
          "Developer Tools",
          "Percobaan membuka Developer Tools terdeteksi."
        );
      }

      // Deteksi Snipping Tool (Win + Shift + S atau Cmd + Shift + 3/4/5) -> Override blur
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        ["s", "3", "4", "5"].includes(e.key.toLowerCase())
      ) {
        recordViolation(
          "Screenshot",
          "Terdeteksi kombinasi tombol tangkapan layar (Screenshot).",
          true
        );
      }
    };

    // 6. Deteksi Tombol PrintScreen -> Override blur
    const handleKeyUp = (e) => {
      if (e.key === "PrintScreen") {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("").catch(() => {});
        }
        recordViolation(
          "Screenshot",
          "Terdeteksi menekan tombol PrintScreen (Screenshot).",
          true
        );
      }
    };

    // 7. Deteksi Pembukaan Sidebar AI (Ask Gemini / Copilot) atau Split-Screen saat Fullscreen
    const handleResize = () => {
      if (document.fullscreenElement) {
        const widthDiff = Math.abs(window.screen.width - window.innerWidth);
        if (widthDiff > 150) {
          recordViolation(
            "Panel AI / Split Screen",
            "Terdeteksi membuka panel samping browser (Sidebar AI / Split Screen)."
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("copy", preventClipboard);
    document.addEventListener("cut", preventClipboard);
    document.addEventListener("paste", preventClipboard);
    document.addEventListener("contextmenu", preventClipboard);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy", preventClipboard);
      document.removeEventListener("cut", preventClipboard);
      document.removeEventListener("paste", preventClipboard);
      document.removeEventListener("contextmenu", preventClipboard);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fungsi kembali ke layar penuh setelah terkena peringatan
  const handleReEnterFullscreen = async () => {
    setWarningModal(null);
    try {
      if (
        !document.fullscreenElement &&
        document.documentElement.requestFullscreen
      ) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      console.warn("Gagal masuk fullscreen:", e);
    }
  };

  // Timer countdown persisten berdasarkan endTime
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        handleFinalSubmit();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  // Blokir Tombol Back pada Mouse (Mouse Button 4) & Tombol Back Browser
  useEffect(() => {
    window.history.pushState({ examLock: true }, "", window.location.href);

    const handlePopState = () => {
      if (isSubmittingRef.current) return;
      window.history.pushState({ examLock: true }, "", window.location.href);
      recordViolation(
        "Navigasi Keluar (Back)",
        "Terdeteksi menekan tombol Kembali (Back browser / tombol samping mouse)."
      );
    };

    const handleMouseDown = (e) => {
      if (e.button === 3 || e.button === 4) {
        e.preventDefault();
        recordViolation(
          "Navigasi Keluar (Back)",
          "Tombol navigasi tambahan pada mouse dinonaktifkan selama ujian."
        );
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const formattedTime = useMemo(() => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, [secondsLeft]);

  const triggerAutoSave = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    setLastSavedTime(`${hh}.${mm}.${ss} WIB`);
  };

  const handleSelectOption = (optionKey) => {
    setAnswers((prev) => ({ ...prev, [currentNomor]: optionKey }));
    triggerAutoSave();
  };

  const handleEssayChange = (text) => {
    setAnswers((prev) => ({ ...prev, [currentNomor]: text }));
    triggerAutoSave();
  };

  const isSoalAnswered = (nomor) => {
    const val = answers[nomor];
    return typeof val === "string" && val.trim().length > 0;
  };

  const { answeredCount, unansweredList } = useMemo(() => {
    let count = 0;
    const unanswered = [];
    QUIZ_DATA.soal.forEach((s) => {
      if (isSoalAnswered(s.nomor)) count += 1;
      else unanswered.push(s.nomor);
    });
    return { answeredCount: count, unansweredList: unanswered };
  }, [answers]);

  const unansweredInfoText = useMemo(() => {
    if (unansweredList.length === 0) {
      return "Semua soal telah terjawab. Silakan tinjau kembali sebelum mengirim.";
    }
    if (unansweredList.length === 1) {
      return `Soal ${unansweredList[0]} belum dijawab. Klik nomor untuk memeriksa jawaban.`;
    }
    const last = unansweredList[unansweredList.length - 1];
    const rest = unansweredList.slice(0, -1).join(", ");
    return `Soal ${rest} dan ${last} belum dijawab. Klik nomor untuk memeriksa jawaban.`;
  }, [unansweredList]);

// Kirim Jawaban Akhir -> Hitung Durasi Aktual -> Keluar Fullscreen -> Pindah ke Hasil Kuis
  // Kirim Jawaban Akhir -> Hitung Durasi Aktual (detik) -> Keluar Fullscreen -> Pindah ke Hasil Kuis
  const handleFinalSubmit = async () => {
    isSubmittingRef.current = true;
    setShowConfirmSubmit(false);
    setShowReviewModal(false);
    localStorage.removeItem(sessionKey);

    const remainingSecs = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    const elapsedSecs = Math.max(1, QUIZ_DATA.durasiDetikAwal - remainingSecs);
    const durasiMenit = Math.round(QUIZ_DATA.durasiDetikAwal / 60);

    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn(e);
    }

    navigate(`/mahasiswa/kuis/${id || QUIZ_DATA.id}/hasil`, {
      state: {
        answers,
        quiz: QUIZ_DATA,
        violationCount,
        violationLogs,
        elapsedSecs,
        durasiMenit,
      },
    });
  };

  return (
    <div className="min-h-screen select-none bg-[#F8FAFC] font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      {/* Top Bar Khusus Mode Fokus (Menggantikan Sidebar & Navbar) */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white px-6 py-3.5 shadow-2xs lg:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4">
          {/* Logo & Indikator Mode Fokus */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5] text-white">
              <BookOpen size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-slate-800">
                  ruangkuliah
                </span>
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                  Mode Fokus Aktif
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Nadia Rahma (231011024) · TI-3A
              </p>
            </div>
          </div>

          {/* Kanan: Indikator Pelanggaran + Tombol Fullscreen */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold ${
                violationCount > 0
                  ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              <ShieldAlert size={14} />
              <span>
                {violationCount > 0
                  ? `Pelanggaran tercatat: ${violationCount}x`
                  : "Pengawasan aktif · 0 pelanggaran"}
              </span>
            </div>

            {!document.fullscreenElement && (
              <button
                type="button"
                onClick={handleReEnterFullscreen}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Maximize2 size={13} />
                <span>Layar penuh</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Konten Utama Pengerjaan Kuis */}
      <main className="mx-auto max-w-[1200px] space-y-5 px-6 py-7 lg:px-10">
        {/* Header Judul Kuis & Timer */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight text-slate-800 sm:text-[26px]">
              {QUIZ_DATA.judul}
            </h1>
            <p className="mt-1 text-[12px] text-slate-500">
              {QUIZ_DATA.mataKuliah} · {QUIZ_DATA.totalSoal} soal · Nilai
              maksimal {QUIZ_DATA.nilaiMaksimal} · Dimulai pukul{" "}
              {QUIZ_DATA.mulaiPukul}
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-2 self-start rounded-xl px-4 py-2.5 text-[14px] font-bold sm:self-auto ${
              secondsLeft <= 300
                ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                : "bg-amber-50 text-amber-800"
            }`}
          >
            <Timer size={18} />
            <span>{formattedTime} tersisa</span>
          </div>
        </div>

        {/* Banner Auto-Save */}
        <div className="flex items-start gap-3 rounded-2xl bg-indigo-50/75 px-4 py-3.5 sm:items-center">
          <Info size={18} className="mt-0.5 shrink-0 text-indigo-600 sm:mt-0" />
          <div>
            <p className="text-[12px] font-bold text-slate-800">
              Jawaban tersimpan otomatis · Terakhir disimpan {lastSavedTime}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Fitur salin-tempel (copy-paste) dinonaktifkan. Tetap berada di
              layar penuh hingga jawaban dikirim.
            </p>
          </div>
        </div>

        {/* Grid Soal & Navigasi */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* KOLOM KIRI: KARTU SOAL AKTIF */}
          <div className="space-y-5 lg:col-span-8">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-slate-500">
                  Soal {currentSoal.nomor} ·{" "}
                  {currentSoal.tipe === "pilihan_ganda"
                    ? "Pilihan ganda"
                    : "Esai"}
                </span>
                <span className="text-[12px] font-bold text-indigo-600">
                  {currentSoal.poin} poin
                </span>
              </div>

              <h2 className="mt-4 text-[16px] font-medium leading-relaxed text-slate-800 sm:text-[17px]">
                {currentSoal.pertanyaan}
              </h2>

              {/* Pilihan Ganda */}
              {currentSoal.tipe === "pilihan_ganda" && (
                <div className="mt-6 space-y-3">
                  {currentSoal.opsi.map((option) => {
                    const isSelected = answers[currentSoal.nomor] === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => handleSelectOption(option.key)}
                        className={`flex w-full items-center gap-3.5 rounded-xl border px-4 py-3.5 text-left transition ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50/50 text-slate-900 ring-2 ring-indigo-500/10"
                            : "border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? "border-indigo-600 bg-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
                          )}
                        </span>

                        <span className="text-[13px] font-medium">
                          <strong className="mr-1.5 font-semibold">
                            {option.key}.
                          </strong>
                          {option.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Esai */}
              {currentSoal.tipe === "esai" && (
                <div className="mt-6">
                  <label
                    htmlFor="jawaban-esai"
                    className="mb-2 block text-[12px] font-bold text-slate-700"
                  >
                    Jawaban Anda
                  </label>
                  <textarea
                    id="jawaban-esai"
                    rows={6}
                    value={answers[currentSoal.nomor] || ""}
                    onChange={(e) => handleEssayChange(e.target.value)}
                    placeholder="Ketik jawaban Anda secara langsung di sini (paste dinonaktifkan)..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-4 text-[13px] leading-relaxed text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                  <p className="mt-2 text-[11px] text-slate-400">
                    Jawaban tersimpan otomatis ·{" "}
                    {(answers[currentSoal.nomor] || "").length} karakter
                  </p>
                </div>
              )}
            </div>

            {/* Navigasi Bawah */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={currentNomor === 1}
                  onClick={() =>
                    setCurrentNomor((prev) => Math.max(1, prev - 1))
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <ArrowLeft size={15} />
                  <span>Soal sebelumnya</span>
                </button>

                {currentNomor < QUIZ_DATA.totalSoal && (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentNomor((prev) =>
                        Math.min(QUIZ_DATA.totalSoal, prev + 1)
                      )
                    }
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
                  >
                    <span>Soal selanjutnya</span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                <ListChecks size={15} />
                <span>Tinjau semua jawaban</span>
              </button>
            </div>
          </div>

          {/* KOLOM KANAN: NAVIGASI SOAL & SELESAIKAN KUIS */}
          <div className="space-y-5 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
              <h3 className="text-[15px] font-bold text-slate-800">
                Navigasi soal
              </h3>

              <div className="mt-4 grid grid-cols-5 gap-2.5">
                {QUIZ_DATA.soal.map((s) => {
                  const answered = isSoalAnswered(s.nomor);
                  const isCurrent = s.nomor === currentNomor;

                  return (
                    <button
                      key={s.nomor}
                      type="button"
                      onClick={() => setCurrentNomor(s.nomor)}
                      className={`flex h-10 w-full items-center justify-center rounded-xl text-[13px] font-bold transition ${
                        answered
                          ? "bg-[#4F46E5] text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      } ${
                        isCurrent ? "ring-2 ring-slate-900 ring-offset-2" : ""
                      }`}
                    >
                      {s.nomor}
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-[11px] font-medium text-slate-600">
                {answeredCount} dari {QUIZ_DATA.totalSoal} soal terjawab
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#4F46E5] transition-all duration-300"
                  style={{
                    width: `${(answeredCount / QUIZ_DATA.totalSoal) * 100}%`,
                  }}
                />
              </div>

              <div className="mt-3.5 flex items-center gap-2 text-[10px] font-semibold">
                <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-indigo-600">
                  Terjawab
                </span>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-500">
                  Belum dijawab
                </span>
              </div>

              <p className="mt-3.5 text-[11px] leading-relaxed text-slate-400">
                {unansweredInfoText}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
              <h3 className="text-[15px] font-bold text-slate-800">
                Selesaikan kuis
              </h3>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                Setelah jawaban dikirim, Anda tidak dapat mengubahnya. Pastikan
                semua soal sudah terjawab.
              </p>

              <button
                type="button"
                onClick={() => setShowConfirmSubmit(true)}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] text-[12px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99]"
              >
                <Send size={15} />
                <span>Kirim jawaban</span>
              </button>

              <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-400">
                PG dinilai otomatis. Nilai esai menunggu pemeriksaan dosen.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ================= MODAL PERINGATAN PELANGGARAN ================= */}
      {warningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border-2 border-rose-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <ShieldAlert size={24} />
              </div>
              <div>
                <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-700">
                  Peringatan Pengawasan ({violationCount}x)
                </span>
                <h3 className="mt-0.5 text-[16px] font-bold text-slate-800">
                  Aktivitas Pelanggaran Ujian Terdeteksi
                </h3>
              </div>
            </div>

            <p className="mt-4 text-[12px] leading-relaxed text-slate-600">
              {warningModal} Tindakan ini telah{" "}
              <strong className="text-rose-600">
                dicatat ke dalam log pengawasan ujian
              </strong>{" "}
              dan akan dilaporkan kepada dosen pengampu mata kuliah.
            </p>

            <button
              type="button"
              onClick={handleReEnterFullscreen}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-rose-600 text-[12px] font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              <Maximize2 size={15} />
              <span>Saya Mengerti &amp; Kembali ke Layar Penuh</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL TINJAU SEMUA JAWABAN ================= */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <h3 className="text-[16px] font-bold text-slate-800">
                  Tinjau semua jawaban
                </h3>
                <p className="text-[11px] text-slate-400">
                  Klik nomor soal untuk kembali dan mengubah jawaban
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 max-h-[340px] space-y-2.5 overflow-y-auto pr-1">
              {QUIZ_DATA.soal.map((s) => {
                const answered = isSoalAnswered(s.nomor);
                const val = answers[s.nomor];
                return (
                  <button
                    key={s.nomor}
                    type="button"
                    onClick={() => {
                      setCurrentNomor(s.nomor);
                      setShowReviewModal(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-left transition hover:border-indigo-300 hover:bg-indigo-50/30"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-[12px] font-bold text-slate-800">
                        Soal {s.nomor}{" "}
                        <span className="font-normal text-slate-400">
                          ·{" "}
                          {s.tipe === "pilihan_ganda"
                            ? "Pilihan ganda"
                            : "Esai"}
                        </span>
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {answered
                          ? s.tipe === "pilihan_ganda"
                            ? `Jawaban dipilih: Opsi ${val}`
                            : val
                          : "Belum ada jawaban"}
                      </p>
                    </div>

                    {answered ? (
                      <span className="shrink-0 rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-600">
                        Terjawab
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-md bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                        Kosong
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="h-10 rounded-xl border border-slate-200 px-4 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
              >
                Lanjut kerjakan
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false);
                  setShowConfirmSubmit(true);
                }}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#4F46E5] px-4 text-[12px] font-semibold text-white hover:bg-indigo-700"
              >
                <Send size={14} />
                <span>Kirim jawaban</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI KIRIM JAWABAN ================= */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  unansweredList.length > 0
                    ? "bg-amber-50 text-amber-600"
                    : "bg-indigo-50 text-indigo-600"
                }`}
              >
                {unansweredList.length > 0 ? (
                  <AlertCircle size={20} />
                ) : (
                  <CheckCircle2 size={20} />
                )}
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-slate-800">
                  Kirim jawaban kuis?
                </h3>
                <p className="text-[11px] text-slate-500">
                  {answeredCount} dari {QUIZ_DATA.totalSoal} soal terjawab
                </p>
              </div>
            </div>

            <p className="mt-4 text-[12px] leading-relaxed text-slate-600">
              {unansweredList.length > 0
                ? `Masih ada ${unansweredList.length} soal yang belum dijawab (Soal ${unansweredList.join(", ")}). Setelah dikirim, jawaban tidak dapat diubah lagi.`
                : "Semua soal sudah terjawab. Setelah dikirim, jawaban akan dikunci dan langsung diproses."}
            </p>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="h-10 rounded-xl border border-slate-200 px-4 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
              >
                Periksa kembali
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#4F46E5] px-4 text-[12px] font-semibold text-white hover:bg-indigo-700"
              >
                <Send size={14} />
                <span>Ya, kirim sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}