import type { ITokenService, ServiceName } from './ITokenService'

// Implémentation dev : lit les tokens depuis les variables d'environnement.
// Remplacer par CompanyTokenService en production.
export class EnvTokenService implements ITokenService {
  async getToken(_userId: string, service: ServiceName): Promise<string> {
    const key = `${service.toUpperCase()}_TOKEN`
    const token = process.env[key]
    if (!token) throw new Error(`Token manquant pour le service "${service}". Configurez ${key} dans .env`)
    return token
  }
}
