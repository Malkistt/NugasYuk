import React, { useState, useMemo, useRef } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Info,
  FileText,
  UploadCloud,
  Upload,
  RefreshCw,
  CheckCircle2,
  X,
  Clock,
} from "lucide-react";

// Waktu simulasi saat ini (sesuai tanggal pada desain Navbar: 24 Okt 2026, 09.00 WIB)
// Catatan BE/FE: Saat integrasi real-time, ganti dengan Date.now()
const CURRENT_SIMULATED_TIME = new Date("2026-10-24T09:00:00").getTime();

// Data mentah terstruktur sebagai referensi kontrak data untuk Backend & Database
const INITIAL_TUGAS = [
  {
    id: 1,
    kodeMk: "IF203",
    mataKuliah: "Basis Data",
    kelas: "TI-3A",
    dosen: "Dr. Maya Putri, M.Kom.",
    judul: "Perancangan ERD",
    deadlineText: "26 Okt 2026, 23.59 WIB",
    deadlineFull: "Senin, 26 Oktober 2026 · 23.59 WIB",
    deadlineTimestamp: new Date("2026-10-26T23:59:00").getTime(),
    sisaWaktu: "2 hari lagi",
    status: "belum_dikumpulkan", // Enum: 'belum_dikumpulkan' | 'dikumpulkan' | 'sudah_dinilai'
    deskripsi: "Rancang ERD untuk sistem perpustakaan digital.",
    instruksi: [
      "Identifikasi minimal 5 entitas beserta atributnya.",
      "Tentukan primary key, foreign key, dan kardinalitas.",
      "Jelaskan relasi dan asumsi desain Anda.",
    ],
    catatanFormat:
      "Kumpulkan diagram dan penjelasan dalam satu berkas PDF. Gunakan format nama: NIM_Nama_ERD.pdf.",
    formatAllowed: "PDF",
    maxSize: "Maksimal 20 MB",
    lampiran: {
      nama: "Panduan_Perancangan_ERD.pdf",
      info: "PDF · 2,4 MB",
    },
    submission: null,
    penilaian: null,
  },
  {
    id: 2,
    kodeMk: "IF205",
    mataKuliah: "Pemrograman Web",
    kelas: "TI-3A",
    dosen: "Budi Santoso, M.T.",
    judul: "Halaman Web Responsif",
    deadlineText: "28 Okt 2026, 23.59 WIB",
    deadlineFull: "Rabu, 28 Oktober 2026 · 23.59 WIB",
    deadlineTimestamp: new Date("2026-10-28T23:59:00").getTime(),
    sisaWaktu: "4 hari lagi",
    status: "dikumpulkan",
    deskripsi:
      "Bangun halaman landing page responsif menggunakan Tailwind CSS atau CSS Grid & Flexbox.",
    instruksi: [
      "Pastikan tampilan mendukung layar mobile (360px) hingga desktop (1440px).",
      "Gunakan semantic HTML5 yang baik.",
      "Sertakan aset gambar dan file CSS terstruktur.",
    ],
    catatanFormat:
      "Kompres seluruh folder proyek dalam satu berkas ZIP. Format nama: NIM_Nama_Web.zip.",
    formatAllowed: "ZIP",
    maxSize: "Maksimal 25 MB",
    lampiran: {
      nama: "Spesifikasi_UI_Web.pdf",
      info: "PDF · 1,8 MB",
    },
    submission: {
      fileName: "231011024_Nadia_Web.zip",
      fileInfo: "ZIP · 4,2 MB",
      submittedAt: "24 Okt, 08.10 WIB",
      batasGanti: "28 Oktober, 23.59 WIB",
    },
    penilaian: null,
  },
  {
    id: 3,
    kodeMk: "IF203",
    mataKuliah: "Basis Data",
    kelas: "TI-3A",
    dosen: "Dr. Maya Putri, M.Kom.",
    judul: "Latihan Query SQL",
    deadlineText: "21 Okt 2026, 23.59 WIB",
    deadlineFull: "Rabu, 21 Oktober 2026 · 23.59 WIB",
    deadlineTimestamp: new Date("2026-10-21T23:59:00").getTime(),
    sisaWaktu: "Selesai",
    status: "sudah_dinilai",
    deskripsi:
      "Kerjakan 10 studi kasus query SQL meliputi SELECT, JOIN, GROUP BY, dan Subquery.",
    instruksi: [
      "Sertakan screenshot hasil eksekusi query pada DBMS.",
      "Tulis sintaks SQL dengan rapi dan beri komentar penjelasan.",
    ],
    catatanFormat:
      "Kumpulkan laporan dalam format PDF dengan nama: NIM_Nama_SQL.pdf.",
    formatAllowed: "PDF",
    maxSize: "Maksimal 15 MB",
    lampiran: {
      nama: "Studi_Kasus_SQL.pdf",
      info: "PDF · 1,1 MB",
    },
    submission: {
      fileName: "231011024_Nadia_SQL.pdf",
      fileInfo: "Dikumpulkan 21 Okt, 20.15 WIB",
      submittedAt: "21 Okt, 20.15 WIB",
      batasGanti: "21 Oktober, 23.59 WIB",
    },
    penilaian: {
      nilai: 88,
      terbitAt: "Terbit 23 Okt 2026, 14.30",
      feedback:
        "Query sudah tepat. Perhatikan konsistensi penulisan alias tabel.",
    },
  },
  {
    id: 4,
    kodeMk: "IF205",
    mataKuliah: "Pemrograman Web",
    kelas: "TI-3A",
    dosen: "Budi Santoso, M.T.",
    judul: "Validasi Form JavaScript",
    deadlineText: "02 Nov 2026, 23.59 WIB",
    deadlineFull: "Senin, 2 November 2026 · 23.59 WIB",
    deadlineTimestamp: new Date("2026-11-02T23:59:00").getTime(),
    sisaWaktu: "9 hari lagi",
    status: "belum_dikumpulkan",
    deskripsi:
      "Implementasikan validasi input sisi klien menggunakan JavaScript DOM.",
    instruksi: [
      "Validasi format email kampus dan kekuatan password.",
      "Tampilkan pesan error secara real-time di bawah input.",
    ],
    catatanFormat: "Unggah berkas dalam format ZIP.",
    formatAllowed: "ZIP",
    maxSize: "Maksimal 10 MB",
    lampiran: {
      nama: "Modul_DOM_Validation.pdf",
      info: "PDF · 950 KB",
    },
    submission: null,
    penilaian: null,
  },
];

