# Sesi 11 — Shell Scripting Dasar

> **Minggu 6, Sesi 11 dari 12**
> **Estimasi: 1 minggu (90–120 menit/hari)**

## Tujuan sesi ini

Akhir sesi ini kamu harus bisa:
- Bikin `.sh` script dengan shebang yang benar
- Pakai variable, parameter (`$1`, `$@`, `$?`), dan quote dengan benar
- Tulis conditional: `if`/`elif`/`else`, `case`
- Tulis loop: `for`, `while`, `until`
- Bikin dan pakai function dengan argumen
- Handle error dengan `set -e`, `set -u`, `set -o pipefail`, dan exit code
- Debug script dengan `set -x` dan `bash -x`
- Kasih permission eksekusi dan jalanin script dari PATH

Ini sesi terpanjang karena gabungin semua yang udah dipelajari. Setelah ini, kamu bisa automate task berulang — yang adalah inti kerja sysadmin/devops.

---

## Estimasi waktu belajar

| Hari | Aktivitas | Durasi |
|------|-----------|--------|
| 1 | Shebang, variable, parameter, quoting | 90 menit |
| 2 | Conditional: `if`, `case`, test `[ ]` dan `[[ ]]` | 90 menit |
| 3 | Loop: `for`, `while`, `until`, break/continue | 90 menit |
| 4 | Function, exit code, error handling | 120 menit |
| 5 | Debug (`set -x`, `set -e`, dll) + best practice | 90 menit |
| 6 | Side project + review | 120 menit |
| 7 | Buffer / eksplorasi tambahan | 60 menit |

---

## Materi 1: Shebang dan struktur dasar

Setiap script bash harus mulai dengan **shebang** — baris pertama yang nunjukin interpreter.

```bash
#!/bin/bash
# Script ini pakai bash yang ada di /bin/bash
```

Atau versi lebih portable:

```bash
#!/usr/bin/env bash
# Cari bash di PATH — lebih fleksibel (misal di Mac via Homebrew)
```

> **Penting:** `sh` ≠ `bash`. `sh` di Ubuntu adalah symlink ke `dash` (lebih minimalis). Beberapa fituran bash gak jalan di dash. Always use `#!/usr/bin/env bash` kecuali yakin portabel.

### Template script standar

```bash
#!/usr/bin/env bash
# Judul script
# Deskripsi singkat
# Usage: ./script.sh [args]

set -euo pipefail   # safety mode (akan dibahas)

# === Konstanta ===
readonly SCRIPT_NAME="$(basename "$0")"

# === Function ===
main() {
    echo "Hello from $SCRIPT_NAME"
}

# === Main ===
main "$@"
```

---

## Materi 2: Variable dan assignment

### Assignment

```bash
NAME="Budi"           # tanpa spasi di sekitar =
AGE=25
PI=3.14

# Tidak boleh ada spasi!
NAME = "Budi"         # SALAH — shell ngartiin NAME sebagai command
```

### Pakai variable

```bash
echo "Halo $NAME"     # Halo Budi
echo "Halo ${NAME}"   # Halo Budi (lebih eksplisit, bagus kalau ada karakter setelahnya)
echo 'Halo $NAME'     # Halo $NAME (single quote = literal)
echo "Halo ${NAME}s"  # Halo Budis (brace penting di sini)
```

### Read-only variable

```bash
readonly VERSION="1.0"
VERSION="2.0"    # error: VERSION: readonly variable
```

### Variable dari input user

```bash
echo "Siapa nama kamu?"
read NAME
echo "Halo $NAME"

# Dengan prompt di-read
read -p "Umur kamu: " AGE

# Dengan timeout (timeout kalau gak diisi dalam 5 detik)
read -t 5 -p "Password (5 detik): " PASSWORD

# Hidden input (password)
read -s -p "Password: " PASSWORD
echo
```

### Default value

```bash
# Kalau VAR belum di-set atau kosong, pakai "default"
echo "${NAME:-default}"
# Set VAR juga kalau belum di-set
echo "${NAME:=default}"
# Error kalau belum di-set
echo "${NAME:?NAME harus diset}"

# Alternative value (kalau VAR di-set, pakai "alt")
echo "${NAME:+alt}"
```

---

## Materi 3: Parameter dan argumen

Saat kamu jalanin `./script.sh foo bar baz`, argumen dikirim ke script:

