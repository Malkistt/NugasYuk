import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCheck,
  CalendarCheck,
  ListChecks,
  Clock,
  FolderOpen,
  Award,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const INITIAL_NOTIFIKASI = [
  {
    id: 1,
    kategori: "absensi",
    judul: "Absensi pertemuan 7 sudah dibuka",
    deskripsi: "Basis Data · Lakukan presensi sebelum pukul 09.30 WIB.",
    waktu: "5 menit lalu",
    isRead: false,
    targetPath: "/mahasiswa/absensi/if203",
  },
  {
    id: 2,
    kategori: "kuis",
    judul: "Kuis Normalisasi sudah bisa dikerjakan",
    deskripsi:
      "Basis Data · 5 soal, 30 menit. Tersedia hingga hari ini pukul 12.00 WIB.",
    waktu: "15 menit lalu",
    isRead: false,
    targetPath: "/mahasiswa/kuis",
  },
  {
    id: 3,
    kategori: "deadline",
    judul: "Deadline Perancangan ERD semakin dekat",
    deskripsi:
      "Basis Data · Kumpulkan tugas paling lambat 26 Oktober 2026, 23.59 WIB.",
    waktu: "1 jam lalu",
    isRead: false,
    targetPath: "/mahasiswa/tugas",
  },
  {
    id: 4,
    kategori: "materi",
    judul: "Materi baru: Normalisasi 1NF–3NF",
    deskripsi:
      "Dr. Maya Putri menambahkan materi pertemuan 7 melalui Google Drive.",
    waktu: "Kemarin, 16.00",
    isRead: false,
    targetPath: "/mahasiswa/materi",
  },
  {
    id: 5,
    kategori: "nilai",
    judul: "Nilai Latihan Query SQL sudah terbit",
    deskripsi: "Basis Data · Nilai Anda 88/100. Lihat feedback dari Dr. Maya Putri.",
    waktu: "23 Okt, 14.30",
    isRead: true,
    targetPath: "/mahasiswa/tugas",
  },
  {
    id: 6,
    kategori: "tugas",
    judul: "Tugas baru: Halaman Web Responsif",
    deskripsi: "Pemrograman Web · Deadline 28 Oktober 2026, 23.59 WIB.",
    waktu: "22 Okt, 10.00",
    isRead: true,
    targetPath: "/mahasiswa/tugas",
  },
  // Contoh item tambahan untuk simulasi pagination (< 1 2 >)
  {
    id: 7,
    kategori: "materi",
    judul: "Materi baru: CSS Flexbox & Grid",
    deskripsi:
      "Dr. Maya Putri menambahkan tautan presentasi pertemuan 6 melalui Google Drive.",
    waktu: "22 Okt, 08.15",
    isRead: true,
    targetPath: "/mahasiswa/materi",
  },
  {
    id: 8,
    kategori: "nilai",
    judul: "Nilai Kuis Dasar SQL sudah terbit",
    deskripsi: "Basis Data · Nilai akhir Anda 90/100 (Tuntas KKM).",
    waktu: "22 Okt, 11.40",
    isRead: true,
    targetPath: "/mahasiswa/kuis/3/hasil",
  },
];

const ITEMS_PER_PAGE = 6;

