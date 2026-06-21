# Sesi 01 — Setup Environment & Navigasi Dasar

> **Minggu 1, Sesi 1 dari 12**
> **Estimasi: 4–5 hari (60–90 menit/hari)**

## Tujuan sesi ini

Akhir sesi ini kamu harus bisa:
- Punya terminal Linux yang siap tempur (WSL / native / Mac)
- Ngitung posisi kamu di filesystem pake `pwd`
- Liat isi folder pake `ls` dan variasinya
- Pindah folder pake `cd` tanpa mikir
- Ngerti perbedaan path absolut vs relatif

Ini fondasi semuanya. Kalau kamu masih bingung "sekarang saya ada di folder mana", sesi berikutnya bakal terasa kayak main game tanpa map.

---

## Estimasi waktu belajar

| Hari | Aktivitas | Durasi |
|------|-----------|--------|
| 1 | Setup environment (install WSL / verifikasi native Linux) + kenalan prompt | 45–60 menit |
| 2 | Praktik `pwd` + `ls` dan semua variasi flag-nya | 60 menit |
| 3 | Praktik `cd` — absolut, relatif, `..`, `~`, `-` | 60 menit |
| 4 | Side project + ulang materi | 60 menit |
| 5 | (Opsional) Tantangan ekstra + review | 30–45 menit |

---

## Materi 1: Setup environment

### Windows — Install WSL2

Buka **PowerShell sebagai Administrator** (klik kanan PowerShell → Run as administrator), lalu:

```powershell
wsl --install
```

Restart komputer. Setelah restart, window Ubuntu bakal muncul sendiri dan minta kamu bikin username + password. **Password yang kamu masukin ini gak kelihatan saat diketik** — itu normal, bukan bug. Ketik aja, tekan Enter.

Verifikasi sukses:

```bash
# Di dalam WSL
uname -a
# Output kira-kira: Linux DESKTOP-XXXX 5.15.x.x-microsoft-standard-WSL2 ...
```

> **Tips:** kalau setelah install kamu belum punya Ubuntu, jalankan `wsl --install -d Ubuntu-22.04`. Versi 22.04 LTS paling stabil buat belajar.

### Mac — Verifikasi

Mac udah punya Terminal bawaan (Applications → Utilities → Terminal). Recommended install iTerm2:

```bash
# Install Homebrew dulu kalau belum
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install iTerm2
brew install --cask iterm2
```

Cek shell yang dipakai:

```bash
echo $SHELL
# Biasanya /bin/zsh di Mac modern, /bin/bash di Mac lama
```

### Linux native

Kamu udah siap. Cek distro:

```bash
cat /etc/os-release
```

Pastikan shell kamu `bash` atau `zsh` (umumnya default).

---

## Materi 2: Kenalan dengan prompt

Buka terminal, kamu bakal liat sesuatu kayak gini:

```
username@hostname:~$
```

Mari kita bedah:

- `username` — user yang lagi login (yang kamu buat tadi)
- `@hostname` — nama komputer kamu
- `:` — pemisah
- `~` — folder tempat kamu berada sekarang (`~` artinya home directory)
- `$` — tanda bahwa kamu adalah user biasa. Kalau kamu liat `#` artinya kamu lagi sebagai `root` (superuser) — **hati-hati banget di mode ini**, satu command bisa ngerusak sistem.

**Yang harus kamu ingat:**
- Kamu lagi "di dalam" sebuah folder (current working directory)
- Tiap command yang kamu jalankan dieksekusi dari folder itu sebagai konteks
- Kamu bisa pindah folder, tapi shell tetap di session yang sama

---

## Materi 3: `pwd` — Print Working Directory

Command paling dasar. Tanya ke terminal "sekarang saya ada di mana?"

```bash
pwd
```

Output:

```
/home/username
```

Itu path absolut (mulai dari `/` — root). Bedakan sama `~` yang cuma shortcut ke home directory kamu.

**Kenapa penting?** Sebelum kamu jalanin command berbahaya (seperti `rm` nanti), selalu cek dulu kamu ada di mana. Banyak kisah sedih dimulai dari "eh ternyata tadi saya di folder salah".

---

## Materi 4: `ls` — List directory contents

`ls` nge-list isi folder tempat kamu berada.

```bash
ls
```

Tapi `ls` polos itu hambar. Yang sering dipakai:

```bash
# Lihat semua file termasuk yang hidden (diawali titik)
ls -a

# Lihat dalam format panjang: permission, owner, size, tanggal
ls -l

# Gabungan: paling sering dipakai sehari-hari
ls -la

# Sortir berdasarkan waktu modifikasi, paling baru di bawah
ls -lt

# Reverse sort (paling baru di atas) — berguna banget
ls -ltr

# Human-readable size (1.2K, 3.4M, 1G bukan angka byte mentah)
ls -lh

# List folder tertentu, bukan folder sekarang
ls -la /etc
```

Mari kita baca output `ls -la`:

```
drwxr-xr-x  2 username username 4096 Nov 12 10:30 Documents
-rw-r--r--  1 username username  512 Nov 10 14:20 notes.txt
```

| Kolom | Arti |
|-------|------|
| `drwxr-xr-x` | Permission + tipe file (`d` = directory, `-` = file biasa) |
| `2` | Jumlah hardlink (gak penting buat sekarang) |
| `username` | Owner file |
| `username` | Group owner |
| `4096` | Ukuran dalam byte |
| `Nov 12 10:30` | Terakhir dimodifikasi |
| `Documents` | Nama file/folder |

Permission (`rwxr-xr-x`) bakal kita bahas tuntas di Sesi 06. Buat sekarang, cukup tahu itu ada di sana.

---

## Materi 5: `cd` — Change Directory

Ini command yang paling sering kamu pakai sehari-hari.

```bash
# Pindah ke folder Documents di dalam folder sekarang (relatif)
cd Documents

# Pindah ke folder tertentu pake path absolut
cd /etc

# Pindah ke home directory (3 cara, pilih yang paling nyaman)
cd                  # kosong
cd ~                # eksplisit
cd $HOME            # pake env variable

# Naik satu level
cd ..

# Naik dua level
cd ../..

# Balik ke folder sebelumnya (toggle)
cd -
```

### Path absolut vs relatif

- **Absolut:** mulai dari `/`. Contoh: `/home/username/Documents`. Selalu valid dari folder manapun.
- **Relatif:** relatif ke folder sekarang. Contoh: `Documents` (kalau kamu lagi di home), `../Pictures` (folder Pictures yang ada satu level di atas).

**Aturan main:**
- Kalau destination pasti dan kamu tahu full path, pakai absolut. Lebih aman, gak tergantung posisi kamu.
- Kalau operasi cepat ke folder deket, pakai relatif. Lebih hemat ketikan.

### Trik `Tab` autocomplete

Ini **skill wajib** yang sering kelewat. Ketik setengah nama folder, tekan `Tab`, shell bakal autocomplete.

```bash
cd Doc<Tab>     # jadi cd Documents
cd Do<Tab><Tab> # kalau ada banyak yang mulai dengan "Do", tekan Tab dua kali buat liat opsi
```

Belajar pakai Tab dari hari 1. Ini faktor kecepatan terbesar kamu di terminal.

---

## Common pitfalls

### 1. "command not found" padahal yakin install

Cek typo. Terminal itu case-sensitive: `LS` ≠ `ls`. Windows gak peduli case, Linux peduli banget.

### 2. `cd` ke file (bukan folder)

```
bash: cd: notes.txt: Not a directory
```

Error ini jelas. Kamu coba `cd` ke sesuatu yang bukan folder. Cek pake `ls -l` — kalau di awalnya `-` bukan `d`, itu file, gak bisa di-`cd`.

### 3. Spasi di nama folder bikin error

```bash
cd My Documents
# bash: cd: too many arguments
```

Shell ngartikan spasi sebagai pemisah argumen. Solusi:

```bash
cd "My Documents"        # pake kutip
cd My\ Documents         # escape spasi dengan backslash
```

Best practice: **jangan pakai spasi di nama folder** kalau bisa. Pakai `_` atau `-`: `my_documents`, `my-documents`. Hidup kamu bakal jauh lebih mudah.

### 4. Lupa dimana sekarang

Prompt kamu kadang gak nunjukin full path (terutama di konfigurasi default Mac). Kalau bingung, jangan tebak — `pwd` dulu.

### 5. Tutup terminal = balik ke home

Setiap kamu buka terminal baru, current directory selalu home. Jangan kaget kalau `ls` setelah buka terminal baru isinya beda sama sebelum kamu tutup.

---

## Side project: "Tur filesystem sendiri"

### Brief