| Variable | Isi |
|----------|-----|
| `$0` | Nama script (path lengkap atau basename) |
| `$1`, `$2`, ... | Argumen posisi |
| `${10}` | Argumen ke-10 (butuh brace kalau >9) |
| `$#` | Jumlah argumen |
| `$@` | Semua argumen sebagai list (preserve spasi) |
| `$*` | Semua argumen sebagai satu string |
| `$?` | Exit code command terakhir |
| `$$` | PID shell saat ini |
| `$!` | PID background process terakhir |

Contoh:

```bash
#!/usr/bin/env bash
echo "Script name: $0"
echo "First arg: $1"
echo "Second arg: $2"
echo "Total args: $#"
echo "All args: $@"

for arg in "$@"; do
    echo "Arg: $arg"
done
```

Jalanin:

```bash
./script.sh foo "bar baz" qux
# Script name: ./script.sh
# First arg: foo
# Second arg: bar baz
# Total args: 3
# All args: foo bar baz qux
# Arg: foo
# Arg: bar baz
# Arg: qux
```

### Shift — geser argumen

```bash
while [ $# -gt 0 ]; do
    case "$1" in
        -h|--help)
            echo "Help"
            shift
            ;;
        -f|--file)
            FILE="$2"
            shift 2
            ;;
        *)
            echo "Unknown: $1"
            shift
            ;;
    esac
done
```

`shift` = buang `$1`, geser yang lain ke depan. `shift 2` = buang 2 argumen sekaligus.

---

## Materi 4: Quoting — kunci menghindari bug

**Aturan emas:** always quote variable. Hindari 90% bug shell script.

```bash
FILE="my file.txt"
ls $FILE          # ls: cannot access 'my': No such file
ls "$FILE"        # OK — file dengan spasi di-handle
```

### Tiga jenis quote

```bash
NAME="Budi"
echo "Halo $NAME"     # double quote = expand variable
echo 'Halo $NAME'     # single quote = literal, tidak expand
echo "Halo \$NAME"    # backslash = escape, jadi literal $
```

### Kapan pakai apa

- **Double quote `"`** — default untuk variable. Expand variable, gak pecah kata.
- **Single quote `'`** — literal string murni (regex pattern, password).
- **No quote** — HANYA kalau kamu SENGAJA mau word splitting (jarang).

### Quoting di `"$@"` — critical

```bash
# Bikin script yang terima argumen dengan spasi
for arg in "$@"; do
    echo "Got: $arg"
done

# Jalanin: ./script.sh "hello world" foo
# Output:
# Got: hello world
# Got: foo

# Tanpa quote:
for arg in $@; do
    echo "Got: $arg"
done
# Output:
# Got: hello
# Got: world
# Got: foo
# BUG — "hello world" dipecah jadi 2
```

Selalu pakai `"$@"` (dengan double quote). Hampir gak pernah ada alasan pakai `$@` tanpa quote.

---

## Materi 5: Conditional — `if`

### Sintaks dasar

```bash
if [ condition ]; then
    echo "true"
elif [ other_condition ]; then
    echo "alt"
else
    echo "false"
fi
```

### `[ ]` vs `[[ ]]`

`[ ]` = command `test` (POSIX, portabel). `[[ ]]` = bash builtin (lebih powerful, less surprising).

**Selalu pakai `[[ ]]` di bash script.** Kecuali script harus portabel ke `sh`.

```bash
# POSIX
if [ "$NAME" = "Budi" ]; then ...
if [ -f /etc/hosts ]; then ...
if [ "$A" -eq 5 ]; then ...

# Bash (better)
if [[ "$NAME" == "Budi" ]]; then ...
if [[ -f /etc/hosts ]]; then ...
if [[ "$A" -eq 5 ]]; then ...

# Bash yang gak bisa di [ ]:
if [[ "$NAME" == B* ]]; then ...        # pattern matching
if [[ "$NAME" =~ ^[A-Z][a-z]+$ ]]; then ...  # regex
if [[ -f file && "$X" == "yes" ]]; then ...  # && tanpa escape
```

### Test yang umum

```bash
# File tests
[[ -f file ]]      # file biasa ada?
[[ -d dir ]]       # directory ada?
[[ -e path ]]      # ada (file apapun)?
[[ -r file ]]      # readable?
[[ -w file ]]      # writable?
[[ -x file ]]      # executable?
[[ -s file ]]      # size > 0?
[[ -L link ]]      # symlink?

# String tests
[[ -z "$str" ]]    # string kosong?
[[ -n "$str" ]]    # string tidak kosong?
[[ "$a" == "$b" ]] # sama?
[[ "$a" != "$b" ]] # beda?
[[ "$a" < "$b" ]]  # lexically before?

# Integer tests
[[ "$a" -eq "$b" ]]  # equal
[[ "$a" -ne "$b" ]]  # not equal
[[ "$a" -lt "$b" ]]  # less than
[[ "$a" -gt "$b" ]]  # greater than
[[ "$a" -le "$b" ]]  # less or equal
[[ "$a" -ge "$b" ]]  # greater or equal

# Logical
[[ A && B ]]       # both
[[ A || B ]]       # either
[[ ! A ]]          # not
```