export default function NotifikasiMahasiswa() {
  const navigate = useNavigate();
  const [notifikasiList, setNotifikasiList] = useState(INITIAL_NOTIFIKASI);
  const [activeTab, setActiveTab] = useState("semua"); // "semua" | "belum_dibaca" | "sudah_dibaca"
  const [currentPage, setCurrentPage] = useState(1);

  // Hitung statistik tab & ringkasan
  const stats = useMemo(() => {
    const semua = notifikasiList.length;
    const unreadItems = notifikasiList.filter((n) => !n.isRead);
    const belumDibaca = unreadItems.length;
    const sudahDibaca = semua - belumDibaca;

    const absensiTerbuka = unreadItems.filter(
      (n) => n.kategori === "absensi"
    ).length;
    const kuisAktif = unreadItems.filter((n) => n.kategori === "kuis").length;
    const deadlineMendekat = unreadItems.filter(
      (n) => n.kategori === "deadline"
    ).length;

    return {
      semua,
      belumDibaca,
      sudahDibaca,
      absensiTerbuka,
      kuisAktif,
      deadlineMendekat,
    };
  }, [notifikasiList]);

  // Filter berdasarkan tab aktif
  const filteredNotifications = useMemo(() => {
    if (activeTab === "belum_dibaca") {
      return notifikasiList.filter((n) => !n.isRead);
    }
    if (activeTab === "sudah_dibaca") {
      return notifikasiList.filter((n) => n.isRead);
    }
    return notifikasiList;
  }, [notifikasiList, activeTab]);

  // Pagination logic
  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedNotifications = useMemo(() => {
    const startIdx = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredNotifications.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredNotifications, safeCurrentPage]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
  };

  const handleMarkAsRead = (id, e) => {
    if (e) e.stopPropagation();
    setNotifikasiList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifikasiList((prev) =>
      prev.map((item) => ({ ...item, isRead: true }))
    );
  };

  const handleNotificationClick = (item) => {
    if (!item.isRead) {
      handleMarkAsRead(item.id);
    }
    if (item.targetPath) {
      navigate(item.targetPath);
    }
  };

  const renderCategoryIcon = (kategori) => {
    switch (kategori) {
      case "absensi":
        return <CalendarCheck size={18} strokeWidth={1.9} />;
      case "kuis":
        return <ListChecks size={18} strokeWidth={1.9} />;
      case "deadline":
        return <Clock size={18} strokeWidth={1.9} />;
      case "materi":
        return <FolderOpen size={18} strokeWidth={1.9} />;
      case "nilai":
        return <Award size={18} strokeWidth={1.9} />;
      default:
        return <ClipboardList size={18} strokeWidth={1.9} />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Judul & Tombol Tandai Semua Dibaca */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-slate-800 sm:text-[26px]">
            Pusat notifikasi
          </h1>
          <p className="mt-1 text-[12px] text-slate-500 sm:text-[13px]">
            Jangan lewatkan informasi penting dari perkuliahan Anda.
          </p>
        </div>

        <button
          type="button"
          disabled={stats.belumDibaca === 0}
          onClick={handleMarkAllAsRead}
          className="inline-flex h-10 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
        >
          <CheckCheck size={15} className="text-slate-600" />
          <span>Tandai semua dibaca</span>
        </button>
      </div>

      {/* Grid Utama: Daftar Notifikasi (Kiri) + Ringkasan Anda (Kanan) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* ================= KOLOM KIRI: KARTU DAFTAR NOTIFIKASI ================= */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 lg:col-span-9">
          {/* Tabs Filter */}
          <div className="flex items-center gap-6 overflow-x-auto border-b border-slate-200/80 text-[12px]">
            {[
              { key: "semua", label: `Semua (${stats.semua})` },
              {
                key: "belum_dibaca",
                label: `Belum dibaca (${stats.belumDibaca})`,
              },
              {
                key: "sudah_dibaca",
                label: `Sudah dibaca (${stats.sudahDibaca})`,
              },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
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

          {/* List Item Notifikasi */}
          {paginatedNotifications.length === 0 ? (
            <div className="py-14 text-center text-[13px] text-slate-400">
              Tidak ada notifikasi pada kategori ini.
            </div>
          ) : (
            <div className="mt-4 space-y-2.5">
              {paginatedNotifications.map((item) => {
                const isUnread = !item.isRead;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`group relative flex cursor-pointer items-start justify-between gap-4 rounded-xl px-4 py-4 transition ${
                      isUnread
                        ? "bg-[#EEF2FF]/75 hover:bg-[#E0E7FF]/70"
                        : "border-b border-slate-100 bg-white last:border-b-0 hover:bg-slate-50/80"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Ikon Kategori */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isUnread
                            ? "bg-white text-indigo-600 shadow-2xs"
                            : "bg-indigo-50/80 text-indigo-600"
                        }`}
                      >
                        {renderCategoryIcon(item.kategori)}
                      </div>

                      {/* Konten Teks Notifikasi */}
                      <div>
                        <h2
                          className={`text-[13px] tracking-tight ${
                            isUnread
                              ? "font-bold text-slate-800"
                              : "font-semibold text-slate-700"
                          }`}
                        >
                          {item.judul}
                        </h2>

                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                          {item.deskripsi}
                        </p>

                        <div className="mt-2 flex items-center gap-3 text-[10px]">
                          <span className="text-slate-400">{item.waktu}</span>

                          {isUnread ? (
                            <button
                              type="button"
                              onClick={(e) => handleMarkAsRead(item.id, e)}
                              className="font-semibold text-indigo-600 hover:underline"
                            >
                              Tandai dibaca
                            </button>
                          ) : (
                            <span className="text-slate-400">Sudah dibaca</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dot Biru Unread di Pojok Kanan Atas */}
                    {isUnread && (
                      <span
                        title="Belum dibaca"
                        className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#4F46E5]"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination (< 1 2 3 >) jika item > ITEMS_PER_PAGE */}
          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row">
              <p className="text-[11px] text-slate-400">
                Menampilkan {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(
                  safeCurrentPage * ITEMS_PER_PAGE,
                  filteredNotifications.length
                )}{" "}
                dari {filteredNotifications.length} notifikasi
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  aria-label="Halaman sebelumnya"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                  (pageNum) => {
                    const isCurrent = pageNum === safeCurrentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2.5 text-[12px] font-semibold transition ${
                          isCurrent
                            ? "bg-[#4F46E5] text-white shadow-2xs"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}

                <button
                  type="button"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  aria-label="Halaman berikutnya"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= KOLOM KANAN: RINGKASAN ANDA ================= */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 lg:col-span-3">
          <h2 className="text-[15px] font-bold text-slate-800">
            Ringkasan Anda
          </h2>

          <p className="mt-4 text-[34px] font-bold leading-none tracking-tight text-indigo-600">
            {stats.belumDibaca}
          </p>
          <p className="mt-2 text-[12px] text-slate-500">
            notifikasi belum dibaca
          </p>

          {/* Badge Status Penting */}
          <div className="mt-4 flex flex-col items-start gap-2">
            {stats.absensiTerbuka > 0 && (
              <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                {stats.absensiTerbuka} sesi absensi terbuka
              </span>
            )}
            {stats.kuisAktif > 0 && (
              <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600">
                {stats.kuisAktif} kuis aktif
              </span>
            )}
            {stats.deadlineMendekat > 0 && (
              <span className="rounded-md bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                {stats.deadlineMendekat} deadline mendekat
              </span>
            )}
            {stats.absensiTerbuka === 0 &&
              stats.kuisAktif === 0 &&
              stats.deadlineMendekat === 0 && (
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                  Semua informasi sudah terbaca
                </span>
              )}
          </div>

          <p className="mt-5 text-[11px] leading-relaxed text-slate-400">
            Notifikasi hanya menampilkan aktivitas mata kuliah yang Anda ikuti.
          </p>
        </div>
      </div>
    </div>
  );
}