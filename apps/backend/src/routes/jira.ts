import type { FastifyPluginAsync } from 'fastify'
import { JiraConnector } from '../connectors/jira/JiraConnector'
import type { ITokenService } from '../tokens/ITokenService'

export const jiraRoutes = (tokenService: ITokenService): FastifyPluginAsync => async (app) => {
  app.get('/issues', async (request) => {
    const token = await tokenService.getToken(request.user.sub, 'jira')
    const connector = new JiraConnector(process.env.JIRA_BASE_URL!, token)
    return connector.getIssuesForUser(request.user.sub)
  })
}
