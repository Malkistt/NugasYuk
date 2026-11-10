import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  KeyRound,
  Mail,
  ShieldCheck,
  Send,
} from "lucide-react";
import campusImage from "../assets/hero.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    // Simulasi pengiriman tautan reset password
    setTimeout(() => {
      setLoading(false);
      setMessage(
        "Tautan reset password telah dikirim! Mengarahkan ke halaman buat password baru..."
      );

      // Mengarahkan ke ResetPasswordPage dengan membawa data email via state
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
    }, 800);
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
          <span className="text-[15px] font-bold tracking-tight">ruangkuliah</span>
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

      {/* Sisi Kanan: Form Lupa Password */}
      <section className="relative flex min-h-screen flex-col px-6 py-7 sm:px-10 md:px-14 lg:px-16 xl:px-[7.5rem]">
        <div className="flex items-center justify-between lg:justify-end">
          <div className="flex items-center gap-2 text-slate-800 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <BookOpen size={17} />
            </span>
            <span className="text-sm font-bold">ruangkuliah</span>
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
              Lupa password Anda?
            </h2>
            <p className="mt-2 text-[12px] leading-5 text-slate-500 sm:text-[13px]">
              Masukkan email kampus Anda yang terdaftar. Kami akan mengirimkan instruksi untuk me-reset password.
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@student.cakrawala.ac.id"
                  className="h-[46px] w-full rounded-lg border border-slate-200 bg-white px-3 pr-11 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <Mail size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-[12px] font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60"
            >
              <Send size={15} />
              <span>{loading ? "Memproses..." : "Kirim tautan reset"}</span>
            </button>

            {message && (
              <p
                role="status"
                className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-[11px] leading-5 text-indigo-800"
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
          <span>© 2026 Ruangkuliah</span>
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