# Sesi 10 — Text Editor di Terminal: `nano` & Dasar `vim`

> **Minggu 5, Sesi 10 dari 12**
> **Estimasi: 3–4 hari (60–75 menit/hari)**

## Tujuan sesi ini

Akhir sesi ini kamu harus bisa:
- Edit file konfigurasi server pake `nano` tanpa bingung
- Buka, edit, save, quit `nano` tanpa nyentuh mouse
- Paham **mode** di `vim` (normal, insert, visual, command)
- Bisa buka, edit, save, quit `vim` — tanpa stuck di dalam
- Lakukan operasi dasar `vim`: navigasi, copy-paste, search, undo/redo
- Ngerti kapan pakai `nano` vs `vim`

Kenapa penting: server produksi gak punya GUI. Kalau kamu SSH ke VPS dan harus edit `/etc/nginx/nginx.conf`, kamu gak bisa buka VS Code. Harus pakai terminal editor.

---

## Estimasi waktu belajar

| Hari | Aktivitas | Durasi |
|------|-----------|--------|
| 1 | `nano` lengkap — semua shortcut penting | 60 menit |
| 2 | `vim` — konsep mode + operasi dasar (open/edit/save/quit) | 75 menit |
| 3 | `vim` — navigasi, copy-paste, search, undo | 75 menit |
| 4 | Side project + review | 60 menit |

---

## Bagian 1: `nano` — Editor Pemula Friendly

`nano` = editor paling simple di terminal. Bottom-bar nunjukin shortcut, gak ada mode yang bikin bingung.

### Buka file

```bash
nano file.txt                # buka file (buat baru kalau belum ada)
nano /etc/hosts              # buka file sistem (butuh sudo kalau mau edit)
sudo nano /etc/hosts         # benar
nano +10 file.txt            # buka langsung lompat ke baris 10
nano -B file.txt             # backup file asli ke file.txt~ sebelum edit
```

### Tampilan `nano`

```
  GNU nano 6.2                file.txt
line 1 content
line 2 content
line 3 content

^G Help     ^O Write Out ^W Where Is  ^K Cut      ^T Execute
^X Exit     ^R Read File ^\ Replace   ^U Paste    ^J Justify
```

`^` artinya `Ctrl`. Jadi `^X` = `Ctrl+X`.

### Shortcut wajib

