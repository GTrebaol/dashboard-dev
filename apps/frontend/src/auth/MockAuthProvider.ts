import axios from 'axios'
import type { JwtPayload } from '@dashboard/shared'
import type { IAuthProvider } from './IAuthProvider'

const TOKEN_KEY = 'dashboard_token'
const USER_KEY = 'dashboard_user'

// Point de swap : remplacer par CompanyAuthProvider quand la lib interne sera disponible.
export class MockAuthProvider implements IAuthProvider {
  async login(credentials?: Record<string, string>): Promise<{ token: string; user: JwtPayload }> {
    const payload = {
      sub: credentials?.sub ?? 'dev-001',
      username: credentials?.username ?? 'dev.user',
      email: credentials?.email ?? 'dev.user@company.com',
    }
    const { data } = await axios.post<{ token: string }>('/auth/mock-login', payload)
    const user: JwtPayload = { ...payload, ...parseJwt(data.token) }
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return { token: data.token, user }
  }

  async logout(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  getUser(): JwtPayload | null {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as JwtPayload) : null
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false
    try {
      const { exp } = parseJwt(token)
      return exp ? exp * 1000 > Date.now() : true
    } catch {
      return false
    }
  }
}

function parseJwt(token: string): Record<string, unknown> {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(base64)) as Record<string, unknown>
}
