# Sesi 04 — Membaca Isi File

> **Minggu 2, Sesi 4 dari 12**
> **Estimasi: 3–4 hari (60–75 menit/hari)**

## Tujuan sesi ini

Akhir sesi ini kamu harus bisa:
- Baca file kecil pake `cat`
- Browse file panjang pake `less` (search, scroll, jump)
- Liat sebagian file pake `head` dan `tail`
- Monitor log realtime pake `tail -f` (skill wajib buat debug production)
- Ngerti kapan pakai tool yang mana

Penting karena: 80% debugging server = baca log. Kalau kamu lambat baca log, kamu lambat debug. Period.

---

## Estimasi waktu belajar

| Hari | Aktivitas | Durasi |
|------|-----------|--------|
| 1 | `cat` + kapan harus & tidak harus pakai | 45 menit |
| 2 | `less` — pager interaktif (search, scroll, mark) | 75 menit |
| 3 | `head` + `tail` + `tail -f` untuk log monitoring | 75 menit |
| 4 | Side project + review | 60 menit |

---

## Materi 1: `cat` — Concatenate (dan baca file pendek)

`cat` aslinya bukan "baca file". Asalnya dari "concatenate" — menyambung file. Tapi use case paling umum: nge-print isi file ke stdout.

```bash
# Baca isi file
cat /etc/hostname

# Baca beberapa file sekaligus (sambung)
cat file1.txt file2.txt

# Sambung dan simpan ke file baru
cat file1.txt file2.txt > gabungan.txt

# Lihat dengan nomor baris
cat -n catatan.txt
#      1  baris pertama
#      2  baris kedua
#      3  baris ketiga
```

### Kapan PAKAI `cat`

- File pendek (di bawah ~100 baris)
- Mau lihat seluruh isi file sekaligus
- Mau menyambung beberapa file (itu use case asli)

### Kapan JANGAN pakai `cat`

- File panjang — output bakal scroll terus dan kamu gak bisa navigasi
- Mau cari kata di file — pakai `grep` (Sesi 05)
- Mau edit file — pakai editor (Sesi 10)
- Mau baca interaktif — pakai `less`

### Anti-pattern klasik: `cat file | grep`

```bash
cat file.txt | grep "error"      # BOROS — bikin 2 process
grep "error" file.txt            # HEMAT — langsung grep file
```

Banyak orang pakai `cat file | grep` padahal `grep` bisa langsung baca file. Ini disebut "useless use of cat" (UUOC). Tidak fatal, tapi bikin kamu kelihatan newbie.

---

## Materi 2: `less` — Pager interaktif (skill wajib)

`less` itu "pager" — program buat nampilin teks per halaman, dengan navigasi penuh. Nama asalnya dari "less is more" (lawan dari `more` yang lebih lama dan lebih terbatas).

```bash
# Buka file dengan less
less /var/log/syslog
less file.txt

# Pakai less buat output command panjang
ls -la /etc | less
```

### Navigasi dasar di dalam `less`

| Tombol | Aksi |
|--------|------|
| `Space` / `f` | Maju satu halaman |
| `b` | Mundur satu halaman |
| `Enter` / `j` / `↓` | Maju satu baris |
| `k` / `↑` | Mundur satu baris |
| `g` | Ke awal file |
| `G` | Ke akhir file |
| `:50` | Ke baris 50 |
| `50%` | Ke 50% file |
| `/kata` | Cari "kata" ke depan |
| `?kata` | Cari "kata" ke belakang |
| `n` | Ulangi pencarian (next match) |
| `N` | Ulangi pencarian (prev match) |
| `q` | Keluar |
| `h` | Help (lengkap) |
| `F` | Follow mode — kayak `tail -f` |

### Yang paling sering dipakai sehari-hari

- `/keyword` + `n` — cari dan lompat antar match. Ini 90% use case `less`.
- `G` — langsung ke akhir (lihat entry terbaru di log)
- `g` — balik ke awal
- `q` — keluar

### Tip penting: pakai `less` untuk output yang panjang