### Contoh nyata

```bash
#!/usr/bin/env bash

FILE="/etc/hosts"

if [[ ! -f "$FILE" ]]; then
    echo "Error: $FILE tidak ada"
    exit 1
fi

if [[ -r "$FILE" ]]; then
    echo "Bisa dibaca, isinya:"
    cat "$FILE"
else
    echo "Tidak bisa dibaca. Coba sudo."
    exit 2
fi
```

---

## Materi 6: Conditional — `case`

Untuk multiple branch, lebih clean dari `if/elif` panjang.

```bash
#!/usr/bin/env bash

case "$1" in
    start)
        echo "Starting service..."
        ;;
    stop)
        echo "Stopping service..."
        ;;
    restart)
        echo "Restarting..."
        ;;
    status)
        echo "Status: running"
        ;;
    -h|--help|help)
        echo "Usage: $0 {start|stop|restart|status}"
        ;;
    "")
        echo "Error: no argument"
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
    *)
        echo "Unknown command: $1"
        exit 1
        ;;
esac
```

### Pattern matching di case

```bash
case "$input" in
    y|Y|yes|YES) echo "yes" ;;
    n|N|no|NO)   echo "no" ;;
    [0-9]*)      echo "starts with digit" ;;
    *.txt)       echo "text file" ;;
    *)           echo "other" ;;
esac
```

---

## Materi 7: Loop — `for`

### Iterasi list

```bash
# List eksplisit
for color in red green blue; do
    echo "Color: $color"
done

# Iterasi file
for file in *.txt; do
    echo "Processing $file"
done

# Iterasi argumen
for arg in "$@"; do
    echo "Arg: $arg"
done

# Range
for i in {1..5}; do
    echo "Number: $i"
done

for i in {1..10..2}; do    # step 2
    echo "Odd: $i"
done

# C-style
for ((i=0; i<5; i++)); do
    echo "Index: $i"
done
```

### Iterasi output command

```bash
# PER BARIS (aman untuk spasi)
find . -name "*.txt" -print0 | while IFS= read -r -d '' file; do
    echo "Found: $file"
done

# Atau yang lebih simple kalau yakin gak ada newline di filename
find . -name "*.txt" | while IFS= read -r file; do
    echo "Found: $file"
done
```

`IFS=` = preserve leading/trailing whitespace. `read -r` = jangan interpret backslash. Selalu pakai ini untuk read line.

---

## Materi 8: Loop — `while` dan `until`

### `while` — selama kondisi true

```bash
# Counter
count=0
while [[ $count -lt 5 ]]; do
    echo "Count: $count"
    count=$((count + 1))
done

# Read line by line
while IFS= read -r line; do
    echo "Line: $line"
done < file.txt

# Read sampai input tertentu
while true; do
    read -p "Enter command (quit to exit): " cmd
    [[ "$cmd" == "quit" ]] && break
    echo "You entered: $cmd"
done

# Polling sampai service up
while ! curl -s http://localhost:8080/health > /dev/null; do
    echo "Waiting for service..."
    sleep 1
done
echo "Service is up!"
```

### `until` — sampai kondisi true (kebalikan while)

```bash
until [[ -f /tmp/ready ]]; do
    echo "Waiting for /tmp/ready..."
    sleep 1
done
echo "Ready!"
```

### `break` dan `continue`

```bash
for i in {1..10}; do
    [[ $i -eq 5 ]] && break        # exit loop
    [[ $((i % 2)) -eq 0 ]] && continue  # skip even
    echo "Odd: $i"
done
# Output: 1, 3 (skip 2, 4, 6, 8, 10 — wait, break di 5)
# Actually: 1, 3 (5 break before continue check)
```

---

## Materi 9: Function

### Definisi dan pemanggilan

```bash
# Cara 1 (pakai keyword function)
function greet() {
    echo "Hello, $1!"
}

# Cara 2 (tanpa keyword — POSIX)
greet() {
    echo "Hello, $1!"
}

# Panggil
greet Budi         # Hello, Budi!
greet "John Doe"   # Hello, John Doe!
```

### Argumen function

Function punya `$1`, `$2`, `$@`, `$#` SENDIRI (terpisah dari script).

