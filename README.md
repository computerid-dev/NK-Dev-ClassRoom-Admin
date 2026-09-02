# NK-Dev ClassRoom — Web Admin (privat)

Panel superadmin terpisah dari situs utama, cuma buat kamu (owner). Deploy
sebagai project Vercel sendiri, beda domain dari situs murid/guru.

## Kenapa terpisah

Sama seperti pola EchoNote dan Grub-Community kamu: situs utama publik buat
guru/murid, situs admin ini privat cuma buat kamu kelola semuanya dari luar
tanpa harus jadi member sebuah room dulu.

## Setup

1. **Pakai Firebase project yang SAMA** dengan situs utama (`classroom-142eb`).
   `src/scripts/firebase-config.js` di sini sudah kesalin otomatis, tapi cek
   ulang kalau kamu ganti config di situs utama.
2. Daftar 1 akun biasa dulu lewat situs **utama** (index.html NK-Dev
   ClassRoom, bukan situs admin ini) — bebas mau role guru atau murid, ini
   cuma buat dapetin akun Firebase Auth kamu.
3. Buka Firebase Console → Authentication → Users → copy **User UID** akun
   kamu tadi.
4. Tempel UID itu ke `src/scripts/admin-config.js`, ganti nilai `OWNER_UID`.
5. Deploy folder ini (`webadmin/`) sebagai **project Vercel terpisah** dari
   situs utama, misal jadi `admin-nkdevclassroom.vercel.app`.

Setelah itu, cuma akun dengan UID itu yang bisa login dan masuk dashboard;
akun lain yang coba login otomatis ditolak & di-signout.

## Fitur

- **Kelola Pengguna** — lihat semua guru & murid, cari nama/email, blokir /
  buka blokir akun (akun yang diblokir otomatis ke-signout & ditolak masuk
  situs utama).
- **Kelola Room** — lihat semua room di seluruh sistem, lihat detail
  (password kelas, key kedua, daftar anggota), kick anggota siapa pun
  (termasuk admin utama, karena ini akses owner), atau hapus room beserta
  semua pesannya.

## ⚠️ Keamanan — WAJIB dibaca

Pengecekan `OWNER_UID` di atas cuma proteksi di sisi tampilan (client). Kalau
ada yang cukup jago, dia bisa langsung akses Firestore lewat SDK dan
lewatin proteksi ini. Supaya beneran aman, tambahkan Firestore Rules yang
mengunci operasi sensitif (blokir user, hapus room) hanya untuk UID kamu:

```
match /databases/{database}/documents {
  match /users/{userId} {
    allow update: if request.auth.uid == userId
      || (request.auth.uid == "GANTI_DENGAN_UID_KAMU"
          && request.resource.data.diff(resource.data).affectedKeys().hasOnly(["blocked"]));
  }
  match /rooms/{roomId} {
    allow delete: if request.auth.uid == "GANTI_DENGAN_UID_KAMU";
  }
}
```

Gabungkan aturan ini dengan rules situs utama di `README.md` folder
`webkelas/`.