Banyak command yang outputnya panjang banget. Jangan biarkan scroll lewat — pipe ke `less`:

```bash
ls -la /etc | less
dmesg | less
history | less
```

### Follow mode di `less`

Tekan `F` (kapital) di dalam `less` = mode follow. Less bakal terus nunggu file bertambah (kayak `tail -f`). Bagus kalau kamu mau monitoring tapi juga mau bisa scroll ke atas buat liat history.

Keluar dari follow mode: `Ctrl+C` (kembali ke mode normal, gak keluar less).

---

## Materi 3: `head` — Lihat bagian awal file

Default: 10 baris pertama.

```bash
# 10 baris pertama
head /etc/passwd

# N baris pertama
head -n 20 /etc/passwd
head -20 /etc/passwd           # shortcut

# 5 baris pertama dari output command
ls /usr/bin | head -5
```

### Use case umum

- Liat format file yang gak dikenal tanpa dump semua
- Cek header CSV sebelum proses
- Liat beberapa baris pertama log setelah boot

```bash
# Liat 3 baris pertama tiap file di folder
for f in *.log; do echo "=== $f ==="; head -3 "$f"; done
```

---

## Materi 4: `tail` — Lihat bagian akhir file

Default: 10 baris terakhir. Ini command paling penting buat monitoring log.

```bash
# 10 baris terakhir
tail /var/log/syslog

# N baris terakhir
tail -n 50 /var/log/syslog
tail -50 /var/log/syslog

# Semua baris SETELAH baris ke-100
tail -n +100 file.txt
```

### `tail -f` — Monitor log realtime

Ini skill wajib. `-f` = follow. `tail` gak keluar, tapi terus monitor file dan print baris baru saat ditambahkan.

```bash
# Monitor log sistem realtime
tail -f /var/log/syslog

# Monitor log nginx
sudo tail -f /var/log/nginx/error.log

# Monitor beberapa file sekaligus
tail -f /var/log/syslog /var/log/auth.log
# Outputnya bakal ada header: ==> /var/log/syslog <==
```

Keluar dari `tail -f`: `Ctrl+C`.

### `tail -F` (kapital) — Lebih robust

Bedanya sama `-f`: `-F` akan retry kalau file di-rotate (diganti dengan file baru). Production server sering rotate log (misal `syslog` dipindah ke `syslog.1`, lalu file `syslog` baru dibuat). `-f` bakal mentok di file lama, `-F` akan ke file baru.

**Selalu pakai `-F` di production.** Di sandbox belajar, `-f` cukup.

### Kombinasi klasik: `tail` + `grep`

```bash
# Hanya tampilkan error yang muncul di log realtime
tail -f /var/log/nginx/error.log | grep "ERROR"

# Tampilkan request dengan status 404
tail -f /var/log/nginx/access.log | grep " 404 "
```

Pipe di sini akan dibahas detail Sesi 08.

---

## Materi 5: Tool tambahan yang berguna

### `wc` — Word count (dan line count)

```bash
wc -l file.txt        # hitung jumlah baris
wc -w file.txt        # hitung jumlah kata
wc -c file.txt        # hitung jumlah byte
wc -l /etc/passwd     # berapa user di sistem
```

### `nl` — Number lines

```bash
nl file.txt
# Mirip cat -n tapi lebih configurable
```

### `tac` — `cat` terbalik

```bash
tac file.txt
# Print baris terakhir dulu, baru ke awal
# Berguna kalau log paling baru di bawah
```

---

## Common pitfalls

### 1. `cat` file binary

```bash
cat /bin/ls
# Output: karakter aneh + terminal rusak tampilannya
```

Kalau terminal jadi aneh setelah `cat` file binary, ketik:

```bash
reset
```

Atau `Ctrl+J` `stty sane` `Ctrl+J`. Untuk mencegah: jangan `cat` file yang gak jelas. Cek dulu dengan `file`:

```bash
file /bin/ls
# /bin/ls: ELF 64-bit LSB shared object, x86-64, ...
```

