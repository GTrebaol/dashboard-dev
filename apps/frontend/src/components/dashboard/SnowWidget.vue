<script setup lang="ts">
import type { Mep, MepStatus } from '@dashboard/shared'

defineProps<{
  meps: Mep[]
  loading: boolean
  error: string
}>()

const statusConfig: Record<MepStatus, { label: string; class: string }> = {
  planned: { label: 'Planifiée', class: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  in_progress: { label: 'En cours', class: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' },
  completed: { label: 'Terminée', class: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' },
  cancelled: { label: 'Annulée', class: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
  failed: { label: 'Échouée', class: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' },
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <div class="rounded-lg border bg-card p-5 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="font-semibold text-sm">SnowIT</h2>
        <p class="text-xs text-muted-foreground mt-0.5">MEPs & déploiements</p>
      </div>
      <span class="text-xs text-muted-foreground tabular-nums">{{ meps.length }} MEPs</span>
    </div>

    <div v-if="loading" class="space-y-2.5">
      <div v-for="i in 4" :key="i" class="h-8 bg-muted animate-pulse rounded" />
    </div>
    <div v-else-if="error" class="text-sm text-destructive">{{ error }}</div>
    <ul v-else class="space-y-2 overflow-y-auto max-h-72">
      <li
        v-for="mep in meps"
        :key="mep.id"
        class="flex items-center justify-between gap-2 text-sm"
      >
        <div class="flex items-center gap-2 min-w-0">
          <span :class="['text-xs px-1.5 py-0.5 rounded font-medium shrink-0', statusConfig[mep.status]?.class ?? 'bg-muted text-muted-foreground']">
            {{ statusConfig[mep.status]?.label ?? mep.status }}
          </span>
          <span class="truncate text-sm">{{ mep.title }}</span>
        </div>
        <span class="text-xs text-muted-foreground shrink-0">
          {{ formatDate(mep.plannedStart) }}
        </span>
      </li>
      <li v-if="meps.length === 0" class="text-sm text-muted-foreground">Aucune MEP</li>
    </ul>
  </div>
</template>