| Shortcut | Aksi |
|----------|------|
| `Ctrl+X` | Exit (kalau ada perubahan, ditanya save atau gak) |
| `Ctrl+O` | Save (Write Out) — minta konfirmasi nama file |
| `Ctrl+G` | Help |
| `Ctrl+W` | Search (Where Is) |
| `Ctrl+\` | Search & Replace |
| `Ctrl+K` | Cut line (potong baris ke "clipboard" nano) |
| `Ctrl+U` | Paste (Uncut) |
| `Ctrl+J` | Justify (rapikan paragraf) |

### Shortcut navigasi

| Shortcut | Aksi |
|----------|------|
| `Ctrl+A` | Awal baris |
| `Ctrl+E` | Akhir baris |
| `Ctrl+Y` | Page up |
| `Ctrl+V` | Page down |
| `Ctrl+_` | Lompat ke baris N (kasih nomor) |
| `Alt+G` | Lompat ke baris N (alternatif) |

### Shortcut edit

| Shortcut | Aksi |
|----------|------|
| `Ctrl+D` | Hapus karakter di bawah cursor |
| `Ctrl+H` | Backspace |
| `Ctrl+Space` | Next word |
| `Alt+Space` | Prev word |
| `Alt+6` | Copy baris (tanpa cut) |
| `Ctrl+Shift+6` | Set mark (mulai seleksi) — lalu gerakkan cursor, tekan `Ctrl+K` untuk cut |

### Cara save & exit

**Save tanpa exit:**
```
Ctrl+O
# Muncul prompt: "File Name to Write: file.txt"
# Tekan Enter untuk konfirmasi nama
```

**Exit (dengan save kalau ada perubahan):**
```
Ctrl+X
# Kalau ada perubahan: "Save modified buffer?"
# Y = save, N = discard, Ctrl+C = batal exit
```

### Konfigurasi `nano`

Default `nano` gak show line numbers dan gak enable mouse. Edit `~/.nanorc`:

```bash
cat > ~/.nanorc << 'EOF'
set linenumbers       # tampilkan nomor baris
set mouse             # enable mouse (klik untuk pindah cursor)
set autoindent        # auto indent
set tabsize 4         # tab = 4 spasi
set tabstospaces      # konversi tab ke spasi
set constantshow      # selalu tampilkan posisi cursor
EOF
```

### Kapan pakai `nano`

- Edit file konfigurasi sistem cepat
- Pemula yang baru belajar terminal
- Quick fix 1-2 baris di server
- Default `EDITOR` di banyak distro

**Saran:** pakai `nano` sebagai default editor sampai kamu merasa butuh power `vim`. Jangan dipaksa belajar `vim` kalau belum perlu.

---

## Bagian 2: `vim` — Editor Power User

`vim` = Vi IMproved. Editor modal yang powerful tapi steep learning curve. Sekali kamu lancar, kamu bisa edit 5x lebih cepat dari `nano`.

### Kenapa `vim` susah (tapi sepadan)

- **Modal editor**: ada mode yang berbeda untuk navigasi vs mengetik
- **Tidak intuitif**: shortcut gak mengikuti konvensi modern (Ctrl+C, Ctrl+V)
- **Curva belajar**: butuh 1-2 minggu untuk feel comfortable

Tapi setelah lancar:
- Kecepatan edit jauh di atas `nano`
- Bisa di-customize extreme (`~/.vimrc`)
- Banyak plugin powerful
- Tersedia di hampir semua server (POSIX standard)

### Install / cek

```bash
vim --version        # cek apakah terinstall
# Kalau belum:
sudo apt install vim     # Ubuntu/Debian
brew install vim         # Mac
```

> **Catatan:** beberapa sistem punya `vi` (versi lama) dan `vim` (versi modern). Selalu pakai `vim`. Beberapa distro bikin `vi` sebagai symlink ke `vim`.

---

## Materi 1: Konsep Mode di `vim`

Ini **KUNCI** memahami vim. Kamu harus tahu mode mana lagi aktif.

### Empat mode utama

| Mode | Cara masuk | Cara keluar | Fungsi |
|------|------------|-------------|--------|
| **Normal** | `Esc` (selalu balik ke sini) | — | Navigasi, operasi teks |
| **Insert** | `i`, `a`, `o`, `I`, `A`, `O` | `Esc` | Ketik teks |
| **Visual** | `v`, `V`, `Ctrl+V` | `Esc` | Seleksi teks |
| **Command** | `:` | `Esc` atau Enter | Eksekusi command (save, quit, search, dll) |

### Aturan emas

**Default = Normal mode.** Kalau bingung, tekan `Esc`. Dari normal mode, kamu bisa masuk mode lain.

Banyak newbie stuck di vim karena gak sadar lagi di insert mode (coba ketik `:w` tapi gak jalan karena bukan command mode).

---

## Materi 2: Buka, save, quit

```bash
vim file.txt              # buka file
vim +10 file.txt          # buka, langsung ke baris 10
vim +/pattern file.txt    # buka, langsung ke match pertama "pattern"
vim -R file.txt           # read-only mode
vim file1.txt file2.txt   # buka multiple file
```

### Save & quit (dari normal mode, tekan `:` untuk masuk command mode)

| Command | Aksi |
|---------|------|
| `:w` | Write (save) |
| `:q` | Quit |
| `:wq` atau `:x` | Write dan quit |
| `:q!` | **Quit tanpa save** (force) |
| `:w!` | Write walaupun read-only (force) |
| `ZZ` | Save dan quit (shortcut, tanpa `:`) |
| `ZQ` | Quit tanpa save (shortcut) |

**Penting:** tekan `Enter` setelah command `:` untuk eksekusi.

### Cara keluar dari vim (FAQ klasik)

```bash
# Dari mode apapun:
Esc           # balik ke normal mode
:q            # lalu Enter
# Kalau ada perubahan yang belum di-save dan kamu mau discard:
:q!           # lalu Enter
```

Itu aja. Kalau kamu stuck di vim, selalu: `Esc` dulu, lalu `:q!` Enter.

---

## Materi 3: Masuk Insert Mode

Dari normal mode, tekan salah satu:

| Key | Mode | Posisi cursor setelah masuk |
|-----|------|------------------------------|
| `i` | insert | Di posisi cursor saat ini |
| `I` | insert | Awal baris (after whitespace) |
| `a` | append | Setelah cursor (geser 1 ke kanan) |
| `A` | append | Akhir baris |
| `o` | open | Baris baru DI BAWAH cursor |
| `O` | open | Baris baru DI ATAS cursor |
| `s` | substitute | Hapus char di cursor, masuk insert |
| `S` | substitute | Hapus seluruh baris, masuk insert |
| `c` | change | Hapus seleksi, masuk insert (dengan motion) |

Paling sering dipakai: `i`, `a`, `o`, `A`, `O`.

**Tips:** kalau mau ngetik di akhir baris, langsung `A`. Lebih cepat dari `i` + navigasi ke akhir.

---

## Materi 4: Navigasi di Normal Mode

### Navigasi dasar

| Key | Aksi |
|-----|------|
| `h` | Kiri |
| `j` | Bawah |
| `k` | Atas |
| `l` | Kanan |

Ingat: `j` = turun (bawah), karena bentuk `j` ada "titik" di bawah.
`k` = naik (atas), karena `k` melihat ke atas (asosiasi bebas).

### Navigasi word

| Key | Aksi |
|-----|------|
| `w` | Next word (awal) |
| `b` | Prev word (awal) |
| `e` | End of next word |
| `W`, `B`, `E` | Sama, tapi "WORD" (dipisah whitespace saja, bukan punctuation) |

### Navigasi line

| Key | Aksi |
|-----|------|
| `0` | Awal baris (kolom 0) |
| `^` | Awal baris (karakter non-whitespace pertama) |
| `$` | Akhir baris |
| `+` atau `Enter` | Awal baris berikutnya |
| `-` | Awal baris sebelumnya |

### Navigasi dokumen

| Key | Aksi |
|-----|------|
| `gg` | Ke baris pertama |
| `G` | Ke baris terakhir |
| `:42` + Enter | Ke baris 42 |
| `42G` atau `42gg` | Ke baris 42 (alternatif) |
| `Ctrl+u` | Half page up |
| `Ctrl+d` | Half page down |
| `Ctrl+b` | Full page up |
| `Ctrl+f` | Full page down |
| `H` | Top of screen (High) |
| `M` | Middle of screen |
| `L` | Bottom of screen (Low) |

### Navigasi search

| Key | Aksi |
|-----|------|
| `/pattern` + Enter | Cari "pattern" ke depan |
| `?pattern` + Enter | Cari "pattern" ke belakang |
| `n` | Next match |
| `N` | Prev match |
| `*` | Cari kata di bawah cursor (ke depan) |
| `#` | Cari kata di bawah cursor (ke belakang) |

