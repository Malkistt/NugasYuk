import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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

// ---------- Editor teks sederhana (tebal, miring, daftar, tautan) ----------
const escapeHtml = (t) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const textToHtml = (t) =>
  t
    .split('\n')
    .map((baris) => `<div>${baris ? escapeHtml(baris) : '<br>'}</div>`)
    .join('');

// Elemen yang dianggap blok; teks/inline langsung di akar editor akan dibungkus <div>
const BLOCK_TAGS = new Set(['DIV', 'P', 'UL', 'OL', 'LI', 'BLOCKQUOTE']);
const htmlToText = (h) => {
  const d = document.createElement('div');
  d.innerHTML = h;
  return d.textContent || '';
};

// Hanya menerima http, https, dan mailto
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

  // Sinkronkan isi awal / perubahan dari luar (tidak mengganggu kursor saat mengetik)
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

  // Chrome memindahkan kursor ke awal baris saat membuat daftar jika teks tidak berada di dalam blok.
  // Jadi teks di akar editor selalu dibungkus <div>, dengan posisi kursor dipertahankan.
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

  // Blok terdekat (div / li / ...) dari sebuah node
  const blockOf = (node) => {
    let n = node && node.nodeType === 1 ? node : node && node.parentElement;
    while (n && n !== editorRef.current && !BLOCK_TAGS.has(n.nodeName)) n = n.parentElement;
    return n;
  };

  // Pindahkan kursor ke posisi karakter ke-`offset` di dalam blok tempat kursor berada sekarang
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

  const exec = (cmd, arg) => {
    editorRef.current.focus();
    wrapRootInlines();

    // Chrome memindahkan kursor ke awal baris setelah perintah daftar; simpan dulu posisinya
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

    document.execCommand(cmd, false, arg);
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

  // ----- Tautan -----
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

  // ----- Event editor -----
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
  // Cegah tombol mencuri fokus supaya seleksi teks tetap ada
  const keepFocus = (e) => e.preventDefault();

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 bg-gray-50 border border-gray-200/90 rounded-t-xl text-gray-500">
        <button type="button" title="Tebal (Ctrl+B)" aria-label="Tebal" aria-pressed={fmt.bold}
          onMouseDown={keepFocus} onClick={() => exec('bold')} className={btnCls(fmt.bold)}>
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button type="button" title="Miring (Ctrl+I)" aria-label="Miring" aria-pressed={fmt.italic}
          onMouseDown={keepFocus} onClick={() => exec('italic')} className={btnCls(fmt.italic)}>
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button type="button" title="Daftar poin" aria-label="Daftar poin" aria-pressed={fmt.list}
          onMouseDown={keepFocus} onClick={() => exec('insertUnorderedList')} className={btnCls(fmt.list)}>
          <List className="w-3.5 h-3.5" />
        </button>
        <button type="button" title="Tautan (Ctrl+K)" aria-label="Tautan" aria-pressed={fmt.link || linkOpen}
          onMouseDown={keepFocus} onClick={openLink} className={btnCls(fmt.link || linkOpen)}>
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Panel tautan */}
      {linkOpen && (
        <div className="border border-t-0 border-gray-200/90 bg-white p-3 space-y-2">
          {needsLinkText && (
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Teks tautan (opsional)"
              aria-label="Teks tautan"
              className="w-full bg-white border border-gray-200/90 rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5]"
            />
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              ref={urlInputRef}
              type="text"
              inputMode="url"
              value={linkUrl}
              onChange={(e) => { setLinkUrl(e.target.value); if (linkError) setLinkError(''); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); applyLink(); }
                if (e.key === 'Escape') { e.preventDefault(); closeLink(); }
              }}
              placeholder="https://contoh.com"
              aria-label="Alamat tautan"
              className={`flex-1 min-w-0 bg-white border rounded-lg px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4F46E5] ${
                linkError ? 'border-red-300' : 'border-gray-200/90'
              }`}
            />
            <div className="flex items-center gap-2">
              <button type="button" onClick={applyLink}
                className="px-3.5 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                {linkEditing ? 'Perbarui' : 'Terapkan'}
              </button>
              {linkEditing && (
                <button type="button" onClick={removeLink}
                  className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-600 cursor-pointer">
                  Hapus tautan
                </button>
              )}
              <button type="button" onClick={closeLink}
                className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 cursor-pointer">
                Batal
              </button>
            </div>
          </div>
          {linkError && <p className="text-[11px] text-red-500">{linkError}</p>}
        </div>
      )}

      {/* Area tulis */}
      <div className={`border border-t-0 rounded-b-xl p-3 bg-white space-y-2 ${invalid ? 'border-red-300' : 'border-gray-200/90'}`}>
        <p className="text-[11px] font-semibold text-gray-400">Instruksi pengerjaan</p>
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
            aria-label="Deskripsi tugas"
            contentEditable
            suppressContentEditableWarning
            onInput={emit}
            onPaste={handlePaste}
            onDrop={(e) => e.preventDefault()}
            onKeyDown={handleKeyDown}
            className="min-h-[9.5rem] max-h-[28rem] resize-y overflow-auto text-xs text-gray-800 leading-relaxed focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-[#4F46E5] [&_a]:underline [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic"
          />
        </div>
      </div>
    </div>
  );
};

