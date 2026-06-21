# Sesi 09 — Environment Variables & Shell Config

> **Minggu 5, Sesi 9 dari 12**
> **Estimasi: 4–5 hari (60–90 menit/hari)**

## Tujuan sesi ini

Akhir sesi ini kamu harus bisa:
- Paham konsep environment variable dan bedanya dengan shell variable
- Pakai `export`, `echo $VAR`, `unset`, `env`, `printenv`
- Paham `$PATH` dan cara nambah directory ke PATH
- Setup alias buat hemat ngetik
- Edit `.bashrc` / `.zshrc` dengan benar dan tahu kapan harus `source`
- Beda login shell vs non-login shell, interactive vs non-interactive
- Struktur `.bashrc`, `.bash_profile`, `.profile` — kapan dibaca

Setelah ini, kamu bakal bisa customize shell kamu biar sesuai workflow. Kunci buat produktivitas harian.

---

## Estimasi waktu belajar

| Hari | Aktivitas | Durasi |
|------|-----------|--------|
| 1 | Konsep env var + `export` + `echo` + `env` | 60 menit |
| 2 | `$PATH` — kenapa `node` bisa jalan dari mana saja | 75 menit |
| 3 | Alias + function di `.bashrc` | 75 menit |
| 4 | Login vs non-login, `.bashrc` vs `.bash_profile` vs `.profile` | 75 menit |
| 5 | Side project + review | 75 menit |

---

## Materi 1: Konsep environment variable

**Environment variable** = pasangan key-value yang disimpan di environment proses. Turun dari parent ke child saat proses baru di-spawn.

Cek semua env var saat ini:

```bash
env
# atau
printenv
```

Cek satu variabel:

```bash
echo $USER
echo $HOME
echo $SHELL
echo $PATH
echo $PWD
```

Beberapa env var standar yang sering muncul:

| Variable | Isinya |
|----------|-------|
| `USER` | Username kamu |
| `HOME` | Path home directory |
| `SHELL` | Path shell default |
| `PWD` | Current directory |
| `PATH` | List directory yang dicari saat kamu ketik command |
| `LANG` | Locale (misal `en_US.UTF-8`) |
| `TERM` | Tipe terminal (misal `xterm-256color`) |
| `HOSTNAME` | Nama komputer |
| `EDITOR` | Editor default (dipakai beberapa program) |
| `PS1` | Prompt string (tampilan prompt kamu) |

---

## Materi 2: Set variable — `export`

### Shell variable vs environment variable

```bash
# Shell variable — cuma ada di shell ini, GAK turun ke child
MY_VAR="hello"

# Environment variable — turun ke child
export MY_VAR="hello"

# Bisa juga 2 tahap:
MY_VAR="hello"
export MY_VAR
```

Test bedanya:

```bash
# Shell variable
MY_LOCAL="local value"
bash -c 'echo "child sees: $MY_LOCAL"'
# Output: child sees:        (KOSONG — gak turun)

# Environment variable
export MY_EXPORTED="exported value"
bash -c 'echo "child sees: $MY_EXPORTED"'
# Output: child sees: exported value
```

**Aturan praktis:** kalau variable cuma buat shell skrip sendiri, gak perlu `export`. Kalau variable butuh di aplikasi lain yang kamu panggil dari shell (misal `EDITOR`, `DATABASE_URL`), `export`.

### Hapus variable

```bash
unset MY_VAR
unset MY_EXPORTED
echo $MY_VAR    # kosong
```

### Naming convention

- UPPERCASE = environment variable (konvensi)
- lowercase = shell variable lokal
- Tidak boleh ada spasi di sekitar `=`:
  ```bash
  MY_VAR="value"     # BENAR
  MY_VAR = "value"   # SALAH — shell anggap MY_VAR sebagai command
  ```

### Default value — `${VAR:-default}`

```bash
echo ${MY_VAR:-"default value"}
# Output: default value   (karena MY_VAR belum di-set)

MY_VAR="actual"
echo ${MY_VAR:-"default value"}
# Output: actual
```

### Assign default — `${VAR:=default}`

```bash
echo ${NAME:="Budi"}
# Output: Budi, NAME sekarang = "Budi"

echo $NAME
# Output: Budi
```

Berguna di script: kasih default kalau user gak set.

