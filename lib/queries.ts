import { prisma } from '@/lib/db'

export async function getPublishedProjects() {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getWorkExperience() {
  return prisma.workExperience.findMany({
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getPublishedBlogPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  })
}

export async function getSocialLinks() {
  return prisma.socialLink.findMany({
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getSiteSetting(key: string) {
  return prisma.siteSetting.findUnique({
    where: { key },
  })
}
