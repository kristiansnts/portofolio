type Project = {
  name: string
  description: string
  descriptionEn: string
  link: string
  photos: string[]
  id: string
  client: string
  totalUsers: string
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
}

export const PROJECTS: Project[] = [
  {
    name: 'Arunatrans',
    description:
      'Aruna Trans Jogja hadir setiap hari dengan penjemputan dari hotel atau alamat Anda di Yogyakarta, Magelang, Surakarta, maupun Dieng. Satu orang pun sudah bisa langsung bergabung — tanpa perlu mengumpulkan rombongan.',
    descriptionEn:
      'Aruna Trans Jogja operates daily with pick-up from your hotel or address in Yogyakarta, Magelang, Surakarta, or Dieng. Even a single person can join directly — no need to gather a group.',
    link: 'https://arunatransjogja.com',
    photos: ['/ArunaTrans/landingpage.png'],
    id: 'project1',
    client: 'Owner Aruna Trans Jogja',
    totalUsers: '100+ users per day',
  },
  {
    name: 'MSSystem',
    description: 'Sistem Manajemen Stok FNB untuk memudahkan pengelolaan stok, penjualan, pemasukan, laporan dan analitik.',
    descriptionEn: 'An FnB Stock Management System to simplify stock management, sales, income, reports, and analytics.',
    link: '#',
    photos: [
      '/MSSystem/dashboard.png',
      '/MSSystem/stok.png',
      '/MSSystem/pemasukan.png',
      '/MSSystem/pengeluaran.png',
      '/MSSystem/pemasukan-cabang.png',
      '/MSSystem/cabang.png',
    ],
    id: 'project2',
    client: 'Owner MSSystem',
    totalUsers: 'Private Use',
  },
  {
    name: 'Sistem Manajemen Persuratan Perusahaan',
    description: 'Sistem Manajemen Persuratan Perusahaan untuk memudahkan pengelolaan surat masuk, surat keluar, dan arsip.',
    descriptionEn: 'A Company Correspondence Management System to simplify the management of incoming and outgoing letters, and archives.',
    link: '#',
    photos: [],
    id: 'project3',
    client: 'Administration Director of Science Society',
    totalUsers: 'Private Use',
  },
  {
    name: 'Sistem Database - PPHTGD',
    description: 'Sistem Database Persekutuan & Pelayanan Hamba Tuhan Garis Depan (PPHTGD) untuk memudahkan pengelolaan pengguna, hak akses, dan aktivitas.',
    descriptionEn: 'A Database System of Persekutuan & Pelayanan Hamba Tuhan Garis Depan (PPHTGD) to simplify the management of users, access rights, and activities.',
    link: '#',
    photos: [],
    id: 'project4',
    client: 'PPHTGD',
    totalUsers: '4000+ users',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Yourpay',
    title: 'Software Engineer',
    start: 'Jan 2025',
    end: 'Present',
    link: 'https://yourpay.co',
    id: 'work1',
  },
  {
    company: 'Science Society',
    title: 'Branch Manager',
    start: 'Sep 2023',
    end: 'Present',
    link: 'https://bimbelstanss.com/',
    id: 'work2',
  },
  {
    company: 'Freelance',
    title: 'Software Engineer',
    start: 'March 2023',
    end: 'Present',
    link: 'https://kristiansnts.dev',
    id: 'work3',
  },
]

export const BLOG_POSTS: BlogPost[] = [
  // {
  //   title: 'Exploring the Intersection of Design, AI, and Design Engineering',
  //   description: 'How AI is changing the way we design',
  //   link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
  //   uid: 'blog-1',
  // },
  // {
  //   title: 'Why I left my job to start my own company',
  //   description:
  //     'A deep dive into my decision to leave my job and start my own company',
  //   link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
  //   uid: 'blog-2',
  // },
  // {
  //   title: 'What I learned from my first year of freelancing',
  //   description:
  //     'A look back at my first year of freelancing and what I learned',
  //   link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
  //   uid: 'blog-3',
  // },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/kristiansnts',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/kristian-santoso',
  },
  {
    label: 'Instagram',
    link: 'https://www.instagram.com/kristiansnts',
  },
  {
    label: 'Whatsapp',
    link: 'https://wa.me/+6281196960658',
  },
]

export const EMAIL = 'epafroditus.kristian@gmail.com'
