# TikTakTuk - Platform Ticketing Event

Link : tiktaktuk-diajakdaffa.vercel.app
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
2. Isi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, dan `DATABASE_URL` dengan kredensial proyek Supabase/PostgreSQL Anda. Jika dashboard Supabase Anda masih menampilkan `anon key`, variabel `NEXT_PUBLIC_SUPABASE_ANON_KEY` juga tetap didukung.

### 3. Setup Database (Supabase)
Sistem ini menggunakan struktur database relasional yang kompleks. File SQL berada di folder `src/sql`:
- `src/sql/schema.sql`
- `src/sql/seed.sql`
- `src/sql/triggers/*.sql`

Jalankan schema, seed, lalu trigger melalui SQL Editor di dashboard Supabase.

### 4. Jalankan Server Lokal
Setelah konfigurasi selesai, jalankan perintah:
```bash
npm run dev
```
Buka browser dan akses [http://localhost:3000](http://localhost:3000).

## Akun Demo

- **Administrator**:
  - Username: `adminutama`
  - Password: `pass123`
- **Organizer**:
  - Username: `eomusic`
  - Password: `pass123`
- **Customer**:
  - Username: `userbudi`
  - Password: `pass123`
