import type { FastifyPluginAsync } from 'fastify'
import { SnowConnector } from '../connectors/snow/SnowConnector'
import type { ITokenService } from '../tokens/ITokenService'

export const snowRoutes = (tokenService: ITokenService): FastifyPluginAsync => async (app) => {
  app.get('/meps', async (request) => {
    const token = await tokenService.getToken(request.user.sub, 'snow')
    const connector = new SnowConnector(process.env.SNOW_BASE_URL!, token)
    return connector.getMeps()
  })
}
