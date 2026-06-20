import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '../generated/client'
import {
  BLOG_POSTS,
  EMAIL,
  PROJECTS,
  SOCIAL_LINKS,
  WORK_EXPERIENCE,
} from '../app/data'
import { LINUX_CLI_CLASS, SESI_1_LINUX_CLI } from '../lib/class-seed-data'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@kristiansnts.dev'
  const adminUsername = process.env.ADMIN_USERNAME ?? 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123'
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      username: adminUsername,
      passwordHash,
      name: 'Admin',
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      username: adminUsername,
      passwordHash,
      name: 'Admin',
      role: 'ADMIN',
    },
  })

  await prisma.siteSetting.upsert({
    where: { key: 'email' },
    update: { value: EMAIL },
    create: { key: 'email', value: EMAIL },
  })

  for (const [index, project] of PROJECTS.entries()) {
    await prisma.project.upsert({
      where: { slug: project.id },
      update: {
        name: project.name,
        description: project.description,
        descriptionEn: project.descriptionEn,
        link: project.link,
        photos: project.photos,
        client: project.client,
        totalUsers: project.totalUsers,
        sortOrder: index,
        published: true,
      },
      create: {
        slug: project.id,
        name: project.name,
        description: project.description,
        descriptionEn: project.descriptionEn,
        link: project.link,
        photos: project.photos,
        client: project.client,
        totalUsers: project.totalUsers,
        sortOrder: index,
        published: true,
      },
    })
  }

  for (const [index, experience] of WORK_EXPERIENCE.entries()) {
    await prisma.workExperience.upsert({
      where: { id: experience.id },
      update: {
        company: experience.company,
        title: experience.title,
        start: experience.start,
        end: experience.end,
        link: experience.link,
        sortOrder: index,
      },
      create: {
        id: experience.id,
        company: experience.company,
        title: experience.title,
        start: experience.start,
        end: experience.end,
        link: experience.link,
        sortOrder: index,
      },
    })
  }

  for (const [index, socialLink] of SOCIAL_LINKS.entries()) {
    await prisma.socialLink.upsert({
      where: { id: `${socialLink.label.toLowerCase()}-link` },
      update: {
        label: socialLink.label,
        link: socialLink.link,
        sortOrder: index,
      },
      create: {
        id: `${socialLink.label.toLowerCase()}-link`,
        label: socialLink.label,
        link: socialLink.link,
        sortOrder: index,
      },
    })
  }

  for (const post of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.uid },
      update: {
        title: post.title,
        description: post.description,
        published: true,
        publishedAt: new Date(),
      },
      create: {
        slug: post.uid,
        title: post.title,
        description: post.description,
        published: true,
        publishedAt: new Date(),
      },
    })
  }

  const linuxCliClass = await prisma.class.upsert({
    where: { slug: LINUX_CLI_CLASS.slug },
    update: {
      name: LINUX_CLI_CLASS.name,
      description: LINUX_CLI_CLASS.description,
      published: true,
      sortOrder: 0,
    },
    create: {
      slug: LINUX_CLI_CLASS.slug,
      name: LINUX_CLI_CLASS.name,
      description: LINUX_CLI_CLASS.description,
      published: true,
      sortOrder: 0,
    },
  })

  await prisma.classSession.upsert({
    where: {
      classId_slug: {
        classId: linuxCliClass.id,
        slug: SESI_1_LINUX_CLI.slug,
      },
    },
    update: {
      title: SESI_1_LINUX_CLI.title,
      description: SESI_1_LINUX_CLI.description,
      content: SESI_1_LINUX_CLI.content,
      wiki: SESI_1_LINUX_CLI.wiki,
      published: true,
      sortOrder: 0,
    },
    create: {
      classId: linuxCliClass.id,
      slug: SESI_1_LINUX_CLI.slug,
      title: SESI_1_LINUX_CLI.title,
      description: SESI_1_LINUX_CLI.description,
      content: SESI_1_LINUX_CLI.content,
      wiki: SESI_1_LINUX_CLI.wiki,
      published: true,
      sortOrder: 0,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
