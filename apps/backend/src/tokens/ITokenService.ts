export type ServiceName = 'gitlab' | 'sonarqube' | 'jira' | 'snow'

export interface ITokenService {
  getToken(userId: string, service: ServiceName): Promise<string>
}
