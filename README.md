# NugasYuk - Team Workflow & Architecture Guide

Selamat datang di repositori **NugasYuk** (Kelompok 3)! Proyek Learning Management System (LMS) ini dikembangkan menggunakan (React.js + Vite, Node.js, MongoDB) berdasarkan metode *Agile*.

Repositori ini menggunakan struktur **Root-Backend & Subfolder-Frontend**. Artinya, seluruh konfigurasi server/backend berada di folder utama (root), sedangkan aplikasi antarmuka pengguna (React) berada di dalam folder `client/`.

## Struktur Folder Utama

```text
Project-NugasYuk/
│
├── client/                       <-- Folder kerja Frontend (React.js + Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/               <-- File statis (Gambar)
│   │   ├── components/           <-- Komponen reusable (Navbar, Sidebar, Card Tugas)
│   │   ├── context/              <-- State global (Data User Login/Role Dosen & Mahasiswa)
│   │   ├── pages/                <-- Halaman UI utama (Dashboard, Kuis, Tugas, Absensi)
│   │   ├── services/             <-- Konfigurasi Axios & Endpoint API
│   │   ├── App.jsx               <-- Root component
│   │   ├── App.css               <-- Styling spesifik App
│   │   ├── main.jsx              <-- Entry point React
│   │   └── index.css             <-- Styling CSS global (Tailwind/Custom)
│   ├── package.json              <-- Library khusus frontend
│   └── vite.config.js
│
├── controllers/                  <-- [Backend] Logika pemrosesan request & response
├── middlewares/                  <-- [Backend] Middleware keamanan (JWT, Multer)
├── models/                       <-- [Backend] Skema Database Mongoose (User, Tugas, dll)
├── routes/                       <-- [Backend] Definisi Endpoint API
├── index.js                      <-- [Backend] Entry point server aplikasi Node.js
├── .env.example                  <-- [Backend] Contoh environment variables
├── .gitignore                    <-- Mengabaikan node_modules, .env, dll
└── package.json                  <-- [Backend] Library khusus backend (Express, Mongoose)
```

## Repository Branching Rules

Pengembangan kode difokuskan pada 3 Developer Utama. Setiap *developer* **wajib** bekerja di *branch* (jalur) masing-masing untuk mencegah bentrok kode.

* `main` → Final / Production (Hanya untuk rilis resmi)
* `dev` → Development (Ruang tengah / Pusat integrasi kode)
* `dev-rahman` → Branch kerja Rahman (Developer 1)
* `dev-faishal` → Branch kerja Faishal (Developer 2)
* `dev-hamzah` → Branch kerja Hamzah (Developer 3)

## Setup Pertama Kali (Clone & Install)

Jalankan deretan perintah ini **sekali saja** saat pertama kali mengunduh proyek ke laptop:

```bash
# 1. Clone repositori ke laptop
git clone https://github.com/Malkistt/NugasYuk.git
cd Project-NugasYuk

# 2. Masuk ke branch utama dan tarik data terbaru
git checkout dev
git pull origin dev

# 3A. Setup Backend (di root folder)
# (Pastikan MongoDB lokal atau URL MongoDB Atlas sudah siap)
npm install    # Menginstal Express, Mongoose, dotenv, dll

# 3B. Setup Frontend (di folder client)
cd client
npm install    # Menginstal semua library React, Tailwind, Axios, dll
cd ..

# 4. Buat dan pindah ke branch pribadi (Contoh: Asamitaka)
git checkout -b dev-asamitaka
```

## Workflow Harian GitHub (Wajib Diikuti Developer)

Ikuti langkah-langkah ini setiap kali kamu mulai dan selesai bekerja:

### 1. SEBELUM NGODING: Tarik Update Terbaru dari `dev`
Posisi kamu harus tetap di branch pribadi (contoh: `dev-rahman`).
```bash
git pull origin dev
```

### 2. SAAT NGODING: Jalankan Proyek
Buka **dua terminal** secara bersamaan di VS Code:

* **Terminal 1 (Backend):** Pastikan kamu di folder utama (`Project-NugasYuk`), lalu jalankan:
  ```bash
  npm run dev  # (Jika menggunakan nodemon) atau node index.js
  ```
* **Terminal 2 (Frontend):** Masuk ke folder `client`, lalu jalankan Vite:
  ```bash
  cd client
  npm run dev
  ```

### 3. SELESAI NGODING: Simpan & Push ke Branch Pribadi
Pastikan kamu berada di folder paling luar (root) sebelum melakukan commit.
```bash
git add .
git commit -m "feat: tambah API endpoint absensi mahasiswa"
git push origin <nama-branch-kamu>
```

## Cara Pull Request (Setor Kode ke Dev)

Ketika fitur buatanmu sudah selesai dites dan siap digabungkan:
1. Buka repositori di GitHub.
2. Klik tombol **Pull Request**.
3. Arahkan *branch* kamu untuk digabung ke `dev` (Contoh: `dev-rahman` -> `dev`).
4. Minta anggota lain untuk melakukan *Code Review* dan klik **Merge**.

## Susunan Lengkap Tim NugasYuk (Kelompok 3)

| Nama Anggota | Peran / Jabatan | Keterangan Tambahan | 
| ----- | ----- | ----- | 
| **Rahman Nur Fauzan** | PM / Developer (Frontend & Backend) | Ketua Kelompok, Modul Auth & Tugas | 
| **Muhammad Faishal Al Bukhari** | Developer (Frontend & Backend) | Modul Kuis & Materi Drive | 
| **Muhammad Hamzah Al Farisi** | Developer (Frontend & Backend) | Modul Absensi, Search, & Notifikasi | 
| **Muhammad Ramdhan Al Qusyairi** | UI/UX Designer | Perancangan Flow, Figma, Prototipe | 
| **Rasky Athoillah Sudiyana** | UI/UX Designer | Perancangan Flow, Figma, Prototipe | 
| **Nadhifa Zahra Syaifi** | UI/UX Designer & Dokumentasi | Prototipe, Analisis Kebutuhan, Laporan | 
| **R. Ersa Putri Sulaksana** | Dokumentasi | Panduan Pengguna, Laporan Akhir | 

**Status Proyek:** Perencanaan & Development
