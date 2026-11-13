import React, { useState, useRef } from 'react';
import SidebarDosen from '../components/SidebarDosen';
import NavbarDosen from '../components/NavbarDosen';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Folder, 
  FileText, 
  Link as LinkIcon, 
  UploadCloud, 
  ChevronDown, 
  Info,
  Check
} from 'lucide-react';
import { getSystemDateIndonesian } from '../utils/dateHelper';

const MateriDosen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pertemuanAktif, setPertemuanAktif] = useState(7);
  const totalPertemuan = 16;
  const [systemDate] = useState(() => getSystemDateIndonesian());

  // Filter State
  const [activeTab, setActiveTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form Tambah Materi State
  const [mataKuliahForm, setMataKuliahForm] = useState('Basis Data — TI-3A');
  const [pertemuanForm, setPertemuanForm] = useState('7 - Normalisasi');
  const [judulMateri, setJudulMateri] = useState('Contoh Kasus Normalisasi');
  const [deskripsiMateri, setDeskripsiMateri] = useState('Latihan tambahan normalisasi dari bentuk 1NF hingga 3NF.');
  const [attachmentType, setAttachmentType] = useState('drive'); // 'drive' or 'upload'
  const [driveUrl, setDriveUrl] = useState('drive.google.com/drive/folders/...');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  // Data Pustaka Materi
  const [materiList, setMateriList] = useState([
    {
      id: 1,
      mkCode: 'IF203',
      mkName: 'IF203 · Basis Data — TI-3A',
      pertemuan: 'Pertemuan 7 · Normalisasi',
      judul: 'Normalisasi 1NF–3NF',
      tipe: 'drive',
      meta: 'Google Drive • Tautan folder • Dapat diakses mahasiswa',
      subtext: '23 Okt 2026 • Ditambahkan Dr. Maya Putri'
    },
    {
      id: 2,
      mkCode: 'IF203',
      mkName: 'IF203 · Basis Data — TI-3A',
      pertemuan: 'Pertemuan 6 · Query SQL',
      judul: 'Modul Latihan Query SQL.pdf',
      tipe: 'pdf',
      meta: 'PDF • 1,8 MB',
      subtext: '19 Okt 2026 • PDF • 1,8 MB'
    },
    {
      id: 3,
      mkCode: 'IF203',
      mkName: 'IF203 · Basis Data — TI-3A',
      pertemuan: 'Pertemuan 5 · Perancangan basis data',
      judul: 'Panduan Perancangan ERD.pdf',
      tipe: 'pdf',
      meta: 'PDF • 2,4 MB',
      subtext: '12 Okt 2026 • PDF • 2,4 MB'
    },
    {
      id: 4,
      mkCode: 'IF205',
      mkName: 'IF205 · Pemrograman Web — TI-3A',
      pertemuan: 'Pertemuan 6 · Desain responsif',
      judul: 'CSS Flexbox & Grid',
      tipe: 'drive',
      meta: 'Google Drive • Tautan presentasi',
      subtext: '22 Okt 2026 • Ditambahkan Dr. Maya Putri'
    }
  ]);

  const handlePublish = (e) => {
    e.preventDefault();
    if (!judulMateri) return;

    const newMateri = {
      id: Date.now(),
      mkCode: mataKuliahForm.includes('Basis Data') ? 'IF203' : 'IF205',
      mkName: mataKuliahForm.includes('Basis Data') ? 'IF203 · Basis Data — TI-3A' : 'IF205 · Pemrograman Web — TI-3A',
      pertemuan: `Pertemuan ${pertemuanForm}`,
      judul: judulMateri,
      tipe: attachmentType === 'drive' ? 'drive' : 'pdf',
      meta: attachmentType === 'drive' ? 'Google Drive • Tautan materi' : 'PDF • Dokumen baru',
      subtext: `Hari ini • Ditambahkan Dr. Maya Putri`
    };

    setMateriList(prev => [newMateri, ...prev]);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setJudulMateri('');
      setDeskripsiMateri('');
    }, 1500);
  };

  const handleDeleteMateri = (id, judul) => {
    if (window.confirm(`Hapus materi "${judul}"?`)) {
      setMateriList(prev => prev.filter(m => m.id !== id));
    }
  };

  const filteredMateri = materiList.filter(m => {
    const matchTab = 
      activeTab === 'semua' ? true :
      activeTab === 'basisdata' ? m.mkCode === 'IF203' :
      activeTab === 'web' ? m.mkCode === 'IF205' : true;
    
    const matchSearch = m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.pertemuan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  // Kelompokkan materi berdasarkan mata kuliah
  const groupedMateri = filteredMateri.reduce((acc, item) => {
    if (!acc[item.mkName]) acc[item.mkName] = [];
    acc[item.mkName].push(item);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa] text-gray-800 antialiased font-sans">
      {/* Sidebar Dosen */}
      <SidebarDosen 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activePage="materi"
        currentPertemuan={pertemuanAktif}
        totalPertemuan={totalPertemuan}
        onPertemuanChange={setPertemuanAktif}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 w-full min-h-screen">
        {/* Top Navbar */}
        <NavbarDosen 
          onToggleSidebar={() => setIsSidebarOpen(true)}
          breadcrumbs={['Ruang Dosen', 'Materi']} 
          currentDate={systemDate}
          user={{ name: 'Dr. Maya Putri', role: 'Dosen', initials: 'MP' }}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
                Kelola materi
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Bagikan bahan belajar yang terstruktur untuk setiap pertemuan.
              </p>
            </div>

            <button 
              type="button"
              onClick={() => {
                setJudulMateri('');
                setDeskripsiMateri('');
              }}
              className="inline-flex items-center justify-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah materi</span>
            </button>
          </div>

          {/* Grid Layout 2 Kolom: Kiri (Pustaka Materi) vs Kanan (Form Tambah Materi) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Kolom Kiri: Pustaka Materi */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Pustaka materi</h2>
                  <p className="text-xs text-gray-400 mt-0.5">4 materi · 2 mata kuliah</p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari judul materi..."
                      className="w-full bg-white border border-gray-200/90 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button type="button" className="flex items-center gap-1.5 bg-white border border-gray-200/90 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                      <span>Semua mata kuliah</span>
                    </button>
                    <button type="button" className="flex items-center gap-1.5 bg-white border border-gray-200/90 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50">
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                      <span>Terbaru</span>
                    </button>
                  </div>
                </div>

                {/* Tabs Filter */}
                <div className="flex items-center gap-6 border-b border-gray-100 text-xs pt-1">
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('semua')}
                    className={`pb-2.5 cursor-pointer font-medium transition-all ${
                      activeTab === 'semua'
                        ? 'border-b-2 border-[#4F46E5] text-[#4F46E5] font-semibold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Semua materi (4)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('basisdata')}
                    className={`pb-2.5 cursor-pointer font-medium transition-all ${
                      activeTab === 'basisdata'
                        ? 'border-b-2 border-[#4F46E5] text-[#4F46E5] font-semibold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Basis Data (3)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('web')}
                    className={`pb-2.5 cursor-pointer font-medium transition-all ${
                      activeTab === 'web'
                        ? 'border-b-2 border-[#4F46E5] text-[#4F46E5] font-semibold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Pemrograman Web (1)
                  </button>
                </div>

                {/* Daftar Materi Dikelompokkan per Mata Kuliah */}
                <div className="space-y-6 pt-2">
                  {Object.keys(groupedMateri).map((mkName, idx) => (
                    <div key={idx} className="space-y-3">
                      {/* Sub-header Mata Kuliah */}
                      <div className="flex items-center justify-between text-xs font-bold text-gray-900 pb-1 border-b border-gray-50">
                        <span>{mkName}</span>
                        <span className="text-gray-400 font-normal text-[11px]">
                          {groupedMateri[mkName].length} materi
                        </span>
                      </div>

                      {/* Item Materi */}
                      <div className="space-y-2.5">
                        {groupedMateri[mkName].map((item) => (
                          <div key={item.id} className="space-y-1">
                            <p className="text-[10px] font-semibold text-gray-400">
                              {item.pertemuan}
                            </p>

                            <div className="p-3.5 bg-[#f8f9fa] border border-gray-100 hover:border-gray-200 rounded-xl flex items-center justify-between transition-all group">
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="p-2 bg-[#EEF2FF] text-[#4F46E5] rounded-lg shrink-0">
                                  {item.tipe === 'drive' ? (
                                    <Folder className="w-4 h-4" />
                                  ) : (
                                    <FileText className="w-4 h-4" />
                                  )}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-gray-900 group-hover:text-[#4F46E5] transition-colors truncate">
                                    {item.judul}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-0.5 truncate">{item.meta}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-xs font-semibold text-[#4F46E5] shrink-0 pl-3">
                                <button type="button" className="hover:underline cursor-pointer">Buka</button>
                                <span className="text-gray-300">·</span>
                                <button type="button" className="hover:underline cursor-pointer">Edit</button>
                                <span className="text-gray-300">·</span>
                                <button 
                                  type="button" 
                                  onClick={() => handleDeleteMateri(item.id, item.judul)}
                                  className="text-gray-400 hover:text-red-600 hover:underline cursor-pointer"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>

                            <p className="text-[9px] text-gray-400 pl-1">
                              {item.subtext}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Kolom Kanan: Form Tambah Materi */}
            <div className="lg:col-span-5 space-y-4">
              <form onSubmit={handlePublish} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Tambah materi</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Materi baru akan terlihat di kelas terpilih.</p>
                </div>

                {/* Mata Kuliah */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Mata kuliah <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={mataKuliahForm}
                      onChange={(e) => setMataKuliahForm(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                    >
                      <option value="Basis Data — TI-3A">Basis Data — TI-3A</option>
                      <option value="Pemrograman Web — TI-3A">Pemrograman Web — TI-3A</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Pertemuan */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Pertemuan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={pertemuanForm}
                      onChange={(e) => setPertemuanForm(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-200/90 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                    >
                      <option value="7 - Normalisasi">7 - Normalisasi</option>
                      <option value="6 - Query SQL">6 - Query SQL</option>
                      <option value="5 - Perancangan ERD">5 - Perancangan ERD</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Judul Materi */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">
                    Judul materi <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    value={judulMateri}
                    onChange={(e) => setJudulMateri(e.target.value)}
                    placeholder="Contoh: Kasus Normalisasi"
                    required
                    className="w-full bg-white border border-gray-200/90 rounded-xl px-4 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                  />
                </div>

                {/* Deskripsi Singkat */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Deskripsi singkat</label>
                  <textarea 
                    rows={3}
                    value={deskripsiMateri}
                    onChange={(e) => setDeskripsiMateri(e.target.value)}
                    placeholder="Tuliskan ringkasan materi..."
                    className="w-full bg-white border border-gray-200/90 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] resize-y"
                  />
                </div>

                {/* Tabs Upload Berkas / Google Drive */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-6 border-b border-gray-100 text-xs">
                    <button 
                      type="button" 
                      onClick={() => setAttachmentType('upload')}
                      className={`pb-2 cursor-pointer font-medium transition-all ${
                        attachmentType === 'upload'
                          ? 'border-b-2 border-[#4F46E5] text-[#4F46E5] font-semibold'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Upload berkas
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setAttachmentType('drive')}
                      className={`pb-2 cursor-pointer font-medium transition-all ${
                        attachmentType === 'drive'
                          ? 'border-b-2 border-[#4F46E5] text-[#4F46E5] font-semibold'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Google Drive
                    </button>
                  </div>

                  {attachmentType === 'drive' ? (
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-semibold text-gray-700">
                        Tautan Google Drive <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={driveUrl}
                          onChange={(e) => setDriveUrl(e.target.value)}
                          placeholder="drive.google.com/..."
                          required
                          className="w-full bg-white border border-gray-200/90 rounded-xl pl-4 pr-10 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                        />
                        <LinkIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                        className="hidden" 
                      />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#E0E7FF] bg-[#f8f9fa] rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50"
                      >
                        <UploadCloud className="w-5 h-5 text-[#4F46E5] mx-auto mb-1" />
                        <p className="text-xs font-semibold text-[#4F46E5]">
                          {uploadedFile ? uploadedFile.name : 'Pilih berkas dari komputer'}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">PDF, PPTX, atau DOCX (maks. 20 MB)</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Box Peringatan Tautan */}
                <div className="bg-[#EEF2FF]/60 border border-[#E0E7FF] rounded-xl p-3 flex items-start gap-2.5 text-xs leading-relaxed">
                  <Info className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">Pastikan akses tautan sudah diatur.</p>
                    <p className="text-gray-500 mt-0.5">
                      Pilih "Siapa saja yang memiliki link" sebagai pelihat agar mahasiswa dapat membuka materi.
                    </p>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400">
                  Atau pilih tab Upload berkas untuk menambahkan PDF, PPTX, atau DOCX (maks. 20 MB).
                </p>

                {/* Tombol Terbitkan & Batalkan */}
                <div className="space-y-2 pt-2">
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {isSubmitted ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Materi berhasil diterbitkan!</span>
                      </>
                    ) : (
                      <span>Terbitkan materi</span>
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setJudulMateri(''); setDeskripsiMateri(''); }}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Batalkan
                  </button>
                </div>
              </form>
            </div>

          </div>

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

export default MateriDosen;
