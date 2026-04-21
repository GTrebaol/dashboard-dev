<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const form = ref({ sub: 'dev-001', username: 'dev.user', email: 'dev.user@company.com' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await auth.login(form.value)
    router.push('/dashboard')
  } catch {
    error.value = 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="w-full max-w-sm space-y-8 px-4">
      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="h-10 w-10 rounded-xl bg-primary flex items-center justify-center mx-auto">
          <span class="text-sm font-bold text-primary-foreground">D</span>
        </div>
        <h1 class="text-xl font-bold tracking-tight">Dev Dashboard</h1>
        <p class="text-sm text-muted-foreground">Connexion — mode développement</p>
      </div>

      <!-- Card -->
      <div class="rounded-lg border bg-card p-6 shadow-sm space-y-5">
        <form class="space-y-4" @submit.prevent="handleLogin">
          <div class="space-y-1.5">
            <label class="text-sm font-medium">ID employé</label>
            <input
              v-model="form.sub"
              class="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Username</label>
            <input
              v-model="form.username"
              class="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="space-y-1.5">
            <label class="text-sm font-medium">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-2 px-4 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
