<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import axios from 'axios'
import type { Gist } from '@dashboard/shared'
import { useAuthStore } from '@/stores/auth'
import { ArrowLeft, Copy, Check } from 'lucide-vue-next'

const route = useRoute()
const auth = useAuthStore()
const gist = ref<Gist | null>(null)
const loading = ref(true)
const copied = ref(false)

onMounted(async () => {
  try {
    const { data } = await axios.get<Gist>(`/api/gists/${route.params.shareToken}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    gist.value = data
  } finally {
    loading.value = false
  }
})

async function copyLink() {
  await navigator.clipboard.writeText(window.location.href)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="max-w-4xl space-y-6">
    <RouterLink
      to="/gists"
      class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft class="h-4 w-4" />
      Retour
    </RouterLink>

    <div v-if="loading" class="text-sm text-muted-foreground">Chargement...</div>

    <template v-else-if="gist">
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-1 min-w-0">
          <h1 class="text-xl font-semibold truncate">{{ gist.title }}</h1>
          <p v-if="gist.description" class="text-sm text-muted-foreground">{{ gist.description }}</p>
          <div class="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span>{{ gist.author.username }}</span>
            <span>·</span>
            <span>{{ formatDate(gist.createdAt) }}</span>
            <span v-if="gist.language">· {{ gist.language }}</span>
          </div>
        </div>
        <button
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border hover:bg-accent transition-colors shrink-0"
          @click="copyLink"
        >
          <component :is="copied ? Check : Copy" class="h-3.5 w-3.5" />
          {{ copied ? 'Copié !' : 'Copier le lien' }}
        </button>
      </div>

      <div v-if="gist.tags.length" class="flex flex-wrap gap-1">
        <span
          v-for="tag in gist.tags"
          :key="tag"
          class="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
        >
          {{ tag }}
        </span>
      </div>

      <div class="rounded-lg border overflow-hidden">
        <div class="flex items-center px-4 py-2 border-b bg-muted/40">
          <span class="text-xs text-muted-foreground font-mono">{{ gist.language ?? 'plaintext' }}</span>
        </div>
        <pre class="p-4 overflow-x-auto text-sm font-mono leading-relaxed bg-card"><code>{{ gist.content }}</code></pre>
      </div>
    </template>

    <div v-else class="text-sm text-muted-foreground">Gist introuvable.</div>
  </div>
</template>
