type Project = {
  name: string
  description: string
  link: string
  video: string
  id: string
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
    name: 'Pusdinss',
    description:
      'Kumpulan Informasi dan bantuan kepada Siswa dan Calon Siswa Bimbel Science Society Ngawi',
    link: 'https://pusdinss.my.id',
    video:
      'https://res.cloudinary.com/dwzxxfghs/video/upload/Screen_Recording_2025-04-01_at_20.00.03_rajsf8.mp4?_s=vp-2.1.0',
    id: 'project1',
  },
  {
    name: 'Admin LUP',
    description: 'Sistem Admin untuk manajemen Keuangan dan Surat Menyurat LevelUP Ngawi',
    link: 'https://adminlup.pusdinss.my.id',
    video:
      'https://res.cloudinary.com/dwzxxfghs/video/upload/Screen_Recording_2025-04-01_at_20.02.11_ewotvm.mp4?_s=vp-2.1.0',
    id: 'project2',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Yourpay',
    title: 'Software Engineer Intern',
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
]

export const EMAIL = 'epafroditus.kristian@gmail.com'
