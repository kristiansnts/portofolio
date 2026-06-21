# Sesi 05 — Cari File & Isi File: `find` dan `grep`

> **Minggu 3, Sesi 5 dari 12**
> **Estimasi: 5–6 hari (75–90 menit/hari)**

## Tujuan sesi ini

Akhir sesi ini kamu harus bisa:
- Cari file berdasarkan nama, tipe, ukuran, waktu modifikasi pake `find`
- Cari teks di dalam file pake `grep` (basic + extended regex)
- Kombinasikan `find` + `grep` untuk cari "file .py yang isinya ada kata `TODO`"
- Paham regex dasar sampai level yang cukup buat kerja sehari-hari
- Eksekusi aksi setelah `find` nemu (`-exec`)

Dua command ini **paling sering dipakai** di seluruh track. Setiap hari kamu kerja di codebase atau server, kamu pasti pakai `find` atau `grep`. Investasi waktu di sesi ini sangat berbalok.

---

## Estimasi waktu belajar

| Hari | Aktivitas | Durasi |
|------|-----------|--------|
| 1 | `find` dasar — cari by name, type, path | 75 menit |
| 2 | `find` advanced — size, time, owner, permission | 90 menit |
| 3 | `find -exec` dan `-delete` | 75 menit |
| 4 | `grep` dasar — literal search, flag umum | 75 menit |
| 5 | `grep` regex + extended grep (`-E`) | 90 menit |
| 6 | Side project + review | 90 menit |

---

## Bagian 1: `find` — Cari File Berdasarkan Atribut

### Materi 1.1: Sintaks dasar `find`

```bash
find <path> <kondisi> <aksi>
```

- `<path>` — di mana mulai cari (default rekursif ke semua subfolder)
- `<kondisi>` — filter (nama, tipe, ukuran, dll)
- `<aksi>` — apa yang dilakukan ke file yang match (default: print path)

Contoh paling sederhana:

```bash
# Cari SEMUA file di folder sekarang (rekursif)
find .

# Cari semua file di /etc
find /etc
```

Outputnya list path satu per satu. Seringkali kamu mau filter.

### Materi 1.2: Cari berdasarkan nama — `-name` dan `-iname`

```bash
# Cari file yang namanya persis "notes.txt" di folder sekarang
find . -name "notes.txt"

# Cari file yang namanya berakhiran .log
find /var/log -name "*.log"

# Cari file yang namanya berawalan "config"
find . -name "config*"

# Case-insensitive (-iname)
find / -iname "README*"     # README.md, Readme.txt, readme.md semua match
```

> **Tip:** selalu kutip pattern-nya (`"*.log"`) supaya shell gak meng-expand wildcard sebelum `find` liat. Tanpa kutip, kalau di folder sekarang ada file `a.log`, `find . -name *.log` jadi `find . -name a.log` — bukan yang kamu maksud.

### Materi 1.3: Cari berdasarkan tipe — `-type`

| Tipe | Arti |
|------|------|
| `f` | File biasa |
| `d` | Directory |
| `l` | Symlink |
| `b` | Block device (disk) |
| `c` | Character device (terminal) |
| `s` | Socket |
| `p` | Named pipe |

```bash
# Cari semua folder di home
find ~ -type d

# Cari semua file (bukan folder) di project
find project -type f

# Cari semua symlink di /usr
find /usr -type l
```

### Materi 1.4: Kombinasi kondisi — `-and`, `-or`, `-not`

Default antar kondisi = AND. Tapi eksplisit lebih jelas:

```bash
# File .py DAN di folder src/
find project -name "*.py" -a -path "*/src/*"

# File .py ATAU .js
find project -name "*.py" -o -name "*.js"

# File BUKAN .py
find project -type f -not -name "*.py"

# Parentheses untuk grouping (harus di-escape)
find project \( -name "*.py" -o -name "*.js" \) -not -path "*/node_modules/*"
```

### Materi 1.5: Cari berdasarkan ukuran — `-size`

```bash
# File lebih besar dari 100MB
find / -type f -size +100M

# File lebih kecil dari 1KB
find . -type f -size -1k

# File tepat 50 byte
find . -type f -size 50c

# File antara 1MB dan 10MB
find . -type f -size +1M -size -10M
```

Unit:

