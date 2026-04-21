<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SonarAnalysis } from '@dashboard/shared'
import { ShieldCheck } from 'lucide-vue-next'
import Chip from '@/components/ui/Chip.vue'

const props = defineProps<{
  analyses: SonarAnalysis[]
  loading: boolean
  error: string
  hasProjects: boolean
}>()

const activeKey = ref<string | null>(null)

const current = computed<SonarAnalysis | null>(() => {
  if (!props.analyses.length) return null
  const key = activeKey.value ?? props.analyses[0].projectKey
  return props.analyses.find((a) => a.projectKey === key) ?? props.analyses[0]
})

function gateChip(gate: string): 'lime' | 'amber' | 'red' {
  return { OK: 'lime', WARN: 'amber', ERROR: 'red' }[gate] as any ?? 'amber'
}

function coverageColor(pct: number) {
  if (pct >= 70) return 'var(--lime)'
  if (pct >= 40) return 'var(--amber)'
  return 'var(--red)'
}

const metrics = computed(() => {
  if (!current.value) return []
  const m = current.value.metrics
  return [
    { label: 'Bugs',           value: m.bugs,           bad: m.bugs > 0,          color: m.bugs > 0 ? 'var(--red)' : 'var(--text)' },
    { label: 'Vulnérabilités', value: m.vulnerabilities, bad: m.vulnerabilities > 0, color: m.vulnerabilities > 0 ? 'var(--red)' : 'var(--text)' },
    { label: 'Code smells',    value: m.codeSmells,     bad: m.codeSmells > 20,   color: m.codeSmells > 20 ? 'var(--amber)' : 'var(--text)' },
    { label: 'Duplications',   value: m.duplications != null ? `${m.duplications.toFixed(1)}%` : '—', bad: (m.duplications ?? 0) > 5, color: (m.duplications ?? 0) > 5 ? 'var(--amber)' : 'var(--text)' },
  ]
})
</script>

<template>
  <section class="o-card">
    <div class="o-card-head">
      <span class="o-card-title">
        <ShieldCheck style="width:14px; height:14px; color:var(--text-mute);" />
        Code quality
        <span class="o-count">{{ analyses.length }}</span>
      </span>
      <div class="o-card-actions">
        <Chip v-if="current" :variant="gateChip(current.qualityGate)">{{ current.qualityGate }}</Chip>
      </div>
    </div>

    <div v-if="loading" style="padding:var(--pad); display:flex; flex-direction:column; gap:10px;">
      <div v-for="i in 3" :key="i" style="height:32px; background:var(--bg-2); border-radius:4px;" />
    </div>

    <div v-else-if="error" style="padding:var(--pad); font-size:12.5px; color:var(--red);">{{ error }}</div>

    <div v-else-if="!hasProjects" style="padding:var(--pad); font-size:12.5px; color:var(--text-mute);">
      Configurez <code class="mono" style="font-size:11.5px; background:var(--bg-2); padding:1px 5px; border-radius:3px; border:1px solid var(--oborder);">VITE_SONAR_PROJECTS</code>
    </div>

    <div v-else class="o-card-body">
      <!-- Project tabs (if multiple) -->
      <div v-if="analyses.length > 1" style="display:flex; gap:4px; margin-bottom:12px; flex-wrap:wrap;">
        <button
          v-for="a in analyses"
          :key="a.projectKey"
          :style="{
            padding: '3px 8px',
            fontSize: '11.5px',
            borderRadius: '4px',
            border: '1px solid',
            borderColor: (activeKey ?? analyses[0].projectKey) === a.projectKey ? 'var(--oborder-strong)' : 'var(--oborder)',
            background: (activeKey ?? analyses[0].projectKey) === a.projectKey ? 'var(--bg-3)' : 'transparent',
            color: (activeKey ?? analyses[0].projectKey) === a.projectKey ? 'var(--text)' : 'var(--text-mute)',
          }"
          @click="activeKey = a.projectKey"
        >
          {{ a.projectName }}
        </button>
      </div>

      <template v-if="current">
        <!-- 4 metric tiles -->
        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:14px;">
          <div
            v-for="m in metrics"
            :key="m.label"
            class="o-metric"
            style="align-items:center; text-align:center;"
          >
            <span class="o-metric-val" :style="{ color: m.color }">{{ m.value }}</span>
            <span class="o-metric-label">{{ m.label }}</span>
          </div>
        </div>

        <!-- Coverage bar -->
        <div v-if="current.metrics.coverage != null" style="margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="font-size:11.5px; color:var(--text-mute);">Couverture</span>
            <span class="mono" style="font-size:11.5px;" :style="{ color: coverageColor(current.metrics.coverage) }">
              {{ current.metrics.coverage.toFixed(1) }}%
            </span>
          </div>
          <div class="o-bar">
            <i :style="{ width: `${current.metrics.coverage}%`, background: coverageColor(current.metrics.coverage) }" />
          </div>
        </div>

        <!-- Duplications bar -->
        <div v-if="current.metrics.duplications != null">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="font-size:11.5px; color:var(--text-mute);">Duplications</span>
            <span class="mono" style="font-size:11.5px; color:var(--text-dim);">
              {{ current.metrics.duplications.toFixed(1) }}%
            </span>
          </div>
          <div class="o-bar">
            <i :style="{ width: `${Math.min(current.metrics.duplications, 100)}%`, background: (current.metrics.duplications ?? 0) > 5 ? 'var(--amber)' : 'var(--lime)' }" />
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
