import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardDosen from "./pages/DashboardDosen";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-[#f8f9fa]">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboarddosen" replace />} />

          <Route path="/dashboarddosen" element={<DashboardDosen />} />

          <Route path="/dashboard-dosen" element={<DashboardDosen />} />
          <Route path="/dashboard" element={<DashboardDosen />} />

          <Route path="*" element={<Navigate to="/dashboarddosen" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
