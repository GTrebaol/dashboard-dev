import type { JwtPayload } from '@dashboard/shared'

export interface IAuthProvider {
  verify(token: string): Promise<JwtPayload>
}