---

## Materi 5: Edit teks di Normal Mode

Power vim: operasi edit jadi movement. Satu keystroke = satu aksi.

### Hapus (delete)

| Key | Aksi |
|-----|------|
| `x` | Hapus karakter di cursor |
| `X` | Hapus karakter sebelum cursor |
| `dd` | Hapus baris (cut) |
| `dw` | Hapus sampai next word |
| `de` | Hapus sampai end of word |
| `db` | Hapus sampai prev word |
| `d$` atau `D` | Hapus sampai akhir baris |
| `d0` | Hapus sampai awal baris |
| `dG` | Hapus dari cursor sampai akhir file |
| `dgg` | Hapus dari cursor sampai awal file |
| `5dd` | Hapus 5 baris |

Pola: `d` + motion. `d` = "delete this motion".

### Copy (yank)

Sama dengan `d`, tapi pakai `y`:

| Key | Aksi |
|-----|------|
| `yy` | Copy baris |
| `yw` | Copy word |
| `y$` | Copy sampai akhir baris |
| `yG` | Copy sampai akhir file |

> **Catatan:** `y` = "yank" = copy di vim terminology.

### Paste (put)

| Key | Aksi |
|-----|------|
| `p` | Paste setelah cursor (atau di bawah baris kalau yang di-yank full baris) |
| `P` | Paste sebelum cursor (atau di atas baris) |

### Change (hapus + insert)

