import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarDosen from "../components/SidebarDosen";
import NavbarDosen from "../components/NavbarDosen";

export default function DosenLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pertemuanAktif, setPertemuanAktif] = useState(7);
  const totalPertemuan = 16;
  const [systemDate] = useState(() => "Jumat, 13 November 2026");

  const location = useLocation();

  // Menentukan menu sidebar yang aktif secara otomatis berdasarkan URL
  let activePage = "dashboard";
  if (location.pathname.includes("/absensi")) activePage = "absensi";
  else if (location.pathname.includes("/tugas")) activePage = "tugas";
  else if (location.pathname.includes("/kuis")) activePage = "kuis";
  else if (location.pathname.includes("/materi")) activePage = "materi";
  else if (location.pathname.includes("/notifikasi")) activePage = "notifikasi";
  else if (location.pathname.includes("/profil")) activePage = "profil";
  else if (location.pathname.includes("/bantuan")) activePage = "bantuan";

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 flex">
      {/* Sidebar Dosen di sebelah kiri */}
      <SidebarDosen 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        activePage={activePage}
        currentPertemuan={pertemuanAktif}
        totalPertemuan={totalPertemuan}
        onPertemuanChange={setPertemuanAktif}
      />

      {/* Wrapper Utama di sebelah kanan sidebar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Dosen (posisi paling atas tanpa celah kosong) */}
        <NavbarDosen 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          currentDate={systemDate}
          user={{ name: "Dr. Maya Putri", role: "Dosen", initials: "MP" }}
        />

        {/* Halaman Konten Dinamis */}
        <main className="flex-1 px-6 py-7 lg:px-8">
                  <div className="mx-auto max-w-[1200px]">
                    <Outlet />
                  </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/70 bg-transparent px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>© 2026 NugasYuk • Universitas Cakrawala</span>
            <span>Semester ganjil 2026/2027</span>
          </div>
        </footer>
      </div>
    </div>
  );
}