```bash
add() {
    local a="$1"
    local b="$2"
    echo $((a + b))
}

result=$(add 3 5)
echo "Result: $result"   # Result: 8
```

### Return value

Bash function **gak bisa return string** langsung. Hanya return exit code (0-255).

```bash
is_even() {
    local n="$1"
    if [[ $((n % 2)) -eq 0 ]]; then
        return 0   # true (success)
    else
        return 1   # false (failure)
    fi
}

# Pakai
if is_even 4; then
    echo "4 is even"
fi
```

Untuk "return" string, pakai echo + command substitution:

```bash
get_greeting() {
    local name="$1"
    echo "Hello, $name!"
}

msg=$(get_greeting "Budi")
echo "$msg"   # Hello, Budi!
```

### Variable scoping

```bash
my_func() {
    local local_var="local"     # LOCAL — gak bocor
    global_var="global"         # GLOBAL — bocor ke luar
}

my_func
echo "$global_var"   # global
echo "$local_var"    # kosong (gak terdefinisi di sini)
```

**Selalu pakai `local` di dalam function** kecuali sengaja mau bikin global.

---

## Materi 10: Exit code dan error handling

Setiap command mengembalikan exit code:
- `0` = sukses
- `1-255` = error (arti spesifik tergantung command)

Cek exit code:

```bash
ls /etc > /dev/null
echo $?        # 0

ls /nonexistent > /dev/null 2>&1
echo $?        # 2 (biasanya)
```

### `set -e` — exit saat error

```bash
#!/usr/bin/env bash
set -e    # exit immediately on error

echo "Before"
ls /nonexistent    # error, script exit di sini
echo "After"        # gak dijalankan
```

### `set -u` — error saat pakai variable undefined

```bash
#!/usr/bin/env bash
set -u

echo "Hello $UNDEFINED"    # error: UNDEFINED: unbound variable
```

### `set -o pipefail` — error di pipe

```bash
#!/usr/bin/env bash
set -o pipefail

# Tanpa pipefail, exit code = exit code command TERAKHIR
false | true
echo $?    # 0 (true) — false diabaikan

# Dengan pipefail, exit code = non-zero pertama yang ditemukan
set -o pipefail
false | true
echo $?    # 1 (false)
```

### `set -euo pipefail` — kombinasi (recommended)

```bash
#!/usr/bin/env bash
set -euo pipefail
# e = exit on error
# u = error on undefined variable
# o pipefail = pipe fail on any error
```

Ini safety mode yang recommended untuk hampir semua script.

### Trap — cleanup saat exit

```bash
#!/usr/bin/env bash
set -euo pipefail

TMPFILE=$(mktemp)
trap 'rm -f "$TMPFILE"' EXIT   # hapus TMPFILE saat script exit (apapun alasannya)

echo "Working with $TMPFILE"
# ... script mati di tengah? TMPFILE tetap kehapus
```

Trap sangat berguna untuk cleanup resource.

### Custom error handling

```bash
#!/usr/bin/env bash
set -euo pipefail

error() {
    echo "ERROR: $*" >&2
    exit 1
}

# Pakai
[[ -f /etc/hosts ]] || error "hosts file not found"
```

---

## Materi 11: Debug

### `set -x` — trace eksekusi

```bash
#!/usr/bin/env bash
set -x    # print setiap command sebelum dijalankan

NAME="Budi"
echo "Hello $NAME"
```

Output:

```
+ NAME=Budi
+ echo 'Hello Budi'
Hello Budi
```

`+` menandakan command yang di-trace.

### Debug tanpa edit file

```bash
bash -x script.sh    # jalanin dengan trace
bash -v script.sh    # verbose (print lines sebelum expand)
bash -n script.sh    # syntax check only (gak jalanin)
```

### Debug sebagian script

```bash
#!/usr/bin/env bash

echo "Start"

set -x    # enable trace
NAME="Budi"
echo "Hello $NAME"
set +x    # disable trace

echo "End"
```

---

## Materi 12: Arithmetic

Bash punya arithmetic builtin:

```bash
# $((...))
a=5
b=3
echo $((a + b))    # 8
echo $((a - b))    # 2
echo $((a * b))    # 15
echo $((a / b))    # 1 (integer division)
echo $((a % b))    # 2 (modulo)
echo $((a ** b))   # 125 (pangkat)

# Assignment
count=0
count=$((count + 1))   # increment
((count++))            # shortcut
((count--))            # decrement

# Comparison
if ((a > b)); then echo "a greater"; fi
```

> **Penting:** bash hanya support integer. Untuk float, pakai `bc` atau `awk`:
> ```bash
> echo "scale=2; 5/3" | bc    # 1.66
> ```

