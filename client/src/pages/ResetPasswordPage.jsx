import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import campusImage from "../assets/hero.png";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Membaca email dari state router, jika tidak ada gunakan default fallback
  const verifiedEmail =
    location.state?.email || "nadia.rahma@student.kampus.ac.id";

  const isMinLength = password.length >= 8;
  const isMatch = password.length > 0 && password === confirmPassword;
  const isValid = isMinLength && isMatch;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isMinLength) {
      setMessage("Password minimal harus 8 karakter.");
      return;
    }

    if (!isMatch) {
      setMessage("Konfirmasi password baru tidak cocok.");
      return;
    }

    setIsSuccess(true);
    setMessage("Password berhasil diperbarui! Mengarahkan ke halaman masuk...");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <main className="min-h-screen w-full bg-white font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 lg:grid lg:grid-cols-[43.1%_56.9%]">
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

        <div className="mx-auto flex w-full max-w-[470px] flex-1 flex-col justify-center py-10 lg:py-8">
          <div className="mb-6">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <KeyRound size={22} />
            </div>

            <h2 className="text-[27px] font-semibold leading-tight tracking-[-0.04em] text-slate-800 sm:text-[30px]">
              Buat password baru.
            </h2>
            <p className="mt-2 text-[12px] leading-5 text-slate-500 sm:text-[13px]">
              Tautan reset telah diverifikasi. Gunakan password baru yang belum pernah Anda gunakan sebelumnya.
            </p>
          </div>

          <div className="mb-5 flex items-center gap-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 px-3.5 py-2.5 text-[12px] font-semibold text-emerald-900">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="truncate">{verifiedEmail}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                Password baru
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-[46px] w-full rounded-lg border border-slate-200 bg-white px-3 pr-11 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
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

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-[11px] font-semibold text-slate-700">
                Konfirmasi password baru
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-[46px] w-full rounded-lg border border-slate-200 bg-white px-3 pr-11 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
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

            {password.length > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <CheckCircle2
                  size={13}
                  className={isValid ? "text-emerald-600" : "text-slate-300"}
                />
                <span>
                  Password kuat · {isMatch ? "Kedua password cocok" : "Password tidak cocok"}
                </span>
              </div>
            )}

            <button
              type="submit"
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-[12px] font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.99]"
            >
              Simpan password baru
            </button>

            {message && (
              <p
                role="status"
                className={`rounded-lg border px-3 py-2.5 text-[11px] leading-5 ${
                  isSuccess
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
              >
                {message}
              </p>
            )}
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 transition hover:text-indigo-600"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke halaman masuk</span>
            </Link>
          </div>
        </div>

        <footer className="flex flex-col items-center justify-between gap-3 pb-1 text-[10px] text-slate-400 sm:flex-row">
          <span>© 2026 NugasYuk • Universitas Cakrawala</span>
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