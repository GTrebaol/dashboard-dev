import type { JwtPayload } from '@dashboard/shared'

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload
  }
}
