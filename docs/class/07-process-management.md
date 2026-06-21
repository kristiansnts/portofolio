# Sesi 07 — Process Management: `ps`, `top`, `htop`, `kill`

> **Minggu 4, Sesi 7 dari 12**
> **Estimasi: 4–5 hari (75–90 menit/hari)**

## Tujuan sesi ini

Akhir sesi ini kamu harus bisa:
- Liat proses yang jalan di sistem pake `ps` dengan berbagai flag
- Monitor resource usage pake `top` dan `htop`
- Paham signal Linux (`SIGTERM`, `SIGKILL`, `SIGINT`, `SIGHUP`)
- Matiin proses pake `kill` dan `killall` dengan elegan
- Jalanin proses di background pake `&`, `nohup`, `disown`
- Paham job control: `fg`, `bg`, `Ctrl+Z`, `jobs`

Process management = jantungnya kerja sysadmin. Kalau server kamu lemot atau service mati, ini senjata kamu buat diagnose.

---

## Estimasi waktu belajar

| Hari | Aktivitas | Durasi |
|------|-----------|--------|
| 1 | Konsep proses + `ps` basic dan advanced | 75 menit |
| 2 | `top` dan `htop` — realtime monitoring | 75 menit |
| 3 | Signal + `kill` + `killall` + `pkill` | 75 menit |
| 4 | Job control — `&`, `fg`, `bg`, `Ctrl+Z`, `nohup`, `disown` | 90 menit |
| 5 | Side project + review | 75 menit |

---

## Materi 1: Apa itu proses?

**Proses** = program yang sedang berjalan. Tiap proses punya:
- **PID** (Process ID) — angka unik, mulai dari 1 (init/systemd)
- **PPID** (Parent PID) — PID parent yang men-spawn proses ini
- **UID** — user yang jalanin proses
- **State** — running, sleeping, stopped, zombie, dll
- **Priority** (nice value)
- **Memory & CPU usage**

Cek proses kamu saat ini:

```bash
# Shell kamu sendiri adalah proses
echo $$
# Output: 12345 (PID shell kamu)

# Liat detail proses sendiri
ps -p $$
```

### Process tree — parent dan child

Setiap proses punya parent (kecuali PID 1, init). Cek tree:

```bash
pstree
# atau lebih detail:
pstree -p
```

Outputnya struktur kayak:

```
systemd(1)───systemd(1234)───bash(1250)───pstree(1300)
```

Artinya: `pstree` (PID 1300) dijalankan oleh `bash` (1250), yang di-spawn `systemd` user session (1234), yang di-spawn `systemd` utama (PID 1).

---

## Materi 2: `ps` — Process Snapshot

`ps` nge-snapshot proses yang lagi jalan. Punya banyak flag — terkenal membingungkan karena ada 3 style (UNIX, BSD, GNU).

### Yang paling sering dipakai

```bash
# Snapshot proses di shell sekarang saja
ps

# Semua proses di sistem, format full
ps aux          # BSD style (paling populer)
ps -ef          # UNIX style (alternatif)

# Plus tree view (lihat parent-child)
ps auxf
ps -ef --forest

# Cari proses tertentu (pakai grep)
ps aux | grep nginx
ps -ef | grep nginx

# Proses dengan PID tertentu
ps -p 1234
ps -p 1234,5678,9012

# Proses milik user tertentu
ps -u budi
ps -u budi -f
```

### Membaca output `ps aux`

```
USER  PID  %CPU %MEM    VSZ   RSS TTY STAT START TIME COMMAND
root  1234 0.0  0.5 123456 12345 ?   Ss   10:00 0:01 /usr/sbin/nginx
budi  1250 0.0  0.3  45678  5678 pts/0 Ss 10:05 0:00 -bash
budi  1300 0.0  0.2  34567  3456 pts/0 R+ 10:10 0:00 ps aux
```

Kolom penting:

| Kolom | Arti |
|-------|------|
| USER | Owner proses |
| PID | Process ID |
| %CPU | CPU usage |
| %MEM | Memory usage |
| VSZ | Virtual memory size (KB) |
| RSS | Resident set size — memory fisik yang dipakai (KB) |
| TTY | Terminal yang jalanin (`?` = background/no TTY) |
| STAT | State (S=sleeping, R=running, Z=zombie, dll) |
| START | Waktu mulai |
| TIME | Total CPU time yang dipakai |
| COMMAND | Command + args |

