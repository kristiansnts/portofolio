# Sesi 06 — Permissions: `chmod`, `chown`, rwx, dan Oktal

> **Minggu 3, Sesi 6 dari 12**
> **Estimasi: 4–5 hari (75–90 menit/hari)**

## Tujuan sesi ini

Akhir sesi ini kamu harus bisa:
- Baca output `ls -l` dan langsung paham permission setiap file
- Konversi `rwxr-xr-x` ke oktal `755` dan sebaliknya, tanpa mikir lama
- Ubah permission pake `chmod` (symbolic dan numeric mode)
- Ubah owner pake `chown`
- Paham konsep user, group, others dan kenapa ini penting di server multi-user
- Ngerti kapan pakai `sudo`, dan kenapa `chmod 777` hampir selalu ide buruk

Permission adalah **konsep fundamental** Linux. Banyak hal yang gak jalan di server cuma karena permission salah. Kalau kamu paham sesi ini, kamu bisa debug 30% masalah server sendiri.

---

## Estimasi waktu belajar

| Hari | Aktivitas | Durasi |
|------|-----------|--------|
| 1 | Konsep user/group/others + baca `ls -l` permission | 75 menit |
| 2 | Oktal — konversi rwx ke angka | 75 menit |
| 3 | `chmod` symbolic + numeric + recursive | 90 menit |
| 4 | `chown`, `chgrp`, `sudo`, special permissions | 75 menit |
| 5 | Side project + review | 75 menit |

---

## Materi 1: Konsep dasar — User, Group, Others

Linux itu multi-user sejak desain awal. Tiap file punya 3 kategori yang punya hak berbeda:

| Kategori | Arti |
|----------|------|
| **User (owner)** | User yang memiliki file |
| **Group** | Group yang memiliki file (satu user bisa di banyak group) |
| **Others** | Semua user lain di sistem |

Plus superuser `root` yang bypass semua permission.

Cek user kamu dan group kamu:

```bash
whoami              # user kamu
groups              # group-group kamu
id                  # detail uid, gid, groups
```

Contoh output `id`:

```
uid=1000(budi) gid=1000(budi) groups=1000(budi),4(adm),27(sudo),120(docker)
```

Artinya user `budi` ada di groups: `budi` (utama), `adm` (bisa baca log), `sudo` (bisa jadi root), `docker` (bisa pakai docker tanpa sudo).

---

## Materi 2: Membaca permission di `ls -l`

```bash
ls -l catatan.txt
# -rw-r--r-- 1 budi budi 1024 Nov 12 14:30 catatan.txt
```

Kolom pertama (`-rw-r--r--`) itu 10 karakter yang encode tipe + permission:

```
- r w x r w x r w x
^ ^         ^         ^
| |         |         |
| |         |         others
| |         group
| owner
tipe file (- = file biasa, d = directory, l = symlink)
```

Mari bedah `-rw-r--r--`:

| Posisi | Char | Arti |
|--------|------|------|
| 1 | `-` | File biasa (bukan directory/symlink) |
| 2-4 | `rw-` | Owner: bisa baca (r), bisa tulis (w), TIDAK bisa eksekusi (-) |
| 5-7 | `r--` | Group: hanya baca |
| 8-10 | `r--` | Others: hanya baca |

### Arti rwx di FILE vs DIRECTORY

| Char | File | Directory |
|------|------|-----------|
| `r` | Baca isi file | Bisa `ls` isi folder |
| `w` | Ubah isi file | Bisa tambah/hapus file di dalam |
| `x` | Eksekusi file (kalau binary/script) | Bisa `cd` ke folder, akses file di dalamnya |

**Penting:** `x` di directory = bisa masuk. Tanpa `x`, kamu gak bisa `cd` walaupun punya `r`.

Contoh:

```bash
mkdir testdir
touch testdir/file.txt
chmod 000 testdir     # hilangin semua permission

ls testdir            # Permission denied (gak ada r)
cd testdir            # Permission denied (gak ada x)

chmod 400 testdir     # hanya r
ls testdir            # OK (tapi gak bisa ls -l detail)
cd testdir            # Permission denied (gak ada x)

chmod 500 testdir     # r+x
ls testdir            # OK
cd testdir            # OK
cat file.txt          # Permission denied (gak punya r di file.txt)
```

