# 📖 Panduan Penggunaan Sistem Pendataan Makan Guru SR

## 🌐 Mengakses Aplikasi

### Via Browser (Web)
1. Buka browser di perangkat Anda (Chrome, Safari, Firefox, Edge)
2. Ketik alamat: **https://data-makan-gurusr.vercel.app/**
3. Aplikasi akan terbuka dan siap digunakan

### 📸 Tampilan Utama Aplikasi

Setelah membuka aplikasi, Anda akan melihat tampilan seperti ini:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🍽️ Sistem Pendataan Makan                                                   │
│     Guru SR                                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  📅 Filter Periode: [Februari ▼] [2026 ▼]                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────────────┐  ┌───────────┐  ┌─────────────────┐   │
│  │ Total     │  │ Data Makan        │  │ Februari  │  │ Total Iuran     │   │
│  │ Guru      │  │ Bulan Ini         │  │           │  │ Bulan Ini       │   │
│  │ 👥 18     │  │ 🍴 130            │  │ 📅 2026   │  │ 💰 Rp 1.300.000 │   │
│  └───────────┘  └───────────────────┘  └───────────┘  └─────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Data Makan Bulanan                                    │ Daftar Guru        │
│  Februari 2026                                         │ [+ Tambah Guru]    │
│  ┌──────────────────────────────────────────────┐     │                    │
│  │ 🔍 [Cari nama...]  [Hari(5)] [Individual]    │     │ • Ibu Yuli 🗑️      │
│  │                    [Export PDF]              │     │   Kepala Sekolah   │
│  ├──────────────────────────────────────────────┤     │ • April 🗑️         │
│  │ Nama        │ Sen│Sel│Rab│Kam│Jum│... │Total│     │   Guru             │
│  │─────────────┼────┼───┼───┼───┼───┼────┼─────│     │ • Ain 🗑️           │
│  │ Ibu Yuli    │ ○  │ ○ │ ○ │ ○ │ ○ │... │ 0   │     │   Guru             │
│  │ April       │ ☀️ │ ☀️│ ○ │ ☀️│ ☀️│... │ 12  │     │ • Nando 🗑️         │
│  │ Ain         │ ○  │ ☀️│ ☀️│ ○ │ ☀️│... │ 10  │     │   Guru             │
│  └──────────────────────────────────────────────┘     │                    │
└─────────────────────────────────────────────────────────────────────────────┘