### STAT codes

| Code | Arti |
|------|------|
| `D` | Uninterruptible sleep (biasanya I/O) |
| `R` | Running atau runnable |
| `S` | Sleeping (nuggu event) |
| `T` | Stopped (job control atau trace) |
| `Z` | Zombie (sudah mati, tapi parent belum reap) |
| `<` | High priority |
| `N` | Low priority (nice) |
| `s` | Session leader |
| `+` | Di foreground process group |

### Custom output — `ps -o`

```bash
# Tentukan kolom sendiri
ps -o pid,ppid,user,cmd

# Semua proses, custom kolom
ps -eo pid,ppid,user,%cpu,%mem,cmd --sort=-%cpu | head -10
# Top 10 proses by CPU usage
```

### Sortir di `ps`

```bash
# Sort by CPU descending
ps aux --sort=-pcpu | head -10

# Sort by memory descending
ps aux --sort=-pmem | head -10
```

---

## Materi 3: `top` — Realtime monitor

`top` = task manager di terminal. Update tiap beberapa detik.

```bash
top
```

Tampilan dibagi 2:
- **Atas:** ringkasan sistem (load average, task count, CPU usage, memory, swap)
- **Bawah:** list proses, default sort by CPU

### Navigasi di `top`

| Tombol | Aksi |
|--------|------|
| `q` | Keluar |
| `h` | Help |
| `Space` | Refresh sekarang |
| `1` | Tampilkan per-CPU breakdown |
| `M` | Sort by memory |
| `P` | Sort by CPU (default) |
| `N` | Sort by PID |
| `T` | Sort by time |
| `k` | Kill proses (bakal minta PID) |
| `r` | Renice (ubah priority) |
| `u` | Filter by user |
| `c` | Toggle command line / name saja |
| `f` | Pilih kolom yang ditampilkan |
| `W` | Save config ke `~/.toprc` |

### Membaca header `top`

```
top - 10:30:00 up 7 days,  2:30,  3 users,  load average: 0.50, 0.45, 0.40
Tasks: 150 total, 1 running, 149 sleeping, 0 stopped, 0 zombie
%Cpu(s):  5.0 us,  2.0 sy,  0.0 ni, 92.5 id,  0.5 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :   3927.5 total,   1234.5 free,   1500.0 used,   1193.0 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   2000.0 avail Mem
```

**Load average** = rata-rata proses yang ingin jalan. 3 angka = 1 menit, 5 menit, 15 menit. Rule of thumb: kalo load average > jumlah CPU core, sistem overload.

**CPU breakdown:**
- `us` = user processes
- `sy` = system (kernel)
- `id` = idle (makin tinggi makin santai)
- `wa` = wait I/O (tinggi = disk lambat)
- `st` = steal time (di VPS = host lain curi CPU kamu)

---

## Materi 4: `htop` — top yang lebih keren

`htop` = `top` dengan UI jauh lebih bagus. Install dulu:

```bash
sudo apt install htop      # Ubuntu/Debian
brew install htop          # Mac
```

Jalanin:

```bash
htop
```

Kelebihan vs `top`:
- Color-coded (hijau CPU normal, merah overheat)
- Bisa scroll horizontal & vertikal
- Tree view dengan F5
- Kill dengan F9 (pilih signal)
- Renice dengan F7/F8
- Mouse support

### Shortcut penting `htop`

| Tombol | Aksi |
|--------|------|
| `F5` | Tree view (toggle) |
| `F6` | Sort by column |
| `F9` | Kill (pilih signal) |
| `F7`/`F8` | Renice down/up |
| `F4` | Filter by string |
| `F3` | Search |
| `F2` | Setup (customize) |
| `/` | Search proses |
| `t` | Tree view |
| `H` | Toggle user threads |
| `K` | Toggle kernel threads |
| `q` | Keluar |

> **Tip:** bikin `htop` jadi default. Tambah alias di `~/.bashrc`:
> ```bash
> alias top=htop
> ```

---

## Materi 5: Alternatif modern — `btop`, `glances`

Untuk eksplorasi lebih lanjut:

```bash
# btop — paling canggih, UI beautiful
sudo apt install btop
btop

# glances — juga nampilin network, disk I/O, dll
sudo apt install glances
glances
```

