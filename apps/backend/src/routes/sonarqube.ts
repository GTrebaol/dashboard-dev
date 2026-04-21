import type { FastifyPluginAsync } from 'fastify'
import { SonarConnector } from '../connectors/sonarqube/SonarConnector'
import type { ITokenService } from '../tokens/ITokenService'

export const sonarRoutes = (tokenService: ITokenService): FastifyPluginAsync => async (app) => {
  app.get('/project/:projectKey', async (request) => {
    const { projectKey } = request.params as { projectKey: string }
    const token = await tokenService.getToken(request.user.sub, 'sonarqube')
    const connector = new SonarConnector(process.env.SONAR_BASE_URL!, token)
    return connector.getProjectAnalysis(projectKey)
  })
}
