import axios from 'axios'
import type { ITokenService, ServiceName } from './ITokenService'

// Point de swap : branche le service centralisé de tokens de l'entreprise.
// Injecter cette implémentation à la place de EnvTokenService en production.
export class CompanyTokenService implements ITokenService {
  private readonly baseUrl: string

  constructor() {
    this.baseUrl = process.env.TOKEN_SERVICE_URL!
    if (!this.baseUrl) throw new Error('TOKEN_SERVICE_URL non configurée')
  }

  async getToken(userId: string, service: ServiceName): Promise<string> {
    const { data } = await axios.get<{ token: string }>(
      `${this.baseUrl}/tokens/${userId}/${service}`,
    )
    return data.token
  }
}