---

## Materi 3: `$PATH` — Variable paling penting

Saat kamu ketik `ls`, shell harus cari dimana binary `ls` itu. Dia cari di directory-directory yang ada di `$PATH`, dipisah `:`.

```bash
echo $PATH
# Output kira-kira:
# /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
```

Cek dimana binary command:

```bash
which ls
# /usr/bin/ls

which python3
# /usr/bin/python3

which code    # VS Code CLI
# /usr/share/code/bin/code
```

Kalau command gak ditemukan di PATH:

```bash
myscript
# bash: myscript: command not found
```

Solusinya: pakai path lengkap, atau tambah folder ke PATH, atau pakai `./` kalau di folder sekarang:

```bash
./myscript.sh       # jalankan script di folder sekarang
~/bin/myscript.sh   # pakai path lengkap
```

### Nambah directory ke PATH

Sementara (session ini saja):

```bash
export PATH="$PATH:/home/budi/bin"
# Tambah /home/budi/bin ke akhir PATH
```

Permanen — tambah ke `~/.bashrc`:

```bash
echo 'export PATH="$PATH:$HOME/bin"' >> ~/.bashrc
source ~/.bashrc
```

### Urutan PATH penting

Shell cari dari kiri ke kanan. Yang pertama ketemu, yang dipakai.

```bash
export PATH="/my/custom/bin:$PATH"
# /my/custom/bin di DEPAN — akan dipakai duluan
# Kalau di /my/custom/bin ada 'ls', itu yang dijalankan, BUKAN /usr/bin/ls

export PATH="$PATH:/my/custom/bin"
# /my/custom/bin di BELAKANG — /usr/bin/ls dipakai duluan
```

Cek path command:

```bash
which -a ls
# Output SEMUA ls yang ada di PATH, urut dari depan
# /usr/bin/ls
# /my/custom/bin/ls   (kalau ada)
```

---

## Materi 4: Alias — shortcut command

```bash
# Bikin alias
alias ll='ls -la'
alias la='ls -a'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias cls='clear'

# Liat semua alias
alias

# Hapus alias
unalias ll
```

### Alias di `.bashrc` (permanen)

Tambah ke `~/.bashrc`:

```bash
alias ll='ls -la'
alias gs='git status'
alias gd='git diff'
alias gp='git push'
alias docker-clean='docker system prune -af'
```

Setelah edit, reload:

```bash
source ~/.bashrc
# atau
. ~/.bashrc     # . = source (shortcut)
```

### Kapan alias vs function vs script

| Tool | Kapan pakai |
|------|-------------|
| **Alias** | Shortcut sederhana, gak butuh argument manipulation |
| **Function** | Butuh argumen `$1`, `$2`, logic |
| **Script** | Lebih kompleks, mau dipanggil dari mana saja (di PATH) |

Contoh function vs alias:

```bash
# Alias: gak bisa proses argumen
alias mkcd='mkdir -p $1 && cd $1'    # GAK JALAN — alias gak support $1

# Function: bisa
mkcd() {
  mkdir -p "$1" && cd "$1"
}
# Pakai: mkcd new-folder
```

---

## Materi 5: Shell function — lebih powerful dari alias

Definisi di `~/.bashrc`:

```bash
# Function simple
greet() {
  echo "Hello, $1!"
}
# Pakai: greet Budi → "Hello, Budi!"

# Function dengan default value
extract() {
  local file="$1"
  local dest="${2:-.}"    # default = current dir
  tar -xzf "$file" -C "$dest"
}

# Function dengan local variable
count_files() {
  local dir="$1"
  local count
  count=$(find "$dir" -type f | wc -l)
  echo "$count files in $dir"
}

# Function yang return value via stdout
get_ip() {
  curl -s ifconfig.me
}
# Pakai: MY_IP=$(get_ip)
```

### `local` variables

Selalu pakai `local` untuk variable di dalam function. Tanpa `local`, variable bocor ke shell luar:

```bash
bad_func() {
  count=5    # GLOBAL — bisa ganggu variable lain
}

good_func() {
  local count=5    # LOKAL — aman
}
```

---

## Materi 6: File-file config shell

Ini paling bikin bingung. Ada beberapa file, dibaca di waktu berbeda.

### Untuk Bash

