import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Lock,
  Info,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

const INITIAL_PROFILE = {
  namaLengkap: "Nadia Rahma",
  nim: "231011024",
  kelas: "TI-3A",
  statusAkademik: "Mahasiswa aktif",
  programStudi: "S1 Teknik Informatika",
  semester: "Semester 3",
  angkatan: "Angkatan 2025",
  emailKampus: "nadia.rahma@student.cakrawala.ac.id",
  nomorTelepon: "0812 3456 7024",
  emailPemulihan: "nadia.rahma@gmail.com",
  avatarUrl: null,
  lastPasswordUpdate: "12 September 2026",
};

export default function ProfilMahasiswa() {
  const navigate = useNavigate();

  // Tab navigasi atas ("semua" / "pribadi" / "keamanan")
  // Default "pribadi" menampilkan seluruh tata letak sesuai desain, klik "keamanan" menggulir fokus ke bagian Keamanan akun
  const [activeTab, setActiveTab] = useState("pribadi");
  const securitySectionRef = useRef(null);
  const fileInputRef = useRef(null);

  // State data profil tersimpan & form edit kontak
  const [savedProfile, setSavedProfile] = useState(INITIAL_PROFILE);
  const [nomorTelepon, setNomorTelepon] = useState(
    INITIAL_PROFILE.nomorTelepon
  );
  const [emailPemulihan, setEmailPemulihan] = useState(
    INITIAL_PROFILE.emailPemulihan
  );
  const [avatarPreview, setAvatarPreview] = useState(INITIAL_PROFILE.avatarUrl);
  const [profileError, setProfileError] = useState("");

  // State form Keamanan Akun (Ubah Password)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // State Modal Konfirmasi Keluar & Toast Notifikasi
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const hasProfileChanges =
    nomorTelepon.trim() !== savedProfile.nomorTelepon ||
    emailPemulihan.trim() !== savedProfile.emailPemulihan ||
    avatarPreview !== savedProfile.avatarUrl;

  // Handler klik tab
  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (tab === "keamanan" && securitySectionRef.current) {
      securitySectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Handler ganti foto profil (JPG/PNG maks 2 MB)
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setProfileError("Format foto harus berupa JPG atau PNG.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileError("Ukuran foto profil maksimal 2 MB.");
      return;
    }

    setProfileError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Batalkan perubahan kontak & foto
  const handleCancelProfile = () => {
    setNomorTelepon(savedProfile.nomorTelepon);
    setEmailPemulihan(savedProfile.emailPemulihan);
    setAvatarPreview(savedProfile.avatarUrl);
    setProfileError("");
  };

  // Simpan perubahan kontak & foto
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileError("");

    const cleanPhone = nomorTelepon.trim();
    const cleanRecoveryEmail = emailPemulihan.trim();

    if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 9) {
      setProfileError("Masukkan nomor telepon aktif yang valid.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanRecoveryEmail || !emailRegex.test(cleanRecoveryEmail)) {
      setProfileError("Masukkan alamat email pemulihan yang valid.");
      return;
    }

    setSavedProfile((prev) => ({
      ...prev,
      nomorTelepon: cleanPhone,
      emailPemulihan: cleanRecoveryEmail,
      avatarUrl: avatarPreview,
    }));

    showToast("Perubahan informasi kontak dan profil berhasil disimpan.");
  };

  // Ubah Password
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Masukkan password Anda saat ini terlebih dahulu.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password baru minimal harus terdiri dari 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak cocok.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "Password baru tidak boleh sama dengan password saat ini."
      );
      return;
    }

    setSavedProfile((prev) => ({
      ...prev,
      lastPasswordUpdate: "24 Oktober 2026",
    }));
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Password akun berhasil diperbarui.");
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/login");
  };

  // Inisial nama untuk avatar default jika belum ada foto
  const initials = savedProfile.namaLengkap
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-5">
      {/* Header Judul */}
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-slate-800 sm:text-[26px]">
          Profil &amp; keamanan
        </h1>
        <p className="mt-1 text-[12px] text-slate-500 sm:text-[13px]">
          Kelola identitas, kontak, dan keamanan akun Anda.
        </p>
      </div>

      {/* Tabs Navigasi */}
      <div className="flex items-center gap-6 border-b border-slate-200/80 text-[12px]">
        {[
          { key: "pribadi", label: "Informasi pribadi" },
          { key: "keamanan", label: "Keamanan akun" },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleSelectTab(tab.key)}
              className={`border-b-2 pb-3 font-semibold transition ${
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

      {/* Grid Utama: Kolom Kiri (Foto & Info Akademik) + Kolom Kanan (Edit Profil & Keamanan) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* ================= KOLOM KIRI (4 KOLOM) ================= */}
        <div className="space-y-5 lg:col-span-4">
          {/* Kartu Foto Profil */}
          <div className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-6 text-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-indigo-100 bg-indigo-50">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={savedProfile.namaLengkap}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[24px] font-bold text-indigo-600">
                  {initials}
                </div>
              )}
            </div>

            <h2 className="mt-4 text-[17px] font-bold tracking-tight text-slate-800">
              {savedProfile.namaLengkap}
            </h2>

            <span className="mt-2 inline-block rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
              {savedProfile.statusAkademik}
            </span>

            <p className="mt-2.5 text-[11px] text-slate-500">
              {savedProfile.nim} · Kelas {savedProfile.kelas}
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-slate-50 hover:text-indigo-600"
            >
              <Camera size={14} />
              <span>Ganti foto</span>
            </button>

            <p className="mt-2.5 text-[10px] text-slate-400">
              JPG atau PNG, maksimal 2 MB
            </p>
          </div>

          {/* Kartu Informasi Akademik (Terkunci / Dikelola Kampus) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
            <h3 className="text-[15px] font-bold text-slate-800">
              Informasi akademik
            </h3>

            <div className="mt-4 space-y-1 text-[12px]">
              <p className="text-[11px] text-slate-400">Program studi</p>
              <p className="font-semibold text-slate-700">
                {savedProfile.programStudi}
              </p>
              <p className="pt-1 text-[11px] text-slate-500">
                {savedProfile.semester} · {savedProfile.angkatan}
              </p>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-indigo-50/75 p-3.5">
              <Info size={16} className="mt-0.5 shrink-0 text-indigo-600" />
              <div className="text-[11px] leading-relaxed text-slate-600">
                <p className="font-bold text-slate-800">
                  Identitas akademik dikelola oleh kampus.
                </p>
                <p className="mt-0.5 text-slate-500">
                  Hubungi bagian Akademik Fakultas jika terdapat kesalahan data
                  nama, NIM, kelas, atau program studi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= KOLOM KANAN (8 KOLOM) ================= */}
        <div className="space-y-6 lg:col-span-8">
          {/* Kartu 1: Edit Profil */}
          <form
            onSubmit={handleSaveProfile}
            className="rounded-2xl border border-slate-200/80 bg-white p-6"
          >
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-[16px] font-bold text-slate-800">
                  Edit profil
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Pastikan informasi kontak Anda selalu terbaru.
                </p>
              </div>

              <span className="inline-flex items-center gap-1 self-start rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500 sm:self-auto">
                <Lock size={11} />
                <span>Data akademik dikunci</span>
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Nama Lengkap (Terkunci - Dikelola Kampus) */}
              <div>
                <label className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span>Nama lengkap</span>
                  <span className="text-[10px] font-normal text-slate-400">
                    Terkunci
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={savedProfile.namaLengkap}
                    disabled
                    readOnly
                    className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200/80 bg-slate-50/90 pl-3.5 pr-9 text-[12px] font-medium text-slate-500"
                  />
                  <Lock
                    size={13}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-400">
                  Sesuai data PDDikti &amp; kartu mahasiswa.
                </p>
              </div>

              {/* Nomor Induk Mahasiswa / NIM (Terkunci - Dikelola Kampus) */}
              <div>
                <label className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span>Nomor induk mahasiswa</span>
                  <span className="text-[10px] font-normal text-slate-400">
                    Terkunci
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={savedProfile.nim}
                    disabled
                    readOnly
                    className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200/80 bg-slate-50/90 pl-3.5 pr-9 text-[12px] font-medium text-slate-500"
                  />
                  <Lock
                    size={13}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-400">
                  Hubungi akademik untuk perubahan NIM.
                </p>
              </div>

              {/* Email Kampus (Terkunci - Akun Institusi) */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span>Email kampus</span>
                  <span className="text-[10px] font-normal text-slate-400">
                    Terverifikasi institusi
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={savedProfile.emailKampus}
                    disabled
                    readOnly
                    className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200/80 bg-slate-50/90 pl-3.5 pr-9 text-[12px] font-medium text-slate-500"
                  />
                  <ShieldCheck
                    size={15}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600"
                  />
                </div>
              </div>

              {/* Nomor Telepon (Dapat Diubah Mandiri) */}
              <div>
                <label
                  htmlFor="nomorTelepon"
                  className="mb-1.5 block text-[11px] font-bold text-slate-700"
                >
                  Nomor telepon
                </label>
                <input
                  id="nomorTelepon"
                  type="tel"
                  value={nomorTelepon}
                  onChange={(e) => {
                    setNomorTelepon(e.target.value);
                    if (profileError) setProfileError("");
                  }}
                  placeholder="Contoh: 0812 3456 7890"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[12px] text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* Email Pemulihan (Dapat Diubah Mandiri) */}
              <div>
                <label
                  htmlFor="emailPemulihan"
                  className="mb-1.5 block text-[11px] font-bold text-slate-700"
                >
                  Email pemulihan
                </label>
                <input
                  id="emailPemulihan"
                  type="email"
                  value={emailPemulihan}
                  onChange={(e) => {
                    setEmailPemulihan(e.target.value);
                    if (profileError) setProfileError("");
                  }}
                  placeholder="nama@gmail.com"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[12px] text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Pesan Error Form Profil */}
            {profileError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-[11px] font-medium text-rose-700">
                <AlertCircle size={15} className="shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            {/* Tombol Aksi Edit Profil */}
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={!hasProfileChanges}
                onClick={handleCancelProfile}
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Batalkan
              </button>

              <button
                type="submit"
                disabled={!hasProfileChanges}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#4F46E5] px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
              >
                <span>Simpan perubahan</span>
              </button>
            </div>
          </form>

          {/* Kartu 2: Keamanan Akun */}
          <form
            ref={securitySectionRef}
            onSubmit={handleChangePassword}
            className="rounded-2xl border border-slate-200/80 bg-white p-6"
          >
            <div>
              <h2 className="text-[16px] font-bold text-slate-800">
                Keamanan akun
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-400">
                Password terakhir diperbarui {savedProfile.lastPasswordUpdate}.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {/* Password Saat Ini */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-1.5 block text-[11px] font-bold text-slate-700"
                >
                  Password saat ini
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrentPw ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    placeholder="••••••••••••"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw((prev) => !prev)}
                    aria-label="Tampilkan atau sembunyikan password saat ini"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Password Baru */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-1.5 block text-[11px] font-bold text-slate-700"
                  >
                    Password baru
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPw ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      placeholder="Minimal 8 karakter"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw((prev) => !prev)}
                      aria-label="Tampilkan atau sembunyikan password baru"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Konfirmasi Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-[11px] font-bold text-slate-700"
                  >
                    Konfirmasi password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPw ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      placeholder="Ulangi password baru"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw((prev) => !prev)}
                      aria-label="Tampilkan atau sembunyikan konfirmasi password"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pesan Error Password */}
            {passwordError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-2.5 text-[11px] font-medium text-rose-700">
                <AlertCircle size={15} className="shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {/* Tombol Keluar & Ubah Password */}
            <div className="mt-5 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 text-[12px] font-semibold text-rose-600 transition hover:bg-rose-50"
              >
                <LogOut size={14} />
                <span>Keluar dari akun</span>
              </button>

              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <span>Ubah password</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Konfirmasi Keluar Akun */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <LogOut size={20} />
            </div>
            <h3 className="mt-4 text-[16px] font-bold text-slate-800">
              Keluar dari akun?
            </h3>
            <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">
              Sesi Anda di Ruang Mahasiswa akan diakhiri dan Anda perlu masuk
              kembali untuk mengakses perkuliahan.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="h-9 rounded-xl border border-slate-200 px-4 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="h-9 rounded-xl bg-rose-600 px-4 text-[12px] font-semibold text-white hover:bg-rose-700"
              >
                Ya, keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Konfirmasi */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-[12px] font-medium text-white shadow-lg">
          <CheckCircle2 size={15} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}