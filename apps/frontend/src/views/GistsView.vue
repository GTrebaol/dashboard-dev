<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import type { Gist } from '@dashboard/shared'
import { useAuthStore } from '@/stores/auth'
import { Plus, Search } from 'lucide-vue-next'

const auth = useAuthStore()
const gists = ref<Gist[]>([])
const loading = ref(true)
const searchQuery = ref('')
const selectedTag = ref('')

const allTags = computed(() => {
  const tags = new Set<string>()
  gists.value.forEach((g) => g.tags.forEach((t) => tags.add(t)))
  return Array.from(tags).sort()
})

const filtered = computed(() =>
  gists.value.filter((g) => {
    const matchesSearch =
      !searchQuery.value ||
      g.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      g.author.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesTag = !selectedTag.value || g.tags.includes(selectedTag.value)
    return matchesSearch && matchesTag
  }),
)

onMounted(async () => {
  try {
    const { data } = await axios.get<Gist[]>('/api/gists', {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    gists.value = data
  } finally {
    loading.value = false
  }
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold tracking-tight">Gists</h1>
      <RouterLink
        to="/gists/new"
        class="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <Plus class="h-4 w-4" />
        Nouveau gist
      </RouterLink>
    </div>

    <div class="flex gap-2 flex-wrap items-center">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          v-model="searchQuery"
          placeholder="Rechercher..."
          class="pl-9 pr-3 py-2 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring w-60"
        />
      </div>
      <button
        v-for="tag in allTags"
        :key="tag"
        :class="[
          'px-2.5 py-1 text-xs rounded-full border transition-colors',
          selectedTag === tag
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background hover:bg-accent',
        ]"
        @click="selectedTag = selectedTag === tag ? '' : tag"
      >
        {{ tag }}
      </button>
    </div>

    <div v-if="loading" class="text-sm text-muted-foreground">Chargement...</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink
        v-for="gist in filtered"
        :key="gist.id"
        :to="`/gists/${gist.shareToken}`"
        class="block rounded-lg border bg-card p-4 hover:border-foreground/20 transition-colors space-y-3"
      >
        <div>
          <p class="font-medium text-sm truncate">{{ gist.title }}</p>
          <p v-if="gist.description" class="text-xs text-muted-foreground truncate mt-0.5">
            {{ gist.description }}
          </p>
        </div>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="tag in gist.tags"
            :key="tag"
            class="px-1.5 py-0.5 text-xs rounded bg-secondary text-secondary-foreground"
          >
            {{ tag }}
          </span>
        </div>
        <div class="flex items-center justify-between text-xs text-muted-foreground">
          <span>{{ gist.author.username }}</span>
          <span>{{ formatDate(gist.createdAt) }}</span>
        </div>
      </RouterLink>
      <p v-if="!loading && filtered.length === 0" class="text-sm text-muted-foreground col-span-full">
        Aucun gist trouvé
      </p>
    </div>
  </div>
</template>
