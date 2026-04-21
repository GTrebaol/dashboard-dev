<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDashboardData } from '@/composables/useDashboardData'
import { useTweaks } from '@/composables/useTweaks'
import KpiStrip from '@/components/dashboard/KpiStrip.vue'
import MRPanel from '@/components/dashboard/MRPanel.vue'
import TasksPanel from '@/components/dashboard/TasksPanel.vue'
import QualityPanel from '@/components/dashboard/QualityPanel.vue'
import PanelWrap from '@/components/ui/PanelWrap.vue'

const {
  issues, mrs, analyses,
  loadingIssues, loadingMrs, loadingAnalyses,
  errorIssues, errorMrs, errorAnalyses,
  stats, hasSonarProjects,
} = useDashboardData()

const tweaks = useTweaks()

// ── Drag & drop ──────────────────────────────────────────────────────────────
type PanelId = 'mrs' | 'tasks' | 'quality'

const mainOrder = ref<PanelId[]>(['mrs'])
const sideOrder = ref<PanelId[]>(['tasks', 'quality'])

function handleSwap(from: string, to: string) {
  const f = from as PanelId
  const t = to as PanelId

  // Find which column each panel lives in
  const findIn = (id: PanelId) => {
    if (mainOrder.value.includes(id)) return mainOrder
    if (sideOrder.value.includes(id)) return sideOrder
    return null
  }

  const fromOrder = findIn(f)
  const toOrder   = findIn(t)
  if (!fromOrder || !toOrder) return

  if (fromOrder === toOrder) {
    // Same column → swap positions
    const next = [...fromOrder.value]
    const a = next.indexOf(f)
    const b = next.indexOf(t)
    next[a] = t
    next[b] = f
    fromOrder.value = next
  } else {
    // Different columns → replace each panel with the other
    fromOrder.value = fromOrder.value.map(id => id === f ? t : id)
    toOrder.value   = toOrder.value.map(id => id === t ? f : id)
  }
}

// ── Layout grid ───────────────────────────────────────────────────────────────
const gridStyle = computed(() => {
  if (tweaks.layout === 'stack') return 'display:flex; flex-direction:column; gap:var(--gap);'
  if (tweaks.layout === '3col')  return 'display:grid; grid-template-columns:repeat(3,1fr); gap:var(--gap); align-items:start;'
  return 'display:grid; grid-template-columns:1.6fr 1fr; gap:var(--gap); align-items:start;'
})

// ── Visible panels per column (respects tweaks.panels + order) ────────────────
const visibleMain = computed(() =>
  mainOrder.value.filter((id) => tweaks.panels[id])
)
const visibleSide = computed(() =>
  sideOrder.value.filter((id) => tweaks.panels[id])
)
</script>

<template>
  <!-- KPI strip — full width, always shown -->
  <KpiStrip
    :stats="stats"
    :loading="loadingIssues || loadingMrs || loadingAnalyses"
  />

  <!-- Panel grid -->
  <div :style="gridStyle">

    <!-- Main column (or single column in stack mode) -->
    <div style="display:flex; flex-direction:column; gap:var(--gap); min-width:0;">
      <template v-for="id in visibleMain" :key="id">
        <PanelWrap :panel-id="id" @swap="handleSwap">
          <MRPanel      v-if="id === 'mrs'"     :mrs="mrs"           :loading="loadingMrs"      :error="errorMrs" />
          <TasksPanel   v-if="id === 'tasks'"   :issues="issues"     :loading="loadingIssues"   :error="errorIssues" />
          <QualityPanel v-if="id === 'quality'" :analyses="analyses" :loading="loadingAnalyses" :error="errorAnalyses" :has-projects="hasSonarProjects" />
        </PanelWrap>
      </template>

      <!-- In stack mode, side panels flow into the same column -->
      <template v-if="tweaks.layout === 'stack'" v-for="id in visibleSide" :key="'s-' + id">
        <PanelWrap :panel-id="id" @swap="handleSwap">
          <MRPanel      v-if="id === 'mrs'"     :mrs="mrs"           :loading="loadingMrs"      :error="errorMrs" />
          <TasksPanel   v-if="id === 'tasks'"   :issues="issues"     :loading="loadingIssues"   :error="errorIssues" />
          <QualityPanel v-if="id === 'quality'" :analyses="analyses" :loading="loadingAnalyses" :error="errorAnalyses" :has-projects="hasSonarProjects" />
        </PanelWrap>
      </template>
    </div>

    <!-- Side column (focus and 3-col modes) -->
    <div
      v-if="tweaks.layout !== 'stack'"
      style="display:flex; flex-direction:column; gap:var(--gap); min-width:0;"
    >
      <template v-for="id in visibleSide" :key="id">
        <PanelWrap :panel-id="id" @swap="handleSwap">
          <MRPanel      v-if="id === 'mrs'"     :mrs="mrs"           :loading="loadingMrs"      :error="errorMrs" />
          <TasksPanel   v-if="id === 'tasks'"   :issues="issues"     :loading="loadingIssues"   :error="errorIssues" />
          <QualityPanel v-if="id === 'quality'" :analyses="analyses" :loading="loadingAnalyses" :error="errorAnalyses" :has-projects="hasSonarProjects" />
        </PanelWrap>
      </template>
    </div>

    <!-- 3-col: third column placeholder (future panels) -->
    <div
      v-if="tweaks.layout === '3col'"
      style="display:flex; flex-direction:column; gap:var(--gap); min-width:0;"
    />
  </div>
</template>