| Key | Aksi |
|-----|------|
| `cc` | Hapus baris, masuk insert |
| `cw` | Hapus word, masuk insert |
| `c$` atau `C` | Hapus sampai akhir baris, masuk insert |

### Repeat

| Key | Aksi |
|-----|------|
| `.` | Ulangi aksi terakhir |

`.` = repeat last change. Salah satu fitur paling powerful vim.

Contoh: tekan `dd` untuk hapus baris. Tekan `.` untuk hapus baris lagi. Tekan `5.` untuk hapus 5 baris.

### Undo/Redo

| Key | Aksi |
|-----|------|
| `u` | Undo |
| `Ctrl+r` | Redo |
| `U` | Undo semua perubahan di baris saat ini |

---

## Materi 6: Visual Mode — Seleksi teks

| Key | Mode | Seleksi |
|-----|------|---------|
| `v` | Visual | Karakter per karakter |
| `V` | Visual line | Per baris |
| `Ctrl+V` | Visual block | Kotak (block) — powerful untuk edit kolom |

Setelah seleksi, operasi yang biasa (`d`, `y`, `c`, dll) bekerja pada seleksi.

### Contoh visual block (vertical edit)

Misal kamu punya list:

```
item1
item2
item3
```

Mau ubah jadi:

```
- item1
- item2
- item3
```

Cara:
1. Posisi cursor di `i` baris pertama
2. `Ctrl+V` (visual block)
3. `2j` (turun 2 baris, seleksi 3 baris)
4. `I` (insert di awal seleksi, capital i)
5. Ketik `- ` (dash spasi)
6. `Esc`

Semua 3 baris dapat `- ` otomatis. **Magic vim.**

---

## Materi 7: Search & Replace

```vim
# Search
/pattern         # cari ke depan
?pattern         # cari ke belakang
n                # next
N                # prev
*                # cari word di bawah cursor

# Search & replace
:s/old/new/      # ganti first match di baris saat ini
:s/old/new/g     # ganti SEMUA match di baris saat ini
:s/old/new/gc    # ganti semua di baris, dengan konfirmasi tiap match
:%s/old/new/g    # ganti semua di SELURUH file
:%s/old/new/gc   # ganti semua di file, dengan konfirmasi
:%s/old/new/gi   # case-insensitive
:5,10s/old/new/g # ganti di baris 5-10 saja
```

### Pattern regex vim

| Pattern | Arti |
|---------|------|
| `.` | Karakter apapun |
| `*` | Nol atau lebih |
| `\+` | Satu atau lebih |
| `\?` | Nol atau satu |
| `^` | Awal baris |
| `$` | Akhir baris |
| `\<` | Awal word |
| `\>` | Akhir word |
| `[abc]` | Salah satu dari a/b/c |
| `\(...\)` | Group (untuk backreference `\1`) |

Contoh: ganti semua `TODO` jadi `DONE`:
```vim
:%s/TODO/DONE/g
```

Ganti `function_name()` jadi `func_name()`:
```vim
:%s/function_name/func_name/g
```

Hapus trailing whitespace:
```vim
:%s/\s\+$//
```

---

## Materi 8: Multiple file

```bash
vim file1.txt file2.txt file3.txt
```

Dalam vim:

| Command | Aksi |
|---------|------|
| `:n` atau `:next` | File berikutnya |
| `:N` atau `:prev` | File sebelumnya |
| `:args` | Liat list file yang kebuka |
| `:e file.txt` | Buka file lain |
| `:bd` | Buffer delete (tutup file) |
| `:ls` | List semua buffer |
| `:b2` | Switch ke buffer 2 |
| `:split` atau `:sp` | Split horizontal |
| `:vsplit` atau `:vs` | Split vertical |
| `Ctrl+w h/j/k/l` | Pindah antar split |

---

## Materi 9: Konfigurasi `~/.vimrc`

Default vim agak plain. Bikin `~/.vimrc`:

```vim
" === Basic ===
set number              " tampilkan nomor baris
set relativenumber      " nomor relatif (mudah untuk motion 5j dll)
set tabstop=4           " tab = 4 spasi
set shiftwidth=4        " indent = 4 spasi
set expandtab           " tab jadi spasi
set autoindent          " auto indent
set smartindent         " smart indent
set cursorline          " highlight baris saat ini
set showmatch           " highlight pasangan bracket
set incsearch           " search incrementally
set hlsearch            " highlight search results
set ignorecase          " case insensitive search
set smartcase           " ...kecuali ada uppercase
set wildmenu            " better tab completion di command mode
set laststatus=2        " selalu show statusline
set ruler               " show cursor position
set mouse=a             " enable mouse

" === Shortcut ===
let mapleader = " "      " leader = space
nnoremap <leader>w :w<CR>
nnoremap <leader>q :q<CR>
nnoremap <leader>x :x<CR>
nnoremap <leader>e :Ex<CR>

" === Mapping escape lebih gampang ===
inoremap jk <Esc>
inoremap kj <Esc>
```

Setelah ada ini, di insert mode tekan `jk` (cepat) = `Esc`. Lebih nyaman dari stretch ke `Esc`.

---

## Common pitfalls

### 1. Stuck di vim, gak bisa keluar

```
# Kalau gak sengaka masuk vim, ketik:
:q!            # lalu Enter
# Kalau masih gak keluar, mungkin kamu di mode lain. Tekan Esc dulu:
Esc
:q!
```

### 2. Ketik di normal mode, keluar aneh-aneh

Gejala: kamu ketik "hello" tapi yang muncul di layar aneh. Kemungkinan kamu lagi di **normal mode** (bukan insert). Tekan `i` dulu untuk masuk insert, baru ketik.

### 3. Save ke file read-only

```
E45: 'readonly' option is set (add ! to override)
```

Kalau kamu yakin:

```vim
:w!
```

Atau kalau filenya milik root, jangan paksa — keluar dulu, buka dengan sudo:

```bash
sudo vim /etc/file
```

### 4. Search highlight gak ilang

Setelah search, semua match tetap highlighted. Clear:

```vim
:nohlsearch
# atau singkat:
:noh
```

Atau bikin mapping di `.vimrc`:
```vim
nnoremap <leader>h :nohlsearch<CR>
```

### 5. Tab vs spasi bercampur

Gejala: indentasi看起来 messy. Vim default pakai tab. Set di `.vimrc`:

```vim
set expandtab
set tabstop=4
set shiftwidth=4
```

Konversi tab existing ke spasi:

```vim
:retab
```

### 6. `nano` minta confirm nama file tiap save

`Ctrl+O` minta konfirmasi nama file. Cukup tekan `Enter` untuk konfirmasi nama yang sama. Atau pakai `Ctrl+S` di nano versi baru (auto-save).

### 7. Copy paste dari luar ke vim jadi aneh

Gejala: paste dari clipboard, indent jadi rusak (autoindent ganggu). Fix:

```vim
:set paste
# paste dari clipboard
:set nopaste
```

Atau bikin mapping:
```vim
set pastetoggle=<F2>
```

Tekan `F2` sebelum paste, `F2` lagi setelah.

### 8. Arrow key gak jalan di insert mode

Beberapa terminal lama / konfigurasi aneh, arrow key mengirim escape sequence yang dikira `Esc`. Workaround: pakai `hjkl` di normal mode. Atau update terminal emulator.

### 9. Encoding masalah dengan emoji / karakter non-ASCII

```vim
set encoding=utf-8
set fileencoding=utf-8
```

Tambah ke `.vimrc`.

---

## Side project: "Config editor"

### Brief

Kamu bakal setup editor lengkap + lakukan serangkaian editing task untuk latihan muscle memory.

Setup:

```bash
mkdir -p ~/belajar-linux/minggu-5/latihan
cd ~/belajar-linux/minggu-5/latihan

# Bikin file dummy buat latihan
cat > sample.txt << 'EOF'
TODO: implement authentication
The quick brown fox jumps over the lazy dog.
function old_name() {
    return "hello";
}
TODO: add error handling
item1
item2
item3
item4
item5
function old_name() {
    console.log("test");
}
TODO: write tests
   trailing spaces here    
indented line
EOF

# Bikin file config palsu
cat > app.conf << 'EOF'
[server]
port = 8080
host = localhost
debug = true

[database]
url = postgres://localhost/db
pool_size = 10
timeout = 30

[logging]
level = info
file = /var/log/app.log
EOF
```

Lakukan misi berikut:

### Misi `nano`