| File | Kapan dibaca |
|------|--------------|
| `/etc/profile` | Login shell (system-wide) |
| `~/.bash_profile` | Login shell (user-specific, diutamakan) |
| `~/.bash_login` | Login shell (kalau `.bash_profile` gak ada) |
| `~/.profile` | Login shell (kalau dua di atas gak ada) |
| `~/.bashrc` | **Non-login interactive shell** (paling sering dipakai) |
| `~/.bash_logout` | Saat login shell exit |

### Login vs non-login shell

- **Login shell** = shell yang dimulai setelah login (SSH ke server, tty). Pakai `-l` atau `--login`.
- **Non-login shell** = shell baru yang gak lewat login (buka tab baru di terminal GUI, `bash` di dalam shell).

Cek:

```bash
echo $0
# -bash = login shell
# bash = non-login shell
```

### Konvensi yang berlaku

Di Ubuntu/Mac, `~/.profile` default nge-source `~/.bashrc`:

```bash
# ~/.profile default content (Ubuntu)
if [ -n "$BASH_VERSION" ]; then
    if [ -f "$HOME/.bashrc" ]; then
        . "$HOME/.bashrc"
    fi
fi
```

Artinya: taruh config di `~/.bashrc`, bakal kebaca baik di login maupun non-login shell.

**Aturan praktis:**
- Taruh alias, function, prompt setup di `~/.bashrc`
- Taruh PATH dan env var di `~/.profile` (atau `~/.bashrc` juga OK)
- JANGAN pecah config di banyak file kalau gak perlu

### Untuk Zsh (Mac default sejak Catalina)

File-nya beda:

| File | Kapan dibaca |
|------|--------------|
| `~/.zshenv` | Semua shell (always) |
| `~/.zprofile` | Login shell |
| `~/.zshrc` | Interactive shell (paling sering) |
| `~/.zlogin` | Login shell |
| `~/.zlogout` | Logout |

Taruh config utama di `~/.zshrc`.

---

## Materi 7: Kapan harus `source`?

Setelah kamu edit `~/.bashrc`, perubahan gak langsung efek di shell yang udah jalan. Shell udah load config saat start.

Reload manual:

```bash
source ~/.bashrc
# atau
. ~/.bashrc
```

Shell baru (tab baru / window baru) akan otomatis baca config terbaru.

### Beda `source` vs eksekusi langsung

```bash
# source: config di-load di shell sekarang
source myscript.sh

# Eksekusi langsung: jalanin di subshell (child)
./myscript.sh
bash myscript.sh
```

Kalau `myscript.sh` isi `export FOO="bar"`:
- `source` → `FOO` di-set di shell sekarang
- `./myscript.sh` → `FOO` di-set di child shell, hilang saat child exit. Shell sekarang gak dapat apa-apa.

**Penting:** kalau kamu mau script ngubah environment shell pemanggil, HARUS pakai `source`.

---

## Materi 8: Customize prompt — `$PS1`

Prompt kamu dikontrol oleh `$PS1`. Default Ubuntu:

```bash
echo $PS1
# \[\e]0;\u@\h: \w\a\]${debian_chroot:+($debian_chroot)}\u@\h:\w\$
```

Variable special di PS1:

| Code | Output |
|------|--------|
| `\u` | Username |
| `\h` | Hostname (pendek) |
| `\H` | Hostname (panjang) |
| `\w` | Current dir (full path, home disingkat `~`) |
| `\W` | Current dir (basename saja) |
| `\d` | Date |
| `\t` | Time 24-hour |
| `\$` | `#` kalau root, `$` kalau user biasa |

Contoh custom prompt:

```bash
# Sederhana: cukup path
PS1='\w \$ '

# Dengan user dan host
PS1='\u@\h \w \$ '

# Berwarna (more complex)
PS1='\[\e[32m\]\u@\h\[\e[0m\]:\[\e[34m\]\w\[\e[0m\]\$ '
# Hijau untuk user@host, biru untuk path
```

`\[\e[XXm\]` = escape sequence untuk warna. `\e[0m` = reset. Kode warna:

- 30 = hitam, 31 = merah, 32 = hijau, 33 = kuning
- 34 = biru, 35 = magenta, 36 = cyan, 37 = putih

Taruh di `~/.bashrc`:

