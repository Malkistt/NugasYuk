import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Menu,
  User,
  LogOut,
  HelpCircle,
} from "lucide-react";

export default function NavbarMahasiswa({ onOpenMobileMenu }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Menutup dropdown otomatis saat klik di luar area menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Menyusun breadcrumb dinamis sesuai rute aktif
  const getBreadcrumbs = () => {
    const path = location.pathname;

    if (path.startsWith("/mahasiswa/tugas")) {
      return [{ label: "Tugas" }];
    }
    if (path.startsWith("/mahasiswa/kuis")) {
      if (path.includes("/hasil")) {
        return [
          { label: "Kuis", path: "/mahasiswa/kuis" },
          { label: "Hasil kuis" },
        ];
      }
      if (path.includes("/kerjakan")) {
        return [
          { label: "Kuis", path: "/mahasiswa/kuis" },
          { label: "Pengerjaan kuis" },
        ];
      }
      return [{ label: "Kuis" }];
    }
    if (path.startsWith("/mahasiswa/materi")) {
      return [{ label: "Materi" }];
    }
    if (path.startsWith("/mahasiswa/absensi")) {
      // Cek apakah sedang membuka detail mata kuliah (/mahasiswa/absensi/:kodeMk)
      const segments = path.split("/").filter(Boolean);
      if (segments.length > 2) {
        return [
          { label: "Absensi", path: "/mahasiswa/absensi" },
          { label: "Detail kehadiran" },
        ];
      }
      return [{ label: "Absensi" }];
    }
    if (path.startsWith("/mahasiswa/notifikasi")) {
      return [{ label: "Notifikasi" }];
    }
    if (path.startsWith("/mahasiswa/profil")) {
      return [{ label: "Profil & keamanan" }];
    }
    if (path.startsWith("/mahasiswa/bantuan")) {
      return [{ label: "Pusat bantuan" }];
    }

    return [{ label: "Dashboard" }];
  };

  const breadcrumbs = getBreadcrumbs();

  const handleLogout = () => {
    setDropdownOpen(false);
    // Nanti tambahkan pembersihan token/localStorage di sini
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-sm lg:px-8">
      {/* Kiri: Tombol Menu Mobile + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12px]">
          <Link
            to="/mahasiswa/dashboard"
            className="text-slate-400 transition hover:text-indigo-600"
          >
            Ruang Mahasiswa
          </Link>

          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                <span className="text-slate-300">/</span>
                {crumb.path && !isLast ? (
                  <Link
                    to={crumb.path}
                    className="text-slate-400 transition hover:text-indigo-600"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-700">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Kanan: Tanggal, Notifikasi, Profil User + Dropdown */}
      <div className="flex items-center gap-4 sm:gap-5">
        <span className="hidden text-[11px] text-slate-400 md:inline">
          Sabtu, 24 Oktober 2026
        </span>

        <Link
          to="/mahasiswa/notifikasi"
          aria-label="Notifikasi"
          className="relative rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        </Link>

        <div className="h-5 w-px bg-slate-200" />

        {/* Area Profil & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-xl p-1 transition hover:bg-slate-50 focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-600">
              NR
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-[12px] font-semibold leading-tight text-slate-700">
                Nadia Rahma
              </p>
              <p className="text-[10px] text-slate-400">Mahasiswa</p>
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180 text-indigo-600" : ""
              }`}
            />
          </button>

          {/* Menu Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-60 origin-top-right rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-lg shadow-slate-200/50">
              {/* Info Akun Singkat */}
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="text-[12px] font-bold text-slate-800">
                  Nadia Rahma
                </p>
                <p className="mt-0.5 truncate text-[10px] text-slate-400">
                  231011024 · TI-3A
                </p>
              </div>

              {/* Menu Navigasi */}
              <div className="py-1">
                <Link
                  to="/mahasiswa/profil"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-medium text-slate-600 transition hover:bg-indigo-50/70 hover:text-indigo-600"
                >
                  <User size={15} />
                  <span>Profil &amp; keamanan</span>
                </Link>

                <Link
                  to="/mahasiswa/notifikasi"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-[12px] font-medium text-slate-600 transition hover:bg-indigo-50/70 hover:text-indigo-600"
                >
                  <div className="flex items-center gap-2.5">
                    <Bell size={15} />
                    <span>Notifikasi</span>
                  </div>
                  <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600">
                    4
                  </span>
                </Link>

                <Link
                  to="/mahasiswa/bantuan"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-medium text-slate-600 transition hover:bg-indigo-50/70 hover:text-indigo-600"
                >
                  <HelpCircle size={15} />
                  <span>Pusat bantuan</span>
                </Link>
              </div>

              {/* Tombol Keluar */}
              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  <LogOut size={15} />
                  <span>Keluar dari akun</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}