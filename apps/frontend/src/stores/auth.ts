import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { JwtPayload } from '@dashboard/shared'
import type { IAuthProvider } from '@/auth/IAuthProvider'
import { MockAuthProvider } from '@/auth/MockAuthProvider'

// Swap ici : new MockAuthProvider() → new CompanyAuthProvider()
const authProvider: IAuthProvider = new MockAuthProvider()

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(authProvider.getToken())
  const user = ref<JwtPayload | null>(authProvider.getUser())
  const isAuthenticated = computed(() => authProvider.isAuthenticated())

  async function login(credentials?: Record<string, string>) {
    const result = await authProvider.login(credentials)
    token.value = result.token
    user.value = result.user
  }

  async function logout() {
    await authProvider.logout()
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, login, logout }
})