---

## Materi 3: Oktal — Konversi rwx ke angka

Setiap kategori (owner/group/others) punya 3 bit: r, w, x. Bit yang on = 1, off = 0. Konversi ke oktal:

| Permission | Binary | Oktal |
|------------|--------|-------|
| `---` | 000 | 0 |
| `--x` | 001 | 1 |
| `-w-` | 010 | 2 |
| `-wx` | 011 | 3 |
| `r--` | 100 | 4 |
| `r-x` | 101 | 5 |
| `rw-` | 110 | 6 |
| `rwx` | 111 | 7 |

Jadi `rwxr-xr-x` = `7` (rwx) + `5` (r-x) + `5` (r-x) = **755**.

### Angka yang sering muncul (hafalkan ini)

| Oktal | Permission | Use case |
|-------|------------|----------|
| `755` | `rwxr-xr-x` | Executable / folder yang bisa diakses semua user |
| `644` | `rw-r--r--` | File konfigurasi/publik yang bisa dibaca semua |
| `700` | `rwx------` | Folder private (misal `~/.ssh/`) |
| `600` | `rw-------` | File private (misal SSH private key) |
| `777` | `rwxrwxrwx` | **HINDARI** — semua user bisa apa aja |
| `666` | `rw-rw-rw-` | **HINDARI** — semua user bisa edit |
| `750` | `rwxr-x---` | Group bisa baca+eksekusi, others gak bisa apa-apa |
| `640` | `rw-r-----` | Group bisa baca, others gak bisa apa-apa |

Hafalkan 4 baris pertama (755, 644, 700, 600) — itu 90% yang kamu pakai sehari-hari.

### Cara cepat konversi

Mental shortcut:
- `r` = 4
- `w` = 2
- `x` = 1
- Jumlahkan untuk dapat oktal per kategori

Contoh: `rw-r--r--` = (4+2+0) (4+0+0) (4+0+0) = 644.

---

## Materi 4: `chmod` — Change Mode

### Mode simbolik

```bash
# Tambah permission
chmod u+x file         # owner: tambah execute
chmod g+w file         # group: tambah write
chmod o+r file         # others: tambah read
chmod a+r file         # all: tambah read (a = u+g+o)
chmod u+rwx file       # owner: tambah rwx

# Hapus permission
chmod u-x file         # owner: hapus execute
chmod go-w file        # group+others: hapus write

# Set exact
chmod u=rwx,g=rx,o= file  # set exact: owner rwx, group r-x, others ---
chmod a=r file           # semua jadi read-only

# Kombinasi
chmod u+x,g+w file     # beberapa perubahan sekaligus
```

Huruf simbol:
- `u` user/owner
- `g` group
- `o` others
- `a` all (u+g+o)
- `+` tambah
- `-` hapus
- `=` set exact

### Mode numerik (oktal)

```bash
chmod 755 file         # rwxr-xr-x
chmod 644 file         # rw-r--r--
chmod 600 file         # rw-------
chmod 700 folder/      # rwx------
```

**Pilih mode mana?**
- **Numerik:** kalau kamu mau set exact permission. Cepat, jelas.
- **Simbolik:** kalau kamu mau tweak satu permission tanpa ganggu yang lain.

Contoh bedanya:

```bash
# File sekarang: rw-r--r-- (644)
chmod 700 file    # jadi rwx------  (NUMERIC: reset total)
chmod u+x file    # jadi rwxr--r--  (SIMBOLIK: cuma tambah x di owner)
```

### Recursive — `-R`

```bash
chmod -R 755 folder/    # semua file & subfolder jadi 755
```

**HATI-HATI:** ini jarang yang kamu mau. File biasanya gak butuh `x`, cuma folder yang butuh `x`. Lebih baik:

```bash
# Folder jadi 755, file tetap 644
find folder/ -type d -exec chmod 755 {} +
find folder/ -type f -exec chmod 644 {} +
```

(Biasanya folder 755, file 644 — pola standar web server).

### `chmod` dengan reference file

```bash
chmod --reference=source.txt target.txt
# Permission target.txt = permission source.txt
```

