import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarMahasiswa from "../components/SidebarMahasiswa";
import NavbarMahasiswa from "../components/NavbarMahasiswa";

export default function MahasiswaLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      {/* Sidebar Mahasiswa */}
      <SidebarMahasiswa />

      {/* Area Konten Utama */}
      <div className="flex min-h-screen flex-col lg:pl-[250px]">
        <NavbarMahasiswa
          onOpenMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Halaman Dinamis */}
        <main className="flex-1 px-6 py-7 lg:px-8">
          <div className="mx-auto max-w-[1200px]">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200/70 bg-transparent px-6 py-5 lg:px-8">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-2 text-[11px] text-slate-400 sm:flex-row">
            <span>© 2026 Ruangkuliah • Universitas Cakrawala</span>
            <span>Semester ganjil 2026/2027</span>
          </div>
        </footer>
      </div>
    </div>
  );
}