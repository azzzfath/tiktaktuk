# TikTakTuk - Platform Ticketing Event

TikTakTuk adalah platform manajemen dan pemesanan tiket acara (konser, festival, dll) yang dibuat menggunakan Next.js dan Supabase. Sistem ini dilengkapi dengan manajemen peran (Administrator, Organizer, Customer) serta manajemen venue dan kursi.

## Persiapan (Getting Started)

Bagi penguji atau developer lain yang ingin menjalankan proyek ini di mesin lokal, ikuti langkah-langkah berikut:

### 1. Kloning dan Install Dependencies
Pastikan Anda sudah menginstall Node.js.
```bash
npm install
```

### 2. Setup Environment Variables
Proyek ini membutuhkan koneksi ke database Supabase. Karena `.env.local` tidak di-*push* ke GitHub demi keamanan, Anda harus membuat file `.env.local` sendiri di *root* folder.
1. Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
2. Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dengan kredensial proyek Supabase Anda.

### 3. Setup Database (Supabase)
Sistem ini menggunakan struktur database relasional yang kompleks. Anda dapat menemukan **Schema SQL lengkap** beserta **Dummy Data** awal di dalam file `CRUD.md`.
Silakan *copy-paste* isi SQL dari `CRUD.md` ke dalam SQL Editor di *dashboard* Supabase Anda lalu *Run* untuk membuat tabel dan men-*seed* data awal.

### 4. Jalankan Server Lokal
Setelah konfigurasi selesai, jalankan perintah:
```bash
npm run dev
```
Buka browser dan akses [http://localhost:3000](http://localhost:3000).

## Akun Demo
Jika Anda telah memasukkan *dummy data* dari `CRUD.md`, Anda dapat menggunakan akun berikut untuk masuk ke dashboard dengan role yang berbeda:

- **Administrator**: 
  - Username: `adminutama`
  - Password: `pass123`
- **Organizer**: 
  - Username: `eomusic`
  - Password: `pass123`
- **Customer**: 
  - Username: `userbudi`
  - Password: `pass123`
