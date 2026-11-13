import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Folder, 
  FileText, 
  Link as LinkIcon, 
  UploadCloud, 
  ChevronDown, 
  Info,
  Check,
  Bold,
  Italic,
  List
} from 'lucide-react';
import { getSystemDateIndonesian } from '../utils/dateHelper';

// ---------- Editor Teks Sederhana (Bold, Italic, List, Link) ----------
const escapeHtml = (t) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const textToHtml = (t) =>
  t
    .split('\n')
    .map((baris) => `<div>${baris ? escapeHtml(baris) : '<br>'}</div>`)
    .join('');

const BLOCK_TAGS = new Set(['DIV', 'P', 'UL', 'OL', 'LI', 'BLOCKQUOTE']);
const htmlToText = (h) => {
  const d = document.createElement('div');
  d.innerHTML = h;
  return d.textContent || '';
};

const normalizeUrl = (raw) => {
  const v = raw.trim();
  if (!v) return null;
  const withScheme = /^(https?:\/\/|mailto:)/i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withScheme);
    if (!['http:', 'https:', 'mailto:'].includes(u.protocol)) return null;
    if (u.protocol !== 'mailto:' && !u.hostname.includes('.') && u.hostname !== 'localhost') return null;
    return withScheme;
  } catch {
    return null;
  }
};