Keterangan:
☀️ = Sudah makan (tercatat)
○  = Belum makan / kosong
```

---

## 📱 Menginstall Aplikasi (PWA)

Aplikasi ini dapat diinstall ke perangkat Anda untuk akses yang lebih cepat dan dapat digunakan offline.

### Di Android (Chrome)
1. Buka aplikasi di browser Chrome
2. Ketuk ikon menu (⋮) di pojok kanan atas
3. Pilih **"Install app"** atau **"Add to Home Screen"**
4. Ketuk **"Install"** pada dialog konfirmasi
5. Aplikasi akan muncul di layar utama perangkat Anda

### Di iPhone/iPad (Safari)
1. Buka aplikasi di browser Safari
2. Ketuk ikon **Share** (kotak dengan panah ke atas) di bagian bawah
3. Scroll ke bawah dan pilih **"Add to Home Screen"**
4. Ketuk **"Add"** di pojok kanan atas
5. Aplikasi akan muncul di layar utama perangkat Anda

### Di Desktop (Chrome/Edge)
1. Buka aplikasi di browser
2. Klik ikon install (⊕) di address bar, atau
3. Klik menu (⋮) → **"Install Sistem Pendataan Makan..."**
4. Klik **"Install"** pada dialog konfirmasi

---

## 👥 Mengelola Data Guru

### 📸 Panel Daftar Guru

```
┌─────────────────────────────────┐
│  👥 Daftar Guru                 │
│  [+ Tambah Guru]                │
├─────────────────────────────────┤
│  • Ibu Yuli              🗑️     │
│    Kepala Sekolah               │
│  • April                 🗑️     │
│    Guru                         │
│  • Ain                   🗑️     │
│    Guru                         │
│  • Nando                 🗑️     │
│    Tendik                       │
└─────────────────────────────────┘
```

### Menambah Guru Baru
1. Lihat panel **"Daftar Guru"** di sebelah kanan
2. Klik tombol **"+ Tambah Guru"**
3. Isi nama guru pada kolom yang tersedia:

```
┌─────────────────────────────────┐
│  Tambah Guru Baru               │
├─────────────────────────────────┤
│  Nama: [________________]       │
│                                 │
│  Keterangan: [Pilih ▼]          │
│  ┌───────────────────────────┐  │
│  │ 👨‍🏫 Kepala Sekolah         │  │
│  │ 👤 Guru                   │  │
│  │ 👥 Tendik                 │  │
│  │ 🏥 Nakes                  │  │
│  │ 👑 Kepala Komite          │  │
│  └───────────────────────────┘  │
│                                 │
│  [Batal]      [Simpan]          │
└─────────────────────────────────┘
```

4. Pilih keterangan/peran:
   - 👨‍🏫 **Kepala Sekolah**
   - 👤 **Guru**
   - 👥 **Tendik** (Tenaga Kependidikan)
   - 🏥 **Nakes** (Tenaga Kesehatan)
   - 👑 **Kepala Komite**
5. Klik **"Simpan"**

### Menghapus Guru
1. Pada daftar guru, cari nama yang ingin dihapus
2. Klik ikon 🗑️ (tempat sampah) di sebelah kanan nama
3. Data guru akan terhapus beserta semua catatan makannya

---

## 📅 Memilih Periode (Bulan & Tahun)

```
┌─────────────────────────────────────────────────────────────┐
│  📅 Filter Periode: [Februari ▼] [2026 ▼]   [🔘 Hari Ini]   │
└─────────────────────────────────────────────────────────────┘
```

1. Di bagian atas halaman, temukan **"Filter Periode"**
2. Pilih **bulan** dari dropdown pertama
3. Pilih **tahun** dari dropdown kedua
4. Untuk kembali ke bulan ini, klik tombol **"Hari Ini"**

---

## 🍽️ Mencatat Data Makan

### Mode Individual (Default)
Gunakan mode ini untuk mencatat makan pada **satu tanggal spesifik**.

```
┌──────────────────────────────────────────────────────────────┐
│  🔍 [Cari nama...]   [Hari (5)]  [Individual]  [Export PDF]  │
│                                   ↑ Aktif                    │
└──────────────────────────────────────────────────────────────┘
```

1. Pastikan mode **"Individual"** aktif (tombol di header tabel)
2. Cari baris guru yang ingin dicatat
3. Klik pada sel tanggal yang diinginkan
4. ☀️ = Sudah makan | Kosong = Belum makan
5. Klik lagi untuk membatalkan

### Mode Bulk (Massal)
Gunakan mode ini untuk mencatat makan **beberapa minggu sekaligus** pada hari yang sama.

```
┌──────────────────────────────────────────────────────────────┐
│  🔍 [Cari nama...]   [Hari (5)]  [Bulk ✓]  [Export PDF]      │
│                                   ↑ Aktif (warna biru)       │
└──────────────────────────────────────────────────────────────┘
```

1. Klik tombol **"Bulk"** di header tabel untuk mengaktifkan mode massal
   - Tombol akan berubah menjadi **biru/aktif**

2. Klik tombol **"Hari (5)"** untuk membuka menu pemilihan hari:

```
┌───────────────────────────┐
│  [Hari (5) ▼]             │
├───────────────────────────┤
│  Sen-Jum          Semua   │  ← Pilih hari kerja saja
├───────────────────────────┤
│  ☑️ Senin                  │
│  ☑️ Selasa                 │
│  ☑️ Rabu                   │
│  ☑️ Kamis                  │
│  ☑️ Jumat                  │
│  ☐ Sabtu                  │
│  ☐ Minggu                 │
└───────────────────────────┘
```

3. Klik tombol **"Minggu (5)"** untuk memilih minggu mana saja:

```
┌───────────────────────────┐
│  [Minggu (5) ▼]           │
├───────────────────────────┤
│  ☑️ Minggu 1               │
│  ☑️ Minggu 2               │
│  ☑️ Minggu 3               │
│  ☑️ Minggu 4               │
│  ☑️ Minggu 5               │
├───────────────────────────┤
│  [Pilih Semua Minggu]     │
└───────────────────────────┘
```

4. Klik pada sel tanggal di baris guru yang diinginkan
5. Semua tanggal dengan **hari yang sama** pada **minggu yang dipilih** akan otomatis tercentang/tidak tercentang

**Contoh Penggunaan:**
```
Skenario: Guru April makan setiap Senin-Jumat selama 2 minggu pertama

1. Aktifkan mode "Bulk"
2. Pilih Minggu 1 dan 2 saja di menu "Minggu"
3. Pastikan Senin-Jumat terpilih di menu "Hari"
4. Klik salah satu tanggal Senin di baris April
   → Semua Senin di minggu 1 & 2 tercentang ☀️