Berguna kalau kamu mau konsisten permission banyak file.

---

## Materi 5: `chown` — Change Owner

```bash
# Ubah owner
sudo chown budi file.txt

# Ubah owner DAN group
sudo chown budi:staff file.txt

# Ubah group saja (alternatif: chgrp)
sudo chown :staff file.txt
sudo chgrp staff file.txt

# Recursive
sudo chown -R budi:staff folder/

# Reference
sudo chown --reference=source.txt target.txt
```

> **Kenapa butuh `sudo`?** User biasa gak bisa kasih file miliknya ke user lain (kalau bisa, bisa skip quota system). Hanya root yang bisa `chown`. Tapi user bisa `chgrp` ke group lain yang dia anggotanya.

### `chgrp` — singkat untuk change group

```bash
chgrp staff file.txt       # sama dengan chown :staff file.txt
```

---

## Materi 6: `sudo` — Super User DO

`sudo` = jalanin command sebagai root (atau user lain). Berguna banget tapi berbahaya kalau disalahgunakan.

```bash
# Edit file system
sudo nano /etc/hosts

# Install paket
sudo apt update
sudo apt install nginx

# Restart service
sudo systemctl restart nginx

# Buka shell sebagai root (hati-hati)
sudo -i                  # login shell sebagai root
sudo su                  # sama, lebih eksplisit
```

Cek privilege sudo kamu:

```bash
sudo -l
# Output: list command yang boleh kamu sudo
```

### Aturan main `sudo`

1. **Jangan pernah `sudo` command yang gak kamu ngerti.** Root bisa ngerusak sistem dengan satu command.
2. **`sudo` gak butuh password tiap kali** — biasanya disimpan 15 menit setelah diketik sekali. Jangan lupa lock screen kalau tinggal laptop.
3. **Jangan biasa `sudo su` lalu kerja lama sebagai root.** Terlalu mudah salah.
4. **Beberapa distro (Ubuntu) kunci user root** — login sebagai root disabled, semua via `sudo`. Ini good practice.
5. **Production server:** pakai `sudo` dengan log. Setiap `sudo` di-log di `/var/log/auth.log`.

---

## Materi 7: Special permissions — `setuid`, `setgid`, `sticky bit`

Lihat di `ls -l`:

```
-rwsr-xr-x 1 root root  ... /usr/bin/sudo
-rwxr-sr-x 1 root shadow ... /usr/bin/wall
drwxrwxrwt 10 root root  ... /tmp
```

Notice: `s` di posisi x owner, `s` di posisi x group, `t` di posisi x others.

### `setuid` (4xxx) — bit `s` di posisi owner

File dengan `setuid` dijalankan sebagai owner file, bukan sebagai user yang jalanin.

```bash
ls -l /usr/bin/passwd
# -rwsr-xr-x 1 root root ... /usr/bin/passwd
```

`passwd` butuh akses ke `/etc/shadow` (root only). Tapi user biasa perlu ganti password sendiri. Solusi: `setuid` — saat user biasa jalanin `passwd`, program jalan sebagai root.

Setup:

```bash
sudo chmod u+s myprogram
# atau
sudo chmod 4755 myprogram
```

> **SECURITY WARNING:** `setuid` root di program yang punya bug = privilege escalation. Jangan asal set. Sangat jarang kamu butuh ini sebagai dev.

### `setgid` (2xxx) — bit `s` di posisi group

Di **file**: jalan sebagai group owner. Di **directory**: file baru yang dibuat di folder mewarisi group folder (bukan group user pembuat).

```bash
# Folder shared untuk team
sudo mkdir /shared
sudo chown :team /shared
sudo chmod 2775 /shared     # setgid + rwxrwsr-x

# Sekarang file yang dibuat di /shared oleh siapapun akan punya group "team"
touch /shared/file.txt
ls -l /shared/file.txt
# -rw-r--r-- 1 budi team ... file.txt  (group = team, walau dibuat budi)
```

### `sticky bit` (1xxx) — bit `t` di posisi others

Hanya pemilik file (atau root) yang bisa hapus file di folder dengan sticky bit. Classic example: `/tmp`.

```bash
ls -ld /tmp
# drwxrwxrwt 10 root root ... /tmp
```

