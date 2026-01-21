# Sistem Pendataan Makan Guru SR

Aplikasi web untuk mengelola dan melacak data makan guru di sekolah. Menggantikan sistem spreadsheet manual dengan solusi digital yang lebih efisien.

## 📋 Fitur Utama

### 1. Manajemen Guru
- Tambah, edit, dan hapus data guru
- Kategori peran: Kepala Sekolah, Guru, Tendik, Nakes, Kepala Komite
- Pencarian guru berdasarkan nama atau peran

### 2. Pencatatan Makan Bulanan
- Tampilan kalender bulanan interaktif
- Klik untuk mencatat/membatalkan makan per tanggal
- Filter hari (default Senin-Jumat, bisa diubah)
- Harga makan: Rp 10.000/porsi

### 3. Pembayaran
- Status pembayaran bulanan per guru (Lunas/Belum)
- Toggle status dengan satu klik
- Ringkasan total lunas dan belum lunas

### 4. Statistik & Laporan
- Total guru terdaftar
- Total porsi makan bulan ini
- Total biaya bulanan
- Export laporan ke PDF

### 5. Filter & Navigasi
- Filter berdasarkan bulan dan tahun
- Reset ke bulan/tahun saat ini
- Pencarian guru real-time

## 🛠️ Teknologi

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Lovable Cloud (Supabase)
- **Database**: PostgreSQL
- **Export**: jsPDF + jspdf-autotable

## 📊 Struktur Database

### Tabel `teachers`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary key |
| name | TEXT | Nama guru |
| role | TEXT | Peran (kepala_sekolah, guru, tendik, nakes, kepala_komite) |
| created_at | TIMESTAMP | Waktu dibuat |

### Tabel `meal_records`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary key |
| teacher_id | UUID | Referensi ke teachers |
| date | DATE | Tanggal makan |
| meal_type | TEXT | Tipe makan (siang) |
| created_at | TIMESTAMP | Waktu dibuat |

### Tabel `monthly_payments`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | UUID | Primary key |
| teacher_id | UUID | Referensi ke teachers |
| month | INTEGER | Bulan (1-12) |
| year | INTEGER | Tahun |
| amount | INTEGER | Jumlah tagihan |
| is_paid | BOOLEAN | Status pembayaran |
| paid_at | TIMESTAMP | Waktu pembayaran |

## 🚀 Cara Penggunaan

### Menambah Guru
1. Klik tombol "Tambah Guru" di panel kanan
2. Masukkan nama dan pilih peran
3. Klik "Simpan"

### Mencatat Makan
1. Pilih bulan dan tahun menggunakan filter
2. Klik sel tanggal pada baris guru yang bersangkutan
3. Ikon matahari (☀️) menandakan sudah makan

### Mengubah Status Pembayaran
1. Klik badge "Lunas" atau "Belum" pada kolom Status
2. Status akan berubah secara otomatis

### Export PDF
1. Klik tombol "Export PDF"
2. File PDF akan terunduh dengan data bulanan

## 📱 Responsif

Aplikasi ini responsif dan dapat diakses melalui:
- Desktop
- Tablet
- Mobile

## 🔧 Instalasi Lokal

```bash
# Clone repository
git clone <YOUR_GIT_URL>

# Masuk ke direktori
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

## 📄 Lisensi

Hak Cipta © 2024. Semua hak dilindungi.

---

Dibuat dengan ❤️ menggunakan [Lovable](https://lovable.dev)
