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
  BookOpen,
  Users,
  GraduationCap,
} from "lucide-react";
import { getSystemDateIndonesian } from "../utils/dateHelper";

const INITIAL_PROFILE = {
  namaLengkap: "Dr. Maya Putri, M.Kom.",
  nidn: "0419108501",
  jabatan: "Lektor Kepala",
  statusKepegawaian: "Dosen Tetap",
  fakultas: "Fakultas Informatika",
  programStudi: "S1 Teknik Informatika",
  mataKuliah: ["IF203 · Basis Data", "IF205 · Pemrograman Web"],
  emailKampus: "maya.putri@dosen.cakrawala.ac.id",
  nomorTelepon: "0812 9876 0501",
  emailPemulihan: "maya.putri@gmail.com",
  avatarUrl: null,
  lastPasswordUpdate: "5 September 2026",
};

export default function ProfilDosen() {
  const navigate = useNavigate();
  const [systemDate] = useState(() => getSystemDateIndonesian());
  const [activeTab, setActiveTab] = useState("pribadi");
  const securitySectionRef = useRef(null);
  const fileInputRef = useRef(null);
  const [savedProfile, setSavedProfile] = useState(INITIAL_PROFILE);
  const [nomorTelepon, setNomorTelepon] = useState(INITIAL_PROFILE.nomorTelepon);
  const [emailPemulihan, setEmailPemulihan] = useState(INITIAL_PROFILE.emailPemulihan);
  const [avatarPreview, setAvatarPreview] = useState(INITIAL_PROFILE.avatarUrl);
  const [profileError, setProfileError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordError, setPasswordError] = useState("");
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

  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    if (tab === "keamanan" && securitySectionRef.current) {
      securitySectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!nomorTelepon.trim()) {
      setProfileError("Nomor telepon tidak boleh kosong.");
      return;
    }
    setProfileError("");
    setSavedProfile((prev) => ({
      ...prev,
      nomorTelepon: nomorTelepon.trim(),
      emailPemulihan: emailPemulihan.trim(),
      avatarUrl: avatarPreview,
    }));
    showToast("Perubahan profil berhasil disimpan.");
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError("Masukkan password saat ini.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok.");
      return;
    }
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Password berhasil diperbarui.");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-gray-900 sm:text-[26px]">
          Profil &amp; Keamanan
        </h1>
        <p className="mt-1 text-xs text-gray-400">
          Kelola informasi kontak, foto profil, dan keamanan akun dosen Anda.
        </p>
      </div>

      {/* Tab Nav */}
      <div className="flex border-b border-gray-200 gap-0">
        {[
          { key: "pribadi", label: "Profil Pribadi" },
          { key: "keamanan", label: "Keamanan Akun" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleSelectTab(tab.key)}
            className={`px-4 sm:px-6 py-3 text-xs font-semibold transition-colors border-b-2 cursor-pointer ${
              activeTab === tab.key
                ? "border-[#4F46E5] text-[#4F46E5]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Avatar & Info Identitas Terkunci */}
        <div className="lg:col-span-4 space-y-5">
          {/* Kartu Avatar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center font-extrabold text-3xl overflow-hidden ring-4 ring-[#EEF2FF]">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  "MP"
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-[#4F46E5] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#4338CA] transition-colors cursor-pointer"
                title="Ganti foto profil"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{savedProfile.namaLengkap}</p>
              <p className="text-xs text-gray-500 mt-0.5">NIDN: {savedProfile.nidn}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#4F46E5]">
                {savedProfile.jabatan}
              </span>
            </div>
            {profileError && (
              <div className="flex items-start gap-1.5 text-[11px] text-rose-700 bg-rose-50 px-3 py-2 rounded-xl w-full text-left">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}
            <p className="text-[10px] text-gray-400">
              JPG atau PNG, maksimal 2 MB.
            </p>
          </div>

          {/* Kartu Identitas Terkunci */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-400" />
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Identitas Akademik</h3>
            </div>
            {[
              { label: "Nama Lengkap", value: savedProfile.namaLengkap, icon: GraduationCap },
              { label: "NIDN", value: savedProfile.nidn, icon: Info },
              { label: "Jabatan Fungsional", value: savedProfile.jabatan, icon: BookOpen },
              { label: "Fakultas", value: savedProfile.fakultas, icon: Users },
              { label: "Program Studi", value: savedProfile.programStudi, icon: GraduationCap },
              { label: "Email Kampus", value: savedProfile.emailKampus, icon: Info },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="space-y-0.5">
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{item.label}</label>
                  <div className="flex items-center gap-2 bg-gray-50/80 border border-gray-200/60 rounded-xl px-3 py-2">
                    <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-700 font-medium break-all">{item.value}</span>
                    <Lock className="w-3 h-3 text-gray-300 ml-auto shrink-0" />
                  </div>
                </div>
              );
            })}
            <div className="flex items-start gap-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 p-2.5 rounded-xl">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>Data identitas dikelola oleh Kepegawaian Universitas. Hubungi SIMPEG untuk koreksi.</span>
            </div>
          </div>

          {/* Mata Kuliah yang Diampu */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-400" /> Mata Kuliah Diampu
            </h3>
            {savedProfile.mataKuliah.map((mk, i) => (
              <div key={i} className="bg-[#EEF2FF]/60 border border-indigo-100 rounded-xl px-3 py-2 text-xs font-semibold text-[#4F46E5]">
                {mk}
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Form Edit Kontak & Keamanan */}
        <div className="lg:col-span-8 space-y-6">
          {/* Form Edit Kontak */}
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Informasi kontak</h2>
              <p className="text-xs text-gray-400 mt-0.5">Nomor telepon dan email pemulihan dapat diubah secara mandiri.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Nomor telepon <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={nomorTelepon}
                  onChange={(e) => setNomorTelepon(e.target.value)}
                  placeholder="Contoh: 0812 1234 5678"
                  className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">Email pemulihan</label>
                <input
                  type="email"
                  value={emailPemulihan}
                  onChange={(e) => setEmailPemulihan(e.target.value)}
                  placeholder="email@gmail.com"
                  className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5]"
                />
                <p className="text-[10px] text-gray-400">Digunakan untuk pemulihan password jika email kampus tidak bisa diakses.</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-50">
              {hasProfileChanges && (
                <button
                  type="button"
                  onClick={() => {
                    setNomorTelepon(savedProfile.nomorTelepon);
                    setEmailPemulihan(savedProfile.emailPemulihan);
                    setAvatarPreview(savedProfile.avatarUrl);
                    setProfileError("");
                  }}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  Batalkan perubahan
                </button>
              )}
              <button
                type="submit"
                disabled={!hasProfileChanges}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-colors ${
                  hasProfileChanges
                    ? "bg-[#4F46E5] hover:bg-[#4338CA] cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Simpan perubahan
              </button>
            </div>
          </form>

          {/* Keamanan Akun */}
          <div ref={securitySectionRef} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#4F46E5]" />
              <div>
                <h2 className="text-sm font-bold text-gray-900">Keamanan akun</h2>
                <p className="text-xs text-gray-400 mt-0.5">Password terakhir diperbarui: {savedProfile.lastPasswordUpdate}</p>
              </div>
            </div>
            <form onSubmit={handleSavePassword} className="space-y-4">
              {/* Password Saat Ini */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">Password saat ini</label>
                <div className="relative">
                  <input
                    type={showCurrentPw ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan password saat ini"
                    className="w-full bg-white border border-gray-200/90 rounded-xl px-4 pr-10 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5]"
                  />
                  <button type="button" onClick={() => setShowCurrentPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                    {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password Baru */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Password baru</label>
                  <div className="relative">
                    <input
                      type={showNewPw ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 karakter"
                      className="w-full bg-white border border-gray-200/90 rounded-xl px-4 pr-10 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5]"
                    />
                    <button type="button" onClick={() => setShowNewPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {/* Konfirmasi Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Konfirmasi password baru</label>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru"
                      className="w-full bg-white border border-gray-200/90 rounded-xl px-4 pr-10 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5]"
                    />
                    <button type="button" onClick={() => setShowConfirmPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                      {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              {passwordError && (
                <div className="flex items-start gap-2 text-[11px] text-rose-700 bg-rose-50 border border-rose-100 px-3 py-2.5 rounded-xl">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
              <div className="flex items-center justify-end pt-2 border-t border-gray-50">
                <button type="submit" className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer">
                  Simpan password baru
                </button>
              </div>
            </form>
          </div>

          {/* Zona Keluar Akun */}
          <div className="bg-white rounded-2xl border border-red-100/80 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <LogOut className="w-4 h-4 text-red-500" /> Keluar dari akun
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Anda akan keluar dari sesi aktif. Pastikan semua perubahan sudah disimpan sebelum keluar.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="px-5 py-2.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Keluar dari akun
            </button>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Keluar */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Keluar dari akun?</h3>
                <p className="text-xs text-gray-400 mt-0.5">Sesi Anda akan diakhiri.</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Anda akan keluar dari akun <span className="font-semibold text-gray-900">Dr. Maya Putri</span>. Semua perubahan yang belum disimpan akan hilang.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button type="button" onClick={() => setShowLogoutModal(false)} className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded-xl cursor-pointer">
                Batal
              </button>
              <button type="button" onClick={() => navigate("/login")} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-xs font-semibold text-white rounded-xl shadow-xs cursor-pointer">
                Ya, keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}