---

## Materi 13: Permission eksekusi & PATH

### Bikin script executable

```bash
chmod +x script.sh
./script.sh     # sekarang bisa dijalankan langsung
```

### Jalanin tanpa `./`

Pindah ke directory di PATH:

```bash
mv script.sh ~/bin/script     # hilangkan .sh (opsional, lebih clean)
chmod +x ~/bin/script
script                        # jalan dari mana saja
```

### Shebang penting!

```bash
# Tanpa shebang, jalanin via ./script.sh error atau jalan di shell saat ini
./script.sh
# -rwxr-xr-x 1 user user ... script.sh
# Bash: coba exec, gak tahu interpreter, fallback ke sh (mungkin dash)

# Dengan shebang:
#!/usr/bin/env bash
./script.sh    # bash yang jalan
```

---

## Common pitfalls

### 1. Spasi di sekitar `=`

```bash
NAME = "Budi"     # SALAH
NAME="Budi"       # BENAR
```

### 2. Lupa quote variable

```bash
for file in $(ls); do ... done     # BAHAYA — pecah dengan spasi
for file in *; do ... done         # BENAR
```

### 3. `[ ]` vs `[[ ]]` confusion

```bash
[ "$a" == "Budi" ]     # work di bash, gak portabel
[ "$a" = "Budi" ]      # POSIX portabel
[[ "$a" == "Budi" ]]   # bash, recommended
```

### 4. CRLF line ending dari Windows

```bash
./script.sh
# bash: ./script.sh: /bin/bash^M: bad interpreter: No such file or directory
```

Fix:

```bash
sed -i 's/\r$//' script.sh
# atau
dos2unix script.sh
```

### 5. `set -e` gak catch error di pipe

```bash
set -e
false | true
# Script gak exit — false diabaikan
```

Fix: `set -eo pipefail`.

### 6. Subshell variable scope

```bash
count=0
echo "hello" | while read line; do
    count=$((count + 1))
done
echo "Count: $count"    # 0 — count di subshell, gak balik
```

Fix: pakai process substitution:

```bash
count=0
while read line; do
    count=$((count + 1))
done < <(echo "hello")
echo "Count: $count"    # 1 — benar
```

### 7. Function name conflict dengan command

```bash
ls() { echo "custom ls"; }
ls           # custom ls (instead of /bin/ls)
unset -f ls  # hapus function
```

### 8. `set -u` bikin script crash untuk `$1` yang gak dikasih

```bash
set -u
echo "Hello $1"    # crash kalau dipanggil tanpa argumen
```

Fix:

```bash
echo "Hello ${1:-world}"    # default value
```

### 9. Exit code dari function gak return string

```bash
get_name() {
    return "Budi"    # SALAH — return cuma terima angka 0-255
}

get_name() {
    echo "Budi"      # BENAR — echo, lalu catch dengan $()
}
name=$(get_name)
```

### 10. Background process dengan `set -e`

```bash
set -e
long_task &         # background
echo "done"
# Kadang set -e gak trigger walau long_task gagal
```

Untuk critical background, tunggu exit code:

```bash
long_task &
PID=$!
wait $PID
echo "Exit: $?"
```

---

## Side project: "Build script toolkit"

### Brief

Kamu bakal bikin kumpulan script berguna yang bisa dipakai sehari-hari. Semua taruh di `~/bin/` (yang udah di-PATH di Sesi 09).

Setup:

```bash
mkdir -p ~/bin
mkdir -p ~/belajar-linux/minggu-6/latihan
cd ~/belajar-linux/minggu-6/latihan
```

Lakukan misi berikut:

### Script 1: `greet` — Hello dengan fitur

Bikin `~/bin/greet` yang:
- Tanpa argumen: tampilkan "Hello, world!"
- Dengan argumen: "Hello, $1!"
- Dengan flag `--time`: tambahkan waktu saat ini
- Dengan flag `--upper`: uppercase output
- Exit code 0 kalau sukses, 1 kalau ada error

### Script 2: `batch-rename` — Rename banyak file

Bikin `~/bin/batch-rename` yang:
- Terima argumen: `pattern` `replacement` `files...`
- Rename semua file: ganti `pattern` dengan `replacement` di nama
- Contoh: `batch-rename .txt .md *.txt` → semua `.txt` jadi `.md`
- Dry-run mode (`-n`): tampilkan apa yang akan direname tanpa eksekusi
- Confirm mode (`-i`): tanya tiap file

### Script 3: `backup-folder` — Backup dengan timestamp