---

## Materi 6: Signal Linux

Signal = "pesan" ke proses. Beberapa signal umum:

| Signal | Number | Arti | Default behavior |
|--------|--------|------|------------------|
| `SIGTERM` | 15 | "Tolong berhenti" (polite) | Proses clean up lalu exit |
| `SIGKILL` | 9 | "MATI SEKARANG!" (paksa) | Proses langsung dibunuh kernel |
| `SIGINT` | 2 | Interrupt (Ctrl+C) | Proses exit |
| `SIGHUP` | 1 | Hangup (terminal tutup) | Biasanya exit, atau reload config untuk daemon |
| `SIGSTOP` | 19 | Pause (gak bisa ditangkap) | Proses di-pause |
| `SIGCONT` | 18 | Resume dari pause | Proses lanjut jalan |
| `SIGUSR1` | 10 | User-defined 1 | Tergantung aplikasi |
| `SIGUSR2` | 12 | User-defined 2 | Tergantung aplikasi |

Lihat semua signal:

```bash
kill -l
# atau
man 7 signal
```

### Aturan main signal

- **Pakai `SIGTERM` dulu.** Kasih aplikasi waktu clean up (save state, close connection, dll).
- **Baru `SIGKILL` kalau bandel.** `SIGKILL` langsung bunuh, gak ada clean up — bisa ninggalin data corrupt atau file lock.
- **`SIGINT` (Ctrl+C)** = signal yang dikirim ke foreground process saat kamu tekan Ctrl+C di terminal.
- **`SIGHUP`** sering dipakai untuk reload config (misal `systemctl reload nginx` kirim SIGHUP).

---

## Materi 7: `kill` — Matiin proses by PID

```bash
# SIGTERM (default)
kill 1234
kill -15 1234
kill -TERM 1234

# SIGKILL (paksa)
kill -9 1234
kill -KILL 1234

# SIGINT (kayak Ctrl+C)
kill -2 1234
kill -INT 1234

# SIGHUP (biasanya reload)
kill -1 1234
kill -HUP 1234

# Kill banyak PID sekaligus
kill 1234 5678 9012

# Kill semua proses yang kamu bisa kill
kill -9 -1    # HATI-HATI — bisa logout diri sendiri
```

### `killall` — by name (bukan PID)

```bash
# Matiin semua proses nginx
killall nginx

# Paksa
killall -9 nginx

# Matiin semua proses milik user tertentu
killall -u budi

# Interaktif (tanya konfirmasi)
killall -i nginx
```

> **Warning:** `killall` di Solaris/AIX matiin SEMUA proses yang user bisa kill. Berbahaya! Di Linux aman.

### `pkill` — lebih fleksibel dari `killall`

```bash
# Matiin by pattern
pkill nginx
pkill -f "python script.py"     # match full command line

# Matiin by user
pkill -u budi

# Matiin by terminal
pkill -t pts/0

# Test dulu (ngeliat yang bakal kena tanpa kill)
pkill -e -f nginx        # -e = echo yang di-kill
```

`pkill` lebih aman karena:
- Pattern matching lebih fleksibel
- Bisa pakai `-f` untuk match full command (lebih spesifik)
- Bisa dry-run pakai `-e` (echo, no kill)

---

## Materi 8: Job control — `&`, `fg`, `bg`, `Ctrl+Z`

### Latar belakang

Shell kamu bisa jalanin banyak proses. Yang lagi aktif (naruh keyboard input) = **foreground**. Yang jalan tapi gak naruh input = **background**.

### Jalanin di background dengan `&`

```bash
# Jalanin proses di background
sleep 60 &
# Output: [1] 12345
# [1] = job number, 12345 = PID

# Lanjut pakai shell, proses jalan di belakang
ls
```

### Pause foreground dengan `Ctrl+Z`

Saat proses jalan di foreground, tekan `Ctrl+Z`:

```
^Z
[1]+  Stopped                 sleep 60
```

Proses di-pause (SIGSTOP), balik ke shell prompt.

### Liat daftar job dengan `jobs`

```bash
jobs
# [1]+  Stopped                 sleep 60
# [2]-  Running                 sleep 100 &
```

- `[1]`, `[2]` = job number
- `+` = job terakhir yang di-pause/foreground
- `-` = job sebelumnya