`/tmp` bisa ditulis siapapun (rwxrwxrwx), tapi user A gak bisa hapus file user B karena sticky bit.

Setup:

```bash
sudo chmod +t folder/
# atau
sudo chmod 1777 folder/
```

### Oktal dengan special bit

| Oktal | Arti |
|-------|------|
| `4755` | setuid + rwxr-xr-x |
| `2755` | setgid + rwxr-xr-x |
| `1777` | sticky + rwxrwxrwx |
| `6755` | setuid + setgid + rwxr-xr-x |

---

## Materi 8: `umask` — Default permission

Saat kamu `touch file.txt`, default permission-nya 644 (atau 666 & ~umask). Saat `mkdir folder/`, default 755 (atau 777 & ~umask).

Cek umask:

```bash
umask
# 0022 (atau 022)
```

Artinya: file baru = 666 & ~022 = 644. Folder baru = 777 & ~022 = 755.

Ubah umask (untuk session ini saja):

```bash
umask 077     # file = 600, folder = 700 (private)
umask 022     # balik ke default
```

Untuk permanen, tambah `umask 022` di `~/.bashrc`.

---

## Common pitfalls

### 1. `chmod 777` untuk "biar gak error"

```bash
sudo chmod 777 /var/www/html
# Work, tapi ini security hole. Siapapun bisa edit/delete file web kamu.
```

Always prefer least privilege:
- Web folder: `755` (folder) + `644` (file)
- Private key: `600`
- Config sensitif: `640`

### 2. Lupa `-R` padahal mau recursive

```bash
chmod 755 folder/      # cuma folder itu, isinya gak berubah
chmod -R 755 folder/   # baru recursive
```

### 3. `chmod` di symlink gak ngaruh ke target

```bash
chmod 755 symlink      # ubah permission symlink (gak relevan)
chmod 755 target_file  # yang kamu butuh
chmod -h 755 symlink   # flag -h = ubah symlink itu sendiri (jarang dibutuhkan)
```

### 4. `chown` tanpa `:` bikin bingung

```bash
chown budi file.txt      # ubah owner = budi, group tetap
chown budi: file.txt     # ubah owner = budi, group = budi's default group
chown :staff file.txt    # group = staff, owner tetap
chown budi:staff file    # owner = budi, group = staff
```

### 5. Folder tanpa `x` = gak bisa diakses sama sekali

```bash
chmod 444 folder    # hanya r, gak ada x
cd folder           # Permission denied
ls folder           # OK list nama, tapi gak bisa stat detail
```

Folder butuh `x` untuk dipakai. Pola umum: folder = 755 (atau 700), file = 644 (atau 600).

### 6. File executable gak jalan walau `chmod +x`

```bash
./script.sh
# bash: ./script.sh: /bin/bash^M: bad interpreter
```

Itu bukan masalah permission. Itu masalah **line ending** — file dibuat di Windows (CRLF), Linux expect LF. Fix:

```bash
sed -i 's/\r$//' script.sh
# atau
dos2unix script.sh
```

### 7. `sudo chmod` gak bisa ubah file di filesystem read-only

```bash
sudo chmod 755 /sys/something
# chmod: changing permissions of '/sys/something': Operation not permitted
```

`/sys` dan `/proc` adalah virtual filesystem yang di-generate kernel. Kamu gak bisa chmod file di sana.

### 8. Permission salah setelah `cp`

Default `cp` pakai umask kamu, BUKAN permission source. Kalau mau preserve:

```bash
cp -p source.txt target.txt    # preserve permission, owner, timestamp
```

### 9. Aplikasi menolak file config karena permission longgar

Banyak aplikasi yang menyimpan file sensitif (private key, API key, token) akan menolak jalan kalau file itu permission-nya terlalu longgar. Contoh:

```bash
some-app --config ~/.app/secret.key
# Error: Permissions for 'secret.key' are too open.
# It is required that your private key files are NOT accessible by others.
```

Fix:

```bash
chmod 600 ~/.app/secret.key
```

Pola umum: file sensitif = 600, folder sensitif = 700. Aplikasi yang bener melakukan security check akan menolak file yang group/others bisa baca.

---