```bash
export PS1='\[\e[32m\]\u@\h\[\e[0m\]:\[\e[34m\]\w\[\e[0m\]\$ '
```

> **Tip:** pakai tools kayak [bashrc-generator](http://bashrcgenerator.com/) atau starship untuk customize prompt tanpa pusing.

---

## Materi 9: Framework modern — `starship`, `oh-my-zsh`

Kalau mau prompt yang keren tanpa coding manual:

### Starship (cross-shell, recommended)

```bash
curl -sS https://starship.rs/install.sh | sh
```

Tambah ke `~/.bashrc` (atau `~/.zshrc`):

```bash
eval "$(starship init bash)"
# atau untuk zsh:
eval "$(starship init zsh)"
```

Kelebihan: tampilkan git branch, language version (Python, Node, dll), exit code error, semua otomatis.

### Oh My Zsh (untuk zsh saja)

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Bawa banyak plugin (git, docker, npm, dll) dan tema prompt.

---

## Common pitfalls

### 1. Lupa `source` setelah edit `.bashrc`

```bash
# Edit ~/.bashrc, tambah alias
nano ~/.bashrc
# Tambah: alias foo='echo bar'

foo
# bash: foo: command not found

source ~/.bashrc
foo
# bar
```

### 2. Spasi di sekitar `=`

```bash
MY_VAR = "value"
# bash: MY_VAR: command not found

MY_VAR="value"     # BENAR
```

Shell ngartiin spasi sebagai pemisah command. `MY_VAR` dianggap command.

### 3. Quote variable yang mungkin ada spasi

```bash
FILE="my notes.txt"
cat $FILE          # cat: my: No such file; cat: notes.txt: No such file
cat "$FILE"        # BENAR
```

Selalu quote `"$VAR"` kalau mungkin ada spasi. Kebiasaan ini menyelamatkan banyak bug.

### 4. PATH terkontaminasi

```bash
# Setiap buka terminal, PATH nambah duplikat
PATH="$PATH:/my/bin"   # di .bashrc
# Setelah buka 5 subshell: /my/bin muncul 5 kali di PATH
```

Cek:

```bash
echo $PATH | tr ':' '\n' | sort | uniq -d   # liat duplikat
```

Fix: pakai pengecekan sebelum tambah:

```bash
# ~/.bashrc
case ":$PATH:" in
    *":$HOME/bin:"*) ;;           # udah ada, skip
    *) PATH="$HOME/bin:$PATH" ;;  # belum ada, tambah
esac
```

### 5. `.bashrc` di-edit tapi gak efek di SSH

Beberapa kasus: SSH login shell, baca `.bash_profile` / `.profile`, BUKAN `.bashrc`. Pastikan `.profile` nge-source `.bashrc`:

```bash
# Cek isi .profile
grep bashrc ~/.profile
# Harusnya ada: . "$HOME/.bashrc"
```

### 6. Variable di single vs double quote

```bash
NAME="Budi"
echo "Hello $NAME"     # Hello Budi (double = expand)
echo 'Hello $NAME'     # Hello $NAME (single = literal)
```

Single quote = literal, tidak expand variable atau command substitution.

### 7. Lupa export di script yang dipanggil dari shell

```bash
# myscript.sh
DATABASE_URL="postgres://localhost/mydb"
# GAK di-export — child process gak dapat

psql $DATABASE_URL     # ini DAPAT (masih di shell yang sama)

# Tapi kalau myscript.sh dipanggil dari shell lain:
./myscript.sh
# myscript.sh jalan di subshell. Setelah exit, DATABASE_URL hilang.
```

Fix: `export DATABASE_URL=...` kalau variable butuh di child process.

### 8. Function gak tersimpan setelah restart

Kalau kamu definisikan function di shell langsung (bukan di `.bashrc`), function hilang saat shell exit. Selalu taruh function penting di `~/.bashrc` atau file terpisah yang di-source.

---

## Side project: "Customize shell kamu sendiri"

### Brief

Kamu bakal bikin shell kamu jadi lebih produktif. Lakukan misi berikut:

1. Backup config shell kamu sekarang:
   ```bash
   cp ~/.bashrc ~/.bashrc.backup-$(date +%Y%m%d)
   # atau zsh:
   cp ~/.zshrc ~/.zshrc.backup-$(date +%Y%m%d)
   ```

2. Tambahkan alias-alias berguna ini ke `~/.bashrc` (atau `~/.zshrc`):
   - `ll` = `ls -lah`
   - `la` = `ls -A`
   - `..` = `cd ..`
   - `...` = `cd ../..`
   - `gs` = `git status`
   - `gd` = `git diff`
   - `grep` = `grep --color=auto`
   - `ports` = `netstat -tulanp` (atau `ss -tulanp`)
   - `myip` = `curl -s ifconfig.me`

3. Bikin folder `~/bin` (kalau belum ada) dan tambah ke PATH:
   ```bash
   mkdir -p ~/bin
   # Tambah ke ~/.bashrc:
   # export PATH="$HOME/bin:$PATH"
   ```

4. Bikin function-function berguna di `~/.bashrc`:
   - `mkcd <dir>` = mkdir + cd
   - `extract <file>` = ekstrak archive (tar.gz, zip, dll) — auto-detect
   - `up <n>` = naik n directory (`up 3` = `cd ../../..`)
   - `psgrep <name>` = `ps aux | grep <name>`
   - `countdown <seconds>` = hitung mundur

5. Customize prompt:
   - Bikin prompt yang tampilkan: user, host, current dir (warna biru), git branch kalau di repo (warna kuning)
   - Atau install `starship` dan pakai default-nya

6. Bikin script `~/bin/hello` yang tampilkan greeting + info sistem:
   - "Hello, $USER!"
   - "You're on $HOSTNAME running $SHELL"
   - "Today is $(date)"
   - "Disk usage:" + `df -h /`
   - "Memory:" + `free -h`
   - Kasih permission eksekusi (`chmod +x`)
   - Pastikan `hello` bisa dipanggil dari folder manapun (karena `~/bin` di PATH)

7. Setup `EDITOR` environment variable:
   - `export EDITOR=nano` (atau `vim` kalau udah belajar Sesi 10)
   - Beberapa program (seperti `git commit` tanpa `-m`) bakal pakai ini

8. Bikin file `~/.env-personal` yang berisi variable pribadi (misal API key dummy), lalu source dari `.bashrc`:
   ```bash
   # Di ~/.bashrc:
   [ -f ~/.env-personal ] && source ~/.env-personal
   ```

9. Restart terminal (tutup dan buka lagi). Verifikasi:
   - Semua alias jalan
   - `~/bin/hello` bisa dipanggil dari folder manapun
   - Function bisa dipakai
   - Prompt sudah sesuai
   - Variable dari `~/.env-personal` ter-set

10. Bikin satu skenario debug simulasi: hapus sementara baris `source ~/.bashrc` dari `~/.profile` (kalau ada). Buka terminal login baru dengan `bash -l` (atau buka tab terminal baru yang dimulai sebagai login shell). Apakah alias masih jalan? Kenapa?

<details>
<summary>Solusi (klik expand)</summary>

```bash
# 1. Backup
cp ~/.bashrc ~/.bashrc.backup-$(date +%Y%m%d)

# 2. Edit ~/.bashrc, tambah:
cat >> ~/.bashrc << 'EOF'

# === Custom aliases ===
alias ll='ls -lah'
alias la='ls -A'
alias ..='cd ..'
alias ...='cd ../..'
alias gs='git status'
alias gd='git diff'
alias grep='grep --color=auto'
alias ports='ss -tulanp 2>/dev/null || netstat -tulanp'
alias myip='curl -s ifconfig.me'

# === Custom functions ===
mkcd() {
  mkdir -p "$1" && cd "$1"
}

extract() {
  if [ -z "$1" ]; then
    echo "Usage: extract <file>"
    return 1
  fi
  if [ ! -f "$1" ]; then
    echo "File not found: $1"
    return 1
  fi
  case "$1" in
    *.tar.gz|*.tgz) tar -xzf "$1" ;;
    *.tar.bz2|*.tbz) tar -xjf "$1" ;;
    *.tar.xz|*.txz) tar -xJf "$1" ;;
    *.tar) tar -xf "$1" ;;
    *.zip) unzip "$1" ;;
    *.rar) unrar x "$1" ;;
    *.7z) 7z x "$1" ;;
    *) echo "Unknown format: $1"; return 1 ;;
  esac
}

up() {
  local times="${1:-1}"
  while [ "$times" -gt 0 ]; do
    cd ..
    times=$((times - 1))
  done
}

psgrep() {
  ps aux | grep -v grep | grep -i "$1"
}

countdown() {
  local seconds="${1:-10}"
  while [ "$seconds" -gt 0 ]; do
    echo -ne "Time remaining: $seconds\r"
    sleep 1
    seconds=$((seconds - 1))
  done
  echo -e "\nDone!"
}

# === PATH ===
export PATH="$HOME/bin:$PATH"

# === Editor ===
export EDITOR=nano

# === Personal env ===
[ -f ~/.env-personal ] && source ~/.env-personal

# === Prompt (basic colored) ===
PS1='\[\e[32m\]\u@\h\[\e[0m\]:\[\e[34m\]\w\[\e[0m\]\$ '
EOF

# 3. Bikin folder bin
mkdir -p ~/bin

# 6. Bikin hello script
cat > ~/bin/hello << 'EOF'
#!/bin/bash
echo "Hello, $USER!"
echo "You're on $HOSTNAME running $SHELL"
echo "Today is $(date)"
echo ""
echo "Disk usage:"
df -h / | tail -n +1
echo ""
echo "Memory:"
free -h 2>/dev/null || vm_stat
EOF
chmod +x ~/bin/hello

# 8. Bikin env-personal
cat > ~/.env-personal << 'EOF'
# Personal env vars — gak di-commit ke repo
export MY_API_KEY="dummy-key-12345"
export PROJECTS_DIR="$HOME/projects"
EOF
chmod 600 ~/.env-personal   # private

# 9. Reload dan test
source ~/.bashrc
hello
mkcd test-folder && pwd && cd .. && rmdir test-folder
myip

# 10. Debug skenario
# Edit ~/.profile, comment baris yang source ~/.bashrc
# Buka terminal login:
bash -l -c 'll'    # harusnya command not found (alias gak kebaca)
# Kenapa: login shell baca .profile/.bash_profile, BUKAN .bashrc
# Fix: pastikan .profile source .bashrc, atau taruh config di .bash_profile
```

</details>

---

## Tantangan ekstra (opsional)

- Install `starship` dan pakai. Bandingkan dengan prompt custom kamu.
- Install `fzf` (fuzzy finder). Tambah ke `.bashrc`:
  ```bash
  eval "$(fzf --bash)"
  ```
  Coba `Ctrl+R` untuk fuzzy history search, `Ctrl+T` untuk fuzzy file search.
- Setup `direnv` — auto-load `.envrc` per directory. Berguna untuk project-specific environment.
- Bikin `.bashrc.d/` folder, split config jadi multiple file (alias.bash, functions.bash, path.bash), lalu loop source semua di `.bashrc`. Lebih maintainable.
- Pelajari `set -o vi` di `.bashrc` — vi mode untuk shell line editing.

---

## Tanda kelar

- [ ] Saya paham beda shell variable (tanpa `export`) dan environment variable (dengan `export`)
- [ ] Saya bisa set, read, dan unset env var
- [ ] Saya paham `$PATH` dan cara nambah directory ke PATH (permanen dan sementara)
- [ ] Saya tahu urutan PATH penting (left = prioritas tinggi)
- [ ] Saya bisa bikin alias dan function di `~/.bashrc`
- [ ] Saya tahu kapan harus `source ~/.bashrc`
- [ ] Saya paham beda login shell vs non-login shell, dan file config yang dibaca masing-masing
- [ ] Saya bisa customize `$PS1` biar prompt tampilkan info yang berguna
- [ ] Saya tahu beda single quote (literal) vs double quote (expand) untuk variable
- [ ] Saya punya setup `~/bin` di PATH dan bisa bikin script sendiri yang dipanggil dari mana saja
- [ ] Saya pernah selesaikan side project lengkap

Kalau ada yang belum centang, ulang dulu. Sesi 10 asumsi kamu udah lancar ini.

---

**Next:** `10-text-editor.md` — `nano` dan dasar `vim`. Kamu bakal bisa edit file langsung dari terminal tanpa buka VS Code. Wajib hukumnya buat kerja di server yang gak punya GUI.