### Resume dengan `fg` dan `bg`

```bash
# Bawa job ke foreground
fg %1          # job number 1
fg             # default = job dengan + (current)

# Resume di background
bg %1          # job 1 jalan di background
bg             # default = job dengan +
```

### Matiin job dengan job spec

```bash
kill %1        # matiin job 1
kill %2        # matiin job 2
```

---

## Materi 9: `nohup` dan `disown` — bertahan setelah logout

Masalah: kalau kamu jalanin proses di background pakai `&` lalu logout, prosesnya **mati** karena parent shell-nya mati dan kirim `SIGHUP`.

Solusi 1: `nohup` — ignore SIGHUP

```bash
nohup long-running-script.sh &
# Output: nohup: ignoring input and appending output to 'nohup.out'
# Output kamu bakal masuk ke nohup.out (karena stdout di-redirect)
```

`nohup` decouple proses dari shell — gak kena SIGHUP saat logout.

Solusi 2: `disown` — remove dari job table

```bash
long-running-script.sh &
disown %1
# Atau sekali jalan:
long-running-script.sh & disown
```

Bedanya:
- `nohup` = ignore SIGHUP sejak awal
- `disown` = remove job dari shell job table (jadi shell gak kirim SIGHUP saat exit)

Untuk skrip serius: pakai `systemd` service (akan dibahas semester berikutnya). `nohup` cuma buat quick hack.

---

## Materi 10: `nice` dan `renice` — Priority

Setiap proses punya **nice value** (-20 sampai 19). Default 0. Makin tinggi = makin "nice" ke proses lain = makin rendah priority-nya.

```bash
# Jalanin dengan nice value 10 (low priority)
nice -n 10 ./backup.sh

# Jalanin dengan nice value -10 (high priority, butuh sudo)
sudo nice -n -10 ./critical.sh

# Ubah nice proses yang udah jalan
renice 5 -p 1234           # PID 1234 jadi nice 5
renice -5 -p 1234          # jadi nice -5 (butuh sudo kalau negatif)

# Renice semua proses user
renice 10 -u budi
```

Hanya root yang bisa set nice negatif (priority tinggi). User biasa cuma bisa naikin nice (turunin priority).

---

## Common pitfalls

### 1. `kill -9` sebagai default

```bash
kill -9 1234   # langsung SIGKILL
```

Buruk karena:
- Proses gak sempat clean up
- Bisa ninggalin temporary file
- Bisa corrupt database yang lagi write
- Bisa ninggalin child proses jadi orphan

**Selalu mulai dengan `kill 1234` (SIGTERM), tunggu 5-10 detik. Kalau gak mati juga, baru `kill -9`.**

### 2. Salah PID — kill proses penting

```bash
# Mau kill nginx, tapi typo PID
kill -9 1     # PID 1 = init/systemd = BENCANA
```

Selalu `ps aux | grep nginx` dulu, verifikasi PID-nya, baru kill. Jangan asal tebak.

### 3. Lupa `&` lalu shell ke-block

```bash
sleep 60
# Shell ke-block 60 detik. Tekan Ctrl+Z lalu `bg`
```

Fix:

```bash
^Z
bg
```

Atau lebih baik, jangan lupa `&` sejak awal.

### 4. Output proses background nyampah ke terminal

```bash
./script.sh &
# Output terus keluar di terminal, ganggu
```

Redirect stdout/stderr:

```bash
./script.sh > output.log 2>&1 &
# Atau pakai nohup:
nohup ./script.sh &
```

### 5. `killall` di Mac beda dengan Linux

`killall` di macOS (BSD) punya behavior sedikit beda. Misal, di macOS `killall` tanpa argumen bisa nanya konfirmasi. Cek `man killall` di masing-masing OS.

### 6. `top` menampilkan zombie process

```
Tasks: 150 total, 1 running, 148 sleeping, 0 stopped, 1 zombie
```

Zombie = proses yang udah mati tapi parent belum reap. Cara fix:
- Cari parent: `ps -o ppid= -p <zombie_pid>`
- Restart parent (atau kirim SIGCHLD ke parent)

### 7. Tidak sadar Ctrl+C = SIGINT

```bash
# Ini sama:
Ctrl+C
kill -2 <pid>
kill -INT <pid>
```

