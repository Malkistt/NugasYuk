import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { getSystemDateIndonesian } from "../utils/dateHelper";

const NavbarDosen = ({ breadcrumbs = ["Ruang Dosen", "Dashboard"], onToggleSidebar, user, currentDate }) => {
  const navigate = useNavigate();
  const [systemDate] = useState(() => currentDate || getSystemDateIndonesian());

  const handleBreadcrumbClick = (crumb, idx) => {
    if (idx === 0) {
      navigate("/dashboarddosen");
    } else if (crumb.toLowerCase().includes("tugas")) {
      navigate("/tugas");
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
      <div className="flex items-center gap-3 sm:gap-5">
        <span className="hidden md:inline-block text-xs text-gray-500 font-normal">
          {currentDate || systemDate}
        </span>

        {/* Notification Bell */}
        <button 
          className="relative p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-50 transition-colors cursor-pointer" 
          aria-label="Lihat notifikasi"
        >
          <Bell className="w-4.5 h-4.5 text-gray-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-2.5 sm:gap-3 pl-2 cursor-pointer select-none">
          <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center font-bold text-xs">
            {user?.initials || "MP"}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-gray-900 leading-tight">
              {user?.name || "Dr. Maya Putri"}
            </span>
            <span className="text-[10px] text-gray-400 font-normal">
              {user?.role || "Dosen"}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
        </div>
      </div>
    </header>
  );
};

export default NavbarDosen;
