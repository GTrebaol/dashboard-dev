<script setup lang="ts">
import type { JiraIssue } from '@dashboard/shared'

defineProps<{
  issues: JiraIssue[]
  loading: boolean
  error: string
}>()

const statusStyle: Record<string, string> = {
  todo: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  done: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
}

const statusLabel: Record<string, string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Terminé',
}
</script>

<template>
  <div class="rounded-lg border bg-card p-5 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="font-semibold text-sm">JIRA</h2>
        <p class="text-xs text-muted-foreground mt-0.5">Mes tickets</p>
      </div>
      <span class="text-xs text-muted-foreground tabular-nums">{{ issues.length }} tickets</span>
    </div>

    <div v-if="loading" class="space-y-2.5">
      <div v-for="i in 3" :key="i" class="h-9 bg-muted animate-pulse rounded" />
    </div>
    <div v-else-if="error" class="text-sm text-destructive">{{ error }}</div>
    <ul v-else class="space-y-2.5 overflow-y-auto max-h-72">
      <li v-for="issue in issues" :key="issue.id" class="flex items-start gap-2.5 text-sm">
        <span
          :class="['px-1.5 py-0.5 rounded text-xs font-medium shrink-0 mt-0.5', statusStyle[issue.statusCategory] ?? 'bg-muted text-muted-foreground']"
        >
          {{ statusLabel[issue.statusCategory] ?? issue.statusCategory }}
        </span>
        <div class="min-w-0">
          <a :href="issue.url" target="_blank" class="hover:underline font-medium truncate block leading-tight">
            {{ issue.key }} — {{ issue.summary }}
          </a>
          <span class="text-xs text-muted-foreground">{{ issue.projectName }}</span>
        </div>
      </li>
      <li v-if="issues.length === 0" class="text-sm text-muted-foreground">Aucun ticket en cours</li>
    </ul>
  </div>
</template>
