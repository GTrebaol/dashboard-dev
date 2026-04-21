<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import axios from 'axios'
import type { Gist } from '@dashboard/shared'
import { useAuthStore } from '@/stores/auth'
import { ArrowLeft, X } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const title = ref('')
const description = ref('')
const content = ref('')
const language = ref('')
const tagInput = ref('')
const tags = ref<string[]>([])
const loading = ref(false)
const error = ref('')

const detectedLanguage = computed(() => {
  if (language.value) return language.value
  const c = content.value
  if (/^\s*def\s+\w+.*:/m.test(c)) return 'python'
  if (/\bfunction\s+\w+\s*\(/.test(c) || /\w+\s*=>\s*/.test(c)) return 'javascript'
  if (/^import\s+.+\s+from\s+['"]/.test(c)) return 'typescript'
  if (/^\s*<[a-z]/.test(c)) return 'html'
  if (/^\s*\{/.test(c)) return 'json'
  return null
})

function addTag() {
  const t = tagInput.value.trim().toLowerCase()
  if (t && !tags.value.includes(t)) tags.value.push(t)
  tagInput.value = ''
}

function removeTag(tag: string) {
  tags.value = tags.value.filter((t) => t !== tag)
}

async function submit() {
  if (!title.value.trim() || !content.value.trim()) {
    error.value = 'Le titre et le contenu sont requis'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const { data } = await axios.post<Gist>(
      '/api/gists',
      {
        title: title.value.trim(),
        description: description.value.trim() || undefined,
        content: content.value,
        language: detectedLanguage.value ?? undefined,
        tags: tags.value,
      },
      { headers: { Authorization: `Bearer ${auth.token}` } },
    )
    router.push(`/gists/${data.shareToken}`)
  } catch {
    error.value = 'Erreur lors de la création'
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl space-y-6">
    <RouterLink
      to="/gists"
      class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft class="h-4 w-4" />
      Retour
    </RouterLink>

    <h1 class="text-xl font-semibold">Nouveau gist</h1>

    <form class="space-y-4" @submit.prevent="submit">
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Titre <span class="text-destructive">*</span></label>
        <input
          v-model="title"
          placeholder="Mon snippet utile"
          class="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div class="space-y-1.5">
        <label class="text-sm font-medium">Description</label>
        <input
          v-model="description"
          placeholder="Description optionnelle"
          class="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium">Contenu <span class="text-destructive">*</span></label>
          <span v-if="detectedLanguage" class="text-xs text-muted-foreground">
            Détecté : {{ detectedLanguage }}
          </span>
        </div>
        <textarea
          v-model="content"
          rows="14"
          placeholder="Collez votre code ici..."
          class="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono resize-y"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-sm font-medium">Langage</label>
          <input
            v-model="language"
            placeholder="typescript, python..."
            class="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium">Tags</label>
          <input
            v-model="tagInput"
            placeholder="Entrée pour ajouter"
            class="w-full px-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            @keydown.enter.prevent="addTag"
          />
        </div>
      </div>

      <div v-if="tags.length" class="flex flex-wrap gap-1">
        <button
          v-for="tag in tags"
          :key="tag"
          type="button"
          class="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-secondary hover:bg-destructive hover:text-destructive-foreground transition-colors"
          @click="removeTag(tag)"
        >
          {{ tag }}
          <X class="h-3 w-3" />
        </button>
      </div>

      <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Création...' : 'Créer le gist' }}
        </button>
        <RouterLink
          to="/gists"
          class="px-4 py-2 text-sm rounded-md border hover:bg-accent transition-colors"
        >
          Annuler
        </RouterLink>
      </div>
    </form>
  </div>
</template>
