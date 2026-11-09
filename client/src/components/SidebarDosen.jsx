import React from "react";
import { LayoutGrid, FileText, CheckSquare, FolderOpen, UserCheck, Bell, ShieldCheck, HelpCircle, GraduationCap, X } from "lucide-react";

const SidebarDosen = ({ activePage = "dashboard", isOpen = false, onClose = () => {}, currentPertemuan = 7, totalPertemuan = 16, onPertemuanChange, semesterText = "Ganjil 2026/2027" }) => {
  const mainNav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "tugas", label: "Tugas", icon: FileText },
    { id: "kuis", label: "Kuis", icon: CheckSquare },
    { id: "materi", label: "Materi", icon: FolderOpen },
    { id: "absensi", label: "Absensi", icon: UserCheck },
  ];

  const personalNav = [
    { id: "notifikasi", label: "Notifikasi", icon: Bell, badge: 4 },
    { id: "profil", label: "Profil & keamanan", icon: ShieldCheck },
  ];

  // Hitung persentase progres indikator pertemuan
  const validTotal = Math.max(1, totalPertemuan);
  const clampedPertemuan = Math.min(validTotal, Math.max(1, currentPertemuan));
  const progressPercentage = Math.min(100, Math.max(0, (clampedPertemuan / validTotal) * 100));

  return (
    <>
      {/* Overlay Backdrop for Mobile */}
      {isOpen && <div className="lg:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-xs transition-opacity" onClick={onClose} aria-hidden="true" />}

      {/* Main Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          w-64 h-screen bg-white border-r border-gray-100/90
          flex flex-col justify-between p-5
          transition-transform duration-300 ease-in-out shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Logo & Close Button for Mobile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-4.5 h-4.5" />
              </div>
              <span className="text-[19px] font-bold tracking-tight text-gray-900">NugasYuk</span>
            </div>
            <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100" aria-label="Tutup menu">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Info Fakultas */}
          <div className="bg-[#f8f9fa] border border-gray-100 rounded-xl p-3.5">
            <p className="text-[10px] font-bold text-gray-900 tracking-wider uppercase">FAKULTAS SAINS DAN TEKNOLOGI</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Universitas Islam Negeri Sunan Gunung Djati Bandung</p>
            <span className="inline-block mt-2.5 px-2.5 py-1 text-[11px] font-medium text-[#4F46E5] bg-[#EEF2FF] rounded-md">Ruang Dosen</span>
          </div>

          {/* Menu Perkuliahan */}
          <div>
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">PERKULIAHAN</p>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${isActive ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#4F46E5]" : "text-gray-400"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Menu Personal */}
          <div>
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">PERSONAL</p>
            <nav className="space-y-1">
              {personalNav.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && <span className="bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Sidebar (Indikator Proses Pertemuan Semester & Bantuan) */}
        <div className="pt-4 border-t border-gray-100/80 space-y-3">
          <div className="bg-[#EEF2FF]/60 border border-[#E0E7FF]/70 rounded-2xl p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-900">{semesterText}</p>
              <span className="text-[10px] font-bold text-[#4F46E5] bg-white px-2 py-0.5 rounded-full border border-[#E0E7FF]">{Math.round(progressPercentage)}%</span>
            </div>

            <div className="flex items-center justify-between mt-1.5">
              <p className="text-[11px] text-gray-600">
                Pertemuan <span className="font-bold text-[#4F46E5]">{clampedPertemuan}</span> dari {validTotal}
              </p>

              {/* Kontrol Penyesuaian Pertemuan (1 sampai 16) */}
              {onPertemuanChange && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onPertemuanChange(Math.max(1, clampedPertemuan - 1))}
                    disabled={clampedPertemuan <= 1}
                    className="w-5 h-5 flex items-center justify-center rounded bg-white border border-[#E0E7FF] text-gray-600 hover:bg-gray-50 hover:text-[#4F46E5] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-colors cursor-pointer"
                    title="Kurangi pertemuan (-1)"
                    aria-label="Kurangi pertemuan"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => onPertemuanChange(Math.min(validTotal, clampedPertemuan + 1))}
                    disabled={clampedPertemuan >= validTotal}
                    className="w-5 h-5 flex items-center justify-center rounded bg-white border border-[#E0E7FF] text-gray-600 hover:bg-gray-50 hover:text-[#4F46E5] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold transition-colors cursor-pointer"
                    title="Tambah pertemuan (+1)"
                    aria-label="Tambah pertemuan"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {/* Progress Bar Dinamis */}
            <div className="w-full bg-[#E0E7FF] h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-[#4F46E5] h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>

          <button className="w-full flex items-center gap-2.5 text-xs text-gray-500 hover:text-gray-800 px-1 py-1 transition-colors">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <span>Pusat bantuan</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarDosen;