Kalau aplikasi tangkap SIGINT dan gak exit (misal editor), Ctrl+C gak bakal keluar.

### 8. Background proses mati saat logout

Sudah dijelaskan — pakai `nohup` atau `disown`.

### 9. `ps aux | grep something` munculin grep sendiri

```bash
ps aux | grep nginx
# user  1234 ... grep --color=auto nginx     <- ini grep sendiri
```

Trik exclude:

```bash
ps aux | grep "[n]ginx"     # regex trick
ps aux | grep nginx | grep -v grep
```

---

## Side project: "Process babysitter"

### Brief

Kamu bakal simulasi scenario manage proses. Setup dulu:

```bash
mkdir -p ~/belajar-linux/minggu-4/latihan
cd ~/belajar-linux/minggu-4/latihan

# Bikin beberapa script dummy yang "kerja" lama
cat > worker1.sh << 'EOF'
#!/bin/bash
echo "[$(date)] Worker 1 started" >> worker1.log
for i in {1..100}; do
  echo "[$(date)] Worker 1: iteration $i" >> worker1.log
  sleep 2
done
echo "[$(date)] Worker 1 done" >> worker1.log
EOF
chmod +x worker1.sh

cat > worker2.sh << 'EOF'
#!/bin/bash
echo "[$(date)] Worker 2 started" >> worker2.log
for i in {1..60}; do
  echo "[$(date)] Worker 2: iteration $i" >> worker2.log
  # Simulasi CPU usage
  x=0
  for j in {1..10000}; do
    x=$((x+j))
  done
  sleep 1
done
echo "[$(date)] Worker 2 done" >> worker2.log
EOF
chmod +x worker2.sh

cat > worker3.sh << 'EOF'
#!/bin/bash
echo "[$(date)] Worker 3 started" >> worker3.log
while true; do
  echo "[$(date)] Worker 3: heartbeat" >> worker3.log
  sleep 5
done
EOF
chmod +x worker3.sh
```

Lakukan misi berikut **semua lewat terminal**:

1. Jalanin `worker1.sh` di foreground, lalu pause dengan Ctrl+Z. Cek dengan `jobs`.
2. Resume `worker1.sh` di background dengan `bg`. Verifikasi dengan `ps`.
3. Jalanin `worker2.sh` langsung di background dengan `&`.
4. Jalanin `worker3.sh` di background dengan output di-redirect ke `/dev/null` (jangan ganggu terminal).
5. Buka `htop`, lakukan:
   - Identifikasi ketiga worker berdasarkan command line
   - Sortir by CPU, lihat siapa yang paling banyak makan CPU
   - Sortir by memory, lihat ranking
6. Di `htop`, kill `worker2.sh` pakai F9 dengan SIGTERM. Cek `worker2.log` — apakah ada pesan "done"? (Seharusnya tidak, karena di-kill di tengah).
7. Matiin `worker1.sh` pakai `kill` dari terminal (cari PID-nya dulu dengan `ps`).
8. Matiin `worker3.sh` pakai `pkill` (by name).
9. Jalanin lagi `worker3.sh` pakai `nohup` lalu tutup terminal (atau simulasi: kirim SIGHUP ke shell sendiri `kill -HUP $$`). Cek apakah `worker3.sh` masih jalan setelah itu.
10. Matiin semua worker yang masih jalan (cleanup).
11. BONUS: bikin script yang jalanin ketiga worker bersamaan di background, tunggu semua selesai, lalu report status exit masing-masing.

<details>
<summary>Solusi (klik expand — tapi coba dulu)</summary>