| Suffix | Arti |
|--------|------|
| `c` | byte |
| `k` | kilobyte (1024 byte) |
| `M` | megabyte |
| `G` | gigabyte |

Use case umum: cari file besar yang ngabisin disk.

```bash
# Top 10 file terbesar di home
find ~ -type f -size +100M -exec ls -lh {} \; | sort -k5 -h | tail -10
```

### Materi 1.6: Cari berdasarkan waktu

Tiga jenis timestamp di Linux:
- **atime** — access time (terakhir dibaca)
- **mtime** — modification time (terakhir diubah isinya)
- **ctime** — change time (terakhir metadata berubah, misal permission)

```bash
# File yang dimodifikasi dalam 24 jam terakhir
find . -type f -mtime -1

# File yang dimodifikasi lebih dari 30 hari lalu
find . -type f -mtime +30

# File yang dimodifikasi TEPAT 7 hari lalu
find . -type f -mtime 7

# File yang diakses dalam 60 menit terakhir
find . -type f -amin -60

# File yang metadata berubah dalam 10 menit terakhir
find . -type f -cmin -10
```

Aturan angka:
- `-mtime 7` = TEPAT 7 hari lalu (24*7 jam terakhir)
- `-mtime -7` = KURANG dari 7 hari (dalam 7 hari terakhir)
- `-mtime +7` = LEBIH dari 7 hari lalu

### Materi 1.7: Cari berdasarkan owner dan permission

```bash
# File milik user tertentu
find /home -user budi

# File milik group tertentu
find / -group admin

# File dengan permission 777 (bahaya!)
find / -type f -perm 777 2>/dev/null

# File yang BISA dieksekusi oleh owner
find /usr/bin -type f -perm /u+x

# File yang permission-nya EXACTLY 644
find ~ -type f -perm 644
```

Permission akan dibahas tuntas di Sesi 06. Buat sekarang, cukup tahu `-perm` ada.

### Materi 1.8: Membatasi kedalaman — `-maxdepth`

```bash
# Cari hanya di folder sekarang (tidak masuk subfolder)
find . -maxdepth 1 -type f

# Cari maksimal 2 level
find . -maxdepth 2 -name "*.txt"
```

`-maxdepth` sangat berguna kalau struktur folder dalam dan kamu gak mau `find` jalan berjam-jam.

> **Tip:** `-mindepth` juga ada — kebalikannya. `-mindepth 1` = skip folder sekarang.

### Materi 1.9: Eksekusi aksi — `-exec` dan `-delete`

`-exec` = jalanin command ke setiap file yang match.

```bash
# Print detail setiap file yang ditemukan
find . -name "*.log" -exec ls -lh {} \;

# Hapus semua file .tmp
find /tmp -name "*.tmp" -delete

# Copy semua file .jpg ke folder lain
find . -name "*.jpg" -exec cp {} /backup/ \;

# Ubah permission semua file .sh
find . -name "*.sh" -exec chmod +x {} \;
```

Penjelasan sintaks:
- `{}` = placeholder untuk path file yang ketemu
- `\;` = akhir dari command `-exec` (escape supaya shell gak makannya)
- `+` = alternatif akhiran, kumpulkan semua file jadi satu argumen (lebih efisien)

```bash
# Versi efisien (kumpulkan semua jadi satu command)
find . -name "*.log" -exec ls -lh {} +

# Bedanya:
# \; -> ls -lh file1; ls -lh file2; ls -lh file3   (3 panggilan)
# +  -> ls -lh file1 file2 file3                    (1 panggilan)
```

> **Penting untuk `-delete`:** SELALU test dulu dengan `-print` sebelum `-delete`!

```bash
find /tmp -name "*.tmp" -print     # cek dulu siapa yang bakal kena
find /tmp -name "*.tmp" -delete    # baru hapus
```

### Materi 1.10: Hide error "Permission denied"

```bash
find / -name "config.yml"
# Output:
# /home/budi/config.yml
# find: '/proc/1/fd': Permission denied
# find: '/etc/ssl/private': Permission denied
# ... puluhan error
```

Buang error-nya:

```bash
find / -name "config.yml" 2>/dev/null
```

`2>/dev/null` = redirect stderr (file descriptor 2) ke black hole. Akan dibahas detail Sesi 08.

---

## Bagian 2: `grep` — Cari Teks di Dalam File

