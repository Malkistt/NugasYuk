import React, { useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import SidebarDosen from '../components/SidebarDosen';
import NavbarDosen from '../components/NavbarDosen';
import { 
  ChevronDown, 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon, 
  Calendar, 
  Clock, 
  UploadCloud, 
  FileText, 
  Users, 
  AlertCircle, 
  Info,
  Check
} from 'lucide-react';
import { getSystemDateIndonesian } from '../utils/dateHelper';

const FormTugasDosen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Mode: jika URL mengandung "/edit" maka mode edit (prefilled), jika "/buat" maka mode buat tugas (isinya kosong)
  const isEditMode = location.pathname.includes('/edit') || Boolean(id);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pertemuanAktif, setPertemuanAktif] = useState(7);
  const totalPertemuan = 16;
  const [systemDate] = useState(() => getSystemDateIndonesian());

  // Form State: Jika buat tugas, isinya KOSONG sesuai permintaan user. Jika edit, berisi data prefilled.
  const [mataKuliah, setMataKuliah] = useState(
    isEditMode ? 'IF203 · Basis Data — TI-3A' : ''
  );
  const [judulTugas, setJudulTugas] = useState(
    isEditMode ? 'Perancangan ERD' : ''
  );
  const [deskripsiTugas, setDeskripsiTugas] = useState(
    isEditMode 
      ? `Rancang ERD untuk sistem perpustakaan digital.\n\n1. Identifikasi minimal 5 entitas beserta atributnya.\n2. Tentukan primary key, foreign key, dan kardinalitas.\n3. Jelaskan relasi dan asumsi desain Anda.\n\nKumpulkan diagram dan penjelasan dalam satu berkas PDF. Gunakan format nama: NIM_Nama_ERD.pdf.`
      : ''
  );
  const [tanggalDeadline, setTanggalDeadline] = useState(
    isEditMode ? '26 Oktober 2026' : ''
  );
  const [jamDeadline, setJamDeadline] = useState(
    isEditMode ? '23.59 WIB' : ''
  );
  const [nilaiMaksimal, setNilaiMaksimal] = useState(
    isEditMode ? '100' : '100'
  );
  const [files, setFiles] = useState(
    isEditMode ? [
      { name: 'Panduan_Perancangan_ERD.pdf', size: '2,4 MB', type: 'PDF' }
    ] : []
  );

  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);

  // Handle Drag & Drop or Click Upload
  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (uploadedFiles.length > 0) {
      const newFiles = uploadedFiles.map(file => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE'
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      navigate('/tugas');
    }, 800);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa] text-gray-800 antialiased font-sans">
      {/* Sidebar Dosen */}
      <SidebarDosen 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activePage="tugas"
        currentPertemuan={pertemuanAktif}
        totalPertemuan={totalPertemuan}
        onPertemuanChange={setPertemuanAktif}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 w-full min-h-screen">
        {/* Top Navbar */}
        <NavbarDosen 
          onToggleSidebar={() => setIsSidebarOpen(true)}
          breadcrumbs={['Ruang Dosen', 'Tugas']} 
          currentDate={systemDate}
          user={{ name: 'Dr. Maya Putri', role: 'Dosen', initials: 'MP' }}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
                {isEditMode ? 'Edit tugas' : 'Buat tugas'}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {isEditMode ? 'Tugas / Perancangan ERD / Edit' : 'Tugas / Buat tugas baru'}
              </p>
            </div>

            {/* Badge Status */}
            {isEditMode ? (
              <span className="self-start sm:self-auto inline-flex items-center px-3 py-1 bg-[#EAF8F1] text-[#10B981] text-xs font-semibold rounded-full">
                Aktif · 24 pengumpulan
              </span>
            ) : (
              <span className="self-start sm:self-auto inline-flex items-center px-3 py-1 bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold rounded-full">
                Draf baru
              </span>
            )}
          </div>

          {/* Form Layout 2 Kolom */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Kolom Kiri: Informasi Tugas & Lampiran */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Card 1: Informasi Tugas */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Informasi tugas</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Detail ini akan ditampilkan kepada mahasiswa.</p>
                </div>

                {/* Field Mata Kuliah */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Mata kuliah <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={mataKuliah}
                      onChange={(e) => setMataKuliah(e.target.value)}
                      required
                      className="w-full appearance-none bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] transition-colors cursor-pointer"
                    >
                      <option value="" disabled>Pilih mata kuliah...</option>
                      <option value="IF203 · Basis Data — TI-3A">IF203 · Basis Data — TI-3A</option>
                      <option value="IF205 · Pemrograman Web — TI-3A">IF205 · Pemrograman Web — TI-3A</option>
                      <option value="IF301 · Kecerdasan Buatan — TI-5B">IF301 · Kecerdasan Buatan — TI-5B</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Field Judul Tugas */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Judul tugas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={judulTugas}
                    onChange={(e) => setJudulTugas(e.target.value)}
                    placeholder="Contoh: Perancangan ERD"
                    required
                    className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5] transition-colors"
                  />
                </div>

                {/* Field Deskripsi Tugas dengan Toolbar */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Deskripsi tugas <span className="text-red-500">*</span>
                  </label>

                  {/* Toolbar mini */}
                  <div className="flex items-center gap-1 p-1 bg-gray-50 border border-gray-200/90 rounded-t-xl text-gray-500">
                    <button type="button" className="p-1.5 rounded hover:bg-white hover:text-gray-900 transition-colors" title="Tebal">
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1.5 rounded hover:bg-white hover:text-gray-900 transition-colors" title="Miring">
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1.5 rounded hover:bg-white hover:text-gray-900 transition-colors" title="Daftar Poin">
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1.5 rounded hover:bg-white hover:text-gray-900 transition-colors" title="Tautan">
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="border border-t-0 border-gray-200/90 rounded-b-xl p-3 bg-white space-y-2">
                    <p className="text-[11px] font-semibold text-gray-400">Instruksi pengerjaan</p>
                    <textarea
                      value={deskripsiTugas}
                      onChange={(e) => setDeskripsiTugas(e.target.value)}
                      rows={7}
                      placeholder="Tuliskan instruksi dan rincian pengerjaan tugas di sini..."
                      required
                      className="w-full resize-y text-xs text-gray-800 placeholder-gray-400 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Row: Tanggal Deadline & Jam Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tanggal Deadline */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Tanggal deadline <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={tanggalDeadline}
                        onChange={(e) => setTanggalDeadline(e.target.value)}
                        placeholder="Contoh: 26 Oktober 2026"
                        required
                        className="w-full bg-white border border-gray-200/90 rounded-xl pl-4 pr-10 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5] transition-colors"
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Jam Deadline */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Jam deadline <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={jamDeadline}
                        onChange={(e) => setJamDeadline(e.target.value)}
                        placeholder="Contoh: 23.59 WIB"
                        required
                        className="w-full bg-white border border-gray-200/90 rounded-xl pl-4 pr-10 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5] transition-colors"
                      />
                      <Clock className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Card 2: Lampiran Tugas */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Lampiran tugas</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Tambahkan panduan atau berkas pendukung.</p>
                </div>

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  multiple 
                  className="hidden" 
                />

                {/* Dropzone Upload Box */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#E0E7FF] bg-[#f8f9fa] hover:bg-[#EEF2FF]/40 rounded-2xl p-6 text-center transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white shadow-2xs flex items-center justify-center text-[#4F46E5] mb-2.5">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-[#4F46E5]">
                      Klik untuk unggah atau tarik berkas ke sini
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      PDF, DOCX, PNG • Maksimal 20 MB per berkas
                    </p>
                  </div>
                </div>

                {/* List Berkas Terlampir */}
                {files.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {files.map((file, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-3.5 bg-[#f8f9fa] border border-gray-100 rounded-xl"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="p-2 bg-[#EEF2FF] text-[#4F46E5] rounded-lg shrink-0">
                            <FileText className="w-4 h-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{file.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{file.type} • {file.size}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-semibold text-[#4F46E5] shrink-0">
                          <button type="button" className="hover:underline cursor-pointer">Buka</button>
                          <span className="text-gray-300">·</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveFile(idx)}
                            className="text-gray-400 hover:text-red-600 hover:underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Kolom Kanan: Pengaturan Tugas, Info Box & Aksi */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Card 1: Pengaturan Tugas */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <h2 className="text-sm font-bold text-gray-900">Pengaturan tugas</h2>

                {/* Kelas Peserta */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Kelas peserta</label>
                  <div className="flex items-center justify-between bg-[#f8f9fa] border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs text-gray-700">
                    <span className="font-medium">TI-3A · 32 mahasiswa</span>
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Nilai Maksimal */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Nilai maksimal</label>
                  <input
                    type="number"
                    value={nilaiMaksimal}
                    onChange={(e) => setNilaiMaksimal(e.target.value)}
                    placeholder="100"
                    className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>

                {/* Status Visibilitas */}
                <div className="pt-2">
                  <span className="inline-block px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EAF8F1] text-[#10B981]">
                    {isEditMode ? 'Terlihat oleh mahasiswa' : 'Siap diterbitkan'}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-2.5 leading-relaxed">
                    {isEditMode 
                      ? 'Dibuat 19 Oktober 2026 oleh Dr. Maya Putri, M.Kom.' 
                      : 'Akan diterbitkan oleh Dr. Maya Putri, M.Kom.'}
                  </p>
                </div>
              </div>

              {/* Card 2: Box Pemberitahuan / Peringatan */}
              {isEditMode ? (
                <div className="bg-[#FEF3C7]/60 border border-[#FDE68A] rounded-2xl p-4 flex items-start gap-3 shadow-xs">
                  <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <p className="font-bold text-[#92400E]">Sudah ada 24 pengumpulan.</p>
                    <p className="text-[#B45309] mt-0.5">
                      Perubahan instruksi dan deadline akan diinformasikan kepada seluruh mahasiswa.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#EEF2FF]/60 border border-[#E0E7FF] rounded-2xl p-4 flex items-start gap-3 shadow-xs">
                  <Info className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <p className="font-bold text-gray-900">Publikasi tugas baru</p>
                    <p className="text-gray-500 mt-0.5">
                      Mahasiswa di kelas yang dipilih akan langsung menerima notifikasi tugas ini.
                    </p>
                  </div>
                </div>
              )}

              {/* Card 3: Tombol Aksi Simpan / Buat */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
                <h2 className="text-sm font-bold text-gray-900 mb-2">
                  {isEditMode ? 'Simpan perubahan' : 'Aksi tugas'}
                </h2>

                <button
                  type="submit"
                  disabled={isSaved}
                  className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isEditMode ? 'Tersimpan!' : 'Tugas dibuat!'}</span>
                    </>
                  ) : (
                    <span>{isEditMode ? 'Simpan perubahan' : 'Buat tugas'}</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/tugas')}
                  className="w-full flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Batalkan
                </button>
              </div>

            </div>

          </form>

          {/* Footer Bagian Bawah */}
          <footer className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 border-t border-transparent">
            <p>© 2026 NugasYuk • Universitas Cakrawala</p>
            <p>Semester ganjil 2026/2027</p>
          </footer>

        </main>
      </div>
    </div>
  );
};

export default FormTugasDosen;