const FormTugasDosen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Mode: jika URL mengandung "/edit" maka mode edit (prefilled), jika "/buat" maka mode buat tugas (isinya kosong)
  const isEditMode = location.pathname.includes('/edit') || Boolean(id);

  const [systemDate] = useState(() => getSystemDateIndonesian());

  // Refs untuk input date & time agar bisa memicu showPicker() lewat ikon
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Form State: Jika buat tugas, isinya KOSONG. Jika edit, berisi data prefilled (format YYYY-MM-DD dan HH:mm untuk input date/time).
  const [mataKuliah, setMataKuliah] = useState(
    isEditMode ? 'IF203 · Basis Data — TI-3A' : ''
  );
  const [judulTugas, setJudulTugas] = useState(
    isEditMode ? 'Perancangan ERD' : ''
  );
  const [deskripsiTugas, setDeskripsiTugas] = useState(
    isEditMode 
      ? textToHtml(`Rancang ERD untuk sistem perpustakaan digital.\n\n1. Identifikasi minimal 5 entitas beserta atributnya.\n2. Tentukan primary key, foreign key, dan kardinalitas.\n3. Jelaskan relasi dan asumsi desain Anda.\n\nKumpulkan diagram dan penjelasan dalam satu berkas PDF. Gunakan format nama: NIM_Nama_ERD.pdf.`)
      : ''
  );
  const [tanggalDeadline, setTanggalDeadline] = useState(
    isEditMode ? '2026-10-26' : ''
  );
  const [jamDeadline, setJamDeadline] = useState(
    isEditMode ? '23:59' : ''
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
  const [deskripsiError, setDeskripsiError] = useState(false);

  // Tab lampiran: 'dokumen' | 'gdrive'
  const [lampiranTab, setLampiranTab] = useState('dokumen');
  const [linkInput, setLinkInput] = useState('');
  const [linkError, setLinkError] = useState('');

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

  // Tambah link Google Drive
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!htmlToText(deskripsiTugas).trim()) {
      setDeskripsiError(true);
      document.getElementById('deskripsi-editor')?.focus();
      return;
    }
    setIsSaved(true);
    setTimeout(() => {
      navigate('/tugas');
    }, 800);
  };

  return (
    <div className="space-y-6">
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

              <RichTextEditor
                id="deskripsi-editor"
                value={deskripsiTugas}
                invalid={deskripsiError}
                placeholder="Tuliskan instruksi dan rincian pengerjaan tugas di sini..."
                onChange={(html) => {
                  setDeskripsiTugas(html);
                  setDeskripsiError(false);
                }}
              />
              {deskripsiError && (
                <p className="text-[11px] text-red-500">Deskripsi tugas wajib diisi.</p>
              )}
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
                    ref={dateInputRef}
                    type="date"
                    value={tanggalDeadline}
                    onChange={(e) => setTanggalDeadline(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-200/90 rounded-xl pl-4 pr-10 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] transition-colors cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  <Calendar 
                    className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#4F46E5] transition-colors" 
                    onClick={() => dateInputRef.current?.showPicker?.()}
                  />
                </div>
              </div>

              {/* Jam Deadline */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-700">
                  Jam deadline <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={timeInputRef}
                    type="time"
                    value={jamDeadline}
                    onChange={(e) => setJamDeadline(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-200/90 rounded-xl pl-4 pr-10 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#4F46E5] transition-colors cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  <Clock 
                    className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#4F46E5] transition-colors" 
                    onClick={() => timeInputRef.current?.showPicker?.()}
                  />
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

            {/* Pilihan jenis lampiran */}
            <div className="inline-flex p-1 bg-[#f8f9fa] border border-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setLampiranTab('dokumen')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
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
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
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
            /* Dropzone Upload Box */
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
            ) : (
            /* Input Link Google Drive */
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Link Google Drive
              </label>
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
                  placeholder="https://drive.google.com/file/d/..."
                  className={`flex-1 min-w-0 bg-white border rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#4F46E5] transition-colors ${
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
                      <button
                        type="button"
                        onClick={() => file.url && window.open(file.url, '_blank', 'noopener,noreferrer')}
                        className="hover:underline cursor-pointer"
                      >
                        Buka
                      </button>
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
    </div>
  );
};

export default FormTugasDosen;