Kalau outputnya `ELF` atau `data` — itu binary, jangan `cat`.

### 2. Lupa `q` di `less`

Banyak newbie stuck di `less` gara-gara gak tahu cara keluar. **Tekan `q`.** Itu aja. Kalau mentok, `Ctrl+C` dulu lalu `q`.

### 3. Baca log file yang besar dengan `cat`

```bash
cat /var/log/syslog       # bisa ratusan MB!
```

Layar scroll terus, head lost. Selalu pakai `less` atau `tail` untuk file besar.

### 4. `tail -f` di file yang gak ada

```bash
tail -f /var/log/nginx/error.log
# tail: cannot open '/var/log/nginx/error.log' for reading: No such file or directory
# tail: no files remaining
```

Pastikan file ada dulu. Kalau mau tunggu file sampai ada, pakai `-F` (retry):

```bash
tail -F /var/log/nginx/error.log
```

### 5. Permission denied waktu baca log

Log sistem biasanya milik root atau group `adm`. Pakai `sudo`:

```bash
sudo tail /var/log/auth.log
```

Atau tambah user kamu ke group `adm` (Ubuntu):

```bash
sudo usermod -aG adm $USER
# Logout lalu login lagi supaya efek
```

### 6. `head`/`tail` dengan offset negatif/positif salah

```bash
tail -n 20 file      # 20 baris terakhir
tail -n +20 file     # mulai dari baris 20 sampai akhir (BEDA!)
head -n 20 file      # 20 baris pertama
head -n -20 file     # semua kecuali 20 baris terakhir
```

Hafal perbedaan ini.

---

## Side project: "Log reader challenge"

### Brief

Kamu bakal simulasi scenario baca log production. Pertama, generate file log dummy dulu:

```bash
# Bikin folder dan file log dummy
mkdir -p ~/belajar-linux/minggu-2/latihan/logs
cd ~/belajar-linux/minggu-2/latihan/logs

# Generate log palsu 1000 baris (copy-paste blok ini ke terminal)
for i in $(seq 1 200); do
  echo "[$(date -d "$i minutes ago" +"%Y-%m-%d %H:%M:%S")] INFO: User user$((i % 10)) logged in" >> app.log
  echo "[$(date -d "$i minutes ago" +"%Y-%m-%d %H:%M:%S")] INFO: Request processed in $((i * 5))ms" >> app.log
  if [ $((i % 7)) -eq 0 ]; then
    echo "[$(date -d "$i minutes ago" +"%Y-%m-%d %H:%M:%S")] ERROR: Database connection failed (attempt $i)" >> app.log
  fi
  if [ $((i % 11)) -eq 0 ]; then
    echo "[$(date -d "$i minutes ago" +"%Y-%m-%d %H:%M:%S")] WARN: Slow query detected (${i}ms)" >> app.log
  fi
done

# Generate log kedua untuk simulasi multi-file
echo "[$(date +"%Y-%m-%d %H:%M:%S")] INFO: Background job started" >> worker.log
```

Setelah file `app.log` jadi, lakukan misi berikut **semua lewat terminal**:

1. Cek berapa total baris di `app.log`
2. Liat 5 baris pertama untuk paham format-nya
3. Liat 10 baris terakhir untuk liat entry paling baru
4. Buka `app.log` dengan `less`, cari semua entry ERROR, hitung berapa jumlahnya
5. Buka `app.log` dengan `less`, cari entry dengan text "Slow query", lompat ke match pertama
6. Tampilkan 3 baris setelah setiap entry "ERROR" (hint: gunakan `grep -A 3`, akan dibahas Sesi 05 — tapi coba cari sendiri)
7. Generate log terus-menerus (simulate live log) dengan command berikut di terminal terpisah:

```bash
# Jalanin di terminal KEDUA (jangan ditutup)
while true; do
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] INFO: heartbeat ok" >> app.log
  sleep 2
done
```

