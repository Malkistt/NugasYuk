import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import campusImage from "../assets/hero.png";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    // Simulasi proses login sebelum integrasi API Backend
    setTimeout(() => {
      setLoading(false);

      // Cek email untuk menentukan simulasi role redirect
      if (email.toLowerCase().includes("dosen")) {
        navigate("/dashboarddosen");
      } else {
        navigate("/mahasiswa/dashboard");
      }
    }, 600);
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

      {/* Sisi Kanan: Form Login */}
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

        <div className="mx-auto flex w-full max-w-[470px] flex-1 flex-col justify-center py-14 lg:py-10">
          <div className="mb-7">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-indigo-600">
              Ruang akademik Anda
            </p>
            <h2 className="text-[27px] font-semibold leading-tight tracking-[-0.04em] text-slate-800 sm:text-[30px]">
              Selamat datang kembali.
            </h2>
            <p className="mt-2.5 text-[12px] leading-5 text-slate-500 sm:text-[13px]">
              Masuk untuk melanjutkan aktivitas perkuliahan Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                Email kampus
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nama@cakrawala.ac.id"
                  className="h-[46px] w-full rounded-lg border border-slate-200 bg-white px-3 pr-11 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <Mail size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan password"
                  className="h-[46px] w-full rounded-lg border border-slate-200 bg-white px-3 pr-11 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-500">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-300 accent-indigo-600 focus:ring-indigo-500"
                />
                Ingat saya
              </label>
              <Link to="/forgot-password" className="text-[11px] font-semibold text-indigo-600 transition hover:text-indigo-700">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-[12px] font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60"
            >
              <ArrowRight size={15} />
              <span>{loading ? "Memproses..." : "Masuk ke Ruangkuliah"}</span>
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="whitespace-nowrap text-[10px] text-slate-400">Belum punya akun?</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <Link
            to="/register"
            className="flex h-[44px] w-full items-center justify-center rounded-lg border border-slate-200 bg-white text-[12px] font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-700"
          >
            Buat akun baru
          </Link>

          <div className="mt-5 flex items-center justify-center gap-2 text-center text-[10px] leading-5 text-slate-400">
            <LockKeyhole size={12} />
            <span>Gunakan email resmi universitas untuk masuk.</span>
          </div>
        </div>

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