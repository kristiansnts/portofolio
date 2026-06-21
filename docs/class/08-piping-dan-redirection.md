# Sesi 08 — Piping & Redirection: `|`, `>`, `>>`, `2>&1`

> **Minggu 4, Sesi 8 dari 12**
> **Estimasi: 5–6 hari (75–90 menit/hari)**

## Tujuan sesi ini

Akhir sesi ini kamu harus bisa:
- Paham konsep **stdin, stdout, stderr** sebagai 3 stream utama tiap proses
- Pipe output command ke command lain dengan `|`
- Redirect output ke file dengan `>` dan `>>`
- Redirect stderr dengan `2>`, `2>&1`, `&>`
- Pakai `/dev/null` buat "discard" output
- Bangun pipeline kompleks (3+ command) untuk manipulasi data
- Pakai `tee` untuk "T-junction" — output ke file DAN stdout
- Pakai `xargs` untuk ubah stdin jadi argumen
- Pakai process substitution `<()` dan `>()`

Sesi ini = jantungnya Unix philosophy. **"Write programs that do one thing and do it well. Write programs to work together."** Pipe adalah cara mereka kerja sama.

---

## Estimasi waktu belajar

| Hari | Aktivitas | Durasi |
|------|-----------|--------|
| 1 | Konsep stdin/stdout/stderr + redirect dasar (`>`, `>>`) | 75 menit |
| 2 | Stderr redirect (`2>`, `2>&1`, `&>`) + `/dev/null` | 75 menit |
| 3 | Pipe `\|` + pipeline building | 90 menit |
| 4 | `tee`, `xargs`, command substitution | 90 menit |
| 5 | Process substitution `<()` + here-doc `<<` | 75 menit |
| 6 | Side project + review | 90 menit |

---

## Materi 1: Tiga stream standar

Setiap proses di Unix punya 3 stream standar yang otomatis dibuka saat start:

| Stream | FD | Default | Arti |
|--------|-----|---------|------|
| **stdin** | 0 | Keyboard | Input ke proses |
| **stdout** | 1 | Terminal | Output normal |
| **stderr** | 2 | Terminal | Output error/diagnostic |

**FD** = File Descriptor. Angka yang dipakai kernel untuk track open file/stream.

Cek FD proses kamu:

```bash
ls -la /proc/$$/fd
# Atau untuk proses tertentu:
ls -la /proc/1234/fd
```

Output kira-kira:

```
lrwx------ 1 budi budi 64 ... 0 -> /dev/pts/0
lrwx------ 1 budi budi 64 ... 1 -> /dev/pts/0
lrwx------ 1 budi budi 64 ... 2 -> /dev/pts/0
```

FD 0, 1, 2 semua menunjuk ke terminal (`/dev/pts/0`). Saat kamu redirect, kamu ubah kemana FD ini menunjuk.

---

## Materi 2: Redirect stdout ke file — `>` dan `>>`

```bash
# Redirect stdout ke file (OVERWRITE kalau udah ada)
echo "hello" > file.txt
ls -la > listing.txt
date > timestamp.txt

# Append (tambah di akhir, bikin baru kalau belum ada)
echo "line 2" >> file.txt
echo "more" >> file.txt
```

Verifikasi:

```bash
cat file.txt
# hello
# line 2
# more
```

### Bahaya `>` — silent overwrite

```bash
cat very-important.txt > backup.txt   # OK
echo "oops" > backup.txt              # backup.txt KE-TIMPA!
cat backup.txt
# oops
```

Tips safety:
- Pakai `set -o noclobber` di `~/.bashrc` — `>` bakal error kalau file udah ada. Override pakai `>|`
- Selalu cek apakah file udah ada sebelum redirect

### Redirect banyak command ke satu file

```bash
{
  echo "Header"
  date
  ls -la
  echo "Footer"
} > output.txt

cat output.txt
# Header
# Mon Nov 12 10:30:00 UTC 2024
# ... ls output ...
# Footer
```

`{ }` group command, output gabungan di-redirect ke file. Berguna banget.

---

## Materi 3: Redirect stdin dari file — `<`

```bash
# Baca file sebagai stdin command
wc -l < /etc/passwd
sort < names.txt
grep "error" < log.txt
```

Bedanya dengan `command file`:

```bash
grep "error" log.txt      # grep yang buka file, tahu nama file
grep "error" < log.txt    # shell yang buka file, grep lihat sebagai stdin (gak tahu nama file)
```

