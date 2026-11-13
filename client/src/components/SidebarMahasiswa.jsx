import React from "react";
import { NavLink } from "react-router-dom";
import {
  BookOpen,
  LayoutGrid,
  ClipboardList,
  ListChecks,
  FolderOpen,
  CalendarCheck,
  Bell,
  User,
  HelpCircle,
} from "lucide-react";

export default function SidebarMahasiswa() {
  const mainMenus = [
    { name: "Dashboard", path: "/mahasiswa/dashboard", icon: LayoutGrid },
    { name: "Tugas", path: "/mahasiswa/tugas", icon: ClipboardList },
    { name: "Kuis", path: "/mahasiswa/kuis", icon: ListChecks },
    { name: "Materi", path: "/mahasiswa/materi", icon: FolderOpen },
    { name: "Absensi", path: "/mahasiswa/absensi", icon: CalendarCheck },
  ];

  const personalMenus = [
    { name: "Notifikasi", path: "/mahasiswa/notifikasi", icon: Bell, badge: 4 },
    { name: "Profil & keamanan", path: "/mahasiswa/profil", icon: User },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] flex-col border-r border-slate-200/80 bg-white lg:flex">
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5 px-6 pt-6 pb-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
          <BookOpen size={18} strokeWidth={2.2} />
        </span>
        <span className="text-[17px] font-bold tracking-tight text-slate-800">
          ruangkuliah
        </span>
      </div>

      {/* Info Fakultas & Role */}
      <div className="mx-4 mb-5 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
          FAKULTAS INFORMATIKA
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Universitas Cakrawala
        </p>
        <span className="mt-2.5 inline-block rounded-md bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-600">
          Ruang Mahasiswa
        </span>
      </div>

      {/* Navigasi Menu Utama */}
      <div className="flex-1 space-y-6 overflow-y-auto px-4">
        <div>
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            PERKULIAHAN
          </p>
          <nav className="space-y-1">
            {mainMenus.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-medium transition ${
                      isActive
                        ? "bg-indigo-50/90 font-semibold text-indigo-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={17} strokeWidth={2} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Navigasi Menu Personal */}
        <div>
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            PERSONAL
          </p>
          <nav className="space-y-1">
            {personalMenus.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-lg px-3 py-2.5 text-[12px] font-medium transition ${
                      isActive
                        ? "bg-indigo-50/90 font-semibold text-indigo-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} strokeWidth={2} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-md bg-indigo-100 px-1.5 text-[10px] font-bold text-indigo-600">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Sidebar: Progress Semester & Pusat Bantuan */}
      <div className="space-y-3 p-4">
        <div className="rounded-xl bg-indigo-50/70 p-3.5">
          <p className="text-[11px] font-bold text-indigo-600">
            Ganjil 2026/2027
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            Pertemuan 7 dari 16
          </p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-indigo-100">
            <div
              className="h-full rounded-full bg-indigo-600"
              style={{ width: `${(7 / 16) * 100}%` }}
            />
          </div>
        </div>

        <NavLink
          to="/mahasiswa/bantuan"
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[11px] font-medium transition ${
              isActive
                ? "bg-indigo-50/90 font-semibold text-indigo-600"
                : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
            }`
          }
        >
          <HelpCircle size={15} />
          <span>Pusat bantuan</span>
        </NavLink>
      </div>
    </aside>
  );
}