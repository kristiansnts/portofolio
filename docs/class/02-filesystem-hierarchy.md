# Sesi 02 — Filesystem Hierarchy Linux

> **Minggu 1, Sesi 2 dari 12**
> **Estimasi: 3–4 hari (60–75 menit/hari)**

## Tujuan sesi ini

Akhir sesi ini kamu harus bisa:
- Ngejelasin kenapa Linux pakai struktur `/etc`, `/var`, `/home`, `/usr`, dll
- Tahu file apa yang harus dicari di folder mana pas debug masalah
- Paham bedanya `/bin`, `/sbin`, `/usr/bin`, `/usr/local/bin`
- Ngerasa familiar pas liat struktur folder root (gak bingung lagi "ini apaan")

Filosofi yang harus nancep: **Linux itu predictable**. Tiap folder punya peran spesifik yang konsisten lintas distro (Ubuntu, Debian, CentOS, Arch). Sekali kamu paham, kamu bisa navigate di server Linux manapun tanpa bingung.

---

## Estimasi waktu belajar

| Hari | Aktivitas | Durasi |
|------|-----------|--------|
| 1 | Eksplorasi struktur root, paham konsep FHS | 60 menit |
| 2 | Drill folder penting: `/etc`, `/home`, `/var` | 75 menit |
| 3 | Drill folder sistem: `/usr`, `/bin`, `/tmp`, `/dev`, `/proc` | 60 menit |
| 4 | Side project + review | 60 menit |

---

## Materi 1: Konsep FHS (Filesystem Hierarchy Standard)