Konsekuensi: command yang nampilin nama file di output (seperti `grep -H`) bakal beda. `grep "x" file.txt` tahu nama file = "file.txt". `grep "x" < file.txt` lihat sebagai stdin, nama file-nya "(standard input)".

Sebagian besar kasus, langsung `command file` lebih simple. `<` berguna kalau:
- Command gak terima file sebagai argumen (misal `wc` tanpa nama file di argumen)
- Skrip butuh input dari file

---

## Materi 4: Redirect stderr — `2>`, `2>>`

```bash
# Stderr ke file (terpisah dari stdout)
ls /etc /tidak-ada 2> errors.txt
# Output terminal: isi /etc
# File errors.txt: "ls: cannot access '/tidak-ada': No such file or directory"

# Append stderr
ls /etc /tidak-ada-2 2>> errors.txt
```

### Discard stderr — `2> /dev/null`

Klasik banget, terutama untuk `find`:

```bash
find / -name "config.yml"
# Output:
# /home/budi/config.yml
# find: '/proc/1/fd': Permission denied
# find: '/etc/ssl/private': Permission denied
# ... puluhan error

find / -name "config.yml" 2> /dev/null
# Output bersih:
# /home/budi/config.yml
```

`/dev/null` = "black hole" — file spesial yang apapun ditulis akan hilang.

---

## Materi 5: Combined redirect — `2>&1`, `&>`, `&>>`

Seringkali kamu mau stdout DAN stderr masuk ke file yang sama. Terutama untuk log.

### Cara lama (POSIX): `> file 2>&1`

```bash
command > output.log 2>&1
```

Baca urutan kanan ke kiri:
1. `2>&1` — stderr (FD 2) di-redirect ke mana FD 1 menunjuk
2. `> output.log` — stdout (FD 1) di-redirect ke output.log

**URUTAN PENTING!** Kalau terbalik:

```bash
command 2>&1 > output.log   # SALAH
# 1. > output.log — FD 1 ke file
# 2. 2>&1 — FD 2 ke mana FD 1 menunjuk (file) — wait, ini nggak benar
#    Sebenarnya: FD 2 di-copy ke posisi FD 1 SEBELUM FD 1 di-redirect
#    Jadi FD 2 tetap ke terminal
```

Hasilnya: stdout ke file, stderr tetap ke terminal. **Bukan yang kamu mau.**

**Selalu urutan: `> file 2>&1` atau `>> file 2>&1`.**

### Cara modern (bash 4+): `&>` dan `&>>`

```bash
command &> output.log      # stdout+stderr ke file (overwrite)
command &>> output.log     # stdout+stderr ke file (append)
```

Lebih ringkas dan gak bisa salah urutan. Tapi gak portabel ke `sh` murni (POSIX). Untuk script bash, pakai ini. Untuk script yang harus jalan di sh/dash, pakai cara lama.

### Discard semua output

```bash
command > /dev/null 2>&1
# Atau modern:
command &> /dev/null
```

---

## Materi 6: Pipe — `|`

Pipe = ambil stdout command kiri, jadikan stdin command kanan.

```bash
command1 | command2
# stdout dari command1 → stdin command2
```

Contoh:

```bash
# Cari proses nginx
ps aux | grep nginx

# Hitung file di folder
ls | wc -l

# Sortir output, ambil top 10
du -sh * | sort -h | head -10

# Find + grep + sort + uniq
find . -name "*.log" -exec grep "ERROR" {} + | sort | uniq -c | sort -rn | head
```

### Pipe lines, bukan bytes

Pipe mengalirkan output baris per baris (atau byte per byte, tergantung command). Command kanan gak harus nunggu command kiri selesai — bisa kerja secara streaming.

Contoh streaming:

```bash
# Generate terus, filter, hitung
yes "hello world" | head -100 | wc -w
# 200 (100 lines × 2 words)
```

`yes` akan terus cetak "hello world" selamanya. Tapi `head -100` nutup pipe setelah 100 baris, signal SIGPIPE ke `yes`, `yes` mati.

### Stderr TIDAK ikut di-pipe

```bash
ls /etc /tidak-ada | grep "etc"
# Output terminal:
# etc
# (stderr "ls: cannot access '/tidak-ada'" tetap muncul di terminal)
```

Kalau mau stderr juga di-pipe:

```bash
ls /etc /tidak-ada 2>&1 | grep "cannot"
# Output:
# ls: cannot access '/tidak-ada': No such file or directory
```

### Pipeline dengan banyak stage

```bash
# Top 10 file terbesar di home
find ~ -type f -exec du -h {} + 2>/dev/null | sort -h | tail -10

# Hitung jumlah file per extension
find . -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn | head

# Cari baris yang sama di 2 file
sort file1.txt > /tmp/sorted1
sort file2.txt > /tmp/sorted2
comm -12 /tmp/sorted1 /tmp/sorted2

# HTTP request log: top 10 IP
grep "GET /api" access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head
```

---

## Materi 7: `tee` — T-junction

`tee` = ambil stdin, tulis ke file DAN kirim ke stdout. Kayak pipa T — air masuk, keluar ke 2 arah.

```bash
# Output ke file DAN terminal
ls -la | tee listing.txt

# Append mode
ls -la | tee -a listing.txt

# Tee ke multiple file
ls -la | tee file1.txt file2.txt file3.txt
```

### Use case klasik: log + lihat

```bash
# Jalanin command, outputnya keliahatan di terminal DAN tersimpan ke log
./build.sh 2>&1 | tee build.log

# Dengan append (kalau run berkali-kali)
./build.sh 2>&1 | tee -a build.log
```

### Tee dengan sudo — write ke file yang butuh root

```bash
echo "new config" | sudo tee /etc/some-config.txt
# Output: new config (terminal)
# File /etc/some-config.txt berisi "new config"
```

Trik klasik. `echo` jalan sebagai user biasa, outputnya masuk ke `tee` yang di-`sudo` — `tee` jalan sebagai root, bisa tulis ke `/etc/`.

---

## Materi 8: `xargs` — stdin jadi argumen

`xargs` = ambil stdin, jadikan argumen command.

```bash
# Cari file .log, hapus semua
find /tmp -name "*.log" | xargs rm

# Cari file .py, hitung baris
find . -name "*.py" | xargs wc -l

# Download list URL dari file
cat urls.txt | xargs wget
```

Bedanya dengan backtick / `$()`:
- `xargs` handle spasi di nama file (dengan `-0`)
- `xargs` batching — kalau terlalu banyak argumen, di-batch per command
- `xargs` bisa parallel dengan `-P`

### `-I` — placeholder

```bash
# Copy setiap file ke /backup/
find . -name "*.txt" | xargs -I {} cp {} /backup/

# Dengan custom placeholder
find . -name "*.log" | xargs -I FILE echo "Found: FILE"
```

### `-0` — null-terminated (untuk nama file dengan spasi/newline)

```bash
find . -name "*.txt" -print0 | xargs -0 rm
# -print0 = dipisah null, bukan newline
# -0 = baca null-terminated
# Ini SAFER karena nama file dengan spasi/newline gak bikin pecah
```

**Selalu pakai `-print0 | xargs -0` untuk operasi file.** Hindari bug nama file dengan spasi.

### Parallel dengan `-P`

```bash
# Download 4 file bersamaan
cat urls.txt | xargs -P 4 -n 1 wget
# -P 4 = 4 proses parallel
# -n 1 = 1 argumen per command
```

Berguna untuk task I/O heavy (download, compress, dll) yang bisa di-parallel.

---

## Materi 9: Command substitution — `$()` dan backtick

```bash
# Simpan output command ke variable
TODAY=$(date +%Y-%m-%d)
echo $TODAY
# 2024-11-12

# Pakai langsung di command lain
mkdir "backup-$(date +%Y%m%d)"
ls
# backup-20241112

# Nested (ga bisa dengan backtick, bisa dengan $())
echo "User count: $(grep -c /bin/bash /etc/passwd)"

# Backtick (cara lama, hindari)
TODAY=`date +%Y-%m-%d`
# Sama dengan $(), tapi gak bisa nested dan susah dibaca
```

Selalu pakai `$()` bukan backtick. Lebih readable, bisa nested, dan gak ambigu dengan single quote.

---

## Materi 10: Process substitution — `<()` dan `>()`

Advanced tapi powerful. Buat file sementara yang isinya output command, tanpa bikin file fisik.

```bash
# Bandingkan 2 directory tanpa bikin file temp
diff <(ls dir1) <(ls dir2)

# Bandingkan output 2 command
diff <(date) <(date -d "yesterday")

# while read dari output command
while read line; do
  echo "Processing: $line"
done < <(find . -name "*.txt")
```