Bikin `~/bin/backup-folder` yang:
- Terima argumen: folder source, folder destination
- Bikin archive tar.gz dengan nama `<nama-folder>-<timestamp>.tar.gz`
- Validate: folder source harus ada, destination harus writable
- Skip kalau archive dengan nama sama udah ada (idempotent)
- Tampilkan progress dan ukuran akhir

### Script 4: `todo` — Simple todo list

Bikin `~/bin/todo` yang manage todo list di `~/.todos.txt`:
- `todo add "belajar bash"` — tambah task
- `todo list` — tampilkan semua (dengan nomor)
- `todo done 2` — mark task 2 selesai
- `todo remove 1` — hapus task 1
- `todo clear` — hapus semua task yang sudah done
- Format file: `[ ] task` atau `[x] task`

### Script 5: `monitor` — Health check service

Bikin `~/bin/monitor` yang:
- Cek apakah URL tertentu return HTTP 200
- Polling tiap N detik (default 5)
- Log ke file dengan timestamp
- Berhenti kalau service up 3 kali berturut-turut (atau timeout 5 menit)
- Exit code 0 kalau service up, 1 kalau timeout

### Script 6: `cleanup-tmp` — Hapus file tmp lama

Bikin `~/bin/cleanup-tmp` yang:
- Cari file di `/tmp/` yang lebih dari 7 hari
- Hitung total size
- Tanya konfirmasi (atau `-y` untuk skip)
- Hapus dengan logging
- Hanya hapus file milik user sendiri (KECUALI di-run sebagai root)

### Test semua script

Untuk masing-masing script di atas:
1. Test dengan argumen normal
2. Test dengan argumen kosong / invalid
3. Test edge case (file gak ada, permission denied, dll)
4. Pastikan exit code benar
5. Pastikan output helpful

<details>
<summary>Solusi (klik expand)</summary>

### Script 1: greet

```bash
#!/usr/bin/env bash
# greet - hello world dengan fitur
set -euo pipefail

show_time=false
upper=false
name=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --time) show_time=true; shift ;;
        --upper) upper=true; shift ;;
        -h|--help)
            echo "Usage: greet [--time] [--upper] [name]"
            exit 0
            ;;
        *)
            name="$1"
            shift
            ;;
    esac
done

msg="Hello, ${name:-world}!"

if $show_time; then
    msg="$msg ($(date +%H:%M:%S))"
fi

if $upper; then
    msg="${msg^^}"
fi

echo "$msg"
exit 0
```

### Script 2: batch-rename

```bash
#!/usr/bin/env bash
# batch-rename - rename banyak file
set -euo pipefail

dry_run=false
confirm=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        -n) dry_run=true; shift ;;
        -i) confirm=true; shift ;;
        -h|--help)
            echo "Usage: batch-rename [-n] [-i] <pattern> <replacement> <files...>"
            echo "  -n  dry run (tampilkan tanpa eksekusi)"
            echo "  -i  interaktif (tanya tiap file)"
            exit 0
            ;;
        *) break ;;
    esac
done

if [[ $# -lt 3 ]]; then
    echo "Error: butuh minimal pattern, replacement, dan 1 file" >&2
    exit 1
fi

pattern="$1"
replacement="$2"
shift 2

for file in "$@"; do
    if [[ ! -e "$file" ]]; then
        echo "Warning: $file tidak ada, skip" >&2
        continue
    fi

    dir=$(dirname "$file")
    base=$(basename "$file")
    new_base="${base//$pattern/$replacement}"
    new_file="$dir/$new_base"

    if [[ "$file" == "$new_file" ]]; then
        continue
    fi

    if $dry_run; then
        echo "[DRY] $file → $new_file"
        continue
    fi

    if $confirm; then
        read -p "Rename '$file' → '$new_file'? [y/N] " ans
        [[ "$ans" != "y" && "$ans" != "Y" ]] && continue
    fi

    mv -v "$file" "$new_file"
done
```

### Script 3: backup-folder

```bash
#!/usr/bin/env bash
# backup-folder - backup folder ke tar.gz dengan timestamp
set -euo pipefail

if [[ $# -lt 2 ]]; then
    echo "Usage: backup-folder <source> <destination>" >&2
    exit 1
fi

src="$1"
dest="$2"

if [[ ! -d "$src" ]]; then
    echo "Error: source '$src' bukan directory" >&2
    exit 1
fi

if [[ ! -d "$dest" ]]; then
    echo "Error: destination '$dest' bukan directory" >&2
    exit 1
fi

if [[ ! -w "$dest" ]]; then
    echo "Error: destination '$dest' tidak writable" >&2
    exit 1
fi

folder_name=$(basename "$(realpath "$src")")
timestamp=$(date +%Y%m%d-%H%M%S)
archive="$dest/${folder_name}-${timestamp}.tar.gz"

if [[ -f "$archive" ]]; then
    echo "Archive sudah ada: $archive (skip)"
    exit 0
fi

echo "Backing up $src → $archive"
tar -czf "$archive" -C "$(dirname "$src")" "$folder_name"

size=$(du -h "$archive" | cut -f1)
echo "Done! Size: $size"
```