Kamu bakal bikin struktur folder dummy buat simulasi proyek pribadi, lalu navigasi di dalamnya tanpa pakai mouse / Finder / Explorer. Struktur yang harus kamu bikin:

```
~/belajar-linux/
├── minggu-1/
│   ├── catatan/
│   └── latihan/
├── minggu-2/
│   ├── catatan/
│   └── latihan/
└── minggu-3/
    ├── catatan/
    └── latihan/
```

Setelah struktur jadi, lakukan misi berikut **semua lewat terminal**:

1. Mulai dari home directory
2. Masuk ke `belajar-linux/minggu-1/catatan/`
3. Verifikasi kamu beneran di sana (jangan tebak — pakai command)
4. Tanpa naik ke `belajar-linux` dulu, lompat langsung ke `minggu-3/latihan/`
5. Balik ke home directory pakai 3 cara berbeda (`cd`, `cd ~`, `cd $HOME`)
6. Pakai `cd -` buat toggle antara home dan `minggu-3/latihan/` (harus balik ke sana)
7. Lihat isi `belajar-linux` secara rekursif (semua subfolder sekaligus) — cari sendiri flag yang tepat di `ls`

<details>
<summary>Solusi (klik buat expand — tapi coba dulu sampai mentok ya)</summary>

```bash
# Mulai dari home (pastikan dulu)
cd
pwd

# Bikin struktur folder
mkdir -p belajar-linux/minggu-1/catatan
mkdir -p belajar-linux/minggu-1/latihan
mkdir -p belajar-linux/minggu-2/catatan
mkdir -p belajar-linux/minggu-2/latihan
mkdir -p belajar-linux/minggu-3/catatan
mkdir -p belajar-linux/minggu-3/latihan

# Misi 1: masuk ke minggu-1/catatan
cd belajar-linux/minggu-1/catatan

# Misi 2: verifikasi posisi
pwd

# Misi 3: lompat ke minggu-3/latihan tanpa naik dulu
cd ~/belajar-linux/minggu-3/latihan
# atau
cd ../../minggu-3/latihan

# Misi 4: balik ke home, 3 cara
cd
cd ~
cd $HOME

# Misi 5: toggle
cd ~/belajar-linux/minggu-3/latihan
cd -     # balik ke home
cd -     # balik ke minggu-3/latihan

# Misi 6: list rekursif
ls -R belajar-linux
```

Catatan: `mkdir -p` akan kita bahas detail di Sesi 03. Buat sekarang, cukup tahu itu bikin folder beserta parent-nya kalau belum ada.

</details>

---

## Tantangan ekstra (opsional)

- Set prompt kamu biar tampilkan full path. Edit `~/.bashrc` (atau `~/.zshrc`), cari baris `PS1=`, ganti `\w` jadi `\W` (atau sebaliknya). Materi edit config bakal dibahas Sesi 09 — sekarang coba pakai Google: "bash PS1 customization".
- Setup aliases: `alias ll='ls -la'` biar lebih hemat. Tambahin ke `~/.bashrc`.
- Coba install `tree` (`sudo apt install tree` di Ubuntu / `brew install tree` di Mac) dan jalanin `tree belajar-linux`. Bandingin sama `ls -R`.

---

## Tanda kelar

Checklist berikut harus bisa kamu lakuin **tanpa buka materi ini lagi**:

- [ ] Saya tahu bedanya prompt `$` dan `#`, dan kenapa harus hati-hati di mode `#`
- [ ] `pwd` jelasin posisi saya di filesystem kapanpun ditanya
- [ ] `ls -la` saya bisa baca kolom-kolom outputnya (permission, owner, size, tanggal, nama)
- [ ] Saya bisa pindah folder pakai path absolut dan relatif, tahu kapan pakai yang mana
- [ ] Saya terbiasa pakai Tab autocomplete kalau ngetik nama folder panjang
- [ ] Saya tahu cara handle nama folder yang ada spasinya
- [ ] Saya tahu 3 cara balik ke home directory
- [ ] Saya tahu fungsi `cd -` dan pernah pakai

Kalau ada yang belum centang, ulang dulu materi yang itu. Jangan buru-buru lanjut ke Sesi 02 — Sesi 02 asumsi kamu udah lancar navigasi.

---

**Next:** `02-filesystem-hierarchy.md` — kita bakal ngerti kenapa Linux punya `/etc`, `/var`, `/usr`, `/home` dan isinya apa. Spoiler: ini fondasi buat baca log, config server, dan debug masalah sistem nanti.
