import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ListChecks,
  FileCheck2,
  ArrowRight,
  Lock,
  Info,
  ShieldAlert,
  Maximize2,
  X,
} from "lucide-react";

const INITIAL_KUIS = [
  {
    id: 1,
    kodeMk: "IF203",
    mataKuliah: "Basis Data",
    kelas: "TI-3A",
    judul: "Kuis Normalisasi",
    status: "tersedia",
    tanggalText: "24 Oktober 2026 · 09.00–12.00 WIB",
    jadwalTimestamp: new Date("2026-10-24T09:00:00").getTime(),
    jumlahSoal: 5,
    durasiMenit: 30,
    totalPoin: 100,
    kesempatan: "1 kali kesempatan",
    statusCatatan: "Belum dikerjakan · Tutup hari ini pukul 12.00",
    hasil: null,
  },
  {
    id: 2,
    kodeMk: "IF203",
    mataKuliah: "Basis Data",
    kelas: "TI-3A",
    judul: "Kuis Relasi & JOIN",
    status: "akan_datang",
    tanggalText: "29 Oktober 2026 · 09.00–12.00 WIB",
    jadwalTimestamp: new Date("2026-10-29T09:00:00").getTime(),
    jumlahSoal: 5,
    durasiMenit: 30,
    totalPoin: 100,
    kesempatan: "1 kali kesempatan",
    statusCatatan: "Dibuka dalam 5 hari · Persiapkan materi JOIN",
    hasil: null,
  },
  {
    id: 3,
    kodeMk: "IF203",
    mataKuliah: "Basis Data",
    kelas: "TI-3A",
    judul: "Kuis Dasar SQL",
    status: "selesai",
    tanggalText: "22 Oktober 2026 · 09.00–12.00 WIB",
    jadwalTimestamp: new Date("2026-10-22T09:00:00").getTime(),
    jumlahSoal: 5,
    durasiMenit: 30,
    totalPoin: 100,
    kesempatan: "Nilai sudah diterbitkan",
    statusCatatan: "Nilai akhir 90/100 · Dikumpulkan 22 Okt, 09.26 WIB",
    hasil: {
      nilai: 90,
      dikumpulkanAt: "22 Okt, 09.26 WIB",
    },
  },
];

