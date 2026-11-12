import React, { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  UserCheck,
  Mail,
  HeartPulse,
  UserX,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Info,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  AlertCircle,
  X,
  FilePlus2,
  Upload,
  Clock,
  FileText,
} from "lucide-react";
import { ABSENSI_COURSES_DATA } from "./AbsensiMahasiswa";

export default function DetailAbsensiMahasiswa() {
  const { kodeMk } = useParams();
  const navigate = useNavigate();

  // Simpan state data mata kuliah agar aksi presensi & pengajuan langsung memperbarui tampilan
  const [coursesState, setCoursesState] = useState(ABSENSI_COURSES_DATA);
  const [selectedCourseId, setSelectedCourseId] = useState(
    () => kodeMk || ABSENSI_COURSES_DATA[0].id
  );
  const [searchTopic, setSearchTopic] = useState("");
  const [sortOrder, setSortOrder] = useState("terbaru");
  const [toastMessage, setToastMessage] = useState(null);

  // State Modal Input Kode Token 6 Digit (Presensi Hadir)
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenDigits, setTokenDigits] = useState(["", "", "", "", "", ""]);
  const [tokenError, setTokenError] = useState("");
  const inputRefs = useRef([]);

  // State Modal Pengajuan Izin / Sakit (Menunggu Persetujuan Dosen)
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState("Izin"); // "Izin" | "Sakit"
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveFile, setLeaveFile] = useState(null);
  const [leaveError, setLeaveError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (kodeMk) {
      setSelectedCourseId(kodeMk);
    }
  }, [kodeMk]);

  const currentCourse = useMemo(() => {
    return (
      coursesState.find((c) => c.id === selectedCourseId) || coursesState[0]
    );
  }, [coursesState, selectedCourseId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Hitung statistik kartu & persentase syarat minimum 75%
  // Aturan: Hanya status "Hadir" yang dihitung hadir; Izin, Sakit, & Alpa tetap dihitung tidak hadir.
  // Status "Menunggu" (pending verifikasi dosen) belum masuk ke pembagi selesai.
  const stats = useMemo(() => {
    const finalizedList = currentCourse.riwayat.filter(
      (r) => r.status !== "Menunggu"
    );
    const pendingCount = currentCourse.riwayat.filter(
      (r) => r.status === "Menunggu"
    ).length;

    const totalSelesai = finalizedList.length;
    const hadir = finalizedList.filter((r) => r.status === "Hadir").length;
    const izin = finalizedList.filter((r) => r.status === "Izin").length;
    const sakit = finalizedList.filter((r) => r.status === "Sakit").length;
    const alpa = finalizedList.filter((r) => r.status === "Alpa").length;
    const tidakHadir = izin + sakit + alpa;

    const persentase =
      totalSelesai > 0 ? Math.round((hadir / totalSelesai) * 100) : 100;

    return {
      totalSelesai,
      hadir,
      izin,
      sakit,
      alpa,
      tidakHadir,
      pendingCount,
      persentase,
      memenuhiSyarat: persentase >= 75,
    };
  }, [currentCourse]);

  // Filter & Urutkan riwayat kehadiran
  const filteredRiwayat = useMemo(() => {
    return currentCourse.riwayat
      .filter((item) => {
        const query = searchTopic.toLowerCase();
        const label = `p${item.pertemuan} ${item.topik}`.toLowerCase();
        return label.includes(query);
      })
      .sort((a, b) =>
        sortOrder === "terbaru"
          ? b.pertemuan - a.pertemuan
          : a.pertemuan - b.pertemuan
      );
  }, [currentCourse, searchTopic, sortOrder]);

  // ================= HANDLER PRESENSI HADIR (TOKEN 6 DIGIT) =================
  const handleOpenTokenModal = () => {
    if (
      !currentCourse.sesiAktif ||
      currentCourse.sesiAktif.status !== "Belum presensi"
    ) {
      return;
    }
    setTokenDigits(["", "", "", "", "", ""]);
    setTokenError("");
    setShowTokenModal(true);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 60);
  };

  const handleDigitChange = (index, value) => {
    const cleanDigit = value.replace(/\D/g, "").slice(-1);
    const updated = [...tokenDigits];
    updated[index] = cleanDigit;
    setTokenDigits(updated);
    if (tokenError) setTokenError("");

    if (cleanDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === "Backspace" && !tokenDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleTokenPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const updated = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, idx) => {
      updated[idx] = char;
    });
    setTokenDigits(updated);
    if (tokenError) setTokenError("");

    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleSubmitToken = (e) => {
    e.preventDefault();
    if (!currentCourse.sesiAktif) return;

    const enteredToken = tokenDigits.join("");
    if (enteredToken.length < 6) {
      setTokenError("Masukkan lengkap 6 digit kode token dari dosen.");
      return;
    }

    const expectedToken = currentCourse.sesiAktif.tokenSesi || "849201";
    if (enteredToken !== expectedToken) {
      setTokenError(
        "Kode token tidak valid atau sudah kedaluwarsa. Periksa kembali layar dosen."
      );
      return;
    }

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const waktuCatat = `${hh}.${mm} WIB`;

    setCoursesState((prev) =>
      prev.map((course) => {
        if (course.id !== currentCourse.id) return course;

        const sesi = course.sesiAktif;
        const newRecord = {
          pertemuan: sesi.pertemuan,
          topik: sesi.topik,
          tanggal: "24 Okt 2026",
          waktu: waktuCatat,
          status: "Hadir",
        };

        return {
          ...course,
          sesiAktif: {
            ...sesi,
            status: "Sudah presensi",
            waktuPresensi: waktuCatat,
          },
          riwayat: [newRecord, ...course.riwayat],
        };
      })
    );

    setShowTokenModal(false);
    showToast(
      `Presensi Pertemuan ${currentCourse.sesiAktif.pertemuan} (${currentCourse.mataKuliah}) berhasil dicatat pada ${waktuCatat}.`
    );
  };

  // ================= HANDLER PENGAJUAN IZIN / SAKIT =================
  const handleOpenLeaveModal = () => {
    if (
      !currentCourse.sesiAktif ||
      currentCourse.sesiAktif.status !== "Belum presensi"
    ) {
      return;
    }
    setLeaveType("Izin");
    setLeaveReason("");
    setLeaveFile(null);
    setLeaveError("");
    setShowLeaveModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setLeaveError("Ukuran file bukti maksimal 5 MB.");
      return;
    }

    setLeaveFile(file);
    if (leaveError) setLeaveError("");
  };

  const handleSubmitLeaveRequest = (e) => {
    e.preventDefault();
    if (!currentCourse.sesiAktif) return;

    if (!leaveReason.trim()) {
      setLeaveError("Tuliskan alasan atau keterangan ketidakhadiranmu.");
      return;
    }

    if (!leaveFile) {
      setLeaveError(
        `Unggah bukti pendukung (${
          leaveType === "Sakit"
            ? "surat keterangan dokter / resep"
            : "surat izin / dokumen pendukung"
        }).`
      );
      return;
    }

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const waktuAjukan = `${hh}.${mm} WIB`;

    setCoursesState((prev) =>
      prev.map((course) => {
        if (course.id !== currentCourse.id) return course;

        const sesi = course.sesiAktif;
        const pendingRecord = {
          pertemuan: sesi.pertemuan,
          topik: sesi.topik,
          tanggal: "24 Okt 2026",
          waktu: waktuAjukan,
          status: "Menunggu",
          pengajuan: {
            jenis: leaveType,
            alasan: leaveReason.trim(),
            namaFile: leaveFile.name,
          },
        };

        return {
          ...course,
          sesiAktif: {
            ...sesi,
            status: "Menunggu persetujuan",
            jenisPengajuan: leaveType,
            alasanPengajuan: leaveReason.trim(),
            fileBukti: leaveFile.name,
            waktuPresensi: waktuAjukan,
          },
          riwayat: [pendingRecord, ...course.riwayat],
        };
      })
    );

    setShowLeaveModal(false);
    showToast(
      `Pengajuan ${leaveType} Pertemuan ${currentCourse.sesiAktif.pertemuan} dikirim. Menunggu persetujuan dosen.`
    );
  };

  const handleCourseChange = (newId) => {
    setSelectedCourseId(newId);
    setSearchTopic("");
    navigate(`/mahasiswa/absensi/${newId}`, { replace: true });
  };

  const renderStatusBadge = (row) => {
    const { status, pengajuan } = row;
    if (status === "Hadir") {
      return (
        <span className="inline-block rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
          Hadir
        </span>
      );
    }
    if (status === "Menunggu") {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
          <Clock size={10} />
          <span>Menunggu ({pengajuan?.jenis || "Izin/Sakit"})</span>
        </span>
      );
    }
    if (status === "Izin") {
      return (
        <span className="inline-block rounded-md bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-600">
          Izin
        </span>
      );
    }
    if (status === "Sakit") {
      return (
        <span className="inline-block rounded-md bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">
          Sakit
        </span>
      );
    }
    return (
      <span className="inline-block rounded-md bg-rose-50 px-2.5 py-0.5 text-[10px] font-semibold text-rose-700">
        Alpa
      </span>
    );
  };

  const sesiAktif = currentCourse.sesiAktif;
  const isSudahPresensi = sesiAktif?.status === "Sudah presensi";
  const isMenungguPersetujuan = sesiAktif?.status === "Menunggu persetujuan";
  const isTokenComplete = tokenDigits.join("").length === 6;

  return (
    <div className="space-y-5">
      {/* Header Judul & Tombol Kembali */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-slate-800 sm:text-[26px]">
            Kehadiran saya
          </h1>
          <p className="mt-1 text-[12px] text-slate-500 sm:text-[13px]">
            Isi presensi tepat waktu dan pantau riwayat kehadiran pribadi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/mahasiswa/absensi")}
          className="inline-flex h-10 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:self-auto"
        >
          <ArrowLeft size={15} />
          <span>Daftar mata kuliah</span>
        </button>
      </div>

      {/* Kartu Sesi Terbuka (Muncul jika mata kuliah memiliki sesi hari ini) */}
      {sesiAktif && (
        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-indigo-200/90 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50/90 text-indigo-600">
              <CalendarCheck size={22} strokeWidth={1.9} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  Sesi terbuka
                </span>
                {isSudahPresensi && (
                  <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600">
                    Sudah presensi · {sesiAktif.waktuPresensi}
                  </span>
                )}
                {isMenungguPersetujuan && (
                  <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                    Menunggu persetujuan ({sesiAktif.jenisPengajuan})
                  </span>
                )}
                {!isSudahPresensi && !isMenungguPersetujuan && (
                  <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                    Belum presensi
                  </span>
                )}
              </div>

              <h2 className="mt-1.5 text-[18px] font-bold tracking-tight text-slate-800">
                {currentCourse.mataKuliah} · Pertemuan {sesiAktif.pertemuan}
              </h2>

              <p className="mt-1 text-[11px] text-slate-500">
                {sesiAktif.topik} · {currentCourse.dosen} · {sesiAktif.tanggal}
              </p>

              <p className="mt-1 text-[11px] font-semibold text-amber-700">
                Batas presensi: {sesiAktif.batasWaktu}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-stretch sm:items-end">
            {isSudahPresensi ? (
              <>
                <div className="inline-flex h-10 min-w-[185px] items-center justify-center gap-2 rounded-xl bg-emerald-50 px-5 text-[12px] font-bold text-emerald-700">
                  <CheckCircle2 size={16} />
                  <span>Presensi tercatat</span>
                </div>
                <span className="mt-1.5 text-center text-[10px] text-slate-400 sm:text-right">
                  Kehadiranmu sudah tersimpan.
                </span>
              </>
            ) : isMenungguPersetujuan ? (
              <>
                <div className="inline-flex h-10 min-w-[185px] items-center justify-center gap-2 rounded-xl bg-amber-50 px-5 text-[12px] font-bold text-amber-700">
                  <Clock size={16} />
                  <span>Menunggu verifikasi</span>
                </div>
                <span className="mt-1.5 text-center text-[10px] text-slate-400 sm:text-right">
                  Pengajuan {sesiAktif.jenisPengajuan} sedang ditinjau dosen.
                </span>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleOpenLeaveModal}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
                  >
                    <FilePlus2 size={14} />
                    <span>Ajukan izin / sakit</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenTokenModal}
                    className="inline-flex h-10 min-w-[170px] items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99]"
                  >
                    <KeyRound size={15} />
                    <span>Presensi sekarang</span>
                  </button>
                </div>
                <span className="mt-1.5 text-center text-[10px] text-slate-400 sm:text-right">
                  Hadir memakai 6 digit token · Izin/Sakit memerlukan bukti &amp;
                  persetujuan dosen.
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* 4 Kartu Statistik Kehadiran (Hadir, Izin, Sakit, Alpa) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Hadir */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">
              Hadir
            </span>
            <UserCheck size={16} className="text-indigo-600" />
          </div>
          <p className="mt-3 text-[26px] font-bold tracking-tight text-slate-800">
            {stats.hadir}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Dari {stats.totalSelesai} pertemuan selesai
          </p>
        </div>

        {/* Izin */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">Izin</span>
            <Mail size={16} className="text-indigo-600" />
          </div>
          <p className="mt-3 text-[26px] font-bold tracking-tight text-slate-800">
            {stats.izin}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {stats.izin > 0
              ? `${stats.izin} izin disetujui dosen`
              : "Tidak ada catatan izin"}
          </p>
        </div>

        {/* Sakit */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">
              Sakit
            </span>
            <HeartPulse size={16} className="text-indigo-600" />
          </div>
          <p className="mt-3 text-[26px] font-bold tracking-tight text-slate-800">
            {stats.sakit}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {stats.sakit > 0
              ? `${stats.sakit} sakit disetujui dosen`
              : "Tidak ada catatan sakit"}
          </p>
        </div>

        {/* Alpa */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-slate-500">Alpa</span>
            <UserX size={16} className="text-indigo-600" />
          </div>
          <p className="mt-3 text-[26px] font-bold tracking-tight text-slate-800">
            {stats.alpa}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            {stats.alpa === 0
              ? "Tanpa keterangan: 0"
              : "Tanpa keterangan sah"}
          </p>
        </div>
      </div>

      {/* Grid Bawah: Riwayat Kehadiran (Kiri) + Rekap Pribadi & Info Koreksi (Kanan) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* ================= KOLOM KIRI: TABEL RIWAYAT KEHADIRAN ================= */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 lg:col-span-8">
          <div>
            <h2 className="text-[15px] font-bold text-slate-800">
              Riwayat kehadiran
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {currentCourse.mataKuliah} · {currentCourse.semester}
            </p>
          </div>

          {/* Filter Bar Riwayat */}
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                placeholder="Cari topik pertemuan..."
                className="h-9 w-full rounded-xl border border-slate-200/90 bg-white pl-9 pr-3.5 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <SlidersHorizontal
                  size={13}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <select
                  value={selectedCourseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="h-9 cursor-pointer appearance-none rounded-xl border border-slate-200/90 bg-white pl-8 pr-7 text-[12px] font-medium text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-500"
                >
                  {coursesState.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.mataKuliah}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSortOrder((prev) =>
                    prev === "terbaru" ? "terlama" : "terbaru"
                  )
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3 text-[12px] font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <ArrowUpDown size={13} className="text-slate-500" />
                <span>{sortOrder === "terbaru" ? "Terbaru" : "Terlama"}</span>
              </button>
            </div>
          </div>

          {/* Tabel Riwayat */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left">
              <thead>
                <tr className="rounded-lg bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="rounded-l-lg px-3.5 py-2.5">
                    Pertemuan / Topik
                  </th>
                  <th className="px-3.5 py-2.5">Tanggal</th>
                  <th className="px-3.5 py-2.5">Waktu</th>
                  <th className="rounded-r-lg px-3.5 py-2.5 text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[12px]">
                {filteredRiwayat.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-slate-400"
                    >
                      Topik pertemuan tidak ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredRiwayat.map((row) => (
                    <tr
                      key={row.pertemuan}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-3.5 py-3.5">
                        <p className="font-medium text-slate-700">
                          P{row.pertemuan} · {row.topik}
                        </p>
                        {row.pengajuan && (
                          <p className="mt-0.5 text-[10px] text-slate-400">
                            Alasan: {row.pengajuan.alasan} ({row.pengajuan.namaFile})
                          </p>
                        )}
                      </td>
                      <td className="px-3.5 py-3.5 text-slate-500">
                        {row.tanggal}
                      </td>
                      <td className="px-3.5 py-3.5 text-slate-500">
                        {row.waktu}
                      </td>
                      <td className="px-3.5 py-3.5 text-right">
                        {renderStatusBadge(row)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-[11px] text-slate-400">
            Menampilkan {filteredRiwayat.length} dari{" "}
            {currentCourse.riwayat.length} pertemuan tercatat.
          </p>
        </div>

        {/* ================= KOLOM KANAN: REKAP PRIBADI & INFO KOREKSI ================= */}
        <div className="space-y-5 lg:col-span-4">
          {/* Kartu Rekap Pribadi */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <h2 className="text-[15px] font-bold text-slate-800">
              Rekap pribadi
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {currentCourse.mataKuliah} · {currentCourse.kelas}
            </p>

            <p className="mt-5 text-[34px] font-bold leading-none tracking-tight text-indigo-600">
              {stats.persentase}%
            </p>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  stats.memenuhiSyarat ? "bg-[#4F46E5]" : "bg-amber-500"
                }`}
                style={{ width: `${stats.persentase}%` }}
              />
            </div>

            <p className="mt-3.5 text-[11px] leading-relaxed text-slate-600">
              {stats.hadir} hadir dari {stats.totalSelesai} pertemuan selesai
              {stats.tidakHadir > 0
                ? ` (${stats.tidakHadir} tidak hadir: izin/sakit/alpa)`
                : ""}
              .
              {sesiAktif && !isSudahPresensi
                ? isMenungguPersetujuan
                  ? ` Pengajuan P${sesiAktif.pertemuan} menunggu persetujuan dosen.`
                  : ` Sesi pertemuan ${sesiAktif.pertemuan} belum dihitung.`
                : ""}
            </p>

            <div className="mt-3.5">
              {stats.memenuhiSyarat ? (
                <span className="inline-block rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                  Memenuhi minimum 75%
                </span>
              ) : (
                <span className="inline-block rounded-md bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700">
                  Di bawah minimum 75%
                </span>
              )}
            </div>

            <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
              Dihitung berdasarkan kehadiran fisik. Status izin &amp; sakit tetap
              terhitung tidak hadir (kebijakan toleransi ditentukan dosen).
            </p>
          </div>

          {/* Info Box Perlu Koreksi Kehadiran */}
          <div className="flex items-start gap-3 rounded-2xl bg-indigo-50/75 p-4">
            <Info size={18} className="mt-0.5 shrink-0 text-indigo-600" />
            <div>
              <p className="text-[12px] font-bold text-slate-800">
                Perlu koreksi kehadiran?
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                Hubungi dosen pengampu jika ada catatan yang tidak sesuai.
                Persetujuan izin/sakit maupun perubahan status hanya dapat
                dilakukan oleh dosen.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL 1: INPUT KODE TOKEN PRESENSI HADIR ================= */}
      {showTokenModal && sesiAktif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <KeyRound size={21} />
                </div>
                <div>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Verifikasi Presensi Hadir
                  </span>
                  <h3 className="mt-1 text-[16px] font-bold text-slate-800">
                    {currentCourse.mataKuliah} · Pertemuan {sesiAktif.pertemuan}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTokenModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-4 text-[12px] leading-relaxed text-slate-600">
              Masukkan <strong>6 digit kode token</strong> yang ditampilkan oleh{" "}
              <strong>{currentCourse.dosen}</strong> di kelas untuk mencatat
              kehadiranmu.
            </p>

            <form onSubmit={handleSubmitToken} className="mt-5">
              {/* 6 Kotak Input Digit Token */}
              <div
                onPaste={handleTokenPaste}
                className="flex items-center justify-between gap-2 sm:gap-2.5"
              >
                {tokenDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                    aria-label={`Digit token ke-${idx + 1}`}
                    className={`h-12 w-full rounded-xl border text-center text-[18px] font-bold text-slate-800 outline-none transition sm:h-13 sm:text-[20px] ${
                      tokenError
                        ? "border-rose-300 bg-rose-50/40 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                        : "border-slate-200 bg-slate-50/60 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    }`}
                  />
                ))}
              </div>

              {/* Pesan Error Token */}
              {tokenError && (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-[11px] font-medium text-rose-700">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{tokenError}</span>
                </div>
              )}

              {/* Petunjuk Token Demo (untuk pengujian & referensi BE) */}
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-2.5 text-[11px] text-slate-500">
                Kode token sesi aktif:{" "}
                <strong className="font-mono tracking-wider text-indigo-600">
                  {sesiAktif.tokenSesi || "849201"}
                </strong>{" "}
                <span className="text-slate-400">
                  (contoh token dari layar dosen)
                </span>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowTokenModal(false)}
                  className="h-10 rounded-xl border border-slate-200 px-4 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!isTokenComplete}
                  className={`inline-flex h-10 items-center gap-2 rounded-xl px-5 text-[12px] font-semibold text-white shadow-sm transition ${
                    isTokenComplete
                      ? "bg-[#4F46E5] hover:bg-indigo-700"
                      : "cursor-not-allowed bg-indigo-300"
                  }`}
                >
                  <CheckCircle2 size={15} />
                  <span>Konfirmasi hadir</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: PENGAJUAN IZIN / SAKIT ================= */}
      {showLeaveModal && sesiAktif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FilePlus2 size={21} />
                </div>
                <div>
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    Memerlukan Persetujuan Dosen
                  </span>
                  <h3 className="mt-1 text-[16px] font-bold text-slate-800">
                    Ajukan Izin / Sakit · P{sesiAktif.pertemuan}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitLeaveRequest} className="mt-4 space-y-4">
              {/* Pilihan Jenis Keterangan */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-700">
                  Jenis keterangan
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {["Izin", "Sakit"].map((type) => {
                    const isSelected = leaveType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setLeaveType(type);
                          if (leaveError) setLeaveError("");
                        }}
                        className={`flex h-10 items-center justify-center gap-2 rounded-xl border text-[12px] font-semibold transition ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/70 text-indigo-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {type === "Izin" ? (
                          <Mail size={14} />
                        ) : (
                          <HeartPulse size={14} />
                        )}
                        <span>{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Alasan */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-700">
                  Alasan ketidakhadiran <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={leaveReason}
                  onChange={(e) => {
                    setLeaveReason(e.target.value);
                    if (leaveError) setLeaveError("");
                  }}
                  placeholder={
                    leaveType === "Sakit"
                      ? "Contoh: Demam tinggi dan disarankan istirahat oleh dokter..."
                      : "Contoh: Mengikuti kegiatan lomba perwakilan kampus / urusan keluarga mendesak..."
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* Unggah File Bukti */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold text-slate-700">
                  Bukti pendukung (PDF/JPG/PNG, maks. 5 MB){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-3 text-left transition hover:border-indigo-400 hover:bg-indigo-50/20"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    {leaveFile ? (
                      <FileText size={16} className="shrink-0 text-indigo-600" />
                    ) : (
                      <Upload size={16} className="shrink-0 text-slate-400" />
                    )}
                    <span className="truncate text-[12px] font-medium text-slate-700">
                      {leaveFile
                        ? leaveFile.name
                        : leaveType === "Sakit"
                        ? "Pilih surat keterangan dokter..."
                        : "Pilih surat izin / dokumen pendukung..."}
                    </span>
                  </div>
                  <span className="ml-2 shrink-0 text-[11px] font-semibold text-indigo-600">
                    {leaveFile ? "Ganti" : "Unggah"}
                  </span>
                </button>
              </div>

              {/* Catatan Kebijakan */}
              <p className="rounded-xl bg-slate-50 px-3.5 py-2.5 text-[11px] leading-relaxed text-slate-500">
                Status pertemuan akan ditandai <strong>Menunggu persetujuan</strong>{" "}
                hingga dosen memverifikasi pengajuanmu. Izin maupun sakit tetap
                terhitung sebagai tidak hadir pada persentase kehadiran fisik.
              </p>

              {/* Error Pengajuan */}
              {leaveError && (
                <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-[11px] font-medium text-rose-700">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{leaveError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="h-10 rounded-xl border border-slate-200 px-4 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#4F46E5] px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  <CheckCircle2 size={15} />
                  <span>Kirim pengajuan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Konfirmasi */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-[12px] font-medium text-white shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
}