1. Buka `app.conf` dengan `nano`, ubah `debug = true` jadi `debug = false`, save, exit.
2. Buka lagi dengan `nano`, ubah `port = 8080` jadi `port = 3000`. Save tanpa exit (Ctrl+O). Lalu exit (Ctrl+X).
3. Buka dengan `nano +5 app.conf` (langsung ke baris 5). Tambahkan comment `# TODO: review` di baris baru. Save, exit.
4. Buka `sample.txt` dengan `nano`, cari semua "TODO" (Ctrl+W), hitung ada berapa.

### Misi `vim`

5. Buka `sample.txt` dengan `vim`. Lakukan:
   - Pergi ke baris terakhir (`G`)
   - Pergi ke baris pertama (`gg`)
   - Pergi ke baris 5 (`:5` atau `5G`)
   - Cari semua "TODO" (`/TODO` + `n` berkali-kali)
   - Hapus baris yang isinya "trailing spaces here    " (dd)
   - Undo (`u`), redo (`Ctrl+r`)
6. Ganti semua "TODO" jadi "DONE" (`:%s/TODO/DONE/g`)
7. Ganti semua "old_name" jadi "new_function" (`:%s/old_name/new_function/g`)
8. Hapus trailing whitespace (`:%s/\s\+$//`)
9. Tambah prefix "- " ke item1-item5 menggunakan visual block mode:
   - Cursor di huruf `i` pertama (`item1`)
   - `Ctrl+V` untuk visual block
   - `4j` untuk seleksi 5 baris
   - `I` (capital i) untuk insert di awal
   - Ketik `- `
   - `Esc` — semua 5 baris dapat prefix
10. Save dan quit (`:wq`)
11. Buka `app.conf` dengan `vim`, duplicate baris `port = 3000`:
    - Posisi cursor di baris `port = 3000`
    - `yy` (yank)
    - `p` (paste below)
    - Ubah jadi `port = 3001`
    - Save quit
12. Bikin `~/.vimrc` dengan config standar (number, expandtab, mapping jk=Esc, dll). Buka vim lagi, verifikasi config生效.

### Misi bonus

13. Buka `sample.txt` di `vim`. Hapus semua baris yang mengandung "TODO" (sebelum step 6, kalau udah diganti, gunakan "DONE"):
    ```vim
    :g/TODO/d
    ```
    Ini command vim yang powerful: `:g/pattern/command` = jalankan command ke setiap baris yang match pattern.
14. Buka `app.conf` di `vim`, sort semua baris:
    ```vim
    :sort
    ```
15. Setup `EDITOR` env var supaya program lain tahu editor preferred kamu:
    ```bash
    echo 'export EDITOR=vim' >> ~/.bashrc
    source ~/.bashrc
    ```
    Test dengan `git config --global core.editor vim` lalu `git commit` (tanpa `-m`) — harusnya buka vim.

<details>
<summary>Solusi (klik expand)</summary>