Windows punya `C:\`, `C:\Users`, `C:\Windows`, `C:\Program Files`. Mac punya `/Applications`, `/Users`, `/System`. Linux punya **standar yang lebih ketat dan filosofis**, diatur di FHS (Filesystem Hierarchy Standard).

Coba liat root:

```bash
ls /
```

Output kira-kira:

```
bin   boot  dev  etc   home  lib   lib64
media  mnt  opt  proc  root  run   sbin
srv   sys  tmp  usr  var
```

Itu bukan random. Tiap folder punya peran. Yang **wajib** kamu hafal semantiknya (bukan hafal nama file di dalemnya):

| Folder | Isinya | Analogi |
|--------|--------|---------|
| `/etc` | File konfigurasi sistem & aplikasi | Kayak "Settings" Windows, tapi teks biasa |
| `/home` | Data user biasa, satu folder per user | Kayak `C:\Users\username` |
| `/var` | Data yang berubah-ubah (log, mail, cache, db) | Kayak `C:\ProgramData` |
| `/usr` | Aplikasi & library userland (read-only) | Kayak `C:\Program Files` |
| `/tmp` | File sementara, auto-dihapus saat reboot | RAM disk / scratch space |
| `/root` | Home directory user `root` (superuser) | Home-nya admin |
| `/bin` | Binary esensial (perintah dasar) | Folder `.exe` system |
| `/sbin` | System binaries (butuh root) | `.exe` admin-only |
| `/opt` | Aplikasi third-party optional | Kayak folder install custom |
| `/dev` | Device files (segala hardware dianggap file) | Unik Linux |
| `/proc` | Process & kernel info (virtual filesystem) | Unik Linux |
| `/sys` | Hardware info modern (virtual filesystem) | Unik Linux |
| `/mnt` | Mount point temporary (flashdisk, dll) | Drive letter di Windows |
| `/media` | Mount point auto (USB, CD) | Auto-mount drive |
| `/srv` | Data yang dilayankan (web, ftp) | Webroot misalnya |
| `/boot` | Kernel & bootloader files | Boot partition |

Kamu gak perlu hafal semuanya. Prioritas: `/etc`, `/home`, `/var`, `/usr`, `/tmp`, `/root`. Sisanya bakal sering ketemu waktu kerja nyata, hafal alami.

---

## Materi 2: `/etc` — Konfigurasi

Ini folder paling sering kamu buka waktu admin server. Semua konfigurasi sistem dan aplikasi disimpan di sini, biasanya dalam bentuk **teks biasa** (bukan binary, bukan registry).

Beberapa file/folder penting:

```bash
ls /etc
cat /etc/hostname         # nama komputer
cat /etc/os-release       # info distro
cat /etc/passwd           # daftar user (bukan password!)
ls /etc/ssh/              # config SSH server
ls /etc/nginx/            # config web server nginx (kalau terinstall)
ls /etc/systemd/system/   # config systemd services
```

**Filosofi kenapa konfigurasi di teks biasa:** ini warisan filosofi UNIX. Teks bisa dibaca `cat`, di-grep, di-diff, di-backup dengan `cp`, di-version-control dengan `git`. Konfigurasi Windows yang ada di registry jauh lebih susah di-manipulasi programmatically.

> **Tip:** `/etc/passwd` namanya menyesatkan. Itu cuma daftar user + info metadata (shell, home dir, user ID). Password asli (yang di-hash) ada di `/etc/shadow` yang hanya bisa dibaca root.

---

## Materi 3: `/home` — Data user

Tiap user biasa punya folder sendiri di `/home/<username>`. Ini area "kekuasaan penuh" kamu — kamu bebas ngapain aja di sini tanpa perlu `sudo`.

```bash
ls -la ~              # liat home sendiri
ls /home              # liat daftar user yang ada home-nya
```

Yang biasanya ada di home:

- `~/.bashrc` / `~/.zshrc` — config shell (akan dibahas Sesi 09)
- `~/.ssh/` — SSH keys & config (penting banget buat Sesi depan2)
- `~/.config/` — config aplikasi modern (mengikuti XDG standard)
- `~/.local/` — data lokal aplikasi (mengikuti XDG standard)
- `~/Documents`, `~/Downloads`, dll — folder default yang dibuat distro

File/folder yang diawali titik (`.`) disebut **hidden files**. Gak kelihatan di `ls` biasa, harus pakai `ls -a`.

> **Filosofi penting:** aplikasi yang benar (mengikuti XDG) menyimpan config di `~/.config/namaapp/` BUKAN nyampah di root home. Tapi banyak aplikasi lama yang masih nyampah di `~/.namaapp`. Makanya home lama-lama bakal penuh file hidden.

---

## Materi 4: `/var` — Data yang berubah

Nama `var` dari "variable". Ini tempat data yang terus berubah saat sistem jalan: log, mail queue, cache, database files.

```bash
ls /var
ls /var/log          # LOGS — folder paling sering dibuka waktu debugging
ls /var/cache        # cache aplikasi
ls /var/lib          # data state aplikasi (misal: /var/lib/mysql untuk MySQL)
ls /var/spool        # antrian (mail, cron, print)
```

**Yang paling penting buat sekarang: `/var/log`.** Ini tempat semua log sistem. Beberapa yang sering:

```bash
ls /var/log
# syslog atau messages — log sistem umum
# auth.log — log login & auth
# nginx/ — folder log nginx
# apache2/ — folder log apache
# dmesg — log kernel saat boot
```

Log ini akan jadi makanan sehari-hari kamu waktu kerja di server. Sesi 04 bakal bahas cara baca log pake `tail -f` secara realtime.

---

## Materi 5: `/usr` — Aplikasi userland

`/usr` itu kayak "second root". Aplikasi-aplikasi non-esensial disimpan di sini. Kenapa dipisah? Sejarah: dulu root disk kecil, jadi aplikasi user dipindah ke disk kedua yang di-mount di `/usr`.

```bash
ls /usr
ls /usr/bin          # binary aplikasi user (paling banyak isinya)
ls /usr/sbin         # binary admin
ls /usr/lib          # library
ls /usr/local        # aplikasi yang kamu install manual (bukan dari package manager)
ls /usr/share        # data read-only aplikasi (icon, doc, dll)
```

**Bedanya `/bin` vs `/usr/bin`:**
- `/bin` — binary esensial yang dibutuhkan sistem saat boot SINGLE-USER mode (sebelum `/usr` di-mount). Isinya: `ls`, `cat`, `cp`, `mv`, `bash`, dll.
- `/usr/bin` — binary aplikasi yang dibutuhkan saat sistem fully running. Isinya jauh lebih banyak: `git`, `python3`, `node`, `vim`, dll.

> **Fun fact:** distro modern (Ubuntu sejak 19.10, Arch, dll) udah lakukan `/usr merge` — semua isinya digabung ke `/usr/bin`, dan `/bin` dijadiin symlink ke `/usr/bin`. Tapi konsepnya tetep berguna untuk ngerti sejarah.

Cek sendiri:

```bash
ls -la /bin
# Output: lrwxrwxrwx 1 root root 7 ... /bin -> usr/bin
```

`l` di awal permission = symlink (shortcut ke folder lain).

---

## Materi 6: `/tmp` — Penyimpanan sementara

Tempat buat file sementara. Karakteristik:
- Siapapun bisa baca/tulis (permission longgar)
- **Auto-dihapus saat reboot** (jangan simpan hal penting di sini!)
- Beberapa distro pakai RAM disk (tmpfs), jadi sangat cepat tapi memori terbatas

Use case yang benar:
- Download file sementara buat diproses
- Tempat skrip naruh intermediate files
- Test file yang gak penting

Use case yang salah:
- Simpan backup
- Simpan file konfigurasi
- Naruh project yang "nanti dilanjut"

---

## Materi 7: Folder "virtual" — `/dev`, `/proc`, `/sys`

Ini unik Linux. Bukan folder berisi file asli, tapi **filesystem virtual yang di-generate kernel**.

### `/dev` — Semua device adalah file

Linux filosofi: segala hardware diakses sebagai file. Flashdisk muncul sebagai `/dev/sdb`, webcam sebagai `/dev/video0`, terminal sebagai `/dev/pts/0`, dll.

```bash
ls /dev
ls /dev/sd*        # hard disk / SSD
ls /dev/tty*       # terminal devices
```

### `/proc` — Info process & kernel

Setiap process punya folder `/proc/<pid>/` berisi info detailnya.

```bash
cat /proc/cpuinfo        # info CPU
cat /proc/meminfo        # info memory
cat /proc/uptime         # uptime sistem
ls /proc/1               # info process init (PID 1)
```

### `/sys` — Modern hardware info

Lebih terstruktur dari `/proc`, khusus hardware. Jarang kamu sentuh langsung, tapi tools seperti `udev` pakai ini.

---

## Materi 8: `/root` — Home superuser

Jangan tertukar dengan `/` (root filesystem). `/root` (dengan path lengkap) adalah home directory user `root`.

```bash
ls /root
# Permission denied kalau kamu user biasa
sudo ls /root          # bisa kalau kamu sudoer
```

Biasanya isinya: config shell root, history command root, SSH keys root. Disimpan terpisah dari `/home` untuk alasan security — bahkan kalau `/home` di-mount filesystem terpisah dan gagal, root tetap bisa login.

---

## Common pitfalls

### 1. Mengira `/root` = root filesystem

```
cd root          # SALAH — mencoba masuk ke folder "root" di folder sekarang
cd /             # BENAR — ini root filesystem
cd /root         # BENAR — ini home directory user root
```

Banyak newbie salah di sini. `/root` itu cuma satu folder spesifik.

### 2. Edit file di `/etc` tanpa sudo

```
bash: /etc/hosts: Permission denied
```

File di `/etc` milik root. Untuk edit, pakai `sudo`:

```bash
sudo nano /etc/hosts
```

(Bakal bahas editor di Sesi 10. Buat sekarang, pahami konsepnya.)

### 3. Hapus file di `/var/log` harapannya "mengosongkan disk"

Memang bisa, tapi beberapa service masih pegang file handle ke file itu. Disk space **tidak** benar-benar bebas sampai service di-restart. Cara benar: truncate (kosongkan isi tanpa hapus file-nya):

```bash
sudo truncate -s 0 /var/log/syslog
# atau
sudo sh -c '> /var/log/syslog'
```

### 4. Simpan file kerja di `/tmp`

Besok-besok hilang. Selalu simpan di `~/` atau folder project.

### 5. Bingung bedanya `/bin` dan `/usr/bin` waktu belajar perintah baru

Waktu mau cari binary `git` misalnya:

```bash
which git          # nunjukin lokasi binary
# /usr/bin/git (biasanya)
```

Kamu gak perlu hafal lokasi. Pakai `which` buat cari.

---

## Side project: "Jelajah sistem kamu sendiri"

### Brief

Eksplorasi sistem kamu sendiri dan dokumentasikan jawaban di file `~/belajar-linux/minggu-1/catatan/eksplorasi-sistem.md`. Buat file-nya pake command (bukan GUI):

```bash
# Buat folder kalau belum ada
mkdir -p ~/belajar-linux/minggu-1/catatan

