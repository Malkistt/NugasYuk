import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  FolderOpen,
  FileText,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowRight,
  ExternalLink,
  Download,
  ChevronsUpDown,
} from "lucide-react";

const INITIAL_MATERI_GROUPS = [
  {
    id: "if203",
    kodeMk: "IF203",
    mataKuliah: "Basis Data",
    kelas: "TI-3A",
    dosen: "Dr. Maya Putri, M.Kom.",
    materiList: [
      {
        id: 101,
        pertemuan: 7,
        topik: "Normalisasi",
        isBaru: true,
        judulFile: "Normalisasi 1NF–3NF",
        sumber: "Google Drive",
        tipeLabel: "Google Drive",
        metaText: "Tautan folder · Ditambahkan 23 Okt 2026",
        timestamp: new Date("2026-10-23T10:00:00").getTime(),
        deskripsi:
          "Konsep ketergantungan fungsional dan tahapan normalisasi dengan contoh perpustakaan digital.",
        url: "#drive-normalisasi",
      },
      {
        id: 102,
        pertemuan: 6,
        topik: "Query SQL",
        isBaru: false,
        judulFile: "Modul Latihan Query SQL.pdf",
        sumber: "PDF",
        tipeLabel: "PDF",
        metaText: "1,8 MB · Ditambahkan 19 Okt 2026",
        timestamp: new Date("2026-10-19T14:00:00").getTime(),
        deskripsi: "SELECT, WHERE, ORDER BY, dan fungsi agregat.",
        url: "#pdf-query-sql",
      },
      {
        id: 103,
        pertemuan: 5,
        topik: "Perancangan basis data",
        isBaru: false,
        judulFile: "Panduan Perancangan ERD.pdf",
        sumber: "PDF",
        tipeLabel: "PDF",
        metaText: "2,4 MB · Ditambahkan 12 Okt 2026",
        timestamp: new Date("2026-10-12T09:00:00").getTime(),
        deskripsi:
          "Entitas, atribut, relasi, dan kardinalitas dalam ERD.",
        url: "#pdf-erd",
      },
      {
        id: 104,
        pertemuan: 4,
        topik: "Aljabar Relasional",
        isBaru: false,
        judulFile: "Slide Aljabar Relasional.pdf",
        sumber: "PDF",
        tipeLabel: "PDF",
        metaText: "1,5 MB · Ditambahkan 5 Okt 2026",
        timestamp: new Date("2026-10-05T09:00:00").getTime(),
        deskripsi:
          "Operasi dasar seleksi, proyeksi, union, dan join pada relasi.",
        url: "#pdf-aljabar",
      },
    ],
  },
  {
    id: "if205",
    kodeMk: "IF205",
    mataKuliah: "Pemrograman Web",
    kelas: "TI-3A",
    dosen: "Dr. Maya Putri, M.Kom.",
    materiList: [
      {
        id: 201,
        pertemuan: 6,
        topik: "Desain responsif",
        isBaru: false,
        judulFile: "CSS Flexbox & Grid",
        sumber: "Google Drive",
        tipeLabel: "Google Drive",
        metaText: "Tautan presentasi · Ditambahkan 22 Okt 2026",
        timestamp: new Date("2026-10-22T11:00:00").getTime(),
        deskripsi: "Teknik layout responsif untuk berbagai ukuran layar.",
        url: "#drive-flexbox-grid",
      },
    ],
  },
  {
    id: "if207",
    kodeMk: "IF207",
    mataKuliah: "Jaringan Komputer",
    kelas: "TI-3A",
    dosen: "Ir. Budi Santoso, M.T.",
    materiList: [
      {
        id: 301,
        pertemuan: 7,
        topik: "Subnetting & CIDR",
        isBaru: true,
        judulFile: "Modul Perhitungan Subnetting IPv4.pdf",
        sumber: "PDF",
        tipeLabel: "PDF",
        metaText: "2,1 MB · Ditambahkan 23 Okt 2026",
        timestamp: new Date("2026-10-23T08:00:00").getTime(),
        deskripsi:
          "Pembagian blok alamat IP, subnet mask, dan studi kasus topologi kampus.",
        url: "#pdf-subnetting",
      },
      {
        id: 302,
        pertemuan: 6,
        topik: "Protokol Routing",
        isBaru: false,
        judulFile: "Simulasi Packet Tracer Routing Dinamis",
        sumber: "Google Drive",
        tipeLabel: "Google Drive",
        metaText: "Tautan folder · Ditambahkan 16 Okt 2026",
        timestamp: new Date("2026-10-16T13:00:00").getTime(),
        deskripsi: "File latihan konfigurasi RIPv2 dan OSPF multi-area.",
        url: "#drive-routing",
      },
    ],
  },
  {
    id: "if209",
    kodeMk: "IF209",
    mataKuliah: "Sistem Operasi",
    kelas: "TI-3A",
    dosen: "Rina Kartika, S.Kom., M.Cs.",
    materiList: [
      {
        id: 401,
        pertemuan: 6,
        topik: "Penjadwalan CPU",
        isBaru: false,
        judulFile: "Algoritma Penjadwalan Proses.pdf",
        sumber: "PDF",
        tipeLabel: "PDF",
        metaText: "1,9 MB · Ditambahkan 18 Okt 2026",
        timestamp: new Date("2026-10-18T10:30:00").getTime(),
        deskripsi:
          "Perbandingan FCFS, SJF, Priority Scheduling, dan Round Robin.",
        url: "#pdf-scheduling",
      },
    ],
  },
];