### Script 4: todo

```bash
#!/usr/bin/env bash
# todo - simple todo list manager
set -euo pipefail

TODO_FILE="${TODO_FILE:-$HOME/.todos.txt}"
touch "$TODO_FILE"

cmd="${1:-list}"
shift || true

case "$cmd" in
    add)
        if [[ $# -eq 0 ]]; then
            echo "Usage: todo add <task>" >&2
            exit 1
        fi
        echo "[ ] $*" >> "$TODO_FILE"
        echo "Added: $*"
        ;;
    list)
        if [[ ! -s "$TODO_FILE" ]]; then
            echo "(no tasks)"
            exit 0
        fi
        i=1
        while IFS= read -r line; do
            echo "$i. $line"
            i=$((i + 1))
        done < "$TODO_FILE"
        ;;
    done)
        if [[ $# -eq 0 ]]; then
            echo "Usage: todo done <number>" >&2
            exit 1
        fi
        n="$1"
        if [[ ! "$n" =~ ^[0-9]+$ ]]; then
            echo "Error: number required" >&2
            exit 1
        fi
        tmp=$(mktemp)
        i=1
        while IFS= read -r line; do
            if [[ $i -eq $n ]]; then
                echo "[x] ${line#\[ \] }" >> "$tmp"
                echo "[x] ${line#\[x\] }" >> "$tmp"
            else
                echo "$line" >> "$tmp"
            fi
            i=$((i + 1))
        done < "$TODO_FILE"
        # Actually fix the done logic - replace [ ] with [x]
        awk -v n="$n" 'NR==n && /^\[ \]/ {sub(/\[ \]/, "[x]")} {print}' "$TODO_FILE" > "$tmp"
        mv "$tmp" "$TODO_FILE"
        echo "Marked $n as done"
        ;;
    remove)
        if [[ $# -eq 0 ]]; then
            echo "Usage: todo remove <number>" >&2
            exit 1
        fi
        n="$1"
        tmp=$(mktemp)
        awk -v n="$n" 'NR != n' "$TODO_FILE" > "$tmp"
        mv "$tmp" "$TODO_FILE"
        echo "Removed task $n"
        ;;
    clear)
        grep -v '^\[x\]' "$TODO_FILE" > "$TODO_FILE.tmp" || true
        mv "$TODO_FILE.tmp" "$TODO_FILE"
        echo "Cleared completed tasks"
        ;;
    *)
        echo "Usage: todo {add|list|done|remove|clear}" >&2
        exit 1
        ;;
esac
```

### Script 5: monitor

```bash
#!/usr/bin/env bash
# monitor - health check URL
set -euo pipefail

url="${1:-http://localhost:8080/health}"
interval="${2:-5}"
max_wait=300  # 5 minutes
log_file="/tmp/monitor-$(date +%s).log"

echo "Monitoring $url every ${interval}s (max ${max_wait}s)"
echo "Log: $log_file"

start=$(date +%s)
success_count=0

while true; do
    now=$(date +%s)
    elapsed=$((now - start))

    if [[ $elapsed -gt $max_wait ]]; then
        echo "[$(date)] TIMEOUT after ${elapsed}s" | tee -a "$log_file"
        exit 1
    fi

    if http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null); then
        if [[ "$http_code" == "200" ]]; then
            echo "[$(date)] OK (200) - streak $((success_count + 1))" | tee -a "$log_file"
            success_count=$((success_count + 1))
            if [[ $success_count -ge 3 ]]; then
                echo "[$(date)] Service is UP (3 consecutive success)" | tee -a "$log_file"
                exit 0
            fi
        else
            echo "[$(date)] FAIL (HTTP $http_code)" | tee -a "$log_file"
            success_count=0
        fi
    else
        echo "[$(date)] FAIL (connection error)" | tee -a "$log_file"
        success_count=0
    fi

    sleep "$interval"
done
```

### Script 6: cleanup-tmp

