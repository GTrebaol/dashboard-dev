import jwt from 'jsonwebtoken'
import type { JwtPayload } from '@dashboard/shared'
import type { IAuthProvider } from './IAuthProvider'

const SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me'

export class MockJwtProvider implements IAuthProvider {
  verify(token: string): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, SECRET, (err, decoded) => {
        if (err || !decoded) return reject(new Error('Invalid token'))
        resolve(decoded as JwtPayload)
      })
    })
  }

  // Uniquement disponible en dev via la route /auth/mock-login
  sign(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, SECRET, { expiresIn: '8h' })
  }
}
