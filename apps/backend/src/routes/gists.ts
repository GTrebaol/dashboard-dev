import type { FastifyPluginAsync } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const createSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  content: z.string().min(1),
  language: z.string().optional(),
  tags: z.array(z.string().min(1).max(50)).optional(),
})

export const gistsRoutes = (prisma: PrismaClient): FastifyPluginAsync => async (app) => {
  app.get('/', async (request) => {
    const { tags, author, search } = request.query as Record<string, string | string[]>
    const tagList = tags ? (Array.isArray(tags) ? tags : [tags]) : undefined

    const rows = await prisma.gist.findMany({
      where: {
        ...(author && { author: { username: String(author) } }),
        ...(search && { title: { contains: String(search), mode: 'insensitive' } }),
        ...(tagList && { tags: { some: { name: { in: tagList } } } }),
      },
      include: {
        author: { select: { id: true, username: true, email: true } },
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return rows.map((g) => ({ ...g, tags: g.tags.map((t) => t.name) }))
  })

  app.get('/:shareToken', async (request, reply) => {
    const { shareToken } = request.params as { shareToken: string }
    const gist = await prisma.gist.findUnique({
      where: { shareToken },
      include: {
        author: { select: { id: true, username: true, email: true } },
        tags: true,
      },
    })
    if (!gist) return reply.status(404).send({ error: 'Not found' })
    return { ...gist, tags: gist.tags.map((t) => t.name) }
  })

  app.post('/', async (request, reply) => {
    const body = createSchema.parse(request.body)
    const { sub, username, email } = request.user

    await prisma.user.upsert({
      where: { id: sub },
      update: {},
      create: { id: sub, username, email },
    })

    const gist = await prisma.gist.create({
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        language: body.language,
        authorId: sub,
        tags: { create: body.tags?.map((name) => ({ name })) ?? [] },
      },
      include: {
        author: { select: { id: true, username: true, email: true } },
        tags: true,
      },
    })

    return reply.status(201).send({ ...gist, tags: gist.tags.map((t) => t.name) })
  })

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const gist = await prisma.gist.findUnique({ where: { id } })
    if (!gist) return reply.status(404).send({ error: 'Not found' })
    if (gist.authorId !== request.user.sub) return reply.status(403).send({ error: 'Forbidden' })
    await prisma.gist.delete({ where: { id } })
    return reply.status(204).send()
  })
}