8. Kembali ke terminal pertama, monitor `app.log` secara realtime dengan `tail -f`
9. Sambil monitoring, filter hanya entry yang mengandung "INFO" (pipe ke grep)
10. Keluar dari monitoring, lalu cek 20 baris terakhir yang mengandung "ERROR" saja

<details>
<summary>Solusi (klik expand)</summary>

```bash
# Setup
mkdir -p ~/belajar-linux/minggu-2/latihan/logs
cd ~/belajar-linux/minggu-2/latihan/logs

# Generate log (copy dari brief di atas)

# 1. Total baris
wc -l app.log
# Output: 1000 app.log  (atau angka mendekati)

# 2. 5 baris pertama
head -5 app.log

# 3. 10 baris terakhir
tail -10 app.log

# 4. Cari ERROR pakai less
less app.log
# Di dalam less, ketik: /ERROR
# Tekan n berkali-kali untuk lompat ke match berikutnya
# Count manual atau pakai:
#   di less, tekan &/ERROR  -> filter hanya yang match
# Atau keluar dari less, pakai grep:
grep -c ERROR app.log
# (grep akan dibahas Sesi 05)

# 5. Cari "Slow query" di less
less app.log
# Ketik: /Slow query
# n untuk next match, N untuk prev match

# 6. 3 baris setelah ERROR
grep -A 3 "ERROR" app.log
# Atau pakai awk (advanced): awk '/ERROR/{print; for(i=1;i<=3;i++){getline; print}}' app.log

# 7. (Di terminal kedua)
while true; do
  echo "[$(date +"%Y-%m-%d %H:%M:%S")] INFO: heartbeat ok" >> app.log
  sleep 2
done

# 8. Monitor realtime (di terminal pertama)
tail -f app.log
# atau lebih robust:
tail -F app.log

# 9. Filter hanya INFO
tail -f app.log | grep "INFO"

# 10. 20 baris ERROR terakhir
# grep ERROR dulu, baru tail
grep "ERROR" app.log | tail -20
# Atau tail dulu baru grep:
tail -100 app.log | grep "ERROR"
```

Catatan: materi piping (`|`) dan grep dibahas tuntas di Sesi 05 dan Sesi 08. Kalau kamu sempet baca-baca dan paham konsepnya lebih awal, bagus. Kalau belum, ini gambaran kasarnya.

</details>

---

## Tantangan ekstra (opsional)

- Pelajari `multitail` (`sudo apt install multitail`) — bisa monitor beberapa log sekaligus dengan layout split screen.
- Baca manual `less` (`man less`), cari 3 fitur yang belum kamu tahu. Beberapa yang menarik: `&pattern` (filter), `ma`/`'a` (mark & jump), `v` (buka di editor).
- Setup logrotate simulation: pindah `app.log` ke `app.log.1`, buat `app.log` baru, dan amati bedanya `tail -f` (stuck di file lama) vs `tail -F` (pindah ke file baru).

---

## Tanda kelar

- [ ] Saya tahu kapan pakai `cat` vs `less` vs `head`/`tail`
- [ ] Saya bisa navigasi `less` dengan nyaman: scroll, search, jump ke awal/akhir
- [ ] Saya tahu cara keluar dari `less` (tekan `q`)
- [ ] Saya bisa pakai `tail -f` untuk monitor log realtime, dan tahu kapan harus pakai `tail -F` (kapital)
- [ ] Saya pernah mengalami `cat` file binary dan tahu cara recover dengan `reset`
- [ ] Saya sadar anti-pattern `cat file | grep` dan bisa avoid
- [ ] Saya bisa hitung jumlah baris file dengan `wc -l`
- [ ] Saya pernah selesaikan side project lengkap tanpa buka GUI

Kalau ada yang belum centang, ulang dulu. Sesi 05 asumsi kamu udah lancar baca file.

---

**Next:** `05-find-dan-grep.md` — sekarang saatnya cari file berdasarkan nama/atribut (`find`) dan cari konten di dalam file (`grep`). Ini dua command yang kamu pakai setiap hari kalau kerja di codebase besar atau server dengan ribuan file.