### Materi 2.1: Sintaks dasar `grep`

```bash
grep <pattern> <file>
grep <pattern> <file1> <file2> ...
```

```bash
# Cari kata "error" di file
grep "error" /var/log/syslog

# Cari di beberapa file
grep "username" /etc/passwd /etc/group

# Case-insensitive
grep -i "error" log.txt       # match: error, Error, ERROR

# Ambil baris yang TIDAK match (invert)
grep -v "INFO" log.txt        # semua baris kecuali yang ada INFO
```

### Materi 2.2: Recursive search — cari di semua file dalam folder

```bash
# Cari "TODO" di semua file di folder project
grep -r "TODO" project/

# Hanya file tertentu
grep -r "TODO" --include="*.py" project/

# Exclude folder tertentu
grep -r "TODO" --exclude-dir="node_modules" project/
grep -r "TODO" --exclude-dir="node_modules" --exclude-dir=".git" project/

# Tampilkan nomor baris
grep -rn "TODO" project/

# Tampilkan nama file saja (tanpa baris match)
grep -rl "TODO" project/
# Bagus buat piping: grep -rl "TODO" project/ | xargs sed -i 's/TODO/DONE/g'
```

Kombinasi paling sering:

```bash
grep -rn --include="*.py" --exclude-dir=".git" "def main" .
```

Artinya: cari "def main" di semua file .py, recursive, skip .git, tampilkan nomor baris.

### Materi 2.3: Output context — lihat sekitar match

```bash
# 3 baris SEBELUM match
grep -B 3 "ERROR" log.txt

# 3 baris SESUDAH match
grep -A 3 "ERROR" log.txt

# 3 baris sebelum dan sesudah
grep -C 3 "ERROR" log.txt
```

Sangat berguna saat debugging — kamu gak cuma liat baris error, tapi konteksnya.

### Materi 2.4: Match count

```bash
# Berapa kali pattern muncul di setiap file
grep -c "ERROR" log.txt

# Hanya tampilkan file yang MATCH (tidak peduli count)
grep -l "ERROR" *.log
```

### Materi 2.5: Regex dasar

`grep` default pakai Basic Regular Expression (BRE). Beberapa karakter punya arti khusus:

| Karakter | Arti |
|----------|------|
| `.` | Satu karakter apapun |
| `*` | Nol atau lebih karakter sebelumnya |
| `^` | Awal baris |
| `$` | Akhir baris |
| `[abc]` | Satu karakter dari a, b, atau c |
| `[^abc]` | Satu karakter BUKAN a, b, c |
| `\{n,m\}` | Antara n dan m repetisi |

Contoh:

```bash
# Baris yang diawali "ERROR"
grep "^ERROR" log.txt

# Baris yang diakhiri "failed."
grep "failed\.$" log.txt

# Baris yang mengandung angka 3 digit
grep "[0-9][0-9][0-9]" data.txt

# Email sederhana (gak perfect, tapi cukup)
grep "[a-z]*@[a-z]*\.[a-z]*" contacts.txt
```

### Materi 2.6: Extended grep — `-E` (atau `egrep`)

Regex basic butuh backslash untuk karakter seperti `+`, `?`, `|`, `()`. Extended grep (`-E`) gak perlu.

```bash
# Sama:
grep "cat\|dog" file.txt
grep -E "cat|dog" file.txt

# Extended lebih readable
grep -E "ERROR|WARN|CRITICAL" log.txt

# One or more digits
grep -E "[0-9]+" data.txt

# HTTP status codes
grep -E "HTTP/[0-9.]+\" [45][0-9][0-9]" access.log
```

**Selalu pakai `-E` kalau regex-nya kompleks.** Lebih readable.

### Materi 2.7: Fixed string — `-F`

Kalau pattern kamu bukan regex, murni literal string (misal kode yang punya karakter khusus):

```bash
# Tanpa -F: titik dianggap "any char"
grep "192.168.1.1" log.txt
# Match: 192.168.1.1, 192a168b1c1, dll

# Dengan -F: literal
grep -F "192.168.1.1" log.txt
# Match: hanya 192.168.1.1 persis
```

### Materi 2.8: Piping ke grep

`grep` sering jadi filter di pipeline:

