import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Eye,
  EyeOff,
  Mail,
  ShieldCheck,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import campusImage from "../assets/hero.png";

export default function RegisterPage() {
  const [role, setRole] = useState("mahasiswa"); // 'mahasiswa' atau 'dosen'
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState(""); // NIM untuk mahasiswa, NIDN untuk dosen
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Konfirmasi password tidak cocok.");
      return;
    }

    if (!agreeTerms) {
      setMessage("Anda harus menyetujui Syarat & Ketentuan.");
      return;
    }

    // Dummy register / integrasi backend kelak
    setMessage(
      "Pendaftaran berhasil! Mengarahkan ke halaman login..."
    );
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <main className="min-h-screen w-full bg-white font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 lg:grid lg:grid-cols-[43.1%_56.9%]">
      {/* Sisi Kiri: Banner Visual */}
      <section className="relative hidden min-h-screen overflow-hidden bg-slate-800 lg:block">
        <img
          src={campusImage}
          alt="Gedung kampus"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/35 via-slate-900/15 to-slate-950/85" />

        <div className="absolute left-8 top-8 flex items-center gap-2.5 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
            <BookOpen size={19} strokeWidth={2.2} className="text-indigo-600" />
          </span>
          <span className="text-[15px] font-bold tracking-tight">NugasYuk</span>
        </div>

        <div className="absolute bottom-[13.5%] left-8 right-8 text-white xl:left-10 xl:right-10">
          <span className="mb-5 inline-flex rounded-md bg-white/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-indigo-600 shadow-sm">
            Satu ruang, banyak kemungkinan
          </span>
          <h1 className="max-w-xl text-[29px] font-bold leading-[1.45] tracking-tight xl:text-[34px]">
            Perkuliahan tertata.
            <br />
            Belajar lebih bermakna.
          </h1>
          <p className="mt-4 max-w-md text-[12px] leading-6 text-white/85 xl:text-[13px]">
            Dari materi pertama hingga pencapaian berikutnya. Semua terhubung
            dalam satu ruang akademik.
          </p>
          <div className="mt-5 flex items-center gap-2 text-[10px] font-medium text-white/90">
            <ShieldCheck size={14} />
            <span>Aman, terstruktur, dan terhubung dengan kampus.</span>
          </div>
        </div>
      </section>

      {/* Sisi Kanan: Form Registrasi */}
      <section className="relative flex min-h-screen flex-col px-6 py-7 sm:px-10 md:px-14 lg:px-16 xl:px-[7.5rem]">
        <div className="flex items-center justify-between lg:justify-end">
          <div className="flex items-center gap-2 text-slate-800 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <BookOpen size={17} />
            </span>
            <span className="text-sm font-bold">NugasYuk</span>
          </div>
          <a
            href="mailto:akademik@kampus.ac.id"
            className="text-[10px] font-medium text-slate-400 transition hover:text-indigo-600 sm:text-[11px]"
          >
            Butuh bantuan? <span className="hover:underline">Hubungi akademik</span>
          </a>
        </div>

        <div className="mx-auto flex w-full max-w-[470px] flex-1 flex-col justify-center py-8 lg:py-6">
          <div className="mb-6">
            <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.04em] text-slate-800 sm:text-[28px]">
              Mulai ruang belajar Anda.
            </h2>
            <p className="mt-2 text-[12px] leading-5 text-slate-500 sm:text-[13px]">
              Satu akun untuk seluruh aktivitas akademik. Daftar menggunakan identitas kampus Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pilihan Role: Mahasiswa / Dosen */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                Daftar sebagai
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("mahasiswa")}
                  className={`flex h-[44px] items-center justify-center gap-2 rounded-lg border text-[12px] font-semibold transition ${
                    role === "mahasiswa"
                      ? "border-indigo-600 bg-indigo-50/60 text-indigo-600"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <GraduationCap size={16} />
                  <span>Mahasiswa</span>
                  <div
                    className={`ml-1 h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                      role === "mahasiswa"
                        ? "border-indigo-600 bg-indigo-600"
                        : "border-slate-300"
                    }`}
                  >
                    {role === "mahasiswa" && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("dosen")}
                  className={`flex h-[44px] items-center justify-center gap-2 rounded-lg border text-[12px] font-semibold transition ${
                    role === "dosen"
                      ? "border-indigo-600 bg-indigo-50/60 text-indigo-600"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <UserCheck size={16} />
                  <span>Dosen</span>
                  <div
                    className={`ml-1 h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                      role === "dosen"
                        ? "border-indigo-600 bg-indigo-600"
                        : "border-slate-300"
                    }`}
                  >
                    {role === "dosen" && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Nama Lengkap & NIM/NIDN (Grid 2 Kolom) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                  Nama lengkap
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nadia Rahma"
                  className="h-[44px] w-full rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label htmlFor="identifier" className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                  {role === "mahasiswa" ? "NIM" : "NIDN"}
                </label>
                <input
                  id="identifier"
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={role === "mahasiswa" ? "231011024" : "0012058901"}
                  className="h-[44px] w-full rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Email Kampus */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                Email kampus
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === "mahasiswa"
                      ? "nadia.rahma@student.cakrawala.ac.id"
                      : "nadia.rahma@cakrawala.ac.id"
                  }
                  className="h-[44px] w-full rounded-lg border border-slate-200 bg-white px-3 pr-11 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <Mail size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-[44px] w-full rounded-lg border border-slate-200 bg-white px-3 pr-11 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                Minimal 8 karakter, kombinasi huruf dan angka.
              </p>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                Konfirmasi password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-[44px] w-full rounded-lg border border-slate-200 bg-white px-3 pr-11 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600"
                >
                  {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            {/* Checkbox Syarat & Ketentuan */}
            <div className="pt-1">
              <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-4 text-slate-500">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 accent-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  Saya menyetujui{" "}
                  <a href="#syarat" className="text-indigo-600 hover:underline">
                    Syarat &amp; Ketentuan
                  </a>{" "}
                  serta{" "}
                  <a href="#privasi" className="text-indigo-600 hover:underline">
                    Kebijakan Privasi
                  </a>{" "}
                  NugasYuk.
                </span>
              </label>
            </div>

            {/* Tombol Buat Akun */}
            <button
              type="submit"
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-[12px] font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.99]"
            >
              <span>Buat akun {role === "mahasiswa" ? "Mahasiswa" : "Dosen"}</span>
            </button>

            {message && (
              <p role="status" className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-[11px] leading-5 text-indigo-800">
                {message}
              </p>
            )}
          </form>

          {/* Link Ke Halaman Login */}
          <div className="mt-6 text-center text-[11px] text-slate-400">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
              Masuk
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-3 pb-1 text-[10px] text-slate-400 sm:flex-row">
          <span>© 2026 NugasYuk</span>
          <div className="flex items-center gap-2">
            <a href="#privasi" className="transition hover:text-indigo-600">Privasi</a>
            <span>·</span>
            <a href="#syarat" className="transition hover:text-indigo-600">Syarat &amp; ketentuan</a>
          </div>
        </footer>
      </section>
    </main>
  );
}