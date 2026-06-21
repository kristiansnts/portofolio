# Sesi 03 — Manipulasi File & Folder

> **Minggu 2, Sesi 3 dari 12**
> **Estimasi: 4–5 hari (75–90 menit/hari)**

## Tujuan sesi ini

Akhir sesi ini kamu harus bisa:
- Bikin folder bertingkat pake `mkdir -p` tanpa error
- Bikin file kosong pake `touch` dan ngerti kapan dipakai
- Copy file/folder pake `cp` dengan flag yang benar
- Pindah/rename pake `mv` (yes, dua-duanya command yang sama)
- Hapus file/folder pake `rm` **dan sadar betul bahwa ini permanen**
- Pakai wildcard (`*`, `?`, `[]`) buat operasi bulk

Sesi ini cukup berat karena membawa tanggung jawab. `rm` itu senjata tajam — banyak sysadmin veteran punya kisah sedih karena salah ketik. Kita bahas safety-nya lumayan dalam.

---

## Estimasi waktu belajar

| Hari | Aktivitas | Durasi |
|------|-----------|--------|
| 1 | `mkdir` (termasuk `-p`) + `touch` + wildcard | 75 menit |
| 2 | `cp` dengan berbagai flag + praktik | 75 menit |
| 3 | `mv` (copy + delete + rename) + praktik | 75 menit |
| 4 | `rm` — safety first + flag + praktik di folder sandbox | 90 menit |
| 5 | Side project + review | 75 menit |

---

## Materi 1: `mkdir` — Bikin folder

```bash
# Bikin folder baru di folder sekarang
mkdir project-baru

# Bikin folder di path absolut
mkdir /tmp/test-folder

# Bikin beberapa folder sekaligus
mkdir folder1 folder2 folder3

# Bikin folder bertingkat sekaligus — INI PENTING
mkdir -p project/src/components
```

### Kenapa `-p` penting

Tanpa `-p`:

```bash
mkdir project/src/components
# mkdir: cannot create directory 'project/src/components': No such file or directory
```

Error karena `project/src` belum ada. Kamu harus bikin manual satu-satu:

```bash
mkdir project
mkdir project/src
mkdir project/src/components
```

Dengan `-p`, semua parent yang belum ada akan dibuatkan otomatis. **Make life easier.**

> **Bonus `-p`:** gak error kalau folder udah ada. Berguna buat skrip yang idempotent (jalan berkali-kali aman).

```bash
mkdir -p project    # ok
mkdir -p project    # ok lagi, gak error
```

---

## Materi 2: `touch` — Bikin file kosong

Aslinya `touch` fungsinya update timestamp file. Tapi use case paling umum: bikin file kosong.

```bash
# Bikin file kosong
touch catatan.txt

# Bikin beberapa file sekaligus
touch a.txt b.txt c.txt

# Update timestamp file yang udah ada (gak bikin baru)
touch catatan.txt
```

Cek hasil:

```bash
ls -l catatan.txt
# -rw-r--r-- 1 user user 0 Nov 12 14:30 catatan.txt
#                                  ^ ukuran 0 byte
```

> **Catatan:** `touch` gak bisa ngisi file. Buat ngisi file, pakai `echo "..." > file.txt` (akan dibahas Sesi 08 — redirection) atau buka pake editor (Sesi 10).

---

## Materi 3: Wildcard — Operasi bulk

Sebelum lanjut ke `cp`/`mv`/`rm`, kita perlu ngerti wildcard. Ini yang bikin operasi bulk jadi mudah.

Shell meng-expand wildcard **sebelum** command jalan. Jadi `ls *.txt` di-expand jadi `ls a.txt b.txt c.txt` sebelum `ls` liat argumennya.

| Pattern | Arti | Contoh |
|---------|------|--------|
| `*` | Nol atau lebih karakter apapun | `*.txt` = semua file .txt |
| `?` | Tepat satu karakter apapun | `file?.txt` = file1.txt, file2.txt, fileA.txt |
| `[abc]` | Satu karakter dari set | `file[12].txt` = file1.txt, file2.txt |
| `[a-z]` | Satu karakter dari range | `file[a-z].txt` = filea.txt, fileb.txt |
| `[!abc]` | Bukan dari set | `file[!12].txt` = file3.txt, fileA.txt |

Contoh:

```bash
ls *.txt              # semua file .txt di folder sekarang
ls *.log.*            # file log dengan ekstensi ganda
ls file[0-9].txt      # file0.txt sampai file9.txt
ls -d */              # hanya folder (bukan file)
```

> **Tip penting:** kalau kamu ngetik `rm *` di folder yang salah, **semua hilang**. Selalu cek dulu dengan `ls *` sebelum `rm *` untuk liat apa yang bakal kena.

---

## Materi 4: `cp` — Copy