# Cara gampang bikin file kosong (touch akan dibahas Sesi 03)
touch ~/belajar-linux/minggu-1/catatan/eksplorasi-sistem.md
```

Lalu buka file itu pake editor favorit (VS Code, nano, vim — bebas). Isi jawaban pertanyaan-pertanyaan ini, semuanya didapat dari eksplorasi terminal:

1. Apa hostname komputer kamu? (cari di `/etc`)
2. Distro apa yang kamu pakai dan versinya berapa? (cari di `/etc`)
3. Berapa banyak user yang ada di sistem kamu? Sebutkan username-nya. (cari di `/etc/passwd`)
4. Apa shell default user kamu? (kolom terakhir di `/etc/passwd` untuk baris user kamu)
5. Sebutkan 5 file log yang ada di `/var/log` (atau folder di dalamnya).
6. Apa lokasi binary `python3` (atau `python` kalau belum ada python3) di sistem kamu? Pakai `which`.
7. Cek di `/proc/cpuinfo`: berapa core CPU kamu?
8. Apakah `/bin` di sistem kamu symlink atau folder asli? Bagaimana kamu tahu?
9. Sebutkan 3 aplikasi yang punya config di `/etc` (liat folder / file yang nama-nya familiar).
10. Berapa ukuran total folder `/var/log`? (hint: pakai `du -sh /var/log`)

<details>
<summary>Solusi (klik expand — tapi coba dulu)</summary>

Contoh jawaban (output bisa beda di sistem kamu):

```bash
# 1. Hostname
cat /etc/hostname
# Output: mymachine

