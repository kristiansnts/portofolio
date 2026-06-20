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

export async function getPublishedClassSession(
  classSlug: string,
  sessionSlug: string,
) {
  return prisma.classSession.findFirst({
    where: {
      slug: sessionSlug,
      published: true,
      class: {
        slug: classSlug,
        published: true,
      },
    },
    include: {
      class: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  })
}

export async function getPublishedClassWithSessions(classSlug: string) {
  return prisma.class.findFirst({
    where: {
      slug: classSlug,
      published: true,
    },
    include: {
      sessions: {
        where: { published: true },
        orderBy: { sortOrder: 'asc' },
        select: {
          slug: true,
          title: true,
        },
      },
    },
  })
}