`<(command)` = buat "file" yang isinya output command, kasih path-nya ke command luar.

`>(command)` = kebalikannya — kasih path yang output ditulis akan jadi stdin command.

```bash
# Log sekaligus filter
command > >(grep "ERROR" > errors.txt) 2> >(grep "WARN" > warnings.txt)
```

---

## Materi 11: Here-doc — `<<`

Input multi-line ke command.

```bash
cat << 'EOF'
Ini multiline
bisa tulis apa aja
termasuk $variable yang TIDAK di-expand karena 'EOF' (quoted)
EOF

cat << EOF
Halo $USER
Tanggal: $(date)
EOF
# Output:
# Halo budi
# Tanggal: Mon Nov 12 10:30:00 UTC 2024
```

- `<< 'EOF'` (quoted) = literal, tidak expand variable
- `<< EOF` (unquoted) = expand variable dan command substitution

Use case umum: bikin file konfigurasi dari script.

```bash
cat > /tmp/myapp.conf << 'EOF'
[server]
port=8080
host=0.0.0.0
debug=false
EOF
```

### Here-string — `<<<`

Versi single-line dari here-doc:

```bash
grep "pattern" <<< "some text with pattern inside"
# Output: some text with pattern inside

# Bandingkan dengan echo + pipe
echo "some text with pattern inside" | grep "pattern"
# Sama hasilnya
```

Berguna kalau mau kasih string ke command yang expect stdin, tanpa subshell.

---

## Common pitfalls

### 1. Salah urutan `2>&1`

```bash
command 2>&1 > file   # SALAH — stderr tetap ke terminal
command > file 2>&1   # BENAR — keduanya ke file
command &> file       # BENAR (modern bash) — keduanya ke file
```

### 2. Lupa quote variable di command substitution

```bash
file="my file.txt"
cat $file          # cat: my: No such file or directory
                  # cat: file.txt: No such file or directory
cat "$file"        # BENAR
```

Selalu quote `"$()"` dan `"$var"` kalau mungkin ada spasi.

### 3. `xargs` pecah dengan nama file spasi

```bash
find . -name "*.txt" | xargs rm
# Kalau ada file "my notes.txt":
# rm: my: No such file or directory
# rm: notes.txt: No such file or directory
```

Fix:

```bash
find . -name "*.txt" -print0 | xargs -0 rm
# Atau pakai -exec:
find . -name "*.txt" -exec rm {} +
```

### 4. Pipe gak lewat stderr

```bash
command1 | command2
# stderr command1 tetap ke terminal, BUKAN masuk command2
```

Kalau mau stderr juga:

```bash
command1 2>&1 | command2
```

### 5. SIGPIPE membuat script exit premature

```bash
yes | head -1
# yes: write error: Broken pipe
```

`yes` mati karena `head` nutup pipe setelah dapat 1 baris. Script yang tangkap error bisa exit premature. Tambahkan `set +o pipefail` atau handle signal.

### 6. `>` tanpa sadar overwrite file penting

```bash
cat data.txt > backup.txt    # kalau backup.txt udah ada, KE-TIMPA
```

Tips: `set -o noclobber` di `~/.bashrc`.

### 7. Variable di here-doc gak di-expand padahal mau

```bash
cat << 'EOF'      # QUOTED = gak expand
User: $USER
EOF
# Output: User: $USER (literal)

cat << EOF        # UNQUOTED = expand
User: $USER
EOF
# Output: User: budi
```

Hafalkan: kutip = literal, no kutip = expand.

### 8. Backtick vs single quote

```bash
echo `date`         # backtick = command substitution, output tanggal
echo 'date'         # single quote = literal, output "date"
echo "$(date)"      # sama dengan backtick, lebih readable
```

Banyak newbie tertukar. Backtick = eksekusi command.

### 9. `tee` setelah `sudo` gak work

```bash
sudo echo "config" > /etc/something
# Permission denied — karena > di-handle shell (user biasa), bukan sudo
```

Fix pakai `tee`:

```bash
echo "config" | sudo tee /etc/something
```

---

## Side project: "Log analyzer pipeline"

### Brief

Kamu bakal bikin pipeline log analyzer yang sebenarnya berguna. Generate data dummy dulu:

```bash
mkdir -p ~/belajar-linux/minggu-4/latihan/logs
cd ~/belajar-linux/minggu-4/latihan/logs

# Generate access.log palsu 1000 baris (simulasi nginx access log)
cat > generate-log.sh << 'EOF'
#!/bin/bash
IP_POOL=("10.0.0.1" "10.0.0.2" "10.0.0.3" "192.168.1.10" "192.168.1.20" "8.8.8.8" "1.1.1.1")
PATHS=("/" "/api/users" "/api/posts" "/static/css/main.css" "/static/js/app.js" "/login" "/admin" "/api/orders" "/checkout" "/about")
STATUS=("200" "200" "200" "200" "200" "200" "301" "404" "404" "403" "500" "502")
USER_AGENTS=("Mozilla/5.0" "curl/7.81.0" "PostmanRuntime/7.32" "bot/1.0" "Mobile Safari")

for i in $(seq 1 1000); do
  ip=${IP_POOL[$RANDOM % ${#IP_POOL[@]}]}
  path=${PATHS[$RANDOM % ${#PATHS[@]}]}
  status=${STATUS[$RANDOM % ${#STATUS[@]}]}
  size=$((RANDOM % 10000 + 100))
  ua=${USER_AGENTS[$RANDOM % ${#USER_AGENTS[@]}]}
  ts=$(date -d "$i minutes ago" +"%d/%b/%Y:%H:%M:%S")
  echo "$ip - - [$ts] \"GET $path HTTP/1.1\" $status $size \"-\" \"$ua\"" >> access.log
done

# Generate error.log
for i in $(seq 1 100); do
  ts=$(date -d "$i minutes ago" +"%Y-%m-%d %H:%M:%S")
  level=$(($RANDOM % 5))
  case $level in
    0) echo "$ts [error] client sent invalid request" >> error.log ;;
    1) echo "$ts [warn] slow query detected (${i}ms)" >> error.log ;;
    2) echo "$ts [error] upstream timeout" >> error.log ;;
    3) echo "$ts [info] graceful restart initiated" >> error.log ;;
    4) echo "$ts [crit] database connection lost" >> error.log ;;
  esac
done
EOF
chmod +x generate-log.sh
./generate-log.sh

# Verifikasi
wc -l access.log error.log
```

Setelah data jadi, lakukan misi berikut **semua lewat pipeline (gak boleh pakai file temp)**:

1. Tampilkan 5 baris pertama access.log (pakai `head`)
2. Hitung total baris di access.log dan error.log dalam satu command
3. Cari semua request dengan status 404, tampilkan path-nya saja (kolom ke-7)
4. Hitung berapa request per IP, urutkan dari yang terbanyak (top 10 IP)
5. Hitung berapa request per path, urutkan dari yang terbanyak (top 10 path)
6. Cari semua error dengan status 5xx (500, 502, dll)
7. Hitung distribusi status code (berapa 200, berapa 404, berapa 500, dll) — urutkan by count
8. Cari semua request dari bot, hitung berapa
9. Ambil timestamp dari 10 request terakhir yang status 500, simpan ke file `500-errors.txt`
10. Bikin pipeline yang generate report: "Top 5 IP + jumlah request, top 5 path + jumlah request, total request" dalam satu run. Simpan ke `report.txt` sekaligus tampilkan ke terminal (pakai `tee`)
11. BONUS: Bandingkan path yang muncul di access.log vs path yang ada di folder dummy. Generate folder dummy:
    ```bash
    mkdir -p /tmp/web-root
    for p in / /api /api/users /api/posts /static /static/css /static/js /login /admin; do
      mkdir -p "/tmp/web-root$p"
    done
    ```
    Lalu: cari path yang di-request di log tapi folder-nya gak ada (404 candidate).
12. BONUS: Hitung rata-rata response size per status code

<details>
<summary>Solusi (klik expand)</summary>