## Side project: "Setup web server folder structure"

### Brief

Kamu bakal simulasi setup folder untuk web server yang multi-user. Generate struktur dummy dulu:

```bash
# Setup
mkdir -p ~/belajar-linux/minggu-3/latihan/webserver
cd ~/belajar-linux/minggu-3/latihan/webserver

# Generate struktur
mkdir -p public_html private logs uploads
touch public_html/index.html public_html/about.html public_html/style.css
touch private/config.yml private/db_password.txt
touch uploads/photo1.jpg uploads/photo2.jpg

# Bikin script shell palsu
cat > public_html/cgi-bin.sh << 'EOF'
#!/bin/bash
echo "Content-Type: text/html"
echo ""
echo "<h1>Hello from CGI</h1>"
EOF

# Tanpa permission eksekusi dulu

# Bikin beberapa file dummy di logs (akan diisi)
echo "2024-01-01 10:00 INFO: server started" > logs/access.log
echo "2024-01-01 10:05 ERROR: missing file" > logs/error.log
```

Sekarang lakukan misi berikut **semua lewat terminal**:

1. Cek permission awal semua file & folder. Catat di notes.
2. Set permission yang benar untuk web server:
   - Folder `public_html` dan isinya: 755 (folder), 644 (file)
   - Folder `private` dan isinya: 700 (folder), 600 (file)
   - Folder `logs` dan isinya: 750 (folder), 640 (file)
   - Folder `uploads` dan isinya: 775 (folder), 664 (file)
3. Bikin script `cgi-bin.sh` bisa dieksekusi (tapi jangan 777!)
4. Verify dengan `ls -l` bahwa semua permission sudah benar
5. Simulasi "wrong setup":
   - Bikin folder `bad-example/` dengan permission 777
   - Bikin file `bad-example/secret.txt` dengan permission 666
   - Coba akses sebagai user lain (pakai `sudo -u nobody cat bad-example/secret.txt`)
   - Catat apa yang terjadi
6. Permission puzzle: 
   - Bikin file `puzzle.txt` dengan permission `rw-r-----` (640)
   - Coba baca sebagai owner, sebagai group member, sebagai user lain (pakai `sudo -u`)
   - Catat hasilnya
7. Sticky bit demo:
   - Bikin folder `shared/` dengan permission 1777
   - Bikin file di dalam sebagai user A (kamu)
   - Bikin file di dalam sebagai user B (`sudo -u nobody`)
   - Coba hapus file user B sebagai user A — harusnya gagal
8. Setup folder `~/.private-config/` dengan permission yang benar (latihan pola yang sama dipakai banyak aplikasi untuk menyimpan config sensitif — misal SSH keys, API keys, dll):
   - Bikin folder `~/.private-config/` dengan permission 700
   - Bikin file `~/.private-config/api-key.txt` kosong dengan permission 600
   - Bikin file `~/.private-config/secrets.env` kosong dengan permission 600
   - Verify

<details>
<summary>Solusi (klik expand)</summary>