```bash
# Cari di output command lain
ls -la | grep ".log"
ps aux | grep "nginx"
history | grep "ssh"
cat /etc/passwd | grep "bash"
```

**Anti-pattern yang harus dihindari:**

```bash
# BOROS
cat file.txt | grep "error"
# HEMAT
grep "error" file.txt
```

Hanya pipe kalau command pertama BUKAN untuk baca file. Contoh valid: `ps aux | grep nginx`.

### Materi 2.9: Trik exclude grep-nya sendiri

```bash
ps aux | grep "nginx"
# Output termasuk baris grep itu sendiri:
# user  1234  ... grep --color=auto nginx
```

Untuk exclude grep sendiri:

```bash
ps aux | grep "[n]ginx"
# Atau
ps aux | grep nginx | grep -v grep
```

Trik `[n]ginx`: regex yang match "nginx" tapi pattern-nya sendiri "ng" + "inx" — gak match "nginx" literal di baris command `grep`. Trik klasik.

---

## Bagian 3: Kombinasi `find` + `grep`

Ini pola yang paling sering kamu pakai di codebase besar:

```bash
# Cari file .py yang isinya ada kata "TODO"
find . -name "*.py" -exec grep -l "TODO" {} +

# Cari file .js di folder src/ yang isinya "console.log"
find src -name "*.js" -exec grep -l "console.log" {} +

# Atau pakai grep recursive dengan include filter (lebih clean)
grep -rl --include="*.py" "TODO" .

# Cari file yang dimodifikasi 7 hari terakhir DAN berisi "ERROR"
find . -name "*.log" -mtime -7 -exec grep -l "ERROR" {} +
```

Pilih approach:
- **`grep -r --include=...`** — lebih simple, cukup untuk 90% case
- **`find ... -exec grep ...`** — lebih fleksibel (bisa filter by size, time, dll)

---

## Common pitfalls

### 1. Lupa kutip pattern di `find`

```bash
find . -name *.txt
# Output aneh / hanya file tertentu
```

Sebab: shell expand `*.txt` ke file di folder sekarang SEBELUM find liat argumennya. Selalu kutip:

```bash
find . -name "*.txt"
```

### 2. Bingung `-mtime` positif vs negatif

```bash
find . -mtime 7    # TEPAT 7 hari lalu (jarang yang kamu mau)
find . -mtime -7   # dalam 7 hari terakhir (UMUM)
find . -mtime +7   # lebih dari 7 hari lalu (UMUM)
```

Hafalkan: minus = dalam rentang, plus = di luar rentang.

### 3. `grep -r` ikut scan binary

```bash
grep -r "test" .
# Output: Binary file ./node_modules/something matches
```

Tambahkan `-I` (kapital) untuk skip binary:

```bash
grep -rI "test" .
```

### 4. Regex di grep default (BRE) vs extended (ERE)

```bash
grep "a+b" file       # match literal "a+b" (plus dianggap char biasa)
grep -E "a+b" file    # match 1 atau lebih "a" diikuti "b" (extended)
```

Kalau regex kamu gak jalan, coba tambah `-E`.

### 5. `-exec` dengan `\;` lupa escape

```bash
find . -name "*.txt" -exec ls -lh {} ;
# Error: shell ngartiin ; sebagai command separator
```

Solusi: escape atau quote:

```bash
find . -name "*.txt" -exec ls -lh {} \;
# atau
find . -name "*.txt" -exec ls -lh {} +
```

### 6. `-delete` sebelum `-print`

ALWAYS test dulu:

```bash
find /tmp -name "*.tmp" -print | less      # cek
find /tmp -name "*.tmp" -delete            # baru hapus
```

### 7. `grep -E` di macOS beda versi

macOS default pakai BSD grep, beberapa flag beda dengan GNU grep di Linux. Misal `--exclude-dir` di BSD baru支持 di macOS versi baru. Kalau script kamu harus portabel, pakai:

```bash
# Install GNU grep di Mac
brew install grep
# Pakai: ggrep, gregrep
```

### 8. Symlink diabaikan secara default

```bash
grep -r "pattern" folder/
# Symlink di dalam folder gak diikuti
grep -R "pattern" folder/   # kapital R = follow symlink
```

---

## Side project: "Codebase investigator"

### Brief

Kamu bakal simulasi kerja sebagai dev yang baru join project dan harus explore codebase orang lain. Pertama, generate codebase dummy:

```bash
# Bikin folder project
mkdir -p ~/belajar-linux/minggu-3/latihan/codebase
cd ~/belajar-linux/minggu-3/latihan/codebase

# Generate struktur folder & file (copy-paste blok ini)
mkdir -p src/components src/utils src/api tests docs config
mkdir -p node_modules/react node_modules/lodash

# Bikin beberapa file source
cat > src/index.js << 'EOF'
import { createUser, deleteUser } from './api/users';
import { formatDate } from './utils/date';
import { Button } from './components/Button';

// TODO: implement main entry point
function main() {
  console.log("App started");
  // FIXME: this should be async
  const users = createUser({ name: "Budi" });
  return users;
}

export default main;
EOF

cat > src/api/users.js << 'EOF'
// TODO: add error handling
export function createUser(data) {
  // hardcoded URL for now, fix later
  return fetch('http://localhost:3000/users', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function deleteUser(id) {
  // SECURITY: need to add auth check
  return fetch(`http://localhost:3000/users/${id}`, {
    method: 'DELETE'
  });
}
EOF

cat > src/utils/date.js << 'EOF'
export function formatDate(date) {
  // TODO: support i18n
  return date.toISOString();
}

export function parseDate(str) {
  return new Date(str);
}
EOF

cat > src/components/Button.js << 'EOF'
import React from 'react';

// FIXME: add disabled state
export function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}
EOF

cat > tests/users.test.js << 'EOF'
import { createUser } from '../src/api/users';

test('createUser should work', () => {
  // TODO: write actual test
  expect(true).toBe(true);
});
EOF

cat > config/app.yml << 'EOF'
server:
  port: 3000
  host: 0.0.0.0
database:
  url: postgres://localhost:5432/myapp
  pool_size: 10
EOF

cat > docs/README.md << 'EOF'
# Project README

This is a sample project for learning purposes.

## TODO
- Add more tests
- Write proper documentation
- Setup CI/CD
EOF

# Bikin file dummy di node_modules (harusnya di-skip saat search)
echo "// react source" > node_modules/react/index.js
echo "// lodash source" > node_modules/lodash/index.js
echo "// TODO: real implementation" >> node_modules/react/index.js
```

Setelah codebase jadi, lakukan misi investigasi berikut **semua lewat terminal**:

1. Cari semua file `.js` di project (EXCLUDE `node_modules`)
2. Cari semua file yang dimodifikasi dalam 24 jam terakhir
3. Cari semua TODO di codebase (EXCLUDE `node_modules`)
4. Cari semua FIXME di codebase, tampilkan dengan nomor baris
5. Cari semua file yang mengandung "localhost" — ini potensial masalah saat deploy ke production
6. Cari baris yang mengandung "SECURITY" — tampilkan 2 baris konteks setelahnya
7. Hitung berapa total TODO + FIXME di seluruh codebase (exclude node_modules)
8. Cari file `.js` yang ukurannya lebih besar dari 200 byte
9. Cari semua folder kosong di project
10. Cari file `.yml` dan tampilkan path + isinya (pakai `-exec`)
11. Bonus: ganti semua "TODO" menjadi "DONE" di file `src/` (hint: combine `grep -rl` + `sed` atau pakai `find ... -exec sed`)
12. Bonus: hapus semua file `.test.js` di folder `tests/` dengan `find ... -delete` (hati-hati, cek dulu dengan `-print`)

<details>
<summary>Solusi (klik expand — tapi coba dulu)</summary>

```bash
cd ~/belajar-linux/minggu-3/latihan/codebase

# 1. File .js exclude node_modules
find . -name "*.js" -not -path "*/node_modules/*"

# 2. File dimodifikasi 24 jam terakhir
find . -type f -mtime -1 -not -path "*/node_modules/*"

# 3. Semua TODO (exclude node_modules)
grep -rn "TODO" . --exclude-dir="node_modules"
# Atau pakai find
find . -name "*.js" -not -path "*/node_modules/*" -exec grep -n "TODO" {} +

# 4. Semua FIXME dengan nomor baris
grep -rn "FIXME" . --exclude-dir="node_modules"

# 5. File yang mengandung "localhost"
grep -rl "localhost" . --exclude-dir="node_modules"
# atau untuk liat baris match-nya:
grep -rn "localhost" . --exclude-dir="node_modules"