export default function MateriMahasiswa() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMk, setSelectedMk] = useState("Semua mata kuliah");
  const [selectedPertemuan, setSelectedPertemuan] = useState("Semua pertemuan");
  const [selectedSumber, setSelectedSumber] = useState("Semua sumber");
  const [sortBy, setSortBy] = useState("terbaru");

  // Accordion state: default hanya 2 mata kuliah pertama yang terbuka
  const [expandedCourses, setExpandedCourses] = useState({});

  // State "Lihat semua pertemuan" di dalam masing-masing kartu matkul (> 3 materi)
  const [showAllMeetings, setShowAllMeetings] = useState({});

  // State Terakhir Dibuka
  const [lastOpened, setLastOpened] = useState({
    judulFile: "Modul Latihan Query SQL.pdf",
    sumber: "PDF",
    waktuText: "22 Oktober 2026, 08.30 WIB",
  });

  // Toast feedback ringan saat klik Buka / Unduh
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  // Opsi dropdown dinamis
  const mataKuliahOptions = useMemo(() => {
    return [
      "Semua mata kuliah",
      ...INITIAL_MATERI_GROUPS.map((g) => g.mataKuliah),
    ];
  }, []);

  const pertemuanOptions = useMemo(() => {
    const nums = new Set();
    INITIAL_MATERI_GROUPS.forEach((g) =>
      g.materiList.forEach((m) => nums.add(m.pertemuan))
    );
    const sorted = Array.from(nums).sort((a, b) => b - a);
    return ["Semua pertemuan", ...sorted.map((n) => `Pertemuan ${n}`)];
  }, []);

  // Hitung total berkas PDF & Google Drive keseluruhan
  const sourceTotals = useMemo(() => {
    let pdf = 0;
    let drive = 0;
    INITIAL_MATERI_GROUPS.forEach((g) => {
      g.materiList.forEach((m) => {
        if (m.sumber === "PDF") pdf += 1;
        else if (m.sumber === "Google Drive") drive += 1;
      });
    });
    return { pdf, drive };
  }, []);

  // Apakah sedang ada filter/pencarian aktif?
  const isFilteringActive =
    searchQuery.trim() !== "" ||
    selectedMk !== "Semua mata kuliah" ||
    selectedPertemuan !== "Semua pertemuan" ||
    selectedSumber !== "Semua sumber";

  // Filter & Sort data mata kuliah beserta daftar materinya
  const filteredGroups = useMemo(() => {
    return INITIAL_MATERI_GROUPS.filter(
      (group) =>
        selectedMk === "Semua mata kuliah" || group.mataKuliah === selectedMk
    )
      .map((group) => {
        const filteredItems = group.materiList
          .filter((item) => {
            const matchSearch =
              item.judulFile
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.topik.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.deskripsi
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              group.mataKuliah
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            const matchPertemuan =
              selectedPertemuan === "Semua pertemuan" ||
              `Pertemuan ${item.pertemuan}` === selectedPertemuan;

            const matchSumber =
              selectedSumber === "Semua sumber" ||
              item.sumber === selectedSumber;

            return matchSearch && matchPertemuan && matchSumber;
          })
          .sort((a, b) => {
            if (sortBy === "terbaru") return b.timestamp - a.timestamp;
            return a.timestamp - b.timestamp;
          });

        return {
          ...group,
          materiList: filteredItems,
        };
      })
      .filter((group) => group.materiList.length > 0);
  }, [
    searchQuery,
    selectedMk,
    selectedPertemuan,
    selectedSumber,
    sortBy,
  ]);

  const toggleCourseAccordion = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const areAllExpanded = useMemo(() => {
    if (filteredGroups.length === 0) return false;
    return filteredGroups.every((g) => !!expandedCourses[g.id]);
  }, [filteredGroups, expandedCourses]);

  const handleToggleAllAccordions = () => {
    const nextState = !areAllExpanded;
    const updated = {};
    filteredGroups.forEach((g) => {
      updated[g.id] = nextState;
    });
    setExpandedCourses((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedMk("Semua mata kuliah");
    setSelectedPertemuan("Semua pertemuan");
    setSelectedSumber("Semua sumber");
    setSortBy("terbaru");
  };

  const handleOpenMaterial = (item, actionType = "Buka") => {
    const now = new Date();
    const datePart = now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    setLastOpened({
      judulFile: item.judulFile,
      sumber: item.sumber,
      waktuText: `${datePart}, ${hh}.${mm} WIB`,
    });

    showToast(
      actionType === "Unduh"
        ? `Mengunduh "${item.judulFile}"...`
        : `Membuka "${item.judulFile}" (${item.sumber})...`
    );
  };

  return (
    <div className="space-y-5">
      {/* Header Judul Halaman */}
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-slate-800 sm:text-[26px]">
          Materi perkuliahan
        </h1>
        <p className="mt-1 text-[12px] text-slate-500 sm:text-[13px]">
          Semua bahan belajar, tersusun rapi berdasarkan mata kuliah dan
          pertemuan.
        </p>
      </div>

      {/* Bar Pencarian, Filter Matkul, Sort, & Toggle Buka/Tutup Semua */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul atau topik materi..."
            className="h-10 w-full rounded-xl border border-slate-200/90 bg-white pl-10 pr-4 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
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

          {/* Tombol Urutan Terbaru / Terlama */}
          <button
            type="button"
            onClick={() =>
              setSortBy((prev) => (prev === "terbaru" ? "terlama" : "terbaru"))
            }
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 text-[12px] font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowUpDown size={14} className="text-slate-500" />
            <span>{sortBy === "terbaru" ? "Terbaru" : "Terlama"}</span>
          </button>

          {/* Tombol Buka/Tutup Semua Accordion */}
          {!isFilteringActive && filteredGroups.length > 1 && (
            <button
              type="button"
              onClick={handleToggleAllAccordions}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3.5 text-[12px] font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
            >
              <ChevronsUpDown size={14} />
              <span>{areAllExpanded ? "Tutup semua" : "Buka semua"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid Utama: Daftar Kartu Mata Kuliah (Kiri) + Sidebar Jelajahi & Terakhir Dibuka (Kanan) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* ================= KOLOM KIRI: DAFTAR MATA KULIAH (ACCORDION) ================= */}
        <div className="space-y-4 lg:col-span-8">
          {filteredGroups.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white py-14 text-center">
              <p className="text-[13px] font-medium text-slate-500">
                Tidak ada materi yang sesuai dengan kriteria pencarian.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-3 text-[12px] font-semibold text-indigo-600 hover:underline"
              >
                Reset semua filter
              </button>
            </div>
          ) : (
            filteredGroups.map((group) => {
              // Jika sedang mencari/memfilter, otomatis buka kartu yang cocok
              const isExpanded = isFilteringActive
                ? true
                : !!expandedCourses[group.id];

              const isShowingAll = !!showAllMeetings[group.id];
              const hasMoreThanThree = group.materiList.length > 3;
              const visibleItems =
                isShowingAll || isFilteringActive
                  ? group.materiList
                  : group.materiList.slice(0, 3);

              const hasNewBadge = group.materiList.some((m) => m.isBaru);

              return (
                <div
                  key={group.id}
                  className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition hover:border-slate-300/90"
                >
                  {/* Header Kartu Mata Kuliah (Klik untuk Buka/Tutup) */}
                  <button
                    type="button"
                    onClick={() => toggleCourseAccordion(group.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50/60 sm:px-6 sm:py-5"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[17px] font-bold tracking-tight text-slate-800">
                          {group.mataKuliah}
                        </h2>
                        {!isExpanded && hasNewBadge && (
                          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            Ada materi baru
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-400">
                        {group.kodeMk} · {group.kelas} · {group.dosen}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2.5">
                      <span className="text-[12px] font-bold text-indigo-600">
                        {group.materiList.length} materi
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-500">
                        {isExpanded ? (
                          <ChevronUp size={15} />
                        ) : (
                          <ChevronDown size={15} />
                        )}
                      </span>
                    </div>
                  </button>

                  {/* Isi Daftar Pertemuan (Tampil saat Expanded) */}
                  {isExpanded && (
                    <div className="space-y-5 border-t border-slate-100 px-5 pb-6 pt-5 sm:px-6">
                      {visibleItems.map((item) => {
                        const isDrive = item.sumber === "Google Drive";
                        return (
                          <div key={item.id} className="space-y-2.5">
                            {/* Baris Pertemuan & Badge Baru */}
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-[13px] font-bold text-slate-800">
                                Pertemuan {item.pertemuan} · {item.topik}
                              </h3>
                              {item.isBaru && (
                                <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                                  Baru
                                </span>
                              )}
                            </div>

                            {/* Kotak File / Tautan Materi */}
                            <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3.5 transition hover:border-indigo-200 hover:bg-indigo-50/15 sm:flex-row sm:items-center">
                              <div className="flex items-center gap-3.5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-600">
                                  {isDrive ? (
                                    <FolderOpen size={18} strokeWidth={1.9} />
                                  ) : (
                                    <FileText size={18} strokeWidth={1.9} />
                                  )}
                                </div>

                                <div>
                                  <p className="text-[13px] font-bold text-slate-800">
                                    {item.judulFile}
                                  </p>
                                  <p className="mt-0.5 text-[11px] text-slate-400">
                                    {item.tipeLabel} · {item.metaText}
                                  </p>
                                </div>
                              </div>

                              {/* Aksi Buka / Unduh */}
                              <div className="flex items-center gap-2 self-end text-[12px] font-semibold text-indigo-600 sm:self-auto">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenMaterial(item, "Buka")
                                  }
                                  className="inline-flex items-center gap-1 hover:underline"
                                >
                                  <span>
                                    {isDrive ? "Buka Drive" : "Buka"}
                                  </span>
                                  {isDrive && <ExternalLink size={12} />}
                                </button>

                                <span className="text-slate-300">·</span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenMaterial(item, "Unduh")
                                  }
                                  className="inline-flex items-center gap-1 hover:underline"
                                >
                                  <span>Unduh</span>
                                  <Download size={12} />
                                </button>
                              </div>
                            </div>

                            {/* Deskripsi Singkat Materi */}
                            <p className="text-[11px] leading-relaxed text-slate-500">
                              {item.deskripsi}
                            </p>
                          </div>
                        );
                      })}

                      {/* Tombol Tampilkan Pertemuan Sebelumnya (jika > 3 pertemuan) */}
                      {hasMoreThanThree && !isFilteringActive && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setShowAllMeetings((prev) => ({
                                ...prev,
                                [group.id]: !prev[group.id],
                              }))
                            }
                            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-indigo-600 hover:underline"
                          >
                            <span>
                              {isShowingAll
                                ? "Tampilkan lebih ringkas"
                                : `Lihat ${group.materiList.length - 3} pertemuan sebelumnya`}
                            </span>
                            {isShowingAll ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ================= KOLOM KANAN: JELAJAHI MATERI, TERAKHIR DIBUKA, INFO DRIVE ================= */}
        <div className="space-y-5 lg:col-span-4">
          {/* 1. Kartu Jelajahi Materi */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <h2 className="text-[15px] font-bold text-slate-800">
              Jelajahi materi
            </h2>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                  Pertemuan
                </label>
                <div className="relative">
                  <select
                    value={selectedPertemuan}
                    onChange={(e) => setSelectedPertemuan(e.target.value)}
                    className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-9 text-[12px] font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-500"
                  >
                    {pertemuanOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                  Sumber materi
                </label>
                <div className="relative">
                  <select
                    value={selectedSumber}
                    onChange={(e) => setSelectedSumber(e.target.value)}
                    className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-9 text-[12px] font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-500"
                  >
                    <option value="Semua sumber">Semua sumber</option>
                    <option value="PDF">PDF</option>
                    <option value="Google Drive">Google Drive</option>
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Pill Statistik Jumlah Berkas */}
              <div className="flex items-center gap-2 pt-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedSumber((prev) =>
                      prev === "PDF" ? "Semua sumber" : "PDF"
                    )
                  }
                  className={`rounded-lg px-2.5 py-1 transition ${
                    selectedSumber === "PDF"
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {sourceTotals.pdf} berkas PDF
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedSumber((prev) =>
                      prev === "Google Drive" ? "Semua sumber" : "Google Drive"
                    )
                  }
                  className={`rounded-lg px-2.5 py-1 transition ${
                    selectedSumber === "Google Drive"
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  }`}
                >
                  {sourceTotals.drive} Drive
                </button>
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white text-[12px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Reset filter
              </button>
            </div>
          </div>

          {/* 2. Kartu Terakhir Dibuka */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <h2 className="text-[15px] font-bold text-slate-800">
              Terakhir dibuka
            </h2>

            <div className="mt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-600">
                {lastOpened.sumber === "Google Drive" ? (
                  <FolderOpen size={18} strokeWidth={1.9} />
                ) : (
                  <FileText size={18} strokeWidth={1.9} />
                )}
              </div>

              <p className="mt-3 text-[13px] font-bold text-slate-800">
                {lastOpened.judulFile}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {lastOpened.waktuText}
              </p>

              <button
                type="button"
                onClick={() =>
                  showToast(`Membuka kembali "${lastOpened.judulFile}"...`)
                }
                className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-indigo-600 hover:underline"
              >
                <span>Buka kembali</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 3. Info Box Materi Google Drive */}
          <div className="flex items-start gap-3 rounded-2xl bg-indigo-50/75 p-4">
            <Info size={18} className="mt-0.5 shrink-0 text-indigo-600" />
            <div>
              <p className="text-[12px] font-bold text-slate-800">
                Materi Google Drive
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                Gunakan akun email kampus jika tautan meminta akses. Hubungi
                dosen bila materi tidak dapat dibuka.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Feedback Aksi */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-[12px] font-medium text-white shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
}