```bash
cd ~/belajar-linux/minggu-3/latihan/webserver

# 1. Cek permission awal
ls -la
ls -la public_html private logs uploads

# 2. Set permission web server
# public_html
chmod 755 public_html
find public_html -type d -exec chmod 755 {} +
find public_html -type f -exec chmod 644 {} +

# private
chmod 700 private
find private -type d -exec chmod 700 {} +
find private -type f -exec chmod 600 {} +

# logs
chmod 750 logs
find logs -type d -exec chmod 750 {} +
find logs -type f -exec chmod 640 {} +

# uploads
chmod 775 uploads
find uploads -type d -exec chmod 775 {} +
find uploads -type f -exec chmod 664 {} +

# 3. cgi-bin.sh executable
chmod 755 public_html/cgi-bin.sh
# Atau pakai symbolic:
chmod +x public_html/cgi-bin.sh

# 4. Verify
ls -la public_html
ls -la private
ls -la logs
ls -la uploads

# 5. Wrong setup demo
mkdir bad-example
chmod 777 bad-example
echo "this is a secret" > bad-example/secret.txt
chmod 666 bad-example/secret.txt
ls -la bad-example/

# Coba akses sebagai user nobody (di WSL mungkin perlu pakai user lain yang ada)
# Kalau ada user lain di sistem:
sudo -u nobody cat bad-example/secret.txt
# Output: this is a secret (BERHASIL dibaca — security hole!)

# 6. Permission puzzle
touch puzzle.txt
chmod 640 puzzle.txt
echo "puzzle content" > puzzle.txt
ls -l puzzle.txt
# -rw-r----- 1 budi budi ... puzzle.txt

# Coba sebagai user lain:
sudo -u nobody cat puzzle.txt
# cat: puzzle.txt: Permission denied (others gak bisa baca)

# 7. Sticky bit demo
mkdir shared
chmod 1777 shared
ls -ld shared    # drwxrwxrwt

# Bikin file sebagai diri sendiri
echo "file saya" > shared/mine.txt

# Bikin file sebagai user lain (nobody)
sudo -u nobody bash -c 'echo "file nobody" > shared/nobody.txt'

ls -la shared/
# -rw-r--r-- 1 budi    budi    ... mine.txt
# -rw-r--r-- 1 nobody  nogroup ... nobody.txt

# Coba hapus file nobody sebagai budi:
rm shared/nobody.txt
# rm: cannot remove 'shared/nobody.txt': Operation not permitted
# Sticky bit bekerja!

# 8. Private config folder setup
mkdir -p ~/.private-config
chmod 700 ~/.private-config
touch ~/.private-config/api-key.txt
chmod 600 ~/.private-config/api-key.txt
touch ~/.private-config/secrets.env
chmod 600 ~/.private-config/secrets.env
ls -la ~/.private-config
# drwx------ 2 budi budi 4096 ... .
# -rw------- 1 budi budi    0 ... api-key.txt
# -rw------- 1 budi budi    0 ... secrets.env
```

Catatan:
- User `nobody` biasanya ada di sistem Linux/WSL. Kalau gak ada, pakai user lain.
- Di Mac, `sudo -u nobody` mungkin gak work. Pakai `su nobody -c "command"` sebagai alternatif.

</details>

---

## Tantangan ekstra (opsional)

- Cari semua file di `/etc` yang permission-nya 777 (potensi security issue). Hint: `sudo find /etc -perm 777`. Apa yang kamu temukan?
- Cari semua file di `/home` yang bisa dieksekusi oleh others (`-perm -o+x`). Ini potensi privacy issue.
- Pelajari `getfacl` dan `setfacl` — ACL (Access Control List) yang lebih granular dari Unix permission tradisional. Install: `sudo apt install acl`.
- Setup folder shared untuk team simulasi: bikin group `devs`, tambah 2 user dummy ke group, bikin folder `/srv/projects` dengan `setgid` biar file yang dibuat otomatis group `devs`. Test dari user berbeda.

---

## Tanda kelar

- [ ] Saya bisa baca `ls -l` output dan langsung paham permission-nya
- [ ] Saya bisa konversi `rwxr-xr-x` ke `755` dan sebaliknya, cepat
- [ ] Saya tahu bedanya `r` di file vs `r` di directory
- [ ] Saya tahu kenapa folder butuh `x` untuk bisa di-`cd`
- [ ] Saya bisa pakai `chmod` baik mode simbolik maupun numerik
- [ ] Saya tahu kapan pakai `chmod -R` dan kenapa harus hati-hati
- [ ] Saya bisa pakai `chown` untuk ubah owner dan group
- [ ] Saya tahu kapan harus pakai `sudo` dan kapan jangan
- [ ] Saya paham `setuid`, `setgid`, `sticky bit` dan use case-nya
- [ ] Saya tahu permission standard untuk: file sensitif (600), folder web (755), file web (644), folder private (700)
- [ ] Saya pernah setup folder private (`~/.private-config/` atau sejenis) dengan permission yang benar

Kalau ada yang belum centang, ulang dulu. Sesi depan asumsi kamu udah lancar permission.

---

**Next:** `07-process-management.md` — `ps`, `top/htop`, `kill`. Kamu bakal bisa lihat proses apa yang jalan di sistem, mana yang ngabisin CPU/memory, dan cara mematikannya dengan elegan (atau paksa kalau bandel).
