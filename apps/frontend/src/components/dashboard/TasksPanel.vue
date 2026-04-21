<script setup lang="ts">
import { ref, computed } from 'vue'
import type { JiraIssue } from '@dashboard/shared'
import { CheckSquare } from 'lucide-vue-next'
import Chip from '@/components/ui/Chip.vue'

const props = defineProps<{
  issues: JiraIssue[]
  loading: boolean
  error: string
}>()

type Status = 'all' | 'todo' | 'in_progress' | 'done'
const activeStatus = ref<Status>('all')

const statusFilters: { value: Status; label: string }[] = [
  { value: 'all',         label: 'Tout' },
  { value: 'todo',        label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'done',        label: 'Terminé' },
]

const statusCounts = computed(() => ({
  all: props.issues.length,
  todo: props.issues.filter((i) => i.statusCategory === 'todo').length,
  in_progress: props.issues.filter((i) => i.statusCategory === 'in_progress').length,
  done: props.issues.filter((i) => i.statusCategory === 'done').length,
}))

const filtered = computed(() =>
  activeStatus.value === 'all'
    ? props.issues
    : props.issues.filter((i) => i.statusCategory === activeStatus.value),
)

function statusChip(cat: string): 'sky' | 'amber' | 'lime' | 'default' {
  return { todo: 'sky', in_progress: 'amber', done: 'lime' }[cat] as any ?? 'default'
}

function priorityColor(p: string) {
  return { High: 'var(--red)', Critical: 'var(--red)', Medium: 'var(--amber)', Low: 'var(--text-faint)' }[p] ?? 'var(--text-faint)'
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return `${Math.floor(diff / 60000)}m`
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}j`
}
</script>

<template>
  <section class="o-card">
    <div class="o-card-head">
      <span class="o-card-title">
        <CheckSquare style="width:14px; height:14px; color:var(--text-mute);" />
        Tasks
        <span class="o-count">{{ statusCounts[activeStatus] }}</span>
      </span>
    </div>

    <!-- Status filter pills -->
    <div style="display:flex; gap:6px; padding:10px var(--pad) 0; flex-wrap:wrap;">
      <button
        v-for="f in statusFilters"
        :key="f.value"
        :style="{
          padding: '3px 9px',
          fontSize: '11.5px',
          borderRadius: '4px',
          border: '1px solid',
          borderColor: activeStatus === f.value ? 'var(--oborder-strong)' : 'var(--oborder)',
          background: activeStatus === f.value ? 'var(--bg-3)' : 'transparent',
          color: activeStatus === f.value ? 'var(--text)' : 'var(--text-mute)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }"
        @click="activeStatus = f.value"
      >
        {{ f.label }}
        <span class="mono" style="font-size:10px; color:var(--text-faint);">{{ statusCounts[f.value] }}</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="o-card-body tight" style="margin-top:8px;">
      <div v-for="i in 5" :key="i" style="height:var(--row-h); border-bottom:1px solid var(--oborder); display:flex; align-items:center; padding:0 var(--pad); gap:12px;">
        <div style="width:6px; height:6px; border-radius:50%; background:var(--bg-2);" />
        <div style="width:60px; height:9px; background:var(--bg-2); border-radius:3px;" />
        <div style="flex:1; height:9px; background:var(--bg-2); border-radius:3px;" />
      </div>
    </div>

    <div v-else-if="error" style="padding:var(--pad); font-size:12.5px; color:var(--red);">{{ error }}</div>

    <div v-else class="o-card-body tight" style="margin-top:8px;">
      <div
        v-for="issue in filtered"
        :key="issue.id"
        class="o-row"
        style="grid-template-columns:6px auto 1fr auto auto;"
      >
        <!-- Priority dot -->
        <span
          style="width:6px; height:6px; border-radius:50%; flex-shrink:0;"
          :style="{ background: priorityColor(issue.priority) }"
        />

        <!-- Key (mono) -->
        <span class="mono" style="font-size:11px; color:var(--text-dim); flex-shrink:0; font-weight:500;">{{ issue.key }}</span>

        <!-- Title -->
        <span style="font-size:var(--fs-md); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ issue.summary }}</span>

        <!-- Time -->
        <span class="mono" style="font-size:11px; color:var(--text-faint);">{{ relativeTime(issue.updatedAt) }}</span>

        <!-- Status chip -->
        <Chip :variant="statusChip(issue.statusCategory)">
          {{ issue.statusCategory === 'in_progress' ? 'in progress' : issue.statusCategory }}
        </Chip>
      </div>

      <div v-if="filtered.length === 0" style="padding:var(--pad); font-size:12.5px; color:var(--text-mute);">
        Aucun ticket dans ce filtre.
      </div>
    </div>
  </section>
</template>