export default function TugasMahasiswa() {
  const [tugasList, setTugasList] = useState(INITIAL_TUGAS);
  const [selectedId, setSelectedId] = useState(INITIAL_TUGAS[0].id);
  const [activeTab, setActiveTab] = useState("semua"); // 'semua' | 'belum_dikumpulkan' | 'dikumpulkan' | 'sudah_dinilai'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMk, setSelectedMk] = useState("Semua mata kuliah");
  const [sortBy, setSortBy] = useState("terdekat"); // 'terdekat' | 'terlama'

  // State interaksi unggah/ganti berkas
  const [selectedFile, setSelectedFile] = useState(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const fileInputRef = useRef(null);

  // Tugas yang sedang dibuka/dipilih saat ini
  const activeTask = useMemo(
    () => tugasList.find((t) => t.id === selectedId) || tugasList[0],
    [tugasList, selectedId]
  );

  // Cek apakah tugas yang sedang dibuka masih dalam masa tenggang revisi (sebelum deadline)
  const isBeforeDeadline =
    activeTask.deadlineTimestamp > CURRENT_SIMULATED_TIME;

  // LOGIKA PENGUMPULAN AKTIF (Global Ringkasan):
  // Mengambil SEMUA tugas dengan status 'dikumpulkan' yang BELUM melewati batas deadline.
  const pengumpulanAktifList = useMemo(
    () =>
      tugasList.filter(
        (t) =>
          t.status === "dikumpulkan" &&
          t.deadlineTimestamp > CURRENT_SIMULATED_TIME
      ),
    [tugasList]
  );

  // Daftar mata kuliah unik untuk dropdown filter
  const mataKuliahOptions = useMemo(() => {
    const unique = Array.from(new Set(tugasList.map((t) => t.mataKuliah)));
    return ["Semua mata kuliah", ...unique];
  }, [tugasList]);

  // Hitung badge jumlah masing-masing tab status
  const counts = useMemo(() => {
    return {
      semua: tugasList.length,
      belum_dikumpulkan: tugasList.filter(
        (t) => t.status === "belum_dikumpulkan"
      ).length,
      dikumpulkan: tugasList.filter((t) => t.status === "dikumpulkan").length,
      sudah_dinilai: tugasList.filter((t) => t.status === "sudah_dinilai")
        .length,
    };
  }, [tugasList]);

  // Filter & Urutkan daftar tugas pada panel kiri atas
  const filteredTugas = useMemo(() => {
    return tugasList
      .filter((item) => {
        const matchTab = activeTab === "semua" || item.status === activeTab;
        const matchMk =
          selectedMk === "Semua mata kuliah" || item.mataKuliah === selectedMk;
        const matchSearch =
          item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.mataKuliah.toLowerCase().includes(searchQuery.toLowerCase());
        return matchTab && matchMk && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === "terdekat") {
          return a.deadlineTimestamp - b.deadlineTimestamp;
        }
        return b.deadlineTimestamp - a.deadlineTimestamp;
      });
  }, [tugasList, activeTab, selectedMk, searchQuery, sortBy]);

  // Handler memilih tugas dari daftar
  const handleSelectTask = (id) => {
    setSelectedId(id);
    setSelectedFile(null);
    setIsReplacing(false);
  };

  // Handler memilih berkas dari komputer
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handler simulasi unggah atau ganti berkas tugas
  const handleUploadSubmit = () => {
    if (!selectedFile) return;

    const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(1);
    const ext = selectedFile.name.split(".").pop().toUpperCase();

    setTugasList((prev) =>
      prev.map((item) => {
        if (item.id === activeTask.id) {
          return {
            ...item,
            status: "dikumpulkan",
            submission: {
              fileName: selectedFile.name,
              fileInfo: `${ext} · ${sizeInMB === "0.0" ? "0,5" : sizeInMB} MB`,
              submittedAt: "Baru saja",
              batasGanti: item.deadlineText,
            },
          };
        }
        return item;
      })
    );

    setSelectedFile(null);
    setIsReplacing(false);
    setToastMsg(`Berkas "${selectedFile.name}" berhasil dikumpulkan!`);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Helper badge status pada kartu daftar tugas
  const renderStatusBadge = (status) => {
    if (status === "belum_dikumpulkan") {
      return (
        <span className="rounded-md bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
          Belum dikumpulkan
        </span>
      );
    }
    if (status === "dikumpulkan") {
      return (
        <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-600">
          Dikumpulkan
        </span>
      );
    }
    return (
      <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
        Sudah dinilai
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Toast Notifikasi Sukses */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] font-semibold text-emerald-800 shadow-lg">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Judul */}
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-slate-800 sm:text-[26px]">
          Tugas saya
        </h1>
        <p className="mt-1 text-[12px] text-slate-500 sm:text-[13px]">
          Pantau deadline, kumpulkan berkas, dan lihat hasil belajarmu.
        </p>
      </div>

      {/* Bar Pencarian, Filter Mata Kuliah, & Urutkan */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul tugas..."
            className="h-10 w-full rounded-xl border border-slate-200/90 bg-white pl-10 pr-4 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2.5">
          {/* Dropdown Mata Kuliah */}
          <div className="relative">
            <SlidersHorizontal
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <select
              value={selectedMk}
              onChange={(e) => setSelectedMk(e.target.value)}
              className="h-10 cursor-pointer appearance-none rounded-xl border border-slate-200/90 bg-white pl-9 pr-8 text-[12px] font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-500"
            >
              {mataKuliahOptions.map((mk) => (
                <option key={mk} value={mk}>
                  {mk}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Toggle Sort Deadline */}
          <button
            type="button"
            onClick={() =>
              setSortBy((prev) => (prev === "terdekat" ? "terlama" : "terdekat"))
            }
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 text-[12px] font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowUpDown size={14} className="text-slate-500" />
            <span>
              {sortBy === "terdekat" ? "Deadline terdekat" : "Deadline terlama"}
            </span>
          </button>
        </div>
      </div>

      {/* Tabs Status Filter */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-slate-200/80 text-[12px]">
        {[
          { key: "semua", label: `Semua (${counts.semua})` },
          {
            key: "belum_dikumpulkan",
            label: `Belum dikumpulkan (${counts.belum_dikumpulkan})`,
          },
          { key: "dikumpulkan", label: `Dikumpulkan (${counts.dikumpulkan})` },
          {
            key: "sudah_dinilai",
            label: `Sudah dinilai (${counts.sudah_dinilai})`,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap border-b-2 pb-3 font-semibold transition ${
                isActive
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Grid: Kiri (5/12 atau 4/12) & Kanan (7/12 atau 8/12) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* ================= KOLOM KIRI ================= */}
        <div className="space-y-5 lg:col-span-5 xl:col-span-4">
          {/* 1. Card Daftar Tugas (Max-Height & Scroll agar tidak kepanjangan ke bawah) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <div className="mb-3.5 flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-slate-800">
                Daftar tugas
              </h2>
              <span className="text-[10px] font-medium text-slate-400">
                {filteredTugas.length} tugas
              </span>
            </div>

            <div className="max-h-[340px] space-y-2.5 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
              {filteredTugas.length === 0 ? (
                <p className="py-8 text-center text-[12px] text-slate-400">
                  Tidak ada tugas yang sesuai filter.
                </p>
              ) : (
                filteredTugas.map((tugas) => {
                  const isSelected = tugas.id === activeTask.id;
                  return (
                    <button
                      key={tugas.id}
                      type="button"
                      onClick={() => handleSelectTask(tugas.id)}
                      className={`w-full rounded-xl border p-3.5 text-left transition ${
                        isSelected
                          ? "border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-500/10"
                          : "border-slate-100 bg-slate-50/60 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium text-slate-500">
                          {tugas.mataKuliah}
                        </span>
                        {renderStatusBadge(tugas.status)}
                      </div>
                      <h3 className="mt-1.5 text-[13px] font-bold text-slate-800">
                        {tugas.judul}
                      </h3>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Deadline · {tugas.deadlineText}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* 2. Card Nilai & Feedback (KONTEKSTUAL: Dipindahkan ke posisi tengah, mengikuti activeTask) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <h2 className="text-[14px] font-bold text-slate-800">
              Nilai &amp; feedback
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {activeTask.judul} · {activeTask.mataKuliah}
            </p>

            {/* Jika tugas yang dipilih SUDAH DINILAI */}
            {activeTask.status === "sudah_dinilai" && activeTask.penilaian ? (
              <div className="mt-3.5">
                <div className="flex items-center gap-3.5">
                  <span className="text-[32px] font-bold leading-none text-indigo-600">
                    {activeTask.penilaian.nilai}
                  </span>
                  <div>
                    <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Sudah dinilai
                    </span>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {activeTask.penilaian.terbitAt}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-[11px] italic leading-relaxed text-slate-600">
                  “{activeTask.penilaian.feedback}”
                </p>
                <p className="mt-1.5 text-[10px] text-slate-400">
                  {activeTask.dosen}
                </p>

                {activeTask.submission && (
                  <div className="mt-3.5 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <FileText size={15} />
                      </div>
                      <div className="truncate">
                        <p className="truncate text-[11px] font-semibold text-slate-700">
                          {activeTask.submission.fileName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {activeTask.submission.fileInfo}
                        </p>
                      </div>
                    </div>
                    <a
                      href="#buka-nilai"
                      className="ml-2 shrink-0 text-[11px] font-semibold text-indigo-600 hover:underline"
                    >
                      Buka
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* Jika tugas yang dipilih BELUM DINILAI */
              <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Clock size={16} />
                </div>
                <p className="mt-2.5 text-[12px] font-semibold text-slate-600">
                  {activeTask.status === "dikumpulkan"
                    ? "Menunggu penilaian dosen"
                    : "Belum ada nilai & feedback"}
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                  {activeTask.status === "dikumpulkan"
                    ? "Tugasmu sudah terkumpul. Skor dan catatan evaluasi akan muncul di sini setelah diperiksa dosen."
                    : "Kumpulkan tugas terlebih dahulu untuk mendapatkan nilai dan evaluasi dari dosen."}
                </p>
              </div>
            )}
          </div>

          {/* 3. Card Pengumpulan Aktif (Dipindahkan ke posisi bawah, menampilkan semua tugas berstatus 'dikumpulkan' & sebelum deadline) */}
          {pengumpulanAktifList.length > 0 && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-bold text-slate-800">
                  Pengumpulan aktif
                </h2>
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                  {pengumpulanAktifList.length} aktif
                </span>
              </div>

              <div className="mt-3 max-h-[270px] space-y-4 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
                {pengumpulanAktifList.map((task, idx) => (
                  <div
                    key={task.id}
                    className={idx > 0 ? "border-t border-slate-100 pt-4" : ""}
                  >
                    <p className="text-[11px] font-semibold text-slate-700">
                      {task.judul}{" "}
                      <span className="font-normal text-slate-400">
                        · {task.mataKuliah}
                      </span>
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="inline-block rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-600">
                        Dikumpulkan · {task.submission?.submittedAt}
                      </span>
                      <span className="inline-block rounded-md bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-700">
                        Batas revisi: {task.sisaWaktu}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <FileText size={15} />
                        </div>
                        <div className="truncate">
                          <p className="truncate text-[11px] font-semibold text-slate-700">
                            {task.submission?.fileName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {task.submission?.fileInfo}
                          </p>
                        </div>
                      </div>
                      <a
                        href="#unduh-aktif"
                        className="ml-2 shrink-0 text-[11px] font-semibold text-indigo-600 hover:underline"
                      >
                        Unduh
                      </a>
                    </div>

                    <p className="mt-2.5 text-[10px] leading-relaxed text-slate-400">
                      Berkas dapat diganti sebelum {task.submission?.batasGanti}
                      . Belum dinilai oleh dosen.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        handleSelectTask(task.id);
                        setIsReplacing(true);
                      }}
                      className="mt-2.5 flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
                    >
                      <RefreshCw size={13} />
                      <span>Ganti berkas</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= KOLOM KANAN ================= */}
        <div className="space-y-5 lg:col-span-7 xl:col-span-8">
          {/* 1. Card Detail Instruksi Tugas */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
                {activeTask.kodeMk} · {activeTask.mataKuliah}
              </span>
              <span className="rounded-md bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                {activeTask.sisaWaktu}
              </span>
            </div>

            <h2 className="mt-3.5 text-[22px] font-bold tracking-tight text-slate-800">
              {activeTask.judul}
            </h2>
            <p className="mt-1 text-[12px] text-slate-400">
              {activeTask.dosen} · {activeTask.kelas}
            </p>

            {/* Banner Deadline */}
            <div className="mt-5 flex items-center gap-2.5 rounded-xl bg-amber-50/90 px-4 py-3 text-[12px] font-semibold text-amber-900">
              <Info size={16} className="shrink-0 text-amber-600" />
              <span>Deadline: {activeTask.deadlineFull}</span>
            </div>

            {/* Deskripsi & Langkah Pengerjaan */}
            <div className="mt-5 space-y-3 text-[13px] leading-relaxed text-slate-600">
              <p>{activeTask.deskripsi}</p>
              <ol className="list-decimal space-y-1 pl-5">
                {activeTask.instruksi.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
              <p className="pt-1">{activeTask.catatanFormat}</p>
            </div>

            {/* File Panduan Dosen */}
            {activeTask.lampiran && (
              <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <FileText size={18} />
                  </div>
                  <div className="truncate">
                    <p className="truncate text-[12px] font-semibold text-slate-800">
                      {activeTask.lampiran.nama}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {activeTask.lampiran.info}
                    </p>
                  </div>
                </div>

                <div className="ml-3 flex shrink-0 items-center gap-2 text-[11px] font-semibold text-indigo-600">
                  <a href="#buka-panduan" className="hover:underline">
                    Buka
                  </a>
                  <span className="text-slate-300">·</span>
                  <a href="#unduh-panduan" className="hover:underline">
                    Unduh
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 2. Card Pengumpulan Anda (Kontekstual mengikuti tugas yang dipilih) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-slate-800">
                Pengumpulan Anda
              </h3>
              <span
                className={`text-[12px] font-semibold ${
                  activeTask.status === "sudah_dinilai"
                    ? "text-emerald-600"
                    : "text-indigo-600"
                }`}
              >
                {activeTask.status === "belum_dikumpulkan"
                  ? "Belum dikumpulkan"
                  : activeTask.status === "dikumpulkan"
                  ? "Sudah dikumpulkan"
                  : "Sudah dinilai"}
              </span>
            </div>

            {/* KONDISI A: Belum dikumpulkan ATAU sedang mode ganti berkas (selama belum lewat deadline) */}
            {(activeTask.status === "belum_dikumpulkan" ||
              (isReplacing && isBeforeDeadline)) && (
              <div className="mt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!selectedFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50/20"
                  >
                    <UploadCloud size={26} className="text-indigo-500" />
                    <p className="mt-2.5 text-[12px] font-semibold text-indigo-600">
                      Pilih berkas tugas untuk dikumpulkan
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {activeTask.formatAllowed} · {activeTask.maxSize}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/40 p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <FileText size={18} />
                      </div>
                      <div className="truncate">
                        <p className="truncate text-[12px] font-semibold text-slate-800">
                          {selectedFile.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Siap diunggah ·{" "}
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-rose-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <p className="mt-3.5 text-[11px] leading-relaxed text-slate-400">
                  Anda dapat mengganti berkas setelah pengumpulan selama belum
                  melewati deadline. Berkas terakhir akan dinilai.
                </p>

                <div className="mt-4 flex items-center gap-3">
                  {isReplacing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsReplacing(false);
                        setSelectedFile(null);
                      }}
                      className="h-11 rounded-xl border border-slate-200 px-4 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Batal
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleUploadSubmit}
                    disabled={!selectedFile}
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#4F46E5] text-[12px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Upload size={15} />
                    <span>
                      {isReplacing
                        ? "Simpan perubahan berkas"
                        : "Unggah & kumpulkan tugas"}
                    </span>
                  </button>
                </div>

                <p className="mt-3 text-center text-[10px] text-slate-400">
                  Nilai dan feedback akan muncul setelah diterbitkan dosen.
                </p>
              </div>
            )}

            {/* KONDISI B: Sudah dikumpulkan (dan tidak sedang mode ganti berkas) */}
            {activeTask.status === "dikumpulkan" && !isReplacing && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <FileText size={18} />
                    </div>
                    <div className="truncate">
                      <p className="truncate text-[12px] font-semibold text-slate-800">
                        {activeTask.submission?.fileName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {activeTask.submission?.fileInfo} · Dikumpulkan{" "}
                        {activeTask.submission?.submittedAt}
                      </p>
                    </div>
                  </div>
                  <a
                    href="#unduh-berkas"
                    className="text-[11px] font-semibold text-indigo-600 hover:underline"
                  >
                    Unduh
                  </a>
                </div>

                {isBeforeDeadline ? (
                  <button
                    type="button"
                    onClick={() => setIsReplacing(true)}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-[12px] font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
                  >
                    <RefreshCw size={14} />
                    <span>Ganti berkas pengumpulan</span>
                  </button>
                ) : (
                  <p className="text-center text-[11px] text-slate-400">
                    Batas waktu pengumpulan telah berakhir. Berkas terkunci dan
                    menunggu penilaian dosen.
                  </p>
                )}
              </div>
            )}

            {/* KONDISI C: Sudah dinilai */}
            {activeTask.status === "sudah_dinilai" && (
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-emerald-800">
                        Nilai Akhir Tugas
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-600">
                        “{activeTask.penilaian?.feedback}”
                      </p>
                    </div>
                    <span className="text-[28px] font-bold text-indigo-600">
                      {activeTask.penilaian?.nilai}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <FileText size={16} />
                    </div>
                    <div className="truncate">
                      <p className="truncate text-[12px] font-semibold text-slate-700">
                        {activeTask.submission?.fileName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {activeTask.submission?.fileInfo}
                      </p>
                    </div>
                  </div>
                  <a
                    href="#unduh-final"
                    className="text-[11px] font-semibold text-indigo-600 hover:underline"
                  >
                    Unduh
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}