# 6. "SECURITY" dengan 2 baris konteks setelah
grep -rn -A 2 "SECURITY" . --exclude-dir="node_modules"

# 7. Hitung total TODO + FIXME
grep -rc "TODO\|FIXME" . --exclude-dir="node_modules" | grep -v ":0$"
# Atau lebih akurat:
grep -rE "TODO|FIXME" . --exclude-dir="node_modules" | wc -l

# 8. File .js > 200 byte
find . -name "*.js" -size +200c -not -path "*/node_modules/*" -exec ls -lh {} \;

# 9. Folder kosong
find . -type d -empty
# Folder kosong: docs/ mungkin, tests/ kalau udah dihapus

# 10. File .yml dengan isinya
find . -name "*.yml" -exec sh -c 'echo "=== {} ==="; cat {}' \;
# Atau lebih simple:
find . -name "*.yml" -print -exec cat {} \;

# 11. Ganti TODO jadi DONE di src/
# Linux:
grep -rl "TODO" src/ | xargs sed -i 's/TODO/DONE/g'
# Mac (sed di Mac beda, butuh -i ''):
grep -rl "TODO" src/ | xargs sed -i '' 's/TODO/DONE/g'
# Verifikasi:
grep -rn "TODO" src/    # harusnya kosong
grep -rn "DONE" src/    # harusnya muncul

# 12. Hapus file .test.js di tests/
# Cek dulu:
find tests -name "*.test.js" -print
# Hapus:
find tests -name "*.test.js" -delete
# Verifikasi:
ls tests/    # harusnya kosong
```

Catatan:
- `sed` belum kita bahas. Singkatnya: stream editor untuk manipulasi teks. `sed -i 's/old/new/g' file` = ganti "old" jadi "new" in-place.
- `xargs` belum kita bahas juga. Singkatnya: ambil input dari stdin, jadikan argumen command. `find ... | xargs command` mirip dengan `find ... -exec command {} +`.

</details>

---

## Tantangan ekstra (opsional)

- Pelajari `ripgrep` (`rg`) — pengganti `grep` yang jauh lebih cepat, default recursive, otomatis skip `.gitignore`. Install: `sudo apt install ripgrep` / `brew install ripgrep`. Coba ulangi misi 3 dan 4 dengan `rg`.
- Pelajari `fd` — pengganti `find` yang lebih friendly. Install: `sudo apt install fd-find` (binary-nya `fdfind` di Ubuntu) / `brew install fd`.
- Buat script bash yang nge-search codebase dan nge-report: jumlah TODO, FIXME, file dengan "localhost", file besar. Akan dibahas tuntas Sesi 11 (shell scripting).
- Cari pattern yang lebih advanced:
  - Email: `grep -rE "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" .`
  - URL: `grep -rE "https?://[a-zA-Z0-9./?=_-]+" .`
  - IPv4: `grep -rE "([0-9]{1,3}\.){3}[0-9]{1,3}" .`

---

## Tanda kelar

- [ ] Saya bisa cari file by name, type, size, time pakai `find`
- [ ] Saya tahu bedanya `-mtime -7`, `-mtime 7`, `-mtime +7`
- [ ] Saya tahu cara exclude folder di `find` (`-not -path`) dan `grep` (`--exclude-dir`)
- [ ] Saya bisa pakai `-exec` di find, dan tahu bedanya `\;` vs `+`
- [ ] Saya bisa pakai `grep -r` untuk cari teks di folder, dengan filter file
- [ ] Saya tahu flag penting: `-i`, `-v`, `-l`, `-n`, `-c`, `-A`, `-B`, `-C`
- [ ] Saya bisa pakai regex basic dan `-E` (extended) di grep
- [ ] Saya pernah selesaikan side project lengkap tanpa buka GUI

Kalau ada yang belum centang, ulang materi. Sesi 06 bakal bahas permission — juga pake `find -perm`, jadi fondasi ini harus kuat.

---

**Next:** `06-permissions.md` — `chmod`, `chown`, rwx, angka oktal. Kamu bakal paham kenapa `chmod 755` artinya "owner full, group dan others baca + eksekusi". Tanpa ini, kamu bakal sering mentok "permission denied" tanpa ngerti kenapa.
