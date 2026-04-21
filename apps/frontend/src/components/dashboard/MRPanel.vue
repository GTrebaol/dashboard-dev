<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MergeRequest } from '@dashboard/shared'
import {
  CheckCircle2, XCircle, Clock, MinusCircle,
  ChevronDown, GitMerge, RefreshCw, Eye, ExternalLink,
} from 'lucide-vue-next'
import Chip from '@/components/ui/Chip.vue'
import Seg from '@/components/ui/Seg.vue'

const props = defineProps<{
  mrs: MergeRequest[]
  loading: boolean
  error: string
}>()

type Scope = 'open' | 'all'
const scope = ref<Scope>('open')
const expanded = ref<Set<number>>(new Set())

const scopeOpts = [
  { value: 'open', label: 'Ouvertes' },
  { value: 'all',  label: 'Toutes' },
]

const filtered = computed(() =>
  scope.value === 'open'
    ? props.mrs.filter((m) => m.state === 'opened')
    : props.mrs,
)

function toggle(id: number) {
  if (expanded.value.has(id)) expanded.value.delete(id)
  else expanded.value.add(id)
}

function pipelineChip(status?: string): 'lime' | 'red' | 'sky' | 'amber' | 'default' {
  if (!status) return 'default'
  return { success: 'lime', failed: 'red', running: 'sky', pending: 'amber', canceled: 'default', skipped: 'default' }[status] as any ?? 'default'
}

function pipelineLabel(status?: string) {
  return { success: 'passed', failed: 'failed', running: 'running', pending: 'pending', canceled: 'canceled', skipped: 'skipped' }[status ?? ''] ?? '—'
}

const PipelineIcon: Record<string, any> = {
  success: CheckCircle2,
  failed: XCircle,
  running: Clock,
  pending: Clock,
  canceled: MinusCircle,
  skipped: MinusCircle,
}

function pipelineIconColor(status?: string) {
  return { success: 'var(--lime)', failed: 'var(--red)', running: 'var(--sky)', pending: 'var(--amber)', canceled: 'var(--text-faint)', skipped: 'var(--text-faint)' }[status ?? ''] ?? 'var(--text-faint)'
}

function mrStateChip(state: string): 'sky' | 'lime' | 'red' | 'default' {
  return { opened: 'sky', merged: 'lime', closed: 'red' }[state] as any ?? 'default'
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
        <GitMerge style="width:14px; height:14px; color:var(--text-mute);" />
        Merge requests
        <span class="o-count">{{ filtered.length }}</span>
      </span>
      <div class="o-card-actions">
        <Seg v-model="scope" :options="scopeOpts" />
      </div>
    </div>

    <!-- Loading skeletons -->
    <div v-if="loading" class="o-card-body tight">
      <div v-for="i in 4" :key="i" style="height:var(--row-h); border-bottom:1px solid var(--oborder); display:flex; align-items:center; padding:0 var(--pad); gap:12px;">
        <div style="width:14px; height:14px; border-radius:50%; background:var(--bg-2);" />
        <div style="flex:1; height:10px; background:var(--bg-2); border-radius:3px;" />
        <div style="width:60px; height:10px; background:var(--bg-2); border-radius:3px;" />
      </div>
    </div>

    <div v-else-if="error" style="padding:var(--pad); font-size:12.5px; color:var(--red);">{{ error }}</div>

    <div v-else class="o-card-body tight">
      <template v-for="mr in filtered" :key="mr.id">
        <!-- Main row -->
        <div
          class="o-row"
          style="grid-template-columns:14px 1fr auto auto auto; cursor:pointer;"
          @click="toggle(mr.id)"
        >
          <!-- Pipeline icon -->
          <component
            :is="PipelineIcon[mr.pipeline?.status ?? ''] ?? MinusCircle"
            :style="{ width:'14px', height:'14px', color: pipelineIconColor(mr.pipeline?.status), flexShrink:'0' }"
            :class="mr.pipeline?.status === 'running' ? 'running-dot' : ''"
          />

          <!-- Title + meta -->
          <div style="min-width:0;">
            <div style="display:flex; align-items:center; gap:6px; min-width:0;">
              <span class="mono" style="font-size:11px; color:var(--text-mute); flex-shrink:0;">!{{ mr.iid }}</span>
              <span style="font-size:var(--fs-md); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ mr.title }}</span>
            </div>
            <div class="mono" style="font-size:11px; color:var(--text-faint); margin-top:1px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
              {{ mr.projectName }} {{ mr.sourceBranch }} → {{ mr.targetBranch }}
            </div>
          </div>

          <!-- State chip -->
          <Chip :variant="mrStateChip(mr.state)" style="font-size:10px;">{{ mr.state }}</Chip>

          <!-- Time -->
          <span class="mono" style="font-size:11px; color:var(--text-faint); flex-shrink:0;">{{ relativeTime(mr.updatedAt) }}</span>

          <!-- Chevron -->
          <ChevronDown
            style="width:13px; height:13px; color:var(--text-faint); flex-shrink:0; transition:transform .15s;"
            :style="{ transform: expanded.has(mr.id) ? 'rotate(180deg)' : 'rotate(0deg)' }"
          />
        </div>

        <!-- Expanded detail -->
        <div
          v-if="expanded.has(mr.id)"
          style="padding:12px var(--pad) 14px; border-bottom:1px solid var(--oborder); background:var(--bg-2);"
        >
          <!-- Per-check tiles -->
          <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:12px;">
            <div
              v-for="check in ['CI/CD', 'Code Review', 'Conflicts', 'Approvals']"
              :key="check"
              style="padding:8px 10px; background:var(--bg-1); border:1px solid var(--oborder); border-radius:6px;"
            >
              <div style="font-size:11px; color:var(--text-mute); margin-bottom:3px;">{{ check }}</div>
              <Chip
                :variant="check === 'CI/CD' ? pipelineChip(mr.pipeline?.status) : check === 'Conflicts' ? 'lime' : 'lime'"
                :dot="false"
              >
                {{ check === 'CI/CD' ? pipelineLabel(mr.pipeline?.status) : check === 'Conflicts' ? 'clean' : 'ok' }}
              </Chip>
            </div>
          </div>

          <!-- Actions -->
          <div style="display:flex; gap:6px;">
            <button class="o-btn-accent o-btn" style="font-size:11.5px;">
              <GitMerge style="width:12px; height:12px;" />
              Merge
            </button>
            <button class="o-btn" style="font-size:11.5px;">
              <RefreshCw style="width:12px; height:12px;" />
              Rebase
            </button>
            <button class="o-btn" style="font-size:11.5px; margin-left:auto;">
              <Eye style="width:12px; height:12px;" />
              View diff
            </button>
            <a :href="mr.webUrl" target="_blank" class="o-btn" style="font-size:11.5px;">
              <ExternalLink style="width:12px; height:12px;" />
              GitLab
            </a>
          </div>
        </div>
      </template>

      <div v-if="filtered.length === 0" style="padding:var(--pad); font-size:12.5px; color:var(--text-mute);">
        Aucune merge request.
      </div>
    </div>
  </section>
</template>