```bash
cd ~/belajar-linux/minggu-5/latihan

# ======== MISI NANO ========

# 1. Ubah debug=true → false
nano app.conf
# Ctrl+W untuk cari "debug", edit manual, Ctrl+O Enter untuk save, Ctrl+X untuk exit

# 2. Ubah port, save tanpa exit
nano app.conf
# Ctrl+W "port", edit
# Ctrl+O Enter (save)
# Ctrl+X (exit)

# 3. Buka ke baris 5, tambah comment
nano +5 app.conf
# Tambah baris baru: ketik # TODO: review
# Ctrl+O, Ctrl+X

# 4. Cari semua TODO di sample.txt
nano sample.txt
# Ctrl+W TODO Enter, tekan Ctrl+W lagi untuk next match (atau Alt+W)
# Hitung manual

# ======== MISI VIM ========

# 5. Navigasi
vim sample.txt
# G     -> ke baris terakhir
# gg    -> ke baris pertama
# :5    -> ke baris 5
# /TODO -> search, n untuk next
# dd    -> hapus baris
# u     -> undo
# Ctrl+r -> redo

# 6. Ganti TODO -> DONE
:%s/TODO/DONE/g
# Enter

# 7. Ganti old_name -> new_function
:%s/old_name/new_function/g

# 8. Hapus trailing whitespace
:%s/\s\+$//

# 9. Visual block prefix
# Posisi di 'i' item1
# Ctrl+V (visual block)
# 4j (turun 4 baris, total 5 terpilih)
# I (capital i, insert di awal)
# Ketik: - (dash spasi)
# Esc
# Tunggu sebentar, semua 5 baris dapat prefix

# 10. Save quit
:wq

# 11. Duplicate line di app.conf
vim app.conf
# Posisi cursor di baris "port = 3000"
# yy (yank line)
# p (paste below)
# Edit baris baru jadi port = 3001
# :wq

# 12. Bikin vimrc
cat > ~/.vimrc << 'EOF'
set number
set relativenumber
set tabstop=4
set shiftwidth=4
set expandtab
set autoindent
set cursorline
set showmatch
set incsearch
set hlsearch
set ignorecase
set smartcase
set wildmenu
set laststatus=2
set mouse=a

let mapleader = " "
nnoremap <leader>w :w<CR>
nnoremap <leader>q :q<CR>
nnoremap <leader>x :x<CR>

inoremap jk <Esc>
inoremap kj <Esc>

nnoremap <leader>h :nohlsearch<CR>
EOF

# Verifikasi
vim sample.txt
# Harus ada nomor baris, dll

# ======== MISI BONUS ========

# 13. Hapus semua baris dengan TODO
vim sample.txt
:g/TODO/d
# (kalau udah diganti DONE di step 6, pakai :g/DONE/d)

# 14. Sort semua baris
vim app.conf
:sort

# 15. Setup EDITOR
echo 'export EDITOR=vim' >> ~/.bashrc
source ~/.bashrc
git config --global core.editor vim
# Test (butuh git repo):
# mkdir test-git && cd test-git && git init
# touch file.txt && git add file.txt
# git commit
# Harusnya buka vim untuk edit commit message
```

</details>

---

## Tantangan ekstra (opsional)

- Install plugin manager `vim-plug`:
  ```bash
  curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
      https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  ```
  Lalu tambah ke `.vimrc`:
  ```vim
  call plug#begin('~/.vim/plugged')
  Plug 'tpope/vim-surround'
  Plug 'tpope/vim-commentary'
  Plug 'preservim/nerdtree'
  call plug#end()
  ```
  Buka vim, `:PlugInstall`.
- Pelajari `:help` di vim — built-in documentation yang sangat lengkap. Coba `:help motion.txt`, `:help change.txt`.
- Coba `neovim` (`nvim`) — modern fork vim dengan fitur lebih (LSP, Treesitter).
- Pelajari `vimtutor` — tutorial interaktif bawaan vim:
  ```bash
  vimtutor
  ```
  Lakukan sampai selesai (~30 menit). Worth it banget.
- Coba `emacs` + evil-mode kalau penasaran editor lain.

---

## Tanda kelar

- [ ] Saya bisa buka, edit, save, exit `nano` tanpa bingung
- [ ] Saya tahu shortcut penting nano: `Ctrl+O`, `Ctrl+X`, `Ctrl+W`, `Ctrl+K`, `Ctrl+U`
- [ ] Saya paham konsep mode di vim (normal, insert, visual, command)
- [ ] Saya bisa buka file, masuk insert, edit, save, quit di vim
- [ ] Saya bisa keluar dari vim (Esc → `:q!` Enter kalau bingung)
- [ ] Saya bisa navigasi vim: `hjkl`, `w/b/e`, `gg/G`, `0/$`
- [ ] Saya bisa hapus, copy, paste di vim: `dd`, `yy`, `p`, `x`
- [ ] Saya bisa search & replace di vim: `/pattern`, `:%s/old/new/g`
- [ ] Saya bisa undo/redo di vim: `u`, `Ctrl+r`
- [ ] Saya pernah pakai visual block mode untuk edit kolom
- [ ] Saya punya `~/.vimrc` dengan config standar (number, expandtab, dll)
- [ ] Saya pernah selesaikan side project lengkap

Kalau ada yang belum centang, ulang dulu. Sesi 11 asumsi kamu bisa edit file script dengan lancar.

---

**Next:** `11-shell-scripting.md` — gabungin semua yang udah dipelajari jadi script bash. Variabel, if, for loop, function, dan cara kasih permission eksekusi. Ini sesi terpanjang karena banyak konsep programming.
