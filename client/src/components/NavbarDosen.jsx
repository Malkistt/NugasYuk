import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  ChevronDown, 
  Menu, 
  User, 
  HelpCircle, 
  LogOut,
  ChevronUp
} from "lucide-react";
import { getSystemDateIndonesian } from "../utils/dateHelper";
const NavbarDosen = ({ breadcrumbs = ["Ruang Dosen", "Dashboard"], onToggleSidebar, user, currentDate }) => {
  const navigate = useNavigate();
  const [systemDate] = useState(() => currentDate || getSystemDateIndonesian());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleBreadcrumbClick = (crumb, idx) => {
    if (idx === 0) {
      navigate("/dashboarddosen");
    } else if (crumb.toLowerCase().includes("tugas")) {
      navigate("/tugas");
    } else if (crumb.toLowerCase().includes("kuis")) {
      navigate("/kuis");
    } else if (crumb.toLowerCase().includes("materi")) {
      navigate("/materi");
    } else if (crumb.toLowerCase().includes("absensi")) {
      navigate("/absensi");
    } else if (crumb.toLowerCase().includes("bantuan")) {
      navigate("/dosen/bantuan");
    } else if (crumb.toLowerCase().includes("notifikasi")) {
      navigate("/dosen/notifikasi");
    } else if (crumb.toLowerCase().includes("profil")) {
      navigate("/dosen/profil");
    } else if (crumb.toLowerCase().includes("dashboard")) {
      navigate("/dashboarddosen");
    }
  };
  return (
    <header className="h-[68px] bg-white border-b border-gray-100/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 w-full shrink-0">
      {/* Left: Mobile Toggle & Breadcrumbs */}
       <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar} 
          className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer" 
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>
        <nav className="flex items-center text-xs font-normal text-gray-400 gap-2">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span 
                onClick={() => handleBreadcrumbClick(crumb, idx)}
                className={idx === breadcrumbs.length - 1 ? "text-gray-800 font-medium" : "hover:text-gray-600 transition-colors cursor-pointer"}
              >
                {crumb}
              </span>
              {idx < breadcrumbs.length - 1 && <span className="text-gray-300">/</span>}
            </React.Fragment>
          ))}
        </nav>
      </div>
      {/* Right: Tanggal Sistem, Notifikasi, Profile */}
      <div className="flex items-center gap-3 sm:gap-5 relative" ref={dropdownRef}>
        <span className="hidden md:inline-block text-xs text-gray-500 font-normal">
          {currentDate || systemDate}
        </span>
        {/* Notification Bell */}
        <button 
          onClick={() => navigate('/dosen/notifikasi')}
          className="relative p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-50 transition-colors cursor-pointer" 
          aria-label="Lihat notifikasi"
        >
          <Bell className="w-4.5 h-4.5 text-gray-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
        {/* Profile Card & Toggle */}
        <div 
          onClick={() => setIsDropdownOpen(prev => !prev)}
          className="flex items-center gap-2.5 sm:gap-3 pl-2 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center font-bold text-xs group-hover:bg-[#E0E7FF] transition-colors">
            {user?.initials || "MP"}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-gray-900 leading-tight group-hover:text-[#4F46E5] transition-colors">
              {user?.name || "Dr. Maya Putri"}
            </span>
            <span className="text-[10px] text-gray-400 font-normal">
              {user?.role || "Dosen"}
            </span>
             </div>
          {isDropdownOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
          )}
        </div>
        {/* Dropdown Menu (Sesuai Gambar 3) */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-gray-100/90 py-3 px-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* Header User */}
            <div className="px-3 py-2">
              <p className="text-xs font-bold text-gray-900">{user?.name || "Dr. Maya Putri"}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">NIDN: 0419108501 · Dosen Informatika</p>
            </div>
            <div className="border-t border-gray-100 my-1.5" />
            {/* Menu Items */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate('/dosen/profil');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer text-left"
              >
                <User className="w-4 h-4 text-gray-400" />
                <span>Profil & keamanan</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate('/dosen/notifikasi');
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-gray-400" />
                  <span>Notifikasi</span>
                </div>
                <span className="bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  4
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  navigate('/dosen/bantuan');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer text-left"
              >
                 <HelpCircle className="w-4 h-4 text-gray-400" />
                <span>Pusat bantuan</span>
              </button>
            </div>
            <div className="border-t border-gray-100 my-1.5" />
            {/* Keluar dari akun */}
            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(false);
                navigate('/login');
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Keluar dari akun</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
export default NavbarDosen;