```bash
# Copy file ke lokasi baru
cp catatan.txt backup-catatan.txt

# Copy file ke folder lain (nama dipertahankan)
cp catatan.txt /tmp/

# Copy file ke folder lain dengan nama baru
cp catatan.txt /tmp/catatan-old.txt

# Copy beberapa file sekaligus ke folder
cp a.txt b.txt c.txt /tmp/

# Copy folder beserta isinya — WAJIB -r (recursive)
cp -r project project-backup
```

### Flag penting

```bash
# -r atau -R = recursive (untuk folder)
cp -r project backup

# -i = interactive (tanya konfirmasi kalau file tujuan udah ada)
cp -i file.txt /tmp/
# cp: overwrite '/tmp/file.txt'? y

# -v = verbose (cetak apa yang di-copy)
cp -v a.txt b.txt /tmp/
# 'a.txt' -> '/tmp/a.txt'
# 'b.txt' -> '/tmp/b.txt'

# -p = preserve attributes (timestamp, permission, owner)
cp -p catatan.txt /tmp/
```

**Kombinasi paling sering dipakai:**

```bash
cp -riv project /tmp/    # recursive + interactive + verbose
```

### Tanpa `-r`, folder gak bisa di-copy

```bash
cp project /tmp/
# cp: -r not specified; omitting directory 'project'
```

Shell nunjukin jelas: kalau mau copy folder, pakai `-r`.

---

## Materi 5: `mv` — Move & Rename

`mv` punya dua peran tergantung konteks:

```bash
# RENAME: kalau destination belum ada di folder yang sama
mv catatan.txt notes.txt

# MOVE: kalau destination adalah folder
mv catatan.txt /tmp/
# file catatan.txt sekarang ada di /tmp/catatan.txt, hilang dari folder asal

# MOVE + RENAME sekaligus
mv catatan.txt /tmp/notes.txt

# Move beberapa file sekaligus
mv a.txt b.txt c.txt /tmp/
```

### Flag penting

```bash
# -i = interactive (tanya kalau destination udah ada)
mv -i file.txt /tmp/

# -v = verbose
mv -v file.txt /tmp/
# renamed 'file.txt' -> '/tmp/file.txt'

# -n = no clobber (jangan overwrite kalau udah ada)
mv -n file.txt /tmp/

# -u = update (move hanya kalau source lebih baru dari destination)
mv -u file.txt /tmp/
```

### Bedanya `cp` dan `mv`

| `cp` | `mv` |
|------|------|
| File asli tetap ada | File asli hilang |
| Bisa copy folder dengan `-r` | Move folder langsung (gak perlu `-r`) |
| Bisa lambar (overwrite via `-i`) | Sama |

> **Trivia:** `mv` antar filesystem sebenarnya copy + delete (karena gak bisa rename cross-filesystem). Tapi shell yang handle, kamu gak perlu mikir.

---

## Materi 6: `rm` — Remove (PERMANEN!)

Ini command yang paling berbahaya di sesi ini. **Gak ada recycle bin.** Sekali dihapus, hilang selamanya (kecuali kamu punya backup).

```bash
# Hapus satu file
rm catatan.txt

# Hapus beberapa file
rm a.txt b.txt c.txt

# Hapus pakai wildcard
rm *.txt

# Hapus folder beserta isinya — WAJIB -r
rm -r project/

# Hapus folder dan isinya tanpa konfirmasi — BAHAYA
rm -rf project/
```

### Flag penting

```bash
# -r = recursive (untuk folder)
rm -r project/

# -f = force (jangan tanya, hapus aja) — HATI-HATI
rm -f file.txt

# -i = interactive (tanya konfirmasi tiap file)
rm -i file.txt
# rm: remove regular empty file 'file.txt'? y

# -v = verbose (cetak apa yang dihapus)
rm -v file.txt
# removed 'file.txt'
```

### Safety pattern yang harus jadi kebiasaan

**1. Selalu cek dulu dengan `ls` sebelum `rm` pakai wildcard:**

```bash
ls *.txt         # liat dulu siapa yang bakal kena
rm *.txt         # baru hapus
```

**2. Pakai `-i` kalau ragu:**

```bash
rm -i *.txt
# rm: remove regular file 'a.txt'? y
# rm: remove regular file 'b.txt'? n    <- skip yang ini
```

**3. Hati-hati dengan spasi:**

```bash
rm -rf / home/user      # MALA PETAKA: ada spasi setelah /
# Ini akan hapus SELURUH filesystem karena / dianggap satu argumen
# lalu home/user dianggap argumen kedua
```

Solusi: selalu pakai path lengkap atau kutip:

```bash
rm -rf /home/user       # aman
rm -rf "/home/old user" # aman, kutip kalau ada spasi
```

