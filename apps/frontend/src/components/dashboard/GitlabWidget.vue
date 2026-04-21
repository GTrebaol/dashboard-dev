<script setup lang="ts">
import type { MergeRequest } from '@dashboard/shared'
import { CheckCircle, XCircle, Clock, MinusCircle } from 'lucide-vue-next'

defineProps<{
  mrs: MergeRequest[]
  loading: boolean
  error: string
}>()

const pipelineIcon: Record<string, unknown> = {
  success: CheckCircle,
  failed: XCircle,
  running: Clock,
  pending: Clock,
  canceled: MinusCircle,
  skipped: MinusCircle,
}

const pipelineColor: Record<string, string> = {
  success: 'text-green-500',
  failed: 'text-red-500',
  running: 'text-blue-500',
  pending: 'text-yellow-500',
  canceled: 'text-slate-400',
  skipped: 'text-slate-400',
}

const stateStyle: Record<string, string> = {
  opened: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  merged: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  closed: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
}

const stateLabel: Record<string, string> = {
  opened: 'Ouverte',
  merged: 'Mergée',
  closed: 'Fermée',
}
</script>

<template>
  <div class="rounded-lg border bg-card p-5 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="font-semibold text-sm">GitLab</h2>
        <p class="text-xs text-muted-foreground mt-0.5">Mes merge requests</p>
      </div>
      <span class="text-xs text-muted-foreground tabular-nums">
        {{ mrs.filter(m => m.state === 'opened').length }} ouvertes
      </span>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-10 bg-muted animate-pulse rounded" />
    </div>
    <div v-else-if="error" class="text-sm text-destructive">{{ error }}</div>
    <ul v-else class="space-y-3 overflow-y-auto max-h-72">
      <li v-for="mr in mrs" :key="mr.id">
        <div class="flex items-center gap-2 text-sm">
          <component
            :is="mr.pipeline ? pipelineIcon[mr.pipeline.status] ?? Clock : MinusCircle"
            :class="['h-4 w-4 shrink-0', mr.pipeline ? (pipelineColor[mr.pipeline.status] ?? 'text-slate-400') : 'text-slate-300']"
          />
          <a :href="mr.webUrl" target="_blank" class="hover:underline font-medium truncate flex-1">
            {{ mr.title }}
          </a>
          <span :class="['text-xs px-1.5 py-0.5 rounded font-medium shrink-0', stateStyle[mr.state] ?? 'bg-muted text-muted-foreground']">
            {{ stateLabel[mr.state] ?? mr.state }}
          </span>
        </div>
        <div class="ml-6 text-xs text-muted-foreground mt-0.5">
          {{ mr.projectName }} · {{ mr.sourceBranch }} → {{ mr.targetBranch }}
        </div>
      </li>
      <li v-if="mrs.length === 0" class="text-sm text-muted-foreground">Aucune MR</li>
    </ul>
  </div>
</template>