export default function KuisMahasiswa() {
  const [kuisList] = useState(INITIAL_KUIS);
  const [activeTab, setActiveTab] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMk, setSelectedMk] = useState("Semua mata kuliah");
  const [sortBy, setSortBy] = useState("terdekat");

  // State modal konfirmasi Mode Fokus sebelum mulai kuis
  const [selectedQuizModal, setSelectedQuizModal] = useState(null);

  const navigate = useNavigate();

  const mataKuliahOptions = useMemo(() => {
    const unique = Array.from(new Set(kuisList.map((k) => k.mataKuliah)));
    return ["Semua mata kuliah", ...unique];
  }, [kuisList]);

  const counts = useMemo(() => {
    return {
      semua: kuisList.length,
      tersedia: kuisList.filter((k) => k.status === "tersedia").length,
      akan_datang: kuisList.filter((k) => k.status === "akan_datang").length,
      selesai: kuisList.filter((k) => k.status === "selesai").length,
    };
  }, [kuisList]);

  const filteredKuis = useMemo(() => {
    return kuisList
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
          return b.jadwalTimestamp - a.jadwalTimestamp;
        }
        return a.jadwalTimestamp - b.jadwalTimestamp;
      });
  }, [kuisList, activeTab, selectedMk, searchQuery, sortBy]);

  // Trigger Fullscreen & Masuk ke Pengerjaan Kuis
  const handleStartFocusMode = async () => {
    if (!selectedQuizModal) return;
    const quizId = selectedQuizModal.id;

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      // Fallback jika browser memblokir fullscreen otomatis
      console.warn("Fullscreen request bypassed:", err);
    }

    setSelectedQuizModal(null);
    navigate(`/mahasiswa/kuis/${quizId}/kerjakan`);
  };

  const renderStatusBadge = (status) => {
    if (status === "tersedia") {
      return (
        <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
          Tersedia
        </span>
      );
    }
    if (status === "akan_datang") {
      return (
        <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-600">
          Akan datang
        </span>
      );
    }
    return (
      <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
        Selesai
      </span>
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-slate-800 sm:text-[26px]">
          Kuis saya
        </h1>
        <p className="mt-1 text-[12px] text-slate-500 sm:text-[13px]">
          Lihat jadwal, kerjakan kuis aktif, dan tinjau hasil belajarmu.
        </p>
      </div>

      {/* Tabs Status Filter */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-slate-200/80 text-[12px]">
        {[
          { key: "semua", label: `Semua (${counts.semua})` },
          { key: "tersedia", label: `Tersedia (${counts.tersedia})` },
          { key: "akan_datang", label: `Akan datang (${counts.akan_datang})` },
          { key: "selesai", label: `Selesai (${counts.selesai})` },
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

      {/* Bar Pencarian & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul kuis..."
            className="h-10 w-full rounded-xl border border-slate-200/90 bg-white pl-10 pr-4 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        <div className="flex items-center gap-2.5">
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

          <button
            type="button"
            onClick={() =>
              setSortBy((prev) => (prev === "terdekat" ? "terlama" : "terdekat"))
            }
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 text-[12px] font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowUpDown size={14} className="text-slate-500" />
            <span>
              {sortBy === "terdekat" ? "Jadwal terdekat" : "Jadwal terlama"}
            </span>
          </button>
        </div>
      </div>

      {/* Daftar Kartu Kuis */}
      <div className="space-y-4">
        {filteredKuis.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white py-12 text-center text-[13px] text-slate-400">
            Tidak ada kuis yang sesuai dengan filter saat ini.
          </div>
        ) : (
          filteredKuis.map((kuis) => {
            const isTersedia = kuis.status === "tersedia";
            const isAkanDatang = kuis.status === "akan_datang";
            const isSelesai = kuis.status === "selesai";

            return (
              <div
                key={kuis.id}
                className={`flex flex-col justify-between gap-5 rounded-2xl border bg-white p-5 transition sm:flex-row sm:items-center sm:p-6 ${
                  isTersedia
                    ? "border-indigo-300 shadow-2xs"
                    : "border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50/80 text-indigo-600">
                    {isSelesai ? (
                      <FileCheck2 size={21} strokeWidth={1.9} />
                    ) : (
                      <ListChecks size={21} strokeWidth={1.9} />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-medium text-slate-400">
                        {kuis.mataKuliah} · {kuis.kelas}
                      </span>
                      {renderStatusBadge(kuis.status)}
                    </div>

                    <h2 className="mt-1 text-[17px] font-bold tracking-tight text-slate-800">
                      {kuis.judul}
                    </h2>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                      <span>{kuis.tanggalText}</span>
                      <span>
                        {kuis.jumlahSoal} soal · {kuis.durasiMenit} menit ·{" "}
                        {kuis.totalPoin} poin
                      </span>
                    </div>

                    <p
                      className={`mt-1.5 text-[11px] font-medium ${
                        isTersedia ? "text-amber-700" : "text-slate-400"
                      }`}
                    >
                      {kuis.statusCatatan}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-stretch sm:items-center">
                  {isTersedia && (
                    <button
                      type="button"
                      onClick={() => setSelectedQuizModal(kuis)}
                      className="inline-flex h-10 min-w-[155px] items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99]"
                    >
                      <ArrowRight size={15} />
                      <span>Kerjakan kuis</span>
                    </button>
                  )}

                  {isAkanDatang && (
                    <button
                      type="button"
                      disabled
                      className="inline-flex h-10 min-w-[155px] cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-5 text-[12px] font-semibold text-slate-400"
                    >
                      <Lock size={14} />
                      <span>Belum dibuka</span>
                    </button>
                  )}

                  {isSelesai && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/mahasiswa/kuis/${kuis.id}/hasil`)
                      }
                      className="inline-flex h-10 min-w-[155px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-[12px] font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
                    >
                      <ArrowRight size={15} />
                      <span>Lihat hasil</span>
                    </button>
                  )}

                  <span className="mt-1.5 text-center text-[10px] text-slate-400">
                    {kuis.kesempatan}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Info Box Bawah */}
      <div className="flex items-start gap-3 rounded-2xl bg-indigo-50/70 p-4 sm:items-center">
        <Info size={18} className="mt-0.5 shrink-0 text-indigo-600 sm:mt-0" />
        <div>
          <p className="text-[12px] font-bold text-slate-800">
            Sebelum memulai kuis
          </p>
          <p className="mt-0.5 text-[11px] text-slate-600">
            Pastikan koneksi internet stabil. Kuis menggunakan Mode Fokus layar
            penuh dan waktu berjalan otomatis setelah dimulai.
          </p>
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
    </div>
  );
}