import Fastify from 'fastify'
import cors from '@fastify/cors'
import { MockJwtProvider } from './auth/MockJwtProvider'
import type { IAuthProvider } from './auth/IAuthProvider'
import { EnvTokenService } from './tokens/EnvTokenService'
import { mockRoutes } from './mocks/mockRoutes'

const app = Fastify({ logger: true })
const isMockMode = process.env.MOCK_DATA === 'true'

if (!isMockMode && !process.env.DATABASE_URL) {
  console.error('[ERROR] MOCK_DATA is not "true" and DATABASE_URL is not set. Did you forget --env-file=.env?')
  process.exit(1)
}

// --- Point de swap auth ---
// En production, remplacer MockJwtProvider par CompanyJwtProvider
const authProvider: IAuthProvider = new MockJwtProvider()

// --- Point de swap tokens ---
// En production, remplacer EnvTokenService par CompanyTokenService
const tokenService = new EnvTokenService()

async function bootstrap() {
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  })

  app.decorateRequest('user', null)

  // Route de login mock (dev uniquement)
  if (process.env.NODE_ENV !== 'production') {
    app.post('/auth/mock-login', async (request) => {
      const { sub, username, email } = request.body as Record<string, string>
      const token = (authProvider as MockJwtProvider).sign({ sub, username, email })
      return { token }
    })
  }

  // Routes protégées par JWT
  await app.register(async (api) => {
    api.addHook('preHandler', async (request, reply) => {
      const auth = request.headers.authorization
      if (!auth?.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Unauthorized' })
      }
      try {
        request.user = await authProvider.verify(auth.slice(7))
      } catch {
        return reply.status(401).send({ error: 'Invalid token' })
      }
    })

    if (isMockMode) {
      app.log.info('Mode MOCK activé — aucune DB ni tokens requis')
      await api.register(mockRoutes)
    } else {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      const { gistsRoutes } = await import('./routes/gists')
      const { gitlabRoutes } = await import('./routes/gitlab')
      const { jiraRoutes } = await import('./routes/jira')
      const { sonarRoutes } = await import('./routes/sonarqube')
      const { snowRoutes } = await import('./routes/snow')
      await api.register(gistsRoutes(prisma), { prefix: '/gists' })
      await api.register(gitlabRoutes(tokenService), { prefix: '/gitlab' })
      await api.register(jiraRoutes(tokenService), { prefix: '/jira' })
      await api.register(sonarRoutes(tokenService), { prefix: '/sonar' })
      await api.register(snowRoutes(tokenService), { prefix: '/snow' })
    }
  }, { prefix: '/api' })

  await app.listen({ port: Number(process.env.PORT ?? 3000), host: '0.0.0.0' })
}

bootstrap().catch((err) => {
  app.log.error(err)
  process.exit(1)
})
