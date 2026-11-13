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
  AlertTriangle,
  UserCheck,
  FileText,
} from "lucide-react";
import { getSystemDateIndonesian } from "../utils/dateHelper";

const INITIAL_NOTIFIKASI = [
  {
    id: 1,
    kategori: "pengajuan",
    judul: "Nadia Rahma mengajukan Izin — Pertemuan 7",
    deskripsi: "Basis Data · Surat Dispensasi Dekan terlampir. Pengajuan menunggu persetujuan Anda.",
    waktu: "5 menit lalu",
    isRead: false,
    targetPath: "/absensi",
  },
  {
    id: 2,
    kategori: "pengajuan",
    judul: "Dimas Saputra mengajukan Sakit — Pertemuan 7",
    deskripsi: "Basis Data · Surat Keterangan Sakit dari klinik terlampir. Memerlukan konfirmasi dosen.",
    waktu: "12 menit lalu",
    isRead: false,
    targetPath: "/absensi",
  },
  {
    id: 3,
    kategori: "pengumpulan",
    judul: "33 berkas Perancangan ERD masuk",
    deskripsi: "Basis Data · TI-3A · 24/32 sudah mengumpulkan. Deadline 26 Oktober 23.59 WIB.",
    waktu: "1 jam lalu",
    isRead: false,
    targetPath: "/tugas",
  },
  {
    id: 4,
    kategori: "pelanggaran",
    judul: "Pelanggaran anti-cheating terdeteksi — Kuis Dasar SQL",
    deskripsi: "Dimas Saputra: 3 pelanggaran (Pindah Tab, Keluar Fullscreen, Navigasi Back). Lihat detail di Hasil Kuis.",
    waktu: "Kemarin, 10.25",
    isRead: false,
    targetPath: "/kuis/hasil",
  },
  {
    id: 5,
    kategori: "kuis",
    judul: "Kuis Normalisasi sudah bisa dikerjakan oleh mahasiswa",
    deskripsi: "Basis Data · 5 soal, 30 menit. Aktif hingga hari ini pukul 12.00 WIB.",
    waktu: "Kemarin, 09.00",
    isRead: true,
    targetPath: "/kuis",
  },
  {
    id: 6,
    kategori: "penilaian",
    judul: "8 esai Latihan Query SQL belum dinilai",
    deskripsi: "Basis Data · 32/32 mengumpulkan · 24/32 sudah dinilai. Selesaikan penilaian esai manual.",
    waktu: "23 Okt, 14.30",
    isRead: true,
    targetPath: "/tugas/nilai",
  },
  {
    id: 7,
    kategori: "materi",
    judul: "Materi Normalisasi 1NF–3NF berhasil ditambahkan",
    deskripsi: "Basis Data · Pertemuan 7 · Google Drive tautan aktif dan dapat diakses mahasiswa.",
    waktu: "23 Okt, 16.00",
    isRead: true,
    targetPath: "/materi",
  },
  {
    id: 8,
    kategori: "absensi",
    judul: "Sesi absensi Pertemuan 6 otomatis ditutup",
    deskripsi: "Basis Data · 24 Hadir, 2 Izin, 1 Sakit, 5 Alpa dari 32 mahasiswa.",
    waktu: "22 Okt, 09.35",
    isRead: true,
    targetPath: "/absensi",
  },
];

const ITEMS_PER_PAGE = 6;

const KATEGORI_ICON = {
  pengajuan: UserCheck,
  pengumpulan: ClipboardList,
  pelanggaran: AlertTriangle,
  kuis: ListChecks,
  penilaian: Award,
  materi: FolderOpen,
  absensi: CalendarCheck,
  deadline: Clock,
};

const KATEGORI_COLOR = {
  pengajuan: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  pengumpulan: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  pelanggaran: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-600" },
  kuis: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  penilaian: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  materi: { bg: "bg-teal-100", text: "text-teal-700", dot: "bg-teal-500" },
  absensi: { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
  deadline: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
};

export default function NotifikasiDosen() {
  const navigate = useNavigate();
  const [systemDate] = useState(() => getSystemDateIndonesian());
  const [notifikasiList, setNotifikasiList] = useState(INITIAL_NOTIFIKASI);
  const [activeTab, setActiveTab] = useState("semua");
  const [currentPage, setCurrentPage] = useState(1);

  const unreadCount = notifikasiList.filter((n) => !n.isRead).length;

  const filteredList = useMemo(() => {
    if (activeTab === "belum_dibaca") return notifikasiList.filter((n) => !n.isRead);
    if (activeTab === "sudah_dibaca") return notifikasiList.filter((n) => n.isRead);
    return notifikasiList;
  }, [notifikasiList, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / ITEMS_PER_PAGE));
  const pagedList = filteredList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleMarkRead = (id) => {
    setNotifikasiList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifikasiList((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClickNotif = (notif) => {
    handleMarkRead(notif.id);
    navigate(notif.targetPath);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-gray-900 sm:text-[26px]">
            Notifikasi
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            {unreadCount > 0
              ? `${unreadCount} notifikasi belum dibaca.`
              : "Semua notifikasi sudah dibaca."}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5] hover:underline cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Tandai semua sudah dibaca</span>
          </button>
        )}
      </div>

      {/* Tab Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex border-b border-gray-100">
          {[
            { key: "semua", label: "Semua", count: notifikasiList.length },
            { key: "belum_dibaca", label: "Belum dibaca", count: unreadCount },
            { key: "sudah_dibaca", label: "Sudah dibaca", count: notifikasiList.length - unreadCount },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-xs font-semibold transition-colors border-b-2 cursor-pointer ${
                activeTab === tab.key
                  ? "border-[#4F46E5] text-[#4F46E5]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-[#EEF2FF] text-[#4F46E5]" : "bg-gray-100 text-gray-500"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifikasi List */}
        <div className="divide-y divide-gray-50/80">
          {pagedList.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">
              Tidak ada notifikasi di sini.
            </div>
          ) : (
            pagedList.map((notif) => {
              const IconComp = KATEGORI_ICON[notif.kategori] || FileText;
              const colors = KATEGORI_COLOR[notif.kategori] || { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
              return (
                <div
                  key={notif.id}
                  onClick={() => handleClickNotif(notif)}
                  className={`flex items-start gap-4 px-5 sm:px-6 py-4 cursor-pointer transition-colors ${
                    notif.isRead ? "hover:bg-gray-50/60" : "bg-[#FAFAFE] hover:bg-indigo-50/40"
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0 mt-0.5`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs leading-snug ${notif.isRead ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>
                        {notif.judul}
                      </p>
                      {!notif.isRead && (
                        <span className={`w-2 h-2 rounded-full ${colors.dot} shrink-0 mt-1`}></span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed line-clamp-2">
                      {notif.deskripsi}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1.5 font-medium">{notif.waktu}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-2 px-5 sm:px-6 py-3.5 border-t border-gray-50">
            <p className="text-[11px] text-gray-400">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold cursor-pointer ${
                    currentPage === p
                      ? "bg-[#4F46E5] text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}