**4. Jangan pernah jalanin `rm -rf /` apapun alasannya.** Beberapa distro modern punya protection (alias `rm` ke `rm --preserve-root`), tapi jangan andalkan.

### Tips: gunakan trash-cli sebagai safety net (opsional)

Kalau kamu gak yakin, install `trash-cli`:

```bash
sudo apt install trash-cli      # Ubuntu/Debian
# atau
brew install trash-cli          # Mac
```

Pakai:

```bash
trash file.txt                 # pindah ke trash (recoverable)
trash-restore                  # restore dari trash
```

Gak ada di server produksi sih, tapi bagus buat learning phase.

---

## Materi 7: Tambah bonus — `rmdir` untuk folder kosong

```bash
# Hapus folder kosong (kalau ada isinya, error)
rmdir folder-kosong/

# Bandingkan
rm -r folder-kosong/    # hapus apapun isinya
```

`rmdir` lebih aman tapi jarang dipakai karena harus kosong dulu. Berguna kalau skrip butuh "make sure folder kosong sebelum hapus".

---

## Common pitfalls

### 1. "Permission denied" saat hapus/move

```
rm: cannot remove '/etc/test': Permission denied
```

File itu bukan milik kamu. Pakai `sudo` (kalau yakin):

```bash
sudo rm /etc/test
```

Tapi **jangan asal sudo**. Cek dulu siapa owner dan apakah file itu penting:

```bash
ls -l /etc/test
```

### 2. Lupa `-r` saat hapus/copy folder

```bash
cp project /tmp/
# cp: -r not specified; omitting directory 'project'

rm project/
# rm: cannot remove 'project/': Is a directory
```

Selalu ingat: folder = butuh `-r`.

### 3. Overwrite tanpa sadar karena `cp`/`mv` default silent

```bash
cp file.txt /tmp/file.txt     # kalau /tmp/file.txt udah ada, dioverwrite diam-diam
```

Biasakan pakai `-i` kalau gak yakin:

```bash
cp -i file.txt /tmp/file.txt
# cp: overwrite '/tmp/file.txt'? 
```

Atau pakai `-n` (no clobber) kalau gak mau overwrite sama sekali.

### 4. Salah path saat `rm -rf`

```bash
cd /tmp
rm -rf *          # BAHAYA: hapus semua di /tmp (mungkin masih ok)
cd /              # JANGAN LAKUKAN INI lalu rm -rf *
```

**Selalu `pwd` dulu sebelum `rm -rf` dengan wildcard.**

### 5. Spasi di nama file bikin `mv`/`cp` pecah

```bash
mv my file.txt /tmp/
# mv: cannot stat 'my': No such file or directory
# mv: cannot stat 'file.txt': No such file or directory
```

Shell ngartikan spasi sebagai pemisah. Pakai kutip atau escape:

```bash
mv "my file.txt" /tmp/
mv my\ file.txt /tmp/
```

Atau lebih baik: rename file untuk hilangkan spasi.

### 6. Case sensitivity bikin `rm *.TXT` gak hapus apa-apa

```bash
rm *.TXT         # gak ada file .TXT, gak ada yang dihapus
rm *.txt         # baru hapus file .txt
```

Linux case-sensitive. Beda dengan Windows.

---

## Side project: "Simulasi file manager sederhana"

### Brief

Kamu bakal simulasiin skenario file manager murni lewat terminal. Buat folder sandbox dulu:

```bash
mkdir -p ~/belajar-linux/minggu-2/latihan/sandbox
cd ~/belajar-linux/minggu-2/latihan/sandbox
```

Lalu lakukan misi berikut **semua lewat terminal**:

#### Misi 1: Setup struktur awal

Bikin struktur berikut:

```
sandbox/
├── dokumen/
│   ├── catatan.txt (kosong)
│   ├── draft.txt (kosong)
│   └── ide.txt (kosong)
├── foto/
│   ├── liburan/
│   │   ├── img1.jpg (kosong)
│   │   └── img2.jpg (kosong)
│   └── kerja/
│       └── screenshot.png (kosong)
├── kode/
│   ├── python/
│   │   └── main.py (kosong)
│   └── js/
│       └── index.js (kosong)
└── arsip/
```

Pakai `mkdir -p` untuk folder bertingkat dan `touch` untuk file kosong.

#### Misi 2: Reorganisasi

1. Pindahkan semua file `.txt` dari `dokumen/` ke `arsip/`
2. Rename `img1.jpg` jadi `pantai.jpg` dan `img2.jpg` jadi `gunung.jpg` (di dalam `foto/liburan/`)
3. Copy seluruh folder `kode/` ke `arsip/kode-backup/`
4. Bikin folder `foto/arsip-lama/`, lalu pindahkan folder `kerja/` ke dalam `arsip-lama/` (jadi `foto/arsip-lama/kerja/`)

