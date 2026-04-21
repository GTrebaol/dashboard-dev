import type { JwtPayload } from '@dashboard/shared'

export interface IAuthProvider {
  login(credentials?: Record<string, string>): Promise<{ token: string; user: JwtPayload }>
  logout(): Promise<void>
  getToken(): string | null
  getUser(): JwtPayload | null
  isAuthenticated(): boolean
}