# 2. Distro
cat /etc/os-release
# Output (Ubuntu 22.04):
# PRETTY_NAME="Ubuntu 22.04.3 LTS"
# NAME="Ubuntu"
# VERSION_ID="22.04"
# ...

# 3 & 4. Daftar user + shell default
cat /etc/passwd | head -20
# Format: username:x:uid:gid:comment:home:shell
# Baris untuk user kamu:
# username:x:1000:1000:Username,,,:/home/username:/bin/bash
# Shell default = /bin/bash

# 5. File log
ls /var/log
# Contoh: syslog, auth.log, dmesg, kern.log, alternatives.log

# 6. Lokasi python
which python3
# /usr/bin/python3

# 7. Jumlah core CPU
grep -c ^processor /proc/cpuinfo
# Atau lihat langsung
cat /proc/cpuinfo | head -30

# 8. Apakah /bin symlink?
ls -la / | grep bin
# lrwxrwxrwx ... /bin -> usr/bin  (symlink, kalau distro modern)
# drwxr-xr-x ... bin               (folder asli, kalau distro lama)

# 9. Aplikasi dengan config di /etc
ls /etc
# Contoh: ssh/ (SSH server), nginx/ (kalau ada), apt/ (package manager)

# 10. Ukuran /var/log
sudo du -sh /var/log
# Output kira-kira: 12M /var/log
```

Notes:
- `head -20` = ambil 20 baris pertama (akan dibahas Sesi 04)
- `grep -c` = hitung jumlah match (akan dibahas Sesi 05)
- `du` = disk usage, `-sh` = summary + human-readable

</details>

---

## Tantangan ekstra (opsional)

- Bandingkan struktur `/` di WSL Ubuntu dengan struktur `/` di Mac (kalau kamu punya akses ke Mac). Apa yang sama? Apa yang beda?
- Coba install aplikasi baru (misal `htop` — `sudo apt install htop`) lalu cek di mana binary-nya (`which htop`) dan di mana config-nya kalau ada (`ls /etc | grep htop`).
- Baca manual FHS: `man hier`. Ini dokumentasi resmi struktur direktori Linux.

---

## Tanda kelar

- [ ] Saya bisa jelasin bedanya `/etc`, `/home`, `/var`, `/usr`, `/tmp` tanpa liat materi
- [ ] Saya tahu kemana harus liat kalau sistem error: log ada di `/var/log`, config di `/etc`
- [ ] Saya tahu bedanya `/bin` dan `/usr/bin`, dan kenapa beberapa distro udah merge keduanya
- [ ] Saya ngerti `/proc` dan `/dev` itu filesystem virtual, bukan file asli di disk
- [ ] Saya ngerti bedanya `/` (root filesystem) dan `/root` (home user root)
- [ ] Saya pernah cek `/etc/hostname`, `/etc/os-release`, dan `/etc/passwd` di sistem sendiri
- [ ] Saya tahu file yang diawali `.` di home directory itu biasanya config, dan cara liatnya `ls -a`

Kalau semua centang, lanjut Sesi 03.

---

**Next:** `03-manipulasi-file.md` — kita bakal mulai "ngutak-atik" filesystem: bikin folder, file, copy, pindah, hapus. Termasuk latihan mental penting: **rm itu permanen, gak ada recycle bin.**