```bash
cd ~/belajar-linux/minggu-4/latihan/logs

# 1. 5 baris pertama
head -5 access.log

# 2. Hitung baris kedua file
wc -l access.log error.log
# Atau jika mau total saja:
cat access.log error.log | wc -l

# 3. Status 404, path saja (kolom 7)
grep ' 404 ' access.log | awk '{print $7}' | head
# Kolom ke-7 adalah path (berdasarkan format log nginx standar)

# 4. Top 10 IP by request count
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10

# 5. Top 10 path
awk '{print $7}' access.log | sort | uniq -c | sort -rn | head -10

# 6. Status 5xx
grep -E '" [5][0-9][0-9] ' access.log
# Atau:
awk '$9 ~ /^5/' access.log

# 7. Distribusi status code
awk '{print $9}' access.log | sort | uniq -c | sort -rn

# 8. Request dari bot
grep "bot/" access.log | wc -l

# 9. 10 request 500 terakhir, timestamp ke file
grep ' 500 ' access.log | tail -10 | awk -F'[][]' '{print $2}' > 500-errors.txt
cat 500-errors.txt

# 10. Generate report
{
  echo "=== LOG ANALYSIS REPORT ==="
  echo "Generated: $(date)"
  echo ""
  echo "Total requests: $(wc -l < access.log)"
  echo ""
  echo "Top 5 IP:"
  awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -5
  echo ""
  echo "Top 5 Paths:"
  awk '{print $7}' access.log | sort | uniq -c | sort -rn | head -5
  echo ""
  echo "Status code distribution:"
  awk '{print $9}' access.log | sort | uniq -c | sort -rn
} | tee report.txt

# 11. Bandingkan path log vs folder yang ada
# Ambil path unik dari log, normalisasi (ambil directory-nya)
# Lalu check apakah ada di filesystem
echo "404 candidates (path requested but folder doesn't exist):"
awk '{print $7}' access.log | sort -u | while read path; do
  dir=$(dirname "$path")
  if [ ! -d "/tmp/web-root$dir" ]; then
    echo "$path"
  fi
done | sort -u | head

# 12. Rata-rata response size per status code
awk '{total[$9] += $10; count[$9]++} END {for (s in total) printf "%s: avg=%.0f bytes (n=%d)\n", s, total[s]/count[s], count[s]}' access.log | sort
```

Penjelasan:
- `awk '{print $N}'` = print kolom ke-N (whitespace-separated)
- `sort | uniq -c` = hitung kemunculan tiap baris unik
- `sort -rn` = sort numeric descending
- `awk -F'[][]'` = set field separator ke `[` atau `]` (untuk timestamp di log nginx)

</details>

---

## Tantangan ekstra (opsional)

- Pelajari `awk` lebih dalam. Ini bahasa pemrograman sendiri, sangat powerful untuk text processing. Coba: `awk 'BEGIN{FS=","} NR>1 {sum+=$2} END {print "Average:", sum/(NR-1)}' data.csv`
- Pelajari `sed` untuk stream editing. Coba: `sed -i 's/old/new/g' file.txt`
- Bikin pipeline yang monitor access.log realtime (pakai `tail -f`) dan alert kalau ada IP yang lebih dari 10 request dalam 1 menit (hint: pakai `awk` dengan array counter).
- Pelajari `jq` untuk parsing JSON di terminal. Sangat berguna untuk API.

---

## Tanda kelar

- [ ] Saya paham konsep stdin, stdout, stderr dan 3 file descriptor utama
- [ ] Saya bisa redirect stdout ke file dengan `>` dan `>>`
- [ ] Saya bisa redirect stderr dengan `2>` dan discard dengan `2>/dev/null`
- [ ] Saya bisa redirect stdout + stderr bersamaan dengan `&>` atau `> file 2>&1`
- [ ] Saya bisa bangun pipeline 3+ command dengan `|`
- [ ] Saya tahu stderr tidak ikut pipe kecuali di-redirect dulu
- [ ] Saya bisa pakai `tee` untuk output ke file dan terminal sekaligus
- [ ] Saya bisa pakai `xargs` untuk ubah stdin jadi argumen, tahu kapan harus pakai `-0`
- [ ] Saya bisa pakai command substitution `$()` (bukan backtick)
- [ ] Saya bisa pakai process substitution `<()` untuk compare output command
- [ ] Saya bisa pakai here-doc `<<` untuk input multiline
- [ ] Saya pernah selesaikan side project lengkap

Kalau ada yang belum centang, ulang dulu. Ini sesi paling fundamental — sisanya bergantung ke sini.

---

**Next:** `09-environment-variables.md` — `export`, `.bashrc`, `$PATH`. Kamu bakal paham kenapa `node` bisa jalan dari folder manapun, gimana cara set alias biar hemat ngetik, dan kenapa edit `.bashrc` kadang gak langsung efek.