const RichTextEditor = ({ id, value, onChange, invalid, placeholder }) => {
  const editorRef = useRef(null);
  const urlInputRef = useRef(null);
  const savedRange = useRef(null);

  const [fmt, setFmt] = useState({ bold: false, italic: false, list: false, link: false });
  const [isEmpty, setIsEmpty] = useState(() => !htmlToText(value).trim());
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [needsLinkText, setNeedsLinkText] = useState(false);
  const [linkEditing, setLinkEditing] = useState(false);
  const [linkError, setLinkError] = useState('');

  useLayoutEffect(() => {
    const el = editorRef.current;
    if (el && el.innerHTML !== value && document.activeElement !== el) {
      el.innerHTML = value;
      wrapRootInlines();
      setIsEmpty(!htmlToText(value).trim());
    }
  }, [value]);

  const getRange = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const r = sel.getRangeAt(0);
    return editorRef.current && editorRef.current.contains(r.commonAncestorContainer) ? r : null;
  };

  const anchorOf = (r) => {
    if (!r) return null;
    const n = r.commonAncestorContainer;
    const el = n.nodeType === 1 ? n : n.parentElement;
    const a = el ? el.closest('a') : null;
    return a && editorRef.current.contains(a) ? a : null;
  };

  const updateFmt = () => {
    const r = getRange();
    if (!r) return;
    setFmt({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      list: document.queryCommandState('insertUnorderedList'),
      link: Boolean(anchorOf(r))
    });
  };

  useEffect(() => {
    document.addEventListener('selectionchange', updateFmt);
    return () => document.removeEventListener('selectionchange', updateFmt);
  }, []);

  const wrapRootInlines = () => {
    const el = editorRef.current;
    if (!el) return;
    const sel = window.getSelection();
    const r = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
    const saved = r && el.contains(r.startContainer)
      ? { sc: r.startContainer, so: r.startOffset, ec: r.endContainer, eo: r.endOffset }
      : null;

    let run = [];
    let firstWrapper = null;
    const flush = () => {
      if (!run.length) return;
      const d = document.createElement('div');
      el.insertBefore(d, run[0]);
      run.forEach((n) => d.appendChild(n));
      if (!firstWrapper) firstWrapper = d;
      run = [];
    };
    Array.from(el.childNodes).forEach((n) => {
      if (n.nodeType === 1 && BLOCK_TAGS.has(n.nodeName)) flush();
      else run.push(n);
    });
    flush();

    if (firstWrapper && saved) {
      const nr = document.createRange();
      if (saved.sc === el) {
        nr.setStart(firstWrapper, 0);
        nr.collapse(true);
      } else {
        nr.setStart(saved.sc, saved.so);
        nr.setEnd(saved.ec, saved.eo);
      }
      sel.removeAllRanges();
      sel.addRange(nr);
    }
  };

  const emit = () => {
    const el = editorRef.current;
    wrapRootInlines();
    const kosong = !htmlToText(el.innerHTML).trim() && !el.querySelector('li');
    setIsEmpty(kosong);
    onChange(kosong ? '' : el.innerHTML);
  };

  const blockOf = (node) => {
    let n = node && node.nodeType === 1 ? node : node && node.parentElement;
    while (n && n !== editorRef.current && !BLOCK_TAGS.has(n.nodeName)) n = n.parentElement;
    return n;
  };

  const placeCaretInBlock = (offset) => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const blk = blockOf(sel.getRangeAt(0).startContainer);
    if (!blk) return;
    const walker = document.createTreeWalker(blk, NodeFilter.SHOW_TEXT);
    let sisa = offset;
    let node = walker.nextNode();
    while (node) {
      if (sisa <= node.textContent.length) {
        const nr = document.createRange();
        nr.setStart(node, sisa);
        nr.collapse(true);
        sel.removeAllRanges();
        sel.addRange(nr);
        return;
      }
      sisa -= node.textContent.length;
      node = walker.nextNode();
    }
  };

  const exec = (cmd) => {
    editorRef.current.focus();
    wrapRootInlines();

    let posisiKursor = null;
    if (cmd === 'insertUnorderedList') {
      const r = getRange();
      const blk = r && r.collapsed ? blockOf(r.startContainer) : null;
      if (blk && blk !== editorRef.current) {
        const pre = document.createRange();
        pre.selectNodeContents(blk);
        pre.setEnd(r.startContainer, r.startOffset);
        posisiKursor = pre.toString().length;
      }
    }

    document.execCommand(cmd, false, null);
    if (posisiKursor !== null) placeCaretInBlock(posisiKursor);
    emit();
    updateFmt();
  };

  const decorateLinks = () => {
    editorRef.current.querySelectorAll('a').forEach((a) => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });
  };

  const restoreSelection = () => {
    editorRef.current.focus();
    if (savedRange.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  const openLink = () => {
    let r = getRange();
    if (!r) {
      editorRef.current.focus();
      r = getRange();
    }
    if (!r) return;
    savedRange.current = r.cloneRange();
    const a = anchorOf(r);
    setLinkEditing(Boolean(a));
    setLinkUrl(a ? a.getAttribute('href') || '' : '');
    setLinkText('');
    setNeedsLinkText(r.collapsed && !a);
    setLinkError('');
    setLinkOpen(true);
  };

  useEffect(() => {
    if (linkOpen) urlInputRef.current?.focus();
  }, [linkOpen]);

  const closeLink = () => {
    setLinkOpen(false);
    setLinkError('');
    restoreSelection();
  };

  const applyLink = () => {
    const url = normalizeUrl(linkUrl);
    if (!url) {
      setLinkError('Masukkan alamat tautan yang valid, misalnya https://contoh.com');
      return;
    }
    restoreSelection();
    const r = getRange();
    const a = anchorOf(r);
    if (a) {
      a.setAttribute('href', url);
    } else if (r && r.collapsed) {
      const teks = linkText.trim() || url;
      document.execCommand(
        'insertHTML',
        false,
        `<a href="${escapeHtml(url)}">${escapeHtml(teks)}</a>&nbsp;`
      );
    } else {
      document.execCommand('createLink', false, url);
    }
    decorateLinks();
    setLinkOpen(false);
    setLinkError('');
    emit();
    updateFmt();
  };

  const removeLink = () => {
    restoreSelection();
    const a = anchorOf(getRange());
    if (a) {
      const nr = document.createRange();
      nr.selectNodeContents(a);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(nr);
      document.execCommand('unlink');
    }
    setLinkOpen(false);
    emit();
    updateFmt();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const teks = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, teks);
    emit();
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openLink();
    }
  };

  const btnCls = (aktif) =>
    `p-1.5 rounded transition-colors cursor-pointer ${
      aktif ? 'bg-white text-[#4F46E5] shadow-sm' : 'hover:bg-white hover:text-gray-900'
    }`;
  const keepFocus = (e) => e.preventDefault();

  return (
    <div>
      <div className="flex items-center gap-1 p-1 bg-gray-50 border border-gray-200/90 rounded-t-xl text-gray-500">
        <button type="button" title="Tebal (Ctrl+B)" onMouseDown={keepFocus} onClick={() => exec('bold')} className={btnCls(fmt.bold)}>
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button type="button" title="Miring (Ctrl+I)" onMouseDown={keepFocus} onClick={() => exec('italic')} className={btnCls(fmt.italic)}>
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button type="button" title="Daftar poin" onMouseDown={keepFocus} onClick={() => exec('insertUnorderedList')} className={btnCls(fmt.list)}>
          <List className="w-3.5 h-3.5" />
        </button>
        <button type="button" title="Tautan (Ctrl+K)" onMouseDown={keepFocus} onClick={openLink} className={btnCls(fmt.link || linkOpen)}>
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {linkOpen && (
        <div className="border border-t-0 border-gray-200/90 bg-white p-3 space-y-2">
          {needsLinkText && (
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Teks tautan (opsional)"
              className="w-full bg-white border border-gray-200/90 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5]"
            />
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              ref={urlInputRef}
              type="text"
              value={linkUrl}
              onChange={(e) => { setLinkUrl(e.target.value); if (linkError) setLinkError(''); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
                if (e.key === 'Escape') { e.preventDefault(); closeLink(); }
              }}
              placeholder="https://contoh.com"
              className={`flex-1 min-w-0 bg-white border rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] ${
                linkError ? 'border-red-300' : 'border-gray-200/90'
              }`}
            />
            <div className="flex items-center gap-2">
              <button type="button" onClick={applyLink} className="px-3.5 py-2 bg-[#4F46E5] text-white text-xs font-semibold rounded-lg cursor-pointer">
                {linkEditing ? 'Perbarui' : 'Terapkan'}
              </button>
              {linkEditing && (
                <button type="button" onClick={removeLink} className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-600 cursor-pointer">
                  Hapus
                </button>
              )}
              <button type="button" onClick={closeLink} className="px-3 py-2 text-xs font-semibold text-gray-500 cursor-pointer">
                Batal
              </button>
            </div>
          </div>
          {linkError && <p className="text-[11px] text-red-500">{linkError}</p>}
        </div>
      )}

      <div className={`border border-t-0 rounded-b-xl p-3 bg-white space-y-2 ${invalid ? 'border-red-300' : 'border-gray-200/90'}`}>
        <p className="text-[11px] font-semibold text-gray-400">Deskripsi materi</p>
        <div className="relative">
          {isEmpty && (
            <span className="absolute left-0 top-0 text-xs text-gray-400 pointer-events-none">
              {placeholder}
            </span>
          )}
          <div
            id={id}
            ref={editorRef}
            role="textbox"
            aria-multiline="true"
            contentEditable
            suppressContentEditableWarning
            onInput={emit}
            onPaste={handlePaste}
            onDrop={(e) => e.preventDefault()}
            onKeyDown={handleKeyDown}
            className="min-h-[8rem] max-h-[20rem] resize-y overflow-auto text-xs text-gray-800 leading-relaxed focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-[#4F46E5] [&_a]:underline"
          />
        </div>
      </div>
    </div>
  );
};

const MateriDosen = () => {
  const [systemDate] = useState(() => getSystemDateIndonesian());

  // Filter & Sorting State
  const [activeTab, setActiveTab] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilterOption, setCourseFilterOption] = useState('semua'); // 'semua', 'Basis Data', 'Pemrograman Web'
  const [sortOption, setSortOption] = useState('terbaru'); // 'terbaru', 'terlama'

  // Edit / Form State
  const [editingId, setEditingId] = useState(null); // null = mode tambah, id = mode edit
  const [mataKuliahForm, setMataKuliahForm] = useState('Basis Data — TI-3A');
  const [pertemuanForm, setPertemuanForm] = useState('7 - Normalisasi');
  const [judulMateri, setJudulMateri] = useState('');
  const [deskripsiMateri, setDeskripsiMateri] = useState('');
  
  // Lampiran State
  const [lampiranTab, setLampiranTab] = useState('dokumen'); // 'dokumen' | 'gdrive'
  const [linkInput, setLinkInput] = useState('');
  const [linkError, setLinkError] = useState('');
  const [files, setFiles] = useState([]);
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
      deskripsi: textToHtml('Latihan tambahan normalisasi dari bentuk 1NF hingga 3NF.'),
      tipe: 'drive',
      url: 'https://drive.google.com/drive/folders/contoh1',
      meta: 'Google Drive • Tautan folder',
      subtext: '23 Okt 2026 • Ditambahkan Dr. Maya Putri',
      timestamp: new Date('2026-10-23').getTime()
    },
    {
      id: 2,
      mkCode: 'IF203',
      mkName: 'IF203 · Basis Data — TI-3A',
      pertemuan: 'Pertemuan 6 · Query SQL',
      judul: 'Modul Latihan Query SQL.pdf',
      deskripsi: textToHtml('Modul lengkap latihan dasar query SQL.'),
      tipe: 'pdf',
      url: '',
      meta: 'PDF • 1,8 MB',
      subtext: '19 Okt 2026 • PDF • 1,8 MB',
      timestamp: new Date('2026-10-19').getTime()
    },
    {
      id: 3,
      mkCode: 'IF203',
      mkName: 'IF203 · Basis Data — TI-3A',
      pertemuan: 'Pertemuan 5 · Perancangan basis data',
      judul: 'Panduan Perancangan ERD.pdf',
      deskripsi: textToHtml('Panduan membuat Entity Relationship Diagram.'),
      tipe: 'pdf',
      url: '',
      meta: 'PDF • 2,4 MB',
      subtext: '12 Okt 2026 • PDF • 2,4 MB',
      timestamp: new Date('2026-10-12').getTime()
    },
    {
      id: 4,
      mkCode: 'IF205',
      mkName: 'IF205 · Pemrograman Web — TI-3A',
      pertemuan: 'Pertemuan 6 · Desain responsif',
      judul: 'CSS Flexbox & Grid',
      deskripsi: textToHtml('Materi presentasi tata letak web modern.'),
      tipe: 'drive',
      url: 'https://drive.google.com/drive/folders/contoh2',
      meta: 'Google Drive • Tautan presentasi',
      subtext: '22 Okt 2026 • Ditambahkan Dr. Maya Putri',
      timestamp: new Date('2026-10-22').getTime()
    }
  ]);

  // Handle File Upload
  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (uploadedFiles.length > 0) {
      const newFiles = uploadedFiles.map(file => ({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        url: ''
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Validasi ketat Link Google Drive (harus drive.google.com atau docs.google.com)
  const handleAddLink = () => {
    const raw = linkInput.trim();
    if (!raw) {
      setLinkError('Tempel link Google Drive terlebih dahulu.');
      return;
    }
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    let host = '';
    try {
      host = new URL(url).hostname;
    } catch {
      setLinkError('Format link tidak valid.');
      return;
    }
    if (host !== 'drive.google.com' && host !== 'docs.google.com') {
      setLinkError('Link harus berasal dari Google Drive (drive.google.com atau docs.google.com).');
      return;
    }
    setFiles(prev => [...prev, { name: url, url, size: '', type: 'GDRIVE' }]);
    setLinkInput('');
    setLinkError('');
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  // Buka Materi
  const handleOpenMateri = (item) => {
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      alert(`Membuka berkas: ${item.judul}`);
    }
  };

  // Edit Materi (Load ke Form Kanan)
  const handleEditMateri = (item) => {
    setEditingId(item.id);
    setMataKuliahForm(item.mkName.includes('Basis Data') ? 'Basis Data — TI-3A' : 'Pemrograman Web — TI-3A');
    setPertemuanForm(item.pertemuan.replace('Pertemuan ', ''));
    setJudulMateri(item.judul);
    setDeskripsiMateri(item.deskripsi || '');
    setFiles(item.url ? [{ name: item.url, url: item.url, size: '', type: 'GDRIVE' }] : [{ name: item.judul, size: item.meta, type: item.tipe.toUpperCase(), url: '' }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset Form
  const handleResetForm = () => {
    setEditingId(null);
    setJudulMateri('');
    setDeskripsiMateri('');
    setFiles([]);
    setLinkInput('');
    setLinkError('');
  };

  // Submit Form (Tambah atau Update)
  const handlePublish = (e) => {
    e.preventDefault();
    if (!judulMateri) return;

    const isBasisData = mataKuliahForm.includes('Basis Data');
    const primaryUrl = files.find(f => f.url)?.url || '';

    if (editingId !== null) {
      // Update
      setMateriList(prev => prev.map(m => {
        if (m.id === editingId) {
          return {
            ...m,
            mkCode: isBasisData ? 'IF203' : 'IF205',
            mkName: isBasisData ? 'IF203 · Basis Data — TI-3A' : 'IF205 · Pemrograman Web — TI-3A',
            pertemuan: `Pertemuan ${pertemuanForm}`,
            judul: judulMateri,
            deskripsi: deskripsiMateri,
            tipe: primaryUrl ? 'drive' : 'pdf',
            url: primaryUrl,
            meta: primaryUrl ? 'Google Drive • Tautan materi' : 'PDF • Dokumen diperbarui'
          };
        }
        return m;
      }));
    } else {
      // Tambah Baru
      const newMateri = {
        id: Date.now(),
        mkCode: isBasisData ? 'IF203' : 'IF205',
        mkName: isBasisData ? 'IF203 · Basis Data — TI-3A' : 'IF205 · Pemrograman Web — TI-3A',
        pertemuan: `Pertemuan ${pertemuanForm}`,
        judul: judulMateri,
        deskripsi: deskripsiMateri,
        tipe: primaryUrl ? 'drive' : 'pdf',
        url: primaryUrl,
        meta: primaryUrl ? 'Google Drive • Tautan materi' : 'PDF • Dokumen baru',
        subtext: `Hari ini • Ditambahkan Dr. Maya Putri`,
        timestamp: Date.now()
      };
      setMateriList(prev => [newMateri, ...prev]);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      handleResetForm();
    }, 1500);
  };

  const handleDeleteMateri = (id, judul) => {
    if (window.confirm(`Hapus materi "${judul}"?`)) {
      setMateriList(prev => prev.filter(m => m.id !== id));
      if (editingId === id) handleResetForm();
    }
  };

  // Toggle Sorting Mata Kuliah Interaktif
  const handleToggleCourseFilter = () => {
    setCourseFilterOption(prev => {
      if (prev === 'semua') return 'Basis Data';
      if (prev === 'Basis Data') return 'Pemrograman Web';
      return 'semua';
    });
  };

  // Toggle Sorting Terbaru / Terlama
  const handleToggleSort = () => {
    setSortOption(prev => prev === 'terbaru' ? 'terlama' : 'terbaru');
  };

  // Filter & Sorting Logic
  const filteredMateri = materiList.filter(m => {
    const matchTab = 
      activeTab === 'semua' ? true :
      activeTab === 'basisdata' ? m.mkCode === 'IF203' :
      activeTab === 'web' ? m.mkCode === 'IF205' : true;
    
    const matchCourseDropdown = 
      courseFilterOption === 'semua' ? true :
      courseFilterOption === 'Basis Data' ? m.mkCode === 'IF203' :
      courseFilterOption === 'Pemrograman Web' ? m.mkCode === 'IF205' : true;

    const matchSearch = m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.pertemuan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchCourseDropdown && matchSearch;
  }).sort((a, b) => {
    if (sortOption === 'terbaru') {
      return b.timestamp - a.timestamp;
    } else {
      return a.timestamp - b.timestamp;
    }
  });

  const groupedMateri = filteredMateri.reduce((acc, item) => {
    if (!acc[item.mkName]) acc[item.mkName] = [];
    acc[item.mkName].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header Bar tanpa tombol tambah */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight">
            Kelola materi
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Bagikan bahan belajar yang terstruktur untuk setiap pertemuan.
          </p>
        </div>
      </div>

      {/* Grid Layout 2 Kolom: Kiri (Pustaka Materi) vs Kanan (Form Tambah/Edit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Kolom Kiri: Pustaka Materi */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Pustaka materi</h2>
              <p className="text-xs text-gray-400 mt-0.5">{materiList.length} materi · 2 mata kuliah</p>
            </div>

            {/* Search & Interactive Sorting Controls */}
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
                {/* Tombol Filter Mata Kuliah */}
                <button 
                  type="button" 
                  onClick={handleToggleCourseFilter}
                  className="flex items-center gap-1.5 bg-white border border-gray-200/90 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                  <span>{courseFilterOption === 'semua' ? 'Semua mata kuliah' : courseFilterOption}</span>
                </button>

                {/* Tombol Sorting Terbaru/Terlama */}
                <button 
                  type="button" 
                  onClick={handleToggleSort}
                  className="flex items-center gap-1.5 bg-white border border-gray-200/90 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  <span>{sortOption === 'terbaru' ? 'Terbaru' : 'Terlama'}</span>
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
                Semua materi ({materiList.length})
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
                Basis Data ({materiList.filter(m => m.mkCode === 'IF203').length})
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
                Pemrograman Web ({materiList.filter(m => m.mkCode === 'IF205').length})
              </button>
            </div>

            {/* Daftar Materi */}
            <div className="space-y-6 pt-2">
              {Object.keys(groupedMateri).length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">Tidak ada materi yang ditemukan.</p>
              ) : (
                Object.keys(groupedMateri).map((mkName, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-900 pb-1 border-b border-gray-50">
                      <span>{mkName}</span>
                      <span className="text-gray-400 font-normal text-[11px]">
                        {groupedMateri[mkName].length} materi
                      </span>
                    </div>

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
                              <button 
                                type="button" 
                                onClick={() => handleOpenMateri(item)}
                                className="hover:underline cursor-pointer"
                              >
                                Buka
                              </button>
                              <span className="text-gray-300">·</span>
                              <button 
                                type="button" 
                                onClick={() => handleEditMateri(item)}
                                className="hover:underline cursor-pointer"
                              >
                                Edit
                              </button>
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
                ))
              )}
            </div>

          </div>
        </div>

        {/* Kolom Kanan: Form Tambah / Edit Materi */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handlePublish} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-900">
                  {editingId !== null ? 'Edit materi' : 'Tambah materi'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editingId !== null ? 'Perbarui informasi materi.' : 'Materi baru akan terlihat di kelas terpilih.'}
                </p>
              </div>
              {editingId !== null && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Batal edit
                </button>
              )}
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
                  <option value="6 - Desain responsif">6 - Desain responsif</option>
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

            {/* Deskripsi Materi dengan RichTextEditor */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Deskripsi materi <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                id="materi-deskripsi-editor"
                value={deskripsiMateri}
                placeholder="Tuliskan ringkasan dan instruksi materi..."
                onChange={(html) => setDeskripsiMateri(html)}
              />
            </div>

            {/* Lampiran Materi dengan Tab Dokumen & Link Google Drive tervalidasi */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-gray-700">Lampiran materi</label>
              <div className="inline-flex p-1 bg-[#f8f9fa] border border-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setLampiranTab('dokumen')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    lampiranTab === 'dokumen'
                      ? 'bg-white text-[#4F46E5] shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Dokumen
                </button>
                <button
                  type="button"
                  onClick={() => setLampiranTab('gdrive')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    lampiranTab === 'gdrive'
                      ? 'bg-white text-[#4F46E5] shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  Link Google Drive
                </button>
              </div>

              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                multiple 
                className="hidden" 
              />

              {lampiranTab === 'dokumen' ? (
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
                      PDF, DOCX, PPTX • Maksimal 20 MB per berkas
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700">Link Google Drive</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      value={linkInput}
                      onChange={(e) => {
                        setLinkInput(e.target.value);
                        if (linkError) setLinkError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddLink();
                        }
                      }}
                      placeholder="https://drive.google.com/..."
                      className={`flex-1 min-w-0 bg-white border rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#4F46E5] ${
                        linkError ? 'border-red-300' : 'border-gray-200/90'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Tambahkan
                    </button>
                  </div>
                  {linkError ? (
                    <p className="text-[11px] text-red-500">{linkError}</p>
                  ) : (
                    <p className="text-[11px] text-gray-400">
                      Pastikan akses berbagi diatur ke &quot;Siapa saja yang memiliki link&quot; agar mahasiswa dapat membukanya.
                    </p>
                  )}
                </div>
              )}

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
                          {file.url ? <LinkIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{file.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {file.url ? 'Link Google Drive' : `${file.type} • ${file.size}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-semibold text-[#4F46E5] shrink-0">
                        {file.url && (
                          <>
                            <button
                              type="button"
                              onClick={() => window.open(file.url, '_blank', 'noopener,noreferrer')}
                              className="hover:underline cursor-pointer"
                            >
                              Buka
                            </button>
                            <span className="text-gray-300">·</span>
                          </>
                        )}
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

            {/* Tombol Terbitkan & Batalkan */}
            <div className="space-y-2 pt-2">
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isSubmitted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{editingId !== null ? 'Perubahan disimpan!' : 'Materi berhasil diterbitkan!'}</span>
                  </>
                ) : (
                  <span>{editingId !== null ? 'Simpan perubahan' : 'Terbitkan materi'}</span>
                )}
              </button>
              <button 
                type="button"
                onClick={handleResetForm}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Batalkan
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default MateriDosen;