```bash
#!/usr/bin/env bash
# cleanup-tmp - hapus file tmp lama
set -euo pipefail

days="${1:-7}"
auto_yes=false

[[ "${1:-}" == "-y" ]] && auto_yes=true && days="${2:-7}"

if [[ ! "$days" =~ ^[0-9]+$ ]]; then
    echo "Error: days must be number" >&2
    exit 1
fi

echo "Mencari file di /tmp/ yang lebih dari $days hari..."

# Cari file milik user sendiri (atau semua kalau root)
if [[ $EUID -eq 0 ]]; then
    files=$(find /tmp -type f -mtime +$days 2>/dev/null)
else
    files=$(find /tmp -type f -mtime +$days -user "$(whoami)" 2>/dev/null)
fi

if [[ -z "$files" ]]; then
    echo "Tidak ada file untuk dihapus."
    exit 0
fi

# Hitung total size
total_size=0
file_count=0
while IFS= read -r f; do
    size=$(stat -c %s "$f" 2>/dev/null || stat -f %z "$f" 2>/dev/null)
    total_size=$((total_size + size))
    file_count=$((file_count + 1))
done <<< "$files"

echo "Ditemukan $file_count file, total $(numfmt --to=iec $total_size 2>/dev/null || echo "${total_size} bytes")"

if ! $auto_yes; then
    read -p "Hapus semua? [y/N] " ans
    [[ "$ans" != "y" && "$ans" != "Y" ]] && exit 0
fi

while IFS= read -r f; do
    rm -f "$f"
    echo "Removed: $f"
done <<< "$files"

echo "Done. $file_count file dihapus."
```

### Setup dan test

```bash
chmod +x ~/bin/greet ~/bin/batch-rename ~/bin/backup-folder ~/bin/todo ~/bin/monitor ~/bin/cleanup-tmp

# Test greet
greet
greet Budi
greet --time Budi
greet --upper "hello world"

# Test batch-rename
mkdir -p /tmp/test-batch
cd /tmp/test-batch
touch file1.txt file2.txt file3.txt
batch-rename -n .txt .bak *.txt    # dry run
batch-rename .txt .bak *.txt
ls

# Test backup-folder
backup-folder ~/belajar-linux /tmp

# Test todo
todo add "Belajar bash"
todo add "Bikin script"
todo list
todo done 1
todo list
todo clear
todo list

# Test monitor (butuh server, bisa pakai python)
# python3 -m http.server 8080 &
# monitor http://localhost:8080/ 5 30

# Test cleanup-tmp
cleanup-tmp 0    # file lebih dari 0 hari (semua)
```

</details>

---

## Tantangan ekstra (opsional)

- Baca `man bash` bagian "SHELL GRAMMAR". Reference lengkap.
- Pelajari `getopts` untuk parsing command-line option yang lebih terstruktur.
- Coba `shellcheck` — linter untuk shell script:
  ```bash
  sudo apt install shellcheck
  shellcheck ~/bin/greet
  ```
  Fix semua warning yang muncul.
- Convert salah satu script kamu jadi Python. Bandingkan readability dan performance.
- Pelajari `Makefile` sebagai alternatif orchestrator (bukan bash script).
- Coba `jq` untuk manipulasi JSON di shell:
  ```bash
  echo '{"name":"Budi","age":25}' | jq '.name'
  ```

---

## Tanda kelar

- [ ] Saya bisa bikin `.sh` script dengan shebang yang benar
- [ ] Saya paham beda single quote (literal) vs double quote (expand) vs no quote (split)
- [ ] Saya bisa pakai `$1`, `$@`, `$#`, `$?`, `$$` dengan benar
- [ ] Saya bisa tulis `if`/`elif`/`else` dengan `[[ ]]` (bukan `[ ]`)
- [ ] Saya bisa tulis `case` untuk multiple branch
- [ ] Saya bisa tulis `for` dan `while` loop, dengan `break`/`continue`
- [ ] Saya bisa bikin function dengan argumen dan `local` variable
- [ ] Saya tahu beda `return` (exit code) dan `echo` (capture via `$()`)
- [ ] Saya selalu pakai `set -euo pipefail` di awal script
- [ ] Saya bisa debug dengan `set -x` atau `bash -x script.sh`
- [ ] Saya bisa pakai `trap` untuk cleanup
- [ ] Saya bisa bikin script executable dan taruh di PATH (`~/bin/`)
- [ ] Saya pernah selesaikan minimal 3 dari 6 script di side project

Kalau ada yang belum centang, ulang dulu. Sesi 12 (capstone) asumsi kamu bisa script dengan lancar.

---

**Next:** `12-capstone.md` — project final! Kamu bakal gabungin SEMUA yang udah dipelajari jadi satu sistem automation yang berguna. Pilihan project: backup system, log rotation, atau system health monitor.
