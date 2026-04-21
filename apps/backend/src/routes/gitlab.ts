import type { FastifyPluginAsync } from 'fastify'
import { GitlabConnector } from '../connectors/gitlab/GitlabConnector'
import type { ITokenService } from '../tokens/ITokenService'

export const gitlabRoutes = (tokenService: ITokenService): FastifyPluginAsync => async (app) => {
  app.get('/merge-requests', async (request) => {
    const token = await tokenService.getToken(request.user.sub, 'gitlab')
    const connector = new GitlabConnector(process.env.GITLAB_BASE_URL!, token)
    return connector.getOpenMergeRequests(request.user.username)
  })
}
