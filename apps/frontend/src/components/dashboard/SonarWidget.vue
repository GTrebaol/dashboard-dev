<script setup lang="ts">
import type { SonarAnalysis } from '@dashboard/shared'

defineProps<{
  analyses: SonarAnalysis[]
  loading: boolean
  error: string
  hasProjects: boolean
}>()

const gateStyle: Record<string, string> = {
  OK: 'text-green-700 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-950 dark:border-green-800',
  WARN: 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-950 dark:border-yellow-800',
  ERROR: 'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950 dark:border-red-800',
}
</script>

<template>
  <div class="rounded-lg border bg-card p-5 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="font-semibold text-sm">SonarQube</h2>
        <p class="text-xs text-muted-foreground mt-0.5">Qualité du code</p>
      </div>
      <span class="text-xs text-muted-foreground tabular-nums">{{ analyses.length }} projets</span>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-12 bg-muted animate-pulse rounded" />
    </div>
    <div v-else-if="error" class="text-sm text-destructive">{{ error }}</div>
    <div v-else-if="!hasProjects" class="text-sm text-muted-foreground">
      Configurez <code class="text-xs bg-muted px-1 rounded">VITE_SONAR_PROJECTS</code> pour afficher les analyses.
    </div>
    <ul v-else class="space-y-3 overflow-y-auto max-h-72">
      <li v-for="a in analyses" :key="a.projectKey" class="space-y-1.5">
        <div class="flex items-center justify-between gap-2">
          <span class="text-sm font-medium truncate">{{ a.projectName }}</span>
          <span :class="['text-xs px-1.5 py-0.5 rounded border font-semibold shrink-0', gateStyle[a.qualityGate] ?? '']">
            {{ a.qualityGate }}
          </span>
        </div>
        <div class="flex gap-3 text-xs text-muted-foreground flex-wrap">
          <span>{{ a.metrics.bugs }} bugs</span>
          <span>{{ a.metrics.vulnerabilities }} vulnérabilités</span>
          <span>{{ a.metrics.codeSmells }} smells</span>
          <span v-if="a.metrics.coverage != null">{{ a.metrics.coverage.toFixed(1) }}% couverture</span>
        </div>
      </li>
      <li v-if="analyses.length === 0" class="text-sm text-muted-foreground">Aucune analyse disponible</li>
    </ul>
  </div>
</template>