```bash
cd ~/belajar-linux/minggu-4/latihan

# 1. Jalanin worker1 di foreground, pause
./worker1.sh
# Tunggu beberapa detik, lalu:
# Ctrl+Z
# Output: [1]+  Stopped   ./worker1.sh
jobs
# [1]+  Stopped   ./worker1.sh

# 2. Resume di background
bg %1
# [1]+ ./worker1.sh &
ps aux | grep worker1
# Verifikasi: ada proses worker1.sh berjalan

# 3. worker2 langsung di background
./worker2.sh &
# [2]+ ./worker2.sh &

# 4. worker3 background, output di-redirect
./worker3.sh > /dev/null 2>&1 &
# Atau lebih clean:
nohup ./worker3.sh > /dev/null 2>&1 &

# 5. Buka htop, cari worker
htop
# Tekan F4 untuk filter "worker"
# Atau tekan F6 untuk sort by CPU/memory

# 6. Kill worker2 dengan SIGTERM dari htop
# Di htop: arahkan ke baris worker2.sh, tekan F9, pilih 15 SIGTERM
# Atau dari terminal:
ps aux | grep worker2
kill <PID-worker2>
# Cek log — seharusnya TIDAK ada "done" karena di-kill
tail -5 worker2.log

# 7. Kill worker1 dengan kill (cari PID dulu)
ps aux | grep worker1.sh
kill <PID-worker1>
# Verifikasi
ps aux | grep worker1

# 8. Kill worker3 dengan pkill
pkill -f worker3.sh
# Verifikasi
ps aux | grep worker3

# 9. nohup test
nohup ./worker3.sh > /dev/null 2>&1 &
# Cek PID
ps aux | grep worker3
# Simulasi terminal close dengan kirim SIGHUP ke proses langsung:
kill -HUP <PID-worker3>
# Cek apakah masih jalan:
ps -p <PID-worker3>
# Kalau masih ada, berarti nohup work

# Cleanup
pkill -f worker3.sh
pkill -f worker1.sh
pkill -f worker2.sh

# 10. Cleanup semua
ps aux | grep worker    # harus kosong (kecuali grep sendiri)

# 11. BONUS: parallel runner
cat > run-all.sh << 'EOF'
#!/bin/bash
echo "Starting all workers at $(date)"

./worker1.sh &
PID1=$!
./worker2.sh &
PID2=$!
./worker3.sh &
PID3=$!

echo "Worker 1 PID: $PID1"
echo "Worker 2 PID: $PID2"
echo "Worker 3 PID: $PID3"

# Wait for worker 1 and 2 (worker 3 infinite)
wait $PID1
STATUS1=$?
wait $PID2
STATUS2=$?

echo "Worker 1 exited with: $STATUS1"
echo "Worker 2 exited with: $STATUS2"

# Kill worker 3 manually
kill $PID3 2>/dev/null
echo "Worker 3 manually stopped"

echo "All done at $(date)"
EOF
chmod +x run-all.sh
./run-all.sh
```

</details>

---

## Tantangan ekstra (opsional)

- Eksplorasi `pgrep` — gabungan `ps` + `grep` khusus cari PID. Coba `pgrep -af nginx`.
- Pelajari `systemctl` untuk manage service — ini yang dipakai di server production. Bedakan dengan `kill` manual.
- Install dan coba `atop` — monitor yang nyimpan history. Bagus buat forensic analysis pasca-insiden.
- Cek `/proc/<pid>/` untuk satu proses. Lihat `status`, `cmdline`, `environ`, `fd` (file descriptors). Ini low-level way to inspect proses.

---

## Tanda kelar

- [ ] Saya bisa pakai `ps aux` dan baca semua kolom penting (PID, %CPU, %MEM, STAT, COMMAND)
- [ ] Saya bisa cari proses tertentu pakai `ps aux | grep` atau `pgrep`
- [ ] Saya bisa pakai `top` / `htop` untuk monitor realtime, sort by CPU/memory
- [ ] Saya tahu bedanya `SIGTERM` (15) dan `SIGKILL` (9), dan kapan pakai masing-masing
- [ ] Saya bisa matiin proses dengan `kill`, `killall`, dan `pkill`
- [ ] Saya bisa jalanin proses di background dengan `&`
- [ ] Saya bisa pause dengan Ctrl+Z, resume dengan `fg`/`bg`, cek dengan `jobs`
- [ ] Saya tahu kenapa `nohup` atau `disown` diperlukan biar proses tetap jalan setelah logout
- [ ] Saya bisa ubah priority proses dengan `nice` dan `renice`
- [ ] Saya pernah selesaikan side project lengkap

Kalau ada yang belum centang, ulang dulu. Sesi 08 asumsi kamu udah lancar ini.

---

**Next:** `08-piping-dan-redirection.md` — combine commands dengan `|`, redirect output dengan `>`, `>>`, `2>&1`. Ini yang bikin CLI Linux powerful — kamu bisa gabung command kecil jadi pipeline kompleks.