#### Misi 3: Cleanup (HATI-HATI)

1. Hapus file `screenshot.png` (kalau masih ada di lokasi lama)
2. Hapus folder `kode/js/` beserta isinya
3. Hapus semua file `.txt` di `arsip/` **yang namanya mulai dengan huruf "d"** (cuma `draft.txt` — pakai wildcard)
4. Verifikasi struktur akhir dengan `tree` (install kalau belum: `sudo apt install tree`)

<details>
<summary>Solusi (klik expand)</summary>

```bash
# Setup sandbox
mkdir -p ~/belajar-linux/minggu-2/latihan/sandbox
cd ~/belajar-linux/minggu-2/latihan/sandbox

# ============ MISI 1 ============
mkdir -p dokumen foto/liburan foto/kerja kode/python kode/js arsip

touch dokumen/catatan.txt
touch dokumen/draft.txt
touch dokumen/ide.txt

touch foto/liburan/img1.jpg
touch foto/liburan/img2.jpg
touch foto/kerja/screenshot.png

touch kode/python/main.py
touch kode/js/index.js

# Verifikasi struktur
ls -R
# atau pakai tree (kalau sudah install): tree

# ============ MISI 2 ============

# 2.1 Pindah semua .txt ke arsip
mv dokumen/*.txt arsip/

# 2.2 Rename img
cd foto/liburan
mv img1.jpg pantai.jpg
mv img2.jpg gunung.jpg
cd ~/belajar-linux/minggu-2/latihan/sandbox

# 2.3 Copy kode ke arsip/kode-backup
cp -r kode arsip/kode-backup

# 2.4 Pindah foto/kerja ke foto/arsip-lama/kerja
mkdir foto/arsip-lama
mv foto/kerja foto/arsip-lama/

# ============ MISI 3 ============

# 3.1 Hapus screenshot.png — tapi sekarang ada di foto/arsip-lama/kerja/
rm foto/arsip-lama/kerja/screenshot.png

# 3.2 Hapus kode/js/ beserta isinya
rm -r kode/js/

# 3.3 Hapus file .txt di arsip/ yang namanya mulai dengan "d"
# Cek dulu yang bakal kena
ls arsip/d*.txt
# Output: arsip/draft.txt
# Baru hapus
rm arsip/d*.txt

# 3.4 Verifikasi struktur akhir
tree
# Atau kalau gak ada tree:
ls -R
```

Struktur akhir seharusnya:

```
sandbox/
├── arsip/
│   ├── catatan.txt
│   ├── ide.txt
│   └── kode-backup/
│       ├── python/
│       │   └── main.py
│       └── js/
│           └── index.js
├── dokumen/             (kosong)
├── foto/
│   ├── liburan/
│   │   ├── pantai.jpg
│   │   └── gunung.jpg
│   └── arsip-lama/
│       └── kerja/       (kosong)
└── kode/
    └── python/
        └── main.py
```

</details>

---

## Tantangan ekstra (opsional)

- Bikin script one-liner untuk backup folder `kode/` ke timestamped folder: `cp -r kode kode-backup-$(date +%Y%m%d)`. Pelajari kenapa ini jalan.
- Eksperimen dengan `cp -u`. Buat 2 file dengan tanggal modifikasi berbeda, lalu `cp -u` dari satu ke lain. Lihat apa yang terjadi.
- Pelajari flag `--backup=numbered` di `cp` dan `mv`. Ini bikin backup otomatis (.~1~, .~2~) ketimbang overwrite.

---

## Tanda kelar

- [ ] Saya bisa bikin folder bertingkat pake `mkdir -p` tanpa error
- [ ] Saya tahu kapan pakai `touch` (bikin file kosong) vs editor (buat file berisi)
- [ ] Saya paham cara kerja wildcard `*`, `?`, `[]` dan bisa pakai untuk operasi bulk
- [ ] Saya tahu `cp` butuh `-r` untuk folder, dan flag `-i`/`-v`/`-p` fungsinya apa
- [ ] Saya tahu `mv` bisa buat move DAN rename, tergantung konteks
- [ ] Saya **sangat sadar** bahwa `rm` itu permanen, dan punya kebiasaan `ls` dulu sebelum `rm *.xxx`
- [ ] Saya tahu bahaya `rm -rf` dengan spasi yang salah (`rm -rf / home/user`)
- [ ] Saya pernah melakukan side project lengkap tanpa nyentuh mouse

Kalau ada yang belum centang, **jangan lanjut**. Sesi depan bakal asumsi kamu udah lancar manipulasi file.

---

**Next:** `04-membaca-file.md` — sekarang kita bisa bikin & hapus file, tapi belum bisa baca isinya dengan efisien. Kita bakal bahas `cat`, `less`, `head`, `tail`, dan yang paling penting: `tail -f` buat monitor log realtime.
