import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  BookOpen,
  TrendingUp,
  Clock,
  ArrowRight,
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const ABSENSI_COURSES_DATA = [
  {
    id: "if203",
    kodeMk: "IF203",
    mataKuliah: "Basis Data",
    kelas: "TI-3A",
    dosen: "Dr. Maya Putri, M.Kom.",
    semester: "Semester ganjil 2026/2027",
    sesiAktif: {
      pertemuan: 7,
      topik: "Normalisasi",
      tanggal: "Sabtu, 24 Oktober 2026",
      batasWaktu: "hari ini, 09.30 WIB",
      status: "Belum presensi",
      tokenSesi: "849201", // Contoh token 6 digit dari sesi dosen
    },
    riwayat: [
      {
        pertemuan: 6,
        topik: "Query SQL",
        tanggal: "17 Okt 2026",
        waktu: "09.03 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 5,
        topik: "Perancangan ERD",
        tanggal: "10 Okt 2026",
        waktu: "09.01 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 4,
        topik: "Model relasional",
        tanggal: "3 Okt 2026",
        waktu: "09.05 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 3,
        topik: "Entitas & atribut",
        tanggal: "26 Sep 2026",
        waktu: "09.02 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 2,
        topik: "Arsitektur basis data",
        tanggal: "19 Sep 2026",
        waktu: "09.04 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 1,
        topik: "Pengantar basis data",
        tanggal: "12 Sep 2026",
        waktu: "09.00 WIB",
        status: "Hadir",
      },
    ],
  },
  {
    id: "if205",
    kodeMk: "IF205",
    mataKuliah: "Pemrograman Web",
    kelas: "TI-3A",
    dosen: "Dr. Maya Putri, M.Kom.",
    semester: "Semester ganjil 2026/2027",
    sesiAktif: {
      pertemuan: 7,
      topik: "Integrasi REST API & Fetch",
      tanggal: "Sabtu, 24 Oktober 2026",
      batasWaktu: "hari ini, 13.30 WIB",
      status: "Belum presensi",
      tokenSesi: "317504", // Contoh token 6 digit dari sesi dosen
    },
    riwayat: [
      {
        pertemuan: 6,
        topik: "Desain responsif",
        tanggal: "22 Okt 2026",
        waktu: "13.02 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 5,
        topik: "JavaScript DOM & Event",
        tanggal: "15 Okt 2026",
        waktu: "13.05 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 4,
        topik: "Layouting CSS Grid",
        tanggal: "8 Okt 2026",
        waktu: "13.01 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 3,
        topik: "CSS Box Model & Flexbox",
        tanggal: "1 Okt 2026",
        waktu: "-",
        status: "Izin",
      },
      {
        pertemuan: 2,
        topik: "Struktur HTML5 Semantik",
        tanggal: "24 Sep 2026",
        waktu: "13.00 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 1,
        topik: "Pengenalan Web & HTTP",
        tanggal: "17 Sep 2026",
        waktu: "13.04 WIB",
        status: "Hadir",
      },
    ],
  },
  {
    id: "if207",
    kodeMk: "IF207",
    mataKuliah: "Jaringan Komputer",
    kelas: "TI-3A",
    dosen: "Ir. Budi Santoso, M.T.",
    semester: "Semester ganjil 2026/2027",
    sesiAktif: null,
    riwayat: [
      {
        pertemuan: 6,
        topik: "Protokol Routing",
        tanggal: "21 Okt 2026",
        waktu: "10.01 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 5,
        topik: "Pengalamatan IPv4 & Subnetting",
        tanggal: "14 Okt 2026",
        waktu: "10.03 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 4,
        topik: "Network Layer & ARP",
        tanggal: "7 Okt 2026",
        waktu: "10.00 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 3,
        topik: "Data Link Layer & Switching",
        tanggal: "30 Sep 2026",
        waktu: "10.06 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 2,
        topik: "Model Referensi OSI & TCP/IP",
        tanggal: "23 Sep 2026",
        waktu: "10.02 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 1,
        topik: "Konsep Dasar Jaringan",
        tanggal: "16 Sep 2026",
        waktu: "10.00 WIB",
        status: "Hadir",
      },
    ],
  },
  {
    id: "if209",
    kodeMk: "IF209",
    mataKuliah: "Sistem Operasi",
    kelas: "TI-3A",
    dosen: "Rina Kartika, S.Kom., M.Cs.",
    semester: "Semester ganjil 2026/2027",
    sesiAktif: null,
    riwayat: [
      {
        pertemuan: 6,
        topik: "Penjadwalan CPU",
        tanggal: "20 Okt 2026",
        waktu: "08.04 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 5,
        topik: "Sinkronisasi Proses & Deadlock",
        tanggal: "13 Okt 2026",
        waktu: "-",
        status: "Sakit",
      },
      {
        pertemuan: 4,
        topik: "Thread & Concurrency",
        tanggal: "6 Okt 2026",
        waktu: "08.02 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 3,
        topik: "Manajemen Proses",
        tanggal: "29 Sep 2026",
        waktu: "08.05 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 2,
        topik: "Struktur Sistem Operasi",
        tanggal: "22 Sep 2026",
        waktu: "08.01 WIB",
        status: "Hadir",
      },
      {
        pertemuan: 1,
        topik: "Pengantar Sistem Operasi",
        tanggal: "15 Sep 2026",
        waktu: "08.00 WIB",
        status: "Hadir",
      },
    ],
  },
];

