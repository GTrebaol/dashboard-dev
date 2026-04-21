import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import {
  mockJiraIssues,
  mockMergeRequests,
  mockSonarAnalyses,
  mockMeps,
} from './fixtures'
import { inMemoryGists } from './inMemoryGists'

const createGistSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  content: z.string().min(1),
  language: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const mockRoutes: FastifyPluginAsync = async (app) => {
  // --- JIRA ---
  app.get('/jira/issues', async () => mockJiraIssues)

  // --- GitLab ---
  app.get('/gitlab/merge-requests', async () => mockMergeRequests)

  // --- SonarQube ---
  app.get('/sonar/project/:projectKey', async (request, reply) => {
    const { projectKey } = request.params as { projectKey: string }
    const analysis = mockSonarAnalyses[projectKey]
    if (!analysis) {
      // Retourne une analyse générique si le projet n'est pas connu
      return {
        projectKey,
        projectName: projectKey,
        qualityGate: 'OK',
        metrics: { bugs: 0, vulnerabilities: 0, codeSmells: 0 },
        analyzedAt: new Date().toISOString(),
      }
    }
    return analysis
  })

  // --- SnowIT ---
  app.get('/snow/meps', async () => mockMeps)

  // --- Gists ---
  app.get('/gists', async (request) => {
    const { tags, author, search } = request.query as Record<string, string | string[]>
    const tagList = tags ? (Array.isArray(tags) ? tags : [tags]) : undefined
    return inMemoryGists.findAll({
      tags: tagList,
      author: author ? String(author) : undefined,
      search: search ? String(search) : undefined,
    })
  })

  app.get('/gists/:shareToken', async (request, reply) => {
    const { shareToken } = request.params as { shareToken: string }
    const gist = inMemoryGists.findByShareToken(shareToken)
    if (!gist) return reply.status(404).send({ error: 'Not found' })
    return gist
  })

  app.post('/gists', async (request, reply) => {
    const body = createGistSchema.parse(request.body)
    const gist = inMemoryGists.create({ ...body, author: request.user })
    return reply.status(201).send(gist)
  })

  app.delete('/gists/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const gist = inMemoryGists.findById(id)
    if (!gist) return reply.status(404).send({ error: 'Not found' })
    if (gist.authorId !== request.user.sub) return reply.status(403).send({ error: 'Forbidden' })
    inMemoryGists.delete(id)
    return reply.status(204).send()
  })
}
