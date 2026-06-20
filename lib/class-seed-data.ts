export const LINUX_CLI_CLASS = {
  slug: 'linux-cli',
  name: 'Linux CLI',
  description:
    'Modul 6 minggu untuk membangun fondasi Linux CLI dari orientasi hingga shell scripting dasar.',
}

export const SESI_1_LINUX_CLI = {
  slug: 'sesi-1',
  title: 'Sesi 1: Orientasi & Setup — Kenapa Linux Itu Wajib (3-4 Hari)',
  description:
    'Modul ini bakal jalan 6 minggu, dibagi jadi 6 sesi. Sebelum masuk ke command, ada baiknya kalian tau dulu mau ke mana arah modul ini, biar tiap materi yang dipelajari kelihatan nyambungnya, bukan sekadar list command yang harus dihafal.',
  content: `Garis besarnya kayak ini: sesi 1 ini buat orientasi dan setup environment, sesi 2 masuk ke filesystem dan navigasi dasar, sesi 3 soal manipulasi dan baca file, sesi 4 bahas pencarian, permission, dan process, sesi 5 masuk ke piping, environment variable, dan text editor, dan sesi 6 ditutup dengan shell scripting dasar plus mini project.

**Kenapa modul ini paling kritis dari semua modul**

Ini bukan modul "nice to have", ini hard blocker buat semester-semester berikutnya. Semester 3 nanti bahas VPS dan networking, dan itu gak akan bisa jalan tanpa kalian ngerti SSH dan cara baca log lewat terminal. Semester 4 bahas Docker, dan basis dari Docker itu sendiri ya Linux. Semester 5 bahas shell scripting yang lebih lanjut dan cron job, yang itu langsung turunan dari apa yang kalian pelajari di sesi 6 modul ini. Kalau fondasi di modul ini lemah, semua yang dibangun di atasnya bakal ikut goyang. Makanya porsi waktunya sengaja dibuat paling besar dibanding modul lain.

Satu catatan soal istilah biar gak bingung: konsep-konsep kayak piping, scripting, atau environment variable itu sebenarnya konsep umum yang ada di hampir semua sistem operasi, gak eksklusif punya Linux. Tapi kita praktikinnya tetap di Linux environment, karena itu yang bakal kalian temuin di server produksi nanti. Jadi kalaupun konsepnya transferable, kebiasaan tangan dan environment-nya tetap perlu dilatih di Linux dari awal.

**Kenapa ini penting banget**

Sebelum lanjut, kita samain dulu pemahaman soal "server" ya, biar gak bingung pas baca terusannya. Jadi gini, laptop atau HP yang kalian pakai sekarang itu komputer yang dipegang sendiri, dipakai sendiri, dan kalau dimatikan ya udah, gak ada yang akses lagi. Server itu beda. Server adalah komputer juga, cuma fungsinya khusus buat "melayani" permintaan dari banyak orang sekaligus, dan dia harus nyala terus 24 jam non-stop.

Contoh paling kebayang: pas kalian buka Instagram, foto-foto yang muncul itu sebenarnya disimpan di komputer lain yang lokasinya jauh banget, mungkin di luar negeri. Komputer itulah yang disebut server. Tugasnya nerima permintaan dari HP kalian ("tolong kirimin foto si A"), terus dia ngirim balik datanya. Server ini gak punya monitor atau keyboard yang nempel kayak laptop biasa, dia cuma nyala di sebuah ruangan khusus (data center), dan satu-satunya cara buat "masuk" dan ngatur dia adalah lewat terminal, dari jarak jauh. Istilah kerennya remote.

Nah, VPS (Virtual Private Server) itu salah satu cara buat nyewa "potongan kecil" dari server gede tadi, jadi kayak nyewa kamar di sebuah gedung, bukan beli gedungnya sekaligus. Ini yang biasanya dipakai mahasiswa atau pemula buat latihan, karena murah dan gampang diakses.

Sekarang baliknya ke poin awal: hampir semua server dan VPS itu jalan pakai sistem operasi Linux, bukan Windows. Begitu kalian kerja nanti dan harus "masuk" ke server buat ngecek atau betulin sesuatu, gak akan ada GUI yang nungguin buat diklik-klik kayak di laptop sendiri. Yang ada cuma terminal kosong, dan kalau kalian cuma bisa modal klik kanan-klik kiri di file explorer, gap-nya bakal kelihatan banget di depan tim.

Belum lagi soal speed. Begitu udah terbiasa, CLI itu jauh lebih cepat dibanding GUI. Yang orang lain butuh 5 kali klik buat nyari file, hapus file, atau cek isi log, kita cukup ketik satu baris command aja udah kelar. Ini bukan soal gaya-gayaan biar kelihatan jago, tapi soal efisiensi kerja yang nyata.

**Cara buka terminalnya sesuai OS kalian**

Sebelum praktik command apapun, kalian perlu tau dulu cara masuk ke terminal di laptop masing-masing, karena caranya beda-beda tergantung sistem operasi yang dipakai.

Kalau pakai Windows, ada dua opsi bawaan: Command Prompt atau Windows PowerShell. Tapi penting buat tau, dua-duanya itu bukan Linux. Command Prompt dan PowerShell punya sintaks sendiri yang beda dari Linux, misalnya buat nge-list isi folder. Jadi kalau cuma pakai cmd atau PowerShell biasa, command-command yang kita pelajari di sesi-sesi ini gak akan jalan persis sama. Solusinya, install WSL (Windows Subsystem for Linux), yaitu fitur bawaan Windows yang bikin kita bisa jalanin Linux asli di dalam Windows, lengkap sama semua command Linux standar.

Tips buka terminal bawaan Windows:

\`\`\`
Start Menu → search "cmd"
Start Menu → search "PowerShell"
\`\`\`

Tips beda sintaks list folder:

\`\`\`
# Linux
ls

# Windows CMD
dir

# Windows PowerShell
Get-ChildItem
\`\`\`

Cara install WSL gampang banget, gak perlu download installer dari mana-mana:

Pertama, buka Command Prompt atau PowerShell sebagai administrator (klik kanan ikonnya → "Run as administrator"), karena proses install butuh akses level sistem.

Kedua, ketik:

\`\`\`
wsl --install
\`\`\`

Command ini bakal otomatis download dan install semua komponen yang dibutuhkan, termasuk distro Linux default-nya, yaitu Ubuntu. Prosesnya butuh koneksi internet dan biasanya makan waktu beberapa menit, tergantung kecepatan internet.

Ketiga, setelah proses install selesai, restart komputer kalian. Ini wajib, karena WSL butuh fitur virtualisasi yang baru aktif penuh setelah restart.

Keempat, setelah komputer nyala lagi, Ubuntu (atau distro yang terinstall) bakal otomatis kebuka dan minta kalian bikin username dan password buat akun Linux-nya. Ini akun yang khusus dipakai di dalam environment Linux, beda dari akun Windows kalian, jadi bebas mau diisi apa aja, asal diingat.

Kelima, setelah itu, kalian udah punya terminal Linux asli di dalam Windows. Ke depannya, tinggal buka terminalnya lewat Start Menu, gak perlu install ulang lagi.

Tips buka terminal Linux di Windows setelah WSL terinstall:

\`\`\`
Start Menu → search "Ubuntu"
\`\`\`

Kalau pas ngetik \`wsl --install\` muncul pesan error, biasanya itu tandanya fitur virtualisasi belum aktif di BIOS, atau Windows-nya versi lama yang belum support cara install satu baris ini. Kalau ketemu kasus kayak gitu, paling gampang searching pesan error-nya langsung di Google, biasanya solusinya udah banyak dibahas.

Kalau pakai Mac, tinggal buka aplikasi Terminal. macOS itu dibangun di atas sistem Unix, yang satu keluarga sama Linux, jadi hampir semua command dasar yang kita pelajari bisa langsung jalan tanpa install apa-apa lagi, meskipun ada beberapa command yang versinya sedikit beda (perbedaan kecil antara BSD dan GNU, tapi gak akan kerasa signifikan di level pemula).

Tips buka Terminal di Mac:

\`\`\`
Cmd+Space → ketik "Terminal" → Enter
\`\`\`

Atau lewat Finder:

\`\`\`
Applications → Utilities → Terminal
\`\`\`

Kalau pakai Linux (Ubuntu, Fedora, atau distro lainnya), tinggal cari aplikasi Terminal dari menu aplikasi atau taskbar, karena memang udah native jalan di sistemnya sendiri. Gak perlu setup tambahan sama sekali.

Tips buka Terminal di Linux:

\`\`\`
Menu aplikasi → search "Terminal"
\`\`\`

**Tanda kalau sesi ini udah berhasil**

Kalian udah punya terminal Linux yang bisa diakses kapan aja (lewat WSL, Terminal Mac, atau Terminal Linux native), dan ngerti gambaran besar kenapa 6 minggu ke depan worth banget buat diseriusin. Belum perlu jago command apapun di sesi ini, yang penting environment-nya udah siap dipakai buat sesi-sesi berikutnya.`,
  wiki: `**Istilah Penting**

**CLI** — Command Line Interface, cara berinteraksi dengan komputer lewat teks, bukan klik GUI.

**Server** — Komputer yang nyala 24/7 dan melayani permintaan dari banyak user sekaligus.

**VPS** — Virtual Private Server, potongan server virtual yang bisa disewa buat latihan atau deploy aplikasi.

**WSL** — Windows Subsystem for Linux, fitur Windows buat jalanin Linux asli tanpa dual boot.

**Terminal** — Aplikasi buat ngetik command ke shell sistem operasi.

**Remote** — Akses ke komputer/server dari jarak jauh, biasanya lewat SSH dan terminal.`,
}