5. Ulangi untuk Selasa, Rabu, Kamis, Jumat
   → Selesai! 10 hari terisi sekaligus
```

---

## 💰 Mengelola Status Pembayaran

```
┌─────────────────────────────────────────────────────────────┐
│ Nama        │ Sen│Sel│Rab│ ... │Total│ Tagihan   │ Status  │
│─────────────┼────┼───┼───┼─────┼─────┼───────────┼─────────│
│ April       │ ☀️ │ ☀️│ ☀️ │ ... │ 12  │ Rp 120.000│ [Lunas] │ ← Klik untuk ubah
│ Ain         │ ☀️ │ ○ │ ☀️ │ ... │ 10  │ Rp 100.000│ [Belum] │
└─────────────────────────────────────────────────────────────┘
```

1. Pada tabel data makan, lihat kolom **"Status"**
2. Klik badge status untuk mengubah:
   - 🟢 **Lunas** = Pembayaran sudah diterima
   - 🔴 **Belum** = Pembayaran belum diterima
3. Status akan berubah secara otomatis

---

## 📊 Melihat Ringkasan

### Kartu Statistik (Atas)

```
┌───────────┐  ┌───────────────────┐  ┌───────────┐  ┌─────────────────┐
│ Total     │  │ Data Makan        │  │ Februari  │  │ Total Iuran     │
│ Guru      │  │ Bulan Ini         │  │           │  │ Bulan Ini       │
│ 👥 18     │  │ 🍴 130            │  │ 📅 2026   │  │ 💰 Rp 1.300.000 │
└───────────┘  └───────────────────┘  └───────────┘  └─────────────────┘
```

- **Total Guru**: Jumlah guru terdaftar
- **Total Porsi**: Jumlah porsi makan bulan ini
- **Total Biaya**: Total tagihan bulan ini (Rp 10.000/porsi)

### Ringkasan Bulanan (Kanan Bawah)

```
┌─────────────────────────────────┐
│  📊 Ringkasan Februari 2026     │
├─────────────────────────────────┤
│  Ibu Yuli                       │
│  5 porsi × Rp 10.000            │
│  = Rp 50.000                    │
├─────────────────────────────────┤
│  April                          │
│  12 porsi × Rp 10.000           │
│  = Rp 120.000                   │
├─────────────────────────────────┤
│  ...                            │
├─────────────────────────────────┤
│  TOTAL: 130 porsi               │
│  Rp 1.300.000                   │
└─────────────────────────────────┘
```

- Daftar nama guru dengan jumlah porsi dan total tagihan masing-masing
- Total keseluruhan di bagian bawah

---

## 📄 Export Laporan PDF

```
┌────────────────────────────────────────────────────────────┐
│  📥 [Export PDF]  ← Klik tombol ini                        │
└────────────────────────────────────────────────────────────┘

File akan terunduh: "Laporan_Makan_Februari_2026.pdf"
```

1. Klik tombol **"Export PDF"** di bagian atas tabel
2. File PDF akan otomatis terunduh
3. PDF berisi:
   - Judul laporan dengan bulan dan tahun
   - Tabel lengkap: Nama, Keterangan, Jumlah Porsi, Total Tagihan, Status
   - Ringkasan total

---

## 💡 Tips Penggunaan

### Untuk Input Cepat
- Gunakan **Mode Bulk** untuk guru yang makan setiap hari kerja
- Pilih semua minggu, lalu klik satu tanggal per hari (Senin-Jumat)

### Untuk Koreksi
- Gunakan **Mode Individual** untuk mengubah tanggal spesifik
- Klik tanggal yang salah untuk membatalkan centang

### Untuk Pelacakan Pembayaran
- Update status pembayaran segera setelah menerima pembayaran
- Gunakan filter periode untuk melihat bulan-bulan sebelumnya

---

## ❓ FAQ (Pertanyaan Umum)

### Apakah data tersimpan otomatis?
Ya, setiap perubahan tersimpan otomatis ke database.

### Bisakah digunakan offline?
Ya, jika sudah diinstall sebagai aplikasi. Namun untuk sinkronisasi data memerlukan koneksi internet.

### Berapa harga per porsi?
Rp 10.000 per porsi makan.

### Bagaimana jika salah input?
Klik kembali sel yang salah untuk membatalkan, atau gunakan Mode Individual untuk koreksi spesifik.

---

## 📞 Bantuan

Jika mengalami kendala, silakan hubungi administrator sistem.

---

*Dokumen ini diperbarui: Februari 2026*