export default function AbsensiMahasiswa() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);

  // Hitung statistik setiap mata kuliah
  const enrichedCourses = useMemo(() => {
    return ABSENSI_COURSES_DATA.map((course) => {
      const totalSelesai = course.riwayat.length;
      const hadirCount = course.riwayat.filter(
        (r) => r.status === "Hadir"
      ).length;
      const izinCount = course.riwayat.filter((r) => r.status === "Izin").length;
      const sakitCount = course.riwayat.filter(
        (r) => r.status === "Sakit"
      ).length;
      const alpaCount = course.riwayat.filter((r) => r.status === "Alpa").length;
      const persentase =
        totalSelesai > 0 ? Math.round((hadirCount / totalSelesai) * 100) : 100;

      return {
        ...course,
        stats: {
          totalSelesai,
          hadirCount,
          izinCount,
          sakitCount,
          alpaCount,
          persentase,
        },
      };
    });
  }, []);

  // Daftar seluruh mata kuliah yang memiliki sesi terbuka hari ini (untuk karousel)
  const activeSessionCourses = useMemo(() => {
    return enrichedCourses.filter(
      (c) => c.sesiAktif && c.sesiAktif.status === "Belum presensi"
    );
  }, [enrichedCourses]);

  const totalOpenSessions = activeSessionCourses.length;
  const currentSessionCourse =
    activeSessionCourses[activeSessionIndex] || activeSessionCourses[0];

  // Statistik global semester
  const globalStats = useMemo(() => {
    const totalCourses = enrichedCourses.length;
    const avgAttendance = Math.round(
      enrichedCourses.reduce((acc, c) => acc + c.stats.persentase, 0) /
        (totalCourses || 1)
    );

    return {
      totalCourses,
      avgAttendance,
      activeSessionsCount: totalOpenSessions,
    };
  }, [enrichedCourses, totalOpenSessions]);

  // Filter daftar mata kuliah
  const filteredCourses = useMemo(() => {
    return enrichedCourses.filter((course) => {
      const matchSearch =
        course.mataKuliah.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.kodeMk.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.dosen.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (statusFilter === "sesi_terbuka") {
        return Boolean(course.sesiAktif);
      }
      return true;
    });
  }, [enrichedCourses, searchQuery, statusFilter]);

  const handlePrevSession = () => {
    setActiveSessionIndex((prev) =>
      prev === 0 ? totalOpenSessions - 1 : prev - 1
    );
  };

  const handleNextSession = () => {
    setActiveSessionIndex((prev) =>
      prev === totalOpenSessions - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Judul */}
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-slate-800 sm:text-[26px]">
          Kehadiran perkuliahan
        </h1>
        <p className="mt-1 text-[12px] text-slate-500 sm:text-[13px]">
          Pilih mata kuliah untuk melakukan presensi atau melihat riwayat
          kehadiran.
        </p>
      </div>

      {/* Banner Sesi Presensi Terbuka (Otomatis jadi Karousel jika > 1 mata kuliah) */}
      {currentSessionCourse && (
        <div className="rounded-2xl border border-indigo-200/90 bg-white p-5 shadow-2xs sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <CalendarCheck size={22} strokeWidth={1.9} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    Sesi terbuka
                  </span>
                  <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                    {currentSessionCourse.sesiAktif.status}
                  </span>
                  {totalOpenSessions > 1 && (
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                      {activeSessionIndex + 1} / {totalOpenSessions} sesi aktif
                    </span>
                  )}
                </div>

                <h2 className="mt-1.5 text-[17px] font-bold tracking-tight text-slate-800">
                  {currentSessionCourse.mataKuliah} · Pertemuan{" "}
                  {currentSessionCourse.sesiAktif.pertemuan}
                </h2>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  {currentSessionCourse.sesiAktif.topik} ·{" "}
                  {currentSessionCourse.dosen} ·{" "}
                  {currentSessionCourse.sesiAktif.tanggal}
                </p>

                <p className="mt-1 text-[11px] font-semibold text-amber-700">
                  Batas presensi: {currentSessionCourse.sesiAktif.batasWaktu}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(`/mahasiswa/absensi/${currentSessionCourse.id}`)
              }
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99]"
            >
              <span>Presensi sekarang</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Kontrol Navigasi Karousel (Muncul saat sesi terbuka > 1) */}
          {totalOpenSessions > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  {activeSessionCourses.map((courseItem, idx) => (
                    <button
                      key={courseItem.id}
                      type="button"
                      aria-label={`Lihat sesi ${courseItem.mataKuliah}`}
                      onClick={() => setActiveSessionIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === activeSessionIndex
                          ? "w-5 bg-[#4F46E5]"
                          : "w-1.5 bg-slate-200 hover:bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400">
                  {currentSessionCourse.mataKuliah}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Sesi terbuka sebelumnya"
                  onClick={handlePrevSession}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Sesi terbuka berikutnya"
                  onClick={handleNextSession}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3 Kartu Ringkasan Kehadiran Semester */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">
              Mata kuliah diikuti
            </span>
            <BookOpen size={16} className="text-indigo-600" />
          </div>
          <p className="mt-3 text-[26px] font-bold tracking-tight text-slate-800">
            {globalStats.totalCourses}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Semester ganjil 2026/2027 · TI-3A
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">
              Rata-rata kehadiran
            </span>
            <TrendingUp size={16} className="text-indigo-600" />
          </div>
          <p className="mt-3 text-[26px] font-bold tracking-tight text-indigo-600">
            {globalStats.avgAttendance}%
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Memenuhi syarat minimum 75% UAS
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">
              Sesi aktif hari ini
            </span>
            <Clock size={16} className="text-indigo-600" />
          </div>
          <p className="mt-3 text-[26px] font-bold tracking-tight text-slate-800">
            {globalStats.activeSessionsCount}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {globalStats.activeSessionsCount > 0
              ? "Menunggu konfirmasi presensi"
              : "Semua sesi hari ini sudah diisi"}
          </p>
        </div>
      </div>

      {/* Bar Pencarian & Filter Mata Kuliah */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari mata kuliah, kode MK, atau dosen..."
            className="h-10 w-full rounded-xl border border-slate-200/90 bg-white pl-10 pr-4 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        <div className="flex items-center gap-2 text-[12px]">
          {[
            { key: "semua", label: "Semua mata kuliah" },
            { key: "sesi_terbuka", label: "Sesi terbuka" },
          ].map((pill) => {
            const isActive = statusFilter === pill.key;
            return (
              <button
                key={pill.key}
                type="button"
                onClick={() => setStatusFilter(pill.key)}
                className={`h-9 rounded-xl px-3.5 font-semibold transition ${
                  isActive
                    ? "bg-[#4F46E5] text-white shadow-2xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Kartu Mata Kuliah (2 Kolom) */}
      {filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white py-12 text-center text-[13px] text-slate-400">
          Tidak ada mata kuliah yang sesuai dengan pencarian saat ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredCourses.map((course) => {
            const hasOpenSession = Boolean(course.sesiAktif);
            const isSafe = course.stats.persentase >= 75;

            return (
              <div
                key={course.id}
                onClick={() => navigate(`/mahasiswa/absensi/${course.id}`)}
                className={`group cursor-pointer rounded-2xl border bg-white p-5 transition hover:shadow-sm sm:p-6 ${
                  hasOpenSession
                    ? "border-indigo-300/90 hover:border-indigo-400"
                    : "border-slate-200/80 hover:border-indigo-200"
                }`}
              >
                {/* Header Kartu Matkul */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">
                      {course.kodeMk} · {course.kelas}
                    </p>
                    <h3 className="mt-1 text-[17px] font-bold tracking-tight text-slate-800 group-hover:text-indigo-600">
                      {course.mataKuliah}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {course.dosen}
                    </p>
                  </div>

                  {hasOpenSession ? (
                    <span className="shrink-0 rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                      Sesi terbuka · P{course.sesiAktif.pertemuan}
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                      <CheckCircle2 size={11} className="text-emerald-600" />
                      <span>Terjadwal</span>
                    </span>
                  )}
                </div>

                {/* Progress Bar Kehadiran */}
                <div className="mt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[24px] font-bold tracking-tight text-indigo-600">
                      {course.stats.persentase}%
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {course.stats.hadirCount} dari {course.stats.totalSelesai}{" "}
                      pertemuan hadir
                    </span>
                  </div>

                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isSafe ? "bg-[#4F46E5]" : "bg-amber-500"
                      }`}
                      style={{ width: `${course.stats.persentase}%` }}
                    />
                  </div>
                </div>

                {/* Rincian Mini & Aksi Detail */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[11px]">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-slate-500">
                    <span>
                      Hadir:{" "}
                      <strong className="text-slate-700">
                        {course.stats.hadirCount}
                      </strong>
                    </span>
                    <span>·</span>
                    <span>
                      Izin:{" "}
                      <strong className="text-slate-700">
                        {course.stats.izinCount}
                      </strong>
                    </span>
                    <span>·</span>
                    <span>
                      Sakit:{" "}
                      <strong className="text-slate-700">
                        {course.stats.sakitCount}
                      </strong>
                    </span>
                    <span>·</span>
                    <span>
                      Alpa:{" "}
                      <strong className="text-slate-700">
                        {course.stats.alpaCount}
                      </strong>
                    </span>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-indigo-600 transition-transform group-hover:translate-x-0.5">
                    <span>Detail</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}